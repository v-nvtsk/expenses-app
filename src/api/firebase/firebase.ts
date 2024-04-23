import { AuthData, AuthRequestBody, FetchOptions, IFirebase } from ".";
import { createFetchOptions } from "../../helpers/fetch/fetch-options";
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
    if (!authData.refreshToken) return null;
    setTimeout(() => this.renewAuth(), 1000 * Number(this.authData.expiresIn) * 0.95);
    return this.authData;
  }

  private async auth(action: "signin" | "signup", email: string, password: string): Promise<AuthData | null> {
    const body: AuthRequestBody = {
      email,
      password,
      returnSecureToken: true,
    };
    const requestOptions = createFetchOptions("POST", null, body);

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${
      action === "signin" ? "signInWithPassword" : "signUp"
    }?key=${API_KEY}`;

    const response = await fetch(url, requestOptions);
    if (!response.ok) return null;
    const authData = await response.json();
    return this.setAuthData({ ...authData });
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
  public async renewAuth(refresh_token?: string): Promise<AuthData | null> {
    const requestOptions = createFetchOptions("POST", null, {
      refresh_token: refresh_token || this.authData.refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, requestOptions);
    if (response.ok) {
      const authData = await response.json();
      return this.setAuthData({
        expiresIn: authData.expires_in,
        refreshToken: authData.refresh_token,
        idToken: authData.id_token,
        localId: authData.user_id,
      });
    }
    this.signOut();
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
   * https://firebase.google.com/docs/reference/rest/auth?hl=en#section-get-account-info
   */
  public async getUserData(): Promise<{ [key: string]: string } | null> {
    if (!this.authData.idToken) return null;
    const requestOptions = createFetchOptions("POST", null, {
      idToken: this.authData.idToken,
      returnSecureToken: true,
    });

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      requestOptions,
    );
    if (!response.ok) return null;
    const user = await response.json();
    return user;
  }

  // eslint-disable-next-line class-methods-use-this
  public async resetPassword(email: string): Promise<string | null> {
    const requestOptions = createFetchOptions("POST", null, {
      email,
      requestType: "PASSWORD_RESET",
    });
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      requestOptions,
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result.email;
  }

  private async fetchEntity(entity: string, options?: FetchOptions<T>, id?: string) {
    if (!this.authData.idToken || !this.authData.localId) return Promise.reject(new Error("not authenticated"));

    const requestOptions = createFetchOptions(options?.method, null, options?.data);

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
      if (await this.renewAuth()) {
        response = await fetch(url, requestOptions);
      } else {
        this.signOut();
        return undefined;
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
