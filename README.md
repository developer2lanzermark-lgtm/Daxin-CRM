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

### Changing the options

**Easiest – the in-app Settings page** (`/settings`): edit any list, **Save changes**
(applies instantly, stored in that browser). To make it permanent for everyone, click
**Download options.xlsx**, replace `public/options.xlsx` in the project, and redeploy.

**Or edit the file directly:** open `public/options.xlsx` in Excel / Google Sheets /
LibreOffice, add or remove rows, commit and push – Render rebuilds.

Regenerate the file from the built-in defaults any time: `npm run gen:options`.

Load priority: **saved Settings edits (browser) → `public/options.xlsx` → built-in
defaults in `src/data/optionDefaults.ts`.**

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
