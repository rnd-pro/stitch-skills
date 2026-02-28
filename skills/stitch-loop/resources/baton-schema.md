# Baton Schema — next-prompt.md

The baton file uses YAML frontmatter + Markdown body format.

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `page` | Yes | Component name (PascalCase → directory name) |
| `route` | Yes | URL path pattern for AppRouter |

## Body Format

The body contains the full Stitch prompt with these sections:

1. **Description** (1-2 lines) — What the page is about
2. **DESIGN SYSTEM (REQUIRED)** — Copy from DESIGN.md Section 5
3. **Page Structure** — Numbered sections describing the layout

## Example

```markdown
---
page: settings
route: /settings
---
A user settings page with tabs for profile, notifications, and integrations.

**DESIGN SYSTEM (REQUIRED):**
[Paste design system block from DESIGN.md]

**Page Structure:**
1. **Header:** Navigation with active "Settings" tab
2. **Tab Bar:** Profile | Notifications | Integrations
3. **Content Area:** Form fields for the active tab
4. **Footer:** Save/Cancel buttons
```

## Rules

- `page` field determines output directory: `src/pages/{Page}/`
- `route` field is used in AppRouter routing map
- The DESIGN SYSTEM block MUST be included for visual consistency
- Always include page structure with numbered sections
