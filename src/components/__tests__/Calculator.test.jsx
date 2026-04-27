import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Calculator from "../Calculator";

// Helper to click a button by its visible label
function click(label) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

// Helper to read the main display value
function displayValue() {
  // The value paragraph is the second <p> inside the display area
  const paragraphs = screen.getAllByText(/.+/, { selector: "p" });
  // Last non-empty paragraph that isn't the expression row
  return paragraphs[paragraphs.length - 1].textContent;
}

describe("Calculator – initial state", () => {
  beforeEach(() => render(<Calculator />));

  it("shows 0 on first render", () => {
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders all 20 buttons", () => {
    expect(screen.getAllByRole("button")).toHaveLength(20);
  });
});

describe("Calculator – digit input", () => {
  beforeEach(() => render(<Calculator />));

  it("replaces leading 0 when typing a digit", () => {
    click("5");
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("appends multiple digits", () => {
    click("1");
    click("2");
    click("3");
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("does not display leading zeros", () => {
    click("0");
    click("0");
    expect(screen.queryByText("00")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Calculator – addition", () => {
  beforeEach(() => render(<Calculator />));

  it("adds two numbers", () => {
    click("3");
    click("+");
    click("4");
    click("=");
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("adds decimal numbers", () => {
    click("1");
    click(".");
    click("5");
    click("+");
    click("2");
    click(".");
    click("5");
    click("=");
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});

describe("Calculator – subtraction", () => {
  beforeEach(() => render(<Calculator />));

  it("subtracts two numbers", () => {
    click("9");
    click("−");
    click("4");
    click("=");
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("returns a negative result", () => {
    click("3");
    click("−");
    click("7");
    click("=");
    expect(screen.getByText("-4")).toBeInTheDocument();
  });
});

describe("Calculator – multiplication", () => {
  beforeEach(() => render(<Calculator />));

  it("multiplies two numbers", () => {
    click("6");
    click("×");
    click("7");
    click("=");
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("multiplies by zero", () => {
    click("9");
    click("×");
    click("0");
    click("=");
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Calculator – division", () => {
  beforeEach(() => render(<Calculator />));

  it("divides two numbers", () => {
    click("8");
    click("÷");
    click("4");
    click("=");
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows Error on division by zero", () => {
    click("5");
    click("÷");
    click("0");
    click("=");
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("handles non-integer division", () => {
    click("1");
    click("÷");
    click("4");
    click("=");
    expect(screen.getByText("0.25")).toBeInTheDocument();
  });
});

describe("Calculator – chained operations", () => {
  beforeEach(() => render(<Calculator />));

  it("chains addition then subtraction", () => {
    click("1");
    click("0");
    click("+");
    click("5");
    click("−");
    click("3");
    click("=");
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("chains multiplication then addition", () => {
    click("2");
    click("×");
    click("3");
    click("+");
    click("4");
    click("=");
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});

describe("Calculator – AC (clear)", () => {
  beforeEach(() => render(<Calculator />));

  it("resets to 0 after AC", () => {
    click("9");
    click("+");
    click("3");
    click("AC");
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("clears expression after AC", () => {
    click("9");
    click("+");
    // expression should be visible
    click("AC");
    // no operator expression visible anymore
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });
});

describe("Calculator – backspace (⌫)", () => {
  beforeEach(() => render(<Calculator />));

  it("removes the last digit", () => {
    click("1");
    click("2");
    click("3");
    click("⌫");
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("resets to 0 when single digit remains", () => {
    click("5");
    click("⌫");
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Calculator – decimal point", () => {
  beforeEach(() => render(<Calculator />));

  it("adds decimal point to a number", () => {
    click("3");
    click(".");
    click("1");
    click("4");
    expect(screen.getByText("3.14")).toBeInTheDocument();
  });

  it("does not add a second decimal point", () => {
    click("1");
    click(".");
    click(".");
    click("5");
    expect(screen.getByText("1.5")).toBeInTheDocument();
  });

  it("starts with 0. when . is pressed on fresh display", () => {
    click(".");
    expect(screen.getByText("0.")).toBeInTheDocument();
  });
});

describe("Calculator – sign toggle (+/-)", () => {
  beforeEach(() => render(<Calculator />));

  it("negates a positive number", () => {
    click("8");
    click("+/-");
    expect(screen.getByText("-8")).toBeInTheDocument();
  });

  it("un-negates a negative number", () => {
    click("8");
    click("+/-");
    click("+/-");
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("does nothing when display is 0", () => {
    click("+/-");
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Calculator – percent (%)", () => {
  beforeEach(() => render(<Calculator />));

  it("converts 50 to 0.5", () => {
    click("5");
    click("0");
    click("%");
    expect(screen.getByText("0.5")).toBeInTheDocument();
  });

  it("converts 100 to 1", () => {
    click("1");
    click("0");
    click("0");
    click("%");
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

describe("Calculator – expression display", () => {
  beforeEach(() => render(<Calculator />));

  it("shows expression after operator is pressed", () => {
    click("5");
    click("+");
    expect(screen.getByText("5 +")).toBeInTheDocument();
  });

  it("shows full expression with = after evaluation", () => {
    click("3");
    click("+");
    click("4");
    click("=");
    expect(screen.getByText("3 + 4 =")).toBeInTheDocument();
  });
});

describe("Calculator – keyboard input", () => {
  beforeEach(() => render(<Calculator />));

  it("handles digit key press", () => {
    fireEvent.keyDown(window, { key: "7" });
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("handles Enter key to evaluate", () => {
    fireEvent.keyDown(window, { key: "3" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "4" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("handles Backspace key", () => {
    fireEvent.keyDown(window, { key: "9" });
    fireEvent.keyDown(window, { key: "5" });
    fireEvent.keyDown(window, { key: "Backspace" });
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("handles Escape key to clear", () => {
    fireEvent.keyDown(window, { key: "9" });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("ignores key presses with modifier keys", () => {
    fireEvent.keyDown(window, { key: "5", ctrlKey: true });
    // Should still be 0 — no input accepted
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("Calculator – post-evaluation behaviour", () => {
  beforeEach(() => render(<Calculator />));

  it("typing a digit after = starts fresh", () => {
    click("9");
    click("+");
    click("1");
    click("=");
    // display is 10
    click("5");
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("pressing operator after = uses result as left operand", () => {
    click("4");
    click("×");
    click("2");
    click("="); // result 8
    click("+");
    click("2");
    click("="); // 8 + 2 = 10
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
