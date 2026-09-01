import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_OPTIONS, type AppOptions } from '../data/optionDefaults';
import { fetchOptionsFromSheet, OPTIONS_SHEET_ID } from '../data/optionsSheet';
import { fetchOptionsFromExcel } from '../data/optionsExcel';

type OptionsSource = 'sheet' | 'excel' | 'defaults' | 'loading';

interface OptionsContextType {
  options: AppOptions;
  source: OptionsSource;
  error: string | null;
  reload: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<AppOptions>(DEFAULT_OPTIONS);
  const [source, setSource] = useState<OptionsSource>('loading');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setSource('loading');
    setError(null);

    // Priority: Google Sheet (if configured) -> bundled Excel -> built-in defaults
    (async () => {
      if (OPTIONS_SHEET_ID) {
        try {
          const loaded = await fetchOptionsFromSheet(controller.signal);
          if (!controller.signal.aborted) {
            setOptions(loaded);
            setSource('sheet');
          }
          return;
        } catch (err) {
          if (controller.signal.aborted) return;
          console.warn('[Options] Google Sheet failed, trying options.xlsx:', err);
        }
      }

      try {
        const loaded = await fetchOptionsFromExcel(controller.signal);
        if (!controller.signal.aborted) {
          setOptions(loaded);
          setSource('excel');
        }
        return;
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn('[Options] options.xlsx failed, using built-in defaults:', err);
        setError(err instanceof Error ? err.message : 'Failed to load options');
      }

      setOptions(DEFAULT_OPTIONS);
      setSource('defaults');
    })();

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
