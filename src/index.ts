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
