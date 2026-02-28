# Symbiote.js 3.x — Quick Reference

> Derived from the official [AI_REFERENCE.md](https://github.com/symbiotejs/symbiote.js/blob/main/AI_REFERENCE.md) (v3.0.0-rc.1).
> Zero dependencies. ~6 KB gzip. ESM only.

## Installation & Import

```js
// NPM (recommended)
import Symbiote, { html, css, PubSub } from '@symbiotejs/symbiote';

// Individual modules (tree-shaking)
import Symbiote from '@symbiotejs/symbiote/core/Symbiote.js';
import { AppRouter } from '@symbiotejs/symbiote/core/AppRouter.js';
import { html } from '@symbiotejs/symbiote/core/html.js';
import { css } from '@symbiotejs/symbiote/core/css.js';
import { PubSub } from '@symbiotejs/symbiote/core/PubSub.js';

// CDN
import Symbiote, { html, css } from 'https://esm.run/@symbiotejs/symbiote';
```

Full export list: `Symbiote` (default), `html`, `css`, `PubSub`, `AppRouter`, `DICT`, `UID`, `setNestedProp`, `applyStyles`, `applyAttributes`, `create`, `kebabToCamel`, `reassignDictionary`

---

## Template Binding Syntax

The `html` tagged template literal supports two interpolation modes:
- **Object** → converted to reactive `bind="prop:key;"` attribute
- **string/number** → concatenated as-is (useful for SSR)

### Text node binding
```html
<div>{{propName}}</div>
<!-- Multiple bindings: {{first}} - {{second}} -->
```

### Property binding
```html
<button ${{onclick: 'handlerName'}}>Click</button>
<div ${{textContent: 'myProp'}}></div>
```
Keys = DOM element properties. Values = component state property names (strings).

### Attribute binding (`@` prefix)
```html
<div ${{'@hidden': 'isHidden'}}>Content</div>
<input ${{'@disabled': 'isDisabled'}}>
<div ${{'@data-value': 'myValue'}}></div>
```
Boolean: `true` → attribute present, `false` → removed.

### Type casting
```html
<div ${{'@hidden': '!showContent'}}>...</div>     <!-- inverted boolean -->
<div ${{'@contenteditable': '!!hasText'}}>...</div> <!-- cast to boolean -->
```

### Nested property binding
```html
<div ${{'style.color': 'colorProp'}}>Text</div>
```

### Direct child state binding
```html
<child-comp ${{'$.innerProp': 'parentProp'}}></child-comp>
```

---

## Property Token Prefixes

Prefixes control which data context a binding resolves to:

| Prefix | Meaning | Example | Description |
|--------|---------|---------|-------------|
| _(none)_ | Local state | `{{count}}` | Current component's local context |
| `^` | Parent inherited | `{{^parentProp}}` | Walk up DOM to find nearest component with this prop |
| `*` | Shared context | `{{*sharedProp}}` | Shared via `ctx` attribute or `--ctx` CSS variable |
| `/` | Named context | `{{APP/myProp}}` | Global named context identified by key before `/` |
| `--` | CSS Data | `${{textContent: '--my-css-var'}}` | Read from CSS custom property |
| `+` | Computed | `'+sum': () => ...` | Auto-tracked, recalculated when deps change |

---

## State Management API

### `$` proxy — read/write state
```js
this.$.count = 10;           // publish
let val = this.$.count;      // read
this.$['APP/prop'] = 'x';   // named context
this.$['^parentProp'] = 5;  // parent context
```

### `set$(obj, forcePrimitives?)` — bulk update
```js
this.set$({ name: 'Jane', count: 5 });
// forcePrimitives=true → triggers callbacks even if value unchanged
```

### `sub(prop, handler, init?)` — subscribe to changes
```js
this.sub('count', (val) => {
  console.log('count changed:', val);
});
// init defaults to true (handler called immediately with current value)
```

### Other methods
- `add(prop, val, rewrite?)` — add property to context
- `add$(obj, rewrite?)` — bulk add
- `has(prop)` — check property existence
- `notify(prop)` — force notification to all subscribers

> **WARNING**: Nested dot keys (`prop.sub`) are NOT supported. Use flat names: `propSub`.

---

## PubSub (Named Context)

Global state accessible from any component via `/` prefix:

```js
import { PubSub } from '@symbiotejs/symbiote';

// Register named context
const ctx = PubSub.registerCtx({
  userName: 'Anonymous',
  score: 0,
}, 'GAME');

// Read/write from any component
this.$['GAME/userName'] = 'Player 1';
console.log(this.$['GAME/score']);

// Subscribe from any component
this.sub('GAME/score', (val) => {
  console.log('Score:', val);
});

// Direct PubSub API
ctx.pub('score', 100);
ctx.read('score');
ctx.sub('score', callback);
ctx.multiPub({ score: 100, userName: 'Hero' });
```

### Static methods
- `PubSub.registerCtx(schema, uid?)` → instance
- `PubSub.getCtx(uid, notify?)` → instance or null
- `PubSub.deleteCtx(uid)`

---

## Shared Context (`*` prefix)

Components grouped by the `ctx` HTML attribute share state. Properties with `*` prefix are shared:

```html
<upload-btn ctx="gallery"></upload-btn>
<file-list  ctx="gallery"></file-list>
```

```js
class UploadBtn extends Symbiote {
  init$ = {
    '*files': [],
    onUpload: () => {
      this.$['*files'] = [...this.$['*files'], newFile];
    },
  };
}

class FileList extends Symbiote {
  init$ = {
    '*files': [],  // same shared prop — first-registered value wins
  };
}
```

Both access the same `*files` state — no prop drilling, no global store.

### Context name resolution (first match wins)
1. `ctx="name"` HTML attribute
2. `--ctx` CSS custom property (inherited)
3. No match → `*` props silently skipped

> **WARNING**: `*` properties require explicit `ctx` attribute or `--ctx` CSS variable.

---

## CSS Data Binding

Read CSS custom property values into component state:

```js
class MyComponent extends Symbiote {
  cssInit$ = {
    '--accent-color': '#ff0',  // fallback value
  };
}
```

In template:
```html
<div ${{textContent: '--my-css-prop'}}>...</div>
```

Update with: `this.updateCssData()` / `this.dropCssDataCache()`.

---

## Styling Architecture

### Triple-file structure

Every component is split into three files:

| File | Purpose | Export |
|------|---------|--------|
| `MyCard.js` | Logic, state, lifecycle | `class MyCard extends Symbiote` |
| `MyCard.tpl.js` | Template (HTML) | `html\`...\`` assigned to `MyCard.template` |
| `MyCard.css.js` | Styles (CSS) | `css\`...\`` assigned to `MyCard.rootStyles` |

```js
// MyCard.js
import Symbiote from '@symbiotejs/symbiote';
import { template } from './MyCard.tpl.js';
import { styles } from './MyCard.css.js';

class MyCard extends Symbiote {
  init$ = { title: '' };
}

MyCard.template = template;
MyCard.rootStyles = styles;
MyCard.reg('my-card');
```

Symbiote uses a **two-layer** CSS model:

### Layer 1: Global styles (`<link>` in `index.html`)
CSS reset, `:root` design tokens, accessibility rules. Not Symbiote-specific — regular CSS.
See `resources/global-styles-template.md` for a ready-to-use template.

### Layer 2: Component styles (`rootStyles` / `shadowStyles`)

**rootStyles** — Light DOM (default, recommended):
```js
MyComponent.rootStyles = css`
  my-component {
    display: block;
    color: var(--color-text);
    padding: var(--spacing-md);
  }
`;
```
Styles are added to the document via `adoptedStyleSheets`. Use the **custom tag name** as selector.

**shadowStyles** — Shadow DOM (opt-in, auto-creates Shadow Root):
```js
MyComponent.shadowStyles = css`
  :host {
    display: block;
  }
  button {
    color: red;
  }
`;
```

### Key conventions

- **`display: block`**: Custom Elements default to `display: inline`. Always set `display: block` (or `flex`/`grid`) in `rootStyles`
- **No extra wrappers**: the custom tag IS the wrapper — don't add `<div class="wrapper">` inside
- **Design tokens**: components consume global tokens via `var(--token-name)`
- **No CSS frameworks**: use native CSS with custom properties and modern nesting
- **`css` tag function**: returns a `CSSStyleSheet` instance (constructable stylesheet)

### Exit animations (`animateOut`)
```js
import { animateOut } from '@symbiotejs/symbiote';

// Sets [leaving] attribute, waits for CSS transitionend, removes element
animateOut(element);
```

```css
my-item {
  opacity: 1;
  transition: opacity 0.3s;

  /* Enter animation (CSS-native): */
  @starting-style {
    opacity: 0;
  }

  /* Exit animation (triggered by animateOut): */
  &[leaving] {
    opacity: 0;
  }
}
```

---

## Element References

```js
MyComponent.template = html`
  <input ${{ref: 'nameInput'}}>
  <button ${{ref: 'submitBtn', onclick: 'onSubmit'}}>Submit</button>
`;

// In renderCallback:
this.ref.nameInput.focus();
this.ref.submitBtn.disabled = true;
```

Alternative HTML syntax: `<div ref="myRef"></div>`

---

## Slots (Light DOM)

Slots work without Shadow DOM via `slotProcessor`:

```js
import { slotProcessor } from '@symbiotejs/symbiote/core/slotProcessor.js';

class MyWrapper extends Symbiote {
  constructor() {
    super();
    this.templateProcessors.add(slotProcessor);
  }
}

MyWrapper.template = html`
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
`;
```

Usage:
```html
<my-wrapper>
  <h1 slot="header">Title</h1>
  <p>Default slot content</p>
</my-wrapper>
```

---

## Itemize API (Dynamic Lists)

```js
class MyList extends Symbiote {
  init$ = {
    items: [
      { name: 'Alice', role: 'Admin' },
      { name: 'Bob', role: 'User' },
    ],
    onItemClick: (e) => {
      console.log('clicked');
    },
  };
}

MyList.template = html`
  <ul ${{itemize: 'items'}}>
    <template>
      <li>
        <span>{{name}}</span> - <span>{{role}}</span>
        <button ${{onclick: '^onItemClick'}}>Click</button>
      </li>
    </template>
  </ul>
`;
```

> **CRITICAL**: Items are full Symbiote components with their own state scope.
> - `{{name}}` — item's own property
> - `${{onclick: '^handler'}}` — use `^` prefix for **parent** component handlers
> - Without `^`, event bindings look in the item's scope and break

### Custom item component
```html
<div ${{itemize: 'items', 'item-tag': 'my-item'}}></div>
```

### Data formats
- **Array**: `[{prop: val}, ...]` — items rendered in order
- **Object**: `{key1: {prop: val}, ...}` — items get `_KEY_` property

### Updating lists
```js
this.$.items = [...newItems]; // assign new array to trigger re-render
```

---

## Attribute Binding

Bind HTML attributes to component state:

```js
class MyComponent extends Symbiote {
  init$ = {
    '@name': '',  // reads from HTML attribute `name` automatically
  };
}

// Explicit attribute mapping
MyComponent.bindAttributes({
  'value': 'inputValue',  // maps attr `value` → state prop `inputValue`
});
// observedAttributes is auto-populated
```

---

## Computed Properties

```js
// Local computed — auto-tracks dependencies
init$ = {
  a: 1,
  b: 2,
  '+sum': () => this.$.a + this.$.b,
};

// Cross-context computed — explicit deps
init$ = {
  local: 0,
  '+total': {
    deps: ['GAME/score'],
    fn: () => this.$['GAME/score'] + this.$.local,
  },
};
```

> Computed values recalculate asynchronously (via `queueMicrotask`).

---

## SSR (Server-Side Rendering)

```js
import { SSR } from '@symbiotejs/symbiote/node/SSR.js';

await SSR.init();                  // patches globals with linkedom env
await import('./my-component.js'); // component reg() works normally

let html = await SSR.processHtml('<my-component></my-component>');

SSR.destroy();                     // cleanup globals
```

### API
| Method | Description |
|--------|-------------|
| `SSR.init()` | Create linkedom document, polyfill APIs |
| `SSR.processHtml(html)` | Render all custom elements in HTML string |
| `SSR.renderToString(tag, attrs?)` | Render single component to HTML |
| `SSR.renderToStream(tag, attrs?)` | Async generator yielding HTML chunks |
| `SSR.destroy()` | Remove global patches |

### Hydration flow
1. **Server**: `SSR.processHtml()` produces HTML with `bind=` attributes preserved
2. **Client**: component with `ssrMode = true` skips template injection, hydrates existing DOM
3. State mutations update DOM reactively

### Styles in SSR output
- **rootStyles** → `<style>` tag as first child (light DOM)
- **shadowStyles** → `<style>` inside Declarative Shadow DOM `<template>`

---

## Routing (AppRouter)

### Path-based routing (recommended)
```js
import { AppRouter } from '@symbiotejs/symbiote/core/AppRouter.js';

const routerCtx = AppRouter.initRoutingCtx('R', {
  home:     { pattern: '/',            title: 'Home', default: true },
  user:     { pattern: '/users/:id',   title: 'User Profile' },
  settings: { pattern: '/settings',    title: 'Settings' },
  notFound: { pattern: '/404',         title: 'Not Found', error: true },
});

// Navigate programmatically
AppRouter.navigate('user', { id: '42' });
// URL becomes: /users/42

// React to route changes in any component
this.sub('R/route', (route) => console.log('Route:', route));
this.sub('R/options', (opts) => console.log('Params:', opts)); // { id: '42' }
```

### Route guards
```js
let unsub = AppRouter.beforeRoute((to, from) => {
  if (!isAuth && to.route === 'settings') {
    return 'login'; // redirect
  }
  // return false to cancel, nothing to proceed
});
unsub(); // remove guard
```

### Lazy loaded routes
```js
AppRouter.initRoutingCtx('R', {
  settings: {
    pattern: '/settings',
    title: 'Settings',
    load: () => import('./pages/settings.js'), // loaded once, cached
  },
});
```

### AppRouter API
- `AppRouter.initRoutingCtx(ctxName, routingMap)` → PubSub
- `AppRouter.navigate(route, options?)` — navigate and dispatch event
- `AppRouter.reflect(route, options?)` — update URL without triggering event
- `AppRouter.notify()` — read URL, run guards, lazy load, dispatch event
- `AppRouter.beforeRoute(fn)` — register guard, returns unsubscribe fn
- `AppRouter.setRoutingMap(map)` — extend routes
- Mode auto-detected: routes with `pattern` → path-based, without → query-string

---

## Lifecycle & Constructor Flags

### Lifecycle callbacks
| Method | When called |
|--------|-------------|
| `initCallback()` | After state initialized, before render |
| `renderCallback()` | After template rendered and attached to DOM |
| `destroyCallback()` | On disconnect (if `readyToDestroy=true`) |

### Constructor flags
| Property | Default | Description |
|----------|---------|-------------|
| `pauseRender` | `false` | Skip auto-rendering; call `this.render()` manually |
| `renderShadow` | `false` | Render into Shadow DOM |
| `readyToDestroy` | `true` | Allow cleanup on disconnect |
| `processInnerHtml` | `false` | Process existing inner HTML |
| `ssrMode` | `false` | Hydrate server-rendered HTML |
| `allowCustomTemplate` | `false` | Allow `use-template="#selector"` |
| `isVirtual` | `false` | Replace element with its template fragment |

---

## Dev Mode

```js
Symbiote.devMode = true;
```

**Dev-only warnings:**
- Unresolved binding keys (likely typos)
- `*prop` without `ctx` attribute
- `*prop` value conflicts between components

---

## Security (Trusted Types)

Symbiote creates a passthrough Trusted Types policy automatically:
```
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types symbiote
```

Policy name: `'symbiote'`. No sanitization — templates are developer-authored.

---

## Common Mistakes

1. **DON'T** use `this` in template strings — templates are decoupled from component context
2. **DON'T** nest property keys with dots: `'obj.prop'` → use `objProp`
3. **DON'T** forget `^` prefix for parent handlers in itemize
4. **DON'T** use `@` in plain HTML — only in binding syntax `${{'@attr': 'prop'}}`
5. **DON'T** treat `init$` as a regular object — it's processed at connection time
6. **DON'T** define `template` inside class body — assign outside: `MyComp.template = html\`...\``. Same for `rootStyles` and `shadowStyles`
7. **DON'T** expect Shadow DOM by default — opt in with `renderShadow` or `shadowStyles`
8. **DON'T** wrap Custom Elements in extra divs — the tag IS the wrapper
9. **DON'T** use CSS frameworks — use native CSS with custom properties
10. **DON'T** use `require()` — ESM only
11. **DON'T** use `*prop` without `ctx` attribute — shared context won't be created
