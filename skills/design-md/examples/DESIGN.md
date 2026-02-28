# Design System — TaskFlow Pro

## 1. Project Identity
- **Project ID**: `4044680601076201931`
- **Device**: Desktop
- **Dimensions**: 1440 × 900

## 2. Atmosphere

Clean, spacious, and professional. The interface breathes with generous whitespace and a confident color palette. Subtle shadows create a layered, paper-like depth without heaviness. Interactive elements use smooth micro-animations for a polished, responsive feel.

## 3. Design Tokens (CSS Custom Properties)

```css
:root {
  /* === Colors === */

  /* Primary — Deep Ocean Blue, used for navigation, primary buttons, active states */
  --color-primary: #1a365d;
  --color-primary-hover: #153050;
  --color-primary-light: #e8f0fe;

  /* Surface — backgrounds and containers */
  --color-surface: #ffffff;           /* Clean White — card backgrounds, modals */
  --color-surface-alt: #f7f8fa;       /* Soft Cloud — page background, alternating rows */
  --color-surface-elevated: #ffffff;  /* Elevated containers with shadow */

  /* Text — hierarchy */
  --color-text: #1a1a2e;              /* Near-Black — headings, primary text */
  --color-text-secondary: #6b7280;    /* Soft Gray — descriptions, labels */
  --color-text-muted: #9ca3af;        /* Light Gray — placeholders, timestamps */
  --color-text-inverse: #ffffff;      /* White — text on filled buttons */

  /* Accent — interactive highlights */
  --color-accent: #3b82f6;            /* Bright Blue — links, active tabs */
  --color-accent-hover: #2563eb;      /* Deeper Blue — hover states */

  /* Status */
  --color-success: #10b981;           /* Emerald — completed, online */
  --color-warning: #f59e0b;           /* Amber — pending, attention needed */
  --color-error: #ef4444;             /* Red — errors, destructive actions */

  /* Border */
  --color-border: #e5e7eb;            /* Faint Gray — dividers, input borders */
  --color-border-focus: #3b82f6;      /* Accent Blue — focused input borders */

  /* === Spacing === */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* === Border Radius === */
  --radius-sm: 4px;       /* Subtly rounded — inputs, small buttons */
  --radius-md: 8px;       /* Softly rounded — cards, panels */
  --radius-lg: 12px;      /* Generously rounded — modals, hero sections */
  --radius-full: 9999px;  /* Pill-shaped — tags, avatars, toggle buttons */

  /* === Shadows === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);

  /* === Typography === */
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

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

## 4. Component Patterns

| Pattern | Description | Suggested Tag |
|---------|-------------|---------------|
| Navigation Sidebar | Vertical nav with icons and labels, collapsible | `app-sidebar` |
| Top Bar | Horizontal header with search, user avatar, notifications | `app-topbar` |
| Task Card | Draggable card with title, assignee avatar, priority badge, due date | `task-card` |
| Kanban Column | Vertical list container with column header and task count | `kanban-column` |
| Status Badge | Pill-shaped label with color-coded background | `status-badge` |
| Avatar | Circular image with fallback initials | `user-avatar` |
| Button (Primary) | Filled background, rounded, bold text, shadow on hover | `ui-button` |
| Input Field | Bordered, subtle rounded, focus ring animation | `ui-input` |
| Modal Dialog | Centered overlay with backdrop blur, rounded card | `ui-modal` |
| Dropdown Menu | Elevated list with hover highlights and icons | `ui-dropdown` |

## 5. Stitch Prompt Block

Copy this block into any Stitch prompt to maintain visual consistency:

```
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light, clean and spacious with subtle depth
- Background: Soft Cloud (#f7f8fa) for page, Clean White (#ffffff) for cards
- Primary: Deep Ocean Blue (#1a365d) for navigation and primary actions
- Accent: Bright Blue (#3b82f6) for links, active states, focus rings
- Text: Near-Black (#1a1a2e) for headings, Soft Gray (#6b7280) for secondary
- Borders: Faint Gray (#e5e7eb), 1px solid
- Radius: 4px for inputs, 8px for cards, pill-shaped for badges
- Shadows: Gentle multi-layer shadows for cards, pronounced for modals
- Typography: Inter font family, 14-16px base, semibold for headings
- Transitions: 150-250ms ease for hover effects
- Status colors: Emerald (#10b981), Amber (#f59e0b), Red (#ef4444)
```

## 6. Symbiote Component Guidelines

- Use **custom tag names** as CSS selectors: `task-card { ... }` not `.task-card { ... }`
- Use **native CSS nesting**: `task-card { & [hidden] { display: none; } }`
- Use **attribute selectors** over classes: `[priority="high"]` not `.priority-high`
- Use CSS custom properties from this design system for all values
- **Do NOT** use Tailwind, BEM, or any CSS framework
- **Do NOT** wrap custom elements in extra divs — the tag IS the wrapper
- Split every component into triple-file:
  - `ComponentName.js` — class logic only
  - `ComponentName.tpl.js` — template (html)
  - `ComponentName.css.js` — styles (css)
