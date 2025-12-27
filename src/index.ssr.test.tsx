// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { useWindowSize } from './index';

function TestComponent() {
  const { width, height } = useWindowSize();
  return <div>{`w:${width},h:${height}`}</div>;
}

describe('useWindowSize SSR', () => {
  it('should render with initial values (0,0) on server', () => {
    const html = renderToString(<TestComponent />);
    expect(html).toContain('w:0,h:0');
  });
});
