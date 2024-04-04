import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { Settings } from "./settings";

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
