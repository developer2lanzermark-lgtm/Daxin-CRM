# Daxin HR – Resume Tracking & CRM

## Dropdown values come from a Google Sheet

Most dropdowns on the **Add Candidate Resume** form are loaded at runtime from a
published Google Sheet – not hard-coded. If the sheet can't be reached the app falls
back to the built-in defaults in `src/data/optionDefaults.ts`.
(Gender and Marital Status are fixed in the app and are **not** in the sheet.)

Create a Google Sheet with **one tab per input** (tab names are case-sensitive):

| Tab            | Column A       | Column B              | Column C |
|----------------|----------------|-----------------------|----------|
| `JobFunction`  | Job Function   | –                     | –        |
| `Position`     | Job Function   | Position              | –        |
| `ResumeSource` | Resume Source  | –                     | –        |
| `CountryCode`  | Code (`+91`)   | Country               | Flag     |
| `State`        | Country Code   | State                 | –        |
| `City`         | State          | City                  | –        |
| `Qualification`| Qualification  | Needs Department (Yes/No) | –     |

Row 1 of every tab is a header row.

On the form: choosing a **Country Code** filters the **State** dropdown; choosing a
**State** filters the **City** dropdown; **Area** is always free text. A tab with no
matching rows falls back to a plain text box.

Setup:
1. In Google Drive: **New → File upload** → `public/daxin-options-template.xlsx`,
   then right-click it → **Open with → Google Sheets** (all 7 tabs come pre-filled).
   Regenerate that file after changing defaults: `npm run gen:options-template`.
2. **File → Share → Publish to web → Publish**; sharing = *Anyone with the link: Viewer*.
3. Copy the id from the URL `…/spreadsheets/d/<ID>/edit`.
4. Set `VITE_OPTIONS_SHEET_ID=<ID>` in `.env` (local) and in **Render → Environment** (production).

The form always reads the live sheet at runtime; the built-in values in
`src/data/optionDefaults.ts` are only a fallback for when the sheet is unreachable.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
