import { useState, useEffect, useCallback } from "react";
import Display from "./Display";
import Button from "./Button";

const MAX_DIGITS = 15;

function calculate(a, op, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  switch (op) {
    case "+":
      return x + y;
    case "−":
      return x - y;
    case "×":
      return x * y;
    case "÷":
      if (y === 0) return "Error";
      return x / y;
    default:
      return y;
  }
}

function formatResult(val) {
  if (val === "Error") return "Error";
  // Avoid floating-point noise: round to 10 significant digits
  const rounded = parseFloat(val.toPrecision(10));
  // Use exponential for very large/small numbers
  if (Math.abs(rounded) > 1e12 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
    return rounded.toExponential(4);
  }
  return String(rounded);
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [operand, setOperand] = useState(null); // stored left operand
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const reset = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustEvaluated(false);
  }, []);

  const inputDigit = useCallback(
    (digit) => {
      if (waitingForOperand || justEvaluated) {
        setDisplay(String(digit));
        setWaitingForOperand(false);
        setJustEvaluated(false);
      } else {
        setDisplay((prev) => {
          if (prev === "0") return String(digit);
          if (prev.replace("-", "").replace(".", "").length >= MAX_DIGITS)
            return prev;
          return prev + digit;
        });
      }
    },
    [waitingForOperand, justEvaluated],
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand || justEvaluated) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setJustEvaluated(false);
      return;
    }
    setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
  }, [waitingForOperand, justEvaluated]);

  const inputOperator = useCallback(
    (op) => {
      const current = display;

      if (operator && !waitingForOperand) {
        // Chain: evaluate pending operation first
        const result = calculate(operand, operator, current);
        if (result === "Error") {
          setDisplay("Error");
          setExpression("");
          setOperand(null);
          setOperator(null);
          setWaitingForOperand(true);
          setJustEvaluated(false);
          return;
        }
        const formatted = formatResult(result);
        setDisplay(formatted);
        setOperand(formatted);
        setExpression(`${formatted} ${op}`);
      } else {
        setOperand(current);
        setExpression(`${current} ${op}`);
      }

      setOperator(op);
      setWaitingForOperand(true);
      setJustEvaluated(false);
    },
    [display, operator, operand, waitingForOperand],
  );

  const evaluate = useCallback(() => {
    if (!operator || operand === null) return;

    const right = display;
    const result = calculate(operand, operator, right);

    if (result === "Error") {
      setDisplay("Error");
      setExpression(`${operand} ${operator} ${right} =`);
    } else {
      const formatted = formatResult(result);
      setDisplay(formatted);
      setExpression(`${operand} ${operator} ${right} =`);
    }

    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustEvaluated(true);
  }, [display, operator, operand]);

  const deleteLastDigit = useCallback(() => {
    if (waitingForOperand || justEvaluated || display === "Error") return;
    setDisplay((prev) => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith("-")))
        return "0";
      return prev.slice(0, -1);
    });
  }, [waitingForOperand, justEvaluated, display]);

  const toggleSign = useCallback(() => {
    if (display === "Error" || display === "0") return;
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
  }, [display]);

  const inputPercent = useCallback(() => {
    if (display === "Error") return;
    const val = parseFloat(display);
    if (!isNaN(val)) setDisplay(formatResult(val / 100));
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const keyMap = {
      0: () => inputDigit("0"),
      1: () => inputDigit("1"),
      2: () => inputDigit("2"),
      3: () => inputDigit("3"),
      4: () => inputDigit("4"),
      5: () => inputDigit("5"),
      6: () => inputDigit("6"),
      7: () => inputDigit("7"),
      8: () => inputDigit("8"),
      9: () => inputDigit("9"),
      ".": inputDecimal,
      ",": inputDecimal,
      "+": () => inputOperator("+"),
      "-": () => inputOperator("−"),
      "*": () => inputOperator("×"),
      "/": () => inputOperator("÷"),
      Enter: evaluate,
      "=": evaluate,
      Backspace: deleteLastDigit,
      Escape: reset,
      Delete: reset,
      "%": inputPercent,
    };

    const handler = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (keyMap[e.key]) {
        e.preventDefault();
        keyMap[e.key]();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    inputDigit,
    inputDecimal,
    inputOperator,
    evaluate,
    deleteLastDigit,
    reset,
    inputPercent,
  ]);

  const buttons = [
    { label: "AC", action: reset, variant: "action" },
    { label: "+/-", action: toggleSign, variant: "action" },
    { label: "%", action: inputPercent, variant: "action" },
    { label: "÷", action: () => inputOperator("÷"), variant: "operator" },

    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", action: () => inputOperator("×"), variant: "operator" },

    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "−", action: () => inputOperator("−"), variant: "operator" },

    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", action: () => inputOperator("+"), variant: "operator" },

    { label: "⌫", action: deleteLastDigit, variant: "action" },
    { label: "0", action: () => inputDigit("0") },
    { label: ".", action: inputDecimal },
    { label: "=", action: evaluate, variant: "equals" },
  ];

  return (
    <div className="w-full max-w-xs bg-gray-800 rounded-3xl shadow-2xl p-4">
      <Display expression={expression} value={display} />
      <div className="grid grid-cols-4 gap-3">
        {buttons.map(({ label, action, variant }) => (
          <Button
            key={label}
            label={label}
            onClick={action}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}
