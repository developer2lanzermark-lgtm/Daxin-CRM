import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_OPTIONS, type AppOptions } from '../data/optionDefaults';
import { fetchOptionsFromExcel } from '../data/optionsExcel';

type OptionsSource = 'custom' | 'excel' | 'defaults' | 'loading';

interface OptionsContextType {
  options: AppOptions;
  source: OptionsSource;
  error: string | null;
  /** Persist edited options (Settings page). Applies immediately + survives reload. */
  saveOptions: (next: AppOptions) => void;
  /** Drop local edits and reload from public/options.xlsx. */
  resetToFile: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const LS_KEY = 'daxin_hr_crm_options_override_v1';

const readOverride = (): AppOptions | null => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AppOptions) : null;
  } catch {
    return null;
  }
};

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<AppOptions>(DEFAULT_OPTIONS);
  const [source, setSource] = useState<OptionsSource>('loading');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    // 1. Local edits from the Settings page win
    const override = readOverride();
    if (override) {
      setOptions(override);
      setSource('custom');
      return () => controller.abort();
    }

    // 2. The bundled Excel workbook (public/options.xlsx)
    setSource('loading');
    setError(null);
    fetchOptionsFromExcel(controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) return;
        setOptions(loaded);
        setSource('excel');
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.warn('[Options] options.xlsx failed, using built-in defaults:', err);
        setOptions(DEFAULT_OPTIONS);
        setSource('defaults');
        setError(err instanceof Error ? err.message : 'Failed to load options.xlsx');
      });

    return () => controller.abort();
  }, [nonce]);

  const saveOptions = useCallback((next: AppOptions) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to persist options override', e);
    }
    setOptions(next);
    setSource('custom');
  }, []);

  const resetToFile = useCallback(() => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
    setNonce((n) => n + 1);
  }, []);

  return (
    <OptionsContext.Provider value={{ options, source, error, saveOptions, resetToFile }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = (): OptionsContextType => {
  const ctx = useContext(OptionsContext);
  if (!ctx) throw new Error('useOptions must be used within an OptionsProvider');
  return ctx;
};
