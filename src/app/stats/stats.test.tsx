import { Provider } from "react-redux";
import { act, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Store } from "../../store";
import { Stats } from "./stats";

describe("Expenses page", () => {
  it("should render", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
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
