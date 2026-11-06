# quan-persona: Behavioural Segmentation & Persona Analytics

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Empirical behavioural clustering and persona analytics for UX research, service design, and customer experience (CX).**  
> Transform quantitative survey and field data into actionable personas, end-to-end journey maps, and prioritised service optimisation initiatives—all computed 100% client-side in the browser.

---

## 1. Positioning & Philosophy

Traditional UX personas often rely on static qualitative archetypes, demographic proxies (age, gender, tenure), or intuitive assumptions that fail to reflect actual user behaviours, process friction, and workaround habits.

**quan-persona** bridges the gap between quantitative rigor and qualitative design synthesis:
- **Behaviour Over Demographics**: Clusters respondents based on what they actually *do*, *feel*, and *struggle with* across service touchpoints—capturing shadow systems, workarounds, digital dropouts, and peer reliance.
- **Unsupervised Empirical Clustering**: DBSCAN isolates outliers and noise, while dynamic K-means identifies balanced, natural behavioural cohorts without forcing pre-baked assumptions.
- **Human-in-the-Loop Synthesis**: Algorithms find empirical patterns; researchers and service designers supply the strategic interpretation—naming personas, synthesising narratives, identifying emotional turning points, and framing design opportunities.
- **Zero-Backend Privacy (Local-First)**: Built on a client-side architecture where all data processing, clustering math, and visualisation occur locally in your browser session. No survey responses or corporate data are ever uploaded to an external server.

---

## 2. Practical Application: Insurance Sales Agent Analytics

To demonstrate how the methodology operates in practice, **quan-persona** includes a complete reference application analysing insurance sales agent workplace behaviours and sales journeys.

### Context & Research Problem
In complex service organisations, frontline staff adopt vastly different working styles. Traditional demographic metrics (such as age, gender, or tenure) often fail to explain why some employees embrace digital tools while others rely on paper workarounds, personal messaging apps, or administrative assistance. 

### How the Framework is Applied
1. **Multi-Stage Service Journey**: Models the frontline sales journey across key touchpoints: *Scheduling & Prospecting*, *Needs Analysis & Proposal*, *Underwriting & E-Signing*, *Policy Servicing*, *Claims Coordination*, and *Agency Training*.
2. **Behavioural Metrics**: Evaluates core adoption and experience indicators across the journey:
   - **Workaround Propensity (WP)**: How frequently staff step outside official systems using shadow tools or paper shortcuts.
   - **Abandonment & Rework Rate (AR)**: Where process dropouts, rejection loops, and digital aborts occur.
   - **Human-Assist / Peer Reliance (PR)**: The extent to which staff lean on peers, mentors, or assistants rather than self-service systems.
   - **System Utility Perception (SUP)**: Diagnostic feedback on how effectively enterprise software supports day-to-day work.
3. **Actionable Outcomes**: Discovers empirical workplace personas, spotlights emotional friction dips along the service curve, and pairs each stage's pain points directly with concrete optimisation opportunities and measurable KPIs.

---

## 3. The Three Analytical Lenses

The platform provides three synchronised viewpoints to inspect findings:

| Lens | Strategic Focus | Key Capabilities |
| :--- | :--- | :--- |
| **Persona Dashboard** | *Who your respondents are* | Deep-dive profile per empirical cluster: demographics, daily working hour allocations, preferred tools, core conflict quotes, and exportable, high-resolution persona cards (PNG). |
| **Journey Map** | *What they experience step-by-step* | Stage-by-stage satisfaction trajectory, emotional sentiment curves, actions, environments, and friction points—paired with an actionable **Optimisation Opportunity** and target KPI per stage. |
| **Analytics & Database** | *Macro data distribution & clustering rigor* | Real-time K slider (K = 3 to 8), automated **K-Check** stability and silhouette score evaluation, radar attribute comparisons, dimension cross-tabulations, and an interactive respondent directory. |

---

## 4. Multi-Domain Flexibility & Schema Customisation

**quan-persona** is not restricted to insurance agents. It operates on a modular schema-driven architecture:

- **Built-in Reference Domains**:
  - `👤 Insurance Sales Agent`: Field sales dynamics, shadow tool usage, and mobile workflow pain points.
  - `🛡️ Retail Policyholder`: Customer self-service portals, onboarding friction, claim clarity, and digital trust.
  - `🏥 Hospital Patient Journey`: Clinical service pathways, consultation touchpoints, and discharge coordination.
  - `➕ Custom Schemas`: User-defined research architectures tailored to any B2B or B2C service context.
- **Standalone Modular Schema Designer (`modular_questionnaire.html`)**:
  - Add, edit, or re-order stages, rating dimensions, skills, and qualitative prompts in English and Traditional Chinese.
  - Automatic calculation of measure coverage (ensuring questions properly map to WP, AR, PR, and SUP).
  - One-click export of ready-to-field questionnaire documents and CSV column mapping guides.

---

## 5. Algorithmic Pipeline

```
Raw Survey Responses (CSV) 
   │
   ▼
1. Dynamic Column Normalisation & Role Mapping
   │
   ▼
2. DBSCAN Density Clustering ──► Isolates Outliers & Noise
   │
   ▼
3. Inlier Normalisation (Z-score standardisation)
   │
   ▼
4. K-Means Clustering (K = 3 to 8, interactive)
   │
   ▼
5. Silhouette & Stability Evaluation (Automated K-Choice Validation)
   │
   ▼
6. Multi-Lens Visualisation (Personas, Journey Maps, Radar Analytics)
```

1. **DBSCAN Filtering**: DBSCAN identifies potential outliers and noise points based on the density and distribution of the uploaded survey data. The proportion of responses classified as noise varies depending on the dataset characteristics and clustering parameters.
2. **K-Means Clustering ($K = 3$ to $8$)**: Partitions inliers into $K$ empirical clusters based on Euclidean distance across normalised behavioural vectors. While theoretical K-means and silhouette scoring allow $K \ge 2$, the user-facing interactive slider is intentionally constrained to $K = 3$ through $K = 8$ (defaulting to 5)—binary 2-cluster splits are rarely meaningful for persona differentiation in UX and service design.
3. **Automated K-Check ($K = 3$ to $8$)**: Evaluates silhouette coefficients and centroid stability (subsample Adjusted Rand Index) across $K = 3$ through $K = 8$ to guide researchers toward optimal mathematical and practical cluster boundaries.
4. **Deterministic Reproducibility**: Seeded clustering guarantees that uploading the same dataset always reproduces identical cluster assignments.

---

## 6. Quick Start

### Running Locally
No Node.js, Python, or local web server is required.
1. Download or clone this repository.
2. Double-click [`index.html`](index.html) to open the platform directly in any modern browser (Chrome, Edge, Safari, Firefox).
3. Click the **Tutorial** button in the navigation rail for an interactive guided tour.

### Exploring Data
- **Explore Pre-loaded Datasets**: Use the top-bar domain dropdown to instantly explore 2,500 synthetic agent responses or policyholder profiles.
- **Upload Custom Survey CSV**:
  1. Open the **CSV Column Guide** to review required headers or download the pre-formatted CSV template.
  2. Click **Upload CSV Document** (`.csv`) to trigger automated column fuzzy-matching.
  3. Confirm column alignments in the mapping preview modal and explore your custom personas.

---

## 7. Repository Structure

```text
├── index.html                                 # Core analytics platform (UI, clustering engine, visualisations)
├── modular_questionnaire.html                 # Standalone modular schema & questionnaire designer
├── journey_schemas_modular.js                 # Schemas, question definitions, measure calculations
├── survey_data_2500.js                        # Built-in synthetic dataset (Agent domain, English)
├── survey_data_zh_2500.js                     # Built-in synthetic dataset (Agent domain, Traditional Chinese)
├── policyholder_data_2500.js                  # Built-in synthetic dataset (Retail Policyholder domain)
├── chart.min.js                               # Chart.js 4.5.1 (bundled locally)
├── papaparse.min.js                           # PapaParse 5.4.1 (bundled locally)
├── html2canvas.min.js                         # html2canvas 1.4.1 (bundled locally)
├── outfit.woff2, outfit-ext.woff2             # Outfit typography (bundled locally)
├── Questionnaire_Synthetic_Responses_v3.csv   # 10,000-row synthetic test CSV for upload verification
├── assets/                                    # Persona portraits & product overview video
├── LICENSE                                    # MIT License
└── README.md                                  # Platform overview and technical documentation
```

---

## 8. Data Privacy & Governance

- **100% Client-Side Processing**: All parsing, feature extraction, and matrix computations run in browser volatile memory (`RAM`).
- **No Remote Telemetry**: Uploaded CSV files are never transmitted to any external server or cloud endpoint.
- **Offline Self-Contained**: All fonts, styling, icons, and libraries are locally bundled—operating seamlessly inside air-gapped or restricted enterprise networks.
- **Data Persistence**: Only custom schemas, the active schema selection, and language preference are stored in browser `localStorage`. Raw respondent records are automatically cleared when the browser tab is closed.

---

## 9. License

This project is licensed under the [MIT License](LICENSE).  
Third-party vendor libraries (`Chart.js`, `PapaParse`, `html2canvas`) are released under their respective MIT licenses. Outfit typeface is licensed under the SIL Open Font License (OFL).
