# Global Styles & Entry Point Template

Professional foundation for Symbiote.js projects. Copy and adapt to your project.

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <title>App Title</title>

  <!-- Font preload (adjust to your design system) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">

  <!-- Global styles -->
  <link rel="stylesheet" href="styles/global.css">

  <!-- ESM importmap -->
  <script type="importmap">
  {
    "imports": {
      "@symbiotejs/symbiote": "https://esm.run/@symbiotejs/symbiote",
      "@symbiotejs/symbiote/": "https://esm.run/@symbiotejs/symbiote/"
    }
  }
  </script>

  <!-- Entry point -->
  <script type="module" src="src/app-root.js"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

## global.css

```css
/* === Reset === */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Remove default list styles */
ul, ol {
  list-style: none;
}

/* Prevent font size inflation on mobile */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* Core body defaults */
body {
  min-height: 100dvh;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background: var(--color-surface-alt);
  -webkit-font-smoothing: antialiased;
}

/* Inherit fonts for form elements */
input, button, textarea, select {
  font: inherit;
  color: inherit;
}

/* Media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* Smooth scroll (only when no reduce-motion preference) */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* === Design Tokens === */
:root {
  /* Colors — replace with your DESIGN.md values */
  --color-primary: #1a365d;
  --color-primary-hover: #153050;
  --color-primary-light: #e8f0fe;
  --color-surface: #ffffff;
  --color-surface-alt: #f7f8fa;
  --color-text: #1a1a2e;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-text-inverse: #ffffff;
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-border: #e5e7eb;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);

  /* Typography */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

/* === Accessibility === */

/* Visible focus ring for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Remove focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* === Dark Theme (opt-in) === */
@media (prefers-color-scheme: dark) {
  :root {
    /* Override tokens for dark mode — uncomment and adjust as needed */
    /* --color-surface: #1a1a2e;
    --color-surface-alt: #16162a;
    --color-text: #e5e7eb;
    --color-text-secondary: #9ca3af;
    --color-border: #374151; */
  }
}
```

## Notes

- **Replace design tokens** with values from your `DESIGN.md`
- **Importmap URLs**: for production, consider self-hosting or pinning CDN versions
- **Font loading strategy**: `display=swap` ensures text is visible during font load
- **Dark mode**: uncomment and adjust the token overrides in the dark theme section
- **CSP**: if using Trusted Types, add to your server headers:
  ```
  Content-Security-Policy: require-trusted-types-for 'script'; trusted-types symbiote
  ```
