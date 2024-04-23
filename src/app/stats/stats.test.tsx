import { RenderResult, act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../store";
import { Stats } from "./stats";

describe("Expenses page", () => {
  let component: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

  it("should render", async () => {
    component = await act(async () =>
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Stats />
          </MemoryRouter>
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
  });
});
