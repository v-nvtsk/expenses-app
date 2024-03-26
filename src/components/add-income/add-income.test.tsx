import { Provider } from "react-redux";
import { act, fireEvent, render, within } from "@testing-library/react";
import React from "react";
import { AddIncome } from ".";
import { Store } from "../../store";
import firebase from "../../api/firebase/firebase";

jest.mock("../../api/firebase/firebase.ts");

describe("AddIncome", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render ", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <AddIncome />
        </Provider>,
      ),
    );

    const group = within(component.container).getByRole("group", { name: /add new income/i });
    const inputDate: HTMLInputElement = within(group).getByLabelText(/income date\*/i);
    const inputName: HTMLInputElement = within(group).getByRole("textbox", { name: /income name\*/i });
    const inputAmount: HTMLInputElement = within(group).getByRole("spinbutton", { name: /income amount\*/i });
    const button: HTMLButtonElement = within(group).getByRole("button", { name: /add income/i });

    expect(component.container).toBeInTheDocument();
    expect(group).toBeInTheDocument();
    expect(inputDate).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
    expect(inputAmount).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    component.unmount();
  });

  it("should submit on button press", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue({
      id: "cat_id-1",
      title: "cat_title-1",
      parentId: "",
    });

    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <AddIncome />
        </Provider>,
      ),
    );
    const group = within(component.container).getByRole("group", { name: /add new income/i });
    const inputDate: HTMLInputElement = within(group).getByLabelText(/income date\*/i);
    const inputName: HTMLInputElement = within(group).getByRole("textbox", { name: /income name\*/i });
    const inputAmount: HTMLInputElement = within(group).getByRole("spinbutton", { name: /income amount\*/i });

    await act(async () => {
      fireEvent.change(inputDate, { target: { value: "2024-01-01" } });
      fireEvent.change(inputName, { target: { value: "test" } });
      fireEvent.change(inputAmount, { target: { value: "12345.67" } });
    });

    const testData = {
      id: "",
      title: inputName.value,
      amount: Number(inputAmount.value) * 100,
      creationDate: new Date(inputDate.value).getTime(),
    };

    jest.spyOn(firebase, "create").mockResolvedValue("testData_id");
    const form = component.container.querySelector("form") as HTMLFormElement;
    await fireEvent.submit(form);
    expect(firebase.create).toHaveBeenLastCalledWith("income", testData);
    component.unmount();
  });
});
