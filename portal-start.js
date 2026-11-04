/* quan-persona - "Start here" onboarding: chooser, three short guided routes (act-to-advance) and a Getting-started checklist.
   Works alongside the existing 14-step guided tour (portal-tour.js), which is kept as the "full tour". */
(function () {
    'use strict';
    const KEY = 'qp-start-v1';
    const $ = id => document.getElementById(id);
    const isZh = () => (typeof currentLang !== 'undefined' && currentLang === 'zh') || (typeof detectInitialLanguage === 'function' && detectInitialLanguage() === 'zh');
    const lab = k => { try { return (typeof t === 'function') ? t(k) : k; } catch (e) { return k; } };
    const fill = s => s.replace(/\{(\w+)\}/g, (m, k) => lab(k));
    const secNow = () => (typeof activeSection !== 'undefined') ? activeSection : null;

    // ---------- persisted state (per-viewer convenience only; every access is guarded) ----------
    let S = { done: {}, dismissed: false, seen: false };
    try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
    function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

    // ---------- copy (EN / zh-TW). {key} placeholders are replaced with the portal's own button labels ----------
    const TXT = {
        en: {
            chTitle: 'Where would you like to start?',
            chSub: 'Sample data is already loaded, so you can see real results in about two minutes.',
            rec: 'Recommended for a first visit',
            optA: ['Explore the sample data', 'See personas, journey maps and clustering using the data that is already loaded.'],
            optB: ['Analyse my own survey data', 'Get the CSV template, upload your file and check how your columns match.'],
            optC: ['Design a questionnaire first', 'Choose your questions and download a questionnaire to send to respondents.'],
            full: 'Take the full 14-step tour', skip: 'Skip for now',
            reopen: 'You can reopen this any time from the graduation-cap icon at the top right.',
            step: 'Step', of: 'of', skipStep: 'Skip this step', exit: 'Exit', next: 'Next', finish: 'Finish', done: 'Done',
            ownData: 'Analyse my own data',
            chip: 'Getting started', allDone: 'All done', hide: 'Hide', show: 'Show me', startWalk: 'Where do I start?',
            items: { persona: 'Open a persona', journey: 'Open the Journey Map', k: 'Change the number of clusters', upload: 'Upload your own data' }
        },
        zh: {
            chTitle: '想從哪裡開始？',
            chSub: '平台已預載範例資料，約兩分鐘就能看到實際的分析結果。',
            rec: '第一次使用建議從這裡開始',
            optA: ['先看範例資料', '用已載入的資料，依序查看人物誌、歷程地圖與分群結果。'],
            optB: ['分析我自己的問卷資料', '取得 CSV 範本、上傳檔案，並確認欄位對應的結果。'],
            optC: ['先設計問卷', '選擇要詢問的題目，並下載問卷發送給受訪者。'],
            full: '查看完整 14 步導覽', skip: '稍後再說',
            reopen: '之後可隨時點選右上角的學士帽圖示，重新開啟這個畫面。',
            step: '步驟', of: '／', skipStep: '略過此步驟', exit: '離開', next: '下一步', finish: '完成', done: '完成',
            ownData: '分析我的資料',
            chip: '新手上路', allDone: '全部完成', hide: '隱藏', show: '帶我去', startWalk: '要從哪裡開始？',
            items: { persona: '開啟一個人物誌', journey: '開啟歷程地圖', k: '調整分群數量', upload: '上傳你自己的資料' }
        }
    };

    // ---------- routes ----------
    // sel: selector or function returning the element to spotlight. wait: what the viewer must do to advance.
    const ROUTES = {
        sample: [
            { id: 'persona', section: 'personas', sel: '#capsule-tabs-container', wait: { click: '.capsule-tab' },
              en: ['Start here: open a persona', 'Each tab is a group of respondents with similar behaviour, found in the sample data that is already loaded. Click any Cluster tab to switch groups.'],
              zh: ['從這裡開始：點選一個人物誌', '每個分頁代表一群行為相近的受訪者，由已載入的範例資料分群而來。請點選任一個分群分頁，切換查看不同群體。'] },
            { id: 'read', section: 'personas', dock: true, next: true,
              en: ['Read the persona', 'Left: who this group is. Middle: what they do at each stage, with their tools and pain points. Right: their motto and quotes. You can edit the name and description to suit your team.'],
              zh: ['看懂這張人物誌', '左側是這群人的輪廓；中間是他們在各階段的行動、使用工具與痛點；右側是座右銘與心聲。名稱與描述都可以直接修改。'] },
            { id: 'journey', drawer: true, sel: '#btn-sec-journeys', wait: { section: 'journeys' },
              en: ['Next: open {navJourneys}', 'Click {navJourneys} in the left menu (the folded-map icon). It shows what each group does at every stage of the journey.'],
              zh: ['接著：開啟「{navJourneys}」', '點選左側選單的「{navJourneys}」（折疊地圖圖示），查看各群在旅程每個階段做了什麼。'] },
            { id: 'weak', section: 'journeys', sel: '#journey-svg', next: true,
              en: ['Find the weakest stage', 'The curve shows how satisfied this group is at each stage. The lowest dip is where to improve first, and the cards below it suggest actions.'],
              zh: ['找出最需要改善的階段', '曲線代表這群人在各階段的滿意度；最低的谷底就是優先改善的地方，下方的卡片會提出改善建議。'] },
            { id: 'analytics', drawer: true, sel: '#btn-sec-analytics', wait: { section: 'analytics' },
              en: ['Then: open {navAnalytics}', 'Click {navAnalytics} in the left menu (the bar-chart icon) to see how the groups were formed.'],
              zh: ['再來：開啟「{navAnalytics}」', '點選左側選單的「{navAnalytics}」（長條圖圖示），查看這些分群是怎麼形成的。'] },
            { id: 'k', section: 'analytics', sel: () => { const sl = document.getElementById('cluster-k-slider'); let e = sl && sl.parentElement; while (e && !e.querySelector('.btn-primary')) e = e.parentElement; return e; }, wait: { click: '#ai-cluster-discovery .btn-primary' },
              en: ['Try a different number of groups', 'Drag the slider (3 to 8), then press {runClustering}. The groups, charts and tables are recalculated.'],
              zh: ['試試不同的分群數量', '拖曳滑桿（3 到 8 組），再按「{runClustering}」；分群、圖表與表格都會重新計算。'] },
            { id: 'end', center: true, buttons: ['ownData', 'finish'],
              en: ['You have seen the full loop', 'Personas, then Journey Map, then Analytics. Next, try it with your own survey data.'],
              zh: ['完整流程你已經走過一遍', '人物誌、歷程地圖、數據分析。接下來，試試用你自己的問卷資料。'] }
        ],
        own: [
            { id: 'guide', menu: true, sel: '#csv-guide-btn', wait: { click: '#csv-guide-btn' },
              en: ['Step 1: get the CSV template', 'The Data menu (database icon, top right) is open. Click {csvGuide}: it lists the columns you need and has a template to download.'],
              zh: ['第一步：取得 CSV 範本', '右上角的「{dataMenu}」選單（資料庫圖示）已為你展開。請點選「{csvGuide}」：裡面有所需欄位清單，也能下載範本。'] },
            { id: 'template', sel: '#csv-guide-btn-template', next: true, onNext: () => { try { closeCsvGuide(); } catch (e) {} },
              en: ['Download the template', 'Click Download CSV Template and fill it with your survey responses. Then press Next to close the guide.'],
              zh: ['下載範本', '按「下載 CSV 範本」，並把你的問卷回覆填進去；完成後按「下一步」關閉說明。'] },
            { id: 'upload', drawer: false, sel: '#upload-csv-btn', wait: { change: '#file-input' }, clickAlso: '#upload-csv-btn',
              en: ['Step 2: upload your file', 'Click the upload icon (arrow pointing up, top right) and choose your CSV file. It is processed in your browser.'],
              zh: ['第二步：上傳檔案', '點選右上角的上傳圖示（向上箭頭），選擇你的 CSV 檔案；檔案只會在你的瀏覽器中處理。'] },
            { id: 'match', center: true, buttons: ['finish'],
              en: ['Step 3: check the column match', 'After you choose a file, a screen shows how your columns were matched. Check it, then apply. To go back to the sample data, use Data, then {restoreDefaultData}.'],
              zh: ['第三步：確認欄位對應', '選好檔案後，畫面會顯示你的欄位對應結果；確認無誤再套用。想回到範例資料，請到「{dataMenu}」選單，再選「{restoreDefaultData}」。'] }
        ],
        quest: [
            { id: 'designer', sel: '#btn-schema-builder', wait: { click: '#btn-schema-builder' },
              en: ['Step 1: choose your questions', 'Click {customizeSchema} (the gear icon, top right) to open the questionnaire designer. Pick the background questions, rating items and journey stages.'],
              zh: ['第一步：選擇要詢問的題目', '點選右上角的「{customizeSchema}」（齒輪圖示），開啟問卷設計工具，挑選背景題、評分題與旅程階段。'] },
            { id: 'setup', center: true, next: true, onNext: () => { try { closeSchemaBuilderModal(); } catch (e) {} },
              en: ['Set your questions', 'Adjust the questions in the designer. When you are done, press Next and I will close it for you.'],
              zh: ['設定你的題目', '在設計工具中調整題目；完成後按「下一步」，我會幫你關閉設計工具。'] },
            { id: 'download', menu: true, sel: '#questionnaire-template-btn', wait: { click: '#questionnaire-template-btn' },
              en: ['Step 2: download the questionnaire', 'In the Data menu (database icon, top right), click {questionnaireTemplate}. Then send the file to respondents by email or through your survey platform.'],
              zh: ['第二步：下載問卷', '在右上角的「{dataMenu}」選單（資料庫圖示）中，點選「{questionnaireTemplate}」，再透過電子郵件或你的問卷平台發送給受訪者。'] },
            { id: 'back', center: true, buttons: ['ownData', 'finish'],
              en: ['When responses come back', 'Save them as a CSV file, then choose Analyse my own data to continue.'],
              zh: ['回收問卷之後', '把回覆存成 CSV 檔，再選擇「分析我的資料」繼續。'] }
        ]
    };

    // ---------- DOM ----------
    let root, chooser, spot, card, chip, panel;
    let route = null, ri = 0, raf = 0, advancing = false;
    const T = () => TXT[isZh() ? 'zh' : 'en'];
    function el(tag, attrs, html) { const e = document.createElement(tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }

    function build() {
        if (root) return;
        root = el('div', { id: 'qps-root' });
        chooser = el('div', { id: 'qps-chooser', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'qps-ch-title' });
        spot = el('div', { id: 'qps-spot' }); card = el('div', { id: 'qps-card', role: 'dialog', 'aria-live': 'polite' });
        chip = el('button', { id: 'qps-chip', type: 'button', 'aria-expanded': 'false' });
        panel = el('div', { id: 'qps-panel' });
        root.append(chooser, spot, card, panel, chip);
        document.body.appendChild(root);
        chooser.style.display = spot.style.display = card.style.display = panel.style.display = chip.style.display = 'none';
        chip.onclick = () => togglePanel();
        window.addEventListener('resize', () => route && place());
        window.addEventListener('scroll', () => route && place(), true);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (route) endRoute(); else if (chooser.style.display !== 'none') closeChooser(true); else if (panel.style.display !== 'none') togglePanel(false); } });
        // act-to-advance listeners (capture so we see the click even if the page stops propagation)
        document.addEventListener('click', onClick, true);
        document.addEventListener('change', onChange, true);
    }

    // ---------- chooser ----------
    function openStartHere() {
        build(); endRoute(true); togglePanel(false);
        try { if (window.endTour) { const tr = $('tour-root'); if (tr && tr.style.display !== 'none') window.endTour(); } } catch (e) {}
        const x = T();
        const opt = (key, rec) => '<button type="button" class="qps-opt" data-route="' + key + '"><span class="qps-opt-t">' + x['opt' + {sample:'A',own:'B',quest:'C'}[key]][0] + (rec ? '<span class="qps-rec">' + x.rec + '</span>' : '') + '</span><span class="qps-opt-b">' + x['opt' + {sample:'A',own:'B',quest:'C'}[key]][1] + '</span></button>';
        chooser.innerHTML = '<div class="qps-ch-card"><h2 id="qps-ch-title">' + x.chTitle + '</h2><p class="qps-ch-sub">' + x.chSub + '</p>' +
            opt('sample', true) + opt('own') + opt('quest') +
            '<div class="qps-ch-foot"><button type="button" class="qps-link" data-act="full">' + x.full + '</button><button type="button" class="qps-link" data-act="skip">' + x.skip + '</button></div>' +
            '<p class="qps-ch-note">' + x.reopen + '</p></div>';
        chooser.style.display = 'flex';
        chooser.onclick = e => {
            const o = e.target.closest('.qps-opt'); const a = e.target.closest('[data-act]');
            if (o) { closeChooser(false); startRoute(o.getAttribute('data-route')); }
            else if (a && a.getAttribute('data-act') === 'full') { closeChooser(false); S.seen = true; save(); if (typeof startTour === 'function') startTour(); }
            else if (a && a.getAttribute('data-act') === 'skip') closeChooser(true);
            else if (e.target === chooser) closeChooser(true);
        };
        S.seen = true; save();
        const first = chooser.querySelector('.qps-opt'); if (first) first.focus();
        refreshChip();
    }
    function closeChooser(showChip) { if (chooser) chooser.style.display = 'none'; if (showChip) { S.dismissed = false; save(); } refreshChip(); }

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
    function shown(e) { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }
    function showStep() {
        if (!route) return;
        const s = route[ri]; advancing = false;
        try { if (window.setRailDrawer) window.setRailDrawer(!!s.drawer, true); } catch (e) {}
        if (s.section && typeof switchMainSection === 'function' && secNow() !== s.section) { try { switchMainSection(s.section); } catch (e) {} window.scrollTo(0, 0); }
        setTimeout(() => {
            if (!route) return;
        try { if (s.menu) { if (window.openDataMenu) openDataMenu(); else if (window.toggleDataMenu) { const m = $('data-menu'); if (m && !m.classList.contains('open')) toggleDataMenu({ stopPropagation() {}, preventDefault() {} }); } } else if (window.closeDataMenu) closeDataMenu(); } catch (e) {}
            const target = resolve(s);
            if (shown(target)) { const r = target.getBoundingClientRect(); if (r.top < 70 || r.bottom > window.innerHeight - 20) { try { target.scrollIntoView({ block: r.height > window.innerHeight * 0.55 ? 'start' : 'center', behavior: 'auto' }); } catch (e) {} } }
            renderCard(s); place(); tick();
        }, s.section ? 450 : 80);
    }
    function renderCard(s) {
        const x = T(), L = (isZh() ? s.zh : s.en);
        const total = route.filter(q => !q.center || q.next).length;
        const stepNo = Math.min(ri + 1, route.length);
        let btns = '';
        if (s.buttons) {
            btns = s.buttons.map(b => '<button type="button" class="qps-btn' + (b === 'finish' ? ' qps-btn-ghost' : ' qps-btn-main') + '" data-b="' + b + '">' + (b === 'ownData' ? x.ownData : x.finish) + '</button>').join('');
        } else {
            btns = '<button type="button" class="qps-btn qps-btn-ghost" data-b="skipstep">' + x.skipStep + '</button>' + (s.next ? '<button type="button" class="qps-btn qps-btn-main" data-b="next">' + x.next + '</button>' : '');
        }
        const hint = s.wait ? '<p class="qps-act">' + (isZh() ? '請直接操作上方標示的位置，完成後會自動進入下一步。' : 'Try it on the highlighted item. The next step opens automatically.') + '</p>' : '';
        card.innerHTML = '<div class="qps-head"><span class="qps-count">' + (route.length > 1 ? x.step + ' ' + stepNo + ' ' + x.of + ' ' + route.length : '') + '</span><button type="button" class="qps-x" data-b="exit" aria-label="' + x.exit + '">' + x.exit + '</button></div>' +
            '<h3 class="qps-t">' + fill(L[0]) + '</h3><p class="qps-b">' + fill(L[1]) + '</p>' + hint + '<div class="qps-btns">' + btns + '</div>';
        card.style.display = 'block';
        card.onclick = e => {
            const b = e.target.closest('[data-b]'); if (!b) return; const k = b.getAttribute('data-b');
            if (k === 'exit') endRoute();
            else if (k === 'skipstep' || k === 'next') { const st = route[ri]; if (st.onNext) st.onNext(); advance(); }
            else if (k === 'finish') endRoute();
            else if (k === 'ownData') { endRoute(true); startRoute('own'); }
        };
    }
    function place() {
        if (!route || !card || card.style.display === 'none') return;
        const s = route[ri], target = resolve(s), vw = window.innerWidth, vh = window.innerHeight;
        const mobile = vw <= 768;
        card.style.boxSizing = 'border-box';
        card.style.width = Math.min(420, vw - 24) + 'px';
        if (s.dock) {
            spot.style.display = 'none';
            if (mobile) { card.style.left = '12px'; card.style.right = '12px'; card.style.width = 'auto'; }
            else { card.style.right = 'auto'; card.style.left = Math.max(12, (vw - card.offsetWidth) / 2) + 'px'; }
            card.style.top = 'auto'; card.style.bottom = '16px'; return;
        }
        if (!shown(target) || s.center) {
            spot.style.display = 'none';
            const cH = card.offsetHeight;
            if (mobile) { card.style.left = '12px'; card.style.right = '12px'; card.style.width = 'auto'; card.style.top = 'auto'; card.style.bottom = '16px'; }
            else { card.style.right = 'auto'; card.style.left = Math.max(12, (vw - card.offsetWidth) / 2) + 'px'; card.style.top = Math.max(12, (vh - cH) / 2) + 'px'; card.style.bottom = 'auto'; }
            return;
        }
        const r = target.getBoundingClientRect(), pad = 6;
        const L = Math.max(3, r.left - pad), Tp = Math.max(3, r.top - pad), R = Math.min(vw - 3, r.right + pad), B = Math.min(vh - 3, r.bottom + pad);
        Object.assign(spot.style, { display: 'block', left: L + 'px', top: Tp + 'px', width: (R - L) + 'px', height: (B - Tp) + 'px' });
        const cH = card.offsetHeight, cW = card.offsetWidth;
        if (mobile) { card.style.left = '12px'; card.style.right = '12px'; card.style.width = 'auto'; card.style.top = 'auto'; card.style.bottom = '16px'; return; }
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
            place(); raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
    }
    function advance() {
        if (!route || advancing) return; advancing = true;
        if (ri >= route.length - 1) return endRoute();
        ri++; setTimeout(showStep, 380);
    }
    function endRoute(silent) {
        cancelAnimationFrame(raf);
        const had = !!route; route = null;
        if (spot) spot.style.display = 'none'; if (card) card.style.display = 'none';
        try { if (had && window.closeDataMenu) closeDataMenu(); if (had && window.setRailDrawer) window.setRailDrawer(false, true); } catch (e) {}
        refreshChip();
    }
    function onClick(e) {
        const t0 = e.target;
        // checklist detection (works with or without a route running)
        try {
            if (t0.closest && t0.closest('.capsule-tab')) mark('persona');
            if (t0.closest && t0.closest('#ai-cluster-discovery .btn-primary')) mark('k');
        } catch (er) {}
        if (!route) return;
        const s = route[ri]; if (!s.wait || !s.wait.click) return;
        if (t0.closest && t0.closest(s.wait.click)) setTimeout(advance, 120);
    }
    function onChange(e) {
        const t0 = e.target;
        if (t0 && t0.id === 'file-input') mark('upload');
        if (!route) return;
        const s = route[ri]; if (s.wait && s.wait.change && t0 && t0.matches && t0.matches(s.wait.change)) setTimeout(advance, 120);
    }

    // ---------- checklist ----------
    const ITEMS = [
        { k: 'persona', route: 'sample', from: 'persona' }, { k: 'journey', route: 'sample', from: 'journey' },
        { k: 'k', route: 'sample', from: 'k' }, { k: 'upload', route: 'own', from: 'guide' }
    ];
    function mark(k) { if (S.done[k]) return; S.done[k] = true; save(); renderPanel(); refreshChip(); }
    function doneCount() { return ITEMS.filter(i => S.done[i.k]).length; }
    function renderPanel() {
        if (!panel) return; const x = T();
        panel.innerHTML = '<div class="qps-ph"><strong>' + x.chip + '</strong><span>' + doneCount() + '/' + ITEMS.length + '</span></div><ul class="qps-list">' +
            ITEMS.map(i => '<li class="' + (S.done[i.k] ? 'is-done' : '') + '"><span class="qps-tick" aria-hidden="true">' + (S.done[i.k] ? '&#10003;' : '') + '</span><span class="qps-li-t">' + x.items[i.k] + '</span>' +
                (S.done[i.k] ? '' : '<button type="button" class="qps-link" data-k="' + i.k + '">' + x.show + '</button>') + '</li>').join('') +
            '</ul><div class="qps-pf"><button type="button" class="qps-link" data-p="start">' + x.startWalk + '</button><button type="button" class="qps-link" data-p="hide">' + x.hide + '</button></div>';
        panel.onclick = e => {
            const b = e.target.closest('[data-k]'), p = e.target.closest('[data-p]');
            if (b) { const it = ITEMS.find(i => i.k === b.getAttribute('data-k')); togglePanel(false); startRoute(it.route, it.from); }
            else if (p && p.getAttribute('data-p') === 'start') openStartHere();
            else if (p && p.getAttribute('data-p') === 'hide') { S.dismissed = true; save(); togglePanel(false); refreshChip(); }
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
        const hide = S.dismissed || !S.seen || blocked();
        if (hide) { chip.style.display = 'none'; if (panel && (blocked())) panel.style.display = 'none'; return; }
        const n = doneCount();
        chip.innerHTML = '<span class="qps-dot" aria-hidden="true"></span><span>' + (n === ITEMS.length ? x.allDone : x.chip + ' &middot; ' + n + '/' + ITEMS.length) + '</span>';
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
        build(); watchJourney(); renderPanel();
        setInterval(refreshChip, 700);
        const full = window.startTour;
        if (typeof full === 'function') window.startTour = function () { endRoute(true); closeChooser(false); togglePanel(false); return full.apply(this, arguments); };
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
