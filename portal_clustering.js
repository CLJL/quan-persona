/* quan-persona - Dynamic Clustering & Unsupervised Discovery Module */
// K-Means++, DBSCAN outlier isolation, silhouette analysis, and K choice validation

        // ==================== AI DATA-DRIVEN CLUSTER DISCOVERY (K-MEANS) ====================
        // Unlike classifyRespondent() above, which sorts agents into archetypes that were
        // DEFINED IN ADVANCE by qualitative research (tenure bands / role labels), the
        // functions below run genuine unsupervised clustering: the algorithm is given no
        // labels and no predefined groups, and discovers whatever structure exists in the
        // multi-dimensional skill/satisfaction data on its own.

        let CLUSTER_FEATURES = [
            { key: 'Skill_Device',              label: 'Device/System Familiarity' },
            { key: 'Skill_Knowledge',            label: 'Insurance Knowledge' },
            { key: 'Skill_Sales_Pitch',          label: 'Sales Pitch Skills' },
            { key: 'Skill_Customer_Relations',   label: 'Customer Relationship Management' },
            { key: 'Skill_Digital_Tools',        label: 'Digital Tool Familiarity' },
            { key: 'Journey_1_Rating',           label: 'Stage 1 Satisfaction' },
            { key: 'Journey_2_Rating',           label: 'Stage 2 Satisfaction' },
            { key: 'Journey_3_Rating',           label: 'Stage 3 Satisfaction' },
            { key: 'Journey_4_Rating',           label: 'Stage 4 Satisfaction' },
            { key: 'Journey_5_Rating',           label: 'Stage 5 Satisfaction' },
            { key: 'Journey_6_Rating',           label: 'Stage 6 Satisfaction' },
            { key: '_wp100',                     label: 'Touchpoint Use (TU)' },
            { key: '_ar100',                     label: 'Abandonment and Rework Rate (AR)' },
            { key: '_pr100',                     label: 'Human-Assist Reliance (PR)' }
        ];

        // Which of WP / AR / PR have source questions in the uploaded data. Built-in demo data is fully measured.
        function getMeasureStatus() {
            if (window.userUploadedCustomFile === true && window.__measureStatus) return window.__measureStatus;
            return { WP: true, AR: true, PR: true };
        }

        function updateClusterFeatures() {
            if (typeof getActiveJourneySchema !== 'function') return;
            const schema = getActiveJourneySchema();
            const m = (schema && schema.metrics) ? schema.metrics : [];
            const s = (schema && schema.stages) ? schema.stages : [];
            const isZh = (currentLang === 'zh');
            
            CLUSTER_FEATURES = [];
            
            // 1. Dynamic dimensions
            m.forEach((metric, idx) => {
                let lbl;
                if (isZh) {
                    lbl = metric.labelZh || metric.label;
                } else {
                    lbl = (metric.label && !/[\u4e00-\u9fff]/.test(metric.label))
                        ? metric.label
                        : ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema.id]?.metrics?.[idx]?.label) || `Dimension ${idx + 1}`);
                }
                CLUSTER_FEATURES.push({
                    key: metric.key || `Skill_Dim_${idx + 1}`,
                    label: lbl || `Dimension ${idx + 1}`
                });
            });

            // 2. Dynamic stages
            s.forEach((stage, idx) => {
                let stageTitle;
                if (isZh) {
                    stageTitle = stage.titleZh || stage.title;
                } else {
                    stageTitle = (stage.title && !/[\u4e00-\u9fff]/.test(stage.title))
                        ? stage.title
                        : ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema.id]?.stages?.[idx]?.title) || `Stage ${idx + 1}`);
                }
                const lbl = isZh ? `${stageTitle} 滿意度` : `${stageTitle} Satisfaction`;
                CLUSTER_FEATURES.push({
                    key: `Journey_${idx + 1}_Rating`,
                    label: lbl || `Stage ${idx + 1} Satisfaction`
                });
            });

            // 3. Behavioural Indices (WP, AR, PR)
            // A measure with no source questions in the schema/CSV is left out ("not measured")
            const ms = getMeasureStatus();
            if (ms.WP) CLUSTER_FEATURES.push({ key: '_wp100', label: isZh ? '接觸點使用度 (TU)' : 'Touchpoint Use (TU)' });
            if (ms.AR) CLUSTER_FEATURES.push({ key: '_ar100', label: isZh ? '放棄與重工率 (AR)' : 'Abandonment and Rework Rate (AR)' });
            if (ms.PR) CLUSTER_FEATURES.push({ key: '_pr100', label: isZh ? '人力協助依賴度 (PR)' : 'Human-Assist Reliance (PR)' });
        }

        const ARCHETYPE_LABELS = { explorer: 'Explorer', expert: 'Expert', optimizer: 'Optimiser', skeptic: 'Skeptic', parttimer: 'Part-timer' };
        const CLUSTER_COLORS = ['#8b5cf6', '#54a0ff', '#1dd1a1', '#ff9f43', '#ff6b6b', '#f5c518', '#a29bfe', '#fd79a8'];



        function normalizeScore(val, scaleType) {
            let n = typeof val === 'string' ? parseFloat(val) : val;
            if (n === undefined || n === null || isNaN(n)) return 50;
            if (scaleType === '1-5') {
                // Uploaded matrix answers are already converted to 0-100 by the CSV parser; a raw 1-5 rating is never above 5 or below 1.
                if (n > 5 || n < 1) return Math.max(0, Math.min(100, n));
                return Math.max(0, Math.min(100, ((n - 1) / 4) * 100));
            } else if (scaleType === '1-7') {
                return Math.max(0, Math.min(100, ((n - 1) / 6) * 100));
            } else if (scaleType === '1-10') {
                return Math.max(0, Math.min(100, ((n - 1) / 9) * 100));
            } else if (scaleType === '0-100') {
                return Math.max(0, Math.min(100, n));
            }
            // Smart auto-detection fallback
            if (n <= 5.0) return Math.max(0, Math.min(100, ((n - 1) / 4) * 100));
            if (n <= 10.0) return Math.max(0, Math.min(100, ((n - 1) / 9) * 100));
            return Math.max(0, Math.min(100, n));
        }

        // Build a 14-dimension feature vector per agent, falling back to the agent's
        // research-defined archetype's static skill profile only when raw survey fields
        // are genuinely missing (e.g. mock/demo data with no per-respondent skill columns).
        function extractClusterVector(agent) {
            const num = (v, def) => {
                const n = typeof v === 'string' ? parseFloat(v) : v;
                return (typeof n === 'number' && !isNaN(n)) ? n : def;
            };

            const schema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            const metrics = (schema && schema.metrics) ? schema.metrics : [];
            const stages = (schema && schema.stages) ? schema.stages : [];

            const vector = [];

            // 1. Dynamic Dimensions normalised 0-100
            metrics.forEach((m, idx) => {
                let val = agent[m.key];
                if (val === undefined || val === null || isNaN(parseFloat(val))) {
                    if (m.key === 'Skill_Device' && agent.Skill_Device_Familiarity !== undefined) val = agent.Skill_Device_Familiarity;
                    else if (agent[`Skill_Dim_${idx + 1}`] !== undefined) val = agent[`Skill_Dim_${idx + 1}`];
                    else if (agent[`Dim_${idx + 1}`] !== undefined) val = agent[`Dim_${idx + 1}`];
                    else val = 50;
                }
                vector.push(normalizeScore(val, m.scaleType || '0-100'));
            });

            // 2. Journey Stage Ratings normalised 0-100
            stages.forEach((st, idx) => {
                const stepNum = idx + 1;
                let rVal = agent[`Journey_${stepNum}_Rating`];
                if (rVal === undefined || rVal === null || isNaN(parseFloat(rVal))) {
                    if (agent[`Task${stepNum}_rating`] !== undefined) rVal = agent[`Task${stepNum}_rating`];
                    else rVal = 3.0;
                }
                vector.push(normalizeScore(rVal, '1-5'));
            });

            // 3. Behavioural Indices (WP, AR, PR) - always keep vector aligned with CLUSTER_FEATURES
            const ms = getMeasureStatus();
            if (ms.WP) vector.push(num(agent.wp, 2.5) * 20);
            if (ms.AR) vector.push(num(agent.ar, 2.0) * 20);
            if (ms.PR) vector.push(num(agent.pr, 2.5) * 20);

            return vector;
        }

        function standardizeMatrix(matrix) {
            const n = matrix.length, dims = matrix[0].length;
            const means = new Array(dims).fill(0), stds = new Array(dims).fill(0);
            for (let j = 0; j < dims; j++) {
                let sum = 0;
                for (let i = 0; i < n; i++) sum += matrix[i][j];
                means[j] = sum / n;
            }
            for (let j = 0; j < dims; j++) {
                let sq = 0;
                for (let i = 0; i < n; i++) sq += Math.pow(matrix[i][j] - means[j], 2);
                stds[j] = Math.sqrt(sq / n) || 1;
            }
            const standardized = matrix.map(row => row.map((v, j) => (v - means[j]) / stds[j]));
            return { standardized, means, stds };
        }

        // Generates `count` progressively lighter shades of a hex colour, used to build
        // chart palettes from a cluster's single assigned colour instead of a hardcoded
        // palette per fixed archetype.
        function shadeColorPalette(hex, count) {
            const h = hex.replace('#', '');
            const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
            const shades = [];
            for (let i = 0; i < count; i++) {
                const t = i / Math.max(1, count - 1); // 0 (base color) -> 1 (near white)
                const rr = Math.round(r + (255 - r) * t * 0.7);
                const gg = Math.round(g + (255 - g) * t * 0.7);
                const bb = Math.round(b + (255 - b) * t * 0.7);
                shades.push(`rgb(${rr}, ${gg}, ${bb})`);
            }
            return shades;
        }

        function parseTenureValue(expStr) {
            if (!expStr) return 5.0;
            const s = String(expStr).toLowerCase();
            if (s.includes('under 1') || s.includes('less than 1') || s.includes('未滿') || s.includes('1年以下')) return 0.5;
            if (s.includes('1-3') || s.includes('1~3') || s.includes('1–3') || s.includes('1到3')) return 2.0;
            if (s.includes('3-5') || s.includes('3~5') || s.includes('3–5') || s.includes('3到5')) return 4.0;
            if (s.includes('5-10') || s.includes('5~10') || s.includes('6-10') || s.includes('6~10') || s.includes('6–10') || s.includes('5–10')) return 7.5;
            if (s.includes('10-15') || s.includes('10~15') || s.includes('11-15') || s.includes('11~15') || s.includes('11–15') || s.includes('10–15')) return 12.5;
            if (s.includes('15-20') || s.includes('15~20') || s.includes('16-20') || s.includes('16~20') || s.includes('16–20') || s.includes('15–20')) return 17.5;
            if (s.includes('20-25') || s.includes('20~25') || s.includes('21-25') || s.includes('21~25') || s.includes('21–25') || s.includes('20–25')) return 22.5;
            if (s.includes('25-30') || s.includes('25~30') || s.includes('26-30') || s.includes('26~30') || s.includes('26–30') || s.includes('25–30')) return 27.5;
            if (s.includes('30+') || s.includes('30年') || s.includes('over 30') || s.includes('more than 30')) return 35.0;
            const m = s.match(/(\d+)/);
            if (m) return parseFloat(m[1]);
            return 5.0;
        }

        let _clusterSeed = 42;
        function seededRandom() {
            const x = Math.sin(_clusterSeed++) * 10000;
            return x - Math.floor(x);
        }
        function resetClusterSeed() {
            _clusterSeed = 42;
        }

        function euclideanDist(a, b) {
            let s = 0;
            for (let i = 0; i < a.length; i++) s += Math.pow(a[i] - b[i], 2);
            return Math.sqrt(s);
        }

        // K-means++ initialization: spreads initial centroids apart (weighted by distance)
        // rather than picking them fully at random, which gives more stable convergence.
        function kmeansPlusPlusInit(data, k) {
            const centroids = [data[Math.floor(seededRandom() * data.length)].slice()];
            while (centroids.length < k) {
                const distances = data.map(point => {
                    let minD = Infinity;
                    for (const c of centroids) minD = Math.min(minD, euclideanDist(point, c));
                    return minD * minD;
                });
                const sum = distances.reduce((a, b) => a + b, 0);
                let r = seededRandom() * sum, idx = 0;
                for (; idx < distances.length; idx++) {
                    r -= distances[idx];
                    if (r <= 0) break;
                }
                centroids.push(data[Math.min(idx, data.length - 1)].slice());
            }
            return centroids;
        }

        // Flat copy of a point set (cached), so the hot loops run on one typed array instead of arrays of arrays
        const __flatCache = new WeakMap();
        function flattenPoints(data) {
            let f = __flatCache.get(data);
            if (f) return f;
            const dims = data[0].length;
            f = new Float64Array(data.length * dims);
            for (let i = 0; i < data.length; i++) { const row = data[i], o = i * dims; for (let d = 0; d < dims; d++) f[o + d] = row[d]; }
            __flatCache.set(data, f);
            return f;
        }

        function kmeansRun(data, k, maxIter = 100) {
            const init = kmeansPlusPlusInit(data, k);
            const n = data.length, dims = data[0].length;
            const flat = flattenPoints(data);
            let cent = new Float64Array(k * dims);
            for (let c = 0; c < k; c++) for (let d = 0; d < dims; d++) cent[c * dims + d] = init[c][d];
            const assignments = new Array(n).fill(0);
            for (let iter = 0; iter < maxIter; iter++) {
                let changed = false;
                for (let i = 0; i < n; i++) {
                    const o = i * dims;
                    let minD = Infinity, best = 0;
                    for (let c = 0; c < k; c++) {
                        const co = c * dims;
                        let sum = 0;
                        for (let d = 0; d < dims; d++) { const diff = flat[o + d] - cent[co + d]; sum += diff * diff; if (sum >= minD) break; }
                        if (sum < minD) { minD = sum; best = c; }
                    }
                    if (assignments[i] !== best) changed = true;
                    assignments[i] = best;
                }
                const nc = new Float64Array(k * dims);
                const counts = new Array(k).fill(0);
                for (let i = 0; i < n; i++) {
                    const a = assignments[i], o = i * dims, co = a * dims;
                    counts[a]++;
                    for (let d = 0; d < dims; d++) nc[co + d] += flat[o + d];
                }
                for (let c = 0; c < k; c++) {
                    const co = c * dims;
                    if (counts[c] === 0) { const r = data[Math.floor(seededRandom() * n)]; for (let d = 0; d < dims; d++) nc[co + d] = r[d]; }
                    else for (let d = 0; d < dims; d++) nc[co + d] /= counts[c];
                }
                cent = nc;
                if (!changed) break;
            }
            const centroids = [];
            for (let c = 0; c < k; c++) centroids.push(Array.from(cent.subarray(c * dims, (c + 1) * dims)));
            let inertia = 0;
            for (let i = 0; i < n; i++) inertia += Math.pow(euclideanDist(data[i], centroids[assignments[i]]), 2);
            return { assignments, centroids, inertia };
        }

        // Run K-means multiple times from different random starts and keep the lowest-error
        // result, since K-means can converge to a poor local minimum on a single run.
        function kmeansBestOf(data, k, restarts = 25) {
            let best = null;
            let bestScore = Infinity;
            for (let r = 0; r < restarts; r++) {
                const result = kmeansRun(data, k);
                const counts = new Array(k).fill(0);
                result.assignments.forEach(c => counts[c]++);
                
                const minCount = Math.min(...counts);
                const minThreshold = Math.min(45, Math.floor(data.length * 0.08));
                
                let penalty = 1.0;
                if (minCount < minThreshold) {
                    penalty = 1000.0 * (minThreshold - minCount);
                }
                
                const score = result.inertia * penalty;
                if (score < bestScore) {
                    bestScore = score;
                    best = result;
                }
            }
            return best;
        }

        // ==================== DYNAMIC (DATA-DRIVEN) CLUSTERING SYSTEM ====================
        // Clusters agents dynamically via unsupervised K-means over standardised 14-dimensional
        // feature vectors (skills + stage satisfaction + SUP/WP/AR/PR). An initial DBSCAN stage
        // isolates statistical outliers into a dedicated noise cohort.
        //
        // The cluster count K is fully user-adjustable (K=3..8) via the AI Clustering slider.
        // Dynamic cluster tabs (C1..CK) update responsively with auto-extracted distinguishing
        // features, mode demographics, and radar profiles.
        //
        // In addition, autoDiscoverK() runs a silhouette-score evaluation across K=3..8 to
        // diagnose the mathematically optimal cluster count, stored in window.__autoDiscoveredClusters.

        function silhouetteScoreLocal(data, assignments) {
            const n = data.length;
            const byCluster = {};
            assignments.forEach((c, i) => { (byCluster[c] = byCluster[c] || []).push(i); });
            const clusterIds = Object.keys(byCluster);
            if (clusterIds.length < 2) return -1;

            let total = 0;
            for (let i = 0; i < n; i++) {
                const own = assignments[i];
                const ownIdx = byCluster[own].filter(j => j !== i);
                const a = ownIdx.length === 0 ? 0 :
                    ownIdx.reduce((s, j) => s + euclideanDist(data[i], data[j]), 0) / ownIdx.length;
                let b = Infinity;
                for (const cid of clusterIds) {
                    if (cid === String(own)) continue;
                    const members = byCluster[cid];
                    const avg = members.reduce((s, j) => s + euclideanDist(data[i], data[j]), 0) / members.length;
                    if (avg < b) b = avg;
                }
                total += (Math.max(a, b) === 0) ? 0 : (b - a) / Math.max(a, b);
            }
            return total / n;
        }

        function autoDiscoverK(standardized, kMin = 3, kMax = 8) {
            const upper = Math.min(kMax, Math.max(kMin, Math.floor(standardized.length / 3)));
            let best = null;
            for (let k = kMin; k <= upper; k++) {
                const result = kmeansBestOf(standardized, k, 8);
                const score = silhouetteScoreLocal(standardized, result.assignments);
                if (!best || score > best.score) best = { k, score, result };
            }
            return best;
        }

        // ==================== K CHOICE CHECK (silhouette + subsample stability) ====================
        // Runs after every clustering run and reports how well-supported the chosen K is versus K=3..8.
        // Uses its own seeds per K and restores the global seed, so it never changes the clustering results.
        function adjustedRandIndex(a, b) {
            const n = a.length, tab = {}, ra = {}, rb = {};
            for (let i = 0; i < n; i++) {
                const key = a[i] + '_' + b[i];
                tab[key] = (tab[key] || 0) + 1; ra[a[i]] = (ra[a[i]] || 0) + 1; rb[b[i]] = (rb[b[i]] || 0) + 1;
            }
            const c2 = x => x * (x - 1) / 2;
            let s = 0, sa = 0, sb = 0;
            for (const k in tab) s += c2(tab[k]);
            for (const k in ra) sa += c2(ra[k]);
            for (const k in rb) sb += c2(rb[k]);
            const expected = sa * sb / c2(n), maxIdx = (sa + sb) / 2;
            return maxIdx === expected ? 1 : (s - expected) / (maxIdx - expected);
        }

        // Same outlier filter as assignDynamicArchetypes: keep the two in sync.
        function computeInlierStandardized(list, options = {}) {
            const { standardized } = standardizeMatrix(list.map(extractClusterVector));
            const dims = standardized[0] ? standardized[0].length : 1;
            const { eps, minPts } = calculateDBSCANParams(dims, list.length, options);
            const labels = runDBSCAN(standardized, eps, minPts);
            return standardized.filter((_, i) => labels[i] !== -1);
        }
        function kDiagSignature() {
            const sc = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            return [(sc && sc.id) || '', typeof parsedData !== 'undefined' && parsedData ? parsedData.length : 0];
        }
        function toggleKDiagDetails(ev) {
            if (ev) ev.preventDefault();
            const d = document.getElementById('k-diag-details');
            if (!d) return;
            const open = d.style.display === 'none';
            d.style.display = open ? 'block' : 'none';
            const a = ev && (ev.currentTarget || ev.target);
            if (a) {
                const zh = typeof currentLang !== 'undefined' && currentLang === 'zh';
                a.textContent = open ? (zh ? '收合' : 'Collapse') : (zh ? '詳細資料' : 'Details');
            }
        }

        async function runKChoiceCheck(chosenK, manual) {
            const el = document.getElementById('k-diagnostics-results');
            if (!el) return;
            const zh = typeof currentLang !== 'undefined' && currentLang === 'zh';
            const token = window.__kDiagToken = (window.__kDiagToken || 0) + 1; // a newer run cancels this one
            const tick = () => new Promise(r => setTimeout(r, 0));
            if (typeof parsedData === 'undefined' || !parsedData || parsedData.length < 24 || window.__evidenceBasedBlocked) { el.innerHTML = ''; return; }
            if (!manual && parsedData.length > K_CHECK_AUTO_MAX) {
                el.innerHTML = `<div style="color:var(--text-muted);">${zh ? `資料量較大（${parsedData.length} 筆），未自動執行 K 值評估。` : `Large dataset (${parsedData.length} respondents): K check not run automatically.`} <a href="#" onclick="event.preventDefault(); runKChoiceCheck(${chosenK}, true)" style="color:var(--accent-primary);">${zh ? '執行 K 值評估' : 'Run K check'}</a></div>`;
                return;
            }
            el.textContent = zh ? '正在評估 K 的選擇…（大型資料集可能需要一段時間）' : 'Evaluating the K choice… (may take a while on large datasets)';
            await tick();
            if (token !== window.__kDiagToken) return;
            let data = computeInlierStandardized(parsedData);
            if (data.length > CLUSTER_FIT_SAMPLE) {
                const idx = [...Array(data.length).keys()];
                for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(seededRandom() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
                data = idx.slice(0, CLUSTER_FIT_SAMPLE).map(i => data[i]);
            }
            const n = data.length;
            if (n < 24) { el.innerHTML = ''; return; }
            const shuffled = () => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(seededRandom() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
            const rows = [];
            for (let k = 3; k <= 8; k++) {
                await tick();
                if (token !== window.__kDiagToken) return;
                const savedSeed = _clusterSeed;
                _clusterSeed = 1000 + k * 101;
                try {
                    const full = kmeansBestOf(data, k, 8);
                    const sIdx = shuffled().slice(0, Math.min(1000, n)); // silhouette is O(n^2): subsample
                    const sil = silhouetteScoreLocal(sIdx.map(i => data[i]), sIdx.map(i => full.assignments[i]));
                    const aris = [];
                    for (let r = 0; r < 8; r++) {
                        const sub = shuffled().slice(0, Math.floor(n * 0.8));
                        const res = kmeansBestOf(sub.map(i => data[i]), k, 2);
                        const lab = data.map(p => { let b = 0, bd = Infinity; res.centroids.forEach((c, ci) => { const d = euclideanDist(p, c); if (d < bd) { bd = d; b = ci; } }); return b; });
                        aris.push(adjustedRandIndex(full.assignments, lab));
                    }
                    const mean = aris.reduce((x, y) => x + y, 0) / aris.length;
                    const sd = Math.sqrt(aris.reduce((x, y) => x + (y - mean) ** 2, 0) / aris.length);
                    rows.push({ k, sil, mean, sd });
                } finally { _clusterSeed = savedSeed; }
            }
            if (token !== window.__kDiagToken) return;
            window.__kDiagnostics = rows;
            window.__kDiagSig = kDiagSignature();
            const cur = rows.find(r => r.k === chosenK);
            const best = rows.reduce((a, b) => b.mean > a.mean ? b : a);
            const f = v => v.toFixed(2);
            let line = '';
            if (cur) {
                const verdict = best.k === chosenK ? (zh ? '為所測試 K 中最穩定者' : 'most stable K tested')
                    : best.mean - cur.mean < 0.05 ? (zh ? `與最穩定的 K=${best.k} 相近` : `close to the most stable, K = ${best.k}`)
                    : (zh ? `K=${best.k} 更穩定（${f(best.mean)} ± ${f(best.sd)}）` : `K = ${best.k} is more stable (${f(best.mean)} ± ${f(best.sd)})`);
                line = zh ? `K = ${chosenK}：穩定度 ${f(cur.mean)} ± ${f(cur.sd)}，輪廓係數 ${cur.sil.toFixed(3)}；${verdict}。${cur.sil < 0.25 ? '群間分離度偏弱。' : ''}`
                          : `K = ${chosenK}: stability ${f(cur.mean)} ± ${f(cur.sd)}, silhouette ${cur.sil.toFixed(3)}; ${verdict}. ${cur.sil < 0.25 ? 'Cluster separation is weak.' : ''}`;
            }
            const bar = (v, top) => `<span style="display:inline-block;height:8px;width:${Math.max(2, Math.round(Math.max(v, 0) * 100))}px;background:var(--accent-primary);opacity:${v === top ? 1 : 0.45};vertical-align:middle;margin-right:6px;"></span>`;
            const bestS = Math.max(...rows.map(r => r.sil));
            const table = `<table style="border-collapse:collapse;width:100%;max-width:600px;color:var(--text-secondary);margin-top:6px;">
                <tr style="text-align:left;"><th>K</th><th>${zh ? '輪廓係數' : 'Silhouette'}</th><th>${zh ? '穩定度 (ARI, 平均±SD)' : 'Stability (ARI, mean ± SD)'}</th></tr>` +
                rows.map(r => `<tr style="${r.k === chosenK ? 'font-weight:700;color:var(--text-primary);' : ''}"><td>${r.k}${r.k === chosenK ? ' ◂' : ''}</td><td>${bar(r.sil, bestS)}${r.sil.toFixed(3)}</td><td>${bar(r.mean, best.mean)}${f(r.mean)} ± ${f(r.sd)}${r === best ? ' ★' : ''}</td></tr>`).join('') +
                const eb = window.__evidenceBasedStatus;
                const ebFootnote = (window.__allowExploratoryClustering && eb && !eb.passed)
                    ? (zh ? `（⚠️ 探索模式進行中：樣本數未達 NN/g N≥100 與 Dolnicar 2002 N≥${eb.dolnicarMin} 實證標準，此處穩定度與輪廓係數僅供參考）`
                          : ` (⚠️ Exploratory Mode: Sample size fails NN/g N≥100 and Dolnicar 2002 N≥${eb.dolnicarMin} criteria; stability metrics are preliminary)`)
                    : '';
                `</table><div style="margin-top:6px;color:var(--text-muted);">${zh
                    ? `基於 ${n} 筆${parsedData.length > CLUSTER_FIT_SAMPLE ? '抽樣' : ''}非離群樣本（共 ${parsedData.length} 筆回覆）。這是參考證據，不是標準答案，K 仍由研究者決定。${ebFootnote}`
                    : `Based on ${n} ${parsedData.length > CLUSTER_FIT_SAMPLE ? 'sampled ' : ''}inlier respondents (of ${parsedData.length}). Evidence, not an answer: K remains the researcher's decision.${ebFootnote}`}</div>`;
            el.innerHTML = `<div style="color:var(--text-secondary);">${line} <a href="#" onclick="toggleKDiagDetails(event)" style="color:var(--accent-primary);">${zh ? '詳細資料' : 'Details'}</a></div><div id="k-diag-details" style="display:none;">${table}</div>`;
        }

        // Existing tab keys, in their existing left-to-right order. Kept as plain slot
        // placeholders now -- NOT a claim that a given slot "is" the old research archetype
        // it used to represent.
        const ARCHETYPE_SLOT_ORDER = ['explorer', 'expert', 'optimizer', 'skeptic', 'parttimer'];

        /**
         * ==================== DENSITY-BASED OUTLIER & NOISE IDENTIFICATION (DBSCAN) ====================
         * DBSCAN identifies data points that do not belong to sufficiently dense clusters.
         * The proportion of outliers depends on the actual survey data and the DBSCAN configuration.
         * The number of points classified as noise depends on:
         *  - Dataset characteristics: How respondents answer the questions and how similar their responses are.
         *  - Dataset size and distribution: Some datasets contain clearly defined groups, while others have more scattered responses.
         *  - DBSCAN parameters: eps (the distance threshold) and min_samples (minPts, the minimum number of neighbouring points required to form a dense region).
         *  - Data preparation: Scaling, feature selection and distance calculation can affect clustering results.
         */
        const DBSCAN_CONFIG = {
            epsFactor: 0.85,    // Scaling factor proportional to sqrt(dims) in standardised Euclidean space
            minPtsRatio: 0.008, // Base density requirement relative to population size (~0.8%)
            minPtsFloor: 5      // Absolute floor for statistical reliability
        };

        function calculateDBSCANParams(dims, n, customConfig = {}) {
            const cfg = Object.assign({}, DBSCAN_CONFIG, customConfig);
            const eps = cfg.eps !== undefined ? cfg.eps : (cfg.epsFactor * Math.sqrt(Math.max(1, dims)));
            const minPts = cfg.minPts !== undefined ? cfg.minPts : Math.max(cfg.minPtsFloor, Math.floor(n * cfg.minPtsRatio));
            return { eps, minPts, config: cfg };
        }

        // Backward-compatibility wrapper
        function dbscanEps(dims) { return calculateDBSCANParams(dims, 1000).eps; }

        // Standard DBSCAN implementation for noise isolation:
        // A point is core if >= minPts points lie within eps; border points reach a core point; others are noise.

        function runDBSCAN(points, eps, minPts) {
            const n = points.length;
            const dims = points[0].length;
            const e2 = eps * eps;
            const flat = flattenPoints(points);
            // The same upload is clustered more than once (archetype assignment, cluster discovery): reuse the answer for identical input
            let checksum = 0;
            for (let q = 0; q < flat.length; q += 7) checksum += flat[q] * ((q % 13) + 1);
            const memoKey = n + '|' + dims + '|' + eps + '|' + minPts + '|' + checksum.toFixed(6);
            if (window.__dbscanMemo && window.__dbscanMemo.key === memoKey) return window.__dbscanMemo.labels.slice();
            const labels = new Int32Array(n);
            // Large uploads: decide which points are core on a seeded sample (minPts scaled to the sample size), then test every
            // respondent against those core points. Same idea as the K-means sample fit; small datasets use every point.
            const useSample = n > CLUSTER_FIT_SAMPLE;
            let sampleIdx;
            if (useSample) {
                const idx = new Int32Array(n); for (let q = 0; q < n; q++) idx[q] = q;
                let seed = 20261029;
                const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
                for (let q = n - 1; q > 0; q--) { const r = Math.floor(rnd() * (q + 1)); const tmp = idx[q]; idx[q] = idx[r]; idx[r] = tmp; }
                sampleIdx = idx.subarray(0, CLUSTER_FIT_SAMPLE);
            } else {
                sampleIdx = new Int32Array(n); for (let q = 0; q < n; q++) sampleIdx[q] = q;
            }
            const m = sampleIdx.length;
            const minPtsEff = useSample ? Math.max(3, Math.round(minPts * m / n * 0.7))  /* 0.7: calibrated so the sample finds about the same noise as the full run (97% agreement on the 10,000-row demo file) */ : minPts;
            const cores = [];
            for (let a = 0; a < m; a++) {
                const base = sampleIdx[a] * dims;
                let count = 0;
                for (let b = 0; b < m && count < minPtsEff; b++) {
                    const o = sampleIdx[b] * dims;
                    let sum = 0;
                    for (let d = 0; d < dims; d++) { const diff = flat[base + d] - flat[o + d]; sum += diff * diff; if (sum > e2) break; }
                    if (sum <= e2) count++;
                }
                if (count >= minPtsEff) cores.push(sampleIdx[a]);
            }
            for (let i = 0; i < n; i++) {
                const base = i * dims;
                let reached = false;
                for (let q = 0; q < cores.length && !reached; q++) {
                    const o = cores[q] * dims;
                    let sum = 0;
                    for (let d = 0; d < dims; d++) { const diff = flat[base + d] - flat[o + d]; sum += diff * diff; if (sum > e2) break; }
                    if (sum <= e2) reached = true;
                }
                if (!reached) labels[i] = -1;
            }
            window.__dbscanMemo = { key: memoKey, labels: labels.slice() };
            return labels;
        }

        const CLUSTER_FIT_SAMPLE = 3000;   // max respondents used to fit K-means
        const K_CHECK_AUTO_MAX = 3000;     // K check runs automatically up to this many respondents

        /**
         * ==================== EVIDENCE-BASED THRESHOLD SPECIFICATION ====================
         * 1. Nielsen Norman Group (UX Personas):
         *    - Minimum: N >= 100 respondents (ideally N >= 500)
         *    - Rationale: Surveys with < 100 respondents reflect random sampling variance
         *      rather than reproducible statistical personas.
         * 2. Statistical Cluster Analysis Literature (Dolnicar 2002; Formann 1984):
         *    - Dolnicar (2002): N >= 10 * d (where d is the number of active clustering variables)
         *    - Formann (1984): N >= 5 * 2^d (combinatorial bound for discrete feature spaces)
         * Strict Evidence-Based Minimum Threshold: max(100, 10 * d)
         */
        function getEvidenceBasedMetrics(n, dims) {
            const d = Math.max(1, dims || 1);
            const nngMin = 100;
            const nngIdeal = 500;
            const dolnicarMin = d * 10;
            const formannMin = d <= 8 ? 5 * Math.pow(2, d) : null;
            const requiredMin = Math.max(nngMin, dolnicarMin);
            const passed = n >= requiredMin;
            return { n, dims: d, nngMin, nngIdeal, dolnicarMin, formannMin, requiredMin, passed };
        }
        window.getEvidenceBasedMetrics = getEvidenceBasedMetrics;

        function toggleExploratoryMode(enable) {
            window.__allowExploratoryClustering = !!enable;
            if (typeof runClusterDiscovery === 'function') {
                runClusterDiscovery({ recluster: true, runKCheck: true });
            }
        }
        window.toggleExploratoryMode = toggleExploratoryMode;

        function assignDynamicArchetypes(list, overrideK) {
            if (window.__kDiagSig) {
                const sig = kDiagSignature();
                if (sig[0] !== window.__kDiagSig[0] || list.length !== window.__kDiagSig[1]) {
                    const kd = document.getElementById('k-diagnostics-results');
                    if (kd) kd.innerHTML = '';
                    window.__kDiagSig = null;
                }
            }
            resetClusterSeed();
            if (!list || list.length === 0) return;

            const vectors = list.map(extractClusterVector);
            const dims = vectors[0] ? vectors[0].length : 1;
            const eb = getEvidenceBasedMetrics(list.length, dims);
            window.__evidenceBasedStatus = eb;

            // Strict Evidence-Based Enforcement:
            // Unless the researcher explicitly enables Exploratory Mode,
            // refuse multi-cluster segmentation when underpowered to prevent capturing random noise.
            if (!eb.passed && !window.__allowExploratoryClustering) {
                list.forEach(agent => { agent.archetype = 'c0'; agent._dynamicClusterId = 0; });
                window.__dynamicClusterProfiles = [{
                    id: 0, ordinal: 0, key: 'c0', label: 'All Respondents (Single Cohort - Evidence Guard)', color: CLUSTER_COLORS[0],
                    count: list.length, topFeatures: [], centroidRaw: null
                }];
                window.__evidenceBasedBlocked = true;
                console.warn(`[Evidence-Based Enforcement] Dataset (N=${list.length}, d=${dims}) fails evidence-based thresholds: NN/g requires N>=100, Dolnicar (2002) requires N>=10*d (${eb.dolnicarMin}). Multi-cluster statistical personas blocked. Unlock Exploratory Mode to override.`);
                return;
            }
            window.__evidenceBasedBlocked = false;

            // Absolute computational floor (even in exploratory mode):
            if (list.length < 10) {
                list.forEach(agent => { agent.archetype = 'c0'; agent._dynamicClusterId = 0; });
                window.__dynamicClusterProfiles = [{
                    id: 0, ordinal: 0, key: 'c0', label: 'All Respondents', color: CLUSTER_COLORS[0],
                    count: list.length, topFeatures: [], centroidRaw: null
                }];
                console.warn(`[Exploratory Mode] Only ${list.length} respondents -- below absolute computational floor (10), grouped as a single cohort.`);
                return;
            }

            const { standardized, means, stds } = standardizeMatrix(vectors);

            // DBSCAN Outlier Pre-filtering on standardized coordinates based on density and distribution
            const { eps, minPts } = calculateDBSCANParams(dims, list.length);
            const dbscanLabels = runDBSCAN(standardized, eps, minPts);

            // Separate inliers and outliers
            const inliers = [];
            const inlierVectors = [];
            const inlierStandardized = [];
            const outliers = [];

            list.forEach((agent, i) => {
                if (dbscanLabels[i] === -1) {
                    agent.archetype = 'outlier';
                    agent._dynamicClusterId = -1;
                    outliers.push(agent);
                } else {
                    inliers.push(agent);
                    inlierVectors.push(vectors[i]);
                    inlierStandardized.push(standardized[i]);
                }
            });

            const sliderEl = document.getElementById('cluster-k-slider');
            let k = overrideK || (sliderEl ? parseInt(sliderEl.value, 10) || 5 : 5);
            let labels, centroids;

            const minInliersRequired = window.__allowExploratoryClustering ? Math.max(k * 2, 6) : k * 3;
            if (inliers.length < minInliersRequired) {
                // Fall back if too few inliers for full K-means, treat all inliers as c0
                inliers.forEach(agent => { agent.archetype = 'c0'; agent._dynamicClusterId = 0; });
                k = 1;
                labels = new Array(inliers.length).fill(0);
                centroids = [new Array(vectors[0].length).fill(0)];
            } else {
                let result;
                window.__clusterSampleNote = null;
                if (inlierStandardized.length > CLUSTER_FIT_SAMPLE) {
                    // Large upload: fit K-means on a seeded sample, then assign everyone to the nearest centroid.
                    const idx = [...Array(inlierStandardized.length).keys()];
                    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(seededRandom() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
                    const fit = kmeansBestOf(idx.slice(0, CLUSTER_FIT_SAMPLE).map(i => inlierStandardized[i]), k, 10);
                    const cents = fit.centroids;
                    result = {
                        centroids: cents,
                        assignments: inlierStandardized.map(p => { let b = 0, bd = Infinity; for (let c = 0; c < cents.length; c++) { const d = euclideanDist(p, cents[c]); if (d < bd) { bd = d; b = c; } } return b; })
                    };
                    window.__clusterSampleNote = { fit: CLUSTER_FIT_SAMPLE, total: list.length };
                    console.info(`[Dynamic Classification] ${inlierStandardized.length} inliers: K-means fitted on a ${CLUSTER_FIT_SAMPLE}-respondent sample, all respondents assigned to nearest centroid.`);
                } else {
                    result = kmeansBestOf(inlierStandardized, k, inlierStandardized.length >= 500 ? 10 : 25);
                }
                labels = result.assignments;
                centroids = result.centroids;
                
                // Assign inlier agents to respective K-means cluster key
                inliers.forEach((agent, i) => {
                    const cId = labels[i];
                    agent.archetype = 'c' + cId;
                    agent._dynamicClusterId = cId;
                });
            }

            // Calculate cluster centroids and summaries
            const clusterSums = Array.from({ length: k }, () => new Array(vectors[0].length).fill(0));
            const clusterCounts = new Array(k).fill(0);
            
            inlierVectors.forEach((v, i) => {
                const c = labels[i];
                clusterCounts[c]++;
                v.forEach((val, d) => { clusterSums[c][d] += val; });
            });
            const clusterAvgRaw = clusterSums.map((sums, c) => sums.map(s => s / (clusterCounts[c] || 1)));

            // Order K-means clusters by ascending average SUP (index 5)
            const sortDim = Math.min(5, (clusterAvgRaw[0] ? clusterAvgRaw[0].length - 1 : 0));
            const order = Array.from({ length: k }, (_, i) => i)
                .sort((a, b) => ((clusterAvgRaw[a] ? clusterAvgRaw[a][sortDim] : 0) - (clusterAvgRaw[b] ? clusterAvgRaw[b][sortDim] : 0)));

            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const profiles = order.map((clusterId, ordinal) => {
                const centroidStd = centroids[clusterId];
                const ranked = centroidStd.map((z, d) => ({ d, z })).sort((a, b) => Math.abs(b.z) - Math.abs(a.z));
                const topFeatures = ranked.slice(0, 2).map(r => ({
                    label: CLUSTER_FEATURES[r.d] ? CLUSTER_FEATURES[r.d].label : (isZh ? `維度 ${r.d}` : `dim ${r.d}`),
                    direction: r.z >= 0 ? (isZh ? '高' : 'High') : (isZh ? '低' : 'Low')
                }));
                const shortLabel = isZh
                    ? (topFeatures.map(f => `${f.label}${f.direction === '高' ? '偏高' : '偏低'}`).join(' / ') || `分群 ${ordinal + 1}`)
                    : (topFeatures.map(f => `${f.direction} ${f.label}`).join(' / ') || `Cluster ${ordinal + 1}`);
                return {
                    id: clusterId,
                    key: 'c' + clusterId,
                    ordinal,
                    label: shortLabel,
                    color: CLUSTER_COLORS[ordinal % CLUSTER_COLORS.length],
                    count: clusterCounts[clusterId],
                    topFeatures,
                    centroidRaw: clusterAvgRaw[clusterId]
                };
            });

            // Append DBSCAN Outlier Profile if outliers exist
            if (outliers.length > 0) {
                profiles.push({
                    id: -1,
                    key: 'outlier',
                    ordinal: profiles.length,
                    label: isZh ? '低密度／離群值' : 'Low Density / Outliers',
                    color: '#8c8c8c',
                    count: outliers.length,
                    topFeatures: [{ direction: isZh ? '低' : 'Low', label: isZh ? '一致性／密度' : 'Conformity / Density' }],
                    centroidRaw: new Array(vectors[0].length).fill(2.5) // default mid value
                });
            }

            window.__dynamicClusterProfiles = profiles;

            // Calculate mode values for each profile
            profiles.forEach(p => {
                const members = list.filter(m => m.archetype === p.key);
                p.members = members;
                p.age = calculateModeValue(members, 'Age', '36-45');
                p.exp = calculateModeValue(members, 'Experience', '3-5 years');
                p.customers = calculateModeValue(members, 'Clients', '51-100');
                p.badges = calculateTopGroupLabels(members).join(',');
                
                // Calculate dominant original archetype for this cluster
                const archetypeCounts = {};
                members.forEach(m => {
                    const a = m.researchArchetype || 'unknown';
                    archetypeCounts[a] = (archetypeCounts[a] || 0) + 1;
                });
                const dominant = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0];
                p.dominantArchetype = dominant ? dominant[0] : 'explorer';
            });

            // Sync slider value
            const slider = document.getElementById('cluster-k-slider');
            const sliderVal = document.getElementById('cluster-k-value');
            if (slider) slider.value = k;
            if (sliderVal) sliderVal.textContent = k;

            const outlierPct = list.length > 0 ? ((outliers.length / list.length) * 100).toFixed(1) : '0.0';
            console.info(`[Dynamic Classification] ${list.length} respondents processed. Inliers: ${inliers.length} clustered into ${k} K-means groups. Outliers / Noise: ${outliers.length} (${outlierPct}%) identified based on density and distribution via DBSCAN.`);
        }

        let lastClusterResult = null;

        // Wrap long radar labels onto several short lines so they are not clipped on phones
        function radarLabelWrap(label, maxChars) {
            const narrow = window.innerWidth < 700;
            const max = maxChars || (narrow ? 13 : 24);
            const words = String(label).split(/\s+/); const lines = []; let cur = '';
            words.forEach(w => { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else { cur = (cur + ' ' + w).trim(); } });
            if (cur) lines.push(cur);
            return lines.length > 1 ? lines : lines[0] || '';
        }
        function radarLabelSize() { return window.innerWidth < 700 ? 11 : 14; }

        function runClusterDiscovery(options = {}) {
            resetClusterSeed();
            const statusEl = document.getElementById('cluster-discovery-status');
            const k = parseInt(document.getElementById('cluster-k-slider').value, 10);
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');

            if (!parsedData || parsedData.length === 0) {
                if (statusEl) statusEl.textContent = isZh ? '⚠️ 尚未載入資料。' : '⚠️ No data loaded.';
                return;
            }

            const rawMatrix = parsedData.map(extractClusterVector);
            const dims = rawMatrix[0] ? rawMatrix[0].length : 1;
            const eb = getEvidenceBasedMetrics(parsedData.length, dims);
            window.__evidenceBasedStatus = eb;

            // Only re-cluster if requested or not yet clustered
            if (options.recluster !== false || !window.__dynamicClusterProfiles || window.__dynamicClusterProfiles.length === 0) {
                assignDynamicArchetypes(parsedData, k);
                const profiles = window.__dynamicClusterProfiles || [];
                if (profiles.length > 0 && !profiles.some(p => p.key === activePersona)) {
                    activePersona = profiles[0].key;
                }
                renderArchetypeTabs();
            }

            // Check if blocked by Strict Evidence-Based Methodology Gate
            if (window.__evidenceBasedBlocked) {
                if (statusEl) {
                    statusEl.innerHTML = isZh ? `
                    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; color: var(--text-primary); line-height: 1.6;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                            <div style="font-weight: 700; color: #f87171; display:flex; align-items:center; gap:6px;">
                                <span>🛡️ 實證方法學防護：已暫停多群統計分群</span>
                            </div>
                            <button type="button" onclick="toggleExploratoryMode(true)" class="btn btn-secondary" style="font-size:12px; padding:4px 12px; border-color:#f87171; color:#f87171; cursor:pointer;">
                                解鎖探索模式（未經驗證雛形分析）
                            </button>
                        </div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary);">
                            目前資料集（<strong>${parsedData.length} 位受訪者</strong>、<strong>${dims} 個維度</strong>）未達統計人物誌之實證研究標準（最低門檻為 <strong>${eb.requiredMin} 位</strong>）：
                            <ul style="margin: 6px 0 8px 18px; padding:0;">
                                <li><strong>Nielsen Norman Group 人物誌指引</strong>：統計型人物誌建議至少需 <strong>100 位受訪者</strong>（理想為 500 位以上），以避免演算法捕捉到隨機抽樣雜訊。</li>
                                <li><strong>統計分群文獻（Dolnicar 2002；Formann 1984）</strong>：樣本數需滿足 <strong>N ≥ 10 × 維度數</strong>（針對 ${dims} 個維度至少需 <strong>${eb.dolnicarMin} 位</strong>；Formann 針對離散空間建議為 5 × 2<sup>d</sup>）。</li>
                            </ul>
                            為避免產出失真或不具統計意義的人物誌，平台依實證原則將全員歸入單一人群。若您為功能測試或課堂示範，可點擊上方按鈕解鎖探索模式。
                        </div>
                    </div>` : `
                    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; color: var(--text-primary); line-height: 1.6;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                            <div style="font-weight: 700; color: #f87171; display:flex; align-items:center; gap:6px;">
                                <span>🛡️ Evidence-Based Methodology Gate: Statistical Clustering Paused</span>
                            </div>
                            <button type="button" onclick="toggleExploratoryMode(true)" class="btn btn-secondary" style="font-size:12px; padding:4px 12px; border-color:#f87171; color:#f87171; cursor:pointer;">
                                Unlock Exploratory Mode (Unvalidated)
                            </button>
                        </div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary);">
                            Current dataset (<strong>${parsedData.length} respondents</strong>, <strong>${dims} dimensions</strong>) does not meet empirical standards for statistical persona clustering (requires minimum <strong>${eb.requiredMin} respondents</strong>):
                            <ul style="margin: 6px 0 8px 18px; padding:0;">
                                <li><strong>Nielsen Norman Group (UX Personas)</strong>: Requires a minimum of <strong>100 respondents</strong> (ideally 500+) so clusters reflect genuine behavioural archetypes rather than random sampling noise.</li>
                                <li><strong>Statistical Literature (Dolnicar 2002, Formann 1984)</strong>: Requires <strong>N ≥ 10 × variables</strong> (minimum <strong>${eb.dolnicarMin} respondents</strong> for ${dims} variables; Formann recommends 5 × 2<sup>d</sup> for discrete features).</li>
                            </ul>
                            To prevent generating unscientific personas, respondents are grouped into a single cohort. If you are conducting a pilot test or UI evaluation, you may unlock <strong>Exploratory Mode</strong> above.
                        </div>
                    </div>`;
                }
                const cr = document.getElementById('cluster-discovery-results');
                if (cr) cr.style.display = 'block';
                renderClusterDiscovery();
                if (typeof initAnalyticsRadarChart === 'function') initAnalyticsRadarChart();
                return;
            }

            const profiles = window.__dynamicClusterProfiles || [];
            // Linear O(N) grouping by cluster key
            const clusterMembersMap = {};
            const clusterSumsMap = {};
            const clusterArchetypesMap = {};
            profiles.forEach(p => {
                clusterMembersMap[p.key] = [];
                clusterSumsMap[p.key] = new Float64Array(rawMatrix[0] ? rawMatrix[0].length : 0);
                clusterArchetypesMap[p.key] = {};
            });
            for (let i = 0; i < parsedData.length; i++) {
                const m = parsedData[i];
                const key = m.archetype;
                if (clusterMembersMap[key]) {
                    clusterMembersMap[key].push(m);
                    const v = rawMatrix[i];
                    if (v) {
                        const sums = clusterSumsMap[key];
                        for (let d = 0; d < v.length; d++) sums[d] += v[d];
                    }
                    const a = m.researchArchetype || 'unknown';
                    clusterArchetypesMap[key][a] = (clusterArchetypesMap[key][a] || 0) + 1;
                }
            }

            const clusters = profiles.map(p => {
                const members = clusterMembersMap[p.key] || [];
                const n = members.length || 1;
                const sums = clusterSumsMap[p.key] || [];
                const avg = Array.from(sums, s => s / n);
                const archetypeCounts = clusterArchetypesMap[p.key] || {};
                const dominant = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0];
                const dominantArchetype = dominant ? dominant[0] : 'explorer';
                return {
                    id: p.id,
                    key: p.key,
                    members,
                    avg,
                    topFeatures: p.topFeatures,
                    dominantArchetype
                };
            });

            lastClusterResult = { clusters, k, inertia: 0 };
            if (statusEl) {
                const sampleNote = window.__clusterSampleNote
                    ? (isZh ? ` 備註：K-means 以 ${window.__clusterSampleNote.fit.toLocaleString()} 位（共 ${window.__clusterSampleNote.total.toLocaleString()} 位）受訪者的樣本建模，其餘受訪者再歸入最近的分群。`
                          : ` Note: K-means was fitted on a sample of ${window.__clusterSampleNote.fit.toLocaleString()} of ${window.__clusterSampleNote.total.toLocaleString()} respondents; all respondents were then assigned to the nearest cluster.`)
                    : '';
                
                let bannerHtml = '';
                if (window.__allowExploratoryClustering && !eb.passed) {
                    bannerHtml = isZh ? `
                    <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; line-height: 1.5;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <span style="font-weight:700; color:#fbbf24;">⚠️ 探索模式進行中（未經驗證分析：N = ${parsedData.length} &lt; ${eb.requiredMin}）</span>
                            <button type="button" onclick="toggleExploratoryMode(false)" class="btn btn-secondary" style="font-size:11px; padding:3px 10px; cursor:pointer;">重新啟用實證防護</button>
                        </div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top:3px;">
                            樣本數未達 NN/g（N ≥ 100）與 Dolnicar 2002（N ≥ ${eb.dolnicarMin}）實證標準。此分群結果純屬探索假設，不宜作為正式決策依據。
                        </div>
                    </div>` : `
                    <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; line-height: 1.5;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                            <span style="font-weight:700; color:#fbbf24;">⚠️ Exploratory Mode Active (Unvalidated: N = ${parsedData.length} &lt; ${eb.requiredMin})</span>
                            <button type="button" onclick="toggleExploratoryMode(false)" class="btn btn-secondary" style="font-size:11px; padding:3px 10px; cursor:pointer;">Re-lock Evidence Gate</button>
                        </div>
                        <div style="font-size: var(--fs-small); color: var(--text-secondary); margin-top:3px;">
                            Dataset falls below NN/g (N ≥ 100) and Dolnicar 2002 (N ≥ ${eb.dolnicarMin}) guidelines. Generated clusters are exploratory and should not be used as definitive statistical segments.
                        </div>
                    </div>`;
                } else if (eb.passed) {
                    if (parsedData.length >= 500) {
                        bannerHtml = `<div style="font-size:var(--fs-small); color:#34d399; margin-bottom:6px;">🌟 ${isZh ? `樣本數充裕（N = ${parsedData.length} ≥ 500），完全符合 NN/g 與統計文獻（Dolnicar 2002, Formann 1984）之實證標準。` : `Robust sample size (N = ${parsedData.length} ≥ 500), satisfying both Nielsen Norman Group and statistical literature (Dolnicar 2002, Formann 1984) standards.`}</div>`;
                    } else {
                        bannerHtml = `<div style="font-size:var(--fs-small); color:#60a5fa; margin-bottom:6px;">✅ ${isZh ? `符合實證研究基本門檻（NN/g N ≥ 100，Dolnicar 2002 N ≥ ${eb.dolnicarMin}）；若追求更高分群穩定度，建議達 500 位以上。` : `Meets evidence-based minimum thresholds (NN/g N ≥ 100, Dolnicar 2002 N ≥ ${eb.dolnicarMin}); 500+ respondents recommended for optimal stability.`}</div>`;
                    }
                }

                statusEl.innerHTML = bannerHtml + `<div style="color:var(--text-secondary);">${isZh
                    ? `完成！已對 ${parsedData.length} 筆資料執行 K-means 分群（K=${k}）。人物誌與歷程頁的分群分頁已更新，顯示全部 ${k} 群！`
                    : `Completed! Ran K-means clustering on ${parsedData.length} records with K=${k}. Group tabs on the Persona Dashboard and Journeys page have been successfully updated to show all ${k} clusters!`} ${sampleNote}</div>`;
            }
            renderClusterDiscovery();
            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }
            if (options.runKCheck) {
                runKChoiceCheck(k);
            }
        }

