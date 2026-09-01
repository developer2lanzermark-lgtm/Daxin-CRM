# Daxin HR – Resume Tracking & CRM

## Dropdown values come from a Google Sheet

Every dropdown on the **Add New Candidate Resume** form is loaded at runtime from a
published Google Sheet – nothing is hard-coded. If the sheet can't be reached the app
falls back to the built-in defaults in `src/data/optionDefaults.ts`.

**One tab per input** (sheet/tab names are case-sensitive):

| Tab            | Columns                                   |
|----------------|-------------------------------------------|
| `JobFunction`  | Job Function                              |
| `Position`     | Job Function · Position                   |
| `ResumeSource` | Resume Source                             |
| `CountryCode`  | Code · Country · Flag                     |
| `Gender`       | Gender                                    |
| `MaritalStatus`| Marital Status                            |
| `Qualification`| Qualification · Needs Department (Yes/No) |

Setup:
1. In Google Sheets: **File → Import → Upload** `public/options-template.xlsx` → *Replace spreadsheet*.
2. **File → Share → Publish to web → Publish**; set sharing to *Anyone with the link: Viewer*.
3. Copy the id from the URL `…/spreadsheets/d/<ID>/edit`.
4. Set `VITE_OPTIONS_SHEET_ID=<ID>` in `.env` (local) and in **Render → Environment** (production).

Regenerate the template after changing defaults: `npm run gen:options-template`.

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
