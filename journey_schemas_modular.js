// V.2 Dynamic Multi-Domain Journey Schemas
// Decouples domain-specific definitions from the core clustering and visualisation engine

const JOURNEY_SCHEMAS = {
    agent: {
        id: 'agent',
        name: "Agent Persona & Sales Journey",
        nameZh: '保險業務員客群畫像與銷售旅程',
        targetAudience: 'Insurance Sales Agents',
        icon: '👤',
        badge: 'Sales Force Analytics',
        badgeZh: '業務通路分析',
        sectionsConfig: {
            demographics: true,
            dimensions: true,
            tags: true,
            workContent: true,
            journey: true
        },
        sectionTitles: {
            demographics: "Demographic Information",
            demographicsZh: "基本資料",
            tags: "Self-Image Tags",
            tagsZh: "自我形象標籤",
            dimensions: "Agent Background",
            dimensionsZh: "現況評估",
            workContent: "Daily Work Content and Needs",
            workContentZh: "日常工作內容與需求",
            journey: "Agent Journey",
            journeyZh: "業務員歷程地圖"
        },
        intro: "Dear Business Partners, Hello! This questionnaire aims to understand your daily work styles, tool usage habits, and the challenges and needs you encounter during your insurance sales journey. This will serve as a baseline for optimising digital tools for agents and improving our service quality. The questionnaire takes about 10–15 minutes to complete. All responses are aggregated and analysed dynamically via unsupervised machine learning algorithms to map agent profiles in real-time without relying on rigid, predefined chronological demographic filters. Thank you for your cooperation and assistance!",
        introZh: "親愛的業務夥伴，您好！本問卷旨在了解您在保險銷售歷程中的日常工作風格、工具使用習慣，以及所遇到的挑戰與需求，並作為優化業務員數位工具、提升服務品質的基準。問卷約需 10–15 分鐘完成。所有回覆將透過非監督式機器學習演算法進行彙整與動態分析，即時描繪業務員輪廓，而不依賴僵化、預先設定的依時序劃分之人口統計篩選條件。感謝您的配合與協助！",
        demographics: [
            {
                key: 'Age',
                label: 'What is your age range?',
                labelZh: '請問您的年齡區間為何？',
                type: 'single',
                options: 'Under 25, 26–35, 36–45, 46–55, 56–65, 66 or above',
                optionsZh: '25 歲以下, 26–35 歲, 36–45 歲, 46–55 歲, 56–65 歲, 66 歲以上'
            },
            {
                key: 'Service_Location',
                label: 'What is your current service region?',
                labelZh: '請問您目前所屬的服務區域為何？',
                type: 'single',
                options: 'Taipei I Business Development Dept., Taipei II Business Development Dept., Taoyuan/Hsinchu/Miaoli Business Development Dept., Central Region Business Development Dept., Southern Region Business Development Dept.',
                optionsZh: '台北一區業務發展部, 台北二區業務發展部, 桃竹苗業務發展部, 中區業務發展部, 南區業務發展部'
            },
            {
                key: 'Branch_Office',
                label: 'What is the name of your communication office (branch)?',
                labelZh: '請問您所屬的通訊處（分處）名稱為何？',
                type: 'text',
                options: 'Communication Office / Branch: ________________________________________________',
                optionsZh: '通訊處／分處：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿'
            },
            {
                key: 'Position',
                label: 'What is your current job rank/title?',
                labelZh: '請問您目前的職級／職稱為何？',
                type: 'single',
                options: 'New Agent, Sales Supervisor, Sales Manager, District Manager, Agency Manager, Director',
                optionsZh: '新進業務員, 業務主任, 業務經理, 區經理, 處經理, 協理'
            },
            {
                key: 'Experience',
                label: 'What is your range of years of experience in insurance sales?',
                labelZh: '請問您的保險銷售年資區間為何？',
                type: 'single',
                options: 'Under 1 year, 1–3 years, 3–5 years, 6–10 years, 11–15 years, 16–20 years, 21–25 years, 26–30 years, 30 years or more',
                optionsZh: '未滿 1 年, 1–3 年, 3–5 年, 6–10 年, 11–15 年, 16–20 年, 21–25 年, 26–30 年, 30 年以上'
            },
            {
                key: 'Clients',
                label: 'Approximately how many customers have you served up to now?',
                labelZh: '請問您至今大約服務過多少位客戶？',
                type: 'single',
                options: 'Under 50 customers, 51–100 customers, 101–300 customers, 301–600 customers, 600 customers or more',
                optionsZh: '50 位以下, 51–100 位, 101–300 位, 301–600 位, 600 位以上'
            },
            {
                key: 'PerformanceRank',
                label: 'Compared to peers in your same communication office, where did your sales performance rank over the past 12 months?',
                labelZh: '與同通訊處的同儕相比，您過去 12 個月的銷售業績排名為何？',
                type: 'single',
                options: 'Top 10%, Top 25%, Average level, Bottom 50%, Uncertain / Inconvenient to disclose',
                optionsZh: '前 10%, 前 25%, 平均水準, 後 50%, 不確定／不便透露',
                note: 'Note: This question is strictly used to filter subsequent questions and will not be used for individual performance reviews. Please answer with confidence.',
                noteZh: '註：本題僅用於篩選後續題目，不會用於個人績效考核，請安心作答。'
            }
        ],
        metrics: [
            { key: 'Skill_Device', label: 'Device/System Familiarity', labelZh: '裝置系統操作熟悉度', scaleType: '0-100', category: 'system_efficiency', indicator: 'Familiarity with Devices and Systems', indicatorZh: '對硬體裝置與作業系統之熟稔程度', sourceQuestion: 'Q11' },
            { key: 'Skill_Knowledge', label: 'Insurance Knowledge', labelZh: '專業保險產品條款知識', scaleType: '0-100', category: 'sales_performance', indicator: 'Product & Regulatory Knowledge', indicatorZh: '對保險商品與法規之專業知識', sourceQuestion: 'Q15' },
            { key: 'Skill_Sales_Pitch', label: 'Sales Pitch Communication', labelZh: '銷售訪談溝通話術能力', scaleType: '0-100', category: 'sales_performance', indicator: 'Sales Pitch & Persuasion', indicatorZh: '銷售話術與客戶溝通能力', sourceQuestion: 'Q15' },
            { key: 'Skill_Customer_Relations', label: 'Customer Relationship Management', labelZh: '客戶關係經營維護能力', scaleType: '0-100', category: 'sales_performance', indicator: 'Relationship Cultivation', indicatorZh: '客戶關係深耕與經營維護能力', sourceQuestion: 'Q15' },
            { key: 'Skill_Digital_Tools', label: 'Digital Tool Usage', labelZh: '數位工具熟悉度', scaleType: '0-100', category: 'system_efficiency', indicator: 'Digital Tool Adoption', indicatorZh: '數位系統與行動 App 之使用熟悉度', sourceQuestion: 'Q14' }
        ],
        stages: [
            {
                id: 1,
                key: 'Scheduling',
                title: 'Stage 1: Scheduling & Client Relationships',
                titleZh: '階段 1：時間規劃與客戶關係',
                actions: [
                    "Action A: Client List Development",
                    "Action B: Client Contact & Data Recording / Client Policy Servicing",
                    "Action C: Seeking Sales Opportunities"
                ],
                actionsZh: [
                    "行動 A：客戶名單整理與開拓",
                    "行動 B：客戶聯絡與紀錄／保單服務",
                    "行動 C：尋求銷售商機"
                ],
                actionDetails: [
                    {
                        name: "Action A: Client List Development",
                        nameZh: "行動 A：客戶名單整理與開拓",
                        locations: ['Office', 'Anywhere the client is', 'Phone', 'Home', 'Commuting', 'Community or interest groups', 'Other'],
                        locationsZh: ['辦公室', '客戶所在的任何地點', '電話', '住家', '通勤途中', '社群或興趣團體', '其他'],
                        tools: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Client referral', 'Orphan policies', 'Other'],
                        toolsZh: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '客戶轉介', '孤兒保單', '其他'],
                        painPoints: ['Incomplete contact info', 'Low client response rate', 'Inconsistent records across devices', 'Lack of automated reminders', 'Other'],
                        painPointsZh: ['聯絡資料不全', '客戶聯絡回應率低', '跨裝置紀錄不一致', '缺乏自動追蹤提醒', '其他']
                    },
                    {
                        name: "Action B: Client Contact & Data Recording / Client Policy Servicing",
                        nameZh: "行動 B：客戶聯絡與紀錄／保單服務",
                        locations: ['Office', 'Anywhere the client is', 'Phone', 'Home', 'Commuting', 'Communication software', 'Other'],
                        locationsZh: ['辦公室', '客戶所在的任何地點', '電話', '住家', '通勤途中', '通訊軟體', '其他'],
                        tools: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Other'],
                        toolsZh: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '其他'],
                        painPoints: ['Scattered communication history', 'Difficult to update policy records quickly', 'Customer prefers non-official channels', 'Other'],
                        painPointsZh: ['對話紀錄分散各處', '無法即時同步保單進度', '客戶偏好非官方通訊管道', '其他']
                    },
                    {
                        name: "Action C: Seeking Sales Opportunities",
                        nameZh: "行動 C：尋求銷售商機",
                        locations: ['Office', 'Anywhere the client is', 'Phone', 'Home', 'Commuting', 'Community or interest groups', 'Other'],
                        locationsZh: ['辦公室', '客戶所在的任何地點', '電話', '住家', '通勤途中', '社群或興趣團體', '其他'],
                        tools: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Client referral', 'Orphan policies', 'Other'],
                        toolsZh: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '客戶轉介', '孤兒保單', '其他'],
                        painPoints: ['Unclear customer coverage gaps', 'Lack of personalised proposal templates', 'High cost of acquiring new leads', 'Other'],
                        painPointsZh: ['客戶現有保障缺口不明確', '缺乏個人化建議書範本', '開發新客時間成本過高', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Uses phone notes and LINE to categorise and track a list, plans daily visits", tools: "Phone notes, LINE, personal calendar" },
                    expert: { actions: "Uses a paper list and physical desk calendar, calls long-time clients to maintain relationships", tools: "Home phone, physical notebook, paper desk calendar" },
                    optimizer: { actions: "Uses a digital CRM tool to filter the list, schedules automated greetings", tools: "Notion CRM, Google Sheets, scheduling system" },
                    skeptic: { actions: "Relies on a physical card box and phone book, insists on paper records for visit scheduling", tools: "Home phone, physical card box, paper planner" },
                    parttimer: { actions: "Quickly browses the contact list on her phone during her commute, maintains relationships via LINE", tools: "Phone notes, LINE chat, personal contacts" },
                    all: { actions: "Compiles client lists and visit schedules across experience levels", tools: "Paper desk calendar, LINE, Google Calendar and digital CRM" }
                }
            },
            {
                id: 2,
                key: 'PolicySales',
                title: 'Stage 2: Policy Sales',
                titleZh: '階段 2：保單銷售',
                actions: [
                    "Action A: Insurance Needs Elicitation (finding client gaps / helping clients build insurance concepts)",
                    "Action B: Querying Client Policy Status / Policy Review"
                ],
                actionsZh: [
                    "行動 A：保險需求引導（發掘客戶缺口／協助客戶建立保險觀念）",
                    "行動 B：查詢客戶保單狀態／保單健檢"
                ],
                actionDetails: [
                    {
                        name: "Action A: Insurance Needs Elicitation (finding client gaps / helping clients build insurance concepts)",
                        nameZh: "行動 A：保險需求引導（發掘客戶缺口／協助客戶建立保險觀念）",
                        locations: ['Office', 'Anywhere the client is', 'Phone', 'Online', 'Other'],
                        locationsZh: ['辦公室', '客戶所在的任何地點', '電話', '線上', '其他'],
                        tools: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Client referral', 'Orphan policies', 'Policy Review System', 'Other'],
                        toolsZh: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '客戶轉介', '孤兒保單', '保單健檢系統', '其他'],
                        painPoints: ['Complex coverage gap calculation', 'Complicated policy terms and rates', 'Client lacks budget or interest', 'Difficult cross-product comparison', 'Other'],
                        painPointsZh: ['保障缺口試算繁瑣', '條款與費率複雜難懂', '客戶缺乏預算或意願', '商品比價不易', '其他']
                    },
                    {
                        name: "Action B: Querying Client Policy Status / Policy Review",
                        nameZh: "行動 B：查詢客戶保單狀態／保單健檢",
                        locations: ['Office', 'Anywhere the client is', 'Phone', 'Online', 'Other'],
                        locationsZh: ['辦公室', '客戶所在的任何地點', '電話', '線上', '其他'],
                        tools: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', 'Peer support', 'Friends & Family', 'Senior colleague', 'Administrative Assistant', 'Policy Review System', 'Other'],
                        toolsZh: ['LINE', 'Agent Pro', 'Agent Portal', 'Service System', 'Contacts', '同儕支援', '親朋好友', '資深主管', '行政助理', '保單健檢系統', '其他'],
                        painPoints: ['Slow policy inquiry loading', 'Cross-company policies difficult to consolidate', 'Outdated client data', 'Other'],
                        painPointsZh: ['保單查詢載入緩慢', '他家保單難以彙整整合', '客戶資料未及時更新', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Shows clients a paper insurance brochure, often goes back to the office or asks a senior colleague for complex questions", tools: "Mobile web browsing, paper brochures, senior colleague consultation" },
                    expert: { actions: "Brings a stack of product materials and rate comparison sheets for detailed verbal explanations", tools: "Physical product booklets, large-print handouts, desktop calculator" },
                    optimizer: { actions: "Opens the proposal system on an iPad for live rate calculation and needs planning on-site", tools: "iPad Pro, proposal calculator system, dynamic presentation page" },
                    skeptic: { actions: "Has tea with the client, circles items on a paper flyer with a pen while explaining policy terms", tools: "Physical brochures, ballpoint pen, hand-calculated rates" },
                    parttimer: { actions: "Opens a coverage calculator webpage on her phone on the subway after work, shows a simple chart", tools: "Mobile web browser, simplified policy comparison page" },
                    all: { actions: "Shows clients premium calculations and policy comparisons via paper brochure or tablet", tools: "Paper brochures, calculator webpage, tablet proposal system" }
                }
            },
            {
                id: 3,
                key: 'Underwriting',
                title: 'Stage 3: Underwriting & Submission',
                titleZh: '階段 3：核保與送件',
                actions: [
                    "Action A: Keying in & Checking Proposals",
                    "Action B: Executing Submission",
                    "Action C: Handling Underwriting Requisitions, Reviewing Notifications, & Completing Policy Receipt Acknowledgement"
                ],
                actionsZh: [
                    "行動 A：要保書登打與檢查",
                    "行動 B：執行送件",
                    "行動 C：照會處理、照會覆核與送達簽收"
                ],
                actionDetails: [
                    {
                        name: "Action A: Keying in & Checking Proposals",
                        nameZh: "行動 A：要保書登打與檢查",
                        locations: ['Office', 'Online', 'Client\'s location', 'Home', 'Other'],
                        locationsZh: ['辦公室', '線上', '客戶所在地點', '住家', '其他'],
                        tools: ['Proposal System', 'Agent App', 'Senior colleague review', 'Administrative Assistant', 'Other'],
                        toolsZh: ['建議書系統', '業務員 App', '資深主管審單', '行政助理', '其他'],
                        painPoints: ['Too many application fields', 'Redundant validation errors', 'Frequent system logout during key-in', 'Other'],
                        painPointsZh: ['要保書欄位過多', '檢核錯誤繁瑣', '登打中斷時常被登出', '其他']
                    },
                    {
                        name: "Action B: Executing Submission",
                        nameZh: "行動 B：執行送件",
                        locations: ['Online', 'Branch counter', 'Client\'s location', 'Office', 'Other'],
                        locationsZh: ['線上', '分公司櫃檯', '客戶所在地點', '辦公室', '其他'],
                        tools: ['Online submission system', 'Online Signing System', 'Branch counter staff', 'Administrative Assistant', 'Other'],
                        toolsZh: ['線上投保送件系統', '線上簽署系統', '臨櫃送件窗口', '行政助理', '其他'],
                        painPoints: ['High e-signature verification failure', 'Network timeout during upload', 'Strict paper counter cutoffs', 'Other'],
                        painPointsZh: ['線上簽署驗證失敗率高', '上傳逾時中斷', '紙本臨櫃受理截止時間緊迫', '其他']
                    },
                    {
                        name: "Action C: Handling Underwriting Requisitions, Reviewing Notifications, & Completing Policy Receipt Acknowledgement",
                        nameZh: "行動 C：照會處理、照會覆核與送達簽收",
                        locations: ['Office', 'Online', 'Phone', 'Branch counter', 'Client\'s location', 'Other'],
                        locationsZh: ['辦公室', '線上', '電話', '分公司櫃檯', '客戶所在地點', '其他'],
                        tools: ['Underwriting notification system', 'Underwriter consultation', 'LINE', 'Administrative Assistant', 'Other'],
                        toolsZh: ['照會通知系統', '核保人員專線', 'LINE', '行政助理', '其他'],
                        painPoints: ['Lengthy requisition amendment process', 'Repeated client signature requests', 'Delayed policy delivery acknowledgement', 'Other'],
                        painPointsZh: ['照會補件流程冗長', '需重複請客戶補簽', '送達簽收回傳繁瑣', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Enters the proposal, has a senior colleague check it, often limited by required-field validation", tools: "Proposal system, Tou-Bao-Tong app, branch counter" },
                    expert: { actions: "Guides the client to hand-write and sign the paper application, then has an assistant enter it into the system", tools: "Paper application forms, personal fountain pen, administrative assistant support" },
                    optimizer: { actions: "Signs on a tablet Online, uses OTP SMS or biometrics for instant identity verification and submission", tools: "Online submission system, FaceID/Fingerprint, Tou-Bao-Tong" },
                    skeptic: { actions: "Client signs in person; he personally brings the paper application to the branch counter", tools: "Physical paper contract, branch counter" },
                    parttimer: { actions: "Has the client sign on a tablet at a gathering, or sends a remote submission link via SMS to complete it", tools: "Remote e-signature, Tou-Bao-Tong SMS link" },
                    all: { actions: "Fills out a paper application or uses the Online e-submission system to complete identity verification and submission", tools: "Application form, Online submission, assistant-entered data" }
                }
            },
            {
                id: 4,
                key: 'PolicyServicing',
                title: 'Stage 4: Policy Servicing',
                titleZh: '階段 4：保單售後服務',
                actions: [
                    "Action A: Managing Client Data",
                    "Action B: Querying Client Policy Status (e.g., client proactively asks about coverage due to external sales pitches, life events, etc.)",
                    "Action C: Processing Claims / Policy Alterations"
                ],
                actionsZh: [
                    "行動 A：客戶資料管理",
                    "行動 B：查詢客戶保單狀態（例如：客戶因外部行銷話術、生活事件主動詢問保障）",
                    "行動 C：理賠與契約變更處理"
                ],
                actionDetails: [
                    {
                        name: "Action A: Managing Client Data",
                        nameZh: "行動 A：客戶資料管理",
                        locations: ['Office', 'Home', 'Online', 'Phone', 'Other'],
                        locationsZh: ['辦公室', '住家', '線上', '電話', '其他'],
                        tools: ['Agent Portal', 'Mobile contacts', 'Excel / Notion', 'Paper notebook', 'Other'],
                        toolsZh: ['業務員入口網站', '手機通訊錄', 'Excel／Notion', '紙本筆記本', '其他'],
                        painPoints: ['Scattered customer files across systems', 'No automatic anniversary alerts', 'Other'],
                        painPointsZh: ['客戶資料分散各處難以集中', '缺乏生日／保單週年自動提醒', '其他']
                    },
                    {
                        name: "Action B: Querying Client Policy Status (e.g., client proactively asks about coverage due to external sales pitches, life events, etc.)",
                        nameZh: "行動 B：查詢客戶保單狀態（例如：客戶因外部行銷話術、生活事件主動詢問保障）",
                        locations: ['Office', 'Online', 'Phone', 'Client\'s location', 'Other'],
                        locationsZh: ['辦公室', '線上', '電話', '客戶所在地點', '其他'],
                        tools: ['Customer Service System', 'Agent App', 'Call centre hotline', 'Other'],
                        toolsZh: ['客戶服務系統', '業務員 App', '客服中心專線', '其他'],
                        painPoints: ['Restricted query permissions', 'Slow system response during peak hours', 'Other'],
                        painPointsZh: ['查詢權限受限需多重授權', '尖峰時段系統回應緩慢', '其他']
                    },
                    {
                        name: "Action C: Processing Claims / Policy Alterations",
                        nameZh: "行動 C：理賠與契約變更處理",
                        locations: ['Office', 'Branch counter', 'Online', 'Client\'s location', 'Other'],
                        locationsZh: ['辦公室', '分公司櫃檯', '線上', '客戶所在地點', '其他'],
                        tools: ['Claims System', 'Alteration forms', 'Branch counter staff', 'Administrative Assistant', 'Other'],
                        toolsZh: ['理賠系統', '契約變更申請書', '臨櫃服務窗口', '行政助理', '其他'],
                        painPoints: ['Complex claims documentation', 'Slow alteration approval progress', 'Lengthy wait times', 'Other'],
                        painPointsZh: ['理賠證明文件繁複', '契約變更審核進度緩慢', '客戶因等待時間過長抱怨', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Directs clients to the customer service hotline or sends them the online alteration form link", tools: "Mobile hotline, customer portal link, WeChat/LINE" },
                    expert: { actions: "Personally visits clients with physical alteration forms and delivers claims compensation cheques", tools: "Paper alteration forms, branch visit, company vehicle" },
                    optimizer: { actions: "Submits alteration requests online via agent e-portal, receives instant system acknowledgement", tools: "Agent e-portal, tablet scanner, PDF signing" },
                    skeptic: { actions: "Collects paper documents from clients, fills out forms by hand, submits at the branch counter", tools: "Physical forms, branch service desk, personal stamp" },
                    parttimer: { actions: "Sends forms via email or LINE for clients to print and mail directly to the customer centre", tools: "LINE PDF sharing, email, mail service" },
                    all: { actions: "Assists clients with policy changes, claims paperwork, and ongoing contract maintenance", tools: "Agent e-portal, branch counter, LINE" }
                }
            },
            {
                id: 5,
                key: 'BranchAdmin',
                title: 'Stage 5: Branch Administration & Support Work',
                titleZh: '階段 5：通訊處行政與支援工作',
                actions: [
                    "Action A: Searching for Sales Support Files",
                    "Action B: Searching for Recruiting Files / Prospect Profiling, Evaluations, & Testing",
                    "Action C: Team Mentoring & Performance Management"
                ],
                actionsZh: [
                    "行動 A：搜尋銷售支援文件",
                    "行動 B：搜尋增員文件／準增員人設輪廓、評估與測驗",
                    "行動 C：團隊輔導與績效管理"
                ],
                actionDetails: [
                    {
                        name: "Action A: Searching for Sales Support Files",
                        nameZh: "行動 A：搜尋銷售支援文件",
                        locations: ['Branch office', 'Online portal', 'Home', 'Other'],
                        locationsZh: ['通訊處辦公室', '線上公用區', '住家', '其他'],
                        tools: ['Agent Portal', 'Shared network drive', 'Administrative Assistant', 'Senior colleague', 'Other'],
                        toolsZh: ['業務員入口網站', '內部共享雲端', '行政助理', '資深前輩', '其他'],
                        painPoints: ['Difficult file search', 'Obsolete document versions', 'Complex folder hierarchy', 'Other'],
                        painPointsZh: ['公文文件檢索不易', '易下載到過期舊版文件', '資料夾層級過於混亂', '其他']
                    },
                    {
                        name: "Action B: Searching for Recruiting Files / Prospect Profiling, Evaluations, & Testing",
                        nameZh: "行動 B：搜尋增員文件／準增員人設輪廓、評估與測驗",
                        locations: ['Branch office', 'Coffee shop', 'Online', 'Phone', 'Other'],
                        locationsZh: ['通訊處辦公室', '咖啡廳', '線上', '電話', '其他'],
                        tools: ['Recruitment portal', 'Personality test system', 'Senior manager', 'Other'],
                        toolsZh: ['增員入口系統', '人才測評系統', '處經理／資深主管', '其他'],
                        painPoints: ['Lack of digital candidate tracking', 'Tedious paper assessment forms', 'Other'],
                        painPointsZh: ['準增員對象缺乏數位進度追蹤', '紙本測驗批改耗時', '其他']
                    },
                    {
                        name: "Action C: Team Mentoring & Performance Management",
                        nameZh: "行動 C：團隊輔導與績效管理",
                        locations: ['Branch conference room', 'Remote video meeting', 'LINE group', 'Other'],
                        locationsZh: ['通訊處會議室', '線上視訊會議', 'LINE 群組', '其他'],
                        tools: ['KPI performance dashboard', 'Commission calculation system', 'Senior mentors', 'Other'],
                        toolsZh: ['業績儀表板', '佣金試算系統', '輔導前輩', '其他'],
                        painPoints: ['Delayed performance data updates', 'Low attendance in morning physical meetings', 'Other'],
                        painPointsZh: ['業績報表產出延遲', '早會晨報實體出席率不易維持', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Attends morning meetings remotely or checks meeting notes on phone", tools: "LINE group, mobile meeting link" },
                    expert: { actions: "Arrives early at the branch office, participates actively in desk discussions and mentors junior agents", tools: "Branch desk, whiteboard, physical binders" },
                    optimizer: { actions: "Tracks personal and team KPIs on digital dashboard, minimises physical admin attendance", tools: "Tableau/Excel dashboard, commission app" },
                    skeptic: { actions: "Prefers branch bulletin boards and printed commission statements", tools: "Printed pay slips, notice boards" },
                    parttimer: { actions: "Attends weekly catchups irregularly, relies on group summaries", tools: "LINE group, colleagues' updates" },
                    all: { actions: "Coordinates administrative, commission, and managerial routines within the branch", tools: "Branch meetings, ERP portal" }
                }
            },
            {
                id: 6,
                key: 'Training',
                title: 'Stage 6: Training & Learning',
                titleZh: '階段 6：培訓與學習',
                actions: [
                    "Action A: Educational Training Courses",
                    "Action B: Online Learning Resources (e.g., ABC Academy)",
                    "Action C: Observing Visits & Presentation Approaches of Senior Agents"
                ],
                actionsZh: [
                    "行動 A：教育訓練課程",
                    "行動 B：線上學習資源（例如 ABC 學院）",
                    "行動 C：觀摩前輩拜訪與展業技巧"
                ],
                actionDetails: [
                    {
                        name: "Action A: Educational Training Courses",
                        nameZh: "行動 A：教育訓練課程",
                        locations: ['Classroom', 'Online webinar', 'Branch training room', 'Other'],
                        locationsZh: ['實體培訓教室', '線上視訊研討會', '通訊處培訓室', '其他'],
                        tools: ['Printed training slides', 'Internal lecturers', 'ABC Academy', 'Other'],
                        toolsZh: ['紙本講義簡報', '內聘講師', 'ABC 學院', '其他'],
                        painPoints: ['Course schedules conflict with client visits', 'Heavy reliance on one-way lecturing', 'Other'],
                        painPointsZh: ['課程時間與客戶拜訪衝突', '單向講授缺乏實務互動', '其他']
                    },
                    {
                        name: "Action B: Online Learning Resources (e.g., ABC Academy)",
                        nameZh: "行動 B：線上學習資源（例如 ABC 學院）",
                        locations: ['Home', 'Mobile during commute', 'Office', 'Other'],
                        locationsZh: ['住家', '通勤手機使用', '辦公室', '其他'],
                        tools: ['ABC Academy App', 'Compliance exam simulator', 'Learning portal', 'Other'],
                        toolsZh: ['ABC 學院 App', '法遵測驗模擬系統', '數位學習入口', '其他'],
                        painPoints: ['Video playback speed cannot be adjusted', 'Mandatory compliance test questions tedious', 'Other'],
                        painPointsZh: ['線上影片無法自訂倍速', '法遵必修測驗重複刷題耗時', '其他']
                    },
                    {
                        name: "Action C: Observing Visits & Presentation Approaches of Senior Agents",
                        nameZh: "行動 C：觀摩前輩拜訪與展業技巧",
                        locations: ['Client\'s meeting venue', 'Branch office', 'Dining venue', 'Other'],
                        locationsZh: ['陪同拜訪客戶現場', '通訊處辦公室', '餐敘場合', '其他'],
                        tools: ['Senior colleagues', 'Mentors', 'Paper note taking', 'Other'],
                        toolsZh: ['資深主管', '專屬導師', '隨身筆記本', '其他'],
                        painPoints: ['Hard to schedule mutual time with senior mentors', 'Field accompaniment opportunities limited', 'Other'],
                        painPointsZh: ['與資深主管時間難以配合', '現場陪同觀摩機會有限', '其他']
                    }
                ],
                qualitative: {
                    explorer: { actions: "Completes micro-learning video modules on smartphone during spare time", tools: "ABC Academy mobile app, YouTube tutorial videos" },
                    expert: { actions: "Attends classroom lectures and in-person industry seminars for accreditation", tools: "Classroom binder, printed lecture slides" },
                    optimizer: { actions: "Sets up personal learning queues for compliance and product certifications, fast-tracks online exams", tools: "LMS portal, double-speed video playback" },
                    skeptic: { actions: "Prefers peer apprenticeship, shadows senior agents during real client meetings", tools: "Field accompaniment, direct observation" },
                    parttimer: { actions: "Studies mandatory compliance courses right before renewal deadlines", tools: "Online compliance quizzes" },
                    all: { actions: "Enhances product knowledge, regulatory compliance, and sales techniques through mixed-mode learning", tools: "Academy app, seminars, mentoring" }
                }
            }
        ],
        selfImageTags: [
            "Cultivation of Customer Relations",
            "Predictive Service",
            "Opportunity Hunter",
            "Embracing Ideals",
            "Rookie Agent",
            "Digital Savvy Tool User",
            "Proactive Development",
            "Intuitive & Sharp",
            "Inquisitive Learner",
            "Trust-Based",
            "Strong Sense of Responsibility",
            "Premium Training",
            "Flexible Adaptation",
            "Number-Oriented",
            "High Empathy",
            "Proactive Communication",
            "Fast & Precise",
            "Rapid Response",
            "Progress Transparency",
            "Process Expert",
            "Emotional Connection",
            "Family Protector",
            "Action-Oriented",
            "Trust Through Service",
            "Detail Controller",
            "Summit Convention Regular",
            "Event Sensitive",
            "Service Priority",
            "Analytical Planning",
            "Efficiency First"
        ],
        selfImageTagsZh: [
            "深耕客戶關係", "預測式服務", "商機獵人", "主動開發", "菜鳥業務員",
            "數位工具達人", "擁抱理想", "直覺敏銳", "好學求知", "信任導向",
            "責任感強", "精進培訓", "彈性應變", "數字導向", "高同理心",
            "主動溝通", "快速精準", "即時回應", "進度透明", "流程專家",
            "情感連結", "家庭守護者", "行動導向", "以服務贏得信任", "細節掌控",
            "高峰會常客", "活動敏銳", "服務優先", "分析規劃", "效率至上"
        ],
        q8Prompt: 'Please write down the 1st tag that “best represents you” from the options above.',
        q8PromptZh: '請從上方選項中，選出「最能代表您」的第 1 個標籤：',
        q9Prompt: 'Please write down the 2nd tag that represents you; please do not repeat Q8.',
        q9PromptZh: '請選出代表您的第 2 個標籤；不得與第 8 題重複。',
        q10Prompt: 'Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.',
        q10PromptZh: '請選出代表您的第 3 個標籤；不得與第 8、9 題重複。',
        // Part III Prompts & Options
        q11Prompt: 'What is your level of familiarity with current agent tools/systems?',
        q11PromptZh: '您對目前業務員工具／系統的熟悉程度為何？',
        q12Prompt: 'Overall, how does your current work style make you feel?',
        q12PromptZh: '整體而言，您目前的工作方式讓您感覺如何？',
        q13Prompt: 'What impact do you feel the tools/systems currently provided by ABC Insurance have on your daily work efficiency?',
        q13PromptZh: '您認為 ABC 保險目前提供的工具／系統，對您日常工作效率有何影響？',
        q13Options: ['Severely slows down efficiency', 'Slightly slows down efficiency', 'No noticeable impact', 'Slightly improves efficiency', 'Significantly improves efficiency'],
        q13OptionsZh: ['嚴重拖慢效率', '略微拖慢效率', '無明顯影響', '略微提升效率', '大幅提升效率'],
        q17Prompt: 'How do you plan and schedule customer visits?',
        q17PromptZh: '您如何規劃與安排客戶拜訪行程？',
        q18Prompt: 'If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)',
        q18PromptZh: '若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）',
        q19Prompt: 'If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?',
        q19PromptZh: '若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？',
        q19Options: ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling'],
        q19OptionsZh: ['極度願意', '願意', '普通', '意願低', '完全不願意'],
        dailyWorkItems: [
            "a) Scheduling and visiting clients",
            "b) Maintaining prospect lists / developing new lists",
            "c) Signing policies",
            "d) Post-sales service",
            "e) Enhancing professional knowledge/training",
            "f) Internal administrative tasks",
            "g) System/tool optimisation and learning",
            "h) Office gatherings and team activities",
            "i) Recruiting",
            "j) Other"
        ],
        dailyWorkItemsZh: [
            "a) 安排與拜訪客戶",
            "b) 維護準客戶名單／開發新名單",
            "c) 簽署保單",
            "d) 售後服務",
            "e) 提升專業知識／教育訓練",
            "f) 內部行政事務",
            "g) 系統／工具優化與學習",
            "h) 辦公室聚會與團隊活動",
            "i) 增員",
            "j) 其他"
        ],
        officialSystems: [
            "Insurance Submission System", "Online Signing System", "Claims System", "Service System",
            "Agent App", "Agent Portal", "ABC Academy", "Proposal System", "Other official system"
        ],
        officialSystemsZh: [
            "投保送件系統", "線上簽署系統", "理賠系統", "服務系統",
            "業務員 App", "業務員入口網站", "ABC 學院", "建議書系統", "其他正式系統"
        ],
        personalTools: [
            "LINE", "Mobile Notes / Calendar App", "Phone Call (personal)", "Canva",
            "Paper Application Forms", "AI tools (e.g., NotebookLM)", "Notion / Google Sheets",
            "Paper Notebook / Desk Calendar", "Administrative Assistant / Peer assistance for data logging",
            "Branch Counter / In-Person (manual override)", "Other personal tool (please specify)"
        ],
        personalToolsZh: [
            "LINE", "手機記事本／日曆 App", "電話（個人）", "Canva",
            "紙本申請書", "AI 工具（例如 NotebookLM）", "Notion／Google 試算表",
            "紙本筆記本／桌曆", "行政助理／同儕協助資料登錄",
            "分公司櫃檯／臨櫃（人工處理）", "其他個人工具（請說明）"
        ],
        coreNeeds: [
            "Fast login / FaceID & Fingerprint login", "Simplified system interface operations",
            "Single portal system integration", "Open API / custom integration features",
            "Fuzzy keyword search", "Mobile App experience optimisation",
            "Automated list classification / tagging", "Offline cache support",
            "One-click automatic quotation generation", "Retain counter/paper processing options",
            "Extend online signature validity duration", "Assistant account delegation permissions",
            "Convenient paper printing / large-font interface", "Reduce loading times",
            "Predefined options for common occupations/products", "Other (please specify)"
        ],
        coreNeedsZh: [
            "快速登入／Face ID 與指紋登入", "簡化系統介面操作",
            "單一入口系統整合", "開放 API／客製化整合功能",
            "模糊關鍵字搜尋", "優化行動 App 體驗",
            "名單自動分類／標籤", "離線快取支援",
            "一鍵自動產生報價", "保留櫃檯／紙本作業選項",
            "延長線上簽署的有效期限", "助理帳號委派權限",
            "便利的紙本列印／大字體介面", "縮短載入時間",
            "常見職業／商品的預設選項", "其他（請說明）"
        ],
        archetypes: {
            explorer: { name: 'Digital Trailblazer (Alex Chen)', nameZh: '數位先鋒 (Alex Chen)' },
            expert: { name: 'Senior Expert (Uncle David)', nameZh: '資深專家 (Uncle David)' },
            optimizer: { name: 'Efficiency Optimiser (Sarah Lin)', nameZh: '效率實踐家 (Sarah Lin)' },
            skeptic: { name: 'Traditional Relationship Seeker (Brother Lin)', nameZh: '傳統守護者 (Brother Lin)' },
            parttimer: { name: 'Pragmatic Partner (Jessica Wu)', nameZh: '實務精算者 (Jessica Wu)' }
        },
        questions: [
            {
                "id": "Q1",
                "number": 1,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "What is your age range?",
                "promptZh": "請問您的年齡區間為何？",
                "options": ["Under 25", "26–35", "36–45", "46–55", "56–65", "66 or above"],
                "optionsZh": ["25 歲以下", "26–35 歲", "36–45 歲", "46–55 歲", "56–65 歲", "66 歲以上"]
            },
            {
                "id": "Q2",
                "number": 2,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "What is your current service region?",
                "promptZh": "請問您目前所屬的服務區域為何？",
                "options": [
                    "Taipei I Business Development Dept.",
                    "Taipei II Business Development Dept.",
                    "Taoyuan/Hsinchu/Miaoli Business Development Dept.",
                    "Central Region Business Development Dept.",
                    "Southern Region Business Development Dept."
                ],
                "optionsZh": ["台北一區業務發展部", "台北二區業務發展部", "桃竹苗業務發展部", "中區業務發展部", "南區業務發展部"]
            },
            {
                "id": "Q3",
                "number": 3,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "open_text",
                "prompt": "What is the name of your communication office (branch)?",
                "promptZh": "請問您所屬的通訊處（分處）名稱為何？",
                "placeholder": "Communication Office / Branch: __________________________________________________",
                "placeholderZh": "通訊處／分處：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"
            },
            {
                "id": "Q4",
                "number": 4,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "What is your current job rank/title?",
                "promptZh": "請問您目前的職級／職稱為何？",
                "options": [
                    "New Agent",
                    "Sales Supervisor",
                    "Sales Manager",
                    "District Manager",
                    "Agency Manager",
                    "Director"
                ],
                "optionsZh": ["新進業務員", "業務主任", "業務經理", "區經理", "處經理", "協理"]
            },
            {
                "id": "Q5",
                "number": 5,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "What is your range of years of experience in insurance sales?",
                "promptZh": "請問您的保險銷售年資區間為何？",
                "options": [
                    "Under 1 year",
                    "1–3 years",
                    "3–5 years",
                    "6–10 years",
                    "11–15 years",
                    "16–20 years",
                    "21–25 years",
                    "26–30 years",
                    "30 years or more"
                ],
                "optionsZh": [
                    "未滿 1 年",
                    "1–3 年",
                    "3–5 年",
                    "6–10 年",
                    "11–15 年",
                    "16–20 年",
                    "21–25 年",
                    "26–30 年",
                    "30 年以上"
                ]
            },
            {
                "id": "Q6",
                "number": 6,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "Approximately how many customers have you served up to now?",
                "promptZh": "請問您至今大約服務過多少位客戶？",
                "options": [
                    "Under 50 customers",
                    "51–100 customers",
                    "101–300 customers",
                    "301–600 customers",
                    "600 customers or more"
                ],
                "optionsZh": ["50 位以下", "51–100 位", "101–300 位", "301–600 位", "600 位以上"]
            },
            {
                "id": "Q7",
                "number": 7,
                "section": "demographics",
                "sectionNumber": "I",
                "type": "single_select",
                "prompt": "Compared to peers in your same communication office, where did your sales performance rank over the past 12 months?",
                "promptZh": "與同通訊處的同儕相比，您過去 12 個月的銷售業績排名為何？",
                "options": [
                    "Top 10%",
                    "Top 25%",
                    "Average level",
                    "Bottom 50%",
                    "Uncertain / Inconvenient to disclose"
                ],
                "optionsZh": ["前 10%", "前 25%", "平均水準", "後 50%", "不確定／不便透露"],
                "note": "Note: This question is strictly used to filter subsequent questions and will not be used for individual performance reviews. Please answer with confidence.",
                "noteZh": "註：本題僅用於篩選後續題目，不會用於個人績效考核，請安心作答。"
            },
            {
                "id": "Q8",
                "number": 8,
                "section": "tags",
                "sectionNumber": "II",
                "type": "single_select",
                "tagPoolRef": "selfImageTags",
                "prompt": "Please write down the 1st tag that “best represents you” from the options above.",
                "promptZh": "請從上方選項中，選出「最能代表您」的第 1 個標籤：",
                "writeInField": "Tag 1"
            },
            {
                "id": "Q9",
                "number": 9,
                "section": "tags",
                "sectionNumber": "II",
                "type": "single_select",
                "tagPoolRef": "selfImageTags",
                "validation": {"doNotRepeat": ["Q8"]},
                "prompt": "Please write down the 2nd tag that represents you; please do not repeat Q8.",
                "promptZh": "請選出代表您的第 2 個標籤；不得與第 8 題重複。",
                "writeInField": "Tag 2"
            },
            {
                "id": "Q10",
                "number": 10,
                "section": "tags",
                "sectionNumber": "II",
                "type": "single_select",
                "tagPoolRef": "selfImageTags",
                "validation": {"doNotRepeat": ["Q8", "Q9"]},
                "prompt": "Please write down the 3rd tag that represents you; please do not repeat Q8 and Q9.",
                "promptZh": "請選出代表您的第 3 個標籤；不得與第 8、9 題重複。",
                "writeInField": "Tag 3"
            },
            {
                "id": "Q11",
                "number": 11,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "percentage_scale",
                "prompt": "What is your level of familiarity with current agent tools/systems?",
                "promptZh": "您對目前業務員工具／系統的熟悉程度為何？",
                "startLabel": "Extremely Unfamiliar",
                "startLabelZh": "極不熟悉",
                "endLabel": "Extremely Familiar",
                "endLabelZh": "極為熟悉",
                "options": ["0%", "20%", "40%", "60%", "80%", "100%"],
                "optionsZh": ["0%", "20%", "40%", "60%", "80%", "100%"]
            },
            {
                "id": "Q12",
                "number": 12,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "emoji_scale",
                "prompt": "Overall, how does your current work style make you feel?",
                "promptZh": "整體而言，您目前的工作方式讓您感覺如何？",
                "startLabel": "Extremely Unhappy",
                "startLabelZh": "極不快樂",
                "endLabel": "Extremely Happy",
                "endLabelZh": "極為快樂",
                "scaleValues": [1, 2, 3, 4, 5],
                "options": ["😩", "🙁", "😐", "🙂", "😄"],
                "optionsZh": ["😩", "🙁", "😐", "🙂", "😄"]
            },
            {
                "id": "Q13",
                "number": 13,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "single_select",
                "prompt": "What impact do you feel the tools/systems currently provided by ABC Insurance have on your daily work efficiency?",
                "promptZh": "您認為 ABC 保險目前提供的工具／系統，對您日常工作效率有何影響？",
                "options": [
                    "Severely slows down efficiency",
                    "Slightly slows down efficiency",
                    "No noticeable impact",
                    "Slightly improves efficiency",
                    "Significantly improves efficiency"
                ],
                "optionsZh": ["嚴重拖慢效率", "略微拖慢效率", "無明顯影響", "略微提升效率", "大幅提升效率"]
            },
            {
                "id": "Q14",
                "number": 14,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "rating_matrix",
                "prompt": "Please evaluate the impact of each of the following SYSTEM / DIGITAL TOOL factors on your work efficiency.",
                "promptZh": "請評估下列「系統／數位工具」因素對您工作效率的影響程度。",
                "ratingScale": ["No Impact at All", "A Little Impact", "Neutral", "Has Impact", "High Impact"],
                "ratingScaleZh": ["完全沒有影響", "有一點影響", "普通", "有影響", "影響很大"],
                "matrixItems": [
                    "Digital Tool Usage (Apps/Systems)",
                    "System / Portal Speed & Reliability",
                    "Mobile App Experience"
                ],
                "matrixItemsZh": ["數位工具使用（App／系統）", "系統／入口網站的速度與穩定度", "行動 App 使用體驗"]
            },
            {
                "id": "Q15",
                "number": 15,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "rating_matrix",
                "prompt": "Please evaluate the impact of each of the following PROFESSIONAL CAPABILITIES on your overall business and sales performance.",
                "promptZh": "請評估下列「專業能力」對您整體業務與銷售績效的影響程度。",
                "ratingScale": ["No Impact at All", "A Little Impact", "Neutral", "Has Impact", "High Impact"],
                "ratingScaleZh": ["完全沒有影響", "有一點影響", "普通", "有影響", "影響很大"],
                "matrixItems": [
                    "Sales Pitch & Communication Skills",
                    "Customer Relationship Management",
                    "Customer Service",
                    "Insurance Knowledge (Products/Terms/Regulations/Taxes)"
                ],
                "matrixItemsZh": ["銷售話術與溝通能力", "客戶關係管理", "客戶服務", "保險知識（商品／條款／法規／稅務）"],
                "allowOther": true,
                "otherSpecifyLabel": "If “Other” selected above, please specify:",
                "otherSpecifyLabelZh": "若上題選擇「其他」，請說明："
            },
            {
                "id": "Q16",
                "number": 16,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "multi_select",
                "prompt": "What are the primary reasons you use tools like LINE or personal contacts to handle customer-related matters? (Multi-select)",
                "promptZh": "您使用 LINE 或個人聯絡方式處理客戶相關事務的主要原因為何？（複選）",
                "options": [
                    "Faster speed",
                    "More familiar interface",
                    "Company system lacks this function",
                    "Customers prefer communicating this way",
                    "Company system login/operation is too troublesome",
                    "I rarely use personal tools"
                ],
                "optionsZh": ["速度較快", "介面較熟悉", "公司系統沒有此功能", "客戶偏好以此方式溝通", "公司系統登入／操作太麻煩", "我很少使用個人工具"],
                "allowOther": true,
                "otherPlaceholder": "Other: _________________________________________________________",
                "otherPlaceholderZh": "其他：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"
            },
            {
                "id": "Q17",
                "number": 17,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "multi_select_with_subquestion",
                "prompt": "How do you plan and schedule customer visits?",
                "promptZh": "您如何規劃與安排客戶拜訪行程？",
                "options": [
                    "Company system",
                    "Personal apps (e.g., Google Calendar)",
                    "Paper calendar/notebook",
                    "Do not specifically plan"
                ],
                "optionsZh": ["公司系統", "個人 App（例如 Google 日曆）", "紙本行事曆／筆記本", "沒有特別規劃"],
                "allowOther": true,
                "subQuestion": {
                    "prompt": "Regardless of the method chosen, what is your main reason? (Multi-select)",
                    "promptZh": "無論選擇何種方式，您的主要原因為何？（複選）",
                    "type": "multi_select",
                    "options": [
                        "Private schedule should not be made public",
                        "Historical tracking and reference",
                        "Intuitive and convenient"
                    ],
                    "optionsZh": [
                        "私人行程不宜公開",
                        "方便追蹤歷史紀錄與查閱",
                        "直覺且方便"
                    ],
                    "allowOther": true
                }
            },
            {
                "id": "Q18",
                "number": 18,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "single_select",
                "conditionalOn": "Q17",
                "prompt": "If you chose “Paper calendar/notebook” above, what is the main reason? (Single Select; skip if not applicable)",
                "promptZh": "若您上述勾選「紙本桌曆／筆記本」，主要原因為何？（單選；若不適用請略過）",
                "options": [
                    "Action locations are easy to mark",
                    "Time allocations can be clearly compared, and pages can be flipped back and forth for comparison",
                    "Free slots can be seen at a glance"
                ],
                "optionsZh": ["方便標記行動地點", "可清楚比較時間分配，並能前後翻頁對照", "空檔一目了然"],
                "allowOther": true
            },
            {
                "id": "Q19",
                "number": 19,
                "section": "dimensions",
                "sectionNumber": "III",
                "type": "single_select",
                "prompt": "If the system could automatically provide relevant info/suggestions/leads before your next scheduled itinerary based on your calendar, what would your willingness be?",
                "promptZh": "若系統能依據您的行事曆，在您前往下一個預定行程前，自動提供相關資訊／建議／潛在商機，您的使用意願為何？",
                "options": [
                    "Extremely willing",
                    "Willing",
                    "Neutral",
                    "Low willingness",
                    "Completely unwilling"
                ],
                "optionsZh": ["極度願意", "願意", "普通", "意願低", "完全不願意"],
                "allowOther": true
            },
            {
                "id": "Q20",
                "number": 20,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "ranking_allocation",
                "itemsRef": "dailyWorkItems",
                "maxSelections": 5,
                "prompt": "The following lists 9 categories of work items. Please fill in the codes for your main daily work items (up to 5 items) and estimate the proportion of time occupied by each item in the table below. If there are no matching options, please select “j) Other” and fill in the work item yourself.",
                "promptZh": "以下列出 9 類工作項目。請填入您日常主要工作項目的代碼（最多 5 項），並於下表概估各項目所佔的時間比例。若沒有符合的選項，請選擇「j) 其他」並自行填寫工作項目。",
                "scaleCheckpoints": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
            },
            {
                "id": "Q21",
                "number": 21,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "open_text",
                "prompt": "In carrying out your daily tasks above, is there a gap or contradiction between the goals you hope to achieve and what you can actually accomplish due to limitations of devices, systems, or knowledge?",
                "promptZh": "在執行上述日常工作時，您希望達成的目標，與您因裝置、系統或知識上的限制而實際能完成的結果之間，是否存在落差或矛盾？"
            },
            {
                "id": "Q22",
                "number": 22,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "multi_select",
                "itemsRef": "officialSystems",
                "prompt": "Which OFFICIAL COMPANY SYSTEMS do you use most frequently in your insurance operations? (Multi-select)",
                "promptZh": "在您的保險業務作業中，最常使用哪些「公司正式系統」？（複選）",
                "allowOther": true,
                "otherPlaceholder": "Other official system: __________________________________________________",
                "otherPlaceholderZh": "其他正式系統：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"
            },
            {
                "id": "Q23",
                "number": 23,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "multi_select",
                "itemsRef": "personalTools",
                "prompt": "Which PERSONAL TOOLS / WORKAROUNDS do you use most frequently in your insurance operations? (Multi-select)",
                "promptZh": "在您的保險業務作業中，最常使用哪些「個人工具／替代做法」？（複選）",
                "allowOther": true,
                "otherPlaceholder": "Other personal tool (please specify): ___________________________________________",
                "otherPlaceholderZh": "其他個人工具（請說明）：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"
            },
            {
                "id": "Q24",
                "number": 24,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "multi_select",
                "itemsRef": "coreNeeds",
                "maxSelections": 5,
                "prompt": "In your busy insurance work, what are your most critical core needs / expectations? (Select up to 5)",
                "promptZh": "在繁忙的保險工作中，您最關鍵的核心需求／期待為何？（最多選 5 項）",
                "allowOther": true,
                "otherPlaceholder": "Other (please specify): __________________________________________________",
                "otherPlaceholderZh": "其他（請說明）：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿"
            },
            {
                "id": "Q25",
                "number": 25,
                "section": "workContent",
                "sectionNumber": "IV",
                "type": "open_text",
                "prompt": "Please share a motto that best represents you in one sentence.",
                "promptZh": "請以一句話分享最能代表您的座右銘。"
            },
            {
                "id": "Q26",
                "number": 26,
                "section": "journey",
                "sectionNumber": "V",
                "type": "single_select",
                "prompt": "In your daily work, which journey do you focus on most and experience every day? (Single Select)",
                "promptZh": "請問在日常工作中，您最著重並每日體會的是哪一個歷程？（單選）",
                "options": ["Sales Journey", "Organisational Development Journey"],
                "optionsZh": [
                    "銷售歷程",
                    "組織發展歷程"
                ]
            },
            {
                "id": "Q27",
                "number": 27,
                "section": "journey",
                "sectionNumber": "V",
                "type": "journey_task_matrix",
                "stagesRef": "stages",
                "taskCount": 6,
                "prompt": "Stage Journey Touchpoint Deep-Dive (Stages 1 to 6):",
                "promptZh": "階段歷程接觸點深度盤點（階段 1 至 階段 6）：",
                "taskActionRule": "To complete this stage, the sequential actions you typically perform are (up to 3):",
                "taskActionRuleZh": "完成此階段通常依序執行的行動（最多3項）：",
                "dimensions": [
                    {
                        "key": "location",
                        "label": "Physical/Digital location when executing:",
                        "labelZh": "執行時的實體／數位地點："
                    },
                    {
                        "key": "tools",
                        "label": "Tools or people helping you complete this action:",
                        "labelZh": "協助完成此行動的工具或對象："
                    },
                    {
                        "key": "painPoints",
                        "label": "Pain points encountered in this action:",
                        "labelZh": "此行動中遭遇的痛點："
                    },
                    {
                        "key": "emotionalRating",
                        "label": "Please rate your emotional experience for this stage:",
                        "labelZh": "請評估您對此階段的整體情緒體驗：",
                        "scale": [
                            "1😫",
                            "2 😮‍💨",
                            "3 😐",
                            "4 🙂",
                            "5 🤩"
                        ]
                    }
                ]
            }
        ],
        templateFileEn: 'Modular_Questionnaire_Template.pdf',
        templateFileZh: '保險業務員數位工作風格與人物誌問卷.pdf'
    },
    policyholder: {
        id: 'policyholder',
        name: 'Policyholder Customer Journey & Experience Questionnaire',
        nameZh: '零售保戶數位體驗與服務旅程問卷',
        targetAudience: 'Retail Insurance Policyholders',
        targetAudienceZh: '零售保險保戶',
        icon: '🛡️',
        badge: 'Customer Experience Analytics',
        badgeZh: '保戶體驗分析',
        sectionsConfig: {
            demographics: true,
            dimensions: true,
            tags: true,
            workContent: true,
            journey: true,
            stages: true
        },
        sectionTitles: {
            demographics: "Policyholder Demographics & Profile",
            demographicsZh: "保戶基本背景資料",
            tags: "Policyholder Mindset & Persona Archetype Tags",
            tagsZh: "保戶投保心態與個人形象標籤",
            dimensions: "Insurance Experience & Digital Satisfaction",
            dimensionsZh: "數位保險體驗與滿意度",
            workContent: "Daily Financial Habits, Channels & Expectations",
            workContentZh: "日常理財習慣、服務管道與核心期待",
            journey: "Policyholder Customer Journey & Touchpoints",
            journeyZh: "保戶顧客旅程與接觸點體驗",
            stages: "Policyholder Journey Stages & Key Service Touchpoints",
            stagesZh: "保戶服務歷程階段與關鍵接觸點"
        },
        intro: "Dear Policyholder, Hello! This questionnaire aims to understand your overall experience, digital self-service habits, and service touchpoint needs across your insurance journey—from product exploration and underwriting to policy management and claims. The questionnaire takes about 8–10 minutes to complete. All responses are analysed dynamically using unsupervised machine learning to discover customer persona clusters and improve our digital insurance services. Thank you for your valuable feedback!",
        introZh: "親愛的保戶您好！本問卷旨在了解您在保險體驗歷程中的日常互動習慣、數位工具使用偏好，以及在投保、保單管理與理賠各階段所遇到的需求與挑戰。問卷約需 8–10 分鐘完成。所有回覆將透過非監督式機器學習演算法進行動態分群分析，以優化保戶數位服務體驗與自助管道品質。感謝您的寶貴時間與協助！",
        journeyIntro: "Six core policyholder customer service stages are listed below. Please review each stage's touchpoints, service locations, tools, and friction points based on your actual experience as a policyholder.",
        journeyIntroZh: "以下列出零售保戶六大核心服務旅程階段。請依據您的實際投保與服務體驗，檢視各階段的服務接觸點、互動地點、輔助工具與主要痛點：",
        demographics: [
            {
                key: 'Age',
                label: 'What is your age range?',
                labelZh: '請問您的年齡區間為何？',
                type: 'single',
                options: '18–25, 26–35, 36–45, 46–55, 56–65, 66 or above',
                optionsZh: '18–25 歲, 26–35 歲, 36–45 歲, 46–55 歲, 56–65 歲, 66 歲以上'
            },
            {
                key: 'Region',
                label: 'What is your current residential area/region?',
                labelZh: '請問您目前居住的地區為何？',
                type: 'single',
                options: 'Northern Taiwan, Central Taiwan, Southern Taiwan, Eastern Taiwan & Islands',
                optionsZh: '北部地區, 中部地區, 南部地區, 東部及離島地區'
            },
            {
                key: 'Occupation',
                label: 'What is your current occupation category?',
                labelZh: '請問您目前從事的職業類別為何？',
                type: 'single',
                options: 'Salaried Professional, Healthcare / Professional Specialist, Business Owner / Self-employed, Civil Servant / Educator, Homemaker / Student, Retired / Other',
                optionsZh: '一般上班族／企業員工, 醫事專業／專業技術人員, 企業主／自營商, 公教人員／軍警, 家管／在學學生, 退休人員／其他'
            },
            {
                key: 'Experience',
                label: 'How many years have you been purchasing/holding commercial insurance?',
                labelZh: '請問您的商業保險購買與投保年資為何？',
                type: 'single',
                options: 'Under 1 year, 1–3 years, 4–6 years, 7–10 years, 11–15 years, 15+ years',
                optionsZh: '未滿 1 年, 1–3 年, 4–6 年, 7–10 年, 11–15 年, 15 年以上'
            },
            {
                key: 'PolicyCount',
                label: 'Approximately how many active insurance policies do you currently hold across all insurers?',
                labelZh: '請問您目前在各家保險公司合計持有的有效保單數量大約有多少張？',
                type: 'single',
                options: '1 Policy, 2–3 Policies, 4–6 Policies, 7–10 Policies, 10+ Policies',
                optionsZh: '1 張, 2–3 張, 4–6 張, 7–10 張, 10 張以上'
            },
            {
                key: 'Channel',
                label: 'Which channel do you primarily rely on when purchasing insurance or handling policy services?',
                labelZh: '請問您在投保或辦理保單服務時，最常依賴的主要接觸管道為何？',
                type: 'single',
                options: 'Dedicated Insurance Agent, Official Mobile App / Customer Web Portal, Bank Counter, Telemarketing / Direct Marketing, Insurance Broker / Independent Agency',
                optionsZh: '專屬保險業務員, 官方行動 App／保戶網站專區, 銀行保險櫃檯, 電話行銷／直效投保, 保險經紀人／代理人'
            },
            {
                key: 'AnnualPremium',
                label: 'Approximately what is your annual household premium expenditure for commercial insurance?',
                labelZh: '請問您個人或家庭每年在商業保險上的總保費支出區間大約為何？',
                type: 'single',
                options: 'Under $30,000, $30,001–$60,000, $60,001–$120,000, $120,001–$250,000, Over $250,000, Prefer not to say',
                optionsZh: '3 萬元以下, 3 萬–6 萬元, 6 萬–12 萬元, 12 萬–25 萬元, 25 萬元以上, 不便透露',
                note: 'Note: This question is strictly used for customer segment analysis and will not affect any policyholder rights. Please answer with confidence.',
                noteZh: '註：本題僅用於保戶客群畫像分析，不影響任何保戶權益，請安心作答。'
            }
        ],
        metrics: [
            { key: 'Skill_Device', label: 'Digital Self-Service Familiarity', labelZh: '數位自助工具操作熟悉度', scaleType: '0-100', category: 'system_efficiency', indicator: 'Familiarity with Customer App and Portal', indicatorZh: '對保戶行動 App 與線上專區之熟稔程度', sourceQuestion: 'Q11' },
            { key: 'Skill_Knowledge', label: 'Policy Coverage & Terms Understanding', labelZh: '保單條款與保障理解度', scaleType: '0-100', category: 'sales_performance', indicator: 'Understanding of Coverage and Terms', indicatorZh: '對保單條款、保障範圍與除外責任之理解', sourceQuestion: 'Q15' },
            { key: 'Skill_Sales_Pitch', label: 'Claims Settlement Transparency & Speed', labelZh: '理賠審核速度與透明度', scaleType: '0-100', category: 'sales_performance', indicator: 'Perception of Claims Turnaround', indicatorZh: '對理賠申辦便利性與給付審核進度之評價', sourceQuestion: 'Q15' },
            { key: 'Skill_Customer_Relations', label: 'Brand & Advisory Trust', labelZh: '品牌與顧問諮詢信任度', scaleType: '0-100', category: 'sales_performance', indicator: 'Trust in Brand and Advisors', indicatorZh: '對保險品牌及專屬顧問服務品質之信賴度', sourceQuestion: 'Q15' },
            { key: 'Skill_Digital_Tools', label: 'Digital Claim & Service Adoption', labelZh: '數位理賠與自助手續滿意度', scaleType: '0-100', category: 'system_efficiency', indicator: 'Satisfaction with Digital Features', indicatorZh: '對線上理賠與自助手續功能之整體滿意度', sourceQuestion: 'Q14' }
        ],
        stages: [
            {
                id: 1,
                key: 'Discovery',
                title: 'Stage 1: Product Discovery & Quotation',
                titleZh: '階段 1：商品探索與試算報價',
                actions: [
                    "Action A: Online comparison of policy tiers and riders",
                    "Action B: Reviewing exclusion clauses, deductibles and waiting periods",
                    "Action C: Requesting preliminary quote from web portal or agent"
                ],
                actionsZh: [
                    "行動 A：線上比較各保單專案與附約保障內容",
                    "行動 B：審視除外條款、自負額與等待期規定",
                    "行動 C：透過官網試算器或業務員取得初步報價單"
                ],
                actionDetails: [
                    {
                        name: "Action A: Online comparison of policy tiers and riders",
                        nameZh: "行動 A：線上比較各保單專案與附約保障內容",
                        locations: ['Home', 'Commute (Smartphone)', 'Online Web Portal', 'Other'],
                        locationsZh: ['家中', '通勤途中（手機操作）', '線上保險專區', '其他'],
                        tools: ['Insurer Mobile App', 'Premium Calculator', 'Policy Comparison Table', 'Other'],
                        toolsZh: ['保戶行動 App', '線上保費試算器', '商品比較表', '其他'],
                        painPoints: ['Confusing insurance jargon', 'Unclear deductibles and waiting periods', 'Non-transparent premium tables', 'Other'],
                        painPointsZh: ['專業條款術語晦澀難懂', '自負額與等待期規定複雜', '費率表不夠透明', '其他']
                    },
                    {
                        name: "Action B: Reviewing exclusion clauses, deductibles and waiting periods",
                        nameZh: "行動 B：審視除外條款、自負額與等待期規定",
                        locations: ['Home', 'Office', 'Online', 'Other'],
                        locationsZh: ['家中', '辦公室', '線上', '其他'],
                        tools: ['Policy Terms PDF', 'Customer Service Hotline', 'Agent LINE Consultation', 'Other'],
                        toolsZh: ['保單條款 PDF', '客服專線', '業務員 LINE 諮詢', '其他'],
                        painPoints: ['Fine print exclusions easily overlooked', 'Pre-existing condition clauses ambiguous', 'Other'],
                        painPointsZh: ['除外責任文字過小易被忽略', '既往症告知範圍界定模糊', '其他']
                    },
                    {
                        name: "Action C: Requesting preliminary quote from web portal or agent",
                        nameZh: "行動 C：透過官網試算器或業務員取得初步報價單",
                        locations: ['Online', 'Coffee Shop / Meeting Venue', 'Phone', 'Other'],
                        locationsZh: ['線上', '咖啡廳／會面場所', '電話', '其他'],
                        tools: ['Online Quotation Generator', 'Dedicated Agent', 'LINE', 'Other'],
                        toolsZh: ['線上即時報價系統', '專屬業務員', 'LINE', '其他'],
                        painPoints: ['High sales pitch pressure', 'Excessive personal data required for quote', 'Other'],
                        painPointsZh: ['業務員推銷壓力大', '試算需填寫過多個人隱私資料', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Compares policy tiers and riders on mobile app or aggregator site in minutes, avoids speaking with sales reps", tools: "Mobile App, Comparison Chart, Online Premium Calculator" },
                    ph_relationship: { actions: "Calls trusted family agent for in-person meeting and verbal policy recommendations", tools: "Agent Consultation, Phone Call, Paper Brochure" },
                    ph_skeptic: { actions: "Downloads full policy terms PDF, reviews fine print exclusions, and checks competitor rate tables", tools: "Website Portal, Policy PDF Terms, Spreadsheet" },
                    ph_passive: { actions: "Selects recommended standard package without comparing deep details; follows employer/family suggestion", tools: "Mobile App, Family Recommendation" },
                    ph_frustrated: { actions: "Overwhelmed by confusing medical insurance jargon and contradictory comparison websites", tools: "Search Engine, Inconclusive Forums" },
                    all: { actions: "Explores insurance products and compares premium rates across digital and agent channels", tools: "Mobile App, Online Calculator, Agent Meeting" }
                }
            },
            {
                id: 2,
                key: 'Purchase',
                title: 'Stage 2: Application & Medical Review',
                titleZh: '階段 2：投保申請與健康核保',
                actions: [
                    "Action A: Completing electronic application form & personal info",
                    "Action B: Medical disclosure & health declaration review",
                    "Action C: Identity verification (e-KYC / OTP SMS / E-Signature)"
                ],
                actionsZh: [
                    "行動 A：線上填寫電子要保書與被保險人資訊",
                    "行動 B：填寫健康聲明書與既往病史告知事項",
                    "行動 C：完成數位身分驗證與線上簽章"
                ],
                actionDetails: [
                    {
                        name: "Action A: Completing electronic application form & personal info",
                        nameZh: "行動 A：線上填寫電子要保書與被保險人資訊",
                        locations: ['Home', 'Commute (Mobile)', 'Agent Meeting', 'Other'],
                        locationsZh: ['家中', '通勤途中（手機操作）', '業務員會面處', '其他'],
                        tools: ['Mobile e-Application Wizard', 'E-Signature', 'Tablet', 'Other'],
                        toolsZh: ['行動電子要保系統', '電子簽名', '平板電腦', '其他'],
                        painPoints: ['Cumbersome OTP SMS verification', 'Mobile screen too small for form fields', 'Other'],
                        painPointsZh: ['簡訊 OTP 驗證繁瑣易逾時', '手機螢幕欄位填寫不易', '其他']
                    },
                    {
                        name: "Action B: Medical disclosure & health declaration review",
                        nameZh: "行動 B：填寫健康聲明書與既往病史告知事項",
                        locations: ['Home', 'Agent Meeting', 'Hospital / Clinic', 'Other'],
                        locationsZh: ['家中', '與業務員會面', '醫院／診所', '其他'],
                        tools: ['Health Questionnaire Form', 'National Health Insurance App', 'Medical Records', 'Other'],
                        toolsZh: ['健康告知書', '健保快易通 App', '過往就醫紀錄', '其他'],
                        painPoints: ['Fear of failing underwriting due to past minor illnesses', 'Unclear 5-year medical record definition', 'Other'],
                        painPointsZh: ['擔心微小就醫紀錄影響核保', '五年內就醫定義繁複難記', '其他']
                    },
                    {
                        name: "Action C: Identity verification (e-KYC / OTP SMS / E-Signature)",
                        nameZh: "行動 C：完成數位身分驗證與線上簽章",
                        locations: ['Online', 'Home', 'Agent Meeting', 'Other'],
                        locationsZh: ['線上', '家中', '業務員會面', '其他'],
                        tools: ['Mobile ID Authentication', 'Camera for ID Card Scan', 'OTP SMS', 'Other'],
                        toolsZh: ['行動身分識別 (Mobile ID)', '身分證拍照上傳', '簡訊動態密碼', '其他'],
                        painPoints: ['Photo reflections causing ID verification failure', 'Repetitive face recognition checks', 'Other'],
                        painPointsZh: ['證件反光導致身分驗證失敗', '人臉辨識重複失敗需臨櫃', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Completes e-KYC and digital health declaration via smartphone, uploads e-signature in one session", tools: "Mobile App, E-Signature, Identity Verification" },
                    ph_relationship: { actions: "Relies on agent to explain medical declaration questions line-by-line and verify paperwork", tools: "In-Person Meeting, Agent Support, Paper Form" },
                    ph_skeptic: { actions: "Carefully checks underwriting clauses and pre-existing condition definitions before consenting", tools: "Online Portal, Legal Terms, Medical Questionnaire" },
                    ph_passive: { actions: "Fills minimal required questions, checks all standard consent boxes quickly", tools: "Mobile Form, Fast Checkout" },
                    ph_frustrated: { actions: "Struggles with document upload errors, rejected photo formats, or repeated identity checks", tools: "Rejected Upload Portal, Scanner" },
                    all: { actions: "Submits personal medical declarations and completes required identity verification", tools: "Online Application, Agent Guidance, E-Signature" }
                }
            },
            {
                id: 3,
                key: 'Payment',
                title: 'Stage 3: Premium Payment & Account Setup',
                titleZh: '階段 3：首期扣款與帳號開通',
                actions: [
                    "Action A: Authorising recurring credit card / bank autopay",
                    "Action B: Receiving electronic policy certificate (e-Policy)",
                    "Action C: Setting up customer portal and mobile app login"
                ],
                actionsZh: [
                    "行動 A：設定信用卡或銀行帳戶自動轉帳授權",
                    "行動 B：收取電子保單並完成線上簽收確認",
                    "行動 C：開通保戶會員專區與行動 App 帳號"
                ],
                actionDetails: [
                    {
                        name: "Action A: Authorising recurring credit card / bank autopay",
                        nameZh: "行動 A：設定信用卡或銀行帳戶自動轉帳授權",
                        locations: ['Online', 'Mobile App', 'Bank', 'Other'],
                        locationsZh: ['線上', '行動 App', '銀行', '其他'],
                        tools: ['Credit Card Gateway', 'Apple Pay / Digital Wallet', 'Bank Direct Debit Form', 'Other'],
                        toolsZh: ['信用卡授權閘道', 'Apple Pay / 數位皮夾', '銀行帳戶轉帳授權書', '其他'],
                        painPoints: ['Credit card payment failed without clear error code', 'Recurring debit timing unclear', 'Other'],
                        painPointsZh: ['信用卡刷卡失敗無明確原因說明', '自動轉帳扣款日缺乏事前通知', '其他']
                    },
                    {
                        name: "Action B: Receiving electronic policy certificate (e-Policy)",
                        nameZh: "行動 B：收取電子保單並完成線上簽收確認",
                        locations: ['Home', 'Email', 'Customer Portal', 'Other'],
                        locationsZh: ['家中', '電子郵件信箱', '保戶會員專區', '其他'],
                        tools: ['Encrypted e-Policy PDF', 'SMS Receipt Link', 'Customer App', 'Other'],
                        toolsZh: ['加密電子保單 PDF', '簡訊簽收連結', '保戶 App', '其他'],
                        painPoints: ['Encrypted PDF password difficult to retrieve', 'Family members cannot access e-Policy in emergency', 'Other'],
                        painPointsZh: ['加密 PDF 密碼規則易忘記', '緊急時家人無法查閱電子保單', '其他']
                    },
                    {
                        name: "Action C: Setting up customer portal and mobile app login",
                        nameZh: "行動 C：開通保戶會員專區與行動 App 帳號",
                        locations: ['Mobile', 'Home', 'Other'],
                        locationsZh: ['手機', '家中', '其他'],
                        tools: ['FaceID / Biometric Login', 'Customer App', 'Member Portal', 'Other'],
                        toolsZh: ['FaceID / 指紋辨識登入', '保戶行動 App', '官網會員專區', '其他'],
                        painPoints: ['Forgotten password reset procedure complex', 'Account locked after multiple failed attempts', 'Other'],
                        painPointsZh: ['密碼重設流程繁複耗時', '帳號鎖定需致電客服解鎖', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Binds Apple Pay or digital credit card for instant one-click recurring payment and downloads e-Policy PDF", tools: "Credit Card Gateway, Apple Pay, e-Policy PDF" },
                    ph_relationship: { actions: "Hands signed bank autopay authorisation slip to agent or pays via convenience store barcode", tools: "Direct Debit Setup, Convenience Store Barcode, Paper Certificate" },
                    ph_skeptic: { actions: "Verifies billing breakdown, payment schedules, and surrender charge penalty tables", tools: "Bank Statement, Policy Contract, Payment Portal" },
                    ph_passive: { actions: "Sets up automatic debit and promptly archives policy documents into inbox folder", tools: "Credit Card Autopay, Email Archive" },
                    ph_frustrated: { actions: "Experiences payment gateway timeouts, unclear debit schedules, or delayed paper certificates", tools: "Failed Payment Gateway, Hotline" },
                    all: { actions: "Sets up recurring premium payments and activates digital policyholder portal accounts", tools: "Bank Debit, Credit Card Autopay, Customer Portal" }
                }
            },
            {
                id: 4,
                key: 'Servicing',
                title: 'Stage 4: Routine Servicing & Inquiries',
                titleZh: '階段 4：日常保單查詢與變更',
                actions: [
                    "Action A: Checking policy cash value and coverage portfolio",
                    "Action B: Updating personal address, contact and beneficiary info",
                    "Action C: Submitting customer service inquiries via app or LINE"
                ],
                actionsZh: [
                    "行動 A：透過 App 查詢保單現值與保障總覽",
                    "行動 B：線上申請變更通訊地址、電話或身故受益人",
                    "行動 C：透過客服專線、智能客服或 LINE 諮詢保單問題"
                ],
                actionDetails: [
                    {
                        name: "Action A: Checking policy cash value and coverage portfolio",
                        nameZh: "行動 A：透過 App 查詢保單現值與保障總覽",
                        locations: ['Home', 'Commute', 'Anywhere', 'Other'],
                        locationsZh: ['家中', '通勤途中', '任何地點', '其他'],
                        tools: ['Customer Mobile App', 'Policy Dashboard', 'Annual Statement', 'Other'],
                        toolsZh: ['保戶行動 App', '保障總覽儀表板', '年度保單通知書', '其他'],
                        painPoints: ['Complex investment-linked value calculation', 'Difficult to view entire family policies in one place', 'Other'],
                        painPointsZh: ['投資型保單現值計算複雜', '無法一鍵整合全家人保單總覽', '其他']
                    },
                    {
                        name: "Action B: Updating personal address, contact and beneficiary info",
                        nameZh: "行動 B：線上申請變更通訊地址、電話或身故受益人",
                        locations: ['Online', 'Insurer Branch', 'Home', 'Other'],
                        locationsZh: ['線上', '分公司臨櫃', '家中', '其他'],
                        tools: ['Customer Web Portal', 'Agent Assistance', 'Alteration Application Form', 'Other'],
                        toolsZh: ['保戶線上專區', '業務員代辦', '契約變更申請書', '其他'],
                        painPoints: ['Beneficiary change still mandates paper submission', 'Slow confirmation notification after online update', 'Other'],
                        painPointsZh: ['變更受益人仍需列印紙本親簽', '線上變更後審核通知緩慢', '其他']
                    },
                    {
                        name: "Action C: Submitting customer service inquiries via app or LINE",
                        nameZh: "行動 C：透過客服專線、智能客服或 LINE 諮詢保單問題",
                        locations: ['Home', 'Office', 'Phone', 'Other'],
                        locationsZh: ['家中', '辦公室', '電話', '其他'],
                        tools: ['AI Chatbot', '24/7 Customer Hotline', 'LINE Official Account', 'Other'],
                        toolsZh: ['智能客服 (Chatbot)', '24小時電話客服專線', '官方 LINE 帳號', '其他'],
                        painPoints: ['Chatbot gives robotic canned answers', 'Phone queue wait exceeds 10 minutes during peak hours', 'Other'],
                        painPointsZh: ['智能客服無法回答深層問題一直跳回選單', '尖峰時段電話客服轉接等待過久', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Monitors coverage portfolio and policy value via app dashboard, uses live chat for instant queries", tools: "Mobile App, Account Dashboard, In-App Live Chat" },
                    ph_relationship: { actions: "Messages agent directly on LINE for any address change, beneficiary update, or dividend inquiry", tools: "Agent LINE, Phone Call, Coffee Meeting" },
                    ph_skeptic: { actions: "Regularly audits cash surrender values and rate of return against market benchmarks", tools: "Portfolio Analytics Dashboard, Spreadsheet" },
                    ph_passive: { actions: "Rarely logs in; only checks policy when prompted by annual regulatory disclosure email", tools: "Email Notification, Annual Statement" },
                    ph_frustrated: { actions: "Encounters chatbot dead-ends, long telephone queue waits (>15 mins), or forced branch visits", tools: "Automated IVR Phone Queue, Branch Counter" },
                    all: { actions: "Manages ongoing policy details, address changes, and routine coverage inquiries", tools: "Mobile App, Customer Hotline, Agent LINE" }
                }
            },
            {
                id: 5,
                key: 'Claims',
                title: 'Stage 5: Claims Filing & Settlement',
                titleZh: '階段 5：理賠申請與給付結案',
                actions: [
                    "Action A: Submitting diagnostic certificate and hospital receipts",
                    "Action B: Tracking e-Claims adjudication progress in app",
                    "Action C: Receiving settlement payout and claims explanation statement"
                ],
                actionsZh: [
                    "行動 A：拍照上傳診斷證明書與醫療費用收據",
                    "行動 B：於 App 即時追蹤理賠案件進度與照會補件",
                    "行動 C：收到理賠結案簡訊與保險給付明細表"
                ],
                actionDetails: [
                    {
                        name: "Action A: Submitting diagnostic certificate and hospital receipts",
                        nameZh: "行動 A：拍照上傳診斷證明書與醫療費用收據",
                        locations: ['Hospital / Clinic', 'Home', 'Branch Office', 'Other'],
                        locationsZh: ['醫院／診所', '家中', '分公司臨櫃', '其他'],
                        tools: ['Mobile e-Claims Wizard', 'Phone Camera Scanner', 'Physical Paper Envelope', 'Other'],
                        toolsZh: ['行動理賠線上送件系統', '手機相機／掃描 App', '紙本郵寄信封', '其他'],
                        painPoints: ['Hospital receipt photos rejected due to lighting/angle', 'Clinic diagnosis wording mismatches claim criteria', 'Other'],
                        painPointsZh: ['醫療收據照片不清楚被要求重傳', '醫院開立病名與保單理賠項目不符', '其他']
                    },
                    {
                        name: "Action B: Tracking e-Claims adjudication progress in app",
                        nameZh: "行動 B：於 App 即時追蹤理賠案件進度與照會補件",
                        locations: ['Mobile', 'Anywhere', 'Other'],
                        locationsZh: ['手機', '任何地點', '其他'],
                        tools: ['Customer App e-Claims Tracker', 'SMS Notifications', 'Claim Specialist Hotline', 'Other'],
                        toolsZh: ['保戶 App 理賠進度追蹤器', '簡訊通知', '理賠專員專線', '其他'],
                        painPoints: ['Requisition notice lacks clear guidance on which document to supplement', 'Long waiting period for adjudication', 'Other'],
                        painPointsZh: ['照會補件通知說明不清不知道要補什麼', '理賠審核週期過長焦慮', '其他']
                    },
                    {
                        name: "Action C: Receiving settlement payout and claims explanation statement",
                        nameZh: "行動 C：收到理賠結案簡訊與保險給付明細表",
                        locations: ['Bank Account', 'Email', 'Home', 'Other'],
                        locationsZh: ['銀行帳戶', '電子信箱', '家中', '其他'],
                        tools: ['Bank SMS Alert', 'Claims Explanation Statement', 'Customer Hotline', 'Other'],
                        toolsZh: ['銀行入帳簡訊', '理賠給付明細表', '客服專線', '其他'],
                        painPoints: ['Unclear reason for partial reimbursement deduction', 'Ambiguous self-pay deductible calculation', 'Other'],
                        painPointsZh: ['非全額給付時扣除原因未充分白話解釋', '自負額與非健保給付項目核銷不清楚', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Takes photo of hospital invoice and doctor diagnosis, submits via e-Claims wizard in under 3 minutes", tools: "Customer App e-Claims, Hospital Invoice Scanner, Instant SMS" },
                    ph_relationship: { actions: "Hands paper medical certificates and physical receipts to agent to file claim at branch counter", tools: "Agent Guidance, Branch Office, Physical Paper Envelope" },
                    ph_skeptic: { actions: "Double checks hospital diagnosis coding against ICD-10 schedule to ensure full claim entitlement", tools: "e-Claims Submission Wizard, Medical Code Schedule" },
                    ph_passive: { actions: "Postpones filing small claims until multiple receipts accumulate, then calls service hotline", tools: "Customer Hotline, Mail-in Service" },
                    ph_frustrated: { actions: "Disputes claim reduction due to clinic diagnostic wording, resubmits receipts multiple times", tools: "Claim Specialist Hotline, Dispute Appeal Form" },
                    all: { actions: "Files claims for medical or life events, submits supporting documents, and tracks settlement payout", tools: "e-Claims Wizard, Agent Support, Mail-in" }
                }
            },
            {
                id: 6,
                key: 'Renewal',
                title: 'Stage 6: Policy Renewal & Retention',
                titleZh: '階段 6：續保通知與保障升級',
                actions: [
                    "Action A: Reviewing annual policy renewal notice and premium adjustments",
                    "Action B: Assessing life stage coverage gap and rider upgrades",
                    "Action C: Confirming policy continuation or automatic renewal"
                ],
                actionsZh: [
                    "行動 A：查閱年度續保通知書與費率調整明細",
                    "行動 B：評估家庭不同人生階段之保障缺口與加保需求",
                    "行動 C：確認自動續保授權或線上完成續約手續"
                ],
                actionDetails: [
                    {
                        name: "Action A: Reviewing annual policy renewal notice and premium adjustments",
                        nameZh: "行動 A：查閱年度續保通知書與費率調整明細",
                        locations: ['Home', 'Email', 'App', 'Other'],
                        locationsZh: ['家中', '電子郵件', 'App 推播', '其他'],
                        tools: ['Renewal Notice Letter', 'Mobile App Push', 'Customer Portal', 'Other'],
                        toolsZh: ['續保通知函', '行動 App 推播', '保戶會員專區', '其他'],
                        painPoints: ['Premium hike lacks detailed age-band cost explanation', 'Notification arrives too close to expiration date', 'Other'],
                        painPointsZh: ['保費調漲缺乏各年齡層費率變化說明', '續保通知過晚寄發措手不及', '其他']
                    },
                    {
                        name: "Action B: Assessing life stage coverage gap and rider upgrades",
                        nameZh: "行動 B：評估家庭不同人生階段之保障缺口與加保需求",
                        locations: ['Home', 'Agent Meeting', 'Online', 'Other'],
                        locationsZh: ['家中', '與業務員會面', '線上', '其他'],
                        tools: ['Family Coverage Gap Analyser', 'Agent Recommendation', 'Online Product Catalogue', 'Other'],
                        toolsZh: ['家庭保障缺口分析儀', '業務員建議書', '線上保險商品目錄', '其他'],
                        painPoints: ['Lack of personalised coverage recommendation tailored to current life stage', 'Too many rider options causing confusion', 'Other'],
                        painPointsZh: ['缺乏針對人生新階段之精準缺口建議', '附約組合過多眼花撩亂', '其他']
                    },
                    {
                        name: "Action C: Confirming policy continuation or automatic renewal",
                        nameZh: "行動 C：確認自動續保授權或線上完成續約手續",
                        locations: ['Online', 'Mobile', 'Bank', 'Other'],
                        locationsZh: ['線上', '手機', '銀行', '其他'],
                        tools: ['One-Click Auto-Renewal Authorisation', 'Credit Card Autopay', 'Customer Portal', 'Other'],
                        toolsZh: ['一鍵自動續約授權', '信用卡自動扣款', '保戶專區', '其他'],
                        painPoints: ['Auto-renewal failure due to expired card without early notice', 'Complicated surrender penalty', 'Other'],
                        painPointsZh: ['信用卡到期未提前提醒導致自動續約扣款失敗', '減額繳清或解約手續繁重', '其他']
                    }
                ],
                qualitative: {
                    ph_digital: { actions: "Enables automatic renewal notification on app push, checks rider inflation adjustments digitally", tools: "Mobile App Push, Policy Benefit Review, Premium Indexing" },
                    ph_relationship: { actions: "Meets agent annually for comprehensive family policy review and cup of tea", tools: "Agent Meeting, Annual Family Review Booklet" },
                    ph_skeptic: { actions: "Compares renewal quotes against rival market offerings before agreeing to retain coverage", tools: "Customer Portal, Market Comparison Table" },
                    ph_passive: { actions: "Allows policy to auto-renew each year without reviewing adjusted premium rates", tools: "Auto-Renewal Notice, Bank Autopay" },
                    ph_frustrated: { actions: "Considers lapsing or surrendering policy due to unexplained premium increases", tools: "Lapse Warning Notice, Retention Specialist Hotline" },
                    all: { actions: "Reviews annual renewal notices, adjusts coverage riders, and maintains ongoing protection", tools: "Renewal Notice, Customer Portal, Agent Review" }
                }
            }
        ],
        selfImageTags: [
            "Self-Service Digital Native", "Family Protection Focused", "Budget Conscious Saver", "Fine-Print Policy Auditor", "Agent-Reliant Traditionalist",
            "Claims Speed Priority", "Passive Coverage Buyer", "Wealth Legacy Planner", "FinTech Early Adopter", "Periodic Portfolio Reviewer",
            "Brand Reputation Driven", "Strict Cost Controller", "Online Instant Quoting", "Direct Reimbursement Priority", "Medical Coverage Focused",
            "Retirement Annuity Planner", "Critical Illness Alert", "Paper Contract Preference", "Instant Customer Support", "Deductible Sensitive",
            "Word-of-Mouth Trust", "Anti-Cold-Call", "Transparent Fee Advocate", "One-Click Instant Claims", "Intuitive UI Seeker",
            "24/7 Self-Service Advocate", "Relationship-Oriented", "e-Policy Advocate", "Regular Savings Habit", "Risk-Averse Priority"
        ],
        selfImageTagsZh: [
            "自主數位投保", "重視家庭保障", "精打細算族", "條款研究員", "仰賴專人服務",
            "理賠效率至上", "被動投保族", "高資產傳承需求", "科技工具早鳥", "定期檢視保單",
            "重視品牌聲譽", "預算嚴格控管", "線上快速試算", "實支實付優先", "醫療保障導向",
            "退休年金規劃", "重疾防癌關注", "偏好紙本合約", "即時客服回覆", "自負額敏感",
            "親友轉介信任", "討厭電話推銷", "透明費率要求", "一鍵快速理賠", "直覺介面偏好",
            "全天候自助服務", "重視人情連結", "電子保單支持者", "定期儲蓄習慣", "風險趨避至上"
        ],
        q8Prompt: 'Please write down the 1st tag that “best represents your insurance mindset” from the options above.',
        q8PromptZh: '請從上方選項中，選出「最能代表您投保心態」的第 1 個標籤：',
        q9Prompt: 'Please write down the 2nd tag that represents your policyholder profile; please do not repeat Q8.',
        q9PromptZh: '請選出代表您保戶特質的第 2 個標籤；不得與第 8 題重複。',
        q10Prompt: 'Please write down the 3rd tag that represents your policyholder profile; please do not repeat Q8 and Q9.',
        q10PromptZh: '請選出代表您保戶特質的第 3 個標籤；不得與第 8、9 題重複。',
        // Part III Prompts & Options
        q11Prompt: 'What is your level of familiarity with current insurance customer portals and mobile self-service apps?',
        q11PromptZh: '您對目前保險公司保戶線上專區與行動 App 自助服務的熟悉程度為何？',
        q11Scale: '0-100',
        q12Prompt: 'Overall, how does your current insurance service experience make you feel?',
        q12PromptZh: '整體而言，您目前的保單服務與互動體驗讓您感覺如何？',
        q12Scale: 'emoji',
        q13Prompt: 'What impact do digital self-service tools have on your policy management and claims convenience?',
        q13PromptZh: '您認為數位自助工具對您日常保單管理與理賠便利性有何影響？',
        q13Options: ['Severely reduces convenience', 'Slightly reduces convenience', 'No noticeable impact', 'Slightly improves convenience', 'Significantly improves convenience'],
        q13OptionsZh: ['嚴重降低便利性', '略微降低便利性', '無明顯影響', '略微提升便利性', '大幅提升便利性'],
        q14Prompt: 'Please evaluate the impact of each of the following DIGITAL SELF-SERVICE features on your policyholder experience.',
        q14PromptZh: '請評估下列「數位自助服務功能」對您保戶體驗的影響程度。',
        q14Items: [
            { label: 'Mobile App login & biometric authentication' },
            { label: 'Digital e-Policy access & contract downloads' },
            { label: 'Online claims filing & hospital invoice photo upload' },
            { label: 'Coverage portfolio dashboard & cash value tracking' },
            { label: 'Online alteration for personal info and payment methods' }
        ],
        q14ItemsZh: [
            { label: '行動 App 登入與生物辨識' },
            { label: '電子保單查閱與合約下載' },
            { label: '線上理賠申請與醫療單據拍照上傳' },
            { label: '保單保障總覽與現值查詢' },
            { label: '線上基本資料與繳費方式變更' }
        ],
        q15Prompt: 'Please evaluate your satisfaction with each of the following CORE INSURANCE SERVICE dimensions.',
        q15PromptZh: '請評估您對下列「核心保險服務維度」的滿意度與重視程度。',
        q15Items: [
            { label: 'Clarity of policy terms and coverage transparency' },
            { label: 'Claims settlement turnaround speed & payout clarity' },
            { label: 'Dedicated agent & customer hotline consultation quality' },
            { label: 'Multi-channel convenience (App / Web / LINE / Counter)' },
            { label: 'Overall brand trust and consumer protection' }
        ],
        q15ItemsZh: [
            { label: '保單條款白話易懂度與保障透明度' },
            { label: '理賠審核速度與給付明細透明度' },
            { label: '專屬業務員與客服專線諮詢服務品質' },
            { label: '多元接觸管道便利性 (App／官網／LINE／臨櫃)' },
            { label: '整體品牌信任度與保戶權益保障' }
        ],
        q16Prompt: 'What are the primary reasons you communicate with your insurance agent via LINE or personal phone rather than official app/portal?',
        q16PromptZh: '請問您主要因為哪些原因，習慣透過 LINE 或電話與業務員聯絡，而非使用官方 App／網站？',
        q16Options: [
            'Instant responses and personal human warmth',
            'Agent can explain complicated terms in plain words',
            'Prefer having agent handle tedious paperwork and claim filing',
            'Official app interface or login is cumbersome',
            'Lack of familiarity with digital self-service features',
            'Other'
        ],
        q16OptionsZh: [
            '即時回覆且有人情溫度',
            '業務員能白話解釋複雜條款',
            '習慣由專人代辦繁瑣手續與理賠送件',
            '官方 App 介面或登入流程較繁瑣',
            '對數位自助手續功能不熟悉',
            '其他'
        ],
        q17Prompt: 'How do you usually review and maintain your personal and family insurance policies? (Multi-select)',
        q17PromptZh: '您通常如何檢視與管理您個人或家庭的保單保障？（可複選）',
        q17Options: [
            "Insurer's customer mobile app or web portal",
            "Annual policy review with dedicated agent",
            "Paper policy binder / personal folder at home",
            "Self-managed personal spreadsheet (Excel / Sheets)",
            "Only check when a claim occurs or premium notice arrives",
            "Other"
        ],
        q17OptionsZh: [
            "保險公司行動 App 或保戶線上專區",
            "每年與專屬業務員進行保單校正檢視",
            "家中的紙本保單收納夾／資料夾",
            "自製 Excel／Google 試算表定期整理",
            "平時不特別檢視，發生理賠或繳費提醒時才查詢",
            "其他"
        ],
        q17SubPrompt: "If you review policies via mobile app / web portal, what is your primary reason?",
        q17SubPromptZh: "若您使用行動 App／線上專區檢視保單，主要原因為何？",
        q17SubOptions: [
            "24/7 access anytime without contacting anyone",
            "Real-time updates on cash value and claim status",
            "Consolidated view of all policies under my name",
            "Other"
        ],
        q17SubOptionsZh: [
            "全天候 24 小時隨時可查，免打擾他人",
            "保單現值與理賠進度即時更新",
            "名下所有保單集中一站式檢視",
            "其他"
        ],
        q18Prompt: 'If you chose “Paper policy binder / folder” above, what is the main reason? (Single Select; skip if not applicable)',
        q18PromptZh: '若您上述勾選「紙本保單收納夾」，主要原因為何？（單選；若不適用請略過）',
        q18Options: [
            "Physical contracts provide greater security and legal certainty",
            "Habitual tactile feeling of paper and easy family sharing",
            "Not reliant on electronic devices, passwords, or network",
            "Can view all original policy riders and signature seals",
            "Other"
        ],
        q18OptionsZh: [
            "實體紙本合約較有真實保障感與法律確定性",
            "習慣紙本翻閱直覺，且方便家人緊急時取得",
            "不受電子設備、密碼忘記或網路連線限制",
            "可直接檢視所有原始附約條款與簽章印鑑",
            "其他"
        ],
        q19Prompt: 'If the insurer\'s app could automatically notify you of coverage gaps, policy dividend payouts, or upcoming renewals based on your life stages, what would your willingness be?',
        q19PromptZh: '若保險公司 App 能依據您的人生階段，自動分析保障缺口並主動推播續保或紅利通知，您的使用意願為何？',
        q19Options: ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling'],
        q19OptionsZh: ['極度願意', '願意', '普通', '意願低', '完全不願意'],
        q20Prompt: "Here are 10 types of policyholder maintenance and management activities. Please select up to 5 items that you perform most frequently, and estimate the percentage of attention/time allocated to each below:",
        q20PromptZh: "以下列出 10 項保戶日常保單管理與服務互動項目。請選出您最常進行的項目（最多 5 項），並概估各項目所佔之比重。若無符合選項，請選「j) 其他」並自行填寫：",
        dailyWorkItems: [
            "a) Checking policy coverage value and ROI via mobile app",
            "b) Reviewing annual policy notices and payment schedules",
            "c) Updating contact info or credit card autopay online",
            "d) Uploading invoices to file digital medical claims",
            "e) Comparing new cancer/LTC/critical illness riders in market",
            "f) Consulting family agent regarding coverage gaps",
            "g) Setting up bank autopay and auditing statement debits",
            "h) Reading e-Policy contract PDF and coverage terms",
            "i) Asking questions via AI chatbot or official LINE account",
            "j) Other personal/family insurance management tasks"
        ],
        dailyWorkItemsZh: [
            "a) 透過行動 App 檢視保單保障現值與投資報酬率",
            "b) 查閱年度保單週年通知書與繳費明細",
            "c) 線上變更基本通訊地址、電話或繳款信用卡",
            "d) 拍照上傳收據申請醫療實支實付理賠",
            "e) 比較市場新推出之防癌／長照／重大傷病附約",
            "f) 諮詢專屬業務員或保險經紀人保障缺口",
            "g) 設定自動扣款轉帳並核對信用卡帳單",
            "h) 查閱電子保單條款並下載 PDF 檔案",
            "i) 使用智能客服或官方 LINE 查詢權益",
            "j) 其他個人或家庭保險管理事務"
        ],
        q21Prompt: "When managing your policies or interacting with insurance services, is there a gap or friction between the service experience you expect and what is actually delivered? Please briefly describe:",
        q21PromptZh: "在管理保單或與保險公司／業務員互動時，您期望獲得的服務體驗，與實際獲得的服務之間是否存在落差或痛點？請簡要說明：",
        q22Prompt: "Which OFFICIAL DIGITAL CHANNELS or systems do you use most frequently when accessing insurance services? (Multi-select)",
        q22PromptZh: "在您享受保險服務時，最常使用哪些「保險公司官方數位管道」？（複選）",
        officialSystems: [
            "Customer Mobile App", "Policyholder Online Portal", "e-Claims Filing Gateway",
            "e-Policy Verification Portal", "AI Chatbot", "LINE Official Account",
            "Customer Hotline", "Branch Customer Service Counter"
        ],
        officialSystemsZh: [
            "保戶行動 App", "線上保單服務專區", "電子理賠申請平台",
            "電子保單驗證系統", "智能客服 (Chatbot)", "官方 LINE 官方帳號",
            "電話客服專線", "分公司臨櫃服務櫃檯"
        ],
        q23Prompt: "Which PERSONAL TOOLS or alternative habits do you use to manage insurance and health records? (Multi-select)",
        q23PromptZh: "在日常生活中，您最常使用哪些「個人工具／替代習慣」來記錄保險與健康狀況？（複選）",
        personalTools: [
            "LINE", "Mobile Banking App", "Apple Wallet / Digital Wallet", "Phone Camera / Scanner App",
            "Excel / Google Sheets", "Physical Policy Binder", "Calendar Reminders",
            "National Health Insurance App", "Online Insurance Forums", "Family Group Chat"
        ],
        personalToolsZh: [
            "LINE", "行動網銀 App", "Apple Wallet / 數位皮夾", "手機相機／掃描 App",
            "Excel / Google 試算表", "紙本保單收納夾", "個人行事曆提醒",
            "健保快易通 App", "網路保險討論版 (PTT/Dcard)", "親友家族群組"
        ],
        q24Prompt: "What are your most critical CORE EXPECTATIONS and needs from your insurance provider? (Select up to 5)",
        q24PromptZh: "身為保戶，您對保險公司最關鍵的核心期待／需求為何？（最多選 5 項）",
        coreNeeds: [
            "Real-time claims progress push notifications",
            "Plain-language policy wording without confusing legal jargon",
            "One-click integrated family coverage overview",
            "Mobile snapshot submission for paperless medical claims",
            "Direct online alteration for beneficiaries and payment accounts",
            "Transparent premium adjustment and dividend breakdown",
            "24/7 instant AI customer service resolution",
            "Pressure-free online premium calculation simulator",
            "Fast access to dedicated human advisory consultation",
            "Flexible payment cycles (monthly, quarterly, annual)",
            "Real-time online policy loan calculation",
            "Permanent encrypted cloud storage for e-Policies",
            "Zero waiting period options for critical illness coverage",
            "One-click overseas emergency medical assistance dispatch",
            "Senior-friendly large-font accessible interface"
        ],
        coreNeedsZh: [
            "理賠進度即時推播通知（免重複致電詢問）",
            "保單條款白話化／免除晦澀法律術語",
            "一鍵整合全家人保單保障總覽",
            "手機拍照即可完成醫療理賠送件",
            "線上直接變更身故受益人與繳費帳號",
            "透明公開的費率調整與分紅明細",
            "全天候 24 小時智能客服即時解答",
            "無推銷壓力的線上自助試算保費",
            "專屬真人顧問快速諮詢服務",
            "自選繳費週期（月繳／季繳／年繳彈性）",
            "保單貸款與借款利息線上即時試算",
            "電子保單永久安全雲端存取",
            "重大傷病與防癌險無等待期專案",
            "海外急難救助一鍵緊急通報",
            "提供高齡親善大字版操作介面"
        ],
        q25Prompt: "Could you share a single sentence or personal motto that best represents your life and financial protection values?",
        q25PromptZh: "請以一句話分享最能代表您「人生保障與理財觀」的座右銘。",
        q26Prompt: "In your customer experience with our insurance services, which primary journey do you engage with most frequently? (Single Select)",
        q26PromptZh: "在您身為保戶的體驗歷程中，您最常接觸且最關心的核心服務歷程為何？（單選）",
        q26Options: [
            "Routine Policy Servicing Journey (Inquiries, payments, value tracking, contact updates)",
            "Event-Driven & Claims Journey (Filing claims, medical reviews, settlement payout, crisis assistance)"
        ],
        q26OptionsZh: [
            "日常保單維護歷程（保障查詢、繳費管理、現值檢視、資料變更）",
            "關鍵事件與理賠歷程（意外/醫療理賠、保單借款、急難救助、保障校正升級）"
        ],
        archetypes: {
            ph_digital: { name: 'Self-Service Digital Native (Emily Wang)', nameZh: '自主數位先鋒 (Emily Wang)' },
            ph_relationship: { name: 'Agent-Reliant Traditionalist (Uncle Ming)', nameZh: '專人依賴型保戶 (陳明德)' },
            ph_skeptic: { name: 'Analytical Value Maximiser (David Lin)', nameZh: '精明條款分析者 (林志豪)' },
            ph_passive: { name: 'Passive Policyholder (Grace Chang)', nameZh: '佛系安定型保戶 (張家瑜)' },
            ph_frustrated: { name: 'Friction-Stalled Policyholder (Kevin Huang)', nameZh: '體驗受阻型保戶 (黃柏翰)' }
        }
    },
    patient: {
        id: 'patient',
        name: 'Hospital Patient Care & Outpatient Experience Survey',
        nameZh: '醫療病患就醫體驗與門診照護問卷',
        targetAudience: 'Hospital Patients & Caregivers',
        icon: '🏥',
        badge: 'Healthcare CX Analytics',
        badgeZh: '醫療體驗分析',
        sectionsConfig: {
            demographics: true,
            dimensions: true,
            tags: true,
            workContent: true,
            journey: true
        },
        sectionTitles: {
            demographics: "Patient Demographics & Clinical Profile",
            demographicsZh: "病患就醫基本資料",
            dimensions: "Healthcare Experience & Care Quality Ratings",
            dimensionsZh: "就醫體驗與醫療滿意度評估",
            tags: "Patient Health Mindset & Coping Style Tags",
            tagsZh: "病患健康管理心態與就醫標籤",
            workContent: "Daily Health Management, Digital Health Tools & Care Needs",
            workContentZh: "日常健康維護、數位醫療工具與照護需求",
            journey: "Hospital Patient Journey & Care Touchpoints",
            journeyZh: "病患就醫全程歷程與接觸點體驗"
        },
        intro: "Dear Patient and Family Members, Hello! This survey aims to understand your healthcare experience, hospital facility interactions, and service needs—from appointment booking and physician consultation to diagnostic examinations, inpatient care, and post-discharge recovery. The survey takes about 8–10 minutes to complete. All responses are analysed using unsupervised machine learning algorithms to identify care friction points and improve patient-centred hospital services. Thank you for your partnership!",
        introZh: "親愛的病友與家屬您好！本問卷旨在了解您在醫療體系就醫過程中的真實體驗與感受，包括線上預約掛號、醫師診察溝通、檢驗檢查、病房照護乃至出院後續追蹤等各階段的滿意度與需求。問卷約需 8–10 分鐘完成。所有回覆將透過非監督式機器學習演算法進行整合分析，以作為優化以病患為中心之醫療照護品質與數位就醫流程的依據。感謝您的寶貴回饋與協助！",
        demographics: [
            { key: 'Age', label: 'Age Range', labelZh: '年齡區間', type: 'choice', options: 'Under 18, 18–35, 36–50, 51–65, 66+', optionsZh: '18歲以下, 18–35歲, 36–50歲, 51–65歲, 66歲以上' },
            { key: 'Department', label: 'Primary Care Department', labelZh: '就診科別 / 就醫型態', type: 'choice', options: 'Outpatient Clinic, Inpatient Admission, Emergency Care, Health Screening', optionsZh: '門診診療, 住院治療, 急診處置, 健康檢查' },
            { key: 'VisitFrequency', label: 'Annual Visit Frequency', labelZh: '年就醫頻率', type: 'choice', options: 'First Visit, Occasional (< 3/yr), Regular (4–8/yr), Chronic Care (Monthly+)', optionsZh: '初次就診, 偶爾 (< 3次/年), 定期回診 (4–8次/年), 慢性病照護 (每月以上)' },
            { key: 'InsuranceCoverage', label: 'Health Insurance Type', labelZh: '醫療保障覆蓋', type: 'choice', options: 'National Health Only, Commercial Health Supplement, Comprehensive Private, Self-Pay', optionsZh: '僅健保, 健保加保商業醫療險, 完整高額實支實付, 全額自費' }
        ],
        metrics: [
            { key: 'Skill_Device', label: 'Doctor Communication Clarity', labelZh: '醫師溝通清晰度', scaleType: '1-5' },
            { key: 'Skill_Knowledge', label: 'Wait Time Acceptance', labelZh: '就診等待容忍度', scaleType: '1-5' },
            { key: 'Skill_Sales_Pitch', label: 'App & e-Payment Ease', labelZh: 'App掛號與繳費便利性', scaleType: '1-5' },
            { key: 'Skill_Customer_Relations', label: 'Nursing Care Empathy', labelZh: '護理照護同理心', scaleType: '1-5' },
            { key: 'Skill_Digital_Tools', label: 'Overall Hospital Trust', labelZh: '整體醫療信任度', scaleType: '1-5' }
        ],
        stages: [
            {
                id: 1, key: 'Booking', title: 'Stage 1: Appointment Booking & Registration', titleZh: '階段 1：預約掛號與報到',
                actions: ['Online hospital app appointment booking', 'Pre-registration symptom questionnaire', 'Arriving and scanning ID card at kiosk'],
                actionsZh: ['醫院行動 App 線上預約掛號', '填寫診前症狀評估與既往病史', '抵達醫院臨櫃或自助機插卡報到'],
                qualitative: { all: { actions: 'Navigates app booking schedule, selects clinic slot, and verifies national insurance ID at check-in kiosk.', tools: 'Mobile App, Hospital Kiosk, Health Insurance Card' } }
            },
            {
                id: 2, key: 'Consultation', title: 'Stage 2: Clinical Consultation & Diagnosis', titleZh: '階段 2：門診診察與診斷',
                actions: ['Describing acute and chronic symptoms to doctor', 'Physical clinical examination by physician', 'Discussing diagnostic tests and treatment alternatives'],
                actionsZh: ['向主治醫師描述急性與慢性症狀', '接受醫師理學檢查與初步診察', '雙向討論進一步檢驗與治療方案'],
                qualitative: { all: { actions: 'Communicates medical history with attending physician and reviews clinical diagnosis notes.', tools: 'Doctor Consultation Room, Stethoscope, EHR System' } }
            },
            {
                id: 3, key: 'Testing', title: 'Stage 3: Diagnostic Tests & Lab Imaging', titleZh: '階段 3：檢驗抽血與影像檢查',
                actions: ['Blood draw and laboratory specimen collection', 'X-Ray, Ultrasound or MRI radiological imaging', 'Tracking test result readiness via patient portal'],
                actionsZh: ['檢驗科抽血與檢體採集送檢', '接受 X 光、超音波或 MRI 影像檢查', '透過病患健康存摺查詢檢驗進度'],
                qualitative: { all: { actions: 'Queues for blood draw and radiological scans, monitors estimated turnaround times.', tools: 'Phlebotomy Station, CT/MRI Scanner, Queue Display' } }
            },
            {
                id: 4, key: 'Treatment', title: 'Stage 4: Inpatient & Procedure Care', titleZh: '階段 4：病房照護與處置治療',
                actions: ['Day surgery or ward bed admission process', 'Medication administration and vital signs monitoring by nurses', 'Physician ward rounds and clinical recovery briefing'],
                actionsZh: ['日間手術或住院病房報到手續', '護理師給藥照護與生命徵象量測', '主治醫師巡房與術後復原解說'],
                qualitative: { all: { actions: 'Receives acute care, monitoring, and nursing instructions in ward.', tools: 'Hospital Bed, Nurse Call Button, Medication Cart' } }
            },
            {
                id: 5, key: 'PharmacyBilling', title: 'Stage 5: Pharmacy Pickup & Billing', titleZh: '階段 5：批價繳費與領藥諮詢',
                actions: ['Self-service mobile pay or automated kiosk checkout', 'Reviewing medical expense breakdown and insurance copay', 'Pharmacist medication counseling and dosage verification'],
                actionsZh: ['行動支付或自動繳費機自助結帳', '核對醫療費用明細與全民健保給付額', '藥師調劑核對與用藥注意事項衛教'],
                qualitative: { all: { actions: 'Settles hospital bill via mobile pay and collects prescribed medicines with dosage briefing.', tools: 'Automated Payment Kiosk, Mobile Pay, Pharmacy Window' } }
            },
            {
                id: 6, key: 'FollowUp', title: 'Stage 6: Post-Discharge Home Care Follow-up', titleZh: '階段 6：出院衛教與居家追蹤',
                actions: ['Reviewing home care guidelines and symptom red flags', 'Telehealth consultation or mobile check-in inquiry', 'Scheduling return visit and medication refill reminder'],
                actionsZh: ['研讀居家傷口照護與異常症狀警訊', '透過遠距醫療或醫院官方 LINE 諮詢', '設定回診追蹤提醒與慢性病連續處方箋領藥'],
                qualitative: { all: { actions: 'Manages recovery at home, logs vital signs in health app, and follows up with clinic.', tools: 'Patient Health App, LINE Official Account, Telehealth Portal' } }
            }
        ],
        selfImageTags: [
            "Proactive Health Self-Manager", "Strict Medical Adherence", "Digital Appointment Native", "Anxious Care Seeker", "Caregiver Accompanied",
            "Doctor-Patient Dialogue Valuer", "Medication Safety Vigilant", "Preventive Medicine Advocate", "Acute Care Responder", "Clinic Wait-Time Sensitive",
            "Chronic Condition Long-Hauler", "Personal Vitals Tracker", "Medical Privacy Sensitive", "Multi-Prescription Cross-Checker", "Top Specialist Seeker",
            "Integrated Multi-Disciplinary Need", "High Self-Pay Acceptance", "Nursing Empathy Focused", "Telehealth Enthusiast", "Printed Brochure Preference",
            "Expense Transparency Demander", "Transit Accessibility Priority", "Medical Centre Loyalty", "Second Opinion Seeker", "Rehabilitation Resilient",
            "Nutritional Lifestyle Adherent", "Insurance Subsidy Vigilant", "Mobile Payment Fast-Track", "Post-Op Home Care Focused", "Minimal Friction Test Seeker"
        ],
        selfImageTagsZh: [
            "主動健康自主管理", "定期回診遵囑族", "數位掛號達人", "焦慮謹慎就醫者", "仰賴家屬陪同",
            "重視醫病溝通", "用藥安全注意", "預防醫學信仰者", "急症即時應變", "追求候診效率",
            "慢性病長期照護", "自我健康數據監測", "重視隱私保護", "多重用藥核對", "依賴名醫推薦",
            "跨科整合需求", "自費醫療接受度高", "護理照護同理心導向", "遠距醫療偏好", "偏好紙本衛教單張",
            "醫療費用透明度高要求", "就醫交通便利性優先", "信任公立醫學中心", "積極尋求第二意見", "復健治療恆毅力",
            "營養生活作息遵從", "健保補助權益關注", "行動支付快速通關", "術後居家照護重視", "免除繁瑣檢查流程"
        ],
        dailyWorkItems: [
            "a) Measuring and logging daily blood pressure, glucose or vitals",
            "b) Taking chronic or acute medications on schedule",
            "c) Checking clinic appointment slots and real-time queue numbers via app",
            "d) Reviewing lab blood test reports and imaging in health portal",
            "e) Attending hospital follow-up visits or picking up refills",
            "f) Performing home rehabilitation or post-op wound care",
            "g) Following prescribed dietary restrictions and exercise routines",
            "h) Asking care managers health questions via official LINE",
            "i) Auditing hospital expense bills and filing commercial insurance claims",
            "j) Other personal or family health management activities"
        ],
        dailyWorkItemsZh: [
            "a) 測量並記錄日常血壓、血糖或體溫等生理數值",
            "b) 依處方指示按時服用慢性病或急性期藥物",
            "c) 透過醫院 App 查詢預約掛號與目前看診燈號",
            "d) 於「健康存摺」查閱近期抽血檢驗與影像檢查報告",
            "e) 安排前往醫院回診、專科檢查或領取慢箋藥品",
            "f) 執行居家復健運動或術後傷口換藥照護",
            "g) 依醫師建議調整飲食控制與規律運動作息",
            "h) 諮詢個管師或官方 LINE 衛教照護問題",
            "i) 核對健保自費項目並向商業保險申請醫療理賠",
            "j) 其他個人或家人健康照護管理事務"
        ],
        officialSystems: [
            "Hospital Registration App", "National Health Insurance App (Health Passport)",
            "Kiosk Self Check-in", "Automated Payment Kiosk",
            "Phlebotomy Queue Display", "Pharmacy Refill Reservation System",
            "Telehealth Video Consultation", "Hospital LINE Official Account"
        ],
        officialSystemsZh: [
            "醫院官方掛號 App", "全民健保快易通 (健康存摺)",
            "診區自動報到機", "智慧自動繳費機",
            "檢驗科叫號系統", "藥劑科慢箋預約系統",
            "遠距醫療視訊診療平台", "醫院官方 LINE 服務號"
        ],
        personalTools: [
            "LINE", "Digital Blood Pressure / Glucose Monitor", "Weekly Pill Organiser",
            "Apple Health / Google Fit", "Physical Prescription & Invoice Slips",
            "Medical Diary / Notebook", "Hospital Care Hotline", "Family Caregiver Group",
            "Health Smartwatch (Apple Watch, etc.)", "Patient Support Forums"
        ],
        personalToolsZh: [
            "LINE", "電子血壓計／血糖機", "七格分裝藥盒",
            "Apple Health / Google Fit", "紙本處方箋與就醫收據",
            "個人記事本／病摘筆記", "醫院諮詢專線", "家人照護群組",
            "健康管理穿戴裝置 (Apple Watch等)", "病友社群 (FB/論壇)"
        ],
        coreNeeds: [
            "Real-time clinic wait time estimation to avoid crowded waiting rooms",
            "Thorough explanation of diagnosis and treatment pros/cons by doctor",
            "Instant online access to lab test reports with abnormal value alerts",
            "Mobile payment to bypass counter queues",
            "Fast-track pharmacy pickup for chronic prescription refills",
            "Clear medication labeling showing usage, side effects, and drug interactions",
            "Integrated multi-specialty clinics to avoid multiple visits in one day",
            "Clear post-discharge home care instructions and dedicated helpline",
            "Transparent billing with distinct separation of insurance vs self-pay items",
            "Empathetic nursing care and clear hospital navigation guidance",
            "Accessible facilities and wheelchair rental for seniors and disabled patients",
            "Telehealth consultations and home prescription delivery options",
            "Strict clinical privacy and confidential consultation spaces",
            "Transparent emergency room triage and diagnostic update notifications",
            "Electronic medical receipts easily exportable for insurance claims"
        ],
        coreNeedsZh: [
            "即時預估看診等候時間（避免在醫院漫長群聚等待）",
            "醫師診察時充分說明病因與多種治療方案優缺點",
            "抽血與影像檢查報告線上即時查詢與數值異常警示",
            "行動支付快速批價（免在櫃檯排隊繳費）",
            "慢性病連續處方箋快速預約取藥通道",
            "藥品包裝標示清楚用法、副作用與相互作用注意事項",
            "跨科別就醫整合門診（避免一日重複看多科）",
            "出院後居家照護衛教指導與即時諮詢熱線",
            "醫療費用明細透明化（清楚區分健保給付與自費項目）",
            "親切具同理心的護理照護與就醫引導",
            "高齡與行動不便者友善之無障礙設施與輪椅租借",
            "提供遠距視訊看診與藥品宅配到府服務",
            "就診隱私保護與獨立診療空間",
            "急診快速分流與處置進度透明通知",
            "電子就醫紀錄與收據便於保險理賠申請"
        ],
        archetypes: {
            c0: { name: 'Proactive Health Manager', nameZh: '主動健康管理者' },
            c1: { name: 'Anxious Care Seeker', nameZh: '焦慮謹慎型病患' },
            c2: { name: 'Digital Hospital Native', nameZh: '數位自助先鋒' },
            c3: { name: 'Caregiver Reliant', nameZh: '家屬依賴型長者' },
            c4: { name: 'Frustrated Waiter', nameZh: '流程受阻型病患' }
        }
    }
};

const BLANK_SCHEMA_TEMPLATE = {
    id: 'custom_new',
    name: '',
    nameZh: '',
    targetAudience: '',
    icon: '➕',
    badge: 'Custom Schema',
    badgeZh: '自訂問卷架構',
    sectionsConfig: {
        demographics: true,
        tags: true,
        dimensions: true,
        workContent: true,
        journey: true,
        stages: true
    },
    sectionTitles: {
        demographics: "Demographic Information",
        demographicsZh: "基本資料",
        tags: "Self-Image Tags",
        tagsZh: "自我形象標籤",
        dimensions: "Current Status & Dimensions",
        dimensionsZh: "現況評估與能力",
        workContent: "Daily Work Content and Needs",
        workContentZh: "日常工作內容與需求",
        journey: "Journey Map",
        journeyZh: "歷程地圖",
        stages: "Journey Stages & Touchpoints",
        stagesZh: "歷程階段與接觸點深度盤點"
    },
    intro: '',
    introZh: '',
    journeyIntro: '',
    journeyIntroZh: '',
    demographics: [
        {
            key: 'Demo_1',
            label: '',
            labelZh: '',
            type: 'single',
            options: ['', ''],
            optionsZh: ['', ''],
            subPrompt: '',
            subPromptZh: '',
            subType: 'single',
            subOptions: ['', ''],
            subOptionsZh: ['', '']
        }
    ],
    selfImageTags: ['', '', ''],
    selfImageTagsZh: ['', '', ''],
    q8Prompt: '',
    q8PromptZh: '',
    q9Prompt: '',
    q9PromptZh: '',
    q10Prompt: '',
    q10PromptZh: '',
    q11Prompt: '',
    q11PromptZh: '',
    q11Scale: '0-100',
    q12Prompt: '',
    q12PromptZh: '',
    q12Scale: 'emoji',
    q13Prompt: '',
    q13PromptZh: '',
    q13Options: ['', ''],
    q13OptionsZh: ['', ''],
    q14Prompt: '',
    q14PromptZh: '',
    q14Items: [{ label: '' }, { label: '' }],
    q14ItemsZh: [{ label: '' }, { label: '' }],
    q15Prompt: '',
    q15PromptZh: '',
    q15Items: [{ label: '' }, { label: '' }],
    q15ItemsZh: [{ label: '' }, { label: '' }],
    q16Prompt: '',
    q16PromptZh: '',
    q16Options: ['', ''],
    q16OptionsZh: ['', ''],
    q17Prompt: '',
    q17PromptZh: '',
    q17Options: ['', ''],
    q17OptionsZh: ['', ''],
    q18Prompt: '',
    q18PromptZh: '',
    q18Options: ['', ''],
    q18OptionsZh: ['', ''],
    q19Prompt: '',
    q19PromptZh: '',
    q19Options: ['', ''],
    q19OptionsZh: ['', ''],
    q20Prompt: '',
    q20PromptZh: '',
    dailyWorkItems: ['', '', ''],
    dailyWorkItemsZh: ['', '', ''],
    q21Prompt: '',
    q21PromptZh: '',
    q22Prompt: '',
    q22PromptZh: '',
    officialSystems: ['', ''],
    officialSystemsZh: ['', ''],
    q23Prompt: '',
    q23PromptZh: '',
    personalTools: ['', ''],
    personalToolsZh: ['', ''],
    q24Prompt: '',
    q24PromptZh: '',
    coreNeeds: ['', ''],
    coreNeedsZh: ['', ''],
    q25Prompt: '',
    q25PromptZh: '',
    q26Prompt: '',
    q26PromptZh: '',
    q26Options: ['', ''],
    q26OptionsZh: ['', ''],
    stages: [
        {
            id: 'stage_1',
            title: '',
            titleZh: '',
            actions: [
                {
                    name: '',
                    nameZh: '',
                    locations: ['', ''],
                    locationsZh: ['', ''],
                    tools: ['', ''],
                    toolsZh: ['', ''],
                    painPoints: ['', ''],
                    painPointsZh: ['', '']
                }
            ]
        }
    ],
    metrics: [
        { key: 'Skill_1', label: 'Evaluation Dimension 1', labelZh: '評估維度 1', scaleType: '0-100', category: 'system_efficiency', indicator: 'Dimension 1 Indicator', indicatorZh: '維度 1 指標' },
        { key: 'Skill_2', label: 'Evaluation Dimension 2', labelZh: '評估維度 2', scaleType: '0-100', category: 'sales_performance', indicator: 'Dimension 2 Indicator', indicatorZh: '維度 2 指標' }
    ],
    archetypes: {
        c0: { name: 'Cluster 1', nameZh: '客群畫像 1' },
        c1: { name: 'Cluster 2', nameZh: '客群畫像 2' },
        c2: { name: 'Cluster 3', nameZh: '客群畫像 3' },
        c3: { name: 'Cluster 4', nameZh: '客群畫像 4' },
        c4: { name: 'Cluster 5', nameZh: '客群畫像 5' }
    }
};

let currentJourneyDomain = 'agent';

// Deep clone canonical schemas for clean fallback and recovery against polluted localStorage
const DEFAULT_JOURNEY_SCHEMAS = JSON.parse(JSON.stringify(JOURNEY_SCHEMAS));

function getActiveJourneySchema() {
    if (typeof window !== 'undefined') {
        if (currentJourneyDomain === 'agent' || !currentJourneyDomain) {
            // Canonical Agent Journey: Always pristine original schema design
            return JOURNEY_SCHEMAS.agent;
        }
        if (window.__activeCustomSchema && (!currentJourneyDomain || window.__activeCustomSchema.id === currentJourneyDomain)) {
            return window.__activeCustomSchema;
        }
        try {
            const activeStored = localStorage.getItem('active_journey_schema');
            if (activeStored) {
                const parsed = JSON.parse(activeStored);
                if (parsed && (!currentJourneyDomain || parsed.id === currentJourneyDomain)) {
                    if (parsed.id !== 'agent') {
                        return parsed;
                    }
                }
            }
            const portalStored = localStorage.getItem('portal_custom_schemas');
            if (portalStored) {
                const allCustom = JSON.parse(portalStored);
                if (allCustom && allCustom[currentJourneyDomain]) {
                    const parsed = allCustom[currentJourneyDomain];
                    if (parsed && parsed.id !== 'agent') {
                        return parsed;
                    }
                }
            }
            const domainStored = localStorage.getItem(`custom_journey_schema_${currentJourneyDomain}`);
            if (domainStored) {
                const parsed = JSON.parse(domainStored);
                if (parsed && parsed.id && parsed.id !== 'agent') {
                    return parsed;
                }
            }
        } catch(e) {}
    }
    return JOURNEY_SCHEMAS[currentJourneyDomain] || JOURNEY_SCHEMAS.agent;
}

if (typeof window !== 'undefined') {
    window.JOURNEY_SCHEMAS = JOURNEY_SCHEMAS;
    window.DEFAULT_JOURNEY_SCHEMAS = DEFAULT_JOURNEY_SCHEMAS;
    window.BLANK_SCHEMA_TEMPLATE = BLANK_SCHEMA_TEMPLATE;
    window.getActiveJourneySchema = getActiveJourneySchema;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JOURNEY_SCHEMAS, DEFAULT_JOURNEY_SCHEMAS, BLANK_SCHEMA_TEMPLATE, getActiveJourneySchema };
}


// ==================== MEASUREMENT ROLES (SUP / TU / AR / PR) ====================
// Universal definitions shared by the schema designer and the portal scoring.
// See "Universal WP / AR / PR Measurement Guideline". A schema fills five question
// roles with its own wording; the three measures are computed from those roles.
const MEASURE_DEFS = {
    SUP: {
        name: 'System Utility Perception', nameZh: '系統效用感知',
        purpose: 'How useful and easy the tools or systems people currently use feel to respondents. If none of these questions are in the schema, the portal falls back to the average of the stage ratings.',
        purposeZh: '受訪者覺得目前使用的工具或系統有多好用、多順手。若問卷未納入這些題目，系統會改以各階段評分的平均計算。',
        roles: ['F', 'G', 'H']
    },
    WP: {
        abbr: 'TU',
        name: 'Touchpoint Use', nameZh: '接觸點使用度',
        purpose: 'Shows which touchpoints respondents use to reach their goal (people, physical objects, digital tools and physical channels) and why they use them. For experience and efficiency impact see SUP; for pain points see AR. Leave its questions out and the portal marks it "not measured".',
        purposeZh: '呈現受訪者在達成目標的過程中，使用各類接觸點的情況（人員、實體物件、數位工具及實體管道皆可）以及使用原因。使用體驗與對效率的影響請見 SUP，痛點請見 AR。若未納入相關題目，系統將標示為「未測量」。',
        roles: ['A', 'B', 'C']
    },
    AR: {
        name: 'Abandonment and Rework Rate', nameZh: '放棄與重工率',
        purpose: 'How often a journey stage goes wrong enough that the respondent redoes it, works around it, hands it off or gives up.',
        purposeZh: '旅程階段出錯，導致受訪者重做、改用其他做法、轉交他人或放棄的頻率。',
        roles: ['E']
    },
    PR: {
        name: 'Human-Assist Reliance', nameZh: '人力協助依賴度',
        purpose: 'How much respondents lean on other people, rather than systems, to get through the journey.',
        purposeZh: '受訪者依賴他人（而非系統）完成旅程的程度。',
        roles: ['D', 'C']
    }
};

const MEASURE_ROLE_DEFS = {
    F: {
        measure: 'SUP', slot: 'q12', name: 'Overall feeling', nameZh: '整體感受',
        asks: 'Overall, how do you feel about the way you currently get things done? (1-5 rating)',
        asksZh: '整體而言，您對目前完成工作的方式感覺如何？（1–5 分）',
        counts: 'The 1–5 rating is directly calculated as an input score for SUP (Overall Support).',
        countsZh: '受訪者所選的 1–5 分評分，直接作為整體支援度（SUP）的計算數值。',
        notCounts: 'Any free-text remarks or comments (only the numeric 1–5 rating is calculated into the overall score).',
        notCountsZh: '自由填寫的文字備註或意見（指標僅採計 1–5 分的數值評分，質性文字不納入計算）。'
    },
    G: {
        measure: 'SUP', slot: 'q13', name: 'Impact of tools', nameZh: '工具的影響',
        asks: 'What impact do the tools or systems currently provided have on your efficiency or convenience?',
        asksZh: '您認為目前提供的工具或系統，對您的效率或便利性有何影響？',
        counts: 'The chosen option maps to a 1–5 scale based on option order (from most negative to most positive) as an input to SUP.',
        countsZh: '所選選項依其排列順序（由最負面到最正面）對應為 1–5 分，計入 SUP 指標。',
        notCounts: 'Non-scale options such as "Not applicable" or blank answers (note: ensure choices are ordered from most negative to most positive so the 1–5 rating is mapped correctly).',
        notCountsZh: '「不適用」等非評分選項或未填答（注意：選項務必依負面至正面順序排列，以確保評分正確對應）。'
    },
    H: {
        measure: 'SUP', slot: 'q14', name: 'Ratings matrix', nameZh: '評分矩陣',
        asks: 'How do you rate the tools or systems on each item of the matrix? (1-5 or 0-100 scale)',
        asksZh: '您如何評價這些工具或系統的各個項目？（1–5 分或 0–100 分）',
        counts: 'Each matrix dimension is converted to a 1–5 score; their average contributes to the SUP metric.',
        countsZh: '矩陣中各項目的評分會換算為 1–5 分，並以其平均值計入 SUP 指標。',
        notCounts: 'Unrated matrix rows or standalone questions outside this rating table (only items evaluated within this matrix card are averaged).',
        notCountsZh: '略過未填寫的項目，或本評分矩陣以外的其他題目（僅計算此矩陣內項目的平均分）。'
    },
    A: {
        measure: 'WP', slot: 'q16', name: 'Reasons', nameZh: '原因',
        asks: 'Why do you use these touchpoints?',
        asksZh: '您為什麼使用這些接觸點？',
        counts: 'Each motivation ticked counts as 1 reason towards the Work Practice (WP) breadth score (up to 3 choices count fully).',
        countsZh: '每勾選一個使用動機計為 1 個原因，計入工作實踐（WP）的多樣性分數（最多計 3 項滿分）。',
        notCounts: 'Detailed text entered into "Other (please specify)" (the checkbox counts as 1 reason, but the typed text is not scored), and non-motivation choices (e.g. satisfaction ratings).',
        notCountsZh: '在「其他」欄位填寫的具體文字內容（勾選「其他」本身算 1 個原因，但填寫的文字不另行計分），以及非動機性質的選項（例如滿意度評分）。'
    },
    B: {
        measure: 'WP', slot: 'q17', name: 'Methods', nameZh: '做法',
        asks: 'Which touchpoints do you use to carry out your main recurring task? (Multi-select)',
        asksZh: '您用哪些接觸點來進行主要的重複性工作？（可複選）',
        counts: 'Each ticked method is scored by autonomy level: Assigned (0), Mixed (0.5), or Self-chosen (1.0). The average reflects work autonomy.',
        countsZh: '受訪者勾選的各個選項依自主程度計分：公司指定（0 分）、混合做法（0.5 分）、自選做法（1 分），以其平均值反映自主性。',
        notCounts: 'Options categorised as "No plan" or "No specific method" (these are omitted from the average rather than counted as 0, so they do not unfairly lower the autonomy score).',
        notCountsZh: '屬於「沒有特別規劃／無特定方式」的選項（此類選項直接從平均計算中排除，不會被當成 0 分而拉低自主性分數）。'
    },
    C: {
        measure: 'WP + PR', slot: 'q23', name: 'Touchpoints used', nameZh: '使用的接觸點',
        asks: 'Which touchpoints do you use, such as personal tools, habits or people?',
        asksZh: '您會使用哪些接觸點，例如個人工具、習慣或人？',
        counts: 'Each personal tool or channel ticked counts as 1 touchpoint toward Touchpoint Utility (TU, up to 3). Any option tagged as a [Person] also adds 1 to People Reliance (PR).',
        countsZh: '每勾選一個自選接觸點，TU（接觸點多樣性）計 1 個（最多計 3 個）；若選項標記為「人」，則同時計入 PR（人員依賴度）一次。',
        notCounts: 'Mandatory tools assigned by the organisation (which belong in official workflow questions), and unselected choices.',
        notCountsZh: '公司規定必用的標準工具（應放在專屬的工作流程題目，而非此處），以及未被勾選的選項。'
    },
    D: {
        measure: 'PR', slot: 'stage_tools', name: 'Help per stage', nameZh: '各階段協助',
        asks: 'Who or what helped at each journey stage? (Tools and people)',
        asksZh: '各旅程階段由誰或什麼提供協助？（工具與人員）',
        counts: '• Journey Map: All tools, software, and people entered are fully mapped and displayed in the Journey Map under each stage.<br>• PR Metric: When assistance involves a person (colleague, manager, staff, friend), it adds 1 to People Reliance (PR) to measure human dependency vs. self-service.',
        countsZh: '• 歷程地圖：受訪者填寫的所有工具、軟體與協同人員，均會完整彙整並呈現在歷程地圖的接觸點中。<br>• PR 指標：當提及由「人」（如同事、主管、專員、親友）提供協助時，該階段計入人員依賴度一次（PR +1），用以衡量對人工協助的依賴程度。',
        notCounts: 'Digital software, apps, and portals are displayed on the Journey Map, but do not increase the PR score (as they represent automated or self-service tools rather than human assistance).',
        notCountsZh: '數位工具、應用程式與系統入口網站會完整保留在歷程地圖中，但不會增加「人員依賴度（PR）」的分數（因其代表的是數位工具／自助操作，而非依賴真人協助）。'
    },
    E: {
        measure: 'AR', slot: 'stage_pain', name: 'Pain per stage', nameZh: '各階段痛點',
        asks: 'What went wrong at each journey stage? (free text)',
        asksZh: '各旅程階段出了什麼問題？（自由填寫）',
        counts: 'A stage triggers an Autonomous Resolution (AR) friction point when the text indicates disruption: rework, rejection, manual workaround, or abandonment (e.g. "redo", "rejected", "by hand", "gave up").',
        countsZh: '當某階段的痛點描述提及重工、退件、被迫改用人工或放棄（例如「重新輸入」、「退件」、「改手動」、「放棄」）時，該階段計入自主解決受阻（AR +1）。',
        notCounts: 'General subjective complaints (such as "feels slow" or "confusing UI") unless they caused actual rework, rejection, manual fallback, or abandonment.',
        notCountsZh: '僅純粹抱怨速度慢或不清楚（例如「很慢」、「介面混亂」）而未造成重工或流程中斷者（此類一般抱怨不計入 AR）。'
    }
};

// AR universal phrase core (lower case). Schemas add their own via schema.arDomainPhrases.
const AR_CORE_PHRASES = [
    // rework
    'again', 'twice', 're-enter', 're-entering', 'redo', 're-upload', 're-uploading', 'start over', 'started over',
    // rejection
    'rejected', 'denied', 'returned',
    // fallback
    'by hand', 'manual', 'had to call', 'in person instead',
    // giving up
    'give up', 'giving up', 'gave up', 'abandon', 'cancel', 'walk away', 'walked away',
    // Chinese
    '重複輸入', '重填', '退件', '手動', '重新上傳', '放棄', '取消', '重來'
];
const AR_AGENT_PHRASES = [
    'converting pdf', 'password reset', 'chasing a colleague', 'logging back in', 'system error',
    '手寫', '密碼', '重設密碼', '重新登入', '強制登出', '被登出', '系統錯誤', '錯誤'
];
const PEOPLE_KEYWORDS = [
    'colleague', 'assistant', 'peer', 'mentor', 'supervisor', 'senior', 'family', 'friend', 'relative',
    'caregiver', 'nurse', 'staff', 'hotline', 'agent (', 'advisor',
    '同事', '主管', '前輩', '助理', '同儕', '同仁', '家人', '朋友', '親友', '照護', '看護', '客服', '人員'
];
const OFFICIAL_KEYWORDS = ['company', 'official', 'portal', 'hospital app', 'clinic app', '公司', '正式', '官方', '醫院'];
const SKIP_METHOD_KEYWORDS = ['do not specifically plan', 'no specific plan', 'not specifically', '不特別', '沒有特別', '無特定'];
const NULL_ANSWER_KEYWORDS = ['rarely use', 'none', 'n/a', 'no reason', '很少使用', '很少', '無', '沒有'];

function measureSplitMulti(v) {
    if (v === undefined || v === null) return [];
    return String(v).split(/[;；,，|]+/).map(x => x.trim()).filter(Boolean);
}
function measureIsNullAnswer(item) {
    const l = item.toLowerCase();
    return NULL_ANSWER_KEYWORDS.some(k => l === k || (k.length > 3 && l.includes(k)));
}
// Kind of a method answer: 'official' | 'mixed' | 'own' | 'skip'
function inferMethodKind(text, schema) {
    const l = String(text).toLowerCase();
    if (SKIP_METHOD_KEYWORDS.some(k => l.includes(k))) return 'skip';
    if (schema && Array.isArray(schema.q17Options) && Array.isArray(schema.q17OptionKinds)) {
        const idx = schema.q17Options.findIndex(o => o && o.trim().toLowerCase() === l.trim());
        if (idx >= 0 && schema.q17OptionKinds[idx]) return schema.q17OptionKinds[idx];
    }
    if (/\b(both|mixed|combination)\b|兩者|混合/.test(l)) return 'mixed';
    if (OFFICIAL_KEYWORDS.some(k => l.includes(k)) && !/personal|own|個人/.test(l)) return 'official';
    return 'own';
}
function measureKindValue(kind) { return kind === 'official' ? 0 : (kind === 'mixed' ? 0.5 : 1); }
function measureIsPeople(text, schema) {
    const l = String(text).toLowerCase();
    if (schema && Array.isArray(schema.personalTools) && Array.isArray(schema.personalToolsPeople)) {
        const idx = schema.personalTools.findIndex(o => o && o.trim().toLowerCase() === l.trim());
        if (idx >= 0) return !!schema.personalToolsPeople[idx];
    }
    return PEOPLE_KEYWORDS.some(k => l.includes(k));
}
function getArPhrases(schema) {
    let domain = [];
    if (schema && Array.isArray(schema.arDomainPhrases)) domain = schema.arDomainPhrases;
    else if (schema && schema.id === 'agent') domain = AR_AGENT_PHRASES;
    return AR_CORE_PHRASES.concat(domain.map(p => String(p).toLowerCase()).filter(Boolean));
}
function measureTextHasPhrase(text, phrases) {
    const l = String(text).toLowerCase();
    for (const p of phrases) {
        let from = 0, i;
        while ((i = l.indexOf(p, from)) !== -1) {
            const before = l.slice(Math.max(0, i - 24), i);
            const negated = /(\bnot|n't|\bnever|\bwithout|\bno)\s+(\w+\s+){0,2}$/.test(before);
            if (!negated) return true;
            from = i + p.length;
        }
    }
    return false;
}

// inputs: { has:{reasons,methods,tools,stageTools,stagePains}, reasons, methods, tools, stageTools:[], stagePains:[] }
// Returns { wp, ar, pr } on a 1-5 scale, or null for a measure with no source questions.
function computeMeasures(inputs, schema, phrases) {
    const has = inputs.has || {};
    const out = { wp: null, ar: null, pr: null };

    // WP
    const parts = [];
    if (has.reasons) {
        const n = measureSplitMulti(inputs.reasons).filter(x => !measureIsNullAnswer(x)).length;
        parts.push([0.5, Math.min(1, n / 3)]);
    }
    if (has.methods) {
        const kinds = measureSplitMulti(inputs.methods).map(x => inferMethodKind(x, schema)).filter(k => k !== 'skip');
        parts.push([0.3, kinds.length ? kinds.reduce((a, k) => a + measureKindValue(k), 0) / kinds.length : 0]);
    }
    if (has.tools) {
        const n = measureSplitMulti(inputs.tools).filter(x => !measureIsNullAnswer(x)).length;
        parts.push([0.4, Math.min(1, n / 3)]);
    }
    if (parts.length) {
        const wSum = parts.reduce((a, p) => a + p[0], 0);
        const num = parts.reduce((a, p) => a + p[0] * p[1], 0);
        out.wp = Math.round((1 + 4 * num / wSum) * 100) / 100;
    }

    // AR
    if (has.stagePains) {
        let answered = 0, flagged = 0;
        (inputs.stagePains || []).forEach(t => {
            if (t === undefined || t === null || String(t).trim() === '') return;
            answered++;
            if (measureTextHasPhrase(t, phrases || getArPhrases(schema))) flagged++;
        });
        out.ar = Math.round((1 + 4 * (answered ? flagged / answered : 0)) * 100) / 100;
    }

    // PR
    if (has.stageTools || has.tools) {
        let signals = 0;
        if (has.stageTools) (inputs.stageTools || []).forEach(t => {
            if (t && measureSplitMulti(t).some(x => measureIsPeople(x, schema))) signals++;
        });
        if (has.tools) signals += measureSplitMulti(inputs.tools).filter(x => measureIsPeople(x, schema)).length;
        out.pr = Math.min(5, Math.round((1 + 0.5 * signals) * 100) / 100);
    }
    return out;
}

// Coverage of the three measures for a schema, used by the designer panel.
function getMeasureCoverage(schema) {
    const s = schema || {};
    const nonEmpty = arr => Array.isArray(arr) && arr.some(x => x && String(x).trim());
    const stages = Array.isArray(s.stages) ? s.stages : [];
    const acts = stages.reduce((a, st) => a.concat((st.actionDetails && st.actionDetails.length ? st.actionDetails : (st.actions || []))), []);
    const present = {
        F: !!(s.q12Prompt && String(s.q12Prompt).trim()),
        G: nonEmpty(s.q13Options),
        H: Array.isArray(s.metrics) && s.metrics.some(m => String(m.sourceQuestion || '').replace(/\D/g, '') === '14'),
        A: nonEmpty(s.q16Options),
        B: nonEmpty(s.q17Options),
        C: nonEmpty(s.personalTools),
        D: acts.some(a => a && typeof a === 'object' && nonEmpty(a.tools)),
        E: acts.length > 0
    };
    const kinds = Array.isArray(s.q17Options) ? s.q17Options.filter(o => o && o.trim()).map((o, i) => inferMethodKind(o, s)).filter(k => k !== 'skip') : [];
    const hasPeople = nonEmpty(s.personalTools) && s.personalTools.some(o => o && o.trim() && measureIsPeople(o, s));
    const warnings = [];
    if (present.B && kinds.length && kinds.every(k => k === kinds[0])) {
        warnings.push({ role: 'B', text: 'All method options are marked the same, so Q17 cannot separate assigned from self-chosen touchpoints.', textZh: '所有做法選項被標記為同一類，無法區分指定與自選的接觸點。' });
    }
    if (present.C && !hasPeople && !present.D) {
        warnings.push({ role: 'C', text: 'No option is marked as a person and no stage names people, so PR has no source.', textZh: '沒有選項標記為「人」，各階段也沒有人員欄位，PR 沒有來源。' });
    }
    const measures = {};
    Object.keys(MEASURE_DEFS).forEach(m => {
        const roles = MEASURE_DEFS[m].roles;
        const have = roles.filter(r => present[r]);
        measures[m] = {
            roles: roles.map(r => ({ role: r, present: !!present[r] })),
            status: have.length === 0 ? 'none' : (have.length === roles.length ? 'full' : 'partial')
        };
    });
    return { present, measures, warnings };
}


// Role A / B sources for the built-in schemas (previously supplied only as designer defaults).
(function seedMeasureRoleDefaults() {
    const agentReasons = ['Faster speed', 'More familiar interface', 'Company system lacks this function', 'Customers prefer communicating this way', 'Company system login/operation is too troublesome', 'I rarely use personal tools', 'Other'];
    const agentMethods = ['Company system', 'Personal apps (e.g., Google Calendar)', 'Paper calendar/notebook', 'Do not specifically plan', 'Other'];
    const seeds = {
        agent: { q16Options: agentReasons, q17Options: agentMethods, q17OptionKinds: ['official', 'own', 'own', 'skip', 'own'] },
        policyholder: { q17OptionKinds: ['official', 'official', 'own', 'own', 'skip', 'own'] }
    };
    [JOURNEY_SCHEMAS, DEFAULT_JOURNEY_SCHEMAS].forEach(root => {
        Object.keys(seeds).forEach(k => {
            if (!root[k]) return;
            Object.keys(seeds[k]).forEach(f => { if (!root[k][f]) root[k][f] = seeds[k][f].slice(); });
        });
    });
})();


// ==================== NO SUB-QUESTIONS ====================
// Sub-questions are not supported: they disturb question numbering. Every question is a numbered,
// stand-alone question. This removes sub-question fields from a schema (in place) and returns it.
const SUB_QUESTION_KEYS = ['subPrompt', 'subPromptZh', 'subType', 'subOptions', 'subOptionsZh', 'subQuestion',
    'q17SubPrompt', 'q17SubPromptZh', 'q17SubOptions', 'q17SubOptionsZh'];
function stripSubQuestions(o) {
    if (Array.isArray(o)) { o.forEach(stripSubQuestions); return o; }
    if (o && typeof o === 'object') {
        SUB_QUESTION_KEYS.forEach(k => { delete o[k]; });
        if (o.type === 'multi_select_with_subquestion') o.type = 'multi_select';
        Object.keys(o).forEach(k => { if (o[k] && typeof o[k] === 'object') stripSubQuestions(o[k]); });
    }
    return o;
}
stripSubQuestions(JOURNEY_SCHEMAS);
stripSubQuestions(DEFAULT_JOURNEY_SCHEMAS);
stripSubQuestions(BLANK_SCHEMA_TEMPLATE);


// ==================== QUESTION REGISTRY (designer numbering <-> CSV header <-> dashboard slot) ====================
// One row per designer question. `header` is the generic CSV column the portal expects; `legacy` lists
// older agent-specific headers that still map. `slot` says where the answer appears on the dashboard.
const QUESTION_SLOTS = {
    demographic: { en: 'Filters & demographic breakdown', zh: '篩選與人口統計' },
    badges:      { en: 'Self-image badges',               zh: '自我形象標籤' },
    metric:      { en: 'Clustering metric / skills radar', zh: '分群指標／能力雷達' },
    sup:         { en: 'SUP (System Utility Perception)', zh: '系統效用感知 SUP' },
    reasons:     { en: 'TU + reasons distribution',       zh: 'TU 與原因分布' },
    methods:     { en: 'TU + method distribution',        zh: 'TU 與做法分布' },
    followup:    { en: 'Follow-up reason distribution',   zh: '後續原因分布' },
    willingness: { en: 'Willingness distribution',        zh: '使用意願分布' },
    daily:       { en: 'Daily task allocation chart',     zh: '日常工作佔比圖' },
    conflict:    { en: 'Core conflicts',                  zh: '核心矛盾' },
    official:    { en: 'Official systems distribution',   zh: '官方系統分布' },
    personal:    { en: 'Personal tools (TU / PR) + chart', zh: '個人工具（TU／PR）與圖表' },
    needs:       { en: 'Core needs',                      zh: '核心需求' },
    quote:       { en: 'Verbatim quote',                  zh: '原聲引述' },
    focus:       { en: 'Journey focus distribution',      zh: '歷程焦點分布' },
    stage:       { en: 'Journey map & AR / PR',           zh: '歷程地圖與 AR／PR' }
};

// slug = generic column suffix; key = portal target key; legacy = old agent-specific headers
const QUESTION_REGISTRY = [
    { no: 8,  slug: 'tag_1',               key: 'role_badges',   slot: 'badges',      type: 'Single', legacy: ['Q17_self_tag_1', 'Q8_self_tag_1'] },
    { no: 9,  slug: 'tag_2',               key: 'role_badges_2', slot: 'badges',      type: 'Single', legacy: ['Q18_self_tag_2', 'Q9_self_tag_2'] },
    { no: 10, slug: 'tag_3',               key: 'role_badges_3', slot: 'badges',      type: 'Single', legacy: ['Q19_self_tag_3', 'Q10_self_tag_3'] },
    { no: 12, slug: 'overall_feeling_1to5', key: 'feeling',      slot: 'sup',         type: '1-5',    legacy: ['Q9_workstyle_feeling_1to5'] },
    { no: 13, slug: 'tool_impact',         key: 'tool_impact',   slot: 'sup',         type: 'Single', legacy: ['Q10_tool_impact_on_efficiency'] },
    { no: 16, slug: 'reasons',             key: 'role_reasons',  slot: 'reasons',     type: 'Multi',  legacy: ['Q13_personal_tool_reasons'] },
    { no: 17, slug: 'method',              key: 'role_methods',  slot: 'methods',     type: 'Multi',  legacy: ['Q14_scheduling_methods'] },
    { no: 18, slug: 'followup_reason',     key: 'followup',      slot: 'followup',    type: 'Single', legacy: ['Q15_paper_calendar_reason'] },
    { no: 19, slug: 'willingness',         key: 'willingness',   slot: 'willingness', type: 'Single', legacy: ['Q16_calendar_ai_willingness'] },
    { no: 20, slug: 'task_allocation',     key: 'tasks_text',    slot: 'daily',       type: 'Alloc',  legacy: ['Q20_work_item_allocation'] },
    { no: 21, slug: 'gap',                 key: 'conflict',      slot: 'conflict',    type: 'Text',   legacy: ['Q21_gap_or_contradiction'] },
    { no: 22, slug: 'official_systems',    key: 'official',      slot: 'official',    type: 'Multi',  legacy: ['Q22_official_systems_used'] },
    { no: 23, slug: 'personal_tools',      key: 'personal_tools', slot: 'personal',   type: 'Multi',  legacy: ['Q23_personal_tools_used'] },
    { no: 24, slug: 'core_needs',          key: 'needs',         slot: 'needs',       type: 'Multi',  legacy: ['Q24_core_needs'] },
    { no: 25, slug: 'motto',               key: 'quote',         slot: 'quote',       type: 'Text',   legacy: ['Q25_motto'] },
    { no: 26, slug: 'journey_focus',       key: 'journey_focus', slot: 'focus',       type: 'Single', legacy: ['Q26_journey_focus'] }
];
QUESTION_REGISTRY.forEach(r => { r.header = `Q${r.no}_${r.slug}`; });

// Generic CSV header for a matrix item / stage field
function matrixItemHeader(qNo, idx) { return `Q${qNo}_item_${idx}_1to5`; }
function stageFieldHeader(step, field) {
    const slug = { rating: 'rating_1to5', pain: 'pain', location: 'location', tools: 'tools_or_people' }[field];
    return `Q27_S${step}_${slug}`;
}

const DEMO_SLUGS = ['age_range', 'region', 'branch', 'job_rank', 'years_experience', 'customers_served', 'performance_rank'];
// Full list of questions of a schema with header + slot, in designer order. Used by the portal mapping,
// the designer slot badges, the coverage panel and the CSV rebuild.
function getSchemaQuestionMap(schema) {
    const out = [];
    const slot = id => QUESTION_SLOTS[id];
    ((schema && schema.demographics) || []).forEach((d, i) => out.push({
        no: i + 1, header: `Q${i + 1}_${(schema.id === 'agent' && DEMO_SLUGS[i]) || (d.key || '').replace(/^Demo_\d+_/, '').toLowerCase()}`, key: 'demo_' + (d.key || '').replace(/^Demo_\d+_/, ''),
        slot: 'demographic', slotLabel: slot('demographic'), labelEn: d.label, labelZh: d.labelZh || d.label
    }));
    const metrics = (schema && schema.metrics) || [];
    const perQ = {};
    metrics.forEach(m => {
        const q = parseInt(String(m.sourceQuestion || '').replace(/\D/g, ''), 10) || 0;
        perQ[q] = (perQ[q] || 0) + 1;
        const header = q === 11 ? 'Q11_familiarity_pct' : matrixItemHeader(q, perQ[q]);
        out.push({ no: q, header, key: 'metric_' + m.key, slot: 'metric', slotLabel: slot('metric'), labelEn: m.label, labelZh: m.labelZh || m.label });
    });
    QUESTION_REGISTRY.forEach(r => out.push({
        no: r.no, header: r.header, key: r.key, slot: r.slot, slotLabel: slot(r.slot), legacy: r.legacy,
        labelEn: (schema && schema['q' + r.no + 'Prompt']) || '', labelZh: (schema && schema['q' + r.no + 'PromptZh']) || ''
    }));
    ((schema && schema.stages) || []).forEach((st, i) => ['rating', 'pain', 'location', 'tools'].forEach(f => out.push({
        no: 27, header: stageFieldHeader(i + 1, f), key: `stage_${i + 1}_${f}`, slot: 'stage', slotLabel: slot('stage'),
        labelEn: st.title, labelZh: st.titleZh || st.title
    })));
    return out.sort((a, b) => a.no - b.no);
}

// ==================== AGENT METRICS (every matrix item is a clustering metric) ====================
const AGENT_METRICS = [
    { key: 'Skill_Device', label: 'Tool/System Familiarity', labelZh: '工具／系統熟悉度', scaleType: '0-100', category: 'system_efficiency', indicator: 'Familiarity with Devices and Systems', indicatorZh: '對硬體裝置與作業系統之熟稔程度', sourceQuestion: 'Q11' },
    { key: 'Skill_Knowledge', label: 'Insurance Knowledge', labelZh: '專業保險產品條款知識', scaleType: '1-5', category: 'sales_performance', indicator: 'Product & Regulatory Knowledge', indicatorZh: '對保險商品與法規之專業知識', sourceQuestion: 'Q15' },
    { key: 'Skill_Sales_Pitch', label: 'Sales Pitch Communication', labelZh: '銷售訪談溝通話術能力', scaleType: '1-5', category: 'sales_performance', indicator: 'Sales Pitch & Persuasion', indicatorZh: '銷售話術與客戶溝通能力', sourceQuestion: 'Q15' },
    { key: 'Skill_Customer_Relations', label: 'Customer Relationship Management', labelZh: '客戶關係經營維護能力', scaleType: '1-5', category: 'sales_performance', indicator: 'Relationship Cultivation', indicatorZh: '客戶關係深耕與經營維護能力', sourceQuestion: 'Q15' },
    { key: 'Skill_Digital_Tools', label: 'Digital Tool Usage', labelZh: '數位工具熟悉度', scaleType: '1-5', category: 'system_efficiency', indicator: 'Digital Tool Adoption', indicatorZh: '數位系統與行動 App 之使用熟悉度', sourceQuestion: 'Q14' },
    { key: 'Skill_Speed_Reliability', label: 'System Speed & Reliability', labelZh: '系統速度與穩定度', scaleType: '1-5', category: 'system_efficiency', indicator: 'System speed and stability', indicatorZh: '系統速度與穩定度', sourceQuestion: 'Q14' },
    { key: 'Skill_Mobile_Experience', label: 'Mobile Experience', labelZh: '行動裝置使用體驗', scaleType: '1-5', category: 'system_efficiency', indicator: 'Mobile app experience', indicatorZh: '行動 App 使用體驗', sourceQuestion: 'Q14' },
    { key: 'Skill_Customer_Service', label: 'Customer Service', labelZh: '客戶服務能力', scaleType: '1-5', category: 'sales_performance', indicator: 'Customer service capability', indicatorZh: '客戶服務能力', sourceQuestion: 'Q15' }
];
// Q14 / Q15 matrix items of the agent preset, in the same order as the metrics above
const AGENT_Q14_ITEMS = ['Digital tool usage', 'System speed and reliability', 'Mobile experience'];
const AGENT_Q14_ITEMS_ZH = ['數位工具使用', '系統速度與穩定度', '行動裝置使用體驗'];
const AGENT_Q15_ITEMS = ['Insurance product knowledge', 'Sales pitch and communication', 'Customer relationship management', 'Customer service'];
const AGENT_Q15_ITEMS_ZH = ['保險商品知識', '銷售話術與溝通', '客戶關係經營', '客戶服務'];

// ==================== GENERIC QUESTION WORDING (Q11-Q26 + stage questions) ====================
// Fill-only-if-empty defaults, so every use case starts from neutral wording it can then tailor.
const GENERIC_QUESTION_DEFAULTS = {
    q11Prompt: 'How familiar are you with the tools and systems you currently use for your work?',
    q11PromptZh: '您對目前工作上使用的工具／系統熟悉程度為何？',
    q12Prompt: 'Overall, how does your current way of working make you feel?',
    q12PromptZh: '整體而言，您目前的工作方式讓您感覺如何？',
    q13Prompt: 'What impact do the tools and systems currently provided to you have on your daily efficiency?',
    q13PromptZh: '目前提供給您的工具／系統，對您日常效率有何影響？',
    q14Prompt: 'Please rate the impact of each of the following SYSTEM / DIGITAL TOOL factors on your efficiency or experience.',
    q14PromptZh: '請評估下列「系統／數位工具」因素對您效率或體驗的影響程度。',
    q15Prompt: 'Please rate the impact of each of the following CAPABILITY / SERVICE factors on your overall performance or satisfaction.',
    q15PromptZh: '請評估下列「能力／服務」因素對您整體表現或滿意度的影響程度。',
    q16Prompt: 'What are the main reasons you use personal tools or contacts instead of the official channel? (Multi-select)',
    q16PromptZh: '您使用個人工具或聯絡方式，而不使用官方管道的主要原因為何？（可複選）',
    q17Prompt: 'How do you plan and organise your main recurring task? (Multi-select)',
    q17PromptZh: '您如何規劃與安排主要的重複性工作？（可複選）',
    q18Prompt: 'If you chose a paper-based or manual option above, what is the main reason? (Single select; skip if not applicable)',
    q18PromptZh: '若您上述選擇紙本或人工方式，主要原因為何？（單選；若不適用請略過）',
    q19Prompt: 'If the system could automatically offer relevant information or suggestions before your next planned activity, how willing would you be to use it?',
    q19PromptZh: '若系統能在您下一個預定活動前，自動提供相關資訊或建議，您的使用意願為何？',
    q20Prompt: 'Below are your main kinds of activity. Choose up to 5 you do most often and estimate the share of time each takes.',
    q20PromptZh: '以下列出主要活動類型。請選出最常進行的項目（最多 5 項），並預估各項所佔時間比例。',
    q21Prompt: 'In carrying out these activities, is there a gap or contradiction between what you hope to achieve and what you actually get? Please briefly explain.',
    q21PromptZh: '在進行上述活動時，您期望達成的目標與實際獲得的成果之間，是否存在落差或矛盾？請簡要說明。',
    q22Prompt: 'Which OFFICIAL systems or channels do you use most often? (Multi-select)',
    q22PromptZh: '您最常使用哪些「官方系統／管道」？（可複選）',
    q23Prompt: 'Which PERSONAL tools or workarounds do you use most often? (Multi-select)',
    q23PromptZh: '您最常使用哪些「個人工具／替代做法」？（可複選）',
    q24Prompt: 'What are your most important needs or expectations? (Select up to 5)',
    q24PromptZh: '您最重要的需求或期待為何？（最多選 5 項）',
    q25Prompt: 'Please share one sentence or motto that best represents you.',
    q25PromptZh: '請以一句話或座右銘，分享最能代表您的想法。',
    q26Prompt: 'Which core journey do you focus on and experience most often? (Single select)',
    q26PromptZh: '您最專注、最常經歷的核心歷程為何？（單選）',
    journeyIntro: 'For each stage below, tell us where it happens, what helps you, what gets in the way and how it feels.',
    journeyIntroZh: '請就下列每個階段，說明在哪裡進行、有哪些工具或人員協助、遇到哪些阻礙，以及整體感受。'
};
// Neutral stage-question labels (shown to the respondent for every stage)
const GENERIC_STAGE_QUESTIONS = {
    location:  { en: 'Where does this stage usually happen?', zh: '此階段通常在哪裡進行？' },
    tools:     { en: 'Which tools or people help you in this stage?', zh: '此階段有哪些工具或人員協助您？' },
    pain:      { en: 'What gets in the way or slows you down in this stage?', zh: '此階段有哪些阻礙或讓您卡關的地方？' },
    rating:    { en: 'How do you feel about this stage overall? (1 = very negative, 5 = very positive)', zh: '您對此階段的整體感受？（1＝非常負面，5＝非常正面）' }
};

function seedGenericQuestionDefaults(schema) {
    if (!schema || typeof schema !== 'object') return schema;
    Object.keys(GENERIC_QUESTION_DEFAULTS).forEach(k => { if (!schema[k]) schema[k] = GENERIC_QUESTION_DEFAULTS[k]; });
    return schema;
}

(function applyGenericWording() {
    [JOURNEY_SCHEMAS, DEFAULT_JOURNEY_SCHEMAS].forEach(root => {
        Object.keys(root).forEach(k => {
            const s = root[k];
            if (!s || !s.id) return;
            if (k === 'agent') {
                // agent keeps its option lists, but its question stems become use-case neutral
                s.q11Prompt = GENERIC_QUESTION_DEFAULTS.q11Prompt; s.q11PromptZh = GENERIC_QUESTION_DEFAULTS.q11PromptZh;
                s.q12Prompt = GENERIC_QUESTION_DEFAULTS.q12Prompt; s.q12PromptZh = GENERIC_QUESTION_DEFAULTS.q12PromptZh;
                s.q13Prompt = GENERIC_QUESTION_DEFAULTS.q13Prompt; s.q13PromptZh = GENERIC_QUESTION_DEFAULTS.q13PromptZh;
                s.q14Items = AGENT_Q14_ITEMS.map(label => ({ label })); s.q14ItemsZh = AGENT_Q14_ITEMS_ZH.map(label => ({ label }));
                s.q15Items = AGENT_Q15_ITEMS.map(label => ({ label })); s.q15ItemsZh = AGENT_Q15_ITEMS_ZH.map(label => ({ label }));
                s.q17Prompt = 'How do you plan and schedule your main recurring work (e.g., customer visits)? (Multi-select)';
                s.q17PromptZh = '您如何規劃與安排主要的重複性工作（例如客戶拜訪）？（可複選）';
                s.q18Prompt = 'If you chose the paper-based option above, what is the main reason? (Single select; skip if not applicable)';
                s.q18PromptZh = '若您上述選擇紙本方式，主要原因為何？（單選；若不適用請略過）';
                s.q19Prompt = GENERIC_QUESTION_DEFAULTS.q19Prompt; s.q19PromptZh = GENERIC_QUESTION_DEFAULTS.q19PromptZh;
                s.metrics = AGENT_METRICS.map(m => Object.assign({}, m));
                s.q16OptionsZh = ['速度較快', '介面較熟悉', '公司系統沒有此功能', '客戶偏好這樣溝通', '公司系統登入／操作太麻煩', '我很少使用個人工具', '其他'];
                s.q17OptionsZh = ['公司系統', '個人 App（例如 Google 行事曆）', '紙本桌曆／筆記本', '沒有特別規劃', '其他'];
                s.q18Options = ['Action locations are easy to mark', 'Time allocations can be clearly compared, and pages can be flipped back and forth for comparison', 'Free slots can be seen at a glance'];
                s.q18OptionsZh = ['行動地點容易標註', '可清楚比較時間配置，並前後翻閱對照', '空檔一目了然'];
                s.q19Options = ['Extremely willing', 'Open to trying it', 'Depends on the situation', 'Do not want the system to access my calendar'];
                s.q19OptionsZh = ['極度願意', '願意嘗試', '視情況而定', '不希望系統存取我的行事曆'];
                s.q26Options = ['Sales Journey', 'Organisational Development Journey'];
                s.q26OptionsZh = ['銷售歷程', '組織發展歷程'];
            }
            if (k === 'patient') {
                const fill = (f, v) => { if (!s[f]) s[f] = v; };
                fill('q13Options', ['Severely reduces convenience', 'Slightly reduces convenience', 'No noticeable impact', 'Slightly improves convenience', 'Significantly improves convenience']);
                fill('q13OptionsZh', ['大幅降低便利性', '略微降低便利性', '無明顯影響', '略微提升便利性', '大幅提升便利性']);
                fill('q16Options', ['Faster response', 'More familiar interface', 'Hospital system lacks this function', 'Staff prefer communicating this way', 'Hospital app login/operation is too troublesome', 'I rarely use personal tools', 'Other']);
                fill('q16OptionsZh', ['回應較快', '介面較熟悉', '院方系統沒有此功能', '院方人員偏好這樣溝通', '院方 App 登入／操作太麻煩', '我很少使用個人工具', '其他']);
                fill('q17Options', ['Hospital app or health insurance app', 'Personal calendar / phone reminders', 'Paper appointment card or notebook', 'Family member reminds me', 'Do not plan; go when symptoms appear', 'Other']);
                fill('q17OptionsZh', ['醫院 App 或健保 App', '個人行事曆／手機提醒', '紙本掛號單或筆記本', '家人提醒我', '不特別規劃，有症狀才就醫', '其他']);
                fill('q17OptionKinds', ['official', 'own', 'own', 'own', 'skip', 'own']);
                fill('q18Options', ['Easy to write down symptoms and questions by hand', 'Appointment dates are visible at a glance', 'Not limited by phone or network']);
                fill('q18OptionsZh', ['容易手寫記下症狀與問題', '回診日期一目了然', '不受手機與網路限制']);
                fill('q19Options', ['Extremely willing', 'Willing', 'Neutral', 'Low willingness', 'Completely unwilling']);
                fill('q19OptionsZh', ['極度願意', '願意', '普通', '意願低', '完全不願意']);
            }
            seedGenericQuestionDefaults(s);
        });
    });
})();
