import { useState, useEffect, useRef } from "react";

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

interface UseDebouncedSearchReturn {
  debouncedValue: string;
  isDebouncing: boolean;
  cancel: () => void;
}

export function useDebouncedSearch(
  value: string,
  options: UseDebouncedSearchOptions = {}
): UseDebouncedSearchReturn {
  const { delay = 300, minLength = 0 } = options;
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancelar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cancelar petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Si el valor es muy corto, no hacer debounce
    if (value.length < minLength) {
      setDebouncedValue(value);
      setIsDebouncing(false);
      return;
    }

    // Si el valor no ha cambiado, no hacer debounce
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }

    // Crear nuevo AbortController para esta búsqueda
    abortControllerRef.current = new AbortController();

    // Si el delay es 0, actualizar inmediatamente
    if (delay === 0) {
      setDebouncedValue(value);
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    // Configurar timeout para debounce
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, minLength, debouncedValue]);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsDebouncing(false);
  };

  return {
    debouncedValue,
    isDebouncing,
    cancel,
  };
}
