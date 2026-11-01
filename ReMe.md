# Persona Analytics Portal v2.1

Upload survey CSV data and discover personas, journey pain points and optimisation opportunities. Cluster count and character come from the data. Everything runs in your browser; nothing is uploaded.

## Quick start

1. Unzip the folder and open `index.html` in Chrome, Edge, Safari or Firefox. No server or install is needed.
2. Click **Tutorial** (top left) for a guided tour of the portal.
3. Pick a use case (agent, policyholder, patient or your own schema).
4. Click **CSV Column Guide** to see which columns your CSV needs. Download the CSV template if you want a header-only file.
5. Click **Upload CSV Document**, check the column matching, then explore the three views.

## The three views

| View | What it shows |
| --- | --- |
| Persona Dashboard | One page per cluster: demographics, working day, tools, pain points, keywords, quotes. Edit the title, description, photo and quote, then download the persona as an image. |
| Journey Map | Stage-by-stage satisfaction, actions, tools and pain points for a cluster, with a specific Optimisation Opportunity per stage. |
| Analytics & DB | Cluster discovery (K slider, radar or heat-map view, K check), distributions and response charts for all respondents. |

## How the machine and you work together

The machine counts, scores and groups respondents. You give the results meaning: design the questions, choose K, name each persona and decide what to act on.

## Measures

| Measure | Meaning |
| --- | --- |
| WP | Workaround Propensity: how far people step outside the official channel |
| AR | Abandonment and Rework Rate: how often a stage ends in rework or giving up |
| PR | Human-Assist Reliance: how much people lean on others rather than systems |
| SUP | System Utility Perception: how useful people find their systems (1 to 5) |

A measure whose source questions are not in your CSV shows as "not measured" and is left out of clustering.

## CSV format

- One row per respondent, one header row.
- Use the generic headers from the CSV Column Guide, for example `Q8_tag_1`, `Q14_item_1_1to5`, `Q27_S1_rating_1to5`, `Q27_S1_pain`.
- Separate multi-select answers with `;` (`,` and `|` also work).
- Column names do not have to match exactly: the portal matches them automatically and you can fix the matching in the review dialog.

## Clustering in brief

- DBSCAN sets aside respondents who fit no group (about 10%).
- K-means groups the rest. Choose K from 3 to 8 with the slider.
- The K check reports how well each K is supported (silhouette score and stability). It runs automatically up to 3,000 respondents.
- The same file always gives the same clusters.

## Customising

- **Customize Schema** edits stages, questions, skills, tags and tools, in English and Chinese.
- **Download Questionnaire Template** creates a questionnaire from the active schema.
- `modular_questionnaire.html` is the stand-alone schema designer.

## Languages

Use the EN | ZH switch at the top left. The choice is remembered.

## Privacy

- Respondent data stays in your browser and is not sent anywhere.
- Only custom schemas, the active schema and the language are saved in the browser (`localStorage`). Respondent rows are never saved, so they are cleared when you close the tab.
- All libraries and fonts are bundled, so the portal works offline.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The portal |
| `modular_questionnaire.html` | Schema designer |
| `journey_schemas_modular.js` | Schemas, measure definitions, question registry |
| `survey_data_2500.js`, `survey_data_zh_2500.js`, `policyholder_data_2500.js` | Built-in sample data |
| `chart.min.js`, `papaparse.min.js`, `html2canvas.min.js` | Libraries |
| `outfit.woff2`, `outfit-ext.woff2`, `assets/` | Font and images |
| `Questionnaire_Synthetic_Responses_v3.csv` | 10,000-row test file that matches all 57 columns |

## Known limitations

- Persona edits (names, text, photos) are not kept after reload.
- Apostrophes are removed in keyword text, so quotes may show "Im" or "doesnt".
- The older sample CSVs (`Partly match_…`, `0match_…`) use previous headers and will match only in part.
- The element id `demographics-collapse-content` appears more than once on the page.

## More documentation

- Functional Specification: what the portal does.
- Design Specification: how it is built.

Owner: UX Research, Nanshan Life. Version 2.1, October 2026.
