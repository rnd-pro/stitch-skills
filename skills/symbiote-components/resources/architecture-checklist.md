# Architecture Checklist — Symbiote Components

Use this checklist after converting Stitch screens to Symbiote.js components.

## File Structure
- [ ] Every component uses triple-file split: `.js`, `.tpl.js`, `.css.js`
- [ ] Components organized in named directories: `src/components/ComponentName/`
- [ ] Entry point (`app-root`) wires all sub-components

## Symbiote.js 3.x Compliance
- [ ] `template` assigned OUTSIDE class body via static setter
- [ ] `rootStyles` assigned OUTSIDE class body via static setter
- [ ] Component registered with `.reg('tag-name')`
- [ ] Tag names use kebab-case with at least one hyphen
- [ ] ESM imports only (`import/export`, never `require`)
- [ ] Event handlers in `init$` initialized as functions (not `null`)
- [ ] `^` prefix used for parent handlers in itemize templates

## CSS Quality
- [ ] All colors reference CSS custom properties (`var(--color-*)`)
- [ ] All spacing uses design tokens (`var(--spacing-*)`)
- [ ] All border-radius uses design tokens (`var(--radius-*)`)
- [ ] Custom tag name used as CSS selector (not class/id)
- [ ] Native CSS nesting with `&`
- [ ] Attribute selectors used for state variants (`[data-status='active']`)
- [ ] `[hidden]` override rule present if component uses custom `display`
- [ ] No Tailwind classes
- [ ] No BEM naming
- [ ] No CSS frameworks

## HTML/Template Quality
- [ ] No unnecessary wrapper `<div>` elements
- [ ] Single `${{ }}` binding block per element
- [ ] Text bindings use `{{propName}}` syntax
- [ ] Attribute bindings use `@` prefix: `${{'@attr': 'prop'}}`
- [ ] Boolean inversions use `!` prefix: `${{'@hidden': '!isVisible'}}`

## Data Architecture
- [ ] Static content extracted to data files
- [ ] Shared state uses named PubSub context
- [ ] No hardcoded text in templates (use state properties)
