# Daxin HR – Resume Tracking & CRM

## Dropdown values are configurable (Excel file)

Most dropdowns on the **Add Candidate Resume** form are read at runtime from an Excel
workbook that ships with the app: **`public/options.xlsx`**.
(Gender and Marital Status are fixed in the app and are **not** in the file.)

The workbook has **one sheet/tab per input** (tab names are case-sensitive):

| Tab            | Column A       | Column B                  | Column C |
|----------------|----------------|---------------------------|----------|
| `JobFunction`  | Job Function   | –                         | –        |
| `Position`     | Job Function   | Position                  | –        |
| `ResumeSource` | Resume Source  | –                         | –        |
| `CountryCode`  | Code (`+91`)   | Country                   | Flag     |
| `State`        | Country Code   | State                     | –        |
| `City`         | State          | City                      | –        |
| `Qualification`| Qualification  | Needs Department (Yes/No)  | –        |

Row 1 of every tab is a header row. On the form, choosing a **Country Code** filters
**State**, choosing a **State** filters **City**; **Area** is free text. A tab with no
rows becomes a plain text box.

### To change the options (e.g. another company adapting the app)

1. Edit **`public/options.xlsx`** in Excel / Google Sheets / LibreOffice – add or remove rows.
2. Commit and push – Render rebuilds and serves the new file.

Regenerate the file from the built-in defaults any time: `npm run gen:options`.

### Optional: live edits via Google Sheet (no redeploy)

If you set `VITE_OPTIONS_SHEET_ID` (in `.env` locally, or **Render → Environment**), the
app reads a *published* Google Sheet with the same tabs instead, so non-technical staff
can edit options in the browser. Priority order:
**Google Sheet (if the ID is set) → `public/options.xlsx` → built-in defaults in `src/data/optionDefaults.ts`.**

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
