# react-window-size-listener

A minimalistic, modern React hook for listening to window resize events with built-in debouncing.

## Features

- **Minimalistic**: Tiny footprint, no external dependencies (removed lodash).
- **Modern**: Written in TypeScript, built as a React Hook.
- **Performant**: Built-in debouncing to prevent excessive re-renders.
- **SSR Safe**: Checks for `window` existence, safe to use in Next.js/Gatsby/Remix.

## Installation

```sh
npm install react-window-size-listener
# or
yarn add react-window-size-listener
# or
pnpm add react-window-size-listener
```

## Usage

### `useWindowSize`

Returns the current `window.innerWidth` and `window.innerHeight`.

```jsx
import { useWindowSize } from 'react-window-size-listener';

function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window: {width} x {height}</p>
    </div>
  );
}
```

### `useViewportSize`

Returns the visual viewport size using the [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API). This accounts for pinch-zoom, on-screen keyboards, and browser chrome on mobile devices. Falls back to window dimensions if the API is not available.

```jsx
import { useViewportSize } from 'react-window-size-listener';

function App() {
  const { width, height } = useViewportSize();

  return (
    <div>
      <p>Viewport: {width} x {height}</p>
    </div>
  );
}
```

### Configuration

Both hooks accept an options object to customize the debounce time (default: `100ms`).

```jsx
const { width, height } = useWindowSize({ debounceTime: 500 });
const { width, height } = useViewportSize({ debounceTime: 500 });
```

## API

### `useWindowSize(options?)`

Tracks `window.innerWidth` and `window.innerHeight`.

### `useViewportSize(options?)`

Tracks the visual viewport dimensions (with fallback to window dimensions).

#### Parameters

- `options` (optional): `UseWindowSizeOptions`
  - `debounceTime` (number): Milliseconds to wait after the last resize event. Default: `100`.

#### Returns

- `{ width: number, height: number }`

## Migration from v1

The old Class Component `WindowSizeListener` and HOC `withWindowSizeListener` have been removed in favor of hooks.

**Old way (v1):**
```jsx
<WindowSizeListener onResize={windowSize => console.log(windowSize)} />
```

**New way (v2+):**
```jsx
const { width, height } = useWindowSize();
useEffect(() => {
  console.log({ width, height });
}, [width, height]);
```

## License

MIT
