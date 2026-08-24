# @n3rdw1z4rd/smoke-ui

A tiny JSX runtime with fine-grained, signal-based reactivity. No virtual DOM,
no diffing, no reconciliation — JSX compiles once to real DOM nodes, and
`Signal` subscriptions patch exactly the property that changed.

Think "lil-gui meets React": components are just functions that build DOM
once, and controls hold a live, direct handle into whatever state they're
bound to.

## Quick start (recommended)

The fastest way to a working project is copying the included template — it's
a full Vite + TypeScript scaffold, already wired up, with a working counter
example:

```bash
npm create @n3rdw1z4rd/smoke-ui
```

## Manual setup (existing project)

If you're adding smoke-ui to a project you already have, two things need
wiring up: Vite's JSX transform, and TypeScript's type-checking of JSX.

**1. Install**
```bash
npm install @n3rdw1z4rd/smoke-ui
```

**2. vite.config.ts** — use the included plugin, which sets Vite's Oxc
`jsx.importSource` for you:
```ts
import { defineConfig } from "vite";
import { smoke } from "@n3rdw1z4rd/smoke-ui/vite-plugin";

export default defineConfig({
  plugins: [smoke()],
});
```

**3. tsconfig.json** — this half can't be automated (see note below), so it
still needs to be set by hand:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@n3rdw1z4rd/smoke-ui"
  }
}
```

## Usage

```tsx
import { Signal, computed } from "@n3rdw1z4rd/smoke-ui";

const count = new Signal(0);
const label = computed(() => `Count: ${count.get()}`);

const App = () => (
  <div>
    <h1>{label}</h1>
    <button onClick={() => count.set(count.get() + 1)}>+1</button>
  </div>
);

document.body.append(<App />);
```

## Core concepts

- **`Signal<T>`** — a value container with `.get()`, `.set(value)`, and
  `.subscribe(fn)`. Subscribing calls `fn` immediately with the current
  value, then again on every future change.
- **`computed(calc)`** — a derived, read-only `Signal` whose dependencies are
  discovered automatically by tracking which signals `calc` reads. No
  dependency array required, and dependencies are re-evaluated on every
  recompute, so conditional branches stay correct.
- **`Observable`** — a plain pub/sub primitive with no stored value, for
  one-shot events rather than reactive state.
- **JSX bindings** — pass a `Signal` anywhere a prop, style value, or child
  would normally go, and it will subscribe and patch that one spot directly
  whenever it changes:

```tsx
<input value={nameSignal} onInput={(e) => nameSignal.set(e.target.value)} />
<div style={{ background: colorSignal }}>{countSignal}</div>
<button disabled={isLoadingSignal}>Submit</button>
```

## Known limitations

- No unmount lifecycle: subscriptions created by a component are not
  automatically torn down when its DOM node is removed. Manage cleanup
  yourself for now.
- Direct property mutation, not a command/dispatch pattern — a bound control
  writes straight to the `Signal` (or whatever it's holding), same as
  `lil-gui`. There's no built-in place to intercept or validate writes.

## License

MIT
