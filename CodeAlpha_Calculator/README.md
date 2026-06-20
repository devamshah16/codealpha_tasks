# Task-2: Calculator

A basic calculator built with HTML, CSS, and JavaScript.

## Features

- **Arithmetic operations** — Addition (+), subtraction (−), multiplication (×), division (÷)
- **Display screen** — Shows current input, active expression, and real-time result preview
- **Clear & backspace** — AC resets everything; ⌫ removes the last digit
- **Sign toggle** — ± flips positive/negative on the current number
- **Error handling** — Division by zero shows a clear error state
- **Keyboard support** — Full keypad mapped to physical keyboard
- **Styling** — Dark theme with color-coded buttons, hover/active states, and responsive layout

## How to run

Open `index.html` in a web browser.

Or use a local server:

```bash
cd Task-2
npx serve .
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Enter digits |
| `.` or `,` | Decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Equals |
| `Backspace` | Delete last digit |
| `Delete` or `Esc` | All clear |

## Files

| File | Purpose |
|------|---------|
| `index.html` | Calculator structure and button layout |
| `styles.css` | Layout, theming, and responsive design |
| `script.js` | Input handling, calculations, and keyboard support |
