import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CatchAll from "./[...all]";

describe("Catch-all route", () => {
  it("renders the not-found page for any unmatched URL", () => {
    render(<CatchAll />);

    expect(screen.getByRole("heading", { level: 1, name: "Not Found" })).toBeInTheDocument();
  });
});
