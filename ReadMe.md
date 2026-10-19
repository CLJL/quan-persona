# quan-persona: Insurance Agent Persona & Sales Journey Analytics

> A case study in data-driven persona research. Upload a questionnaire CSV and discover behavioural clusters and sales-journey pain points among insurance sales agents, entirely in your browser.

[![Live Demo](https://img.shields.io/badge/live-demo-brightgreen)](https://quan-persona.netlify.app) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Background and purpose

Traditional persona tools rely on fixed, predefined archetypes. quan-persona groups respondents from their questionnaire answers, so the number and character of the clusters come from the data rather than from preconceptions.

The questionnaire, the choice of K (3–8) and the outlier threshold remain human design decisions; see the design specification (`UX_Research_Questionnaire_and_Unsupervised_Clustering_System_Design.pdf`) in this repository.

## How it works

1. **14-Dimensional Coordinate Vector**: Each respondent is mapped across 14 standardized dimensions:
   - **5 core skills (Q7)**: Device Familiarity, Insurance Knowledge, Sales Pitch, Customer Relations, and Digital Tools.
   - **6 task-satisfaction ratings (Q27)**: Tasks 1–6 across the sales journey (Scheduling, Policy Sales, Underwriting, Policy Servicing, Branch Admin, and Training).
   - **3 behavioral indices**: Workaround Propensity (WP), Abandonment Rate (AR, evaluated via keyword/semantic tracking of process dropouts and system aborts), and Peer Reliance (PR).
   *(Note: System Utility Perception, SUP, is calculated and displayed for diagnostic overview, but is excluded from clustering).*
2. **DBSCAN** flags outlier respondents on standardised responses (`eps = 3.0`, `minPts ≈ 0.8%` of respondents, minimum 5).
3. **K-Means** groups the remaining inlier respondents into K clusters. You choose K (3–8, default 5) in the dashboard; at least 3 × K respondents are needed for a stable result.
4. Each cluster is shown as a persona with its sales-journey stages, satisfaction arcs, and pain points. Outliers appear as a separate "Outliers & Noise" group rather than being discarded.
5. **You complete the personas.** The clustering algorithm finds empirical cohorts; persona descriptions start in an empty state so researchers can synthesize qualitative descriptions, name each persona, define a motto, and attach portrait art directly in the dashboard.

## Privacy and architecture

Everything runs in your browser. There is no backend, uploaded CSVs are not sent to any server, and all libraries and fonts are bundled locally (no CDN requests). To verify, open DevTools → Network and upload a file.

## Features

* Interactive analytics dashboard defaulting to English, with one-click toggle to 繁體中文
* Questionnaire-to-clustering pipeline with DBSCAN outlier handling and dynamic K-means (K = 3–8)
* 14-dimensional feature space capturing skills, journey satisfaction, workarounds (WP), dropouts (AR), and peer reliance (PR)
* Human-in-the-loop persona authoring: name, describe and give a motto to each discovered persona. Edits can be exported as a publication-ready PNG card or comparison view
* Responsive layout for desktop and tablet with full local-first offline execution

## Try it

**Demo data is synthetic** and includes a `persona_archetype` label column that the dashboard uses to compare against the discovered clusters. It demonstrates the workflow; it is not a finding from real respondents.

**To use your own data:**

1. Download the questionnaire template from the platform (English or 繁體中文).
2. Collect responses and export them as a CSV.
3. Upload the CSV in the dashboard.

**Columns:** Use the header of `Questionnaire_Synthetic_Responses.csv` (64 columns: `respondent_id`, an optional `persona_archetype`, then the Q1–Q27 questionnaire fields) or the questionnaire template. The app recognises English and Traditional Chinese column names. Rows without a respondent ID are skipped.

**To run locally:** open `index.html`. No build step is needed.

## Repository structure

```text
├── index.html                                            # Main application (all UI and analysis logic)
├── chart.min.js                                          # Chart.js 4.5.1 (MIT), bundled locally
├── papaparse.min.js                                      # PapaParse 5.4.1 (MIT), bundled locally
├── html2canvas.min.js                                    # html2canvas 1.4.1 (MIT), bundled locally
├── outfit.woff2, outfit-ext.woff2                        # Outfit font (SIL OFL), bundled locally
├── survey_data_2500.js                                   # Synthetic demo dataset (English)
├── survey_data_zh_2500.js                                # Synthetic demo dataset (繁體中文)
├── assets/                                               # Persona portrait images
├── Questionnaire_Synthetic_Responses.csv                 # Synthetic responses for testing uploads (English)
├── Questionnaire_Synthetic_Responses_zh-TW.csv           # Synthetic responses for testing uploads (繁體中文)
├── Modular_Questionnaire_Template.pdf                    # Questionnaire template (English)
├── 保險業務員數位工作風格與人物誌問卷.pdf                        # Questionnaire template (繁體中文)
├── Questionnaire_Metrics_and_Data_Mapping_Guideline.pdf  # Technical data mapping guide
├── UX_Research_Questionnaire_and_Unsupervised_Clustering_System_Design.pdf  # System design specification
├── ReadMe.md                                             # This file
├── MIT License.txt                                       # MIT License
└── OFL.txt                                               # Outfit font license
```

## License and third-party licenses

This project is released under the MIT License (see `MIT License.txt`).

Chart.js 4.5.1, PapaParse 5.4.1 and html2canvas 1.4.1 are MIT-licensed. Outfit font © 2021 The Outfit Project Authors, licensed under the SIL Open Font License 1.1 (see `OFL.txt`).
