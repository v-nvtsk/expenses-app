import { store } from ".";
import { AuthData } from "../api/firebase";
import firebase from "../api/firebase/firebase";
import { signIn } from "./authSlice";
import { add as addIncome, read as readIncome } from "./incomeSlice";

describe("incomeSlice", () => {
  const testAuthData: AuthData = {
    localId: "test_local_id",
    idToken: "test_token",
    refreshToken: "test_refresh_token",
    expiresIn: "3600",
  };

  const testData = {
    id: "test_id-1",
    creationDate: new Date(2024 - 1 - 1).getTime(),
    title: "test",
    amount: 10000,
  };

  const savedData = {
    id: "test_id-1",
    creationDate: new Date(2024 - 1 - 1).getTime(),
    title: "test",
    amount: 10000,
  };

  jest.spyOn(firebase, "signIn").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "read").mockResolvedValue([]);
  jest.spyOn(firebase, "create").mockResolvedValue(testData.id);

  it("should be authentcated", async () => {
    await store.dispatch(signIn({ email: "test", password: "test" }));
    expect(firebase.signIn).toHaveBeenCalled();
    expect(store.getState().auth.isAuthenticated).toBeTruthy();
  });

  it("should add income", async () => {
    await store.dispatch(addIncome(testData));
    expect(firebase.create).toHaveBeenCalledWith("income", testData);
    expect(store.getState().income.items).toEqual([testData]);
  });

  it("should set errorState if add income fails", async () => {
    jest.spyOn(firebase, "create").mockResolvedValue(undefined);
    await store.dispatch(addIncome(testData));
    expect(store.getState().income.errorState).toEqual("Income is not created");
  });

  it("should read all incomes", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue({
      [testData.id as string]: testData,
    });
    await store.dispatch(readIncome({}));
    expect(firebase.read).toHaveBeenCalledWith("income", {});
    expect(store.getState().income.items).toEqual([savedData]);
  });

  it("should set errorState if read incomes fails", async () => {
    jest.spyOn(firebase, "read").mockImplementation(() => {
      throw new Error("error");
    });
    await store.dispatch(readIncome({}));
    expect(store.getState().income.errorState).toEqual("error");
  });
});
