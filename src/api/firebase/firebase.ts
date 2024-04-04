import { AuthData, IFirebase, SignInRequestBody, SignUpRequestBody } from ".";
import { APP_PREFIX, WithId, type Filter } from "../expenses.types";
import { API_KEY, DB_URL } from "./config";

class Firebase<T> implements IFirebase<T> {
  private static instance: Firebase<any> | null = null;

  authData: AuthData = {
    localId: "",
    idToken: "",
    expiresIn: "0",
    refreshToken: "",
  };

  constructor(private appPrefix: string = APP_PREFIX) {}

  public static getInstance<T>(): Firebase<T> {
    return Firebase.instance || new Firebase<T>();
  }

  private setAuthData(authData: AuthData) {
    this.authData = authData;
    if (authData.refreshToken) {
      setTimeout(() => this.renewAuth(this.authData.refreshToken), 1000 * Number(this.authData.expiresIn) * 0.95);
      return this.authData;
    }
    return null;
  }

  /**
   * Sign in the user using the provided email and password.
   *
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-sign-in-email-password
   *
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @return {Promise<void>} A promise that resolves when the sign-in operation is complete
   */
  public async signIn(email: string, password: string): Promise<AuthData | null> {
    const body: SignInRequestBody = {
      email,
      password,
      returnSecureToken: true,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      requestOptions,
    );
    if (response.status === 200) {
      const authData = await response.json();
      return this.setAuthData({ ...authData });
    }
    return null;
  }

  /**
   * Sign up the user using the provided email and password.
   *
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-create-email-password
   *
   * @param {string} email - the email for signing up
   * @param {string} password - the password for signing up
   * @return {Promise<void>} a promise that resolves when the sign up process is complete
   */
  public async signUp(email: string, password: string): Promise<AuthData | null> {
    const body: SignUpRequestBody = {
      email,
      password,
      returnSecureToken: true,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      requestOptions,
    );

    if (response.status === 200) {
      const authData = await response.json();
      return this.setAuthData({ ...authData });
    }
    return null;
  }

  /**
   * Renews the authentication using the provided refresh token.
   *
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-refresh-token
   *
   * @param {string} refresh_token - the refresh token used to renew the authentication
   * @return {Promise<void>} a Promise that resolves when the authentication is renewed
   */
  public async renewAuth(refresh_token: string): Promise<AuthData | null> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token,
        grant_type: "refresh_token",
      }),
    };

    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, requestOptions);
    if (response.status === 200) {
      const authData = await response.json();
      this.authData.expiresIn = authData.expires_in;
      this.authData.refreshToken = authData.refresh_token;
      this.authData.idToken = authData.id_token;
      this.authData.localId = authData.user_id;

      this.setAuthData({ ...this.authData });
      return { ...this.authData };
    }
    return null;
  }

  async signOut(): Promise<void> {
    this.authData = {
      localId: "",
      idToken: "",
      expiresIn: "0",
      refreshToken: "",
    };
  }

  /**
   * Retrieves user data from the server using a POST request with the provided idToken.
   *
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-get-account-info
   *
   * @return {Promise<void>} A Promise that resolves when the user data is successfully retrieved.
   */
  public async getUserData(): Promise<{ [key: string]: string } | null> {
    if (this.authData.idToken) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: this.authData.idToken,
          returnSecureToken: true,
        }),
      };

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
        requestOptions,
      );
      if (response.status === 200) {
        const user = await response.json();
        return user;
      }
    }
    return null;
  }

  /**
   * Recovers password
   *
   * @param {string} email - the email address for password recovery
   * @return {Promise<void>} a promise that resolves with void
   */
  // eslint-disable-next-line class-methods-use-this
  public async resetPassword(email: string): Promise<string | null> {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        requestType: "PASSWORD_RESET",
      }),
    };
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      requestOptions,
    );

    if (response.status === 200) {
      const result = await response.json();
      return result.email;
    }
    return null;
  }

  async create(entity: string, data: T): Promise<string | undefined> {
    const raw = JSON.stringify(data);

    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    const response = await fetch(
      `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}.json?auth=${this.authData.idToken}`,
      requestOptions,
    );
    const result = await response.json();
    return result.name;
  }

  async read(entity: string, filter: Partial<Filter>): Promise<any[] | {}> {
    const requestOptions = {
      method: "GET",
    };

    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    const params: { [key: string]: any } = {
      auth: this.authData.idToken,
    };
    if (filter.dateFrom) params.startAt = filter.dateFrom;
    if (filter.dateTo) params.endAt = filter.dateTo;
    if (filter.dateFrom || filter.dateTo) params.orderBy = '"creationDate"';

    const searchparams = new URLSearchParams(params);

    const response = await fetch(
      `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}.json?${searchparams.toString()}`,
      requestOptions,
    );
    if (response.status !== 200) return [];

    const allItems = await response.json();
    return allItems;
  }

  async update(entity: string, item: WithId<T>): Promise<WithId<T> | undefined> {
    if (item.id === undefined) return undefined;
    const { id } = item;

    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    };

    const response = await fetch(
      `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}/${id}.json?auth=${this.authData.idToken}`,
      requestOptions,
    );
    const result = await response.json();
    return result as WithId<T>;
  }

  async delete(entity: string, id: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
    };

    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    await fetch(
      `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}/${id}.json?auth=${this.authData.idToken}`,
      requestOptions,
    );
    return undefined;
  }
}

export default Firebase.getInstance();
