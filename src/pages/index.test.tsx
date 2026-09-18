import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Home from "./index";

/**
 * UI / PAGE TEST
 *
 * Same tools as a component test (render + user-event), but exercises a
 * full page and a real interactive feature end to end inside jsdom: opening
 * the mobile nav (a @headlessui/react Dialog) and reading what appears.
 * Copy this pattern for other pages under src/pages.
 */
describe("Home page", () => {
  it("renders the hero heading and primary CTA", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Vortex: the AI-driven autonomous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toBeInTheDocument();
  });

  it("lists the tech stack", () => {
    render(<Home />);

    for (const tech of ["React 19", "TypeScript", "Vite 8", "Tailwind CSS v4"]) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("opens the mobile nav dialog and lists the nav links inside it", async () => {
    const user = userEvent.setup();
    render(<Home />);

    // The mobile menu content isn't mounted until the dialog opens.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open main menu" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Tech Stack" })).toBeInTheDocument();
  });

  it("closes the mobile nav dialog", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Open main menu" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
