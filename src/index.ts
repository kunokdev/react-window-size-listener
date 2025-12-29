import { useState, useEffect, useCallback } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export interface UseWindowSizeOptions {
  /**
   * Amount of time in milliseconds to wait before updating the state after the last resize event.
   * Defaults to 100ms.
   */
  debounceTime?: number;
}

/** Check if we're in a browser environment */
const isClient = typeof window !== 'undefined';

/** Get current window dimensions, returns 0x0 on server */
function getWindowSize(): WindowSize {
  if (!isClient) {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/** Get current visual viewport dimensions, with fallback to window */
function getViewportSize(): WindowSize {
  if (!isClient) {
    return { width: 0, height: 0 };
  }
  if (window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height,
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Hook that tracks the window size with optional debouncing.
 *
 * @param options Configuration options
 * @returns Object containing `width` and `height` of the window.
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * const isMobile = width < 768;
 * ```
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  // Initialize with current size (0x0 on server, real values on client)
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize);

  const handleResize = useCallback(() => {
    setWindowSize(getWindowSize());
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    // Update size on mount to handle SSR hydration
    handleResize();

    let timeoutId: number | null = null;

    const debouncedHandleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(handleResize, debounceTime);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('resize', debouncedHandleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime, handleResize]);

  return windowSize;
}

/**
 * Hook that tracks the visual viewport size with optional debouncing.
 * Uses the Visual Viewport API which accounts for pinch-zoom, on-screen keyboards,
 * and browser chrome on mobile devices.
 * Falls back to window.innerWidth/Height if Visual Viewport API is not available.
 *
 * @param options Configuration options
 * @returns Object containing `width` and `height` of the visual viewport.
 *
 * @example
 * ```tsx
 * const { width, height } = useViewportSize();
 * // Accounts for mobile keyboard, pinch-zoom, etc.
 * ```
 */
export function useViewportSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  const [viewportSize, setViewportSize] = useState<WindowSize>(getViewportSize);

  const handleResize = useCallback(() => {
    setViewportSize(getViewportSize());
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    // Update size on mount to handle SSR hydration
    handleResize();

    let timeoutId: number | null = null;

    const debouncedHandleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(handleResize, debounceTime);
    };

    // Use Visual Viewport API if available, otherwise fallback to window
    const target = window.visualViewport || window;
    target.addEventListener('resize', debouncedHandleResize, { passive: true });

    // For visual viewport, also listen to scroll events (viewport position changes during pinch-zoom)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('scroll', debouncedHandleResize, { passive: true });
    }

    return () => {
      target.removeEventListener('resize', debouncedHandleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('scroll', debouncedHandleResize);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime, handleResize]);

  return viewportSize;
}

