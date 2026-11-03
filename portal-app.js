
        function detectInitialLanguage() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const l = urlParams.get('lang');
                if (l) return (l.toLowerCase().startsWith('zh') || l.toLowerCase() === 'mandarin') ? 'zh' : 'en';
                const saved = localStorage.getItem('portal_lang');
                if (saved) return saved === 'zh' ? 'zh' : 'en';
                if (navigator.language && navigator.language.toLowerCase().startsWith('zh')) return 'zh';
            } catch (e) {}
            return 'en';
        }

        window.toggleDontShowVideo = function (checked) {
            try {
                if (checked) {
                    localStorage.setItem('quan_persona_dont_show_video', 'true');
                } else {
                    localStorage.removeItem('quan_persona_dont_show_video');
                }
            } catch (e) {}
        };
/* quan-persona - Core Application Module */
// State management, I18N, schema builder, view renderers, charts, and lazy script loader

// Lazy script loading helper
const _loadedScripts = new Set();
function loadScriptAsync(src) {
    if (_loadedScripts.has(src) || (typeof document !== 'undefined' && document.querySelector('script[src*="' + src + '"]'))) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => {
            _loadedScripts.add(src);
            resolve();
        };
        s.onerror = (e) => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
    });
}
window.loadScriptAsync = loadScriptAsync;

// Core shared global variables
var parsedData = [];
var radarChartInstance = null;
var pieChartInstance = null;
var activePersona = 'c0';
var activeStageIndex = 0;
var activeSection = 'personas';
var donutChartInstance = null;
var analyticsAllWorkChartInstance = null;
var selectedAgent = null;
var activeSubFilter = "ALL";
var demographicsCollapsed = true;

window.parsedData = parsedData;
window.activePersona = activePersona;
window.activeSection = activeSection;


        // ==================== I18N SYSTEM ====================
        let currentLang = 'en';
        // Use existing currentJourneyDomain from journey_schemas_modular.js without re-declaring
        if (typeof window !== 'undefined') {
            window.currentJourneyDomain = window.currentJourneyDomain || (typeof currentJourneyDomain !== 'undefined' ? currentJourneyDomain : 'agent');
        }

        const TRANSLATIONS = {
            en: {
                portalTitle: "Agent Persona & Sales Journey Analytics Platform",
                customizeSchema: "Customise Schema",
                schemaBuilderModalTitle: "Change Modular Questionnaire & Measurement Schema Designer",
                schemaBuilderModalSubtitle: "Configure questions, competency scales, and journey stages. Saving immediately updates the analytics platform measurements.",
                openInNewWindow: "Open in Dedicated Window",
                schemaBuilderTitle: "Change Modular Questionnaire & Measurement Schema Designer",
                schemaBuilderDesc: "Design your questionnaire template — configure background demographics, competency rating scales, and journey stages. When saved, all settings reflect directly across the platform and the downloadable questionnaire module.",
                loadPreset: "Load Preset:",
                targetAudienceName: "TARGET AUDIENCE & QUESTIONNAIRE NAME",
                schemaKeyLabel: "SCHEMA IDENTIFIER",
                schemaIntroLabel: "QUESTIONNAIRE INSTRUCTIONS & BRIEFING (Printed at Top)",
                selectSectionsTitle: "Questionnaire Sections to Include in Template:",
                sectionsRenumberHint: "Questions & sections renumber dynamically",
                secToggleDemo: "Part I: Demographic Questions",
                secToggleTags: "Part II: Self-Image",
                secToggleDim: "Part III: Current Status",
                secToggleWork: "Part IV: Expectation",
                secToggleJourney: "Part V: Journey Map",
                secIncludedBadge: "Included in Questionnaire",
                secExcludedBadge: "Excluded from Questionnaire",
                demographicsSectionTitle: "Part I: Demographic Questions",
                part1TitleLabel: "Part I Section Title:",
                addDemographicBtn: "+ Add Question",
                tagsSectionTitle: "Part II: Self-Image",
                part2TitleLabel: "Part II Section Title:",
                dimensionSectionTitle: "Part III: Current Status",
                part3TitleLabel: "Part III Section Title:",
                workstylesSectionTitle: "Part IV: Expectation",
                part4TitleLabel: "Part IV Section Title:",
                stageSectionTitle: "Part V: Journey Map",
                part5TitleLabel: "Part V Section Title:",
                selfImageTagsLabel: "SELF-IMAGE ARCHETYPE TAGS (Comma-separated list):",
                addSelfImageArchetypeTags: "Add Self-Image Archetype Tags",
                dailyWorkItemsLabel: "DAILY WORK CONTENT ITEMS (a to j, one per line):",
                personalToolsLabel: "PERSONAL TOOLS & WORKAROUNDS (One per line):",
                coreNeedsLabel: "CRITICAL CORE NEEDS & EXPECTATIONS (One per line):",
                downloadQuestionnaire: "Download Questionnaire (Printable)",
                downloadMatchingCSV: "CSV Template",
                saveSchema: "Save",
                applySchema: "Apply Schema",
                saveAndApplySchema: "Save & Apply Schema",
                portalSubtitle: "Upload survey data to dynamically discover agent behaviour clusters, pain points, and system optimisation directions at each sales stage — cluster count and character are data-driven, not predefined",
                uploadCSV: "Upload CSV Document",
                csvColumnMapping: "Column Mapping",
                restoreDefaultData: "Restore Default Data",
                downloadPersona: "Download This Persona's Data",
                questionnaireTemplate: "Download Questionnaire Template",
                tourBtn: "Tutorial",
                dataMenu: "Data",
                railPin: "Keep open",
                copyrightLine1: "2026 quan-persona.",
                copyrightLine2: "All rights reserved.",
                copyrightLine3: "Client-Side Privacy",
                copyrightLine4: "Assured",
                copyrightTitle: "2026 quan-persona",
                copyrightPrivacy: "Privacy Assured",
                langMenu: "Language",
                clusterViewRadar: "Radar",
                clusterViewTable: "Table",
                csvGuide: "CSV Column Guide",
                navPersonas: "Persona Dashboard",
                navJourneys: "Journey Map",
                navAnalytics: "Analytics & DB",
                navAbout: "About",
                navFaq: "FAQ",
                journeySwipeHint: "Swipe horizontally to explore all 6 sales journey stages & emotional curve",
                emotionalCurveTitle: "Emotional Journey Curve",
                highSat: "High Satisfaction",
                medSat: "Medium Satisfaction",
                sigPain: "Significant Pain Points",
                clusterDiscoveryTitle: "AI Data-Driven Cluster Discovery",
                clusterDiscoveryDesc: "This section uses the K-means algorithm to group similar agents based on multi-dimensional skill and satisfaction ratings from the survey data—without pre-applying tenure groups or predefined qualitative archetype definitions. It helps explore the similarities and differences between data-driven clusters and research-defined personas.",
                numClusters: "Number of Clusters (K)",
                runClustering: "Run AI Clustering",
                runningClustering: "Running K-means algorithm......",
                clusterCompleted: "Completed! Ran K-means clustering on {n} records with K={k}. Group tabs on the Persona Dashboard and Journeys page have been successfully updated to show all {k} clusters!",
                insufficientData: "⚠️ Insufficient data points for stable clustering (Currently {n} records, suggest at least {min} records, or reduce K).",
                expDistTitle: "Agent Experience Distribution",
                skillsImpactTitle: "Impact of Skills on Sales Performance (by Experience)",
                dailyWorkAvgTitle: "Daily Task Allocation (Overall Average)",
                coreConflictsCloudTitle: "Core Conflicts (Keyword Analysis)",
                coreNeedsCloudTitle: "Core Needs (Keyword Analysis)",
                mainPainsCloudTitle: "Main Pain Points (Keyword Analysis)",
                painPointsToolOppTitle: "Agent Pain Points & Tool Opportunities",
                catSales: "Sales Pitch Communication",
                catRelations: "Customer Relationship Management",
                catTools: "Digital Tool Familiarity",
                catKnowledge: "Insurance Knowledge",
                catOther: "Device/System Familiarity",
                keywordCloudTitle: "Keyword Analysis Cloud",
                verbatimQuotesTitle: "Agent Pain Points: Verbatim Quotes",
                businessOppTitle: "Business & Marketing Tool Opportunities",
                sup: "System Utility Perception (SUP)",
                wp: "Touchpoint Use (TU)",
                ar: "Abandonment and Rework Rate (AR)",
                pr: "Human-Assist Reliance (PR)",
                clusteringBasis: "Clustering Classification Basis",
                demographicProfile: "Demographic Profile",
                sampleSize: "Sample Size: {n} responses",
                expand: "Expand ▽",
                collapse: "Collapse △",
                primaryLocation: "Primary Service Location (%)",
                respondentPosition: "Respondent Position/Title (#)",
                ageDist: "Age Range Distribution (%)",
                clientScale: "Scale of Customers Served (%)",
                noData: "No Data",
                titlePrefix: "Title:",
                enterPersonaName: "Enter persona name...",
                enterPersonaDesc: "Type To Change Persona Description",
                save: "Save",
                saveDesc: "Save Description",
                age: "Age",
                experience: "Insurance Experience",
                clientsServed: "Number of Clients Served",
                systemFamiliarity: "Agent System/Tool Familiarity:",
                skillImpact: "Skill Impact on Performance",
                skillDevice: "Device/System Familiarity",
                skillKnowledge: "Insurance Knowledge",
                skillPitch: "Sales Pitch Communication",
                skillRelations: "Customer Relationship Management",
                skillTools: "Digital Tool Familiarity",
                dailyWork: "Daily Work Content",
                coreConflicts: "Core Conflicts (Keyword Analysis)",
                coreNeeds: "Core Needs (Keyword Analysis)",
                mainPains: "Main Pain Points (Keyword Analysis)",
                salesJourney: "Sales Journey",
                physicalDigitalLocation: "Physical/Digital Location",
                touchpoints: "Touchpoints / Tools / Collaborators",
                painPoints: "Pain Points",
                noLocation: "No specific location",
                noTools: "No tools / systems",
                dailyToolsTop5: "| Daily Tools (Top 5)",
                changePhoto: "Change Photo",
                enterQuote: "Enter quote...",
                agentMotto: "Agent Motto",
                coreConflictsSimple: "Core Conflicts",
                coreNeedsSimple: "Core Needs",
                executionStyle: "Execution Style:",
                avgSatisfaction: "Avg Satisfaction",
                all: "All",
                cluster: "Cluster",
                outliersNoise: "Outliers & Noise",
                unclassified: "Unclassified",
                unknownTenure: "Unknown Tenure",
                salesAgent: "Sales Agent",
                noVerbatims: "No verbatims",
                mappingModalTitle: "Survey CSV Column Mapping",
                mappingModalSubtitle: "Verify or map your uploaded CSV columns to match the active schema dimensions before running AI clustering.",
                mappingFileName: "File Name",
                mappingTotalRows: "Total Rows",
                mappingActiveSchema: "Active Schema",
                mappingMatchCoverage: "Match Coverage",
                mappingTargetDimension: "Question # & Schema Target Dimension",
                mappingCsvSource: "CSV Column Source",
                mappingSamplePreview: "Sample Preview",
                mappingStatus: "Status",
                mappingUnmappedNotice: "Unmapped dimensions will safely use neutral midpoint defaults (50 for skills, 3.0 for ratings).",
                mappingConfirmBtn: "Confirm & Run AI Clustering",
                mappingCancelBtn: "Cancel",
                mappingSkipDefault: "No Data",
                mappingMatched: "Matched",
                mappingUnmapped: "Unmatched",
                mappingPreviewNA: "N/A",
                mappingRequired: "Required",
                mappingCategoryAll: "All Fields",
                mappingCategoryIdentity: "Identity",
                mappingCategoryDemographics: "Demographics",
                mappingCategoryMetrics: "Metrics / Skills",
                mappingCategoryJourney: "Journey Stages",
                mappingCategoryQualitative: "Qualitative / Tags",
                mappingUnmatchedTab: "Unmatched ({count})",
                mappingUnmatchedSummaryTitle: "Unmatched Dimensions Summary ({count} Unmatched)",
                mappingUnmatchedSummarySubtitle: "The following dimensions did not find an auto-match in your CSV. Click any item to jump directly to its mapping row.",
                mappingMissingTargets: "Unmatched Schema Target Dimensions:",
                mappingUnusedHeaders: "Unused CSV Columns in Uploaded File:",
                mappingJumpToRow: "Click to jump to row",
                mappingRequiredBadge: "Required",
                csvLoadingTitle: "Processing & Matching CSV Data...",
                csvLoadingMessage: "Reading CSV file and matching columns against active schema dimensions...",
                csvLoadingClustering: "Running unsupervised AI clustering (K-Means & DBSCAN)...",
                csvLoadingSubhint: "Platform is running. Please wait a moment.",
                watchCommercial: "Watch Product Video",
                commercialTitle: "quan-persona — Overview",
                commercialBadge: "COMMERCIAL"
            },
            zh: {
                portalTitle: "保險業務員客群畫像與銷售旅程分析平台",
                customizeSchema: "自訂問卷架構",
                schemaBuilderModalTitle: "變更模組化問卷與量測架構設計",
                schemaBuilderModalSubtitle: "設定問題、評估量表與歷程階段。儲存後立即更新整個分析平台之數據量測與分群分析。",
                openInNewWindow: "獨立新視窗開啟",
                schemaBuilderTitle: "變更模組化問卷與量測架構設計",
                schemaBuilderDesc: "彈性設計您的問卷範本——設定背景資料題目與選項、核心衡量維度與旅程階段。儲存後將全面套用至平台與可下載的問卷模組。",
                loadPreset: "載入預設架構：",
                targetAudienceName: "目標受眾與問卷名稱",
                schemaKeyLabel: "架構代碼",
                schemaIntroLabel: "問卷說明與研究前言（問卷頂端列印內容）",
                selectSectionsTitle: "勾選欲納入問卷的區塊（可自訂移除不需要的區塊）：",
                sectionsRenumberHint: "問卷區塊與題目將自動依序編號",
                secToggleDemo: "Part I: 基本資料題",
                secToggleTags: "Part II: 自我形象",
                secToggleDim: "Part III: 現況評估",
                secToggleWork: "Part IV: 核心期待",
                secToggleJourney: "Part V: 歷程地圖",
                secIncludedBadge: "已納入問卷",
                secExcludedBadge: "未納入問卷",
                demographicsSectionTitle: "第一部分：基本資料題",
                part1TitleLabel: "第一部分區塊名稱：",
                addDemographicBtn: "＋ 新增題目",
                tagsSectionTitle: "第二部分：自我形象",
                part2TitleLabel: "第二部分區塊名稱：",
                dimensionSectionTitle: "第三部分：現況評估",
                part3TitleLabel: "第三部分區塊名稱：",
                workstylesSectionTitle: "第四部分：核心期待",
                part4TitleLabel: "第四部分區塊名稱：",
                stageSectionTitle: "第五部分：歷程地圖",
                part5TitleLabel: "第五部分區塊名稱：",
                selfImageTagsLabel: "自我形象標籤池（30 項標籤，以逗號分隔）：",
                addSelfImageArchetypeTags: "新增形象標籤組",
                dailyWorkItemsLabel: "日常工作內容項目（a 至 j，每行一項）：",
                personalToolsLabel: "常用個人工具／替代作法（每行一項）：",
                coreNeedsLabel: "系統關鍵核心需求與期待（每行一項）：",
                downloadQuestionnaire: "下載對應問卷（可列印／排版）",
                downloadMatchingCSV: "CSV 資料範本",
                saveSchema: "儲存",
                applySchema: "套用架構",
                saveAndApplySchema: "儲存並套用架構",
                portalSubtitle: "上傳問卷數據以動態探索各銷售階段業務員行為集群、痛點與系統優化方向——分群數量與特徵均由數據驅動，非預先定義",
                uploadCSV: "上傳問卷 CSV 文件",
                csvColumnMapping: "欄位對應",
                restoreDefaultData: "恢復預設數據 (CSV)",
                downloadPersona: "下載此客群畫像數據",
                questionnaireTemplate: "下載問卷範本",
                tourBtn: "導覽",
                dataMenu: "資料",
                railPin: "保持展開",
                copyrightLine1: "2026 quan-persona.",
                copyrightLine2: "版權所有",
                copyrightLine3: "本地端資料隱私",
                copyrightLine4: "安全保證",
                copyrightTitle: "2026 quan-persona",
                copyrightPrivacy: "本機端安全運算",
                langMenu: "語言",
                clusterViewRadar: "雷達圖",
                clusterViewTable: "數據表",
                csvGuide: "CSV 欄位說明",
                navPersonas: "客群畫像看板",
                navJourneys: "銷售旅程圖",
                navAnalytics: "數據分析與資料庫",
                navAbout: "關於",
                navFaq: "常見問題",
                journeySwipeHint: "可左右滑動以探索全部 6 大銷售旅程階段與情緒曲線",
                emotionalCurveTitle: "銷售旅程情緒曲線",
                highSat: "高度滿意",
                medSat: "中度滿意",
                sigPain: "顯著痛點區間",
                clusterDiscoveryTitle: "AI 數據驅動集群探索 (K-means)",
                clusterDiscoveryDesc: "本區塊採用 K-means 分群演算法，基於問卷中的多維度技能與各階段滿意度評分，自動將相似的業務員歸類——不預先依年資或既定角色定型。有助於探索客觀數據分群與質性研究客群畫像間的異同。",
                numClusters: "分群數量 (K)",
                runClustering: "執行 AI 分群",
                runningClustering: "正在執行 K-means 分群演算法......",
                clusterCompleted: "完成！已對 {n} 筆問卷數據執行 K={k} 的 K-means 分群。客群畫像看板與旅程圖之分群標籤已成功更新為 {k} 群！",
                insufficientData: "⚠️ 數據量不足以進行穩定分群 (目前 {n} 筆，建議至少 {min} 筆以上再執行，或降低 K 值)。",
                expDistTitle: "業務員年資分佈",
                skillsImpactTitle: "各年資組別技能對業務績效之影響",
                dailyWorkAvgTitle: "每日工作任務佔比 (整體平均)",
                coreConflictsCloudTitle: "核心矛盾與阻礙 (關鍵字分析)",
                coreNeedsCloudTitle: "核心期望需求 (關鍵字分析)",
                mainPainsCloudTitle: "主要痛點挑戰 (關鍵字分析)",
                painPointsToolOppTitle: "業務員痛點分析與工具切入機會",
                catSales: "話術銷售溝通",
                catRelations: "客戶關係經營",
                catTools: "數位工具熟悉度",
                catKnowledge: "專業保險知識",
                catOther: "裝置系統熟稔度",
                keywordCloudTitle: "關鍵字分析文字雲",
                verbatimQuotesTitle: "業務員痛點原音摘要",
                businessOppTitle: "商務與行銷工具拓展契機",
                sup: "系統效用感知 (SUP)",
                wp: "接觸點使用度 (TU)",
                ar: "放棄與重工率 (AR)",
                pr: "人力協助依賴度 (PR)",
                clusteringBasis: "分群歸類判定依據",
                demographicProfile: "人口統計特徵",
                sampleSize: "樣本數：{n} 份問卷",
                expand: "展開 ▽",
                collapse: "收合 △",
                primaryLocation: "主要服務地區 (%)",
                respondentPosition: "職級分佈 (#)",
                ageDist: "年齡區間分佈 (%)",
                clientScale: "服務客戶規模 (%)",
                noData: "暫無數據",
                titlePrefix: "職稱：",
                enterPersonaName: "輸入客群畫像名稱...",
                enterPersonaDesc: "輸入以修改客群描述...",
                save: "儲存",
                saveDesc: "儲存描述",
                age: "年齡區間",
                experience: "保險從業年資",
                clientsServed: "服務客戶人數",
                systemFamiliarity: "業務員系統工具熟稔度：",
                skillImpact: "技能對績效之影響程度",
                skillDevice: "裝置系統操作熟悉度",
                skillKnowledge: "專業保險產品條款知識",
                skillPitch: "銷售訪談溝通話術能力",
                skillRelations: "客戶關係經營維護能力",
                skillTools: "數位工具熟悉度",
                dailyWork: "每日工作內容佔比",
                coreConflicts: "核心矛盾與阻礙 (關鍵字分析)",
                coreNeeds: "核心期望需求 (關鍵字分析)",
                mainPains: "主要痛點挑戰 (關鍵字分析)",
                salesJourney: "銷售歷程階段",
                physicalDigitalLocation: "實體 / 數位場域",
                touchpoints: "接觸點 / 工具 / 協同對象",
                painPoints: "遭遇痛點與卡點",
                noLocation: "無特定場域",
                noTools: "無特定工具系統",
                dailyToolsTop5: "| 每日常用工具 (前 5 名)",
                changePhoto: "更換照片",
                enterQuote: "輸入代表性語錄...",
                agentMotto: "業務員心聲與座右銘",
                coreConflictsSimple: "核心矛盾與阻礙",
                coreNeedsSimple: "核心期望需求",
                executionStyle: "執行風格：",
                avgSatisfaction: "平均滿意度",
                all: "全部",
                cluster: "分群",
                outliersNoise: "離群值與極端樣本",
                unclassified: "未分群",
                unknownTenure: "年資不詳",
                salesAgent: "業務代表",
                noVerbatims: "暫無原音引言",
                mappingModalTitle: "問卷資料 CSV 欄位對應確認",
                mappingModalSubtitle: "在執行 AI 分群前，請檢視或自訂您的 CSV 欄位與問卷架構維度的對應關係。",
                mappingFileName: "檔案名稱",
                mappingTotalRows: "資料總筆數",
                mappingActiveSchema: "當前問卷架構",
                mappingMatchCoverage: "欄位對應覆蓋率",
                mappingTargetDimension: "問卷題號與架構目標維度",
                mappingCsvSource: "CSV 來源欄位",
                mappingSamplePreview: "樣本預覽",
                mappingStatus: "狀態",
                mappingUnmappedNotice: "未對應之維度將自動採用安全中位預設值（技能 50 分、評分 3.0 分），確保分群穩定無異常值。",
                mappingConfirmBtn: "確認對應並執行 AI 分群",
                mappingCancelBtn: "取消",
                mappingSkipDefault: "無資料 (No Data)",
                mappingMatched: "已對應",
                mappingUnmapped: "未對應 (Unmatched)",
                mappingPreviewNA: "N/A",
                mappingRequired: "必填",
                mappingCategoryAll: "全部欄位",
                mappingCategoryIdentity: "識別代碼",
                mappingCategoryDemographics: "人口統計學",
                mappingCategoryMetrics: "核心衡量指標",
                mappingCategoryJourney: "旅程階段評分",
                mappingCategoryQualitative: "質化與標籤",
                mappingUnmatchedTab: "未對應維度 ({count})",
                mappingUnmatchedSummaryTitle: "未對應維度明細摘要（共 {count} 項未對應）",
                mappingUnmatchedSummarySubtitle: "以下問卷架構維度未在您的 CSV 中找到自動相符欄位。點擊任一名稱可直接跳轉至該列進行設定。",
                mappingMissingTargets: "未對應之問卷架構維度：",
                mappingUnusedHeaders: "上傳檔案中尚未被使用的 CSV 欄位：",
                mappingJumpToRow: "點擊跳轉至設定列",
                mappingRequiredBadge: "必填",
                csvLoadingTitle: "正在解析與比對 CSV 數據...",
                csvLoadingMessage: "正在讀取 CSV 檔案並比對架構維度...",
                csvLoadingClustering: "正在執行非監督式 AI 分群演算法（K-Means 與 DBSCAN）...",
                csvLoadingSubhint: "系統運算中，請稍候...",
                watchCommercial: "觀看產品介紹影片",
                commercialTitle: "quan-persona — 平台介紹",
                commercialBadge: "產品介紹"
            }
        };

        const JOURNEY_STAGE_TITLES = {
            en: [
                "Scheduling & Client Relations",
                "Signing/Policy",
                "Insurance Submission",
                "Post-Sales Service",
                "Administrative & Team Support",
                "Training & Learning"
            ],
            zh: [
                "排程與客戶關係維護",
                "保單銷售與說明",
                "核保與送件進案",
                "售後保全與理賠服務",
                "行政與團隊支援工作",
                "專業知識學習與培育"
            ]
        };

        function t(key, params = {}) {
            const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
            let str = dict[key] || (TRANSLATIONS.en[key] || key);
            for (const [k, v] of Object.entries(params)) {
                str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
            }
            return str;
        }

        function toggleLanguage() {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            try { localStorage.setItem('portal_lang', currentLang); } catch (e) {}
            applyLanguage(currentLang);
        }

        function applyLanguage(lang) {
            const doApplyLang = function() {
            currentLang = lang;
            const isZh = (currentLang === 'zh');
            document.documentElement.setAttribute('data-lang', isZh ? 'zh' : 'en');

            // Sanitize active schema if switching to English and polluted with Chinese
            if (!isZh && typeof getActiveJourneySchema === 'function') {
                const activeSchema = getActiveJourneySchema();
                if (activeSchema && (activeSchema.id === 'agent' || activeSchema.id === 'policyholder' || activeSchema.id === 'patient')) {
                    if (/[\u4e00-\u9fff]/.test(activeSchema.name || '')) {
                        if (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[activeSchema.id]) {
                            JOURNEY_SCHEMAS[activeSchema.id] = JSON.parse(JSON.stringify(DEFAULT_JOURNEY_SCHEMAS[activeSchema.id]));
                        }
                    }
                }
            }

            const enLabel = document.getElementById('lang-en-label');
            const zhLabel = document.getElementById('lang-zh-label');
            const langBtn = document.getElementById('lang-toggle-btn');
            if (langBtn) {
                langBtn.removeAttribute('title');
            }
            if (enLabel && zhLabel) {
                if (isZh) {
                    zhLabel.textContent = '繁中';
                    zhLabel.style.background = 'var(--accent-yellow)';
                    zhLabel.style.color = '#1a1d20';
                    enLabel.style.background = 'transparent';
                    enLabel.style.color = 'var(--text-secondary)';
                } else {
                    zhLabel.textContent = 'ZH';
                    enLabel.style.background = 'var(--accent-yellow)';
                    enLabel.style.color = '#1a1d20';
                    zhLabel.style.background = 'transparent';
                    zhLabel.style.color = 'var(--text-secondary)';
                }
            }
            
            // Update all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key && TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
                    el.innerHTML = TRANSLATIONS[currentLang][key];
                }
            });

            const railCopyright = document.getElementById('rail-copyright');
            if (railCopyright) {
                railCopyright.removeAttribute('title');
            }

            const brandCell = document.getElementById('brand-cell');
            if (brandCell) {
                brandCell.removeAttribute('title');
                brandCell.removeAttribute('aria-label');
            }
            const commTitle = document.getElementById('commercial-video-title');
            if (commTitle) {
                commTitle.textContent = isZh ? 'quan-persona — 平台介紹' : 'quan-persona — Overview';
            }
            const commBadge = document.getElementById('commercial-video-badge');
            if (commBadge) {
                commBadge.textContent = isZh ? '產品介紹' : 'COMMERCIAL';
            }


            // Automatically switch dataset between English and Traditional Chinese (if user has not manually uploaded a custom file)
            if (!window.userUploadedCustomFile) {
                if (currentJourneyDomain === 'policyholder') {
                    if (typeof POLICYHOLDER_PRE_LOADED_DATA !== 'undefined' && POLICYHOLDER_PRE_LOADED_DATA.length > 0) {
                        parsedData = POLICYHOLDER_PRE_LOADED_DATA;
                    }
                } else {
                    if (currentLang === 'zh' && typeof PRE_LOADED_DATA_ZH !== 'undefined' && PRE_LOADED_DATA_ZH.length > 0) {
                        parsedData = PRE_LOADED_DATA_ZH;
                    } else if (typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) {
                        parsedData = PRE_LOADED_DATA;
                    }
                }
                updateClusterFeatures();
                assignDynamicArchetypes(parsedData);
                runClusterDiscovery();
            } else {
                updateClusterFeatures();
            }

            // Sync schema-driven titles and subtitles
            if (typeof getActiveJourneySchema === 'function') {
                const schema = getActiveJourneySchema();
                const isZh = (currentLang === 'zh');
                const titleEl = document.querySelector('[data-i18n="portalTitle"]');
                if (titleEl) {
                    if (schema.id === 'agent' || !schema.id) {
                        titleEl.textContent = isZh ? t('portalTitle') : "Agent Persona & Sales Journey Analytics Platform";
                    } else if (isZh) {
                        titleEl.textContent = `${schema.nameZh || schema.name} 分析平台 (V.2)`;
                    } else {
                        let engName = (schema.name && !/[\u4e00-\u9fff]/.test(schema.name)) 
                            ? schema.name 
                            : ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema.id]?.name) || "Sales Journey");
                        titleEl.textContent = `${engName} Analytics Platform (V.2)`;
                    }
                }
                const subtitleEl = document.querySelector('[data-i18n="portalSubtitle"]');
                if (subtitleEl) {
                    if (currentJourneyDomain === 'policyholder') {
                        subtitleEl.textContent = isZh 
                            ? '分析保戶問卷數據，動態辨識保戶客群人物誌、各服務階段（從商品探索到理賠續保）的痛點與數位自助優化方向'
                            : 'Upload policyholder survey data to dynamically discover customer behaviour clusters, friction points across touchpoints (from discovery to claims), and self-service digital optimisation opportunities';
                    } else {
                        subtitleEl.textContent = isZh
                            ? '上傳問卷數據，動態探索不同銷售階段之業務員行為分群、痛點與系統優化方向——分群數量與特徵由數據驅動'
                            : 'Upload survey data to dynamically discover agent behaviour clusters, pain points, and system optimisation directions at each sales stage — cluster count and character are data-driven, not predefined';
                    }
                }
            }

            // Re-render UI views
            updateDomainSelectOptions();
            renderArchetypeTabs();
            renderSubFilters();
            renderDemographics();

            const p1Hint = document.getElementById('part1-subtitle-hint');
            if (p1Hint) p1Hint.textContent = isZh ? '（基本資料題）' : '(demographic questions)';
            const p2Hint = document.getElementById('part2-subtitle-hint');
            if (p2Hint) p2Hint.textContent = isZh ? '（自我形象）' : '(Self-Image)';
            
            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            } else if (activeSection === 'analytics') {
                renderAnalyticsView();
            }
            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }    };

            if (lang === 'zh' && currentJourneyDomain === 'agent' && (typeof PRE_LOADED_DATA_ZH === 'undefined' || !PRE_LOADED_DATA_ZH.length) && typeof window.loadScriptAsync === 'function') {
                if (typeof showCsvLoading === 'function') {
                    showCsvLoading('載入中文資料庫...', '正在載入繁體中文問卷數據...');
                }
                window.loadScriptAsync('survey_data_zh_2500.js').then(() => {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    doApplyLang();
                }).catch(err => {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    console.error('Failed to load Chinese dataset:', err);
                    doApplyLang();
                });
            } else {
                doApplyLang();
            }
        }

        function openQuestionnaireTemplate() {
            downloadCurrentQuestionnaire();
        }

        // V.2 Dynamic Multi-Domain Journey Switcher (Universal Approach B)
        function switchJourneyDomain(domain) {
            const doSwitch = function() {
            currentJourneyDomain = domain;
            const domainSelect = document.getElementById('domain-select');
            if (domainSelect) domainSelect.value = domain;
            window.userUploadedCustomFile = false; // Reset to domain pre-loaded synthetic responses

            const customStored = (function() {
                try {
                    return JSON.parse(localStorage.getItem('portal_custom_schemas') || '{}');
                } catch(e) { return {}; }
            })();
            const isCustomized = !!customStored[currentJourneyDomain] || window.__customSchemaApplied;

            if (currentJourneyDomain === 'policyholder' && !isCustomized) {
                if (typeof POLICYHOLDER_PRE_LOADED_DATA !== 'undefined' && POLICYHOLDER_PRE_LOADED_DATA.length > 0) {
                    parsedData = POLICYHOLDER_PRE_LOADED_DATA;
                }
            } else if (currentJourneyDomain === 'agent' && !isCustomized) {
                if (currentLang === 'zh' && typeof PRE_LOADED_DATA_ZH !== 'undefined' && PRE_LOADED_DATA_ZH.length > 0) {
                    parsedData = PRE_LOADED_DATA_ZH;
                } else if (typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) {
                    parsedData = PRE_LOADED_DATA;
                }
            } else {
                const schema = getActiveJourneySchema();
                parsedData = generateSyntheticDataForSchema(schema, 1000);
            }

            updateClusterFeatures();

            const schema = getActiveJourneySchema();
            const isZh = (currentLang === 'zh');
            
            const titleEl = document.querySelector('[data-i18n="portalTitle"]');
            if (titleEl) {
                if (schema.id === 'agent' || !schema.id) {
                    titleEl.textContent = isZh ? t('portalTitle') : "Agent Persona & Sales Journey Analytics Platform";
                } else if (isZh) {
                    titleEl.textContent = `${schema.nameZh || schema.name} 分析平台 (V.2)`;
                } else {
                    let engName = (schema.name && !/[\u4e00-\u9fff]/.test(schema.name)) 
                        ? schema.name 
                        : ((typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema.id]?.name) || "Sales Journey");
                    titleEl.textContent = `${engName} Analytics Platform (V.2)`;
                }
            }
            const subtitleEl = document.querySelector('[data-i18n="portalSubtitle"]');
            if (subtitleEl) {
                if (currentJourneyDomain === 'policyholder') {
                    subtitleEl.textContent = isZh 
                        ? '分析保戶問卷數據，動態辨識保戶客群人物誌、各服務階段（從商品探索到理賠續保）的痛點與數位自助優化方向'
                        : 'Upload policyholder survey data to dynamically discover customer behaviour clusters, friction points across touchpoints (from discovery to claims), and self-service digital optimisation opportunities';
                } else {
                    subtitleEl.textContent = isZh
                        ? '上傳問卷數據，動態探索不同銷售階段之業務員行為分群、痛點與系統優化方向——分群數量與特徵由數據驅動'
                        : 'Upload survey data to dynamically discover agent behaviour clusters, pain points, and system optimisation directions at each sales stage — cluster count and character are data-driven, not predefined';
                }
            }

            selectedAgent = null;
            activeSubFilter = 'ALL';

            if (parsedData && parsedData.length > 0) {
                assignDynamicArchetypes(parsedData);
                runClusterDiscovery();
            }

            renderArchetypeTabs();
            renderSubFilters();
            renderDemographics();

            const p1Hint = document.getElementById('part1-subtitle-hint');
            if (p1Hint) p1Hint.textContent = isZh ? '（基本資料題）' : '(demographic questions)';
            const p2Hint = document.getElementById('part2-subtitle-hint');
            if (p2Hint) p2Hint.textContent = isZh ? '（自我形象）' : '(Self-Image)';

            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            } else if (activeSection === 'analytics') {
                renderAnalyticsView();
            }
            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }    };

            if (domain === 'policyholder' && (typeof POLICYHOLDER_PRE_LOADED_DATA === 'undefined' || !POLICYHOLDER_PRE_LOADED_DATA.length) && typeof window.loadScriptAsync === 'function') {
                if (typeof showCsvLoading === 'function') {
                    showCsvLoading(
                        (typeof currentLang !== 'undefined' && currentLang === 'zh') ? '正在載入保戶旅程資料庫...' : 'Loading Policyholder Dataset...',
                        (typeof currentLang !== 'undefined' && currentLang === 'zh') ? '正在載入 2,500 筆保戶問卷數據...' : 'Loading 2,500 policyholder survey responses...'
                    );
                }
                window.loadScriptAsync('policyholder_data_2500.js').then(() => {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    doSwitch();
                }).catch(err => {
                    if (typeof hideCsvLoading === 'function') hideCsvLoading();
                    console.error('Failed to load policyholder dataset:', err);
                    doSwitch();
                });
            } else {
                doSwitch();
            }
        }

        // Set Chart.js global text colour to white
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = '#ffffff';
        }


        // Global variables
        var parsedData = [];
        var radarChartInstance = null;
        var pieChartInstance = null;
        var activePersona = 'c0'; // placeholder until assignDynamicArchetypes() runs and renderArchetypeTabs() sets the real first key
        var activeStageIndex = 0;
        var activeSection = 'personas'; // 'personas', 'journeys', 'analytics'
        var donutChartInstance = null;
        var analyticsAllWorkChartInstance = null;
        var selectedAgent = null;
        var activeSubFilter = "ALL";
        var demographicsCollapsed = true;

        // Sub-filters (previously split each fixed archetype into tenure sub-bands) have been
        // removed -- tenure bands are not a meaningful sub-division of a data-driven cluster.
        // renderSubFilters() below now always keeps the sub-filter bar hidden.
        const SUB_FILTER_OPTIONS = {};

        function getActiveGroupAgents() {
            let list = parsedData;
            if (activePersona !== 'all') {
                list = list.filter(d => d.archetype === activePersona);
            }
            if (activeSubFilter && activeSubFilter !== "ALL") {
                const normalize = (s) => String(s || '')
                    .replace(/\s+/g, '')
                    .replace(/[–—~～]/g, '-')
                    .trim();
                
                const filterClean = normalize(activeSubFilter);
                list = list.filter(d => {
                    const expClean = normalize(d.Experience);
                    return expClean.includes(filterClean);
                });
            }
            return list;
        }

        // Global manual overrides to preserve edits on the dashboard
        let manualOverrides = {
            all: { name: '', desc: '', photo: '', quote: '' }
        };
        // Dynamic cluster keys (c0, c1, ...) aren't known in advance, so ensure an entry
        // exists on first access rather than pre-declaring a fixed set of 5.
        function ensureManualOverride(key) {
            if (!manualOverrides[key]) manualOverrides[key] = { name: '', desc: '', photo: '', quote: '' };
            return manualOverrides[key];
        }

        function showSaveButton(field) {
            const btn = document.getElementById(`save-btn-${field}`);
            if (btn) {
                btn.style.display = 'inline-block';
            }
        }

        function saveManuallyEnteredValues() {
            const nameVal = document.getElementById('edit-name') ? document.getElementById('edit-name').value : '';
            const descVal = document.getElementById('edit-desc') ? document.getElementById('edit-desc').value : '';
            const quoteVal = document.getElementById('edit-quote') ? document.getElementById('edit-quote').value : '';
            
            const ov = ensureManualOverride(activePersona);
            ov.name = nameVal;
            ov.desc = descVal;
            ov.quote = quoteVal;
            
            // Hide all buttons
            document.querySelectorAll('[id^="save-btn-"]').forEach(btn => {
                btn.style.display = 'none';
            });
            
            renderPersonaView();
            renderArchetypeTabs();
            if (window.parsedData && window.parsedData.length > 0) {
                initAnalyticsRadarChart();
                renderClusterDiscovery();
            }
        }

        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    ensureManualOverride(activePersona).photo = e.target.result;
                    // Update the image src on-screen immediately
                    const img = document.querySelector('.p-portrait-img');
                    if (img) img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        function updateAgentDropdown() {
            const select = document.getElementById('agent-select');
            if (!select) return;
            select.innerHTML = '<option value="">-- Default Archetype Persona --</option>';
            
            const groups = { explorer: [], expert: [], optimizer: [], skeptic: [], parttimer: [] };
            parsedData.forEach(d => {
                if (groups[d.archetype]) groups[d.archetype].push(d.name);
            });
            
            const groupNames = {
                explorer: '01 | Under 1 year & 1–3 years',
                expert: '02 | 3–5 years & 6–10 years',
                optimizer: '03 | 10–15 years & 16–20 years',
                skeptic: '04 | 20–25 years & 26–30 years',
                parttimer: '05 | 30+ years'
            };
            
            for (const key in groups) {
                if (groups[key].length > 0) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = groupNames[key];
                    groups[key].forEach(name => {
                        const opt = document.createElement('option');
                        opt.value = name;
                        opt.textContent = name;
                        optgroup.appendChild(opt);
                    });
                    select.appendChild(optgroup);
                }
            }
            
            select.value = selectedAgent ? selectedAgent.name : '';
        }

        function handleAgentChange(val) {
            if (val === '') {
                selectedAgent = null;
            } else {
                selectedAgent = parsedData.find(d => d.name === val) || null;
                if (selectedAgent) {
                    activePersona = selectedAgent.archetype;
                    document.querySelectorAll('.capsule-tab').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.classList.contains(activePersona)) {
                            btn.classList.add('active');
                        }
                    });
                }
            }
            renderAll();
        }

        function resetDefaultMockData() {
            if (confirm("Are you sure you want to restore the 70 default survey records? This action will clear your uploaded data and all custom configurations.")) {
                selectedAgent = null;
                // Clear manual overrides
                for (const key in manualOverrides) {
                    manualOverrides[key] = { name: '', desc: '', photo: '', quote: '' };
                }
                loadDefaultMockData();
                if (typeof clearUploadedCsv === 'function') clearUploadedCsv();
                updateAgentDropdown();
                renderAll();
                alert("Successfully restored default background survey data!");
            }
        }

        function downloadCSVTemplate() {
            const link = document.createElement('a');
            link.href = 'persona_template.csv';
            link.download = 'persona_template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Archetype Centroids
        const CENTROIDS = {
            explorer:  { name: "Under 1yr & 1-3yrs", sup: 2.0, wp: 4.5, ar: 4.5, pr: 4.5 },
            expert:    { name: "3-5yrs & 6-10yrs", sup: 2.5, wp: 4.5, ar: 2.5, pr: 1.5 },
            optimizer: { name: "10-15yrs & 16-20yrs", sup: 4.5, wp: 1.5, ar: 1.5, pr: 1.5 },
            skeptic:   { name: "20-25yrs & 26-30yrs", sup: 1.2, wp: 5.0, ar: 1.5, pr: 1.0 },
            parttimer: { name: "30+ years", sup: 3.5, wp: 3.0, ar: 4.0, pr: 2.5 },
            all:       { name: "All", sup: 2.7, wp: 3.7, ar: 2.2, pr: 2.2 }
        };

        const PERSONA_DETAILS = {
            explorer: {
                name: "Alex Chen",
                avatar: "👨‍💻",
                role: "Under 3 yrs experience / Fast Adapter / New Agent Training",
                photo: "assets/chen_digital.jpg",
                desc: '',
                age: "22-38 yrs",
                exp: "\u2264 3 yrs",
                customers: "Under 30",
                skills: { device: 80, knowledge: 35, salesPitch: 20, customerRelations: 50, digitalTools: 75 },
                work: [25, 20, 40, 10, 5], // Building expertise, Maintaining prospect list, Client visits, New-agent socials, Internal admin
                contradiction: "He wants to use digital tools to boost efficiency, but every time he opens the AP system he waits a long time, can't find things, and the categorisation doesn't match his mental model -- after enough failures he just stops using it.",
                needs: [
                    "Low-friction login and operation experience",
                    "Fuzzy search (notifications, marketing materials, clients)",
                    "Preset common options for occupation classification"
                ],
                pains: [
                    "Slow web login, frequent lockouts after logging out",
                    "Knowledge base categories don't match how agents actually think, hard to find things",
                    "No preset common options or fuzzy search for occupation lookup",
                    "Course platform requires manual clicking for each segment, doesn't auto-continue"
                ],
                journey: [
                    { title: "Organising the Prospect List", details: ["Starts with friends & family, builds an initial list", "Uses phone notes or Notion to record contacts", "Tries to enter data in the AP system (often gives up due to required fields)"], tools: "LINE, Notion, phone notes" },
                    { title: "Practicing the Pitch for Visits", details: ["Asks senior colleagues for scripts and approach tips", "Contacts via LINE or phone to set a meeting time", "Prepares a simple self-introduction and conversation opener"], tools: "LINE, phone, senior colleague mentoring" },
                    { title: "Visit & Pitch (relies on colleague help)", details: ["Mainly brings paper materials, unsure if the system will work on-site", "Often tells clients \"I'll check and get back to you\" when asked questions", "Occasionally tries looking things up on the phone, gives up if login fails"], tools: "Paper proposals, mobile web" },
                    { title: "Closing & Submission", details: ["Goes back to the office to type up the proposal on a computer", "Asks a senior colleague to double-check the required fields", "Mainly submits via paper application; occasionally tries Tou-Bao-Tong but gets stuck on the password"], tools: "Desktop proposal system, paper application forms" },
                    { title: "Building Knowledge & Skills", details: ["Takes compliance courses (but logging into the e-Academy is a hassle)", "Observes how senior agents conduct visits and pitches", "Gradually builds familiarity with products and systems"], tools: "e-Academy, weekly meeting sharing" }
                ],
                tools: "Uses TimeTree for a calendar, organises info himself in Notion or the Notes app, asks senior colleagues directly instead of searching the system himself",
                quote: "\"Build your own future -- with enough effort, a good life and a great income are just around the corner!\"",
                verbatim: [
                    { quote: "I know the AP has a calendar now, but just thinking about how long the webpage takes to load makes me not want to open it at all.", author: "Tu O-Ling" },
                    { quote: "For looking things up by category, if there were a few preset, commonly-used options it would help -- the current category list is sometimes hard to search, and there's no fuzzy search. Newer agents are more likely to misjudge, which also hurts client trust.", author: "Chiu O-Chung" },
                    { quote: "I have a lot of courses to take, some with deadlines, so I do them all on my phone. Logging in takes forever, and if you get logged out abnormally it locks you out for tens of minutes. That shouldn't happen on an app -- but on the web it's easy to accidentally close the window and have to wait again.", author: "Chang O-Ying" },
                    { quote: "Right now after each segment finishes you have to manually hit play again -- partway through a lesson the sound just cuts out, and you have to pause and replay. I don't know if that's intentional or a bug.", author: "Kao O-Hui" },
                    { quote: "When a client asks me something on the spot it's a hassle to look up -- sometimes I explain for a while and the client still doesn't get it. Why can't I just look it up for them right there?", author: "Hsu O-Hui" },
                    { quote: "The AP system exists, but it's pretty clunky -- keyword search takes forever, and the categories are so finely split that things get lost, like admin tasks being split into new contracts, admin items, claims items, etc. My mental model of the categories doesn't match theirs.", author: "Huang O-Yao" }
                ]
            },
            expert: {
                name: "Grace Lin",
                avatar: "👩‍💼",
                role: "3-10 yrs experience / Steady Growth / Digital Blend",
                photo: "assets/lin_jin_bu.jpg",
                desc: '',
                age: "45-60 yrs",
                exp: "3-10 yrs",
                customers: "300+",
                skills: { device: 30, knowledge: 95, salesPitch: 90, customerRelations: 95, digitalTools: 25 },
                work: [5, 45, 35, 10, 5], // Building expertise, Maintaining existing client relationships, New policy planning & visits, Post-sale servicing, Internal admin
                contradiction: "She understands digitalization is the trend, but the current system's cumbersome two-factor authentication and frequent updates are a major inconvenience -- she feels \"the time I spend fighting this system is time I could've spent visiting two more clients.\"",
                needs: [
                    "A radically simplified interface with a stable single entry point",
                    "Assistant/delegate account authorisation mechanism",
                    "Fast, clear paper download and printing function"
                ],
                pains: [
                    "Interface updates too frequently, has to relearn the navigation path every version",
                    "Too many required fields for submission, validation warnings are hard to understand",
                    "Mobile system font is too small, looks clumsy operating it in front of a client",
                    "Password rules are overly complex and require periodic changes, gets locked out often"
                ],
                journey: [
                    { title: "Preparing the Client List", details: ["Flips through old paper policies and a personal notebook", "Circles clients needing after-sales service from her contact book", "Has an assistant print out the list"], tools: "Paper notebook, physical contact book" },
                    { title: "Practicing the Pitch for Visits", details: ["Calls long-time clients directly, using \"catching up\" or \"policy check-up\" as the reason for a visit", "Notes the meeting time on a desk calendar"], tools: "Mobile phone, physical desk calendar" },
                    { title: "Visit & Pitch", details: ["Brings a whole bag of the client's historical paper policy documents", "Walks through a large-print paper brochure item by item", "Doesn't use a tablet or phone to present"], tools: "Physical policy folder, paper catalogue" },
                    { title: "Closing & Submission", details: ["Guides the client to hand-write and sign the paper application on the spot", "Back at the office, has an administrative assistant enter and submit it on the computer"], tools: "Paper application forms, fountain pen, assistant-entered data" },
                    { title: "Building Knowledge & Skills", details: ["Prefers in-person product briefings or senior colleague sharing sessions at morning meetings", "Leaves the Online compliance course playing in the background while doing other things"], tools: "In-person morning meetings, browser tab left open" }
                ],
                tools: "Loose-leaf paper client folder, large-print desk calendar, personal phone book, administrative assistant helps with system entry",
                quote: "\"Insurance is a business of human warmth and connection -- not something a cold screen can replace.\"",
                verbatim: [
                    { quote: "It used to take no time to fill out by hand -- now I have to tap around on a tablet forever, plus an SMS verification code, and the client has no patience to wait for me.", author: "Chen Mei-Feng" },
                    { quote: "The system keeps changing -- a spot I just memorized last month is gone this month. I just have my assistant enter it for me now; I avoid it myself whenever I can.", author: "Lee Kuo-Chiang" },
                    { quote: "Taking out a tablet at a client's home, the text is so small my eyes strain. Better to bring a paper presentation -- writing it out by hand feels more real to them.", author: "Wu Shu-Fen" },
                    { quote: "Our branch assistant is a huge help. Sometimes I just call her while I'm out and say, 'Hey, submit this policy for me.' That's way faster than me clicking through the website myself.", author: "Wang Chien-Min" },
                    { quote: "Sometimes the system requires the proposal to be revised and the assistant has to redo it. I feel bad for her -- if the system had a one-click duplicate feature, it'd make her a lot more efficient too.", author: "Hsu Chih-Hao" },
                    { quote: "A lot of the time I just want to see a client's payment history, but the system makes you go into 'Client Details' first, then 'Policy Overview', then 'Payment Details'. Four or five clicks just to find one thing -- too slow!", author: "Lai Ming-Feng" }
                ]
            },
            optimizer: {
                name: "Kevin Chen",
                avatar: "🧑‍💻",
                role: "10-20 yrs experience / Core Professional / Efficiency-Driven",
                photo: "assets/wang_shou_jiu.jpg",
                desc: '',
                age: "25-35 yrs",
                exp: "10-20 yrs",
                customers: "100-150",
                skills: { device: 95, knowledge: 80, salesPitch: 70, customerRelations: 85, digitalTools: 95 },
                work: [20, 25, 30, 15, 10], // Building expertise, Data analysis & list filtering, Digital marketing & visits, Post-sale servicing, System optimisation
                contradiction: "He wants to use automation to make the sales process as fast as possible, but the company system's security restrictions (no external API support, no two-way Google Calendar sync) block his efficiency gains.",
                needs: [
                    "Open API integration with third-party tools (calendar, Notion)",
                    "Powerful client data analytics and automated tagging/classification",
                    "Fully digital, paperless, seamless mobile signing"
                ],
                pains: [
                    "System functions are scattered, requiring multiple logins across different portals",
                    "No API integration, can't auto-import leads from social media ads",
                    "Poor mobile responsiveness, loses the whole entry if the network drops",
                    "No automated reminders, has to manually copy schedules to a personal calendar"
                ],
                journey: [
                    { title: "Preparing the Client List", details: ["Imports leads from social platforms into Notion", "Uses a self-built script to auto-tag and set follow-up stage"], tools: "Notion CRM, Google Sheets, custom automation" },
                    { title: "Practicing the Pitch for Visits", details: ["Sends a Calendly link so clients can pick their own time", "Plans the schedule in Google Calendar, synced to a phone widget"], tools: "Calendly, Google Calendar, LINE API" },
                    { title: "Visit & Pitch", details: ["Uses an iPad to show a live quote calculator, adjusting premiums in real time based on the client's budget", "Generates and sends a PDF on the spot"], tools: "iPad Pro, self-built dynamic calculator" },
                    { title: "Closing & Submission", details: ["Signs entirely on a tablet, using FaceID and the client's phone OTP for fast authorisation", "Completes submission"], tools: "Online signing system, FaceID / SMS verification" },
                    { title: "Building Knowledge & Skills", details: ["Quickly searches Online for new product terms and regulatory details", "Uses a browser speed-up extension to skim official videos and go straight to the quiz"], tools: "Policy-term search engine, video speed-up extension" }
                ],
                tools: "Self-built Notion CRM, Calendly scheduling, two-way Google Calendar sync, iPad Pro, FaceID quick unlock",
                quote: "\"Repetitive admin work should be automated -- our time should go into real conversations with clients.\"",
                verbatim: [
                    { quote: "Why can't the company system sync with Google Calendar? I spend ten minutes every day copying my schedule between two places -- it's really behind the times.", author: "Lin Chih-Chun" },
                    { quote: "I use a tablet to calculate premiums for clients, it's fast. But the moment the connection drops, the whole entry has to be redone -- there should be offline caching.", author: "Chao Ta-Tung" },
                    { quote: "The system splits functions across different apps -- log into this one, then that one, and the passwords aren't even the same. Terrible experience.", author: "Hsu Che-Wei" },
                    { quote: "I wish there were an official customisable shortcuts area. Pin frequently used things like 'claims status lookup' or 'new contract quoting' right on the homepage, instead of digging through the menu every time.", author: "Tsai Tsung-Han" },
                    { quote: "The mobile site's load speed needs work. Sometimes I'm showing a client a chart outdoors and it takes 5 seconds to load -- that's hard to accept in this day and age.", author: "Tseng Chun-Chieh" },
                    { quote: "Sometimes the Tou-Bao-Tong SMS verification code takes a full minute to arrive. The client and I just sit there awkwardly staring at each other. The verification flow needs to be smoother.", author: "Hung Chia-Hao" }
                ]
            },
            skeptic: {
                name: "Robert Wang",
                avatar: "👴",
                role: "20-30 yrs experience / Senior Leader / Trust-Based Legacy",
                photo: "assets/hao_ren_han.jpg",
                desc: '',
                age: "55-65 yrs",
                exp: "20-30 yrs",
                customers: "500+",
                skills: { device: 15, knowledge: 98, salesPitch: 85, customerRelations: 90, digitalTools: 10 },
                work: [5, 50, 30, 10, 5], // Building expertise, Long-time client servicing visits, Community events/relationship maintenance, Post-sale servicing, Administrative liaison
                contradiction: "He believes digital tools reduce the warmth and trust of service and carry high security risk -- he strongly resists putting client data in the cloud, preferring to spend the physical effort and travel time to handle things at the branch counter in person.",
                needs: [
                    "Complete, well-produced paper brochures and policy-term pamphlets",
                    "Keeping a physical counter and paper review window available",
                    "A direct channel for in-person communication and verbal complaints"
                ],
                pains: [
                    "Mandatory paperless rollout means he can't bring a physical flyer to show clients",
                    "Password frequently expires/locks, requiring long calls to customer service to unlock",
                    "Digital signatures often get rejected for not matching exactly, repeated back-and-forth upsets clients",
                    "Believes digital systems risk leaking clients' financial and health privacy"
                ],
                journey: [
                    { title: "Preparing the Client List", details: ["Looks up contacts in a handwritten card file and metal card box", "Flips through years of handwritten notebooks to confirm visit history"], tools: "Handwritten card book, metal card box, handwritten notebook" },
                    { title: "Practicing the Pitch for Visits", details: ["Calls the client's landline directly, usually using \"dropping off a calendar\" or \"tea nearby\" as the reason for a visit"], tools: "Home phone, handwritten notebook" },
                    { title: "Visit & Pitch", details: ["Has tea at the client's home, brings a large paper brochure", "Circles key points on the printout with a ballpoint pen"], tools: "Large paper catalogue, ballpoint pen, calculator" },
                    { title: "Closing & Submission", details: ["Client hand-signs the paper application, he checks it and stamps it on the spot", "Personally delivers it to the branch counter first thing the next morning"], tools: "Physical paper application, personal stamp, branch counter" },
                    { title: "Building Knowledge & Skills", details: ["Refuses to use any Online learning platform", "Only attends the weekly branch meeting, and asks the product instructor for a paper handout afterward"], tools: "In-person weekly meeting, paper product handouts" }
                ],
                tools: "Handwritten card book, physical card box, home phone, in-person branch counter service",
                quote: "\"Words written by hand carry the weight of a promise -- technology only pushes person further apart.\"",
                verbatim: [
                    { quote: "What if logging in on a phone gets a client's personal data stolen by hackers? A hand-signed application locked in a safe is the only truly secure option.", author: "Chien Yung-Feng" },
                    { quote: "Going paperless is just the company saving money on paper. What clients want is a contract they can see and touch, not an invisible text link.", author: "Sun Te-Jung" },
                    { quote: "Last time a digital signature got rejected three times because the strokes didn't match my ID exactly -- I had to keep apologizing in front of the client, so embarrassing.", author: "Chao Kuo-Hua" },
                    { quote: "I always tell my clients a physical stamp and signature feel the most solid. If the computer system ever breaks, or the company says the data is lost, we'll still have this piece of paper as proof.", author: "Yeh Mao-Lin" },
                    { quote: "New agents these days rely on tablets too much. They visit a client and just stare at the screen reading -- that's not selling, that's a teleprompter.", author: "Liao Fu-Pen" },
                    { quote: "The password has to change every three months, and can't repeat past ones. At my age, who can remember that many passwords? I get locked out every time and have to call customer service -- what a hassle.", author: "Kuo Chien-Hung" }
                ]
            },
            parttimer: {
                name: "Lisa Li",
                avatar: "🎒",
                role: "30+ yrs experience / Elite Advisor / Lifetime Legacy",
                photo: "assets/li_xie_gang.jpg",
                desc: '',
                age: "25-45 yrs",
                exp: "30+ yrs",
                customers: "20-50",
                skills: { device: 85, knowledge: 50, salesPitch: 30, customerRelations: 40, digitalTools: 80 },
                work: [5, 70, 15, 8, 2], // Building expertise, Primary day job, Fragmented list maintenance & contact, Post-sale servicing, Learning
                contradiction: "Needs to complete quotes and schedule visits in very short windows of time, but the system's high-friction verification and load delays often mean she can't serve clients in time during her brief breaks.",
                needs: [
                    "A native mobile app with FaceID/TouchID quick login",
                    "One-click preset quote templates for common policy types",
                    "Extended-validity remote signature and e-submission links"
                ],
                pains: [
                    "System auto-logs-out after 5 minutes of inactivity, re-login takes time",
                    "Web interface layout breaks on mobile browsers, hard to zoom and tap",
                    "Remote signature links expire too quickly -- if a client opens it a bit later it's already invalid and has to be regenerated",
                    "When she runs into an issue, no one picks up when she calls the branch, and there's no self-service help library"
                ],
                journey: [
                    { title: "Preparing the Client List", details: ["Jots down potential clients on her phone notes while on the subway", "Uses LINE chat groups to filter and categorise her list"], tools: "Phone notes, LINE chat group tags" },
                    { title: "Practicing the Pitch for Visits", details: ["Sends a booking link to clients via LINE", "Keeps a backup of go-to opening scripts saved in cloud storage"], tools: "Phone calendar, LINE, cloud storage" },
                    { title: "Visit & Pitch", details: ["Opens a quick quote page on her phone at a coffee shop, shows a simple premium/coverage chart", "Sends the draft proposal from her phone"], tools: "Mobile browser, mobile quote preview" },
                    { title: "Closing & Submission", details: ["Has the client sign on a tablet during an after-work gathering", "Sends a 24-hour valid remote signature link via LINE"], tools: "Tablet e-signature, LINE remote link" },
                    { title: "Building Knowledge & Skills", details: ["Listens to e-Academy compliance course audio in the background via Bluetooth earbuds while commuting or working out at night"], tools: "e-Academy app background play, Bluetooth earbuds" }
                ],
                tools: "Phone notes, LINE group tagging, cloud storage backup, FaceID quick unlock",
                quote: "\"Time is my biggest challenge -- I need a phone app that can produce a quote in three seconds.\"",
                verbatim: [
                    { quote: "I only have a ten-minute lunch break to handle client matters. If the app takes forever to log in, I have no time left to respond to clients today.", author: "Yang Chia-Ying" },
                    { quote: "Opening the web version of the proposal on my phone, the fields are too small to even tap. It really needs a proper vertical mobile app interface, or doing this part-time is just too hard.", author: "Luo Chun-Chieh" },
                    { quote: "The remote signature link expires so fast -- I send it to a client in the evening after work, and by the next morning when they want to sign it's already dead, so I have to resend it. So exhausting.", author: "Shih Kuan-Yu" },
                    { quote: "If there were a 'one-click bundle' -- say, standard accident + medical coverage for a 30-year-old male -- that auto-fills and generates a proposal to send to the client, that would be a lifesaver for those of us doing this part-time.", author: "Chien Li-Wei" },
                    { quote: "I only work on insurance after my day job. I send a signature link to a client in the evening, and if they fall asleep, it's expired by morning. Could the validity window be extended to 24 hours?", author: "Wen Yu-Hsuan" },
                    { quote: "Once I was responding to a client on the subway, switched over to the e-Academy, and my entire video progress reset to zero, forcing me to start over. I was so angry I wanted to throw my phone.", author: "Hsieh Ya-Ting" }
                ]
            },
            all: {
                name: "All Agents",
                avatar: "👥",
                role: "All Experience Groups / Combined Analysis",
                photo: "assets/all_agents.jpg",
                desc: '',
                age: "22-65 yrs",
                exp: "All experience ranges",
                customers: "Wide range",
                skills: { device: 60, knowledge: 60, salesPitch: 50, customerRelations: 65, digitalTools: 55 },
                work: [20, 20, 20, 20, 20],
                contradiction: "Everyone wants digital tools to deliver a real efficiency breakthrough, but across the board they face common obstacles: poor system integration, cumbersome logins, and inadequate mobile support.",
                needs: [
                    "A simplified entry point and single sign-on (SSO)",
                    "Smooth cross-device support, especially on mobile",
                    "Stable remote policy submission and e-signature service"
                ],
                pains: [
                    "System entry points are scattered, high rate of repeated logins and password lockouts",
                    "Mobile web layout has small buttons and text",
                    "SMS OTP verification timing and re-send-on-disconnect issues"
                ],
                journey: [
                    { title: "Organising the Client List", details: ["Organises policy and note information", "Filters suitable clients within the list system"], tools: "Paper, LINE, list system" },
                    { title: "Scheduling & Pitch Prep", details: ["Calls clients or messages them to set a time", "Prepares a product overview and outline"], tools: "Phone, LINE, physical desk calendar" },
                    { title: "Visit & Pitch", details: ["Explains coverage and policy terms to the client", "Uses a tablet presentation or a paper reference"], tools: "Paper brochure, tablet presentation" },
                    { title: "Closing & Submission", details: ["Guides the client through signing and confirms the details", "Has it entered into the system or submitted via an assistant"], tools: "Application form, Online signing system" },
                    { title: "Skill-Building & Compliance", details: ["Attends morning meetings and Online e-Academy product training"], tools: "In-person morning meetings, e-Academy" }
                ],
                tools: "Personal notebook, LINE on phone, mobile tablet, company AP system, branch assistant support",
                quote: "\"Empower agents with digital tools, reduce friction with intuitive design, and bring the human warmth back to the insurance business.\"",
                verbatim: [
                    { quote: "A more stable system, bigger text, and simpler login -- that's what all of us are hoping for.", author: "Agent Representative" }
                ]
            }
        };

        // Static Card content mapping for Journey Matrix View (5 columns)
        // Static Card content mapping for Journey Matrix View (6 tasks)
        // Returns the display info (name/avatar/role/etc.) for a given archetype key.
        // For legacy keys ('explorer'...'parttimer', 'all') this is the static PERSONA_DETAILS
        // entry. For dynamic cluster keys ('c0', 'c1', ...) that don't exist in that fixed
        // object, this generates a lightweight equivalent from the actual cluster's computed
        // profile (window.__dynamicClusterProfiles) -- real label and top distinguishing
        // features instead of a pre-written bio, since there's no fixed correspondence
        // between "cluster 3" and any specific static persona.
        function getPersonaDisplayInfo(key) {
            if (key === 'outlier') {
                return {
                    name: 'Outliers & Noise',
                    avatar: '🕵️',
                    role: 'Atypical / Isolated Profiles',
                    desc: '',
                    age: '-', exp: '-', customers: '-',
                    skills: { device: 50, knowledge: 50, salesPitch: 50, customerRelations: 50, digitalTools: 50 },
                    work: [20, 20, 20, 20, 20],
                    contradiction: 'Sparse response density / Unconventional behaviour patterns',
                    needs: ['Direct/personalised support', 'Custom software configuration guidelines'],
                    pains: ['Isolated workflow challenges'],
                    journey: [], tools: 'Personal support', quote: 'My workflow is very specific to my client base.', verbatim: []
                };
            }
            let baseDetails = PERSONA_DETAILS[key];
            if (baseDetails) {
                if (manualOverrides[key] && manualOverrides[key].name) {
                    baseDetails = Object.assign({}, baseDetails, { name: manualOverrides[key].name });
                }
                return baseDetails;
            }
            
            const profiles = window.__dynamicClusterProfiles || [];
            const profile = profiles.find(p => p.key === key);
            if (!profile) {
                // Nothing clustered yet -- minimal placeholder so renders don't crash.
                return { name: 'Unclassified', avatar: '❔', role: 'Awaiting data', desc: '', age: '-', exp: '-', customers: '-',
                    skills: { device: 50, knowledge: 50, salesPitch: 50, customerRelations: 50, digitalTools: 50 },
                    work: [20, 20, 20, 20, 20], contradiction: '', needs: [], pains: [], journey: [], tools: '', quote: '', verbatim: [] };
            }
            const featureText = profile.topFeatures.map(f => `${f.direction} ${f.label}`).join(' / ') || 'No standout features yet';
            const photoList = [
                'assets/chen_digital.jpg',
                'assets/lin_jin_bu.jpg',
                'assets/wang_shou_jiu.jpg',
                'assets/li_xie_gang.jpg',
                'assets/hao_ren_han.jpg'
            ];
            const assignedPhoto = photoList[profile.ordinal % photoList.length];

            const override = manualOverrides[key];
            const displayName = (override && override.name) ? override.name : `Cluster ${profile.ordinal + 1}`;
            const clusterDesc = `${profile.label} (n=${profile.count}) - Type To Change Persona Description`;

            return {
                name: displayName,
                avatar: '\u{1F4CA}',
                photo: assignedPhoto,
                color: profile.color,
                role: featureText,
                desc: (override && override.desc !== undefined && override.desc !== '') ? override.desc : clusterDesc,
                age: profile.age || '-', 
                exp: profile.exp || '-', 
                customers: profile.customers || '-',
                badges: profile.badges || '',
                skills: {
                    device: profile.centroidRaw ? Math.round(profile.centroidRaw[0]) : 50,
                    knowledge: profile.centroidRaw ? Math.round(profile.centroidRaw[1]) : 50,
                    salesPitch: profile.centroidRaw ? Math.round(profile.centroidRaw[2]) : 50,
                    customerRelations: profile.centroidRaw ? Math.round(profile.centroidRaw[3]) : 50,
                    digitalTools: profile.centroidRaw ? Math.round(profile.centroidRaw[4]) : 50
                },
                work: [20, 20, 20, 20, 20],
                contradiction: 'Computed from this cluster\'s actual survey responses -- see the gap/contradiction word cloud below.',
                needs: [], pains: [], journey: [],
                tools: '', quote: '', verbatim: []
            };
        }

        const TASK_ACTIONS_MAP_EN = [
            // Task 1
            [
                "Client List Development",
                "Client Contact & Data Recording / Client Policy Servicing",
                "Seeking Sales Opportunities"
            ],
            // Task 2
            [
                "Insurance Needs Elicitation (finding client gaps / helping clients build insurance concepts)",
                "Querying Client Policy Status / Policy Review"
            ],
            // Task 3
            [
                "Keying in & Checking Proposals",
                "Executing Submission",
                "Handling Underwriting Requisitions, Reviewing Notifications, & Completing Policy Receipt Acknowledgement"
            ],
            // Task 4
            [
                "Managing Client Data",
                "Querying Client Policy Status (e.g., client proactively asks about coverage due to external sales pitches, life events, etc.)",
                "Processing Claims / Policy Alterations"
            ],
            // Task 5
            [
                "Searching for Sales Support Files",
                "Searching for Recruiting Files / Prospect Profiling, Evaluations, & Testing",
                "Team Mentoring & Performance Management"
            ],
            // Task 6
            [
                "Educational Training Courses",
                "Online Learning Resources (e.g., ABC Academy)",
                "Observing Visits & Presentation Approaches of Senior Agents"
            ]
        ];

        const TASK_ACTIONS_MAP_ZH = [
            // 任務一：排程與客戶關係
            [
                "客戶名單整理與開拓",
                "客戶聯絡與紀錄／客戶保單健檢",
                "發掘銷售機會與初步接觸"
            ],
            // 任務二：保單銷售
            [
                "保險需求引導與缺口分析（協助客戶建立保險觀念）",
                "查詢客戶現有保單狀況與保障檢視"
            ],
            // 任務三：核保與送件
            [
                "建議書製作、試算與核對",
                "執行線上要保與送件進案",
                "處理核保照會、審核照會通知與保單簽收回條"
            ],
            // 任務四：保單服務
            [
                "客戶資料管理與更新",
                "查詢客戶保單狀態（如客戶因外界促銷、人生階段變化主動諮詢保障）",
                "協助理賠申請與保全契約變更"
            ],
            // 任務五：分處行政與支援
            [
                "查找業務支援與輔銷文件",
                "查找增員資料／對象評估、測驗與面談",
                "團隊早會、輔導與績效管理"
            ],
            // 任務六：培訓與學習
            [
                "參與教育培訓課程",
                "線上數位學習資源（如 ABC 學院）",
                "觀摩資深前輩銷售話術與訪談方式"
            ]
        ];

        const TASK_ACTIONS_MAP = TASK_ACTIONS_MAP_EN;

        const JOURNEY_STAGE_INFO_EN = [
            {
                title: "Scheduling & Client Relationships",
                explorer: { actions: "Uses phone notes and LINE to categorise and track a list, plans daily visits", tools: "Phone notes, LINE, personal calendar" },
                expert: { actions: "Uses a paper list and physical desk calendar, calls long-time clients to maintain relationships", tools: "Home phone, physical notebook, paper desk calendar" },
                optimizer: { actions: "Uses a digital CRM tool to filter the list, schedules automated greetings", tools: "Notion CRM, Google Sheets, scheduling system" },
                skeptic: { actions: "Relies on a physical card box and phone book, insists on paper records for visit scheduling", tools: "Home phone, physical card box, paper planner" },
                parttimer: { actions: "Quickly browses the contact list on her phone during her commute, maintains relationships via LINE", tools: "Phone notes, LINE chat, personal contacts" },
                all: { actions: "Compiles client lists and visit schedules across experience levels", tools: "Paper desk calendar, LINE, Google Calendar and digital CRM" }
            },
            {
                title: "Policy Sales",
                explorer: { actions: "Shows clients a paper insurance brochure, often goes back to the office or asks a senior colleague for complex questions", tools: "Mobile web browsing, paper brochures, senior colleague consultation" },
                expert: { actions: "Brings a stack of product materials and rate comparison sheets for detailed verbal explanations", tools: "Physical product booklets, large-print handouts, desktop calculator" },
                optimizer: { actions: "Opens the proposal system on an iPad for live rate calculation and needs planning on-site", tools: "iPad Pro, proposal calculator system, dynamic presentation page" },
                skeptic: { actions: "Has tea with the client, circles items on a paper flyer with a pen while explaining policy terms", tools: "Physical brochures, ballpoint pen, hand-calculated rates" },
                parttimer: { actions: "Opens a coverage calculator webpage on her phone on the subway after work, shows a simple chart", tools: "Mobile web browser, simplified policy comparison page" },
                all: { actions: "Shows clients premium calculations and policy comparisons via paper brochure or tablet", tools: "Paper brochures, calculator webpage, tablet proposal system" }
            },
            {
                title: "Underwriting & Submission",
                explorer: { actions: "Enters the proposal, has a senior colleague check it, often limited by required-field validation", tools: "Proposal system, Tou-Bao-Tong app, branch counter" },
                expert: { actions: "Guides the client to hand-write and sign the paper application, then has an assistant enter it into the system", tools: "Paper application forms, personal fountain pen, administrative assistant support" },
                optimizer: { actions: "Signs on a tablet Online, uses OTP SMS or biometrics for instant identity verification and submission", tools: "Online submission system, FaceID/Fingerprint, Tou-Bao-Tong" },
                skeptic: { actions: "Client signs in person; he personally brings the paper application to the branch counter", tools: "Physical paper contract, branch counter" },
                parttimer: { actions: "Has the client sign on a tablet at a gathering, or sends a remote submission link via SMS to complete it", tools: "Remote e-signature, Tou-Bao-Tong SMS link" },
                all: { actions: "Fills out a paper application or uses the Online e-submission system to complete identity verification and submission", tools: "Application form, Online submission, assistant-entered data" }
            },
            {
                title: "Policy Servicing",
                explorer: { actions: "Looks up the client's policy status, helps process claims and basic contract changes", tools: "Service System, proposal system, in-person counter inquiry" },
                expert: { actions: "Calls internal staff, fills out a paper change-request form and submits it", tools: "Office landline, paper request forms, internal admin staff" },
                optimizer: { actions: "Uses the Service System API to instantly check a client's policy status and propose changes", tools: "Service System app, CRM platform" },
                skeptic: { actions: "Fills out paper claims and change forms, personally delivers them and calls to check on progress", tools: "Physical request forms, phone follow-up, in-person counter submission" },
                parttimer: { actions: "Uses the mobile Service System app during commutes or spare moments to quickly check notices and policy updates", tools: "Mobile Service System, contract-change lookup interface" },
                all: { actions: "Helps process claims and basic policy contract changes", tools: "Office phone, Service System app, in-person counter" }
            },
            {
                title: "Branch Administration & Support Work",
                explorer: { actions: "Looks up marketing and recruiting-related files, joins branch activities and handles basic admin tasks", tools: "Marketing materials database, AP system, shared branch computer" },
                expert: { actions: "Fills out paper forms, has an assistant enter admin and recruiting records", tools: "Paper forms, administrative assistant, physical inbox" },
                optimizer: { actions: "Looks up sales-support files via cloud storage, uses the AP system for fast record entry", tools: "AP system, cloud storage, internal digital marketing library" },
                skeptic: { actions: "Attends in-person morning meetings and takes handwritten admin notes, checks the physical bulletin board for notices", tools: "Paper notices, physical branch bulletin board, handwritten meeting notes" },
                parttimer: { actions: "Checks AP system notifications on her phone in spare moments, quickly uploads recruiting files by photo", tools: "Mobile AP system, photo upload" },
                all: { actions: "Looks up marketing/recruiting files and logs shared branch administrative notices", tools: "Internal AP system, physical bulletin board, branch forms" }
            },
            {
                title: "Training & Learning",
                explorer: { actions: "Studies compliance courses Online (frequently gets logged out), observes how senior colleagues present", tools: "ABC Academy, Online compliance videos, in-person branch classroom" },
                expert: { actions: "Attends the in-person branch morning meeting, leaves the Online ABC Academy muted in the background to rack up hours", tools: "In-person morning meeting, ABC Academy web version" },
                optimizer: { actions: "Downloads policy-term PDFs Online independently, watches videos at 2x speed to finish quickly", tools: "Digital policy-term library, video speed-up software, ABC Academy" },
                skeptic: { actions: "Only listens to the in-person branch meeting instructor, refuses to use the computer learning system", tools: "In-person meeting sessions, physical training handouts" },
                parttimer: { actions: "Listens to training audio in the background via Bluetooth earbuds while commuting or exercising", tools: "Mobile ABC Academy app, Bluetooth earbuds, Online sessions" },
                all: { actions: "Completes Online ABC Academy learning and in-person morning-meeting training", tools: "ABC Academy, in-person morning meetings, video playback" }
            }
        ];

        const JOURNEY_STAGE_INFO_ZH = [
            {
                title: "排程與客戶關係維護",
                explorer: { actions: "使用手機備忘錄與 LINE 分類追蹤名單，安排每日拜訪行程", tools: "手機備忘錄、LINE、個人行事曆" },
                expert: { actions: "使用紙本名單與實體桌曆，致電熟客維繫長期信任關係", tools: "家用電話、實體筆記本、紙本桌曆" },
                optimizer: { actions: "使用數位 CRM 工具篩選名單，設定自動化問候排程與追蹤", tools: "Notion CRM、Google 表格、排程系統" },
                skeptic: { actions: "依賴實體名片盒與電話簿，堅持以手寫紙本記錄拜訪時程", tools: "家用電話、實體名片盒、紙本手帳" },
                parttimer: { actions: "通勤時快速瀏覽手機通訊錄，透過 LINE 簡訊維繫潛在客戶關係", tools: "手機備忘錄、LINE 聊天室、個人通訊錄" },
                all: { actions: "彙整各年資層級之客戶名單與拜訪時程規劃", tools: "紙本桌曆、LINE、Google 行事曆與數位 CRM" }
            },
            {
                title: "保單銷售與說明",
                explorer: { actions: "向客戶展示紙本保險摺頁，遇到複雜問題常需回通訊處或請教資深前輩", tools: "手機網頁瀏覽、紙本摺頁、請教資深同事" },
                expert: { actions: "攜帶整疊商品說明書與費率對照表，當面進行詳細口頭條款解說", tools: "實體商品手冊、大字版講義、桌上型計算機" },
                optimizer: { actions: "現場開啟 iPad 建議書系統即時試算保費並進行保障缺口規劃", tools: "iPad Pro、建議書試算系統、動態簡報頁面" },
                skeptic: { actions: "與客戶泡茶敘舊，手持紙本 DM 以原子筆圈劃說明保險條款重點", tools: "實體保險單張、原子筆、手算費率" },
                parttimer: { actions: "下班搭捷運時用手機開啟保障試算網頁，向客戶展示簡化圖表", tools: "手機瀏覽器、簡易保單對照網頁" },
                all: { actions: "透過紙本摺頁或平板電腦向客戶展示保費試算與保單條款比較", tools: "紙本摺頁、試算網頁、平板建議書系統" }
            },
            {
                title: "核保與送件進案",
                explorer: { actions: "線上輸入要保書，需請主管前輩覆核，常因必填欄位防呆阻擋而耗時", tools: "建議書系統、投保通 App、分處櫃檯" },
                expert: { actions: "引導客戶親筆簽署紙本要保文件，再交由行政助理代為鍵入系統", tools: "紙本要保書、個人鋼筆、行政助理支援" },
                optimizer: { actions: "線上引導客戶平板簽署，透過 OTP 簡訊或生物辨識即時驗身送件", tools: "線上投保系統、FaceID/指紋驗證、投保通" },
                skeptic: { actions: "堅持客戶親簽紙本，親自將紙本合約送交分處櫃檯辦理審核", tools: "實體紙本合約、分處服務櫃檯" },
                parttimer: { actions: "聚會時讓客戶在平板上簽署，或傳送遠距投保簡訊連結完成程序", tools: "遠距電子簽章、投保通簡訊連結" },
                all: { actions: "填寫紙本要保書或使用線上電子投保系統完成身分驗證與送件", tools: "要保書、線上投保、助理代鍵入" }
            },
            {
                title: "售後保全與理賠服務",
                explorer: { actions: "查詢客戶保單現況，協辦基本理賠申請與基本契約內容變更", tools: "業務員服務系統、建議書系統、親洽櫃檯諮詢" },
                expert: { actions: "致電內勤專員，手寫填寫紙本契約變更申請書後遞交送件", tools: "辦公室座機、紙本申請書、內勤行政專員" },
                optimizer: { actions: "透過服務系統 API 即時查驗客戶保單狀態並線上送出契約變更", tools: "服務系統 App、CRM 管理平台" },
                skeptic: { actions: "手寫填寫理賠與契約變更單，親送分處並多次致電追蹤辦理進度", tools: "實體申請單據、電話追蹤、臨櫃親自辦理" },
                parttimer: { actions: "利用通勤零碎時間以行動服務系統 App 快速查看進度通知與更新", tools: "行動服務系統、契約變更查詢介面" },
                all: { actions: "協助保戶處理理賠申請及各項保單契約內容變更作業", tools: "辦公室電話、服務系統 App、分處臨櫃" }
            },
            {
                title: "行政與團隊支援工作",
                explorer: { actions: "查閱行銷輔銷與增員相關檔案，參與分處早會活動與例行公務", tools: "輔銷素材庫、AP 系統、分處公用電腦" },
                expert: { actions: "填寫紙本表單，由助理代為鍵入行政公文與組織增員名冊", tools: "紙本表單、行政助理、實體公文收件盒" },
                optimizer: { actions: "運用雲端硬碟查閱業務輔銷文宣，使用 AP 系統高速完成紀錄鍵入", tools: "AP 系統、雲端硬碟、內部數位行銷庫" },
                skeptic: { actions: "參加實體早會並手寫筆記，依賴通訊處實體公佈欄查閱公文公告", tools: "紙本公文、分處實體公佈欄、手寫會議筆記" },
                parttimer: { actions: "空檔時以手機查看 AP 系統通知，拍照快速上傳增員或業務表單", tools: "行動 AP 系統、拍照上傳功能" },
                all: { actions: "查閱行銷與增員檔案，並登錄通訊處共用之行政與早會公告", tools: "內部 AP 系統、實體公佈欄、分處行政表單" }
            },
            {
                title: "專業知識學習與培育",
                explorer: { actions: "線上研讀法遵與商品課程（常遇逾時登出），實體觀摩前輩銷售話術", tools: "ABC 數位學院、線上法遵影音、分處實體教室" },
                expert: { actions: "參加分處實體早會培訓，將線上數位學院影音靜音背景播放累計時數", tools: "實體早會訓練、數位學院網頁版" },
                optimizer: { actions: "自主下載商品條款 PDF 研讀，以雙倍速播放教學影片快速完成時數", tools: "數位條款資料庫、倍速播放軟體、ABC 數位學院" },
                skeptic: { actions: "僅專注聆聽通訊處實體講師面授，排斥使用電腦線上學習系統", tools: "實體早會授課、紙本培訓講義" },
                parttimer: { actions: "通勤或運動時以藍牙耳機於背景聆聽培訓音訊，充分利用碎片時間", tools: "行動學院 App、藍牙耳機、線上教學單元" },
                all: { actions: "完成線上數位學院自學課程與通訊處實體早會專業培訓", tools: "ABC 數位學院、實體晨會培訓、線上影音課程" }
            }
        ];

        const JOURNEY_STAGE_INFO = JOURNEY_STAGE_INFO_EN;

        // Detailed Matrix Data containing 8 dimensions across 5 stages for 5 personas
        const DETAILED_JOURNEY_MATRIX = {
            explorer: {
                role: ["New Agent", "New Agent", "New Agent", "New Agent", "New Agent"],
                place: ["Coffee shop / branch", "Commuting / branch", "Client's office / coffee shop", "Branch office", "Home / subway"],
                purpose: [
                    "Quickly note down a list of friends & family without getting stuck on complicated health-history fields.",
                    "Find the right approach script and get the date onto the calendar.",
                    "Explain things confidently in front of the client, without the system lagging or spinning.",
                    "Successfully complete the proposal form, avoiding validation error codes he doesn't understand.",
                    "Get through the compliance training video quickly to avoid letting the certification lapse."
                ],
                task: ["Recording the list", "Scheduling & script lookup", "On-the-go pitch presentation", "Proposal entry & signing", "Compliance course learning"],
                action: [
                    "Enters friends' & family's names and phone numbers, skips detailed health history for now, saves it as a draft list.",
                    "Asks his manager for go-to scripts, calls to set up a meeting, jots it down in his notes app.",
                    "Takes out his phone or tablet to explain coverage; if the client asks something tricky, calls a colleague instead.",
                    "Logs into the AP system on a computer, fills in the validated fields, double-checks repeatedly, submits with SMS verification.",
                    "Logs into the e-Academy, manually clicks play for each chapter, and finishes the quiz before the deadline."
                ],
                touchpoints: [
                    "Phone contacts, AP recruiting system",
                    "LINE, mobile phone, time-management app",
                    "Paper brochure, mobile web",
                    "Branch computer proposal platform, paper application form",
                    "e-Academy web version, in-person morning meeting"
                ],
                feelings: [
                    "Motivated, but very frustrated and impatient with the sheer number of required fields.",
                    "Finds the official calendar too slow to load, anxious that keyword search doesn't work.",
                    "Worried the proposal won't load if the connection drops, and unsettled that there's no fuzzy search.",
                    "Extremely afraid of a rejected submission from a wrong field, anxious about getting locked out from a mistyped password.",
                    "Finds clicking play segment by segment tedious, confused by the auto logout/lock."
                ],
                painpoints: [
                    "List creation requires too much detailed info (ID number, address, etc.), causing him to abandon the entry.",
                    "Calendar takes over 15 seconds to load; script database categories are too fine-grained with no fuzzy keyword search.",
                    "Page spins endlessly on weak mobile signal; a single typo when searching a specific policy type returns no results.",
                    "Field validation warnings are unclear; the account gets locked for 10 minutes after a forgotten or mistyped password.",
                    "Videos don't auto-continue, has to click Next every 3 minutes; frequent disconnects wipe out progress."
                ],
                opportunities: [
                    "<strong>Suggestion:</strong> Switch list creation to progressive entry -- the first stage only needs a name and phone number to save.",
                    "<strong>Suggestion:</strong> Cache recent calendar entries; add smart auto-complete and fuzzy search to the script database.",
                    "<strong>Suggestion:</strong> Streamline the e-submission flow, add plain-language guidance for validated fields to reduce entry frustration.",
                    "<strong>Suggestion:</strong> Provide instant premium calculation and fuzzy policy-term search so he can answer questions on the spot.",
                    "<strong>Suggestion:</strong> Simplify internal branch admin registration, add mobile check-in and a simplified counter service.",
                    "<strong>Suggestion:</strong> Add an \"auto-continue next segment\" toggle; save video progress to the cloud continuously."
                ]
            },
            expert: {
                role: ["Seasoned Expert", "Seasoned Expert", "Seasoned Expert", "Seasoned Expert", "Seasoned Expert"],
                place: ["Branch desk", "Branch / tea table", "Client's living room / restaurant", "Branch / counter", "Home"],
                purpose: [
                    "Quickly filter the renewal-premium list for long-time clients, dislikes typing to log in.",
                    "Call to arrange a get-together, writes it on the desk calendar to avoid double-booking.",
                    "Bring the old policy to do a check-up for the client, building trust through warmth.",
                    "Complete the signing on the spot with a hand-written application, hand it off to an assistant at the office.",
                    "Get the Online required course done Online before the deadline."
                ],
                task: ["Reviewing client policies", "Calling long-time clients", "In-person check-up & visit", "Hand-signed submission", "Completing compliance credits Online"],
                action: [
                    "Asks the assistant to print the renewal list on A4 paper, highlights lines with a marker.",
                    "Calls the client on the office landline, writes the visit date on the desk calendar in red pen.",
                    "Brings a printed policy check-up report to the client's home, circles items on it with a ballpoint pen while explaining.",
                    "Client hand-signs the physical application; she checks the seal, then hands it to an assistant to enter into the system.",
                    "Leaves the e-Academy open in the background, computer muted, while continuing to handle paper documents."
                ],
                touchpoints: [
                    "Assistant-printed renewal list, highlighter",
                    "Office phone, paper desk calendar",
                    "Paper policy check-up report, product brochure",
                    "Paper application form, assistant, computer AP submission",
                    "Office computer, e-Academy platform"
                ],
                feelings: [
                    "Feels very secure with her own paper records, distrusts the privacy protections of cloud systems.",
                    "Trusts the realness of a phone conversation, not used to relying on a calendar app for reminders.",
                    "Believes face-to-face eye contact is the true essence of insurance, dislikes the cold feeling of a tablet.",
                    "Dislikes dealing with Online validation fields, happiest handing it to an assistant, finds Online verification a hassle.",
                    "Sees Online learning as pure busywork, bored by being forced to click through videos."
                ],
                painpoints: [
                    "Having the assistant print things out then still needing to look them up manually in the system creates a duplicated workflow.",
                    "No automatic sync with her notes, so forgetting the desk calendar means missing a scheduled visit.",
                    "Carrying a whole stack of paper check-up reports is bulky, and the policy-term text is too small to read easily.",
                    "Every time the application form is redesigned, field names change, making hand-written cross-referencing difficult.",
                    "Can't fast-forward or skip already-familiar product courses, forced to manually click Next each time."
                ],
                opportunities: [
                    "<strong>Suggestion:</strong> Provide OCR photo recognition so the assistant can scan hand-written documents directly into the system.",
                    "<strong>Suggestion:</strong> Integrate an SMS reminder feature -- one tap after a call to send meeting info to the client.",
                    "<strong>Suggestion:</strong> Keep a Classic UI submission mode so the assistant has a consistent batch-entry page.",
                    "<strong>Suggestion:</strong> Design a large-print check-up summary template, easy to carry and read for older clients.",
                    "<strong>Suggestion:</strong> Provide \"assistant delegate permission quick-check\" so the assistant can handle related tasks in other systems.",
                    "<strong>Suggestion:</strong> Offer a \"quick certification quiz\" for senior agents -- passing grants the credit directly."
                ]
            },
            optimizer: {
                role: ["Tech-Savvy Optimiser", "Tech-Savvy Optimiser", "Tech-Savvy Optimiser", "Tech-Savvy Optimiser", "Tech-Savvy Optimiser"],
                place: ["Mobile office, anywhere", "Mobile office, anywhere", "Client's office / cafe", "On-site direct submission", "Commuting / gym"],
                purpose: [
                    "Automatically pull in social-media ad leads and tag them for follow-up.",
                    "Skip the back-and-forth over scheduling and lock in the time directly.",
                    "Impress the client with a dynamic visual model on the iPad Pro to speed up their decision.",
                    "Paperless, near-instant submission on the spot, one-click payment and instant issuance.",
                    "Absorb policy-term key points as fast as possible and refine his personal knowledge base."
                ],
                task: ["Digital list tagging & marketing", "Calendly scheduling", "iPad interactive premium calculation", "Online FaceID seamless signing", "Speed-reading terms & sped-up playback"],
                action: [
                    "Uses an API to sync ad leads into a self-built Notion board, auto-tags them with the matching policy type by age/budget.",
                    "Sends a Calendly scheduling link to the client; once booked it auto-syncs to Google Calendar and pushes an SMS reminder.",
                    "Shows a dynamic premium calculator on the iPad, drags sliders based on the client's age and coverage level to show the coverage ratio live.",
                    "Guides the client through FaceID plus phone OTP two-factor verification to complete a mobile signature, submits Online.",
                    "Uses a browser speed-up extension to watch e-Academy videos at 2.0x, jumps straight to the quiz at the end."
                ],
                touchpoints: [
                    "Notion API, social ad data import",
                    "Calendly, Google Calendar API",
                    "iPad Pro, cloud-based calculation module",
                    "Mobile e-signature, FaceID, OTP verification",
                    "e-Academy, speed-up extension"
                ],
                feelings: [
                    "Confident in his automated pipeline, frustrated that the official system provides no API/webhook.",
                    "Feels technology saves huge amounts of time, but impatient with occasional API sync delays.",
                    "Really enjoys the sense of accomplishment when a client praises his expertise, sensitive to calculator module connection speed.",
                    "Loves the thrill of closing deals in seconds, sometimes furious at slow SMS verification code delivery.",
                    "Feels the official pace of learning wastes his time, wants to absorb material faster."
                ],
                painpoints: [
                    "Company system locks down the API, can't auto-integrate leads pulled from external social platforms.",
                    "Official calendar has no real two-way sync with a personal Google Calendar, occasional scheduling mismatches.",
                    "If the coffee shop's signal is unstable, the iPad calculator page goes blank and he has to re-enter every field.",
                    "E-submission sometimes has background sync delays, leaving the client waiting for a verification SMS that hasn't arrived.",
                    "Playback is locked at 1.0x, can't fast-forward based on his own pace or switch to a plain-text version of the terms."
                ],
                opportunities: [
                    "<strong>Suggestion:</strong> Provide an official API token or webhook mechanism so agents can securely connect their own Notion or CRM.",
                    "<strong>Suggestion:</strong> Integrate with the Google/Outlook Calendar open standard for real two-way schedule sync.",
                    "<strong>Suggestion:</strong> Make the calculator module a Progressive Web App (PWA) with offline computation and local storage.",
                    "<strong>Suggestion:</strong> Introduce FaceID/TouchID local biometric authorisation for signing.",
                    "<strong>Suggestion:</strong> Allow one-click export of all reports to Excel, so managers can quickly track activity metrics.",
                    "<strong>Suggestion:</strong> Offer 1.25x-2.0x playback speed options, plus a \"plain-text speed-read mode\" that goes straight to the quiz."
                ]
            },
            skeptic: {
                role: ["Conservative Veteran", "Conservative Veteran", "Conservative Veteran", "Conservative Veteran", "Conservative Veteran"],
                place: ["Branch desk / home", "Long-time client's home", "Long-time client's home / teahouse", "Branch counter", "In-person branch classroom"],
                purpose: [
                    "Make sure clients' hand-written health information stays safely locked in a physical drawer, safe from any Online leak.",
                    "Call warmly on the landline to set a time, using \"dropping off a calendar\" as the reason for the visit.",
                    "Read through the paper policy terms and a nicely produced catalogue word-for-word to show he takes it seriously.",
                    "Hand-deliver the paper application in person, confirm the intake stamp, to avoid any digital slip-ups.",
                    "Attend in-person training and listen to the instructor speak directly, refuses to use the e-Academy."
                ],
                task: ["Physical drawer list management", "Home phone outreach", "Paper handbook walkthrough", "In-person branch delivery", "In-person conference training"],
                action: [
                    "Takes out the metal card box, notes a client's new family member with a fountain pen, locks it back in the physical cabinet.",
                    "Flips open the phone book, dials the client's landline, greets warmly, and jots the time in his notebook.",
                    "Brings a hardbound premium-rate handbook, lays it flat on the coffee table page by page, circles key items in red pen.",
                    "Checks the client's paper signature and seal, personally delivers it to the branch the next day, watches the counter staff stamp it received.",
                    "Signs in at the branch's physical training room, sits in the front row listening to the instructor, and asks for a paper handout."
                ],
                touchpoints: [
                    "Handwritten contact cards, card book, physical safe",
                    "Home landline, paper notebook",
                    "Physical rate handbook, product brochure, red ballpoint pen",
                    "Paper application, personal stamp, branch counter",
                    "Branch classroom, paper handouts, product manual"
                ],
                feelings: [
                    "Firmly believes only paper locked in a drawer is truly secure, doesn't trust cloud storage.",
                    "Finds a cold text-message invitation impolite, feels genuine warmth only comes through a voice on the phone.",
                    "Finds tapping on a tablet unprofessional, believes the weight and text of paper is what a contract's promise should feel like.",
                    "Gets great peace of mind from the counter's red intake stamp, doesn't trust a digital submission with no human touch.",
                    "Feels only face-to-face interaction with an instructor really teaches the material, finds screen-based learning hard on the eyes."
                ],
                painpoints: [
                    "Physical records are cumbersome to carry, and losing the card book risks losing touch with clients entirely.",
                    "Forgetting the notebook at home means he can't confirm that afternoon's visit schedule.",
                    "Even a small correction to the rate sheet requires reprinting the entire booklet, wasting materials.",
                    "If a client writes something wrong, the whole application has to be refilled and re-signed -- no way to make a small Online correction.",
                    "Has to spend travel time going to the branch just to attend a class, cutting into time he could spend visiting clients."
                ],
                opportunities: [
                    "<strong>Suggestion:</strong> Provide a backup \"encrypted scan folder\" that converts hand-written cards into a secure internal digital list with one tap.",
                    "<strong>Suggestion:</strong> Offer a simple automated phone reminder service to make sure no appointment is missed.",
                    "<strong>Suggestion:</strong> Develop a quarterly-updated \"paper edition\" print subscription, mailing a large-print reference handbook.",
                    "<strong>Suggestion:</strong> Let branch counter staff offer an \"Online pre-review, pre-filled\" service that still preserves the hand-written submission path senior agents prefer.",
                    "<strong>Suggestion:</strong> Design a minimal manual report format with fewer Online fields, and offer a phone or in-person reporting channel.",
                    "<strong>Suggestion:</strong> Set up \"mobile learning sessions\" at nearby branches, or provide CD/audio recordings of the material."
                ]
            },
            parttimer: {
                role: ["Side-Hustle Agent", "Side-Hustle Agent", "Side-Hustle Agent", "Side-Hustle Agent", "Side-Hustle Agent"],
                place: ["Subway / day-job office", "Day-job break room", "Coffee shop / client's office", "Any after-work spot", "Commuting / gym"],
                purpose: [
                    "Quickly note a friend's mentioned insurance need on the subway, without cutting into day-job time.",
                    "Lock in a meeting with the shortest possible exchange, making sure it doesn't clash with her day job.",
                    "Run a quick, simplified rate calculation for the client during a 3-minute coffee break.",
                    "Have the client sign on her phone at an after-work gathering, or send an extended-validity LINE link.",
                    "Get through the required compliance training during her commute, without using up weekend or evening visit time."
                ],
                task: ["Quick phone-notes logging", "LINE message scheduling", "Quick mobile premium calculation", "LINE remote signature link", "Background listening on the subway"],
                action: [
                    "Scrolls through her phone on the subway, gets a friend's question via LINE, jots the age and need in her notes app, tags it for follow-up.",
                    "Sends her available time slots via LINE during lunch, lets the friend pick an evening or weekend time.",
                    "Opens a simplified calculator webpage on her phone at a coffee shop, enters age and budget, shows the monthly premium instantly.",
                    "Opens the e-application on her phone at an after-work dinner for the client to sign, or sends a 24-hour remote signature link via LINE.",
                    "Puts in wireless earbuds on the subway, plays the compliance course in the background while commuting home."
                ],
                touchpoints: [
                    "Phone notes, LINE chat",
                    "Personal calendar app, LINE booking card",
                    "Mobile web simplified calculator",
                    "Mobile application app, LINE remote signing",
                    "e-Academy mobile app, Bluetooth earbuds"
                ],
                feelings: [
                    "Time is extremely tight, finds a five-step login process genuinely painful.",
                    "Wants her schedule to be crystal clear, terrified of it clashing with a day-job meeting.",
                    "At a coffee shop, wants an instant answer from her phone, gets furious when a form breaks layout on mobile.",
                    "Wants the signature link to stay valid as long as possible, since her clients often only have time late at night.",
                    "Finds it satisfying to knock out credits while riding the subway, frustrated by sudden auto-logouts."
                ],
                painpoints: [
                    "Auto-logout after 5 minutes of inactivity; switching cell towers on the subway often forces her to retype a complex password.",
                    "Schedule doesn't distinguish \"day job meeting\" from \"insurance visit,\" causing frequent conflicts.",
                    "The official quote calculator's mobile layout breaks badly, hard to drag the small coverage-amount slider.",
                    "Remote signature link is only valid for 10 minutes; by the time the client opens it after work it's expired, requiring repeated resends.",
                    "On mobile, switching to LINE to reply to a client interrupts video playback with an error."
                ],
                opportunities: [
                    "<strong>Suggestion:</strong> Add biometric quick login (FaceID) on mobile, and extend the idle logout timer to 30 minutes.",
                    "<strong>Suggestion:</strong> Provide \"calendar category tagging\" that can link to her day-job calendar with one tap to prevent conflicts.",
                    "<strong>Suggestion:</strong> Launch a mobile-first, minimal calculator panel with large buttons and sliders.",
                    "<strong>Suggestion:</strong> Extend the remote signature link's validity to 24 hours, with a one-tap automatic LINE reminder.",
                    "<strong>Suggestion:</strong> Provide voice-to-text admin reporting so part-time agents can report updates in spare moments.",
                    "<strong>Suggestion:</strong> Support Picture-in-Picture or audio-only background playback in the mobile app."
                ]
            }
        };

        function classifyByLabels(roleBadges) {
            if (!roleBadges) return null;
            const badges = roleBadges.split(/[;；,，\n\r]+/).map(b => b.trim()).filter(Boolean);
            
            const groupLabelSets = {
                explorer: ['Rookie Agent', 'Premium Training', 'Embracing Ideals', 'Proactive Development', 'Filled with Curiosity', 'Insurance Newbie'],
                expert: ['Senior Producer', 'Trust First', 'Relationship Cultivation', 'Local Deepening', 'Paper-based', 'Seasoned Star'],
                optimizer: ['Digital Savvy', 'Efficiency First', 'Paperless Push', 'Automation First', 'Digital Pioneer'],
                skeptic: ['Conservative Resistance', 'Traditional Workflow', 'High Guard', 'Paper Signing', 'Security First'],
                parttimer: ['Slashie Agent', 'Time Compressed', 'Flexible Hours', 'Amphibious Operations']
            };
            
            let bestGroup = null;
            let maxMatches = 0;
            
            for (const group in groupLabelSets) {
                let matches = 0;
                badges.forEach(b => {
                    if (groupLabelSets[group].includes(b)) {
                        matches++;
                    }
                });
                if (matches > maxMatches) {
                    maxMatches = matches;
                    bestGroup = group;
                }
            }
            
            return bestGroup;
        }

        function classifyByExperience(expStr) {
            if (!expStr) return null;
            const str = String(expStr).trim();
            
            // Group 1: Under 1 year, 1-3 years
            if (str.includes("1年以下") || str.includes("Under 1 year") || str.includes("1-3 years") || str.includes("1-3 年") || str.includes("1–3年") || str.includes("1-3 years")) {
                return 'explorer';
            }
            // Group 2: 3-5 years, 5-10 years
            if (str.includes("3-5 years") || str.includes("3-5 年") || str.includes("3–5年") || str.includes("3-5 years") || 
                str.includes("5-10 years") || str.includes("5-10 年") || str.includes("5–10年") || str.includes("5-10 years") ||
                str.includes("穩定成長") || str.includes("成長期")) {
                return 'expert';
            }
            // Group 3: 10-15 years, 15-20 years, or "10 年以上"
            if (str.includes("10-15 years") || str.includes("10-15 年") || str.includes("10–15年") || str.includes("10-15 years") ||
                str.includes("15-20 years") || str.includes("15-20 年") || str.includes("15–20年") || str.includes("15-20 years") ||
                str.includes("10+ years") || str.includes("10 年以上")) {
                return 'optimizer';
            }
            // Group 4: 20-25 years, 25–30 年
            if (str.includes("20-25 years") || str.includes("20-25 年") || str.includes("20–25年") || str.includes("20-25 years") ||
                str.includes("25-30 years") || str.includes("25-30 years") || str.includes("25–30年") || str.includes("25–30 年") ||
                str.includes("15+ years") || str.includes("15 年以上")) {
                return 'skeptic';
            }
            // Group 5: 30+ years
            if (str.includes("30+ years") || str.includes("30+ years") || str.includes("30年") || str.includes("30 年")) {
                return 'parttimer';
            }
            
            // Regex or numerical parsing as fallback
            const match = str.match(/(\d+)/);
            if (match) {
                const years = parseInt(match[1]);
                if (years < 3) return 'explorer'; // Group 1
                if (years < 10) return 'expert'; // Group 2
                if (years < 20) return 'optimizer'; // Group 3
                if (years <= 30) return 'skeptic'; // Group 4
                return 'parttimer'; // Group 5
            }
            
            return null;
        }

        // Classify respondent based on Experience (primary), Role Labels (secondary) or Centroid Distance (fallback)
        function classifyRespondent(sup, wp, ar, pr, roleBadges, experience) {
            const expGroup = classifyByExperience(experience);
            if (expGroup) {
                return expGroup;
            }
            const labelGroup = classifyByLabels(roleBadges);
            if (labelGroup) {
                return labelGroup;
            }
            
            let minDistance = Infinity;
            let classified = 'explorer';
            
            for (const [key, centroid] of Object.entries(CENTROIDS)) {
                const dist = Math.sqrt(
                    Math.pow(sup - centroid.sup, 2) +
                    Math.pow(wp - centroid.wp, 2) +
                    Math.pow(ar - centroid.ar, 2) +
                    Math.pow(pr - centroid.pr, 2)
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    classified = key;
                }
            }
            return classified;
        }



        function openSchemaBuilderModal() {
            const modal = document.getElementById('schema-builder-modal');
            if (!modal) return;
            modal.style.display = 'flex';
            const iframe = document.getElementById('modular-questionnaire-iframe');
            const domain = currentJourneyDomain || 'agent';
            const lang = currentLang || 'en';
            
            if (iframe) {
                const targetUrl = `modular_questionnaire.html?lang=${lang}&schema=${domain}&t=${Date.now()}`;
                var __sd = window.__mqSrcdoc ? window.__mqSrcdoc(lang, domain) : null;
                if (__sd) iframe.srcdoc = __sd; else iframe.src = targetUrl;
            }
            
            // Also sync fallback legacy inputs if they exist
            try {
                const schema = getActiveJourneySchema();
                const isZh = (currentLang === 'zh');
                let sName = isZh ? (schema.nameZh || schema.name || '') : (schema.name || "Insurance Agent Sales Journey");
                const nameInp = document.getElementById('schema-name-input');
                if (nameInp) nameInp.value = sName;
                const idInp = document.getElementById('schema-id-input');
                if (idInp) idInp.value = schema.id || 'custom';
                const presetSelect = document.getElementById('schema-preset-select');
                if (presetSelect) {
                    presetSelect.value = ['agent', 'policyholder', 'patient'].includes(schema.id) ? schema.id : 'blank';
                }
                if (typeof renderSchemaBuilderRows === 'function') renderSchemaBuilderRows(schema);
            } catch(e) {}

            modal.classList.add('active');
            if (typeof window.adjustAllQuestionTextareaHeights === 'function') {
                window.adjustAllQuestionTextareaHeights();
            }
        }

        function closeSchemaBuilderModal() {
            const modal = document.getElementById('schema-builder-modal');
            if (!modal) return;
            modal.classList.remove('active');
            modal.style.display = 'none';
        }

        function resetCurrentSchemaToDefault(domain) {
            domain = domain || currentJourneyDomain || 'agent';
            try {
                localStorage.removeItem(`custom_journey_schema_${domain}`);
                localStorage.removeItem('custom_journey_schema');
                const portalStored = localStorage.getItem('portal_custom_schemas');
                if (portalStored) {
                    const allCustom = JSON.parse(portalStored);
                    delete allCustom[domain];
                    localStorage.setItem('portal_custom_schemas', JSON.stringify(allCustom));
                }
                const activeStored = localStorage.getItem('active_journey_schema');
                if (activeStored) {
                    const parsed = JSON.parse(activeStored);
                    if (parsed && (parsed.id === domain || domain === 'agent')) {
                        localStorage.removeItem('active_journey_schema');
                    }
                }
            } catch (e) {}

            window.__activeCustomSchema = null;
            window.__customSchemaApplied = false;
            window.userUploadedCustomFile = false;

            if (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined') {
                const def = DEFAULT_JOURNEY_SCHEMAS[domain] || DEFAULT_JOURNEY_SCHEMAS.agent;
                if (typeof JOURNEY_SCHEMAS !== 'undefined') {
                    JOURNEY_SCHEMAS[domain] = JSON.parse(JSON.stringify(def));
                }
            }

            // Restore platform data to Questionnaire_Synthetic_Responses.csv (PRE_LOADED_DATA / PRE_LOADED_DATA_ZH)
            if (domain === 'agent') {
                if (currentLang === 'zh' && typeof PRE_LOADED_DATA_ZH !== 'undefined' && PRE_LOADED_DATA_ZH.length > 0) {
                    parsedData = PRE_LOADED_DATA_ZH;
                } else if (typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) {
                    parsedData = PRE_LOADED_DATA;
                }
            } else if (domain === 'policyholder') {
                if (typeof POLICYHOLDER_PRE_LOADED_DATA !== 'undefined' && POLICYHOLDER_PRE_LOADED_DATA.length > 0) {
                    parsedData = POLICYHOLDER_PRE_LOADED_DATA;
                }
            }

            updateClusterFeatures();
            selectedAgent = null;
            activeSubFilter = 'ALL';

            if (parsedData && parsedData.length > 0) {
                assignDynamicArchetypes(parsedData);
                runClusterDiscovery();
            }

            try {
                const iframe = document.getElementById('modular-questionnaire-iframe');
                if (iframe && iframe.contentWindow && typeof iframe.contentWindow.loadSchema === 'function') {
                    iframe.contentWindow.loadSchema(domain);
                }
            } catch(e) {}

            if (typeof updateDomainSelectOptions === 'function') updateDomainSelectOptions();
            if (typeof renderArchetypeTabs === 'function') renderArchetypeTabs();
            if (typeof renderSubFilters === 'function') renderSubFilters();
            if (typeof renderDemographics === 'function') renderDemographics();
            if (typeof updateAgentDropdown === 'function') updateAgentDropdown();
            if (typeof renderAll === 'function') renderAll();

            showPlatformNotification(
                (currentLang === 'zh')
                    ? '✓ 已成功恢復為原始問卷數據 (Questionnaire_Synthetic_Responses.csv，共 2,500 筆) 與預設架構！'
                    : '✓ Successfully restored original platform data (Questionnaire_Synthetic_Responses.csv, 2,500 responses) & default schema!'
            );
        }
        window.resetCurrentSchemaToDefault = resetCurrentSchemaToDefault;
        window.restoreOriginalDataset = function() {
            resetCurrentSchemaToDefault('agent');
        };
        window.restoreOriginalQuestionnaireData = window.restoreOriginalDataset;

        function openModularQuestionnaireInNewWindow() {
            const domain = currentJourneyDomain || 'agent';
            const lang = currentLang || 'en';
            window.open(`modular_questionnaire.html?lang=${lang}&schema=${domain}`, 'ModularQuestionnaire', 'width=1400,height=920,resizable=yes,scrollbars=yes');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function escapeHtmlAttr(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function loadSchemaPreset(presetKey) {
            const isZh = (currentLang === 'zh');
            if (presetKey === 'blank') {
                const blankSchema = {
                    id: 'custom_' + Date.now().toString().slice(-4),
                    name: '',
                    nameZh: '',
                    targetAudience: '',
                    icon: '✨',
                    badge: 'Custom Schema',
                    badgeZh: '自訂架構',
                    sectionsConfig: {
                        demographics: true,
                        dimensions: true,
                        tags: true,
                        workContent: true,
                        journey: true
                    },
                    sectionTitles: {
                        demographics: isZh ? '基本資料' : 'General Information',
                        demographicsZh: '基本資料',
                        dimensions: isZh ? '衡量維度指標' : 'Measurement Dimensions',
                        dimensionsZh: '衡量維度指標',
                        tags: isZh ? '個人形象標籤' : 'Archetype Tags',
                        tagsZh: '個人形象標籤',
                        workContent: isZh ? '日常習慣與核心需求' : 'Daily Patterns & Core Needs',
                        workContentZh: '日常習慣與核心需求',
                        journey: isZh ? '歷程階段與接觸點體驗' : 'Journey Stages & Touchpoints',
                        journeyZh: '歷程階段與接觸點體驗'
                    },
                    intro: '',
                    introZh: '',
                    demographics: [],
                    metrics: [],
                    stages: [],
                    selfImageTags: [],
                    selfImageTagsZh: [],
                    dailyWorkItems: [],
                    dailyWorkItemsZh: [],
                    officialSystems: [],
                    officialSystemsZh: [],
                    personalTools: [],
                    personalToolsZh: [],
                    coreNeeds: [],
                    coreNeedsZh: []
                };
                document.getElementById('schema-name-input').value = '';
                document.getElementById('schema-id-input').value = blankSchema.id;
                if (typeof renderSchemaBuilderRows === 'function') renderSchemaBuilderRows(blankSchema);
                window.adjustAllQuestionTextareaHeights();
                return;
            }

            const targetSchema = (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[presetKey]) ? DEFAULT_JOURNEY_SCHEMAS[presetKey] : JOURNEY_SCHEMAS[presetKey];
            if (targetSchema) {
                const sName = isZh ? (targetSchema.nameZh || targetSchema.name) : targetSchema.name;
                document.getElementById('schema-name-input').value = sName;
                document.getElementById('schema-id-input').value = targetSchema.id;
                if (typeof renderSchemaBuilderRows === 'function') renderSchemaBuilderRows(targetSchema);
                window.adjustAllQuestionTextareaHeights();
            }
        }

        function toggleSectionInclusion(sectionKey, isChecked) {
            const cardChk = document.getElementById(`sec-card-chk-${sectionKey}`);
            if (cardChk) cardChk.checked = isChecked;
            updateSectionCardVisual(sectionKey, isChecked);
        }

        function updateSectionCardVisual(sectionKey, isChecked) {
            const card = document.getElementById(`schema-section-card-${sectionKey}`);
            const badge = document.getElementById(`badge-sec-${sectionKey}`);
            const isZh = (currentLang === 'zh');
            if (card) {
                if (isChecked) {
                    card.style.opacity = '1';
                    card.style.filter = 'none';
                } else {
                    card.style.opacity = '0.45';
                    card.style.filter = 'grayscale(0.6)';
                }
            }
            if (badge) {
                if (isChecked) {
                    badge.textContent = isZh ? '已納入問卷' : 'Included';
                    badge.style.background = 'rgba(34, 197, 94, 0.15)';
                    badge.style.color = '#4ade80';
                    badge.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                } else {
                    badge.textContent = isZh ? '未納入問卷' : 'Excluded';
                    badge.style.background = 'rgba(239, 68, 68, 0.15)';
                    badge.style.color = '#f87171';
                    badge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }
            }
        }

        function toggleSectionCardCollapse(secKey) {
            const content = document.getElementById(`schema-${secKey}-content`);
            const btn = document.querySelector(`#schema-section-card-${secKey} .btn-sec-collapse`);
            if (!content) return;
            const isHidden = (content.style.display === 'none');
            const isZh = (currentLang === 'zh');
            if (isHidden) {
                content.style.display = 'block';
                if (btn) {
                    btn.textContent = '⊟';
                    btn.title = isZh ? '收合' : 'Collapse';
                }
            } else {
                content.style.display = 'none';
                if (btn) {
                    btn.textContent = '⛶';
                    btn.title = isZh ? '展開' : 'Expand';
                }
            }
        }
        window.toggleSectionCardCollapse = toggleSectionCardCollapse;

        function toggleQuestionCardCollapse(btn) {
            const card = btn.closest('.schema-question-card, .schema-demo-row, .schema-stage-row');
            if (!card) return;
            const body = card.querySelector('.card-collapsible-body');
            if (!body) return;
            const isHidden = (body.style.display === 'none');
            const isZh = (currentLang === 'zh');
            if (isHidden) {
                body.style.display = 'block';
                btn.textContent = '⊟';
                btn.title = isZh ? '收合' : 'Collapse';
            } else {
                body.style.display = 'none';
                btn.textContent = '⛶';
                btn.title = isZh ? '展開' : 'Expand';
            }
        }
        window.toggleQuestionCardCollapse = toggleQuestionCardCollapse;

        window.moveQuestionRow = function(btn, direction) {
            const card = btn.closest('.schema-demo-row, .schema-question-card, .schema-stage-row');
            if (!card) return;
            const parent = card.parentNode;
            if (!parent) return;

            if (direction === -1) {
                const prev = card.previousElementSibling;
                if (prev && (prev.classList.contains('schema-demo-row') || prev.classList.contains('schema-question-card') || prev.classList.contains('schema-stage-row'))) {
                    parent.insertBefore(card, prev);
                }
            } else if (direction === 1) {
                const next = card.nextElementSibling;
                if (next && (next.classList.contains('schema-demo-row') || next.classList.contains('schema-question-card') || next.classList.contains('schema-stage-row'))) {
                    parent.insertBefore(next, card);
                }
            }

            if (card.classList.contains('schema-demo-row')) {
                reindexSchemaDemographicNumbers();
            } else if (card.classList.contains('schema-stage-row')) {
                reindexSchemaStageNumbers();
            }
        };

        window.moveSectionCard = function(el, dir) {
            const card = el.closest('.schema-section-card') || el.closest('.section-card');
            if (!card) return;
            const parent = card.parentNode;
            if (!parent) return;
            if (dir === -1 || !dir) {
                const prev = card.previousElementSibling;
                if (prev && (prev.classList.contains('schema-section-card') || prev.classList.contains('section-card'))) {
                    parent.insertBefore(card, prev);
                    return;
                }
            }
            if (dir === 1 || !dir) {
                const next = card.nextElementSibling;
                if (next && (next.classList.contains('schema-section-card') || next.classList.contains('section-card'))) {
                    parent.insertBefore(next, card);
                    return;
                }
            }
        };
        const moveSectionCard = window.moveSectionCard;

        window.toggleDemoSubQuestion = function(btn) {
            const container = btn.closest('.demo-selections-container');
            if (!container) return;
            const subq = container.querySelector('.demo-subq-wrapper');
            if (!subq) return;
            subq.style.display = 'block';
            btn.style.display = 'none';
            const input = subq.querySelector('.demo-subq-prompt-input, .subq-prompt-input');
            if (input) input.focus();
        };
        window.addDemoSubQuestion = window.toggleDemoSubQuestion;

        window.removeDemoSubQuestion = function(btn) {
            const subq = btn.closest('.demo-subq-wrapper');
            if (!subq) return;
            const container = subq.closest('.demo-selections-container');
            const input = subq.querySelector('.demo-subq-prompt-input, .subq-prompt-input');
            if (input) input.value = '';
            subq.querySelectorAll('.subq-option-input, .demo-option-input').forEach(i => i.value = '');
            const textarea = subq.querySelector('.demo-subq-options-input');
            if (textarea) textarea.value = '';
            subq.style.display = 'none';
            if (container) {
                const addBtn = container.querySelector('.btn-add-demo-subq, .btn-add-subq');
                if (addBtn) addBtn.style.display = 'inline-flex';
            }
        };

        window.addSubqOptionItem = function(btn) {
            const wrapper = btn.closest('.subq-module1-card') || btn.closest('.demo-subq-wrapper');
            if (!wrapper) return;
            const list = wrapper.querySelector('.subq-options-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const typeSelect = wrapper.querySelector('.subq-type-select');
            const isSingle = (!typeSelect || typeSelect.value === 'single');
            const count = list.querySelectorAll('.subq-option-item').length;
            const optDiv = document.createElement('div');
            optDiv.className = 'demo-option-item subq-option-item';
            optDiv.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 5px;';
            optDiv.innerHTML = `
                <span class="subq-choice-icon" style="color: #38bdf8; font-size: var(--fs-body); user-select: none; width: 32px; min-width: 32px; text-align: center; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${isSingle ? '○' : '□'}</span>
                <input type="text" class="demo-option-input subq-option-input" value="${isZh ? `選項 ${count + 1}` : `Option ${count + 1}`}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; min-width: 0; background: #1a2335; border: 1px solid rgba(56, 189, 248, 0.25); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <button type="button" onclick="this.closest('.subq-option-item').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
            `;
            list.appendChild(optDiv);
            const input = optDiv.querySelector('.subq-option-input');
            if (input) {
                input.focus();
                input.select();
            }
        };

        window.onSubqTypeChange = function(selectEl) {
            const wrapper = selectEl.closest('.subq-module1-card') || selectEl.closest('.demo-subq-wrapper');
            if (!wrapper) return;
            const isText = (selectEl.value === 'text');
            const isSingle = (selectEl.value === 'single');
            const secContainer = wrapper.querySelector('.subq-selections-container');
            const textPreview = wrapper.querySelector('.subq-text-preview');
            if (secContainer) secContainer.style.display = isText ? 'none' : 'block';
            if (textPreview) textPreview.style.display = isText ? 'block' : 'none';
            wrapper.querySelectorAll('.subq-choice-icon').forEach(icon => {
                icon.textContent = isSingle ? '○' : '□';
            });
        };

        window.getScaleOptionsHtml = function(qId, scaleVal, isZh) {
            if (scaleVal === '0-100') {
                const leftLabel = isZh ? '極不熟悉' : 'Extremely Unfamiliar';
                const rightLabel = isZh ? '極為熟悉' : 'Extremely Familiar';
                return `<span style="color: #94a3b8; font-weight: 600;">${leftLabel}</span><span>[ ] 0%</span><span>[ ] 20%</span><span>[ ] 40%</span><span>[ ] 60%</span><span>[ ] 80%</span><span>[ ] 100%</span><span style="color: #94a3b8; font-weight: 600;">${rightLabel}</span>`;
            } else if (scaleVal === 'emoji') {
                const leftLabel = (qId === 'q8' || qId === 'q11') ? (isZh ? '極不熟悉' : 'Extremely Unfamiliar') : (isZh ? '極不快樂' : 'Extremely Unhappy');
                const rightLabel = (qId === 'q8' || qId === 'q11') ? (isZh ? '極為熟悉' : 'Extremely Familiar') : (isZh ? '極為快樂' : 'Extremely Happy');
                return `<span style="color: #94a3b8; font-weight: 600;">${leftLabel}</span><span>[ ] 😩</span><span>[ ] 🙁</span><span>[ ] 😐</span><span>[ ] 🙂</span><span>[ ] 😄</span><span style="color: #94a3b8; font-weight: 600;">${rightLabel}</span>`;
            } else if (scaleVal === '1-5') {
                const leftLabel = isZh ? '極低 (1)' : 'Low (1)';
                const rightLabel = isZh ? '極高 (5)' : 'High (5)';
                return `<span style="color: #94a3b8; font-weight: 600;">${leftLabel}</span><span>[ ] 1</span><span>[ ] 2</span><span>[ ] 3</span><span>[ ] 4</span><span>[ ] 5</span><span style="color: #94a3b8; font-weight: 600;">${rightLabel}</span>`;
            } else if (scaleVal === '1-7') {
                const leftLabel = isZh ? '極低 (1)' : 'Low (1)';
                const rightLabel = isZh ? '極高 (7)' : 'High (7)';
                return `<span style="color: #94a3b8; font-weight: 600;">${leftLabel}</span><span>[ ] 1</span><span>[ ] 2</span><span>[ ] 3</span><span>[ ] 4</span><span>[ ] 5</span><span>[ ] 6</span><span>[ ] 7</span><span style="color: #94a3b8; font-weight: 600;">${rightLabel}</span>`;
            } else if (scaleVal === '1-10') {
                const leftLabel = isZh ? '最低 (1)' : 'Min (1)';
                const rightLabel = isZh ? '最高 (10)' : 'Max (10)';
                const cells = [1,2,3,4,5,6,7,8,9,10].map(n => `<span>[ ] ${n}</span>`).join(' ');
                return `<span style="color: #94a3b8; font-weight: 600;">${leftLabel}</span>${cells}<span style="color: #94a3b8; font-weight: 600;">${rightLabel}</span>`;
            }
            return '';
        };

        window.updateQScalePreview = function(qId, scaleVal) {
            const el = document.getElementById(`schema-${qId}-options-preview`);
            if (el) {
                const isZh = (currentLang === 'zh');
                el.innerHTML = window.getScaleOptionsHtml(qId, scaleVal, isZh);
            }
        };

        window.adjustAllQuestionTextareaHeights = function() {
            setTimeout(() => {
                document.querySelectorAll('.schema-question-card textarea, .schema-demo-row textarea, .module4-card-box textarea, .q-card-row textarea, textarea.demo-label-input, textarea.q-prompt-textarea, textarea[id$="-prompt-input"], textarea.demo-subq-prompt-input, textarea.part2-custom-subprompt-input').forEach(ta => {
                    if (ta.rows === 1 || ta.rows === 2 || ta.classList.contains('demo-label-input') || ta.id.includes('prompt-input') || ta.classList.contains('part2-custom-prompt-input') || ta.classList.contains('demo-subq-prompt-input') || ta.classList.contains('part2-custom-subprompt-input')) {
                        const isLong = ['q7', 'q10', 'q12', 'q13', 'q16', 'q20', 'q21', 'q22', 'q23'].some(q => (ta.id && (ta.id.startsWith(q + '-') || ta.id.includes('-' + q + '-') || ta.id.endsWith('-' + q) || ta.id.includes(q)))) || ta.classList.contains('q-prompt-2lines') || (ta.value && ta.value.length > 70);
                        const minH = isLong ? 52 : (ta.classList.contains('demo-subq-prompt-input') || ta.classList.contains('part2-custom-subprompt-input') ? 28 : 30);
                        ta.style.height = 'auto';
                        ta.style.height = Math.max(minH, ta.scrollHeight) + 'px';
                    }
                });
            }, 0);
        };

        window.addEventListener('resize', () => {
            if (window.adjustAllQuestionTextareaHeights) window.adjustAllQuestionTextareaHeights();
        });

        function renderSubQuestionBlock(qKey, subPrompt = '', subOptionsText = '', isZh = false) {
            const hasSubQ = Boolean(subPrompt || (subOptionsText && subOptionsText.trim()));
            return `
                <div class="sub-q-wrapper" id="subq-wrapper-${qKey}" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div class="sub-q-content" style="display: ${hasSubQ ? 'block' : 'none'};">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                            <span style="color: #38bdf8; font-size: var(--fs-caption); font-weight: 700;">${qKey.toUpperCase()} Sub-Q:</span>
                            <button type="button" onclick="removeSubQuestion('${qKey}')" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; height: 22px; width: 22px;" title="${isZh ? '刪除子題' : 'Delete Sub-Question'}">&times;</button>
                        </div>
                        <textarea id="schema-${qKey}sub-prompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '子題題目' : 'Sub-question prompt'}" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); outline: none; margin-bottom: 4px; font-family: inherit; line-height: 1.4; resize: vertical; min-height: 28px; overflow-y: hidden;">${escapeHtml(subPrompt)}</textarea>
                        <div style="font-size: var(--fs-caption); color: #94a3b8; margin: 4px 0 2px 0;">${isZh ? '子題選項清單（每行一個選項）：' : 'Sub-question options list (one option per line):'}</div>
                        <textarea id="schema-${qKey}sub-options-input" rows="2" placeholder="${isZh ? '選項 A\n選項 B' : 'Option A\nOption B'}" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; padding: 4px 6px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; line-height: 1.4; resize: vertical; outline: none;">${escapeHtml(subOptionsText)}</textarea>
                    </div>
                    <button type="button" class="btn btn-secondary btn-add-subq" onclick="addSubQuestion('${qKey}')" style="display: ${hasSubQ ? 'none' : 'inline-flex'}; align-items: center; gap: 4px; padding: 2px 8px; font-size: var(--fs-caption); height: 24px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);">
                        <span>${isZh ? '+ 新增子題 (Sub-Q)' : '+ Add Sub-Question'}</span>
                    </button>
                </div>
            `;
        }

        window.addSubQuestion = function(qKey) {
            const wrapper = document.getElementById(`subq-wrapper-${qKey}`);
            if (!wrapper) return;
            const content = wrapper.querySelector('.sub-q-content');
            const btn = wrapper.querySelector('.btn-add-subq');
            if (content) content.style.display = 'block';
            if (btn) btn.style.display = 'none';
            const input = wrapper.querySelector(`#schema-${qKey}sub-prompt-input`);
            if (input) input.focus();
        };

        window.removeSubQuestion = function(qKey) {
            const wrapper = document.getElementById(`subq-wrapper-${qKey}`);
            if (!wrapper) return;
            const content = wrapper.querySelector('.sub-q-content');
            const btn = wrapper.querySelector('.btn-add-subq');
            const input = wrapper.querySelector(`#schema-${qKey}sub-prompt-input`);
            const textarea = wrapper.querySelector(`#schema-${qKey}sub-options-input`);
            if (input) input.value = '';
            if (textarea) textarea.value = '';
            if (content) content.style.display = 'none';
            if (btn) btn.style.display = 'inline-flex';
        };

        window.addPart2CustomQuestion = function(prompt = '', optionsText = '', subPrompt = '', subOptionsText = '') {
            const list = document.getElementById('schema-part3-questions-list') || document.getElementById('part2-custom-questions-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.schema-part2-custom-card, .module4-row').length;
            const qNum = 8 + count;
            const cardId = `part2-custom-${Date.now()}-${count}`;
            const defaultPrompt = prompt || (isZh ? `自訂題目 ${count + 1}` : `Custom Question ${count + 1}`);
            const defaultOptions = optionsText || (isZh ? '選項 1\n選項 2' : 'Option 1\nOption 2');
            
            const div = document.createElement('div');
            div.className = 'schema-question-card schema-card-draggable schema-part2-custom-card';
            div.id = cardId;
            div.style.cssText = 'display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px;';
            
            const hasSubQ = Boolean(subPrompt || (subOptionsText && subOptionsText.trim()));
            div.innerHTML = `
                <button type="button" class="btn-card-collapse" onclick="toggleQuestionCardCollapse(this)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 6px 0 0 0; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>
                <div class="schema-card-box" style="flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                        <span class="q-badge" style="background: var(--accent-yellow); color: #000; font-size: var(--fs-caption); font-weight: 800; padding: 4px 7px; border-radius: 4px; min-width: 24px; text-align: center; flex-shrink: 0;">Q${qNum}</span>
                        <textarea class="part2-custom-prompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '題目名稱' : 'Question Prompt'}" style="flex: 1; box-sizing: border-box; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; resize: vertical; min-height: 30px; line-height: 1.4; overflow-y: hidden; font-family: inherit;">${escapeHtml(defaultPrompt)}</textarea>
                        <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                            <div style="display: inline-flex; align-items: center; gap: 3px;">
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, -1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '上移' : 'Move Up'}">▲</button>
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, 1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '下移' : 'Move Down'}">▼</button>
                            </div>
                            <button type="button" onclick="this.closest('.schema-part2-custom-card').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; height: 24px; width: 24px;" title="${isZh ? '刪除題目' : 'Delete Question'}">&times;</button>
                        </div>
                    </div>
                    <div class="card-collapsible-body" style="display: block;">
                        <div style="font-size: var(--fs-caption); color: #94a3b8; margin: 4px 0 2px 0;">${isZh ? '選項清單（每行一個選項）：' : 'Options list (one option per line):'}</div>
                        <textarea class="part2-custom-options-input" rows="3" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; line-height: 1.4; resize: vertical; outline: none;">${escapeHtml(defaultOptions)}</textarea>
                        
                        <div class="sub-q-wrapper" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
                            <div class="sub-q-content" style="display: ${hasSubQ ? 'block' : 'none'};">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="color: #38bdf8; font-size: var(--fs-caption); font-weight: 700;">Sub-Q:</span>
                                    <button type="button" onclick="this.closest('.sub-q-wrapper').querySelector('.part2-custom-subprompt-input').value=''; this.closest('.sub-q-wrapper').querySelector('.part2-custom-suboptions-input').value=''; this.closest('.sub-q-content').style.display='none'; this.closest('.sub-q-wrapper').querySelector('.btn-add-subq').style.display='inline-flex';" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; height: 22px; width: 22px;" title="${isZh ? '刪除子題' : 'Delete Sub-Question'}">&times;</button>
                                </div>
                                <textarea class="part2-custom-subprompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '子題題目' : 'Sub-question prompt'}" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); outline: none; margin-bottom: 4px; font-family: inherit; line-height: 1.4; resize: vertical; min-height: 28px; overflow-y: hidden;">${escapeHtml(subPrompt)}</textarea>
                                <div style="font-size: var(--fs-caption); color: #94a3b8; margin: 4px 0 2px 0;">${isZh ? '子題選項清單（每行一個選項）：' : 'Sub-question options list (one option per line):'}</div>
                                <textarea class="part2-custom-suboptions-input" rows="2" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; padding: 4px 6px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; line-height: 1.4; resize: vertical; outline: none;">${escapeHtml(subOptionsText)}</textarea>
                            </div>
                            <button type="button" class="btn btn-secondary btn-add-subq" onclick="this.closest('.sub-q-wrapper').querySelector('.sub-q-content').style.display='block'; this.style.display='none';" style="display: ${hasSubQ ? 'none' : 'inline-flex'}; align-items: center; gap: 4px; padding: 2px 8px; font-size: var(--fs-caption); height: 24px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);">
                                <span>${isZh ? '+ 新增子題 (Sub-Q)' : '+ Add Sub-Question'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(div);
            window.adjustAllQuestionTextareaHeights();
        };
        window.addPart3CustomQuestion = window.addPart2CustomQuestion;

        window.addWorkContentQuestion = function() {
            const list = document.getElementById('schema-part4-questions-list') || document.getElementById('list-sec-workContent');
            if (!list) return;
            const count = list.querySelectorAll('.q-card-row, .schema-question-card, .schema-demo-row').length;
            const nextQNum = 20 + count;
            const isZh = (currentLang === 'zh');
            const div = document.createElement('div');
            div.innerHTML = createQuestionModule1Card(nextQNum, isZh ? `工作與需求題目 ${nextQNum}` : `Work Content Question ${nextQNum}`, 'single', isZh ? ['選項 A', '選項 B'] : ['Option A', 'Option B'], '', '', isZh ? '題目名稱' : 'Question Prompt', isZh, false);
            list.appendChild(div.firstElementChild);
            if (window.adjustAllQuestionTextareaHeights) window.adjustAllQuestionTextareaHeights();
        };

        window.addNewJourneyQuestion = function() {
            const list = document.getElementById('schema-part5-questions-list') || document.getElementById('list-sec-journey-q26');
            if (!list) return;
            const count = list.querySelectorAll('.q-card-row, .schema-question-card, .schema-demo-row').length;
            const nextQNum = 26 + count;
            const isZh = (currentLang === 'zh');
            const div = document.createElement('div');
            div.innerHTML = createQuestionModule1Card(nextQNum, isZh ? `歷程相關題目 ${nextQNum}` : `Journey Question ${nextQNum}`, 'single', isZh ? ['選項 A', '選項 B'] : ['Option A', 'Option B'], '', '', isZh ? '題目名稱' : 'Question Prompt', isZh, true);
            list.appendChild(div.firstElementChild);
            if (window.adjustAllQuestionTextareaHeights) window.adjustAllQuestionTextareaHeights();
        };

        function createQuestionModule1Card(qNum, promptVal, typeVal, optionsList, subPromptVal, subOptionsList, placeholderText, isZh, isJourneyQuestion = false, subTypeVal = 'single') {
            const qId = `q${qNum}`;
            const isJourneyQ = isJourneyQuestion === true || Number(qNum) >= 26 || String(qId).toLowerCase() === 'q26';
            const isNoSubQ = [10, 13, 15, 22, 23, 24, 25].includes(Number(qNum)) || ['q10', 'q13', 'q15', 'q22', 'q23', 'q24', 'q25'].includes(String(qId).toLowerCase());
            const isLongQ = [7, 10, 12, 13, 16, 20, 21, 22, 23].includes(Number(qNum)) || (promptVal && promptVal.length > 70);
            const rowsVal = isLongQ ? 2 : 1;
            const minH = isLongQ ? 52 : 30;
            const optArray = Array.isArray(optionsList) ? optionsList : (optionsList ? String(optionsList).split(/[,，;\n\r]+/).map(s => s.trim()).filter(Boolean) : []);
            
            // Sub-question options & structure (Question Module 1 format)
            let subOptArray = Array.isArray(subOptionsList) 
                ? subOptionsList 
                : (subOptionsList ? String(subOptionsList).split(/[,，;\n\r]+/).map(s => s.trim()).filter(Boolean) : []);
            const hasSubQ = Boolean(!isNoSubQ && !isJourneyQ && (subPromptVal || subOptArray.length > 0));
            if (subOptArray.length === 0 && subTypeVal !== 'text') {
                subOptArray = isZh ? ['選項 1', '選項 2'] : ['Option 1', 'Option 2'];
            }
            const isSubSingle = (subTypeVal === 'single' || !subTypeVal);
            const isSubText = (subTypeVal === 'text');

            const optionsHtml = optArray.map(opt => `
                <div class="demo-option-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="color: var(--accent-yellow); font-size: var(--fs-body); user-select: none; width: 32px; min-width: 32px; text-align: center; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${typeVal === 'single' ? '○' : '□'}</span>
                    <input type="text" class="demo-option-input" value="${escapeHtmlAttr(opt)}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; min-width: 0; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <button type="button" onclick="removeDemoOptionItem(this)" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
                </div>
            `).join('');

            const subOptionsHtml = subOptArray.map(opt => `
                <div class="demo-option-item subq-option-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                    <span class="subq-choice-icon" style="color: #38bdf8; font-size: var(--fs-body); user-select: none; width: 32px; min-width: 32px; text-align: center; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${isSubSingle ? '○' : '□'}</span>
                    <input type="text" class="demo-option-input subq-option-input" value="${escapeHtmlAttr(opt)}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; min-width: 0; background: #1a2335; border: 1px solid rgba(56, 189, 248, 0.25); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <button type="button" onclick="this.closest('.subq-option-item').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
                </div>
            `).join('');

            const isNoCollapse = [11, 12].includes(Number(qNum));
            return `
                <div class="schema-demo-row schema-card-draggable q-card-row" id="card-${qId}" style="display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;">
                    ${isNoCollapse ? '<div class="row-icon-spacer" style="width: 24px; min-width: 24px; height: 24px; flex-shrink: 0; margin-top: 8px;" aria-hidden="true"></div>' : `<button type="button" class="btn-card-collapse btn-q-collapse" onclick="toggleQuestionCardCollapse(this)" style="width: 24px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; font-size: var(--fs-title); cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; margin-top: 8px;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>`}
                    <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                            <span class="demo-num-badge" style="font-size: var(--fs-small); color: #000; font-weight: 800; background: #eab308; padding: 4px 8px; border-radius: 4px; min-width: 32px; text-align: center; flex-shrink: 0;">Q${qNum}</span>
                            <textarea class="demo-label-input ${isLongQ ? 'q-prompt-2lines' : ''}" id="schema-${qId}-prompt-input" rows="${rowsVal}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${placeholderText}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-body); font-family: inherit; font-weight: 600; outline: none; resize: vertical; min-height: ${minH}px; height: ${minH}px; line-height: 1.4; overflow-y: hidden;">${escapeHtml(promptVal)}</textarea>
                            <select class="demo-type-select" id="schema-${qId}-type-select" onchange="onDemographicTypeChange(this)" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; font-family: inherit; outline: none; cursor: pointer; flex-shrink: 0;">
                                <option value="single" ${typeVal === 'single' ? 'selected' : ''}>${isZh ? '單選 (Single Choice)' : 'Single Choice'}</option>
                                <option value="multiple" ${typeVal === 'multiple' ? 'selected' : ''}>${isZh ? '多選 (Multiple Choice)' : 'Multiple Choice'}</option>
                                <option value="text" ${typeVal === 'text' ? 'selected' : ''}>${isZh ? '文字填空 (Open Write-in (_____))' : 'Open Write-in (_____)'}</option>
                            </select>
                            <button type="button" class="demo-del-btn" onclick="removeSchemaDemographicRow(this)" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此題' : 'Delete Question'}">&times;</button>
                            <div style="display: inline-flex; align-items: center; gap: 2px; color: #94a3b8; font-size: var(--fs-body); cursor: pointer; flex-shrink: 0;">
                                <span onclick="window.moveQuestionRow(this, -1)">▲</span><span onclick="window.moveQuestionRow(this, 1)">▼</span>
                            </div>
                        </div>
                        <div class="card-collapsible-body">
                            <div class="demo-selections-container" style="display: ${typeVal === 'text' ? 'none' : 'block'};">
                                <div class="demo-options-list" id="schema-${qId}-options-list" style="display: flex; flex-direction: column; gap: 5px;">
                                    ${optionsHtml}
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                    <button type="button" class="btn btn-secondary btn-add-selection" onclick="addDemoOptionItem(this)" style="padding: 4px 12px; font-size: var(--fs-caption); border-radius: 14px; display: inline-flex; align-items: center; gap: 4px;">
                                        <span>＋</span>
                                        <span>${isZh ? '新增選項' : 'Add Selection'}</span>
                                    </button>
                                    ${isJourneyQ ? `
                                    <button type="button" class="btn btn-secondary btn-add-journey-q" onclick="window.addNewJourneyQuestion()" style="padding: 4px 12px; font-size: var(--fs-caption); border-radius: 14px; display: inline-flex; align-items: center; gap: 4px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; background: rgba(56, 189, 248, 0.08);">
                                        <span>＋</span>
                                        <span>${isZh ? '新增題目' : 'Add Question'}</span>
                                    </button>
                                    ` : (isNoSubQ ? '' : `
                                    <button type="button" class="btn btn-secondary btn-add-subq btn-add-demo-subq" onclick="window.toggleDemoSubQuestion(this)" style="padding: 4px 12px; font-size: var(--fs-caption); border-radius: 14px; display: ${hasSubQ ? 'none' : 'inline-flex'}; align-items: center; gap: 4px; border-color: rgba(56, 189, 248, 0.4); color: #38bdf8; background: rgba(56, 189, 248, 0.08);">
                                        <span>＋</span>
                                        <span>${isZh ? '新增子問題' : 'Add Sub-Question'}</span>
                                    </button>
                                    `)}
                                </div>
                                ${isNoSubQ || isJourneyQ ? '' : `
                                <div class="demo-subq-wrapper subq-module1-card" id="subq-box-${qId}" style="margin-top: 10px; padding: 10px 12px; border-radius: 6px; background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.4); display: ${hasSubQ ? 'block' : 'none'};">
                                    <div style="display: flex; align-items: center; gap: 8px; width: 100%; margin-bottom: 8px;">
                                        <span class="subq-num-badge" style="font-size: var(--fs-caption); color: #0f172a; font-weight: 800; background: #38bdf8; padding: 3px 6px; border-radius: 4px; flex-shrink: 0;">Sub-Q</span>
                                        <textarea class="demo-subq-prompt-input subq-prompt-input" id="schema-${qId}-subprompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '輸入子題題目內容...' : 'Enter sub-question prompt...'}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(56, 189, 248, 0.25); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; font-weight: 600; outline: none; resize: vertical; min-height: 28px; line-height: 1.4; overflow-y: hidden;">${escapeHtml(subPromptVal)}</textarea>
                                        <select class="subq-type-select" onchange="window.onSubqTypeChange(this)" style="background: #1e293b; color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 8px; border-radius: 4px; font-size: var(--fs-caption); font-weight: 600; font-family: inherit; outline: none; cursor: pointer; flex-shrink: 0;">
                                            <option value="single" ${isSubSingle ? 'selected' : ''}>${isZh ? '單選 (Single Choice)' : 'Single Choice'}</option>
                                            <option value="multiple" ${subTypeVal === 'multiple' ? 'selected' : ''}>${isZh ? '多選 (Multiple Choice)' : 'Multiple Choice'}</option>
                                            <option value="text" ${isSubText ? 'selected' : ''}>${isZh ? '文字填空 (Open Write-in)' : 'Open Write-in'}</option>
                                        </select>
                                        <button type="button" class="btn-del-subq" onclick="window.removeDemoSubQuestion(this)" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除子題' : 'Delete Sub-Question'}">&times;</button>
                                    </div>
                                    <div class="subq-selections-container" style="display: ${isSubText ? 'none' : 'block'};">
                                        <div class="subq-options-list" style="display: flex; flex-direction: column; gap: 5px;">
                                            ${subOptionsHtml}
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                            <button type="button" class="btn btn-secondary btn-add-subq-selection" onclick="window.addSubqOptionItem(this)" style="padding: 3px 10px; font-size: var(--fs-caption); border-radius: 12px; display: inline-flex; align-items: center; gap: 4px; border-color: rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.06);">
                                                <span>＋</span>
                                                <span>${isZh ? '新增選項' : 'Add Selection'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="subq-text-preview" style="display: ${isSubText ? 'block' : 'none'}; margin-left: 38px; margin-top: 6px;">
                                        <div style="font-size: var(--fs-caption); color: #94a3b8; font-style: italic; background: rgba(255,255,255,0.02); padding: 6px 10px; border-radius: 4px; border: 1px dashed rgba(56, 189, 248, 0.25); box-sizing: border-box;">
                                            ${isZh ? '子題將顯示開放式填寫底線：__________________________________________' : 'Sub-question will provide an open blank line: __________________________________________'}
                                        </div>
                                    </div>
                                </div>
                                `}
                            </div>
                            <div class="demo-text-preview" style="display: ${typeVal === 'text' ? 'block' : 'none'}; margin-left: 46px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="flex: 1; min-width: 0; font-size: var(--fs-caption); color: #94a3b8; font-style: italic; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.12); box-sizing: border-box;">
                                        ${isZh ? '問卷中將顯示開放式填寫底線：__________________________________________' : 'Questionnaire will provide an open blank line: __________________________________________'}
                                    </div>
                                    <div style="visibility: hidden; display: flex; align-items: center; gap: 8px; flex-shrink: 0;" aria-hidden="true">
                                        <button type="button" class="demo-del-btn" style="background: transparent; border: none; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" tabindex="-1">&times;</button>
                                        <div style="display: inline-flex; align-items: center; gap: 2px; font-size: var(--fs-body); flex-shrink: 0;">
                                            <span>▲</span><span>▼</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function createQuestionModule2Card(qNum, promptVal, scaleVal, placeholderText, isZh) {
            const qId = `q${qNum}`;
            const isNoCollapse = [11, 12].includes(Number(qNum));
            return `
                <div class="schema-question-card schema-card-draggable q-card-row" id="card-${qId}" style="display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;">
                    ${isNoCollapse ? '<div class="row-icon-spacer" style="width: 24px; min-width: 24px; height: 24px; flex-shrink: 0; margin-top: 8px;" aria-hidden="true"></div>' : `<button type="button" class="btn-card-collapse btn-q-collapse" onclick="toggleQuestionCardCollapse(this)" style="width: 24px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; font-size: var(--fs-title); cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; margin-top: 8px;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>`}
                    <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                            <span class="q-badge" style="background: #eab308; color: #000; font-size: var(--fs-small); font-weight: 800; padding: 4px 8px; border-radius: 4px; min-width: 32px; text-align: center; flex-shrink: 0;">Q${qNum}</span>
                            <textarea id="schema-${qId}-prompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${placeholderText}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: var(--fs-body); font-weight: 600; padding: 6px 10px; border-radius: 4px; outline: none; resize: vertical; min-height: 30px; line-height: 1.4; overflow-y: hidden; font-family: inherit;">${escapeHtml(promptVal)}</textarea>
                            <select id="schema-${qId}-scale-select" class="dim-scale-select" onchange="window.updateQScalePreview('${qId}', this.value)" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; cursor: pointer; flex-shrink: 0; font-family: inherit;">
                                <option value="1-5" ${scaleVal === '1-5' ? 'selected' : ''}>1–5 Likert (1=Low, 5=High)</option>
                                <option value="1-7" ${scaleVal === '1-7' ? 'selected' : ''}>1–7 Likert (1=Low, 7=High)</option>
                                <option value="1-10" ${scaleVal === '1-10' ? 'selected' : ''}>1–10 Scale (1=Low, 10=High)</option>
                                <option value="emoji" ${scaleVal === 'emoji' ? 'selected' : ''}>${isZh ? '感受表情符號 (😩, 🙁, 😐, 🙂, 😄)' : 'Feeling emoji scale (😩, 🙁, 😐, 🙂, 😄)'}</option>
                                <option value="0-100" ${scaleVal === '0-100' ? 'selected' : ''}>${isZh ? '% 百分比 (0–100%)' : '% Scores (0–100%)'}</option>
                            </select>
                            <button type="button" onclick="removeSchemaDimensionRow(this)" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此題' : 'Delete Question'}">&times;</button>
                            <div style="display: inline-flex; align-items: center; gap: 2px; color: #94a3b8; font-size: var(--fs-body); cursor: pointer; flex-shrink: 0;">
                                <span onclick="window.moveQuestionRow(this, -1)">▲</span><span onclick="window.moveQuestionRow(this, 1)">▼</span>
                            </div>
                        </div>
                        <div class="card-collapsible-body">
                            <div id="schema-${qId}-scale-preview" style="background: rgba(0,0,0,0.2); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 8px 12px; font-size: var(--fs-caption); color: #94a3b8;">
                                ${window.getQScalePreviewHtml ? window.getQScalePreviewHtml(scaleVal, isZh) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function createQuestionModule3Card(qNum, promptVal, items, placeholderText, isZh) {
            const qId = `q${qNum}`;
            const isLongQ = [7, 10, 12, 13, 16, 20, 21, 22, 23].includes(Number(qNum)) || (promptVal && promptVal.length > 70);
            const rowsVal = isLongQ ? 2 : 1;
            const minH = isLongQ ? 52 : 30;
            const rowsHtml = items.map((it, idx) => `
                <div class="matrix-item-row" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                    <input type="text" class="matrix-label-input" value="${escapeHtmlAttr(it.label || '')}" placeholder="${isZh ? '評估項目名稱' : 'Evaluation factor'}" style="flex: 1; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <select class="matrix-scale-select" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; cursor: pointer; flex-shrink: 0; font-family: inherit;">
                        <option value="1">${isZh ? '完全無影響' : 'No Impact at All'}</option>
                        <option value="2">${isZh ? '有些微影響' : 'A Little Impact'}</option>
                        <option value="3">${isZh ? '普通中立' : 'Neutral'}</option>
                        <option value="4">${isZh ? '有明顯影響' : 'Has Impact'}</option>
                        <option value="5" selected>${isZh ? '高度影響' : 'High Impact'}</option>
                    </select>
                    <button type="button" onclick="this.closest('.matrix-item-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此項目' : 'Delete Item'}">&times;</button>
                </div>
            `).join('');

            const isNoCollapse = [11, 12].includes(Number(qNum));
            return `
                <div class="schema-question-card schema-card-draggable q-card-row" id="card-${qId}" style="display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;">
                    ${isNoCollapse ? '<div class="row-icon-spacer" style="width: 24px; min-width: 24px; height: 24px; flex-shrink: 0; margin-top: 8px;" aria-hidden="true"></div>' : `<button type="button" class="btn-card-collapse btn-q-collapse" onclick="toggleQuestionCardCollapse(this)" style="width: 24px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; font-size: var(--fs-title); cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; margin-top: 8px;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>`}
                    <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                            <span class="q-badge" style="background: #eab308; color: #000; font-size: var(--fs-small); font-weight: 800; border-radius: 4px; width: 36px; min-width: 36px; box-sizing: border-box; text-align: center; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 4px 0;">Q${qNum}</span>
                            <textarea class="${isLongQ ? 'q-prompt-2lines' : ''}" id="schema-${qId}-prompt-input" rows="${rowsVal}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${placeholderText}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: var(--fs-body); font-weight: 600; padding: 6px 10px; border-radius: 4px; outline: none; resize: vertical; min-height: ${minH}px; height: ${minH}px; line-height: 1.4; overflow-y: hidden; font-family: inherit;">${escapeHtml(promptVal)}</textarea>
                            <button type="button" onclick="removeSchemaDimensionRow(this)" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此題' : 'Delete Question'}">&times;</button>
                            <div style="display: inline-flex; align-items: center; gap: 2px; color: #94a3b8; font-size: var(--fs-body); cursor: pointer; flex-shrink: 0;">
                                <span onclick="window.moveQuestionRow(this, -1)">▲</span><span onclick="window.moveQuestionRow(this, 1)">▼</span>
                            </div>
                        </div>
                        <div class="card-collapsible-body">
                            <div id="schema-${qId}-matrix-list" style="display: flex; flex-direction: column; gap: 5px;">
                                ${rowsHtml}
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                                <button type="button" class="btn btn-secondary" onclick="addMatrixItemToCard('${qId}')" style="padding: 4px 12px; font-size: var(--fs-caption); border-radius: 14px; display: inline-flex; align-items: center; gap: 4px;">
                                    <span>＋</span>
                                    <span>${isZh ? '新增評估項目' : 'Add Item'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        window.addMatrixItemToCard = function(qId) {
            const list = document.getElementById(`schema-${qId}-matrix-list`);
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const div = document.createElement('div');
            div.className = 'matrix-item-row';
            div.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px;';
            div.innerHTML = `
                <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                <input type="text" class="matrix-label-input" value="" placeholder="${isZh ? '評估項目名稱' : 'Evaluation factor'}" style="flex: 1; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <select class="matrix-scale-select" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; cursor: pointer; flex-shrink: 0; font-family: inherit;">
                    <option value="1">${isZh ? '完全無影響' : 'No Impact at All'}</option>
                    <option value="2">${isZh ? '有些微影響' : 'A Little Impact'}</option>
                    <option value="3">${isZh ? '普通中立' : 'Neutral'}</option>
                    <option value="4">${isZh ? '有明顯影響' : 'Has Impact'}</option>
                    <option value="5" selected>${isZh ? '高度影響' : 'High Impact'}</option>
                </select>
                <button type="button" onclick="this.closest('.matrix-item-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此項目' : 'Delete Item'}">&times;</button>
            `;
            list.appendChild(div);
        };

        function createQuestionModule4Card(qNum, promptVal, placeholderText, isZh) {
            const qId = `q${qNum}`;
            return `
                <div class="schema-question-card schema-card-draggable q-card-row" id="card-${qId}" style="display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;">
                    <div class="row-icon-spacer" style="width: 24px; min-width: 24px; height: 24px; flex-shrink: 0;"></div>
                    <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; box-sizing: border-box;">
                        <span class="q-badge" style="background: #eab308; color: #000; font-size: var(--fs-small); font-weight: 800; padding: 4px 8px; border-radius: 4px; min-width: 32px; text-align: center; flex-shrink: 0;">Q${qNum}</span>
                        <textarea class="demo-label-input" id="schema-${qId}-prompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${placeholderText}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: var(--fs-body); font-weight: 600; padding: 7px 12px; border-radius: 6px; outline: none; font-family: inherit; resize: vertical; min-height: 32px; line-height: 1.4; overflow-y: hidden;">${escapeHtml(promptVal)}</textarea>
                        <button type="button" onclick="this.closest('.q-card-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此題' : 'Delete Question'}">&times;</button>
                        <div style="display: inline-flex; align-items: center; gap: 2px; color: #94a3b8; font-size: var(--fs-body); cursor: pointer; flex-shrink: 0;">
                            <span onclick="window.moveQuestionRow(this, -1)">▲</span><span onclick="window.moveQuestionRow(this, 1)">▼</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function createQuestionModule5Card(promptVal, workItems, isZh) {
            const rowsHtml = workItems.map((item, idx) => `
                <div class="schema-work-row" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                    <input type="text" class="work-item-name" value="${escapeHtmlAttr(item)}" placeholder="${isZh ? '工作項目名稱' : 'Work item label'}" style="flex: 1; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <select class="work-pct-select" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; cursor: pointer; flex-shrink: 0; font-family: inherit;">
                        ${[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => `
                            <option value="${p}" ${p === 10 ? 'selected' : ''}>✓ ${p}%</option>
                        `).join('')}
                    </select>
                    <button type="button" onclick="this.closest('.schema-work-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;">&times;</button>
                </div>
            `).join('');

            return `
                <div class="schema-question-card q-card-row" id="card-q20" style="display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;">
                    <button type="button" class="btn-card-collapse btn-q-collapse" onclick="toggleQuestionCardCollapse(this)" style="width: 24px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; font-size: var(--fs-title); cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; margin-top: 8px;">⊟</button>
                    <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                            <span class="q-badge" style="background: #eab308; color: #000; font-size: var(--fs-small); font-weight: 800; border-radius: 4px; width: 36px; min-width: 36px; box-sizing: border-box; text-align: center; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 4px 0;">Q20</span>
                            <textarea class="q-prompt-2lines" id="schema-q20-prompt-input" rows="2" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '第 20 題題目' : 'Question 20 Prompt'}" style="flex: 1; min-width: 0; box-sizing: border-box; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: var(--fs-body); font-weight: 600; padding: 6px 10px; border-radius: 4px; outline: none; resize: vertical; min-height: 52px; height: 52px; line-height: 1.4; font-family: inherit;">${escapeHtml(promptVal)}</textarea>
                            <button type="button" onclick="this.closest('.q-card-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;" title="${isZh ? '刪除此題' : 'Delete Question'}">&times;</button>
                            <div style="display: inline-flex; align-items: center; gap: 2px; color: #94a3b8; font-size: var(--fs-body); cursor: pointer; flex-shrink: 0;">
                                <span onclick="window.moveQuestionRow(this, -1)">▲</span><span onclick="window.moveQuestionRow(this, 1)">▼</span>
                            </div>
                        </div>
                        <div class="card-collapsible-body">
                            <div id="schema-work-items-list" style="display: flex; flex-direction: column; gap: 5px;">
                                ${rowsHtml}
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                                <button type="button" class="btn btn-secondary" onclick="addSchemaWorkItem()" style="padding: 4px 12px; font-size: var(--fs-caption); border-radius: 14px; display: inline-flex; align-items: center; gap: 4px;">
                                    <span>＋</span>
                                    <span>${isZh ? '新增日常工作項目' : 'Add Work Item'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function addSchemaTagItem(text = '', checked = true) {
            const list = document.getElementById('schema-tags-checklist');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const defaultText = text || (isZh ? '新標籤' : 'New Tag');
            const div = document.createElement('div');
            div.className = 'schema-tag-item';
            div.style.cssText = 'display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 4px 8px; margin: 2px;';
            div.innerHTML = `
                <input type="checkbox" class="tag-item-chk" ${checked ? 'checked' : ''} style="accent-color: var(--accent-yellow); cursor: pointer;" title="${isZh ? '勾選以納入問卷' : 'Check to include in survey'}">
                <input type="text" class="tag-item-text" value="${escapeHtmlAttr(defaultText)}" placeholder="${isZh ? '輸入標籤' : 'Tag text'}" style="background: transparent; border: none; color: #facc15; font-size: var(--fs-small); font-family: inherit; outline: none; width: 140px;">
                <button type="button" onclick="this.closest('.schema-tag-item').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 0 3px;" title="${isZh ? '刪除標籤' : 'Delete Tag'}">&times;</button>
            `;
            list.appendChild(div);
        }

        function deleteSchemaArchetypeTags() {
            const row = document.getElementById('schema-row-archetype-tags');
            const restoreRow = document.getElementById('schema-row-restore-archetype-tags');
            if (row) row.style.display = 'none';
            if (restoreRow) restoreRow.style.display = 'flex';
        }

        function restoreSchemaArchetypeTags() {
            const row = document.getElementById('schema-row-archetype-tags');
            const restoreRow = document.getElementById('schema-row-restore-archetype-tags');
            if (row) row.style.display = 'flex';
            if (restoreRow) restoreRow.style.display = 'none';
        }

        function addSchemaWorkItem(text = '', checked = true) {
            const list = document.getElementById('schema-work-items-list') || document.getElementById('schema-q20-items-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.schema-work-row, .q20-work-item').length;
            const letter = String.fromCharCode(97 + count);
            const defaultText = text || `${letter}) ${isZh ? '新工作項目' : 'New Work Item'}`;
            const div = document.createElement('div');
            div.className = 'schema-work-row';
            div.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px;';
            div.innerHTML = `
                <div class="matrix-item-spacer" style="width: 36px; min-width: 36px; flex-shrink: 0;"></div>
                <input type="text" class="work-item-name" value="${escapeHtmlAttr(defaultText)}" placeholder="${isZh ? '工作項目名稱' : 'Work item label'}" style="flex: 1; background: #1a2335; border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <select class="work-pct-select" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; outline: none; cursor: pointer; flex-shrink: 0; font-family: inherit;">
                    ${[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => `
                        <option value="${p}" ${p === 10 ? 'selected' : ''}>✓ ${p}%</option>
                    `).join('')}
                </select>
                <button type="button" onclick="this.closest('.schema-work-row').remove()" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: var(--fs-title); line-height: 1; padding: 2px 4px; flex-shrink: 0;">&times;</button>
            `;
            list.appendChild(div);
        }

        function addSchemaOfficialSystemItem(text = '', checked = true) {
            const list = document.getElementById('schema-q22-items-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.q22-sys-item').length;
            const defaultText = text || (isZh ? `系統 ${count + 1}` : `System ${count + 1}`);
            const div = document.createElement('div');
            div.className = 'q22-sys-item';
            div.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 4px;';
            div.innerHTML = `
                <input type="checkbox" class="q22-item-chk" ${checked ? 'checked' : ''} style="accent-color: var(--accent-yellow); cursor: pointer;" title="${isZh ? '勾選以納入問卷' : 'Check to include in survey'}">
                <input type="text" class="q22-item-text" value="${escapeHtmlAttr(defaultText)}" placeholder="${isZh ? '系統名稱' : 'System name'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <button type="button" onclick="this.closest('.q22-sys-item').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 0 4px;" title="${isZh ? '刪除系統' : 'Delete System'}">&times;</button>
            `;
            list.appendChild(div);
        }

        function addSchemaPersonalToolItem(text = '', checked = true) {
            const list = document.getElementById('schema-q23-items-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.q23-tool-item').length;
            const defaultText = text || (isZh ? `工具 ${count + 1}` : `Tool ${count + 1}`);
            const div = document.createElement('div');
            div.className = 'q23-tool-item';
            div.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 4px;';
            div.innerHTML = `
                <input type="checkbox" class="q23-item-chk" ${checked ? 'checked' : ''} style="accent-color: var(--accent-yellow); cursor: pointer;" title="${isZh ? '勾選以納入問卷' : 'Check to include in survey'}">
                <input type="text" class="q23-item-text" value="${escapeHtmlAttr(defaultText)}" placeholder="${isZh ? '工具名稱' : 'Tool name'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <button type="button" onclick="this.closest('.q23-tool-item').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 0 4px;" title="${isZh ? '刪除工具' : 'Delete Tool'}">&times;</button>
            `;
            list.appendChild(div);
        }

        function addSchemaCoreNeedItem(text = '', checked = true) {
            const list = document.getElementById('schema-q24-items-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.q24-need-item').length;
            const defaultText = text || (isZh ? `需求 ${count + 1}` : `Need ${count + 1}`);
            const div = document.createElement('div');
            div.className = 'q24-need-item';
            div.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 4px;';
            div.innerHTML = `
                <input type="checkbox" class="q24-item-chk" ${checked ? 'checked' : ''} style="accent-color: var(--accent-yellow); cursor: pointer;" title="${isZh ? '勾選以納入問卷' : 'Check to include in survey'}">
                <input type="text" class="q24-item-text" value="${escapeHtmlAttr(defaultText)}" placeholder="${isZh ? '核心需求名稱' : 'Core need text'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <button type="button" onclick="this.closest('.q24-need-item').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 0 4px;" title="${isZh ? '刪除需求' : 'Delete Need'}">&times;</button>
            `;
            list.appendChild(div);
        }

        function addSchemaDemographicRow(label = '', options = '', type = 'choice', subPrompt = '', subOptions = '') {
            const demoList = document.getElementById('schema-demographics-list');
            if (!demoList) return;

            const emptyPlaceholder = document.getElementById('demo-empty-placeholder');
            if (emptyPlaceholder) emptyPlaceholder.remove();

            const isZh = (currentLang === 'zh');
            const currentCount = demoList.querySelectorAll('.schema-demo-row').length;
            const qNum = currentCount + 1;
            const defaultLabel = label !== '' ? label : (isZh ? `背景題目 ${qNum}` : `Demographic Question ${qNum}`);
            const isLongQ = [7, 10, 12, 13, 16, 20, 21, 22, 23].includes(Number(qNum)) || (defaultLabel && defaultLabel.length > 70);
            const rowsVal = isLongQ ? 2 : 1;
            const minH = isLongQ ? 52 : 30;

            // Detect type if not explicit
            let detectedType = (type === 'multiple') ? 'multiple' : (type === 'text' || (options && options.includes('___')) ? 'text' : 'single');
            let initialOptions = options;
            if (options && (options.includes('___') || options.trim() === '')) {
                if (options.includes('___')) detectedType = 'text';
            } else if (!options && label === '') {
                initialOptions = isZh ? '選項 A, 選項 B, 選項 C' : 'Option A, Option B, Option C';
            }

            // Parse options list
            let optArray = [];
            if (typeof initialOptions === 'string' && initialOptions.trim()) {
                optArray = initialOptions.split(/[,，;；\n\r]+/).map(o => o.trim()).filter(Boolean);
            }
            if (optArray.length === 0 && (detectedType === 'single' || detectedType === 'multiple' || detectedType === 'choice')) {
                optArray = isZh ? ['選項 1', '選項 2'] : ['Option 1', 'Option 2'];
            }

            const isJourneyQ = Number(qNum) >= 26;
            const isNoSubQ = [10, 13, 15, 22, 23, 24, 25].includes(Number(qNum));
            let subOptArray = Array.isArray(subOptions) 
                ? subOptions 
                : (subOptions ? String(subOptions).split(/[,，;\n\r]+/).map(s => s.trim()).filter(Boolean) : []);
            const hasSubQ = Boolean(!isNoSubQ && !isJourneyQ && (subPrompt || subOptArray.length > 0));
            if (subOptArray.length === 0) {
                subOptArray = isZh ? ['選項 1', '選項 2'] : ['Option 1', 'Option 2'];
            }

            const div = document.createElement('div');
            div.className = 'schema-demo-row schema-card-draggable';
            div.style.cssText = 'display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; transition: all 0.2s ease;';

            const optionsHtml = optArray.map(opt => `
                <div class="demo-option-item" style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: var(--accent-yellow); font-size: var(--fs-small); user-select: none;">○</span>
                    <input type="text" class="demo-option-input" value="${escapeHtmlAttr(opt)}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <button type="button" onclick="removeDemoOptionItem(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 2px 6px; border-radius: 3px;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
                </div>
            `).join('');

            const subOptionsHtml = subOptArray.map(opt => `
                <div class="demo-option-item subq-option-item" style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                    <span class="subq-choice-icon" style="color: #38bdf8; font-size: var(--fs-small); user-select: none;">○</span>
                    <input type="text" class="demo-option-input subq-option-input" value="${escapeHtmlAttr(opt)}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                    <button type="button" onclick="this.closest('.subq-option-item').remove()" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 2px 6px; border-radius: 3px;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
                </div>
            `).join('');

            const isNoCollapse = [11, 12].includes(Number(qNum));
            div.innerHTML = `
                ${isNoCollapse ? '<div class="row-icon-spacer" style="width: 24px; min-width: 24px; height: 24px; flex-shrink: 0;" aria-hidden="true"></div>' : `<button type="button" class="btn-card-collapse" onclick="toggleQuestionCardCollapse(this)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 7px 0 0 0; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>`}
                <div class="schema-card-box" style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                        <span class="demo-num-badge" style="font-size: var(--fs-caption); color: #000; font-weight: 800; background: #eab308; padding: 4px 7px; border-radius: 4px; min-width: 24px; text-align: center; flex-shrink: 0;">Q${qNum}</span>
                        <textarea class="demo-label-input ${isLongQ ? 'q-prompt-2lines' : ''}" rows="${rowsVal}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '題目名稱（例：年齡區間、居住地區、身分角色）' : 'Question Prompt (e.g. Age Range, Service Region, Job Title)'}" style="flex: 1; box-sizing: border-box; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; font-weight: 600; outline: none; resize: vertical; min-height: ${minH}px; height: ${minH}px; line-height: 1.4; overflow-y: hidden;">${escapeHtml(defaultLabel)}</textarea>
                        <select class="demo-type-select" onchange="onDemographicTypeChange(this)" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 5px 8px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none; cursor: pointer; flex-shrink: 0;">
                            <option value="single" ${detectedType === 'single' || detectedType === 'choice' ? 'selected' : ''}>${isZh ? '單選題' : 'Single Choice'}</option>
                            <option value="multiple" ${detectedType === 'multiple' ? 'selected' : ''}>${isZh ? '多選題' : 'Multiple Choice'}</option>
                            <option value="text" ${detectedType === 'text' ? 'selected' : ''}>${isZh ? '文字填空題 (_____)' : 'Open Write-in (_____)'}</option>
                        </select>
                        <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                            <div style="display: inline-flex; align-items: center; gap: 3px;">
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, -1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '上移' : 'Move Up'}">▲</button>
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, 1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '下移' : 'Move Down'}">▼</button>
                            </div>
                            <button type="button" onclick="removeSchemaDemographicRow(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; display: flex; align-items: center; justify-content: center; height: 26px; width: 26px; border-radius: 4px;" title="${isZh ? '刪除題目' : 'Delete Question'}">&times;</button>
                        </div>
                    </div>
                    <div class="card-collapsible-body">
                        <div class="demo-selections-container" style="display: ${detectedType === 'text' ? 'none' : 'block'};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <span style="font-size: var(--fs-caption); color: var(--text-muted); font-weight: 500;">${isZh ? '選項設定（個別編輯，問卷將呈現為勾選鈕 [ ]）：' : 'SELECTIONS / OPTIONS (Will render as [ ] options in survey):'}</span>
                            </div>
                            <div class="demo-options-list" style="display: flex; flex-direction: column; gap: 5px;">
                                ${optionsHtml}
                            </div>
                            <!-- + Add Selection button placed right AFTER the last selection of each question, with + Add Sub-Question placed below it -->
                            <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-start; margin-top: 6px;">
                                <button type="button" class="btn btn-secondary btn-add-selection" onclick="addDemoOptionItem(this)" style="padding: 3px 10px; font-size: var(--fs-caption); height: 25px; display: inline-flex; align-items: center; gap: 4px;">
                                    <span>＋</span>
                                    <span>${isZh ? '新增選項' : 'Add Selection'}</span>
                                </button>
                                ${isJourneyQ ? `
                                <button type="button" class="btn btn-secondary btn-add-journey-q" onclick="window.addNewJourneyQuestion()" style="display: inline-flex; padding: 3px 10px; font-size: var(--fs-caption); height: 25px; align-items: center; gap: 4px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);">
                                    <span>${isZh ? '+ 新增題目' : '+ Add Question'}</span>
                                </button>
                                ` : (isNoSubQ ? '' : `
                                <button type="button" class="btn btn-secondary btn-add-demo-subq" onclick="window.toggleDemoSubQuestion(this)" style="display: ${hasSubQ ? 'none' : 'inline-flex'}; padding: 3px 10px; font-size: var(--fs-caption); height: 25px; align-items: center; gap: 4px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.35);">
                                    <span>${isZh ? '+ 新增子問題' : '+ Add Sub-Question'}</span>
                                </button>
                                `)}
                            </div>
                            ${isNoSubQ || isJourneyQ ? '' : `
                            <div class="demo-subq-wrapper subq-module1-card" style="margin-top: 8px; padding: 8px 10px; border-radius: 6px; background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.35); display: ${hasSubQ ? 'block' : 'none'};">
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                                    <span class="subq-badge" style="color: #0f172a; background: #38bdf8; font-size: var(--fs-caption); font-weight: 800; padding: 2px 5px; border-radius: 3px; flex-shrink: 0;">Sub-Q</span>
                                    <textarea class="demo-subq-prompt-input subq-prompt-input" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${isZh ? '輸入子題題目內容...' : 'Enter sub-question prompt...'}" style="flex: 1; min-width: 0; box-sizing: border-box; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); outline: none; font-family: inherit; line-height: 1.4; resize: vertical; min-height: 28px; overflow-y: hidden;">${escapeHtml(subPrompt)}</textarea>
                                    <select class="subq-type-select" onchange="window.onSubqTypeChange(this)" style="background: #1e293b; color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none; cursor: pointer; flex-shrink: 0;">
                                        <option value="single">${isZh ? '單選題' : 'Single Choice'}</option>
                                        <option value="multiple">${isZh ? '多選題' : 'Multiple Choice'}</option>
                                        <option value="text">${isZh ? '文字填空' : 'Open Write-in'}</option>
                                    </select>
                                    <button type="button" class="btn-del-subq" onclick="window.removeDemoSubQuestion(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; height: 22px; width: 22px; flex-shrink: 0;" title="${isZh ? '刪除子題' : 'Delete Sub-Question'}">&times;</button>
                                </div>
                                <div class="subq-selections-container">
                                    <div class="subq-options-list" style="display: flex; flex-direction: column; gap: 4px;">
                                        ${subOptionsHtml}
                                    </div>
                                    <div style="margin-top: 6px;">
                                        <button type="button" class="btn btn-secondary btn-add-subq-selection" onclick="window.addSubqOptionItem(this)" style="padding: 2px 8px; font-size: var(--fs-caption); height: 22px; display: inline-flex; align-items: center; gap: 3px; color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">
                                            <span>＋</span>
                                            <span>${isZh ? '新增選項' : 'Add Selection'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="subq-text-preview" style="display: none; margin-left: 28px; margin-top: 4px;">
                                    <div style="font-size: var(--fs-caption); color: #94a3b8; font-style: italic; background: rgba(255,255,255,0.02); padding: 4px 8px; border-radius: 4px; border: 1px dashed rgba(56, 189, 248, 0.25);">
                                        ${isZh ? '子題將顯示開放式填寫底線：__________________________________________' : 'Sub-question will provide an open blank line: __________________________________________'}
                                    </div>
                                </div>
                            </div>
                            `}
                        </div>
                        <div class="demo-text-preview" style="display: ${detectedType === 'text' ? 'block' : 'none'}; margin-left: 46px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="flex: 1; min-width: 0; font-size: var(--fs-caption); color: #94a3b8; font-style: italic; background: rgba(255,255,255,0.02); padding: 6px 10px; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.1); box-sizing: border-box;">
                                    ${isZh ? '填空題型態：問卷中將顯示開放式填寫底線：__________________________________________' : 'Write-in question: Questionnaire will provide an open blank line: __________________________________________'}
                                </div>
                                <div style="visibility: hidden; display: flex; align-items: center; gap: 4px; flex-shrink: 0;" aria-hidden="true">
                                    <div style="display: inline-flex; align-items: center; gap: 3px;">
                                        <button type="button" class="btn-seq-move" style="padding: 2px 4px; font-size: var(--fs-body);" tabindex="-1">▲</button>
                                        <button type="button" class="btn-seq-move" style="padding: 2px 4px; font-size: var(--fs-body);" tabindex="-1">▼</button>
                                    </div>
                                    <button type="button" style="height: 26px; width: 26px; font-size: var(--fs-title);" tabindex="-1">&times;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            demoList.appendChild(div);
            reindexSchemaDemographicNumbers();
            window.adjustAllQuestionTextareaHeights();
        }

        function addDemoOptionItem(btn) {
            const container = btn.closest('.demo-selections-container');
            if (!container) return;
            const list = container.querySelector('.demo-options-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.demo-option-item').length;
            const optDiv = document.createElement('div');
            optDiv.className = 'demo-option-item';
            optDiv.style.cssText = 'display: flex; align-items: center; gap: 6px;';
            optDiv.innerHTML = `
                <span style="color: var(--accent-yellow); font-size: var(--fs-small); user-select: none;">○</span>
                <input type="text" class="demo-option-input" value="${isZh ? `選項 ${count + 1}` : `Option ${count + 1}`}" placeholder="${isZh ? '輸入選項內容' : 'Option text'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <button type="button" onclick="removeDemoOptionItem(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-subtitle); line-height: 1; padding: 2px 6px; border-radius: 3px;" title="${isZh ? '刪除此選項' : 'Delete Option'}">&times;</button>
            `;
            list.appendChild(optDiv);
            const input = optDiv.querySelector('.demo-option-input');
            if (input) {
                input.focus();
                input.select();
            }
        }

        function removeDemoOptionItem(btn) {
            const item = btn.closest('.demo-option-item');
            const list = item && item.parentElement;
            if (item && list) {
                if (list.querySelectorAll('.demo-option-item').length <= 1) {
                    const input = item.querySelector('.demo-option-input');
                    if (input) input.value = '';
                } else {
                    item.remove();
                }
            }
        }

        function onDemographicTypeChange(selectEl) {
            const row = selectEl.closest('.schema-demo-row') || selectEl.closest('.schema-question-card');
            if (!row) return;
            const optionsContainer = row.querySelector('.demo-selections-container');
            const textPreview = row.querySelector('.demo-text-preview');
            const isText = (selectEl.value === 'text');
            if (optionsContainer) optionsContainer.style.display = isText ? 'none' : 'block';
            if (textPreview) textPreview.style.display = isText ? 'block' : 'none';
        }

        function removeSchemaDemographicRow(btn) {
            const row = btn.closest('.schema-demo-row');
            if (row) {
                row.remove();
                reindexSchemaDemographicNumbers();
            }
        }

        function moveSchemaDemographicRow(btn, direction) {
            const row = btn.closest('.schema-demo-row');
            if (!row) return;
            const list = document.getElementById('schema-demographics-list');
            if (!list) return;
            if (direction === -1) {
                const prev = row.previousElementSibling;
                if (prev && prev.classList.contains('schema-demo-row')) {
                    list.insertBefore(row, prev);
                    reindexSchemaDemographicNumbers();
                }
            } else if (direction === 1) {
                const next = row.nextElementSibling;
                if (next && next.classList.contains('schema-demo-row')) {
                    list.insertBefore(next, row);
                    reindexSchemaDemographicNumbers();
                }
            }
        }

        function reindexSchemaDemographicNumbers() {
            const demoList = document.getElementById('schema-demographics-list');
            if (!demoList) return;
            const rows = demoList.querySelectorAll('.schema-demo-row');
            const isZh = (currentLang === 'zh');

            if (rows.length === 0) {
                let emptyPlaceholder = document.getElementById('demo-empty-placeholder');
                if (!emptyPlaceholder) {
                    emptyPlaceholder = document.createElement('div');
                    emptyPlaceholder.id = 'demo-empty-placeholder';
                    emptyPlaceholder.style.cssText = 'text-align: center; padding: 18px 12px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.12); border-radius: 8px; color: var(--text-muted); font-size: var(--fs-small);';
                    emptyPlaceholder.innerHTML = `
                        <div style="margin-bottom: 8px;">${isZh ? '目前沒有任何背景資料題目。' : 'No demographic questions configured.'}</div>
                        <button type="button" class="btn btn-secondary" onclick="addSchemaDemographicRow()" style="padding: 4px 12px; font-size: var(--fs-small); height: 28px;">
                            ${isZh ? '＋ 新增第一道背景題目' : '+ Add First Demographic Question'}
                        </button>
                    `;
                    demoList.appendChild(emptyPlaceholder);
                }
                return;
            } else {
                const emptyPlaceholder = document.getElementById('demo-empty-placeholder');
                if (emptyPlaceholder) emptyPlaceholder.remove();
            }

            rows.forEach((r, idx) => {
                const badge = r.querySelector('.demo-num-badge');
                if (badge) badge.textContent = `Q${idx + 1}`;
                
                const upBtn = r.querySelector('.demo-move-up-btn');
                const downBtn = r.querySelector('.demo-move-down-btn');
                if (upBtn) {
                    upBtn.style.opacity = idx === 0 ? '0.25' : '1';
                    upBtn.style.pointerEvents = idx === 0 ? 'none' : 'auto';
                }
                if (downBtn) {
                    downBtn.style.opacity = idx === rows.length - 1 ? '0.25' : '1';
                    downBtn.style.pointerEvents = idx === rows.length - 1 ? 'none' : 'auto';
                }
            });
        }

        window.syncUnifiedScaleAcrossDimensions = function(val) {
            const unifiedSelect = document.getElementById('schema-unified-scale-select');
            if (unifiedSelect && unifiedSelect.value !== val) {
                unifiedSelect.value = val;
            }
            document.querySelectorAll('.dim-scale-select').forEach(sel => {
                if (sel.value !== val) sel.value = val;
            });
            const labelMap = {
                '1-5': '5-point Likert (1–5)',
                '1-7': '7-point Likert (1–7)',
                '1-10': '10-point Scale (1–10)',
                '0-100': '% Scores (0–100%)'
            };
            const badgeText = labelMap[val] || val;
            document.querySelectorAll('.q11-scale-badge, .q12-scale-badge').forEach(b => {
                b.textContent = badgeText;
            });
        };

        function addSchemaDimensionRow(label = '', scaleType = '1-5', targetContainerId = null, category = 'system_efficiency') {
            let dimList = targetContainerId ? document.getElementById(targetContainerId) : null;
            if (!dimList) {
                dimList = (category === 'sales_performance' ? document.getElementById('schema-dimensions-q12-list') : null) ||
                          document.getElementById('schema-dimensions-q11-list') ||
                          document.getElementById('schema-dimensions-generic-list') ||
                          document.getElementById('schema-dimensions-list');
            }
            if (!dimList) return;
            const emptyDim = document.getElementById('dim-empty-placeholder');
            if (emptyDim) emptyDim.remove();
            const currentTotal = document.querySelectorAll('.schema-dim-row').length;
            if (currentTotal >= 12) {
                alert('Maximum 12 dimensions supported for radar clarity.');
                return;
            }
            const isZh = (currentLang === 'zh');
            const defaultLabel = label || (category === 'sales_performance' ? `Capability ${currentTotal + 1}` : `System Factor ${currentTotal + 1}`);
            const effectiveScale = scaleType || '1-5';

            const div = document.createElement('div');
            div.className = 'schema-dim-row';
            div.dataset.category = category;
            div.style.cssText = 'display: grid; grid-template-columns: 2fr 1.5fr 36px; gap: 8px; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); padding: 6px 10px; border-radius: 6px;';
            div.innerHTML = `
                <input type="text" class="dim-label-input" value="${escapeHtmlAttr(defaultLabel)}" placeholder="Dimension Name (e.g. Product Knowledge)" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none;">
                <select class="dim-scale-select" style="background: #1e293b; color: var(--accent-yellow); border: 1px solid rgba(255,255,255,0.15); padding: 4px 6px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; outline: none; cursor: pointer;">
                    <option value="1-5" ${effectiveScale === '1-5' ? 'selected' : ''}>1–5 Likert (1=Low, 5=High)</option>
                    <option value="1-7" ${effectiveScale === '1-7' ? 'selected' : ''}>1–7 Likert (1=Low, 7=High)</option>
                    <option value="1-10" ${effectiveScale === '1-10' ? 'selected' : ''}>1–10 Scale (1=Low, 10=High)</option>
                    <option value="0-100" ${effectiveScale === '0-100' ? 'selected' : ''}>0–100% Score</option>
                    <option value="emoji" ${effectiveScale === 'emoji' ? 'selected' : ''}>${isZh ? '感受表情符號 (😩, 🙁, 😐, 🙂, 😄)' : 'Feeling emoji scale (😩, 🙁, 😐, 🙂, 😄)'}</option>
                </select>
                <button type="button" onclick="removeSchemaDimensionRow(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; display: flex; align-items: center; justify-content: center; height: 28px; width: 28px; border-radius: 4px;" title="Delete Dimension">&times;</button>
            `;
            dimList.appendChild(div);
        }

        function removeSchemaDimensionRow(btn) {
            const allRows = document.querySelectorAll('.schema-dim-row');
            if (allRows.length <= 3) {
                alert('Minimum 3 dimensions required for meaningful multi-dimensional clustering.');
                return;
            }
            const row = btn.closest('.schema-dim-row');
            if (row) row.remove();
        }

        function addSchemaStageRow(stageDataOrTitle = '', actions = '', actionDetails = null) {
            const stageList = document.getElementById('schema-stages-list');
            if (!stageList) return;
            const emptyStage = document.getElementById('stage-empty-placeholder');
            if (emptyStage) emptyStage.remove();
            const currentCount = stageList.querySelectorAll('.schema-stage-row').length;
            if (currentCount >= 8) {
                alert('Maximum 8 stages supported on the timeline.');
                return;
            }
            const isZh = (currentLang === 'zh');
            let title = '';
            let actionList = [];
            let detailsList = [];

            if (stageDataOrTitle && typeof stageDataOrTitle === 'object') {
                title = stageDataOrTitle.title || '';
                actionList = stageDataOrTitle.actions || [];
                detailsList = stageDataOrTitle.actionDetails || stageDataOrTitle.actionDetailsZh || [];
            } else {
                title = stageDataOrTitle || '';
                if (Array.isArray(actions)) actionList = actions.filter(Boolean);
                else if (typeof actions === 'string' && actions.trim()) actionList = actions.split(/[\n\r]+/).map(a => a.trim()).filter(Boolean);
                if (Array.isArray(actionDetails)) detailsList = actionDetails;
            }

            const defaultTitle = title || (isZh ? `階段 ${currentCount + 1}` : `Stage ${currentCount + 1}`);

            if (!actionList || actionList.length === 0) {
                actionList = isZh ? [
                    `行動 A：${defaultTitle} 核心業務規劃與執行`,
                    `行動 B：跨通路諮詢、客戶需求溝通與協調`,
                    `行動 C：核印審查、系統登打送件與確認`
                ] : [
                    `Action A: Core planning & execution for ${defaultTitle}`,
                    `Action B: Inquiries, communications & coordination`,
                    `Action C: Processing, review & confirmation`
                ];
            }

            const div = document.createElement('div');
            div.className = 'schema-stage-row schema-card-draggable';
            div.style.cssText = 'display: flex; align-items: flex-start; gap: 10px; width: 100%; box-sizing: border-box; margin-bottom: 12px;';

            const actionsHtml = actionList.map((act, aIdx) => {
                const d = (detailsList && detailsList[aIdx]) || {};
                const locs = isZh ? (d.locationsZh || d.locations) : (d.locations);
                const tools = isZh ? (d.toolsZh || d.tools) : (d.tools);
                const pains = isZh ? (d.painPointsZh || d.painPoints) : (d.painPoints);
                const ctxs = isZh ? (d.additionalContextZh || d.additionalContext || d.contextsZh || d.contexts) : (d.additionalContext || d.contexts);

                const locStr = (Array.isArray(locs) && locs.length > 0)
                    ? locs.join(', ')
                    : (isZh ? '辦公室, 客戶所在的任何地點, 電話, 線上, 其他' : 'Office, Anywhere the client is, Phone, Online, Other');
                const toolStr = (Array.isArray(tools) && tools.length > 0)
                    ? tools.join(', ')
                    : (isZh ? 'LINE, Agent Pro, Agent Portal, 服務系統, 行政助理, 其他' : 'LINE, Agent Pro, Agent Portal, Service System, Administrative Assistant, Other');
                const painStr = (Array.isArray(pains) && pains.length > 0)
                    ? pains.join(', ')
                    : (isZh ? '系統逾時或載入緩慢, 重複登打資料, 缺乏行動裝置支援, 其他' : 'System timeout / slow loading, Repetitive data entry, Lack of mobile support, Other');
                const ctxStr = (Array.isArray(ctxs) && ctxs.length > 0)
                    ? ctxs.join(', ')
                    : (isZh ? '優先處理特定客戶考量, 其他' : 'Primary consideration for prioritising specific clients, Other');

                return `
                    <div class="stage-action-item" style="background: rgba(0,0,0,0.22); border: 1px solid rgba(255,255,255,0.08); padding: 8px 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="color: var(--accent-yellow); font-size: var(--fs-caption); font-weight: 700; user-select: none;">•</span>
                            <input type="text" class="stage-action-input" value="${escapeHtmlAttr(act)}" placeholder="${isZh ? '行動任務內容' : 'Action / Sub-task'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; font-family: inherit; outline: none;">
                            <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0; margin-right: -10px;">
                                <div style="display: inline-flex; align-items: center; gap: 3px;">
                                    <button type="button" class="btn-seq-move" onclick="window.moveStageActionItem(this, -1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '上移' : 'Move Up'}">▲</button>
                                    <button type="button" class="btn-seq-move" onclick="window.moveStageActionItem(this, 1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '下移' : 'Move Down'}">▼</button>
                                </div>
                                <button type="button" onclick="removeStageActionItem(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; display: flex; align-items: center; justify-content: center; height: 26px; width: 26px; border-radius: 4px;" title="${isZh ? '刪除此行動' : 'Delete Action'}">&times;</button>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px; padding-left: 14px;">
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                                    a) ${isZh ? '執行時的實體／數位地點（以逗號分隔選項）：' : 'Physical/Digital location when executing (comma-separated):'}
                                </label>
                                <input type="text" class="action-locations-input" value="${escapeHtmlAttr(locStr)}" placeholder="${isZh ? '例如：辦公室, 客戶所在的任何地點, 電話, 線上, 其他' : 'e.g. Office, Anywhere the client is, Phone, Online, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                                    b) ${isZh ? '協助完成此行動的工具或對象（以逗號分隔選項）：' : 'Tools or people helping you complete this action (comma-separated):'}
                                </label>
                                <input type="text" class="action-tools-input" value="${escapeHtmlAttr(toolStr)}" placeholder="${isZh ? '例如：LINE, Agent Pro, Agent Portal, 服務系統, 行政助理, 其他' : 'e.g. LINE, Agent Pro, Agent Portal, Service System, Assistant, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                                    c) ${isZh ? '此行動中遭遇的痛點（以逗號分隔選項）：' : 'Pain points encountered in this action (comma-separated):'}
                                </label>
                                <input type="text" class="action-painpoints-input" value="${escapeHtmlAttr(painStr)}" placeholder="${isZh ? '例如：系統逾時或載入緩慢, 重複登打資料, 缺乏行動裝置支援, 其他' : 'e.g. System timeout / slow loading, Repetitive data entry, Lack of mobile support, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                                    d) ${isZh ? '補充考量（以逗號分隔選項）：' : 'Additional context (comma-separated):'}
                                </label>
                                <input type="text" class="action-context-input" value="${escapeHtmlAttr(ctxStr)}" placeholder="${isZh ? '例如：優先處理特定客戶考量, 其他' : 'e.g. Primary consideration for prioritising specific clients, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            div.innerHTML = `
                <button type="button" class="btn-card-collapse btn-q-collapse" onclick="toggleQuestionCardCollapse(this)" style="width: 24px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; color: #cbd5e1; font-size: var(--fs-title); cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; margin-top: 8px;" title="${isZh ? '收合' : 'Collapse'}">⊟</button>
                <div class="schema-card-box q-card-box" style="flex: 1; min-width: 0; background: #161f2e; border: 1px solid rgba(255,255,255,0.1); padding: 12px 14px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                            <span class="stage-num-badge" style="font-size: var(--fs-caption); color: #000; font-weight: 800; background: #eab308; padding: 4px 8px; border-radius: 4px; min-width: 54px; text-align: center;">${isZh ? `階段 ${currentCount + 1}` : `Stage ${currentCount + 1}`}</span>
                            <input type="text" class="stage-title-input" value="${escapeHtmlAttr(defaultTitle)}" placeholder="Stage Title (e.g. Scheduling & Client Relationships)" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 5px 8px; border-radius: 4px; font-size: var(--fs-small); font-family: inherit; font-weight: 600; outline: none;">
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <div style="display: inline-flex; align-items: center; gap: 3px;">
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, -1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '上移' : 'Move Up'}">▲</button>
                                <button type="button" class="btn-seq-move" onclick="window.moveQuestionRow(this, 1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '下移' : 'Move Down'}">▼</button>
                            </div>
                            <button type="button" onclick="removeSchemaStageRow(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; display: flex; align-items: center; justify-content: center; height: 26px; width: 26px; border-radius: 4px;" title="Delete Stage">&times;</button>
                        </div>
                    </div>
                    <div class="card-collapsible-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label style="font-size: var(--fs-caption); font-weight: 600; color: var(--text-muted);">
                                ${isZh ? '此階段包含之子任務／行動與其選項模組（將於問卷呈現）：' : 'STAGE ACTIONS, SUB-TASKS & OPTION MODULES (Listed in Questionnaire):'}
                            </label>
                        </div>
                        <div class="stage-actions-list" style="display: flex; flex-direction: column; gap: 6px;">
                            ${actionsHtml}
                        </div>
                        <!-- + Add Action button placed right AFTER the last action of this stage! -->
                        <button type="button" class="btn btn-secondary btn-add-action" onclick="addStageActionItem(this)" style="padding: 3px 10px; font-size: var(--fs-caption); height: 24px; align-self: flex-start; margin-top: 6px; display: inline-flex; align-items: center; gap: 4px;">
                            <span>＋</span>
                            <span>${isZh ? '新增行動／任務' : 'Add Action'}</span>
                        </button>
                        <!-- Must-have emotional rating question in schema (Standard question styling, no X icon) -->
                        <div class="schema-question-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; margin-top: 10px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="background: #eab308; color: #000; font-size: var(--fs-caption); font-weight: 800; padding: 2px 8px; border-radius: 4px;">★ ${isZh ? '必答題' : 'Must-Have Question'}</span>
                                    <span style="font-size: var(--fs-small); color: #94a3b8; font-weight: 500;">${isZh ? '情緒體驗評估' : 'Emotional Experience Rating'}</span>
                                </div>
                            </div>
                            <div style="font-size: var(--fs-small); font-weight: 600; color: #fff; margin-bottom: 6px;">
                                ${isZh ? '請為此階段的情緒體驗評分：' : 'Please rate your emotional experience for this stage:'}
                            </div>
                            <div style="display: flex; gap: 14px; font-size: var(--fs-body); color: #cbd5e1;">
                                <span>1😫</span>
                                <span>2 😮‍💨</span>
                                <span>3 😐</span>
                                <span>4 🙂</span>
                                <span>5 🤩</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            stageList.appendChild(div);
            reindexSchemaStageNumbers();
        }

        function addStageActionItem(btn) {
            const container = btn.parentElement;
            if (!container) return;
            const list = container.querySelector('.stage-actions-list');
            if (!list) return;
            const isZh = (currentLang === 'zh');
            const count = list.querySelectorAll('.stage-action-item').length;
            const letter = String.fromCharCode(65 + count);
            const actDiv = document.createElement('div');
            actDiv.className = 'stage-action-item';
            actDiv.style.cssText = 'background: rgba(0,0,0,0.22); border: 1px solid rgba(255,255,255,0.08); padding: 8px 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px;';
            const defaultLoc = isZh ? '辦公室, 客戶所在的任何地點, 電話, 線上, 其他' : 'Office, Anywhere the client is, Phone, Online, Other';
            const defaultTool = isZh ? 'LINE, Agent Pro, Agent Portal, 服務系統, 行政助理, 其他' : 'LINE, Agent Pro, Agent Portal, Service System, Assistant, Other';
            const defaultPain = isZh ? '系統逾時或載入緩慢, 重複登打資料, 缺乏行動裝置支援, 其他' : 'System timeout / slow loading, Repetitive data entry, Lack of mobile support, Other';
            const defaultCtx = isZh ? '優先處理特定客戶考量, 其他' : 'Primary consideration for prioritising specific clients, Other';

            actDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: var(--accent-yellow); font-size: var(--fs-caption); font-weight: 700; user-select: none;">•</span>
                    <input type="text" class="stage-action-input" value="${isZh ? `行動 ${letter}：新任務規劃` : `Action ${letter}: New task activity`}" placeholder="${isZh ? '行動任務內容' : 'Action / Sub-task'}" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-small); font-weight: 600; font-family: inherit; outline: none;">
                    <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0; margin-right: -10px;">
                        <div style="display: inline-flex; align-items: center; gap: 3px;">
                            <button type="button" class="btn-seq-move" onclick="window.moveStageActionItem(this, -1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '上移' : 'Move Up'}">▲</button>
                            <button type="button" class="btn-seq-move" onclick="window.moveStageActionItem(this, 1)" style="background: transparent; border: none; color: #cbd5e1; cursor: pointer; font-size: var(--fs-body); line-height: 1; padding: 2px 4px; display: inline-flex; align-items: center; justify-content: center;" title="${isZh ? '下移' : 'Move Down'}">▼</button>
                        </div>
                        <button type="button" onclick="removeStageActionItem(this)" style="background: transparent; border: none; color: #ff6b6b; cursor: pointer; font-size: var(--fs-title); line-height: 1; display: flex; align-items: center; justify-content: center; height: 26px; width: 26px; border-radius: 4px;" title="${isZh ? '刪除此行動' : 'Delete Action'}">&times;</button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px; padding-left: 14px;">
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                            a) ${isZh ? '執行時的實體／數位地點（以逗號分隔選項）：' : 'Physical/Digital location when executing (comma-separated):'}
                        </label>
                        <input type="text" class="action-locations-input" value="${escapeHtmlAttr(defaultLoc)}" placeholder="${isZh ? '例如：辦公室, 客戶所在的任何地點, 電話, 線上, 其他' : 'e.g. Office, Anywhere the client is, Phone, Online, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                            b) ${isZh ? '協助完成此行動的工具或對象（以逗號分隔選項）：' : 'Tools or people helping you complete this action (comma-separated):'}
                        </label>
                        <input type="text" class="action-tools-input" value="${escapeHtmlAttr(defaultTool)}" placeholder="${isZh ? '例如：LINE, Agent Pro, Agent Portal, 服務系統, 行政助理, 其他' : 'e.g. LINE, Agent Pro, Agent Portal, Service System, Assistant, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                            c) ${isZh ? '此行動中遭遇的痛點（以逗號分隔選項）：' : 'Pain points encountered in this action (comma-separated):'}
                        </label>
                        <input type="text" class="action-painpoints-input" value="${escapeHtmlAttr(defaultPain)}" placeholder="${isZh ? '例如：系統逾時或載入緩慢, 重複登打資料, 缺乏行動裝置支援, 其他' : 'e.g. System timeout / slow loading, Repetitive data entry, Lack of mobile support, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <label style="font-size: var(--fs-caption); color: #94a3b8; font-weight: 600;">
                            d) ${isZh ? '補充考量（以逗號分隔選項）：' : 'Additional context (comma-separated):'}
                        </label>
                        <input type="text" class="action-context-input" value="${escapeHtmlAttr(defaultCtx)}" placeholder="${isZh ? '例如：優先處理特定客戶考量, 其他' : 'e.g. Primary consideration for prioritising specific clients, Other'}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 3px 6px; border-radius: 4px; font-size: var(--fs-caption); font-family: inherit; outline: none;">
                    </div>
                </div>
            `;
            list.appendChild(actDiv);
            const input = actDiv.querySelector('.stage-action-input');
            if (input) {
                input.focus();
                input.select();
            }
        }

        window.moveStageActionItem = function(btn, dir) {
            const item = btn.closest('.stage-action-item');
            if (!item) return;
            const parent = item.parentNode;
            if (!parent) return;
            if (dir === -1) {
                const prev = item.previousElementSibling;
                if (prev && prev.classList.contains('stage-action-item')) {
                    parent.insertBefore(item, prev);
                }
            } else if (dir === 1) {
                const next = item.nextElementSibling;
                if (next && next.classList.contains('stage-action-item')) {
                    parent.insertBefore(next, item);
                }
            }
        };

        function removeStageActionItem(btn) {
            const item = btn.closest('.stage-action-item');
            const list = item && item.parentElement;
            if (item && list) {
                if (list.querySelectorAll('.stage-action-item').length <= 1) {
                    const input = item.querySelector('.stage-action-input');
                    if (input) input.value = '';
                } else {
                    item.remove();
                }
            }
        }

        function removeSchemaStageRow(btn) {
            const stageList = document.getElementById('schema-stages-list');
            if (stageList && stageList.querySelectorAll('.schema-stage-row').length <= 3) {
                alert('Minimum 3 journey stages required.');
                return;
            }
            const row = btn.closest('.schema-stage-row');
            if (row) {
                row.remove();
                reindexSchemaStageNumbers();
            }
        }

        function reindexSchemaStageNumbers() {
            const isZh = (currentLang === 'zh');
            const badges = document.querySelectorAll('#schema-stages-list .stage-num-badge');
            badges.forEach((b, idx) => { b.textContent = isZh ? `階段 ${idx + 1}` : `Stage ${idx + 1}`; });
        }

        function saveCustomSchemaOnly() {
            // If live modular questionnaire iframe is active, delegate to it
            try {
                const iframe = document.getElementById('modular-questionnaire-iframe');
                if (iframe && iframe.contentWindow && typeof iframe.contentWindow.saveSchemaOnly === 'function') {
                    iframe.contentWindow.saveSchemaOnly();
                    return;
                }
            } catch(e) {}

            const isZh = (currentLang === 'zh');
            const schema = getModalOrActiveSchema();
            if (schema && schema.id) {
                if (typeof JOURNEY_SCHEMAS !== 'undefined') {
                    JOURNEY_SCHEMAS[schema.id] = schema;
                }
                try {
                    const customSchemas = JSON.parse(localStorage.getItem('portal_custom_schemas') || '{}');
                    customSchemas[schema.id] = schema;
                    localStorage.setItem('portal_custom_schemas', JSON.stringify(customSchemas));
                    localStorage.setItem(`custom_journey_schema_${schema.id}`, JSON.stringify(schema));
                } catch(e) {}
                showPlatformNotification(isZh ? '架構內容已成功修改並儲存！' : 'Changes have been saved to the schema successfully!');
            }
        }

        function saveAndApplyCustomSchema() {
            // If live modular questionnaire iframe is active, delegate to it
            try {
                const iframe = document.getElementById('modular-questionnaire-iframe');
                if (iframe && iframe.contentWindow && typeof iframe.contentWindow.applySchemaToPlatformAction === 'function') {
                    iframe.contentWindow.applySchemaToPlatformAction();
                    closeSchemaBuilderModal();
                    return;
                }
            } catch(e) {}

            const isZh = (currentLang === 'zh');
            const activeSchema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : {};
            const nameInput = document.getElementById('schema-name-input');
            const idInput = document.getElementById('schema-id-input');
            const name = (nameInput && nameInput.value.trim()) || 'Custom Journey';
            let id = (idInput && idInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')) || '';
            if (!id) id = 'custom_' + Date.now().toString().slice(-4);
            const defSchema = (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[id]) || null;

            // 1. Demographics (Part I: Q1-Q7)
            const demoRows = document.querySelectorAll('#schema-demographics-list .schema-demo-row');
            const demographics = [];
            demoRows.forEach((row, idx) => {
                const labelEl = row.querySelector('.demo-label-input');
                const typeEl = row.querySelector('.demo-type-select');
                const label = (labelEl && labelEl.value.trim()) || `Demographic_${idx + 1}`;
                const qType = (typeEl && typeEl.value) || 'choice';
                let options = '';
                if (qType === 'text') {
                    options = '__________________________________________';
                } else {
                    const optInputs = row.querySelectorAll('.demo-option-input');
                    const opts = Array.from(optInputs).map(i => i.value.trim()).filter(Boolean);
                    options = opts.length > 0 ? opts.join(', ') : 'Option 1, Option 2';
                }
                const subPromptEl = row.querySelector('.demo-subq-prompt-input, .subq-prompt-input');
                let subOptionsVal = [];
                const subOptInputs = row.querySelectorAll('.subq-option-input');
                if (subOptInputs.length > 0) {
                    subOptionsVal = Array.from(subOptInputs).map(i => i.value.trim()).filter(Boolean);
                } else {
                    const subOptionsEl = row.querySelector('.demo-subq-options-input');
                    subOptionsVal = subOptionsEl ? subOptionsEl.value.split(/[\n\r]+/).map(s => s.trim()).filter(Boolean) : [];
                }
                const subPromptVal = subPromptEl ? subPromptEl.value.trim() : '';

                const defDemo = (defSchema && defSchema.demographics && defSchema.demographics[idx]) || null;
                const activeDemo = (activeSchema && activeSchema.demographics && activeSchema.demographics[idx]) || null;
                
                let dLblEn = label, dLblZh = label;
                let dOptsEn = options, dOptsZh = options;
                if (isZh) {
                    dLblZh = label;
                    dLblEn = (activeDemo && activeDemo.label && !/[\u4e00-\u9fff]/.test(activeDemo.label))
                        ? activeDemo.label
                        : ((defDemo && defDemo.label) || `Demographic ${idx + 1}`);
                    dOptsZh = options;
                    dOptsEn = (activeDemo && activeDemo.options && !/[\u4e00-\u9fff]/.test(activeDemo.options))
                        ? activeDemo.options
                        : ((defDemo && defDemo.options) || options);
                } else {
                    dLblEn = label;
                    dLblZh = (activeDemo && activeDemo.labelZh) ? activeDemo.labelZh : ((defDemo && defDemo.labelZh) || label);
                    dOptsEn = options;
                    dOptsZh = (activeDemo && activeDemo.optionsZh) ? activeDemo.optionsZh : ((defDemo && defDemo.optionsZh) || options);
                }
                const cleanKey = label.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').slice(0, 16) || `q${idx + 1}`;
                const demoObj = {
                    key: `Demo_${idx + 1}_${cleanKey}`,
                    label: dLblEn,
                    labelZh: dLblZh,
                    type: qType,
                    options: dOptsEn,
                    optionsZh: dOptsZh
                };
                if (subPromptVal || subOptionsVal.length > 0) {
                    demoObj.subPrompt = isZh ? ((activeDemo && activeDemo.subPrompt && !/[\u4e00-\u9fff]/.test(activeDemo.subPrompt)) ? activeDemo.subPrompt : subPromptVal) : subPromptVal;
                    demoObj.subPromptZh = isZh ? subPromptVal : ((activeDemo && activeDemo.subPromptZh) ? activeDemo.subPromptZh : subPromptVal);
                    demoObj.subOptions = subOptionsVal;
                    demoObj.subOptionsZh = subOptionsVal;
                }
                demographics.push(demoObj);
            });

            // 2. Metrics (Part III: Q14 System Factors & Q15 Professional Capabilities)
            const metrics = [];
            const q11Rows = document.querySelectorAll('#schema-dimensions-q11-list .schema-dim-row');
            q11Rows.forEach((row, idx) => {
                const labelEl = row.querySelector('.dim-label-input');
                const scaleEl = row.querySelector('.dim-scale-select');
                const label = (labelEl && labelEl.value.trim()) || `System Factor ${idx + 1}`;
                const scaleType = (scaleEl && scaleEl.value) || '1-5';
                const key = (activeSchema.metrics && activeSchema.metrics[idx]?.key) || `Skill_Factor_${idx + 1}`;
                metrics.push({
                    key: key,
                    label: isZh ? ((activeSchema.metrics && activeSchema.metrics[idx]?.label && !/[\u4e00-\u9fff]/.test(activeSchema.metrics[idx].label)) ? activeSchema.metrics[idx].label : label) : label,
                    labelZh: isZh ? label : ((activeSchema.metrics && activeSchema.metrics[idx]?.labelZh) ? activeSchema.metrics[idx].labelZh : label),
                    scaleType: scaleType,
                    category: 'system_efficiency',
                    indicator: 'Impact on Daily Work Efficiency',
                    indicatorZh: '對日常工作效率之影響程度',
                    sourceQuestion: 'Q14'
                });
            });

            const q12Rows = document.querySelectorAll('#schema-dimensions-q12-list .schema-dim-row');
            q12Rows.forEach((row, idx) => {
                const labelEl = row.querySelector('.dim-label-input');
                const scaleEl = row.querySelector('.dim-scale-select');
                const label = (labelEl && labelEl.value.trim()) || `Professional Capability ${idx + 1}`;
                const scaleType = (scaleEl && scaleEl.value) || '1-5';
                const realIdx = q11Rows.length + idx;
                const key = (activeSchema.metrics && activeSchema.metrics[realIdx]?.key) || `Skill_Cap_${idx + 1}`;
                metrics.push({
                    key: key,
                    label: isZh ? ((activeSchema.metrics && activeSchema.metrics[realIdx]?.label && !/[\u4e00-\u9fff]/.test(activeSchema.metrics[realIdx].label)) ? activeSchema.metrics[realIdx].label : label) : label,
                    labelZh: isZh ? label : ((activeSchema.metrics && activeSchema.metrics[realIdx]?.labelZh) ? activeSchema.metrics[realIdx].labelZh : label),
                    scaleType: scaleType,
                    category: 'sales_performance',
                    indicator: 'Impact on Business & Sales Performance',
                    indicatorZh: '對整體業務與銷售績效之影響程度',
                    sourceQuestion: 'Q15'
                });
            });

            // 3. Stages (Part V: Stages 1-6)
            const stageRows = document.querySelectorAll('#schema-stages-list .schema-stage-row');
            const stages = [];
            stageRows.forEach((row, idx) => {
                const titleEl = row.querySelector('.stage-title-input');
                const title = (titleEl && titleEl.value.trim()) || `Stage ${idx + 1}`;
                const actRows = row.querySelectorAll('.stage-action-item');
                let actionItems = [];
                let actionDetails = [];
                let actionDetailsZh = [];

                actRows.forEach((actRow, aIdx) => {
                    const input = actRow.querySelector('.stage-action-input');
                    const actName = (input && input.value.trim()) || `Action ${String.fromCharCode(65 + aIdx)}`;
                    actionItems.push(actName);

                    const locInput = actRow.querySelector('.action-locations-input');
                    const toolInput = actRow.querySelector('.action-tools-input');
                    const painInput = actRow.querySelector('.action-painpoints-input');
                    const ctxInput = actRow.querySelector('.action-context-input');

                    const locs = (locInput && locInput.value.split(/[,，]+/).map(s => s.trim()).filter(Boolean)) || ['Office', 'Online', 'Other'];
                    const tls = (toolInput && toolInput.value.split(/[,，]+/).map(s => s.trim()).filter(Boolean)) || ['LINE', 'Agent Portal', 'Other'];
                    const pns = (painInput && painInput.value.split(/[,，]+/).map(s => s.trim()).filter(Boolean)) || ['System slow', 'Other'];
                    const ctxs = (ctxInput && ctxInput.value.split(/[,，]+/).map(s => s.trim()).filter(Boolean)) || ['Standard priority', 'Other'];

                    actionDetails.push({
                        name: actName,
                        locations: locs,
                        tools: tls,
                        painPoints: pns,
                        additionalContext: ctxs
                    });
                    actionDetailsZh.push({
                        name: actName,
                        locationsZh: locs,
                        toolsZh: tls,
                        painPointsZh: pns,
                        additionalContextZh: ctxs
                    });
                });

                const defStage = (defSchema && defSchema.stages && defSchema.stages[idx]) || null;
                const activeStage = (activeSchema && activeSchema.stages && activeSchema.stages[idx]) || null;

                let sTitleEn = title, sTitleZh = title;
                if (isZh) {
                    sTitleZh = title;
                    sTitleEn = (activeStage && activeStage.title && !/[\u4e00-\u9fff]/.test(activeStage.title))
                        ? activeStage.title
                        : ((defStage && defStage.title) || `Stage ${idx + 1}`);
                } else {
                    sTitleEn = title;
                    sTitleZh = (activeStage && activeStage.titleZh) ? activeStage.titleZh : ((defStage && defStage.titleZh) || title);
                }

                stages.push({
                    id: (activeStage && activeStage.id) || `stage_${idx + 1}`,
                    title: sTitleEn,
                    titleZh: sTitleZh,
                    actions: isZh ? (activeStage?.actions || actionItems) : actionItems,
                    actionsZh: isZh ? actionItems : (activeStage?.actionsZh || actionItems),
                    actionDetails: isZh ? (activeStage?.actionDetails || actionDetails) : actionDetails,
                    actionDetailsZh: isZh ? actionDetailsZh : (activeStage?.actionDetailsZh || actionDetailsZh)
                });
            });

            // 4. Section Inclusions
            const sectionsConfig = {
                demographics: document.getElementById('sec-card-chk-demographics')?.checked !== false,
                dimensions: document.getElementById('sec-card-chk-dimensions')?.checked !== false,
                tags: document.getElementById('sec-card-chk-tags')?.checked !== false,
                workContent: document.getElementById('sec-card-chk-workContent')?.checked !== false,
                journey: document.getElementById('sec-card-chk-journey')?.checked !== false
            };

            // 5. Section Titles
            const titleDemo = document.getElementById('schema-section-title-demographics')?.value.trim() || 'General Information';
            const titleDim = document.getElementById('schema-section-title-dimensions')?.value.trim() || 'Agent Background';
            const titleTags = document.getElementById('schema-section-title-tags')?.value.trim() || 'Self-Image Tags';
            const titleWork = document.getElementById('schema-section-title-workContent')?.value.trim() || 'Daily Work Content and Needs';
            const titleJourney = document.getElementById('schema-section-title-journey')?.value.trim() || 'Agent Journey';

            const prevTitles = activeSchema.sectionTitles || {};
            const sectionTitles = {
                demographics: isZh ? (prevTitles.demographics || 'General Information') : titleDemo,
                demographicsZh: isZh ? titleDemo : (prevTitles.demographicsZh || '基本資料'),
                dimensions: isZh ? (prevTitles.dimensions || 'Agent Background') : titleDim,
                dimensionsZh: isZh ? titleDim : (prevTitles.dimensionsZh || '現況評估'),
                tags: isZh ? (prevTitles.tags || 'Self-Image Tags') : titleTags,
                tagsZh: isZh ? titleTags : (prevTitles.tagsZh || '自我形象標籤'),
                workContent: isZh ? (prevTitles.workContent || 'Daily Work Content and Needs') : titleWork,
                workContentZh: isZh ? titleWork : (prevTitles.workContentZh || '日常工作內容與需求'),
                journey: isZh ? (prevTitles.journey || 'Agent Journey') : titleJourney,
                journeyZh: isZh ? titleJourney : (prevTitles.journeyZh || '業務員歷程地圖')
            };

            // 6. Section 2 (Archetype Tags: Q8-Q10) Inputs
            const tagItemEls = document.querySelectorAll('#schema-tags-checklist .schema-tag-item');
            let tagsList = [];
            if (tagItemEls.length > 0) {
                tagItemEls.forEach(el => {
                    const chk = el.querySelector('.tag-item-chk');
                    const txt = el.querySelector('.tag-item-text');
                    if (chk && chk.checked && txt && txt.value.trim()) {
                        tagsList.push(txt.value.trim());
                    }
                });
            } else {
                tagsList = isZh ? (activeSchema.selfImageTagsZh || activeSchema.selfImageTags || []) : (activeSchema.selfImageTags || []);
            }
            const q8P = document.getElementById('schema-q8-prompt-input')?.value.trim();
            const q9P = document.getElementById('schema-q9-prompt-input')?.value.trim();
            const q10P = document.getElementById('schema-q10-prompt-input')?.value.trim();

            // 7. Section 3 (Agent Background / Dimensions: Q11-Q19) Inputs
            const q11P = document.getElementById('schema-q11-prompt-input')?.value.trim();
            const q11Scale = document.getElementById('schema-q11-scale-select')?.value || document.getElementById('schema-q8-scale-select')?.value || '0-100';
            const q12P = document.getElementById('schema-q12-prompt-input')?.value.trim();
            const q12Scale = document.getElementById('schema-q12-scale-select')?.value || document.getElementById('schema-q9-scale-select')?.value || 'emoji';
            const q13P = document.getElementById('schema-q13-prompt-input')?.value.trim();
            const q13Opts = Array.from(document.querySelectorAll('#card-q13 .demo-option-input, #card-q10 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q14P = document.getElementById('schema-q14-prompt-input')?.value.trim();
            const q15P = document.getElementById('schema-q15-prompt-input')?.value.trim();
            const q16P = document.getElementById('schema-q16-prompt-input')?.value.trim();
            const q16Opts = Array.from(document.querySelectorAll('#card-q16 .demo-option-input, #card-q13 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q17P = document.getElementById('schema-q17-prompt-input')?.value.trim();
            const q17Opts = Array.from(document.querySelectorAll('#card-q17 .demo-option-input, #card-q14 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q17SubP = document.getElementById('schema-q17-subprompt-input')?.value.trim() || document.querySelector('#card-q17 .subq-prompt-input')?.value.trim() || document.getElementById('schema-q14-subprompt-input')?.value.trim() || '';
            let q17SubO = Array.from(document.querySelectorAll('#card-q17 .subq-option-input, #card-q14 .subq-option-input')).map(i => i.value.trim()).filter(Boolean);
            if (q17SubO.length === 0) {
                q17SubO = (document.getElementById('schema-q17-suboptions-input')?.value || document.getElementById('schema-q14-suboptions-input')?.value || '').split(/[\n\r]+/).map(s => s.trim()).filter(Boolean);
            }
            const q18P = document.getElementById('schema-q18-prompt-input')?.value.trim();
            const q18Opts = Array.from(document.querySelectorAll('#card-q18 .demo-option-input, #card-q15 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q19P = document.getElementById('schema-q19-prompt-input')?.value.trim();
            const q19Opts = Array.from(document.querySelectorAll('#card-q19 .demo-option-input, #card-q16 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);

            // 8. Section 4 (Work Content: Q20-Q25) Inputs
            const workItemEls = document.querySelectorAll('#schema-q20-items-list .q20-work-item, #schema-q20-items-list .schema-dim-row');
            let workList = [];
            if (workItemEls.length > 0) {
                workItemEls.forEach(el => {
                    const chk = el.querySelector('.q20-item-chk, input[type="checkbox"]');
                    const txt = el.querySelector('.q20-item-text, input[type="text"], .dim-label-input');
                    if ((!chk || chk.checked) && txt && txt.value.trim()) {
                        workList.push(txt.value.trim());
                    }
                });
            } else {
                workList = isZh ? (activeSchema.dailyWorkItemsZh || activeSchema.dailyWorkItems || []) : (activeSchema.dailyWorkItems || []);
            }
            const q20P = document.getElementById('schema-q20-prompt-input')?.value.trim();
            const q21P = document.getElementById('schema-q21-prompt-input')?.value.trim();
            const q22P = document.getElementById('schema-q22-prompt-input')?.value.trim();
            const q22Opts = Array.from(document.querySelectorAll('#card-q22 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q23P = document.getElementById('schema-q23-prompt-input')?.value.trim();
            const q23Opts = Array.from(document.querySelectorAll('#card-q23 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q24P = document.getElementById('schema-q24-prompt-input')?.value.trim();
            const q24Opts = Array.from(document.querySelectorAll('#card-q24 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
            const q25P = document.getElementById('schema-q25-prompt-input')?.value.trim();

            // 9. Section 5 (Journey: Q26) Inputs
            const q26P = document.getElementById('schema-q26-prompt-input')?.value.trim();
            const q26Opts = Array.from(document.querySelectorAll('#card-q26 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);

            const introEl = document.getElementById('schema-intro-input');
            const intro = introEl && introEl.value.trim() ? introEl.value.trim() : (isZh ? (activeSchema.introZh || activeSchema.intro) : (activeSchema.intro || activeSchema.introZh || ''));

            // Build Updated Custom Schema Object
            const customSchema = {
                id: id,
                name: name,
                nameZh: name,
                targetAudience: isZh ? (activeSchema.targetAudienceZh || activeSchema.targetAudience || '保險業務員') : (activeSchema.targetAudience || 'Insurance Agent'),
                targetAudienceZh: isZh ? (activeSchema.targetAudienceZh || '保險業務員') : (activeSchema.targetAudienceZh || '保險業務員'),
                icon: '✨',
                badge: 'Custom Schema',
                badgeZh: '自訂架構',
                intro: isZh ? ((activeSchema.intro && !/[\u4e00-\u9fff]/.test(activeSchema.intro)) ? activeSchema.intro : (defSchema?.intro || '')) : intro,
                introZh: isZh ? intro : ((activeSchema.introZh) ? activeSchema.introZh : (defSchema?.introZh || '')),
                sectionsConfig: sectionsConfig,
                sectionTitles: sectionTitles,
                demographics: demographics,
                metrics: metrics,
                stages: stages,

                // Part II: Archetype Tags (Q8-Q10)
                selfImageTags: isZh ? (activeSchema.selfImageTags || tagsList) : tagsList,
                selfImageTagsZh: isZh ? tagsList : (activeSchema.selfImageTagsZh || tagsList),
                tag1Prompt: isZh ? (activeSchema.tag1Prompt || 'Please write down the 1st tag that “best represents you” from the options above.') : (q8P || activeSchema.tag1Prompt || 'Please write down the 1st tag that “best represents you” from the options above.'),
                tag1PromptZh: isZh ? (q8P || activeSchema.tag1PromptZh || '請從上方選項中，選出「最能代表您」的第 1 個標籤：') : (activeSchema.tag1PromptZh || '請從上方選項中，選出「最能代表您」的第 1 個標籤：'),
                tag2Prompt: isZh ? (activeSchema.tag2Prompt || 'Please write down the 2nd tag that represents you; please do not repeat Q8.') : (q9P || activeSchema.tag2Prompt || 'Please write down the 2nd tag that represents you; please do not repeat Q8.'),
                tag2PromptZh: isZh ? (q9P || activeSchema.tag2PromptZh || '請選出代表您的第 2 個標籤；不得與第 8 題重複。') : (activeSchema.tag2PromptZh || '請選出代表您的第 2 個標籤；不得與第 8 題重複。'),
                tag3Prompt: isZh ? (activeSchema.tag3Prompt || 'Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.') : (q10P || activeSchema.tag3Prompt || 'Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.'),
                tag3PromptZh: isZh ? (q10P || activeSchema.tag3PromptZh || '請選出代表您的第 3 個標籤；不得與第 8、9 題重複。') : (activeSchema.tag3PromptZh || '請選出代表您的第 3 個標籤；不得與第 8、9 題重複。'),

                // Aliases for Q8-Q10
                q8Prompt: isZh ? (activeSchema.tag1Prompt || activeSchema.q8Prompt || 'Please write down the 1st tag that “best represents you” from the options above.') : (q8P || activeSchema.tag1Prompt || activeSchema.q8Prompt || 'Please write down the 1st tag that “best represents you” from the options above.'),
                q8PromptZh: isZh ? (q8P || activeSchema.tag1PromptZh || activeSchema.q8PromptZh || '請從上方選項中，選出「最能代表您」的第 1 個標籤：') : (activeSchema.tag1PromptZh || activeSchema.q8PromptZh || '請從上方選項中，選出「最能代表您」的第 1 個標籤：'),
                q9Prompt: isZh ? (activeSchema.tag2Prompt || activeSchema.q9Prompt || 'Please write down the 2nd tag that represents you; please do not repeat Q8.') : (q9P || activeSchema.tag2Prompt || activeSchema.q9Prompt || 'Please write down the 2nd tag that represents you; please do not repeat Q8.'),
                q9PromptZh: isZh ? (q9P || activeSchema.tag2PromptZh || activeSchema.q9PromptZh || '請選出代表您的第 2 個標籤；不得與第 8 題重複。') : (activeSchema.tag2PromptZh || activeSchema.q9PromptZh || '請選出代表您的第 2 個標籤；不得與第 8 題重複。'),
                q10Prompt: isZh ? (activeSchema.tag3Prompt || activeSchema.q10Prompt || 'Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.') : (q10P || activeSchema.tag3Prompt || activeSchema.q10Prompt || 'Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.'),
                q10PromptZh: isZh ? (q10P || activeSchema.tag3PromptZh || activeSchema.q10PromptZh || '請選出代表您的第 3 個標籤；不得與第 8、9 題重複。') : (activeSchema.tag3PromptZh || activeSchema.q10PromptZh || '請選出代表您的第 3 個標籤；不得與第 8、9 題重複。'),

                // Part III: Dimensions & Background (Q11-Q19)
                q11Prompt: isZh ? (activeSchema.q11Prompt || 'What is your level of familiarity with current agent tools/systems?') : (q11P || activeSchema.q11Prompt || 'What is your level of familiarity with current agent tools/systems?'),
                q11PromptZh: isZh ? (q11P || activeSchema.q11PromptZh || '您對目前業務員工具／系統的熟悉程度為何？') : (activeSchema.q11PromptZh || '您對目前業務員工具／系統的熟悉程度為何？'),
                q11Scale: q11Scale,

                q12Prompt: isZh ? (activeSchema.q12Prompt || 'Overall, how does your current work style make you feel?') : (q12P || activeSchema.q12Prompt || 'Overall, how does your current work style make you feel?'),
                q12PromptZh: isZh ? (q12P || activeSchema.q12PromptZh || '整體而言，您目前的工作方式讓您感覺如何？') : (activeSchema.q12PromptZh || '整體而言，您目前的工作方式讓您感覺如何？'),
                q12Scale: q12Scale,

                q13Prompt: isZh ? (activeSchema.q13Prompt || 'What impact do you feel the tools/systems currently provided by ABC Insurance have on your daily work efficiency?') : (q13P || activeSchema.q13Prompt || 'What impact do you feel the tools/systems currently provided by ABC Insurance have on your daily work efficiency?'),
                q13PromptZh: isZh ? (q13P || activeSchema.q13PromptZh || '您認為 ABC 保險目前提供的工具／系統，對您日常工作效率有何影響？') : (activeSchema.q13PromptZh || '您認為 ABC 保險目前提供的工具／系統，對您日常工作效率有何影響？'),
                q13Options: isZh ? (activeSchema.q13Options || ['Severely slows down efficiency', 'Slightly slows down efficiency', 'No noticeable impact', 'Slightly improves efficiency', 'Significantly improves efficiency']) : (q13Opts.length > 0 ? q13Opts : activeSchema.q13Options),
                q13OptionsZh: isZh ? (q13Opts.length > 0 ? q13Opts : activeSchema.q13OptionsZh) : (activeSchema.q13OptionsZh || ['嚴重拖慢效率', '略微拖慢效率', '無明顯影響', '略微提升效率', '大幅提升效率']),

                q14Prompt: isZh ? (activeSchema.q14Prompt || 'In your daily work, what impact do you feel each of the following factors of tools/systems provided by ABC Insurance has on your efficiency?') : (q14P || activeSchema.q14Prompt || 'In your daily work, what impact do you feel each of the following factors of tools/systems provided by ABC Insurance has on your efficiency?'),
                q14PromptZh: isZh ? (q14P || activeSchema.q14PromptZh || '請評估下列「系統／數位工具」因素對您工作效率的影響程度。') : (activeSchema.q14PromptZh || '請評估下列「系統／數位工具」因素對您工作效率的影響程度。'),

                q15Prompt: isZh ? (activeSchema.q15Prompt || 'Please evaluate the impact of each of the following PROFESSIONAL CAPABILITIES on your overall business and sales performance.') : (q15P || activeSchema.q15Prompt || 'Please evaluate the impact of each of the following PROFESSIONAL CAPABILITIES on your overall business and sales performance.'),
                q15PromptZh: isZh ? (q15P || activeSchema.q15PromptZh || '請評估下列「專業能力」對您整體業務與銷售績效的影響程度。') : (activeSchema.q15PromptZh || '請評估下列「專業能力」對您整體業務與銷售績效的影響程度。'),

                q16Prompt: isZh ? (activeSchema.q16Prompt || 'What are the primary reasons you use tools like LINE or personal contact channels to handle customer affairs?') : (q16P || activeSchema.q16Prompt || 'What are the primary reasons you use tools like LINE or personal contact channels to handle customer affairs?'),
                q16PromptZh: isZh ? (q16P || activeSchema.q16PromptZh || '請問您主要因為哪些原因，使用 LINE 或個人聯絡管道處理客戶相關事務？') : (activeSchema.q16PromptZh || '請問您主要因為哪些原因，使用 LINE 或個人聯絡管道處理客戶相關事務？'),
                q16Options: isZh ? (activeSchema.q16Options || ['Faster speed', 'More familiar interface', 'Company system lacks this feature', 'Customer prefers communicating this way', 'Company system login/operation is cumbersome', 'Other']) : (q16Opts.length > 0 ? q16Opts : activeSchema.q16Options),
                q16OptionsZh: isZh ? (q16Opts.length > 0 ? q16Opts : activeSchema.q16OptionsZh) : (activeSchema.q16OptionsZh || ['速度較快', '介面較熟悉', '公司系統沒有此功能', '客戶偏好以此方式溝通', '公司系統登入／操作較繁瑣', '其他']),

                q17Prompt: isZh ? (activeSchema.q17Prompt || 'How do you plan and schedule customer visits?') : (q17P || activeSchema.q17Prompt || 'How do you plan and schedule customer visits?'),
                q17PromptZh: isZh ? (q17P || activeSchema.q17PromptZh || '您如何規劃與安排客戶拜訪行程？') : (activeSchema.q17PromptZh || '您如何規劃與安排客戶拜訪行程？'),
                q17Options: isZh ? (activeSchema.q17Options || ['Company system', 'Mobile phone built-in calendar / personal calendar app', 'Paper calendar/notebook', 'Brain memory / temporary notes', 'Other']) : (q17Opts.length > 0 ? q17Opts : activeSchema.q17Options),
                q17OptionsZh: isZh ? (q17Opts.length > 0 ? q17Opts : activeSchema.q17OptionsZh) : (activeSchema.q17OptionsZh || ['公司系統', '手機內建行事曆／個人行事曆 App', '紙本桌曆／筆記本', '大腦記憶／臨時記事', '其他']),

                q18Prompt: isZh ? (activeSchema.q18Prompt || 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)') : (q18P || activeSchema.q18Prompt || 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)'),
                q18PromptZh: isZh ? (q18P || activeSchema.q18PromptZh || '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）') : (activeSchema.q18PromptZh || '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）'),
                q18Options: isZh ? (activeSchema.q18Options || ['Used to handwriting/flipping pages', 'Clear monthly overview', 'Not constrained by devices/network', 'Convenient for quick notes during calls', 'Other']) : (q18Opts.length > 0 ? q18Opts : activeSchema.q18Options),
                q18OptionsZh: isZh ? (q18Opts.length > 0 ? q18Opts : activeSchema.q18OptionsZh) : (activeSchema.q18OptionsZh || ['習慣手寫／翻閱的直覺感', '月檢視一目了然', '不受設備與網路限制', '講電話時隨手記錄最快', '其他']),

                q19Prompt: isZh ? (activeSchema.q19Prompt || 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?') : (q19P || activeSchema.q19Prompt || 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?'),
                q19PromptZh: isZh ? (q19P || activeSchema.q19PromptZh || '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？') : (activeSchema.q19PromptZh || '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？'),
                q19Options: isZh ? (activeSchema.q19Options || ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling']) : (q19Opts.length > 0 ? q19Opts : activeSchema.q19Options),
                q19OptionsZh: isZh ? (q19Opts.length > 0 ? q19Opts : activeSchema.q19OptionsZh) : (activeSchema.q19OptionsZh || ['極度願意', '願意', '普通', '意願低', '完全不願意']),

                supportingQuestions: {
                    q13: {
                        prompt: isZh ? (activeSchema.supportingQuestions?.q13?.prompt || 'What are the primary reasons you use tools like LINE or personal contact channels to handle customer affairs?') : (q16P || 'What are the primary reasons you use tools like LINE or personal contact channels to handle customer affairs?'),
                        promptZh: isZh ? (q16P || '請問您主要因為哪些原因，使用 LINE 或個人聯絡管道處理客戶相關事務？') : (activeSchema.supportingQuestions?.q13?.promptZh || '請問您主要因為哪些原因，使用 LINE 或個人聯絡管道處理客戶相關事務？'),
                        options: isZh ? (activeSchema.supportingQuestions?.q13?.options || ['Faster speed', 'More familiar interface', 'Company system lacks this feature', 'Customer prefers communicating this way', 'Company system login/operation is cumbersome', 'Other']) : (q16Opts.length > 0 ? q16Opts : ['Faster speed', 'More familiar interface', 'Company system lacks this feature', 'Customer prefers communicating this way', 'Company system login/operation is cumbersome', 'Other']),
                        optionsZh: isZh ? (q16Opts.length > 0 ? q16Opts : ['速度較快', '介面較熟悉', '公司系統沒有此功能', '客戶偏好以此方式溝通', '公司系統登入／操作較繁瑣', '其他']) : (activeSchema.supportingQuestions?.q13?.optionsZh || ['速度較快', '介面較熟悉', '公司系統沒有此功能', '客戶偏好以此方式溝通', '公司系統登入／操作較繁瑣', '其他'])
                    },
                    q14: {
                        prompt: isZh ? (activeSchema.supportingQuestions?.q14?.prompt || 'How do you plan and schedule customer visits?') : (q17P || 'How do you plan and schedule customer visits?'),
                        promptZh: isZh ? (q17P || '您如何規劃與安排客戶拜訪行程？') : (activeSchema.supportingQuestions?.q14?.promptZh || '您如何規劃與安排客戶拜訪行程？'),
                        options: isZh ? (activeSchema.supportingQuestions?.q14?.options || ['Company system', 'Mobile phone built-in calendar / personal calendar app', 'Paper calendar/notebook', 'Brain memory / temporary notes', 'Other']) : (q17Opts.length > 0 ? q17Opts : ['Company system', 'Mobile phone built-in calendar / personal calendar app', 'Paper calendar/notebook', 'Brain memory / temporary notes', 'Other']),
                        optionsZh: isZh ? (q17Opts.length > 0 ? q17Opts : ['公司系統', '手機內建行事曆／個人行事曆 App', '紙本桌曆／筆記本', '大腦記憶／臨時記事', '其他']) : (activeSchema.supportingQuestions?.q14?.optionsZh || ['公司系統', '手機內建行事曆／個人行事曆 App', '紙本桌曆／筆記本', '大腦記憶／臨時記事', '其他']),
                        subPrompt: isZh ? (activeSchema.supportingQuestions?.q14?.subPrompt || "If you use your mobile phone's built-in calendar, what is the main reason?") : (q17SubP || "If you use your mobile phone's built-in calendar, what is the main reason?"),
                        subPromptZh: isZh ? (q17SubP || '若您使用手機內建行事曆，主要原因為何？') : (activeSchema.supportingQuestions?.q14?.subPromptZh || '若您使用手機內建行事曆，主要原因為何？'),
                        subOptions: isZh ? (activeSchema.supportingQuestions?.q14?.subOptions || ['Private schedule should not be mixed with company', 'Company system difficult to use on mobile', 'Mobile calendar reminder habit', 'Other']) : (q17SubO.length > 0 ? q17SubO : ['Private schedule should not be mixed with company', 'Company system difficult to use on mobile', 'Mobile calendar reminder habit', 'Other']),
                        subOptionsZh: isZh ? (q17SubO.length > 0 ? q17SubO : ['私人行程不宜公開', '公司系統在手機上不好操作', '習慣手機行事曆的提醒功能', '其他']) : (activeSchema.supportingQuestions?.q14?.subOptionsZh || ['私人行程不宜公開', '公司系統在手機上不好操作', '習慣手機行事曆的提醒功能', '其他'])
                    },
                    q15: {
                        prompt: isZh ? (activeSchema.supportingQuestions?.q15?.prompt || 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)') : (q18P || 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)'),
                        promptZh: isZh ? (q18P || '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）') : (activeSchema.supportingQuestions?.q15?.promptZh || '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）'),
                        options: isZh ? (activeSchema.supportingQuestions?.q15?.options || ['Used to handwriting/flipping pages', 'Clear monthly overview', 'Not constrained by devices/network', 'Convenient for quick notes during calls', 'Other']) : (q18Opts.length > 0 ? q18Opts : ['Used to handwriting/flipping pages', 'Clear monthly overview', 'Not constrained by devices/network', 'Convenient for quick notes during calls', 'Other']),
                        optionsZh: isZh ? (q18Opts.length > 0 ? q18Opts : ['習慣手寫／翻閱的直覺感', '月檢視一目了然', '不受設備與網路限制', '講電話時隨手記錄最快', '其他']) : (activeSchema.supportingQuestions?.q15?.optionsZh || ['習慣手寫／翻閱的直覺感', '月檢視一目了然', '不受設備與網路限制', '講電話時隨手記錄最快', '其他'])
                    },
                    q16: {
                        prompt: isZh ? (activeSchema.supportingQuestions?.q16?.prompt || 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?') : (q19P || 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?'),
                        promptZh: isZh ? (q19P || '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？') : (activeSchema.supportingQuestions?.q16?.promptZh || '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？'),
                        options: isZh ? (activeSchema.supportingQuestions?.q16?.options || ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling']) : (q19Opts.length > 0 ? q19Opts : ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling']),
                        optionsZh: isZh ? (q19Opts.length > 0 ? q19Opts : ['極度願意', '願意', '普通', '意願低', '完全不願意']) : (activeSchema.supportingQuestions?.q16?.optionsZh || ['極度願意', '願意', '普通', '意願低', '完全不願意'])
                    }
                },


                // Part IV Prompts & Work Content Items
                q20Prompt: isZh ? (activeSchema.q20Prompt || 'The following lists 9 categories of work items. Please fill in the codes for your main daily work items (up to 5 items) and estimate the proportion of time occupied by each item in the table below. If there are no matching options, please select “j) Other” and fill in the work item yourself.') : (q20P || activeSchema.q20Prompt || 'The following lists 9 categories of work items. Please fill in the codes for your main daily work items (up to 5 items) and estimate the proportion of time occupied by each item in the table below. If there are no matching options, please select “j) Other” and fill in the work item yourself.'),
                q20PromptZh: isZh ? (q20P || activeSchema.q20PromptZh || '以下列出 9 大項工作內容。請於下表中填入您日常主要執行的工作項目代號（最多 5 項），並預估各項目所佔之時間比例。若無符合選項，請選「j) 其他」並自行填寫工作項目。') : (activeSchema.q20PromptZh || '以下列出 9 大項工作內容。請於下表中填入您日常主要執行的工作項目代號（最多 5 項），並預估各項目所佔之時間比例。若無符合選項，請選「j) 其他」並自行填寫工作項目。'),
                dailyWorkItems: isZh ? (activeSchema.dailyWorkItems || workList) : workList,
                dailyWorkItemsZh: isZh ? workList : (activeSchema.dailyWorkItemsZh || workList),
                q21Prompt: isZh ? (activeSchema.q21Prompt || 'In carrying out your daily tasks above, is there a gap or contradiction between the goals you hope to achieve and the actual work outcomes? Please briefly explain:') : (q21P || activeSchema.q21Prompt || 'In carrying out your daily tasks above, is there a gap or contradiction between the goals you hope to achieve and the actual work outcomes? Please briefly explain:'),
                q21PromptZh: isZh ? (q21P || activeSchema.q21PromptZh || '在執行上述日常工作時，您希望達成的目標，與您實際能完成的工作成果之間，是否存在落差或矛盾？請簡要說明：') : (activeSchema.q21PromptZh || '在執行上述日常工作時，您希望達成的目標，與您實際能完成的工作成果之間，是否存在落差或矛盾？請簡要說明：'),
                q22Prompt: isZh ? (activeSchema.q22Prompt || 'Which OFFICIAL COMPANY SYSTEMS do you use most frequently in your insurance operations?') : (q22P || activeSchema.q22Prompt || 'Which OFFICIAL COMPANY SYSTEMS do you use most frequently in your insurance operations?'),
                q22PromptZh: isZh ? (q22P || activeSchema.q22PromptZh || '在您的保險業務作業中，最常使用哪些「公司正式系統」？') : (activeSchema.q22PromptZh || '在您的保險業務作業中，最常使用哪些「公司正式系統」？'),
                officialSystems: isZh ? (activeSchema.officialSystems || q22Opts) : (q22Opts.length > 0 ? q22Opts : activeSchema.officialSystems),
                officialSystemsZh: isZh ? (q22Opts.length > 0 ? q22Opts : activeSchema.officialSystemsZh) : (activeSchema.officialSystemsZh || q22Opts),
                q23Prompt: isZh ? (activeSchema.q23Prompt || 'Which PERSONAL TOOLS / WORKAROUNDS do you use most frequently in your insurance operations?') : (q23P || activeSchema.q23Prompt || 'Which PERSONAL TOOLS / WORKAROUNDS do you use most frequently in your insurance operations?'),
                q23PromptZh: isZh ? (q23P || activeSchema.q23PromptZh || '在您的保險業務作業中，最常使用哪些「個人工具／替代做法」？') : (activeSchema.q23PromptZh || '在您的保險業務作業中，最常使用哪些「個人工具／替代做法」？'),
                personalTools: isZh ? (activeSchema.personalTools || q23Opts) : (q23Opts.length > 0 ? q23Opts : activeSchema.personalTools),
                personalToolsZh: isZh ? (q23Opts.length > 0 ? q23Opts : activeSchema.personalToolsZh) : (activeSchema.personalToolsZh || q23Opts),
                q24Prompt: isZh ? (activeSchema.q24Prompt || 'In your busy insurance work, what are your most critical core needs/expectations?') : (q24P || activeSchema.q24Prompt || 'In your busy insurance work, what are your most critical core needs/expectations?'),
                q24PromptZh: isZh ? (q24P || activeSchema.q24PromptZh || '在繁忙的保險工作中，您最關鍵的核心需求／期待為何？') : (activeSchema.q24PromptZh || '在繁忙的保險工作中，您最關鍵的核心需求／期待為何？'),
                coreNeeds: isZh ? (activeSchema.coreNeeds || q24Opts) : (q24Opts.length > 0 ? q24Opts : activeSchema.coreNeeds),
                coreNeedsZh: isZh ? (q24Opts.length > 0 ? q24Opts : activeSchema.coreNeedsZh) : (activeSchema.coreNeedsZh || q24Opts),
                q25Prompt: isZh ? (activeSchema.q25Prompt || 'Could you share a single sentence that best represents your motto?') : (q25P || activeSchema.q25Prompt || 'Could you share a single sentence that best represents your motto?'),
                q25PromptZh: isZh ? (q25P || activeSchema.q25PromptZh || '請以一句話分享最能代表您的座右銘。') : (activeSchema.q25PromptZh || '請以一句話分享最能代表您的座右銘。'),

                // Part V Prompts & Options
                q26Prompt: isZh ? (activeSchema.q26Prompt || 'In your daily work, which journey do you focus on most and experience every day? (Single Select)') : (q26P || activeSchema.q26Prompt || 'In your daily work, which journey do you focus on most and experience every day? (Single Select)'),
                q26PromptZh: isZh ? (q26P || activeSchema.q26PromptZh || '在日常工作中，您最專注且每天經歷的是哪一個歷程？（單選）') : (activeSchema.q26PromptZh || '在日常工作中，您最專注且每天經歷的是哪一個歷程？（單選）'),
                q26Options: isZh ? (activeSchema.q26Options || ['Sales Journey', 'Organisational Development Journey']) : (q26Opts.length > 0 ? q26Opts : activeSchema.q26Options),
                q26OptionsZh: isZh ? (q26Opts.length > 0 ? q26Opts : activeSchema.q26OptionsZh) : (activeSchema.q26OptionsZh || ['銷售歷程', '組織發展歷程']),

                questions: activeSchema.questions || (typeof JOURNEY_SCHEMAS !== 'undefined' && JOURNEY_SCHEMAS['agent']?.questions) || []
            };

            // Save to JOURNEY_SCHEMAS and localStorage
            if (typeof JOURNEY_SCHEMAS !== 'undefined') {
                JOURNEY_SCHEMAS[id] = customSchema;
            }
            try {
                let saved = JSON.parse(localStorage.getItem('portal_custom_schemas') || '{}');
                saved[id] = customSchema;
                localStorage.setItem('portal_custom_schemas', JSON.stringify(saved));
            } catch (e) {
                console.warn('Could not persist schema to localStorage:', e);
            }

            window.activeJourneyType = id;
            if (typeof updateSchemaDropdown === 'function') updateSchemaDropdown();
            if (typeof renderAll === 'function') renderAll();
            closeSchemaBuilderModal();
        }

        function getModalOrActiveSchema() {
            // 1. Check live modular questionnaire iframe if available
            try {
                const iframe = document.getElementById('modular-questionnaire-iframe');
                if (iframe && iframe.contentWindow) {
                    if (typeof iframe.contentWindow.collectSchemaFromUI === 'function') {
                        const liveSchema = iframe.contentWindow.collectSchemaFromUI();
                        if (liveSchema && liveSchema.id) return liveSchema;
                    }
                    if (iframe.contentWindow.activeSchema && iframe.contentWindow.activeSchema.id) {
                        return iframe.contentWindow.activeSchema;
                    }
                }
            } catch (e) {}

            // 2. In-memory globally applied active custom schema
            if (window.__activeCustomSchema && window.__activeCustomSchema.id) {
                return window.__activeCustomSchema;
            }

            let schema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : {};
            const modal = document.getElementById('schema-builder-modal');
            const demoRows = document.querySelectorAll('#schema-demographics-list .schema-demo-row');
            const isZh = (currentLang === 'zh');

            if (modal && modal.classList.contains('active') && demoRows.length > 0) {
                // Return live schema from modal elements
                const nameInput = document.getElementById('schema-name-input');
                const idInput = document.getElementById('schema-id-input');
                const schemaId = (idInput && idInput.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')) || schema.id || 'custom';
                const targetAudience = (nameInput && nameInput.value.trim()) || schema.targetAudience || 'Insurance Agent';

                const demographics = [];
                demoRows.forEach((row, idx) => {
                    const labelEl = row.querySelector('.demo-label-input');
                    const typeEl = row.querySelector('.demo-type-select');
                    const label = (labelEl && labelEl.value.trim()) || `Demographic_${idx + 1}`;
                    const qType = (typeEl && typeEl.value) || 'choice';
                    let options = '';
                    if (qType === 'text') {
                        options = '__________________________________________';
                    } else {
                        const optInputs = row.querySelectorAll('.demo-option-input');
                        const opts = Array.from(optInputs).map(i => i.value.trim()).filter(Boolean);
                        options = opts.length > 0 ? opts.join(', ') : 'Option 1, Option 2';
                    }
                    const subPromptEl = row.querySelector('.demo-subq-prompt-input');
                    const subOptionsEl = row.querySelector('.demo-subq-options-input');
                    const subPromptVal = subPromptEl ? subPromptEl.value.trim() : '';
                    const subOptionsVal = subOptionsEl ? subOptionsEl.value.split(/[\n\r]+/).map(s => s.trim()).filter(Boolean) : [];

                    demographics.push({
                        key: `Demo_${idx + 1}`,
                        label: label,
                        labelZh: label,
                        type: qType,
                        options: options,
                        optionsZh: options,
                        subPrompt: subPromptVal,
                        subPromptZh: subPromptVal,
                        subOptions: subOptionsVal,
                        subOptionsZh: subOptionsVal
                    });
                });

                const metrics = [];
                const q11Rows = document.querySelectorAll('#schema-dimensions-q11-list .schema-dim-row');
                q11Rows.forEach((row, idx) => {
                    const labelEl = row.querySelector('.dim-label-input');
                    const scaleEl = row.querySelector('.dim-scale-select');
                    const label = (labelEl && labelEl.value.trim()) || `Factor ${idx + 1}`;
                    metrics.push({
                        key: (schema.metrics && schema.metrics[idx]?.key) || `Skill_Factor_${idx + 1}`,
                        label: label,
                        labelZh: label,
                        scaleType: (scaleEl && scaleEl.value) || '1-5',
                        category: 'system_efficiency',
                        indicator: 'Impact on Daily Work Efficiency',
                        indicatorZh: '對日常工作效率之影響程度',
                        sourceQuestion: 'Q14'
                    });
                });

                const q12Rows = document.querySelectorAll('#schema-dimensions-q12-list .schema-dim-row');
                q12Rows.forEach((row, idx) => {
                    const labelEl = row.querySelector('.dim-label-input');
                    const scaleEl = row.querySelector('.dim-scale-select');
                    const label = (labelEl && labelEl.value.trim()) || `Capability ${idx + 1}`;
                    const realIdx = q11Rows.length + idx;
                    metrics.push({
                        key: (schema.metrics && schema.metrics[realIdx]?.key) || `Skill_Cap_${idx + 1}`,
                        label: label,
                        labelZh: label,
                        scaleType: (scaleEl && scaleEl.value) || '1-5',
                        category: 'sales_performance',
                        indicator: 'Impact on Business & Sales Performance',
                        indicatorZh: '對整體業務與銷售績效之影響程度',
                        sourceQuestion: 'Q15'
                    });
                });

                const tagItemEls = document.querySelectorAll('#schema-tags-checklist .schema-tag-item');
                let tagsList = [];
                tagItemEls.forEach(el => {
                    const chk = el.querySelector('.tag-item-chk');
                    const txt = el.querySelector('.tag-item-text');
                    if (chk && chk.checked && txt && txt.value.trim()) tagsList.push(txt.value.trim());
                });

                const workItemEls = document.querySelectorAll('#schema-q20-items-list .q20-work-item, #schema-q20-items-list .schema-dim-row');
                let workList = [];
                workItemEls.forEach(el => {
                    const chk = el.querySelector('.q20-item-chk, input[type="checkbox"]');
                    const txt = el.querySelector('.q20-item-text, input[type="text"], .dim-label-input');
                    if ((!chk || chk.checked) && txt && txt.value.trim()) workList.push(txt.value.trim());
                });

                const stageRows = document.querySelectorAll('#schema-stages-list .schema-stage-row');
                const stages = [];
                stageRows.forEach((row, idx) => {
                    const titleEl = row.querySelector('.stage-title-input');
                    const title = (titleEl && titleEl.value.trim()) || `Stage ${idx + 1}`;
                    const actRows = row.querySelectorAll('.stage-action-item');
                    let actionItems = [];
                    let actionDetails = [];
                    actRows.forEach((actRow, aIdx) => {
                        const input = actRow.querySelector('.stage-action-input');
                        const actName = (input && input.value.trim()) || `Action ${String.fromCharCode(65 + aIdx)}`;
                        actionItems.push(actName);
                        actionDetails.push({
                            name: actName,
                            locations: ['Office', 'Online', 'Other'],
                            tools: ['LINE', 'Agent Portal', 'Other'],
                            painPoints: ['System slow', 'Other'],
                            additionalContext: ['Standard priority', 'Other']
                        });
                    });
                    stages.push({
                        id: `stage_${idx + 1}`,
                        title: title,
                        titleZh: title,
                        actions: actionItems,
                        actionsZh: actionItems,
                        actionDetails: actionDetails,
                        actionDetailsZh: actionDetails
                    });
                });

                const q10Opts = Array.from(document.querySelectorAll('#card-q10 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q13Opts = Array.from(document.querySelectorAll('#card-q13 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q14Opts = Array.from(document.querySelectorAll('#card-q14 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q15Opts = Array.from(document.querySelectorAll('#card-q15 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q16Opts = Array.from(document.querySelectorAll('#card-q16 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q22Opts = Array.from(document.querySelectorAll('#card-q22 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q23Opts = Array.from(document.querySelectorAll('#card-q23 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q24Opts = Array.from(document.querySelectorAll('#card-q24 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);
                const q26Opts = Array.from(document.querySelectorAll('#card-q26 .demo-option-input')).map(i => i.value.trim()).filter(Boolean);

                return {
                    id: schemaId,
                    name: targetAudience,
                    nameZh: targetAudience,
                    targetAudience: targetAudience,
                    targetAudienceZh: targetAudience,
                    icon: '✨',
                    badge: 'Custom Schema',
                    badgeZh: '自訂架構',
                    sectionsConfig: {
                        demographics: document.getElementById('sec-card-chk-demographics')?.checked !== false,
                        dimensions: document.getElementById('sec-card-chk-dimensions')?.checked !== false,
                        tags: document.getElementById('sec-card-chk-tags')?.checked !== false,
                        workContent: document.getElementById('sec-card-chk-workContent')?.checked !== false,
                        journey: document.getElementById('sec-card-chk-journey')?.checked !== false
                    },
                    sectionTitles: {
                        demographics: document.getElementById('schema-section-title-demographics')?.value.trim() || 'General Information',
                        demographicsZh: document.getElementById('schema-section-title-demographics')?.value.trim() || '基本資料',
                        dimensions: document.getElementById('schema-section-title-dimensions')?.value.trim() || 'Agent Background',
                        dimensionsZh: document.getElementById('schema-section-title-dimensions')?.value.trim() || '現況評估',
                        tags: document.getElementById('schema-section-title-tags')?.value.trim() || 'Self-Image Tags',
                        tagsZh: document.getElementById('schema-section-title-tags')?.value.trim() || '自我形象標籤',
                        workContent: document.getElementById('schema-section-title-workContent')?.value.trim() || 'Daily Work Content and Needs',
                        workContentZh: document.getElementById('schema-section-title-workContent')?.value.trim() || '日常工作內容與需求',
                        journey: document.getElementById('schema-section-title-journey')?.value.trim() || 'Agent Journey',
                        journeyZh: document.getElementById('schema-section-title-journey')?.value.trim() || '業務員歷程地圖'
                    },
                    intro: document.getElementById('schema-intro-input')?.value.trim() || schema.intro || '',
                    introZh: document.getElementById('schema-intro-input')?.value.trim() || schema.introZh || '',
                    demographics: demographics,
                    metrics: metrics.length > 0 ? metrics : (schema.metrics || []),
                    stages: stages.length > 0 ? stages : (schema.stages || []),
                    selfImageTags: tagsList.length > 0 ? tagsList : (schema.selfImageTags || []),
                    selfImageTagsZh: tagsList.length > 0 ? tagsList : (schema.selfImageTagsZh || []),
                    dailyWorkItems: workList.length > 0 ? workList : (schema.dailyWorkItems || []),
                    dailyWorkItemsZh: workList.length > 0 ? workList : (schema.dailyWorkItemsZh || []),

                    tag1Prompt: document.getElementById('schema-q8-prompt-input')?.value.trim() || schema.tag1Prompt || schema.q8Prompt,
                    tag1PromptZh: document.getElementById('schema-q8-prompt-input')?.value.trim() || schema.tag1PromptZh || schema.q8PromptZh,
                    tag2Prompt: document.getElementById('schema-q9-prompt-input')?.value.trim() || schema.tag2Prompt || schema.q9Prompt,
                    tag2PromptZh: document.getElementById('schema-q9-prompt-input')?.value.trim() || schema.tag2PromptZh || schema.q9PromptZh,
                    tag3Prompt: document.getElementById('schema-q10-prompt-input')?.value.trim() || schema.tag3Prompt || schema.q10Prompt,
                    tag3PromptZh: document.getElementById('schema-q10-prompt-input')?.value.trim() || schema.tag3PromptZh || schema.q10PromptZh,

                    q8Prompt: document.getElementById('schema-q8-prompt-input')?.value.trim() || schema.tag1Prompt || schema.q8Prompt,
                    q8PromptZh: document.getElementById('schema-q8-prompt-input')?.value.trim() || schema.tag1PromptZh || schema.q8PromptZh,
                    q8Scale: document.getElementById('schema-q8-scale-select')?.value || schema.q8Scale || '0-100',
                    q9Prompt: document.getElementById('schema-q9-prompt-input')?.value.trim() || schema.tag2Prompt || schema.q9Prompt,
                    q9PromptZh: document.getElementById('schema-q9-prompt-input')?.value.trim() || schema.tag2PromptZh || schema.q9PromptZh,
                    q9Scale: document.getElementById('schema-q9-scale-select')?.value || schema.q9Scale || 'emoji',
                    q10Prompt: document.getElementById('schema-q10-prompt-input')?.value.trim() || schema.tag3Prompt || schema.q10Prompt,
                    q10PromptZh: document.getElementById('schema-q10-prompt-input')?.value.trim() || schema.tag3PromptZh || schema.q10PromptZh,
                    q10Options: q10Opts.length > 0 ? q10Opts : (schema.q10Options || []),
                    q10OptionsZh: q10Opts.length > 0 ? q10Opts : (schema.q10OptionsZh || []),
                    q11Prompt: document.getElementById('schema-q11-prompt-input')?.value.trim() || schema.q11Prompt,
                    q11PromptZh: document.getElementById('schema-q11-prompt-input')?.value.trim() || schema.q11PromptZh,
                    q12Prompt: document.getElementById('schema-q12-prompt-input')?.value.trim() || schema.q12Prompt,
                    q12PromptZh: document.getElementById('schema-q12-prompt-input')?.value.trim() || schema.q12PromptZh,
                    q13Prompt: document.getElementById('schema-q13-prompt-input')?.value.trim() || schema.q13Prompt,
                    q13PromptZh: document.getElementById('schema-q13-prompt-input')?.value.trim() || schema.q13PromptZh,
                    q13Options: q13Opts.length > 0 ? q13Opts : (schema.q13Options || []),
                    q13OptionsZh: q13Opts.length > 0 ? q13Opts : (schema.q13OptionsZh || []),
                    q14Prompt: document.getElementById('schema-q14-prompt-input')?.value.trim() || schema.q14Prompt,
                    q14PromptZh: document.getElementById('schema-q14-prompt-input')?.value.trim() || schema.q14PromptZh,
                    q14Options: q14Opts.length > 0 ? q14Opts : (schema.q14Options || []),
                    q14OptionsZh: q14Opts.length > 0 ? q14Opts : (schema.q14OptionsZh || []),
                    q15Prompt: document.getElementById('schema-q15-prompt-input')?.value.trim() || schema.q15Prompt,
                    q15PromptZh: document.getElementById('schema-q15-prompt-input')?.value.trim() || schema.q15PromptZh,
                    q15Options: q15Opts.length > 0 ? q15Opts : (schema.q15Options || []),
                    q15OptionsZh: q15Opts.length > 0 ? q15Opts : (schema.q15OptionsZh || []),
                    q16Prompt: document.getElementById('schema-q16-prompt-input')?.value.trim() || schema.q16Prompt,
                    q16PromptZh: document.getElementById('schema-q16-prompt-input')?.value.trim() || schema.q16PromptZh,
                    q16Options: q16Opts.length > 0 ? q16Opts : (schema.q16Options || []),
                    q16OptionsZh: q16Opts.length > 0 ? q16Opts : (schema.q16OptionsZh || []),
                    q17Prompt: document.getElementById('schema-q17-prompt-input')?.value.trim() || schema.q17Prompt,
                    q17PromptZh: document.getElementById('schema-q17-prompt-input')?.value.trim() || schema.q17PromptZh,
                    q18Prompt: document.getElementById('schema-q18-prompt-input')?.value.trim() || schema.q18Prompt,
                    q18PromptZh: document.getElementById('schema-q18-prompt-input')?.value.trim() || schema.q18PromptZh,
                    q19Prompt: document.getElementById('schema-q19-prompt-input')?.value.trim() || schema.q19Prompt,
                    q19PromptZh: document.getElementById('schema-q19-prompt-input')?.value.trim() || schema.q19PromptZh,
                    q20Prompt: document.getElementById('schema-q20-prompt-input')?.value.trim() || schema.q20Prompt,
                    q20PromptZh: document.getElementById('schema-q20-prompt-input')?.value.trim() || schema.q20PromptZh,
                    q21Prompt: document.getElementById('schema-q21-prompt-input')?.value.trim() || schema.q21Prompt,
                    q21PromptZh: document.getElementById('schema-q21-prompt-input')?.value.trim() || schema.q21PromptZh,
                    q22Prompt: document.getElementById('schema-q22-prompt-input')?.value.trim() || schema.q22Prompt,
                    q22PromptZh: document.getElementById('schema-q22-prompt-input')?.value.trim() || schema.q22PromptZh,
                    officialSystems: q22Opts.length > 0 ? q22Opts : (schema.officialSystems || []),
                    officialSystemsZh: q22Opts.length > 0 ? q22Opts : (schema.officialSystemsZh || []),
                    q23Prompt: document.getElementById('schema-q23-prompt-input')?.value.trim() || schema.q23Prompt,
                    q23PromptZh: document.getElementById('schema-q23-prompt-input')?.value.trim() || schema.q23PromptZh,
                    personalTools: q23Opts.length > 0 ? q23Opts : (schema.personalTools || []),
                    personalToolsZh: q23Opts.length > 0 ? q23Opts : (schema.personalToolsZh || []),
                    q24Prompt: document.getElementById('schema-q24-prompt-input')?.value.trim() || schema.q24Prompt,
                    q24PromptZh: document.getElementById('schema-q24-prompt-input')?.value.trim() || schema.q24PromptZh,
                    coreNeeds: q24Opts.length > 0 ? q24Opts : (schema.coreNeeds || []),
                    coreNeedsZh: q24Opts.length > 0 ? q24Opts : (schema.coreNeedsZh || []),
                    q25Prompt: document.getElementById('schema-q25-prompt-input')?.value.trim() || schema.q25Prompt,
                    q25PromptZh: document.getElementById('schema-q25-prompt-input')?.value.trim() || schema.q25PromptZh,
                    q26Prompt: document.getElementById('schema-q26-prompt-input')?.value.trim() || schema.q26Prompt,
                    q26PromptZh: document.getElementById('schema-q26-prompt-input')?.value.trim() || schema.q26PromptZh,
                    q26Options: q26Opts.length > 0 ? q26Opts : (schema.q26Options || []),
                    q26OptionsZh: q26Opts.length > 0 ? q26Opts : (schema.q26OptionsZh || []),

                    questions: schema.questions || []
                };
            }
            return schema;
        }

        function downloadMatchingCSVTemplate() {
            const schema = getModalOrActiveSchema();
            const demographics = schema.demographics || [
                { key: 'Age', label: 'Age', options: '18-25, 26-35, 36-45, 46-55, 56+' },
                { key: 'Region', label: 'Region', options: 'North, Central, South, East' },
                { key: 'Position', label: 'Position', options: 'Specialist, Senior, Manager, Director' },
                { key: 'Experience', label: 'Experience', options: '< 1 Year, 1-3 Years, 3-5 Years, 5+ Years' }
            ];
            const metrics = schema.metrics || [];
            const stages = schema.stages || [];
            const schemaId = schema.id || 'custom';
            const targetAudience = schema.targetAudience || 'Participant';
            const cfg = schema.sectionsConfig || {
                demographics: true,
                dimensions: true,
                tags: true,
                workContent: true,
                journey: true
            };

            const headers = ['respondent_id', 'persona_archetype'];
            
            // 1. Demographics
            if (cfg.demographics) {
                demographics.forEach((d, idx) => {
                    const cleanKey = d.key ? d.key.replace(/^Demo_\d+_/, '') : `Demo_${idx + 1}`;
                    headers.push(cleanKey);
                });
            }
            
            // 2. Metrics
            if (cfg.dimensions) {
                metrics.forEach((m, idx) => {
                    const cleanKey = m.key || `Skill_Dim_${idx + 1}`;
                    headers.push(cleanKey);
                });
            }
            
            // 3. Stages
            if (cfg.journey) {
                stages.forEach((s, idx) => {
                    const stepNum = idx + 1;
                    const stageName = s.key || `Stage_${stepNum}`;
                    headers.push(`Task${stepNum}_${stageName}_location`);
                    headers.push(`Task${stepNum}_${stageName}_tools_or_people`);
                    headers.push(`Task${stepNum}_${stageName}_pain_point`);
                    headers.push(`Task${stepNum}_${stageName}_emotional_rating_1to5`);
                });
            }
            
            // 4. Qualitative
            if (cfg.workContent) {
                headers.push('Conflict_Barriers');
                headers.push('Core_Needs');
                headers.push('Quote_Verbatim');
            }
            
            let csv = headers.join(',') + "\n";
            for (let r = 1; r <= 3; r++) {
                const row = [
                    `SAMPLE_${String(r).padStart(3, '0')}`,
                    r === 1 ? 'Explorer' : (r === 2 ? 'Expert' : 'Optimiser')
                ];
                if (cfg.demographics) {
                    demographics.forEach(d => {
                        const isText = d.type === 'text' || (d.options && d.options.includes('___'));
                        if (isText) {
                            row.push(`Sample response for ${d.label}`);
                        } else {
                            const opts = (d.options || '').split(/[,，;；\n\r]+/).map(o => o.trim()).filter(Boolean);
                            row.push(opts.length > 0 ? opts[r % opts.length] : 'Sample Value');
                        }
                    });
                }
                if (cfg.dimensions) {
                    metrics.forEach(m => {
                        if (m.scaleType === '1-5') row.push(Math.floor(Math.random() * 3) + 3);
                        else if (m.scaleType === '1-7') row.push(Math.floor(Math.random() * 4) + 3);
                        else if (m.scaleType === '1-10') row.push(Math.floor(Math.random() * 4) + 6);
                        else row.push(Math.floor(Math.random() * 30) + 70);
                    });
                }
                if (cfg.journey) {
                    stages.forEach((s, idx) => {
                        row.push('Online Portal');
                        row.push('Digital App');
                        row.push(`Friction noted in stage ${idx+1}`);
                        row.push((3.2 + Math.random() * 1.6).toFixed(1));
                    });
                }
                if (cfg.workContent) {
                    row.push('Goal vs reality friction during busy periods');
                    row.push('Transparent communication & real-time updates');
                    row.push('I value efficient self-service with responsive human support when needed.');
                }
                csv += row.join(',') + "\n";
            }
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${schemaId}_Questionnaire_Template.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        function generateQuestionnaireHTML(schema, lang) {
            const isZh = (lang === 'zh');
            function safeText(val, fallback = '') {
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
                    demoRowsHtml = `<div style="color: #64748b; font-style: italic; font-size: var(--fs-caption); padding: 12px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; text-align: center;">${isZh ? '此問卷未設定基本資料題。' : 'No demographic questions configured.'}</div>`;
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
                            optHtml = `<div class="field-writein" style="font-family: monospace; font-size: var(--fs-caption); color: #475569; margin-top: 6px; letter-spacing: 1px;">${escapeHtml(typeof rawOpts === 'string' && rawOpts.includes('___') ? rawOpts : '__________________________________________________')}</div>`;
                        } else if (optList.length > 0) {
                            optHtml = `<div class="field-options" style="display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: var(--fs-caption); margin-top: 6px;">${optList.map(o => `<span>[ ] ${escapeHtml(o)}</span>`).join('')}</div>`;
                        } else {
                            optHtml = `<div class="field-writein" style="border-bottom: 1px solid #94a3b8; height: 22px; width: 100%; margin-top: 6px;"></div>`;
                        }

                        let noteHtml = '';
                        if (noteText) {
                            noteHtml = `<div style="font-size: var(--fs-caption); color: #64748b; font-style: italic; margin-top: 5px; line-height: 1.4;">${escapeHtml(safeText(noteText))}</div>`;
                        }

                        let subHtml = '';
                        const rawSubPrompt = isZh
                            ? (d.subPromptZh || d.subPrompt || (d.subQuestion && d.subQuestion.promptZh) || (d.subQuestion && d.subQuestion.prompt) || '')
                            : (d.subPrompt || (d.subQuestion && d.subQuestion.prompt) || '');
                        const rawSubOpts = isZh
                            ? (d.subOptionsZh || d.subOptions || (d.subQuestion && (d.subQuestion.optionsZh || d.subQuestion.options)) || '')
                            : (d.subOptions || (d.subQuestion && d.subQuestion.options) || '');

                        const subOptList = Array.isArray(rawSubOpts)
                            ? rawSubOpts.map(o => safeText(o)).filter(Boolean)
                            : (typeof rawSubOpts === 'string' ? rawSubOpts.split(/[,，;；\n\r]+/).map(o => o.trim()).filter(Boolean) : []);
                        const hasSubPrompt = false; // sub-questions removed
                        const hasSubOpts = subOptList.length > 0;

                        if (false && (hasSubPrompt || hasSubOpts)) {
                            let subOptHtml = '';
                            if (subOptList.length > 0) {
                                subOptHtml = `<div class="field-options" style="display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: var(--fs-caption); margin-top: 5px;">${subOptList.map(o => `<span>[ ] ${escapeHtml(o)}</span>`).join('')}</div>`;
                            } else {
                                subOptHtml = `<div class="field-writein" style="border-bottom: 1px solid #94a3b8; height: 22px; width: 100%; margin-top: 5px;"></div>`;
                            }

                            subHtml = `
                                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                                    ${hasSubPrompt ? `<label style="display: block; font-weight: 600; color: #334155; font-size: var(--fs-caption); line-height: 1.4;">${escapeHtml(safeText(rawSubPrompt))}</label>` : ''}
                                    ${subOptHtml}
                                </div>
                            `;
                        }

                        return `
                            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; page-break-inside: avoid;">
                                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">${qNum}. ${escapeHtml(dLabel)}</label>
                                ${optHtml}
                                ${noteHtml}
                                ${subHtml}
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
                        <span>${escapeHtml(displayDemoTitle)}</span>
                        <span style="font-size: var(--fs-caption); opacity: 0.85;">${rangeLabel}</span>
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
                            tagsTableRows += `<td style="padding: 6px 8px; font-size: var(--fs-caption); color: #1e293b;">[ ] ${escapeHtml(item)}</td>`;
                        } else {
                            tagsTableRows += '<td style="padding: 6px 8px;"></td>';
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
                        <span>${escapeHtml(displayTagsTitle)}</span>
                        <span style="font-size: var(--fs-caption); opacity: 0.85;">Q${startQ} ~ Q${endQ}</span>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-bottom: 8px;">
                        <p style="margin: 0 0 8px 0; font-size: var(--fs-caption); color: #334155; line-height: 1.5;">
                            ${isZh ? '以下標籤用於協助我們了解您的工作風格與自我認同。答案沒有對錯，請憑直覺選擇最符合您的描述。' : 'The following tags are used to help us understand your working style and self-identity. There are no right or wrong answers; please select the descriptions that fit you best based on your intuition.'}
                        </p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                            <tbody>
                                ${tagsTableRows}
                            </tbody>
                        </table>
                        <div style="font-size: var(--fs-caption); color: #475569; margin-bottom: 12px;">
                            [ ] ${isZh ? '其他（請說明）' : 'Other (please specify)'}: __________________________________________________
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                            <div>
                                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption);">
                                    ${qTag1}. ${escapeHtml(cleanQ8Prompt)}
                                </label>
                                <div style="font-size: var(--fs-caption); color: #2563eb; margin-top: 4px;">
                                    Tag 1: __________________________________________________
                                </div>
                            </div>
                            <div>
                                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption);">
                                    ${qTag2}. ${escapeHtml(cleanQ9Prompt)}
                                </label>
                                <div style="font-size: var(--fs-caption); color: #2563eb; margin-top: 4px;">
                                    Tag 2: __________________________________________________
                                </div>
                            </div>
                            <div>
                                <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption);">
                                    ${qTag3}. ${escapeHtml(cleanQ10Prompt)}
                                </label>
                                <div style="font-size: var(--fs-caption); color: #2563eb; margin-top: 4px;">
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

                // System / Tool Factors rows
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
                const matrixHeaderThs = matrixHeaders.map(h => `<th style="text-align: center;">${escapeHtml(h)}</th>`).join('');
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
                // Sub-questions are not supported (they disturb question numbering)
                const q17SubPrompt = '';
                const q17SubOptionsList = [];

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
                        <span>${escapeHtml(displayDimTitle)}</span>
                        <span style="font-size: var(--fs-caption); opacity: 0.85;">Q${startQ} ~ Q${endQ}</span>
                    </div>

                    <!-- Agent Tools Familiarity (Q11) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qFamiliarity}. ${escapeHtml(cleanQ11Prompt)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px; color: #334155;">
                            <span style="font-weight: 600; color: #64748b;">${isZh ? '極不熟悉' : 'Extremely Unfamiliar'}</span>
                            <span>[ ] 0%</span> <span>[ ] 20%</span> <span>[ ] 40%</span> <span>[ ] 60%</span> <span>[ ] 80%</span> <span>[ ] 100%</span>
                            <span style="font-weight: 600; color: #64748b;">${isZh ? '極為熟悉' : 'Extremely Familiar'}</span>
                        </div>
                    </div>

                    <!-- Work Feeling Emoji Scale (Q12) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qEmoji}. ${escapeHtml(cleanQ12Prompt)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px; color: #334155;">
                            <span style="font-weight: 600; color: #64748b;">${isZh ? '極不滿意' : 'Extremely Unhappy'}</span>
                            <span>[ ] 😩</span> <span>[ ] 🙁</span> <span>[ ] 😐</span> <span>[ ] 🙂</span> <span>[ ] 😄</span>
                            <span style="font-weight: 600; color: #64748b;">${isZh ? '極為滿意' : 'Extremely Happy'}</span>
                        </div>
                    </div>

                    <!-- Tools Efficiency Impact (Q13) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qImpact}. ${escapeHtml(cleanQ13Prompt)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${q13OptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                        </div>
                    </div>

                    <!-- System / Digital Tool Factors Matrix (Q14) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qSystemFactors}. ${escapeHtml(cleanQ14Prompt)}
                        </label>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: var(--fs-caption);">
                            <thead>
                                <tr style="background: #f8fafc; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
                                    <th style="text-align: left; padding: 6px 8px; width: 45%;">${isZh ? '評估項目' : 'Item'}</th>
                                    ${matrixHeaderThs}
                                </tr>
                            </thead>
                            <tbody>
                                ${systemFactors.map(f => `
                                    <tr style="border-bottom: 1px solid #e2e8f0;">
                                        <td style="padding: 6px 8px; color: #1e293b; font-weight: 500;">${escapeHtml(safeText(f))}</td>
                                        ${emptyMatrixCells}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Professional Capabilities Matrix (Q15) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qCompetency}. ${escapeHtml(cleanQ15Prompt)}
                        </label>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: var(--fs-caption);">
                            <thead>
                                <tr style="background: #f8fafc; border-bottom: 1.5px solid #cbd5e1; color: #475569;">
                                    <th style="text-align: left; padding: 6px 8px; width: 45%;">${isZh ? '評估項目' : 'Item'}</th>
                                    ${matrixHeaderThs}
                                </tr>
                            </thead>
                            <tbody>
                                ${competencies.map(c => `
                                    <tr style="border-bottom: 1px solid #e2e8f0;">
                                        <td style="padding: 6px 8px; color: #1e293b; font-weight: 500;">${escapeHtml(safeText(c))}</td>
                                        ${emptyMatrixCells}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- LINE / Personal Tools Reasons (Q16) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qLineReason}. ${escapeHtml(cleanQ16Prompt)}
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 5px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${q16OptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Customer Visit Scheduling (Q17) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qSchedule}. ${escapeHtml(cleanQ17Prompt)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${q17OptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                        </div>
                        ${(q17SubPrompt || q17SubOptionsList.length > 0) ? `
                        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #e2e8f0; font-size: var(--fs-caption); color: #475569;">
                            <label style="display: block; font-weight: 600; color: #0284c7; margin-bottom: 4px;">
                                ${escapeHtml(q17SubPrompt)}
                            </label>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 5px;">
                                ${q17SubOptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Paper Calendar Reason (Q18) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qDeskCalendar}. ${escapeHtml(cleanQ18Prompt)}
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 5px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${q18OptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Calendar Suggestions Adoption (Q19) -->
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qCalendarSuggestions}. ${escapeHtml(cleanQ19Prompt)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${q19OptionsList.map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
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

                const dailyItemsRendered = dailyItems.map(item => `<span>${escapeHtml(item)}</span>`).join(' &nbsp;|&nbsp; ');

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
                        <span>${escapeHtml(displayWorkTitle)}</span>
                        <span style="font-size: var(--fs-caption); opacity: 0.85;">Q${startQ} ~ Q${endQ}</span>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qWorkItems}. ${escapeHtml(cleanQ20Prompt)}
                        </label>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px; margin: 8px 0 10px 0; font-size: var(--fs-caption); color: #334155; line-height: 1.7;">
                            ${dailyItemsRendered}
                        </div>
                        <table class="table-matrix" style="width: 100%; margin: 8px auto;">
                            <thead>
                                <tr>
                                    <th style="width: 25%; text-align: left;">${isZh ? '代碼' : 'Code'}</th>
                                    <th style="text-align: left;">${isZh ? '比例選擇' : 'Percentage Range Selection'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 6px 10px;">[ _______ ]</td>
                                    <td style="padding: 6px 10px; font-size: var(--fs-caption);">${percentageCheckboxes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 10px;">[ _______ ]</td>
                                    <td style="padding: 6px 10px; font-size: var(--fs-caption);">${percentageCheckboxes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 10px;">[ _______ ]</td>
                                    <td style="padding: 6px 10px; font-size: var(--fs-caption);">${percentageCheckboxes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 10px;">[ _______ ]</td>
                                    <td style="padding: 6px 10px; font-size: var(--fs-caption);">${percentageCheckboxes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 10px;">[ _______ ]</td>
                                    <td style="padding: 6px 10px; font-size: var(--fs-caption);">${percentageCheckboxes}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="font-size: var(--fs-caption); color: #475569; margin-top: 8px;">
                            ${isZh ? '若選擇「j) 其他」，請說明工作項目：' : 'If selected “j) Other”, please specify work item:'} __________________________________________________
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qFriction}. ${escapeHtml(cleanQ21Prompt)}
                        </label>
                        <div style="border-bottom: 1px dashed #94a3b8; height: 22px; margin-top: 10px;"></div>
                        <div style="border-bottom: 1px dashed #94a3b8; height: 22px; margin-top: 4px;"></div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qOfficialSys}. ${escapeHtml(cleanQ22Prompt)} ${escapeHtml(q22TypeLabel)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${officialSystems.filter(s => !s.toLowerCase().includes('other') && !s.includes('其他')).map(s => `<span>[ ] ${escapeHtml(s)}</span>`).join('')}
                            <span>[ ] ${isZh ? '其他正式系統（請說明）' : 'Other official system (please specify)'}: __________________________________________________</span>
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qPersonalTools}. ${escapeHtml(cleanQ23Prompt)} ${escapeHtml(q23TypeLabel)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${personalTools.filter(t => !t.toLowerCase().includes('other') && !t.includes('其他')).map(t => `<span>[ ] ${escapeHtml(t)}</span>`).join('')}
                            <span>[ ] ${isZh ? '其他個人工具（請說明）' : 'Other personal tool (please specify)'}: ___________________________________________</span>
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qNeeds}. ${escapeHtml(cleanQ24Prompt)} ${escapeHtml(q24TypeLabel)}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${coreNeeds.filter(n => !n.toLowerCase().includes('other') && !n.includes('其他')).map(n => `<span>[ ] ${escapeHtml(n)}</span>`).join('')}
                            <span>[ ] ${isZh ? '其他（請說明）' : 'Other (please specify)'}: __________________________________________________</span>
                        </div>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qMotto}. ${escapeHtml(cleanQ25Prompt)}${q25TypeLabel ? ' ' + escapeHtml(q25TypeLabel) : ''}
                        </label>
                        <div style="margin-top: 8px; font-size: var(--fs-caption); color: #475569;">
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

                        // Custom location options based on schema or fallback
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

                        // Custom tool options based on schema or fallback
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

                        // Custom pain point options based on schema or fallback
                        let painOptions = isZh ? (d.painPointsZh || d.painPoints) : (d.painPoints);
                        if (!painOptions || (Array.isArray(painOptions) && painOptions.length === 0)) {
                            painOptions = isZh
                                ? ['系統載入緩慢或超時', '重複登打資料', '缺乏行動端支援', '其他']
                                : ['System timeout / slow loading', 'Repetitive data entry', 'Lack of mobile support', 'Other'];
                        }

                        // Format options ensuring 'Other' has a write-in blank line
                        const renderOptionsWithOther = (opts, defaultWidth = '140px') => {
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
                                    return `<span>[ ] ${escapeHtml(optStr)}: _________________</span>`;
                                }
                                return `<span>[ ] ${escapeHtml(optStr)}</span>`;
                            });
                            if (!hasOther) {
                                items.push(`<span>[ ] ${isZh ? '其他' : 'Other'}: _________________</span>`);
                            }
                            return items.join('');
                        };

                        // Custom additional context options based on schema or fallback
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
                            <div style="margin-top: 10px; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; page-break-inside: avoid;">
                                <strong style="display: block; font-size: var(--fs-caption); color: #0f172a; margin-bottom: 6px;">${letter}. ${isZh ? '行動' : 'Action'}: ${escapeHtml(cleanActName)}</strong>
                                <div style="margin-bottom: 6px;">
                                    <span style="font-size: var(--fs-caption); font-weight: 600; color: #475569;">a) ${isZh ? '執行時的實體／數位地點：' : 'Physical/Digital location when executing:'}</span>
                                    <div style="font-size: var(--fs-caption); color: #334155; margin-top: 3px; display: flex; flex-wrap: wrap; gap: 6px 14px;">
                                        ${renderOptionsWithOther(locOptions)}
                                    </div>
                                </div>
                                <div style="margin-bottom: 6px;">
                                    <span style="font-size: var(--fs-caption); font-weight: 600; color: #475569;">b) ${isZh ? '協助完成此行動的工具或對象：' : 'Tools or people helping you complete this action:'}</span>
                                    <div style="font-size: var(--fs-caption); color: #334155; margin-top: 3px; display: flex; flex-wrap: wrap; gap: 6px 12px;">
                                        ${renderOptionsWithOther(toolOptions)}
                                    </div>
                                </div>
                                <div style="margin-bottom: 6px;">
                                    <span style="font-size: var(--fs-caption); font-weight: 600; color: #475569;">c) ${isZh ? '此行動中遭遇的痛點：' : 'Pain points encountered in this action:'}</span>
                                    <div style="font-size: var(--fs-caption); color: #334155; margin-top: 3px; display: flex; flex-wrap: wrap; gap: 6px 14px;">
                                        ${renderOptionsWithOther(painOptions)}
                                    </div>
                                </div>
                                <div style="margin-bottom: 4px;">
                                    <span style="font-size: var(--fs-caption); font-weight: 600; color: #475569;">d) ${isZh ? '補充考量：' : 'Additional context:'}</span>
                                    <div style="font-size: var(--fs-caption); color: #334155; margin-top: 3px; display: flex; flex-wrap: wrap; gap: 6px 14px;">
                                        ${renderOptionsWithOther(contextOptions)}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');

                    const ratingLetter = String.fromCharCode(65 + actionItems.length);
                    return `
                        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px; page-break-inside: avoid;">
                            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="background: #1e293b; color: #ffffff; font-size: var(--fs-caption); font-weight: 700; padding: 2px 8px; border-radius: 4px;">${isZh ? `階段 ${stepNum}` : `Stage ${stepNum}`}</span>
                                    <strong style="font-size: var(--fs-body); color: #0f172a;">${escapeHtml(String(stTitle).replace(/^\s*(Stage|階段)\s*\d+\s*[:：.\-–]?\s*/i, '') || stTitle)}</strong>
                                </div>
                                <span style="font-size: var(--fs-caption); color: #64748b;">${isZh ? '完成此階段通常依序執行的行動（最多3項）：' : 'To complete this stage, the sequential actions you typically perform are (up to 3):'}</span>
                            </div>
                            ${actionsRendered}
                            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">
                                <span style="font-size: var(--fs-caption); font-weight: 700; color: #1e293b;">${ratingLetter}. ${isZh ? '請為此階段的情緒體驗評分：' : 'Please rate your emotional experience for this stage:'}</span>
                                <div style="display: flex; gap: 16px; font-size: var(--fs-caption); color: #1e293b; margin-top: 4px;">
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
                        <span>${escapeHtml(displayJourneyTitle)}</span>
                        <span style="font-size: var(--fs-caption); opacity: 0.85;">Q${startQ} ~ Q${endQ}</span>
                    </div>

                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-caption); line-height: 1.4;">
                            ${qFocus}. ${qMap['Q26'] ? (isZh ? qMap['Q26'].promptZh : qMap['Q26'].prompt) : (isZh ? '請問您目前的工作歷程重心為何？' : 'Which journey is your primary focus at present?')}
                        </label>
                        <div style="display: flex; flex-wrap: wrap; gap: 14px 24px; font-size: var(--fs-caption); margin-top: 6px;">
                            ${((qMap['Q26'] && (isZh ? qMap['Q26'].optionsZh : qMap['Q26'].options)) || (isZh
                                ? ['個人保單銷售歷程 (Individual Policy Sales Journey)', '組織發展與團隊經營歷程 (Organisational Growth & Team Journey)']
                                : ['Individual Policy Sales Journey', 'Organisational Growth & Team Journey']
                            )).map(opt => `<span>[ ] ${escapeHtml(opt)}</span>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-weight: 700; color: #1e293b; font-size: var(--fs-small); margin-bottom: 6px;">
                            ${qStages}. ${qMap['Q27'] ? (isZh ? qMap['Q27'].promptZh : qMap['Q27'].prompt) : (isZh ? `階段歷程接觸點深度盤點（階段 1 至 階段 ${stages.length}）：` : `Stage Journey Touchpoint Deep-Dive (Stages 1 to ${stages.length}):`)}
                        </label>
                        <div style="font-size: var(--fs-caption); color: #475569; margin: 0 0 8px 0; font-weight: 500;">
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
    <title>${escapeHtml(title)}</title>
    <style>
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
            line-height: 1.5;
            font-size: 11.5px;
        }
        .print-toolbar {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: #0f172a;
            color: #ffffff;
            padding: 10px 20px;
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
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
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
            max-width: 820px;
            margin: 20px auto;
            background: #ffffff;
            padding: 36px 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border-radius: 8px;
        }
        h1 {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 10px 0;
            line-height: 1.35;
            text-align: center;
        }
        .section-header {
            background: #1e293b;
            color: #ffffff;
            padding: 7px 12px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 12.5px;
            margin: 22px 0 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            page-break-after: avoid;
        }
        .table-matrix {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 11px;
        }
        .table-matrix th {
            background: #f1f5f9;
            color: #334155;
            padding: 7px 8px;
            border: 1px solid #cbd5e1;
            font-weight: 700;
        }
        .table-matrix td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
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
            <span style="font-weight: 700; font-size: 13px;">📋 ${isZh ? '問卷預覽與列印' : 'Questionnaire Preview & Export'}</span>
            <span style="font-size: var(--fs-caption); color: #94a3b8;">${isZh ? '依據目前自訂架構動態生成（完全符合 V.1 原檔規格）' : 'Generated dynamically from active schema (Faithfully aligns with V.1)'}</span>
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
        <h1>${escapeHtml(title)}</h1>

        <!-- Briefing Instructions Box -->
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; border: 1px solid #e2e8f0; border-left-width: 4px; padding: 10px 14px; border-radius: 4px; margin-bottom: 16px; font-size: var(--fs-caption); color: #334155; line-height: 1.55;">
            ${escapeHtml(introText)}
        </div>

        <!-- Respondent Header Info -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px dashed #cbd5e1; padding: 8px 14px; border-radius: 4px; margin-bottom: 16px; font-size: var(--fs-caption); color: #475569;">
            <span>${isZh ? '姓名' : 'Name'}: ______________________</span>
            <span>${isZh ? '業務員編號' : 'Agent Code'}: ______________________</span>
            <span>${isZh ? '所屬通訊處' : 'Branch / Office'}: ______________________</span>
            <span>${isZh ? '填寫日期' : 'Date'}: 202___ / ___ / ___</span>
        </div>

        ${sectionsHtml}


        <!-- Sign-off / Footer -->
        <div style="text-align: center; color: #64748b; font-size: var(--fs-caption); border-top: 2px solid #e2e8f0; padding-top: 16px; margin-top: 20px;">
            <strong>${isZh ? '—— 問卷到此結束。再次感謝您的寶貴時間與協助！ ——' : '—— End of Questionnaire. Thank you once again for your cooperation and assistance! ——'}</strong>
            <div style="margin-top: 6px; font-size: var(--fs-caption); color: #94a3b8;">
                ${escapeHtml(title)} &bull; ${isZh ? '數位化架構問卷' : 'Digital Modular Architecture Questionnaire'}
            </div>
        </div>
    </div>
</body>
</html>`;
        }

        function downloadCurrentQuestionnaire() {
            try {
                const schema = getModalOrActiveSchema();
                if (!schema) {
                    console.error('No schema found to generate questionnaire template.');
                    return;
                }
                const lang = currentLang || 'zh';
                const html = generateQuestionnaireHTML(schema, lang);
                
                const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                const schemaKey = (schema.id || 'Modular').replace(/[^a-zA-Z0-9_-]/g, '_');
                const langSuffix = (lang === 'zh') ? 'ZH' : 'EN';
                link.download = `${schemaKey}_Modular_Questionnaire_Template_${langSuffix}.html`;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 400);

                if (typeof showPlatformNotification === 'function') {
                    showPlatformNotification(
                        (lang === 'zh')
                            ? '✓ 問卷範本已成功下載！'
                            : '✓ Questionnaire Template downloaded successfully!'
                    );
                }
            } catch (err) {
                console.error('[Download Error]', err);
                alert((currentLang === 'zh' ? '下載問卷範本時發生錯誤：' : 'Error downloading questionnaire template: ') + (err.message || err));
            }
        }

        window.openQuestionnaireTemplate = openQuestionnaireTemplate;
        window.downloadCurrentQuestionnaire = downloadCurrentQuestionnaire;
        
        function generateSyntheticDataForSchema(schema, count = 1000) {
            const list = [];
            const metrics = schema.metrics || [];
            const stages = schema.stages || [];
            const isZh = (currentLang === 'zh');
            
            // Extract options from demographics
            const demoMap = {};
            (schema.demographics || []).forEach(d => {
                const k = d.key ? d.key.replace(/^Demo_\d+_/, '') : (d.label || 'demo');
                const rawOpts = isZh ? (d.optionsZh || d.options) : d.options;
                const opts = Array.isArray(rawOpts) ? rawOpts : (rawOpts ? String(rawOpts).split(/[,，;\n\r]+/).map(x=>x.trim()).filter(Boolean) : []);
                if (opts.length > 0) demoMap[k] = opts;
            });

            const ageBands = demoMap['Age'] || ['22-35 yrs', '36-45 yrs', '46-55 yrs', '56-65 yrs', '66 or above'];
            const regions = demoMap['Service_Location'] || demoMap['region'] || ['Northern Region', 'Central Region', 'Southern Region', 'Eastern Region', 'Taipei Metropolitan'];
            const positions = demoMap['Position'] || demoMap['role'] || [schema.targetAudience || 'Participant', 'Senior Specialist', 'Team Leader', 'Principal'];
            const expBands = demoMap['Experience'] || demoMap['tenure'] || ['Under 1 year', '1-3 years', '3-5 years', '5-10 years', '10-20 years', '20+ years'];
            const clientsBands = demoMap['Clients'] || demoMap['cohort'] || ['Under 30', '31-50', '51-100', '101-200', '200+'];
            
            const rawWorkItems = isZh ? (schema.dailyWorkItemsZh || schema.dailyWorkItems) : schema.dailyWorkItems;
            const workItems = Array.isArray(rawWorkItems) && rawWorkItems.length > 0 ? rawWorkItems : [
                "Scheduling & visiting clients", "Prospect list development", "Signing policies", 
                "Post-sales customer service", "Knowledge training & courses", "Internal admin"
            ];
            
            const rawTools = isZh ? (schema.personalToolsZh || schema.personalTools) : schema.personalTools;
            const toolsList = Array.isArray(rawTools) && rawTools.length > 0 ? rawTools : [
                "LINE", "Mobile Notes", "Phone Call", "Paper Calendar", "Google Sheets", "Canva"
            ];

            const rawNeeds = isZh ? (schema.coreNeedsZh || schema.coreNeeds) : schema.coreNeeds;
            const needsList = Array.isArray(rawNeeds) && rawNeeds.length > 0 ? rawNeeds : [
                "Simplified intuitive interface", "Fast biometric login", "Offline caching", 
                "Unified portal integration", "Automated customer tagging"
            ];

            const archetypes = ['c0', 'c1', 'c2', 'c3', 'c4'];

            for (let i = 1; i <= count; i++) {
                const arch = archetypes[i % archetypes.length];
                const age = ageBands[i % ageBands.length];
                const reg = regions[i % regions.length];
                const pos = positions[i % positions.length];
                const exp = expBands[i % expBands.length];
                const cli = clientsBands[i % clientsBands.length];

                // Randomly select 2-3 tools and needs
                const pickedTools = [toolsList[i % toolsList.length], toolsList[(i + 2) % toolsList.length]].filter(Boolean).join('; ');
                const pickedNeeds = [needsList[i % needsList.length], needsList[(i + 1) % needsList.length]].filter(Boolean).join('; ');

                // Randomly generate work breakdown
                const sampleWorkText = workItems.slice(0, 3).map((w, wIdx) => `${w}:${wIdx === 0 ? 50 : 25}`).join(';');

                const item = {
                    name: `RESP_${String(i).padStart(5, '0')}`,
                    raw: { qm: [], bf: [] },
                    archetype: arch,
                    Age: age,
                    Service_Location: reg,
                    Position: pos,
                    Experience: exp,
                    Clients: cli,
                    Role_Badges: `${pos};Active;Engaged`,
                    Conflict: isZh ? '尖峰工作期間理想目標與系統現實存在落差。' : 'Goal vs operational reality friction occurred during peak workload periods.',
                    Needs: pickedNeeds,
                    PersonalTools: pickedTools,
                    Tasks_Text: sampleWorkText,
                    Quote: isZh ? '我重視直覺流暢的數位流程，並能在關鍵時刻獲得即時支援。' : 'I prefer intuitive digital workflows with immediate human assistance when needed.',
                    wp: +(1.0 + Math.random() * 3.5).toFixed(1),
                    ar: +(1.0 + Math.random() * 3.0).toFixed(1),
                    pr: +(1.0 + Math.random() * 3.5).toFixed(1)
                };

                // Populate metrics
                metrics.forEach((m, mIdx) => {
                    const baseVal = 40 + Math.random() * 50;
                    const val = Math.round(baseVal);
                    item[m.key] = val;
                    item[`Skill_Dim_${mIdx + 1}`] = val;
                });

                // Populate fallback skills for persona dashboard radar/progress bars
                item.Skill_Device = metrics[0] ? item[metrics[0].key] : Math.round(50 + Math.random() * 40);
                item.Skill_Knowledge = metrics[1] ? item[metrics[1].key] : Math.round(50 + Math.random() * 40);
                item.Skill_Sales_Pitch = metrics[2] ? item[metrics[2].key] : Math.round(45 + Math.random() * 40);
                item.Skill_Customer_Relations = metrics[3] ? item[metrics[3].key] : Math.round(55 + Math.random() * 40);
                item.Skill_Digital_Tools = metrics[4] ? item[metrics[4].key] : Math.round(40 + Math.random() * 50);

                // Populate stages
                stages.forEach((st, sIdx) => {
                    const step = sIdx + 1;
                    const sTitle = isZh ? (st.titleZh || st.title) : st.title;
                    const acts = st.actions || [];
                    const actName = acts[0] ? (typeof acts[0] === 'string' ? acts[0] : (isZh ? (acts[0].nameZh || acts[0].name) : acts[0].name)) : sTitle;
                    
                    item[`Journey_${step}_Title`] = sTitle;
                    item[`Journey_${step}_Locations`] = (i % 2 === 0) ? 'Office' : 'Client Site / Mobile';
                    item[`Journey_${step}_Tools`] = actName || 'Self-Service Portal';
                    item[`Journey_${step}_Pains`] = `Latency or validation bottleneck in ${sTitle}`;
                    item[`Journey_${step}_Rating`] = +(2.5 + Math.random() * 2.3).toFixed(1);
                });

                list.push(item);
            }
            return list;
        }

        function applySchemaToPlatform(schema) {
            if (!schema || !schema.id) return;
            console.log('[Platform Sync] Applying updated schema to platform:', schema.id, schema.name);
            
            // 1. Update JOURNEY_SCHEMAS dictionary and active references
            window.__activeCustomSchema = schema;
            if (typeof JOURNEY_SCHEMAS !== 'undefined') {
                JOURNEY_SCHEMAS[schema.id] = schema;
            }
            currentJourneyDomain = schema.id;
            window.__customSchemaApplied = true;
            window.userUploadedCustomFile = false; // Re-generate domain dataset from the updated schema

            // 2. Persist to localStorage
            try {
                const stored = JSON.parse(localStorage.getItem('portal_custom_schemas') || '{}');
                stored[schema.id] = schema;
                localStorage.setItem('portal_custom_schemas', JSON.stringify(stored));
                localStorage.setItem('active_journey_schema', JSON.stringify(schema));
                localStorage.setItem(`custom_journey_schema_${schema.id}`, JSON.stringify(schema));
            } catch(e) {
                console.warn('Error saving schema to localStorage:', e);
            }

            // 3. Update Cluster Features
            updateClusterFeatures();

            // 4. Update titles and domain select
            const isZh = (currentLang === 'zh');
            const titleEl = document.querySelector('[data-i18n="portalTitle"]');
            if (titleEl) {
                if (schema.id === 'agent') {
                    titleEl.textContent = isZh ? t('portalTitle') : "Agent Persona & Sales Journey Analytics Platform";
                } else {
                    const sName = isZh ? (schema.nameZh || schema.name) : (schema.name || schema.nameZh || 'Sales Journey');
                    titleEl.textContent = `${sName} ${isZh ? '分析平台 (V.2)' : 'Analytics Platform (V.2)'}`;
                }
            }

            updateDomainSelectOptions();

            // 5. Generate comprehensive synthetic data reflecting the new schema, or keep Questionnaire_Synthetic_Responses.csv for default agent
            const isDefaultAgent = (schema.id === 'agent' && (!localStorage.getItem('custom_journey_schema_agent')));
            if (isDefaultAgent && typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) {
                parsedData = (currentLang === 'zh' && typeof PRE_LOADED_DATA_ZH !== 'undefined') ? PRE_LOADED_DATA_ZH : PRE_LOADED_DATA;
                window.__customSchemaApplied = false;
            } else {
                parsedData = generateSyntheticDataForSchema(schema, 1000);
            }

            // 6. Run unsupervised K-means clustering on the new dataset
            selectedAgent = null;
            activeSubFilter = 'ALL';
            assignDynamicArchetypes(parsedData);
            runClusterDiscovery();

            // 7. Re-render all views and tabs
            renderArchetypeTabs();
            renderSubFilters();
            renderDemographics();

            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            } else if (activeSection === 'analytics') {
                renderAnalyticsView();
            }

            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }

            // 8. Surface platform notification toast & close modal
            closeSchemaBuilderModal();
            showPlatformNotification(
                isZh 
                    ? `已成功套用問卷架構「${schema.nameZh || schema.name}」！指標量測、歷程地圖與分群分析已即時更新。`
                    : `Applied schema "${schema.name || schema.nameZh}"! Measurements, journey maps, and cluster analysis have been dynamically updated.`
            );
        }

        function dismissPlatformNotification() {
            const toast = document.getElementById('platform-sync-toast');
            if (toast) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                toast.style.pointerEvents = 'none';
            }
            clearTimeout(window.__toastTimeout);
        }

        function handleToastReviewClick(event) {
            if (event) {
                if (typeof event.stopPropagation === 'function') event.stopPropagation();
                if (typeof event.preventDefault === 'function') event.preventDefault();
            }
            dismissPlatformNotification();
            if (typeof openCsvMappingModalDirect === 'function') {
                openCsvMappingModalDirect();
            }
        }
        window.handleToastReviewClick = handleToastReviewClick;

        function showPlatformNotification(msg, showReviewBtn = false) {
            let toast = document.getElementById('platform-sync-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'platform-sync-toast';
                document.body.appendChild(toast);
            }
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            toast.style.cssText = `position: fixed; bottom: 24px; right: 24px; background: rgba(15, 23, 42, 0.98); color: ${showReviewBtn ? '#f5c518' : '#10b981'}; border: 1.5px solid ${showReviewBtn ? 'rgba(245, 197, 24, 0.6)' : 'rgba(16, 185, 129, 0.6)'}; border-radius: 10px; padding: 14px 20px; font-size: var(--fs-subtitle); font-weight: 600; box-shadow: 0 12px 36px rgba(0,0,0,0.7); z-index: 10005; transition: opacity 0.3s, transform 0.3s; opacity: 0; transform: translateY(10px); pointer-events: auto; cursor: ${showReviewBtn ? 'pointer' : 'default'}; max-width: 540px; line-height: 1.45;`;
            
            toast.onclick = function(e) {
                if (showReviewBtn) {
                    handleToastReviewClick(e);
                }
            };

            toast.title = showReviewBtn ? (isZh ? '點擊檢視與調整 CSV 欄位對應' : 'Click to review and adjust CSV column mapping') : '';
            const actionText = isZh ? '檢視 ➔' : 'Review ➔';
            
            const btnHtml = showReviewBtn 
                ? `<button type="button" id="toast-review-btn" onclick="handleToastReviewClick(event)" style="background: #f59e0b; color: #0f172a; font-weight: 700; border-radius: 6px; padding: 7px 16px; font-size: var(--fs-body); border: none; cursor: pointer; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 10px rgba(245, 158, 11, 0.4); transition: transform 0.15s, background 0.15s;" onmouseover="this.style.background='#fbbf24'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#f59e0b'; this.style.transform='scale(1)'">${actionText}</button>`
                : '';

            toast.innerHTML = `<div style="display:flex; align-items:center; justify-content:space-between; gap:14px;"><span style="flex:1;">${escapeHtml(msg)}</span>${btnHtml}</div>`;
            toast.style.pointerEvents = 'auto';
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
            
            clearTimeout(window.__toastTimeout);
            window.__toastTimeout = setTimeout(() => {
                dismissPlatformNotification();
            }, showReviewBtn ? 8500 : 5000);
        }

        // Cross-window and iframe synchronization listeners
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'SCHEMA_UPDATED' && event.data.schema) {
                applySchemaToPlatform(event.data.schema);
                closeSchemaBuilderModal();
            } else if (event.data && event.data.type === 'SCHEMA_SAVED' && event.data.schema) {
                const s = event.data.schema;
                if (typeof JOURNEY_SCHEMAS !== 'undefined') {
                    JOURNEY_SCHEMAS[s.id] = s;
                }
            } else if (
                (event.data && (event.data.type === 'CLOSE_SCHEMA_MODAL' || event.data.type === 'CANCEL_SCHEMA_MODAL')) ||
                event.data === 'closeSchemaBuilderModal' ||
                event.data === 'CLOSE_SCHEMA_MODAL'
            ) {
                closeSchemaBuilderModal();
            }
        });

        window.addEventListener('storage', function(event) {
            if (event.key === 'active_journey_schema') {
                const modal = document.getElementById('schema-builder-modal');
                if (modal && modal.classList.contains('active')) {
                    return; // Do not interrupt or close modal while user is actively editing
                }
                try {
                    const schema = JSON.parse(localStorage.getItem('active_journey_schema'));
                    if (schema && schema.id) {
                        applySchemaToPlatform(schema);
                    }
                } catch(e) {}
            }
        });

        function loadCustomSchemasFromStorage() {
            try {
                // Clean stale single domain custom schema or active schema if polluted with 7 metrics or old name
                try {
                    const activeSt = localStorage.getItem('active_journey_schema');
                    if (activeSt) {
                        const parsedAct = JSON.parse(activeSt);
                        if (parsedAct && parsedAct.id === 'agent' && (parsedAct.name?.includes("ABC Insurance Agents") || (parsedAct.metrics && parsedAct.metrics.length > 5))) {
                            localStorage.removeItem('active_journey_schema');
                        }
                    }
                    const agentSt = localStorage.getItem('custom_journey_schema_agent');
                    if (agentSt) {
                        const parsedAg = JSON.parse(agentSt);
                        if (parsedAg && (parsedAg.name?.includes("ABC Insurance Agents") || (parsedAg.metrics && parsedAg.metrics.length > 5))) {
                            localStorage.removeItem('custom_journey_schema_agent');
                        }
                    }
                } catch(e) {}

                const stored = localStorage.getItem('portal_custom_schemas');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (typeof stripSubQuestions === 'function') stripSubQuestions(parsed);
                    let changed = false;
                    const builtInKeys = ['agent', 'policyholder', 'patient'];
                    
                    Object.keys(parsed).forEach(k => {
                        const s = parsed[k];
                        if (builtInKeys.includes(k)) {
                            // Purge any built-in key that was stored with polluted Chinese in English properties, old name, or outdated modular structure
                            const hasChineseInEnglish = /[\u4e00-\u9fff]/.test(s.name || '') ||
                                (s.stages && s.stages.some(st => /[\u4e00-\u9fff]/.test(st.title || '')));
                            const isOutdatedModular = (k === 'agent' && (!s.questions || s.questions.length !== 27 || s.sectionTitles?.dimensions !== 'Agent Background' || !s.q10Prompt || !s.q20Prompt));
                            const hasSevenMetrics = (k === 'agent' && s.metrics && s.metrics.length > 5);
                            const isOldAgentName = (k === 'agent' && s.name && s.name.includes("ABC Insurance Agents"));
                            if (hasChineseInEnglish || s.name === '保險業務員銷售與數位工作風格' || isOutdatedModular || hasSevenMetrics || isOldAgentName) {
                                delete parsed[k];
                                changed = true;
                                if (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[k]) {
                                    JOURNEY_SCHEMAS[k] = JSON.parse(JSON.stringify(DEFAULT_JOURNEY_SCHEMAS[k]));
                                }
                                return;
                            }
                        }
                        if (s && s.id) {
                            JOURNEY_SCHEMAS[k] = s;
                        }
                    });
                    if (changed) {
                        localStorage.setItem('portal_custom_schemas', JSON.stringify(parsed));
                    }
                }
            } catch(e) {
                console.warn('Failed to load custom schemas from localStorage', e);
            }
            updateDomainSelectOptions();
        }

        function updateDomainSelectOptions() {
            const sel = document.getElementById('domain-select');
            if (!sel) return;
            const isZh = (currentLang === 'zh');
            sel.innerHTML = Object.entries(JOURNEY_SCHEMAS).map(([k, s]) => {
                let name;
                if (isZh) {
                    name = s.nameZh || s.name;
                } else {
                    name = (s.name && !/[\u4e00-\u9fff]/.test(s.name)) 
                        ? s.name 
                        : (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[k] ? DEFAULT_JOURNEY_SCHEMAS[k].name : s.name);
                }
                const icon = s.icon || '🎯';
                return `<option value="${k}" ${k === currentJourneyDomain ? 'selected' : ''} style="background: #1e293b; color: #fff;">${icon} ${name}</option>`;
            }).join('');
        }


        function renderClusterDiscovery() {
            if (!lastClusterResult) return;
            const { clusters } = lastClusterResult;
            document.getElementById('cluster-discovery-results').style.display = 'block';

            const cardsGrid = document.getElementById('cluster-cards-grid');
            cardsGrid.innerHTML = clusters.map((cl, idx) => {
                const profileKey = cl.key || ('c' + cl.id);
                const pInfo = getPersonaDisplayInfo(profileKey);
                const color = pInfo.color || CLUSTER_COLORS[cl.id % CLUSTER_COLORS.length];
                const featTxt = cl.topFeatures.map(f => `${f.label}${(typeof currentLang !== 'undefined' && currentLang === 'zh') ? (f.direction === 'High' ? '偏高' : f.direction === 'Low' ? '偏低' : f.direction) : f.direction}`).join(', ') || ((typeof currentLang !== 'undefined' && currentLang === 'zh') ? '無明顯特徵' : 'No prominent features');
                const displayName = pInfo.name;
                return `
                    <div class="glass-panel" style="padding: 14px; border-radius: 10px; border-left: 3px solid ${color};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <strong style="font-size:var(--fs-body);">${displayName}</strong>
                            <span style="font-size:var(--fs-caption); color: var(--text-muted);">${cntLbl(cl.members.length)}</span>
                        </div>
                        <div style="font-size:var(--fs-small); color: var(--text-secondary);">${currentLang === 'zh' ? '特徵：' : 'Feature Trait: '}${featTxt}</div>
                    </div>
                `;
            }).join('');

            renderClusterRadar(clusters);
            renderClusterHeatmap(clusters);
            setClusterView(window.__clusterView || 'radar');
        }

        let clusterRadarChartInstance = null;
        function setClusterView(v) {
            window.__clusterView = v;
            const radar = document.getElementById('clusterRadarPane'), table = document.getElementById('clusterHeatmap');
            if (radar) radar.style.display = v === 'radar' ? 'block' : 'none';
            if (table) table.style.display = v === 'table' ? 'block' : 'none';
            [['radar', 'cluster-view-radar'], ['table', 'cluster-view-table']].forEach(([k, id]) => {
                const b = document.getElementById(id); if (!b) return;
                const on = k === v; b.style.background = on ? 'var(--accent-yellow)' : ''; b.style.color = on ? '#1a1d23' : ''; b.style.fontWeight = on ? '700' : '';
            });
            if (v === 'radar' && clusterRadarChartInstance) { clusterRadarChartInstance.resize(); clusterRadarChartInstance.update(); }
        }
        window.setClusterView = setClusterView;

        // Short axis names so 14-17 axes stay readable: "Stage 3: Underwriting & Submission Satisfaction" -> "S3 Underwriting & Submission"; "Workaround Propensity (WP)" -> "WP"
        function clusterShortLabel(label) {
            const paren = /\(([A-Z]{2,4})\)\s*$/.exec(label);
            if (paren) return paren[1];
            let m = /^Stage (\d+)\s*[:：]\s*(.*?)\s*Satisfaction$/i.exec(label) || /^Stage (\d+)\s*[:：]\s*(.*)$/i.exec(label);
            if (m) return 'S' + m[1] + ' ' + m[2];
            m = /^階段\s*(\d+)\s*[:：]\s*(.*?)\s*(滿意度)?$/.exec(label);
            if (m) return 'S' + m[1] + ' ' + m[2];
            m = /^Stage (\d+) Satisfaction$/i.exec(label); if (m) return 'S' + m[1];
            return label;
        }

        function renderClusterRadar(clusters) {
            const canvas = document.getElementById('clusterRadarChart'); if (!canvas) return;
            if (clusterRadarChartInstance) clusterRadarChartInstance.destroy();
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const full = CLUSTER_FEATURES.map(f => f.label);
            const short = full.map(clusterShortLabel);
            const narrow = window.innerWidth < 700;
            const datasets = clusters.map(cl => {
                const info = getPersonaDisplayInfo(cl.key || ('c' + cl.id));
                const color = info.color || CLUSTER_COLORS[cl.id % CLUSTER_COLORS.length] || '#94a3b8';
                return { label: `${info.name} (n=${cl.members.length})`, data: cl.avg, borderColor: color, backgroundColor: color + '05', borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: color };
            });
            clusterRadarChartInstance = new Chart(canvas.getContext('2d'), {
                type: 'radar',
                data: { labels: short.map(l => radarLabelWrap(l, narrow ? 12 : 17)), datasets },
                options: {
                    responsive: true, maintainAspectRatio: false, layout: { padding: narrow ? 4 : 16 },
                    scales: { r: {
                        min: 0, max: 100,
                        angleLines: { color: 'rgba(255,255,255,0.08)' }, grid: { color: 'rgba(255,255,255,0.08)' },
                        pointLabels: { color: '#cbd5e1', font: { size: narrow ? 11 : 14 } },
                        ticks: { backdropColor: 'transparent', color: '#64748b', font: { size: 11 }, stepSize: 25 }
                    } },
                    plugins: {
                        legend: { display: true, position: 'bottom', labels: { color: '#cbd5e1', font: { size: narrow ? 12 : 14 }, boxWidth: 12, padding: 14 } },
                        tooltip: { callbacks: { title: items => full[items[0].dataIndex] } }
                    }
                }
            });
            const abbr = full.map((f, i) => short[i] !== f ? `<strong>${short[i].split(' ')[0]}</strong> = ${f}` : null).filter(Boolean).filter(x => /^<strong>(S\d|[A-Z]{2,4})<\/strong>/.test(x));
            const key = document.getElementById('clusterRadarKey');
            if (key) key.innerHTML = (isZh ? '如何閱讀：每個軸是一項指標（0–100），離中心越遠分數越高；比較各群線條的形狀即可看出差異。' : 'How to read: each axis is one measure (0&ndash;100); the further from the centre, the higher the score. Compare the shapes of the cluster lines to see how they differ.')
                + (abbr.length ? '<br>' + abbr.join(' &nbsp;·&nbsp; ') : '');
        }

        // Cluster x feature heat-map (replaces the 17-axis radar, whose labels overlapped).
        // Each cell = the cluster's average on that feature (0-100). Colour = how far it sits
        // above (blue) or below (amber) the all-respondent average for the same feature.
        function renderClusterHeatmap(clusters) {
            const host = document.getElementById('clusterHeatmap');
            if (!host) return;
            const feats = CLUSTER_FEATURES;
            const total = clusters.reduce((t, c) => t + c.members.length, 0) || 1;
            const overall = feats.map((_, i) => clusters.reduce((t, c) => t + (c.avg[i] || 0) * c.members.length, 0) / total);
            const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;');
            const head = clusters.map(cl => {
                const info = getPersonaDisplayInfo(cl.key || ('c' + cl.id));
                const color = info.color || CLUSTER_COLORS[cl.id % CLUSTER_COLORS.length];
                return `<th style="padding:8px 10px; text-align:center; font-weight:600; font-size:var(--fs-small); border-bottom:3px solid ${color}; white-space:nowrap;">${esc(info.name)}<div style="font-weight:400; color:var(--text-muted); font-size:var(--fs-caption);">n=${cl.members.length}</div></th>`;
            }).join('');
            const cell = (v, ref) => {
                const d = v - ref, a = Math.min(1, Math.abs(d) / 25) * 0.75;
                const bg = d >= 0 ? `rgba(77,150,255,${a.toFixed(2)})` : `rgba(255,159,64,${a.toFixed(2)})`;
                return `<td style="padding:8px 10px; text-align:center; font-size:var(--fs-body); font-variant-numeric:tabular-nums; background:${bg};" title="${d >= 0 ? '+' : ''}${d.toFixed(0)} vs all">${v.toFixed(0)}</td>`;
            };
            const rows = feats.map((f, i) => `<tr><th style="padding:8px 12px 8px 0; text-align:left; font-weight:500; font-size:var(--fs-body); color:var(--text-primary);">${esc(f.label)}</th>`
                + clusters.map(cl => cell(cl.avg[i] || 0, overall[i])).join('')
                + `<td style="padding:8px 10px; text-align:center; font-size:var(--fs-body); color:var(--text-muted); border-left:1px solid rgba(255,255,255,0.1);">${overall[i].toFixed(0)}</td></tr>`).join('');
            host.innerHTML = `
                <div style="font-size:var(--fs-small); color:var(--text-secondary); margin-bottom:10px; line-height:1.6;">
                    How to read: each row is one measure, each column one cluster. The number is the cluster's average score (0&ndash;100).
                    <span style="background:rgba(77,150,255,0.6); padding:1px 8px; border-radius:4px; color:#fff;">Blue</span> = higher than the overall average,
                    <span style="background:rgba(255,159,64,0.6); padding:1px 8px; border-radius:4px; color:#fff;">Amber</span> = lower; the stronger the colour, the bigger the gap.
                </div>
                <div style="overflow-x:auto;"><table style="border-collapse:collapse; width:100%; min-width:560px;">
                    <thead><tr><th style="border-bottom:3px solid transparent;"></th>${head}<th style="padding:8px 10px; text-align:center; font-weight:600; font-size:var(--fs-small); color:var(--text-muted); border-bottom:3px solid rgba(255,255,255,0.2);">All<div style="font-weight:400; font-size:var(--fs-caption);">average</div></th></tr></thead>
                    <tbody>${rows}</tbody>
                </table></div>`;
        }

        function downloadActivePersona() {
            const sectionId = activeSection === 'personas' ? 'view-personas' : 'view-journeys';
            const element = document.getElementById(sectionId);
            if (!element) return;
            
            const doExport = function() {
                const originalButton = document.getElementById('download-btn-header');
                const originalText = originalButton ? originalButton.innerHTML : '';
                if (originalButton) {
                    originalButton.disabled = true;
                    originalButton.innerHTML = `<span style="animation: pulse 1s infinite;">⏳ Exporting PNG......</span>`;
                }
                
                const originalMaxHeight = element.style.maxHeight;
                const originalOverflow = element.style.overflow;
                element.style.maxHeight = 'none';
                element.style.overflow = 'visible';
                
                html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#0d0f11',
                    scale: 2,
                    logging: false,
                    ignoreElements: (el) => {
                        return el.tagName === 'BUTTON' && el.style.position === 'absolute';
                    }
                }).then(canvas => {
                    element.style.maxHeight = originalMaxHeight;
                    element.style.overflow = originalOverflow;
                    
                    if (originalButton) {
                        originalButton.disabled = false;
                        originalButton.innerHTML = originalText;
                    }
                    
                    const link = document.createElement('a');
                    link.download = `${activePersona}_${activeSection}_analytics.png`;
                    link.href = canvas.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).catch(err => {
                    element.style.maxHeight = originalMaxHeight;
                    element.style.overflow = originalOverflow;
                    if (originalButton) {
                        originalButton.disabled = false;
                        originalButton.innerHTML = originalText;
                    }
                    alert('Failed to export PNG image, please try again!');
                    console.error(err);
                });
            };

            if (typeof html2canvas === 'undefined' && typeof window.loadScriptAsync === 'function') {
                const btn = document.getElementById('download-btn-header');
                if (btn) btn.innerHTML = `<span style="animation: pulse 1s infinite;">⏳ Loading module...</span>`;
                window.loadScriptAsync('html2canvas.min.js').then(doExport).catch(err => {
                    console.error('Failed to load html2canvas:', err);
                    if (btn) btn.innerHTML = 'Export PNG';
                    alert('Could not load html2canvas module for image export.');
                });
            } else {
                doExport();
            }
        }

        function renderDemographics() {
            const panelAnalytics = document.getElementById('demographic-panel');
            const panelPersonas = document.getElementById('demographic-panel-personas');
            
            let container = null;
            if (activePersona === 'all') {
                if (panelAnalytics) panelAnalytics.style.display = 'block';
                if (panelPersonas) panelPersonas.style.display = 'none';
                container = panelAnalytics;
            } else {
                if (panelAnalytics) panelAnalytics.style.display = 'none';
                if (panelPersonas) panelPersonas.style.display = 'block';
                container = panelPersonas;
            }
            
            if (!container) return;
            
            const activeGroupAgents = getActiveGroupAgents();
            const total = activeGroupAgents.length;
            
            if (total === 0) {
                container.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:var(--fs-small);">${currentLang === 'zh' ? '此群體沒有人口統計資料' : 'No demographic data for this group'}</div>`;
                return;
            }
            
            const locCounts = {};
            let locTotal = 0;
            const officeCounts = {};
            const positionCounts = {};
            const ageCounts = {};
            let ageTotal = 0;
            const clientCounts = {};
            let clientTotal = 0;
            
            activeGroupAgents.forEach(a => {
                if (a.Service_Location) {
                    let cleanLoc = String(a.Service_Location).trim();
                    if (cleanLoc) { locCounts[cleanLoc] = (locCounts[cleanLoc] || 0) + 1; locTotal++; }
                }
                
                if (a.Branch_Office) {
                    const cleanOffice = String(a.Branch_Office).trim();
                    officeCounts[cleanOffice] = (officeCounts[cleanOffice] || 0) + 1;
                }
                
                if (a.Position) {
                    const cleanPos = String(a.Position).trim();
                    positionCounts[cleanPos] = (positionCounts[cleanPos] || 0) + 1;
                }
                
                if (a.Age) {
                    const cleanAge = String(a.Age).trim();
                    ageCounts[cleanAge] = (ageCounts[cleanAge] || 0) + 1;
                    ageTotal++;
                }
                
                if (a.Clients) {
                    const cleanClients = String(a.Clients).trim();
                    clientCounts[cleanClients] = (clientCounts[cleanClients] || 0) + 1;
                    clientTotal++;
                }
            });
            
            // 1. Service Location HTML
            let locHTML = '';
            for (const [key, count] of Object.entries(locCounts).sort((x, y) => y[1] - x[1])) {
                const pct = locTotal > 0 ? Math.round((count / locTotal) * 100) : 0;
                locHTML += `
                    <div style="margin-bottom:6px;">
                        <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); margin-bottom:2px;">
                            <span style="color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px;" title="${key}">${key}</span>
                            <span style="font-weight:400; color:var(--text-secondary);">${pct}% (${cntLbl(count)})</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                            <div style="background:var(--colour-${activePersona}); width:${pct}%; height:100%; border-radius:2px;"></div>
                        </div>
                    </div>
                `;
            }
            
            // 2. Office HTML
            const sortedOffices = Object.entries(officeCounts).sort((a,b)=>b[1]-a[1]).slice(0, 6);
            let officeHTML = sortedOffices.map(([office, count]) => `
                <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
                    <span style="color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;">🏢 ${office}</span>
                    <span style="font-weight:400; color:var(--text-secondary);">${cntLbl(count)}</span>
                </div>
            `).join('');
            if (!officeHTML) officeHTML = `<div style="font-size:var(--fs-caption); color:var(--text-muted); text-align:center; padding-top:10px;">${currentLang === 'zh' ? '無資料' : 'No Data'}</div>`;
            
            // 3. Position HTML
            const sortedPositions = Object.entries(positionCounts).sort((a,b)=>b[1]-a[1]);
            let positionHTML = sortedPositions.map(([pos, count]) => `
                <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
                    <span style="color:var(--text-secondary);">👤 ${pos}</span>
                    <span style="font-weight:400; color:var(--text-secondary);">${cntLbl(count)}</span>
                </div>
            `).join('');
            if (!positionHTML) positionHTML = `<div style="font-size:var(--fs-caption); color:var(--text-muted); text-align:center; padding-top:10px;">${currentLang === 'zh' ? '無資料' : 'No Data'}</div>`;
            
            // 4. Age HTML
            const sortedAges = Object.entries(ageCounts).sort((a,b)=>b[1]-a[1]);
            let ageHTML = sortedAges.map(([age, count]) => {
                const pct = ageTotal > 0 ? Math.round((count / ageTotal) * 100) : 0;
                return `
                    <div style="margin-bottom:6px;">
                        <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); margin-bottom:2px;">
                            <span style="color:var(--text-secondary);">${age}</span>
                            <span style="font-weight:400; color:var(--text-secondary);">${pct}% (${cntLbl(count)})</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                            <div style="background:var(--colour-${activePersona}); width:${pct}%; height:100%; border-radius:2px;"></div>
                        </div>
                    </div>
                `;
            }).join('');
            if (!ageHTML) ageHTML = `<div style="font-size:var(--fs-caption); color:var(--text-muted); text-align:center; padding-top:10px;">${currentLang === 'zh' ? '無資料' : 'No Data'}</div>`;

            // 5. Clients HTML
            const sortedClients = Object.entries(clientCounts).sort((a,b)=>b[1]-a[1]);
            let clientHTML = sortedClients.map(([client, count]) => {
                const pct = clientTotal > 0 ? Math.round((count / clientTotal) * 100) : 0;
                return `
                    <div style="margin-bottom:6px;">
                        <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); margin-bottom:2px;">
                            <span style="color:var(--text-secondary);">${client}</span>
                            <span style="font-weight:400; color:var(--text-secondary);">${pct}% (${cntLbl(count)})</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                            <div style="background:var(--colour-${activePersona}); width:${pct}%; height:100%; border-radius:2px;"></div>
                        </div>
                    </div>
                `;
            }).join('');
            if (!clientHTML) clientHTML = `<div style="font-size:var(--fs-caption); color:var(--text-muted); text-align:center; padding-top:10px;">${currentLang === 'zh' ? '無資料' : 'No Data'}</div>`;
            
            const isPersonaView = (container.id === 'demographic-panel-personas');
            
            let headerHTML = '';
            if (isPersonaView) {
                headerHTML = `
                    <div onclick="toggleDemographicsCollapse()" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
                        <h3 style="margin:0; font-size:var(--fs-body); font-weight:600; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--colour-${activePersona});"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            ${t('demographicProfile')}
                        </h3>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('sampleSize', {n: total})}</span>
                            <span id="demographics-toggle-icon" style="font-size:var(--fs-caption); font-weight:bold; color:var(--colour-${activePersona}); padding:2px 8px; background:rgba(255,255,255,0.04); border-radius:4px; transition: all 0.2s;">${demographicsCollapsed ? t('expand') : t('collapse')}</span>
                        </div>
                    </div>
                `;
            } else {
                headerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px;">
                        <h3 style="margin:0; font-size:var(--fs-body); font-weight:600; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--colour-${activePersona});"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            ${t('demographicProfile')}
                        </h3>
                        <span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('sampleSize', {n: total})}</span>
                    </div>
                `;
            }

            container.innerHTML = `
                ${headerHTML}
                <div id="demographics-collapse-content" style="display: ${(isPersonaView && demographicsCollapsed) ? 'none' : 'grid'}; grid-template-columns: repeat(4, 1fr); gap:12px; width:100%; margin-top: ${isPersonaView ? '12px' : '0'}; border-top: ${isPersonaView ? '1px solid rgba(255,255,255,0.08)' : 'none'}; padding-top: ${isPersonaView ? '12px' : '0'};">
                    <!-- 1. Location -->
                    <div style="padding:8px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03);">
                        <h4 style="margin:0 0 8px 0; font-size:var(--fs-caption); color:var(--text-primary); font-weight:500;">${t('primaryLocation')}</h4>
                        <div>${locHTML}</div>
                    </div>
                    
                    <!-- 2. Position -->
                    <div style="padding:8px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03);">
                        <h4 style="margin:0 0 8px 0; font-size:var(--fs-caption); color:var(--text-primary); font-weight:500;">${t('respondentPosition')}</h4>
                        <div style="display:flex; flex-direction:column; gap:4px;">${positionHTML}</div>
                    </div>
                    
                    <!-- 3. Age Distribution -->
                    <div style="padding:8px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03);">
                        <h4 style="margin:0 0 8px 0; font-size:var(--fs-caption); color:var(--text-primary); font-weight:500;">${t('ageDist')}</h4>
                        <div>${ageHTML}</div>
                    </div>
                    
                    <!-- 4. Client Scale -->
                    <div style="padding:8px; border-radius:6px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03);">
                        <h4 style="margin:0 0 8px 0; font-size:var(--fs-caption); color:var(--text-primary); font-weight:500;">${t('clientScale')}</h4>
                        <div>${clientHTML}</div>
                    </div>
                </div>
            `;
        }

        // Generate 70 Default Mock records on startup to pre-populate charts
        function loadDefaultMockData() {
            const mockList = [];
            const getRand = (min, max) => Math.random() * (max - min) + min;
            
            function getRandomSubarray(arr, size) {
                let shuffled = arr.slice(0), i = arr.length, temp, index;
                while (i--) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(0, size);
            }

            const textPools = {
                explorer: {
                    namePrefix: "Alex Chen",
                    count: 20,
                    qmRange: [1, 2],
                    bfRange: [4, 5],
                    barriers: [
                        "Wants to close deals faster, but the policy-term lookup interface isn't intuitive, so he often has to call internal staff to confirm details.",
                        "Wants to quickly filter a high-intent list, but the system is slow to query and often requires jumping through several pages to get the full picture.",
                        "Wants to speed up submission, but the e-signature occasionally gets stuck, stretching out the client's wait time and hurting the experience."
                    ],
                    needs: ["Fast login", "Fuzzy keyword search", "Common occupation presets", "Auto-play videos", "Mobile app experience"],
                    pains: ["Web disconnects often", "Admin tasks take too long to find", "Video playback gets stuck", "Login verification code is slow", "No intuitive search"],
                    tools: ["TimeTree", "Notion", "LINE", "Phone notes", "Weekly meeting sharing", "Senior colleagues"],
                    quotes: [
                        "When I first started, what I needed most was someone telling me what to do next.",
                        "I'm still practicing my pitch, but at the very least I wish the system didn't slow down my scheduling.",
                        "The client is waiting -- I don't want the system to be what slows me down.",
                        "Figuring out the most efficient way to organise a client list is what I most want to understand right now."
                    ],
                    tasks: "Client visits:40;Building expertise:25;Maintaining prospect list:20;New-agent socials:10;Internal admin:5",
                    age: "22-38 yrs",
                    exp: "1-3 yrs",
                    clients: "Under 30",
                    badges: "New Agent,Well-Trained,Idealistic,Proactive Builder,Curious,Insurance Newcomer",
                    desc: '',
                    journey: [
                        { title: "Finding Leads", actions: ["Goes through phone contacts", "Sorts friends in the notes app", "Picks out an interested-sounding list"], context: ["Phone notes", "LINE chat", "Contacts"], pains: ["List data is messy", "Slow to find info"], rating: 3 },
                        { title: "Contacting Clients", actions: ["Makes a LINE voice call", "Sends a friendly card", "Sets up a weekend meeting"], context: ["LINE call", "Personal calendar app", "Friend group"], pains: ["Read but no reply", "Scheduling conflicts"], rating: 4 },
                        { title: "Needs Analysis", actions: ["Shows a product brochure", "Circles key points in red pen on paper", "Explains the policy verbally"], context: ["Product brochure", "Paper flyer", "Coffee shop"], pains: ["Hard to calculate rates", "Carrying too much paper"], rating: 3 },
                        { title: "Signing & Submission", actions: ["Guides the client through the paper application", "Client hand-signs it", "Personally delivers it to the counter"], context: ["Paper application", "Personal stamp", "Branch counter"], pains: ["Signature gets rejected", "In-person delivery is a hassle"], rating: 2 },
                        { title: "After-Sales Service", actions: ["Attends the morning meeting to hear management's analysis", "Studies handouts on product changes", "Shares notes with fellow new agents"], context: ["Training room", "Paper handouts", "Management meeting"], pains: ["Long commute", "Things update fast"], rating: 4 }
                    ]
                },
                expert: {
                    namePrefix: "Grace Lin",
                    count: 15,
                    qmRange: [2, 3],
                    barriers: [
                        "Wants to keep client data updated on the go, but the mobile version is incomplete, so she still has to go back to the office computer to get things done.",
                        "Wants a full picture of a client's policies before a visit, but the data is scattered across different systems, requiring manual compiling to see the whole picture."
                    ],
                    needs: ["Simplified interface", "Single system entry point", "Assistant delegate account", "Convenient paper printing", "Large-print system"],
                    pains: ["Operating a tablet takes a long time", "SMS verification often doesn't arrive", "Getting locked out and calling support is exhausting", "Looks clumsy operating it in front of a client"],
                    tools: ["Loose-leaf client folder", "Large-print desk calendar", "Personal phone book", "Assistant-entered data", "In-person counter service", "Physical policies"],
                    quotes: [
                        "What I want isn't more features -- it's less repetitive work.",
                        "Experience builds up over time, but time lost to re-entering the same data is just wasted."
                    ],
                    tasks: "Maintaining existing clients:35;New policy visits:30;Post-sale servicing:15;Building expertise:10;Admin work:10",
                    age: "45-60 yrs",
                    exp: "5-10 yrs",
                    clients: "300+",
                    badges: "Senior High-Performer,Trust First,Relationship Maintenance,Locally Rooted,Paper-Based,Seasoned Star",
                    desc: '',
                    journey: [
                        { title: "Maintaining Long-Time Clients", actions: ["Flips open her loose-leaf card book", "Hand-writes greeting cards", "Calls to visit on the landline"], context: ["Loose-leaf card book", "Home landline", "Physical cards"], pains: ["List is bulky", "No one answers the phone"], rating: 4 },
                        { title: "Scheduling a Meeting", actions: ["Notes the time on a paper desk calendar", "Calls to confirm a time", "Arranges to meet at the client's home"], context: ["Paper desk calendar", "Handwritten notes", "Personal phone book"], pains: ["No real-time sync", "Forgets the notebook"], rating: 4 },
                        { title: "Explaining the Plan", actions: ["Opens a large-print product brochure", "Calculates on paper with a red pen", "Explains coverage verbally"], context: ["Large-print brochure", "Red ballpoint pen", "Paper presentation"], pains: ["Rate sheets change often", "Wasteful paper reprints"], rating: 3 },
                        { title: "Underwriting & Submission", actions: ["Checks the paper signature", "Personally delivers it to the branch counter", "Confirms the intake stamp"], context: ["Paper application", "Branch counter", "Intake stamp"], pains: ["A wrong stroke means rewriting the whole form", "Waiting in line at the counter"], rating: 2 },
                        { title: "Follow-Up Visit", actions: ["Hand-delivers the paper policy", "Reads through the terms with the client", "Files the signed receipt"], context: ["Physical policy", "Personal phone book", "Home landline"], pains: ["Long travel time", "Slow to confirm the receipt"], rating: 4 }
                    ]
                },
                optimizer: {
                    namePrefix: "Kevin Chen",
                    count: 15,
                    qmRange: [4, 5],
                    bfRange: [1, 2],
                    barriers: [
                        "Wants to consolidate daily visit records, but the current tools don't talk to each other, so data has to be entered repeatedly.",
                        "Wants proactive reminders for policy anniversaries and renewals, but the system has no automated reminders, so he has to track it manually himself."
                    ],
                    needs: ["Open API integration", "Automated tagging/classification", "Offline cache support", "Custom homepage shortcuts"],
                    pains: ["Manually copying schedule between two calendars", "Loses the whole entry if disconnected", "Multiple logins switching between AP systems", "Verification code delay"],
                    tools: ["Notion CRM", "Calendly", "Google Calendar", "iPad Pro", "FaceID", "LINE API", "custom automation"],
                    quotes: [
                        "I wish the tool understood what I'm doing, instead of making me re-enter everything every time.",
                        "If the system could pre-filter my list for me, I could spend my time on actual clients."
                    ],
                    tasks: "Visits & marketing:35;List filtering:20;Building expertise:15;Post-sale servicing:15;System optimisation:15",
                    age: "28-42 yrs",
                    exp: "10-15 yrs",
                    clients: "80-150",
                    badges: "Tech Enthusiast,Efficiency First,Paperless Advocate,Automation First,Digital Pioneer",
                    desc: '',
                    journey: [
                        { title: "Building the Lead List", actions: ["Records leads in Notion CRM", "Auto-tags client attributes", "Filters the list via API"], context: ["Notion CRM", "iPad Pro", "custom automation"], pains: ["Too many official restrictions", "No API integration"], rating: 4 },
                        { title: "Scheduling", actions: ["Sends a Calendly booking link", "Auto-syncs to Google Calendar", "Confirms the two-way schedule"], context: ["Calendly", "Google Calendar", "personal calendar"], pains: ["Manually copying between two calendars", "Overly complex security verification"], rating: 3 },
                        { title: "Online Pitch", actions: ["Projects a live calculator chart on a tablet", "Runs scenario simulations on-screen", "Sends an e-catalogue"], context: ["iPad Pro", "FaceID", "e-presentation"], pains: ["Slow page load", "Unstable network"], rating: 4 },
                        { title: "Remote Signing", actions: ["Sends the e-application", "Client signs on an iPad", "Verifies instantly via the cloud"], context: ["e-application", "FaceID", "cloud storage"], pains: ["Password changes often", "Verification code delay"], rating: 5 },
                        { title: "Cloud-Based Servicing", actions: ["Replies to status updates via LINE API", "Automated notification reminders", "Downloads PDF policy details"], context: ["LINE API", "e-statements", "PDF"], pains: ["Can't export directly to Excel", "Too many restrictions"], rating: 4 }
                    ]
                },
                skeptic: {
                    namePrefix: "Robert Wang",
                    count: 10,
                    qmRange: [1, 2],
                    barriers: [
                        "Wants a full picture of a client's policies before a visit, but the data is scattered across different systems, requiring manual compiling to see the whole picture.",
                        "Wants to keep client data updated on the go, but the mobile version is incomplete, so he still has to go back to the office computer to get things done."
                    ],
                    needs: ["Physical paper brochures", "Keeping a counter service window", "A direct channel for verbal complaints", "Traditional hand-written signing"],
                    pains: ["Worried client financial data will leak from the cloud", "Digital signatures get rejected for mismatched strokes", "Forgetting the password locks the account, needs support to reset", "No physical flyer to show clients"],
                    tools: ["Paper card book", "Physical card box", "Home phone", "Personal stamp", "In-person branch counter", "Handwritten notebook"],
                    quotes: [
                        "What I want isn't more features -- it's less repetitive work.",
                        "Experience builds up over time, but time lost to re-entering the same data is just wasted."
                    ],
                    tasks: "Client visits:30;Building expertise:25;Maintaining prospect list:20;Post-sale servicing:15;Admin work:10",
                    age: "50-65 yrs",
                    exp: "20-25 yrs",
                    clients: "150+",
                    badges: "Change-Resistant,Traditional Methods,Highly Cautious,Paper-Based Signing,Compliance First",
                    desc: '',
                    journey: [
                        { title: "Keeping the List Private", actions: ["Hand-writes entries in a notebook", "Puts it back in the branch drawer", "Cross-checks the paper list"], context: ["Handwritten notebook", "Paper card book", "Safe"], pains: ["Risk of losing the card book", "Handwriting is physically tiring"], rating: 4 },
                        { title: "Arranging a Call", actions: ["Calls to arrange a meeting", "Notes the time in his notebook", "Prepares a product flyer"], context: ["Home landline", "Paper notebook", "Product flyer"], pains: ["Can't find the notebook", "No SMS notification"], rating: 4 },
                        { title: "Explaining In Person", actions: ["Reads the policy terms word-for-word to the client", "Calculates with a pencil on paper", "Provides a physical brochure"], context: ["Physical rate handbook", "Product brochure", "Client's living room"], pains: ["Rate sheet gets revised and reprinted", "No projection equipment"], rating: 3 },
                        { title: "Submitting at the Counter", actions: ["Confirms the paper signature and seal", "Personally delivers it to the branch counter", "Waits for the intake stamp"], context: ["Paper application", "Personal stamp", "Branch counter"], pains: ["Mismatched signature causes repeated rejection", "Redoing a rejected form is a hassle"], rating: 1 },
                        { title: "Delivering the Policy", actions: ["Personally delivers the policy contract", "Reviews it page by page with the client", "Files the signed receipt"], context: ["Physical policy", "Personal phone book", "Home landline"], pains: ["Lots of travel time", "Slow to confirm the receipt"], rating: 4 }
                    ]
                },
                parttimer: {
                    namePrefix: "Lisa Li",
                    count: 10,
                    qmRange: [3, 4],
                    barriers: [
                        "Wants to consolidate daily visit records, but the current tools don't talk to each other, so data has to be entered repeatedly.",
                        "Wants to speed up submission, but the e-signature occasionally gets stuck, stretching out the client's wait time and hurting the experience."
                    ],
                    needs: ["Native mobile app support", "FaceID/fingerprint quick login", "Extend signature validity to 24h", "One-click auto quote generation"],
                    pains: ["Day job and insurance schedule conflict", "System too slow during short lunch breaks", "Video can't play in the background", "Lacks a self-service help library"],
                    tools: ["Phone notes", "LINE chat tags", "Phone calendar", "Cloud storage", "Bluetooth earbuds", "Tablet"],
                    quotes: [
                        "If I can cut out a few systems, I can see one more client.",
                        "I wish the tool understood what I'm doing, instead of making me re-enter everything every time."
                    ],
                    tasks: "Client visits:40;Building expertise:20;Admin work:20;Maintaining prospect list:10;Post-sale servicing:10",
                    age: "24-35 yrs",
                    exp: "30+ yrs",
                    clients: "Under 20",
                    badges: "Slash Career,Mobile Office,Time-Compressed,Flexible Hours,Juggling Two Jobs",
                    desc: '',
                    journey: [
                        { title: "Fragmented Client Notes", actions: ["Jots notes on the phone on the subway", "Tags things in LINE chat", "Temporarily saves to cloud storage"], context: ["Phone notes", "LINE chat", "Subway commute"], pains: ["Frequent forced logout", "Mobile page breaks layout"], rating: 3 },
                        { title: "Lunch-Break Scheduling", actions: ["Sends a booking time link", "Confirms it avoids a day-job meeting", "One-click auto-reply"], context: ["Personal calendar app", "Phone contacts", "Office break room"], pains: ["Not enough time", "Forgets to reply"], rating: 4 },
                        { title: "Quick Quoting", actions: ["Uses a simplified mobile calculator", "Sends a quote image via LINE", "Explains the rate verbally"], context: ["Mobile calculator", "Cloud storage", "Bluetooth earbuds"], pains: ["Screen too small to tap accurately", "Slow page load"], rating: 3 },
                        { title: "Nighttime Signing", actions: ["Sends a 24-hour e-signature link", "Client signs late at night", "Completes the Online submission"], context: ["LINE remote signing", "Mobile application app", "Any after-work location"], pains: ["Signature link expires", "Client forgets to open it"], rating: 4 },
                        { title: "Fragmented Learning", actions: ["Plays compliance videos in the background", "Listens to management's course while commuting", "Takes the Online compliance quiz"], context: ["e-Academy app", "Bluetooth earbuds", "Subway commute"], pains: ["Progress resets after switching apps", "Video forced to pause"], rating: 3 }
                    ]
                }
            };

            for (const arch in textPools) {
                const pool = textPools[arch];
                for (let i = 1; i <= pool.count; i++) {
                    let qm, bf;
                    if (arch === 'explorer' || arch === 'optimizer') {
                        qm = Array.from({length: 10}, () => Math.round(getRand(pool.qmRange[0], pool.qmRange[1])));
                        bf = Array.from({length: 10}, () => Math.round(getRand(pool.bfRange[0], pool.bfRange[1])));
                    } else if (arch === 'expert') {
                        qm = Array.from({length: 10}, () => Math.round(getRand(pool.qmRange[0], pool.qmRange[1])));
                        bf = Array.from({length: 10}, (v, idx) => {
                            const j = idx + 1;
                            if (j===1 || j===3 || j===5 || j===8 || j===9) return Math.round(getRand(4, 5));
                            if (j===4 || j===7) return Math.round(getRand(1, 2));
                            return Math.round(getRand(2, 3));
                        });
                    } else if (arch === 'skeptic') {
                        qm = Array.from({length: 10}, () => Math.round(getRand(pool.qmRange[0], pool.qmRange[1])));
                        bf = Array.from({length: 10}, (v, idx) => {
                            const j = idx + 1;
                            if (j===1 || j===3 || j===5 || j===8 || j===9) return 5;
                            if (j===4 || j===7) return 1;
                            return Math.round(getRand(1, 2));
                        });
                    } else if (arch === 'parttimer') {
                        qm = Array.from({length: 10}, () => Math.round(getRand(pool.qmRange[0], pool.qmRange[1])));
                        bf = Array.from({length: 10}, (v, idx) => {
                            const j = idx + 1;
                            if (j===1 || j===3 || j===5 || j===8 || j===9) return 3;
                            if (j===4 || j===7) return Math.round(getRand(2, 3));
                            return Math.round(getRand(4, 5));
                        });
                    }

                    const sup = qm.reduce((a,b)=>a+b, 0) / 10;
                    const wp = (bf[0] + bf[2] + bf[4] + bf[7] + bf[8]) / 5;
                    const pr = (bf[3] + bf[6]) / 2;
                    const ar = (bf[1] + bf[5] + bf[9]) / 3;
                    // archetype is no longer decided here -- assignDynamicArchetypes() runs
                    // once over the full mockList below, after generation completes, since
                    // real clustering needs the whole dataset, not one row at a time.

                    const barriers = getRandomSubarray(pool.barriers, 3).join(';');
                    const needs = getRandomSubarray(pool.needs, 3).join(';');
                    const pains = getRandomSubarray(pool.pains, 3).join(';');
                    const tools = getRandomSubarray(pool.tools, 4).join(';');
                    const quote = pool.quotes[i % pool.quotes.length];

                    let loc;
                    const rLoc = Math.random();
                    if (rLoc < 0.45) loc = 'Northern Area';
                    else if (rLoc < 0.7) loc = 'Central Area';
                    else if (rLoc < 0.9) loc = 'Southern Area';
                    else if (rLoc < 0.97) loc = 'Eastern Area';
                    else loc = 'Offshore Islands';

                    let office;
                    if (loc === 'Northern Area') {
                        office = i % 3 === 0 ? 'Zhongxiao Office' : (i % 3 === 1 ? 'Zhongshan Office' : 'Xinzhuang Office');
                    } else if (loc === 'Central Area') {
                        office = i % 2 === 0 ? 'Taichung Branch' : 'Changhua Office';
                    } else if (loc === 'Southern Area') {
                        office = i % 2 === 0 ? 'Kaohsiung Branch' : 'Tainan Office';
                    } else if (loc === 'Eastern Area') {
                        office = i % 2 === 0 ? 'Hualien Office' : 'Taitung Office';
                    } else {
                        office = i % 2 === 0 ? 'Penghu Office' : 'Kinmen Office';
                    }

                    let pos;
                    const rPos = Math.random();
                    if (arch === 'explorer') {
                        pos = rPos < 0.8 ? 'Sales Agent' : 'Sales Supervisor';
                    } else if (arch === 'expert') {
                        pos = rPos < 0.5 ? 'Sales Supervisor' : 'Sales Manager';
                    } else if (arch === 'optimizer') {
                        pos = rPos < 0.6 ? 'Sales Manager' : 'District Manager';
                    } else if (arch === 'skeptic') {
                        pos = rPos < 0.1 ? 'Sales Supervisor' : (rPos < 0.6 ? 'Sales Manager' : 'District Manager');
                    } else {
                        pos = rPos < 0.9 ? 'Sales Agent' : 'Sales Supervisor';
                    }

                    let fam;
                    const rFam = Math.random();
                    if (arch === 'explorer') {
                        fam = rFam < 0.7 ? 'Single' : (rFam < 0.9 ? 'One Child' : 'Two Kids');
                    } else if (arch === 'skeptic') {
                        fam = rFam < 0.05 ? 'Single' : (rFam < 0.25 ? 'One Child' : (rFam < 0.75 ? 'Two Kids' : '+ 3 Children'));
                    } else {
                        fam = rFam < 0.2 ? 'Single' : (rFam < 0.55 ? 'One Child' : (rFam < 0.95 ? 'Two Kids' : '+ 3 Children'));
                    }

                    const care = Math.random() < 0.6 ? 'Yes' : 'No';

                    const agent = {
                        name: `${pool.namePrefix}_${i}`,
                        raw: { qm, bf },
                        sup, wp, ar, pr,
                        archetype: null, // set by assignDynamicArchetypes() after the full batch is generated
                        Age: pool.age,
                        Experience: pool.exp,
                        Clients: pool.clients,
                        Role_Badges: pool.badges,
                        Description: pool.desc,
                        Conflict: barriers,
                        Needs: needs,
                        Pains: pains,
                        PersonalTools: tools,
                        Quote: quote,
                        Tasks_Text: pool.tasks,
                        Service_Location: loc,
                        Branch_Office: office,
                        Position: pos,
                        Family_Size: fam,
                        Care_Parents: care
                    };

                    // Use the 6 steps of JOURNEY_STAGE_INFO to populate default mock values
                    for (let idx = 1; idx <= 6; idx++) {
                        const stageInfo = JOURNEY_STAGE_INFO[idx - 1];
                        const key = pool.namePrefix === "Alex" ? "explorer" : (pool.namePrefix === "Grace" ? "expert" : (pool.namePrefix === "Kevin" ? "optimizer" : (pool.namePrefix === "Robert" ? "skeptic" : "parttimer")));
                        const stepData = stageInfo[key] || stageInfo["all"];
                        
                        agent[`Journey_${idx}_Title`] = stageInfo.title;
                        agent[`Journey_${idx}_Locations`] = stepData.tools.split(',')[0] || "Office";
                        agent[`Journey_${idx}_Tools`] = stepData.tools;
                        agent[`Journey_${idx}_Pains`] = "No significant pain point";
                        let rBase = 3.0;
                        if (key === 'expert') rBase = 4.8;
                        else if (key === 'skeptic') rBase = 1.8;
                        else if (key === 'explorer') rBase = 2.5;
                        else if (key === 'optimizer') rBase = 4.0;
                        else rBase = 3.2;

                        // Create distinct shapes for curves
                        const randShift = (Math.random() - 0.5) * 0.4;
                        let wave = 0;
                        if (idx === 1) wave = -0.3;
                        else if (idx === 2) wave = -0.5;
                        else if (idx === 4) wave = 0.5;
                        else if (idx === 6) wave = 0.3;

                        let ratingVal = Math.max(1.0, Math.min(5.0, rBase + wave + randShift));
                        agent[`Journey_${idx}_Rating`] = parseFloat(ratingVal.toFixed(1));
                    }

                    agent.Verbatim_1_Quote = pool.quotes[(i) % pool.quotes.length]; agent.Verbatim_1_Author = `涂 O 玲 (${pool.exp})`;
                    agent.Verbatim_2_Quote = pool.quotes[(i+1) % pool.quotes.length]; agent.Verbatim_2_Author = `邱 O 中 (${pool.exp})`;
                    agent.Verbatim_3_Quote = pool.quotes[(i+2) % pool.quotes.length]; agent.Verbatim_3_Author = `張 O 穎 (${pool.exp})`;
                    agent.Verbatim_4_Quote = pool.quotes[(i+3) % pool.quotes.length]; agent.Verbatim_4_Author = `高 O 惠 (${pool.exp})`;
                    agent.Verbatim_5_Quote = pool.quotes[(i+4) % pool.quotes.length]; agent.Verbatim_5_Author = `許 O 輝 (${pool.exp})`;
                    agent.Verbatim_6_Quote = pool.quotes[(i+5) % pool.quotes.length]; agent.Verbatim_6_Author = `黃 O 堯 (${pool.exp})`;

                    mockList.push(agent);
                }
            }

            // Feed specific fake data for the initial 15 respondents
            for (let idx = 0; idx < 15; idx++) {
                if (mockList[idx]) {
                    const locations = ['Northern Area', 'Central Area', 'Southern Area', 'Eastern Area', 'Offshore Islands'];
                    const offices = ['Zhongxiao Office', 'Zhongshan Office', 'Kaohsiung Branch', 'Taichung Branch', 'Hualien Office'];
                    const positions = ['Sales Agent', 'Sales Supervisor', 'Sales Manager', 'District Manager'];
                    const families = ['Single', 'One Child', 'Two Kids', '+ 3 Children'];
                    const cares = ['Yes', 'No'];
                    
                    mockList[idx].Service_Location = locations[idx % locations.length];
                    mockList[idx].Branch_Office = offices[idx % offices.length];
                    mockList[idx].Position = positions[idx % positions.length];
                    mockList[idx].Family_Size = families[idx % families.length];
                    mockList[idx].Care_Parents = cares[idx % cares.length];
                }
            }

            assignDynamicArchetypes(mockList);
            renderArchetypeTabs();
            parsedData = mockList;
            runClusterDiscovery();
        }

        function calculateKeywords(textList, isFreeText = false) {
            const wordFreq = {};
            const stopwords = new Set([
                'the', 'and', 'to', 'a', 'is', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'an', 'this', 'that', 'from', 
                'are', 'was', 'be', 'have', 'has', 'had', 'it', 'my', 'i', 'me', 'we', 'our', 'us', 'they', 'them', 'their', 
                'he', 'him', 'his', 'she', 'her', 'you', 'your', 'about', 'as', 'but', 'or', 'so', 'if', 'when', 'who', 'how', 
                'which', 'what', 'would', 'should', 'could', 'will', 'can', 'cant', 'cannot', 'did', 'do', 'does', 'doing', 
                'done', 'get', 'got', 'go', 'went', 'make', 'made', 'take', 'took', 'use', 'used', 'using', 'too', 'very', 
                'also', 'some', 'any', 'all', 'more', 'most', 'other', 'no', 'not', 'yes', 'only', 'out', 'up', 'down', 
                'over', 'under', 'again', 'then', 'once', 'here', 'there', 'why', 'than', 'into', 'just', 'like', 'dont', 
                'doesnt', 'didnt', 'isnt', 'arent', 'wasnt', 'werent', 'havent', 'hasnt', 'hadnt', 'wont', 'shouldnt', 'wouldnt', 'couldnt'
            ]);

             const phraseMap = {
                 "manually re-checking numbers": "Data Auto-Sync VS Manual Re-Checking",
                 "manually rechecking numbers": "Data Auto-Sync VS Manual Re-Checking",
                 "chasing a colleague for a password reset": "Self-Service Reset VS Password Reset Delays",
                 "explaining a system error to the client": "Stable Interface VS System Error Explanations",
                 "re-uploading documents that got rejected": "One-Time Submission VS Re-Uploading Rejections",
                 "switching between three different tabs": "Unified Portal VS Multi-Tab Switching",
                 "hunting for the right form version": "Auto-Updated Forms VS Form Hunting Delays",
                 "re-entering the same client data": "Auto-Populated Fields VS Re-Entering Client Data",
                 "converting pdfs by hand": "Auto-Format Conversion VS Manual PDF Conversion",
                 "converting pdfs by hand in front of them": "Trust Building VS Manual PDF Conversion",
                 "logging back in repeatedly": "Close on the Spot VS Re-Logging Delays",
                 "the ideal is a seamless visit": "Seamless Visit VS System Delays",

                 // Gap / Core Conflicts options
                "by the time a lead is logged": "Instant Action VS Slow Logging",
                "mil milestones across systems": "Milestone Care VS Scattered Systems",
                "milestones across systems": "Milestone Care VS Scattered Systems",
                "analysis is scattered across systems": "Analysis Goals VS Manual Formatting",
                "switching between multiple systems": "Single Inquiry VS Multi-System Maze",
                "shortcuts in the systems": "Fast Navigation VS System Skill Gap",
                "shortcuts in systems": "Fast Navigation VS System Skill Gap",
                "no major gap": "Standard Work VS Expected Efficiency",
                "current tools generally meet": "Standard Work VS Expected Efficiency",

                // Pain Points options
                "mobile version of the system is not user-friendly": "Mobile Version Not User-Friendly",
                "mobile version of the system is not user friendly": "Mobile Version Not User-Friendly",
                "notifications/alerts are easy to miss": "Notifications/Alerts Easy to Miss",
                "notifications alerts are easy to miss": "Notifications/Alerts Easy to Miss",
                "need to re-enter the same client data": "Re-Entering Same Client Data",
                "need to re enter the same client data": "Re-Entering Same Client Data",
                "limited search filters": "Limited Search Filters",
                "interface is not intuitive for less tech-savvy": "Interface Not Intuive for Less Tech-Savvy",
                "interface is not intuitive for less tech savvy": "Interface Not Intuitive for Less Tech-Savvy",
                "no significant pain point": "No Significant Pain Point",

                // Core Needs options
                "open api / custom integration": "Open API / Custom Integration",
                "open api custom integration": "Open API / Custom Integration",
                "one-click automatic quotation": "One-Click Quotation Generation",
                "one click automatic quotation": "One-Click Quotation Generation",
                "simplified system interface operations": "Simplified Interface Operations",
                "retain counter/paper processing": "Retain Counter/Paper Processing",
                "retain counter paper processing": "Retain Counter/Paper Processing",
                "extend online signature validity": "Extend Online Signature Validity",
                "fuzzy keyword search": "Fuzzy Keyword Search",
                "mobile app experience optimization": "Mobile App Experience Optimisation",
                "mobile app experience optimisation": "Mobile App Experience Optimisation",
                "predefined options for common occupations": "Predefined Common Occupations",
                "reduce loading times": "Reduce Loading Times",
                "offline cache support": "Offline Cache Support",
                "fast login / faceid": "Fast Login (FaceID / Fingerprint)",
                "fast login faceid": "Fast Login (FaceID / Fingerprint)",
                "convenient paper printing / large-font": "Paper Printing / Large-Font Interface",
                "convenient paper printing large font": "Paper Printing / Large-Font Interface",
                "single portal system integration": "Single Portal System Integration",
                "automated list classification / tagging": "Automated List Classification / Tagging",
                "automated list classification tagging": "Automated List Classification / Tagging",
                "assistant account delegation": "Assistant Account Delegation"
            };

            textList.forEach(text => {
                if (!text) return;
                
                const lowerText = text.toLowerCase();
                let matched = false;
                for (const key in phraseMap) {
                    if (lowerText.includes(key)) {
                        const matchedPhrase = phraseMap[key];
                        wordFreq[matchedPhrase] = (wordFreq[matchedPhrase] || 0) + 1;
                        matched = true;
                    }
                }
                
                // For overall multiple-choice tags, we do not fallback to word-by-word tokenizing.
                // For verbatim free-text quotes, we tokenize word-by-word.
                if (!matched) {
                    if (isFreeText) {
                        const cleanItem = text.replace(/[.,\/#!$%\^&*\*;:{}=\-_`~()?"'’。，、；：「」（）！？]/g, ' ').toLowerCase();
                        const tokens = cleanItem.split(/\s+/);
                        tokens.forEach(tok => {
                            const cleanTok = tok.trim();
                            if (cleanTok && cleanTok.length > 2 && !stopwords.has(cleanTok)) {
                                const cap = cleanTok === 'pdf' ? 'PDF' : cleanTok.charAt(0).toUpperCase() + cleanTok.slice(1);
                                wordFreq[cap] = (wordFreq[cap] || 0) + 1;
                            }
                        });
                    } else {
                        const items = text.split(/[;；,，\n\r]+/);
                        items.forEach(item => {
                            const cleanItem = item.trim();
                            if (cleanItem && cleanItem.length > 3) {
                                wordFreq[cleanItem] = (wordFreq[cleanItem] || 0) + 1;
                            }
                        });
                    }
                }
            });

            return Object.entries(wordFreq)
                .map(([word, freq]) => ({ word, freq }))
                .sort((a, b) => b.freq - a.freq);
        }

        // Render dynamic CSS word clouds
        function renderWordCloud(keywords, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';
            
            if (keywords.length === 0) {
                container.innerHTML = '<span style="font-size: var(--fs-caption); color: var(--text-muted);">Not enough data to calculate keywords</span>';
                return;
            }
            
            const maxFreq = Math.max(...keywords.map(k => k.freq));
            keywords.slice(0, 10).forEach(k => {
                const scale = maxFreq > 1 ? (k.freq - 1) / (maxFreq - 1) : 0.5;
                let fontSize = 'var(--fs-body)'; // same size for every keyword: the count in ( ) already shows frequency
                if (containerId === 'barriers-word-cloud' || containerId === 'needs-word-cloud' || containerId === 'pains-word-cloud') {
                    fontSize = '12pt';
                }
                const opacity = 0.9;
                
                const span = document.createElement('span');
                span.style.setProperty('font-size', fontSize, 'important');
                span.style.color = `rgba(255, 255, 255, ${opacity})`;
                span.style.background = `rgba(255, 255, 255, 0.04)`;
                span.style.border = `1px solid rgba(255, 255, 255, ${opacity * 0.15})`;
                span.style.padding = `3px 8px`;
                span.style.borderRadius = `20px`;
                if (containerId === 'barriers-word-cloud' || containerId === 'needs-word-cloud' || containerId === 'pains-word-cloud' || containerId === 'analytics-all-barriers-cloud' || containerId === 'analytics-all-needs-cloud' || containerId === 'analytics-all-pains-cloud') {
                    span.style.display = `block`;
                    span.style.textAlign = 'left';
                    span.style.margin = `0`;
                    span.style.whiteSpace = 'nowrap';
                    span.style.overflow = 'hidden';
                    span.style.textOverflow = 'ellipsis';
                } else {
                    span.style.display = `inline-block`;
                    span.style.margin = `3px`;
                }
                span.style.fontWeight = '500';
                span.style.transition = 'transform 0.2s';
                span.onmouseover = () => span.style.transform = 'scale(1.08)';
                span.onmouseout = () => span.style.transform = 'scale(1)';
                span.textContent = `${k.word} (${k.freq})`;
                container.appendChild(span);
            });
        }

        // ---- Response distributions: every choice question without its own chart gets a bar card ----
        function renderResponseDistributions(agents) {
            const host = document.getElementById('analytics-response-dist');
            if (!host) return;
            const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh');
            const schema = (typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null) ||
                ((typeof JOURNEY_SCHEMAS !== 'undefined') ? (JOURNEY_SCHEMAS[currentJourneyDomain] || JOURNEY_SCHEMAS.agent) : {}) || {};
            const defs = [
                { q: 'q12', slot: 'sup', multi: false, num: 12 },
                { q: 'q13', slot: 'sup', multi: false, num: 13 },
                { q: 'q16', slot: 'reasons', multi: true, num: 16 },
                { q: 'q17', slot: 'methods', multi: true, num: 17 },
                { q: 'q18', slot: 'followup', multi: false, num: 18 },
                { q: 'q19', slot: 'willingness', multi: false, num: 19 },
                { q: 'q22', slot: 'official', multi: true, num: 22 },
                { q: 'q26', slot: 'focus', multi: false, num: 26 }
            ];
            const slots = (typeof QUESTION_SLOTS !== 'undefined') ? QUESTION_SLOTS : {};
            const esc = (v) => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
            const cards = [];
            defs.forEach(d => {
                const counts = {};
                let answered = 0;
                (agents || []).forEach(a => {
                    const raw = a.Resp && a.Resp[d.q];
                    if (!raw) return;
                    answered++;
                    const parts = d.multi ? raw.split(/[;；]+/).map(x => x.trim()).filter(Boolean) : [raw];
                    new Set(parts).forEach(p => { counts[p] = (counts[p] || 0) + 1; });
                });
                if (!answered) return;
                const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
                const prompt = (isZh ? schema[d.q + 'PromptZh'] : schema[d.q + 'Prompt']) || '';
                const slotLabel = slots[d.slot] ? (isZh ? slots[d.slot].zh : slots[d.slot].en) : '';
                cards.push(`
                    <div class="glass-panel chart-card" style="display:flex; flex-direction:column; min-width:0;">
                        <h3 style="margin:0 0 4px 0; border-left:3px solid var(--accent-yellow); padding-left:8px; font-size:var(--fs-subtitle);">Q${d.num} · ${esc(slotLabel)}</h3>
                        <div style="font-size:var(--fs-caption); color:var(--text-secondary); margin:0 0 10px 11px; line-height:1.35;">${esc(prompt)}</div>
                        <div style="display:flex; flex-direction:column; gap:7px;">
                            ${rows.map(([label, n]) => {
                                const pct = Math.round(n / answered * 100);
                                return `<div style="font-size:var(--fs-caption);">
                                    <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:2px;"><span style="min-width:0; overflow-wrap:anywhere;">${esc(label)}</span><span style="color:var(--text-secondary); white-space:nowrap;">${pct}% (${n})</span></div>
                                    <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:3px;"><div style="height:6px; width:${pct}%; background:var(--accent-yellow); border-radius:3px;"></div></div>
                                </div>`;
                            }).join('')}
                        </div>
                        <div style="font-size:var(--fs-caption); color:var(--text-secondary); margin-top:10px;">${isZh ? '有效回覆' : 'Answered'}: ${answered} / ${(agents || []).length}</div>
                    </div>`);
            });
            host.style.display = cards.length ? 'grid' : 'none';
            host.innerHTML = cards.join('');
        }

        // Dynamic task aggregation for donut chart
        function calculateDailyTasks(agents) {
            const taskWeights = {};
            const taskCounts = {};
            
            agents.forEach(agent => {
                if (!agent.Tasks_Text) return;
                const tasks = agent.Tasks_Text.split(';');
                tasks.forEach(t => {
                    const parts = t.split(':');
                    if (parts.length >= 2) {
                        const name = parts[0].trim();
                        const val = parseFloat(parts[1]) || 0;
                        if (name) {
                            taskWeights[name] = (taskWeights[name] || 0) + val;
                            taskCounts[name] = (taskCounts[name] || 0) + 1;
                        }
                    }
                });
            });
            
            const averaged = Object.keys(taskWeights).map(name => {
                return { name, val: taskWeights[name] / taskCounts[name] };
            });
            
            const topTasks = averaged.sort((a, b) => b.val - a.val).slice(0, 5);
            
            const total = topTasks.reduce((sum, t) => sum + t.val, 0);
            if (total > 0) {
                topTasks.forEach(t => t.val = Math.round((t.val / total) * 100));
            }
            
            return topTasks;
        }

        // Dynamic tools calculation mapping
        function calculateTopTools(agents) {
            const toolCounts = {};
            agents.forEach(agent => {
                if (!agent.PersonalTools) return;
                const tools = agent.PersonalTools.split(/[;；,，\n\r]+/);
                tools.forEach(t => {
                    const clean = t.trim();
                    if (clean) {
                        toolCounts[clean] = (toolCounts[clean] || 0) + 1;
                    }
                });
            });
            
            return Object.entries(toolCounts)
                .map(([tool, count]) => ({ tool, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map(item => `${item.tool} (${item.count})`);
        }

        // Mode calculator for basic stats (Age, Experience, Customers)
        function calculateModeValue(agents, fieldKey, defaultValue) {
            if (!agents || agents.length === 0) return defaultValue;
            const counts = {};
            agents.forEach(a => {
                const val = a[fieldKey];
                if (val) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            return sorted.length > 0 ? sorted[0][0] : defaultValue;
        }

        // Top 3 labels calculator
        function calculateTopGroupLabels(agents) {
            const labelCounts = {};
            const rookieLabels = new Set(['Rookie Agent', '新進業務', '新手業務', '新進業務員', 'Insurance Newbie']);

            // Detect if this cohort represents experienced agents (majority with > 1 year experience or leadership positions)
            const experiencedCount = agents.filter(a => {
                const exp = a.Experience || '';
                const pos = a.Position || '';
                const isRookieTenure = exp === 'Under 1 year' || exp === '未滿1年' || exp === '1年以下';
                const isRookieTitle = pos === 'New Agent' || pos === '新進業務員' || pos === '新進業務';
                return !isRookieTenure || !isRookieTitle;
            }).length;
            const isExperiencedGroup = agents.length > 0 && (experiencedCount / agents.length > 0.6);

            agents.forEach(agent => {
                if (!agent.Role_Badges) return;
                const labels = agent.Role_Badges.split(/[;；,，\n\r]+/);
                labels.forEach(l => {
                    let clean = l.trim();
                    if (!clean) return;
                    // Do not associate rookie tags with experienced agents or experienced clusters
                    if (rookieLabels.has(clean)) {
                        const exp = agent.Experience || '';
                        const pos = agent.Position || '';
                        const isAgentExperienced = (exp && exp !== 'Under 1 year' && exp !== '未滿1年' && exp !== '1年以下') ||
                                                   (pos && pos !== 'New Agent' && pos !== '新進業務員' && pos !== '新進業務');
                        if (isAgentExperienced || isExperiencedGroup) {
                            return;
                        }
                    }
                    labelCounts[clean] = (labelCounts[clean] || 0) + 1;
                });
            });
            return Object.entries(labelCounts)
                .map(([label, count]) => ({ label, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map(item => item.label);
        }

        // Timeline Sales Journey Aggregator (6 predefined tasks)
        function calculateTimelineJourney(agents) {
            const tasks = [];
            const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'in', 'on', 'at', 'by', 'with', 'from', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
            
            const schema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            const isZh = (currentLang === 'zh');
            const taskTitles = schema 
                ? schema.stages.map((s, i) => {
                    if (isZh) return s.titleZh || s.title;
                    if (s.title && !/[\u4e00-\u9fff]/.test(s.title)) return s.title;
                    return (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema.id]?.stages?.[i]?.title) || `Stage ${i + 1}`;
                })
                : ((typeof JOURNEY_STAGE_TITLES !== 'undefined' && JOURNEY_STAGE_TITLES[currentLang]) ? JOURNEY_STAGE_TITLES[currentLang] : [
                    "Scheduling & Client Relations",
                    "Signing/Policy",
                    "Insurance Submission",
                    "Post-Sales Service",
                    "Administrative & Team Support",
                    "Training & Learning"
                ]);
            
            const numStages = (taskTitles && taskTitles.length) ? taskTitles.length : 6;
            for (let idx = 1; idx <= numStages; idx++) {
                const titleMode = taskTitles[idx - 1] || `Stage ${idx}`;
                
                const locCounts = {};
                const toolCounts = {};
                const painCounts = {};
                const themeCounts = {};
                let ratingSum = 0;
                let ratingCount = 0;
                
                agents.forEach(a => {
                    // Aggregate locations
                    const locVal = a[`Journey_${idx}_Locations`];
                    if (locVal) {
                        locVal.split(/[;；,]+/).forEach(tok => {
                            const clean = tok.trim();
                            if (clean && clean.toLowerCase() !== 'no' && clean.toLowerCase() !== 'none') {
                                locCounts[clean] = (locCounts[clean] || 0) + 1;
                            }
                        });
                    }
                    
                    // Aggregate tools
                    const toolVal = a[`Journey_${idx}_Tools`];
                    if (toolVal) {
                        toolVal.split(/[;；,]+/).forEach(tok => {
                            const clean = tok.trim();
                            if (clean && clean.toLowerCase() !== 'no' && clean.toLowerCase() !== 'none') {
                                toolCounts[clean] = (toolCounts[clean] || 0) + 1;
                            }
                        });
                    }
                    
                    // Aggregate pains
                    const painVal = a[`Journey_${idx}_Pains`];
                    if (painVal) {
                        classifyPainThemes(painVal).forEach(k => { themeCounts[k] = (themeCounts[k] || 0) + 1; });
                        painVal.split(/[;；\n]+/).forEach(tok => {
                            const clean = tok.strip ? tok.strip() : tok.trim();
                            if (clean && !clean.toLowerCase().includes('no significant pain') && !clean.toLowerCase().includes('無特別')) {
                                painCounts[clean] = (painCounts[clean] || 0) + 1;
                            }
                        });
                    }
                    
                    // Rating
                    const rVal = parseFloat(a[`Journey_${idx}_Rating`]);
                    if (!isNaN(rVal)) {
                        ratingSum += rVal;
                        ratingCount++;
                    }
                });
                
                const topLocs = Object.entries(locCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(item => `${item[0]} (${item[1]})`);
                    
                const topTools = Object.entries(toolCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(item => `${item[0]} (${item[1]})`);
                    
                const topPains = Object.entries(painCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(item => `${item[0]} (${item[1]})`);
                const painThemes = Object.entries(themeCounts).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
                const themeLabel = k => { const t = PAIN_THEMES.find(x => x.k === k); return t ? (isZh ? t.zh.label : t.en.label) : k; };
                const topThemePains = painThemes.slice(0, 3).map(x => `${themeLabel(x.k)} (${x.n})`);
                
                const avgRating = ratingCount > 0 ? (ratingSum / ratingCount) : 3.0;
                
                let emoji = "😐";
                if (avgRating >= 4.5) emoji = "😊"; // 5 = happy face
                else if (avgRating >= 3.5) emoji = "🙂"; // 4 = 🙂
                else if (avgRating >= 2.5) emoji = "😐"; // 3 = 😐
                else if (avgRating >= 1.5) emoji = "🙁"; // 2 = 🙁
                else emoji = "😩"; // 1 = 😩
                
                const stageObj = (schema && schema.stages) ? schema.stages[idx - 1] : null;
                let stageActions = null;
                if (stageObj) {
                    if (isZh) {
                        stageActions = stageObj.actionsZh || stageObj.actions;
                    } else {
                        if (stageObj.actions && Array.isArray(stageObj.actions) && !stageObj.actions.some(a => /[\u4e00-\u9fff]/.test(a))) {
                            stageActions = stageObj.actions;
                        } else if (typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema ? schema.id : 'agent']?.stages?.[idx - 1]?.actions) {
                            stageActions = DEFAULT_JOURNEY_SCHEMAS[schema ? schema.id : 'agent'].stages[idx - 1].actions;
                        }
                    }
                }
                const actionsMap = (currentLang === 'zh' && typeof TASK_ACTIONS_MAP_ZH !== 'undefined') ? TASK_ACTIONS_MAP_ZH : (typeof TASK_ACTIONS_MAP_EN !== 'undefined' ? TASK_ACTIONS_MAP_EN : TASK_ACTIONS_MAP);
                
                let finalActions = stageActions || (actionsMap && actionsMap[idx - 1]) || (TASK_ACTIONS_MAP[idx - 1] || []);
                if (!isZh && Array.isArray(finalActions)) {
                    finalActions = finalActions.map(act => {
                        if (/[\u4e00-\u9fff]/.test(act)) {
                            const defAction = typeof DEFAULT_JOURNEY_SCHEMAS !== 'undefined' && DEFAULT_JOURNEY_SCHEMAS[schema ? schema.id : 'agent']?.stages?.[idx - 1]?.actions;
                            if (defAction && defAction[0]) return defAction[0];
                            return "Standard sales activity";
                        }
                        return act;
                    });
                }
                
                tasks.push({
                    taskNumber: idx,
                    title: titleMode,
                    actions: finalActions,
                    contexts: topLocs, // mapped to locations
                    tools: topTools, // mapped to tools
                    pains: topThemePains.length ? topThemePains : topPains,
                    painThemes: painThemes,
                    groupN: agents.length,
                    toolNames: Object.entries(toolCounts).sort((a, b) => b[1] - a[1]).map(x => x[0]),
                    avgRating: avgRating.toFixed(1),
                    emoji: emoji
                });
            }
            return tasks;
        }

        // Process file upload// Task code mapping
        const TASK_CODE_MAPPING_EN = {
            'a': 'Scheduling & Visiting',
            'b': 'Prospecting / Development',
            'c': 'Signing Policies',
            'd': 'Post-Sales Service',
            'e': 'Enhancing Knowledge',
            'f': 'Administrative Tasks',
            'g': 'System Optimisation',
            'h': 'Team Gatherings',
            'i': 'Recruiting',
            'j': 'Other'
        };

        const TASK_CODE_MAPPING_ZH = {
            'a': '排程與拜訪',
            'b': '開拓與客源開發',
            'c': '保單要保與簽署',
            'd': '售後保全服務',
            'e': '專業知識提升',
            'f': '行政庶務處理',
            'g': '系統操作與優化',
            'h': '團隊早會活動',
            'i': '增員與輔導',
            'j': '其他工作'
        };

        const TASK_CODE_MAPPING = TASK_CODE_MAPPING_EN;

        function parseImpactValue(val) {
            if (val === undefined || val === null) return 50;
            const s = String(val).trim().toLowerCase();
            if (s.includes('high') || s.includes('高度')) return 100;
            if (s.includes('has') || s.includes('有')) return 80;
            if (s.includes('neutral') || s.includes('無特別') || s.includes('中立')) return 60;
            if (s.includes('little') || s.includes('稍微') || s.includes('些微')) return 40;
            if (s.includes('no') || s.includes('無影響') || s.includes('無')) return 20;
            
            let numeric = parseFloat(s);
            if (!isNaN(numeric)) {
                if (s.includes('%')) return numeric;
                if (numeric <= 5) return numeric * 20;
                return numeric;
            }
            return 50;
        }

        // ---- SUP: mean of the questions that describe how useful the person finds their systems ----
        // Q12 overall feeling, Q13 impact of provided tools, Q14 system/digital-tool items. Falls back to the
        // mean stage rating when none of those questions is mapped.
        function supToFive(v, scaleType) {
            if (v === undefined || v === null || String(v).trim() === '') return null;
            const str = String(v).trim();
            const emo = [['😩', 1], ['😫', 1], ['😭', 1], ['😡', 1], ['😠', 1], ['🙁', 2], ['☹', 2], ['😟', 2], ['😰', 2], ['😐', 3], ['😑', 3], ['🙂', 4], ['😊', 4], ['😀', 4], ['😃', 4], ['😄', 5], ['🤩', 5], ['😁', 5], ['😍', 5]];
            for (const [e, n] of emo) if (str.includes(e)) return n;
            const n = parseFloat(str);
            if (isNaN(n)) return null;
            if (scaleType === '0-100' || n > 5) return Math.max(1, Math.min(5, 1 + 4 * Math.min(100, n) / 100));
            return Math.max(1, Math.min(5, n));
        }
        function supImpactToFive(v, schema) {
            if (v === undefined || v === null || String(v).trim() === '') return null;
            const str = String(v).trim().toLowerCase();
            const opts = ((schema && schema.q13Options) || []).map(o => String(o).trim().toLowerCase());
            const i = opts.indexOf(str);
            if (i >= 0 && opts.length > 1) return 1 + 4 * i / (opts.length - 1);
            const neg = /slow|reduc|worse|hinder|harder/.test(str), pos = /improv|better|faster|easier|help/.test(str);
            const strong = /sever|signific|great|major|extreme/.test(str);
            if (/no (noticeable )?impact|neutral|unchanged/.test(str)) return 3;
            if (neg) return strong ? 1 : 2;
            if (pos) return strong ? 5 : 4;
            return supToFive(v);
        }
        function computeSUP(row, userMapping, schema) {
            const col = k => (userMapping && userMapping[k]) || null;
            const vals = [];
            if (col('feeling')) { const f = supToFive(row[col('feeling')]); if (f !== null) vals.push(f); }
            if (col('tool_impact')) { const f = supImpactToFive(row[col('tool_impact')], schema); if (f !== null) vals.push(f); }
            const q14 = [];
            ((schema && schema.metrics) || []).forEach(m => {
                if (String(m.sourceQuestion || '').replace(/\D/g, '') !== '14') return;
                const c = col('metric_' + m.key);
                if (!c) return;
                const f = supToFive(row[c], m.scaleType);
                if (f !== null) q14.push(f);
            });
            if (q14.length) vals.push(q14.reduce((a, b) => a + b, 0) / q14.length);
            if (vals.length) return vals.reduce((a, b) => a + b, 0) / vals.length;
            return parseSUP(row, userMapping, schema);
        }

        function parseSUP(row, userMapping, schema) {
            const stages = (schema && schema.stages) ? schema.stages : [];
            const nStages = stages.length || 6;
            let sum = 0;
            let count = 0;
            for (let step = 1; step <= nStages; step++) {
                const tName = stages[step - 1] ? stages[step - 1].key : '';
                let rawEmotion = null;
                const mappedCol = userMapping ? userMapping[`stage_${step}_rating`] : null;
                if (mappedCol && row[mappedCol] !== undefined && row[mappedCol] !== null && row[mappedCol] !== '') rawEmotion = row[mappedCol];
                const emotionKeys = rawEmotion ? [] : [
                    `Q27_S${step}_rating_1to5`,
                    `Task${step}_${tName}_emotional_rating_1to5`,
                    `task${step}_emotion`,
                    `Task${step}_emotion`,
                    `task_${step}_emotion`,
                    `Task_${step}_emotion`,
                    `Task${step}_D_Emotion`,
                    `Task${step}_C_Emotion`,
                    `Task${step}_Emotion`
                ];
                for (const k of emotionKeys) {
                    if (row[k] !== undefined && row[k] !== null) {
                        rawEmotion = row[k];
                        break;
                    }
                }
                if (rawEmotion) {
                    const emoStr = String(rawEmotion).trim();
                    let ratingVal = 3.0;
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
                        if (!isNaN(parsedNum)) {
                            ratingVal = parsedNum;
                        }
                    }
                    sum += ratingVal;
                    count++;
                }
            }
            return count > 0 ? (sum / count) : 3.0;
        }

        // ==================== WP / AR / PR (role-based, schema independent) ====================
        // Scores come from question roles A-E (see the Universal WP / AR / PR Measurement Guideline),
        // not from fixed question numbers. computeMeasures() lives in journey_schemas_modular.js.
        function buildMeasureColumns(schema, userMapping, data) {
            const first = (data && data[0]) ? data[0] : {};
            const headers = Object.keys(first).map(k => k.replace(/^\uFEFF/, '').trim());
            const targets = getSchemaTargetFields(schema);
            const byKey = {};
            targets.forEach(tg => { byKey[tg.key] = tg; });
            const pick = key => {
                const m = userMapping && userMapping[key];
                if (m) return String(m).replace(/^\uFEFF/, '').trim();
                return byKey[key] ? findBestMatchingCsvHeader(byKey[key], headers) : '';
            };
            const stages = (schema && schema.stages) ? schema.stages : [];
            const cols = {
                reasons: pick('role_reasons'),
                methods: pick('role_methods'),
                tools: pick('personal_tools'),
                stageTools: stages.map((s, i) => pick(`stage_${i + 1}_tools`)),
                stagePains: stages.map((s, i) => pick(`stage_${i + 1}_pain`))
            };
            cols.has = {
                reasons: !!cols.reasons,
                methods: !!cols.methods,
                tools: !!cols.tools,
                stageTools: cols.stageTools.some(Boolean),
                stagePains: cols.stagePains.some(Boolean)
            };
            cols.status = {
                WP: cols.has.reasons || cols.has.methods || cols.has.tools,
                AR: cols.has.stagePains,
                PR: cols.has.stageTools || cols.has.tools
            };
            cols.phrases = getArPhrases(schema);
            return cols;
        }

        function scoreMeasuresForRow(row, cols, schema) {
            return computeMeasures({
                has: cols.has,
                reasons: cols.reasons ? row[cols.reasons] : null,
                methods: cols.methods ? row[cols.methods] : null,
                tools: cols.tools ? row[cols.tools] : null,
                stageTools: cols.stageTools.map(c => c ? row[c] : null),
                stagePains: cols.stagePains.map(c => c ? row[c] : null)
            }, schema, cols.phrases);
        }


        function getClusterRepresentativeTitle(agents) {
            if (!agents || agents.length === 0) return "Sales Agent";
            
            // Check dominant tags first
            const labelCounts = {};
            agents.forEach(agent => {
                if (!agent.Role_Badges) return;
                const labels = agent.Role_Badges.split(/[;；,，\n\r]+/);
                labels.forEach(l => {
                    const clean = l.trim();
                    if (clean) {
                        labelCounts[clean] = (labelCounts[clean] || 0) + 1;
                    }
                });
            });
            const sortedLabels = Object.entries(labelCounts).sort((a, b) => b[1] - a[1]);
            if (sortedLabels.length > 0) {
                const topTag = sortedLabels[0][0].toLowerCase();
                if (topTag.includes('rookie') || topTag.includes('newcomer') || topTag.includes('flexible')) {
                    return "New Agent";
                }
                if (topTag.includes('empathy') || topTag.includes('service') || topTag.includes('relationship')) {
                    return "Experienced Agent";
                }
                if (topTag.includes('expert') || topTag.includes('professional') || topTag.includes('senior')) {
                    return "Sales Supervisor";
                }
                if (topTag.includes('optimizer') || topTag.includes('efficiency')) {
                    return "Sales Manager";
                }
            }
            
            // Fallback to average tenure years
            let totalYears = 0;
            let count = 0;
            agents.forEach(a => {
                const years = parseTenureValue(a.Experience);
                if (years > 0) {
                    totalYears += years;
                    count++;
                }
            });
            
            const avgYears = count > 0 ? (totalYears / count) : 0;
            
            if (avgYears < 5.0) {
                return "New Agent";
            } else if (avgYears < 10.0) {
                return "Experienced Agent";
            } else if (avgYears < 15.0) {
                return "Sales Supervisor";
            } else if (avgYears < 20.0) {
                return "Sales Manager";
            } else {
                return "Agency Manager";
            }
        }

        // Master Render function to update active views
        function renderAll() {
            const hasData = parsedData && parsedData.length > 0;
            
            // Get all sections and switcher UI elements
            const mainNav = document.getElementById('main-nav');
            const capsuleTabs = document.querySelector('.capsule-tabs-container');
            const subFilters = document.getElementById('sub-filters-container');
            const viewPersonas = document.getElementById('view-personas');
            const viewJourneys = document.getElementById('view-journeys');
            const viewAnalytics = document.getElementById('view-analytics');
            
            // Get or create empty state placeholder
            let emptyState = document.getElementById('empty-state-placeholder');
            
            if (!hasData) {
                // Hide normal dashboard views and navigation switchers
                if (mainNav) mainNav.style.display = 'none';
                if (capsuleTabs) capsuleTabs.style.display = 'none';
                if (subFilters) subFilters.style.display = 'none';
                if (viewPersonas) viewPersonas.style.display = 'none';
                if (viewJourneys) viewJourneys.style.display = 'none';
                if (viewAnalytics) viewAnalytics.style.display = 'none';
                
                // Show empty state dropzone
                if (!emptyState) {
                    emptyState = document.createElement('div');
                    emptyState.id = 'empty-state-placeholder';
                    emptyState.className = 'glass-panel';
                    emptyState.style.cssText = `
                        text-align: center;
                        padding: 6rem 2rem;
                        margin: 2rem auto;
                        max-width: 800px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1.5rem;
                        border-radius: 16px;
                        border: 1px dashed rgba(255, 255, 255, 0.15);
                        background: rgba(30, 34, 42, 0.4);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    `;
                    emptyState.innerHTML = `
                        <div style="font-size: 4rem; animation: pulse 2s infinite;">📊</div>
                        <h2 style="margin: 0; font-weight: 600; font-size: var(--fs-display); color: var(--accent-yellow); letter-spacing: 0.5px;">Please Upload Survey Data for Analysis</h2>
                        <p style="margin: 0; font-size: var(--fs-subtitle); color: var(--text-secondary); max-width: 500px; line-height: 1.7;">
                            No survey data loaded yet. Please click the <strong>"Upload Survey Data"</strong> button in the upper right corner and select a CSV file. The system will automatically: 
                        </p>
                        <ul style="text-align: left; font-size: var(--fs-body); color: var(--text-muted); line-height: 1.8; margin: 0; padding-left: 20px; max-width: 450px;">
                            <li>Group agents automatically into 5 data-driven clusters</li>
                            <li>Visualize customer Sales Journeys and satisfaction curves</li>
                            <li>Extract word clouds for core needs, pains, and contradictions</li>
                            <li>Integrate multi-dimensional survey metrics and agent verbatims</li>
                        </ul>
                    `;
                    // Insert after main-navigator or capsule-tabs
                    const mainContainer = document.querySelector('.container');
                    if (mainContainer) {
                        mainContainer.appendChild(emptyState);
                    }
                } else {
                    emptyState.style.display = 'flex';
                }
                return;
            }

            // If there is data, show normal views
            if (mainNav) mainNav.style.display = 'flex';
            
            if (activeSection === 'analytics' || activeSection === 'about' || activeSection === 'faq') {
                if (capsuleTabs) capsuleTabs.style.display = 'none';
                if (subFilters) subFilters.style.display = 'none';
            } else if (activeSection === 'journeys') {
                if (capsuleTabs) capsuleTabs.style.display = 'flex';
                if (subFilters) subFilters.style.display = 'none';
            } else {
                if (capsuleTabs) capsuleTabs.style.display = 'flex';
                if (subFilters) subFilters.style.display = 'none'; // sub-filters removed, see renderSubFilters()
            }
            
            const viewIds = ['personas', 'journeys', 'analytics'];
            viewIds.forEach(v => {
                const el = document.getElementById(`view-${v}`);
                if (el) {
                    if (v === activeSection) {
                        el.style.display = 'block';
                        el.classList.add('active');
                    } else {
                        el.style.display = 'none';
                        el.classList.remove('active');
                    }
                }
            });
            
            // Toggle download button state
            const dlBtn = document.getElementById('download-btn-header');
            const dlText = document.getElementById('download-btn-text');
            if (dlBtn) {
                dlBtn.style.display = 'none';
            }
            
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            // Update Counts
            const total = parsedData.length;
            const counts = getArchetypeCounts();

            // top-bar respondent count
            const countPill = document.getElementById('topbar-count');
            if (countPill) countPill.textContent = total.toLocaleString() + (currentLang === 'zh' ? ' 位受訪者' : ' respondents');

            // KPIs
            const ids = ['kpi-total', 'kpi-explorer', 'kpi-expert', 'kpi-optimizer', 'kpi-skeptic', 'kpi-parttimer'];
            const vals = [total, counts.explorer, counts.expert, counts.optimizer, counts.skeptic, counts.parttimer];
            ids.forEach((id, idx) => {
                const el = document.getElementById(id);
                if (el) el.textContent = vals[idx];
            });

            // Update sub-filters display
            renderSubFilters();

            // Update Demographics Analysis
            renderDemographics();

            // Update respective view details
            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            } else if (activeSection === 'analytics') {
                renderAnalyticsView();
            }
            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }
        }

        // ===== PAIN THEMES: group free-text pain points into recurring problems, each with a specific action and a success measure =====
        // {stage} = stage name, {tool} = most-used system at that stage (people are skipped).
        const PAIN_THEMES = [
            { k: 'reentry', kw: ['re-enter', 're-entering', 'twice', 'same client data', 'retype', 're-key', '重複輸入', '重複鍵入', '重新輸入', '重複填', '重新鍵入'],
              en: { label: 'Duplicate data entry', act: 'Capture each data item once in {stage} and pre-fill it in every later form and system (one source of record){tool}, so nobody re-types the same details.', metric: 'Fields re-keyed per case; time to complete {stage}' },
              zh: { label: '重複輸入資料', act: '在「{stage}」只輸入一次資料，並自動帶入後續所有表單與系統（單一資料來源）{tool}，避免重複鍵入。', metric: '每件案件重複鍵入的欄位數；完成「{stage}」所需時間' } },
            { k: 'resubmit', kw: ['re-upload', 'rejected', 'resubmit', 're-submit', '退件', '重新上傳', '被退', '駁回', '補件'],
              en: { label: 'Rejected & re-submitted documents', act: 'Validate documents before submission in {stage} (format, completeness, readable preview) and return a specific rejection reason, so each problem is fixed once.', metric: 'First-time acceptance rate; re-uploads per case' },
              zh: { label: '文件被退件、重新上傳', act: '在「{stage}」送出前先檢核文件（格式、完整性、預覽），退件時明確告知原因，讓問題一次改好。', metric: '首次通過率；每件案件重新上傳次數' } },
            { k: 'convert', kw: ['convert', 'pdf', 'conversion', '轉檔', '轉換', '掃描'],
              en: { label: 'Manual file conversion', act: 'Accept the original file types directly in {stage} and convert automatically on upload, removing the manual format step.', metric: 'Manual conversion steps per case' },
              zh: { label: '手動轉檔', act: '「{stage}」直接接受原始檔案格式並於上傳時自動轉換，省去手動轉檔。', metric: '每件案件手動轉檔次數' } },
            { k: 'sync', kw: ['sync', 're-check', 'recheck', 'mismatch', 'inconsistent', 'not match', '同步', '不一致', '對不上', '核對'],
              en: { label: 'Data not syncing / manual re-checking', act: 'Connect the systems used in {stage}{tool} so figures update in both places, and show a "last synced" time so nobody has to cross-check by hand.', metric: 'Manual re-checks per case; data discrepancy reports' },
              zh: { label: '資料未同步、需人工核對', act: '串接「{stage}」使用的系統{tool}，讓數據雙向自動更新，並顯示「最後同步時間」，免去人工交叉核對。', metric: '每件案件人工核對次數；資料不一致回報數' } },
            { k: 'switching', kw: ['switching', 'tabs', 'between systems', 'multiple systems', 'multi-tab', '切換', '多個系統', '來回'],
              en: { label: 'Switching between systems', act: 'Bring what is needed in {stage} into one workspace (embedded views, links that carry context){tool}, so people stop jumping between tabs.', metric: 'Systems or tabs opened per case' },
              zh: { label: '在多個系統間切換', act: '把「{stage}」所需資訊整合在同一工作區（內嵌檢視、帶入情境的連結）{tool}，減少來回切換。', metric: '每件案件開啟的系統／分頁數' } },
            { k: 'find', kw: ['hunting', 'find the right', 'form version', 'locate', 'historical', 'records', 'search', '找不到', '尋找', '查找', '版本', '歷史', '紀錄'],
              en: { label: 'Hard to find the right form or record', act: 'Add search and a "recommended for this task" shortlist in {stage}, and retire outdated form versions so only the current one shows.', metric: 'Time to locate the right form or record' },
              zh: { label: '找不到正確表單或紀錄', act: '在「{stage}」加入搜尋與「此任務推薦」捷徑，並下架舊版表單，只顯示最新版本。', metric: '找到正確表單或紀錄所需時間' } },
            { k: 'error', kw: ['error', 'fail', 'crash', 'bug', '錯誤', '失敗', '當機', '異常'],
              en: { label: 'System errors', act: 'Rank the error messages raised in {stage}{tool}, make each one say what happened and what to do next, and fix the most frequent root causes first.', metric: 'Errors per 100 transactions in {stage}' },
              zh: { label: '系統錯誤', act: '彙整「{stage}」{tool}最常出現的錯誤訊息，改成「發生什麼＋下一步怎麼做」，並優先修正高頻原因。', metric: '「{stage}」每百筆交易錯誤數' } },
            { k: 'chase', kw: ['chasing', 'colleague', 'senior', 'follow up with', '催', '同事', '請教', '主管'],
              en: { label: 'Chasing people for help or approval', act: 'Make the answers people chase for in {stage} self-serve (status tracker, owner, expected turnaround), and route unavoidable approvals with automatic reminders.', metric: 'Manual follow-ups per case; turnaround time' },
              zh: { label: '需要追人協助或核准', act: '把「{stage}」中大家常追問的答案做成自助查詢（進度追蹤、負責人、預計時程），無法避免的核准則自動提醒。', metric: '每件案件人工追蹤次數；處理時程' } },
            { k: 'login', kw: ['log back in', 'logging back', 'logged out', 'password', 'session', 'log in again', '登入', '密碼', '登出', '重新驗證'],
              en: { label: 'Repeated login / password resets', act: 'Offer single sign-on, biometric or remembered-device login across the tools used in {stage}{tool}, with self-service password reset.', metric: 'Re-logins and password-reset requests per week' },
              zh: { label: '重複登入／密碼重設', act: '「{stage}」使用的工具{tool}統一單一登入，並支援生物辨識或記住裝置，提供自助重設密碼。', metric: '每週重新登入與密碼重設次數' } },
            { k: 'slow', kw: ['slow', 'delay', 'waiting', 'lag', 'latency', 'loading', 'peak', 'response', '慢', '延遲', '等待', '卡頓', '轉圈', '高峰'],
              en: { label: 'Slow system response', act: 'Profile the slowest screens and calls in {stage}{tool}, fix the worst first, and autosave drafts so a slow response never loses work.', metric: 'Median response time; abandonment during {stage}' },
              zh: { label: '系統反應慢', act: '找出「{stage}」最慢的畫面與呼叫{tool}，優先修正，並自動暫存草稿，避免因延遲而遺失資料。', metric: '平均回應時間；「{stage}」中途放棄率' } },
            { k: 'approval', kw: ['approval', 'too long', 'underwriting', '審核', '太久', '核保', '照會', '進案'],
              en: { label: 'Slow approval / underwriting', act: 'Show a live status and expected completion time for each case in {stage}, and add a fast lane for complete, low-risk submissions.', metric: 'Approval turnaround time; status enquiries per case' },
              zh: { label: '審核／核保耗時', act: '「{stage}」每件案件顯示即時進度與預計完成時間，並為完整、低風險案件設置快速通道。', metric: '審核處理天數；每件案件進度詢問次數' } },
            { k: 'notify', kw: ['notification', 'alert', 'miss', '通知', '提醒', '漏掉', '錯過'],
              en: { label: 'Missed notifications', act: 'Send real-time push notifications for the events people miss in {stage} and keep them in one notification centre with read / unread state.', metric: 'Missed-deadline incidents; time to respond to a notice' },
              zh: { label: '通知漏接', act: '針對「{stage}」中容易漏掉的事件即時推播，並集中於通知中心管理已讀／未讀。', metric: '錯過期限件數；回應通知所需時間' } },
            { k: 'steps', kw: ['too many steps', 'simple task', 'clicks', '步驟太多', '繁瑣', '點擊', '流程過長'],
              en: { label: 'Too many steps for simple tasks', act: 'Map the click path of the most frequent task in {stage}, cut it to the minimum and add a shortcut for it on the home screen.', metric: 'Clicks and time for the most frequent task in {stage}' },
              zh: { label: '簡單任務步驟太多', act: '盤點「{stage}」最常見任務的操作路徑，縮減到最少步驟並在首頁加入捷徑。', metric: '「{stage}」最常見任務的點擊數與耗時' } },
            { k: 'usability', kw: ['intuitive', 'tech-savvy', 'older', 'mobile version', 'not user-friendly', 'mobile browser', '直覺', '長輩', '資深', '複雜', '不會用', '手機版', '行動版', '難用'],
              en: { label: 'Hard to use / not intuitive', act: 'Run a short usability test of {stage} with the least tech-confident users, then simplify the layout (larger text, fewer options per screen, guided first use).', metric: 'Task success rate and time on task in usability tests' },
              zh: { label: '操作不直覺、難上手', act: '邀請最不熟悉科技的同仁對「{stage}」進行簡易可用性測試，據此簡化版面（放大字體、每頁精簡選項、首次使用引導）。', metric: '可用性測試的任務成功率與完成時間' } },
            { k: 'offline', kw: ['offline', 'remote', '離線', '遠距', '斷線', '沒網路'],
              en: { label: 'No offline / remote support', act: 'Let people complete and save {stage} work offline and sync automatically once connected.', metric: 'Tasks completed offline; sync failures' },
              zh: { label: '離線／遠距作業不便', act: '讓「{stage}」的作業可離線完成並暫存，連線後自動同步。', metric: '離線完成件數；同步失敗數' } },
            { k: 'guidance', kw: ['no clear guidance', 'unclear', 'not sure which', 'confusing', '沒有明確', '不清楚', '缺乏指引', '沒有指引'],
              en: { label: 'No clear guidance', act: 'Add in-flow guidance to {stage}: a short checklist, field-level hints where people stall, and a "what happens next" status after each step.', metric: 'Help requests and "how do I…" questions during {stage}' },
              zh: { label: '缺乏明確指引', act: '在「{stage}」流程中加入指引：簡短檢核清單、卡關欄位的提示，以及每一步之後的「接下來會發生什麼」。', metric: '「{stage}」期間的求助與「怎麼做」詢問數' } }
        ];

        // One theme per pain comment. Framing words ("Still...", "...because the data doesn't sync", "...which wastes 10 minutes") are removed
        // first so only the problem itself is classified; "no clear guidance" is used only when nothing more specific is found.
        function classifyPainThemes(text) {
            const raw = String(text || '').toLowerCase();
            if (!raw) return [];
            const core = raw.replace(/[,，]?\s*(which|because|instead of)\b.*$/, '').replace(/^\s*no clear guidance[,，]?\s*so\s*/, '');
            const hit = PAIN_THEMES.find(th => th.k !== 'guidance' && th.kw.some(kw => core.includes(kw)));
            if (hit) return [hit.k];
            const g = PAIN_THEMES.find(th => th.k === 'guidance');
            return g.kw.some(kw => raw.includes(kw)) ? ['guidance'] : [];
        }

        // Specific, evidence-based opportunity for one stage: top recurring problems -> action -> measure.
        function buildStageOpportunity(step, isZh, meanRating) {
            const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;');
            const stage = String(step.title || '').replace(/^\s*(Stage|階段)\s*\d+\s*[:：]?\s*/i, '') || step.title;
            const themes = (step.painThemes || []).filter(x => x.n > 0);
            const n = step.groupN || 0;
            const schemaRef = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            const officialSys = ((schemaRef && schemaRef.officialSystems) || []).map(x => String(x).trim().toLowerCase());
            const sysTool = (step.toolNames || []).find(nm => officialSys.includes(String(nm).trim().toLowerCase())) || '';
            const toolNote = sysTool ? (isZh ? `（此階段最常用系統：${sysTool}）` : ` (most-used system here: ${sysTool})`) : '';
            const rating = parseFloat(step.avgRating);
            const low = isFinite(rating) && isFinite(meanRating) && rating <= meanRating - 0.25;
            const lead = low ? `<div style="color:#fbbf24; margin-bottom:4px;">${isZh ? `優先處理：此階段評分 ${rating.toFixed(1)}，低於各階段平均 ${meanRating.toFixed(1)}` : `Priority: rated ${rating.toFixed(1)}, below the ${meanRating.toFixed(1)} average across stages`}</div>` : '';
            if (themes.length === 0) {
                return lead + (isZh
                    ? `此群組在「${esc(stage)}」未回報明顯痛點（評分 ${isFinite(rating) ? rating.toFixed(1) : '-'}）。維持現況並持續追蹤評分；若評分下滑，先訪談 3–5 位使用者找出原因。`
                    : `No clear pain point reported for ${esc(stage)} (rating ${isFinite(rating) ? rating.toFixed(1) : '-'}). Keep it stable and track the rating; if it drops, interview 3&ndash;5 users to find out why.`);
            }
            const shown = themes.slice(0, 1);
            const also = themes.slice(1, 3).map(x => { const th = PAIN_THEMES.find(p => p.k === x.k); return esc(isZh ? th.zh.label : th.en.label); });
            const blocks = shown.map(x => {
                const th = PAIN_THEMES.find(p => p.k === x.k); const L = isZh ? th.zh : th.en;
                const fill = s => s.replace(/\{stage\}/g, esc(stage)).replace(/\{tool\}/g, x.k === 'chase' ? '' : toolNote);
                const pct = n ? Math.round(x.n / n * 100) : 0;
                return `<div style="margin-bottom:8px;"><strong style="color:#fff;">${esc(L.label)}</strong> <span style="color:var(--text-muted);">&middot; ${pct}% (${x.n}/${n})</span>
                    <div>${fill(L.act)}</div>
                    <div style="color:var(--text-muted);">${isZh ? '成效指標：' : 'Measure: '}${fill(L.metric)}</div></div>`;
            }).join('');
            const alsoLine = also.length ? `<div style="color:var(--text-muted);">${isZh ? '另也常見：' : 'Also frequent: '}${also.join(isZh ? '、' : ', ')}</div>` : '';
            return lead + blocks + alsoLine;
        }

        function generateDynamicOpportunity(stepPains, defaultOpp) {
            if (!stepPains || stepPains.length === 0) return defaultOpp;
            
            // Join all pain strings for word scanning
            const combinedPains = stepPains.map(p => p.toLowerCase()).join(' ');
            const isZh = (currentLang === 'zh');
            
            const ruleMappings = [
                { keywords: ['notification', 'alert', 'miss', '通知', '提醒', '漏掉', '錯過'], suggestion: isZh ? "建立行動裝置即時推播通知與集中式通知中心，確保關鍵通知與照會不漏接。" : "Implement real-time push notifications on mobile and a centralised notification centre so important alerts are never missed." },
                { keywords: ['re-enter', 'multiple systems', '重複', '多個系統', '重新鍵入', '重複輸入'], suggestion: isZh ? "建立單一客戶數據中心（SSO）與自動帶入機制，避免跨平台重複鍵入客戶資料。" : "Establish a single customer database (SSO) and auto-fill mechanism to prevent duplicate data entry across platforms." },
                { keywords: ['mobile version', 'not user-friendly', 'mobile browser', '手機版', '行動版', '難用', '不易操作'], suggestion: isZh ? "重新設計行動 App 介面，優化響應式排版、簡化導航流程並強化觸控體驗。" : "Redesign the mobile app interface with responsive layouts, simplified navigation, and touch-optimised controls." },
                { keywords: ['approval', 'too long', 'underwriting', '審核', '太久', '核保', '照會', '進案'], suggestion: isZh ? "精簡並自動化核保審查流程，提供即時狀態進度通知與快速審查綠色通道。" : "Streamline and automate the underwriting approval workflow with real-time status alerts and fast-track checks." },
                { keywords: ['too many steps', 'simple task', 'clicks', '步驟太多', '繁瑣', '點擊', '流程過長'], suggestion: isZh ? "優化操作流程，精簡點擊步驟、整合關聯畫面，並於首頁增設快捷功能按鈕。" : "Optimise the user flow by reducing clicks, merging related screens, and adding quick-action buttons on the homepage." },
                { keywords: ['intuitive', 'tech-savvy', 'older', '直覺', '長輩', '資深', '複雜', '不會用'], suggestion: isZh ? "提供大字體高對比度簡潔介面模式，並加入操作引導精靈協助資深業務員上手。" : "Create a simplified, high-contrast interface mode with guided tooltips and walkthrough wizards for senior colleagues." },
                { keywords: ['historical', 'quickly', 'records', '歷史', '快速', '紀錄', '查找', '查不到'], suggestion: isZh ? "導入全域模糊搜尋與時序篩選功能，秒級檢索保單歷程與客戶歷史紀錄。" : "Introduce global search with fuzzy logic and chronological filters to instantly retrieve historical policy or client records." },
                { keywords: ['offline', 'remote', '離線', '遠距', '斷線', '沒網路'], suggestion: isZh ? "開發完善的離線暫存與自動同步功能，支援無網路環境下製作建議書與檢閱資料。" : "Build a robust offline data sync feature, allowing agents to input proposals and retrieve saved details without an internet connection." },
                { keywords: ['search filter', 'locate', 'filters', '篩選', '搜尋', '定位', '標籤'], suggestion: isZh ? "擴充搜尋篩選維度，納入客群標籤、保戶價值分層與地理位置，大幅提升檢索效率。" : "Expand search filters to include tag queries, customer value tiers, and geographical filters for high-efficiency listing." },
                { keywords: ['slow', 'peak', 'response', '慢', '卡頓', '轉圈', '延遲', '高峰'], suggestion: isZh ? "優化資料庫查詢效能、導入前端快取機制，升級後端伺服器頻寬以降低尖峰時段延遲。" : "Optimise database query performance, leverage local caching, and upgrade backend server capacity to reduce page load latency." },
                { keywords: ['no significant', '無特別'], suggestion: isZh ? "持續定期追蹤業務同仁使用反饋，進行微幅體驗優化。" : "Regularly monitor feedback and look for incremental UX polishing opportunities." }
            ];

            for (const rule of ruleMappings) {
                if (rule.keywords.some(kw => combinedPains.includes(kw))) {
                    return rule.suggestion;
                }
            }
            
            return defaultOpp;
        }

        // Render Customer Journey Map matrix cards & curve (Column details matching Picture 1)
        function renderJourneyView() {
            let p = Object.assign({}, getPersonaDisplayInfo(activePersona));
            if (ensureManualOverride(activePersona).name) p.name = manualOverrides[activePersona].name;
            const activeGroupAgents = getActiveGroupAgents();
            
            if (selectedAgent) {
                p.name = selectedAgent.name;
            }
            const calculatedPosition = selectedAgent ? (selectedAgent.Position || "Sales Agent") : (activeGroupAgents.length > 0 ? getClusterRepresentativeTitle(activeGroupAgents) : "Sales Agent");
            
            // Calculate dynamic keywords for contradictions and needs
            const barriersList = activeGroupAgents.map(a => a.Conflict).filter(Boolean);
            const needsList = activeGroupAgents.map(a => a.Needs).filter(Boolean);
            const barriersKeywords = calculateKeywords(barriersList);
            const needsKeywords = calculateKeywords(needsList);
            
            const topBarriersList = barriersKeywords.slice(0, 2).map(k => k.word).filter(Boolean);
            const topBarriers = topBarriersList.length > 0 ? topBarriersList.join(', ') : p.contradiction;
            
            const topNeedsList = needsKeywords.slice(0, 2).map(k => k.word).filter(Boolean);
            const topNeeds = topNeedsList.length > 0 ? topNeedsList.join(', ') : p.needs.join(', ');
            
            // Calculate dynamic journey steps
            const activeAgents = selectedAgent ? [selectedAgent] : activeGroupAgents;
            const calculatedJourneySteps = calculateTimelineJourney(activeAgents);
            
            // 1. Overview Row
            const overviewBox = document.getElementById('journey-overview-box');
            if (overviewBox) {
                overviewBox.innerHTML = `
                    <div class="j-overview-info" style="padding-top: 0; margin-top: 0; display: flex; flex-direction: column; justify-content: flex-start; align-self: start;">
                        <h4 style="display: flex; align-items: center; gap: 8px; margin: 0 0 8px 0; padding: 0; line-height: 1.2;">
                            ${p.name}
                            <span style="font-size: var(--fs-caption); font-weight: normal; color: var(--accent-yellow); border: 1px solid var(--accent-yellow); padding: 1px 6px; border-radius: 4px; vertical-align: middle;">${t('titlePrefix')} ${calculatedPosition}</span>
                        </h4>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${p.role.split('/').map(t => `<span style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px; font-size: var(--fs-caption); color: var(--text-secondary);">${t.trim()}</span>`).join('')}
                        </div>
                    </div>
                    <div class="j-overview-block" style="padding-top: 0; margin-top: 0; align-self: start;">
                        <strong style="margin-top: 0; line-height: 1.2;">${t('coreConflictsSimple')}</strong>
                        ${topBarriers}
                    </div>
                    <div class="j-overview-block" style="padding-top: 0; margin-top: 0; align-self: start;">
                        <strong style="margin-top: 0; line-height: 1.2;">${t('coreNeedsSimple')}</strong>
                        ${topNeeds}
                    </div>
                `;
            }

            // Determine the dominant archetype to fetch qualitative action descriptions
            const profiles = window.__dynamicClusterProfiles || [];
            const profile = profiles.find(pr => pr.key === activePersona);
            let dominantArchetype = (profile && profile.dominantArchetype) ? profile.dominantArchetype : (PERSONA_DETAILS[activePersona] ? activePersona : 'explorer');

            // Normalise dominant archetype key if it comes from the CSV
            if (dominantArchetype.includes('OpportunityHunter') || dominantArchetype.includes('parttimer')) dominantArchetype = 'parttimer';
            else if (dominantArchetype.includes('RelationshipBuilder') || dominantArchetype.includes('expert')) dominantArchetype = 'expert';
            else if (dominantArchetype.includes('StrategicOperator') || dominantArchetype.includes('optimizer')) dominantArchetype = 'optimizer';
            else if (dominantArchetype.includes('ServiceSpecialist') || dominantArchetype.includes('skeptic')) dominantArchetype = 'skeptic';
            else if (dominantArchetype.includes('DigitalFringeRookie') || dominantArchetype.includes('explorer')) dominantArchetype = 'explorer';
            
            

            // 2. Matrix Cards Group (Flat-render cells to align columns row-by-row dynamically)
            const matrixBox = document.getElementById('journey-matrix-box');
            if (matrixBox) {
                const stageCount = calculatedJourneySteps.length;
                matrixBox.style.gridTemplateColumns = `repeat(${stageCount}, 1fr)`;
                let headersHTML = '';
                let tasksHTML = '';
                let locationsHTML = '';
                let toolsHTML = '';
                
                for (let i = 0; i < stageCount; i++) {
                    const step = calculatedJourneySteps[i] || { title: "Task", contexts: [], tools: [], pains: [] };
                    
                    // Fetch qualitative actions from active schema or JOURNEY_STAGE_INFO
                    const activeSchema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
                    const stageObj = (activeSchema && activeSchema.stages) ? activeSchema.stages[i] : null;
                    let actionsText = '';
                    if (stageObj && stageObj.qualitative) {
                        const qualData = stageObj.qualitative[dominantArchetype] || stageObj.qualitative["all"];
                        if (qualData) actionsText = qualData.actions;
                    }
                    if (!actionsText) {
                        const stageInfoList = (currentLang === 'zh' && typeof JOURNEY_STAGE_INFO_ZH !== 'undefined') ? JOURNEY_STAGE_INFO_ZH : (typeof JOURNEY_STAGE_INFO_EN !== 'undefined' ? JOURNEY_STAGE_INFO_EN : JOURNEY_STAGE_INFO);
                        const stageInfo = stageInfoList[i] || JOURNEY_STAGE_INFO[i];
                        const activeArchetypeData = stageInfo ? (stageInfo[dominantArchetype] || stageInfo["all"]) : null;
                        actionsText = activeArchetypeData ? activeArchetypeData.actions : '';
                    }
                    
                    const actionsList = step.actions || [];
                    const actionsListHTML = `<ul style="margin: 0; padding-left: 14px; font-size: var(--fs-caption); line-height: 1.45; color: var(--text-secondary); text-align: left;">
                        ${actionsList.map(act => `<li style="margin-bottom: 2px;">${act}</li>`).join('')}
                    </ul>`;
                    
                    const actionsHTML = `
                        <div style="flex: 1 0 155px; box-sizing: border-box;">
                            ${actionsListHTML}
                        </div>
                        <div style="font-size: var(--fs-caption); font-style: italic; color: var(--text-muted); text-align: left; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.06); width: 100%;">
                            <strong>${t('executionStyle')}</strong> "${actionsText}"
                        </div>
                    `;
                    
                    const stepLocationsHTML = step.contexts && step.contexts.length > 0 ? 
                        `<div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:4px;">
                            ${step.contexts.map(loc => `<span style="background:rgba(46,204,113,0.08); border:1px solid rgba(46,204,113,0.2); color:#2ecc71; padding:1px 5px; border-radius:3px; font-size:var(--fs-caption);">${loc}</span>`).join('')}
                         </div>` : `<span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('noLocation')}</span>`;

                    const stepToolsHTML = step.tools && step.tools.length > 0 ? 
                        `<div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:4px;">
                            ${step.tools.map(ctx => `<span style="background:rgba(64,150,255,0.08); border:1px solid rgba(64,150,255,0.2); color:#4096ff; padding:1px 5px; border-radius:3px; font-size:var(--fs-caption);">${ctx}</span>`).join('')}
                         </div>` : `<span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('noTools')}</span>`;

                    headersHTML += `
                        <div class="j-matrix-header" style="border-bottom: 2.5px solid var(--colour-${activePersona})">
                            ${step.title}
                        </div>
                    `;
                    
                    tasksHTML += `
                        <div class="j-cell-card task-card" style="min-height: 290px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 10px;">
                            ${actionsHTML}
                        </div>
                    `;
                    
                    locationsHTML += `
                        <div class="j-cell-card location-card" style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;">
                            <strong>${t('physicalDigitalLocation')}</strong>
                            ${stepLocationsHTML}
                        </div>
                    `;
                    
                    toolsHTML += `
                        <div class="j-cell-card tool-card" style="height: 100%; display: flex; flex-direction: column; justify-content: flex-start;">
                            <strong>${t('touchpoints')}</strong>
                            ${stepToolsHTML}
                        </div>
                    `;
                }
                
                matrixBox.innerHTML = headersHTML + tasksHTML + locationsHTML + toolsHTML;
            }

            // 3. Dynamic Emotional Curve Coord Calculation
            updateEmotionalCurve();

            // 4. Matrix Footers (Pain Points & Opportunities)
            const footerBox = document.getElementById('journey-footer-box');
            if (footerBox) {
                const stageCount = calculatedJourneySteps.length;
                footerBox.style.gridTemplateColumns = `repeat(${stageCount}, 1fr)`;
                let footHTML = '';
                for (let i = 0; i < stageCount; i++) {
                    const step = calculatedJourneySteps[i] || { pains: [] };
                    const painsHTML = step.pains.length > 0 ? 
                        `<div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:4px; justify-content:flex-start;">
                            ${step.pains.map(pn => `<span style="background:rgba(255,77,79,0.08); border:1px solid rgba(255,77,79,0.2); color:#ff4d4f; padding:1px 5px; border-radius:3px; font-size:var(--fs-caption); word-break:normal; overflow-wrap:break-word; display:inline-block;">${pn}</span>`).join('')}
                         </div>` : (currentLang === 'zh' ? "無特定痛點" : "No specific pain points");
                         
                    footHTML += `
                        <div class="j-footer-card pain-row">
                            <h5>⚠️ ${t('painPoints')}</h5>
                            ${painsHTML}
                        </div>
                    `;
                }
                // Add bulbs recommendations
                let bulbHTML = '';
                const _rt = calculatedJourneySteps.map(x => parseFloat(x.avgRating)).filter(isFinite);
                const meanStageRating = _rt.length ? _rt.reduce((a, b) => a + b, 0) / _rt.length : NaN;
                for (let i = 0; i < 6; i++) {
                    const step = calculatedJourneySteps[i] || { pains: [] };
                    const opps = p.opportunities || [];
                    const defaultOpp = opps[i] ? opps[i] : (opps[i-1] ? opps[i-1] : (currentLang === 'zh' ? "優化系統連結與作業流程" : "Optimise system links and workflows"));
                    const cleanOppText = buildStageOpportunity(calculatedJourneySteps[i] || {}, currentLang === 'zh', meanStageRating);
                    bulbHTML += `
                        <div class="j-footer-card opp-row">
                            <h5>💡 ${currentLang === 'zh' ? "系統優化機會" : "Optimisation Opportunity"}</h5>
                            <div style="font-size:var(--fs-small); line-height:1.5; color:var(--text-secondary);">${cleanOppText}</div>
                        </div>
                    `;
                }
                footerBox.innerHTML = footHTML + bulbHTML;
            }

            // Maintain highlight on previously active stage
            selectJourneyStage(activeStageIndex);
        }

        function getArchetypeCounts() {
            const counts = { explorer: 0, expert: 0, optimizer: 0, skeptic: 0, parttimer: 0 };
            parsedData.forEach(d => counts[d.archetype]++);
            return counts;
        }

        // View toggle function
        function switchMainSection(section) {
            activeSection = section;
            if (section === 'about' || section === 'faq') {
                const tc = document.querySelector('.capsule-tabs-container'), sf = document.getElementById('sub-filters-container');
                if (tc) tc.style.display = 'none';
                if (sf) sf.style.display = 'none';
                ['personas', 'journeys', 'analytics', 'about', 'faq'].forEach(v => {
                    const b = document.getElementById(`btn-sec-${v}`), el = document.getElementById(`view-${v}`);
                    if (b) b.classList.toggle('active', v === section);
                    if (el) { el.classList.toggle('active', v === section); el.style.display = (v === section) ? 'block' : 'none'; }
                });
                window.scrollTo(0, 0);
                return;
            }
            ['about', 'faq'].forEach(v => { const ev = document.getElementById(`view-${v}`), eb = document.getElementById(`btn-sec-${v}`);
              if (ev) { ev.classList.remove('active'); ev.style.display = 'none'; } if (eb) eb.classList.remove('active'); });
            
            const tabsContainer = document.querySelector('.capsule-tabs-container');
            const subFiltersContainer = document.getElementById('sub-filters-container');
            const allTabBtn = document.querySelector('.capsule-tab.all-tab');
            
            if (section === 'analytics' || section === 'journeys') {
                // Hide tabs entirely on Analytics & DB tab and sub-filters on Journey Map
                if (tabsContainer) tabsContainer.style.display = section === 'analytics' ? 'none' : 'flex';
                if (subFiltersContainer) subFiltersContainer.style.display = 'none';
                if (section === 'analytics') {
                    activePersona = 'all';
                }
            } else {
                // Show tabs for Personas and Journeys (Cohorts 01 - 05 only)
                if (tabsContainer) tabsContainer.style.display = 'flex';
                if (subFiltersContainer) subFiltersContainer.style.display = 'none'; // sub-filters removed
                if (allTabBtn) allTabBtn.style.display = 'none'; // Hide All tab button globally from tabs bar
                
                // If switching away from analytics, restore to the first discovered cluster
                if (activePersona === 'all') {
                    const profiles = window.__dynamicClusterProfiles || [];
                    activePersona = profiles.length > 0 ? profiles[0].key : 'c0';
                }
            }

            // Buttons CSS
            document.getElementById('btn-sec-personas').classList.remove('active');
            document.getElementById('btn-sec-journeys').classList.remove('active');
            document.getElementById('btn-sec-analytics').classList.remove('active');
            document.getElementById(`btn-sec-${section}`).classList.add('active');

            // Panels CSS
            document.getElementById('view-personas').classList.remove('active');
            document.getElementById('view-journeys').classList.remove('active');
            document.getElementById('view-analytics').classList.remove('active');
            document.getElementById(`view-${section}`).classList.add('active');

            renderAll();
        }

        // Switch archetype (Runs in both views)
        function switchArchetype(key) {
            activePersona = key;
            activeSubFilter = "ALL";
            demographicsCollapsed = true; // Default is closed on tab switch

            // Redraw tabs to update inline active/inactive styles!
            renderArchetypeTabs();

            // Update sub-filters display
            renderSubFilters();

            // Update Demographics Profile panel
            renderDemographics();

            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            } else if (activeSection === 'analytics') {
                renderAnalyticsView();
            }
            if (typeof initAnalyticsRadarChart === 'function') {
                initAnalyticsRadarChart();
            }
        }

        // Renders the archetype/cluster tab bar from window.__dynamicClusterProfiles --
        // however many clusters the last clustering run actually found, not a fixed count.
        function renderArchetypeTabs() {
            const container = document.getElementById('capsule-tabs-container');
            if (!container) return;
            const profiles = window.__dynamicClusterProfiles || [];

            const tabsHtml = profiles.filter(p => p.key !== 'outlier').map((p, idx) => {
                const isActive = activePersona === p.key || (idx === 0 && !profiles.some(pp => pp.key === activePersona));
                
                // Read from manualOverrides if the user renamed the cluster
                const override = manualOverrides[p.key];
                const displayName = (override && override.name) ? override.name : `${t('cluster')} ${idx + 1}`;
                const displayDesc = `${p.label} (n=${p.count})`;
                
                const borderStyle = isActive ? `border-color: ${p.color};` : 'border-color: rgba(255,255,255,0.08);';
                const bgStyle = isActive ? `background: ${p.color}15;` : 'background: transparent;';
                const colorStyle = isActive ? `color: ${p.color};` : 'color: #718096;';
                const dotStyle = isActive ? `background-color: ${p.color};` : 'background-color: #4a5568;';
                
                return `<button class="capsule-tab${isActive ? ' active' : ''}" data-key="${p.key}"
                        style="${borderStyle} ${bgStyle} ${colorStyle} transition: all 0.2s; cursor: pointer; padding: 7px 16px;"
                        title="${displayDesc}"
                        onclick="switchArchetype('${p.key}')">
                        <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: var(--fs-body); color: inherit;">
                            <span class="dot" style="${dotStyle} margin: 0; transition: all 0.2s;"></span>
                            ${displayName}
                        </div>
                    </button>`;
            }).join('');

            const allActive = activePersona === 'all';
            container.innerHTML = tabsHtml + `<button class="capsule-tab all-tab${allActive ? ' active' : ''}" data-key="all" style="display: none;" onclick="switchArchetype('all')"><span class="dot"></span>All</button>`;

            // If the currently active key no longer exists in the new profile set (e.g. after
            // re-clustering a new upload), fall back to the first discovered cluster.
            if (activePersona !== 'all' && !profiles.some(p => p.key === activePersona) && profiles.length > 0) {
                activePersona = profiles[0].key;
            }
        }


        // Toggle demographics visibility on Persona tab
        function toggleDemographicsCollapse() {
            demographicsCollapsed = !demographicsCollapsed;
            const content = document.getElementById('demographics-collapse-content');
            const icon = document.getElementById('demographics-toggle-icon');
            if (content) {
                content.style.display = demographicsCollapsed ? 'none' : 'grid';
            }
            if (icon) {
                icon.innerHTML = demographicsCollapsed ? 'Expand ▽' : 'Collapse △';
            }
        }

        // Switch active quote category and render list & word cloud on Analytics tab
        function switchQuoteCategory(cat) {
            // Update tab styles
            const container = document.getElementById('quote-category-tabs');
            if (container) {
                container.querySelectorAll('.quote-category-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.borderColor = 'rgba(255,255,255,0.1)';
                    btn.style.background = 'rgba(255,255,255,0.02)';
                    btn.style.color = 'var(--text-secondary)';
                });
                
                // Set active style for selected tab
                const activeBtn = container.querySelector(`button[onclick*="${cat}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                    activeBtn.style.borderColor = 'var(--accent-yellow)';
                    activeBtn.style.background = 'rgba(241, 196, 15, 0.08)';
                    activeBtn.style.color = 'var(--accent-yellow)';
                }
            }
            
            // Fetch quotes
            const quotes = window.categorizedQuotes ? window.categorizedQuotes[cat] : [];
            
            // Render word cloud (Left)
            const cloudContainer = document.getElementById('quote-category-cloud');
            if (cloudContainer) {
                if (quotes.length === 0) {
                    cloudContainer.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:var(--fs-small); width:100%;">No keywords</div>`;
                } else {
                    const textList = quotes.map(q => q.text);
                    const keywords = calculateKeywords(textList, true);
                    renderWordCloud(keywords, 'quote-category-cloud');
                }
            }
            
            // Render list (Right)
            const listContainer = document.getElementById('quote-category-list');
            if (!listContainer) return;
            
            if (quotes.length === 0) {
                listContainer.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:var(--fs-small); width:100%;">No verbatims available for this category</div>`;
                return;
            }
            
            const uniqueQuotes = [];
            const seenInTab = new Set();
            quotes.forEach(q => {
                if (!seenInTab.has(q.text)) {
                    seenInTab.add(q.text);
                    uniqueQuotes.push(q);
                }
            });
            
            listContainer.innerHTML = uniqueQuotes.map(q => {
                const quoteText = q.text || "";
                const expRange = q.agent.Experience || "Unknown Tenure";
                const position = q.agent.Position || "Sales Agent";
                return `
                    <div class="p-verbatim-item" style="padding: 12px 0; text-align: left;">
                        <p class="p-quote-text" style="font-size: var(--fs-body); line-height: 1.6; color: var(--text-primary); margin-bottom: 6px;">'${quoteText.replace(/[""'']/g, '')}'</p>
                        <span class="p-quote-author" style="font-size: var(--fs-caption); color: var(--text-secondary); display: block; text-align: right;">— ${position} (${expRange})</span>
                    </div>
                `;
            }).join('');

            // Render opportunities (Bottom)
            const opportunitiesContainer = document.getElementById('quote-category-opportunities');
            if (opportunitiesContainer) {
                const opportunitiesMap = {
                    sales: `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Marketing Script Digitization</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Build a built-in 'pitch and marketing asset library' in the AP system, supporting one-click copying to social media like LINE and WeChat. This helps agents instantly share compliant, engaging marketing content during prospecting and outreach.</p>
                            </div>
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Scenario-based Interactive Training</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Design modular scenario-based visit simulations tailored for rookies and agents of different tenures to address common objections (e.g., high premiums, doubts about digital tools), reducing reliance on senior verbal guidance.</p>
                            </div>
                        </div>
                    `,
                    relations: `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Automated Anniversary & Care Notifications</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">The system automatically pushes personalised greeting cards and curated care messages to agents before policy anniversaries, birthdays, and major holidays. It includes batch sending features to lower the time cost of manually managing existing client relationships.</p>
                            </div>
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Referral & Generation Transfer Toolkit</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Provide senior agents (e.g., 30+ years tenure) with an intuitive family relationship network graph, assisting them in wealth succession and referrals with fewer operational steps to create and track new prospect profiles.</p>
                            </div>
                        </div>
                    `,
                    tools: `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Single Sign-On & Mobile App Optimisation</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Optimise the login flow for mobile devices (e.g., FaceID/fingerprint), extend idle session timeouts, and reduce interruptions caused by frequent password inputs or 2FA, improving the mobile field operations experience.</p>
                            </div>
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Low-friction Lead Entry & Calendar Sync</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Support quick lead entry on mobile, simplify tedious required fields, and establish two-way synchronisation between the official system calendar and personal Google Calendars to eliminate inefficient manual copying.</p>
                            </div>
                        </div>
                    `,
                    knowledge: `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Fuzzy-Search Product Clause Database</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Reconstruct the complex and hard-to-navigate product clause database into a fuzzy-search keyword engine. This allows agents to quickly find answers on-site when asked about specific policy details.</p>
                            </div>
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Instant Visual Policy Audit Report</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Optimise the policy audit report format, using charts instead of dense tables, and simplify the premium calculator so agents can estimate premiums within a minute, significantly increasing sales persuasiveness on-site.</p>
                            </div>
                        </div>
                    `,
                    other: `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Progress Transparency & Stable Electronic Signing</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Improve progress tracking transparency so clients can see real-time updates on their applications. Optimise remote signature link expiration times to reduce signing failures and late underwriting queries.</p>
                            </div>
                            <div>
                                <strong style="color: var(--accent-yellow); font-size: var(--fs-small); display: block; margin-bottom: 6px;">💡 Real-Time Team Performance Dashboard</strong>
                                <p style="margin: 0; color: var(--text-secondary); font-size: var(--fs-small);">Automatically aggregate lead and activity reports for office managers and supervisors, replacing heavy paper-based logging and assisting in recruiting and team coaching decisions with real-time data.</p>
                            </div>
                        </div>
                    `
                };
                opportunitiesContainer.innerHTML = opportunitiesMap[cat] || `<div style="color: var(--text-muted);">Select a category to view optimisation opportunities</div>`;
            }
        }

        function renderSubFilters() {
            const container = document.getElementById('sub-filters-list');
            const box = document.getElementById('sub-filters-container');
            if (!container || !box) return;
            // Sub-filters were tenure-band sub-splits of a fixed archetype and no longer
            // apply under data-driven clustering -- always hidden now.
            box.style.display = 'none';
            container.innerHTML = '';
        }

        function setSubFilter(val) {
            activeSubFilter = val;
            renderSubFilters();
            renderDemographics();

            if (activeSection === 'personas') {
                renderPersonaView();
            } else if (activeSection === 'journeys') {
                renderJourneyView();
            }
        }

        // ==================== RENDERS ====================

        // Render Persona Dashboard View (Column details matching Picture 2)
        function renderPersonaView() {
            let p = Object.assign({}, getPersonaDisplayInfo(activePersona));
            
            const activeGroupAgents = getActiveGroupAgents();

            // Compute dynamic group averages for skills from the uploaded survey data
            if (!p.skills) p.skills = {};
            p.skills = Object.assign({}, p.skills);
            const activeSchema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            const activeMetrics = (activeSchema && activeSchema.metrics) ? activeSchema.metrics : [];

            if (activeGroupAgents.length > 0) {
                activeMetrics.forEach((m, mIdx) => {
                    const vals = activeGroupAgents.map(a => {
                        let v = a[m.key];
                        if (v === undefined) v = a[`Skill_Dim_${mIdx + 1}`];
                        if (v === undefined && m.key === 'Skill_Device') v = a.Skill_Device_Familiarity;
                        return v;
                    }).filter(v => v !== undefined && v !== null && !isNaN(parseFloat(v)));

                    const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length) : 50;
                    if (mIdx === 0) p.skills.device = avg;
                    else if (mIdx === 1) p.skills.knowledge = avg;
                    else if (mIdx === 2) p.skills.salesPitch = avg;
                    else if (mIdx === 3) p.skills.customerRelations = avg;
                    else if (mIdx === 4) p.skills.digitalTools = avg;
                    p.skills[`dim_${mIdx + 1}`] = avg;
                });
            }
            if (p.skills.device === undefined) p.skills.device = 50;

            const barriersList = activeGroupAgents.map(a => a.Conflict).filter(Boolean);
            const needsList = activeGroupAgents.map(a => a.Needs).filter(Boolean);
            const painsList = activeGroupAgents.map(a => a.Pains).filter(Boolean);

            const barriersKeywords = calculateKeywords(barriersList);
            const needsKeywords = calculateKeywords(needsList);
            const painsKeywords = calculateKeywords(painsList);

            const activeAgents = selectedAgent ? [selectedAgent] : activeGroupAgents;
            const calculatedJourneySteps = calculateTimelineJourney(activeAgents);
            const calculatedTools = calculateTopTools(activeAgents);

            const calculatedLabels = selectedAgent ? 
                (selectedAgent.Role_Badges ? selectedAgent.Role_Badges.split(/[;；,, , \s]+/).filter(Boolean).filter(tag => {
                    const rookieLabels = new Set(['Rookie Agent', '新進業務', '新手業務', '新進業務員', 'Insurance Newbie']);
                    if (rookieLabels.has(tag)) {
                        const exp = selectedAgent.Experience || '';
                        const pos = selectedAgent.Position || '';
                        const isExp = (exp && exp !== 'Under 1 year' && exp !== '未滿1年' && exp !== '1年以下') ||
                                      (pos && pos !== 'New Agent' && pos !== '新進業務員' && pos !== '新進業務');
                        if (isExp) return false;
                    }
                    return true;
                }) : []) : 
                calculateTopGroupLabels(activeGroupAgents);

            const calculatedAge = selectedAgent ? (selectedAgent.Age || p.age) : calculateModeValue(activeGroupAgents, 'Age', p.age);
            const calculatedExp = selectedAgent ? (selectedAgent.Experience || p.exp) : (activeSubFilter && activeSubFilter !== "ALL" ? activeSubFilter : p.exp);
            const calculatedCustomers = selectedAgent ? (selectedAgent.Clients || p.customers) : calculateModeValue(activeGroupAgents, 'Clients', p.customers);
            const calculatedPosition = selectedAgent ? (selectedAgent.Position || "Sales Agent") : (activeGroupAgents.length > 0 ? getClusterRepresentativeTitle(activeGroupAgents) : "Sales Agent");

            const topTasks = calculateDailyTasks(activeGroupAgents);
            let workData = p.work;
            // Generic fallback labels, used only when there's no real per-cluster task data
            // to compute from (topTasks below overrides this whenever real data exists).
            let workLabels = (currentLang === 'zh')
                ? ['專業知識提升', '開拓與客源開發', '客戶拜訪', '售後保全服務', '分處行政庶務']
                : ['Building Expertise', 'Maintaining Prospect List', 'Client Visits', 'Post-Sale Servicing', 'Internal Admin'];

            if (topTasks.length > 0) {
                workData = topTasks.map(t => t.val);
                workLabels = topTasks.map(t => t.name);
            }

            if (selectedAgent) {
                p.name = selectedAgent.name;
                if (selectedAgent.Description) p.desc = selectedAgent.Description;
                if (selectedAgent.Photo) p.photo = selectedAgent.Photo;
                if (selectedAgent.Quote) p.quote = selectedAgent.Quote;
                
                const customVerbatim = [];
                for (let i = 1; i <= 6; i++) {
                    const qKey = `Verbatim_${i}_Quote`;
                    const aKey = `Verbatim_${i}_Author`;
                    if (selectedAgent[qKey]) {
                        customVerbatim.push({
                            quote: selectedAgent[qKey],
                            author: selectedAgent[aKey] || "Anonymous"
                        });
                    }
                }
                if (customVerbatim.length > 0) {
                    p.verbatim = customVerbatim;
                }
                
                p.skills = Object.assign({}, p.skills);
                if (selectedAgent.Skill_Device !== undefined && selectedAgent.Skill_Device !== null) p.skills.device = selectedAgent.Skill_Device;
                if (selectedAgent.Skill_Knowledge !== undefined && selectedAgent.Skill_Knowledge !== null) p.skills.knowledge = selectedAgent.Skill_Knowledge;
                if (selectedAgent.Skill_Sales_Pitch !== undefined && selectedAgent.Skill_Sales_Pitch !== null) p.skills.salesPitch = selectedAgent.Skill_Sales_Pitch;
                if (selectedAgent.Skill_Customer_Relations !== undefined && selectedAgent.Skill_Customer_Relations !== null) p.skills.customerRelations = selectedAgent.Skill_Customer_Relations;
                if (selectedAgent.Skill_Digital_Tools !== undefined && selectedAgent.Skill_Digital_Tools !== null) p.skills.digitalTools = selectedAgent.Skill_Digital_Tools;
                
                if (selectedAgent.Work_Study !== undefined && selectedAgent.Work_Study !== null) {
                    workData = [
                        selectedAgent.Work_Study || 0,
                        selectedAgent.Work_Leads || 0,
                        selectedAgent.Work_Meetings || 0,
                        selectedAgent.Work_Social || 0,
                        selectedAgent.Work_Admin || 0
                    ];
                } else if (selectedAgent.sup !== undefined) {
                    const centroid = CENTROIDS[activePersona] || { sup: 3, wp: 3, ar: 3, pr: 3 };
                    const diffSup = selectedAgent.sup - centroid.sup;
                    const diffWp = selectedAgent.wp - centroid.wp;
                    const diffAr = selectedAgent.ar - centroid.ar;
                    
                    p.skills.device = Math.min(100, Math.max(5, Math.round(p.skills.device + (diffSup - diffAr) * 15)));
                    p.skills.knowledge = Math.min(100, Math.max(5, Math.round(p.skills.knowledge + diffSup * 20)));
                    p.skills.salesPitch = Math.min(100, Math.max(5, Math.round(p.skills.salesPitch + (diffWp - diffAr) * 10)));
                    p.skills.customerRelations = Math.min(100, Math.max(5, Math.round(p.skills.customerRelations + (diffWp - diffAr) * 10)));
                    p.skills.digitalTools = Math.min(100, Math.max(5, Math.round(p.skills.digitalTools + (diffSup - diffAr) * 15)));
                    
                    const wJitter = Math.round((diffWp + diffSup) * 3);
                    workData = p.work.map((w, idx) => {
                        if (idx === 0) return Math.max(0, w + wJitter);
                        if (idx === 2) return Math.max(0, w - wJitter);
                        return w;
                    });
                    const sum = workData.reduce((a,b)=>a+b, 0);
                    if (sum > 0) workData = workData.map(w => Math.round((w / sum) * 100));
                }
            }

            // Direct dashboard overrides (highest priority)
            const ov2 = ensureManualOverride(activePersona);
            if (ov2.name) p.name = ov2.name;
            if (ov2.desc) p.desc = ov2.desc;
            else if (!p.desc) {
                const profile = (window.__dynamicClusterProfiles || []).find(pr => pr.key === activePersona);
                if (profile) p.desc = `${profile.label} (n=${profile.count}) - Type To Change Persona Description`;
            }
            if (ov2.photo) p.photo = ov2.photo;
            if (ov2.quote) p.quote = ov2.quote;

            const container = document.getElementById('persona-layout-box');
            
            // Build dynamic quote lists for Column 3
            let verbatimHTML = '';
            if (activeGroupAgents.length > 0) {
                verbatimHTML = activeGroupAgents.map(agent => {
                    const quoteText = agent.Quote || "No verbatims";
                    const expRange = agent.Experience || "Unknown Tenure";
                    const position = agent.Position || "Sales Agent";
                    return `
                        <div class="p-verbatim-item">
                            <p class="p-quote-text">'${quoteText.replace(/[""'']/g, '')}'</p>
                            <span class="p-quote-author">— ${position} (${expRange})</span>
                        </div>
                    `;
                }).join('');
            } else {
                verbatimHTML = p.verbatim.map(v => {
                    const quoteText = v.quote || "No verbatims";
                    const position = p.role.split(' / ')[0]; // job title (e.g. "Rookie Agent", "Senior Producer", etc.)
                    const expRange = p.exp; // year range (e.g. "1-3 years / Rookie Phase")
                    return `
                        <div class="p-verbatim-item">
                            <p class="p-quote-text">'${quoteText.replace(/[""'']/g, '')}'</p>
                            <span class="p-quote-author">— ${position} (${expRange})</span>
                        </div>
                    `;
                }).join('');
            }

            container.innerHTML = `
                <!-- Column 1: Profile & Stats -->
                <div class="glass-panel p-col-card">
                    <div class="p-profile-section">
                        <div class="p-profile-meta" style="width: 100%;">
                            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
                                <input type="text" id="edit-name" value="${p.name}" oninput="showSaveButton('name')" placeholder="${t('enterPersonaName')}" style="background: transparent; border: none; border-bottom: 1px dashed rgba(255,255,255,0.2); color: #fff; font-size: var(--fs-heading); font-weight: 700; flex-grow: 1; min-width: 0; outline: none; margin-bottom: 6px; font-family: inherit; margin-right: 12px;">
                                <span style="font-size: var(--fs-body); color: ${p.color || '#8b5cf6'}; border: 1px solid ${p.color || '#8b5cf6'}; padding: 2px 8px; border-radius: 4px; white-space: nowrap; flex-shrink: 0;">${t('titlePrefix')} ${calculatedPosition}</span>
                                <button id="save-btn-name" onclick="saveManuallyEnteredValues()" style="display: none; padding: 4px 10px; font-size: var(--fs-body); background: #28a745; border: 1px solid #28a745; color: #fff; border-radius: 4px; cursor: pointer; white-space: nowrap; font-weight: 600;">${t('save')}</button>
                            </div>
                            <div class="tags-row">
                                ${calculatedLabels.map(t => `<span class="p-tag" style="background-color: ${p.color || '#8b5cf6'};">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 0.2rem; width: 100%;">
                        <textarea id="edit-desc" oninput="showSaveButton('desc')" placeholder="${t('enterPersonaDesc')}" style="width: 100%; height: 180px; background: transparent; border: 1px dashed rgba(255,255,255,0.15); color: var(--text-secondary); font-size: var(--fs-caption); line-height: 1.5; padding: 8px; border-radius: 6px; resize: none; outline: none; box-sizing: border-box; font-family: inherit; font-weight: 400;">${p.desc || ''}</textarea>
                        <button id="save-btn-desc" onclick="saveManuallyEnteredValues()" style="display: none; margin-top: 4px; padding: 2px 8px; font-size: var(--fs-small); background: #28a745; border: 1px solid #28a745; color: #fff; border-radius: 4px; cursor: pointer; float: right; font-weight: 600;">${t('saveDesc')}</button>
                        <div style="clear: both;"></div>
                    </div>
                    
                    <div class="p-stats-grid">
                        <div class="p-stat-box">
                            <svg class="p-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span class="lbl">${t('age')}</span>
                            <span class="val">${calculatedAge}</span>
                        </div>
                        <div class="p-stat-box">
                            <svg class="p-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            <span class="lbl">${t('experience')}</span>
                            <span class="val">${String(calculatedExp).split(' / ')[0]}</span>
                        </div>
                        <div class="p-stat-box">
                            <svg class="p-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <span class="lbl">${t('clientsServed')}</span>
                            <span class="val">${calculatedCustomers}</span>
                        </div>
                    </div>
                    
                    <div class="p-tool-familiarity-box" style="margin-top: 0.6rem; margin-bottom: 0.6rem; padding: 10px; background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; font-size: var(--fs-subtitle) !important; border-bottom: 1px solid var(--panel-border); padding-bottom: 12px;">
                        <span style="color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
                            <svg class="p-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--accent-yellow); margin-bottom: 0;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                            ${(function() {
                                const sc = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
                                if (!sc || !sc.metrics || !sc.metrics[0] || sc.id === 'agent') return t('systemFamiliarity');
                                const lbl = currentLang === 'zh' ? (sc.metrics[0].labelZh || sc.metrics[0].label) : sc.metrics[0].label;
                                return (lbl.endsWith(':') || lbl.endsWith('：')) ? lbl : (currentLang === 'zh' ? lbl + '：' : lbl + ':');
                            })()}
                        </span>
                        <strong style="color: var(--accent-yellow); font-size: var(--fs-subtitle) !important;">${p.skills.device}%</strong>
                    </div>

                    <div class="p-skills-work-row">
                        <div class="p-skills-col">
                            <h4 class="p-sec-title">${t('skillImpact')}</h4>
                            ${(function() {
                                const sc = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
                                const isZh = (currentLang === 'zh');
                                const mList = (sc && sc.metrics) ? sc.metrics : [
                                    { key: 'Skill_Device', label: t('skillDevice') },
                                    { key: 'Skill_Knowledge', label: t('skillKnowledge') },
                                    { key: 'Skill_Sales_Pitch', label: t('skillPitch') },
                                    { key: 'Skill_Customer_Relations', label: t('skillRelations') },
                                    { key: 'Skill_Digital_Tools', label: t('skillTools') }
                                ];
                                return mList.map((m, mIdx) => {
                                    let val = p.skills ? p.skills[`dim_${mIdx + 1}`] : undefined;
                                    if (val === undefined && p.skills) {
                                        if (mIdx === 0) val = p.skills.device;
                                        else if (mIdx === 1) val = p.skills.knowledge;
                                        else if (mIdx === 2) val = p.skills.salesPitch;
                                        else if (mIdx === 3) val = p.skills.customerRelations;
                                        else if (mIdx === 4) val = p.skills.digitalTools;
                                    }
                                    val = (val !== undefined && val !== null) ? val : 50;
                                    const lbl = isZh ? (m.labelZh || m.label) : m.label;
                                    return `
                                        <div class="p-skill-item">
                                            <span class="lbl">${lbl}</span>
                                            <div class="p-bar-container">
                                                <div class="p-bar-bg"><div class="p-bar-fill" style="width: ${val}%; background-color: var(--colour-${activePersona})"></div></div>
                                                <span class="p-bar-val" style="color: var(--colour-${activePersona})">${val}%</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('');
                            })()}
                        </div>
                        <div class="p-donut-col">
                            <h4 class="p-sec-title">${t('dailyWork')}</h4>
                            <div class="p-donut-chart-wrapper" style="height: 150px; margin-top: 8px;">
                                <canvas id="personaDonutCanvas"></canvas>
                            </div>
                            <div id="personaDonutLegend" style="margin-top: auto; margin-left: 30px; margin-bottom: 4px; display: flex; flex-direction: column; gap: 6px; width: fit-content; align-items: flex-start;"></div>
                        </div>
                    </div>

                    <div class="p-needs-pains">
                        <div class="p-lbl-block p-contradiction">
                            <strong>${t('coreConflicts')}</strong>
                            <div id="barriers-word-cloud" style="margin-top:6px; display:grid; grid-template-columns: 1fr; gap:6px;"></div>
                        </div>
                        <div class="p-lbl-block p-needs">
                            <strong>${t('coreNeeds')}</strong>
                            <div id="needs-word-cloud" style="margin-top:6px; display:grid; grid-template-columns: 1fr; gap:6px;"></div>
                        </div>
                        <div class="p-lbl-block p-pains">
                            <strong>${t('mainPains')}</strong>
                            <div id="pains-word-cloud" style="margin-top:6px; display:grid; grid-template-columns: 1fr; gap:6px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Column 2: Sales Journey Timeline -->
                <div class="glass-panel p-timeline-card">
                    <h3>${t('salesJourney')}</h3>
                    
                    <div class="p-timeline">
                        ${calculatedJourneySteps.map((step, idx) => `
                            <div class="p-timeline-step ${idx === activeStageIndex ? 'active' : ''}" style="cursor:pointer;" onclick="setActiveStage(${idx})">
                                <div class="p-step-dot"></div>
                                <div class="p-step-content" style="width: 100%;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin: 0px !important; margin-bottom:0px !important; padding: 0px !important; line-height: 1.1;">
                                        <h5 class="p-timeline-title" style="margin:0px !important; padding:0px !important; font-weight:600; color:var(--text-primary); line-height:1.1;">${step.title}</h5>
                                        <span style="font-size:var(--fs-display); cursor:help; line-height:1.1;" title="${t('avgSatisfaction')}: ${step.avgRating}/5.0">${step.emoji}</span>
                                    </div><ul class="p-timeline-action-list" style="margin: 0px !important; margin-top: 0px !important; padding: 0px !important; padding-left: 12px !important; color: var(--text-secondary); line-height: 1.4; font-weight: 400; font-size: var(--fs-small); list-style-type: disc !important; margin-bottom: 6px !important;">${step.actions.map(act => `<li style="margin: 0px !important; padding: 0px !important; margin-bottom: 2px !important;">${act}</li>`).join('')}</ul>

                                    <!-- Physical/Digital Location -->
                                    <div style="margin-bottom: 6px;">
                                        <span class="p-timeline-label" style="color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:2px;">${t('physicalDigitalLocation')}</span>
                                        <div style="display:flex; flex-wrap:wrap; gap:3px;">
                                            ${step.contexts && step.contexts.length > 0 ? step.contexts.map(ctx => `<span class="p-timeline-tag" style="background:rgba(46,204,113,0.08); border:1px solid rgba(46,204,113,0.2); color:#2ecc71; padding:1px 5px; border-radius:3px;">${ctx}</span>`).join('') : `<span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('noLocation')}</span>`}
                                        </div>
                                    </div>
                                    
                                    <!-- Touchpoints / Tools / Collaborators -->
                                    <div style="margin-bottom: 6px;">
                                        <span class="p-timeline-label" style="color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:2px;">${t('touchpoints')}</span>
                                        <div style="display:flex; flex-wrap:wrap; gap:3px;">
                                            ${step.tools && step.tools.length > 0 ? step.tools.map(ctx => `<span class="p-timeline-tag" style="background:rgba(64,150,255,0.08); border:1px solid rgba(64,150,255,0.2); color:#4096ff; padding:1px 5px; border-radius:3px;">${ctx}</span>`).join('') : `<span style="font-size:var(--fs-caption); color:var(--text-muted);">${t('noTools')}</span>`}
                                        </div>
                                    </div>

                                    <!-- Pains -->
                                    ${step.pains.length > 0 ? `
                                    <div>
                                        <span class="p-timeline-label" style="color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:2px;">${t('painPoints')}</span>
                                        <div style="display:flex; flex-wrap:wrap; gap:3px;">
                                            ${step.pains.map(pn => `<span class="p-timeline-pain-tag" style="background:rgba(255,77,79,0.08); border:1px solid rgba(255,77,79,0.2); color:#ff4d4f; padding:1px 5px; border-radius:3px;">${pn}</span>`).join('')}
                                        </div>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="p-tools-box">
                        <h5>${t('dailyToolsTop5')}</h5>
                        <ul>
                            ${calculatedTools.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Column 3: Portrait Photo & Verbatim Quotes Stacks -->
                <div class="p-side-col" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <!-- Portrait Card -->
                    <div class="glass-panel p-portrait-card" style="padding: 0; overflow: hidden; position: relative; height: 270px; min-height: 270px;">
                        <!-- Photo File Upload overlay -->
                        <div class="portrait-upload-overlay" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                            <label for="photo-file-input" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.4); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: var(--fs-caption); cursor: pointer; display: flex; align-items: center; gap: 4px; transition: background 0.2s;">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                ${t('changePhoto')}
                            </label>
                            <input type="file" id="photo-file-input" accept="image/*" style="display: none;" onchange="handlePhotoUpload(event)">
                        </div>

                        <img class="p-portrait-img" src="${p.photo}" onerror="this.src='data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%232c3e50%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2220%22 fill=%22%23fff%22>${p.name}</text></svg>'" alt="${p.name}">
                        
                        <div class="p-quote-overlay" style="padding: 8px 12px; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; bottom: 8%; left: 10px; right: 10px; display: flex; flex-direction: column; gap: 4px;">
                            <textarea id="edit-quote" oninput="showSaveButton('quote')" placeholder="${t('enterQuote')}" style="background: transparent; border: none; border-bottom: 1px dashed rgba(255,255,255,0.3); color: #fff; font-size: var(--fs-body); font-weight: 700; width: 100%; height: 52px; resize: none; outline: none; padding: 4px; font-family: inherit; line-height: 1.4; text-align: left; box-sizing: border-box;">${p.quote}</textarea>
                            <button id="save-btn-quote" onclick="saveManuallyEnteredValues()" style="display: none; align-self: flex-end; padding: 2px 8px; font-size: var(--fs-small); background: #28a745; border: 1px solid #28a745; color: #fff; border-radius: 4px; cursor: pointer; font-weight: 600; margin-top: 2px;">${t('save')}</button>
                        </div>
                    </div>

                    <!-- Verbatim Quotes Card -->
                    <div class="glass-panel p-verbatim-card" style="flex-grow: 1;">
                        <h3>${t('agentMotto')}</h3>
                        <div class="p-verbatim-list">
                            ${verbatimHTML}
                        </div>
                    </div>
                </div>
            `;

            // Render word clouds
            renderWordCloud(barriersKeywords, 'barriers-word-cloud');
            renderWordCloud(needsKeywords, 'needs-word-cloud');
            renderWordCloud(painsKeywords, 'pains-word-cloud');

            // Trigger animation on progress bars (5 options)
            setTimeout(() => {
                const elD = document.getElementById('bar-device');
                const elK = document.getElementById('bar-knowledge');
                const elSP = document.getElementById('bar-sales-pitch');
                const elCR = document.getElementById('bar-customer-relations');
                const elDT = document.getElementById('bar-digital-tools');
                if (elD) elD.style.width = `${p.skills.device}%`;
                if (elK) elK.style.width = `${p.skills.knowledge}%`;
                if (elSP) elSP.style.width = `${p.skills.salesPitch}%`;
                if (elCR) elCR.style.width = `${p.skills.customerRelations}%`;
                if (elDT) elDT.style.width = `${p.skills.digitalTools}%`;
            }, 50);

            // Render Chart.js Donut
            initPersonaDonutChart(workData, workLabels);
        }

        // Set active stage in timeline
        function setActiveStage(idx) {
            activeStageIndex = idx;
            document.querySelectorAll('.p-timeline-step').forEach((step, sIdx) => {
                step.classList.remove('active');
                if (sIdx === idx) step.classList.add('active');
            });
        }

        // Donut work allocation chart in Column 1
        function initPersonaDonutChart(data, customLabels) {
            const ctx = document.getElementById('personaDonutCanvas').getContext('2d');
            if (donutChartInstance) donutChartInstance.destroy();

            // Generic fallback labels -- customLabels (computed from real cluster data)
            // is passed in and used whenever it's available.
            const defaultLabels = (currentLang === 'zh')
                ? ['專業知識提升', '開拓與客源開發', '客戶拜訪', '售後保全服務', '分處行政庶務']
                : ['Building Expertise', 'Maintaining Prospect List', 'Client Visits', 'Post-Sale Servicing', 'Internal Admin'];

            const labels = customLabels || defaultLabels;

            // Generate a 5-shade palette from the active cluster's assigned colour instead of
            // a hardcoded palette per fixed archetype.
            const activeColor = (window.__dynamicClusterProfiles || []).find(p => p.key === activePersona);
            const baseColor = activeColor ? activeColor.color : '#a8a8a8';
            const colorMap = { [activePersona]: shadeColorPalette(baseColor, 5), all: ['#ff9f43', '#54a0ff', '#1dd1a1', '#ff6b6b', '#00d2d3'] };

            donutChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colorMap[activePersona],
                        borderColor: '#212529',
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    cutout: '60%'
                }
            });

            // Build custom HTML legend (one item per row, left aligned, white text)
            const legendContainer = document.getElementById('personaDonutLegend');
            if (legendContainer) {
                const colours = colorMap[activePersona] || [];
                const total = data.reduce((a, b) => a + b, 0);
                legendContainer.innerHTML = labels.map((label, i) => {
                    const val = data[i] || 0;
                    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                    const color = colours[i] || '#fff';
                    return `
                        <div style="display: flex; align-items: center; gap: 8px; font-size: var(--fs-caption); color: #ffffff;">
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; flex-shrink: 0;"></span>
                            <span style="font-weight: 500;">${label} (${pct}%)</span>
                        </div>
                    `;
                }).join('');
            }
        }



        // Calculate and update SVG bezier path coordinates based on satisfaction scores
        function updateEmotionalCurve() {
            // Find average scores for the selected persona
            const group = getActiveGroupAgents();
            
            // Generic baseline scores, used only if no real per-cluster journey ratings
            // exist yet (the block below overrides this with real averages when available).
            let scores = [2.5, 3.5, 2.5, 3.5, 2.5, 3.0];

            // If CSV parsed group data exists, average ratings (6 tasks)
            if (group.length > 0) {
                scores = [0, 0, 0, 0, 0, 0].map((_, i) => {
                    const stepNum = i + 1;
                    let sum = 0;
                    let count = 0;
                    group.forEach(agent => {
                        const val = parseFloat(agent[`Journey_${stepNum}_Rating`]);
                        if (!isNaN(val)) {
                            sum += val;
                            count++;
                        }
                    });
                    return count > 0 ? (sum / count) : 3.0;
                });
            }

            // Map satisfaction score (1.0 - 5.0) to SVG Y height (height = 200px)
            // Y bounds: 30px (excellent = 5.0) to 170px (pain area = 1.0)
            const mapScoreToY = (score) => {
                const pct = (score - 1) / 4; // 0.0 to 1.0
                return 170 - pct * 140; // 170 down to 30
            };

            const yPoints = scores.map(s => mapScoreToY(s));
            const N = scores.length;
            const startX = 80;
            const endX = 1200;
            const stepX = N > 1 ? (endX - startX) / (N - 1) : 0;
            const xCoords = [];
            for (let i = 0; i < N; i++) {
                xCoords.push(startX + i * stepX);
            }

            // Build smooth Bezier path across arbitrary N stages
            let pathD = `M ${xCoords[0]} ${yPoints[0]}`;
            for (let i = 0; i < N - 1; i++) {
                const dist = xCoords[i+1] - xCoords[i];
                const cpX1 = xCoords[i] + dist / 2;
                const cpY1 = yPoints[i];
                const cpX2 = xCoords[i+1] - dist / 2;
                const cpY2 = yPoints[i+1];
                pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${xCoords[i+1]} ${yPoints[i+1]}`;
            }

            // Dynamically rebuild the SVG content for 6 nodes
            const svg = document.getElementById('journey-svg');
            const taskTitlesShort = (typeof currentLang !== 'undefined' && currentLang === 'zh') ? ["排程拜訪", "簽署", "送件", "售後服務", "行政支援", "教育訓練"] : ["Scheduling", "Signing", "Submission", "Post-Sales", "Admin Support", "Training"];
            
            let svgHTML = `
                <defs>
                    <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-colour="#ff7675" />
                        <stop offset="50%" stop-colour="#ffeaa7" />
                        <stop offset="100%" stop-colour="#55efc4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                <!-- Static Grid Gridlines -->
                <line x1="50" y1="30" x2="1250" y2="30" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
                <line x1="50" y1="100" x2="1250" y2="100" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
                <line x1="50" y1="170" x2="1250" y2="170" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="3" />
            `;

            // Vertical marker lines
            xCoords.forEach(x => {
                svgHTML += `<line x1="${x}" y1="20" x2="${x}" y2="180" stroke="rgba(255,255,255,0.02)" stroke-width="1" />`;
            });

            // Smooth Bezier Curve Path
            svgHTML += `
                <path d="${pathD}" fill="none" stroke="url(#curve-gradient)" stroke-width="3" id="journey-curve-path" style="transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);" />
            `;

            // Nodes (circles)
            scores.forEach((s, idx) => {
                let strokeColor = '#feca57'; // Yellow
                if (s >= 4.0) strokeColor = '#55efc4';
                else if (s >= 3.0) strokeColor = '#2ae8b2';
                else if (s < 2.3) strokeColor = '#ff7675';
                else if (s < 3.0) strokeColor = '#ffa8a8';

                svgHTML += `
                    <circle cx="${xCoords[idx]}" cy="${yPoints[idx]}" r="${idx === activeStageIndex ? 13 : 10}" class="journey-node" id="node-${idx}" stroke="${strokeColor}" style="transition: cy 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; fill: #121416; stroke-width: 3;" onclick="selectJourneyStage(${idx})" />
                `;
            });

            // Emojis text overlays
            scores.forEach((s, idx) => {
                let emoji = '😐';
                if (s >= 4.5) emoji = '😊'; // 5 = happy face
                else if (s >= 3.5) emoji = '🙂'; // 4 = 🙂
                else if (s >= 2.5) emoji = '😐'; // 3 = 😐
                else if (s >= 1.5) emoji = '🙁'; // 2 = 🙁
                else emoji = '😩'; // 1 = 😩

                svgHTML += `
                    <text x="${xCoords[idx]}" y="${yPoints[idx] + 6}" font-size="16" text-anchor="middle" id="emoji-${idx}" style="transition: y 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; pointer-events: none;">${emoji}</text>
                `;
            });

            // Node Labels at bottom
            scores.forEach((s, idx) => {
                svgHTML += `
                    <text x="${xCoords[idx]}" y="195" fill="var(--text-secondary)" font-size="10" text-anchor="middle">${taskTitlesShort[idx]}</text>
                `;
            });

            svg.innerHTML = svgHTML;

            // Re-bind mouse hover events for tooltips
            scores.forEach((s, idx) => {
                const node = document.getElementById(`node-${idx}`);
                if (!node) return;
                
                let emoji = '😐';
                if (s >= 4.5) emoji = '😆';
                else if (s >= 3.5) emoji = '😊';
                else if (s >= 2.5) emoji = '😐';
                else if (s >= 1.5) emoji = '😟';
                else emoji = '😫';

                node.onmouseenter = (e) => showTooltip(e, `Rating Score:${s.toFixed(1)} / 5.0 (${emoji})`, xCoords[idx], yPoints[idx]);
                node.onmouseleave = hideTooltip;
            });
        }

        // Highlight selected matrix column
        function selectJourneyStage(idx) {
            activeStageIndex = idx;
            
            // Remove previous active column classes
            for (let i = 0; i < 6; i++) {
                const col = document.getElementById(`j-col-${i}`);
                if (col) {
                    col.style.background = '';
                    col.style.borderRadius = '';
                    col.style.boxShadow = '';
                    col.querySelectorAll('.j-cell-card').forEach(c => c.style.borderColor = '');
                }
            }

            // Highlight new column
            const activeCol = document.getElementById(`j-col-${idx}`);
            if (activeCol) {
                activeCol.style.background = 'rgba(255, 255, 255, 0.02)';
                activeCol.style.borderRadius = '12px';
                activeCol.style.boxShadow = '0 0 15px rgba(255,255,255,0.02)';
                activeCol.querySelectorAll('.j-cell-card').forEach(c => {
                    c.style.borderColor = `var(--colour-${activePersona})`;
                });
            }

            // Highlight curve node
            for (let i = 0; i < 6; i++) {
                const node = document.getElementById(`node-${i}`);
                if (node) {
                    node.setAttribute('r', i === idx ? '13' : '10');
                }
            }
        }

        // SVG Tooltips helper
        function showTooltip(e, text, x, y) {
            const tooltip = document.getElementById('journey-tooltip');
            tooltip.textContent = text;
            tooltip.style.opacity = 1;
            
            // Calculate relative offset within SVG container
            const container = document.querySelector('.j-svg-container');
            const rect = container.getBoundingClientRect();
            
            const svgWidth = 1000;
            const svgHeight = 220;
            const pxX = (x / svgWidth) * rect.width;
            const pxY = (y / svgHeight) * rect.height;

            tooltip.style.left = `${pxX + 10}px`;
            tooltip.style.top = `${pxY}px`;
        }

        function hideTooltip() {
            document.getElementById('journey-tooltip').style.opacity = 0;
        }

        // Render Analytics & DB table list (Column details matching database logs)
        function renderAnalyticsView() {
            // Run cluster discovery automatically on visiting the tab if not yet run
            if (!lastClusterResult && parsedData && parsedData.length >= 15) {
                runClusterDiscovery();
            } else if (lastClusterResult) {
                renderClusterDiscovery();
            }
            
            // Experience distribution counts from CSV
            const counts = getExperienceDistributionCounts();
            
            const chartsGrid = document.querySelector('.charts-grid');
            if (chartsGrid) {
                chartsGrid.style.display = 'grid';
                const distCard = document.getElementById('analytics-dist-card');
                const radarCard = document.getElementById('analytics-radar-card');
                if (distCard) distCard.style.display = 'flex';
                if (radarCard) radarCard.style.display = 'flex';
                
                initAnalyticsDistributionChart(counts);
                initAnalyticsRadarChart();
            }

            // Render dynamic keywords, verbatim quotes, and daily task allocations for the active persona/cluster
            const allAnalysisBlock = document.getElementById('analytics-all-tab-analysis');
            if (allAnalysisBlock) {
                allAnalysisBlock.style.display = 'block';
                
                // Filter data for the active persona/cluster
                let filteredData = parsedData;
                if (activePersona !== 'all') {
                    filteredData = parsedData.filter(d => d.archetype === activePersona);
                }
                
                // Calculate overall keyword lists
                const barriersList = filteredData.map(a => a.Conflict).filter(Boolean);
                const needsList = filteredData.map(a => a.Needs).filter(Boolean);
                const painsList = filteredData.map(a => a.Pains).filter(Boolean);
                
                const barriersKeywords = calculateKeywords(barriersList);
                const needsKeywords = calculateKeywords(needsList);
                const painsKeywords = calculateKeywords(painsList);
                
                // Render clouds
                renderWordCloud(barriersKeywords, 'analytics-all-barriers-cloud');
                renderWordCloud(needsKeywords, 'analytics-all-needs-cloud');
                renderWordCloud(painsKeywords, 'analytics-all-pains-cloud');
                
                // Render daily tasks averages
                const topTasks = calculateDailyTasks(filteredData);
                initAnalyticsAllWorkChart(topTasks);
                renderResponseDistributions(filteredData);

                // Group raw quotes into 5 categories
                const quotesSales = [];
                const quotesRelations = [];
                const quotesTools = [];
                const quotesKnowledge = [];
                const quotesOther = [];
                
                let unmatchedCount = 0;
                filteredData.forEach(d => {
                    const q = d.Pains;
                    if (!q) return;
                    const painsList = q.split(/[;；\n]+/);
                    const uniqueAgentPains = Array.from(new Set(painsList.map(p => p.trim()).filter(Boolean)));
                    const agentCategories = new Set();
                    
                    uniqueAgentPains.forEach(pItem => {
                        const text = pItem;
                        const textLower = text.toLowerCase();
                        
                        const salesKeywords = ['pitch', 'sales', 'communication', 'rejection', 'objection', 'negotiation', 'persuasion', 'guidance', 'approach', 'interaction', 'prospecting', 'visiting', 'interview', 'performance', 'salespitch', 'marketing', '話術', '行銷', '銷售', '拜訪', '業績', '溝通', '開發', '拒絕'];
                        const relationsKeywords = ['client', 'relationship', 'cultivation', 'service', 'trust', 'care', 'loyalty', 'maintenance', 'gifting', 'satisfaction', 'referral', 'emotion', '客戶', '關係', '經營', '服務', '信任', '關懷', '售後', '情感', '溫度'];
                        const toolsKeywords = ['digital', 'tool', 'system', 'app', 'operation', 'feature', 'tablet', 'online', 'login', 'password', 'network', 'interface', 'lagging', 'api', 'calendar', 'ipad', '數位', '工具', '系統', '程式', '功能', '平板', '線上', '登入', '密碼', '網路', '卡頓', '慢', '速度'];
                        const knowledgeKeywords = ['knowledge', 'product', 'clause', 'regulation', 'underwriting', 'claims', 'policy', 'tax', 'legal', 'professional', 'learning', 'declared', 'interest', '知識', '產品', '條款', '規則', '核保', '理賠', '保單', '專業', '學習', '法規'];
                        const otherKeywords = ['device', 'system', 'familiarity', 'portal', 'computer', '裝置', '系統', '熟稔', '熟悉', '介面', '操作', '入口', '電腦'];
                        
                        let category = null;
                        if (toolsKeywords.some(kw => textLower.includes(kw))) {
                            category = 'tools';
                        } else if (salesKeywords.some(kw => textLower.includes(kw))) {
                            category = 'sales';
                        } else if (relationsKeywords.some(kw => textLower.includes(kw))) {
                            category = 'relations';
                        } else if (knowledgeKeywords.some(kw => textLower.includes(kw))) {
                            category = 'knowledge';
                        } else if (otherKeywords.some(kw => textLower.includes(kw))) {
                            category = 'other';
                        } else {
                            const fallbackKeys = ['other', 'knowledge', 'sales', 'relations', 'tools'];
                            category = fallbackKeys[unmatchedCount % 5];
                            unmatchedCount++;
                        }

                        if (!agentCategories.has(category)) {
                            agentCategories.add(category);
                            if (category === 'tools') quotesTools.push({ text, agent: d });
                            else if (category === 'sales') quotesSales.push({ text, agent: d });
                            else if (category === 'relations') quotesRelations.push({ text, agent: d });
                            else if (category === 'knowledge') quotesKnowledge.push({ text, agent: d });
                            else quotesOther.push({ text, agent: d });
                        }
                    });
                });
                
                window.categorizedQuotes = {
                    sales: quotesSales,
                    relations: quotesRelations,
                    tools: quotesTools,
                    knowledge: quotesKnowledge,
                    other: quotesOther
                };
                
                // Update tab count labels
                const cSales = document.getElementById('count-q-sales');
                const cRelations = document.getElementById('count-q-relations');
                const cTools = document.getElementById('count-q-tools');
                const cKnowledge = document.getElementById('count-q-knowledge');
                const cOther = document.getElementById('count-q-other');
                
                if (cSales) cSales.textContent = quotesSales.length;
                if (cRelations) cRelations.textContent = quotesRelations.length;
                if (cTools) cTools.textContent = quotesTools.length;
                if (cKnowledge) cKnowledge.textContent = quotesKnowledge.length;
                if (cOther) cOther.textContent = quotesOther.length;
                
                // Display default category
                switchQuoteCategory('sales');
            }

            // Render Marketing & Sales Strategy panel
            renderMarketingStrategy();

            // Populate table body
            fillTable(parsedData);
        }

        function renderMarketingStrategy() {
            const pitchContainer = document.getElementById('strategy-pitch-content');
            const toolsContainer = document.getElementById('strategy-tools-content');
            const needsContainer = document.getElementById('strategy-needs-content');
            if (!pitchContainer || !toolsContainer || !needsContainer) return;

            // Static strategy mapping based on persona archetypes
            const strategies = {
                explorer: {
                    pitch: `
                        <ul style="padding-left:14px; margin:0; display:flex; flex-direction:column; gap:6px;">
                            <li><strong>Communication Theme:</strong> Emphasize "low operational difficulty" and "foolproof guidance" to reduce anxiety about rookie logins and system navigation.</li>
                            <li><strong>Suggested Marketing Pitch:</strong>
                                <br><span style="color:var(--accent-yellow)">"Get started in three steps, quick search with one click. Let the most intuitive mobile App accompany your first sales step!"</span>
                            </li>
                            <li><strong>Potential Pitfalls to Prevent:</strong> Avoid mentioning overly complex custom parameters or backend report configurations. Focus on "password-free quick login and fuzzy search assistance" as key highlights.</li>
                        </ul>
                    `,
                    tools: `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">1. Smart Clause Fuzzy Search (App)</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Quickly overcome professional knowledge gaps; no fear of clients asking about clause details on the go.</p>
                            </div>
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">2. Dialogue-Guided Proposal Typist</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Use dialogue guidance to prevent errors, completely reducing the chances of input mistakes or form rejection.</p>
                            </div>
                        </div>
                    `
                },
                expert: {
                    pitch: `
                        <ul style="padding-left:14px; margin:0; display:flex; flex-direction:column; gap:6px;">
                            <li><strong>Communication Theme:</strong> Emphasize "automated client relationship cultivation" and "doubled visit efficiency" to free up time for busy growth-stage agents.</li>
                            <li><strong>Suggested Marketing Pitch:</strong>
                                <br><span style="color:var(--accent-yellow)">"Leave administration and tedious checks to the system. Save your precious time for warm client relationship cultivation!"</span>
                            </li>
                            <li><strong>Potential Pitfalls to Prevent:</strong>Highlight that the system automatically generates high-quality insurance health check reports, saving hours of preparation time.</li>
                        </ul>
                    `,
                    tools: `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">1. One-Click Policy Health Check PDF Generator</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Automatically load insurance big data to produce beautiful, clear PDF policy audit reports with one click.</p>
                            </div>
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">2. Automated Renewal & Anniversary Reminder Butler</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Replace manual recording with automated scheduler reminders sent directly to clients.</p>
                            </div>
                        </div>
                    `
                },
                optimizer: {
                    pitch: `
                        <ul style="padding-left:14px; margin:0; display:flex; flex-direction:column; gap:6px;">
                            <li><strong>Communication Theme:</strong> Focus on "high-volume batch operations" and "extreme performance," positioning the tool as an AI assistant for top consultants.</li>
                            <li><strong>Suggested Marketing Pitch:</strong>
                                <br><span style="color:var(--accent-yellow)">"Multi-tasking speed interface, batch selection of precise leads to support your high-efficiency large sales operations!"</span>
                            </li>
                            <li><strong>Potential Pitfalls to Prevent:</strong>Promote the system's high stability, fast response, and batch sending support to meet large-scale client management needs.</li>
                        </ul>
                    `,
                    tools: `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">1. High-Volume Batch Customer Care Scheduler</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">One-click filter for specific client groups, applying precise templates to send batch greeting messages.</p>
                            </div>
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">2. Multi-Goal Policy Portfolio Simulator</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Provide advanced calculation tools for family financial planning and asset allocation to close large deals.</p>
                            </div>
                        </div>
                    `
                },
                skeptic: {
                    pitch: `
                        <ul style="padding-left:14px; margin:0; display:flex; flex-direction:column; gap:6px;">
                            <li><strong>Communication Theme:</strong> Focus on trust & empathy and simplified operations, letting tools fade to the background and leading with the senior agent's trust assets.</li>
                            <li><strong>Suggested Marketing Pitch:</strong>
                                <br><span style="color:var(--accent-yellow)">"The most reassuring system support with a stable and consistent interface, allowing you to focus on face-to-face relationships without operational hassle!"</span>
                            </li>
                            <li><strong>Potential Pitfalls to Prevent:</strong>Commit to not changing common menu paths frequently, and provide one-click download/print of large-font proposals.</li>
                        </ul>
                    `,
                    tools: `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">1. One-Click Print & Offline Proposal Bundle Exporter</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Provide easy-to-read, large-font physical paper download forms for senior managers accustomed to face-to-face visits.</p>
                            </div>
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">2. Voice-to-Text Memo Input Assistant</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Use voice recognition to automatically save visit records, eliminating tedious typing on mobile devices.</p>
                            </div>
                        </div>
                    `
                },
                parttimer: {
                    pitch: `
                        <ul style="padding-left:14px; margin:0; display:flex; flex-direction:column; gap:6px;">
                            <li><strong>Communication Theme:</strong> Focus on "high-net-worth asset inheritance" and "family relationship cultivation" with a minimalist premium interface.</li>
                            <li><strong>Suggested Marketing Pitch:</strong>
                                <br><span style="color:var(--accent-yellow)">"Understand the full picture of high-net-worth family coverage, guiding wealth inheritance safely across generations!"</span>
                            </li>
                            <li><strong>Potential Pitfalls to Prevent:</strong>Emphasize asset protection and compliance, focusing on cross-generation inheritance simulations rather than trivial tools.</li>
                        </ul>
                    `,
                    tools: `
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">1. Family Policy Relationship Mapping Generator</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Visually display the insurance and claim progress for three generations of high-net-worth family business owners.</p>
                            </div>
                            <div style="background:rgba(29, 209, 161, 0.08); padding:6px; border-radius:4px;">
                                <strong style="color:#1dd1a1; font-size:var(--fs-small);">2. Cross-Generation Inheritance Simulator</strong>
                                <p style="margin:2px 0 0 0; font-size:var(--fs-caption); color:var(--text-muted);">Run tax and inheritance simulations for high coverage amounts to build highly persuasive marketing conversation points.</p>
                            </div>
                        </div>
                    `
                }
            };

            const strategy = strategies[activePersona] || strategies.explorer;
            pitchContainer.innerHTML = strategy.pitch;
            toolsContainer.innerHTML = strategy.tools;

            // Dynamically calculate Needs (Q15) for activeGroupAgents
            const activeGroupAgents = getActiveGroupAgents();
            const needCounts = {};
            
            activeGroupAgents.forEach(a => {
                if (a.Needs) {
                    const parts = a.Needs.split(/[;；,, , \s\n]+/).map(n => n.trim()).filter(Boolean);
                    parts.forEach(need => {
                        needCounts[need] = (needCounts[need] || 0) + 1;
                    });
                }
            });

            // If empty, use baseline default rankings
            let sortedNeeds = [];
            if (Object.keys(needCounts).length === 0) {
                const defaults = {
                    explorer: [
                        { name: "Improve Matching Accuracy", count: 18 },
                        { name: "Fast Rate Lookup", count: 15 },
                        { name: "Sales Pitch Template Library", count: 12 },
                        { name: "Fuzzy Keyword Search", count: 10 }
                    ],
                    expert: [
                        { name: "Automated Renewal Reminders", count: 20 },
                        { name: "Improve Matching Accuracy", count: 16 },
                        { name: "One-Stop Customer Data Integration", count: 14 },
                        { name: "Sales Pitch Template Library", count: 11 }
                    ],
                    optimizer: [
                        { name: "Batch Client Communications", count: 24 },
                        { name: "Automated Renewal Reminders", count: 21 },
                        { name: "Real-Time Team Performance Dashboard", count: 18 },
                        { name: "High-Efficiency List Filtering", count: 16 }
                    ],
                    skeptic: [
                        { name: "One-Stop Customer Data Integration", count: 19 },
                        { name: "Automated Renewal Reminders", count: 15 },
                        { name: "More Stable Electronic Signature", count: 14 },
                        { name: "Fast Rate Lookup", count: 11 }
                    ],
                    parttimer: [
                        { name: "One-Stop Customer Data Integration", count: 12 },
                        { name: "Recruitment Filtering Tool", count: 10 },
                        { name: "Real-Time Team Performance Dashboard", count: 9 },
                        { name: "Automated Renewal Reminders", count: 7 }
                    ]
                };
                sortedNeeds = defaults[activePersona] || defaults.explorer;
            } else {
                sortedNeeds = Object.keys(needCounts).map(name => {
                    return { name: name, count: needCounts[name] };
                }).sort((a, b) => b.count - a.count).slice(0, 4);
            }

            // Render needs as visual progress bars
            const maxVal = sortedNeeds.length > 0 ? Math.max(...sortedNeeds.map(n => n.count)) : 10;
            needsContainer.innerHTML = sortedNeeds.map(n => {
                const pct = maxVal > 0 ? Math.round((n.count / maxVal) * 100) : 0;
                return `
                    <div style="margin-bottom: 8px;">
                        <div style="display:flex; justify-content:space-between; font-size:var(--fs-caption); margin-bottom: 2px;">
                            <span style="color:#e0e0e0; font-weight: 500;">${n.name}</span>
                            <span style="color:var(--text-muted)">Mention Count: ${n.count}</span>
                        </div>
                        <div style="width:100%; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
                            <div style="width:${pct}%; height:100%; background:var(--colour-${activePersona}); border-radius:3px; transition: width 0.4s ease-out;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function fillTable(dataList) {
            const body = document.getElementById('respondents-table-body');
            if (!body) return;
            body.innerHTML = '';

            dataList.forEach(d => {
                const tr = document.createElement('tr');
                tr.onclick = () => openAgentModal(d);
                
                let agentFamiliarity = d.Skill_Agent_Familiarity;
                let deviceFamiliarity = d.Skill_Device_Familiarity;
                let knowledge = d.Skill_Knowledge;
                let salesPitch = d.Skill_Sales_Pitch;
                let customerRelations = d.Skill_Customer_Relations;
                let digitalTools = d.Skill_Digital_Tools;

                // Fallbacks for mock data where these keys might be undefined
                if (knowledge === undefined || knowledge === null) {
                    const p = getPersonaDisplayInfo(d.archetype);
                    if (p && p.skills) {
                        agentFamiliarity = p.skills.agentFamiliarity !== undefined ? p.skills.agentFamiliarity : (p.skills.device || 50);
                        deviceFamiliarity = p.skills.deviceFamiliarity !== undefined ? p.skills.deviceFamiliarity : (p.skills.device || 50);
                        knowledge = p.skills.knowledge !== undefined ? p.skills.knowledge : 50;
                        salesPitch = p.skills.salesPitch !== undefined ? p.skills.salesPitch : 50;
                        customerRelations = p.skills.customerRelations !== undefined ? p.skills.customerRelations : 50;
                        digitalTools = p.skills.digitalTools !== undefined ? p.skills.digitalTools : 50;
                    } else {
                        agentFamiliarity = deviceFamiliarity = knowledge = salesPitch = customerRelations = digitalTools = 50;
                    }
                }

                const profile = (window.__dynamicClusterProfiles || []).find(p => p.key === d.archetype);
                const borderColor = profile ? profile.color : '#a8a8a8';
                const displayName = getPersonaDisplayInfo(d.archetype).name;

                const getNum = (v) => {
                    const val = Number(v);
                    return isNaN(val) ? 50 : val;
                };

                tr.innerHTML = `
                    <td style="font-weight: 600; color: #fff;">${d.name || 'Unknown'}</td>
                    <td><span class="badge-status" style="border-color: ${borderColor}">${displayName}</span></td>
                    <td>${getNum(agentFamiliarity).toFixed(1)}%</td>
                    <td>${getNum(deviceFamiliarity).toFixed(1)}%</td>
                    <td>${getNum(knowledge).toFixed(1)}%</td>
                    <td>${getNum(salesPitch).toFixed(1)}%</td>
                    <td>${getNum(customerRelations).toFixed(1)}%</td>
                    <td>${getNum(digitalTools).toFixed(1)}%</td>
                `;
                body.appendChild(tr);
            });
        }

        function handleTableSearch() {
            const input = document.getElementById('table-search');
            if (!input) return;
            const query = input.value.trim().toLowerCase();
            const filtered = parsedData.filter(d => d.name.toLowerCase().includes(query));
            fillTable(filtered);
        }

        // Analytics Doughnut Chart
        function getExperienceDistributionCounts() {
            const counts = { b1: 0, b2: 0, b3: 0, b4: 0, b5: 0 };
            
            parsedData.forEach(d => {
                const exp = String(d.Experience || '').toLowerCase().trim();
                if (!exp) return;
                
                if (exp.includes('under 1') || exp.includes('less than 1') || exp.includes('1-3') || exp.includes('1~3')) {
                    counts.b1++;
                } else if (exp.includes('3-5') || exp.includes('3~5') || exp.includes('5-10') || exp.includes('5~10') || exp.includes('6-10') || exp.includes('6~10')) {
                    counts.b2++;
                } else if (exp.includes('10-15') || exp.includes('10~15') || exp.includes('11-15') || exp.includes('11~15') || exp.includes('15-20') || exp.includes('15~20') || exp.includes('16-20') || exp.includes('16~20')) {
                    counts.b3++;
                } else if (exp.includes('20-25') || exp.includes('20~25') || exp.includes('21-25') || exp.includes('21~25') || exp.includes('25-30') || exp.includes('25~30') || exp.includes('26-30') || exp.includes('26~30')) {
                    counts.b4++;
                } else if (exp.includes('30+') || exp.includes('30年') || exp.includes('over 30') || exp.includes('more than 30')) {
                    counts.b5++;
                } else {
                    const m = exp.match(/(\d+)/);
                    if (m) {
                        const val = parseInt(m[1], 10);
                        if (val <= 3) counts.b1++;
                        else if (val <= 10) counts.b2++;
                        else if (val <= 20) counts.b3++;
                        else if (val <= 30) counts.b4++;
                        else counts.b5++;
                    } else {
                        counts.b2++;
                    }
                }
            });
            return counts;
        }

        function cntLbl(n) { return (typeof currentLang !== 'undefined' && currentLang === 'zh') ? n + ' 人' : n + (n === 1 ? ' person' : ' people'); }

        function initAnalyticsDistributionChart(counts) {
            const ctx = document.getElementById('distDoughnutChart').getContext('2d');
            if (pieChartInstance) pieChartInstance.destroy();

            const labels = (typeof currentLang !== 'undefined' && currentLang === 'zh') ? ['未滿 1 年與 1–3 年', '3–5 年與 6–10 年', '11–15 年與 16–20 年', '21–25 年與 26–30 年', '30 年以上'] : ['Under 1 year & 1-3 years', '3-5 years & 5-10 years', '10-15 years & 15-20 years', '20-25 years & 25-30 years', '30+ years'];
            const data = [counts.b1, counts.b2, counts.b3, counts.b4, counts.b5];
            const colours = ['#ff9f43', '#54a0ff', '#1dd1a1', '#ff6b6b', '#8b5cf6'];

            // Render custom HTML legend with matching layout, styles, and font sizes
            const legendContainer = document.getElementById('distDoughnutLegend');
            if (legendContainer) {
                const total = data.reduce((a, b) => a + b, 0);
                legendContainer.innerHTML = labels.map((label, idx) => {
                    const val = data[idx] || 0;
                    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                    return `
                        <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary);">
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${colours[idx]};"></span>
                            <span style="font-weight: 500;">${label} (${pct}%)</span>
                        </div>
                    `;
                }).join('');
            }

            pieChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colours,
                        borderColor: '#212529',
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Analytics Radar comparison chart (Dynamic Schema-Driven)
        function initAnalyticsRadarChart() {
            const canvas = document.getElementById('compRadarChart');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (radarChartInstance) radarChartInstance.destroy();

            const schema = typeof getActiveJourneySchema === 'function' ? getActiveJourneySchema() : null;
            const metrics = schema ? schema.metrics : [
                { key: 'Skill_Device', label: 'Device/System Familiarity' },
                { key: 'Skill_Knowledge', label: 'Insurance Knowledge' },
                { key: 'Skill_Sales_Pitch', label: 'Sales Pitch Skills' },
                { key: 'Skill_Customer_Relations', label: 'Customer Relationship Mgmt' },
                { key: 'Skill_Digital_Tools', label: 'Digital Tool Familiarity' }
            ];
            const isZh = (currentLang === 'zh');
            const clusterProfiles = window.__dynamicClusterProfiles || [];

            const averages = {};
            clusterProfiles.forEach(cp => {
                averages[cp.key] = { counts: 0, metricSums: new Array(metrics.length).fill(0) };
            });

            const globalMetricSums = new Array(metrics.length).fill(0);
            let globalCount = 0;

            parsedData.forEach(d => {
                if (!averages[d.archetype]) {
                    averages[d.archetype] = { counts: 0, metricSums: new Array(metrics.length).fill(0) };
                }

                metrics.forEach((m, idx) => {
                    let val = d[m.key];
                    if (val === undefined || val === null || isNaN(parseFloat(val))) {
                        if (m.key === 'Skill_Device' && d.Skill_Device_Familiarity !== undefined) {
                            val = d.Skill_Device_Familiarity;
                        } else {
                            val = 50;
                        }
                    }
                    val = parseFloat(val) || 50;
                    averages[d.archetype].metricSums[idx] += val;
                    globalMetricSums[idx] += val;
                });
                averages[d.archetype].counts++;
                globalCount++;
            });

            const globalMeans = globalMetricSums.map(sum => globalCount > 0 ? (sum / globalCount) : 50);

            const stretch = (val, mean) => {
                const displayed = 70 + (val - mean) * 3.5;
                return Math.min(100, Math.max(25, displayed));
            };

            const datasets = [];
            const colours = {};
            clusterProfiles.forEach(cp => { colours[cp.key] = cp.color; });

            for (const key in averages) {
                const a = averages[key];
                if (a.counts > 0) {
                    const stretchedData = a.metricSums.map((sum, idx) => {
                        const avg = sum / a.counts;
                        return stretch(avg, globalMeans[idx]);
                    });
                    datasets.push({
                        label: getPersonaDisplayInfo(key).name,
                        data: stretchedData,
                        borderColor: colours[key] || '#a8a8a8',
                        backgroundColor: (colours[key] || '#a8a8a8') + '15',
                        borderWidth: 2.5,
                        pointBackgroundColor: colours[key] || '#a8a8a8'
                    });
                }
            }

            const legendContainer = document.getElementById('radarCustomLegend');
            if (legendContainer) {
                legendContainer.innerHTML = Object.entries(colours).map(([key, colour]) => {
                    return `
                        <div style="display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: var(--fs-small); white-space: nowrap;">
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${colour}; flex-shrink: 0;"></span>
                            <span>${getPersonaDisplayInfo(key).name}</span>
                        </div>
                    `;
                }).join('');
            }

            const radarLabels = metrics.map(m => {
                const label = isZh ? (m.labelZh || m.label) : m.label;
                const words = label.split(' ');
                if (words.length > 2 && !isZh) {
                    const mid = Math.ceil(words.length / 2);
                    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
                }
                return label;
            });

            radarChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: radarLabels.map(radarLabelWrap),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255,255,255,0.06)' },
                            grid: { color: 'rgba(255,255,255,0.06)' },
                            pointLabels: { color: '#adb5bd', font: { size: radarLabelSize() } },
                            ticks: { backdropColor: 'transparent', color: '#6c757d', font: { size: 11 }, min: 0, max: 100, stepSize: 25 }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Helper to initialize overall daily tasks doughnut chart on Analytics tab
        function initAnalyticsAllWorkChart(tasks) {
            const canvas = document.getElementById('analyticsAllWorkCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (analyticsAllWorkChartInstance) analyticsAllWorkChartInstance.destroy();

            const labels = tasks.map(t => t.name);
            const data = tasks.map(t => t.val);

            // Using beautiful distinct shades of violet/purple for task visualization
            const colours = ['#8b5cf6', '#a78bfa', '#c084fc', '#d8b4fe', '#f3e8ff'];

            // Render custom HTML legend
            const legendContainer = document.getElementById('analyticsAllWorkLegend');
            if (legendContainer) {
                legendContainer.innerHTML = tasks.map((t, idx) => {
                    return `
                        <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary);">
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${colours[idx % colours.length]};"></span>
                            <span style="font-weight: 500;">${t.name} (${t.val}%)</span>
                        </div>
                    `;
                }).join('');
            }

            analyticsAllWorkChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colours,
                        borderColor: '#1e222a',
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // ==================== MODALS ====================

        function openAgentModal(agent) {
            const overlay = document.getElementById('agent-modal');
            document.getElementById('modal-agent-name').textContent = agent.name;

            const profiles = window.__dynamicClusterProfiles || [];
            const profile = profiles.find(p => p.key === agent.archetype);
            const displayName = getPersonaDisplayInfo(agent.archetype).name;

            const archBadge = document.getElementById('modal-agent-archetype');
            archBadge.textContent = displayName;
            archBadge.className = 'badge-status';
            archBadge.style.borderColor = profile ? profile.color : '#a8a8a8';
            archBadge.style.color = profile ? profile.color : '#a8a8a8';

            const supVal = (agent.sup !== undefined && agent.sup !== null) ? Number(agent.sup) : 0;
            const wpVal = (agent.wp !== undefined && agent.wp !== null) ? Number(agent.wp) : 0;
            const arVal = (agent.ar !== undefined && agent.ar !== null) ? Number(agent.ar) : 0;
            const prVal = (agent.pr !== undefined && agent.pr !== null) ? Number(agent.pr) : 0;

            document.getElementById('modal-score-sup').innerHTML = `${isNaN(supVal) ? '0.00' : supVal.toFixed(2)} <small>/ 5.0</small>`;
            const msModal = getMeasureStatus();
            const fmtScore = (ok, v) => ok ? `${isNaN(v) ? '0.00' : v.toFixed(2)} <small>/ 5.0</small>` : `<small>${currentLang === 'zh' ? '未測量' : 'Not measured'}</small>`;
            document.getElementById('modal-score-wp').innerHTML = fmtScore(msModal.WP, wpVal);
            document.getElementById('modal-score-ar').innerHTML = fmtScore(msModal.AR, arVal);
            document.getElementById('modal-score-pr').innerHTML = fmtScore(msModal.PR, prVal);

            // Classification reason is generated from this cluster's actual computed
            // distinguishing features (from K-means clustering and dynamic cluster profiling),
            // not from a tenure-range lookup. Age/tenure/position are never the reason an
            // agent lands in a cluster -- only descriptive facts about who else is in it.
            let reason;
            if (profile) {
                const featureText = profile.topFeatures.map(f => `${f.direction} ${f.label}`).join(', ') || 'no single standout dimension';
                reason = `Based on this respondent's SUP/TU/AR/PR and skill vector, K-means placed them in a cluster of ${profile.count} respondents, most distinguished by: ${featureText}. `;
                reason += agent.Experience ? `(For reference only -- this agent's reported experience range is ${agent.Experience}, shown here as a descriptive fact, not the reason for this classification.)` : '';
            } else {
                reason = 'This respondent has not yet been assigned to a cluster in the current session -- upload or reload data to run clustering.';
            }
            document.getElementById('modal-classification-reason').textContent = reason;

            overlay.classList.add('active');
        }

        function closeAgentModal() {
            document.getElementById('agent-modal').classList.remove('active');
        }

        let commercialHasOpened = false;

        function showPlayBtn() {
            const btn = document.getElementById('commercial-play-btn');
            if (btn) btn.classList.add('show');
        }

        function hidePlayBtn() {
            const btn = document.getElementById('commercial-play-btn');
            if (btn) btn.classList.remove('show');
        }

        function playCommercialWithSound(e) {
            const _m = document.getElementById('commercial-video-modal');
            if (!_m || !_m.classList.contains('active')) { if (e && e.stopPropagation) e.stopPropagation(); return; }
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            hidePlayBtn();
            const player = document.getElementById('commercial-video-player');
            if (player) {
                player.currentTime = 0;
                player.muted = false;
                player.volume = 1.0;
                const p = player.play();
                if (p !== undefined) {
                    p.catch(function () {
                        player.play();
                    });
                }
            }
        }
        window.playCommercialWithSound = playCommercialWithSound;
        window.unmuteCommercialVideo = playCommercialWithSound;

        function removeCommercialStartListeners() {
            const s = window.__commercialStart;
            if (s) { s.evts.forEach(function (n) { window.removeEventListener(n, s.fn, true); }); window.__commercialStart = null; }
        }

        // Start downloading the intro video for a language while the language screen is still showing,
        // so it is already buffered when the viewer chooses and playback can begin at 0:00.
        function commercialSrcFor(lang) {
            return (lang === 'zh') ? 'assets/quan-persona_commercial_zh_1080p_web.mp4' : 'assets/quan-persona_commercial_1080p_web.mp4';
        }
        function preloadCommercial(lang) {
            const player = document.getElementById('commercial-video-player');
            if (!player) return;
            lang = (lang === 'zh') ? 'zh' : 'en';
            if (player.getAttribute('data-lang') === lang) return;
            Array.prototype.slice.call(player.querySelectorAll('source')).forEach(function (s) { s.remove(); });
            player.setAttribute('data-lang', lang);
            player.preload = 'auto';
            player.src = commercialSrcFor(lang);
            if (typeof player.load === 'function') player.load();
        }
        window.preloadCommercial = preloadCommercial;

        function showCommercialLoading(player) {
            const wrap = player && player.parentNode;
            if (!wrap) return;
            let sp = document.getElementById('commercial-loading');
            if (!sp) {
                sp = document.createElement('div');
                sp.id = 'commercial-loading';
                sp.setAttribute('aria-hidden', 'true');
                sp.style.cssText = 'position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border:4px solid rgba(255,255,255,.25);border-top-color:#f5c518;border-radius:50%;pointer-events:none;z-index:3;animation:qpSpin .9s linear infinite';
                if (!document.getElementById('qp-spin-style')) {
                    const st = document.createElement('style'); st.id = 'qp-spin-style'; st.textContent = '@keyframes qpSpin{to{transform:rotate(360deg)}}';
                    document.head.appendChild(st);
                }
                wrap.appendChild(sp);
            }
            sp.style.display = 'block';
            const hide = function () { sp.style.display = 'none'; ['playing', 'pause', 'error', 'ended'].forEach(function (n) { player.removeEventListener(n, hide); }); };
            ['playing', 'pause', 'error', 'ended'].forEach(function (n) { player.addEventListener(n, hide); });
        }

        function openCommercialModal(isLanding = false) {
            if (isLanding && commercialHasOpened) return;
            commercialHasOpened = true;
            const modal = document.getElementById('commercial-video-modal');
            const player = document.getElementById('commercial-video-player');
            const footer = document.getElementById('commercial-footer-actions');
            if (footer) footer.style.display = 'none';

            if (!modal) return;
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (player) {
                const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh') || (typeof detectInitialLanguage === 'function' && detectInitialLanguage() === 'zh');
                const wantLang = isZh ? 'zh' : 'en';
                // Normally already preloaded while the language screen was showing; otherwise start loading now.
                if (player.getAttribute('data-lang') !== wantLang) preloadCommercial(wantLang);
                showCommercialLoading(player);

                player.currentTime = 0;
                // Attempt unmuted playback with sound on
                player.muted = false;
                player.volume = 1.0;
                const playPromise = player.play();
                if (playPromise !== undefined) {
                    playPromise.then(function () {
                        // Unmuted autoplay succeeded directly!
                        hidePlayBtn();
                    }).catch(function (error) {
                        // Browsers forbid autoplay WITH sound before user gesture.
                        // Pause at greeting cover frame (1.6s) and show clean centered Play button ▶
                        player.pause();
                        const showStill = function () { try { player.currentTime = 1.6; } catch (e) {} };
                        showStill();
                        player.addEventListener('loadeddata', function once() { player.removeEventListener('loadeddata', once); if (player.paused) showStill(); });
                        setTimeout(function () { if (player.paused && player.currentTime < 1) showStill(); }, 400);
                        player.muted = false;
                        player.volume = 1.0;
                        showPlayBtn();

                        // Clicking anywhere on the video or modal starts playing with sound on from 0:00
                        const evts = ['click', 'pointerdown', 'keydown', 'touchstart'];
                        removeCommercialStartListeners();
                        const startOnUserClick = function (ev) {
                            if (ev && ev.target && ev.target.closest && ev.target.closest('#btn-close-commercial-modal')) return;
                            if (ev && ev.type === 'keydown' && ev.key === 'Escape') return;
                            removeCommercialStartListeners();
                            playCommercialWithSound(ev);
                        };
                        window.__commercialStart = { fn: startOnUserClick, evts: evts };
                        evts.forEach(function (n) { window.addEventListener(n, startOnUserClick, true); });
                    });
                }
            }
        }

        function closeCommercialModal(immediate = false) {
            commercialHasOpened = true;
            hidePlayBtn();
            removeCommercialStartListeners();
            const modal = document.getElementById('commercial-video-modal');
            const player = document.getElementById('commercial-video-player');
            const footer = document.getElementById('commercial-footer-actions');
            if (!modal) return;
            modal.classList.remove('active');
            if (player) {
                player.pause();
                try { player.muted = true; } catch (e) {}
            }
            if (immediate) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            } else {
                setTimeout(function () {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 200);
            }
            if (footer) {
                footer.style.display = 'none';
            }

            // Ensure background data initialization has completed
            if (typeof initPlatformData === 'function') {
                initPlatformData();
            }

            // When users close the video, it goes directly to the tutorial:
            if (typeof switchMainSection === 'function') {
                switchMainSection('personas');
            }
            setTimeout(function () {
                if (typeof startTour === 'function') {
                    startTour();
                }
            }, 250);
        }
        window.openCommercialModal = openCommercialModal;
        window.closeCommercialModal = closeCommercialModal;

        // Video completion: show option below video ("Don't show the video again" / "不再顯示影片")
        (function () {
            const player = document.getElementById('commercial-video-player');
            if (player) {
                player.addEventListener('ended', function () {
                    const isZh = (typeof currentLang !== 'undefined' && currentLang === 'zh') || (typeof detectInitialLanguage === 'function' && detectInitialLanguage() === 'zh');
                    const footer = document.getElementById('commercial-footer-actions');
                    const lblDontShow = document.getElementById('lbl-dont-show-video');
                    const lblContinue = document.getElementById('lbl-continue-tour');
                    const chk = document.getElementById('chk-dont-show-video');

                    if (lblDontShow) {
                        lblDontShow.textContent = isZh ? '不再顯示影片' : 'Don’t show the video again';
                    }
                    if (lblContinue) {
                        lblContinue.textContent = isZh ? '立即探索平台 →' : 'Explore the portal now →';
                    }
                    if (chk) {
                        chk.checked = (localStorage.getItem('quan_persona_dont_show_video') === 'true');
                    }
                    if (footer) {
                        footer.style.display = 'flex';
                    }
                });
            }
        })();

        // Initialize Platform Data & Views in the background while video is playing
        function initPlatformData() {
            if (window.__platformDataInitialized) return;
            if (typeof PRE_LOADED_DATA === 'undefined' && typeof PRE_LOADED_DATA_ZH === 'undefined' && document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', initPlatformData);
                window.addEventListener('load', initPlatformData);
                return;
            }
            window.__platformDataInitialized = true;

            // Respect initial detected language or existing choice
            const initialDetected = detectInitialLanguage();
            if (initialDetected === 'zh') {
                currentLang = 'zh';
                window.currentLang = 'zh';
            } else if (!currentLang) {
                currentLang = 'en';
            }
            if (typeof loadCustomSchemasFromStorage === 'function') loadCustomSchemasFromStorage();
            if (typeof updateClusterFeatures === 'function') updateClusterFeatures();
            if (typeof PRE_LOADED_DATA !== 'undefined' && PRE_LOADED_DATA.length > 0) {
                parsedData = PRE_LOADED_DATA;
            } else if (typeof PRE_LOADED_DATA_ZH !== 'undefined' && PRE_LOADED_DATA_ZH.length > 0) {
                parsedData = PRE_LOADED_DATA_ZH;
            } else {
                loadDefaultMockData();
            }
            if (parsedData && parsedData.length > 0) {
                assignDynamicArchetypes(parsedData);
                renderArchetypeTabs();
                runClusterDiscovery({ recluster: false, runKCheck: false });
            }
            updateAgentDropdown();
            renderAll();
            applyLanguage('en');
            const urlParams = new URLSearchParams(window.location.search);
            const initialSection = urlParams.get('section');
            if (initialSection && ['personas', 'journeys', 'analytics'].includes(initialSection)) {
                switchMainSection(initialSection);
            }
            // Reload the last uploaded CSV saved in this browser (kept until a new CSV replaces it)
            setTimeout(function () { if (typeof restoreSavedUploadedCsv === 'function') restoreSavedUploadedCsv(); }, 150);
        }
        window.initPlatformData = initPlatformData;


        // Landing language gate: the user picks English / 繁體中文, then the matching video plays (the click is a user gesture, so sound can autoplay)
        function showLangGate() {
            const gate = document.getElementById('lang-gate');
            if (!gate) { openCommercialModal(true); return; }
            const logo = document.getElementById('lang-gate-logo'), mark = document.querySelector('.brand-mark');
            if (logo && mark && !logo.getAttribute('src')) logo.src = mark.src;
            gate.style.display = 'flex';
            void gate.offsetWidth;
            gate.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        window.chooseLandingLang = function (lang) {
            lang = (lang === 'zh') ? 'zh' : 'en';
            try { localStorage.setItem('portal_lang', lang); } catch (e) {}
            if (typeof initPlatformData === 'function') initPlatformData();
            currentLang = lang; window.currentLang = lang;
            if (typeof applyLanguage === 'function') applyLanguage(lang);
            const gate = document.getElementById('lang-gate');
            if (gate) {
                gate.classList.remove('show');
                setTimeout(function () { gate.style.display = 'none'; }, 300);
            }
            document.body.style.overflow = '';
            if (window.__skipLandingVideo) {
                if (typeof switchMainSection === 'function') switchMainSection('personas');
            } else {
                openCommercialModal(true);
            }
        };

        // Auto-launch commercial video IMMEDIATELY on landing, then load data concurrently while video plays
        function launchLandingFlow() {
            const initLang = detectInitialLanguage();
            if (initLang === 'zh') {
                currentLang = 'zh';
                window.currentLang = 'zh';
                if (typeof applyLanguage === 'function') {
                    applyLanguage('zh');
                }
            }

            let dontShow = false;
            try {
                dontShow = (localStorage.getItem('quan_persona_dont_show_video') === 'true');
            } catch (e) {}

            window.__skipLandingVideo = dontShow;
            showLangGate();
            if (!dontShow) {
                preloadCommercial(initLang === 'zh' ? 'zh' : 'en');
                Array.prototype.slice.call(document.querySelectorAll('#lang-gate .lang-gate-btn')).forEach(function (b) {
                    const l = b.getAttribute('data-lang');
                    ['pointerenter', 'touchstart', 'focus'].forEach(function (n) { b.addEventListener(n, function () { preloadCommercial(l); }, { passive: true }); });
                });
            }
            setTimeout(initPlatformData, 50);
            if (window.__pendingLang) { const pl = window.__pendingLang; window.__pendingLang = null; window.chooseLandingLang(pl); }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', launchLandingFlow);
        } else {
            launchLandingFlow();
        }

        window.addEventListener('load', () => {
            initPlatformData();
        });
    (function () {
        const wrap = document.getElementById('data-menu-wrap'), btn = document.getElementById('data-menu-btn');
        if (!wrap || !btn) return;
        function setOpen(o) { wrap.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
        window.openDataMenu = () => setOpen(true);
        window.closeDataMenu = () => setOpen(false);
        window.toggleDataMenu = e => { if (e) e.stopPropagation(); var pw = document.getElementById('platform-menu-wrap'); if (pw) pw.classList.remove('open'); setOpen(!wrap.classList.contains('open')); };
        document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#tour-root')) return; if (!wrap.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    })();
    (function () {
        const nav = document.getElementById('main-nav'), pin = document.getElementById('rail-pin');
        if (!nav) return;
        const store = {
            get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
            set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
        };
        function setPinned(on, save) { nav.classList.toggle('pinned', on); if (pin) pin.setAttribute('aria-pressed', on ? 'true' : 'false'); if (save) store.set('rail_pinned', on ? '1' : '0'); }
        window.toggleRailPin = () => setPinned(!nav.classList.contains('pinned'), true);
        setPinned(store.get('rail_pinned') === '1' || (store.get('rail_pinned') === null && nav.classList.contains('pinned')), false);
        // Hint on every load: the rail opens for about 1 second, then closes (skipped when pinned or when the user prefers reduced motion)
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!nav.classList.contains('pinned') && !reduce && window.innerWidth > 900) {
            nav.classList.add('intro');
            setTimeout(() => nav.classList.remove('intro'), 1000);
        }
        // Rail is collapsed by default. Logo click opens/closes it; choosing a function (or tapping elsewhere) collapses it.
        const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
        let peekT = 0;
        function railOpen() { clearTimeout(peekT); nav.classList.remove('quiet'); nav.classList.add('intro'); }
        function railClose() {
            clearTimeout(peekT);
            nav.classList.remove('intro'); nav.classList.add('quiet');
            if (document.activeElement && nav.contains(document.activeElement)) document.activeElement.blur();
        }
        if (noHover) nav.classList.add('quiet');
        const brandEl = document.getElementById('brand-cell');
        if (brandEl) brandEl.addEventListener('click', e => {
            if (window.innerWidth <= 900 || nav.classList.contains('tour-open')) return;
            e.stopPropagation();
            nav.classList.contains('intro') ? railClose() : railOpen();
        });
        // click / tap a function: show the names for a moment, then collapse again
        nav.addEventListener('click', e => {
            const b = e.target.closest && e.target.closest('.nav-tab-btn');
            if (!b || window.innerWidth <= 900 || nav.classList.contains('pinned') || nav.classList.contains('tour-open')) return;
            nav.classList.remove('quiet'); nav.classList.add('intro');
            clearTimeout(peekT);
            peekT = setTimeout(() => { nav.classList.remove('intro'); nav.classList.add('quiet'); if (e.detail > 0 && document.activeElement && nav.contains(document.activeElement)) document.activeElement.blur(); }, 700);
        });
        nav.addEventListener('mouseleave', () => { if (!noHover) nav.classList.remove('quiet'); });
        const st = window.startTour;
        let wasPinned = false;
        if (typeof st === 'function') window.startTour = function () {
            nav.classList.remove('intro', 'tour-open', 'quiet');
            wasPinned = nav.classList.contains('pinned');
            if (wasPinned) { nav.classList.remove('pinned'); if (pin) pin.setAttribute('aria-pressed', 'false'); }
            window.__railTourEnd = function () { if (wasPinned) { nav.classList.add('pinned'); if (pin) pin.setAttribute('aria-pressed', 'true'); wasPinned = false; } };
            return st.apply(this, arguments);
        };
    })();
    (function () {
        const tgl = document.getElementById('rail-toggle'), nav = document.getElementById('main-nav');
        function isMobile() {
            return window.matchMedia('(max-width: 900px)').matches;
        }
        function setDrawer(on, instant) {
            if (!isMobile()) on = false;
            document.body.classList.toggle('drawer-instant', !!instant);
            document.body.classList.toggle('drawer-open', !!on);
            if (tgl && isMobile()) tgl.setAttribute('aria-expanded', on ? 'true' : 'false');
            if (typeof setBrandRole === 'function') setBrandRole();
        }
        window.setRailDrawer = setDrawer;
        window.closeRailDrawer = () => setDrawer(false);
        window.toggleRailDrawer = e => { if (e) e.stopPropagation(); setDrawer(!document.body.classList.contains('drawer-open')); };
        const brand = document.getElementById('brand-cell');
        function setBrandRole() {
            if (!brand) return;
            if (isMobile()) {
                brand.setAttribute('role', 'button');
                brand.setAttribute('tabindex', '0');
                brand.setAttribute('aria-label', 'Toggle navigation menu');
                brand.setAttribute('aria-expanded', document.body.classList.contains('drawer-open') ? 'true' : 'false');
            } else {
                brand.removeAttribute('role');
                brand.removeAttribute('tabindex');
                brand.removeAttribute('aria-label');
                brand.removeAttribute('aria-expanded');
                brand.removeAttribute('title');
            }
        }
        setBrandRole();
        if (brand) {
            brand.addEventListener('click', e => { if (isMobile()) { e.stopPropagation(); setDrawer(!document.body.classList.contains('drawer-open')); setBrandRole(); } });
            brand.addEventListener('keydown', e => { if (isMobile() && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setDrawer(!document.body.classList.contains('drawer-open')); setBrandRole(); } });
        }
        if (nav) nav.addEventListener('click', e => { if (e.target.closest && e.target.closest('.nav-tab-btn')) setDrawer(false); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                setDrawer(false);
                const _cm = document.getElementById('commercial-video-modal');
                if (_cm && _cm.classList.contains('active') && typeof closeCommercialModal === 'function') closeCommercialModal();
            }
        });
        const mq = window.matchMedia('(max-width: 900px)');
        (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(() => { setDrawer(false); setBrandRole(); });
    })();
    (function () {
        // Guided tour started from About / FAQ: when it closes, return to the same page and scroll position (not the top)
        const prev = window.startTour;
        if (typeof prev !== 'function') return;
        let saved = null, watching = false;
        window.startTour = function () {
            const sec = (typeof activeSection !== 'undefined') ? activeSection : null;
            saved = (sec === 'about' || sec === 'faq') ? { sec: sec, y: window.scrollY || window.pageYOffset || 0 } : null;
            const r = prev.apply(this, arguments);
            const root = document.getElementById('tour-root');
            if (root && !watching) {
                watching = true;
                new MutationObserver(function () {
                    if (!saved || root.style.display !== 'none') return;
                    const s = saved; saved = null;
                    try { if (typeof activeSection !== 'undefined' && activeSection !== s.sec) switchMainSection(s.sec); } catch (e) {}
                    window.scrollTo(0, s.y); setTimeout(function () { window.scrollTo(0, s.y); }, 60);
                }).observe(root, { attributes: true, attributeFilter: ['style'] });
            }
            return r;
        };
    })();
    (function () {
        // FAQ / About pages: the top bar title reads "Frequently Asked Questions" / "About Us" (常見問題 / 關於我們); other pages keep their own title
        const el = document.querySelector('[data-i18n="portalTitle"]');
        const pages = [
            { v: document.getElementById('view-faq'), en: 'Frequently Asked Questions', zh: '常見問題' },
            { v: document.getElementById('view-about'), en: 'About Us', zh: '關於我們' }
        ].filter(p => p.v);
        if (!el || !pages.length) return;
        const all = []; pages.forEach(p => all.push(p.en, p.zh));
        let normal = el.textContent, obs;
        const isZh = () => (typeof currentLang !== 'undefined' && currentLang === 'zh');
        function sync() {
            const txt = el.textContent, isPageTitle = all.indexOf(txt) !== -1;
            const cur = pages.find(p => p.v.classList.contains('active'));
            if (cur) { if (!isPageTitle) normal = txt; const w = isZh() ? cur.zh : cur.en; if (txt !== w) el.textContent = w; }
            else if (isPageTitle) el.textContent = normal;
            else normal = txt;
            if (obs) obs.takeRecords();
        }
        obs = new MutationObserver(sync);
        obs.observe(el, { childList: true, characterData: true, subtree: true });
        pages.forEach(p => obs.observe(p.v, { attributes: true, attributeFilter: ['class'] }));
        sync();
    })();
    (function () {
        const wrap = document.getElementById('lang-menu-wrap'), btn = document.getElementById('lang-toggle-btn');
        if (!wrap || !btn) return;
        function setOpen(o) { wrap.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
        function sync() { const cur = (typeof currentLang !== 'undefined' && currentLang === 'zh') ? 'zh' : 'en'; wrap.querySelectorAll('.menu-item').forEach(b => { const on = b.dataset.lang === cur; b.classList.toggle('active', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); }
        window.toggleLangMenu = e => { if (e) e.stopPropagation(); const o = !wrap.classList.contains('open'); if (window.closeDataMenu) closeDataMenu(); const pw = document.getElementById('platform-menu-wrap'); if (pw) pw.classList.remove('open'); sync(); setOpen(o); };
        window.chooseLang = l => { setOpen(false); if (typeof currentLang !== 'undefined' && currentLang !== l && typeof toggleLanguage === 'function') toggleLanguage(); sync(); };
        document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
        if (typeof applyLanguage === 'function') { const orig = applyLanguage; window.applyLanguage = function () { const r = orig.apply(this, arguments); sync(); return r; }; }
        sync();
    })();
(function () {
    // Chinese layer: translates leftover English UI text while the portal is in Chinese, and restores it when switching back.
    var D = {
        'All': '全體', 'average': '平均', 'Score': '分數', 'Outliers & Noise': '離群值與雜訊',
        'Survey Template & Analytics Alignment': '問卷範本與分析對應',
        '👤 Insurance Sales Agent': '👤 保險業務員', '🛡️ Retail Policyholder': '🛡️ 個人保戶', '🏥 Hospital Patient Journey': '🏥 醫院病患歷程', '➕ Blank Custom Schema': '➕ 空白自訂架構',
        'Auto-normalises Likert, NPS & % scales to 0–100': '自動將李克特量表、NPS 與百分比量表換算為 0–100',
        'Add Tag': '新增標籤', 'Add Question': '新增題目', '(current status)': '（現況）', '(expectations)': '（期待）', '(journey map)': '（歷程地圖）',
        'Add Journey Stage': '新增歷程階段', 'Cancel': '取消', 'Agent Name': '業務員姓名', 'Classified Type': '分類類型',
        "This agent's survey feature vector is closest to the Explorer centroid, showing a high level of peer reliance in daily operations.": '此業務員的問卷特徵最接近「探索者」群中心，顯示日常作業高度依賴同儕。',
        'CSV Column Guide': 'CSV 欄位說明', 'Download Column Dictionary (CSV)': '下載欄位字典（CSV）', 'Download CSV Template': '下載 CSV 範本',
        'Survey CSV Column Mapping': '問卷 CSV 欄位對應',
        'Verify or map your uploaded CSV columns to match the active schema dimensions before running AI clustering.': '執行 AI 分群前，請確認或調整上傳的 CSV 欄位與目前架構的對應。',
        'File Name': '檔案名稱', 'Total Rows': '總列數', 'Active Schema': '目前架構', 'Agent Persona': '業務員人物誌', 'Match Coverage': '對應涵蓋率',
        'High Schema Compatibility: Checking CSV columns against active schema...': '架構相容性：正在比對 CSV 欄位與目前架構⋯',
        'All Fields': '所有欄位', 'Identity': '身分', 'Demographics': '人口統計', 'Metrics / Skills': '指標／技能', 'Journey Stages': '歷程階段', 'Qualitative': '質性',
        'Question # & Schema Target Dimension': '題號與架構目標維度', 'CSV Column Source': 'CSV 欄位來源', 'Sample Preview': '範例預覽', 'Status': '狀態',
        'Unmapped dimensions will safely use neutral midpoint defaults (50 for skills, 3.0 for ratings).': '未對應的維度將使用中性預設值（技能 50、評分 3.0）。',
        'Processing & Matching CSV Data...': '正在處理並對應 CSV 資料⋯',
        'Reading CSV file and matching columns against active schema dimensions...': '正在讀取 CSV 檔案，並比對目前架構的維度⋯',
        'Column Review Required': '欄位需進行核對與對應',
        'The uploaded CSV does not fully match all active schema dimensions. Please review column mappings or close to return to the default dashboard.': '上傳的 CSV 未完全符合目前架構的所有維度。請檢查欄位對應，或關閉以回到預設儀表板。',
        'Close': '關閉', 'Review': '檢查', 'Select a category to view optimisation opportunities': '請選擇類別以查看優化機會',
        "How to read: each row is one measure, each column one cluster. The number is the cluster's average score (0–100).": '如何閱讀：每列是一項指標，每欄是一個分群，數字為該群的平均分數（0–100）。',
        'Blue': '藍色', '= higher than the overall average,': '＝高於整體平均，', 'Amber': '琥珀色', '= lower; the stronger the colour, the bigger the gap.': '＝低於整體平均；顏色越深，差距越大。',
        'Uses phone notes and LINE to categorise and track a list, plans daily visits': '用手機記事本與 LINE 分類並追蹤名單，規劃每天的拜訪',
        'Shows clients a paper insurance brochure, often goes back to the office or asks a senior colleague for complex questions': '向客戶出示紙本保險簡介，遇到複雜問題常回辦公室或請教資深同事',
        'Enters the proposal, has a senior colleague check it, often limited by required-field validation': '輸入建議書並請資深同事檢查，常被必填欄位驗證卡住',
        'Directs clients to the customer service hotline or sends them the online alteration form link': '引導客戶撥打客服專線，或寄送線上變更申請表連結',
        'Attends morning meetings remotely or checks meeting notes on phone': '遠端參加晨會，或用手機查看會議記錄',
        'Completes micro-learning video modules on smartphone during spare time': '利用零碎時間在手機上完成微學習影片課程',
        '💡 Marketing Script Digitization': '💡 行銷話術數位化',
        "Build a built-in 'pitch and marketing asset library' in the AP system, supporting one-click copying to social media like LINE and WeChat. This helps agents instantly share compliant, engaging marketing content during prospecting and outreach.": '在業務系統內建「提案與行銷素材庫」，支援一鍵複製到 LINE、微信等社群，讓業務員在開發與接觸客戶時，能立即分享合規又吸引人的行銷內容。',
        '💡 Scenario-based Interactive Training': '💡 情境式互動訓練',
        'Design modular scenario-based visit simulations tailored for rookies and agents of different tenures to address common objections (e.g., high premiums, doubts about digital tools), reducing reliance on senior verbal guidance.': '針對新手與不同年資的業務員，設計模組化的情境式拜訪模擬，演練常見的客戶異議（如保費偏高、對數位工具存疑），減少對資深同事口頭指導的依賴。',
        '💡 Automated Anniversary & Care Notifications': '💡 週年與關懷通知自動化',
        'The system automatically pushes personalised greeting cards and curated care messages to agents before policy anniversaries, birthdays, and major holidays. It includes batch sending features to lower the time cost of manually managing existing client relationships.': '系統在保單週年、生日與重要節日前，自動推送個人化賀卡與精選關懷訊息給業務員，並提供批次發送功能，降低人工經營既有客戶關係的時間成本。',
        '💡 Referral & Generation Transfer Toolkit': '💡 轉介與世代傳承工具包',
        'Provide senior agents (e.g., 30+ years tenure) with an intuitive family relationship network graph, assisting them in wealth succession and referrals with fewer operational steps to create and track new prospect profiles.': '為資深業務員（如年資 30 年以上）提供直覺的家族關係網絡圖，以更少的操作步驟建立並追蹤新的準客戶資料，協助財富傳承與轉介。',
        '💡 Single Sign-On & Mobile App Optimisation': '💡 單一登入與行動 App 優化',
        'Optimise the login flow for mobile devices (e.g., FaceID/fingerprint), extend idle session timeouts, and reduce interruptions caused by frequent password inputs or 2FA, improving the mobile field operations experience.': '優化行動裝置登入流程（如 Face ID／指紋）、延長閒置逾時時間，減少頻繁輸入密碼或二階段驗證造成的中斷，改善外勤行動作業體驗。',
        '💡 Low-friction Lead Entry & Calendar Sync': '💡 低阻力的名單輸入與行事曆同步',
        'Support quick lead entry on mobile, simplify tedious required fields, and establish two-way synchronisation between the official system calendar and personal Google Calendars to eliminate inefficient manual copying.': '支援在手機上快速輸入名單、簡化繁瑣的必填欄位，並讓官方系統行事曆與個人 Google 日曆雙向同步，免除低效率的手動複製。',
        '💡 Fuzzy-Search Product Clause Database': '💡 可模糊搜尋的商品條款資料庫',
        'Reconstruct the complex and hard-to-navigate product clause database into a fuzzy-search keyword engine. This allows agents to quickly find answers on-site when asked about specific policy details.': '把複雜難找的商品條款資料庫，改造成可模糊搜尋關鍵字的查詢引擎，讓業務員被問到保單細節時能當場快速找到答案。',
        '💡 Instant Visual Policy Audit Report': '💡 即時視覺化保單檢視報告',
        'Optimise the policy audit report format, using charts instead of dense tables, and simplify the premium calculator so agents can estimate premiums within a minute, significantly increasing sales persuasiveness on-site.': '優化保單檢視報告格式，以圖表取代密集表格，並簡化保費試算，讓業務員一分鐘內就能估算保費，大幅提升現場說服力。',
        '💡 Progress Transparency & Stable Electronic Signing': '💡 進度透明與穩定的電子簽署',
        'Improve progress tracking transparency so clients can see real-time updates on their applications. Optimise remote signature link expiration times to reduce signing failures and late underwriting queries.': '提高進度追蹤的透明度，讓客戶能即時看到申請進度；並優化遠端簽署連結的有效期限，減少簽署失敗與核保延遲詢問。',
        '💡 Real-Time Team Performance Dashboard': '💡 即時團隊績效儀表板',
        'Automatically aggregate lead and activity reports for office managers and supervisors, replacing heavy paper-based logging and assisting in recruiting and team coaching decisions with real-time data.': '自動彙整名單與活動報表給處經理與主管，取代繁重的紙本登錄，並以即時數據協助增員與團隊輔導決策。'
    };
    var ROLES = { 'New Agent': '新進業務員', 'Sales Supervisor': '業務主任', 'Sales Manager': '業務經理', 'District Manager': '區經理', 'Agency Manager': '處經理', 'Director': '協理' };
    var R = [
        [/^(\d+)% Matched$/, '$1% 已對應'],
        [/^Unmatched \((\d+)\)$/, '未對應（$1）'],
        [/^⚠️ Match Rate: (\d+)%$/, '⚠️ 相符率：$1%'],
        [/^✅ Match Rate: (\d+)%$/, '✅ 相符率：$1%'],
        [/^(職稱[：:]\s*)(New Agent|Sales Supervisor|Sales Manager|District Manager|Agency Manager|Director)$/, function (m, a, r) { return a + ROLES[r]; }]
    ];
    var zh = function () { return typeof currentLang !== 'undefined' && currentLang === 'zh'; };
    var orig = new WeakMap(), busy = false, queued = false, mo = null;
    function tr(s) {
        var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/); var core = m[2].replace(/\s+/g, ' ');
        if (!core) return null;
        var out = null, q = core.match(/^(["'“‘])([\s\S]*)(["'”’])$/);
        if (D[core]) out = D[core];
        else if (q && D[q[2]]) out = q[1] + D[q[2]] + q[3];
        else for (var i = 0; i < R.length; i++) if (R[i][0].test(core)) { out = core.replace(R[i][0], R[i][1]); break; }
        if (out === null && /[\u4e00-\u9fff]/.test(core) && /\b(High|Low) |Type To Change|Conformity/.test(core)) {
            out = core.replace(/Conformity \/ Density/g, '一致性／密度').replace(/ ?- Type To Change Persona Description/g, '（可直接修改此描述）')
                .replace(/\b(High|Low) (.+?)(?= \/ |, | \(n=|$)/g, function (x, d, lab) { return lab + (d === 'High' ? '偏高' : '偏低'); });
            if (out === core) out = null;
        }
        return out === null ? null : m[1] + out + m[3];
    }
    function walk() {
        if (!document.body) return;
        busy = true; if (mo) mo.disconnect();
        try {
            var on = zh(), w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, list = [];
            while ((n = w.nextNode())) list.push(n);
            list.forEach(function (n) {
                var p = n.parentElement; if (!p) return;
                var tag = p.tagName; if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') return;
                if (p.closest('[contenteditable="true"],[data-no-i18n]')) return;
                if (on) {
                    if (/[A-Za-z]{2}/.test(n.data) || /職稱/.test(n.data)) { var t = tr(n.data); if (t !== null && t !== n.data) { if (!orig.has(n)) orig.set(n, n.data); n.data = t; } }
                } else if (orig.has(n)) { n.data = orig.get(n); orig.delete(n); }
            });
        } finally {
            busy = false;
            if (mo) mo.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    }
    function schedule() { if (queued) return; queued = true; (window.requestAnimationFrame || setTimeout)(function () { queued = false; walk(); }); }
    function init() {
        mo = new MutationObserver(function () { if (!busy) schedule(); });
        mo.observe(document.body, { childList: true, subtree: true, characterData: true });
        if (typeof window.applyLanguage === 'function') { var o = window.applyLanguage; window.applyLanguage = function () { var r = o.apply(this, arguments); schedule(); return r; }; }
        schedule();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
