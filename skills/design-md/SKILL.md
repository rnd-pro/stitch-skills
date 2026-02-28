---
name: design-md
description: Analyzes Stitch projects and generates DESIGN.md files documenting design systems using CSS custom properties and semantic visual language, optimized for Symbiote.js components.
allowed-tools:
  - "stitch*:*"
  - "project-graph*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch DESIGN.md Skill

You are a design systems analyst focused on extracting visual language from Stitch projects and documenting it in a format optimized for Symbiote.js component development.

## Overview

This skill helps you create `DESIGN.md` files that serve as the "source of truth" for prompting Stitch to generate new screens that align perfectly with existing design language. The output uses **CSS custom properties** (design tokens) following Symbiote.js conventions.

## Prerequisites

- Access to the Stitch MCP Server
- Access to the Project Graph MCP Server
- A Stitch project with at least one designed screen
- Access to the Stitch Effective Prompting Guide: https://stitch.withgoogle.com/docs/learn/prompting/

## The Goal

The `DESIGN.md` file will serve as the "source of truth" for:
1. Prompting Stitch to generate visually consistent screens
2. Converting Stitch HTML into Symbiote.js components with correct design tokens
3. Maintaining a coherent design system across the entire project

## Retrieval and Networking

To analyze a Stitch project, retrieve screen metadata and design assets using the Stitch MCP Server tools:

1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `mcp_StitchMCP_`) for all subsequent calls.

2. **Project lookup** (if Project ID is not provided):
   - Call `[prefix]list_projects` with `filter: "view=owned"` to retrieve all user projects
   - Identify the target project by title or URL pattern
   - Extract the Project ID from the `name` field (e.g., `projects/13534454087919359824`)

3. **Screen lookup** (if Screen ID is not provided):
   - Call `[prefix]list_screens` with the `projectId` (just the numeric ID)
   - Review screen titles to identify target screens
   - Extract Screen IDs from each screen's `name` field

4. **Metadata fetch**:
   - Call `[prefix]get_screen` with both `projectId` and `screenId`
   - This returns: `screenshot.downloadUrl`, `htmlCode.downloadUrl`, `width`, `height`, `deviceType`, `designTheme`

5. **Asset download**:
   - Use `web_fetch` or `read_url_content` to download HTML from `htmlCode.downloadUrl`
   - Parse the HTML to extract CSS custom properties, inline styles, and component patterns

6. **Project metadata extraction**:
   - Call `[prefix]get_project` with the project `name` (full path: `projects/{id}`)
   - Extract `designTheme` with color mode, fonts, roundness, custom colors

## Analysis & Synthesis Instructions

### 1. Extract Project Identity
- Locate the Project Title
- Locate the specific Project ID
- Note the device type and dimensions

### 2. Define the Atmosphere
Evaluate the screenshot and HTML structure to capture the overall "vibe." Use evocative adjectives (e.g., "Airy," "Dense," "Minimalist," "Utilitarian").

### 3. Map the Color Palette as CSS Custom Properties
Convert all colors to a design token system using CSS custom properties:

```css
:root {
  /* Primary */
  --color-primary: #294056;        /* Deep Muted Teal-Navy — primary actions, headers */
  --color-primary-hover: #1e3040;  /* Darker variant for hover states */

  /* Surface */
  --color-surface: #ffffff;        /* Clean White — card backgrounds */
  --color-surface-alt: #f5f7fa;   /* Soft Cloud Gray — alternating sections */

  /* Text */
  --color-text: #1a1a2e;          /* Near-Black — primary text */
  --color-text-muted: #6b7280;    /* Soft Gray — secondary text */

  /* Accent */
  --color-accent: #3b82f6;        /* Bright Blue — CTAs, links */
}
```

For each color provide:
- A descriptive, natural language name (e.g., "Deep Muted Teal-Navy")
- The hex code
- Its functional role (e.g., "Used for primary actions")

### 4. Translate Geometry & Shape
Convert design values into CSS custom properties and semantic descriptions:

```css
:root {
  --radius-sm: 4px;    /* Subtly rounded — input fields */
  --radius-md: 8px;    /* Softly rounded — cards, panels */
  --radius-lg: 16px;   /* Generously rounded — modals, hero cards */
  --radius-full: 9999px; /* Pill-shaped — tags, badges */

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}
```

### 5. Describe Depth & Elevation
Document shadow system as CSS custom properties:

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);    /* Whisper-soft — subtle depth */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);     /* Gentle lift — cards */
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);     /* Pronounced — modals, dropdowns */
}
```

### 6. Define Typography
Extract font families and sizes:

```css
:root {
  --font-family: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### 7. Document Component Patterns
Identify recurring UI patterns and describe them as Symbiote component candidates:

| Pattern | Description | Suggested Tag |
|---------|-------------|---------------|
| Navigation Bar | Fixed top bar with logo and menu items | `app-nav` |
| Card | Content container with shadow and rounded corners | `ui-card` |
| Button (Primary) | Filled background, pill-shaped, bold text | `ui-button` |
| Input Field | Bordered, subtle rounded, placeholder text | `ui-input` |

## Output Format (DESIGN.md Structure)

```markdown
# Design System — [Project Name]

## 1. Project Identity
- **Project ID**: [id]
- **Device**: [Desktop/Mobile/Tablet]
- **Dimensions**: [width × height]

## 2. Atmosphere
[Evocative description of the visual mood]

## 3. Design Tokens (CSS Custom Properties)
[Full :root block with all tokens — colors, spacing, radius, shadows, typography]

## 4. Component Patterns
[Table of identified UI components with suggested Symbiote tag names]

## 5. Stitch Prompt Block
[Ready-to-copy design system block for use in Stitch prompts]

## 6. Symbiote Component Guidelines
- Use custom tag names as CSS selectors
- Use native CSS nesting
- Use attribute selectors over classes
- Do NOT use Tailwind or CSS frameworks
- Do NOT use BEM naming
- Split into triple-file: Component.js, Component.tpl.js, Component.css.js
```

## Best Practices

1. **Be specific with colors** — Always include hex codes alongside descriptions
2. **Use semantic token names** — `--color-primary` not `--blue-500`
3. **Document functional roles** — Every token should explain its purpose
4. **Stay framework-agnostic in Stitch prompts** — Stitch generates HTML; the conversion to Symbiote happens later
5. **Validate with Project Graph MCP** — After creating components from this design system, run the full validation workflow (see `resources/project-graph-workflow.md` at project root):
   - `check_custom_rules(path)` — validates Symbiote.js conventions
   - `get_full_analysis(path)` — Health Score ≥ 80

## Common Pitfalls to Avoid

- ❌ Using Tailwind class names as design tokens
- ❌ Omitting the Stitch Prompt Block (Section 5)
- ❌ Describing colors without hex codes
- ❌ Using CSS class selectors instead of custom element tag selectors
- ❌ Forgetting to document the component pattern mapping
