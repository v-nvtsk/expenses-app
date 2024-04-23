import { RenderResult, act, fireEvent, render, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { AddExpenses } from ".";
import firebase from "../../api/firebase/firebase";
import { store } from "../../store";

jest.mock("../../api/firebase/firebase.ts");

describe("AddExpenses", () => {
  let component: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

  it("should render ", async () => {
    component = await act(async () =>
      render(
        <Provider store={store}>
          <AddExpenses />
        </Provider>,
      ),
    );
    const group = within(component.container).getByRole("group", { name: /add new expense/i });
    const inputDate: HTMLInputElement = within(group).getByLabelText(/expense date\*/i);
    const inputName: HTMLInputElement = within(group).getByRole("textbox", { name: /expense name\*/i });
    const inputAmount: HTMLInputElement = within(group).getByRole("spinbutton", { name: /expense amount\*/i });
    const categorySelect = within(group).getByRole("listbox", { name: /select category\*/i });
    const button: HTMLButtonElement = within(group).getByRole("button", { name: /add expense/i });

    expect(component.container).toBeInTheDocument();
    expect(group).toBeInTheDocument();
    expect(inputDate).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
    expect(inputAmount).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should preload categories", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue({
      "cat_id-1": {
        name: "cat_title-1",
        parentId: "",
      },
    });
    component = await act(async () =>
      render(
        <Provider store={store}>
          <AddExpenses />
        </Provider>,
      ),
    );
    expect(firebase.read).toHaveBeenCalledWith("category", {});
    const group = within(component.container).getByRole("group", { name: /add new expense/i });
    const categorySelect = within(group).getByRole("listbox", { name: /select category\*/i });

    expect(categorySelect.querySelectorAll("option").length).toBe(2);
  });

  it("should submit on button press", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue({
      id: "cat_id-1",
      title: "cat_title-1",
      parentId: "",
    });

    component = await act(async () =>
      render(
        <Provider store={store}>
          <AddExpenses />
        </Provider>,
      ),
    );
    const group = within(component.container).getByRole("group", { name: /add new expense/i });
    const inputDate: HTMLInputElement = within(group).getByLabelText(/expense date\*/i);
    const inputName: HTMLInputElement = within(group).getByRole("textbox", { name: /expense name\*/i });
    const inputAmount: HTMLInputElement = within(group).getByRole("spinbutton", { name: /expense amount\*/i });
    const categorySelect: HTMLSelectElement = within(group).getByRole("listbox", { name: /select category\*/i });

    await act(async () => {
      fireEvent.change(inputDate, { target: { value: "2024-01-01" } });
      fireEvent.change(inputName, { target: { value: "test" } });
      fireEvent.change(inputAmount, { target: { value: "12345.67" } });
      fireEvent.change(categorySelect, { target: { value: "" } });
    });

    const testData = {
      id: "",
      title: inputName.value,
      amount: Number(inputAmount.value) * 100,
      categoryId: "",
      creationDate: new Date(inputDate.value).getTime(),
    };

    jest.spyOn(firebase, "create").mockResolvedValue("testData_id");
    const form = component.container.querySelector("form") as HTMLFormElement;
    await fireEvent.submit(form);
    expect(firebase.create).toHaveBeenLastCalledWith("expense", testData);
  });
});
