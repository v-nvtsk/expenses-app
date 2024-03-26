import { act, render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Settings } from "./settings";
import { Store } from "../../store";

describe("Settings page", () => {
  it("should render", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <Settings />
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
    component.unmount();
  });
});
