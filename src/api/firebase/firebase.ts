import { AuthData, AuthRequestBody, IFirebase } from ".";
import { APP_PREFIX, WithId, type Filter } from "../expenses.types";
import { API_KEY, DB_URL } from "./config";

type FetchOptions<T> = {
  method?: string;
  data?: T;
  params?: { [key: string]: number | string };
};

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

  private async auth(action: "signin" | "signup", email: string, password: string): Promise<AuthData | null> {
    const body: AuthRequestBody = {
      email,
      password,
      returnSecureToken: true,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${
      action === "signin" ? "signInWithPassword" : "signUp"
    }?key=${API_KEY}`;

    const response = await fetch(url, requestOptions);
    if (response.ok) {
      const authData = await response.json();
      return this.setAuthData({ ...authData });
    }
    return null;
  }

  /**
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-sign-in-email-password
   */
  public async signIn(email: string, password: string): Promise<AuthData | null> {
    const result = await this.auth("signin", email, password);
    return result;
  }

  /**
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-create-email-password
   */
  public async signUp(email: string, password: string): Promise<AuthData | null> {
    const result = await this.auth("signup", email, password);
    return result;
  }

  /**
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-refresh-token
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
    if (response.ok) {
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
    if (!this.authData.idToken) return null;
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
    if (response.ok) {
      const user = await response.json();
      return user;
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

    if (response.ok) {
      const result = await response.json();
      return result.email;
    }
    return null;
  }

  private async fetchEntity(entity: string, options?: FetchOptions<T>, id?: string) {
    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    let requestOptions = {};
    if (options) {
      const raw = JSON.stringify(options.data);
      requestOptions = {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: raw,
      };
    }

    const params: { [key: string]: any } = {
      auth: this.authData.idToken,
      ...options?.params,
    };
    const searchparams = new URLSearchParams(params).toString();
    const url = id
      ? `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}/${id}.json?${searchparams}`
      : `${DB_URL}/${this.appPrefix}/${this.authData.localId}/${entity}.json?${searchparams}`;
    let response = await fetch(url, requestOptions);
    if (!response.ok && response.status === 401) {
      if (await this.renewAuth(this.authData.refreshToken)) {
        response = await fetch(url, requestOptions);
      }
    }
    if (response.ok) return response.json();
    return undefined;
  }

  async create(entity: string, data: T): Promise<string | undefined> {
    const result = await this.fetchEntity(entity, { data, method: "POST" });
    if (result) return result.name;

    return undefined;
  }

  async read(entity: string, filter: Partial<Filter>): Promise<any[] | {}> {
    const params: { [key: string]: any } = {};
    if (filter.dateFrom) params.startAt = filter.dateFrom;
    if (filter.dateTo) params.endAt = filter.dateTo;
    if (filter.dateFrom || filter.dateTo) params.orderBy = '"creationDate"';
    const allItems = await this.fetchEntity(entity, { method: "GET", params });

    if (allItems) return allItems;
    return {};
  }

  async update(entity: string, item: WithId<T>): Promise<WithId<T> | undefined> {
    if (item?.id === undefined) return undefined;
    const { id } = item;

    const result = await this.fetchEntity(entity, { method: "PATCH", data: item }, id);
    return result as WithId<T>;
  }

  async delete(entity: string, id: string): Promise<void> {
    await this.fetchEntity(entity, { method: "DELETE" }, id);
  }
}

export default Firebase.getInstance();
