---
name: symbiote:components
description: Converts Stitch designs into modular Symbiote.js 3.x components using triple-file architecture, CSS custom properties, and Project Graph MCP validation.
allowed-tools:
  - "stitch*:*"
  - "project-graph*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to Symbiote Components

You are a frontend engineer focused on transforming Stitch designs into clean Symbiote.js 3.x components. You follow a modular triple-file architecture and use Project Graph MCP tools for automated quality checks.

## Retrieval and Networking

1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix (e.g., `mcp_StitchMCP_`).
2. **Metadata fetch**: Call `[prefix]get_screen` to retrieve the design JSON.
3. **Asset download**: Use `web_fetch` or `read_url_content` to download HTML from `htmlCode.downloadUrl`.
4. **Visual audit**: Check `screenshot.downloadUrl` to confirm the design intent and layout details.

## Architectural Rules

### Triple-File Standard (MANDATORY)
Every component MUST be split into exactly three files:

```text
src/components/TaskCard/
├── TaskCard.js       — Class logic only (extends Symbiote)
├── TaskCard.tpl.js   — Template (html tagged template)
└── TaskCard.css.js   — Styles (css tagged template)
```

### Core Conventions
* **Custom Elements**: Every component is a Custom Element registered with `.reg('tag-name')`
* **ESM only**: Use `import/export`. Never `require()`
* **No Tailwind**: Use native CSS with custom properties (design tokens from `DESIGN.md`)
* **No BEM**: Use custom tag names and attribute selectors as CSS selectors
* **No wrapper divs**: The custom tag IS the wrapper element
* **No CSS frameworks**: Pure CSS with modern nesting
* **JSDoc in English**: Document in JSDoc, no TypeScript files
* **Template outside class**: `MyComp.template = html\`...\`` — NEVER inside the class body

### Style Mapping
* Extract colors, spacing, and typography from the Stitch HTML `<head>` or inline styles
* Map all values to CSS custom properties defined in `DESIGN.md` (or create them if missing)
* Use `rootStyles` for Light DOM components (default)
* Use `shadowStyles` only when style isolation is critical

### Data Decoupling
* Move all static text, image URLs, and list data into separate data files
* Use Symbiote's named context (PubSub) for shared application state
* Use local `init$` for component-specific state

## Component Template

Use `resources/component-template.js` as a starting point. Replace `StitchComponent` with the actual component name.

### Template File Pattern (`Component.tpl.js`)

```javascript
import { html } from '@symbiotejs/symbiote';

export const template = html`
  <header>
    <h2>{{title}}</h2>
    <span>{{description}}</span>
  </header>
  <div ${{onclick: 'onAction'}}>
  </div>
`;
```

> **NOTE**: Light DOM slots require explicit `slotProcessor` setup in v3.x:
> ```js
> import { slotProcessor } from '@symbiotejs/symbiote/core/slotProcessor.js';
> constructor() { super(); this.templateProcessors.add(slotProcessor); }
> ```

### Styles File Pattern (`Component.css.js`)

```javascript
import { css } from '@symbiotejs/symbiote';

export const styles = css`
  my-component {
    display: block;
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);

    & header {
      margin-block-end: var(--spacing-sm);
    }

    & h2 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    &:hover {
      box-shadow: var(--shadow-md);
      transition: box-shadow var(--transition-fast);
    }

    &[hidden] {
      display: none !important;
    }
  }
`;
```

### Logic File Pattern (`Component.js`)

```javascript
import Symbiote from '@symbiotejs/symbiote';
import { template } from './Component.tpl.js';
import { styles } from './Component.css.js';

export class MyComponent extends Symbiote {
  init$ = {
    title: '',
    description: '',
    // Event handlers: init$ arrow functions checked first, then class methods as fallback
    onAction: () => {
      console.log('Action triggered');
    },
  };
}

MyComponent.template = template;
MyComponent.rootStyles = styles;
MyComponent.reg('my-component');
```

### Key v3.x Features

**Event handler resolution:** For `on*` bindings, Symbiote first looks in `init$`, then falls back to class methods:
```javascript
class MyComponent extends Symbiote {
  init$ = { onClick: () => console.log('via init$') };
  onSubmit() { console.log('via class method fallback'); }
}
```

**Computed properties** (`+` prefix, auto-tracked):
```javascript
init$ = {
  a: 1,
  b: 2,
  '+sum': () => this.$.a + this.$.b, // recalculates when a or b change
};
```

**Exit animations** (`animateOut`):
```javascript
import { animateOut } from '@symbiotejs/symbiote';
// Sets [leaving] attribute, waits for CSS transitionend, then removes element
```
```css
my-item {
  transition: opacity 0.3s;
  &[leaving] { opacity: 0; }
}
```

## Execution Steps

1. **Read DESIGN.md**: If exists, load the CSS custom properties and component patterns.
2. **Download Stitch HTML**: Fetch the HTML source from the screen's `htmlCode.downloadUrl`.
3. **Analyze structure**: Identify repeating UI patterns, sections, and interactive elements.
4. **Plan components**: Map each pattern to a Symbiote component with a custom element tag name.
5. **Create data layer**: Extract static content into data files or named contexts.
6. **Draft components**: Create each component using the triple-file structure.
7. **Wire entry point**: Create a root component (e.g., `app-root`) that composes all sub-components.
8. **Validate with Project Graph MCP** (see `resources/project-graph-workflow.md` at project root):
   - `get_skeleton(path)` — verify all components appear, check structure
   - `get_full_analysis(path)` — target Health Score ≥ 80
   - `check_custom_rules(path)` — auto-detects Symbiote, applies convention rules
   - `get_dead_code(path)` — cleanup unused exports after refactoring
   - `get_undocumented(path)` — verify JSDoc coverage
9. **Add test annotations** to interactive handlers:
   ```javascript
   /**
    * @test click: Click the action button
    * @expect visual: Status badge changes color
    */
   ```
10. **Run test checklist**:
   - `get_pending_tests(path)` — list all @test/@expect annotations
   - Execute each test step (browser tool for UI)
   - `mark_test_passed(testId)` / `mark_test_failed(testId, reason)`
   - `get_test_summary(path)` — verify all tests pass
11. **Visual verify**: Compare the assembled page against the Stitch screenshot.

## Conversion Rules: Stitch HTML → Symbiote

### HTML Structure
| Stitch HTML | Symbiote Equivalent |
|-------------|---------------------|
| `<div class="card">` | `<ui-card>` (Custom Element) |
| `<div class="card-header">` | Remove wrapper if unnecessary, use `<header>` inside template |
| `class="text-lg font-bold"` | CSS: `font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);` |
| `class="bg-blue-500"` | CSS: `background: var(--color-primary);` |
| `class="rounded-lg"` | CSS: `border-radius: var(--radius-lg);` |
| `class="shadow-md"` | CSS: `box-shadow: var(--shadow-md);` |
| `class="p-4"` | CSS: `padding: var(--spacing-md);` |
| `class="flex gap-4"` | CSS: `display: flex; gap: var(--spacing-md);` |
| `class="hidden"` | Attribute binding: `${{'@hidden': 'isHidden'}}` |
| `onclick="..."` | Binding: `${{onclick: 'handlerName'}}` |

### Interactivity
| Pattern | Symbiote Implementation |
|---------|------------------------|
| Show/Hide | `${{'@hidden': '!isVisible'}}` in template, `isVisible` in `init$` |
| Dynamic text | `{{propertyName}}` in template |
| Click handler | `${{onclick: 'onClickHandler'}}` → method in class or `init$` |
| List rendering | `${{itemize: 'items'}}` with `<template>` inside (use `^` for parent handlers) |
| Custom item tag | `${{itemize: 'items', 'item-tag': 'my-item'}}` (inside binding block, not HTML attribute) |
| Form input | `${{oninput: 'onInput'}}` with ref for value |

## Troubleshooting

* **Styles not applied**: Ensure `rootStyles` is set OUTSIDE the class body
* **Template not rendering**: Ensure `template` is assigned via the static setter, not inside the class
* **Events not firing in lists**: Use `^` prefix for parent handlers in itemize templates: `${{onclick: '^parentHandler'}}`
* **Hidden not working**: Add `&[hidden] { display: none !important; }` if component has custom display

## Quality Checklist

Before delivering, verify all items from `resources/architecture-checklist.md`:
- [ ] Triple-file split for every component
- [ ] No Tailwind classes anywhere
- [ ] All colors use CSS custom properties
- [ ] All spacing uses CSS custom properties
- [ ] Custom tag name selectors (no BEM classes)
- [ ] Native CSS nesting used
- [ ] No unnecessary wrapper divs
- [ ] Template assigned outside class body
- [ ] Event handlers properly bound
- [ ] `Project Graph MCP` analysis passes
