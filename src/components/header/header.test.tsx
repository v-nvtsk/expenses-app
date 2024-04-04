import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./header";

describe("Header", () => {
  const mockSignOut = jest.fn();

  it("should render Header", () => {
    const component = render(
      <BrowserRouter>
        <Header isAuthenticated={false} onSignOut={mockSignOut} />
      </BrowserRouter>,
    );

    expect(component.container).toBeInTheDocument();
    const list = screen.getByRole("list");

    const inList = within(list);
    expect(inList.queryByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /expenses/i })).toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /settings/i })).not.toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(inList.queryByRole("link", { name: /sign out/i })).not.toBeInTheDocument();
  });

  it("should re-render Header on authState props change", () => {
    render(
      <BrowserRouter>
        <Header isAuthenticated={true} onSignOut={mockSignOut} />
      </BrowserRouter>,
    );
    expect(screen.queryByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /sign up/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /sign out/i })).toBeInTheDocument();

    const header = screen.queryByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("should handle sign out", async () => {
    render(
      <BrowserRouter>
        <Header isAuthenticated={true} onSignOut={mockSignOut} />
      </BrowserRouter>,
    );
    await userEvent.click(screen.getByRole("link", { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
