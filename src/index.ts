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

const isClient = typeof window !== 'undefined';

const getWindowSize = (): WindowSize => {
  if (!isClient) {
    return {
      width: 0,
      height: 0,
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Hook that tracks the window size with optional debouncing.
 *
 * @param options Configuration options
 * @returns Object containing `width` and `height` of the window.
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize);

  const handleResize = useCallback(() => {
    setWindowSize(getWindowSize());
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    let timeoutId: number | null = null;

    const debouncedHandleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        handleResize();
      }, debounceTime);
    };

    // Update size on mount to ensure we have correct values (hydration mismatch fix)
    handleResize();

    window.addEventListener("resize", debouncedHandleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime, handleResize]);

  return windowSize;
}
