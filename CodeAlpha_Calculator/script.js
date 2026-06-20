/**
 * Task-2 Calculator
 * Handles input, arithmetic, real-time preview, and keyboard support.
 */

const MAX_DIGITS = 12;

const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const keypad = document.querySelector(".keypad");

const state = {
  current: "0",
  previous: null,
  operator: null,
  shouldResetInput: false,
  lastAction: null,
};

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";

  const str = String(value);
  if (str.length <= MAX_DIGITS) {
    if (Number.isInteger(value)) return str;
    return parseFloat(value.toPrecision(MAX_DIGITS)).toString();
  }

  const exp = value.toExponential(6);
  return exp.length <= MAX_DIGITS + 4 ? exp : value.toExponential(3);
}

function parseDisplay(value) {
  return parseFloat(value.replace(/,/g, ""));
}

function calculate(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      if (b === 0) return null;
      return a / b;
    default:
      return b;
  }
}

function getPreviewResult() {
  if (state.operator === null || state.previous === null || state.shouldResetInput) {
    return null;
  }

  const a = parseDisplay(state.previous);
  const b = parseDisplay(state.current);
  const result = calculate(a, b, state.operator);

  if (result === null) return "Can't divide by zero";
  return formatNumber(result);
}

function updateDisplay() {
  const preview = getPreviewResult();
  const isError = state.current === "Error" || preview === "Can't divide by zero";

  displayEl.textContent = state.current;
  displayEl.classList.toggle("error", isError);
  displayEl.classList.toggle("preview", !isError && preview !== null && state.lastAction !== "equals");

  if (state.lastAction === "equals") {
    /* expression set in inputEquals — keep it */
  } else if (state.previous !== null && state.operator !== null) {
    expressionEl.textContent = `${state.previous} ${state.operator}`;
  } else {
    expressionEl.textContent = "";
  }

  document.querySelectorAll(".btn-op").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === state.operator);
  });
}

function inputDigit(digit) {
  if (state.current === "Error") {
    state.current = digit;
    state.shouldResetInput = false;
    updateDisplay();
    return;
  }

  if (state.shouldResetInput) {
    state.current = digit;
    state.shouldResetInput = false;
  } else if (state.current === "0") {
    state.current = digit;
  } else if (state.current.replace(".", "").length < MAX_DIGITS) {
    state.current += digit;
  }

  state.lastAction = "digit";
  updateDisplay();
}

function inputDecimal() {
  if (state.current === "Error") {
    state.current = "0.";
    state.shouldResetInput = false;
    updateDisplay();
    return;
  }

  if (state.shouldResetInput) {
    state.current = "0.";
    state.shouldResetInput = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }

  state.lastAction = "decimal";
  updateDisplay();
}

function inputOperator(op) {
  if (state.current === "Error") return;

  const currentVal = parseDisplay(state.current);

  if (state.operator !== null && state.previous !== null && !state.shouldResetInput) {
    const prevVal = parseDisplay(state.previous);
    const result = calculate(prevVal, currentVal, state.operator);

    if (result === null) {
      state.current = "Error";
      state.previous = null;
      state.operator = null;
      updateDisplay();
      return;
    }

    state.previous = formatNumber(result);
    state.current = formatNumber(result);
  } else {
    state.previous = state.current;
  }

  state.operator = op;
  state.shouldResetInput = true;
  state.lastAction = "operator";
  updateDisplay();
}

function inputEquals() {
  if (state.current === "Error" || state.operator === null || state.previous === null) {
    return;
  }

  const a = parseDisplay(state.previous);
  const b = parseDisplay(state.current);
  const result = calculate(a, b, state.operator);

  if (result === null) {
    expressionEl.textContent = `${state.previous} ${state.operator} ${state.current}`;
    state.current = "Error";
  } else {
    expressionEl.textContent = `${state.previous} ${state.operator} ${state.current} =`;
    state.current = formatNumber(result);
  }

  state.previous = null;
  state.operator = null;
  state.shouldResetInput = true;
  state.lastAction = "equals";
  updateDisplay();
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.shouldResetInput = false;
  state.lastAction = "clear";
  updateDisplay();
}

function backspace() {
  if (state.current === "Error" || state.shouldResetInput) {
    clearAll();
    return;
  }

  if (state.current.length === 1 || (state.current.length === 2 && state.current.startsWith("-"))) {
    state.current = "0";
  } else {
    state.current = state.current.slice(0, -1);
  }

  state.lastAction = "backspace";
  updateDisplay();
}

function toggleSign() {
  if (state.current === "Error" || state.current === "0") return;

  if (state.current.startsWith("-")) {
    state.current = state.current.slice(1);
  } else {
    state.current = "-" + state.current;
  }

  state.lastAction = "toggle-sign";
  updateDisplay();
}

function handleAction(action, value) {
  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      inputOperator(value);
      break;
    case "equals":
      inputEquals();
      break;
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    case "toggle-sign":
      toggleSign();
      break;
  }
}

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  handleAction(btn.dataset.action, btn.dataset.value);
});

const KEY_MAP = {
  "0": ["digit", "0"],
  "1": ["digit", "1"],
  "2": ["digit", "2"],
  "3": ["digit", "3"],
  "4": ["digit", "4"],
  "5": ["digit", "5"],
  "6": ["digit", "6"],
  "7": ["digit", "7"],
  "8": ["digit", "8"],
  "9": ["digit", "9"],
  ".": ["decimal"],
  ",": ["decimal"],
  "+": ["operator", "+"],
  "-": ["operator", "−"],
  "*": ["operator", "×"],
  "/": ["operator", "÷"],
  Enter: ["equals"],
  "=": ["equals"],
  Backspace: ["backspace"],
  Delete: ["clear"],
  Escape: ["clear"],
};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const mapping = KEY_MAP[e.key];
  if (!mapping) return;

  e.preventDefault();
  handleAction(mapping[0], mapping[1]);
});

updateDisplay();
