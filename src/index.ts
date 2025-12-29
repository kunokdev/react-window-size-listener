import { useState, useEffect } from 'react';

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

/**
 * Hook that tracks the window size (window.innerWidth/Height) with optional debouncing.
 *
 * @param options Configuration options
 * @returns Object containing `width` and `height` of the window.
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: number | null = null;

    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceTime);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime]);

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
 */
export function useViewportSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  const [viewportSize, setViewportSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
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
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: number | null = null;

    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        if (window.visualViewport) {
          setViewportSize({
            width: window.visualViewport.width,
            height: window.visualViewport.height,
          });
        } else {
          setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }, debounceTime);
    };

    // Use Visual Viewport API if available, otherwise fallback to window
    const target = window.visualViewport || window;
    target.addEventListener("resize", handleResize);

    // For visual viewport, also listen to scroll events (viewport position changes during pinch-zoom)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("scroll", handleResize);
    }

    return () => {
      target.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime]);

  return viewportSize;
}
