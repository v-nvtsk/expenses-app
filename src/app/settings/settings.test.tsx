import { act, render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Settings } from "./settings";
import { store } from "../../store";

describe("Settings page", () => {
  it("should render", async () => {
    const component = await act(async () =>
      render(
        <Provider store={store}>
          <Settings />
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
    component.unmount();
  });
});
