import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../Button";

describe("Button component", () => {
  it("renders the label", () => {
    render(<Button label="7" onClick={() => {}} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handler = vi.fn();
    render(<Button label="+" onClick={handler} />);
    fireEvent.click(screen.getByText("+"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("applies default variant class by default", () => {
    render(<Button label="5" onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-700");
  });

  it("applies operator variant class", () => {
    render(<Button label="÷" onClick={() => {}} variant="operator" />);
    expect(screen.getByRole("button")).toHaveClass("bg-amber-400");
  });

  it("applies action variant class", () => {
    render(<Button label="AC" onClick={() => {}} variant="action" />);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-500");
  });

  it("applies equals variant class", () => {
    render(<Button label="=" onClick={() => {}} variant="equals" />);
    expect(screen.getByRole("button")).toHaveClass("bg-amber-500");
  });

  it("spans two columns when wide=true", () => {
    render(<Button label="0" onClick={() => {}} wide />);
    expect(screen.getByRole("button")).toHaveClass("col-span-2");
  });

  it("does not span two columns by default", () => {
    render(<Button label="0" onClick={() => {}} />);
    expect(screen.getByRole("button")).not.toHaveClass("col-span-2");
  });
});
