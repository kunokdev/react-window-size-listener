# react-window-size-listener

![npm version](https://img.shields.io/npm/v/react-window-size-listener)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

A minimalistic, modern React hook for listening to window resize events with built-in debouncing.

## Features

- **Minimalistic**: Tiny footprint, no external dependencies (removed lodash).
- **Modern**: Written in TypeScript, built as a React Hook.
- **Performant**: Built-in debouncing and passive event listeners to prevent excessive re-renders and scroll jank.
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

### SSR / Next.js Usage

When using with Next.js App Router, ensure you use the `"use client"` directive since this hook relies on browser APIs.

```tsx
"use client";

import { useWindowSize } from 'react-window-size-listener';

export default function ClientComponent() {
  const { width } = useWindowSize();
  return <div>Window width: {width}</div>;
}
```

### Advanced Example: `useBreakpoint` helper

You can easily compose this hook to create a breakpoint helper.

```tsx
import { useWindowSize } from 'react-window-size-listener';

const useBreakpoint = () => {
  const { width } = useWindowSize();

  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  return 'xl';
};
```

### Configuration

You can customize the debounce time by passing an options object. The default is `100ms`.

```jsx
// Wait 500ms after the last resize event before updating state
const { width, height } = useWindowSize({ debounceTime: 500 });
```

## API

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `options.debounceTime` | `number` | `100` | Delay in ms before updating state after resize |
| **Returns** | `WindowSize` | | Object `{ width: number, height: number }` |

### TypeScript Types

The library exports the following types for your convenience:

```ts
import type { WindowSize, UseWindowSizeOptions } from 'react-window-size-listener';
```

## Migration from v1

Version 2.0.0 is a complete rewrite. The old Class Component `WindowSizeListener` and HOC `withWindowSizeListener` have been removed in favor of the `useWindowSize` hook.

**Old way (v1):**
```jsx
<WindowSizeListener onResize={windowSize => console.log(windowSize)} />
```

**New way (v2.0+):**
```jsx
const { width, height } = useWindowSize();
useEffect(() => {
  console.log({ width, height });
}, [width, height]);
```

## License

MIT
