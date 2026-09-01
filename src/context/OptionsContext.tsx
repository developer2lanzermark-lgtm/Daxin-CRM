import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_OPTIONS, type AppOptions } from '../data/optionDefaults';
import { fetchOptionsFromSheet, OPTIONS_SHEET_ID } from '../data/optionsSheet';

type OptionsSource = 'sheet' | 'defaults' | 'loading';

interface OptionsContextType {
  options: AppOptions;
  source: OptionsSource;
  error: string | null;
  reload: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<AppOptions>(DEFAULT_OPTIONS);
  const [source, setSource] = useState<OptionsSource>(OPTIONS_SHEET_ID ? 'loading' : 'defaults');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!OPTIONS_SHEET_ID) {
      setSource('defaults');
      return;
    }

    const controller = new AbortController();
    setSource('loading');
    setError(null);

    fetchOptionsFromSheet(controller.signal)
      .then((loaded) => {
        setOptions(loaded);
        setSource('sheet');
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.warn('[Options] Falling back to built-in defaults:', err);
        setOptions(DEFAULT_OPTIONS);
        setSource('defaults');
        setError(err instanceof Error ? err.message : 'Failed to load options sheet');
      });

    return () => controller.abort();
  }, [nonce]);

  return (
    <OptionsContext.Provider value={{ options, source, error, reload }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = (): OptionsContextType => {
  const ctx = useContext(OptionsContext);
  if (!ctx) throw new Error('useOptions must be used within an OptionsProvider');
  return ctx;
};
