# Task-1: Image Gallery

A responsive image gallery built with HTML, CSS, and JavaScript.

## Features

- **Grid layout** — CSS Grid with auto-fill columns
- **Category filters** — All, Nature, Architecture, Travel, Abstract
- **Lightbox** — Full-screen view with prev/next navigation
- **Hover effects** — Image zoom, overlay, and zoom icon
- **Smooth transitions** — CSS transitions on filters, gallery items, and lightbox
- **Responsive** — Adapts from desktop to mobile (2-column grid on small screens)

## How to run

Open `index.html` in a web browser. Images load from [picsum.photos](https://picsum.photos) (requires internet).

Or use a local server:

```bash
cd Task-1
npx serve .
```

## Keyboard shortcuts (lightbox)

| Key | Action |
|-----|--------|
| `←` | Previous image |
| `→` | Next image |
| `Esc` | Close lightbox |

## Files

| File | Purpose |
|------|---------|
| `index.html` | Structure, filters, lightbox markup |
| `styles.css` | Layout, hover effects, responsive breakpoints |
| `script.js` | Gallery data, filters, lightbox navigation |
