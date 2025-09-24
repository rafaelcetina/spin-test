import { act, renderHook } from "@testing-library/react";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

describe("useDebouncedSearch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() =>
      useDebouncedSearch("initial", { delay: 300 }),
    );

    expect(result.current.debouncedValue).toBe("initial");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, { delay }),
      {
        initialProps: { value: "initial", delay: 300 },
      },
    );

    // Change value
    act(() => {
      rerender({ value: "changed", delay: 300 });
    });

    // Value should not be updated immediately
    expect(result.current.debouncedValue).toBe("initial");
    expect(result.current.isDebouncing).toBe(true);

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Value should now be updated
    expect(result.current.debouncedValue).toBe("changed");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("cancels previous debounce when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      },
    );

    // Change value multiple times rapidly
    act(() => {
      rerender({ value: "first", delay: 300 });
      rerender({ value: "second", delay: 300 });
      rerender({ value: "third", delay: 300 });
    });

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should only have the last value
    expect(result.current.debouncedValue).toBe("third");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("provides cancel function", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      },
    );

    act(() => {
      rerender({ value: "changed", delay: 300 });
    });

    // Cancel the debounce
    act(() => {
      result.current.cancel();
    });

    // Value should remain unchanged
    expect(result.current.debouncedValue).toBe("initial");
    expect(result.current.isDebouncing).toBe(false);

    // Fast forward time - should not update
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe("initial");
  });

  it("handles different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, { delay }),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    act(() => {
      rerender({ value: "changed", delay: 500 });
    });

    // Should still be debouncing at 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe("initial");
    expect(result.current.isDebouncing).toBe(true);

    // Should update at 500ms total
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.debouncedValue).toBe("changed");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("handles empty string values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      },
    );

    act(() => {
      rerender({ value: "", delay: 300 });
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe("");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("handles zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, { delay }),
      {
        initialProps: { value: "initial", delay: 0 },
      },
    );

    act(() => {
      rerender({ value: "changed", delay: 0 });
    });

    // Should update immediately with zero delay
    expect(result.current.debouncedValue).toBe("changed");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("cleans up timer on unmount", () => {
    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebouncedSearch(value, { delay }),
      {
        initialProps: { value: "initial", delay: 300 },
      },
    );

    act(() => {
      rerender({ value: "changed", delay: 300 });
    });

    // Unmount before timer completes
    unmount();

    // Fast forward time - should not cause errors
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // No assertions needed - just ensuring no errors occur
  });
});
