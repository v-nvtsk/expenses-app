import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../store";
import { Stats } from "./stats";

describe("Expenses page", () => {
  it("should render", async () => {
    const component = await act(async () =>
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Stats />
          </MemoryRouter>
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
    component.unmount();
  });
});
