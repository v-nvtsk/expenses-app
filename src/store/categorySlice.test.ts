import { store } from ".";
import { AuthData } from "../api/firebase";
import firebase from "../api/firebase/firebase";
import { signIn } from "./authSlice";
import { add as addCategory, readAll } from "./categorySlice";

describe("categorySlice", () => {
  const testAuthData: AuthData = {
    localId: "test_local_id",
    idToken: "test_token",
    refreshToken: "test_refresh_token",
    expiresIn: "3600",
  };

  const testData = {
    id: "test_id-1",
    name: "test",
    parentId: "",
  };

  const savedData = {
    id: "test_id-1",
    name: "test",
    parentId: "",
    leveledName: "test",
    children: [],
  };

  jest.spyOn(firebase, "signIn").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "read").mockResolvedValue([]);
  jest.spyOn(firebase, "create").mockResolvedValue(testData.id);

  it("should be authentcated", async () => {
    await store.dispatch(signIn({ email: "test", password: "test" }));
    expect(firebase.signIn).toHaveBeenCalled();
    expect(store.getState().auth.isAuthenticated).toBeTruthy();
  });

  it("should add category", async () => {
    await store.dispatch(addCategory(testData));
    expect(firebase.create).toHaveBeenCalledWith("category", testData);
    expect(store.getState().category.items).toEqual([testData]);
  });

  it("should set errorState if add category fails", async () => {
    jest.spyOn(firebase, "create").mockResolvedValue(undefined);
    await store.dispatch(addCategory(testData));
    expect(store.getState().category.errorState).toEqual("Category is not created");
  });

  it("should read all categories", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue([testData]);
    await store.dispatch(readAll({}));
    expect(firebase.read).toHaveBeenCalledWith("category", {});
    expect(store.getState().category.items).toEqual([savedData]);
  });
});
