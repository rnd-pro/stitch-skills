# Stitch Agent Skills for Symbiote.js

A library of Agent Skills designed to work with the Stitch MCP server and Project Graph MCP for the **Symbiote.js 3.x** ecosystem. Each skill follows the Agent Skills open standard, compatible with Gemini CLI, Claude Code, Cursor, Antigravity, and other MCP-enabled coding agents.

## Installation

Clone the repository and copy the desired skill into your project's `.agent/skills/` directory:

```bash
git clone https://github.com/rnd-pro/stitch-skills.git

# Copy a specific skill
cp -r stitch-skills/skills/symbiote-components .agent/skills/

# Or copy all skills at once
cp -r stitch-skills/skills/* .agent/skills/
```

The agent will automatically discover skills from the `.agent/skills/` directory.

## Available Skills

Skills are listed in recommended workflow order — from prompt enhancement to final video output.

### 1. enhance-prompt
Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context using **CSS custom properties**, and structures output for better generation results.

### 2. design-md
Analyzes Stitch projects and generates comprehensive `DESIGN.md` files documenting design systems using **CSS custom properties** (design tokens) and semantic visual language optimized for Stitch screen generation.

### 3. symbiote-components
Converts Stitch screens to **Symbiote.js 3.x** component systems with triple-file architecture (`Component.js` + `Component.tpl.js` + `Component.css.js`), automated validation via Project Graph MCP, and design token consistency.

### 4. stitch-loop
Generates a complete multi-page SPA from a single prompt using Stitch, with autonomous baton system, **AppRouter** path-based routing integration, and file organization following Symbiote conventions. Combines skills 1–3 in an autonomous loop.

## Typical Workflow

```
enhance-prompt  →  Stitch MCP  →  design-md  →  symbiote-components  →  Project Graph MCP
    (1)              ↕               (2)              (3)                    (validate)
                  generates                        converts
                  screens                          to code
```

Or use **stitch-loop** (4) to automate steps 1–3 in a continuous build cycle.

## Repository Structure

Every directory within `skills/` follows a standardized structure to ensure the AI agent has everything it needs to perform "few-shot" learning and automated quality checks.

```text
stitch-skills/
├── resources/                 — Shared resources across all skills
│   └── project-graph-workflow.md
└── skills/[skill-name]/
    ├── SKILL.md           — The "Mission Control" for the agent
    ├── scripts/           — Executable enforcers (Validation & Networking)
    ├── resources/         — Skill-specific knowledge base
    └── examples/          — The "Gold Standard" syntactically valid references
```

## MCP Tools Pair

This library is designed to work with two MCP servers in tandem:

### Stitch MCP

UI design generation and project management:

| Tool | Purpose |
|------|---------|
| `list_projects` / `get_project` | Discover and access Stitch projects |
| `list_screens` / `get_screen` | Retrieve screen metadata, HTML source, and screenshots |
| `generate_screen_from_text` | Generate new screen designs from text prompts |
| `edit_screens` | Modify existing screens with text instructions |
| `generate_variants` | Create design variants of existing screens |

### Project Graph MCP

Code analysis, quality validation, and framework-specific rules ([GitHub](https://github.com/rnd-pro/project-graph-mcp) · [RND-PRO](https://rnd-pro.com)):

| Tool | Purpose |
|------|---------|
| `get_skeleton` | Compact project overview — 10-50x compression, fits in context window |
| `expand` / `deps` / `usages` | Navigate codebase: deep dive into symbols, trace dependencies |
| `get_full_analysis` | Run ALL quality checks + Health Score (0-100) |
| `get_dead_code` | Find unused functions, classes, exports |
| `get_complexity` | Cyclomatic complexity metrics (flags >10) |
| `get_similar_functions` | Detect code duplicates |
| `check_custom_rules` | Framework-specific lint — auto-detects Symbiote, applies 17 Symbiote 3.x rules |
| `get_pending_tests` | List `@test` / `@expect` annotations for verification |
| `mark_test_passed` / `mark_test_failed` | Track test execution progress |
| `generate_jsdoc` | Auto-generate JSDoc templates with test annotations |

See `resources/project-graph-workflow.md` for the complete validation workflow.

### Test Annotations (`@test` / `@expect`)

A key feature of the Project Graph MCP integration: add JSDoc annotations to interactive methods, then the agent automatically discovers, executes, and tracks tests.

```javascript
/**
 * Toggle card expanded state
 *
 * @test click: Click the card header
 * @test key: Press Enter on focused card
 * @expect attr: [expanded] attribute appears
 * @expect visual: Content section becomes visible
 */
toggleExpand() {
  this.$.isExpanded = !this.$.isExpanded;
}
```

Agent workflow:
```
get_pending_tests("src/")  →  agent executes each step  →  mark_test_passed(id)  →  get_test_summary("src/")
```

Supported test types: `click`, `key`, `drag`, `type`, `scroll`, `hover` (browser), `request`, `call` (API), `run`, `exec` (CLI).
Supported expect types: `attr`, `visual`, `element`, `text` (UI), `status`, `body` (API), `output`, `file` (CLI).

## Technology Stack

- **Symbiote.js 3.x** — Component framework (Custom Elements, ~6KB gzipped)
- **Native CSS** — Custom properties, modern nesting, attribute selectors
- **ESM** — Import/export with importmaps for dependency sharing
- **JSDoc** — Type documentation (no TypeScript)

## Adding New Skills

All new skills need to follow the file structure above to implement the Agent Skills open standard.

### Great candidates for new skills
* **Validation**: Skills that convert Stitch HTML to Symbiote components and validate the triple-file structure.
* **Decoupling Data**: Skills that convert static design content into external data contexts via PubSub.
* **Generate Designs**: Skills that generate new design screens in Stitch from a given data schema.
* **SSR Integration**: Skills that generate Symbiote SSR-ready components with hydration support.
