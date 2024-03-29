import { store } from ".";
import { APP_PREFIX } from "../api/expenses-api";
import { AuthData } from "../api/firebase";
import firebase from "../api/firebase/firebase";
import { checkAuth, resetPassword, signIn, signOut, signUp } from "./authSlice";

jest.mock("../api/firebase/firebase.ts");

describe("Auth", () => {
  const testAuthData: AuthData = {
    localId: "test_local_id",
    idToken: "test_token",
    refreshToken: "test_refresh_token",
    expiresIn: "3600",
  };

  jest.spyOn(firebase, "signIn").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "signUp").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "signOut");
  jest.spyOn(firebase, "renewAuth").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "resetPassword").mockResolvedValue("test_email");

  afterEach(async () => {
    jest.clearAllMocks();
    localStorage.clear();
    await store.dispatch(signOut());
  });

  describe("signIn", () => {
    it("should call Firebase signIn", async () => {
      expect(store.getState().auth.isAuthenticated).toBeFalsy();

      await store.dispatch(signIn({ email: "test", password: "test" }));
      expect(firebase.signIn).toHaveBeenCalled();
      expect(store.getState().auth.isAuthenticated).toBeTruthy();
    });

    it("should set errorState if signIn fails", async () => {
      jest.spyOn(firebase, "signIn").mockResolvedValue(null);
      await store.dispatch(signIn({ email: "test", password: "test" }));
      expect(store.getState().auth.errorState).toEqual("User not found");
    });
  });

  describe("signUp", () => {
    it("should call Firebase signUp", async () => {
      expect(store.getState().auth.isAuthenticated).toBeFalsy();

      await store.dispatch(signUp({ email: "test", password: "test" }));
      expect(firebase.signUp).toHaveBeenCalled();
      expect(store.getState().auth.isAuthenticated).toBeTruthy();
    });

    it("should set errorState if signUp fails", async () => {
      jest.spyOn(firebase, "signUp").mockResolvedValue(null);
      await store.dispatch(signUp({ email: "test", password: "test" }));
      expect(store.getState().auth.errorState).toEqual("User not registered");
    });
  });

  describe("signOut", () => {
    beforeEach(async () => {
      jest.spyOn(firebase, "signIn").mockResolvedValue(testAuthData);
      await store.dispatch(signIn({ email: "test", password: "test" }));
      expect(store.getState().auth.isAuthenticated).toBeTruthy();
      localStorage.setItem(`${APP_PREFIX}@token`, "test-refresh-token");
    });

    it("should call Firebase signOut", async () => {
      jest.spyOn(firebase, "signOut");
      await store.dispatch(signOut());
      expect(firebase.signOut).toHaveBeenCalled();
    });

    it("should remove token from localStorage", async () => {
      await store.dispatch(signOut());
      expect(localStorage.getItem(`${APP_PREFIX}@token`)).toBeNull();
    });

    it("should clear auth state", async () => {
      await store.dispatch(signOut());
      expect(store.getState().auth.isAuthenticated).toBeFalsy();
    });
  });

  describe("checkAuth", () => {
    jest.spyOn(firebase, "renewAuth");

    it("should not call Firebase renewAuth if no token", async () => {
      expect(store.getState().auth.errorState).toBeFalsy();
      await store.dispatch(checkAuth());
      expect(firebase.renewAuth).not.toHaveBeenCalled();
      expect(store.getState().auth.errorState).toEqual("");
    });

    it("should call Firebase checkAuth", async () => {
      localStorage.setItem(`${APP_PREFIX}@token`, "test-refresh-token");
      await store.dispatch(checkAuth());
      expect(firebase.renewAuth).toHaveBeenCalled();
    });

    it("should reject on error", async () => {
      jest.spyOn(firebase, "renewAuth").mockResolvedValue(null);
      localStorage.setItem(`${APP_PREFIX}@token`, "test-refresh-token");
      await store.dispatch(checkAuth());
      expect(firebase.renewAuth).toHaveBeenCalled();
      expect(store.getState().auth.errorState).toEqual("");
    });
  });

  describe("resetPassword", () => {
    it("should call Firebase resetPassword", async () => {
      jest.spyOn(firebase, "resetPassword").mockResolvedValue("test_email");
      await store.dispatch(resetPassword({ email: "test" }));
      expect(firebase.resetPassword).toHaveBeenCalled();
      expect(store.getState().auth.errorState).toEqual("");
    });

    it("should set errorState if resetPassword fails", async () => {
      jest.spyOn(firebase, "resetPassword").mockResolvedValue(null);
      await store.dispatch(resetPassword({ email: "test" }));
      expect(store.getState().auth.errorState).toEqual("Password reset is not possible");
    });
  });
});
