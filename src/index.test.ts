import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWindowSize } from './index';

describe('useWindowSize', () => {
  beforeEach(() => {
    // Reset window dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should return the current window size on mount', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should update state on resize after debounce', () => {
    const { result } = renderHook(() => useWindowSize({ debounceTime: 100 }));

    act(() => {
      window.innerWidth = 500;
      window.innerHeight = 500;
      window.dispatchEvent(new Event('resize'));
    });

    // Should not update immediately
    expect(result.current.width).toBe(1024);

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(500);
  });

  it('should respect custom debounce time', () => {
    const { result } = renderHook(() => useWindowSize({ debounceTime: 500 }));

    act(() => {
      window.innerWidth = 200;
      window.dispatchEvent(new Event('resize'));
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Should not update yet
    expect(result.current.width).toBe(1024);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Now it should update
    expect(result.current.width).toBe(200);
  });

  it('should cleanup event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should use passive event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useWindowSize());
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true });
  });

  it('should clear timeout on unmount', () => {
     const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
     const { unmount } = renderHook(() => useWindowSize({ debounceTime: 100 }));

     act(() => {
       window.dispatchEvent(new Event('resize'));
     });

     unmount();

     expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
