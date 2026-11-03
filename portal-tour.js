/* quan-persona - Guided Tour Module (Externalised) */
        // ===== GUIDED TOUR: step-by-step walkthrough of the portal (EN / ZH) =====
        (function () {
            const STEPS = [
                { en: { t: 'Welcome to quan-persona!', b: 'In a few quick steps, you will see how survey responses turn into actionable personas and customer journey maps—all privately on your device.' },
                  zh: { t: '歡迎使用 quan-persona！', b: '只需幾個簡單步驟，帶您探索問卷填答如何轉化為具體的人物誌與顧客旅程地圖——所有資料均在您的電腦本機安全處理，隱私無虞。' } },
                { en: { t: 'How do you and the platform work together?', b: 'The portal counts, calculates, and groups the data. You bring the human judgment: deciding what questions matter, how many segments to explore, and what each persona represents.' },
                  zh: { t: '您與平台如何攜手合作？', b: '統計、指標計算與演算法分群交由平台自動處理；您則專注於核心判斷——決定關鍵題目、探索最合適的分群數，並為每個人物誌賦予深刻洞察。' } },
                { sel: '#btn-schema-builder', en: { t: 'What questions do you want to ask?', b: 'Tailor your questionnaire here to match your research goals. You can customise background demographics, rating dimensions, and customer journey stages at any time.' },
                  zh: { t: '您想向受訪者詢問哪些重點？', b: '在此依專案需求自訂題目、評分指標與服務歷程階段，打造最契合您研究目標的量測架構。' } },
                { menu: true, sel: () => document.querySelector('[data-i18n="questionnaireTemplate"]')?.closest('button'), en: { t: 'Ready to collect field responses?', b: 'Once your schema is set, download your ready-to-use questionnaire module here to share directly with respondents or interviewees.' },
                  zh: { t: '準備好收集受訪者回饋了嗎？', b: '架構配置完成後，在此直接下載對應的問卷模組文件，即可發放給受訪者填寫或於第一線訪談使用。' } },
                { menu: true, sel: '#csv-guide-btn', en: { t: 'Unsure how to format your survey results?', b: 'Open this guide to see the exact columns needed for analysis. You can also download a pre-formatted CSV template to organise your data.' },
                  zh: { t: '不確定問卷結果該如何整理成資料檔？', b: '開啟此指南即可查看分析所需的完整欄位規範，也能下載現成對照範本，輕鬆整理回收的資料。' } },
                { sel: '#upload-csv-btn', en: { t: 'Have your survey responses ready?', b: 'Upload your CSV file here. The portal automatically maps columns, detects patterns, and analyses your findings in seconds — verify and confirm.' },
                  zh: { t: '回收的問卷資料已經準備好了嗎？', b: '將整理好的 CSV 檔案上傳到這裡，平台會自動比對欄位並在數秒內完成分析，核對無誤後即可立即套用。' } },
                { sel: '#main-nav', en: { t: 'Where should you explore first?', b: 'Switch anytime across three core lenses:<br>• <strong>Personas:</strong> Who your respondents are<br>• <strong>Journey Map:</strong> What they experience step-by-step<br>• <strong>Analytics &amp; DB:</strong> Comprehensive charts and cross-cluster metrics' },
                  zh: { t: '想從哪個視角開始探索？', b: '隨時在此切換三大核心功能：<br>• <strong>人物誌</strong>：深入了解每群用戶的輪廓與特徵<br>• <strong>歷程地圖</strong>：逐一檢視各階段的體驗與行為軌跡<br>• <strong>分析與資料庫</strong>：掌握整體量化指標與多維度比較' } },
                { section: 'personas', sel: '#capsule-tabs-container', en: { t: 'Who represents each distinct group?', b: 'Respondents with similar needs, behaviours, and scores are clustered together. Click across the tabs above to meet each persona group.' },
                  zh: { t: '每個人物誌群體具有哪些特徵？', b: '回答相近、行為與評分模式相仿的受訪者會被自動歸為一群；點選上方分頁標籤，即可切換檢視不同群體。' } },
                { section: 'personas', sel: '#edit-name', en: { t: 'What memorable name suits this persona?', b: 'Give this persona a vivid, memorable name that resonates with your team, then click Save to update all views across the platform.' },
                  zh: { t: '想為這個群體取個什麼生動的名字？', b: '為它輸入一個最能傳達該群體特質、讓團隊印象深刻的名字，按下儲存即可同步更新全平台。' } },
                { section: 'journeys', sel: '#journey-matrix-box', en: { t: 'What happens across each journey stage?', b: 'Follow what people do, the environments they work in, and the tools they rely on at each step. Numbers in brackets indicate how many respondents share each behaviour.' },
                  zh: { t: '用戶在各個歷程階段經歷了什麼？', b: '清楚檢視每個階段受訪者的具體行動、所在場域與使用工具；括號內的數字代表具備該行為的受訪人數。' } },
                { section: 'journeys', sel: '#journey-svg', en: { t: 'How do they feel throughout the experience?', b: 'This satisfaction curve traces their emotional sentiment across stages. The dips spotlight the critical pain points that need attention.' },
                  zh: { t: '他們在整個歷程中的真實感受如何？', b: '這條曲線描繪了各階段的平均滿意感受；走勢明顯下滑的低谷處，正是最值得優先改善的痛點環節。' } },
                { section: 'journeys', sel: '#journey-footer-box', en: { t: 'Where are the biggest opportunities to improve?', b: 'For each friction point, the portal suggests targeted action ideas and key metrics to track progress. You decide which initiatives create the most value.' },
                  zh: { t: '哪些環節最值得投入資源進行優化？', b: '針對每個痛點階段，平台會自動提出具體的改善建議與衡量指標（KPI）；由您評估並決定最合適的優先行動方案。' } },
                { section: 'analytics', sel: '#ai-cluster-discovery', en: { t: 'Would exploring more or fewer segments give deeper insights?', b: 'Adjust the group slider to let the AI regroup your data in real time. Compare distributions instantly with radar charts and comparison tables.' },
                  zh: { t: '想調整分群數量以發掘更細緻的洞察嗎？', b: '自由調整分群滑桿，AI演算法會即時為全體受訪者重新分組；您可以透過雷達圖與指標總表即時驗證分群成效。' } },
                { en: { t: 'Ready to start exploring your research?', b: 'You are all set! Feel free to upload your own survey responses, customise the measurement schema, or explore our Agent Sales Journey pre-loaded data to see the platform in action. Enjoy discovering your user insights!' },
                  zh: { t: '準備好開始探索您的調研成果了嗎？', b: '一切準備就緒！您可以立即上傳自己的問卷資料、客製專屬的衡量架構，或直接探索我們預載的業務員銷售旅程範例資料，體驗完整分析。開始發掘屬於您的用戶洞察吧！' } }
            ];
            let idx = 0, on = false, startSection = null, raf = 0, moving = false;
            const $ = id => document.getElementById(id);
            const zh = () => (typeof currentLang !== 'undefined' && currentLang === 'zh') || (typeof detectInitialLanguage === 'function' && detectInitialLanguage() === 'zh');
            const resolve = s => { try { return typeof s.sel === 'function' ? s.sel() : (s.sel ? document.querySelector(s.sel) : null); } catch (e) { return null; } };
            const shown = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
            function build() {
                if ($('tour-root')) return;
                const d = document.createElement('div'); d.id = 'tour-root'; d.style.display = 'none';
                d.innerHTML = '<div id="tour-shield"></div><div id="tour-spot"></div><div id="tour-card" role="dialog" aria-live="polite"><div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;"><span id="tour-step" style="font-size:var(--fs-small); color:var(--text-muted);"></span></div><h4 id="tour-title" style="margin:0 0 8px; color:#fff; font-size:var(--fs-title) !important;"></h4><div id="tour-body" style="font-size:var(--fs-body); line-height:1.55; color:var(--text-secondary);"></div><div style="display:flex; align-items:center; gap:8px; margin-top:10px;"><button type="button" class="btn btn-secondary" id="tour-skip" style="height:24px; padding:0 8px; font-size:0.75rem !important; border-radius:6px;"></button><span style="flex:1"></span><button type="button" class="btn btn-secondary" id="tour-back" style="height:24px; padding:0 9px; font-size:0.75rem !important; border-radius:6px;"></button><button type="button" class="btn btn-primary" id="tour-next" style="height:24px; padding:0 11px; font-size:0.75rem !important; border-radius:6px;"></button></div></div>';
                document.body.appendChild(d);
                $('tour-skip').onclick = end; $('tour-back').onclick = () => go(idx - 1, -1); $('tour-next').onclick = () => (idx >= STEPS.length - 1 ? end() : go(idx + 1, 1));
                $('tour-shield').onclick = e => e.stopPropagation();
                window.addEventListener('resize', () => on && place());
                window.addEventListener('scroll', () => { if (on) { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); } }, true);
                document.addEventListener('keydown', e => { if (!on) return; if (e.key === 'Escape') end(); else if (e.key === 'ArrowRight') $('tour-next').click(); else if (e.key === 'ArrowLeft' && idx > 0) $('tour-back').click(); });
            }
            function place() {
                if (moving) return;
                const s = STEPS[idx], el = resolve(s), spot = $('tour-spot'), card = $('tour-card'), shield = $('tour-shield');
                const vw = window.innerWidth, vh = window.innerHeight;
                const isMobileScreen = vw <= 768;
                card.style.boxSizing = 'border-box';

                if (isMobileScreen) {
                    card.style.top = 'auto';
                    card.style.bottom = '16px';
                    card.style.left = '12px';
                    card.style.right = '12px';
                    card.style.width = Math.min(520, vw - 24) + 'px';
                    card.style.maxWidth = 'calc(100vw - 24px)';
                    card.style.margin = '0 auto';
                    if (!shown(el)) {
                        spot.style.display = 'none';
                        shield.style.background = 'rgba(0,0,0,0.72)';
                    } else {
                        shield.style.background = 'transparent';
                        const r = el.getBoundingClientRect(), pad = 8;
                        const L = Math.max(4, r.left - pad), T = Math.max(4, r.top - pad), R = Math.min(vw - 4, r.right + pad), B = Math.min(vh - 4, r.bottom + pad);
                        Object.assign(spot.style, { display: 'block', left: L + 'px', top: T + 'px', width: (R - L) + 'px', height: (B - T) + 'px' });
                    }
                    return;
                }

                card.style.margin = '';
                card.style.maxWidth = Math.min(380, vw - 24) + 'px';
                card.style.width = Math.min(380, vw - 24) + 'px';
                const cH = card.offsetHeight;
                if (!shown(el)) {
                    spot.style.display = 'none'; shield.style.background = 'rgba(0,0,0,0.72)';
                    card.style.left = Math.max(12, Math.round((vw - card.offsetWidth) / 2)) + 'px';
                    card.style.top = Math.max(12, Math.round((vh - cH) / 2)) + 'px';
                    card.style.bottom = 'auto';
                    return;
                }
                shield.style.background = 'transparent';
                const r = el.getBoundingClientRect(), pad = 8;
                const L = Math.max(4, r.left - pad), T = Math.max(4, r.top - pad), R = Math.min(vw - 4, r.right + pad), B = Math.min(vh - 4, r.bottom + pad);
                Object.assign(spot.style, { display: 'block', left: L + 'px', top: T + 'px', width: (R - L) + 'px', height: (B - T) + 'px' });
                const big = (B - T) > vh * 0.55;
                let top, left = Math.min(Math.max(12, L), vw - card.offsetWidth - 12);
                if (big) {
                    top = vh - cH - 14;
                    left = Math.max(12, (vw - card.offsetWidth) / 2);
                } else if (B + 14 + cH <= vh - 8) {
                    top = B + 14;
                } else if (T - 14 - cH >= 8) {
                    top = T - 14 - cH;
                } else {
                    top = Math.max(12, vh - cH - 14);
                    left = Math.max(12, vw - card.offsetWidth - 14);
                }
                card.style.top = top + 'px'; card.style.left = left + 'px'; card.style.bottom = 'auto';
            }
            function render() {
                const s = STEPS[idx], isZ = zh(), L = isZ ? s.zh : s.en;
                $('tour-step').textContent = (isZ ? '導覽 ' : 'Tour ') + (idx + 1) + ' / ' + STEPS.length;
                $('tour-title').textContent = L.t; $('tour-body').innerHTML = L.b;
                $('tour-skip').textContent = isZ ? '結束導覽' : 'End tour';
                $('tour-back').textContent = isZ ? '上一步' : 'Back'; $('tour-back').style.visibility = idx === 0 ? 'hidden' : 'visible';
                $('tour-next').textContent = idx === STEPS.length - 1 ? (isZ ? '開始體驗' : 'Start exploring') : (isZ ? '下一步' : 'Next');
            }
            function go(i, dir) {
                if (i < 0) i = 0;
                if (i >= STEPS.length) return end();
                idx = i; const s = STEPS[idx];
                try { if (s.menu) { if (window.openDataMenu) openDataMenu(); } else if (window.closeDataMenu) closeDataMenu(); } catch (e) {}
                try { if (window.setRailDrawer) setRailDrawer(s.sel === '#main-nav', true); } catch (e) {}
                if (s.section && typeof switchMainSection === 'function' && typeof activeSection !== 'undefined' && activeSection !== s.section) {
                    // Changing page: darken the screen, jump to the top and hold the spotlight until the new page is in place (no flash of the old scroll position)
                    moving = true;
                    try { const sp = $('tour-spot'), sh = $('tour-shield'); if (sp) sp.style.display = 'none'; if (sh) sh.style.background = 'rgba(0,0,0,0.94)'; } catch (e) {}
                    try { switchMainSection(s.section); } catch (e) {}
                    window.scrollTo(0, 0);
                }
                setTimeout(() => {
                    const el = resolve(s);
                    if (s.optional && !shown(el)) { moving = false; return go(idx + dir, dir); }
                    render();
                    if (shown(el)) { const r = el.getBoundingClientRect(); try { el.scrollIntoView({ block: r.height > window.innerHeight * 0.55 ? 'start' : 'center', behavior: 'auto' }); } catch (e) {} }
                    moving = false;
                    setTimeout(place, 60);
                }, s.section ? 450 : 30);
            }
            function end() {
                const isLastStep = (idx === STEPS.length - 1);
                const card = $('tour-card');
                const tourBtn = $('tour-btn');

                if (isLastStep && card && tourBtn && typeof tourBtn.getBoundingClientRect === 'function') {
                    const cardRect = card.getBoundingClientRect();
                    const btnRect = tourBtn.getBoundingClientRect();

                    // Fade out shield and spot quickly
                    const shield = $('tour-shield');
                    const spot = $('tour-spot');
                    if (spot) spot.style.display = 'none';
                    if (shield) {
                        shield.style.transition = 'opacity 0.35s ease';
                        shield.style.opacity = '0';
                    }

                    // Compute translation vector from center of card to center of tour-btn (2nd icon on right at top)
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    const btnCenterX = btnRect.left + btnRect.width / 2;
                    const btnCenterY = btnRect.top + btnRect.height / 2;
                    const deltaX = btnCenterX - cardCenterX;
                    const deltaY = btnCenterY - cardCenterY;

                    card.style.transformOrigin = 'center center';
                    card.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.08)`;
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';

                    // Trigger pulse animation on tour-btn right when the dialogue arrives
                    setTimeout(() => {
                        try {
                            if (typeof tourBtn.animate === 'function') {
                                tourBtn.animate([
                                    { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)' },
                                    { transform: 'scale(1.22)', boxShadow: '0 0 0 10px rgba(234, 179, 8, 0.45)', backgroundColor: 'rgba(234, 179, 8, 0.25)', borderColor: 'var(--accent-yellow)' },
                                    { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)' }
                                ], { duration: 600, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
                            }
                        } catch (err) {}
                    }, 480);

                    // Final cleanup
                    setTimeout(() => {
                        finishEnd();
                        card.style.transition = '';
                        card.style.transform = '';
                        card.style.opacity = '';
                        card.style.pointerEvents = '';
                        if (shield) {
                            shield.style.transition = '';
                            shield.style.opacity = '';
                        }
                    }, 660);
                    return;
                }

                finishEnd();
            }

            function finishEnd() {
                on = false; const r = $('tour-root'); if (r) r.style.display = 'none'; try { if (window.closeDataMenu) closeDataMenu(); if (window.setRailDrawer) setRailDrawer(false, true); if (window.__railTourEnd) window.__railTourEnd(); var _n = document.getElementById('main-nav'); if (_n) _n.classList.remove('tour-open'); } catch (e) {}
                if (startSection && typeof switchMainSection === 'function' && typeof activeSection !== 'undefined' && activeSection !== startSection) { try { switchMainSection(startSection); } catch (e) {} }
                window.scrollTo(0, 0);
            }
            window.startTour = function () {
                build();
                const card = $('tour-card');
                const shield = $('tour-shield');
                if (card) { card.style.transition = ''; card.style.transform = ''; card.style.opacity = ''; card.style.pointerEvents = ''; }
                if (shield) { shield.style.transition = ''; shield.style.opacity = ''; }
                on = true; startSection = (typeof activeSection !== 'undefined') ? activeSection : null;
                try { if (typeof closeCsvGuide === 'function') closeCsvGuide(); } catch (e) {}
                $('tour-root').style.display = 'block'; window.scrollTo(0, 0); go(0, 1);
            };
            window.endTour = end;
        })();
