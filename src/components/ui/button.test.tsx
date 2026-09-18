import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

/**
 * UI / COMPONENT TEST
 *
 * Renders a real component into jsdom and interacts with it the way a user
 * would (via @testing-library/user-event), then asserts on what's visible
 * in the DOM — not on internal implementation details. This is the pattern
 * to copy for any component in src/components.
 */
describe("Button", () => {
  it("renders children and the default variant classes", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
  });

  it("applies the requested variant and size", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("h-11");
  });

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as the child element when asChild is set, instead of a <button>", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
