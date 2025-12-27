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

This hook returns an object containing the current `width` and `height` of the window.

```jsx
import React from 'react';
import { useWindowSize } from 'react-window-size-listener';

function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h1>Window Size</h1>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
    </div>
  );
}
```

### Configuration

You can customize the debounce time by passing an options object. The default is `100ms`.

```jsx
// Wait 500ms after the last resize event before updating state
const { width, height } = useWindowSize({ debounceTime: 500 });
```

## API

### `useWindowSize(options?)`

#### Parameters

- `options` (optional): `UseWindowSizeOptions`
  - `debounceTime` (number): Amount of time in milliseconds to wait before updating the state after the last resize event. Default: `100`.

#### Returns

- `WindowSize`: `{ width: number, height: number }`

## Migration from v1

Version 1.6.0 is a complete rewrite. The old Class Component `WindowSizeListener` and HOC `withWindowSizeListener` have been removed in favor of the `useWindowSize` hook.

**Old way (v1):**
```jsx
<WindowSizeListener onResize={windowSize => console.log(windowSize)} />
```

**New way (v1.6+):**
```jsx
const { width, height } = useWindowSize();
useEffect(() => {
  console.log({ width, height });
}, [width, height]);
```

## License

MIT
