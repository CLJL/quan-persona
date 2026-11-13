/* quan-persona - CSV Ingestion, Header Auto-Matching & Column Guide Module */
// Handles CSV parsing (with lazy PapaParse loading), validation dialogue, and data ingestion

        // ==================== CSV UPLOAD & MATCHING LOADING SCREEN ====================
        function showCsvLoading(customTitle, customMessage) {
            const overlay = document.getElementById('csv-loading-overlay');
            if (!overlay) return;
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const titleEl = document.getElementById('csv-loading-title');
            const msgEl = document.getElementById('csv-loading-message');

            if (titleEl) {
                titleEl.textContent = customTitle || (isZh ? '正在解析與比對 CSV 數據...' : 'Processing & Matching CSV Data...');
            }
            if (msgEl) {
                msgEl.textContent = customMessage || (isZh ? '正在讀取 CSV 檔案並比對架構維度...' : 'Reading CSV file and matching columns against active schema dimensions...');
            }

            overlay.style.display = 'flex';
            void overlay.offsetWidth; // Force CSS reflow to ensure transition runs
            overlay.style.opacity = '1';
        }

        function updateCsvLoading(message) {
            const msgEl = document.getElementById('csv-loading-message');
            if (msgEl && message) {
                msgEl.textContent = message;
            }
        }

        function hideCsvLoading() {
            const overlay = document.getElementById('csv-loading-overlay');
            if (!overlay) return;
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay && overlay.style.opacity === '0') {
                    overlay.style.display = 'none';
                }
            }, 260);
        }

        window.showCsvLoading = showCsvLoading;
        window.updateCsvLoading = updateCsvLoading;
        window.hideCsvLoading = hideCsvLoading;

        // ==================== CSV MATCH REVIEW DIALOGUE FUNCTIONS ====================
        function showMappingReviewDialog(matchPct) {
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const overlay = document.getElementById('mapping-review-dialog-overlay');
            const badge = document.getElementById('mapping-dialog-rate-badge');
            const title = document.getElementById('mapping-dialog-title');
            const desc = document.getElementById('mapping-dialog-desc');
            const btnClose = document.getElementById('btn-mapping-dialog-close');
            const btnReview = document.getElementById('btn-mapping-dialog-review');

            if (badge) {
                badge.innerHTML = isZh ? `⚠️ 相符率：${matchPct}%` : `⚠️ Match Rate: ${matchPct}%`;
            }
            if (title) {
                title.innerText = isZh ? '欄位需進行核對與對應' : 'Column Review Required';
            }
            if (desc) {
                desc.innerText = isZh
                    ? '上傳的 CSV 欄位與當前架構維度未達 100% 完全相符。請點擊「Review」開啟欄位對應視窗，或點擊「Close」返回預設數據儀表板。'
                    : 'The uploaded CSV does not fully match all active schema dimensions. Please review column mappings or close to return to the default dashboard.';
            }
            if (btnClose) {
                btnClose.innerText = 'Close';
            }
            if (btnReview) {
                btnReview.innerText = 'Review';
            }

            if (overlay) {
                overlay.style.display = 'flex';
                void overlay.offsetWidth;
                overlay.style.opacity = '1';
            }
        }

        function hideMappingReviewDialog() {
            const overlay = document.getElementById('mapping-review-dialog-overlay');
            if (!overlay) return;
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay && overlay.style.opacity === '0') {
                    overlay.style.display = 'none';
                }
            }, 250);
        }

        function closeMappingDialogAndReset() {
            hideMappingReviewDialog();
            window.userUploadedCustomFile = false;
            window.__pendingCsvFile = null;
            if (typeof restoreOriginalDataset === 'function') {
                restoreOriginalDataset();
            } else if (typeof resetCurrentSchemaToDefault === 'function') {
                resetCurrentSchemaToDefault('agent');
            }
            setTimeout(() => {
                if (typeof dismissPlatformNotification === 'function') {
                    dismissPlatformNotification();
                }
            }, 60);
        }

        function openMappingDialogReview() {
            hideMappingReviewDialog();
            if (typeof openCsvMappingModalDirect === 'function') {
                openCsvMappingModalDirect();
            }
        }

        window.showMappingReviewDialog = showMappingReviewDialog;
        window.hideMappingReviewDialog = hideMappingReviewDialog;
        window.closeMappingDialogAndReset = closeMappingDialogAndReset;
        window.openMappingDialogReview = openMappingDialogReview;


        // Setup Drag & Drop listeners
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    dropZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    dropZone.classList.remove('dragover');
                }, false);
            });

            dropZone.addEventListener('drop', e => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if(files.length > 0) {
                    showCsvLoading();
                    setTimeout(() => {
                        processCSV(files[0]);
                    }, 40);
                }
            });
        }

        function handleFileSelect(event) {
            const inputEl = event.target;
            const file = (inputEl && inputEl.files) ? inputEl.files[0] : null;
            if (file) {
                showCsvLoading();
                setTimeout(() => {
                    processCSV(file);
                }, 40);
            }
            // Delay clearing input value so async FileReader has time to read the File handle
            setTimeout(() => {
                if (inputEl) inputEl.value = '';
            }, 1000);
        }

        // ==================== CSV HEADER MAPPING & INGESTION SYSTEM ====================

        function getSchemaTargetFields(schema) {
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const fields = [];
            
            // 1. Identity
            fields.push({
                key: 'respondent_id',
                questionNo: 'ID',
                category: 'identity',
                categoryLabel: isZh ? '識別代碼' : 'Identity',
                label: isZh ? '受訪者編號 / 姓名' : 'Respondent ID / Name',
                typeLabel: isZh ? '必填' : 'Required',
                required: true,
                aliases: ['AgentName', '受訪者編號', 'Name', 'RespondentID', 'respondent_id', 'respondent_id_受訪者編號', 'Respondent_ID', 'respondentId', 'id', 'ID', '編號']
            });

            fields.push({
                key: 'persona_archetype',
                questionNo: 'Type',
                category: 'identity',
                categoryLabel: isZh ? '識別代碼' : 'Identity',
                label: isZh ? '基準客群類型（選填）' : 'Research Persona Archetype (Optional)',
                typeLabel: isZh ? '選填' : 'Optional',
                required: false,
                aliases: ['persona_archetype', 'persona_archetype_人物誌類型', 'researchArchetype', 'ResearchArchetype', 'archetype', '客群類型']
            });

            // 2. Demographics
            const demographics = (schema && schema.demographics) ? schema.demographics : [
                { key: 'Age', label: 'Age', labelZh: '年齡區間' },
                { key: 'Service_Location', label: 'Service Location', labelZh: '服務區域' },
                { key: 'Branch_Office', label: 'Branch Office', labelZh: '通訊處' },
                { key: 'Position', label: 'Position', labelZh: '職級' },
                { key: 'Experience', label: 'Experience', labelZh: '銷售年資' },
                { key: 'Clients', label: 'Clients', labelZh: '服務客戶數' }
            ];

            const standardDemoAliases = {
                Age: ['Age', 'Age_Range', 'AgeRange', 'Q1_AgeRange', 'Age區間', 'Q1_Age區間', 'Q1_Age', '對應問卷第1題', 'Q1_age_range', 'Q1_年齡區間', '年齡'],
                Service_Location: ['Service_Location', 'ServiceRegion', 'Q2_ServiceRegion', 'Q2_service地區', 'service地區', '對應問卷第2題', 'Q2_region', 'Q2_服務區域', '地區', '區域'],
                Branch_Office: ['Branch_Office', 'BranchOffice', 'Q3_BranchOffice', 'Q3_Office Branch', 'Office Branch', '對應問卷第3題', 'Q3_branch', 'Q3_通訊處（分處）', '通訊處', '單位'],
                Position: ['Position', 'Q4_Position', 'Title', '職稱', 'Title／職稱', 'Q4_Title職稱', '對應問卷第4題', 'Q4_job_rank', 'Q4_職級', 'Q4_policy_type', 'PolicyType', 'Policy_Type'],
                Experience: ['Experience', 'Experience_Range', 'ExperienceRange', 'Q5_YearsExperience', 'Tenure', 'Tenure區間', 'Q5_Tenure區間', 'Q5_Tenure', '對應問卷第5題', '保險sales經驗', 'Q5_years_experience', 'Q5_保險銷售年資', 'Q5_customer_tenure', 'CustomerTenure', '年資'],
                Clients: ['Clients', 'Scale_Customers', 'Scale of Customers', 'ScaleofCustomers', 'Q6_CustomersServed', 'client規模', 'Q6_client數量區間', 'Q6_client規模', 'client數量', '對應問卷第6題', 'Q6_customers_served', 'Q6_累計服務客戶數', 'Q6_household_structure', 'HouseholdStructure', '客戶數'],
                PerformanceRank: ['PerformanceRank', 'Performance_Rank', 'pr', 'PR', 'sales_rank', 'Q7_PerformanceRank', 'Q7_performance_rank', 'Q7_業績表現排名', 'Q7_業績排名', 'Performance', '業績表現', '業績排名', '對應問卷第7題']
            };

            demographics.forEach((d, idx) => {
                const cleanKey = d.key ? d.key.replace(/^Demo_\d+_/, '') : `Demo_${idx + 1}`;
                const qNum = d.sourceQuestion || d.questionNo || `Q${idx + 1}`;
                const aliases = [d.key, cleanKey, d.label, d.labelZh, qNum, `${qNum}_${cleanKey}`];
                if (standardDemoAliases[cleanKey]) {
                    aliases.push(...standardDemoAliases[cleanKey]);
                }
                fields.push({
                    key: 'demo_' + cleanKey,
                    questionNo: qNum,
                    cleanKey: cleanKey,
                    category: 'demographic',
                    categoryLabel: isZh ? '人口統計學' : 'Demographics',
                    label: isZh ? (d.labelZh || d.label) : d.label,
                    typeLabel: isZh ? '統計維度' : 'Demographic',
                    required: false,
                    aliases: aliases
                });
            });

            // 3. Metrics (Dimensions)
            const metrics = (schema && schema.metrics) ? schema.metrics : [];
            metrics.forEach((m, idx) => {
                const mKey = m.key || `Skill_Dim_${idx + 1}`;
                const qNum = m.sourceQuestion || m.questionNo || (mKey === 'Skill_Device' ? 'Q11' : (mKey === 'Skill_Digital_Tools' ? 'Q14' : (mKey === 'Skill_Knowledge' || mKey === 'Skill_Sales_Pitch' || mKey === 'Skill_Customer_Relations' ? 'Q15' : `Dim ${idx + 1}`)));
                const aliases = [
                    mKey,
                    `Skill_Dim_${idx + 1}`,
                    `Dim_${idx + 1}`,
                    m.label,
                    m.labelZh,
                    m.label ? m.label.replace(/\s+/g, '_') : '',
                    m.labelZh ? m.labelZh.replace(/\s+/g, '_') : ''
                ];
                {
                    const qn = String(qNum).replace(/\D/g, '');
                    const sameBefore = metrics.slice(0, idx).filter(x => String(x.sourceQuestion || x.questionNo || '').replace(/\D/g, '') === qn).length;
                    if (qn === '11') aliases.unshift('Q11_familiarity_pct');
                    else if (qn) aliases.unshift(`Q${qn}_item_${sameBefore + 1}_1to5`);
                    if (mKey === 'Skill_Speed_Reliability') aliases.push('Q11_speed_reliability_impact_1to5');
                    if (mKey === 'Skill_Mobile_Experience') aliases.push('Q11_mobile_experience_impact_1to5');
                    if (mKey === 'Skill_Customer_Service') aliases.push('Q12_customer_service_impact_1to5');
                }
                if (mKey === 'Skill_Device') {
                    aliases.push('SkillDevice', 'Device_Familiarity', 'Q8_SystemFamiliarity', 'Q7_tool熟稔度(%)', 'Q7_裝置system熟稔度(%)', 'Q8_tool_familiarity_pct', 'Q8_工具熟悉度（%）', 'Skill_Product_Familiarity', 'Product_Familiarity');
                } else if (mKey === 'Skill_Knowledge') {
                    aliases.push('SkillKnowledge', 'Q12_InsuranceKnowledge', 'Q8_保險knowledge影響(%)', 'Q12_insurance_knowledge_impact_1to5', 'Q12_保險知識影響（1–5）', 'Skill_Digital_Self_Service', 'Digital_Self_Service');
                } else if (mKey === 'Skill_Sales_Pitch') {
                    aliases.push('SkillSalesPitch', 'Q12_SalesPitchCommunication', 'Q8_salespitch影響(%)', 'Q12_sales_pitch_impact_1to5', 'Q12_銷售話術與溝通影響（1–5）', 'Skill_Financial_Confidence', 'Financial_Confidence');
                } else if (mKey === 'Skill_Customer_Relations') {
                    aliases.push('SkillCustomerRelations', 'Q12_CustomerRelationshipManagement', 'Q8_clientrelationship影響(%)', 'Q12_crm_impact_1to5', 'Q12_客戶關係管理影響（1–5）', 'Skill_Brand_Trust', 'Brand_Trust');
                } else if (mKey === 'Skill_Digital_Tools') {
                    aliases.push('SkillDigitalTools', 'Q8_digitaltool熟悉度(%)', 'Q11_digital_tool_familiarity_impact_1to5', 'Q11_數位工具熟悉度影響（1–5）', 'Q11_digital_tool_usage_impact_1to5', 'Skill_Service_Satisfaction', 'Service_Satisfaction');
                }

                fields.push({
                    key: 'metric_' + mKey,
                    questionNo: qNum,
                    mKey: mKey,
                    category: 'metric',
                    categoryLabel: isZh ? '核心衡量指標' : 'Metrics / Skills',
                    label: `${isZh ? (m.labelZh || m.label) : m.label} (${m.scaleType || '0-100'})`,
                    typeLabel: isZh ? '分群維度' : 'Clustering Metric',
                    scaleType: m.scaleType || '0-100',
                    required: true,
                    aliases: aliases
                });
            });

            // 4. Journey Stages
            const stages = (schema && schema.stages) ? schema.stages : [];
            stages.forEach((st, idx) => {
                const step = idx + 1;
                const stKey = st.key || `Stage_${step}`;
                const stTitle = isZh ? (st.titleZh || st.title) : st.title;
                const stageQ = `Q27.${step}`;

                fields.push({
                    key: `stage_${step}_rating`,
                    questionNo: `${stageQ}a`,
                    step: step,
                    category: 'journey',
                    categoryLabel: isZh ? '旅程階段評分' : 'Journey Stages',
                    label: `${step}. ${stTitle} - ${isZh ? '滿意度／情緒評分' : 'Emotional Rating (1-5)'}`,
                    typeLabel: isZh ? '分群維度' : 'Rating (1-5)',
                    required: true,
                    aliases: [
                        `Q27_S${step}_rating_1to5`,
                        `Task${step}_${stKey}_emotional_rating_1to5`,
                        `Task${step}_${stKey}_滿意度`,
                        `Task${step}_Rating`,
                        `Task_${step}_Rating`,
                        `Journey_${step}_Rating`,
                        `Stage_${step}_Rating`,
                        `task${step}_emotion`,
                        `Task${step}_emotion`,
                        `task_${step}_emotion`,
                        `Task_${step}_emotion`,
                        `Task${step}_D_Emotion`,
                        `Task${step}_C_Emotion`,
                        `Task${step}_Emotion`
                    ]
                });

                fields.push({
                    key: `stage_${step}_pain`,
                    questionNo: `${stageQ}b`,
                    step: step,
                    category: 'journey',
                    categoryLabel: isZh ? '旅程階段評分' : 'Journey Stages',
                    label: `${step}. ${stTitle} - ${isZh ? '痛點與瓶頸' : 'Pain Points & Barriers'}`,
                    typeLabel: isZh ? '質化內容' : 'Qualitative',
                    required: false,
                    aliases: [
                        `Q27_S${step}_pain`,
                        `Journey_${step}_Pains`,
                        `Journey_${step}_Pain`,
                        `Journey_${step}_PainPoints`,
                        `Journey_${step}_Pain_Points`,
                        `Stage_${step}_Pains`,
                        `Stage_${step}_Pain`,
                        `Task${step}_Pains`,
                        `Task_${step}_Pains`,
                        `Task${step}_${stKey}_pain_point`,
                        `Task${step}_${stKey}_痛點`,
                        `Task${step}_pain_point`,
                        `Task${step}_pain`,
                        `Task${step}_A_PainPoint`
                    ]
                });

                fields.push({
                    key: `stage_${step}_location`,
                    questionNo: `${stageQ}c`,
                    step: step,
                    category: 'journey',
                    categoryLabel: isZh ? '旅程階段評分' : 'Journey Stages',
                    label: `${step}. ${stTitle} - ${isZh ? '執行地點' : 'Location / Context'}`,
                    typeLabel: isZh ? '質化內容' : 'Qualitative',
                    required: false,
                    aliases: [
                        `Q27_S${step}_location`,
                        `Journey_${step}_Locations`,
                        `Journey_${step}_Location`,
                        `Stage_${step}_Locations`,
                        `Stage_${step}_Location`,
                        `Task${step}_Locations`,
                        `Task_${step}_Locations`,
                        `Task${step}_${stKey}_location`,
                        `Task${step}_${stKey}_執行地點`,
                        `Task${step}_A_Location`
                    ]
                });

                fields.push({
                    key: `stage_${step}_tools`,
                    questionNo: `${stageQ}d`,
                    step: step,
                    category: 'journey',
                    categoryLabel: isZh ? '旅程階段評分' : 'Journey Stages',
                    label: `${step}. ${stTitle} - ${isZh ? '接觸點與協助工具' : 'Touchpoints & Tools'}`,
                    typeLabel: isZh ? '質化內容' : 'Qualitative',
                    required: false,
                    aliases: [
                        `Q27_S${step}_tools_or_people`,
                        `Journey_${step}_Tools`,
                        `Journey_${step}_Tool`,
                        `Stage_${step}_Tools`,
                        `Stage_${step}_Tool`,
                        `Task${step}_Tools`,
                        `Task_${step}_Tools`,
                        `Task${step}_${stKey}_tools_or_people`,
                        `Task${step}_${stKey}_協助工具或人員`,
                        `Task${step}_A_ToolsPeople`
                    ]
                });
            });

            // 5. Qualitative & Behavioural
            fields.push({
                key: 'conflict',
                questionNo: 'Q21',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '核心矛盾與落差說明 (Q21)' : 'Core Conflicts / Gaps (Q21)',
                typeLabel: isZh ? '文字分析' : 'Free Text',
                required: false,
                aliases: ['Conflict', 'Barriers', 'Contradictions', 'Q21_GapDescription', 'Q9_落差矛盾說明', 'Q13_Core Conflicts障礙', 'Core Conflicts', '矛盾', '障礙', 'Q21_gap_or_contradiction', 'Q21_目標與實際的落差或矛盾']
            });

            fields.push({
                key: 'role_reasons',
                questionNo: 'Role A',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '使用接觸點的原因（計入 TU）' : 'Reasons for using touchpoints (feeds TU)',
                typeLabel: isZh ? '複選標籤' : 'Multi-Select',
                required: false,
                aliases: ['Q13_personal_tool_reasons', 'Q13_使用個人工具的原因', 'Q13_ReasonsPersonalTools', 'Q16_ReasonsPersonalTools', 'Q16_reasons', 'Reasons_For_Workarounds', 'Workaround_Reasons', 'WorkaroundReasons']
            });

            fields.push({
                key: 'role_methods',
                questionNo: 'Role B',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '主要重複性工作使用的接觸點（計入 TU）' : 'Touchpoints for the main recurring task (feeds TU)',
                typeLabel: isZh ? '單選／複選標籤' : 'Single / Multi-Select',
                required: false,
                aliases: ['Q14_scheduling_methods', 'Q14_行程規劃方式', 'Q14_CalendarMethod', 'Q17_Methods', 'Q17_methods', 'Main_Task_Method', 'MainTaskMethod']
            });

            fields.push({
                key: 'personal_tools',
                questionNo: 'Q23',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '常用個人工具／替代做法 (Q23)' : 'Personal Tools & Workarounds (Q23)',
                typeLabel: isZh ? '複選標籤' : 'Multi-Select',
                required: false,
                aliases: ['PersonalTools', 'Personalised_Tools', 'Personalised Tools', 'Q23_PersonalTools', 'Common Tools', '個人化工具', 'Q23_personal_tools_used', 'Q23_常用個人工具／替代做法']
            });

            fields.push({
                key: 'needs',
                questionNo: 'Q24',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '關鍵核心期望需求 (Q24)' : 'Critical Core Needs (Q24)',
                typeLabel: isZh ? '複選標籤' : 'Multi-Select',
                required: false,
                aliases: ['Needs', 'Core_Needs', 'Core Needs', 'Q24_CoreNeeds', 'Core Needs', '需求', 'Q24_core_needs', 'Q24_核心需求']
            });

            fields.push({
                key: 'quote',
                questionNo: 'Q25',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '代表性一句話／座右銘 (Q25)' : 'Verbatim Motto / Quote (Q25)',
                typeLabel: isZh ? '文字引言' : 'Quote',
                required: false,
                aliases: ['Quote', 'Quote_Text', 'Verbatim', 'Q25_Motto', 'Q12_代表性一句話', 'Q16_原聲引述', '感受', '原聲引述', 'Q25_motto', 'Q25_座右銘']
            });

            fields.push({
                key: 'role_badges',
                questionNo: 'Q8-10',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '自我形象標籤 (Q8-Q10)' : 'Self-Image / Archetype Tags (Q8-Q10)',
                typeLabel: isZh ? '標籤組' : 'Tags',
                required: false,
                aliases: ['Role_Badges', 'RoleBadges', 'Badges', '自我形象標籤', 'Q17_Tag1', 'Q17_self_tag_1', 'Q17_自我標籤1', 'Q8_Tag1', 'Q8_自我標籤1']
            });

            fields.push({
                key: 'tasks_text',
                questionNo: 'Q20',
                category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? '日常工作時間比例分配 (Q20)' : 'Daily Task Allocation (Q20)',
                typeLabel: isZh ? '比例結構' : 'Allocation Ratio',
                required: false,
                aliases: ['Tasks_Text', 'Daily_Tasks', 'Daily Tasks', '日常工作', 'Daily Work Content', 'Q20_work_item_allocation', 'Q20_工作項目時間分配（代碼:百分比）']
            });

            // 6. Questions that have their own dashboard slot (feeling, tool impact, follow-up, willingness, official systems, journey focus, tags 2/3)
            const newQ = [
                { key: 'role_badges_2', en: 'Self-Image Tag 2', zh: '自我形象標籤 2', type: 'Single', typeZh: '單選標籤' },
                { key: 'role_badges_3', en: 'Self-Image Tag 3', zh: '自我形象標籤 3', type: 'Single', typeZh: '單選標籤' },
                { key: 'feeling', en: 'Overall Feeling (feeds SUP)', zh: '整體感受 (納入 SUP)', type: 'Rating (1-5)', typeZh: '評分 (1-5)' },
                { key: 'tool_impact', en: 'Impact of Provided Tools on Efficiency (feeds SUP)', zh: '現有工具對效率的影響 (納入 SUP)', type: 'Single-Select', typeZh: '單選' },
                { key: 'followup', en: 'Follow-up Reason (paper / manual option)', zh: '後續原因（紙本／人工方式）', type: 'Single-Select', typeZh: '單選' },
                { key: 'willingness', en: 'Willingness to Use Proactive Suggestions', zh: '使用主動建議的意願', type: 'Single-Select', typeZh: '單選' },
                { key: 'official', en: 'Official Systems / Channels Used', zh: '常用官方系統／管道', type: 'Multi-Select', typeZh: '複選標籤' },
                { key: 'journey_focus', en: 'Journey Focus', zh: '主要專注的歷程', type: 'Single-Select', typeZh: '單選' }
            ];
            newQ.forEach(n => fields.push({
                key: n.key, questionNo: '', category: 'qualitative',
                categoryLabel: isZh ? '質化與標籤' : 'Qualitative / Tags',
                label: isZh ? n.zh : n.en, typeLabel: isZh ? n.typeZh : n.type, required: false, aliases: []
            }));
            const reg = (typeof QUESTION_REGISTRY !== 'undefined') ? QUESTION_REGISTRY : [];
            fields.forEach(f => {
                const r = reg.find(x => x.key === f.key);
                if (!r) return;
                f.aliases = [r.header, ...(r.legacy || []), ...(f.aliases || [])];
                f.questionNo = 'Q' + r.no;
                f.label = f.label.replace(/\s*[(（]Q\d+(-Q\d+)?[)）]\s*$/, '');
            });
            fields.forEach(f => {
                if (f.key === 'role_badges') { f.label = isZh ? '自我形象標籤 1' : 'Self-Image Tag 1'; }
            });
            return fields;
        }

        function findBestMatchingCsvHeader(targetField, csvHeaders) {
            if (!csvHeaders || csvHeaders.length === 0) return '';
            
            // 1. Exact match (case-insensitive & trimmed)
            for (const alias of (targetField.aliases || [])) {
                const cleanAlias = alias.trim().toLowerCase();
                for (const h of csvHeaders) {
                    const cleanH = h.replace(/^﻿/, '').trim().toLowerCase();
                    if (cleanH === cleanAlias) {
                        return h;
                    }
                }
            }
            
            // 2. Starts with / includes match
            for (const alias of (targetField.aliases || [])) {
                const cleanAlias = alias.trim().toLowerCase();
                if (cleanAlias.length < 3) continue;
                for (const h of csvHeaders) {
                    const cleanH = h.replace(/^﻿/, '').trim().toLowerCase();
                    if (cleanH.startsWith(cleanAlias) || cleanH.includes(cleanAlias)) {
                        return h;
                    }
                }
            }
            
            return '';
        }

        function openCsvMappingModalDirect() {
            if (typeof dismissPlatformNotification === 'function') {
                dismissPlatformNotification();
            }

            const modal = document.getElementById('csv-mapping-modal');
            if (!modal) return;

            // 1. If we have a pending CSV file from upload
            if (window.__pendingCsvFile && window.__pendingCsvFile.data && window.__pendingCsvFile.data.length > 0) {
                openCsvMappingModal(window.__pendingCsvFile.fileName || 'uploaded.csv', {
                    data: window.__pendingCsvFile.data,
                    meta: { fields: window.__pendingCsvFile.headers }
                });
                return;
            }

            // 2. If data is currently active on the platform
            const activeData = (window.parsedData && window.parsedData.length > 0) 
                ? window.parsedData 
                : ((typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) ? PRE_LOADED_DATA : null);
            if (activeData && activeData.length > 0) {
                const headers = Object.keys(activeData[0] || {});
                const fname = window.__currentCsvFileName || 'Questionnaire_Synthetic_Responses.csv';
                openCsvMappingModal(fname, {
                    data: activeData,
                    meta: { fields: headers }
                });
                return;
            }

            // 3. Fallback: prompt file upload
            const fileInput = document.getElementById('file-input');
            if (fileInput && typeof fileInput.click === 'function') {
                try { fileInput.click(); } catch (e) { console.warn("fileInput.click blocked:", e); }
            }
        }


        // ===== CSV COLUMN GUIDE: data dictionary + downloadable template, generated from the active schema =====
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
            return rows;
        }

        function csvGuideCell(v) { return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"'; }
        function csvGuideDownload(name, text) {
            const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = name;
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        }
        function downloadCsvTemplate() {
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const schema = getActiveJourneySchema(); if (!schema) return;
            const rows = buildCsvGuideRows(schema, isZh);
            const text = rows.map(r => csvGuideCell(r.col)).join(',') + '\r\n' + rows.map(r => csvGuideCell(r.example)).join(',') + '\r\n';
            csvGuideDownload(`${schema.id || 'survey'}_CSV_Template_${isZh ? 'ZH' : 'EN'}.csv`, text);
        }
        function downloadCsvDictionary() {
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const schema = getActiveJourneySchema(); if (!schema) return;
            const head = isZh ? ['CSV 欄位名稱', '題號', '題目／說明', '答案類型', '可填內容／格式', '用於', '優先度'] : ['CSV column', 'Question no.', 'Question / description', 'Answer type', 'Allowed values / format', 'Used for', 'Priority'];
            const rows = buildCsvGuideRows(schema, isZh);
            const text = [head.map(csvGuideCell).join(',')].concat(rows.map(r => [r.col, r.no, r.question, r.type, r.values, r.used, r.core ? (isZh ? '核心' : 'Core') : (isZh ? '選填' : 'Optional')].map(csvGuideCell).join(','))).join('\r\n') + '\r\n';
            csvGuideDownload(`${schema.id || 'survey'}_CSV_Column_Dictionary_${isZh ? 'ZH' : 'EN'}.csv`, text);
        }
        function openCsvGuide() {
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const schema = getActiveJourneySchema(); if (!schema) return;
            const rows = buildCsvGuideRows(schema, isZh);
            const groups = [
                ['identity', isZh ? '識別欄位' : 'Identity'], ['demographic', isZh ? '背景資料（篩選用）' : 'Demographics (filters)'], ['badges', isZh ? '自我形象標籤' : 'Self-image tags'],
                ['ratings', isZh ? '評分與技能（分群、SUP）' : 'Ratings & skills (clustering, SUP)'], ['behaviour', isZh ? '工作方式與工具（TU / PR）' : 'Work methods & tools (TU / PR)'],
                ['text', isZh ? '開放式回答' : 'Open text'], ['journey', isZh ? '歷程地圖（AR / PR）' : 'Journey map (AR / PR)'], ['other', isZh ? '其他' : 'Other']
            ];
            const esc = escapeHtml;
            const th = 'padding:12px 14px; text-align:left; font-size:1.05rem; color:#94a3b8; border-bottom:1px solid rgba(255,255,255,0.15); white-space:nowrap; font-weight:700;';
            const td = 'padding:12px 14px; font-size:1rem; vertical-align:top; border-bottom:1px solid rgba(255,255,255,0.06); line-height:1.6;';
            const body = groups.map(([g, title]) => {
                const rs = rows.filter(r => r.group === g); if (!rs.length) return '';
                return `<details ${g === 'identity' || g === 'behaviour' ? 'open' : ''} style="border:1px solid rgba(255,255,255,0.12); border-radius:8px; margin-bottom:12px; background:rgba(255,255,255,0.02);">
                    <summary style="cursor:pointer; padding:13px 16px; font-size:1.1875rem; font-weight:700; color:#fff;">${esc(title)} <span style="font-weight:500; color:#94a3b8; font-size:1rem;">(${rs.length} ${isZh ? '欄' : 'columns'})</span></summary>
                    <div style="overflow-x:auto; padding:0 6px 8px;"><table style="border-collapse:collapse; width:100%; min-width:860px; table-layout:fixed;"><colgroup><col style="width:22%"><col style="width:24%"><col style="width:38%"><col style="width:16%"></colgroup>
                        <thead><tr><th style="${th}">${isZh ? 'CSV 欄位名稱' : 'CSV column'}</th><th style="${th}">${isZh ? '題目' : 'Question'}</th><th style="${th}">${isZh ? '可填內容／格式' : 'Allowed values / format'}</th><th style="${th}">${isZh ? '用於' : 'Used for'}</th></tr></thead>
                        <tbody>${rs.map(r => `<tr>
                            <td style="${td} font-family:ui-monospace,Menlo,Consolas,monospace; color:#facc15; word-break:break-all; font-size:1rem;">${esc(r.col)}</td>
                            <td style="${td} color:#e2e8f0; min-width:180px;">${r.no ? `<strong style="font-size:1.05rem;">Q${esc(r.no)}</strong> ` : ''}${esc(r.question)}</td>
                            <td style="${td} color:#cbd5e1; min-width:260px;">${esc(r.values)}</td>
                            <td style="${td} color:#94a3b8; min-width:120px;">${esc(r.used)}${r.core ? ` <span style="color:#10b981; font-weight:700;">&bull; ${isZh ? '核心' : 'Core'}</span>` : ''}</td></tr>`).join('')}</tbody></table></div></details>`;
            }).join('');
            const rules = isZh
                ? ['檔案為 UTF-8 編碼的 CSV，第一列為欄位名稱，每位受訪者一列。', '欄位名稱需與下表完全一致（可用「下載 CSV 範本」取得表頭）；順序不限，缺少的欄位會使用中性預設值。', '複選題在同一格內以分號（ ; ）分隔；選項文字請與下表一致。', '受訪者未回答時請留空；缺漏的評分會以中性預設值計算。']
                : ['UTF-8 encoded CSV, first row = column names, one row per respondent.', 'Column names must match the table below exactly (use "Download CSV Template" to get the header row). Order does not matter; missing columns fall back to neutral defaults.', 'Multi-select answers go in one cell, separated by a semicolon ( ; ). Use the option wording shown below.', 'Leave a cell empty when the respondent did not answer; missing ratings fall back to neutral defaults.'];
            document.getElementById('csv-guide-title').textContent = isZh ? 'CSV 欄位說明' : 'CSV Column Guide';
            document.getElementById('csv-guide-subtitle').textContent = (isZh ? (schema.nameZh || schema.name) : schema.name) + ' · ' + rows.length + (isZh ? ' 欄' : ' columns');
            document.getElementById('csv-guide-body').innerHTML = `
                <ul style="margin:0 0 18px; padding-left:22px; font-size:1.0625rem; color:#cbd5e1; line-height:1.65;">${rules.map(r => `<li style="margin-bottom:8px;">${esc(r)}</li>`).join('')}</ul>${body}`;
            document.getElementById('csv-guide-btn-template').textContent = isZh ? '下載 CSV 範本（表頭＋範例列）' : 'Download CSV Template (header + example row)';
            document.getElementById('csv-guide-btn-dict').textContent = isZh ? '下載欄位字典（CSV）' : 'Download Column Dictionary (CSV)';
            const m = document.getElementById('csv-guide-modal');
            m.style.display = 'flex'; m.classList.add('active');
        }
        function closeCsvGuide() {
            const m = document.getElementById('csv-guide-modal');
            if (m) { m.style.display = 'none'; m.classList.remove('active'); }
        }
        window.openCsvGuide = openCsvGuide; window.closeCsvGuide = closeCsvGuide;
        window.downloadCsvTemplate = downloadCsvTemplate; window.downloadCsvDictionary = downloadCsvDictionary;

        function openCsvMappingModal(fileName, parsedResults) {
            if (typeof hideCsvLoading === 'function') hideCsvLoading();
            window.__lastCsvModalOpenedAt = Date.now();
            window.__currentCsvFileName = fileName;
            window.__pendingCsvFile = {
                fileName: fileName,
                data: parsedResults.data || [],
                headers: parsedResults.meta?.fields || (parsedResults.data && parsedResults.data[0] ? Object.keys(parsedResults.data[0]) : [])
            };

            const sampleRow = window.__pendingCsvFile.data[0] || {};
            const headerKeys = Object.keys(sampleRow).join(' ').toLowerCase();
            if (headerKeys.includes('policyholder') || headerKeys.includes('discovery') || headerKeys.includes('claims') || headerKeys.includes('product_familiarity') || headerKeys.includes('policy_type')) {
                currentJourneyDomain = 'policyholder';
            } else if (headerKeys.includes('agent') || headerKeys.includes('scheduling') || headerKeys.includes('policysales') || headerKeys.includes('underwriting')) {
                currentJourneyDomain = 'agent';
            }
            const domainSelect = document.getElementById('domain-select');
            if (domainSelect) domainSelect.value = currentJourneyDomain;
            updateClusterFeatures();

            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const schema = (typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null) || 
                           ((typeof JOURNEY_SCHEMAS !== 'undefined') ? (JOURNEY_SCHEMAS[currentJourneyDomain] || JOURNEY_SCHEMAS.agent) : null) ||
                           ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined') ? (DEFAULT_JOURNEY_SCHEMAS[currentJourneyDomain] || DEFAULT_JOURNEY_SCHEMAS.agent) : null);
            if (!schema) {
                console.warn("No active journey schema available for mapping.");
                return;
            }
            const targets = getSchemaTargetFields(schema);

            // Set labels
            document.getElementById('mapping-modal-title').textContent = t('mappingModalTitle');
            document.getElementById('mapping-modal-subtitle').textContent = t('mappingModalSubtitle');
            document.getElementById('lbl-mapping-file-name').textContent = t('mappingFileName');
            document.getElementById('lbl-mapping-total-rows').textContent = t('mappingTotalRows');
            document.getElementById('lbl-mapping-active-schema').textContent = t('mappingActiveSchema');
            document.getElementById('lbl-mapping-match-coverage').textContent = t('mappingMatchCoverage');
            document.getElementById('th-target-dim').textContent = t('mappingTargetDimension');
            document.getElementById('th-csv-source').textContent = t('mappingCsvSource');
            document.getElementById('th-sample-preview').textContent = t('mappingSamplePreview');
            document.getElementById('th-mapping-status').textContent = t('mappingStatus');
            document.getElementById('mapping-warning-note').textContent = t('mappingUnmappedNotice');
            const cancelBtn = document.getElementById('btn-cancel-mapping');
            if (cancelBtn) cancelBtn.textContent = isZh ? '✕ 關閉視窗' : '✕ Close Window';
            const confirmBtn = document.getElementById('mapping-confirm-btn');
            if (confirmBtn) confirmBtn.innerHTML = `<span>⚡ ${t('mappingConfirmBtn')}</span>`;

            // Metadata card
            document.getElementById('mapping-file-name').textContent = fileName;
            document.getElementById('mapping-row-count').textContent = window.__pendingCsvFile.data.length.toLocaleString();
            document.getElementById('mapping-schema-name').textContent = isZh ? (schema.nameZh || schema.name) : (schema.name || schema.nameZh || 'Active Schema');

            // Find best matches for all targets
            targets.forEach(t => {
                t.matchedHeader = findBestMatchingCsvHeader(t, window.__pendingCsvFile.headers);
            });

            // Populate table rows
            const tbody = document.getElementById('mapping-table-body');
            tbody.innerHTML = targets.map(target => {
                const isMatched = !!target.matchedHeader;
                const sampleVal = (isMatched && sampleRow[target.matchedHeader] !== undefined && sampleRow[target.matchedHeader] !== null) 
                    ? String(sampleRow[target.matchedHeader]) 
                    : '';
                const previewTxt = sampleVal ? (sampleVal.length > 25 ? sampleVal.slice(0, 25) + '…' : sampleVal) : t('mappingPreviewNA');
                
                const qBadge = target.questionNo 
                    ? `<span class="q-badge" style="font-family: monospace; font-size: var(--fs-small); font-weight: 800; padding: 2px 7px; border-radius: 5px; background: rgba(245, 197, 24, 0.18); color: #f5c518; border: 1px solid rgba(245, 197, 24, 0.45); display: inline-flex; align-items: center; justify-content: center; min-width: 36px;">${escapeHtml(target.questionNo)}</span>` 
                    : '';
                const catBadge = `<span style="font-size:var(--fs-caption); padding:2px 8px; border-radius:4px; background:rgba(255,255,255,0.08); color:#cbd5e1;">${escapeHtml(target.typeLabel)}</span>`;
                const reqBadge = target.required ? `<span style="color:#ef4444; font-weight:800; font-size:var(--fs-body); margin-left:3px;" title="${t('mappingRequired')}">*</span>` : '';
                
                const colSourceHtml = isMatched
                    ? `<span style="color: #10b981; font-weight: 600; font-size: var(--fs-body);">${escapeHtml(target.matchedHeader)}</span>`
                    : `<span style="color: #94a3b8; font-style: italic; font-size: var(--fs-body);">${escapeHtml(t('mappingSkipDefault'))}</span>`;

                return `
                    <tr class="mapping-row" data-category="${target.category}" style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.15s;">
                        <td style="padding: 12px 10px;">
                            <div class="target-title-wrap" style="font-weight: 700; color: #fff; font-size: var(--fs-subtitle); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                ${qBadge}
                                <span class="target-name">${escapeHtml(target.label)}</span>
                                ${reqBadge}
                            </div>
                            <div style="display: flex; gap: 6px; margin-top: 5px; align-items: center;">
                                ${catBadge}
                                <span style="font-size:var(--fs-small); color:#94a3b8; font-family: monospace;">key: ${escapeHtml(target.key)}</span>
                            </div>
                        </td>
                        <td style="padding: 12px 10px;">
                            <input type="hidden" class="mapping-select" data-target="${escapeHtml(target.key)}" value="${escapeHtml(target.matchedHeader || '')}">
                            ${colSourceHtml}
                        </td>
                        <td style="padding: 12px 10px;">
                            <div id="preview-${target.key}" style="font-size: var(--fs-body); color: ${isMatched ? '#cbd5e1' : '#94a3b8'}; ${isMatched ? '' : 'font-style: italic;'} max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(sampleVal)}">
                                ${escapeHtml(previewTxt)}
                            </div>
                        </td>
                        <td style="padding: 12px 10px; text-align: center;">
                            <span id="status-${target.key}" style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: var(--fs-body); font-weight: 700; ${isMatched ? 'background: rgba(16, 185, 129, 0.18); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4);' : 'background: rgba(239, 68, 68, 0.18); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);'}">
                                ${isMatched ? '✓ ' + t('mappingMatched') : t('mappingUnmapped')}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');

            recalculateMappingCoverage();

            // Calculate coverage stats
            const allSelects = document.querySelectorAll('#mapping-table-body .mapping-select');
            let mappedCount = 0;
            allSelects.forEach(s => { if (s.value) mappedCount++; });
            const totalCount = allSelects.length;
            const matchPct = totalCount > 0 ? Math.round((mappedCount / totalCount) * 100) : 0;

            // When match rate is less than 80%, automatically isolate and show unmatched rows
            if (matchPct < 80) {
                filterMappingTable('unmatched');
            } else {
                filterMappingTable('all');
            }

            // Dismiss background toast since the full mapping modal is now open in front
            if (typeof dismissPlatformNotification === 'function') {
                dismissPlatformNotification();
            }

            const modal = document.getElementById('csv-mapping-modal');
            if (modal) {
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                modal.classList.add('active');
            }
        }

        function closeCsvMappingModal(event) {
            // Guard against accidental closure from native file picker trailing click-through
            if (event && Date.now() - (window.__lastCsvModalOpenedAt || 0) < 400) {
                return;
            }
            const modal = document.getElementById('csv-mapping-modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
            // Retain window.__pendingCsvFile so user can re-open column mapping if needed
            if (typeof dismissPlatformNotification === 'function') {
                dismissPlatformNotification();
            }
        }
        window.openCsvMappingModalDirect = openCsvMappingModalDirect;
        window.openCsvMappingModal = openCsvMappingModal;
        window.closeCsvMappingModal = closeCsvMappingModal;

        function onMappingSelectChange(targetKey) {
            const sel = document.querySelector(`select.mapping-select[data-target="${targetKey}"]`);
            const previewEl = document.getElementById(`preview-${targetKey}`);
            const statusEl = document.getElementById(`status-${targetKey}`);
            if (!sel) return;
            
            const chosenCol = sel.value;
            const sampleRow = (window.__pendingCsvFile && window.__pendingCsvFile.data) ? window.__pendingCsvFile.data[0] || {} : {};
            
            if (chosenCol && sampleRow[chosenCol] !== undefined && sampleRow[chosenCol] !== null) {
                const val = String(sampleRow[chosenCol]);
                if (previewEl) {
                    previewEl.textContent = val.length > 25 ? val.slice(0, 25) + '…' : val;
                    previewEl.title = val;
                    previewEl.style.color = '#cbd5e1';
                    previewEl.style.fontStyle = 'normal';
                }
                if (statusEl) {
                    statusEl.innerHTML = '✓ ' + t('mappingMatched');
                    statusEl.style.cssText = 'display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: var(--fs-body); font-weight: 700; background: rgba(16, 185, 129, 0.18); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4);';
                }
                sel.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                sel.style.color = '#10b981';
                sel.style.fontStyle = 'normal';
                sel.style.fontWeight = '600';
            } else {
                if (previewEl) {
                    previewEl.textContent = t('mappingPreviewNA');
                    previewEl.title = '';
                    previewEl.style.color = '#94a3b8';
                    previewEl.style.fontStyle = 'italic';
                }
                if (statusEl) {
                    statusEl.innerHTML = t('mappingUnmapped');
                    statusEl.style.cssText = 'display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: var(--fs-body); font-weight: 700; background: rgba(239, 68, 68, 0.18); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);';
                }
                sel.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                sel.style.color = '#94a3b8';
                sel.style.fontStyle = 'italic';
                sel.style.fontWeight = 'normal';
            }
            recalculateMappingCoverage();
        }

        function recalculateMappingCoverage() {
            const allSelects = document.querySelectorAll('#mapping-table-body .mapping-select');
            if (allSelects.length === 0) return;
            let mapped = 0;
            const unmatchedTargets = [];
            const mappedCsvCols = new Set();

            allSelects.forEach(s => {
                const targetKey = s.getAttribute('data-target');
                if (s.value) {
                    mapped++;
                    mappedCsvCols.add(s.value);
                } else {
                    const row = s.closest('tr.mapping-row');
                    const labelSpan = row ? (row.querySelector('.target-name') || row.querySelector('.target-title-wrap span') || row.querySelector('div > span')) : null;
                    const qBadgeSpan = row ? row.querySelector('.q-badge') : null;
                    const qNo = qBadgeSpan ? qBadgeSpan.textContent.trim() : '';
                    const label = labelSpan ? labelSpan.textContent.trim() : targetKey;
                    const isRequired = !!row?.querySelector('span[title*="必填"], span[title*="Required"]');
                    unmatchedTargets.push({ key: targetKey, label: label, qNo: qNo, required: isRequired });
                }
            });

            const pct = Math.round((mapped / allSelects.length) * 100);
            const textEl = document.getElementById('mapping-coverage-text');
            const barEl = document.getElementById('mapping-coverage-bar');
            if (textEl) textEl.textContent = `${pct}% ${t('mappingMatched')}`;
            if (barEl) {
                barEl.style.width = `${pct}%`;
                if (pct >= 80) {
                    barEl.style.background = '#10b981';
                    if (textEl) textEl.style.color = '#10b981';
                } else if (pct >= 50) {
                    barEl.style.background = '#f59e0b';
                    if (textEl) textEl.style.color = '#f59e0b';
                } else {
                    barEl.style.background = '#ef4444';
                    if (textEl) textEl.style.color = '#ef4444';
                }
            }

            // Update Match Compatibility Banner
            const bannerEl = document.getElementById('mapping-status-banner');
            const bannerTextEl = document.getElementById('mapping-banner-text');
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            
            if (bannerEl && bannerTextEl) {
                if (pct >= 90) {
                    bannerEl.style.background = 'rgba(16, 185, 129, 0.15)';
                    bannerEl.style.color = '#10b981';
                    bannerEl.style.borderBottom = '2px solid rgba(16, 185, 129, 0.35)';
                    bannerTextEl.innerHTML = isZh 
                        ? `<span>✅</span><span><strong>架構高度相符（對應率 ${pct}%）</strong>：已自動對齊 ${mapped} / ${allSelects.length} 項問卷指標與歷程欄位，可直接啟動 AI 分群！</span>`
                        : `<span>✅</span><span><strong>High Schema Compatibility (${pct}% Match)</strong>: ${mapped} of ${allSelects.length} target dimensions auto-matched with CSV columns. Ready to run AI clustering!</span>`;
                } else if (pct >= 50) {
                    bannerEl.style.background = 'rgba(245, 158, 11, 0.16)';
                    bannerEl.style.color = '#f59e0b';
                    bannerEl.style.borderBottom = '2px solid rgba(245, 158, 11, 0.4)';
                    bannerTextEl.innerHTML = isZh
                        ? `<span>⚠️</span><span><strong>CSV 欄位對應預檢：已匹配 ${mapped}/${allSelects.length} 項架構維度（對應率 ${pct}%）</strong>！尚有 ${unmatchedTargets.length} 項未相符，請檢視下方欄位。</span>`
                        : `<span>⚠️</span><span><strong>CSV Pre-flight Check: ${mapped}/${allSelects.length} dimensions matched (${pct}% coverage)</strong>! ${unmatchedTargets.length} dimensions unmatched. Please review below.</span>`;
                } else {
                    bannerEl.style.background = 'rgba(239, 68, 68, 0.16)';
                    bannerEl.style.color = '#ef4444';
                    bannerEl.style.borderBottom = '2px solid rgba(239, 68, 68, 0.4)';
                    bannerTextEl.style.fontSize = '1.18rem';
                    bannerTextEl.style.fontWeight = '700';
                    bannerTextEl.style.lineHeight = '1.45';
                    bannerTextEl.innerHTML = isZh
                        ? `<span>❌</span><span><strong>CSV 欄位對應預檢：${mapped}/${allSelects.length} 項架構維度相符（相符度 ${pct}%）！</strong> 尚有 ${unmatchedTargets.length} 項未相符，請檢視下方欄位。</span>`
                        : `<span>❌</span><span><strong>CSV Pre-flight Check: ${mapped}/${allSelects.length} dimensions matched (${pct}% coverage)!</strong> ${unmatchedTargets.length} dimensions unmatched. Please review below.</span>`;
                }
            }

            // Impact note: what the unmatched columns cost (which measures / charts lose their data)
            const impactEl = document.getElementById('mapping-impact-note');
            if (impactEl) {
                try {
                    const qmap = getSchemaQuestionMap(getActiveJourneySchema());
                    const hit = {};
                    unmatchedTargets.forEach(u => {
                        const q = qmap.find(x => x.key === u.key);
                        if (!q || !q.slotLabel || q.slot === 'demographic') return;
                        const lbl = isZh ? q.slotLabel.zh : q.slotLabel.en;
                        (hit[lbl] = hit[lbl] || []).push(u.qNo || ('Q' + q.no));
                    });
                    const parts = Object.entries(hit).map(([lbl, qs]) => `<strong>${[...new Set(qs)].slice(0, 4).join(', ')}${new Set(qs).size > 4 ? '…' : ''}</strong> → ${lbl}`);
                    if (parts.length) {
                        impactEl.style.display = 'block';
                        impactEl.innerHTML = (isZh ? '⚠️ 未對應欄位將影響：' : '⚠️ Unmatched columns will leave these analyses empty or neutral: ') + parts.join(' &nbsp;·&nbsp; ')
                            + ` &nbsp; <a href="#" onclick="openCsvGuide(); return false;" style="color:#facc15; text-decoration:underline;">${isZh ? '查看 CSV 欄位說明' : 'See CSV Column Guide'}</a>`;
                    } else impactEl.style.display = 'none';
                } catch (e) { impactEl.style.display = 'none'; }
            }

            // Unmatched tab button state
            const tabUnmatchedBtn = document.getElementById('btn-tab-unmatched');
            const lblUnmatchedTab = document.getElementById('lbl-unmatched-tab');
            if (tabUnmatchedBtn) {
                if (unmatchedTargets.length > 0) {
                    tabUnmatchedBtn.style.display = 'inline-flex';
                    if (lblUnmatchedTab) {
                        lblUnmatchedTab.textContent = t('mappingUnmatchedTab', { count: unmatchedTargets.length });
                    }
                } else {
                    tabUnmatchedBtn.style.display = 'none';
                }
            }
        }

        // Keyboard Escape key to close column mapping modal
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('csv-mapping-modal');
                if (modal && (modal.style.display === 'flex' || modal.classList.contains('active'))) {
                    closeCsvMappingModal();
                }
            }
        });

        // Backdrop click to close column mapping modal
        window.addEventListener('DOMContentLoaded', function() {
            const csvModalEl = document.getElementById('csv-mapping-modal');
            if (csvModalEl) {
                csvModalEl.addEventListener('click', function(e) {
                    if (e.target === csvModalEl) {
                        if (Date.now() - (window.__lastCsvModalOpenedAt || 0) > 400) {
                            closeCsvMappingModal();
                        }
                    }
                });
            }
        });

        function filterMappingTable(category) {
            document.querySelectorAll('#mapping-category-tabs .mapping-cat-btn').forEach(btn => {
                if (btn.getAttribute('data-cat') === category) {
                    btn.classList.add('active');
                    btn.style.background = (category === 'unmatched') ? '#f59e0b' : 'var(--accent-yellow)';
                    btn.style.color = '#121416';
                } else {
                    btn.classList.remove('active');
                    btn.style.background = 'rgba(255,255,255,0.05)';
                    btn.style.color = (btn.getAttribute('data-cat') === 'unmatched') ? '#f59e0b' : 'var(--text-primary)';
                }
            });
            
            document.querySelectorAll('#mapping-table-body tr.mapping-row').forEach(row => {
                if (category === 'all') {
                    row.style.display = '';
                } else if (category === 'unmatched') {
                    const sel = row.querySelector('.mapping-select');
                    row.style.display = (sel && !sel.value) ? '' : 'none';
                } else if (row.getAttribute('data-category') === category) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        function scrollToTargetRow(targetKey) {
            const targetSel = document.querySelector(`.mapping-select[data-target="${targetKey}"]`);
            if (!targetSel) return;
            const targetRow = targetSel.closest('tr.mapping-row');
            if (!targetRow) return;

            if (targetRow.style.display === 'none') {
                filterMappingTable('all');
            }

            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const origBg = targetRow.style.background;
            targetRow.style.background = 'rgba(245, 197, 24, 0.25)';
            targetRow.style.transition = 'background 0.3s ease';
            setTimeout(() => {
                targetRow.style.background = origBg || '';
            }, 1800);
        }

        function confirmCsvMappingAndProcess() {
            const userMapping = {};
            document.querySelectorAll('#mapping-table-body .mapping-select').forEach(sel => {
                const targetKey = sel.getAttribute('data-target');
                const csvCol = sel.value;
                if (csvCol) userMapping[targetKey] = csvCol;
            });
            
            if (!userMapping['respondent_id']) {
                const sampleRow = (window.__pendingCsvFile && window.__pendingCsvFile.data) ? window.__pendingCsvFile.data[0] || {} : {};
                const autoId = sampleRow.AgentName || sampleRow['受訪者編號'] || sampleRow.Name || sampleRow.RespondentID || sampleRow.respondent_id || sampleRow.Respondent_ID;
                if (!autoId) {
                    const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
                    alert(isZh ? '上傳的 CSV 檔案缺少「受訪者編號 / 姓名」欄位！' : 'Uploaded CSV file is missing a Respondent ID / Name column!');
                    return;
                }
            }
            
            const pendingData = window.__pendingCsvFile ? window.__pendingCsvFile.data : null;
            closeCsvMappingModal();
            if (pendingData && pendingData.length > 0) {
                const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
                if (typeof showCsvLoading === 'function') {
                    showCsvLoading(
                        isZh ? '正在執行 AI 分群運算' : 'Running AI Clustering Analysis',
                        isZh ? '正在計算動態人物誌分群並更新儀表板，請稍候...' : 'Computing dynamic persona clusters & updating platform dashboard...'
                    );
                }
                setTimeout(() => {
                    executeCSVDataProcessing(pendingData, userMapping);
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                }, 40);
            }
        }

        // ==================== SAVED UPLOAD (browser IndexedDB, this device only) ====================
        // The last uploaded CSV is kept in the browser until a new CSV replaces it (or Restore Default Data is used).
        const QP_DB_NAME = 'quan_persona_store', QP_DB_STORE = 'kv', QP_DB_KEY = 'uploaded_csv';
        function qpOpenDb() {
            return new Promise(function (resolve, reject) {
                try {
                    const req = indexedDB.open(QP_DB_NAME, 1);
                    req.onupgradeneeded = function () { req.result.createObjectStore(QP_DB_STORE); };
                    req.onsuccess = function () { resolve(req.result); };
                    req.onerror = function () { reject(req.error); };
                } catch (e) { reject(e); }
            });
        }
        function qpTx(db, mode, fn) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(QP_DB_STORE, mode); let out;
                try { out = fn(tx.objectStore(QP_DB_STORE)); } catch (e) { reject(e); return; }
                tx.oncomplete = function () { resolve(out && out.result !== undefined ? out.result : undefined); };
                tx.onerror = tx.onabort = function () { reject(tx.error); };
            });
        }
        function saveUploadedCsv(data, mapping) {
            return qpOpenDb().then(function (db) {
                return qpTx(db, 'readwrite', function (st) {
                    return st.put({ v: 1, data: data, mapping: mapping || {}, domain: (typeof currentJourneyDomain !== 'undefined' ? currentJourneyDomain : 'agent'), savedAt: Date.now() }, QP_DB_KEY);
                });
            }).catch(function (e) { console.warn('Could not save uploaded CSV in this browser:', e); });
        }
        function clearUploadedCsv() {
            return qpOpenDb().then(function (db) { return qpTx(db, 'readwrite', function (st) { return st.delete(QP_DB_KEY); }); }).catch(function () {});
        }
        function restoreSavedUploadedCsv() {
            if (window.__csvRestoreTried) return Promise.resolve();
            window.__csvRestoreTried = true;
            if (window.userUploadedCustomFile) return Promise.resolve();
            return qpOpenDb().then(function (db) { return qpTx(db, 'readonly', function (st) { return st.get(QP_DB_KEY); }); }).then(function (rec) {
                if (!rec || !rec.data || !rec.data.length || window.userUploadedCustomFile) return;
                const go = function () { if (!window.userUploadedCustomFile) executeCSVDataProcessing(rec.data, rec.mapping || {}, { restore: true }); };
                if (rec.domain && typeof currentJourneyDomain !== 'undefined' && rec.domain !== currentJourneyDomain && typeof switchJourneyDomain === 'function') {
                    switchJourneyDomain(rec.domain); setTimeout(go, 700);
                } else go();
            }).catch(function (e) { console.warn('Could not restore the saved CSV:', e); });
        }
        window.saveUploadedCsv = saveUploadedCsv; window.clearUploadedCsv = clearUploadedCsv; window.restoreSavedUploadedCsv = restoreSavedUploadedCsv;

        function executeCSVDataProcessing(data, userMapping = {}, opts = {}) {
            window.userUploadedCustomFile = true;
            const activeSchema = (typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null) || 
                                 ((typeof JOURNEY_SCHEMAS !== 'undefined') ? (JOURNEY_SCHEMAS[currentJourneyDomain] || JOURNEY_SCHEMAS.agent) : null) ||
                                 ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined') ? (DEFAULT_JOURNEY_SCHEMAS[currentJourneyDomain] || DEFAULT_JOURNEY_SCHEMAS.agent) : null);
            
            const measureCols = buildMeasureColumns(activeSchema, userMapping, data);
            window.__measureStatus = measureCols.status;
            if (typeof updateClusterFeatures === 'function') updateClusterFeatures();
            const list = [];
            data.forEach(rawRow => {
                const row = {};
                for (const key in rawRow) {
                    const cleanKey = key.replace(/^﻿/, '').trim();
                    row[cleanKey] = rawRow[key];
                }

                // 1. Respondent ID / Name
                let agentName = null;
                if (userMapping && userMapping['respondent_id'] && row[userMapping['respondent_id']] !== undefined) {
                    agentName = row[userMapping['respondent_id']];
                } else {
                    agentName = row.AgentName || row['受訪者編號'] || row.Name || row.RespondentID || row.respondent_id || row.respondent_id_受訪者編號 || row.Respondent_ID || row.respondentId;
                }
                if (!agentName) return;

                // 2. Archetype if any
                let rawArchetype = null;
                if (userMapping && userMapping['persona_archetype'] && row[userMapping['persona_archetype']]) {
                    rawArchetype = row[userMapping['persona_archetype']];
                } else {
                    rawArchetype = row.persona_archetype || row.persona_archetype_人物誌類型 || row.researchArchetype || row.ResearchArchetype || null;
                }

                // Check if this is the old database format with QM/BF scales
                const hasQM = row.QM_1_1 !== undefined || row['QM_1_1'] !== undefined;
                let qm = [];
                let bf = [];
                let sup = 3, wp = 3, ar = 3, pr = 3;

                if (hasQM) {
                    qm = [
                        row.QM_1_1 || 3, row.QM_1_2 || 3,
                        row.QM_2_1 || 3, row.QM_2_2 || 3,
                        row.QM_3_1 || 3, row.QM_3_2 || 3,
                        row.QM_4_1 || 3, row.QM_4_2 || 3,
                        row.QM_5_1 || 3, row.QM_5_2 || 3
                    ];
                    bf = [
                        row.BF_1_1 || 3, row.BF_1_2 || 3,
                        row.BF_2_1 || 3, row.BF_2_2 || 3,
                        row.BF_3_1 || 3, row.BF_3_2 || 3,
                        row.BF_4_1 || 3, row.BF_4_2 || 3,
                        row.BF_5_1 || 3, row.BF_5_2 || 3
                    ];
                    sup = qm.reduce((a,b)=>a+b, 0) / 10;
                    wp = (bf[0] + bf[2] + bf[4] + bf[7] + bf[8]) / 5;
                    pr = (bf[3] + bf[6]) / 2;
                    ar = (bf[1] + bf[5] + bf[9]) / 3;
                } else {
                    sup = computeSUP(row, userMapping, activeSchema);
                    const ms = scoreMeasuresForRow(row, measureCols, activeSchema);
                    wp = ms.wp; ar = ms.ar; pr = ms.pr;
                }

                const agentObj = {
                    name: agentName,
                    raw: { qm, bf },
                    sup, wp, ar, pr,
                    archetype: rawArchetype,
                    researchArchetype: rawArchetype
                };

                // Standard demographics mapping
                const mappings = {
                    Age: ['Age', 'Age_Range', 'AgeRange', 'Q1_AgeRange', 'Age', 'Age區間', 'Q1_Age區間', 'Q1_Age', '對應問卷第1題', '對應問卷第 1 題', 'Q1_age_range', 'Q1_年齡區間'],
                    Service_Location: ['Service_Location', 'ServiceRegion', 'Q2_ServiceRegion', 'Q2_service地區', 'service地區', '對應問卷第2題', '對應問卷第 2 題', 'Q2_region', 'Q2_服務區域'],
                    Branch_Office: ['Branch_Office', 'BranchOffice', 'Q3_BranchOffice', 'Q3_Office Branch', 'Office Branch', '對應問卷第3題', '對應問卷第 3 題', 'Q3_branch', 'Q3_通訊處（分處）'],
                    Position: ['Position', 'Q4_Position', 'Title', '職稱', 'Title／職稱', 'Q4_Title職稱', '對應問卷第4題', '對應問卷第 4 題', 'Q4_job_rank', 'Q4_職級', 'Q4_policy_type', 'PolicyType', 'Policy_Type'],
                    Experience: ['Experience', 'Experience_Range', 'ExperienceRange', 'Q5_YearsExperience', 'Tenure', 'Tenure區間', 'Q5_Tenure區間', 'Q5_Tenure', '對應問卷第5題', '對應問卷第 5 題', '保險sales經驗', 'Q5_years_experience', 'Q5_保險銷售年資', 'Q5_customer_tenure', 'CustomerTenure'],
                    Clients: ['Clients', 'Scale_Customers', 'Scale of Customers', 'ScaleofCustomers', 'Q6_CustomersServed', 'client規模', 'Q6_client數量區間', 'Q6_client規模', 'client數量', '對應問卷第6題', '對應問卷第 6 題', 'Q6_customers_served', 'Q6_累計服務客戶數', 'Q6_household_structure', 'HouseholdStructure'],
                    PerformanceRank: ['PerformanceRank', 'Performance_Rank', 'Q7_PerformanceRank', 'Q7_performance_rank', 'Q7_業績表現排名', 'Q7_業績排名', 'Performance', '業績表現', '業績排名', '對應問卷第7題', '對應問卷第 7 題'],
                    Skill_Agent_Familiarity: ['Skill_Agent_Familiarity', 'Q8_SystemFamiliarity', 'Agent System/Tool Familiarity', 'Q8_tool_familiarity_pct', 'Q8_工具熟悉度（%）'],
                    Skill_Device_Familiarity: ['Skill_Device_Familiarity', 'Q11_SystemPortalSpeedReliability', 'Device/System Familiarity', 'Q11_speed_reliability_impact_1to5', 'Q11_系統速度與穩定度影響（1–5）'],
                    Skill_Device: ['Skill_Device', 'SkillDevice', 'Device_Familiarity', 'Device Familiarity', 'Q8_SystemFamiliarity', 'Q7_tool熟稔度(%)', 'Q7_裝置system熟稔度(%)', 'Device/System Familiarity', '裝置熟稔度', '對應問卷第7題', '對應問卷第 7 題', 'Q8_tool_familiarity_pct', 'Q8_工具熟悉度（%）', 'Skill_Product_Familiarity', 'Product_Familiarity'],
                    Skill_Knowledge: ['Skill_Knowledge', 'SkillKnowledge', 'Knowledge', 'Q12_InsuranceKnowledge', 'Q8_保險knowledge影響(%)', 'Q8_Insurance Knowledge(%)', 'Insurance Knowledge', '保險knowledge', '對應問卷第8題_保險knowledge', 'Q12_insurance_knowledge_impact_1to5', 'Q12_保險知識影響（1–5）', 'Skill_Digital_Self_Service', 'Digital_Self_Service'],
                    Skill_Sales: ['Skill_Sales', 'SkillSales', 'Sales', 'performance影響度', 'performance貢獻', '對應問卷第8題_performance貢獻', 'Q7_performance_rank', 'Q7_近12個月業績排名'],
                    Skill_Sales_Pitch: ['Skill_Sales_Pitch', 'SkillSalesPitch', 'Q12_SalesPitchCommunication', 'Q8_salespitch影響(%)', 'Q8_Sales Pitch Communication(%)', 'Sales Pitch Communication', 'Q12_sales_pitch_impact_1to5', 'Q12_銷售話術與溝通影響（1–5）', 'Skill_Financial_Confidence', 'Financial_Confidence'],
                    Skill_Customer_Relations: ['Skill_Customer_Relations', 'SkillCustomerRelations', 'Q12_CustomerRelationshipManagement', 'Q8_clientrelationship影響(%)', 'Q8_Customer Relationship Management(%)', 'Customer Relationship Management', 'Q12_crm_impact_1to5', 'Q12_客戶關係管理影響（1–5）', 'Skill_Brand_Trust', 'Brand_Trust'],
                    Skill_Digital_Tools: ['Skill_Digital_Tools', 'SkillDigitalTools', 'Q8_digitaltool熟悉度(%)', 'Q8_Digital Tool Familiarity(%)', 'Digital Tool Familiarity', 'Q11_digital_tool_familiarity_impact_1to5', 'Q11_數位工具熟悉度影響（1–5）', 'Q8_digitaltool影響(%)', 'Q8_Digital Tool Usage(%)', 'Digital Tool Usage', 'Q11_digital_tool_usage_impact_1to5', 'Q11_數位工具使用影響（1–5）', 'Skill_Service_Satisfaction', 'Service_Satisfaction'],
                    Tasks_Text: ['Tasks_Text', 'Daily_Tasks', 'Daily Tasks', '日常工作', '對應問卷第12題', '對應問卷第 12 題', 'Daily Work Content', 'Q20_work_item_allocation', 'Q20_工作項目時間分配（代碼:百分比）'],
                    Conflict: ['Conflict', 'Barriers', 'Contradictions', 'Q21_GapDescription', 'Q9_落差矛盾說明', 'Q13_Core Conflicts障礙', 'Core Conflicts', '對應問卷第13題', '對應問卷第 13 題', '矛盾', '障礙', 'Q21_gap_or_contradiction', 'Q21_目標與實際的落差或矛盾'],
                    PersonalTools: ['PersonalTools', 'Personalised_Tools', 'Personalised Tools', 'Q23_PersonalTools', 'Common Tools', '個人化工具', '對應問卷第14題', '對應問卷第 14 題', 'Q23_personal_tools_used', 'Q23_常用個人工具／替代做法'],
                    Needs: ['Needs', 'Core_Needs', 'Core Needs', 'Q24_CoreNeeds', 'Core Needs', '對應問卷第15題', '對應問卷第 15 題', '需求', 'Q24_core_needs', 'Q24_核心需求'],
                    Quote: ['Quote', 'Quote_Text', 'Verbatim', 'Q25_Motto', 'Q12_代表性一句話', 'Q16_原聲引述', '感受', '原聲引述', '對應問卷第16題', '對應問卷第 16 題', 'Q25_motto', 'Q25_座右銘'],
                    Pains: ['Pains', 'Pain_Points', 'PainPoints', 'Main Pain Points', 'Pain Points', '對應問卷第18題所有Pain Points'],
                    Role_Badges: ['Role_Badges', 'RoleBadges', 'Badges', '自我形象標籤', '對應問卷第9_10_11題']
                };

                for (const standardKey in mappings) {
                    const customCol = userMapping ? (userMapping[standardKey] || userMapping['demo_' + standardKey] || userMapping[standardKey.toLowerCase()]) : null;
                    if (customCol && row[customCol] !== undefined && row[customCol] !== null && row[customCol] !== '') {
                        agentObj[standardKey] = row[customCol];
                    } else {
                        const aliases = mappings[standardKey];
                        for (const alias of aliases) {
                            if (row[alias] !== undefined && row[alias] !== null) {
                                agentObj[standardKey] = row[alias];
                                break;
                            }
                        }
                    }
                }

                // Parse impact text to numeric score 0-100 where necessary
                agentObj.Skill_Agent_Familiarity = parseImpactValue(agentObj.Skill_Agent_Familiarity);
                agentObj.Skill_Device_Familiarity = parseImpactValue(agentObj.Skill_Device_Familiarity);
                agentObj.Skill_Device = parseImpactValue(agentObj.Skill_Device);
                agentObj.Skill_Knowledge = parseImpactValue(agentObj.Skill_Knowledge);
                agentObj.Skill_Sales_Pitch = parseImpactValue(agentObj.Skill_Sales_Pitch);
                agentObj.Skill_Customer_Relations = parseImpactValue(agentObj.Skill_Customer_Relations);
                agentObj.Skill_Digital_Tools = parseImpactValue(agentObj.Skill_Digital_Tools);

                // Fallbacks
                if (agentObj.Skill_Agent_Familiarity === undefined) agentObj.Skill_Agent_Familiarity = agentObj.Skill_Device || 50;
                if (agentObj.Skill_Device_Familiarity === undefined) agentObj.Skill_Device_Familiarity = agentObj.Skill_Device || 50;
                if (agentObj.Skill_Sales_Pitch === undefined) agentObj.Skill_Sales_Pitch = agentObj.Skill_Sales || 50;
                if (agentObj.Skill_Customer_Relations === undefined) agentObj.Skill_Customer_Relations = agentObj.Skill_Sales || 50;
                if (agentObj.Skill_Digital_Tools === undefined) agentObj.Skill_Digital_Tools = agentObj.Skill_Device || 50;

                // Dynamic demographics extraction for active schema
                if (activeSchema && activeSchema.demographics) {
                    activeSchema.demographics.forEach((d, dIdx) => {
                        const dKey = d.key ? d.key.replace(/^Demo_\d+_/, '') : `Demo_${dIdx + 1}`;
                        const userCol = userMapping ? (userMapping['demo_' + dKey] || userMapping['demo_' + d.key] || userMapping[dKey]) : null;
                        if (userCol && row[userCol] !== undefined && row[userCol] !== null && row[userCol] !== '') {
                            agentObj[dKey] = row[userCol];
                        } else {
                            const targetAliases = [
                                d.key, dKey, d.label, d.labelZh, `Q${dIdx + 1}`, `Q${dIdx + 1}_${dKey}`
                            ].filter(Boolean);
                            for (const k in row) {
                                const cleanK = k.replace(/^﻿/, '').trim();
                                const matchFound = targetAliases.some(alias => cleanK === alias || cleanK.toLowerCase() === alias.toLowerCase());
                                if (matchFound && row[k] !== undefined && row[k] !== null && row[k] !== '') {
                                    agentObj[dKey] = row[k];
                                    break;
                                }
                            }
                        }
                        const lowerLabel = (d.label || '').toLowerCase();
                        if (lowerLabel.includes('age') && !agentObj.Age) agentObj.Age = agentObj[dKey];
                        if ((lowerLabel.includes('region') || lowerLabel.includes('location')) && !agentObj.Service_Location) agentObj.Service_Location = agentObj[dKey];
                        if ((lowerLabel.includes('position') || lowerLabel.includes('role')) && !agentObj.Position) agentObj.Position = agentObj[dKey];
                        if ((lowerLabel.includes('experience') || lowerLabel.includes('tenure')) && !agentObj.Experience) agentObj.Experience = agentObj[dKey];
                        if ((lowerLabel.includes('scale') || lowerLabel.includes('client') || lowerLabel.includes('cohort')) && !agentObj.Clients) agentObj.Clients = agentObj[dKey];
                    });
                }

                // Dynamic metrics extraction for active schema
                if (activeSchema && activeSchema.metrics) {
                    activeSchema.metrics.forEach((m, mIdx) => {
                        const mKey = m.key || `Skill_Dim_${mIdx + 1}`;
                        const userCol = userMapping ? (userMapping['metric_' + mKey] || userMapping['metric_' + m.key] || userMapping[mKey]) : null;
                        let rawVal = undefined;
                        if (userCol && row[userCol] !== undefined && row[userCol] !== null && row[userCol] !== '') {
                            rawVal = row[userCol];
                        } else {
                            const targetAliases = [
                                mKey, `Skill_Dim_${mIdx + 1}`, `Dim_${mIdx + 1}`, m.label, m.labelZh,
                                m.label ? m.label.replace(/\s+/g, '_') : '',
                                m.labelZh ? m.labelZh.replace(/\s+/g, '_') : ''
                            ].filter(Boolean);
                            for (const k in row) {
                                const cleanK = k.replace(/^﻿/, '').trim();
                                const matchFound = targetAliases.some(alias => cleanK === alias || cleanK.toLowerCase() === alias.toLowerCase());
                                if (matchFound && row[k] !== undefined && row[k] !== null && row[k] !== '') {
                                    rawVal = row[k];
                                    break;
                                }
                            }
                        }
                        if (rawVal !== undefined) {
                            const norm = normalizeScore(rawVal, m.scaleType || '1-5');
                            agentObj[mKey] = norm;
                            agentObj[`Skill_Dim_${mIdx + 1}`] = norm;
                        }
                    });
                }

                // Qualitative fields mapping
                if (userMapping) {
                    if (userMapping['conflict'] && row[userMapping['conflict']]) agentObj.Conflict = row[userMapping['conflict']];
                    if (userMapping['needs'] && row[userMapping['needs']]) agentObj.Needs = row[userMapping['needs']];
                    if (userMapping['personal_tools'] && row[userMapping['personal_tools']]) agentObj.PersonalTools = row[userMapping['personal_tools']];
                    if (userMapping['quote'] && row[userMapping['quote']]) agentObj.Quote = row[userMapping['quote']];
                    if (userMapping['role_badges'] && row[userMapping['role_badges']]) agentObj.Role_Badges = row[userMapping['role_badges']];
                    if (userMapping['tasks_text'] && row[userMapping['tasks_text']]) agentObj.Tasks_Text = row[userMapping['tasks_text']];
                    // Tags 1-3 are one badge set
                    const tagVals = ['role_badges', 'role_badges_2', 'role_badges_3']
                        .map(k => userMapping[k] ? String(row[userMapping[k]] || '').trim() : '').filter(Boolean);
                    if (tagVals.length) agentObj.Role_Badges = [...new Set(tagVals)].join(';');
                    // Answers that have their own dashboard slot (raw text, distributions are counted from these)
                    const resp = {};
                    [['role_reasons', 'q16'], ['role_methods', 'q17'], ['followup', 'q18'], ['willingness', 'q19'],
                     ['official', 'q22'], ['personal_tools', 'q23'], ['journey_focus', 'q26'], ['feeling', 'q12'], ['tool_impact', 'q13']]
                        .forEach(([k, q]) => { const c = userMapping[k]; if (c && row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== '') resp[q] = String(row[c]).trim(); });
                    agentObj.Resp = resp;
                }

                // Stages mapping
                const allPains = [];
                const numStages = (activeSchema && activeSchema.stages) ? activeSchema.stages.length : 6;
                const stepTaskNames = (activeSchema && activeSchema.stages) ? activeSchema.stages.map(s => s.key) : [
                    "Scheduling", "PolicySales", "Underwriting", "PolicyServicing", "BranchAdmin", "Training"
                ];

                for (let step = 1; step <= numStages; step++) {
                    const stageObj = (activeSchema && activeSchema.stages) ? activeSchema.stages[step - 1] : null;
                    const tName = stageObj ? stageObj.key : (stepTaskNames[step - 1] || `Stage_${step}`);

                    // Location
                    const userLocCol = userMapping ? userMapping[`stage_${step}_location`] : null;
                    let locVal = userLocCol ? row[userLocCol] : (row[`Task${step}_${tName}_location`] || row[`Task${step}_${tName}_執行地點`] || "");
                    if (!locVal) {
                        for (const k in row) {
                            if (k.toLowerCase().startsWith(`task${step}`) && (k.includes('location') || k.includes('執行地點') || k.includes('地點'))) {
                                locVal = row[k]; break;
                            }
                        }
                    }
                    const locs = [row[`Task${step}_A_Location`], row[`Task${step}_B_Location`], row[`Task${step}_C_Location`], locVal].filter(Boolean);
                    if (locs.length > 0) agentObj[`Journey_${step}_Locations`] = locs.join('; ');

                    // Tools
                    const userToolCol = userMapping ? userMapping[`stage_${step}_tools`] : null;
                    let toolVal = userToolCol ? row[userToolCol] : (row[`Task${step}_${tName}_tools_or_people`] || row[`Task${step}_${tName}_協助工具或人員`] || "");
                    if (!toolVal) {
                        for (const k in row) {
                            if (k.toLowerCase().startsWith(`task${step}`) && (k.includes('tool') || k.includes('people') || k.includes('協助') || k.includes('人員'))) {
                                toolVal = row[k]; break;
                            }
                        }
                    }
                    const tools = [row[`Task${step}_A_ToolsPeople`], row[`Task${step}_B_ToolsPeople`], row[`Task${step}_C_ToolsPeople`], toolVal].filter(Boolean);
                    if (tools.length > 0) agentObj[`Journey_${step}_Tools`] = tools.join('; ');

                    // Pain points
                    const userPainCol = userMapping ? userMapping[`stage_${step}_pain`] : null;
                    let painVal = userPainCol ? row[userPainCol] : (row[`Task${step}_${tName}_pain_point`] || row[`Task${step}_${tName}_痛點`] || "");
                    if (!painVal) {
                        for (const k in row) {
                            if (k.toLowerCase().startsWith(`task${step}`) && (k.includes('pain') || k.includes('痛點'))) {
                                painVal = row[k]; break;
                            }
                        }
                    }
                    const pain1 = row[`Task${step}_A_PainPoint`];
                    const pain2 = row[`Task${step}_B_PainPoint`];
                    const pain3 = row[`Task${step}_C_PainPoint`];
                    const stepPains = [pain1, pain2, pain3, painVal].filter(Boolean);
                    if (stepPains.length > 0) {
                        agentObj[`Journey_${step}_Pains`] = stepPains.join('; ');
                        stepPains.forEach(p => {
                            if (p && !p.toLowerCase().includes('no significant pain') && !p.toLowerCase().includes('無特別')) {
                                allPains.push(p);
                            }
                        });
                    }

                    // Ratings
                    const userRatingCol = userMapping ? userMapping[`stage_${step}_rating`] : null;
                    let rawEmotion = userRatingCol ? row[userRatingCol] : null;
                    if (!rawEmotion) {
                        const emotionKeys = [
                            `Task${step}_${tName}_emotional_rating_1to5`, `Task${step}_${tName}_滿意度`, `Task${step}_Rating`,
                            `Task_${step}_Rating`, `Journey_${step}_Rating`, `Stage_${step}_Rating`, `task${step}_emotion`,
                            `Task${step}_emotion`, `task_${step}_emotion`, `Task_${step}_emotion`, `Task${step}_D_Emotion`,
                            `Task${step}_C_Emotion`, `Task${step}_Emotion`
                        ];
                        for (const k of emotionKeys) {
                            if (row[k] !== undefined && row[k] !== null) { rawEmotion = row[k]; break; }
                        }
                    }

                    let ratingVal = 3.0;
                    if (rawEmotion) {
                        const emoStr = String(rawEmotion).trim();
                        if (emoStr.includes('😩') || emoStr.includes('😫') || emoStr.includes('😭') || emoStr.includes('😡') || emoStr.includes('😠') || emoStr.includes('1')) {
                            ratingVal = 1.0;
                        } else if (emoStr.includes('🙁') || emoStr.includes('☹') || emoStr.includes('😮') || emoStr.includes('💨') || emoStr.includes('😟') || emoStr.includes('😰') || emoStr.includes('2')) {
                            ratingVal = 2.0;
                        } else if (emoStr.includes('😐') || emoStr.includes('😑') || emoStr.includes('😶') || emoStr.includes('3')) {
                            ratingVal = 3.0;
                        } else if (emoStr.includes('🙂') || emoStr.includes('😊') || emoStr.includes('😀') || emoStr.includes('😃') || emoStr.includes('4')) {
                            ratingVal = 4.0;
                        } else if (emoStr.includes('🤩') || emoStr.includes('😄') || emoStr.includes('😆') || emoStr.includes('😁') || emoStr.includes('😍') || emoStr.includes('5')) {
                            ratingVal = 5.0;
                        } else {
                            const parsedNum = parseFloat(emoStr);
                            if (!isNaN(parsedNum)) ratingVal = parsedNum;
                        }
                    }
                    agentObj[`Journey_${step}_Rating`] = ratingVal.toFixed(1);
                }
                if (allPains.length > 0) agentObj.Pains = allPains.join('; ');

                list.push(agentObj);
            });

            if (list.length > 0) {
                assignDynamicArchetypes(list);
                renderArchetypeTabs();
                parsedData = list;
                selectedAgent = null;
                updateAgentDropdown();
                runClusterDiscovery();
                renderAll();

                const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
                const isRestore = !!(opts && opts.restore);
                if (!isRestore) saveUploadedCsv(data, userMapping);
                const successMsg = isRestore
                    ? (isZh ? `已載入您上次儲存的問卷資料（${list.length} 筆）。` : `Loaded your saved survey data (${list.length} responses).`)
                    : (isZh
                        ? `✓ 成功解析並匯入 ${list.length} 筆問卷數據，AI 客群分群與歷程地圖已即時更新！`
                        : `✓ Successfully parsed and imported ${list.length} survey responses, AI clusters & journeys updated!`);
                if (typeof showPlatformNotification === 'function') {
                    showPlatformNotification(successMsg, true);
                } else {
                    alert(successMsg);
                }
            } else {
                const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
                alert(isZh ? "CSV 格式無法對應（無法識別受訪者編號或姓名欄位）" : "CSV content structure mismatch (cannot identify Respondent ID or AgentName)");
            }
        }

        // Lightweight, RFC 4180-compliant zero-dependency CSV parser fallback
        function parseCSVString(text) {
            if (!text) return { data: [], meta: { fields: [] } };
            if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
            const lines = [];
            let row = [];
            let inQuotes = false;
            let field = '';
            const len = text.length;

            for (let i = 0; i < len; i++) {
                const c = text[i];
                const next = (i + 1 < len) ? text[i + 1] : '';

                if (inQuotes) {
                    if (c === '"') {
                        if (next === '"') {
                            field += '"';
                            i++;
                        } else {
                            inQuotes = false;
                        }
                    } else {
                        field += c;
                    }
                } else {
                    if (c === '"') {
                        inQuotes = true;
                    } else if (c === ',') {
                        row.push(field.trim());
                        field = '';
                    } else if (c === '\r') {
                        if (next === '\n') i++;
                        row.push(field.trim());
                        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
                            lines.push(row);
                        }
                        row = [];
                        field = '';
                    } else if (c === '\n') {
                        row.push(field.trim());
                        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
                            lines.push(row);
                        }
                        row = [];
                        field = '';
                    } else {
                        field += c;
                    }
                }
            }
            if (field !== '' || row.length > 0) {
                row.push(field.trim());
                if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
                    lines.push(row);
                }
            }

            if (lines.length === 0) return { data: [], meta: { fields: [] } };

            const headers = lines[0].map(h => h.replace(/^﻿/, '').trim());
            const data = [];
            for (let r = 1; r < lines.length; r++) {
                const line = lines[r];
                if (line.length === 1 && line[0] === '') continue;
                const rowObj = {};
                for (let c = 0; c < headers.length; c++) {
                    const h = headers[c];
                    let val = line[c] !== undefined ? line[c] : '';
                    if (/^-?\d+(\.\d+)?$/.test(val)) {
                        val = Number(val);
                    }
                    rowObj[h] = val;
                }
                data.push(rowObj);
            }
            return { data, meta: { fields: headers } };
        }

        function tryNativeFileReader(file, onSuccess, onError) {
            try {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const text = e.target.result;
                        const parsed = parseCSVString(text);
                        onSuccess(parsed);
                    } catch(err) {
                        if (onError) onError(err);
                    }
                };
                reader.onerror = function(err) {
                    if (onError) onError(err);
                };
                reader.readAsText(file, 'utf-8');
            } catch(e) {
                if (onError) onError(e);
            }
        }

        // Process file upload with high resilience, fallback parsing & user feedback
        function processCSV(file, userMapping = null, options = {}) {
            if (!file) {
                if (typeof hideCsvLoading === 'function') hideCsvLoading();
                return;
            }
            
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const fileName = file.name || 'uploaded.csv';

            // Ensure loading overlay is displayed with clear messaging
            if (typeof showCsvLoading === 'function') {
                showCsvLoading(
                    isZh ? '正在解析與比對 CSV 數據...' : 'Processing & Matching CSV Data...',
                    isZh ? `正在讀取 ${fileName} 並比對問卷架構維度...` : `Reading ${fileName} & matching columns against active schema dimensions...`
                );
            }

            const onParsedSuccess = function(parsedResults) {
                if (!parsedResults || !parsedResults.data || parsedResults.data.length === 0) {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    alert(isZh ? 'CSV 檔案為空或無法解析。' : 'CSV file is empty or cannot be parsed.');
                    return;
                }
                window.__currentCsvFileName = fileName;
                const headers = parsedResults.meta?.fields || (parsedResults.data && parsedResults.data[0] ? Object.keys(parsedResults.data[0]) : []);
                window.__pendingCsvFile = {
                    fileName: fileName,
                    data: parsedResults.data || [],
                    headers: headers
                };

                if (userMapping || options.skipMappingModal) {
                    if (typeof updateCsvLoading === 'function') {
                        updateCsvLoading(isZh ? '正在進行 AI 分群與視覺化更新...' : 'Running AI clustering & updating dashboard...');
                    }
                    setTimeout(() => {
                        executeCSVDataProcessing(parsedResults.data, userMapping);
                        if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    }, 40);
                    return;
                }

                // Detect domain & target fields
                const sampleRow = parsedResults.data[0] || {};
                const headerKeys = Object.keys(sampleRow).join(' ').toLowerCase();
                if (headerKeys.includes('policyholder') || headerKeys.includes('discovery') || headerKeys.includes('claims') || headerKeys.includes('product_familiarity') || headerKeys.includes('policy_type')) {
                    window.currentJourneyDomain = 'policyholder';
                } else if (headerKeys.includes('agent') || headerKeys.includes('scheduling') || headerKeys.includes('policysales') || headerKeys.includes('underwriting')) {
                    window.currentJourneyDomain = 'agent';
                }
                const domain = window.currentJourneyDomain || 'agent';
                const domainSelect = document.getElementById('domain-select');
                if (domainSelect) domainSelect.value = domain;
                updateClusterFeatures();

                const schema = (typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null) || 
                               ((typeof JOURNEY_SCHEMAS !== 'undefined') ? (JOURNEY_SCHEMAS[domain] || JOURNEY_SCHEMAS.agent) : null);
                const targets = getSchemaTargetFields(schema);
                let mappedCount = 0;
                const autoMapping = {};
                targets.forEach(t => {
                    const match = findBestMatchingCsvHeader(t, headers);
                    if (match) {
                        mappedCount++;
                        autoMapping[t.key] = match;
                    }
                });

                const totalCount = targets.length;
                const matchPct = totalCount > 0 ? Math.round((mappedCount / totalCount) * 100) : 0;
                const unmatchPct = 100 - matchPct;

                // Requirement: If the data is less than a 100% match, show "Review" instead of populating data and running AI cluster
                if (matchPct === 100) {
                    if (typeof updateCsvLoading === 'function') {
                        const nRows = (parsedResults && parsedResults.data) ? parsedResults.data.length : 0;
                        updateCsvLoading(isZh ? '維度 100% 完全相符！正在執行 AI 分群與視覺化...' : `100% matched! Running AI clustering and updating dashboard${nRows ? ' (' + nRows.toLocaleString() + ' respondents' + (nRows > 3000 ? ', large file: about ' + Math.max(3, Math.round(nRows / 2500)) + ' seconds' : '') + ')' : ''}...`);
                    }
                    setTimeout(() => {
                        if (typeof closeCsvMappingModal === 'function') closeCsvMappingModal();
                        executeCSVDataProcessing(parsedResults.data, autoMapping);
                        if (typeof hideCsvLoading === 'function') hideCsvLoading();
                        const toastMsg = isZh
                            ? '✅ 相符率：100%'
                            : '✅ Match Rate: 100%';
                        showPlatformNotification(toastMsg, false);
                    }, 40);
                } else {
                    // Less than 100% match: DO NOT populate data and DO NOT run AI cluster.
                    // Instead of displaying a toast, display a dialogue on a transparent screen with two buttons: Close and Review.
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    window.userUploadedCustomFile = false; // Do not populate data on platform
                    if (typeof dismissPlatformNotification === 'function') {
                        dismissPlatformNotification();
                    }
                    if (typeof showMappingReviewDialog === 'function') {
                        showMappingReviewDialog(matchPct);
                    }
                }
            };

            const onParsedError = function(err) {
                console.warn("Primary CSV parse failed, attempting native FileReader fallback:", err);
                tryNativeFileReader(file, onParsedSuccess, function(fallbackErr) {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    alert(isZh 
                        ? `CSV 讀取失敗: ${fallbackErr && fallbackErr.message ? fallbackErr.message : fallbackErr}` 
                        : `Failed to read CSV: ${fallbackErr && fallbackErr.message ? fallbackErr.message : fallbackErr}`);
                });
            };

            // Lazy-load PapaParse on demand, then parse (with FileReader fallback)
            var parseWithPapaOrNative = function() {
                if (typeof Papa !== 'undefined' && typeof Papa.parse === 'function') {
                    try {
                        Papa.parse(file, {
                            header: true,
                            dynamicTyping: true,
                            skipEmptyLines: true,
                            complete: function(results) {
                                if (results.errors && results.errors.length > 0 && (!results.data || results.data.length === 0)) {
                                    onParsedError(results.errors[0]);
                                } else {
                                    onParsedSuccess(results);
                                }
                            },
                            error: onParsedError
                        });
                    } catch(e) {
                        onParsedError(e);
                    }
                } else {
                    tryNativeFileReader(file, onParsedSuccess, onParsedError);
                }
            };

            if (typeof Papa === 'undefined' && typeof window.loadScriptAsync === 'function') {
                window.loadScriptAsync('papaparse.min.js').then(parseWithPapaOrNative).catch(function(err) {
                    console.warn('Could not load papaparse.min.js asynchronously, falling back to FileReader:', err);
                    parseWithPapaOrNative();
                });
            } else {
                parseWithPapaOrNative();
            }
        }

