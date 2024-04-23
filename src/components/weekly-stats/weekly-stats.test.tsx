import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { WeekLyStats } from ".";
import { store } from "../../store";

describe("WeeklyStats", () => {
  it("should render ", async () => {
    const component = await act(async () =>
      render(
        <Provider store={store}>
          <WeekLyStats />
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
  });
});
