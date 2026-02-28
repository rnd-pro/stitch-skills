---
name: stitch-loop
description: Generates a complete multi-page Symbiote.js SPA from a single prompt using Stitch, with autonomous baton system and AppRouter integration.
allowed-tools:
  - "stitch*:*"
  - "project-graph*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch Build Loop

You are an autonomous website builder that generates a multi-page Symbiote.js SPA through iterative Stitch screen generation.

## Overview

The Build Loop pattern enables continuous, autonomous website development through a "baton" system. Each iteration:
1. Reads the current task from a baton file (`next-prompt.md`)
2. Generates a page using Stitch MCP tools
3. Converts HTML to a Symbiote.js page component
4. Integrates the page into the SPA with AppRouter
5. Writes the next task to the baton file for the next iteration

## Prerequisites

**Required:**
- Access to the Stitch MCP Server
- Access to the Project Graph MCP Server
- A Stitch project (existing or will be created)
- A `DESIGN.md` file (generate one using the `design-md` skill if needed)
- A `SITE.md` file documenting the site vision and roadmap

**Optional:**
- Browser tool — enables visual verification of generated pages

## The Baton System

The `next-prompt.md` file acts as a relay baton between iterations:

```markdown
---
page: about
route: /about
---
An about page describing the team and mission.

**DESIGN SYSTEM (REQUIRED):**
[Copy from DESIGN.md Section 5]

**Page Structure:**
1. Header with navigation
2. Team member grid with avatar cards
3. Mission statement section
4. Footer with links
```

**Critical rules:**
- The `page` field determines the component and file name
- The `route` field sets the AppRouter path pattern
- The prompt must include the design system block from `DESIGN.md`
- You MUST update this file before completing to continue the loop

## Execution Protocol

### Step 1: Read the Baton

Parse `next-prompt.md` to extract:
- **Page name** from `page` frontmatter
- **Route path** from `route` frontmatter
- **Prompt content** from the markdown body

### Step 2: Consult Context Files

Before generating, read these files:

| File | Purpose |
|------|---------|
| `SITE.md` | Site vision, **Stitch Project ID**, existing pages (sitemap), roadmap |
| `DESIGN.md` | Required visual style and CSS custom properties for Stitch prompts |

**Important checks:**
- Section 4 (Sitemap) — Do NOT recreate pages that already exist
- Section 5 (Roadmap) — Pick tasks from here if backlog exists
- Section 6 (Creative Freedom) — Ideas for new pages if roadmap is empty

### Step 3: Generate with Stitch

1. **Discover namespace**: Run `list_tools` to find the Stitch MCP prefix
2. **Get or create project**:
   - If `stitch.json` exists, use the `projectId` from it
   - Otherwise, call `[prefix]create_project` and save the ID to `stitch.json`
3. **Generate screen**: Call `[prefix]generate_screen_from_text` with:
   - `projectId`: The project ID
   - `prompt`: The full prompt from the baton (including design system block)
   - `deviceType`: `DESKTOP` (or as specified)
4. **Retrieve assets**: Call `[prefix]get_screen` to get:
   - `htmlCode.downloadUrl` — Download and save as `queue/{page}.html`
   - `screenshot.downloadUrl` — Download and save as `queue/{page}.png`

### Step 4: Convert to Symbiote Component

Transform the Stitch HTML into a Symbiote.js page component:

1. Create triple-file structure:
   ```
   src/pages/{PageName}/
   ├── {PageName}.js
   ├── {PageName}.tpl.js
   └── {PageName}.css.js
   ```

2. Extract colors and values → map to CSS custom properties from `DESIGN.md`
3. Convert inline styles and framework classes to native CSS using custom properties
4. Use custom element tag names: `page-about`, `page-home`, etc.

### Step 5: Integrate into SPA

1. Register the page component in the AppRouter routing map:

```javascript
import { AppRouter } from '@symbiotejs/symbiote/core/AppRouter.js';

const routerCtx = AppRouter.initRoutingCtx('R', {
  home:    { pattern: '/',        title: 'Home', default: true },
  about:   { pattern: '/about',   title: 'About' },
  // Add new page route here
});
```

2. Add lazy loading for the new page:
```javascript
{pageName}: {
  pattern: '/{route}',
  title: '{Page Title}',
  load: () => import('./pages/{PageName}/{PageName}.js'),
},
```

3. Update navigation links across all pages
4. Ensure consistent headers/footers

### Step 6: Validate with Project Graph MCP

Run the full validation sequence (see `resources/project-graph-workflow.md` at project root):

1. `get_skeleton(path)` — verify page component appears with correct structure
2. `get_full_analysis(path)` — target Health Score ≥ 80
3. `check_custom_rules(path)` — auto-detects Symbiote, validates conventions
4. `get_undocumented(path)` — ensure JSDoc on interactive methods
5. Add `@test` / `@expect` annotations to interactive handlers
6. `get_pending_tests(path)` → execute each test → `mark_test_passed(id)`
7. Optionally, open in browser to compare against Stitch screenshot

### Step 7: Update Site Documentation

Modify `SITE.md`:
- Add the new page to Section 4 (Sitemap) with `[x]`
- Update Section 5 (Roadmap) if you completed a backlog item

### Step 8: Prepare the Next Baton (CRITICAL)

**You MUST update `next-prompt.md` before completing.** This keeps the loop alive.

1. **Decide the next page**:
   - Check `SITE.md` Section 5 (Roadmap) for pending items
   - If empty, pick from Section 6 (Creative Freedom)
   - Or invent something new that fits the site vision
2. **Write the baton** with proper YAML frontmatter:

```markdown
---
page: achievements
route: /achievements
---
A competitive achievements page showing developer badges and milestones.

**DESIGN SYSTEM (REQUIRED):**
[Copy the entire design system block from DESIGN.md]

**Page Structure:**
1. Header with title and navigation
2. Badge grid showing unlocked/locked states
3. Progress bars for milestone tracking
```

## File Structure Reference

```text
project/
├── stitch.json              # Stitch project ID and metadata
├── DESIGN.md                # Design system (CSS custom properties)
├── SITE.md                  # Site vision, sitemap, roadmap
├── next-prompt.md           # Current baton for the build loop
├── queue/                   # Raw Stitch HTML files (staging area)
│   ├── home.html
│   └── home.png
├── src/
│   ├── app-root.js          # Root component with AppRouter
│   ├── components/          # Shared components (nav, footer)
│   │   ├── AppNav/
│   │   └── AppFooter/
│   └── pages/               # Page components (one per route)
│       ├── Home/
│       │   ├── Home.js
│       │   ├── Home.tpl.js
│       │   └── Home.css.js
│       └── About/
│           ├── About.js
│           ├── About.tpl.js
│           └── About.css.js
└── index.html               # Entry point with importmap
```

## Common Pitfalls

- ❌ Forgetting to update `next-prompt.md` — breaks the loop
- ❌ Not including the design system block in prompts — inconsistent designs
- ❌ Creating duplicate pages — always check SITE.md sitemap first
- ❌ Using framework CSS classes in converted components — use native CSS with custom properties
- ❌ Hardcoding routes — use AppRouter with `pattern` for path-based routing
