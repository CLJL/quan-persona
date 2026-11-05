/* quan-persona - "Start here" onboarding: chooser, three short guided routes (act-to-advance) and a Getting-started checklist.
   Works alongside the existing 14-step guided tour (portal-tour.js), which is kept as the "full tour". */
(function () {
    'use strict';
    const KEY = 'qp-start-v1';
    const $ = id => document.getElementById(id);
    const isZh = () => (typeof currentLang !== 'undefined' && currentLang === 'zh') || (typeof detectInitialLanguage === 'function' && detectInitialLanguage() === 'zh');
    const lab = k => { try { return (typeof t === 'function') ? t(k) : k; } catch (e) { return k; } };
    const fill = s => s.replace(/\{(#?[\w-]+)\}/g, (m, k) => { if (k.charAt(0) === '#') { const e = document.getElementById(k.slice(1)); return e ? e.textContent.trim() : ''; } return lab(k); });
    const secNow = () => (typeof activeSection !== 'undefined') ? activeSection : null;

    // ---------- persisted state (per-viewer convenience only; every access is guarded) ----------
    let S = { done: {}, dismissed: false, seen: false };   // done: { sample, quest, own }
    try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
    function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

    // ---------- copy (EN / zh-TW). {key} placeholders are replaced with the portal's own button labels ----------
    const TXT = {
        en: {
            chTitle: 'Where would you like to start?',
            rec: 'Recommended for a first visit',
            optA: ['Explore the sample data', 'See personas, journey maps and clustering using the data that is already loaded.'],
            optB: ['Design a questionnaire', 'Choose your questions and download a questionnaire to send to respondents.'],
            optC: ['Analyse my own survey data', 'Get the CSV template, upload your file and check how your columns match.'],
            step: 'Step', of: 'of', back: 'Back', next: 'Next', close: 'Close',
            ownData: 'Analyse my own data', toSample: 'Explore the sample data', toQuest: 'Design a questionnaire', finish: 'Finish',
            chip: 'Getting started', show: 'Show me',
            items: { sample: 'Explore the sample data', quest: 'Design a questionnaire', own: 'Analyse my own survey data' }
        },
        zh: {
            chTitle: '想從哪裡開始？',
            rec: '第一次使用建議從這裡開始',
            optA: ['先看範例資料', '用已載入的資料，依序查看人物誌、歷程地圖與分群結果。'],
            optB: ['設計問卷', '選擇要詢問的題目，並下載問卷發送給受訪者。'],
            optC: ['分析我自己的問卷資料', '取得 CSV 範本、上傳檔案，並確認欄位對應的結果。'],
            step: '步驟', of: '／', back: '上一步', next: '下一步', close: '關閉',
            ownData: '分析我的資料', toSample: '先看範例資料', toQuest: '設計問卷', finish: '完成',
            chip: '新手上路', show: '帶我去',
            items: { sample: '先看範例資料', quest: '設計問卷', own: '分析我自己的問卷資料' }
        }
    };

    // ---------- helpers for spotlight targets that are not a single element ----------
    const q1 = sel => { try { return document.querySelector(sel); } catch (e) { return null; } };
    const visible = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    function virt(rect, anchor) { return { virt: true, getBoundingClientRect: () => rect(), scrollIntoView: o => { try { (anchor && anchor.scrollIntoView) && anchor.scrollIntoView(o); } catch (e) {} } }; }
    function union(list) {   // one box around every visible element in the list
        const els = list.filter(visible);
        if (!els.length) return null;
        return virt(() => {
            const rs = els.map(e => e.getBoundingClientRect());
            const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top)), r2 = Math.max(...rs.map(r => r.right)), b = Math.max(...rs.map(r => r.bottom));
            return { left: l, top: t, right: r2, bottom: b, width: r2 - l, height: b - t };
        }, els[0]);
    }
    function capTop(e, h) {  // only the top h pixels of a tall element
        if (!visible(e)) return null;
        return virt(() => { const r = e.getBoundingClientRect(), hh = Math.min(h, r.height); return { left: r.left, top: r.top, right: r.right, bottom: r.top + hh, width: r.width, height: hh }; }, e);
    }
    function quotesArea() {   // the 'Enter quote' box on the photo, plus the Agent Motto list
        return union([q1('#edit-quote'), q1('.p-verbatim-card h3'), ...[...document.querySelectorAll('.p-verbatim-list > *')].slice(0, 3)]);
    }
    function designerWhole() { const f = $('modular-questionnaire-iframe'); return visible(f) ? f : null; }
    let applyRect = null;   // reported by the designer page itself (works even when the frame is not readable from here)
    window.addEventListener('message', e => {
        const f = $('modular-questionnaire-iframe');
        if (f && e.source === f.contentWindow && e.data && e.data.qpsApplyRect) applyRect = e.data.qpsApplyRect;
    });
    function designerApply() {   // the Apply Schema button lives inside the designer iframe
        const f = $('modular-questionnaire-iframe'); if (!f || !visible(f)) return null;
        let d = null; try { d = f.contentDocument; } catch (e) {}
        const b = d && [...d.querySelectorAll('[onclick*="applySchemaToPlatformAction"]')].find(visible);
        const rel = b ? () => b.getBoundingClientRect() : (applyRect ? () => applyRect : null);
        if (!rel) {
            if (d) return null;   // frame readable but still loading
            return virt(() => { const fr = f.getBoundingClientRect(); return { left: fr.right - 200, top: fr.top + 10, right: fr.right - 10, bottom: fr.top + 54, width: 190, height: 44 }; }, f);
        }
        return virt(() => { const r = rel(), fr = f.getBoundingClientRect(); return { left: fr.left + r.left, top: fr.top + r.top, right: fr.left + r.left + r.width, bottom: fr.top + r.top + r.height, width: r.width, height: r.height }; }, f);
    }
    function lowestDip() {   // the journey node that sits lowest on screen
        const svg = $('journey-svg'); if (!svg) return null;
        const nodes = [...svg.querySelectorAll('.journey-node')].filter(visible);
        if (!nodes.length) return null;
        let low = nodes[0]; nodes.forEach(n => { if (n.getBoundingClientRect().top > low.getBoundingClientRect().top) low = n; });
        return virt(() => { const r = low.getBoundingClientRect(), c = 16, cx = r.left + r.width / 2, cy = r.top + r.height / 2; return { left: cx - c, top: cy - c, right: cx + c, bottom: cy + c, width: 2 * c, height: 2 * c }; }, low);
    }

    // ---------- routes ----------
    // sel: selector or function returning the element to spotlight. wait: what the viewer must do to advance.
    const ROUTES = {
        sample: [
            { id: 'persona', section: 'personas', sel: '#capsule-tabs-container', wait: { click: '.capsule-tab' },
              en: ['Start here: open a persona', 'Each tab is a group of respondents with similar behaviour, found in the sample data that is already loaded. Click any Cluster tab to switch groups.'],
              zh: ['從這裡開始：點選一個人物誌', '每個分頁代表一群行為相近的受訪者，由已載入的範例資料分群而來。請點選任一個分群分頁，切換查看不同群體。'] },
            { id: 'read', section: 'personas', sel: () => union([q1('.p-profile-section'), q1('#edit-desc')]),
              en: ['Read the persona', 'Who this group is. You can edit the name and description to suit your team.'],
              zh: ['看懂這張人物誌', '這群人是誰。你可以依團隊的需求，直接修改名稱與描述。'] },
            { id: 'read2', section: 'personas', sel: () => union([q1('.p-timeline-card h3'), q1('.p-timeline-step.active')]),
              en: ['Understand their journey', 'What they do at each stage, including their tools and pain points.'],
              zh: ['了解他們的歷程', '他們在每個階段做了什麼，包含使用的工具與遇到的痛點。'] },
            { id: 'read3', section: 'personas', sel: quotesArea,
              en: ['What do they think', 'Their quotes. You can create a motto based on their quote.'],
              zh: ['他們怎麼想', '他們的心聲。你可以參考這些話，自己寫一句座右銘。'] },
            { id: 'journey', section: 'personas', drawer: true, pad: 1, sel: '#btn-sec-journeys', wait: { section: 'journeys' },
              en: ['Open {navJourneys}', 'Click {navJourneys} in the left menu. It shows what each group does at every stage of the journey.'],
              zh: ['接著：開啟「{navJourneys}」', '點選左側選單的「{navJourneys}」，查看各群在旅程每個階段做了什麼。'] },
            { id: 'weak', section: 'journeys', sel: () => (window.innerWidth <= 768 ? lowestDip() : null) || q1('#journey-svg'),
              en: ['Find the weakest stage', 'The curve shows how satisfied this group is at each stage. The lowest dip is where to improve first, and the cards below it suggest actions.'],
              zh: ['找出最需要改善的階段', '曲線代表這群人在各階段的滿意度；最低的谷底就是優先改善的地方，下方的卡片會提出改善建議。'] },
            { id: 'analytics', section: 'journeys', drawer: true, pad: 1, sel: '#btn-sec-analytics', wait: { section: 'analytics' },
              en: ['Then open {navAnalytics}', 'Click {navAnalytics} in the left menu to see how the groups were formed.'],
              zh: ['再來：開啟「{navAnalytics}」', '點選左側選單的「{navAnalytics}」，查看這些分群是怎麼形成的。'] },
            { id: 'k', section: 'analytics', sel: () => { const sl = document.getElementById('cluster-k-slider'); let e = sl && sl.parentElement; while (e && !e.querySelector('.btn-primary')) e = e.parentElement; return e; }, wait: { click: '#ai-cluster-discovery .btn-primary' },
              en: ['Try a different number of groups', 'Drag the slider (3 to 8), then press {runClustering}. The groups, charts and tables are recalculated.'],
              zh: ['試試不同的分群數量', '拖曳滑桿（3 到 8 組），再按「{runClustering}」；分群、圖表與表格都會重新計算。'] },
            { id: 'end', center: true, last: true, buttons: ['toQuest'],
              en: ['You have seen the full loop', 'Personas, then Journey Map, then Analytics. Next, learn how to design a questionnaire.'],
              zh: ['完整流程你已經走過一遍', '人物誌、歷程地圖、數據分析。接下來，來看看怎麼設計問卷。'] }
        ],
        quest: [
            { id: 'designer', sel: '#btn-schema-builder', wait: { click: '#btn-schema-builder' },
              en: ['Choose your questions', 'Click {customizeSchema} to open the questionnaire designer.'],
              zh: ['選擇要詢問的題目', '點選「{customizeSchema}」，開啟問卷設計工具。'] },
            { id: 'setup', designer: true, delay: 350, sel: designerWhole, also: designerApply, closeAdvances: true,
              en: ['Set your questions', 'Pick the background questions, rating items and journey stages in the Schema Designer, then click “{applySchema}.”'],
              zh: ['設定你的題目', '在問卷設計工具中挑選背景題、評分題與旅程階段，然後點選「{applySchema}」。'] },
            { id: 'download', sel: '#download-questionnaire-btn', wait: { click: '#download-questionnaire-btn' },
              en: ['Download the questionnaire', 'After successfully setting up your schema, click {questionnaireTemplate}. Then send the file to respondents by email or through your survey platform.'],
              zh: ['下載問卷', '問卷架構設定完成後，點選「{questionnaireTemplate}」，再透過電子郵件或你的問卷平台，把檔案發送給受訪者。'] },
            { id: 'back', last: true, sel: '#upload-csv-btn', buttons: ['ownData'],
              en: ['When responses come back', 'Export data as a CSV file. Before uploading the CSV file to the dashboard, check that your survey data structure aligns with the {csvGuide}. Visit the next chapter to read the {csvGuide}.'],
              zh: ['回收問卷之後', '把資料匯出成 CSV 檔。上傳到儀表板之前，請先對照「{csvGuide}」，確認你的問卷資料結構與欄位相符。接下來的章節會帶你閱讀「{csvGuide}」。'] }
        ],
        own: [
            { id: 'dataicon', sel: '#data-menu-btn', wait: { click: '#data-menu-btn' },
              en: ['Find the {dataMenu} icon at the top', 'Click the data icon to open the data menu.'],
              zh: ['在上方找到「{dataMenu}」圖示', '點選資料圖示，開啟資料選單。'] },
            { id: 'menu', menu: true, delay: 200, sel: '#data-menu', also: '#data-menu-btn', wait: { click: '#csv-guide-btn' },
              en: ['Find the {csvGuide} in the drop-down menu', 'Click {csvGuide} to access the page.'],
              zh: ['在下拉選單中找到「{csvGuide}」', '點選「{csvGuide}」，進入說明頁面。'] },
            { id: 'guide', guide: true, delay: 350, sel: '#csv-guide-body',
              en: ['Read the {csvGuide}', 'Click {csvGuide}. It lists the columns you need and has a template to download.'],
              zh: ['閱讀「{csvGuide}」', '點選「{csvGuide}」。裡面列出你需要的欄位，也提供範本可以下載。'] },
            { id: 'template', guide: true, delay: 350, sel: '#csv-guide-btn-template', wait: { click: '#csv-guide-btn-template' },
              en: ['Download the template', 'Click Download CSV Template and fill it with your survey responses.'],
              zh: ['下載範本', '點選「下載 CSV 範本」，並填入你的問卷回覆。'] },
            { id: 'upload', sel: '#upload-csv-btn', wait: { change: '#file-input' },
              en: ['Upload your file', 'Click the upload icon and choose your CSV file. It is processed in your browser.'],
              zh: ['上傳你的檔案', '點選上傳圖示並選擇你的 CSV 檔案；檔案只會在你的瀏覽器中處理。'] },
            { id: 'match', last: true, mapping: true, delay: 450, sel: () => capTop(q1('#csv-mapping-scroll-body'), 300), buttons: ['toSample'],
              en: ['Check the column match', 'After you choose a file, a screen shows how your columns were matched. Check it, then apply.'],
              zh: ['確認欄位對應', '選好檔案後，畫面會顯示你的欄位對應結果，確認無誤後再套用。'] }
        ]
    };

    // ---------- DOM ----------
    let root, chooser, spot, spot2, card, chip, panel;
    let route = null, ri = 0, raf = 0, advancing = false, flying = false;
    const opened = { guide: false, designer: false, mapping: false };   // modals the tutorial itself opened
    const T = () => TXT[isZh() ? 'zh' : 'en'];
    const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const X_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>';
    function el(tag, attrs, html) { const e = document.createElement(tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }

    function build() {
        if (root) return;
        root = el('div', { id: 'qps-root' });
        chooser = el('div', { id: 'qps-chooser', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'qps-ch-title' });
        spot = el('div', { id: 'qps-spot' }); spot2 = el('div', { id: 'qps-spot2' }); card = el('div', { id: 'qps-card', role: 'dialog', 'aria-live': 'polite' });
        chip = el('button', { id: 'qps-chip', type: 'button', 'aria-expanded': 'false' });
        panel = el('div', { id: 'qps-panel' });
        root.append(chooser, spot, spot2, card, panel, chip);
        document.body.appendChild(root);
        chooser.style.display = spot.style.display = spot2.style.display = card.style.display = panel.style.display = chip.style.display = 'none';
        chip.onclick = () => togglePanel();
        window.addEventListener('resize', () => route && place());
        window.addEventListener('scroll', () => route && place(), true);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (route) closeRoute(); else if (chooser.style.display !== 'none') closeChooser(true, true); else if (panel.style.display !== 'none') togglePanel(false); } });
        // act-to-advance listeners (capture so we see the click even if the page stops propagation)
        document.addEventListener('click', onClick, true);
        document.addEventListener('change', onChange, true);
    }

    // ---------- fly the dialogue to the tutorial icon (same motion as the 14-step tour) ----------
    function pulseTourBtn(btn) {
        try { if (typeof btn.animate === 'function') btn.animate([
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)' },
            { transform: 'scale(1.22)', boxShadow: '0 0 0 10px rgba(234, 179, 8, 0.45)', backgroundColor: 'rgba(234, 179, 8, 0.25)', borderColor: 'var(--accent-yellow)' },
            { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)' }
        ], { duration: 600, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }); } catch (e) {}
    }
    function flyTo(elm, fade, done) {
        const btn = $('tour-btn');
        if (flying) return; 
        if (!elm || !btn || !visible(elm) || !visible(btn) || reduce()) { done(); return; }
        flying = true;
        const a = elm.getBoundingClientRect(), b = btn.getBoundingClientRect();
        const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
        if (fade) { fade.style.transition = 'opacity 0.35s ease'; fade.style.opacity = '0'; }
        elm.style.transformOrigin = 'center center';
        elm.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        elm.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0.08)';
        elm.style.opacity = '0'; elm.style.pointerEvents = 'none';
        setTimeout(() => pulseTourBtn(btn), 480);
        setTimeout(() => {
            elm.style.transition = elm.style.transform = elm.style.opacity = elm.style.pointerEvents = '';
            if (fade) { fade.style.transition = ''; fade.style.opacity = ''; }
            flying = false; done();
        }, 660);
    }

    // ---------- chooser ----------
    function openStartHere() {
        build(); endRoute(true); togglePanel(false);
        try { if (window.endTour) { const tr = $('tour-root'); if (tr && tr.style.display !== 'none') window.endTour(); } } catch (e) {}
        const x = T();
        const o = (key, rec) => { const n = { sample: 'A', quest: 'B', own: 'C' }[key]; return '<button type="button" class="qps-opt" data-route="' + key + '"><span class="qps-opt-t">' + x['opt' + n][0] + (rec ? '<span class="qps-rec">' + x.rec + '</span>' : '') + '</span><span class="qps-opt-b">' + x['opt' + n][1] + '</span></button>'; };
        chooser.innerHTML = '<div class="qps-ch-card"><button type="button" class="qps-x qps-ch-x" data-act="close" aria-label="' + x.close + '">' + X_SVG + '</button><h2 id="qps-ch-title">' + x.chTitle + '</h2>' + o('sample', true) + o('quest') + o('own') + '</div>';
        chooser.style.display = 'flex';
        chooser.onclick = e => {
            const opt = e.target.closest('.qps-opt'); const a = e.target.closest('[data-act]');
            if (opt) { closeChooser(false); startRoute(opt.getAttribute('data-route')); }
            else if (a && a.getAttribute('data-act') === 'close') closeChooser(true, true);
            else if (e.target === chooser) closeChooser(true, true);
        };
        S.seen = true; save();
        const first = chooser.querySelector('.qps-opt'); if (first) first.focus();
        refreshChip();
    }
    function closeChooser(showChip, animate) {
        if (!chooser || chooser.style.display === 'none') { refreshChip(); return; }
        const fin = () => { chooser.style.display = 'none'; if (showChip) { S.dismissed = false; save(); } refreshChip(); };
        if (animate) flyTo(chooser.querySelector('.qps-ch-card'), chooser, fin); else fin();
    }

    // ---------- route runner ----------
    function startRoute(name, fromId) {
        build(); route = ROUTES[name]; if (!route) return;
        route.__name = name; ri = 0;
        if (fromId) { const i = route.findIndex(s => s.id === fromId); if (i >= 0) ri = i; }
        togglePanel(false); closeChooser(false);
        S.seen = true; save();
        showStep();
    }
    function resolve(s) { try { return typeof s.sel === 'function' ? s.sel() : (s.sel ? document.querySelector(s.sel) : null); } catch (e) { return null; } }
    function shown(e) { if (!e) return false; const r = e.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return false; return e.virt ? true : getComputedStyle(e).visibility !== 'hidden'; }
    const isOpen = id => { const m = $(id); return !!m && getComputedStyle(m).display !== 'none'; };
    function syncModals(s) {   // show or hide the guide / designer / mapping screens to match the step
        try {
            if (s.guide) { if (!isOpen('csv-guide-modal') && window.openCsvGuide) { openCsvGuide(); opened.guide = true; } }
            else if (isOpen('csv-guide-modal') && window.closeCsvGuide) { closeCsvGuide(); opened.guide = false; }
            if (s.designer) { if (!isOpen('schema-builder-modal') && window.openSchemaBuilderModal) { openSchemaBuilderModal(); opened.designer = true; } }
            else if (isOpen('schema-builder-modal') && window.closeSchemaBuilderModal) { closeSchemaBuilderModal(); opened.designer = false; }
            if (s.mapping) { if (!isOpen('csv-mapping-modal') && window.openCsvMappingModalDirect) { openCsvMappingModalDirect(); opened.mapping = true; } }
            else if (isOpen('csv-mapping-modal') && window.closeCsvMappingModal) { closeCsvMappingModal(); opened.mapping = false; }
        } catch (e) {}
    }
    function showStep() {
        if (!route) return;
        const s = route[ri]; advancing = false; s.__seen = false;
        if (s.last && route.__name) mark(route.__name);   // reaching the final step = the route is finished
        try { if (window.setRailDrawer) window.setRailDrawer(!!s.drawer, true); } catch (e) {}
        if (s.section && typeof switchMainSection === 'function' && secNow() !== s.section) { try { switchMainSection(s.section); } catch (e) {} window.scrollTo(0, 0); }
        setTimeout(() => {
            if (!route) return;
            syncModals(s);
            try { if (s.menu) { if (window.openDataMenu) openDataMenu(); } else if (window.closeDataMenu) closeDataMenu(); } catch (e) {}
            setTimeout(() => {
                if (!route || route[ri] !== s) return;
                const target = resolve(s);
                if (shown(target)) { const r = target.getBoundingClientRect(); if (r.top < 70 || r.bottom > window.innerHeight - 20) { try { target.scrollIntoView({ block: r.height > window.innerHeight * 0.55 ? 'start' : 'center', behavior: 'auto' }); } catch (e) {} } }
                renderCard(s); place(); tick();
            }, s.delay || 0);
        }, s.section ? 450 : 80);
    }
    function stepNo(i) { let n = 0; for (let k = 0; k <= i; k++) if (!route[k].sub) n++; return n; }
    function stepTotal() { return route.filter(q => !q.sub).length; }
    function renderCard(s) {
        const x = T(), L = (isZh() ? s.zh : s.en);
        let btns = '<button type="button" class="qps-btn qps-btn-ghost" data-b="back">' + x.back + '</button>';
        if (s.buttons) btns += s.buttons.map(b => '<button type="button" class="qps-btn' + (b === 'finish' ? ' qps-btn-ghost' : ' qps-btn-main') + '" data-b="' + b + '">' + x[b] + '</button>').join('');
        else if (!s.last) btns += '<button type="button" class="qps-btn qps-btn-main" data-b="next">' + x.next + '</button>';
        card.innerHTML = '<div class="qps-head"><span class="qps-count">' + x.step + ' ' + stepNo(ri) + ' ' + x.of + ' ' + stepTotal() + '</span><button type="button" class="qps-x" data-b="exit" aria-label="' + x.close + '">' + X_SVG + '</button></div>' +
            '<h3 class="qps-t">' + fill(L[0]) + '</h3><p class="qps-b">' + fill(L[1]) + '</p><div class="qps-btns">' + btns + '</div>';
        card.style.display = 'block';
        card.onclick = e => {
            const b = e.target.closest('[data-b]'); if (!b) return; const k = b.getAttribute('data-b');
            if (k === 'exit' || k === 'finish') closeRoute();
            else if (k === 'back') goBack();
            else if (k === 'next') advance();
            else if (k === 'ownData') { endRoute(true); startRoute('own'); }
            else if (k === 'toQuest') { endRoute(true); startRoute('quest'); }
            else if (k === 'toSample') { endRoute(true); startRoute('sample'); }
        };
    }
    function place() {
        if (!route || !card || card.style.display === 'none' || flying) return;
        const s = route[ri], target = resolve(s), vw = window.innerWidth, vh = window.innerHeight;
        const mobile = vw <= 768;
        card.style.boxSizing = 'border-box';
        card.style.width = Math.min(420, vw - 24) + 'px';
        if (!shown(target) || s.center) {
            spot.style.display = 'none'; spot2.style.display = 'none';
            const cH = card.offsetHeight;
            if (mobile) { card.style.left = '12px'; card.style.right = '12px'; card.style.width = 'auto'; card.style.top = 'auto'; card.style.bottom = '16px'; }
            else { card.style.right = 'auto'; card.style.left = Math.max(12, (vw - card.offsetWidth) / 2) + 'px'; card.style.top = Math.max(12, (vh - cH) / 2) + 'px'; card.style.bottom = 'auto'; }
            return;
        }
        const t2 = s.also ? (typeof s.also === 'function' ? s.also() : q1(s.also)) : null;
        if (shown(t2)) { const r2 = t2.getBoundingClientRect(); Object.assign(spot2.style, { display: 'block', left: (r2.left - 4) + 'px', top: (r2.top - 4) + 'px', width: (r2.width + 8) + 'px', height: (r2.height + 8) + 'px' }); } else spot2.style.display = 'none';
        const r = target.getBoundingClientRect(), pad = (s.pad != null ? s.pad : 6);
        const L = Math.max(3, r.left - pad), Tp = Math.max(3, r.top - pad), R = Math.min(vw - 3, r.right + pad), B = Math.min(vh - 3, r.bottom + pad);
        Object.assign(spot.style, { display: 'block', left: L + 'px', top: Tp + 'px', width: (R - L) + 'px', height: (B - Tp) + 'px' });
        const cH = card.offsetHeight, cW = card.offsetWidth;
        if (mobile) {   // phone: the card sits at the bottom, or at the top when the highlight is in the lower half, so it never covers it
            card.style.left = '12px'; card.style.right = '12px'; card.style.width = 'auto';
            if (B > vh - cH - 24 && Tp > cH + 24) { card.style.top = '12px'; card.style.bottom = 'auto'; } else { card.style.top = 'auto'; card.style.bottom = '16px'; }
            return;
        }
        card.style.right = 'auto';
        const big = (B - Tp) > vh * 0.5;
        let top, left = Math.min(Math.max(12, L), vw - cW - 12);
        if (big) { top = vh - cH - 14; left = Math.max(12, (vw - cW) / 2); }
        else if (B + 14 + cH <= vh - 8) top = B + 14;
        else if (Tp - 14 - cH >= 8) top = Tp - 14 - cH;
        else if (R + 14 + cW <= vw - 8) { top = Math.max(12, Math.min(Tp, vh - cH - 12)); left = R + 14; }
        else if (L - 14 - cW >= 8) { top = Math.max(12, Math.min(Tp, vh - cH - 12)); left = L - 14 - cW; }
        else { top = Math.max(12, vh - cH - 14); left = Math.max(12, vw - cW - 14); }
        card.style.top = top + 'px'; card.style.left = left + 'px'; card.style.bottom = 'auto';
    }
    function tick() {   // keep the spotlight on the target while layout settles, and watch for section-type goals
        cancelAnimationFrame(raf);
        const loop = () => {
            if (!route) return;
            const s = route[ri];
            if (s.wait && s.wait.section && secNow() === s.wait.section) return advance();
            if (s.closeAdvances) { if (isOpen('schema-builder-modal')) s.__seen = true; else if (s.__seen && !advancing) { s.__seen = false; return advance(); } }
            place(); raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
    }
    function advance() {
        if (!route || advancing) return; advancing = true;
        if (ri >= route.length - 1) return closeRoute();
        ri++; setTimeout(showStep, 380);
    }
    function goBack() {
        if (!route || advancing) return;
        if (ri === 0) { endRoute(true); openStartHere(); return; }
        advancing = true; ri--; setTimeout(showStep, 200);
    }
    function closeModalsWeOpened() {
        try {
            if (opened.guide && isOpen('csv-guide-modal') && window.closeCsvGuide) closeCsvGuide();
            if (opened.designer && isOpen('schema-builder-modal') && window.closeSchemaBuilderModal) closeSchemaBuilderModal();
            if (opened.mapping && isOpen('csv-mapping-modal') && window.closeCsvMappingModal) closeCsvMappingModal();
        } catch (e) {}
        opened.guide = opened.designer = opened.mapping = false;
    }
    function endRoute(silent) {
        cancelAnimationFrame(raf);
        const had = !!route; route = null;
        if (spot) spot.style.display = 'none'; if (spot2) spot2.style.display = 'none'; if (card) card.style.display = 'none';
        if (had) closeModalsWeOpened();
        try { if (had && window.closeDataMenu) closeDataMenu(); if (had && window.setRailDrawer) window.setRailDrawer(false, true); } catch (e) {}
        refreshChip();
    }
    function closeRoute() {   // X / Esc / Finish: the dialogue flies to the tutorial icon, then the route ends
        if (!route || flying) return;
        cancelAnimationFrame(raf);
        if (spot2) spot2.style.display = 'none';
        flyTo(card, spot, () => endRoute());
    }
    function onClick(e) {
        const t0 = e.target;
        if (!route) return;
        const s = route[ri]; if (!s.wait || !s.wait.click) return;
        if (t0.closest && t0.closest(s.wait.click)) setTimeout(advance, 120);
    }
    function onChange(e) {
        const t0 = e.target;
        if (!route) return;
        const s = route[ri]; if (s.wait && s.wait.change && t0 && t0.matches && t0.matches(s.wait.change)) setTimeout(advance, 120);
    }

    // ---------- checklist ----------
    const ITEMS = [
        { k: 'sample', route: 'sample' }, { k: 'quest', route: 'quest' }, { k: 'own', route: 'own' }
    ];
    function mark(k) { if (S.done[k]) return; S.done[k] = true; save(); renderPanel(); refreshChip(); }
    function doneCount() { return ITEMS.filter(i => S.done[i.k]).length; }
    function renderPanel() {
        if (!panel) return; const x = T();
        panel.innerHTML = '<div class="qps-ph"><strong>' + x.chip + '</strong><span>' + doneCount() + '/' + ITEMS.length + '</span></div><ul class="qps-list">' +
            ITEMS.map(i => '<li class="' + (S.done[i.k] ? 'is-done' : '') + '"><span class="qps-tick" aria-hidden="true">' + (S.done[i.k] ? '&#10003;' : '') + '</span><span class="qps-li-t">' + x.items[i.k] + '</span>' +
                (S.done[i.k] ? '' : '<button type="button" class="qps-link" data-k="' + i.k + '">' + x.show + '</button>') + '</li>').join('') +
            '</ul>';
        panel.onclick = e => {
            const b = e.target.closest('[data-k]');
            if (b) { const it = ITEMS.find(i => i.k === b.getAttribute('data-k')); togglePanel(false); startRoute(it.route); }
        };
    }
    function togglePanel(force) {
        if (!panel) return; const open = (force === undefined) ? panel.style.display === 'none' : force;
        if (open) renderPanel(); panel.style.display = open ? 'block' : 'none'; if (chip) chip.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function blocked() {
        const g = $('lang-gate'), v = $('commercial-video-modal'), tr = $('tour-root');
        return !!((g && g.classList.contains('show')) || (v && v.classList.contains('active')) || (tr && tr.style.display !== 'none' && tr.style.display !== '') || (chooser && chooser.style.display !== 'none') || route);
    }
    function refreshChip() {
        if (!chip) return; const x = T();
        const hide = S.dismissed || !S.seen || blocked() || doneCount() === ITEMS.length;
        if (hide) { chip.style.display = 'none'; if (panel && (blocked() || doneCount() === ITEMS.length)) panel.style.display = 'none'; return; }
        const n = doneCount();
        chip.innerHTML = '<span class="qps-dot" aria-hidden="true"></span><span>' + x.chip + ' &middot; ' + n + '/' + ITEMS.length + '</span>';
        chip.style.display = 'inline-flex';
    }

    // ---------- watch navigation for checklist ----------
    function watchJourney() {
        const v = $('view-journeys'); if (!v) return;
        new MutationObserver(() => { if (v.classList.contains('active')) mark('journey'); }).observe(v, { attributes: true, attributeFilter: ['class'] });
    }

    // ---------- public API and hooks ----------
    // After the landing video: first-time viewers get the chooser; returning viewers just see the checklist chip
    window.openStartHereAuto = function () { build(); if (!S.seen) openStartHere(); else refreshChip(); };
    window.openStartHere = openStartHere;
    window.startRoute = startRoute;
    function init() {
        build(); renderPanel();
        setInterval(refreshChip, 700);
        const full = window.startTour;
        if (typeof full === 'function') window.startTour = function () { endRoute(true); closeChooser(false); togglePanel(false); return full.apply(this, arguments); };
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
