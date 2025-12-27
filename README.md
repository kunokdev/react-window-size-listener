# react-window-size-listener

A minimalistic, modern React hook for listening to window resize events with built-in debouncing.

[![npm version](https://img.shields.io/npm/v/react-window-size-listener.svg)](https://www.npmjs.com/package/react-window-size-listener)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Minimalistic**: Tiny footprint (~500 bytes gzipped), no external dependencies
- **Modern**: Written in TypeScript, built as a React Hook
- **Performant**: Built-in debouncing to prevent excessive re-renders
- **SSR Safe**: Works with Next.js, Gatsby, Remix, and other SSR frameworks
- **Tree-shakeable**: Marked as side-effect free for optimal bundling

## Installation

```sh
npm install react-window-size-listener
# or
yarn add react-window-size-listener
# or
pnpm add react-window-size-listener
```

## Usage

### Basic Usage

```tsx
import { useWindowSize } from 'react-window-size-listener';

function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
```

### Custom Debounce Time

```tsx
// Wait 500ms after the last resize event before updating
const { width, height } = useWindowSize({ debounceTime: 500 });
```

### Responsive Breakpoints

```tsx
function useBreakpoint() {
  const { width } = useWindowSize();

  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
}
```

### With SSR/Next.js

The hook is SSR-safe out of the box. During server-side rendering, it returns `{ width: 0, height: 0 }` and updates to the actual window size on the client after hydration.

```tsx
// Works in Next.js App Router
'use client';

import { useWindowSize } from 'react-window-size-listener';

export function ClientComponent() {
  const { width } = useWindowSize();

  // width will be 0 during SSR, then update on client
  return <div>Width: {width || 'Loading...'}</div>;
}
```

## API

### `useWindowSize(options?)`

#### Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debounceTime` | `number` | `100` | Time in milliseconds to wait after the last resize event before updating state |

#### Returns

```ts
interface WindowSize {
  width: number;
  height: number;
}
```

#### TypeScript Types

The package exports TypeScript types for full type safety:

```ts
import { useWindowSize, WindowSize, UseWindowSizeOptions } from 'react-window-size-listener';
```

## Migration from v1

Version 1.6.0 is a complete rewrite. The old Class Component `WindowSizeListener` and HOC `withWindowSizeListener` have been removed in favor of the `useWindowSize` hook.

**Before (v1):**
```jsx
<WindowSizeListener onResize={windowSize => console.log(windowSize)} />
```

**After (v1.6+):**
```tsx
const { width, height } = useWindowSize();

useEffect(() => {
  console.log({ width, height });
}, [width, height]);
```

## Browser Support

Supports all modern browsers. For older browsers, ensure you have appropriate polyfills for `window.addEventListener`.

## License

MIT © [Krunoslav Banovac](https://github.com/kunokdev)

Originally created by [Cesar Andreu](https://github.com/cesarandreu)
