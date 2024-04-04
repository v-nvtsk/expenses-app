import { APP_PREFIX } from "../expenses.types";
import { API_KEY, DB_URL } from "./config";
import Firebase from "./firebase";

export interface TodoItem {
  id?: string;
  creationDate: number;
  status: boolean;
  taskTitle: string;
  description: string;
  startDate: number;
  endDate?: number;
  duration?: number;
  tags: string;

  type?: "task" | "event";

  location?: string;
  isRepeating?: boolean;
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
}

export type UpdateTodoItem = {
  id: string;
} & Omit<Partial<TodoItem>, "id">;

describe("firebase", () => {
  const USER_PREFIX = "test@test.test";
  const entity = "entity";

  const fireStore = Firebase;

  const testTodoItem: TodoItem = {
    taskTitle: "test",
    description: "test",
    status: false,
    tags: "tag1, tag2",
    creationDate: new Date().valueOf(),
    startDate: new Date().valueOf(),
    endDate: new Date().valueOf(),
    id: "testTodoItem_id",
  };

  const testAuthData = {
    localId: "test_local_id",
    idToken: "test_token",
    refreshToken: "test_refresh_token",
    expiresIn: 3600,
  };

  const USER_PASSWORD = "123456";

  const postOptions = (body: { [name: string]: any }) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const authFetchArgs = {
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    options: postOptions({
      email: USER_PREFIX,
      password: USER_PASSWORD,
      returnSecureToken: true,
    }),
  };

  const mockAuthFetch200 = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(testAuthData),
  });

  const mockAuthFetch400 = jest.fn().mockResolvedValue({
    ok: false,
    status: 401,
  });

  beforeEach(() => {
    global.fetch = mockAuthFetch200;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should have public methods", () => {
    expect(fireStore.signIn).toBeInstanceOf(Function);
    expect(fireStore.signUp).toBeInstanceOf(Function);
    expect(fireStore.renewAuth).toBeInstanceOf(Function);
    expect(fireStore.create).toBeInstanceOf(Function);
    expect(fireStore.read).toBeInstanceOf(Function);
    expect(fireStore.update).toBeInstanceOf(Function);
    expect(fireStore.delete).toBeInstanceOf(Function);
  });

  describe("auth", () => {
    afterEach(() => {
      fireStore.signOut();
    });

    describe("signUp", () => {
      it("should signUp new user", async () => {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
        const options = { ...authFetchArgs.options };

        await fireStore.signUp(USER_PREFIX, USER_PASSWORD);
        expect(global.fetch).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(url, options);
      });
      it("should return null if request fails", async () => {
        global.fetch = mockAuthFetch400;
        expect(await fireStore.signUp(USER_PREFIX, USER_PASSWORD)).toBeNull();
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it("should authenticate", async () => {
      await fireStore.signIn(USER_PREFIX, USER_PASSWORD);
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(authFetchArgs.url, authFetchArgs.options);
    });

    it("should not authenticate", async () => {
      global.fetch = mockAuthFetch400;

      expect(await fireStore.signIn(USER_PREFIX, USER_PASSWORD)).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(authFetchArgs.url, authFetchArgs.options);
    });

    describe("renew auth", () => {
      it("should renew auth by timer", async () => {
        jest.useFakeTimers();
        const renewUrl = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
        const renewOptions = postOptions({
          refresh_token: testAuthData.refreshToken,
          grant_type: "refresh_token",
        });
        await fireStore.signIn(USER_PREFIX, USER_PASSWORD);
        expect(global.fetch).toHaveBeenLastCalledWith(authFetchArgs.url, authFetchArgs.options);
        expect(global.fetch).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1000 * 3600 * 0.95);
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenLastCalledWith(renewUrl, renewOptions);
        jest.useRealTimers();
      });
      it("should return null if request fails", async () => {
        await fireStore.signIn(USER_PREFIX, USER_PASSWORD);
        global.fetch = mockAuthFetch400;
        expect(await fireStore.renewAuth(testAuthData.refreshToken)).toBeNull();
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it("should signOut", async () => {
      await fireStore.signOut();
      expect.assertions(2);
      try {
        await fireStore.read(entity, {});
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty("message", "not authenticated");
      }
    });

    describe("get user data", () => {
      it("should get user data if user is authenticated", async () => {
        await fireStore.signIn(USER_PREFIX, USER_PASSWORD);
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;
        const options = postOptions({
          idToken: testAuthData.idToken,
          returnSecureToken: true,
        });
        await fireStore.getUserData();
        expect(global.fetch).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith(url, options);
      });

      it("should return null if request fails", async () => {
        await fireStore.signIn(USER_PREFIX, USER_PASSWORD);
        global.fetch = mockAuthFetch400;
        expect(await fireStore.getUserData()).toBeNull();
        expect(global.fetch).toHaveBeenCalled();
      });

      it("should return null if user is not authenticated", async () => {
        await fireStore.signOut();
        expect(await fireStore.getUserData()).toBeNull();
      });
    });

    describe("Reset password", () => {
      it("should reset password if user exists", async () => {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
        const options = postOptions({
          email: USER_PREFIX,
          requestType: "PASSWORD_RESET",
        });

        await fireStore.resetPassword(USER_PREFIX);
        expect(global.fetch).toHaveBeenLastCalledWith(url, options);
      });

      it("should return null if no user exists", async () => {
        global.fetch = mockAuthFetch400;
        expect(await fireStore.resetPassword(USER_PREFIX)).toBeNull();
      });
    });
  });

  describe("CRUD", () => {
    beforeEach(async () => {
      global.fetch = mockAuthFetch200;
      const result = await fireStore.signIn("USER_PREFIX", "USER_PASSWORD");
      return result;
    });

    describe("should reject if not authenticated", () => {
      beforeEach(async () => {
        await fireStore.signOut();
      });

      it("create", async () => {
        expect.assertions(2);
        try {
          await fireStore.create(entity, testTodoItem);
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e).toHaveProperty("message", "not authenticated");
        }
      });
      it("read", async () => {
        expect.assertions(2);
        try {
          await fireStore.read(entity, {});
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e).toHaveProperty("message", "not authenticated");
        }
      });
      it("update", async () => {
        expect.assertions(2);
        try {
          await fireStore.update(entity, testTodoItem as UpdateTodoItem);
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e).toHaveProperty("message", "not authenticated");
        }
      });
      it("delete", async () => {
        expect.assertions(2);
        try {
          await fireStore.delete(entity, "32423");
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e).toHaveProperty("message", "not authenticated");
        }
      });
    });

    it("should create", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ name: testTodoItem.id }),
      });

      const url = `${DB_URL}/${APP_PREFIX}/${testAuthData.localId}/${entity}.json?auth=${testAuthData.idToken}`;
      const options = postOptions(testTodoItem);
      await fireStore.create(entity, testTodoItem);
      expect(global.fetch).toHaveBeenLastCalledWith(url, options);
    });

    it("should read", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ some_name: testTodoItem }),
      });
      await fireStore.create(entity, testTodoItem);

      expect(await fireStore.read(entity, {})).toMatchObject({ some_name: testTodoItem });
    });

    it("should request filtered by date on read", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ some_name: testTodoItem }),
      });

      const params: { [key: string]: any } = {
        startAt: new Date(2024, 0, 1).getTime(),
        orderBy: '"creationDate"',
      };

      const searchparams = new URLSearchParams(params);

      const url = `${DB_URL}/${APP_PREFIX}/${testAuthData.localId}/${entity}.json?auth=${testAuthData.idToken}&${searchparams.toString()}`;
      const getOptions = {
        method: "GET",
      };

      await fireStore.read(entity, { dateFrom: new Date(2024, 0, 1).getTime() });
      expect(global.fetch).toHaveBeenLastCalledWith(url, expect.objectContaining(getOptions));

      const params2: { [key: string]: any } = {
        startAt: new Date(2024, 0, 1).getTime(),
        endAt: new Date(2025, 0, 1).getTime(),
        orderBy: '"creationDate"',
      };

      const searchparams2 = new URLSearchParams(params2);
      const url2 = `${DB_URL}/${APP_PREFIX}/${testAuthData.localId}/${entity}.json?auth=${testAuthData.idToken}&${searchparams2.toString()}`;

      await fireStore.read(entity, {
        dateFrom: new Date(2024, 0, 1).getTime(),
        dateTo: new Date(2025, 0, 1).getTime(),
      });
      expect(global.fetch).toHaveBeenLastCalledWith(url2, expect.objectContaining(getOptions));
    });

    it("should return empty object on error", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
      });
      expect(
        await fireStore.read(entity, {
          dateFrom: new Date(2025, 2, 1).valueOf(),
          dateTo: new Date(2026, 4, 1).valueOf(),
        }),
      ).toEqual({});
    });

    it("should update", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ some_name: testTodoItem }),
      });

      fireStore.create(entity, testTodoItem);

      const testTodoItem2 = { ...testTodoItem, taskTitle: "test2" };

      const url = `${DB_URL}/${APP_PREFIX}/${testAuthData.localId}/${entity}/${testTodoItem.id}.json?auth=${testAuthData.idToken}`;
      const updateOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testTodoItem2),
      };

      await fireStore.update(entity, testTodoItem2 as UpdateTodoItem);
      expect(global.fetch).toHaveBeenLastCalledWith(url, updateOptions);
    });

    it("should not update without id", async () => {
      expect(await fireStore.update(entity, {} as UpdateTodoItem)).toBe(undefined);
    });

    it("should delete", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({ some_name: testTodoItem }),
      });

      const url = `${DB_URL}/${APP_PREFIX}/${testAuthData.localId}/${entity}/${testTodoItem.id}.json?auth=${testAuthData.idToken}`;
      const updateOptions = {
        method: "DELETE",
      };

      await fireStore.delete(entity, testTodoItem.id!);
      expect(global.fetch).toHaveBeenLastCalledWith(url, expect.objectContaining(updateOptions));
    });
  });
});
