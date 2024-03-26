import { Provider } from "react-redux";
import { act, render } from "@testing-library/react";
import React from "react";
import { WeekLyStats } from ".";
import { Store } from "../../store";

describe("WeeklyStats", () => {
  it("should render ", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <WeekLyStats />
        </Provider>,
      ),
    );

    expect(component.container).toBeInTheDocument();
  });
});
