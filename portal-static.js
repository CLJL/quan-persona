/* quan-persona - Static pages controller (About Us, FAQ) */
(function () {
    'use strict';
    const TXT = {
        en: {
            portalTitleAbout: "About Us",
            portalTitleFaq: "Frequently Asked Questions",
            navPersonas: "Persona Dashboard",
            navJourneys: "Journey Map",
            navAnalytics: "Analytics & DB",
            navAbout: "About Us",
            navFaq: "FAQ",
            openDashboard: "Open Dashboard",
            uploadCSV: "Upload CSV Document",
            questionnaireTemplate: "Download Questionnaire Template",
            customizeSchema: "Customise Schema",
            dataMenu: "Data",
            csvGuide: "CSV Column Guide",
            restoreDefaultData: "Restore Default Data",
            tourBtn: "Tutorial",
            langMenu: "Language",
            railPin: "Keep open",
            copyrightLine1: "2026 quan-persona.",
            copyrightLine2: "All rights reserved.",
            copyrightLine3: "Client-Side Privacy",
            copyrightLine4: "Assured"
        },
        zh: {
            portalTitleAbout: "關於我們",
            portalTitleFaq: "常見問題",
            navPersonas: "人物誌看板",
            navJourneys: "歷程地圖",
            navAnalytics: "數據分析與資料庫",
            navAbout: "關於我們",
            navFaq: "常見問題",
            openDashboard: "進入分析平台",
            uploadCSV: "上傳 CSV 問卷資料",
            questionnaireTemplate: "下載問卷範本",
            customizeSchema: "自訂問卷與分析構面",
            dataMenu: "資料",
            csvGuide: "CSV 欄位格式說明",
            restoreDefaultData: "恢復預設數據",
            tourBtn: "教學導覽",
            langMenu: "語言",
            railPin: "固定展開",
            copyrightLine1: "2026 quan-persona.",
            copyrightLine2: "版權所有",
            copyrightLine3: "本機隱私保護",
            copyrightLine4: "安全保證"
        }
    };

    const isZh = () => {
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang) return urlLang === 'zh';
            const stored = localStorage.getItem('portal_lang');
            if (stored) return stored === 'zh';
            const nav = (navigator.language || '').toLowerCase();
            return nav.startsWith('zh');
        } catch (e) {
            return false;
        }
    };

    function applyLang(lang) {
        const zh = (lang === 'zh');
        document.documentElement.setAttribute('data-lang', zh ? 'zh' : 'en');
        document.documentElement.lang = zh ? 'zh-Hant' : 'en';

        const isFaq = document.body.dataset.page === 'faq';
        if (isFaq) {
            document.title = zh
                ? '常見問題 (FAQ) | quan-persona - 行為分群與人物誌分析平台'
                : 'Frequently Asked Questions (FAQ) | quan-persona - Behavioural Segmentation & Persona Analytics';
        } else {
            document.title = zh
                ? '關於我們 | quan-persona - 行為分群與人物誌分析平台'
                : 'About Us | quan-persona - Behavioural Segmentation & Persona Analytics';
        }

        const dict = zh ? TXT.zh : TXT.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (k === 'portalTitle') {
                el.textContent = isFaq ? dict.portalTitleFaq : dict.portalTitleAbout;
            } else if (dict[k]) {
                el.textContent = dict[k];
            }
        });

        document.querySelectorAll('#lang-menu .menu-item').forEach(b => {
            const on = b.getAttribute('data-lang') === (zh ? 'zh' : 'en');
            b.classList.toggle('active', on);
            b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
    }

    window.chooseLang = function (lang) {
        try {
            localStorage.setItem('portal_lang', lang);
        } catch (e) {}
        applyLang(lang);
        const wrap = document.getElementById('lang-menu-wrap');
        if (wrap) wrap.classList.remove('open');
    };

    window.toggleLangMenu = function (e) {
        if (e) e.stopPropagation();
        window.closeDataMenu();
        const wrap = document.getElementById('lang-menu-wrap');
        if (wrap) {
            const o = !wrap.classList.contains('open');
            wrap.classList.toggle('open', o);
            const btn = document.getElementById('lang-toggle-btn');
            if (btn) btn.setAttribute('aria-expanded', o ? 'true' : 'false');
        }
    };

    window.toggleDataMenu = function (e) {
        if (e) e.stopPropagation();
        const langWrap = document.getElementById('lang-menu-wrap');
        if (langWrap) langWrap.classList.remove('open');
        const wrap = document.getElementById('data-menu-wrap');
        if (wrap) {
            const o = !wrap.classList.contains('open');
            wrap.classList.toggle('open', o);
            const btn = document.getElementById('data-menu-btn');
            if (btn) btn.setAttribute('aria-expanded', o ? 'true' : 'false');
        }
    };

    window.closeDataMenu = function () {
        const wrap = document.getElementById('data-menu-wrap');
        if (wrap) {
            wrap.classList.remove('open');
            const btn = document.getElementById('data-menu-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    };

    // Header actions bridging to main application
    window.handleFileSelect = function (event) {
        const file = (event.target && event.target.files) ? event.target.files[0] : null;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                sessionStorage.setItem('pending_uploaded_csv', e.target.result);
                sessionStorage.setItem('pending_uploaded_csv_name', file.name);
            } catch (err) {
                console.error(err);
            }
            window.location.href = 'index.html?uploaded=1';
        };
        reader.readAsText(file, 'utf-8');
    };

    function escapeHtml(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function buildCsvGuideRows(schema, isZh) {
        const L = (en, zh) => (isZh && zh) ? zh : en;
        const pick = (o, k) => isZh ? (o[k + 'Zh'] || o[k]) : o[k];
        const list = v => Array.isArray(v) ? v : (v ? String(v).split(/[,，;；\n\r]+/).map(s => s.trim()).filter(Boolean) : []);
        const bar = a => a.join(' | ');
        const rows = [];
        const add = (r) => rows.push(Object.assign({ no: '', question: '', type: '', values: '', example: '', used: '', core: false, group: 'other' }, r));
        const MULTI = L('Multi-select: separate answers with a semicolon ( ; ). Allowed: ', '複選：答案以分號（ ; ）分隔。可填：');
        const SINGLE = L('Single choice, exactly one of: ', '單選，僅能填下列其中一項：');
        const NUM15 = L('Whole number 1-5 (1 = lowest, 5 = highest)', '整數 1-5（1＝最低，5＝最高）');

        add({ col: 'respondent_id', group: 'identity', type: L('Text / number', '文字／數字'), values: L('Unique ID per respondent. Optional.', '每位受訪者唯一編號，選填。'), example: 'R00001', used: L('Row identifier', '列識別碼') });
        add({ col: 'persona_archetype', group: 'identity', type: L('Text', '文字'), values: L('Your own pre-defined persona label. Optional - leave the column out to use data-driven clusters only.', '您自訂的人物誌標籤，選填；不提供則僅使用資料驅動分群。'), example: '', used: L('Compared against the discovered clusters', '與資料分群結果對照') });

        if (typeof getSchemaQuestionMap === 'function') {
            getSchemaQuestionMap(schema).forEach(q => {
                const slotLbl = q.slotLabel ? L(q.slotLabel.en, q.slotLabel.zh) : '';
                const base = { col: q.header, no: q.no, question: L(q.labelEn, q.labelZh) || '', used: slotLbl };
                const core = ['sup', 'reasons', 'methods', 'personal', 'stage', 'metric'].includes(q.slot);
                const n = q.no;
                const key = q.key || '';
                if (q.slot === 'demographic') {
                    const d = (schema.demographics || []).find(x => 'demo_' + String(x.key || '').replace(/^Demo_\d+_/, '') === key) || {};
                    const opts = list(pick(d, 'options'));
                    add({ ...base, group: 'demographic', type: L('Single choice', '單選'), values: opts.length ? SINGLE + bar(opts) : L('Text', '文字'), example: opts[0] || '' });
                } else if (q.slot === 'badges') {
                    const opts = list(pick(schema, 'selfImageTags'));
                    add({ ...base, group: 'badges', type: L('Single choice', '單選'), values: SINGLE + bar(opts) + L('. Q8-Q10 must be three different tags.', '。第 8-10 題須為三個不同標籤。'), example: opts[(n - 8) % Math.max(1, opts.length)] || '' });
                } else if (q.slot === 'metric') {
                    const isPct = q.header === 'Q11_familiarity_pct';
                    add({ ...base, group: 'ratings', core: true, type: L('Number', '數值'), values: isPct ? L('Number 0-100 (0 = not familiar at all, 100 = fully familiar)', '數值 0-100（0＝完全不熟，100＝非常熟悉）') : NUM15, example: isPct ? '60' : '3' });
                } else if (q.slot === 'sup' && n === 12) {
                    add({ ...base, group: 'ratings', core: true, type: L('Rating 1-5', '評分 1-5'), values: NUM15, example: '3' });
                } else if (n === 13) {
                    const o = list(pick(schema, 'q13Options'));
                    add({ ...base, group: 'ratings', core: true, type: L('Single choice', '單選'), values: SINGLE + bar(o), example: o[0] || '' });
                } else if ([16, 17, 18, 19, 26].includes(n)) {
                    const o = list(pick(schema, 'q' + n + 'Options'));
                    const multi = (n === 16 || n === 17);
                    const extra = n === 18 ? L(' Leave blank if the follow-up does not apply.', ' 若不適用請留空。') : '';
                    add({ ...base, group: n === 26 ? 'other' : 'behaviour', core, type: multi ? L('Multi-select', '複選') : L('Single choice', '單選'), values: (multi ? MULTI : SINGLE) + bar(o) + extra, example: multi ? o.slice(0, 2).join('; ') : (o[0] || '') });
                } else if (n === 20) {
                    const items = list(pick(schema, 'dailyWorkItems'));
                    const codes = items.map((it, i) => String.fromCharCode(97 + i) + ' = ' + it);
                    add({ ...base, group: 'behaviour', type: L('Time allocation', '時間分配'), values: L('code:percent pairs separated by ;  (percentages should total 100). Codes: ', '「代碼:百分比」以分號分隔（總和應為 100%）。代碼：') + codes.join(' | '), example: 'a:40%; b:35%; c:25%' });
                } else if ([22, 23, 24].includes(n)) {
                    const o = list(pick(schema, n === 22 ? 'officialSystems' : n === 23 ? 'personalTools' : 'coreNeeds'));
                    add({ ...base, group: 'behaviour', core, type: L('Multi-select', '複選'), values: MULTI + bar(o), example: o.slice(0, 2).join('; ') });
                } else if (n === 21 || n === 25) {
                    add({ ...base, group: 'text', type: L('Free text', '自由填答'), values: L('Any text.', '任意文字。'), example: L('Example answer', '範例回答') });
                } else if (q.slot === 'stage') {
                    const m = /^stage_(\d+)_(\w+)$/.exec(key) || [];
                    const st = (schema.stages || [])[parseInt(m[1], 10) - 1] || {};
                    const f = m[2];
                    const det = st.actionDetails || [];
                    const union = field => { const s = []; det.forEach(a => list(isZh ? (a[field + 'Zh'] || a[field]) : a[field]).forEach(v => { if (!s.includes(v)) s.push(v); })); return s; };
                    const stTitle = L(st.title, st.titleZh) || '';
                    if (f === 'rating') add({ ...base, question: stTitle, group: 'journey', core: true, type: L('Rating 1-5', '評分 1-5'), values: L('Emotional experience of this stage: ', '此階段整體感受：') + NUM15, example: '3' });
                    else if (f === 'pain') add({ ...base, question: stTitle, group: 'journey', core: true, type: L('Free text', '自由填答'), values: L('Pain point in your own words. Wording such as "re-enter", "wait", "error" is counted towards the Abandonment & Rework Rate (AR).', '以自己的話描述痛點。含「重複輸入」「等待」「錯誤」等字眼會計入放棄與重工率（AR）。'), example: L('Re-entering the same client data twice', '同樣的客戶資料要重複輸入兩次') });
                    else if (f === 'location') { const o = union('locations'); add({ ...base, question: stTitle, group: 'journey', type: L('Single choice', '單選'), values: o.length ? SINGLE + bar(o) : L('Text', '文字'), example: o[0] || '' }); }
                    else { const o = union('tools'); add({ ...base, question: stTitle, group: 'journey', core: true, type: L('Multi-select', '複選'), values: (o.length ? MULTI + bar(o) : L('Semicolon-separated text', '以分號分隔的文字')) + L('. Tools and people (e.g. a colleague) both count; people raise Human-Assist Reliance (PR).', '。工具與人員（如同事）皆可填；填人員會提高人工協助依賴度（PR）。'), example: o.slice(0, 2).join('; ') }); }
                } else {
                    add({ ...base, group: 'other', core, type: L('Text', '文字'), values: '', example: '' });
                }
            });
        }
        return rows;
    }

    function csvGuideCell(v) { return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"'; }
    function csvGuideDownload(name, text) {
        const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    window.downloadCsvTemplate = function () {
        const zh = isZh();
        const schema = (typeof getActiveJourneySchema === 'function') ? getActiveJourneySchema() : null;
        if (!schema) return;
        const rows = buildCsvGuideRows(schema, zh);
        const text = rows.map(r => csvGuideCell(r.col)).join(',') + '\r\n' + rows.map(r => csvGuideCell(r.example)).join(',') + '\r\n';
        csvGuideDownload((schema.id || 'survey') + '_CSV_Template_' + (zh ? 'ZH' : 'EN') + '.csv', text);
    };

    window.downloadCsvDictionary = function () {
        const zh = isZh();
        const schema = (typeof getActiveJourneySchema === 'function') ? getActiveJourneySchema() : null;
        if (!schema) return;
        const head = zh ? ['CSV 欄位名稱', '題號', '題目／說明', '答案類型', '可填內容／格式', '用於', '優先度'] : ['CSV column', 'Question no.', 'Question / description', 'Answer type', 'Allowed values / format', 'Used for', 'Priority'];
        const rows = buildCsvGuideRows(schema, zh);
        const text = [head.map(csvGuideCell).join(',')].concat(rows.map(r => [r.col, r.no, r.question, r.type, r.values, r.used, r.core ? (zh ? '核心' : 'Core') : (zh ? '選填' : 'Optional')].map(csvGuideCell).join(','))).join('\r\n') + '\r\n';
        csvGuideDownload((schema.id || 'survey') + '_CSV_Column_Dictionary_' + (zh ? 'ZH' : 'EN') + '.csv', text);
    };

    window.downloadQuestionnaireTemplate = function () {
        try {
            const zh = isZh();
            const lang = zh ? 'zh' : 'en';
            const schema = (typeof getActiveJourneySchema === 'function') ? getActiveJourneySchema() : null;
            if (!schema) return;

            let html = '';
            if (typeof window.generateQuestionnaireHTML === 'function') {
                html = window.generateQuestionnaireHTML(schema, lang);
            } else if (typeof generateQuestionnaireHTML === 'function') {
                html = generateQuestionnaireHTML(schema, lang);
            }

            const schemaKey = (schema.id || 'Modular').replace(/[^a-zA-Z0-9_-]/g, '_');
            const langSuffix = zh ? 'ZH' : 'EN';
            const filename = `${schemaKey}_Modular_Questionnaire_Template_${langSuffix}.html`;

            if (html) {
                const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 400);
            } else {
                const link = document.createElement('a');
                link.href = `Modular_Questionnaire_Template_${langSuffix}.html`;
                link.download = `Modular_Questionnaire_Template_${langSuffix}.html`;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => { document.body.removeChild(link); }, 400);
            }
        } catch (err) {
            console.error('[Download Questionnaire Error]', err);
        }
    };

    window.openQuestionnaireTemplate = function () {
        window.downloadQuestionnaireTemplate();
    };

    // Synchronize custom schemas and active journey schema on page load
    try {
        const storedDomain = localStorage.getItem('current_journey_domain');
        if (storedDomain) {
            window.currentJourneyDomain = storedDomain;
            if (typeof currentJourneyDomain !== 'undefined') currentJourneyDomain = storedDomain;
        }
        const activeStored = localStorage.getItem('active_journey_schema');
        if (activeStored) {
            const parsed = JSON.parse(activeStored);
            if (parsed && parsed.id) {
                window.__activeCustomSchema = parsed;
                if (typeof window.JOURNEY_SCHEMAS === 'object' && window.JOURNEY_SCHEMAS) {
                    window.JOURNEY_SCHEMAS[parsed.id] = parsed;
                }
                if (typeof JOURNEY_SCHEMAS === 'object' && JOURNEY_SCHEMAS) {
                    JOURNEY_SCHEMAS[parsed.id] = parsed;
                }
            }
        }
        const customSchemasRaw = localStorage.getItem('portal_custom_schemas');
        if (customSchemasRaw) {
            const parsedCustom = JSON.parse(customSchemasRaw);
            if (parsedCustom && typeof parsedCustom === 'object') {
                Object.keys(parsedCustom).forEach(k => {
                    if (parsedCustom[k] && typeof window.JOURNEY_SCHEMAS === 'object' && window.JOURNEY_SCHEMAS) {
                        window.JOURNEY_SCHEMAS[k] = parsedCustom[k];
                    }
                    if (parsedCustom[k] && typeof JOURNEY_SCHEMAS === 'object' && JOURNEY_SCHEMAS) {
                        JOURNEY_SCHEMAS[k] = parsedCustom[k];
                    }
                });
            }
        }
    } catch (e) {
        console.warn('[portal-static] Error restoring custom schemas:', e);
    }

    window.openSchemaBuilderModal = function () {
        let modal = document.getElementById('schema-builder-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'schema-builder-modal';
            modal.className = 'modal-overlay';
            modal.style.cssText = 'z-index: 10005; padding: 0; margin: 0; display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); align-items: center; justify-content: center; overflow: hidden;';
            modal.onclick = function (e) {
                if (e.target === this) window.closeSchemaBuilderModal();
            };
            modal.innerHTML =
                '<div class="modal-content" onclick="event.stopPropagation()" style="width: 100vw; max-width: 100vw; height: 100%; height: 100vh; height: 100dvh; max-height: 100%; max-height: 100vh; max-height: 100dvh; padding: 0; margin: 0; border: none; border-radius: 0; background: #0b1120; box-shadow: none; display: flex; flex-direction: column; overflow: hidden; position: fixed; inset: 0;">' +
                    '<iframe id="modular-questionnaire-iframe" src="about:blank" style="width: 100%; height: 100%; min-height: 100%; border: none; display: block; flex: 1 1 100%;" title="Modular Questionnaire Designer"></iframe>' +
                '</div>';
            document.body.appendChild(modal);
        }
        const zh = isZh();
        const lang = zh ? 'zh' : 'en';
        let domain = 'agent';
        try {
            if (window.__activeCustomSchema && window.__activeCustomSchema.id) {
                domain = window.__activeCustomSchema.id;
            } else if (typeof getActiveJourneySchema === 'function' && getActiveJourneySchema() && getActiveJourneySchema().id) {
                domain = getActiveJourneySchema().id;
            } else {
                domain = localStorage.getItem('current_journey_domain') || 'agent';
            }
        } catch(e) {}
        const iframe = document.getElementById('modular-questionnaire-iframe');
        if (iframe) {
            iframe.src = 'modular_questionnaire.html?lang=' + lang + '&schema=' + encodeURIComponent(domain) + '&t=' + Date.now();
        }
        modal.style.display = 'flex';
        modal.classList.add('active');
    };

    window.closeSchemaBuilderModal = function () {
        const modal = document.getElementById('schema-builder-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            const iframe = document.getElementById('modular-questionnaire-iframe');
            if (iframe) iframe.src = 'about:blank';
        }
    };

    window.openCsvGuide = function () {
        let modal = document.getElementById('csv-guide-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'csv-guide-modal';
            modal.className = 'modal-overlay';
            modal.style.cssText = 'z-index: 10003; display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); align-items: center; justify-content: center; backdrop-filter: blur(4px);';
            modal.onclick = function (e) { if (e.target === this) window.closeCsvGuide(); };
            modal.innerHTML =
                '<div class="glass-panel modal-content" onclick="event.stopPropagation()" style="max-width: 1080px; width: 94%; height: 88vh; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; border: 1px solid rgba(245, 197, 24, 0.4); background: rgba(18, 22, 31, 0.98); border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.7);">' +
                    '<div style="flex-shrink: 0; padding: 18px 24px; border-bottom: 1px solid var(--panel-border); display: flex; justify-content: space-between; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.98);">' +
                        '<div>' +
                            '<h3 id="csv-guide-title" style="margin: 0; color: #fff; font-size: 1.25rem; font-weight: 700;">CSV Column Guide</h3>' +
                            '<p id="csv-guide-subtitle" style="margin: 4px 0 0; font-size: 0.95rem; color: #94a3b8;"></p>' +
                        '</div>' +
                        '<button class="btn btn-secondary" onclick="closeCsvGuide()" aria-label="Close" style="flex-shrink: 0; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; padding: 0;">&#10005;</button>' +
                    '</div>' +
                    '<div id="csv-guide-body" style="flex: 1; overflow-y: auto; padding: 18px 24px;"></div>' +
                    '<div class="csv-guide-footer" style="flex-shrink: 0; padding: 14px 24px; border-top: 1px solid var(--panel-border); display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; background: rgba(15, 23, 42, 0.98);">' +
                        '<button class="btn btn-secondary" id="csv-guide-btn-dict" onclick="downloadCsvDictionary()">Download Column Dictionary (CSV)</button>' +
                        '<button class="btn btn-primary" id="csv-guide-btn-template" onclick="downloadCsvTemplate()">Download CSV Template (header + example row)</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }
        const zh = isZh();
        const schema = (typeof getActiveJourneySchema === 'function') ? getActiveJourneySchema() : null;
        if (!schema) return;
        const rows = buildCsvGuideRows(schema, zh);
        const groups = [
            ['identity', zh ? '識別欄位' : 'Identity'], ['demographic', zh ? '背景資料（篩選用）' : 'Demographics (filters)'], ['badges', zh ? '自我形象標籤' : 'Self-image tags'],
            ['ratings', zh ? '評分與技能（分群、SUP）' : 'Ratings & skills (clustering, SUP)'], ['behaviour', zh ? '工作方式與工具（TU / PR）' : 'Work methods & tools (TU / PR)'],
            ['text', zh ? '開放式回答' : 'Open text'], ['journey', zh ? '歷程地圖（AR / PR）' : 'Journey map (AR / PR)'], ['other', zh ? '其他' : 'Other']
        ];
        const esc = escapeHtml;
        const th = 'padding:8px 10px; text-align:left; font-size:var(--fs-caption, 0.8125rem); color:#94a3b8; border-bottom:1px solid rgba(255,255,255,0.15); white-space:nowrap; font-weight:600;';
        const td = 'padding:8px 10px; font-size:var(--fs-small, 0.875rem); vertical-align:top; border-bottom:1px solid rgba(255,255,255,0.06); line-height:1.5;';
        const body = groups.map(([g, title]) => {
            const rs = rows.filter(r => r.group === g); if (!rs.length) return '';
            return '<details ' + (g === 'identity' || g === 'behaviour' ? 'open' : '') + ' style="border:1px solid rgba(255,255,255,0.12); border-radius:8px; margin-bottom:10px; background:rgba(255,255,255,0.02);">' +
                '<summary style="cursor:pointer; padding:10px 14px; font-size:var(--fs-body, 0.9375rem); font-weight:600; color:#fff;">' + esc(title) + ' <span style="font-weight:400; color:#94a3b8; font-size:var(--fs-caption, 0.8125rem);">(' + rs.length + ' ' + (zh ? '欄' : 'columns') + ')</span></summary>' +
                '<div style="overflow-x:auto; padding:0 6px 8px;"><table style="border-collapse:collapse; width:100%; min-width:860px; table-layout:fixed;"><colgroup><col style="width:22%"><col style="width:24%"><col style="width:38%"><col style="width:16%"></colgroup>' +
                    '<thead><tr><th style="' + th + '">' + (zh ? 'CSV 欄位名稱' : 'CSV column') + '</th><th style="' + th + '">' + (zh ? '題目' : 'Question') + '</th><th style="' + th + '">' + (zh ? '可填內容／格式' : 'Allowed values / format') + '</th><th style="' + th + '">' + (zh ? '用於' : 'Used for') + '</th></tr></thead>' +
                    '<tbody>' + rs.map(r => '<tr>' +
                        '<td style="' + td + ' font-family:ui-monospace,Menlo,Consolas,monospace; color:#facc15; word-break:break-all;">' + esc(r.col) + '</td>' +
                        '<td style="' + td + ' color:#e2e8f0; min-width:180px;">' + (r.no ? '<strong>Q' + esc(r.no) + '</strong> ' : '') + esc(r.question) + '</td>' +
                        '<td style="' + td + ' color:#cbd5e1; min-width:260px;">' + esc(r.values) + '</td>' +
                        '<td style="' + td + ' color:#94a3b8; min-width:120px;">' + esc(r.used) + (r.core ? ' <span style="color:#10b981; font-weight:700;">&bull; ' + (zh ? '核心' : 'Core') + '</span>' : '') + '</td></tr>').join('') + '</tbody></table></div></details>';
        }).join('');
        const rules = zh
            ? ['檔案為 UTF-8 編碼的 CSV，第一列為欄位名稱，每位受訪者一列。', '欄位名稱需與下表完全一致（可用「下載 CSV 範本」取得表頭）；順序不限，缺少的欄位會使用中性預設值。', '複選題在同一格內以分號（ ; ）分隔；選項文字請與下表一致。', '受訪者未回答時請留空；缺漏的評分會以中性預設值計算。']
            : ['UTF-8 encoded CSV, first row = column names, one row per respondent.', 'Column names must match the table below exactly (use "Download CSV Template" to get the header row). Order does not matter; missing columns fall back to neutral defaults.', 'Multi-select answers go in one cell, separated by a semicolon ( ; ). Use the option wording shown below.', 'Leave a cell empty when the respondent did not answer; missing ratings fall back to neutral defaults.'];
        document.getElementById('csv-guide-title').textContent = zh ? 'CSV 欄位說明' : 'CSV Column Guide';
        document.getElementById('csv-guide-subtitle').textContent = (zh ? (schema.nameZh || schema.name) : schema.name) + ' · ' + rows.length + (zh ? ' 欄' : ' columns');
        document.getElementById('csv-guide-body').innerHTML = '<ul style="margin:0 0 16px; padding-left:20px; font-size:var(--fs-small, 0.875rem); color:#cbd5e1; line-height:1.55;">' + rules.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>' + body;
        document.getElementById('csv-guide-btn-template').textContent = zh ? '下載 CSV 範本（表頭＋範例列）' : 'Download CSV Template (header + example row)';
        document.getElementById('csv-guide-btn-dict').textContent = zh ? '下載欄位字典（CSV）' : 'Download Column Dictionary (CSV)';

        modal.style.display = 'flex';
        modal.classList.add('active');
    };

    window.closeCsvGuide = function () {
        const modal = document.getElementById('csv-guide-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    };

    window.applySchemaToPlatform = function(schema) {
        if (!schema || !schema.id) return;
        if (typeof window.JOURNEY_SCHEMAS === 'object' && window.JOURNEY_SCHEMAS) {
            window.JOURNEY_SCHEMAS[schema.id] = schema;
        }
        if (typeof JOURNEY_SCHEMAS === 'object' && JOURNEY_SCHEMAS) {
            JOURNEY_SCHEMAS[schema.id] = schema;
        }
        window.currentJourneyDomain = schema.id;
        if (typeof currentJourneyDomain !== 'undefined') currentJourneyDomain = schema.id;
        window.__activeCustomSchema = schema;
        try {
            localStorage.setItem('active_journey_schema', JSON.stringify(schema));
            localStorage.setItem('current_journey_domain', schema.id);
            localStorage.setItem(`custom_journey_schema_${schema.id}`, JSON.stringify(schema));
            let allCustom = {};
            try {
                const raw = localStorage.getItem('portal_custom_schemas');
                if (raw) allCustom = JSON.parse(raw);
            } catch(e) {}
            allCustom[schema.id] = schema;
            localStorage.setItem('portal_custom_schemas', JSON.stringify(allCustom));
        } catch(e) {}
        window.closeSchemaBuilderModal();
    };

    window.addEventListener('message', function (e) {
        if (!e.data) return;
        if (e.data === 'closeSchemaBuilderModal' || e.data.type === 'closeSchemaBuilderModal' || e.data.type === 'CLOSE_SCHEMA_MODAL') {
            window.closeSchemaBuilderModal();
        } else if (e.data.type === 'SCHEMA_UPDATED' || e.data.type === 'APPLY_SCHEMA') {
            if (e.data.schema) {
                window.applySchemaToPlatform(e.data.schema);
            } else {
                window.closeSchemaBuilderModal();
            }
        }
    });

    window.restoreOriginalDataset = function () {
        window.location.href = 'index.html?restoreDefault=1';
    };

    const X_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    const CHOOSER_TXT = {
        en: {
            chTitle: 'Where would you like to start?',
            rec: 'Recommended for a first visit',
            optA: ['Explore the sample data', 'See personas, journey maps and clustering using the data that is already loaded.'],
            optB: ['Design a questionnaire', 'Choose your questions and download a questionnaire to send to respondents.'],
            optC: ['Analyse my own survey data', 'Get the CSV template, upload your file and check how your columns match.'],
            close: 'Close',
            dontShow: "Don't show the tutorial again"
        },
        zh: {
            chTitle: '想從哪裡開始？',
            rec: '第一次使用建議從這裡開始',
            optA: ['先看範例資料', '用已載入的資料，依序查看人物誌、歷程地圖與分群結果。'],
            optB: ['設計問卷', '選擇要詢問的題目，並下載問卷發送給受訪者。'],
            optC: ['分析我自己的問卷資料', '取得 CSV 範本、上傳檔案，並確認欄位對應的結果。'],
            close: '關閉',
            dontShow: '不再顯示教學'
        }
    };

    window.closeChooser = function () {
        const c = document.getElementById('qps-chooser');
        if (c) c.style.display = 'none';
    };

    window.openStartHere = function () {
        let chooser = document.getElementById('qps-chooser');
        if (!chooser) {
            chooser = document.createElement('div');
            chooser.id = 'qps-chooser';
            document.body.appendChild(chooser);
        }
        const zh = isZh();
        const dict = zh ? CHOOSER_TXT.zh : CHOOSER_TXT.en;

        const optHtml = (item, url, isRec) => {
            return '<button type="button" class="qps-opt" data-url="' + url + '">' +
                '<span class="qps-opt-t">' + item[0] + (isRec ? '<span class="qps-rec">' + dict.rec + '</span>' : '') + '</span>' +
                '<span class="qps-opt-b">' + item[1] + '</span>' +
                '</button>';
        };

        let dontShowAgain = false;
        try {
            const raw = localStorage.getItem('qp-start-v1');
            if (raw) dontShowAgain = !!JSON.parse(raw).dontShowAgain;
        } catch (e) {}

        chooser.innerHTML =
            '<div class="qps-ch-card">' +
                '<button type="button" class="qps-x qps-ch-x" aria-label="' + dict.close + '">' + X_SVG + '</button>' +
                '<h2 id="qps-ch-title">' + dict.chTitle + '</h2>' +
                optHtml(dict.optA, 'index.html?startRoute=sample#personas', true) +
                optHtml(dict.optB, 'index.html?startRoute=quest#journeys', false) +
                optHtml(dict.optC, 'index.html?startRoute=own', false) +
                '<div class="qps-ch-footer" style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:flex-end;">' +
                '<label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none;font-size:0.92rem;color:#aab3c0;">' +
                '<input type="checkbox" id="qps-ch-dont-show-chk" ' + (dontShowAgain ? 'checked' : '') + ' style="accent-color:#f5c518;cursor:pointer;width:16px;height:16px;margin:0;">' +
                '<span>' + dict.dontShow + '</span></label></div>' +
            '</div>';

        chooser.style.display = 'flex';

        const card = chooser.querySelector('.qps-ch-card');
        if (card) {
            card.onclick = function (e) { e.stopPropagation(); };
        }
        const chk = chooser.querySelector('#qps-ch-dont-show-chk');
        if (chk) {
            chk.onchange = function () {
                try {
                    let s = { done: {}, dismissed: false, seen: true, dontShowAgain: false };
                    const raw = localStorage.getItem('qp-start-v1');
                    if (raw) s = Object.assign(s, JSON.parse(raw));
                    s.dontShowAgain = chk.checked;
                    s.dismissed = chk.checked;
                    localStorage.setItem('qp-start-v1', JSON.stringify(s));
                } catch (e) {}
            };
        }
        const closeBtn = chooser.querySelector('.qps-ch-x');
        if (closeBtn) {
            closeBtn.onclick = function (e) {
                e.stopPropagation();
                window.closeChooser();
            };
        }
        chooser.onclick = function () {
            window.closeChooser();
        };
        chooser.querySelectorAll('.qps-opt').forEach(btn => {
            btn.onclick = function (e) {
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url) window.location.href = url;
            };
        });

        const first = chooser.querySelector('.qps-opt');
        if (first) first.focus();
    };

    document.addEventListener('click', e => {
        const langWrap = document.getElementById('lang-menu-wrap');
        if (langWrap && langWrap.classList.contains('open') && !langWrap.contains(e.target)) {
            langWrap.classList.remove('open');
            const btn = document.getElementById('lang-toggle-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
        const dataWrap = document.getElementById('data-menu-wrap');
        if (dataWrap && dataWrap.classList.contains('open') && !dataWrap.contains(e.target)) {
            dataWrap.classList.remove('open');
            const btn = document.getElementById('data-menu-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    const isMobile = () => window.innerWidth <= 900;
    const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    function setDrawer(on) {
        if (!isMobile()) on = false;
        document.body.classList.toggle('drawer-open', !!on);
        const nav = document.getElementById('main-nav');
        if (nav) {
            nav.classList.toggle('drawer-open', !!on);
            if (on) {
                nav.classList.remove('quiet');
            } else if (noHover) {
                nav.classList.add('quiet');
            }
        }
        const brand = document.getElementById('brand-cell');
        if (brand && isMobile()) brand.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    window.toggleRailDrawer = function (e) {
        if (isMobile()) {
            if (e) e.stopPropagation();
            setDrawer(!document.body.classList.contains('drawer-open'));
        } else {
            window.location.href = 'index.html#personas';
        }
    };
    window.closeRailDrawer = function () { setDrawer(false); };

    function initRail() {
        const nav = document.getElementById('main-nav'), pin = document.getElementById('rail-pin');
        if (!nav) return;
        const store = {
            get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
            set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
        };
        function setPinned(on, save) {
            nav.classList.toggle('pinned', on);
            if (pin) pin.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (save) store.set('rail_pinned', on ? '1' : '0');
        }
        window.toggleRailPin = () => setPinned(!nav.classList.contains('pinned'), true);
        setPinned(store.get('rail_pinned') === '1', false);

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!nav.classList.contains('pinned') && !reduce && window.innerWidth > 900) {
            nav.classList.add('intro');
            setTimeout(() => nav.classList.remove('intro'), 1000);
        }
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (typeof window.closeChooser === 'function') window.closeChooser();
            if (typeof window.closeSchemaBuilderModal === 'function') window.closeSchemaBuilderModal();
            if (typeof window.closeCsvGuide === 'function') window.closeCsvGuide();
            setDrawer(false);
            window.closeDataMenu();
            const wrap = document.getElementById('lang-menu-wrap');
            if (wrap) {
                wrap.classList.remove('open');
                const btn = document.getElementById('lang-toggle-btn');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobile()) setDrawer(false);
    });

    function init() {
        const lang = isZh() ? 'zh' : 'en';
        applyLang(lang);
        initRail();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
