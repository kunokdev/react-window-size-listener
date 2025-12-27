import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWindowSize } from './index';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Reset window dimensions
    window.innerWidth = 1024;
    window.innerHeight = 768;
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    vi.useRealTimers();
  });

  it('should return the current window size on initial render', () => {
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

    // Should not update immediately due to debounce
    expect(result.current.width).toBe(1024);

    // Fast forward debounce time
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

  it('should debounce rapid resize events', () => {
    const { result } = renderHook(() => useWindowSize({ debounceTime: 100 }));

    // Simulate rapid resizing
    act(() => {
      for (let i = 0; i < 10; i++) {
        window.innerWidth = 100 + i * 50;
        window.dispatchEvent(new Event('resize'));
        vi.advanceTimersByTime(20); // Less than debounce time
      }
    });

    // Should still show initial value
    expect(result.current.width).toBe(1024);

    // Final resize value should be 100 + 9*50 = 550
    window.innerWidth = 550;

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.width).toBe(550);
  });

  it('should cleanup event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      { passive: true }
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('should clear pending timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useWindowSize());

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    unmount();

    // clearTimeout should be called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should re-bind listener when debounceTime changes', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { rerender } = renderHook(
      ({ debounceTime }) => useWindowSize({ debounceTime }),
      { initialProps: { debounceTime: 100 } }
    );

    const initialCallCount = addEventListenerSpy.mock.calls.length;

    rerender({ debounceTime: 200 });

    // Should have removed old listener and added new one
    expect(removeEventListenerSpy).toHaveBeenCalled();
    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

});

