import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Display from "../Display";

describe("Display component", () => {
  it("renders the current value", () => {
    render(<Display expression="" value="42" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the expression", () => {
    render(<Display expression="5 + 3 =" value="8" />);
    expect(screen.getByText("5 + 3 =")).toBeInTheDocument();
  });

  it("renders '0' as initial value", () => {
    render(<Display expression="" value="0" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders Error state", () => {
    render(<Display expression="1 ÷ 0 =" value="Error" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("uses smaller font for long values (>12 chars)", () => {
    const longValue = "123456789012345";
    render(<Display expression="" value={longValue} />);
    const valueEl = screen.getByText(longValue);
    expect(valueEl).toHaveClass("text-2xl");
  });

  it("uses medium font for values between 9-12 chars", () => {
    const medValue = "1234567890";
    render(<Display expression="" value={medValue} />);
    const valueEl = screen.getByText(medValue);
    expect(valueEl).toHaveClass("text-3xl");
  });

  it("uses large font for short values (<=9 chars)", () => {
    render(<Display expression="" value="123" />);
    expect(screen.getByText("123")).toHaveClass("text-4xl");
  });
});
