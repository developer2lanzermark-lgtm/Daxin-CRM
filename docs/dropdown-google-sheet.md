# Dropdown values from a Google Sheet

All dropdown values on the **Add New Candidate Resume** form (Job Function, Positions,
Resume Source Channel, Country Codes, Gender, Marital Status, Qualification) are loaded
at runtime from a published Google Sheet. Nothing is hard-coded anymore — edit the sheet
and the app picks up the changes on the next page load.

If the sheet is missing or unreachable, the app silently falls back to the built-in
defaults in `src/data/optionDefaults.ts`, so the form always works.

## One-time setup

### 1. Create the sheet

1. Create a new Google Sheet.
2. Rename the first tab to exactly: **`Options`**
3. In **row 1**, put these headers (exact spelling, any order):

   | Category | Group | Value | Label |
   |----------|-------|-------|-------|

4. Fill in the rows. The quickest way: **File → Import → Upload** the file
   `public/options-template.csv` from this repo → *Replace current sheet*.

### 2. Row format per category

| Category        | Group column                     | Value column            | Label column                 |
|-----------------|----------------------------------|-------------------------|------------------------------|
| `JobFunction`   | *(empty)*                        | e.g. `Developer`        | *(empty)*                    |
| `Position`      | the Job Function it belongs to   | e.g. `Full Stack Engineer` | *(empty)*                 |
| `ResumeSource`  | *(empty)*                        | e.g. `Job Portal`       | *(empty)*                    |
| `CountryCode`   | flag emoji (optional)            | dial code e.g. `+91`    | country name e.g. `India`    |
| `Gender`        | *(empty)*                        | e.g. `Male`             | *(empty)*                    |
| `MaritalStatus` | *(empty)*                        | e.g. `Single`           | *(empty)*                    |
| `Qualification` | *(empty)*                        | e.g. `UG`               | `needsDepartment` to show the Department/Specialization field |

Notes:
- A Job Function with **no `Position` rows** automatically switches "Position Applied For"
  to a free-text box (this is how `Others` works).
- Order in the sheet = order in the dropdown.

### 3. Publish the sheet

**File → Share → Publish to web → Entire document → Publish.**
(Also keep general sharing at least "Anyone with the link: Viewer".)

### 4. Tell the app which sheet to use

Copy the sheet ID from its URL:

```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
```

**Local development:** create `.env` (copy from `.env.example`):

```
VITE_OPTIONS_SHEET_ID=<SHEET_ID>
```

**Production (Render):** Dashboard → your service → **Environment** →
add `VITE_OPTIONS_SHEET_ID` = `<SHEET_ID>` → save → it redeploys automatically.

That's it. Edit the sheet any time; changes show up on the next load of the form.
