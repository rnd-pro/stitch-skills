# Project Graph MCP — Validation Workflow

This document describes the complete workflow for using Project Graph MCP to validate and verify Symbiote.js components generated from Stitch designs.

> **Project Graph MCP** ([project-graph-mcp](https://github.com/rnd-pro/project-graph-mcp)) — MCP server for AI agents providing project graph, code quality analysis, and framework-specific lint rules.

## Quick Start

```
1. get_skeleton("src/")        → Understand structure (10-50x compressed)
2. get_full_analysis("src/")   → Find issues, get Health Score (0-100)
3. check_custom_rules("src/")  → Framework-specific violations (auto-detects Symbiote)
4. Fix by severity: error → warning → info
5. get_pending_tests("src/")   → Verification checklist from @test/@expect
```

## Navigation Tools

Use these to understand and navigate the codebase:

| Tool | Purpose | When to Use |
|------|---------|------------|
| `get_skeleton(path)` | Compact project overview (10-50x smaller than source). Shows classes, functions, exports | First step — map the codebase structure |
| `expand(symbol)` | Deep dive into class/function using minified symbol from skeleton | Understand specific component internals |
| `deps(symbol)` | Dependency tree — imports, usedBy, calls | Trace data flow between components |
| `usages(symbol)` | Find all usages of a symbol across project | Check where a component is used |
| `get_focus_zone(path)` | Auto-enriched context from git diff | Review recent changes |

### Skeleton Symbol Legend

The skeleton uses minified symbols (e.g., `SN` = `SymNode`). Each response includes:
- `L` — Legend mapping minified → full names
- `s` — Stats (files, classes, functions)
- `n` — Nodes (classes with method and property counts)
- `e` — Edges (dependencies between nodes)

## Code Quality Tools

Run after creating/converting components:

| Tool | What it Checks | Example Use |
|------|---------------|-------------|
| `get_full_analysis(path)` | **ALL checks + Health Score (0-100)** | Overall project health |
| `get_dead_code(path)` | Unused functions, classes, exports | Cleanup after refactoring |
| `get_complexity(path)` | Cyclomatic complexity (flags >10) | Identify hard-to-maintain code |
| `get_similar_functions(path)` | Duplicate/similar code | Find redundant components |
| `get_large_files(path)` | Files needing split | Enforce modular structure |
| `get_outdated_patterns(path)` | Legacy patterns, redundant npm deps | Modernize code |
| `get_undocumented(path)` | Missing JSDoc annotations | Documentation coverage |
| `generate_jsdoc(path)` | Auto-generate JSDoc templates | Quickly add docs with @test/@expect |

## Custom Rules (Auto-Detected)

Project Graph MCP includes a **Symbiote 3.x** ruleset (17 rules) that auto-detects when code extends Symbiote:

```
check_custom_rules("src/")
→ Auto-detects Symbiote usage
→ Applies symbiote-3x.json ruleset
→ Returns violations with severity + fix suggestions
```

### Symbiote-Specific Rules Checked

- Template assigned via static setter (not inside class body)
- Triple-file structure compliance
- `rootStyles` / `shadowStyles` assigned outside class
- No `require()` usage (ESM only)
- Proper `init$` patterns
- No wrapper div excess

### Adding Custom Rules

```
set_custom_rule({
  ruleSet: "symbiote-3x",
  rule: {
    id: "triple-file-check",
    name: "Triple-File Structure",
    description: "Component must have .js, .tpl.js, .css.js files",
    pattern: "class.*extends Symbiote",
    patternType: "regex",
    replacement: "Split into triple-file: Component.js, Component.tpl.js, Component.css.js",
    severity: "error",
    filePattern: "*.js"
  }
})
```

## Test Annotations System

Add `@test` and `@expect` JSDoc annotations to interactive methods, then verify through browser or automated testing:

### Adding Annotations

```javascript
/**
 * Toggle card expanded state
 *
 * @test click: Click the card header to expand
 * @test key: Press Enter on focused card
 * @expect attr: [expanded] attribute appears on card
 * @expect visual: Content section becomes visible
 * @expect behavior: Other cards remain unchanged
 */
toggleExpand() {
  this.$.isExpanded = !this.$.isExpanded;
}
```

### Test Types

| Category | Types | Use For |
|----------|-------|---------|
| **Browser/UI** | `click`, `key`, `drag`, `type`, `scroll`, `hover` | Interactive components |
| **API** | `request`, `call`, `invoke`, `mock` | Data fetching, external services |
| **CLI** | `run`, `exec`, `spawn`, `input` | Build scripts, tooling |
| **Integration** | `setup`, `action`, `teardown`, `wait` | System-level tests |

### Expect Types

| Category | Types | Validates |
|----------|-------|-----------|
| **Browser/UI** | `attr`, `visual`, `element`, `text` | DOM state, appearance |
| **API** | `status`, `body`, `headers`, `error` | Response correctness |
| **CLI** | `output`, `exitcode`, `file`, `stderr` | Command results |
| **Integration** | `state`, `log`, `event`, `db` | System state changes |

### Verification Workflow

```
1. get_pending_tests("src/")
   → [{ id: "toggleExpand.0", type: "click", description: "Click the card header" }]

2. Execute each test step (browser tool for UI tests)

3. mark_test_passed("toggleExpand.0")
   — or —
   mark_test_failed("toggleExpand.0", "Attribute not set")

4. get_test_summary("src/")
   → { total: 12, passed: 10, failed: 1, pending: 1, progress: 83 }
```

## Complete Validation Checklist

After converting Stitch screens to Symbiote components, run this full sequence:

```
Step 1: Structure
  get_skeleton("src/")
  → Verify all components appear as classes
  → Check function/method counts are reasonable

Step 2: Health Score
  get_full_analysis("src/")
  → Target: Health Score ≥ 80
  → Review dead code, complexity, duplicates

Step 3: Convention Compliance
  check_custom_rules("src/")
  → Fix all 'error' severity violations
  → Review 'warning' items

Step 4: Documentation
  get_undocumented("src/")
  → Add JSDoc to public methods
  → Add @test/@expect to interactive handlers

Step 5: Test Verification
  get_pending_tests("src/")
  → Execute each test through browser
  → Mark as passed/failed
  → get_test_summary("src/") for final report
```

## Filter Configuration

Exclude files from analysis:

```
# View current filters
get_filters()

# Add exclusions
add_excludes(["dist", "node_modules", "queue"])

# Project-specific: create .graphignore file
# (same syntax as .gitignore)
echo "queue/*" > .graphignore
```
