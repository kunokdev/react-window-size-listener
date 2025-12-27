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
 * Hook that tracks the window size with optional debouncing.
 *
 * @param options Configuration options
 * @returns Object containing `width` and `height` of the window.
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceTime = 100 } = options;

  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  // However, for this specific hook, returning a default size or 0 is often preferred
  // depending on the use case.
  // To allow this to be "SSR safe" but usable immediately on client if possible:
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: 0,
      height: 0,
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
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceTime);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    // (In case the initial state was set during SSR or if window changed before mount)
    // Actually, setting it in state initializer covers the "mount" case for CSR.
    // But if we want to ensure we catch any updates or if we want to handle the "0,0" -> "real size" transition
    // for hydration compatibility, we might want to force an update.
    // However, simplest is just to listen.

    // We do NOT call handleResize() immediately here because we initialized state
    // with the current window size (if available).

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [debounceTime]); // Re-bind if debounceTime changes

  return windowSize;
}
