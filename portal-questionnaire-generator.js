// ==================== UNIVERSAL QUESTIONNAIRE TEMPLATE GENERATOR ====================
// Generates standalone printable/exportable HTML questionnaire template based on active schema and language
window.generateQuestionnaireHTML = function generateQuestionnaireHTML(schema, lang) {
    const isZh = (lang === 'zh');
    function safeText(val, fallback) {
        if (fallback === undefined) fallback = '';
        if (val == null) return fallback;
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
            if (isZh) {
                return val.nameZh || val.titleZh || val.labelZh || val.textZh || val.promptZh ||
                       val.name || val.title || val.label || val.text || val.prompt || fallback;
            } else {
                return val.name || val.title || val.label || val.text || val.prompt ||
                       val.nameZh || val.titleZh || val.labelZh || val.textZh || val.promptZh || fallback;
            }
        }
        return String(val);
    }
    const esc = (typeof escapeHtml === 'function') ? escapeHtml : function(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    const title = isZh
        ? (schema.nameZh || schema.name || '保險業務員客群畫像與銷售旅程問卷')
        : (schema.name || "Agent Persona & Sales Journey Questionnaire");
    
    const audience = schema.targetAudience || (isZh ? '業務員夥伴' : 'Sales Force Agent');
    const audienceTermZh = schema.id === 'policyholder' ? '保戶' : (schema.id === 'patient' ? '病患' : (schema.id === 'agent' ? '業務員' : '受訪者'));
    const audienceTermEn = schema.id === 'policyholder' ? 'policyholder' : (schema.id === 'patient' ? 'patient' : (schema.id === 'agent' ? 'agent' : 'respondent'));

    const secTitles = schema.sectionTitles || {};

    const introText = isZh
        ? (schema.introZh || schema.intro || "親愛的業務夥伴，您好！本問卷旨在了解您在保險銷售歷程中的日常工作風格、工具使用習慣，以及所遇到的挑戰與需求，並作為優化業務員數位工具、提升服務品質的基準。問卷約需 10–15 分鐘完成。所有回覆將透過非監督式機器學習演算法進行彙整與動態分析，即時描繪業務員輪廓，而不依賴僵化、預先設定的依時序劃分之人口統計篩選條件。感謝您的配合與協助！")
        : (schema.intro || schema.introZh || "Dear Business Partners, Hello! This questionnaire aims to understand your daily work styles, tool usage habits, and the challenges and needs you encounter during your insurance sales journey. This will serve as a baseline for optimising digital tools for agents and improving our service quality. The questionnaire takes about 10–15 minutes to complete. All responses are aggregated and analysed dynamically via unsupervised machine learning algorithms to map agent profiles in real-time without relying on rigid, predefined chronological demographic filters. Thank you for your cooperation and assistance!");

    const demographics = schema.demographics || [];
    const metrics = schema.metrics || [];
    const stages = schema.stages || [];

    const qMap = {};
    if (schema && schema.questions && Array.isArray(schema.questions)) {
        schema.questions.forEach(q => {
            if (q && q.id) qMap[q.id] = q;
        });
    }

    const cfg = (schema && schema.sectionsConfig) || {
        demographics: true,
        dimensions: true,
        tags: true,
        workContent: true,
        journey: true
    };

    const romanNums = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const zhNums = ['一', '二', '三', '四', '五', '六'];
    let partCounter = 0;
    let qCounter = 1;

    let sectionsHtml = '';

    // 1. Demographics
    if (cfg.demographics) {
        const partRoman = romanNums[partCounter] || String(partCounter + 1);
        const partZh = zhNums[partCounter] || String(partCounter + 1);
        partCounter++;

        const startQ = qCounter;
        let demoRowsHtml = '';
        if (!demographics || demographics.length === 0) {
            demoRowsHtml = `<div style="color: #64748b; font-style: italic; font-size: var(--fs-body); padding: 14px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; text-align: center;">${isZh ? '此問卷未設定基本資料題。' : 'No demographic questions configured.'}</div>`;
        } else {
            demoRowsHtml = demographics.map((d) => {
                const qNum = qCounter++;
                const dLabelRaw = isZh ? (d.labelZh || d.label) : d.label;
                const dLabel = safeText(dLabelRaw).replace(/\s*\((Single Select|單選)\)/gi, '').replace(/（(單選|Single Select)）/g, '');
                const rawOpts = isZh ? (d.optionsZh || d.options || '') : (d.options || '');
                const isTextType = d.type === 'text' || (typeof rawOpts === 'string' && rawOpts.includes('___'));
                const noteText = isZh ? (d.noteZh || d.note || '') : (d.note || '');

                let optList = [];
                if (Array.isArray(rawOpts)) {
                    optList = rawOpts.map(o => safeText(o)).filter(Boolean);
                } else if (typeof rawOpts === 'string' && rawOpts.trim()) {
                    optList = rawOpts.split(/[,，;；\n\r]+/).map(o => o.trim()).filter(Boolean);
                }

                let optHtml = '';
                if (isTextType) {
                    optHtml = `<div class="field-writein" style="font-family: monospace; font-size: var(--fs-body); color: #475569; margin-top: 6px; letter-spacing: 1px;">${esc(typeof rawOpts === 'string' && rawOpts.includes('___') ? rawOpts : '__________________________________________________')}</div>`;
                } else if (optList.length > 0) {
                    optHtml = `<div class="field-options" style="display: flex; flex-wrap: wrap; gap: 10px 20px; font-size: var(--fs-body); margin-top: 8px;">${optList.map(o => `<span>[ ] ${esc(o)}</span>`).join('')}</div>`;
                } else {
                    optHtml = `<div class="field-writein" style="border-bottom: 1px solid #94a3b8; height: 26px; width: 100%; margin-top: 6px;"></div>`;
                }

                let noteHtml = '';
                if (noteText) {
                    noteHtml = `<div style="font-size: var(--fs-small); color: #64748b; font-style: italic; margin-top: 6px; line-height: 1.5;">${esc(safeText(noteText))}</div>`;
                }

                return `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">${qNum}. ${esc(dLabel)}</label>
                        ${optHtml}
                        ${noteHtml}
                    </div>
                `;
            }).join('');
        }
        const endQ = qCounter - 1;
        const rangeLabel = endQ >= startQ ? `Q${startQ} ~ Q${endQ}` : '';

        const userDemoTitle = isZh 
            ? (secTitles.demographicsZh || secTitles.demographics)
            : (secTitles.demographics || 'General Information');
        const displayDemoTitle = userDemoTitle 
            ? (userDemoTitle.includes('Part') || userDemoTitle.includes('部分') ? userDemoTitle : (isZh ? `第${partZh}部分：${userDemoTitle}` : `Part ${partRoman}: ${userDemoTitle}`))
            : (isZh ? `第${partZh}部分：基本資料` : `Part ${partRoman}: General Information`);

        sectionsHtml += `
            <!-- PART: DEMOGRAPHICS -->
            <div class="section-header">
                <span>${esc(displayDemoTitle)}</span>
                <span style="font-size: var(--fs-small); opacity: 0.9;">${rangeLabel}</span>
            </div>
            ${demoRowsHtml}
        `;
    }

    // 2. Archetype Tags (Self-Image)
    if (cfg.tags) {
        const partRoman = romanNums[partCounter] || String(partCounter + 1);
        const partZh = zhNums[partCounter] || String(partCounter + 1);
        partCounter++;

        const startQ = qCounter;
        const qTag1 = qCounter++;
        const qTag2 = qCounter++;
        const qTag3 = qCounter++;
        const endQ = qCounter - 1;

        const tags = isZh
            ? (schema.selfImageTagsZh || [
                "深耕客戶關係", "預測式服務", "商機獵人", "主動開發", "菜鳥業務員",
                "數位工具達人", "擁抱理想", "直覺敏銳", "好學求知", "信任導向",
                "責任感強", "精進培訓", "彈性應變", "數字導向", "高同理心",
                "主動溝通", "快速精準", "即時回應", "進度透明", "流程專家",
                "情感連結", "家庭守護者", "行動導向", "以服務贏得信任", "細節掌控",
                "高峰會常客", "活動敏銳", "服務優先", "分析規劃", "效率至上"
            ])
            : (schema.selfImageTags || [
                "Cultivation of Customer Relations", "Predictive Service", "Opportunity Hunter", "Proactive Development", "Rookie Agent",
                "Digital Savvy Tool User", "Embracing Ideals", "Intuitive & Sharp", "Inquisitive Learner", "Trust-Based",
                "Strong Sense of Responsibility", "Premium Training", "Flexible Adaptation", "Number-Oriented", "High Empathy",
                "Proactive Communication", "Fast & Precise", "Rapid Response", "Progress Transparency", "Process Expert",
                "Emotional Connection", "Family Protector", "Action-Oriented", "Trust Through Service", "Detail Controller",
                "Summit Convention Regular", "Event Sensitive", "Service Priority", "Analytical Planning", "Efficiency First"
            ]);

        let tagsTableRows = '';
        for (let r = 0; r < Math.ceil(tags.length / 5); r++) {
            const slice = tags.slice(r * 5, r * 5 + 5);
            tagsTableRows += '<tr style="border-bottom: 1px solid #e2e8f0;">';
            for (let c = 0; c < 5; c++) {
                const rawItem = slice[c];
                const item = safeText(rawItem);
                if (item) {
                    tagsTableRows += `<td style="padding: 8px 10px; font-size: var(--fs-body); color: #1e293b;">[ ] ${esc(item)}</td>`;
                } else {
                    tagsTableRows += '<td style="padding: 8px 10px;"></td>';
                }
            }
            tagsTableRows += '</tr>';
        }

        const userTagsTitle = isZh
            ? (secTitles.tagsZh || secTitles.tags)
            : (secTitles.tags || 'Self-Image Tags');
        const displayTagsTitle = userTagsTitle
            ? (userTagsTitle.includes('Part') || userTagsTitle.includes('部分') ? userTagsTitle : (isZh ? `第${partZh}部分：${userTagsTitle}` : `Part ${partRoman}: ${userTagsTitle}`))
            : (isZh ? `第${partZh}部分：自我形象標籤` : `Part ${partRoman}: Self-Image Tags`);

        const rawQ8Prompt = isZh
            ? (schema.tag1PromptZh || schema.q8PromptZh || (qMap['Q8'] && qMap['Q8'].promptZh) || schema.q17PromptZh || '請從上方選項中，選出「最能代表您」的第 1 個標籤：')
            : (schema.tag1Prompt || schema.q8Prompt || (qMap['Q8'] && qMap['Q8'].prompt) || schema.q17Prompt || 'Please write down the 1st tag that “best represents you” from the options above.');
        const cleanQ8Prompt = rawQ8Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '');

        let rawQ9Prompt = isZh
            ? (schema.tag2PromptZh || schema.q9PromptZh || (qMap['Q9'] && qMap['Q9'].promptZh) || schema.q18PromptZh || `請選出代表您的第 2 個標籤；不得與第 ${qTag1} 題重複。`)
            : (schema.tag2Prompt || schema.q9Prompt || (qMap['Q9'] && qMap['Q9'].prompt) || schema.q18Prompt || `Please write down the 2nd tag that represents you; please do not repeat Q${qTag1}.`);
        let cleanQ9Prompt = rawQ9Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '')
            .replace(/Please must not repeat/gi, 'you must not repeat')
            .replace(/Q\s*17/gi, `Q${qTag1}`)
            .replace(/第\s*17\s*題/g, `第 ${qTag1} 題`);

        let rawQ10Prompt = isZh
            ? (schema.tag3PromptZh || schema.q10PromptZh || (qMap['Q10'] && qMap['Q10'].promptZh) || schema.q19PromptZh || `請選出代表您的第 3 個標籤；不得與第 ${qTag1}、${qTag2} 題重複。`)
            : (schema.tag3Prompt || schema.q10Prompt || (qMap['Q10'] && qMap['Q10'].prompt) || schema.q19Prompt || `Please write down the 3rd tag that represents you; please do not repeat Q${qTag1} and Q${qTag2}.`);
        let cleanQ10Prompt = rawQ10Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '')
            .replace(/Please must not repeat/gi, 'you must not repeat')
            .replace(/Q\s*17/gi, `Q${qTag1}`)
            .replace(/Q\s*18/gi, `Q${qTag2}`)
            .replace(/第\s*17\s*、\s*18\s*題/g, `第 ${qTag1}、${qTag2} 題`);

        sectionsHtml += `
            <!-- PART: ARCHETYPE TAGS (SELF-IMAGE) -->
            <div class="section-header">
                <span>${esc(displayTagsTitle)}</span>
                <span style="font-size: var(--fs-small); opacity: 0.9;">Q${startQ} ~ Q${endQ}</span>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin-bottom: 12px;">
                <p style="margin: 0 0 10px 0; font-size: var(--fs-body); color: #334155; line-height: 1.6;">
                    ${isZh ? '以下標籤用於協助我們了解您的工作風格與自我認同。答案沒有對錯，請憑直覺選擇最符合您的描述。' : 'The following tags are used to help us understand your working style and self-identity. There are no right or wrong answers; please select the descriptions that fit you best based on your intuition.'}
                </p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                    <tbody>
                        ${tagsTableRows}
                    </tbody>
                </table>
                <div style="font-size: var(--fs-body); color: #475569; margin-bottom: 14px;">
                    [ ] ${isZh ? '其他（請說明）' : 'Other (please specify)'}: __________________________________________________
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
                    <div>
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                            ${qTag1}. ${esc(cleanQ8Prompt)}
                        </label>
                        <div style="font-size: var(--fs-body); color: #2563eb; margin-top: 6px;">
                            Tag 1: __________________________________________________
                        </div>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                            ${qTag2}. ${esc(cleanQ9Prompt)}
                        </label>
                        <div style="font-size: var(--fs-body); color: #2563eb; margin-top: 6px;">
                            Tag 2: __________________________________________________
                        </div>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                            ${qTag3}. ${esc(cleanQ10Prompt)}
                        </label>
                        <div style="font-size: var(--fs-body); color: #2563eb; margin-top: 6px;">
                            Tag 3: __________________________________________________
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // 3. Agent Background (Dimensions & Workstyles)
    if (cfg.dimensions) {
        const partRoman = romanNums[partCounter] || String(partCounter + 1);
        const partZh = zhNums[partCounter] || String(partCounter + 1);
        partCounter++;

        const startQ = qCounter;
        const qFamiliarity = qCounter++;
        const qEmoji = qCounter++;
        const qImpact = qCounter++;
        const qSystemFactors = qCounter++;
        const qCompetency = qCounter++;
        const qLineReason = qCounter++;
        const qSchedule = qCounter++;
        const qDeskCalendar = qCounter++;
        const qCalendarSuggestions = qCounter++;
        const endQ = qCounter - 1;

        const userDimTitle = isZh
            ? (secTitles.dimensionsZh || secTitles.dimensions)
            : (secTitles.dimensions || 'Agent Background');
        const displayDimTitle = userDimTitle
            ? (userDimTitle.includes('Part') || userDimTitle.includes('部分') ? userDimTitle : (isZh ? `第${partZh}部分：${userDimTitle}` : `Part ${partRoman}: ${userDimTitle}`))
            : (isZh ? `第${partZh}部分：現況評估` : `Part ${partRoman}: Agent Background`);

        const activeScale = schema.unifiedScale || (metrics && metrics[0] && metrics[0].scaleType) || '1-5';
        let matrixHeaders = [];
        if (activeScale === '1-7') {
            matrixHeaders = isZh
                ? ['完全沒有影響 (1)', '2', '3', '4 (普通)', '5', '6', '影響很大 (7)']
                : ['No Impact (1)', '2', '3', '4 (Neutral)', '5', '6', 'High Impact (7)'];
        } else if (activeScale === '1-10') {
            matrixHeaders = isZh
                ? ['1 (最低)', '2', '3', '4', '5 (中等)', '6', '7', '8', '9', '10 (最高)']
                : ['1 (Min)', '2', '3', '4', '5 (Mid)', '6', '7', '8', '9', '10 (Max)'];
        } else if (activeScale === '0-100') {
            matrixHeaders = ['0%', '20%', '40%', '60%', '80%', '100%'];
        } else {
            matrixHeaders = isZh
                ? ['完全沒有影響', '有一點影響', '普通', '有影響', '影響很大']
                : ['No Impact at All', 'A Little Impact', 'Neutral', 'Has Impact', 'High Impact'];
        }
        const matrixHeaderThs = matrixHeaders.map(h => `<th style="text-align: center;">${esc(h)}</th>`).join('');
        const emptyMatrixCells = Array(matrixHeaders.length).fill('<td style="text-align: center; padding: 6px 4px;">[ ]</td>').join('');

        const firstMetricLabel = metrics && metrics[0] ? (isZh ? (metrics[0].labelZh || metrics[0].label) : metrics[0].label) : (isZh ? '數位工具熟悉度（App／系統）' : 'Digital Tool Familiarity (Apps/Systems)');
        const secondMetricLabel = metrics && metrics[1] ? (isZh ? (metrics[1].labelZh || metrics[1].label) : metrics[1].label) : (isZh ? '系統／入口網站的速度與穩定度' : 'System / Portal Speed & Reliability');
        const thirdMetricLabel = metrics && metrics[2] ? (isZh ? (metrics[2].labelZh || metrics[2].label) : metrics[2].label) : (isZh ? '行動 App 使用體驗' : 'Mobile App Experience');

        const systemFactors = (metrics && metrics.length >= 3)
            ? [
                isZh ? (metrics[0].labelZh || metrics[0].label) : metrics[0].label,
                isZh ? (metrics[1].labelZh || metrics[1].label) : metrics[1].label,
                isZh ? (metrics[2].labelZh || metrics[2].label) : metrics[2].label
            ]
            : [firstMetricLabel, secondMetricLabel, thirdMetricLabel];

        const competencies = (metrics && metrics.length > 3)
            ? metrics.slice(3).map(m => isZh ? (m.labelZh || m.label) : m.label)
            : (isZh
                ? ['陌生開發與名單取得能力', '商品專業知識與方案規劃', '客戶關係維護與售後服務', '數位工具應用與線上展業能力', '團隊協作與經驗傳承']
                : ['Cold Calling & Lead Acquisition', 'Product Knowledge & Solution Planning', 'Customer Relationship & After-sales Service', 'Digital Tool & Online Sales Capability', 'Teamwork & Knowledge Sharing']);

        const sq = schema.supportingQuestions || {};

        const rawQ11Prompt = isZh
            ? (schema.q11PromptZh || (qMap['Q11'] && qMap['Q11'].promptZh) || schema.q8PromptZh || (qMap['Q8'] && qMap['Q8'].promptZh) || '您對目前業務員工具／系統的熟悉程度為何？')
            : (schema.q11Prompt || (qMap['Q11'] && qMap['Q11'].prompt) || schema.q8Prompt || (qMap['Q8'] && qMap['Q8'].prompt) || 'What is your level of familiarity with current agent tools/systems?');
        const cleanQ11Prompt = rawQ11Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').replace(/\s*[\(（](Check the corresponding percentage|請勾選對應的?百分比)[\)）]/gi, '').trim();

        const rawQ12Prompt = isZh
            ? (schema.q12PromptZh || (qMap['Q12'] && qMap['Q12'].promptZh) || schema.q9PromptZh || (qMap['Q9'] && qMap['Q9'].promptZh) || '整體而言，您目前的工作方式讓您感覺如何？')
            : (schema.q12Prompt || (qMap['Q12'] && qMap['Q12'].prompt) || schema.q9Prompt || (qMap['Q9'] && qMap['Q9'].prompt) || 'Overall, how does your current work style make you feel?');
        const cleanQ12Prompt = rawQ12Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();

        const safeOptionsList = (raw) => {
            if (Array.isArray(raw)) return raw.map(o => safeText(o)).filter(Boolean);
            if (typeof raw === 'string') return raw.split(/[\n\r]+/).map(s => s.trim()).filter(Boolean);
            return [];
        };

        const rawQ13Prompt = isZh
            ? (schema.q13PromptZh || (qMap['Q13'] && qMap['Q13'].promptZh) || schema.q10PromptZh || (qMap['Q10'] && qMap['Q10'].promptZh) || '您認為 ABC 保險目前提供的工具／系統，對您日常工作效率有何影響？')
            : (schema.q13Prompt || (qMap['Q13'] && qMap['Q13'].prompt) || schema.q10Prompt || (qMap['Q10'] && qMap['Q10'].prompt) || 'What impact do you feel the tools/systems currently provided by ABC Insurance have on your daily work efficiency?');
        const cleanQ13Prompt = rawQ13Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').replace(/\s*[\(（](Single Select|單選)[\)）]/gi, '').trim();
        const rawQ13Options = (isZh ? (schema.q13OptionsZh || schema.q10OptionsZh) : (schema.q13Options || schema.q10Options)) || (qMap['Q13'] && (isZh ? qMap['Q13'].optionsZh : qMap['Q13'].options)) || (qMap['Q10'] && (isZh ? qMap['Q10'].optionsZh : qMap['Q10'].options)) || (isZh
            ? ['嚴重拖慢效率', '略微拖慢效率', '無明顯影響', '略微提升效率', '大幅提升效率']
            : ['Severely slows down efficiency', 'Slightly slows down efficiency', 'No noticeable impact', 'Slightly improves efficiency', 'Significantly improves efficiency']);
        const q13OptionsList = safeOptionsList(rawQ13Options);

        const rawQ14Prompt = isZh
            ? (schema.q14PromptZh || (qMap['Q14'] && qMap['Q14'].promptZh) || schema.q11PromptZh || (qMap['Q11'] && qMap['Q11'].promptZh) || '請評估下列「系統／數位工具」因素對您工作效率的影響程度。')
            : (schema.q14Prompt || (qMap['Q14'] && qMap['Q14'].prompt) || schema.q11Prompt || (qMap['Q11'] && qMap['Q11'].prompt) || 'In your daily work, what impact do you feel each of the following factors of tools/systems provided by ABC Insurance has on your efficiency?');
        const cleanQ14Prompt = rawQ14Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();

        const rawQ15Prompt = isZh
            ? (schema.q15PromptZh || (qMap['Q15'] && qMap['Q15'].promptZh) || schema.q12PromptZh || (qMap['Q12'] && qMap['Q12'].promptZh) || '請評估下列「專業能力」對您整體業務與銷售績效的影響程度。')
            : (schema.q15Prompt || (qMap['Q15'] && qMap['Q15'].prompt) || schema.q12Prompt || (qMap['Q12'] && qMap['Q12'].prompt) || 'Please evaluate the impact of each of the following PROFESSIONAL CAPABILITIES on your overall business and sales performance.');
        const cleanQ15Prompt = rawQ15Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();

        const rawQ16Prompt = isZh
            ? (schema.q16PromptZh || (qMap['Q16'] && qMap['Q16'].promptZh) || schema.q13PromptZh || (qMap['Q13'] && qMap['Q13'].promptZh) || sq.q16?.promptZh || sq.q13?.promptZh || '請問您主要因為哪些原因，使用 LINE 或個人聯絡管道處理客戶相關事務？')
            : (schema.q16Prompt || (qMap['Q16'] && qMap['Q16'].prompt) || schema.q13Prompt || (qMap['Q13'] && qMap['Q13'].prompt) || sq.q16?.prompt || sq.q13?.prompt || 'What are the primary reasons you use tools like LINE or personal contact channels to handle customer affairs?');
        const cleanQ16Prompt = rawQ16Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();
        const rawQ16Options = (isZh ? (schema.q16OptionsZh) : (schema.q16Options)) || (qMap['Q16'] && (isZh ? qMap['Q16'].optionsZh : qMap['Q16'].options)) || sq.q16?.options || (isZh
            ? ['速度較快', '介面較熟悉', '公司系統沒有此功能', '客戶偏好以此方式溝通', '公司系統登入／操作較繁瑣', '其他']
            : ['Faster speed', 'More familiar interface', 'Company system lacks this feature', 'Customer prefers communicating this way', 'Company system login/operation is cumbersome', 'Other']);
        const q16OptionsList = safeOptionsList(rawQ16Options);

        const rawQ17Prompt = isZh
            ? (schema.q17PromptZh || (qMap['Q17'] && qMap['Q17'].promptZh) || schema.q14PromptZh || (qMap['Q14'] && qMap['Q14'].promptZh) || sq.q17?.promptZh || sq.q14?.promptZh || '您如何規劃與安排客戶拜訪行程？')
            : (schema.q17Prompt || (qMap['Q17'] && qMap['Q17'].prompt) || schema.q14Prompt || (qMap['Q14'] && qMap['Q14'].prompt) || sq.q17?.prompt || sq.q14?.prompt || 'How do you plan and schedule customer visits?');
        const cleanQ17Prompt = rawQ17Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();
        const rawQ17Options = (isZh ? (schema.q17OptionsZh) : (schema.q17Options)) || (qMap['Q17'] && (isZh ? qMap['Q17'].optionsZh : qMap['Q17'].options)) || sq.q17?.options || (isZh
            ? ['公司系統', '手機內建行事曆／個人行事曆 App', '紙本桌曆／筆記本', '大腦記憶／臨時記事', '其他']
            : ['Company system', 'Mobile phone built-in calendar / personal calendar app', 'Paper calendar/notebook', 'Brain memory / temporary notes', 'Other']);
        const q17OptionsList = safeOptionsList(rawQ17Options);

        const rawQ18Prompt = isZh
            ? (schema.q18PromptZh || (qMap['Q18'] && qMap['Q18'].promptZh) || schema.q15PromptZh || (qMap['Q15'] && qMap['Q15'].promptZh) || sq.q18?.promptZh || sq.q15?.promptZh || '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）')
            : (schema.q18Prompt || (qMap['Q18'] && qMap['Q18'].prompt) || schema.q15Prompt || (qMap['Q15'] && qMap['Q15'].prompt) || sq.q18?.prompt || sq.q15?.prompt || 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)');
        const cleanQ18Prompt = rawQ18Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();
        const rawQ18Options = (isZh ? (schema.q18OptionsZh) : (schema.q18Options)) || (qMap['Q18'] && (isZh ? qMap['Q18'].optionsZh : qMap['Q18'].options)) || sq.q18?.options || (isZh
            ? ['習慣手寫／翻閱的直覺感', '月檢視一目了然', '不受設備與網路限制', '講電話時隨手記錄最快', '其他']
            : ['Used to handwriting/flipping pages', 'Clear monthly overview', 'Not constrained by devices/network', 'Convenient for quick notes during calls', 'Other']);
        const q18OptionsList = safeOptionsList(rawQ18Options);

        const rawQ19Prompt = isZh
            ? (schema.q19PromptZh || (qMap['Q19'] && qMap['Q19'].promptZh) || schema.q16PromptZh || (qMap['Q16'] && qMap['Q16'].promptZh) || sq.q19?.promptZh || sq.q16?.promptZh || '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？')
            : (schema.q19Prompt || (qMap['Q19'] && qMap['Q19'].prompt) || schema.q16Prompt || (qMap['Q16'] && qMap['Q16'].prompt) || sq.q19?.prompt || sq.q16?.prompt || 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?');
        const cleanQ19Prompt = rawQ19Prompt.replace(/^Q\s*\d+\s*[:\.]?\s*/i, '').trim();
        const rawQ19Options = (isZh ? (schema.q19OptionsZh) : (schema.q19Options)) || (qMap['Q19'] && (isZh ? qMap['Q19'].optionsZh : qMap['Q19'].options)) || sq.q19?.options || (isZh
            ? ['極度願意', '願意', '普通', '意願低', '完全不願意']
            : ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling']);
        const q19OptionsList = safeOptionsList(rawQ19Options);

        sectionsHtml += `
            <div class="section-header">
                <span>${esc(displayDimTitle)}</span>
                <span style="font-size: var(--fs-small); opacity: 0.9;">Q${startQ} ~ Q${endQ}</span>
            </div>

            <!-- Agent Tools Familiarity (Q11) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qFamiliarity}. ${esc(cleanQ11Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px; color: #334155;">
                    <span style="font-weight: 600; color: #64748b;">${isZh ? '極不熟悉' : 'Extremely Unfamiliar'}</span>
                    <span>[ ] 0%</span> <span>[ ] 20%</span> <span>[ ] 40%</span> <span>[ ] 60%</span> <span>[ ] 80%</span> <span>[ ] 100%</span>
                    <span style="font-weight: 600; color: #64748b;">${isZh ? '極為熟悉' : 'Extremely Familiar'}</span>
                </div>
            </div>

            <!-- Work Feeling Emoji Scale (Q12) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qEmoji}. ${esc(cleanQ12Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px; color: #334155;">
                    <span style="font-weight: 600; color: #64748b;">${isZh ? '極不滿意' : 'Extremely Unhappy'}</span>
                    <span>[ ] 😩</span> <span>[ ] 🙁</span> <span>[ ] 😐</span> <span>[ ] 🙂</span> <span>[ ] 😄</span>
                    <span style="font-weight: 600; color: #64748b;">${isZh ? '極為滿意' : 'Extremely Happy'}</span>
                </div>
            </div>

            <!-- Tools Efficiency Impact (Q13) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qImpact}. ${esc(cleanQ13Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${q13OptionsList.map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>

            <!-- System / Digital Tool Factors Matrix (Q14) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qSystemFactors}. ${esc(cleanQ14Prompt)}
                </label>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: var(--fs-body);">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
                            <th style="text-align: left; padding: 8px 10px; width: 45%;">${isZh ? '評估項目' : 'Item'}</th>
                            ${matrixHeaderThs}
                        </tr>
                    </thead>
                    <tbody>
                        ${systemFactors.map(f => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${esc(safeText(f))}</td>
                                ${emptyMatrixCells}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Professional Capabilities Matrix (Q15) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qCompetency}. ${esc(cleanQ15Prompt)}
                </label>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: var(--fs-body);">
                    <thead>
                        <tr style="background: #f8fafc; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
                            <th style="text-align: left; padding: 8px 10px; width: 45%;">${isZh ? '評估項目' : 'Item'}</th>
                            ${matrixHeaderThs}
                        </tr>
                    </thead>
                    <tbody>
                        ${competencies.map(c => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${esc(safeText(c))}</td>
                                ${emptyMatrixCells}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- LINE / Personal Tools Reasons (Q16) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qLineReason}. ${esc(cleanQ16Prompt)}
                </label>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: var(--fs-body); margin-top: 8px;">
                    ${q16OptionsList.map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>

            <!-- Customer Visit Scheduling (Q17) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qSchedule}. ${esc(cleanQ17Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${q17OptionsList.map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>

            <!-- Paper Calendar Reason (Q18) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qDeskCalendar}. ${esc(cleanQ18Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${q18OptionsList.map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>

            <!-- Calendar Proactive Suggestions Willingness (Q19) -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qCalendarSuggestions}. ${esc(cleanQ19Prompt)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${q19OptionsList.map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // 4. Daily Work Content & Needs
    if (cfg.workContent) {
        const partRoman = romanNums[partCounter] || String(partCounter + 1);
        const partZh = zhNums[partCounter] || String(partCounter + 1);
        partCounter++;

        const startQ = qCounter;
        const qWorkItems = qCounter++;
        const qFriction = qCounter++;
        const qOfficialSys = qCounter++;
        const qPersonalTools = qCounter++;
        const qNeeds = qCounter++;
        const qMotto = qCounter++;
        const endQ = qCounter - 1;

        const dailyItems = (isZh
            ? (schema.dailyWorkItemsZh || schema.dailyWorkItems || [
                "a) 安排與拜訪客戶", "b) 維護準客戶名單／開發新名單", "c) 簽署保單", "d) 售後服務",
                "e) 提升專業知識／教育訓練", "f) 內部行政事務", "g) 系統／工具優化與學習",
                "h) 辦公室聚會與團隊活動", "i) 增員", "j) 其他"
            ])
            : (schema.dailyWorkItems || schema.dailyWorkItemsZh || [
                "a) Scheduling and visiting clients", "b) Maintaining prospect lists / developing new lists",
                "c) Signing policies", "d) Post-sales service", "e) Enhancing professional knowledge/training",
                "f) Internal administrative tasks", "g) System/tool optimisation and learning",
                "h) Office gatherings and team activities", "i) Recruiting", "j) Other"
            ])).map(item => safeText(item));

        const dailyItemsRendered = dailyItems.map(item => `<span>${esc(item)}</span>`).join(' &nbsp;|&nbsp; ');

        const officialSystems = (isZh
            ? (schema.officialSystemsZh || schema.officialSystems || [
                "投保送件系統", "線上簽署系統", "理賠系統", "服務系統",
                "業務員 App", "業務員入口網站", "ABC 學院", "建議書系統"
            ])
            : (schema.officialSystems || schema.officialSystemsZh || [
                "Insurance Submission System", "Online Signing System", "Claims System", "Service System",
                "Agent App", "Agent Portal", "ABC Academy", "Proposal System"
            ])).map(s => safeText(s));

        const personalTools = (isZh
            ? (schema.personalToolsZh || schema.personalTools || [
                "LINE", "手機記事本／日曆 App", "電話（個人）", "Canva", "紙本申請書",
                "AI 工具（例如 NotebookLM）", "Notion／Google 試算表", "紙本筆記本／桌曆",
                "行政助理／同儕協助資料登錄", "分公司櫃檯／臨櫃（人工處理）"
            ])
            : (schema.personalTools || schema.personalToolsZh || [
                "LINE", "Mobile Notes / Calendar App", "Phone Call (personal)", "Canva", "Paper Application Forms",
                "AI tools (e.g., NotebookLM)", "Notion / Google Sheets", "Paper Notebook / Desk Calendar",
                "Administrative Assistant / Peer assistance for data logging", "Branch Counter / In-Person (manual override)"
            ])).map(t => safeText(t));

        const coreNeeds = (isZh
            ? (schema.coreNeedsZh || schema.coreNeeds || [
                "快速登入／Face ID 與指紋登入", "簡化系統介面操作", "單一入口系統整合",
                "開放 API／客製化整合功能", "關鍵字模糊搜尋", "行動 App 體驗優化",
                "名單自動分類／標籤化", "支援離線暫存作業", "一鍵自動生成建議書",
                "保留臨櫃／紙本送件彈性", "延長線上簽署有效時限", "助理帳號授權機制",
                "便利紙本列印／大字版介面", "降低等待與讀取時間", "常用職業／商品預設值"
            ])
            : (schema.coreNeeds || schema.coreNeedsZh || [
                "Fast login / FaceID & Fingerprint login", "Simplified system interface operations",
                "Single portal system integration", "Open API / custom integration features",
                "Fuzzy keyword search", "Mobile App experience optimisation",
                "Automated list classification / tagging", "Offline cache support",
                "One-click automatic quotation generation", "Retain counter/paper processing options",
                "Extend online signature validity duration", "Assistant account delegation permissions",
                "Convenient paper printing / large-font interface", "Reduce loading times",
                "Predefined options for common occupations/products"
            ])).map(n => safeText(n));

        const userWorkTitle = isZh
            ? (secTitles.workContentZh || secTitles.workContent)
            : (secTitles.workContent || 'Expectation');
        const displayWorkTitle = userWorkTitle
            ? (userWorkTitle.includes('Part') || userWorkTitle.includes('部分') ? userWorkTitle : (isZh ? `第${partZh}部分：${userWorkTitle}` : `Part ${partRoman}: ${userWorkTitle}`))
            : (isZh ? `第${partZh}部分：核心期待` : `Part ${partRoman}: Expectation`);

        const rawQ20Prompt = isZh
            ? (schema.q20PromptZh || (qMap['Q20'] && qMap['Q20'].promptZh) || '以下列出 9 類工作項目。請填入您日常主要工作項目的代碼（最多 5 項），並於下表概估各項目所佔的時間比例。若沒有符合的選項，請選擇「j) 其他」並自行填寫工作項目。')
            : (schema.q20Prompt || (qMap['Q20'] && qMap['Q20'].prompt) || 'The following lists 9 categories of work items. Please fill in the codes for your main daily work items (up to 5 items) and estimate the proportion of time occupied by each item in the table below. If there are no matching options, please select “j) Other” and fill in the work item yourself.');
        const cleanQ20Prompt = rawQ20Prompt.replace(/^Q\s*20\s*[:\.]?\s*/i, '');

        const rawQ21Prompt = isZh
            ? (schema.q21PromptZh || (qMap['Q21'] && qMap['Q21'].promptZh) || (schema.id === 'policyholder' 
                ? '理想目標與現實落差的摩擦情境：請簡述您在投保或享受保單服務時，理想體驗與現實流程產生落差的摩擦情境（例如：理賠證明繁瑣、專人客服等候過久、條款難以理解等）：'
                : (schema.id === 'patient'
                    ? '理想目標與現實落差的摩擦情境：請簡述您在就醫或照護過程中，理想體驗與現實流程產生落差的摩擦情境（例如：候診時間過長、跨科重複檢查、費用說明不清等）：'
                    : '在執行上述日常工作時，您希望達成的目標，與您實際能完成的工作成果之間，是否存在落差或矛盾？請簡要說明：')))
            : (schema.q21Prompt || (qMap['Q21'] && qMap['Q21'].prompt) || (schema.id === 'policyholder' 
                ? 'Goal vs. Reality Conflict Gap: Please briefly describe situations where your ideal service/insurance experience encounters practical friction or bottlenecks (e.g., claims documentation, long helpline wait times, unclear terms):'
                : (schema.id === 'patient'
                    ? 'Goal vs. Reality Conflict Gap: Please briefly describe situations where your ideal care experience encounters practical friction or delays (e.g., lengthy waiting times, duplicate examinations, billing confusion):'
                    : 'In carrying out your daily tasks above, is there a gap or contradiction between the goals you hope to achieve and the actual work outcomes? Please briefly explain:')));
        const cleanQ21Prompt = rawQ21Prompt.replace(/^Q\s*21\s*[:\.]?\s*/i, '');

        const rawQ22Prompt = isZh
            ? (schema.q22PromptZh || (schema.id === 'policyholder' ? '您日常經常使用的官方服務管道與系統' : (schema.id === 'patient' ? '您就診時經常使用的官方醫療系統與服務管道' : '在您的保險業務作業中，最常使用哪些「公司正式系統」？')))
            : (schema.q22Prompt || (schema.id === 'policyholder' ? 'Official Portals & Customer Services Regularly Used' : (schema.id === 'patient' ? 'Official Hospital Systems & Portals Regularly Used' : 'Which OFFICIAL COMPANY SYSTEMS do you use most frequently in your insurance operations?')));
        const cleanQ22Prompt = rawQ22Prompt.replace(/^Q\s*22\s*[:\.]?\s*/i, '').replace(/\s*\((Multi-select|Multiple Choice|Single Choice|複選|單選)\)/gi, '').replace(/（(複選|單選|Multi-select|Multiple Choice|Single Choice)）/g, '');
        const q22Type = schema.q22Type || 'multiple';
        const q22TypeLabel = isZh
            ? (q22Type === 'single' ? '（單選）' : '（複選）')
            : (q22Type === 'single' ? ' (Single Choice)' : ' (Multiple Choice)');

        const rawQ23Prompt = isZh
            ? (schema.q23PromptZh || (schema.id === 'policyholder' ? '您日常理財或保單管理經常使用的個人工具與輔助管道' : (schema.id === 'patient' ? '您日常健康管理經常使用的個人工具與輔助管道' : '在您的保險業務作業中，最常使用哪些「個人工具／替代做法」？')))
            : (schema.q23Prompt || (schema.id === 'policyholder' ? 'Personal Tools & Channels Regularly Used' : (schema.id === 'patient' ? 'Personal Health Tools & Devices Regularly Used' : 'Which PERSONAL TOOLS / WORKAROUNDS do you use most frequently in your insurance operations?')));
        const cleanQ23Prompt = rawQ23Prompt.replace(/^Q\s*23\s*[:\.]?\s*/i, '').replace(/\s*\((Multi-select|Multiple Choice|Single Choice|複選|單選)\)/gi, '').replace(/（(複選|單選|Multi-select|Multiple Choice|Single Choice)）/g, '');
        const q23Type = schema.q23Type || 'multiple';
        const q23TypeLabel = isZh
            ? (q23Type === 'single' ? '（單選）' : '（複選）')
            : (q23Type === 'single' ? ' (Single Choice)' : ' (Multiple Choice)');

        const rawQ24Prompt = isZh
            ? (schema.q24PromptZh || (schema.id === 'policyholder' ? '保戶核心期待與服務需求' : (schema.id === 'patient' ? '病患照護核心期待與服務需求' : '在繁忙的保險工作中，您最關鍵的核心需求／期待為何？')))
            : (schema.q24Prompt || (schema.id === 'policyholder' ? 'Customer Core Needs & Service Expectations' : (schema.id === 'patient' ? 'Patient Care Needs & Service Expectations' : 'In your busy insurance work, what are your most critical core needs/expectations?')));
        const cleanQ24Prompt = rawQ24Prompt.replace(/^Q\s*24\s*[:\.]?\s*/i, '').replace(/\s*\((Select up to \d+|最多選 \d+ 項)\)/gi, '').replace(/（(最多選 \d+ 項|Select up to \d+)）/g, '');
        const q24MaxSel = schema.q24MaxSelections || 5;
        const q24TypeLabel = isZh
            ? `（最多選 ${q24MaxSel} 項）`
            : ` (Select up to ${q24MaxSel})`;

        const rawQ25Prompt = isZh
            ? (schema.q25PromptZh || (schema.id === 'policyholder' 
                ? '請以一句話分享最能代表您的座右銘：'
                : (schema.id === 'patient'
                    ? '請以一句話分享最能代表您的座右銘：'
                    : '請以一句話分享最能代表您的座右銘。')))
            : (schema.q25Prompt || (schema.id === 'policyholder' 
                ? 'Could you share a single sentence that best represents your motto?'
                : (schema.id === 'patient'
                    ? 'Could you share a single sentence that best represents your motto?'
                    : 'Could you share a single sentence that best represents your motto?')));
        const cleanQ25Prompt = rawQ25Prompt.replace(/^Q\s*25\s*[:\.]?\s*/i, '');
        const q25Type = schema.q25Type || 'open';
        const q25TypeLabel = q25Type === 'single'
            ? (isZh ? '（單選）' : ' (Single Choice)')
            : (q25Type === 'multiple' ? (isZh ? '（複選）' : ' (Multiple Choice)') : '');

        const percentageCheckboxes = ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']
            .map(p => `<span>[ ] ${p}</span>`).join(' ');

        sectionsHtml += `
            <!-- PART: DAILY WORK CONTENT & NEEDS -->
            <div class="section-header">
                <span>${esc(displayWorkTitle)}</span>
                <span style="font-size: var(--fs-small); opacity: 0.9;">Q${startQ} ~ Q${endQ}</span>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qWorkItems}. ${esc(cleanQ20Prompt)}
                </label>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px 14px; margin: 10px 0 12px 0; font-size: var(--fs-body); color: #334155; line-height: 1.7;">
                    ${dailyItemsRendered}
                </div>
                <table class="table-matrix" style="width: 100%; margin: 10px auto;">
                    <thead>
                        <tr>
                            <th style="width: 25%; text-align: left;">${isZh ? '代碼' : 'Code'}</th>
                            <th style="text-align: left;">${isZh ? '比例選擇' : 'Percentage Range Selection'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px 12px;">[ _______ ]</td>
                            <td style="padding: 8px 12px; font-size: var(--fs-body);">${percentageCheckboxes}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">[ _______ ]</td>
                            <td style="padding: 8px 12px; font-size: var(--fs-body);">${percentageCheckboxes}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">[ _______ ]</td>
                            <td style="padding: 8px 12px; font-size: var(--fs-body);">${percentageCheckboxes}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">[ _______ ]</td>
                            <td style="padding: 8px 12px; font-size: var(--fs-body);">${percentageCheckboxes}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px;">[ _______ ]</td>
                            <td style="padding: 8px 12px; font-size: var(--fs-body);">${percentageCheckboxes}</td>
                        </tr>
                    </tbody>
                </table>
                <div style="font-size: var(--fs-body); color: #475569; margin-top: 10px;">
                    ${isZh ? '若選擇「j) 其他」，請說明工作項目：' : 'If selected “j) Other”, please specify work item:'} __________________________________________________
                </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qFriction}. ${esc(cleanQ21Prompt)}
                </label>
                <div style="border-bottom: 1px dashed #94a3b8; height: 26px; margin-top: 10px;"></div>
                <div style="border-bottom: 1px dashed #94a3b8; height: 26px; margin-top: 6px;"></div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qOfficialSys}. ${esc(cleanQ22Prompt)} ${esc(q22TypeLabel)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${officialSystems.filter(s => !s.toLowerCase().includes('other') && !s.includes('其他')).map(s => `<span>[ ] ${esc(s)}</span>`).join('')}
                    <span>[ ] ${isZh ? '其他正式系統（請說明）' : 'Other official system (please specify)'}: __________________________________________________</span>
                </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qPersonalTools}. ${esc(cleanQ23Prompt)} ${esc(q23TypeLabel)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${personalTools.filter(t => !t.toLowerCase().includes('other') && !t.includes('其他')).map(t => `<span>[ ] ${esc(t)}</span>`).join('')}
                    <span>[ ] ${isZh ? '其他個人工具（請說明）' : 'Other personal tool (please specify)'}: ___________________________________________</span>
                </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qNeeds}. ${esc(cleanQ24Prompt)} ${esc(q24TypeLabel)}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px 18px; font-size: var(--fs-body); margin-top: 8px;">
                    ${coreNeeds.filter(n => !n.toLowerCase().includes('other') && !n.includes('其他')).map(n => `<span>[ ] ${esc(n)}</span>`).join('')}
                    <span>[ ] ${isZh ? '其他（請說明）' : 'Other (please specify)'}: __________________________________________________</span>
                </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qMotto}. ${esc(cleanQ25Prompt)}${q25TypeLabel ? ' ' + esc(q25TypeLabel) : ''}
                </label>
                <div style="margin-top: 10px; font-size: var(--fs-body); color: #475569;">
                    ${isZh ? '回覆：' : 'Reply: '}__________________________________________________________________________________________
                </div>
            </div>
        `;
    }

    // 5. Journey Stages
    if (cfg.journey) {
        const partRoman = romanNums[partCounter] || String(partCounter + 1);
        const partZh = zhNums[partCounter] || String(partCounter + 1);
        partCounter++;

        const startQ = qCounter;
        const qFocus = qCounter++;
        const qStages = qCounter++;
        const endQ = qCounter - 1;

        const stageBlocks = stages.map((st, sIdx) => {
            const stepNum = sIdx + 1;
            const stTitle = isZh ? (st.titleZh || st.title) : st.title;
            const actionItems = isZh ? (st.actionsZh || st.actions || []) : (st.actions || []);
            const actDetailsList = isZh ? (st.actionDetailsZh || st.actionDetails || []) : (st.actionDetails || []);

            const actionsRendered = actionItems.map((act, aIdx) => {
                const letter = String.fromCharCode(65 + aIdx);
                const rawActText = typeof act === 'string'
                    ? act
                    : (isZh ? (act.nameZh || act.name || act.titleZh || act.title || '') : (act.name || act.nameZh || act.title || act.titleZh || ''));
                const cleanActName = String(rawActText || '')
                    .replace(/^Action\s+[A-Z]:\s*/i, '')
                    .replace(/^行動\s+[A-Z]：\s*/i, '');
                
                const d = (typeof act === 'object' && act !== null)
                    ? Object.assign({}, actDetailsList[aIdx] || {}, act)
                    : (actDetailsList[aIdx] || {});

                let locOptions = isZh ? (d.locationsZh || d.locations) : (d.locations);
                if (!locOptions || (Array.isArray(locOptions) && locOptions.length === 0)) {
                    if (stepNum === 1) {
                        locOptions = isZh
                            ? ['辦公室', '客戶所在的任何地點', '電話', '住家', '通勤途中', '社群或興趣團體', '其他']
                            : ['Office', 'Anywhere the client is', 'Phone', 'Home', 'Commuting', 'Community or interest groups', 'Other'];
                    } else {
                        locOptions = isZh
                            ? ['辦公室', '客戶所在的任何地點', '電話', '線上', '其他']
                            : ['Office', 'Anywhere the client is', 'Phone', 'Online', 'Other'];
                    }
                }

                let toolOptions = isZh ? (d.toolsZh || d.tools) : (d.tools);
                if (!toolOptions || (Array.isArray(toolOptions) && toolOptions.length === 0)) {
                    if (stepNum === 1) {
                        toolOptions = isZh
                            ? ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '客戶轉介', '孤兒保單', '其他']
                            : ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Client referral', 'Orphan policies', 'Other'];
                    } else {
                        toolOptions = isZh
                            ? ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '親朋好友', '資深主管', '行政助理', '同儕支援', '客戶轉介', '投保送件系統', '線上簽署系統', '其他']
                            : ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Peer support', 'Client referral', 'Insurance Submission System', 'Online Signing System', 'Other'];
                    }
                }

                let painOptions = isZh ? (d.painPointsZh || d.painPoints) : (d.painPoints);
                if (!painOptions || (Array.isArray(painOptions) && painOptions.length === 0)) {
                    painOptions = isZh
                        ? ['系統載入緩慢或超時', '重複登打資料', '缺乏行動端支援', '其他']
                        : ['System timeout / slow loading', 'Repetitive data entry', 'Lack of mobile support', 'Other'];
                }

                const renderOptionsWithOther = (opts) => {
                    let hasOther = false;
                    let list = [];
                    if (Array.isArray(opts)) {
                        list = opts.map(opt => safeText(opt)).filter(Boolean);
                    } else if (typeof opts === 'string') {
                        list = opts.split(/[,，;；\n\r]+/).map(s => s.trim()).filter(Boolean);
                    }
                    const items = list.map(optStr => {
                        const isOther = optStr.includes('其他') || optStr.toLowerCase().includes('other');
                        if (isOther) {
                            hasOther = true;
                            return `<span>[ ] ${esc(optStr)}: _________________</span>`;
                        }
                        return `<span>[ ] ${esc(optStr)}</span>`;
                    });
                    if (!hasOther) {
                        items.push(`<span>[ ] ${isZh ? '其他' : 'Other'}: _________________</span>`);
                    }
                    return items.join('');
                };

                let contextOptions = isZh ? (d.additionalContextZh || d.additionalContext) : (d.additionalContext);
                if (!contextOptions || (Array.isArray(contextOptions) && contextOptions.length === 0)) {
                    if (stepNum === 1 && aIdx === 2) {
                        contextOptions = isZh
                            ? ['續保機率高', '已建立信任基礎', '佣金制度獎勵', '開發新客成本高', '其他']
                            : ['High renewal probability', 'Trust already established', 'Commission structure incentives', 'High cost of acquiring new clients', 'Other'];
                    } else {
                        contextOptions = isZh
                            ? ['優先處理特定客戶考量', '跨單位協同作業', '緊急案件優先', '其他']
                            : ['Primary consideration for prioritising specific clients', 'Cross-unit coordination', 'Urgent case priority', 'Other'];
                    }
                }

                return `
                    <div style="margin-top: 12px; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; page-break-inside: avoid;">
                        <strong style="display: block; font-size: var(--fs-subtitle); color: #0f172a; margin-bottom: 8px;">${letter}. ${isZh ? '行動' : 'Action'}: ${esc(cleanActName)}</strong>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: var(--fs-body); font-weight: 600; color: #475569;">a) ${isZh ? '執行時的實體／數位地點：' : 'Physical/Digital location when executing:'}</span>
                            <div style="font-size: var(--fs-body); color: #334155; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px 16px;">
                                ${renderOptionsWithOther(locOptions)}
                            </div>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: var(--fs-body); font-weight: 600; color: #475569;">b) ${isZh ? '協助完成此行動的工具或對象：' : 'Tools or people helping you complete this action:'}</span>
                            <div style="font-size: var(--fs-body); color: #334155; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px 16px;">
                                ${renderOptionsWithOther(toolOptions)}
                            </div>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: var(--fs-body); font-weight: 600; color: #475569;">c) ${isZh ? '此行動中遭遇的痛點：' : 'Pain points encountered in this action:'}</span>
                            <div style="font-size: var(--fs-body); color: #334155; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px 16px;">
                                ${renderOptionsWithOther(painOptions)}
                            </div>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <span style="font-size: var(--fs-body); font-weight: 600; color: #475569;">d) ${isZh ? '補充考量：' : 'Additional context:'}</span>
                            <div style="font-size: var(--fs-body); color: #334155; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px 16px;">
                                ${renderOptionsWithOther(contextOptions)}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            const ratingLetter = String.fromCharCode(65 + actionItems.length);
            return `
                <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 20px; margin-bottom: 18px; page-break-inside: avoid;">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="background: #1e293b; color: #ffffff; font-size: var(--fs-small); font-weight: 700; padding: 3px 10px; border-radius: 4px;">${isZh ? `階段 ${stepNum}` : `Stage ${stepNum}`}</span>
                            <strong style="font-size: var(--fs-title); color: #0f172a;">${esc(String(stTitle).replace(/^\s*(Stage|階段)\s*\d+\s*[:：.\-–]?\s*/i, '') || stTitle)}</strong>
                        </div>
                        <span style="font-size: var(--fs-small); color: #64748b;">${isZh ? '完成此階段通常依序執行的行動（最多3項）：' : 'To complete this stage, the sequential actions you typically perform are (up to 3):'}</span>
                    </div>
                    ${actionsRendered}
                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
                        <span style="font-size: var(--fs-subtitle); font-weight: 700; color: #1e293b;">${ratingLetter}. ${isZh ? '請為此階段的情緒體驗評分：' : 'Please rate your emotional experience for this stage:'}</span>
                        <div style="display: flex; gap: 18px; font-size: var(--fs-body); color: #1e293b; margin-top: 6px;">
                            <span>[ ] 1😫</span>
                            <span>[ ] 2 😮‍💨</span>
                            <span>[ ] 3 😐</span>
                            <span>[ ] 4 🙂</span>
                            <span>[ ] 5 🤩</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const userJourneyTitle = isZh
            ? (secTitles.journeyZh || secTitles.journey)
            : (secTitles.journey || 'Journey Map');
        const displayJourneyTitle = userJourneyTitle
            ? (userJourneyTitle.includes('Part') || userJourneyTitle.includes('部分') ? userJourneyTitle : (isZh ? `第${partZh}部分：${userJourneyTitle}` : `Part ${partRoman}: ${userJourneyTitle}`))
            : (isZh ? `第${partZh}部分：歷程地圖` : `Part ${partRoman}: Journey Map`);

        sectionsHtml += `
            <!-- PART: JOURNEY STAGES -->
            <div class="section-header">
                <span>${esc(displayJourneyTitle)}</span>
                <span style="font-size: var(--fs-small); opacity: 0.9;">Q${startQ} ~ Q${endQ}</span>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; page-break-inside: avoid;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); line-height: 1.5;">
                    ${qFocus}. ${qMap['Q26'] ? (isZh ? qMap['Q26'].promptZh : qMap['Q26'].prompt) : (isZh ? '請問您目前的工作歷程重心為何？' : 'Which journey is your primary focus at present?')}
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 14px 24px; font-size: var(--fs-body); margin-top: 8px;">
                    ${((qMap['Q26'] && (isZh ? qMap['Q26'].optionsZh : qMap['Q26'].options)) || (isZh
                        ? ['個人保單銷售歷程 (Individual Policy Sales Journey)', '組織發展與團隊經營歷程 (Organisational Growth & Team Journey)']
                        : ['Individual Policy Sales Journey', 'Organisational Growth & Team Journey']
                    )).map(opt => `<span>[ ] ${esc(opt)}</span>`).join('')}
                </div>
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-subtitle); margin-bottom: 6px; line-height: 1.5;">
                    ${qStages}. ${qMap['Q27'] ? (isZh ? qMap['Q27'].promptZh : qMap['Q27'].prompt) : (isZh ? `階段歷程接觸點深度盤點（階段 1 至 階段 ${stages.length}）：` : `Stage Journey Touchpoint Deep-Dive (Stages 1 to ${stages.length}):`)}
                </label>
                <div style="font-size: var(--fs-body); color: #475569; margin: 0 0 10px 0; font-weight: 500;">
                    ${isZh ? '以下列出業務員六大核心任務。請依據您的實際作業經驗填寫下列項目組：' : 'Six core agent tasks are listed below. Please fill out the following item sets based on your actual operational experience.'}
                </div>
                ${stageBlocks}
            </div>
        `;
    }

    if (partCounter === 0) {
        sectionsHtml = `<div style="padding: 30px; text-align: center; color: #64748b; font-size: var(--fs-body); background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; margin: 20px 0;">
            ${isZh ? '尚未勾選任何問卷區塊。請於架構設計工具中勾選欲納入的問卷區塊。' : 'No sections selected for this questionnaire. Please enable at least one section in the Schema Designer.'}
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="${isZh ? 'zh-TW' : 'en'}">
<head>
    <meta charset="utf-8">
    <title>${esc(title)}</title>
    <style>
        :root {
            --fs-display: 30px;
            --fs-heading: 24px;
            --fs-title: 20px;
            --fs-subtitle: 17px;
            --fs-body: 15px;
            --fs-small: 14px;
            --fs-caption: 13px;
        }
        @page {
            size: A4 portrait;
            margin: 12mm 14mm 12mm 14mm;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Microsoft JhengHei", Arial, sans-serif;
            color: #1e293b;
            background: #f1f5f9;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            font-size: var(--fs-body);
        }
        .print-toolbar {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: #0f172a;
            color: #ffffff;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
        }
        .btn-tb {
            background: #2563eb;
            color: #ffffff;
            border: none;
            padding: 7px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
        }
        .btn-tb:hover { background: #1d4ed8; }
        .btn-tb-secondary {
            background: rgba(255,255,255,0.12);
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.25);
        }
        .btn-tb-secondary:hover { background: rgba(255,255,255,0.22); }
        .paper-container {
            max-width: 900px;
            margin: 24px auto;
            background: #ffffff;
            padding: 40px 48px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border-radius: 8px;
        }
        h1 {
            font-size: var(--fs-heading);
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 14px 0;
            line-height: 1.35;
            text-align: center;
        }
        .section-header {
            background: #1e293b;
            color: #ffffff;
            padding: 10px 16px;
            border-radius: 6px;
            font-weight: 700;
            font-size: var(--fs-title);
            margin: 28px 0 14px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            page-break-after: avoid;
        }
        .table-matrix {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: var(--fs-body);
        }
        .table-matrix th {
            background: #f1f5f9;
            color: #334155;
            padding: 9px 12px;
            border: 1px solid #cbd5e1;
            font-weight: 700;
            font-size: var(--fs-body);
        }
        .table-matrix td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            font-size: var(--fs-body);
        }
        @media print {
            .print-toolbar { display: none !important; }
            body { background: #ffffff !important; }
            .paper-container {
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="print-toolbar">
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; font-size: 15px;">📋 ${isZh ? '問卷預覽與列印' : 'Questionnaire Preview & Export'}</span>
            <span style="font-size: var(--fs-small); color: #94a3b8;">${isZh ? '依據目前自訂架構動態生成（完全符合 V.1 原檔規格）' : 'Generated dynamically from active schema (Faithfully aligns with V.1)'}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn-tb" onclick="window.print()">
                <span>🖨️</span>
                <span>${isZh ? '列印 / 另存為 PDF' : 'Print / Save as PDF'}</span>
            </button>
            <button type="button" class="btn-tb btn-tb-secondary" onclick="window.close()">
                <span>✕</span>
                <span>${isZh ? '關閉視窗' : 'Close'}</span>
            </button>
        </div>
    </div>

    <div class="paper-container">
        <h1>${esc(title)}</h1>

        <!-- Briefing Instructions Box -->
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; border: 1px solid #e2e8f0; border-left-width: 4px; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px; font-size: var(--fs-body); color: #334155; line-height: 1.6;">
            ${esc(introText)}
        </div>

        <!-- Respondent Header Info -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px dashed #cbd5e1; padding: 10px 16px; border-radius: 6px; margin-bottom: 20px; font-size: var(--fs-body); color: #475569;">
            <span>${isZh ? '姓名' : 'Name'}: ______________________</span>
            <span>${isZh ? '業務員編號' : 'Agent Code'}: ______________________</span>
            <span>${isZh ? '所屬通訊處' : 'Branch / Office'}: ______________________</span>
            <span>${isZh ? '填寫日期' : 'Date'}: 202___ / ___ / ___</span>
        </div>

        ${sectionsHtml}

        <!-- Sign-off / Footer -->
        <div style="text-align: center; color: #64748b; font-size: var(--fs-body); border-top: 2px solid #e2e8f0; padding-top: 18px; margin-top: 24px;">
            <strong>${isZh ? '—— 問卷到此結束。再次感謝您的寶貴時間與協助！ ——' : '—— End of Questionnaire. Thank you once again for your cooperation and assistance! ——'}</strong>
            <div style="margin-top: 8px; font-size: var(--fs-small); color: #94a3b8;">
                ${esc(title)} &bull; ${isZh ? '數位化架構問卷' : 'Digital Modular Architecture Questionnaire'}
            </div>
        </div>
    </div>
</body>
</html>`;
};
