import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptions } from '../context/OptionsContext';
import { downloadOptionsXlsx } from '../data/optionsExport';
import { StickyHeader } from '../components/layout/StickyHeader';
import type { AppOptions, CountryCodeOption } from '../data/optionDefaults';
import {
  Plus,
  Trash2,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  Briefcase,
  ListChecks,
  Inbox,
  Phone,
  MapPin,
  Building2,
  GraduationCap
} from 'lucide-react';

/* ----------------------------------------------------------------- helpers */

const inputClass =
  'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition';

const clone = (o: AppOptions): AppOptions => JSON.parse(JSON.stringify(o));

const IconBtn: React.FC<{ onClick: () => void; title: string }> = ({ onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex-shrink-0 grid place-items-center w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
  >
    <Trash2 className="w-4 h-4" />
  </button>
);

const AddRow: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Add item' }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition"
  >
    <Plus className="w-3.5 h-3.5" />
    {label}
  </button>
);

/** Editable list of plain strings. */
const StringList: React.FC<{
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}> = ({ items, onChange, placeholder, addLabel }) => (
  <div className="space-y-2">
    {items.map((val, i) => (
      <div key={i} className="flex items-center gap-1.5">
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
        <IconBtn onClick={() => onChange(items.filter((_, idx) => idx !== i))} title="Remove" />
      </div>
    ))}
    <AddRow onClick={() => onChange([...items, ''])} label={addLabel} />
  </div>
);

/* ------------------------------------------------------------------- section shell */

interface SectionDef {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionDef[] = [
  { id: 'jobfn', title: 'Job Functions', desc: 'Top-level groups shown before Position', icon: Briefcase },
  { id: 'positions', title: 'Positions', desc: 'Roles listed under each Job Function', icon: ListChecks },
  { id: 'sources', title: 'Resume Sources', desc: 'Channels a CV can arrive through', icon: Inbox },
  { id: 'countries', title: 'Country Codes', desc: 'Dial codes for the mobile field', icon: Phone },
  { id: 'states', title: 'States', desc: 'Shown after a Country Code is chosen', icon: MapPin },
  { id: 'cities', title: 'Cities', desc: 'Shown after a State is chosen', icon: Building2 },
  { id: 'quals', title: 'Qualifications', desc: 'Education levels + Department toggle', icon: GraduationCap }
];

const Section: React.FC<{ def: SectionDef; children: React.ReactNode }> = ({ def, children }) => {
  const Icon = def.icon;
  return (
    <section id={def.id} className="scroll-mt-24 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5">
        <span className="grid place-items-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">{def.title}</h3>
          <p className="text-xs text-slate-500">{def.desc}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
};

/** Editor for Record<string, string[]> keyed by a fixed list of keys. */
const GroupedEditor: React.FC<{
  keys: string[];
  map: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  emptyHint: string;
  addLabel: string;
}> = ({ keys, map, onChange, emptyHint, addLabel }) => (
  <div className="space-y-3">
    {keys.length === 0 && <p className="text-xs text-slate-400">{emptyHint}</p>}
    {keys.map((k) => (
      <details key={k} open className="rounded-lg border border-slate-200 bg-slate-50/50">
        <summary className="cursor-pointer select-none px-3 py-2 text-xs font-bold text-slate-600">
          {k}
          <span className="ml-2 font-normal text-slate-400">({(map[k] || []).length})</span>
        </summary>
        <div className="px-3 pb-3">
          <StringList
            items={map[k] || []}
            onChange={(next) => onChange({ ...map, [k]: next })}
            addLabel={addLabel}
          />
        </div>
      </details>
    ))}
  </div>
);

/* --------------------------------------------------------------------- page */

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { options, source, saveOptions, resetToFile } = useOptions();
  const [draft, setDraft] = useState<AppOptions>(() => clone(options));
  const [toast, setToast] = useState('');
  const [dirty, setDirty] = useState(false);

  const optionsKey = useMemo(() => JSON.stringify(options), [options]);
  useEffect(() => {
    setDraft(clone(options));
    setDirty(false);
  }, [optionsKey]);

  const set = (patch: Partial<AppOptions>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setDirty(true);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4000);
  };

  const cleaned = (o: AppOptions): AppOptions => {
    const trimList = (l: string[]) => l.map((s) => s.trim()).filter(Boolean);
    const trimMap = (m: Record<string, string[]>) =>
      Object.fromEntries(
        Object.entries(m)
          .map(([k, v]) => [k.trim(), trimList(v)] as [string, string[]])
          .filter(([k]) => k)
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
    setDirty(false);
    window.alert('Settings saved successfully.\nAll dropdowns now use these values.');
    showToast('Settings saved — all dropdowns updated.');
  };

  const handleDownload = () => {
    downloadOptionsXlsx(cleaned(draft));
    showToast('options.xlsx downloaded — replace public/options.xlsx to make it permanent.');
  };

  const handleReset = () => {
    if (window.confirm('Discard local changes and reload from options.xlsx?')) {
      resetToFile();
      showToast('Reloaded from options.xlsx.');
    }
  };

  const sourceLabel =
    source === 'custom'
      ? 'your saved changes'
      : source === 'excel'
      ? 'options.xlsx'
      : source === 'loading'
      ? '…'
      : 'built-in defaults';

  const jobFnKeys = draft.jobFunctions.map((s) => s.trim()).filter(Boolean);
  const countryKeys = draft.countryCodes.map((c) => c.code.trim()).filter(Boolean);
  const stateKeys = Object.values(draft.statesByCountryCode).flat().map((s) => s.trim()).filter(Boolean);

  return (
    <div className="w-full space-y-6 pb-8">
      <StickyHeader className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-xs text-slate-500">
            Dropdown values &middot; loaded from <strong className="text-slate-700">{sourceLabel}</strong>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" /> Reload
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Export .xlsx
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
            disabled={!dirty}
          >
            <Save className="w-4 h-4" /> Save{dirty ? ' *' : ''}
          </button>
        </div>
      </StickyHeader>

      {/* success toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in fade-in">
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-medium text-emerald-900">{toast}</p>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[190px_1fr] lg:gap-8">
          {/* left rail */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <s.icon className="w-4 h-4 text-slate-400" />
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          {/* content */}
          <div className="space-y-6">
            {/* mobile actions + explainer */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Save</strong> applies your changes to every form
                immediately (kept in this browser). To make them permanent for everyone,{' '}
                <strong className="text-slate-700">Export .xlsx</strong>, replace{' '}
                <code className="px-1 bg-slate-100 rounded">public/options.xlsx</code> in the project and redeploy.
              </p>
              <div className="flex flex-wrap gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  <RotateCcw className="w-4 h-4" /> Reload
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!dirty}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>

            <Section def={SECTIONS[0]}>
              <StringList
                items={draft.jobFunctions}
                onChange={(next) => set({ jobFunctions: next })}
                placeholder="e.g. Developer"
                addLabel="Add Job Function"
              />
            </Section>

            <Section def={SECTIONS[1]}>
              <GroupedEditor
                keys={jobFnKeys}
                map={draft.positionsByJobFunction}
                onChange={(next) => set({ positionsByJobFunction: next })}
                emptyHint="Add a Job Function first."
                addLabel="Add Position"
              />
              <p className="mt-3 text-[11px] text-slate-400">
                A Job Function with no positions becomes a free-text box on the form.
              </p>
            </Section>

            <Section def={SECTIONS[2]}>
              <StringList
                items={draft.resumeSources}
                onChange={(next) => set({ resumeSources: next })}
                placeholder="e.g. Job Portal"
                addLabel="Add Source"
              />
            </Section>

            <Section def={SECTIONS[3]}>
              <div className="space-y-2">
                <div className="hidden sm:grid grid-cols-[110px_1fr_70px_36px] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
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
                    <div key={i} className="grid grid-cols-2 sm:grid-cols-[110px_1fr_70px_36px] gap-2">
                      <input className={inputClass} value={c.code} placeholder="+91" onChange={(e) => upd({ code: e.target.value })} />
                      <input className={inputClass} value={c.label} placeholder="India" onChange={(e) => upd({ label: e.target.value })} />
                      <input className={inputClass} value={c.flag} placeholder="IN" onChange={(e) => upd({ flag: e.target.value })} />
                      <IconBtn
                        onClick={() => set({ countryCodes: draft.countryCodes.filter((_, idx) => idx !== i) })}
                        title="Remove"
                      />
                    </div>
                  );
                })}
                <AddRow
                  onClick={() => set({ countryCodes: [...draft.countryCodes, { code: '', label: '', flag: '' }] })}
                  label="Add Country Code"
                />
              </div>
            </Section>

            <Section def={SECTIONS[4]}>
              <GroupedEditor
                keys={countryKeys}
                map={draft.statesByCountryCode}
                onChange={(next) => set({ statesByCountryCode: next })}
                emptyHint="Add a Country Code first."
                addLabel="Add State"
              />
            </Section>

            <Section def={SECTIONS[5]}>
              <GroupedEditor
                keys={stateKeys}
                map={draft.citiesByState}
                onChange={(next) => set({ citiesByState: next })}
                emptyHint="Add a State first."
                addLabel="Add City"
              />
            </Section>

            <Section def={SECTIONS[6]}>
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
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap select-none">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300"
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
                      <IconBtn
                        onClick={() =>
                          set({
                            qualifications: draft.qualifications.filter((_, idx) => idx !== i),
                            qualificationsNeedingDepartment: draft.qualificationsNeedingDepartment.filter((x) => x !== q)
                          })
                        }
                        title="Remove"
                      />
                    </div>
                  );
                })}
                <AddRow
                  onClick={() => set({ qualifications: [...draft.qualifications, ''] })}
                  label="Add Qualification"
                />
              </div>
            </Section>

            {/* footer actions */}
            <div className="flex justify-end gap-3 pt-2">
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
                disabled={!dirty}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
