import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptions } from '../context/OptionsContext';
import { downloadOptionsXlsx } from '../data/optionsExport';
import { StickyHeader } from '../components/layout/StickyHeader';
import type { AppOptions, CountryCodeOption } from '../data/optionDefaults';
import { Plus, Trash2, Save, Download, RotateCcw, CheckCircle2 } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800';
const sectionClass = 'bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4';
const legendClass = 'text-[15px] font-semibold text-slate-900';
const addBtn =
  'inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900';

const clone = (o: AppOptions): AppOptions => JSON.parse(JSON.stringify(o));

/** Editable list of plain strings. */
const StringList: React.FC<{
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}> = ({ items, onChange, placeholder }) => (
  <div className="space-y-2">
    {items.map((val, i) => (
      <div key={i} className="flex items-center gap-2">
        <input
          className={inputClass}
          value={val}
          placeholder={placeholder}
          onChange={(e) => {
            const next = [...items];
            next[i] = e.target.value;
            onChange(next);
          }}
        />
        <button
          type="button"
          onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex-shrink-0"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...items, ''])} className={addBtn}>
      <Plus className="w-3.5 h-3.5" /> Add
    </button>
  </div>
);

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { options, source, saveOptions, resetToFile } = useOptions();
  const [draft, setDraft] = useState<AppOptions>(() => clone(options));
  const [savedMsg, setSavedMsg] = useState('');

  // Re-seed the draft if the underlying options change (e.g. after reset)
  const optionsKey = useMemo(() => JSON.stringify(options), [options]);
  React.useEffect(() => {
    setDraft(clone(options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  const set = (patch: Partial<AppOptions>) => setDraft((d) => ({ ...d, ...patch }));

  const cleaned = (o: AppOptions): AppOptions => {
    const trimList = (l: string[]) => l.map((s) => s.trim()).filter(Boolean);
    const trimMap = (m: Record<string, string[]>) =>
      Object.fromEntries(
        Object.entries(m).map(([k, v]) => [k.trim(), trimList(v)]).filter(([k]) => k)
      );
    return {
      jobFunctions: trimList(o.jobFunctions),
      positionsByJobFunction: trimMap(o.positionsByJobFunction),
      resumeSources: trimList(o.resumeSources),
      countryCodes: o.countryCodes
        .map((c) => ({ code: c.code.trim(), label: c.label.trim(), flag: c.flag.trim() }))
        .filter((c) => c.code),
      statesByCountryCode: trimMap(o.statesByCountryCode),
      citiesByState: trimMap(o.citiesByState),
      qualifications: trimList(o.qualifications),
      qualificationsNeedingDepartment: trimList(o.qualificationsNeedingDepartment)
    };
  };

  const handleSave = () => {
    const final = cleaned(draft);
    saveOptions(final);
    setDraft(clone(final));
    setSavedMsg('Saved. All dropdowns now use these values.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleDownload = () => downloadOptionsXlsx(cleaned(draft));

  const handleReset = () => {
    if (window.confirm('Discard local changes and reload from public/options.xlsx?')) {
      resetToFile();
      setSavedMsg('Reloaded from options.xlsx.');
      setTimeout(() => setSavedMsg(''), 4000);
    }
  };

  // Grouped editor for Record<string, string[]> keyed by a fixed list of keys
  const GroupedEditor: React.FC<{
    keys: string[];
    map: Record<string, string[]>;
    onChange: (next: Record<string, string[]>) => void;
    keyLabel: string;
  }> = ({ keys, map, onChange, keyLabel }) => (
    <div className="space-y-4">
      {keys.length === 0 && (
        <p className="text-xs text-slate-400">Add a {keyLabel} above first.</p>
      )}
      {keys.map((k) => (
        <div key={k} className="border border-slate-200 rounded-xl p-3">
          <p className="text-xs font-bold text-slate-600 mb-2">{k}</p>
          <StringList
            items={map[k] || []}
            onChange={(next) => onChange({ ...map, [k]: next })}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-6 pb-8">
      <StickyHeader className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h2>
      </StickyHeader>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Dropdown values currently loaded from:{' '}
            <strong className="text-slate-700">
              {source === 'custom'
                ? 'your saved changes'
                : source === 'excel'
                ? 'options.xlsx'
                : source === 'loading'
                ? '…'
                : 'built-in defaults'}
            </strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" /> Reload from file
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4" /> Download options.xlsx
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              <Save className="w-4 h-4" /> Save changes
            </button>
          </div>
        </div>

        {savedMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {savedMsg}
          </div>
        )}

        <p className="text-xs text-slate-500 -mt-2">
          "Save changes" applies immediately to all forms (stored in this browser).
          To make it permanent for everyone, click "Download options.xlsx" and replace
          <code className="mx-1 px-1 bg-slate-100 rounded">public/options.xlsx</code> in the project, then redeploy.
        </p>

        {/* Job Functions */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Job Functions</legend>
          <StringList
            items={draft.jobFunctions}
            onChange={(next) => set({ jobFunctions: next })}
            placeholder="e.g. Developer"
          />
        </fieldset>

        {/* Positions by Job Function */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Positions (per Job Function)</legend>
          <p className="text-xs text-slate-500">
            A Job Function with no positions shows a free-text box on the form.
          </p>
          <GroupedEditor
            keys={draft.jobFunctions.map((s) => s.trim()).filter(Boolean)}
            map={draft.positionsByJobFunction}
            onChange={(next) => set({ positionsByJobFunction: next })}
            keyLabel="Job Function"
          />
        </fieldset>

        {/* Resume Sources */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Resume Source Channels</legend>
          <StringList
            items={draft.resumeSources}
            onChange={(next) => set({ resumeSources: next })}
            placeholder="e.g. Job Portal"
          />
        </fieldset>

        {/* Country Codes */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Country Codes</legend>
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-[110px_1fr_70px_40px] gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 px-1">
              <span>Code</span>
              <span>Country</span>
              <span>Flag</span>
              <span />
            </div>
            {draft.countryCodes.map((c, i) => {
              const upd = (patch: Partial<CountryCodeOption>) => {
                const next = [...draft.countryCodes];
                next[i] = { ...next[i], ...patch };
                set({ countryCodes: next });
              };
              return (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-[110px_1fr_70px_40px] gap-2">
                  <input className={inputClass} value={c.code} placeholder="+91" onChange={(e) => upd({ code: e.target.value })} />
                  <input className={inputClass} value={c.label} placeholder="India" onChange={(e) => upd({ label: e.target.value })} />
                  <input className={inputClass} value={c.flag} placeholder="🇮🇳" onChange={(e) => upd({ flag: e.target.value })} />
                  <button
                    type="button"
                    onClick={() => set({ countryCodes: draft.countryCodes.filter((_, idx) => idx !== i) })}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => set({ countryCodes: [...draft.countryCodes, { code: '', label: '', flag: '' }] })}
              className={addBtn}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </fieldset>

        {/* States by Country Code */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>States (per Country Code)</legend>
          <GroupedEditor
            keys={draft.countryCodes.map((c) => c.code.trim()).filter(Boolean)}
            map={draft.statesByCountryCode}
            onChange={(next) => set({ statesByCountryCode: next })}
            keyLabel="Country Code"
          />
        </fieldset>

        {/* Cities by State */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Cities (per State)</legend>
          <GroupedEditor
            keys={Object.values(draft.statesByCountryCode).flat().map((s) => s.trim()).filter(Boolean)}
            map={draft.citiesByState}
            onChange={(next) => set({ citiesByState: next })}
            keyLabel="State"
          />
        </fieldset>

        {/* Qualifications */}
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Qualifications</legend>
          <p className="text-xs text-slate-500">
            Tick "Needs Department" to show the Department / Specialization field for that qualification.
          </p>
          <div className="space-y-2">
            {draft.qualifications.map((q, i) => {
              const needs = draft.qualificationsNeedingDepartment.includes(q);
              return (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={q}
                    onChange={(e) => {
                      const nextQ = [...draft.qualifications];
                      const old = nextQ[i];
                      nextQ[i] = e.target.value;
                      const nextNeeds = draft.qualificationsNeedingDepartment.map((x) =>
                        x === old ? e.target.value : x
                      );
                      set({ qualifications: nextQ, qualificationsNeedingDepartment: nextNeeds });
                    }}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={needs}
                      onChange={(e) => {
                        const list = new Set(draft.qualificationsNeedingDepartment);
                        if (e.target.checked) list.add(q);
                        else list.delete(q);
                        set({ qualificationsNeedingDepartment: [...list] });
                      }}
                    />
                    Needs Dept.
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      set({
                        qualifications: draft.qualifications.filter((_, idx) => idx !== i),
                        qualificationsNeedingDepartment: draft.qualificationsNeedingDepartment.filter((x) => x !== q)
                      });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg flex-shrink-0"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => set({ qualifications: [...draft.qualifications, ''] })}
              className={addBtn}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </fieldset>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
