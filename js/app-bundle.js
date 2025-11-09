// ERP Tech Stack Comparison - Bundled version for file:// access
// No modules, no server required

(function() {
    'use strict';

    // Store Class
    class Store {
        constructor(initialState = {}) {
            this.state = initialState;
            this.listeners = new Map();
        }
        getState() { return this.state; }
        setState(updates) {
            this.state = { ...this.state, ...updates };
            this.notify(updates);
        }
        subscribe(key, callback) {
            if (!this.listeners.has(key)) this.listeners.set(key, []);
            this.listeners.get(key).push(callback);
            return () => {
                const callbacks = this.listeners.get(key);
                const index = callbacks.indexOf(callback);
                if (index > -1) callbacks.splice(index, 1);
            };
        }
        notify(updates) {
            if (this.listeners.has('*')) {
                this.listeners.get('*').forEach(callback => callback(this.state));
            }
            Object.keys(updates).forEach(key => {
                if (this.listeners.has(key)) {
                    this.listeners.get(key).forEach(callback => callback(updates[key]));
                }
            });
        }
    }

    // Router Class
    class Router {
        constructor(defaultRoute = 'intro') {
            this.defaultRoute = defaultRoute;
            this.routes = new Map();
            this.currentRoute = null; // Important: start as null so first route triggers
            window.addEventListener('hashchange', () => this.handleRouteChange());
            window.addEventListener('load', () => this.handleRouteChange());
        }
        register(path, handler) { this.routes.set(path, handler); }
        navigate(path) { window.location.hash = path; }
        handleRouteChange() {
            const hash = window.location.hash.slice(1) || this.defaultRoute;
            
            // Don't do anything if route hasn't changed
            if (this.currentRoute === hash) {
                return;
            }
            
                this.currentRoute = hash;
            
            // Hide all sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.add('hidden');
                });
            
            // Show the current section (must target .content-section specifically, not tab buttons!)
            const section = document.querySelector(`.content-section[data-tab="${hash}"]`);
            
                if (section) {
                    section.classList.remove('hidden');
                
                // Update active tab
                    document.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.dataset.tab === hash) btn.classList.add('active');
                    });
                
                // Call route handler
                if (this.routes.has(hash)) {
                    this.routes.get(hash)();
                }
                
                    window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    // Initialize Store with default state
    const store = new Store({
        criteria: [
            { id: 'time-to-market', name: 'Time-to-Market', description: 'Speed of initial delivery and iteration velocity', weight: 8, scores: { vanilla: 9, dotnet: 6 } },
            { id: 'dev-productivity', name: 'Developer Productivity & DX', description: 'IDE support, debugging, hot reload, IntelliSense', weight: 7, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'maintainability', name: 'Maintainability & Reuse', description: 'Component patterns, code organization, refactoring ease', weight: 9, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'performance', name: 'Performance', description: 'Load time, interaction responsiveness, large data handling', weight: 8, scores: { vanilla: 9, dotnet: 7 } },
            { id: 'operational-complexity', name: 'Operational Complexity', description: 'Build pipelines, tooling, deployment, DevOps overhead', weight: 6, scores: { vanilla: 10, dotnet: 5 } },
            { id: 'security', name: 'Security & Compliance', description: 'AuthN/AuthZ, RBAC, audit logging, OWASP best practices', weight: 10, scores: { vanilla: 6, dotnet: 9 } },
            { id: 'testing', name: 'Testing & Quality', description: 'Unit testing, integration tests, E2E automation, coverage', weight: 8, scores: { vanilla: 6, dotnet: 9 } },
            { id: 'reporting', name: 'Reporting/Printing/BI', description: 'Export capabilities, print layouts, data visualization', weight: 7, scores: { vanilla: 7, dotnet: 8 } },
            { id: 'scalability', name: 'Scalability', description: 'Team growth, codebase growth, feature expansion', weight: 9, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'hiring', name: 'Hiring/Market Availability', description: 'Talent pool, onboarding time, training requirements', weight: 7, scores: { vanilla: 7, dotnet: 8 } },
            { id: 'tco', name: 'Total Cost of Ownership', description: 'Build, operate, and maintain costs over 3 years', weight: 9, scores: { vanilla: 8, dotnet: 7 } }
        ],
        tcoInputs: { teamSize: 2, blendedRate: 1300, setupMonths: 2, vanillaVelocity: 1.2, dotnetVelocity: 1.0, year1Maintenance: 20, year3Maintenance: 35 },
        risks: [
            { id: 'vanilla-1', approach: 'Vanilla JS', risk: 'Architectural drift without framework guardrails', probability: 'High', impact: 'High', mitigation: 'Establish coding standards, implement code review process, create pattern library', owner: 'Tech Lead' },
            { id: 'vanilla-2', approach: 'Vanilla JS', risk: 'Code duplication and inconsistent patterns', probability: 'Medium', impact: 'Medium', mitigation: 'Create reusable component kernel, enforce DRY principles', owner: 'Development Team' },
            { id: 'vanilla-3', approach: 'Vanilla JS', risk: 'Key-person risk (limited team familiarity)', probability: 'Medium', impact: 'High', mitigation: 'Cross-training, documentation, pair programming', owner: 'Engineering Manager' },
            { id: 'dotnet-1', approach: '.NET + SPA', risk: 'Toolchain complexity and learning curve', probability: 'Medium', impact: 'Medium', mitigation: 'Invest in training, establish CI/CD early, document setup', owner: 'DevOps Team' },
            { id: 'dotnet-2', approach: '.NET + SPA', risk: 'Framework upgrade churn and breaking changes', probability: 'Medium', impact: 'Medium', mitigation: 'Pin versions, gradual upgrades, maintain upgrade runbook', owner: 'Tech Lead' },
            { id: 'dotnet-3', approach: '.NET + SPA', risk: 'Bundle size bloat impacting performance', probability: 'Low', impact: 'Medium', mitigation: 'Code splitting, lazy loading, bundle analysis in CI', owner: 'Frontend Lead' }
        ]
    });

    const router = new Router('intro');

    // ========================================
    // Multi-Language Support System
    // ========================================
    const translations = {
        en: {
            site: {
                title: "ERP Tech Stack Comparison",
                footer: {
                    line1: "© 2025 ERP Tech Stack Comparison Tool. Built with Vanilla JS to prove a point.",
                    line2: "No frameworks. No bundlers. Just standards."
                }
            },
            intro: {
                title: "Executive Summary",
                purposeTitle: "Purpose & Scope",
                purposeText: "This decision tool compares two architectural approaches for building enterprise ERP systems:",
                approachA: "Approach A:",
                approachAText: "Vanilla JavaScript + Web API + HTML only",
                approachB: "Approach B:",
                approachBText: ".NET Core backend + Angular or React frontend",
                purposeFooter: "Use this interactive tool to evaluate trade-offs across 11 key criteria, customize weighting based on your priorities, and generate a recommendation for your leadership team.",
                vanillaWinsTitle: "When Vanilla JS Wins",
                vanillaWins: [
                    "Rapid prototyping and time-critical MVPs",
                    "Teams with strong web fundamentals",
                    "Zero-build deployment pipelines",
                    "Maximum control over every byte",
                    "Internal tools with limited feature scope",
                    "Performance-critical lightweight interfaces"
                ],
                dotnetWinsTitle: "When .NET Core + SPA Wins",
                dotnetWins: [
                    "Large, distributed development teams",
                    "Complex UI with many reusable components",
                    "Need for mature ecosystem (UI libraries, testing, state management)",
                    "Long-term maintenance and team scalability",
                    "Enterprise integration requirements (SSO, RBAC, audit)",
                    "Rich developer tooling and IDE support"
                ]
            },
            criteria: {
                title: "Decision Criteria",
                intro: "We evaluate both approaches across 11 key criteria that matter to enterprise ERP systems. Each criterion can be weighted according to your organization's priorities.",
                items: {
                    "time-to-market": {
                        name: "Time-to-Market",
                        description: "Speed of initial delivery and iteration velocity"
                    },
                    "dev-productivity": {
                        name: "Developer Productivity & DX",
                        description: "IDE support, debugging, hot reload, IntelliSense"
                    },
                    "maintainability": {
                        name: "Maintainability & Reuse",
                        description: "Component patterns, code organization, refactoring ease"
                    },
                    "performance": {
                        name: "Performance",
                        description: "Load time, interaction responsiveness, large data handling"
                    },
                    "operational-complexity": {
                        name: "Operational Complexity",
                        description: "Build pipelines, tooling, deployment, DevOps overhead"
                    },
                    "security": {
                        name: "Security & Compliance",
                        description: "AuthN/AuthZ, RBAC, audit logging, OWASP best practices"
                    },
                    "testing": {
                        name: "Testing & Quality",
                        description: "Unit testing, integration tests, E2E automation, coverage"
                    },
                    "reporting": {
                        name: "Reporting/Printing/BI",
                        description: "Export capabilities, print layouts, data visualization"
                    },
                    "scalability": {
                        name: "Scalability",
                        description: "Team growth, codebase growth, feature expansion"
                    },
                    "hiring": {
                        name: "Hiring/Market Availability",
                        description: "Talent pool, onboarding time, training requirements"
                    },
                    "tco": {
                        name: "Total Cost of Ownership",
                        description: "Build, operate, and maintain costs over 3 years"
                    }
                }
            },
            deepDive: {
                title: "Deep-Dive Comparison",
                intro: "Detailed analysis of each approach across all decision criteria."
            },
            matrix: {
                title: "Interactive Decision Matrix",
                intro: "Adjust weights and scores to match your organization's priorities. Results update in real-time."
            },
            tco: {
                title: "Total Cost of Ownership",
                intro: "Model the financial impact of each approach over 3 years."
            },
            risks: {
                title: "Risk Register",
                intro: "Identify, assess, and plan mitigation strategies for key risks in both approaches."
            },
            hiring: {
                title: "Hiring & Market Availability"
            },
            security: {
                title: "Security & Compliance"
            },
            testing: {
                title: "Testing & Quality"
            },
            vanillaGuide: {
                title: "Making Vanilla JS Practical"
            },
            cursorAi: {
                title: "Cursor AI Performance Comparison",
                intro: "How effectively does Cursor AI assist development in each tech stack? Comprehensive analysis across all AI-assisted development aspects."
            },
            recommendation: {
                title: "Executive Recommendation",
                intro: "Generate a customized recommendation based on your scoring and risk assessment."
            },
            realWorld: {
                title: "🌍 Real-World Examples",
                intro: "Learn about actual ERP systems and major companies using Vanilla JavaScript."
            },
            finalDecision: {
                title: "⚖️ Final Decision",
                intro: "Official mandate for Alruya Bilingual School development standards."
            },
            migration: {
                title: "🔄 Migration to Vanilla JS",
                intro: "Executive mandate and comprehensive action plan for frontend migration."
            },
            tabs: {
                intro: "Overview",
                criteria: "Criteria",
                deepDive: "Deep Dive",
                matrix: "Decision Matrix",
                tco: "TCO Model",
                risks: "Risks",
                hiring: "Hiring",
                security: "Security",
                testing: "Testing",
                vanillaGuide: "Vanilla Guide",
                cursorAi: "Cursor AI",
                realWorld: "Real World",
                recommendation: "Recommendation",
                finalDecision: "Final Decision",
                migration: "Migration Plan"
            },
            common: {
                vanilla: "Vanilla JS",
                dotnet: ".NET + SPA",
                yes: "Yes",
                no: "No",
                high: "High",
                medium: "Medium",
                low: "Low",
                read_more: "Read more",
                close: "Close",
                save: "Save",
                cancel: "Cancel",
                loading: "Loading...",
                score: "Score",
                weight: "Weight",
                total: "Total",
                year: "Year",
                cost: "Cost",
                savings: "Savings",
                advantages: "Advantages",
                disadvantages: "Disadvantages",
                recommendation: "Recommendation",
                summary: "Summary",
                strengths: "Strengths",
                weaknesses: "Weaknesses",
                considerations: "Considerations",
                approach: "Approach",
                winner: "Winner"
            }
        },
        ar: {
            site: {
                title: "مقارنة تقنيات نظام تخطيط موارد المؤسسة",
                footer: {
                    line1: "© 2025 أداة مقارنة التقنيات لنظام تخطيط موارد المؤسسة. تم بناؤها باستخدام Vanilla JS لإثبات الفكرة.",
                    line2: "لا إطارات عمل. لا أدوات تجميع. فقط معايير."
                }
            },
            intro: {
                title: "الملخص التنفيذي",
                purposeTitle: "الغرض والنطاق",
                purposeText: "تقارن هذه الأداة نهجين معماريين لبناء أنظمة تخطيط موارد المؤسسة:",
                approachA: "النهج أ:",
                approachAText: "Vanilla JavaScript + Web API + HTML فقط",
                approachB: "النهج ب:",
                approachBText: ".NET Core في الخلفية + Angular أو React في الواجهة",
                purposeFooter: "استخدم هذه الأداة التفاعلية لتقييم المفاضلات عبر 11 معياراً رئيسياً، وتخصيص الأوزان بناءً على أولوياتك، وإنشاء توصية لفريق القيادة.",
                vanillaWinsTitle: "متى تفوز Vanilla JS",
                vanillaWins: [
                    "النماذج الأولية السريعة والمشاريع ذات الوقت الحرج",
                    "الفرق ذات الأساسيات القوية في تطوير الويب",
                    "خطوط النشر بدون بناء",
                    "السيطرة القصوى على كل بايت",
                    "الأدوات الداخلية ذات النطاق المحدود",
                    "الواجهات الخفيفة ذات الأداء الحرج"
                ],
                dotnetWinsTitle: "متى تفوز .NET Core + SPA",
                dotnetWins: [
                    "الفرق التطويرية الكبيرة والموزعة",
                    "واجهة المستخدم المعقدة مع العديد من المكونات القابلة لإعادة الاستخدام",
                    "الحاجة إلى نظام بيئي ناضج (مكتبات واجهة المستخدم، الاختبار، إدارة الحالة)",
                    "الصيانة طويلة الأجل وقابلية توسع الفريق",
                    "متطلبات التكامل المؤسسي (SSO، RBAC، التدقيق)",
                    "أدوات التطوير الغنية ودعم بيئة التطوير المتكاملة"
                ]
            },
            criteria: {
                title: "معايير القرار",
                intro: "نقوم بتقييم كلا النهجين عبر 11 معياراً رئيسياً مهماً لأنظمة تخطيط موارد المؤسسة. يمكن ترجيح كل معيار وفقاً لأولويات مؤسستك.",
                items: {
                    "time-to-market": {
                        name: "سرعة الوصول للسوق",
                        description: "سرعة التسليم الأولي وسرعة التكرار"
                    },
                    "dev-productivity": {
                        name: "إنتاجية المطورين وتجربة التطوير",
                        description: "دعم بيئة التطوير، التصحيح، إعادة التحميل السريع، الإكمال التلقائي"
                    },
                    "maintainability": {
                        name: "القابلية للصيانة وإعادة الاستخدام",
                        description: "أنماط المكونات، تنظيم الكود، سهولة إعادة الهيكلة"
                    },
                    "performance": {
                        name: "الأداء",
                        description: "وقت التحميل، استجابة التفاعل، معالجة البيانات الكبيرة"
                    },
                    "operational-complexity": {
                        name: "التعقيد التشغيلي",
                        description: "خطوط البناء، الأدوات، النشر، عبء DevOps"
                    },
                    "security": {
                        name: "الأمان والامتثال",
                        description: "المصادقة/التفويض، RBAC، سجلات التدقيق، أفضل ممارسات OWASP"
                    },
                    "testing": {
                        name: "الاختبار والجودة",
                        description: "اختبار الوحدات، اختبارات التكامل، الأتمتة الشاملة، التغطية"
                    },
                    "reporting": {
                        name: "التقارير/الطباعة/ذكاء الأعمال",
                        description: "قدرات التصدير، تخطيطات الطباعة، تصور البيانات"
                    },
                    "scalability": {
                        name: "قابلية التوسع",
                        description: "نمو الفريق، نمو قاعدة الكود، توسيع الميزات"
                    },
                    "hiring": {
                        name: "التوظيف/توفر السوق",
                        description: "مجموعة المواهب، وقت الإعداد، متطلبات التدريب"
                    },
                    "tco": {
                        name: "إجمالي تكلفة الملكية",
                        description: "تكاليف البناء والتشغيل والصيانة على مدى 3 سنوات"
                    }
                }
            },
            deepDive: {
                title: "مقارنة معمقة",
                intro: "تحليل تفصيلي لكل نهج عبر جميع معايير القرار."
            },
            matrix: {
                title: "مصفوفة القرار التفاعلية",
                intro: "اضبط الأوزان والدرجات لتتناسب مع أولويات مؤسستك. تُحدّث النتائج في الوقت الفعلي."
            },
            tco: {
                title: "إجمالي تكلفة الملكية",
                intro: "احسب التأثير المالي لكل نهج على مدى 3 سنوات."
            },
            risks: {
                title: "سجل المخاطر",
                intro: "حدد وقيّم وخطط لاستراتيجيات التخفيف من المخاطر الرئيسية في كلا النهجين."
            },
            hiring: {
                title: "التوظيف وتوفر السوق"
            },
            security: {
                title: "الأمان والامتثال"
            },
            testing: {
                title: "الاختبار والجودة"
            },
            vanillaGuide: {
                title: "جعل Vanilla JS عملية"
            },
            cursorAi: {
                title: "مقارنة أداء Cursor AI",
                intro: "ما مدى فعالية مساعدة Cursor AI للتطوير في كل مجموعة تقنية؟ تحليل شامل عبر جميع جوانب التطوير بمساعدة الذكاء الاصطناعي."
            },
            recommendation: {
                title: "التوصية التنفيذية",
                intro: "أنشئ توصية مخصصة بناءً على تقييمك وتحليل المخاطر."
            },
            realWorld: {
                title: "🌍 أمثلة واقعية",
                intro: "تعرّف على أنظمة تخطيط موارد المؤسسة الفعلية والشركات الكبرى التي تستخدم Vanilla JavaScript."
            },
            finalDecision: {
                title: "⚖️ القرار النهائي",
                intro: "التوجيه الرسمي لمعايير التطوير في مؤسسة الرؤيا التعليمية."
            },
            migration: {
                title: "🔄 الانتقال إلى Vanilla JS",
                intro: "التوجيه التنفيذي وخطة العمل الشاملة للانتقال إلى الواجهة الأمامية."
            },
            tabs: {
                intro: "نظرة عامة",
                criteria: "المعايير",
                deepDive: "تحليل معمق",
                matrix: "مصفوفة القرار",
                tco: "نموذج التكلفة الإجمالية",
                risks: "المخاطر",
                hiring: "التوظيف",
                security: "الأمن",
                testing: "الاختبار",
                vanillaGuide: "دليل Vanilla",
                cursorAi: "Cursor AI",
                realWorld: "أمثلة واقعية",
                recommendation: "التوصية",
                finalDecision: "القرار النهائي",
                migration: "خطة الترحيل"
            },
            common: {
                vanilla: "Vanilla JS",
                dotnet: ".NET + SPA",
                yes: "نعم",
                no: "لا",
                high: "عالي",
                medium: "متوسط",
                low: "منخفض",
                read_more: "اقرأ المزيد",
                close: "إغلاق",
                save: "حفظ",
                cancel: "إلغاء",
                loading: "جاري التحميل...",
                score: "النتيجة",
                weight: "الوزن",
                total: "الإجمالي",
                year: "السنة",
                cost: "التكلفة",
                savings: "التوفير",
                advantages: "المزايا",
                disadvantages: "العيوب",
                recommendation: "التوصية",
                summary: "الملخص",
                strengths: "نقاط القوة",
                weaknesses: "نقاط الضعف",
                considerations: "اعتبارات",
                approach: "النهج",
                winner: "الفائز"
            }
        }
    };

    // Current language state
    let currentLang = localStorage.getItem('preferred-language') || 'en';

    // Translation function
    function t(key) {
        const keys = key.split('.');
        let value = translations[currentLang];
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }
        return value || key;
    }

    // Switch language function
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Update HTML dir and lang attributes
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
        
        // Update language switcher button
        const langText = document.getElementById('current-lang');
        if (langText) {
            langText.textContent = lang === 'en' ? 'EN' : 'عربي';
        }
        
        // Update page title
        document.title = t('site.title');
        
        // Update site title in header
        const headerTitle = document.querySelector('.brand h1');
        if (headerTitle) {
            headerTitle.textContent = t('site.title');
        }
        
        // Update footer
        const footerLines = document.querySelectorAll('.site-footer p');
        if (footerLines.length >= 2) {
            footerLines[0].textContent = t('site.footer.line1');
            footerLines[1].textContent = t('site.footer.line2');
        }
        
        // Translate all elements with data-i18n attribute
        translatePage();
        
        // Re-render all tabs
        initTabs();
        
        // Force re-render of current page by clearing initialized flags and content
        const containerIds = [
            'kpi-cards-container',
            'deep-dive-content',
            'decision-matrix-container',
            'tco-container',
            'risk-register-container',
            'hiring-content',
            'security-content',
            'testing-content',
            'vanilla-guide-content',
            'cursor-preference-content',
            'recommendation-container',
            'real-world-container',
            'tools-conversion-container',
            'final-decision-container',
            'migration-container'
        ];
        
        containerIds.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                delete container.dataset.initialized;
                container.innerHTML = '';
            }
        });
        
        // Force re-render by temporarily clearing current route
        const previousRoute = router.currentRoute;
        router.currentRoute = null;
        
        // Re-render current page
        router.handleRouteChange();
    }

    // Translate all elements with data-i18n attributes
    function translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
    }

    // Initialize language on load
    function initLanguage() {
        // Set initial direction
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
        
        // Translate page elements
        translatePage();
        
        // Update page title and header title
        document.title = t('site.title');
        const headerTitle = document.querySelector('.brand h1');
        if (headerTitle) {
            headerTitle.textContent = t('site.title');
        }
        
        // Set up language switcher
        const langSwitcher = document.getElementById('lang-switcher');
        const langText = document.getElementById('current-lang');
        
        if (langSwitcher) {
            langText.textContent = currentLang === 'en' ? 'EN' : 'عربي';
            
            langSwitcher.addEventListener('click', () => {
                const newLang = currentLang === 'en' ? 'ar' : 'en';
                switchLanguage(newLang);
            });
        }
    }

    // Helper functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function formatNumber(num) {
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Tab definitions
    const tabs = [
        { id: 'intro', labelKey: 'tabs.intro', icon: '📋' },
        { id: 'criteria', labelKey: 'tabs.criteria', icon: '🎯' },
        { id: 'deep-dive', labelKey: 'tabs.deepDive', icon: '🔍' },
        { id: 'matrix', labelKey: 'tabs.matrix', icon: '📊' },
        { id: 'tco', labelKey: 'tabs.tco', icon: '💰' },
        { id: 'risks', labelKey: 'tabs.risks', icon: '⚠️' },
        { id: 'hiring', labelKey: 'tabs.hiring', icon: '👥' },
        { id: 'security', labelKey: 'tabs.security', icon: '🔒' },
        { id: 'testing', labelKey: 'tabs.testing', icon: '✅' },
        { id: 'how-vanilla', labelKey: 'tabs.vanillaGuide', icon: '🛠️' },
        { id: 'cursor-preference', labelKey: 'tabs.cursorAi', icon: '🤖' },
        { id: 'real-world', labelKey: 'tabs.realWorld', icon: '🌍' },
        { id: 'recommendation', labelKey: 'tabs.recommendation', icon: '📝' },
        { id: 'final-decision', labelKey: 'tabs.finalDecision', icon: '⚖️' },
        { id: 'migration', labelKey: 'tabs.migration', icon: '🔄' }
    ];

    // Init Tabs
    function initTabs() {
        const container = document.getElementById('tabs-container');
        if (!container) return;
        const tabsNav = document.createElement('div');
        tabsNav.className = 'tabs';
        tabsNav.setAttribute('role', 'tablist');
        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.dataset.tab = tab.id;
            button.setAttribute('role', 'tab');
            button.textContent = `${tab.icon} ${t(tab.labelKey)}`;
            button.addEventListener('click', () => window.location.hash = tab.id);
            button.addEventListener('keydown', (e) => {
                const buttons = Array.from(tabsNav.querySelectorAll('.tab-button'));
                const currentIndex = buttons.indexOf(button);
                let targetButton = null;
                if (e.key === 'ArrowLeft') { e.preventDefault(); targetButton = buttons[currentIndex - 1] || buttons[buttons.length - 1]; }
                if (e.key === 'ArrowRight') { e.preventDefault(); targetButton = buttons[currentIndex + 1] || buttons[0]; }
                if (e.key === 'Home') { e.preventDefault(); targetButton = buttons[0]; }
                if (e.key === 'End') { e.preventDefault(); targetButton = buttons[buttons.length - 1]; }
                if (targetButton) { targetButton.focus(); targetButton.click(); }
            });
            tabsNav.appendChild(button);
        });
        container.innerHTML = '';
        container.appendChild(tabsNav);
    }

    // KPI Cards
    function renderKPICards(container) {
        const criteria = store.getState().criteria;
        const grid = document.createElement('div');
        grid.className = 'kpi-grid';
        criteria.forEach(criterion => {
            const card = document.createElement('div');
            card.className = 'kpi-card';
            
            // Get translated name and description
            const translatedName = t(`criteria.items.${criterion.id}.name`) || criterion.name;
            const translatedDesc = t(`criteria.items.${criterion.id}.description`) || criterion.description;
            
            card.innerHTML = `<h3>${translatedName}</h3><p>${translatedDesc}</p>`;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    }

    // Get Deep Dive Data with translations
    function getDeepDiveData() {
        if (currentLang === 'ar') {
            return [
                {
                    title: '⚡ سرعة الوصول للسوق وسرعة التطوير',
                    vanilla: {
                        score: '9/10',
                        strengths: [
                            '✅ لا حاجة لإعداد البناء - ابدأ البرمجة خلال ثوانٍ',
                            '✅ بدون تأخيرات التحويل البرمجي أثناء التطوير',
                            '✅ إعادة التحميل الفورية بمجرد تحديث المتصفح (F5)',
                            '✅ اعتماديات قليلة = تثبيت npm أسرع (أقل من 10 ثوانٍ)',
                            '✅ بدون webpack أو babel أو سلسلة أدوات للإعداد',
                            '✅ تصحيح مباشر في المتصفح باستخدام DevTools الأصلية',
                            '✅ Cursor AI يولد كوداً يعمل فوراً بدون تجميع'
                        ],
                        weaknesses: [
                            '❌ الحاجة لإنشاء أنماط المكونات من الصفر',
                            '❌ عدم وجود مكتبات مكونات واجهة جاهزة (material-ui، ant-design)',
                            '❌ مطلوب تنفيذ إدارة الحالة يدوياً',
                            '❌ أبطأ للواجهات المعقدة ذات المكونات القابلة لإعادة الاستخدام',
                            '❌ ميزة السرعة الأولية تتناقص عند المستوى المؤسسي'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز',
                            reasons: [
                                '🤖 Cursor يولد JS بسيطاً فوراً - بدون تأخيرات فحص الأنواع',
                                '🤖 كود أبسط = رموز أقل = استجابات أسرع',
                                '🤖 سياق أقل مطلوب (لا حاجة لنموذج إطار العمل)',
                                '🤖 معالجة DOM المباشرة واضحة للذكاء الاصطناعي',
                                '🤖 Cursor Agent/Composer يمكنه بناء مكونات كاملة دفعة واحدة'
                            ]
                        },
                        realWorld: 'الأفضل لـ: نماذج MVP، أدوات داخلية، نماذج أولية حساسة للوقت، إثباتات المفهوم حيث السرعة أهم من قابلية التوسع طويلة الأجل'
                    },
                    dotnet: {
                        score: '6/10',
                        strengths: [
                            '✅ أدوات CLI غنية (dotnet new، scaffolding، مولدات)',
                            '✅ مكتبات مكونات جاهزة (Material، PrimeNG، Ant Design)',
                            '✅ استبدال الوحدات الساخنة (HMR) للتحديثات الفورية',
                            '✅ قوالب مشاريع شاملة ونماذج جاهزة',
                            '✅ تكامل قوي مع بيئة التطوير (IntelliSense، الاستيراد التلقائي)',
                            '✅ اتفاقيات إطار العمل تسرع التطوير بعد منحنى التعلم'
                        ],
                        weaknesses: [
                            '❌ الإعداد الأولي: 5-15 دقيقة لمشروع جديد',
                            '❌ npm install يمكن أن يستغرق 2-5 دقائق',
                            '❌ وقت البناء: 10-60 ثانية حسب حجم المشروع',
                            '❌ منحنى تعلم حاد (TypeScript + إطار العمل + .NET)',
                            '❌ تعقيد إعداد Webpack/bundler',
                            '❌ المزيد من الاعتماديات = المزيد من التغييرات الكاسرة المحتملة'
                        ],
                        cursorAI: {
                            performance: '🟡 جيد (مع تحفظات)',
                            reasons: [
                                '🤖 Cursor يتعامل مع TypeScript جيداً لكن أبطأ من JS',
                                '🤖 نموذج إطار العمل يتطلب سياقاً أكثر',
                                '🤖 يحتاج تحديد أنماط Angular/React بشكل صريح',
                                '🤖 تعريفات الأنواع تساعد Cursor على فهم الكود بشكل أفضل',
                                '🤖 رموز أكثر مطلوبة = توليد أبطأ قليلاً',
                                '🤖 رائع لإعادة الهيكلة مع أمان الأنواع'
                            ]
                        },
                        realWorld: 'الأفضل لـ: مشاريع طويلة الأجل، فرق كبيرة، واجهات معقدة بمكونات متعددة قابلة لإعادة الاستخدام، عندما يكون لديك وقت للإعداد المناسب'
                    }
                },
                {
                    title: '👨‍💻 تجربة المطور والإنتاجية',
                    vanilla: {
                        score: '5/10',
                        strengths: [
                            '✅ تحكم مباشر - بدون "سحر" أو سلوك مخفي',
                            '✅ تصحيح بسيط باستخدام DevTools المتصفح',
                            '✅ بدون أخطاء بناء لاستكشافها',
                            '✅ تكرار سريع: تحرير ← تحديث ← رؤية النتائج',
                            '✅ بيئة تطوير خفيفة (بدون انتفاخ node_modules)',
                            '✅ فهم كامل لما يفعله الكود'
                        ],
                        weaknesses: [
                            '❌ بدون IntelliSense بدون JSDoc أو TypeScript',
                            '❌ أخطاء وقت التشغيل بدلاً من الكشف وقت التجميع',
                            '❌ الفحص اليدوي للأنواع عرضة للأخطاء',
                            '❌ بدون استيراد تلقائي للوحدات',
                            '❌ أدوات إعادة هيكلة محدودة',
                            '❌ بدون استبدال الوحدات الساخنة (تحديث يدوي)',
                            '❌ يجب تتبع حالة المكون يدوياً'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز للبرمجة بمساعدة الذكاء الاصطناعي',
                            reasons: [
                                '🤖 Cursor Agent يعمل أسرع مع vanilla JS',
                                '🤖 يمكنه بناء ميزات كاملة بأمر واحد',
                                '🤖 حمل معرفي أقل = اقتراحات ذكاء اصطناعي أفضل',
                                '🤖 تعليقات JSDoc تعطي Cursor سياقاً كافياً',
                                '🤖 Cursor Composer يمكنه إعادة كتابة المكونات بسهولة',
                                '🤖 الذكاء الاصطناعي يعوض عن نقص IntelliSense'
                            ],
                            tips: [
                                '💡 استخدم JSDoc لاقتراحات ذكاء اصطناعي أفضل: @param، @returns',
                                '💡 اطلب من Cursor إضافة تعليقات شاملة',
                                '💡 استخدم Cursor Rules لفرض أنماط البرمجة',
                                '💡 دع الذكاء الاصطناعي يتعامل مع معالجة DOM المتكررة'
                            ]
                        },
                        realWorld: 'تجربة المطور تتحسن بشكل كبير مع Cursor AI - الذكاء الاصطناعي يملأ الفجوات الناتجة عن عدم وجود TypeScript/إطار العمل'
                    },
                    dotnet: {
                        score: '9/10',
                        strengths: [
                            '✅ IntelliSense ممتاز مع TypeScript',
                            '✅ الكشف عن الأخطاء وقت التجميع يمنع الأخطاء',
                            '✅ أدوات إعادة هيكلة متقدمة (إعادة تسمية، استخراج، نقل)',
                            '✅ الاستيراد التلقائي وإكمال المسارات',
                            '✅ تصحيح غني مع خرائط المصدر',
                            '✅ استبدال الوحدات الساخنة (HMR) للتحديثات الفورية',
                            '✅ أدوات المطور للمكونات (إضافات Angular/React)',
                            '✅ أدوات اختبار مدمجة'
                        ],
                        weaknesses: [
                            '❌ أوقات البناء تبطئ التكرار (10-60 ثانية)',
                            '❌ رسائل خطأ معقدة من webpack/bundlers',
                            '❌ أخطاء TypeScript يمكن أن تكون غامضة',
                            '❌ المزيد من الاعتماديات = المزيد من الأشياء للتعلم',
                            '❌ تحديثات إطار العمل تتطلب جهد ترحيل'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز للمشاريع المعقدة',
                            reasons: [
                                '🤖 TypeScript يساعد Cursor على فهم الأنواع',
                                '🤖 أفضل لعمليات إعادة الهيكلة الكبيرة',
                                '🤖 Cursor يمكنه التنقل في قواعد الكود المعقدة بسهولة',
                                '🤖 تعريفات الأنواع توفر سياقاً غنياً',
                                '🤖 أنماط إطار العمل توجه اقتراحات الذكاء الاصطناعي'
                            ],
                            tips: [
                                '💡 استخدم Cursor لإنشاء واجهات TypeScript',
                                '💡 دع الذكاء الاصطناعي يكتب اختبارات الوحدة مع Testing Library',
                                '💡 اطلب من Cursor إعادة الهيكلة مع أمان الأنواع',
                                '💡 استخدم الذكاء الاصطناعي لشرح أنماط إطار العمل المعقدة'
                            ]
                        },
                        realWorld: 'أفضل تجربة مطور للفرق الكبيرة والمشاريع طويلة الأجل. TypeScript + Cursor = مزيج قوي للصيانة'
                    }
                },
                {
                    title: '🏗️ القابلية للصيانة، جودة الكود والبنية المعمارية',
                    vanilla: {
                        score: '5/10 (بدون انضباط) | 8/10 (مع أنماط)',
                        strengths: [
                            '✅ لا قيود على إطار عمل - الكود مقاوم للمستقبل',
                            '✅ تحكم كامل في قرارات البنية المعمارية',
                            '✅ بدون دورات ترقية الاعتماديات',
                            '✅ سهل الفهم - بدون "سحر"',
                            '✅ قابل للنقل بين المشاريع',
                            '✅ الحد الأدنى من الديون التقنية من الاعتماديات'
                        ],
                        weaknesses: [
                            '❌ سهل إنشاء "كود سباغيتي" بدون انضباط',
                            '❌ عدم فرض فصل الاهتمامات',
                            '❌ إعادة استخدام المكونات تتطلب تجريد يدوي',
                            '❌ انحراف معماري بدون قيادة قوية',
                            '❌ كل مطور قد يستخدم أنماط مختلفة',
                            '❌ أصعب في إعداد مطورين جدد بدون اتفاقيات'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز (مع Cursor AI، تتحسن الصيانة بشكل كبير)',
                            reasons: [
                                '🤖 استخدم Cursor Rules (.cursorrules) لفرض الأنماط تلقائياً',
                                '🤖 الذكاء الاصطناعي يمكنه إعادة هيكلة الكود غير المتسق فوراً',
                                '🤖 Cursor ينشئ قوالب مكونات متسقة',
                                '🤖 الذكاء الاصطناعي يضمن الاتساق عبر قاعدة الكود بالكامل',
                                '🤖 Cursor ينفذ أفضل الممارسات تلقائياً مع التوجيه الصحيح',
                                '🤖 AI يعوض عن عدم وجود اتفاقيات إطار العمل'
                            ],
                            tips: [
                                '💡 أنشئ ملف .cursorrules مفصل مع جميع أنماطك',
                                '💡 استخدم الذكاء الاصطناعي لفرض مبادئ DRY تلقائياً',
                                '💡 دع Cursor ينشئ فئات أساسية ومكونات قابلة لإعادة الاستخدام',
                                '💡 اطلب من الذكاء الاصطناعي مراجعة الكود للأنماط المضادة',
                                '💡 Cursor AI = انضباط معماري مدمج'
                            ]
                        },
                        bestPractices: [
                            '📋 ضع وثيقة معايير البرمجة مبكراً',
                            '📋 أنشئ أنماط مكونات قابلة لإعادة الاستخدام (Router، Store، BaseComponent)',
                            '📋 نفذ عملية مراجعة كود إلزامية',
                            '📋 استخدم ESLint مع قواعد صارمة',
                            '📋 وثّق قرارات البنية المعمارية (ADRs)',
                            '📋 أنشئ مكتبة مكونات/دليل أسلوب'
                        ],
                        realWorld: 'يتطلب قيادة تقنية قوية. يعمل جيداً للفرق الصغيرة-المتوسطة (3-10 مطورين) مع إشراف كبار'
                    },
                    dotnet: {
                        score: '9/10',
                        strengths: [
                            '✅ إطار العمل يفرض فصل الاهتمامات',
                            '✅ نموذج مكونات مدمج يعزز إعادة الاستخدام',
                            '✅ اتفاقيات قوية وأفضل الممارسات',
                            '✅ نظام بيئي غني بمكونات واجهة قابلة لإعادة الاستخدام',
                            '✅ حقن الاعتماديات مدمج',
                            '✅ هيكل مشروع واضح (وحدات، خدمات، مكونات)',
                            '✅ TypeScript يمنع العديد من أخطاء وقت التشغيل',
                            '✅ أسهل في إعداد مطورين جدد'
                        ],
                        weaknesses: [
                            '❌ ترقيات إطار العمل قد تتطلب إعادة هيكلة',
                            '❌ قيود على نظام React/Angular البيئي',
                            '❌ الإفراط في التجريد يمكن أن يقلل وضوح الكود',
                            '❌ تغييرات كاسرة في الإصدارات الرئيسية',
                            '❌ يجب البقاء محدثاً مع أفضل ممارسات إطار العمل'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز',
                            reasons: [
                                '🤖 أنماط إطار العمل توجه توليد الذكاء الاصطناعي',
                                '🤖 TypeScript يساعد Cursor في اكتشاف الأخطاء',
                                '🤖 أفضل لإعادة الهيكلة واسعة النطاق',
                                '🤖 الذكاء الاصطناعي يفهم اتفاقيات إطار العمل',
                                '🤖 يمكنه إنشاء اختبارات تتبع أنماط إطار العمل'
                            ]
                        },
                        bestPractices: [
                            '📋 اتبع دليل الأسلوب الرسمي (Angular/React)',
                            '📋 استخدم إدارة الحالة (NgRx، Redux، Zustand)',
                            '📋 نفذ وحدات الميزات للتنظيم',
                            '📋 أنشئ مكتبة مكونات مشتركة',
                            '📋 وثّق المكونات مع Storybook',
                            '📋 فرّض وضع TypeScript الصارم'
                        ],
                        realWorld: 'الأفضل للفرق الكبيرة (10+)، التطوير الموزع، المشاريع طويلة الأجل (3+ سنوات)'
                    }
                },
                {
                    title: '⚡ الأداء وحجم الحزمة',
                    vanilla: {
                        score: '10/10',
                        strengths: [
                            '✅ حمولة صغيرة: 5-30KB إجمالي JavaScript',
                            '✅ بدون عبء إطار عمل (React = ~40KB، Angular = ~100KB مضغوط)',
                            '✅ معالجة DOM المباشرة هي الأسرع',
                            '✅ بدون تكلفة مطابقة DOM الافتراضي',
                            '✅ تحكم كامل في التحميل الكسول',
                            '✅ درجات Lighthouse ممتازة (95-100) افتراضياً',
                            '✅ First Contentful Paint (FCP) < 0.5 ثانية',
                            '✅ Time to Interactive (TTI) < 1 ثانية'
                        ],
                        weaknesses: [
                            '❌ تحسين يدوي للقوائم الكبيرة (التمرير الافتراضي)',
                            '❌ سهل إنشاء تسريبات ذاكرة بدون تنظيف',
                            '❌ يجب تحسين إعادة العرض يدوياً',
                            '❌ بدون كشف تغيير تلقائي'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز',
                            reasons: [
                                '🤖 اطلب من Cursor تنفيذ التمرير الافتراضي',
                                '🤖 الذكاء الاصطناعي يمكنه إضافة تنظيف مناسب لمستمعي الأحداث',
                                '🤖 Cursor ينشئ تحديثات DOM محسنة',
                                '🤖 كود بسيط = ضبط أداء أسهل'
                            ]
                        },
                        metrics: {
                            bundleSize: '5-30KB (مقابل 100-200KB لإطار العمل)',
                            loadTime: '< 500ms تحميل أول',
                            fcp: '< 0.5 ثانية',
                            tti: '< 1 ثانية',
                            lighthouse: '95-100 على جميع المقاييس'
                        },
                        realWorld: 'مثالي لـ: تطبيقات حساسة للأداء، موجهة للجوال، مستخدمين ذوي نطاق ترددي منخفض، الأسواق الناشئة'
                    },
                    dotnet: {
                        score: '7/10',
                        strengths: [
                            '✅ DOM الافتراضي يحسن العديد من التحديثات بكفاءة',
                            '✅ تحسينات أداء على مستوى إطار العمل',
                            '✅ كشف التغيير OnPush (Angular)',
                            '✅ React.memo و useMemo للتحسين',
                            '✅ تقسيم الكود المدمج والتحميل الكسول',
                            '✅ Tree shaking يزيل الكود غير المستخدم',
                            '✅ بناءات الإنتاج محسنة'
                        ],
                        weaknesses: [
                            '❌ حزمة إطار العمل: 100-200KB مضغوط',
                            '❌ عبء DOM الافتراضي للواجهات البسيطة',
                            '❌ وقت تحميل أولي أبطأ (2-3 ثوانٍ على 3G)',
                            '❌ المزيد من JavaScript للتحليل/التنفيذ',
                            '❌ يتطلب إعداد bundler للتحسين'
                        ],
                        cursorAI: {
                            performance: '🟢 جيد',
                            reasons: [
                                '🤖 Cursor يمكنه إعداد تقسيم الكود',
                                '🤖 الذكاء الاصطناعي يقترح تحسينات React.memo',
                                '🤖 يمكنه تحليل حجم الحزمة واقتراح تحسينات',
                                '🤖 يساعد في تنفيذ التحميل الكسول بشكل صحيح'
                            ]
                        },
                        metrics: {
                            bundleSize: '100-300KB (إطار العمل + التطبيق)',
                            loadTime: '1-3 ثوانٍ تحميل أول',
                            fcp: '1-2 ثانية',
                            tti: '2-4 ثوانٍ',
                            lighthouse: '70-90 (يتطلب تحسين)'
                        },
                        realWorld: 'الأداء جيد لكن يتطلب جهد تحسين. الأفضل للأدوات الداخلية حيث وقت التحميل أقل أهمية'
                    }
                },
                {
                    title: '🔒 الأمان والامتثال',
                    vanilla: {
                        score: '6/10 (يتطلب خبرة)',
                        strengths: [
                            '✅ سطح هجوم أصغر - اعتماديات أقل',
                            '✅ بدون ثغرات إطار عمل مخفية',
                            '✅ تحكم مباشر في سياسات CSP',
                            '✅ تنفيذ أمان صريح',
                            '✅ بدون مخاطر سلسلة التوريد من نظام إطار العمل البيئي'
                        ],
                        weaknesses: [
                            '❌ حماية CSRF/XSS يدوية مطلوبة',
                            '❌ بدون أنماط مصادقة مدمجة',
                            '❌ الأمان مسؤولية المطور',
                            '❌ يجب تنفيذ RBAC يدوياً',
                            '❌ سهل ارتكاب أخطاء أمنية',
                            '❌ بدون تعقيم على مستوى إطار العمل'
                        ],
                        cursorAI: {
                            performance: '🟡 يتطلب توجيه دقيق',
                            reasons: [
                                '🤖 الذكاء الاصطناعي قد لا يضيف إجراءات أمنية افتراضياً',
                                '🤖 يجب طلب تعقيم الإدخال صراحة',
                                '🤖 Cursor يمكنه تنفيذ رؤوس CSP',
                                '🤖 يحتاج توجيه لامتثال OWASP',
                                '⚠️ خطر: الذكاء الاصطناعي قد ينشئ كوداً غير آمن بدون توجيه'
                            ],
                            tips: [
                                '💡 اطلب دائماً: "اجعل هذا آمناً ضد XSS"',
                                '💡 وجّه: "أضف رمز CSRF لجميع النماذج"',
                                '💡 اطلب: "عقّم جميع مدخلات المستخدم"',
                                '💡 حدد: "استخدم textContent وليس innerHTML"'
                            ]
                        },
                        implementation: [
                            '🔐 استخدم ملفات تعريف ارتباط HTTPOnly للرموز',
                            '🔐 نفذ رؤوس CSP صارمة',
                            '🔐 عقّم جميع مدخلات المستخدم قبل العرض',
                            '🔐 استخدم textContent بدلاً من innerHTML',
                            '🔐 تكامل مع ASP.NET Core Identity في الخلفية',
                            '🔐 نفذ أنماط سجل التدقيق',
                            '🔐 عمليات تدقيق أمنية منتظمة'
                        ],
                        realWorld: 'يتطلب مطورين واعين بالأمان. غير موصى به للتطبيقات عالية الأمان بدون مراجعة خبير'
                    },
                    dotnet: {
                        score: '9/10',
                        strengths: [
                            '✅ ASP.NET Core Identity للمصادقة/التفويض',
                            '✅ حماية CSRF مدمجة',
                            '✅ تخفيفات XSS على مستوى إطار العمل',
                            '✅ تفويض قائم على السياسات',
                            '✅ مكتبات سجل تدقيق شاملة',
                            '✅ إرشادات امتثال OWASP',
                            '✅ تعقيم إدخال تلقائي',
                            '✅ تحديثات أمنية من Microsoft/المجتمع'
                        ],
                        weaknesses: [
                            '❌ ثغرات إطار العمل تتطلب تحديثات',
                            '❌ أشجار اعتماديات معقدة للتدقيق',
                            '❌ يجب البقاء محدثاً مع التصحيحات الأمنية',
                            '❌ مخاطر مكتبات طرف ثالث (نظام npm البيئي)'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز',
                            reasons: [
                                '🤖 أنماط إطار العمل تتضمن الأمان افتراضياً',
                                '🤖 Cursor ينشئ كوداً آمناً يتبع إطار العمل',
                                '🤖 الذكاء الاصطناعي يفهم أنماط ASP.NET Identity',
                                '🤖 TypeScript يساعد في منع هجمات الحقن',
                                '🤖 يمكنه إنشاء تفويض قائم على الأدوار'
                            ]
                        },
                        implementation: [
                            '🔐 استخدم ASP.NET Core Identity مع JWT',
                            '🔐 نفذ تفويض قائم على الأدوار والمطالبات',
                            '🔐 فعّل CORS بشكل صحيح',
                            '🔐 استخدم HttpClient مع رموز CSRF',
                            '🔐 npm audit والمسح المنتظم للثغرات',
                            '🔐 نفذ سياسة أمان المحتوى',
                            '🔐 استخدم HTTPS في كل مكان'
                        ],
                        realWorld: 'الأفضل للمؤسسات، الرعاية الصحية، المالية، الحكومة - القطاعات التي تتطلب أماناً عالياً'
                    }
                },
                {
                    title: '🧪 الاختبار، ضمان الجودة والتصحيح',
                    vanilla: {
                        score: '6/10',
                        strengths: [
                            '✅ اختبار DOM بسيط بدون محاكيات إطار عمل',
                            '✅ اختبار وحدة مباشر للدوال',
                            '✅ تنفيذ اختبار سريع',
                            '✅ بدون إعداد بناء خاص بالاختبار',
                            '✅ اختبارات E2E واضحة مع Playwright/Cypress',
                            '✅ تصحيح بسيط في متصفح حقيقي'
                        ],
                        weaknesses: [
                            '❌ بدون إطار اختبار موحد',
                            '❌ محاكاة DOM يدوية لاختبارات الوحدة',
                            '❌ بدون أدوات اختبار مكونات مدمجة',
                            '❌ تتبع تغطية يدوي',
                            '❌ أصعب في اختبار الحالة والمنطق المعقد',
                            '❌ بدون اختبار لقطة مدمج'
                        ],
                        cursorAI: {
                            performance: '🟡 جيد (يحتاج توجيه)',
                            reasons: [
                                '🤖 Cursor يمكنه كتابة اختبارات Vitest/Jest',
                                '🤖 الذكاء الاصطناعي يولد اختبارات E2E مع Playwright',
                                '🤖 يحتاج توجيه صريح لتغطية الاختبار',
                                '🤖 أفضل في اختبارات الوحدة البسيطة'
                            ],
                            tips: [
                                '💡 اطلب: "اكتب اختبارات وحدة لهذه الدالة"',
                                '💡 حدد: "أنشئ اختبار E2E لتدفق تسجيل الدخول"',
                                '💡 وجّه: "أضف اختبارات لجميع الحالات الحدية"',
                                '💡 استخدم: "اختبر هذا المكون بالمحاكيات"'
                            ]
                        },
                        implementation: [
                            '🧪 استخدم Vitest أو Jest لاختبارات الوحدة',
                            '🧪 استخدم Playwright أو Cypress لاختبارات E2E',
                            '🧪 إعداد Istanbul أو c8 لتغطية الكود',
                            '🧪 احكِ تنفيذ fetch/API في الاختبارات',
                            '🧪 استخدم JSDOM لاختبارات DOM',
                            '🧪 نفذ اختبار تكامل لتدفقات المستخدم الحرجة',
                            '🧪 حقق تغطية >70% لمنطق الأعمال'
                        ],
                        realWorld: 'تتطلب انضباط اختبار. جيد لاختبارات الوحدة/E2E، محدود لاختبار المكونات'
                    },
                    dotnet: {
                        score: '9/10',
                        strengths: [
                            '✅ أطر اختبار ناضجة (Jest، Testing Library، Jasmine)',
                            '✅ أدوات اختبار مكونات مدمجة',
                            '✅ محاكيات وأدوات stub ممتازة',
                            '✅ اختبار لقطة مدمج',
                            '✅ تغطية كود قوية (Istanbul)',
                            '✅ عزل اختبار ممتاز مع وحدات',
                            '✅ خدمات محاكاة مع حقن الاعتماديات',
                            '✅ دعم اختبار TypeScript من الدرجة الأولى'
                        ],
                        weaknesses: [
                            '❌ إعداد إطار اختبار معقد',
                            '❌ المحاكيات يمكن أن تصبح هشة',
                            '❌ اختبارات أبطأ بسبب التجميع',
                            '❌ يتطلب فهم أنماط اختبار إطار العمل'
                        ],
                        cursorAI: {
                            performance: '🟢 ممتاز',
                            reasons: [
                                '🤖 Cursor يفهم أنماط اختبار إطار العمل',
                                '🤖 ينشئ محاكيات لجميع الاعتماديات',
                                '🤖 يكتب اختبارات شاملة مع حالات حدية',
                                '🤖 يمكنه إنشاء اختبارات لقطة',
                                '🤖 رائع لإعادة بناء اختبارات مكسورة'
                            ],
                            tips: [
                                '💡 "أنشئ اختبارات لهذا المكون مع 100% تغطية"',
                                '💡 "احكِ هذه الخدمة في الاختبار"',
                                '💡 "أضف اختبارات لقطة لهذه الواجهة"',
                                '💡 "اكتب اختبار تكامل لهذا التدفق"'
                            ]
                        },
                        implementation: [
                            '🧪 استخدم Jest + Testing Library (React)',
                            '🧪 استخدم Jasmine/Karma (Angular)',
                            '🧪 Playwright أو Cypress لاختبارات E2E',
                            '🧪 نفذ CI/CD مع بوابات اختبار',
                            '🧪 استخدم Storybook لتطوير مكونات معزولة',
                            '🧪 اختبارات لقطة للواجهات الحرجة',
                            '🧪 حقق تغطية >80% كود بسهولة'
                        ],
                        realWorld: 'أفضل تجربة اختبار. ضروري للفرق الكبيرة والأنظمة الحرجة'
                    }
                }
            ];
        }
        
        // English version (default)
        return [
            {
                title: '⚡ Time-to-Market & Development Speed',
                vanilla: {
                    score: '9/10',
                    strengths: [
                        '✅ Zero build configuration - start coding in seconds',
                        '✅ No transpilation delays during development',
                        '✅ Instant hot reload by just refreshing browser (F5)',
                        '✅ Minimal dependencies = faster npm install (<10 seconds)',
                        '✅ No webpack, babel, or toolchain to configure',
                        '✅ Direct browser debugging with native DevTools',
                        '✅ Cursor AI generates code that runs immediately without compilation'
                    ],
                    weaknesses: [
                        '❌ Need to create component patterns from scratch',
                        '❌ No pre-built UI component libraries (material-ui, ant-design)',
                        '❌ Manual state management implementation required',
                        '❌ Slower for complex UI with many reusable components',
                        '❌ Initial velocity advantage decreases at enterprise scale'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT',
                        reasons: [
                            '🤖 Cursor generates plain JS instantly - no type checking delays',
                            '🤖 Simpler code = fewer tokens = faster responses',
                            '🤖 Less context needed (no framework boilerplate)',
                            '🤖 Direct DOM manipulation is straightforward for AI',
                            '🤖 Cursor Agent/Composer can scaffold entire components in one go'
                        ]
                    },
                    realWorld: 'Best for: MVPs, internal tools, time-sensitive prototypes, proof-of-concepts where speed matters more than long-term scalability'
                },
                dotnet: {
                    score: '6/10',
                    strengths: [
                        '✅ Rich CLI tooling (dotnet new, scaffolding, generators)',
                        '✅ Pre-built component libraries (Material, PrimeNG, Ant Design)',
                        '✅ Hot Module Replacement (HMR) for instant updates',
                        '✅ Comprehensive project templates and boilerplates',
                        '✅ Strong IDE integration (IntelliSense, auto-imports)',
                        '✅ Framework conventions accelerate development after learning curve'
                    ],
                    weaknesses: [
                        '❌ Initial setup: 5-15 minutes for new project',
                        '❌ npm install can take 2-5 minutes',
                        '❌ Build time: 10-60 seconds depending on project size',
                        '❌ Steep learning curve (TypeScript + Framework + .NET)',
                        '❌ Webpack/bundler configuration complexity',
                        '❌ More dependencies = more potential breaking changes'
                    ],
                    cursorAI: {
                        performance: '🟡 GOOD (with caveats)',
                        reasons: [
                            '🤖 Cursor handles TypeScript well but slower than JS',
                            '🤖 Framework boilerplate requires more context',
                            '🤖 Need to specify Angular/React patterns explicitly',
                            '🤖 Type definitions help Cursor understand code better',
                            '🤖 More tokens needed = slightly slower generation',
                            '🤖 Great for refactoring with type safety'
                        ]
                    },
                    realWorld: 'Best for: Long-term projects, large teams, complex UIs with many reusable components, when you have time for proper setup'
                }
            },
            {
                title: '👨‍💻 Developer Experience & Productivity',
                vanilla: {
                    score: '5/10',
                    strengths: [
                        '✅ Direct control - no "magic" or hidden behavior',
                        '✅ Simple debugging with browser DevTools',
                        '✅ No build errors to troubleshoot',
                        '✅ Fast iteration: edit → refresh → see results',
                        '✅ Lightweight dev environment (no node_modules bloat)',
                        '✅ Full understanding of what code does'
                    ],
                    weaknesses: [
                        '❌ No IntelliSense without JSDoc or TypeScript',
                        '❌ Runtime errors instead of compile-time detection',
                        '❌ Manual type checking prone to bugs',
                        '❌ No auto-import of modules',
                        '❌ Limited refactoring tools',
                        '❌ No hot module replacement (manual refresh)',
                        '❌ Must manually track component state'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT for AI-assisted coding',
                        reasons: [
                            '🤖 Cursor Agent works FASTER with vanilla JS',
                            '🤖 Can scaffold entire features in one prompt',
                            '🤖 Less cognitive load = better AI suggestions',
                            '🤖 JSDoc comments give Cursor enough context',
                            '🤖 Cursor Composer can rewrite components easily',
                            '🤖 AI compensates for lack of IntelliSense'
                        ],
                        tips: [
                            '💡 Use JSDoc for better AI suggestions: @param, @returns',
                            '💡 Ask Cursor to add comprehensive comments',
                            '💡 Use Cursor Rules to enforce coding patterns',
                            '💡 Let AI handle repetitive DOM manipulation'
                        ]
                    },
                    realWorld: 'DX improves significantly with Cursor AI - AI fills the gaps left by lack of TypeScript/Framework'
                },
                dotnet: {
                    score: '9/10',
                    strengths: [
                        '✅ Excellent IntelliSense with TypeScript',
                        '✅ Compile-time error detection prevents bugs',
                        '✅ Advanced refactoring tools (rename, extract, move)',
                        '✅ Auto-import and path completion',
                        '✅ Rich debugging with source maps',
                        '✅ Hot Module Replacement (HMR) for instant updates',
                        '✅ Component DevTools (Angular/React extensions)',
                        '✅ Built-in testing utilities'
                    ],
                    weaknesses: [
                        '❌ Build times slow down iteration (10-60s)',
                        '❌ Complex error messages from webpack/bundlers',
                        '❌ TypeScript errors can be cryptic',
                        '❌ More dependencies = more things to learn',
                        '❌ Framework updates require migration effort'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT for complex projects',
                        reasons: [
                            '🤖 TypeScript helps Cursor understand types',
                            '🤖 Better for large refactoring operations',
                            '🤖 Cursor can navigate complex codebases easier',
                            '🤖 Type definitions provide rich context',
                            '🤖 Framework patterns guide AI suggestions'
                        ],
                        tips: [
                            '💡 Use Cursor to generate TypeScript interfaces',
                            '💡 Let AI write unit tests with Testing Library',
                            '💡 Ask Cursor to refactor with type safety',
                            '💡 Use AI to explain complex framework patterns'
                        ]
                    },
                    realWorld: 'Best DX for large teams and long-term projects. TypeScript + Cursor = powerful combination for maintainability'
                }
            },
            {
                title: '🏗️ Maintainability, Code Quality & Architecture',
                vanilla: {
                    score: '5/10 (without discipline) | 8/10 (with patterns)',
                    strengths: [
                        '✅ No framework lock-in - code is future-proof',
                        '✅ Full control over architecture decisions',
                        '✅ No dependency upgrade cycles',
                        '✅ Easy to understand - no "magic"',
                        '✅ Portable across projects',
                        '✅ Minimal technical debt from dependencies'
                    ],
                    weaknesses: [
                        '❌ Easy to create "spaghetti code" without discipline',
                        '❌ No enforced separation of concerns',
                        '❌ Component reuse requires manual abstraction',
                        '❌ Architectural drift without strong leadership',
                        '❌ Each developer may use different patterns',
                        '❌ Harder to onboard new developers without conventions'
                    ],
                    cursorAI: {
                        performance: '🟢 GOOD (AI helps enforce patterns)',
                        reasons: [
                            '🤖 Use Cursor Rules (.cursorrules) to enforce patterns',
                            '🤖 AI can refactor inconsistent code',
                            '🤖 Cursor can generate component templates',
                            '🤖 AI ensures consistency across codebase',
                            '🤖 Ask Cursor to implement best practices'
                        ],
                        tips: [
                            '💡 Create .cursorrules file with your patterns',
                            '💡 Use AI to enforce DRY principles',
                            '💡 Let Cursor generate component base classes',
                            '💡 Ask AI to review for anti-patterns'
                        ]
                    },
                    bestPractices: [
                        '📋 Establish coding standards document early',
                        '📋 Create reusable component patterns (Router, Store, BaseComponent)',
                        '📋 Implement mandatory code review process',
                        '📋 Use ESLint with strict rules',
                        '📋 Document architecture decisions (ADRs)',
                        '📋 Create a component library/style guide'
                    ],
                    realWorld: 'Requires strong technical leadership. Works well for small-medium teams (3-10 devs) with senior oversight'
                },
                dotnet: {
                    score: '9/10',
                    strengths: [
                        '✅ Framework enforces separation of concerns',
                        '✅ Built-in component model promotes reusability',
                        '✅ Strong conventions and best practices',
                        '✅ Rich ecosystem of reusable UI components',
                        '✅ Dependency injection built-in',
                        '✅ Clear project structure (modules, services, components)',
                        '✅ TypeScript prevents many runtime errors',
                        '✅ Easier to onboard new developers'
                    ],
                    weaknesses: [
                        '❌ Framework upgrades may require refactoring',
                        '❌ Vendor lock-in to React/Angular ecosystem',
                        '❌ Over-abstraction can reduce code clarity',
                        '❌ Breaking changes in major versions',
                        '❌ Must stay current with framework best practices'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT',
                        reasons: [
                            '🤖 Framework patterns guide AI generation',
                            '🤖 TypeScript helps Cursor catch errors',
                            '🤖 Better for large-scale refactoring',
                            '🤖 AI understands framework conventions',
                            '🤖 Can generate tests following framework patterns'
                        ]
                    },
                    bestPractices: [
                        '📋 Follow official style guide (Angular/React)',
                        '📋 Use state management (NgRx, Redux, Zustand)',
                        '📋 Implement feature modules for organization',
                        '📋 Create shared component library',
                        '📋 Document components with Storybook',
                        '📋 Enforce TypeScript strict mode'
                    ],
                    realWorld: 'Best for large teams (10+), distributed development, long-term projects (3+ years)'
                }
            },
            {
                title: '⚡ Performance & Bundle Size',
                vanilla: {
                    score: '10/10',
                    strengths: [
                        '✅ Minimal payload: 5-30KB total JavaScript',
                        '✅ No framework overhead (React = ~40KB, Angular = ~100KB gzipped)',
                        '✅ Direct DOM manipulation is fastest',
                        '✅ No virtual DOM reconciliation cost',
                        '✅ Full control over lazy loading',
                        '✅ Excellent Lighthouse scores (95-100) by default',
                        '✅ First Contentful Paint (FCP) < 0.5s',
                        '✅ Time to Interactive (TTI) < 1s'
                    ],
                    weaknesses: [
                        '❌ Manual optimization for large lists (virtual scrolling)',
                        '❌ Easy to create memory leaks without cleanup',
                        '❌ Must manually optimize re-renders',
                        '❌ No automatic change detection'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT',
                        reasons: [
                            '🤖 Ask Cursor to implement virtual scrolling',
                            '🤖 AI can add proper event listener cleanup',
                            '🤖 Cursor generates optimized DOM updates',
                            '🤖 Simple code = easier performance tuning'
                        ]
                    },
                    metrics: {
                        bundleSize: '5-30KB (vs 100-200KB for framework)',
                        loadTime: '< 500ms first load',
                        fcp: '< 0.5s',
                        tti: '< 1s',
                        lighthouse: '95-100 on all metrics'
                    },
                    realWorld: 'Perfect for: Performance-critical apps, mobile-first, low-bandwidth users, emerging markets'
                },
                dotnet: {
                    score: '7/10',
                    strengths: [
                        '✅ Virtual DOM optimizes many updates efficiently',
                        '✅ Framework-level performance optimizations',
                        '✅ OnPush change detection (Angular)',
                        '✅ React.memo and useMemo for optimization',
                        '✅ Built-in code splitting and lazy loading',
                        '✅ Tree shaking removes unused code',
                        '✅ Production builds are optimized'
                    ],
                    weaknesses: [
                        '❌ Framework bundle: 100-200KB gzipped',
                        '❌ Virtual DOM overhead for simple UIs',
                        '❌ Slower initial load time (2-3s on 3G)',
                        '❌ More JavaScript to parse/execute',
                        '❌ Requires bundler configuration for optimization'
                    ],
                    cursorAI: {
                        performance: '🟢 GOOD',
                        reasons: [
                            '🤖 Cursor can configure code splitting',
                            '🤖 AI suggests React.memo optimizations',
                            '🤖 Can analyze bundle size and suggest improvements',
                            '🤖 Helps implement lazy loading properly'
                        ]
                    },
                    metrics: {
                        bundleSize: '100-300KB (framework + app)',
                        loadTime: '1-3s first load',
                        fcp: '1-2s',
                        tti: '2-4s',
                        lighthouse: '70-90 (requires optimization)'
                    },
                    realWorld: 'Performance is good but requires optimization effort. Best for internal tools where load time matters less'
                }
            },
            {
                title: '🔒 Security & Compliance',
                vanilla: {
                    score: '6/10 (requires expertise)',
                    strengths: [
                        '✅ Smaller attack surface - fewer dependencies',
                        '✅ No hidden framework vulnerabilities',
                        '✅ Direct control over CSP policies',
                        '✅ Explicit security implementation',
                        '✅ No supply chain risks from framework ecosystem'
                    ],
                    weaknesses: [
                        '❌ Manual CSRF/XSS protection required',
                        '❌ No built-in authentication patterns',
                        '❌ Security is developer\'s responsibility',
                        '❌ Must implement RBAC manually',
                        '❌ Easy to make security mistakes',
                        '❌ No framework-level sanitization'
                    ],
                    cursorAI: {
                        performance: '🟡 REQUIRES CAREFUL PROMPTING',
                        reasons: [
                            '🤖 AI may not add security measures by default',
                            '🤖 Must explicitly ask for input sanitization',
                            '🤖 Cursor can implement CSP headers',
                            '🤖 Need to prompt for OWASP compliance',
                            '⚠️ RISK: AI might generate insecure code without guidance'
                        ],
                        tips: [
                            '💡 Always ask: "Make this secure against XSS"',
                            '💡 Prompt: "Add CSRF token to all forms"',
                            '💡 Request: "Sanitize all user inputs"',
                            '💡 Specify: "Use textContent not innerHTML"'
                        ]
                    },
                    implementation: [
                        '🔐 Use HTTPOnly cookies for tokens',
                        '🔐 Implement strict CSP headers',
                        '🔐 Sanitize ALL user inputs before rendering',
                        '🔐 Use textContent instead of innerHTML',
                        '🔐 Integrate with ASP.NET Core Identity backend',
                        '🔐 Implement audit logging patterns',
                        '🔐 Regular security audits'
                    ],
                    realWorld: 'Requires security-conscious developers. Not recommended for high-security applications without expert review'
                },
                dotnet: {
                    score: '9/10',
                    strengths: [
                        '✅ ASP.NET Core Identity for AuthN/AuthZ',
                        '✅ Built-in CSRF protection',
                        '✅ Framework-level XSS mitigations',
                        '✅ Policy-based authorization',
                        '✅ Comprehensive audit logging libraries',
                        '✅ OWASP compliance guidance',
                        '✅ Automatic input sanitization',
                        '✅ Security updates from Microsoft/Community'
                    ],
                    weaknesses: [
                        '❌ Framework vulnerabilities require updates',
                        '❌ Complex dependency trees to audit',
                        '❌ Must stay current with security patches',
                        '❌ Third-party library risks (npm ecosystem)'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT',
                        reasons: [
                            '🤖 Framework patterns include security by default',
                            '🤖 Cursor generates secure code following framework',
                            '🤖 AI understands ASP.NET Identity patterns',
                            '🤖 TypeScript helps prevent injection attacks',
                            '🤖 Can generate role-based authorization'
                        ]
                    },
                    implementation: [
                        '🔐 Use ASP.NET Core Identity with JWT',
                        '🔐 Implement role-based and claims-based authorization',
                        '🔐 Enable CORS properly',
                        '🔐 Use HttpClient with CSRF tokens',
                        '🔐 Regular npm audit and vulnerability scanning',
                        '🔐 Implement Content Security Policy',
                        '🔐 Use HTTPS everywhere'
                    ],
                    realWorld: 'Best for enterprise, healthcare, finance, government - sectors requiring high security'
                }
            },
            {
                title: '🧪 Testing, Quality Assurance & Debugging',
                vanilla: {
                    score: '6/10',
                    strengths: [
                        '✅ Simple DOM testing with no framework mocks',
                        '✅ Direct unit testing of functions',
                        '✅ Fast test execution',
                        '✅ No test-specific build configuration',
                        '✅ Easy to debug in browser DevTools',
                        '✅ Can use Playwright/Cypress for E2E'
                    ],
                    weaknesses: [
                        '❌ Limited testing ecosystem',
                        '❌ No test generators or scaffolding',
                        '❌ Manual setup for component testing',
                        '❌ No built-in test utilities',
                        '❌ Must create custom test helpers'
                    ],
                    cursorAI: {
                        performance: '🟢 GOOD',
                        reasons: [
                            '🤖 Cursor can generate simple unit tests',
                            '🤖 AI writes Playwright/Cypress tests well',
                            '🤖 Can create test utilities on demand',
                            '🤖 Generates mock data easily'
                        ],
                        tips: [
                            '💡 Ask Cursor to generate Playwright tests',
                            '💡 Use AI to create test fixtures',
                            '💡 Request comprehensive test coverage',
                            '💡 Let AI write integration tests'
                        ]
                    },
                    tools: [
                        '🧪 Playwright or Cypress for E2E',
                        '🧪 Simple assert-based unit tests',
                        '🧪 jsdom for DOM testing',
                        '🧪 Mock Service Worker (MSW) for API mocks',
                        '🧪 c8 or istanbul for coverage'
                    ],
                    realWorld: 'Adequate for small-medium projects. E2E tests more important than unit tests'
                },
                dotnet: {
                    score: '9/10',
                    strengths: [
                        '✅ Rich testing ecosystem (xUnit, Jest, Vitest)',
                        '✅ Built-in test utilities and mocks',
                        '✅ Component testing conventions',
                        '✅ TestBed and ComponentFixture (Angular)',
                        '✅ React Testing Library best practices',
                        '✅ Snapshot testing',
                        '✅ Code coverage built-in',
                        '✅ Test generators and scaffolding'
                    ],
                    weaknesses: [
                        '❌ Complex test configuration',
                        '❌ Framework-specific testing knowledge required',
                        '❌ Slower test execution with full builds',
                        '❌ Over-mocking can reduce test value'
                    ],
                    cursorAI: {
                        performance: '🟢 EXCELLENT',
                        reasons: [
                            '🤖 Cursor excels at generating Jest/Vitest tests',
                            '🤖 AI understands Testing Library patterns',
                            '🤖 Can generate comprehensive test suites',
                            '🤖 Follows framework testing conventions',
                            '🤖 Creates mocks and fixtures automatically'
                        ]
                    },
                    tools: [
                        '🧪 Jest or Vitest for unit tests',
                        '🧪 Testing Library for component tests',
                        '🧪 Playwright/Cypress for E2E',
                        '🧪 Storybook for component documentation',
                        '🧪 Achieve >80% code coverage easily'
                    ],
                    realWorld: 'Best testing experience. Essential for large teams and mission-critical systems'
                }
            }
        ];
    }

    // Deep Dive - PROFESSIONAL VERSION with Cursor AI considerations
    function renderDeepDive(container) {
        const comparisons = getDeepDiveData();

        comparisons.forEach(comp => {
            const section = document.createElement('div');
            section.className = 'comparison-section';
            section.style.cssText = 'margin-bottom: 3rem; border-bottom: 2px solid var(--color-border); padding-bottom: 2rem;';
            
            section.innerHTML = `
                <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem;">${comp.title}</h3>
                <div class="comparison-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    ${createDetailedCard('Vanilla JS + Web API', comp.vanilla, 'approach-a')}
                    ${createDetailedCard('.NET Core + SPA', comp.dotnet, 'approach-b')}
                </div>
            `;
            
            container.appendChild(section);
        });

        // Add final recommendation
        const finalRec = document.createElement('div');
        finalRec.className = 'card highlight-card';
        
        if (currentLang === 'ar') {
            finalRec.innerHTML = `
                <h3>🤖 ملخص أداء Cursor AI</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                    <div>
                        <h4 style="color: var(--color-success);">✅ Vanilla JS مع Cursor</h4>
                        <ul style="margin-top: 0.5rem;">
                            <li><strong>أسرع</strong> في توليد الكود (البساطة = السرعة)</li>
                            <li><strong>أفضل</strong> للنماذج الأولية السريعة</li>
                            <li><strong>أسهل</strong> لبناء ميزات كاملة</li>
                            <li><strong>أنظف</strong> في الكود المولد بالذكاء الاصطناعي</li>
                            <li>استخدم .cursorrules لفرض الأنماط</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>الأفضل عندما:</strong> فريق صغير، تكرار سريع، Cursor يقوم بالعمل الثقيل</p>
                    </div>
                    <div>
                        <h4 style="color: var(--color-accent);">✅ .NET + SPA مع Cursor</h4>
                        <ul style="margin-top: 0.5rem;">
                            <li><strong>أكثر أماناً</strong> مع TypeScript + الذكاء الاصطناعي</li>
                            <li><strong>أفضل</strong> لإعادة الهيكلة الكبيرة</li>
                            <li><strong>أسهل</strong> في الصيانة مع فحص الأنواع</li>
                            <li><strong>أغنى</strong> في السياق لاقتراحات الذكاء الاصطناعي</li>
                            <li>أنماط إطار العمل توجه الذكاء الاصطناعي بشكل أفضل</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>الأفضل عندما:</strong> فريق كبير، مشروع طويل الأجل، حاجة للصيانة</p>
                    </div>
                </div>
                <div style="margin-top: 2rem; padding: 1rem; background: var(--color-bg-secondary); border-radius: 8px;">
                    <strong>💡 نصيحة احترافية:</strong> مع Cursor AI، يصبح Vanilla JS أكثر قابلية للتطبيق بكثير. الذكاء الاصطناعي يملأ الفجوات (لا IntelliSense، لا إطار عمل). 
                    للفرق الفردية/الصغيرة التي تستخدم Cursor بكثافة، Vanilla JS منتج بشكل مدهش! 💡
                </div>
            `;
        } else {
            finalRec.innerHTML = `
                <h3>🤖 Cursor AI Performance Summary</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">
                    <div>
                        <h4 style="color: var(--color-success);">✅ Vanilla JS with Cursor</h4>
                        <ul style="margin-top: 0.5rem;">
                            <li><strong>FASTER</strong> code generation (simpler = faster)</li>
                            <li><strong>BETTER</strong> for rapid prototyping</li>
                            <li><strong>EASIER</strong> to scaffold entire features</li>
                            <li><strong>CLEANER</strong> AI-generated code</li>
                            <li>Use .cursorrules to enforce patterns</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>Best when:</strong> Small team, fast iteration, Cursor does heavy lifting</p>
                    </div>
                    <div>
                        <h4 style="color: var(--color-accent);">✅ .NET + SPA with Cursor</h4>
                        <ul style="margin-top: 0.5rem;">
                            <li><strong>SAFER</strong> code with TypeScript + AI</li>
                            <li><strong>BETTER</strong> for large refactoring</li>
                            <li><strong>EASIER</strong> to maintain with type checking</li>
                            <li><strong>RICHER</strong> context for AI suggestions</li>
                            <li>Framework patterns guide AI better</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>Best when:</strong> Large team, long-term project, need maintainability</p>
                    </div>
                </div>
                <div style="margin-top: 2rem; padding: 1rem; background: var(--color-bg-secondary); border-radius: 8px;">
                    <strong>💡 Pro Tip:</strong> With Cursor AI, Vanilla JS becomes MUCH more viable. AI fills the gaps (no IntelliSense, no framework). 
                    For solo/small teams using Cursor heavily, Vanilla JS is surprisingly productive!
                </div>
            `;
        }
        container.appendChild(finalRec);
    }

    function createDetailedCard(title, data, className) {
        return `
            <div class="comparison-card ${className}" style="padding: 1.5rem; background: var(--color-bg-card); border-radius: 12px; border: 2px solid ${className === 'approach-a' ? '#6366f1' : '#8b5cf6'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="margin: 0;">${title}</h4>
                    ${data.score ? `<span class="badge ${className}" style="font-size: 1.1rem; padding: 0.5rem 1rem;">${data.score}</span>` : ''}
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <strong style="color: var(--color-success); font-size: 1.1rem;">✅ Strengths</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        ${data.strengths.map(s => `<li style="margin: 0.3rem 0;">${s}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <strong style="color: var(--color-danger); font-size: 1.1rem;">❌ Weaknesses</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        ${data.weaknesses.map(w => `<li style="margin: 0.3rem 0;">${w}</li>`).join('')}
                    </ul>
                </div>
                
                ${data.cursorAI ? `
                <div style="background: var(--color-bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <strong style="font-size: 1.1rem;">🤖 Cursor AI Performance</strong>
                        <span style="padding: 0.25rem 0.75rem; background: ${data.cursorAI.performance.includes('EXCELLENT') ? '#22c55e' : data.cursorAI.performance.includes('GOOD') ? '#3b82f6' : '#eab308'}; color: white; border-radius: 4px; font-size: 0.85rem;">${data.cursorAI.performance}</span>
                    </div>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; font-size: 0.9rem;">
                        ${data.cursorAI.reasons.map(r => `<li style="margin: 0.25rem 0;">${r}</li>`).join('')}
                    </ul>
                    ${data.cursorAI.tips ? `
                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--color-border);">
                        <strong style="font-size: 0.9rem;">💡 Cursor Tips:</strong>
                        <ul style="margin: 0.25rem 0; padding-left: 1.5rem; font-size: 0.85rem;">
                            ${data.cursorAI.tips.map(t => `<li style="margin: 0.2rem 0;">${t}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${data.bestPractices ? `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--color-accent);">📋 Best Practices</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; font-size: 0.9rem;">
                        ${data.bestPractices.map(p => `<li style="margin: 0.25rem 0;">${p}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.implementation ? `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--color-accent);">🔧 Implementation Guide</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; font-size: 0.9rem;">
                        ${data.implementation.map(i => `<li style="margin: 0.25rem 0;">${i}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.tools ? `
                <div style="margin-bottom: 1rem;">
                    <strong style="color: var(--color-accent);">🛠️ Recommended Tools</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; font-size: 0.9rem;">
                        ${data.tools.map(t => `<li style="margin: 0.25rem 0;">${t}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.metrics ? `
                <div style="background: var(--color-bg-secondary); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
                    <strong style="font-size: 0.95rem;">📊 Performance Metrics:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; font-size: 0.85rem;">
                        ${Object.entries(data.metrics).map(([key, value]) => 
                            `<li style="margin: 0.2rem 0;"><strong>${key}:</strong> ${value}</li>`
                        ).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.realWorld ? `
                <div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-left: 3px solid ${className === 'approach-a' ? '#6366f1' : '#8b5cf6'}; border-radius: 4px;">
                    <strong style="font-size: 0.9rem;">🌍 Real-World Use:</strong>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">${data.realWorld}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    function initDecisionMatrix(container) {
        renderDecisionMatrix(container);
        store.subscribe('criteria', () => renderDecisionMatrix(container));
    }

    // Get Matrix translations
    function getMatrixTranslations() {
        if (currentLang === 'ar') {
            return {
                exportMatrix: '💾 تصدير المصفوفة',
                importMatrix: '📥 استيراد المصفوفة',
                resetMatrix: '🔄 إعادة تعيين للافتراضي',
                weightedResults: 'النتائج المرجحة',
                vanillaScore: 'نتيجة Vanilla JS',
                dotnetScore: 'نتيجة .NET + SPA',
                adjustText: 'اضبط الأوزان والدرجات أعلاه',
                weight: 'الوزن',
                weightTooltip: 'ما مدى أهمية هذا المعيار لمؤسستك؟ (0 = غير مهم، 10 = حرج)',
                vanillaScoreLabel: 'نتيجة Vanilla JS',
                vanillaScoreTooltip: 'ما مدى أداء Vanilla JS + Web API في هذا المعيار؟ (0 = ضعيف، 10 = ممتاز)',
                dotnetScoreLabel: 'نتيجة .NET + SPA',
                dotnetScoreTooltip: 'ما مدى أداء .NET Core + SPA (Angular/React) في هذا المعيار؟ (0 = ضعيف، 10 = ممتاز)',
                winner: 'الفائز',
                withScore: 'بنتيجة'
            };
        }
        return {
            exportMatrix: '💾 Export Matrix',
            importMatrix: '📥 Import Matrix',
            resetMatrix: '🔄 Reset to Defaults',
            weightedResults: 'Weighted Results',
            vanillaScore: 'Vanilla JS Score',
            dotnetScore: '.NET + SPA Score',
            adjustText: 'Adjust weights and scores above',
            weight: 'Weight',
            weightTooltip: 'How important is this criterion to your organization? (0 = not important, 10 = critical)',
            vanillaScoreLabel: 'Vanilla JS Score',
            vanillaScoreTooltip: 'How well does Vanilla JS + Web API perform on this criterion? (0 = poor, 10 = excellent)',
            dotnetScoreLabel: '.NET + SPA Score',
            dotnetScoreTooltip: 'How well does .NET Core + SPA (Angular/React) perform on this criterion? (0 = poor, 10 = excellent)',
            winner: 'Winner',
            withScore: 'with score'
        };
    }

    function renderDecisionMatrix(container) {
        const criteria = store.getState().criteria;
        const tr = getMatrixTranslations();
        
        container.innerHTML = `
            <div class="matrix-controls">
                <div class="btn-group">
                    <button class="btn btn-primary" id="export-matrix">
                        ${tr.exportMatrix}
                    </button>
                    <button class="btn btn-secondary" id="import-matrix">
                        ${tr.importMatrix}
                    </button>
                    <button class="btn btn-secondary" id="reset-matrix">
                        ${tr.resetMatrix}
                    </button>
                </div>
                <input type="file" id="matrix-file-input" accept=".json" style="display: none;">
            </div>
            
            <div id="matrix-items"></div>
            
            <div class="matrix-results">
                <h3 class="text-center">${tr.weightedResults}</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <h3>${tr.vanillaScore}</h3>
                        <div class="result-score" id="vanilla-total">0</div>
                    </div>
                    <div class="result-item">
                        <h3>${tr.dotnetScore}</h3>
                        <div class="result-score" id="dotnet-total">0</div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-lg);">
                    <div class="result-bar">
                        <div class="result-bar-fill approach-a" id="vanilla-bar" style="width: 0%"></div>
                    </div>
                    <div class="result-bar" style="margin-top: var(--spacing-sm);">
                        <div class="result-bar-fill approach-b" id="dotnet-bar" style="width: 0%"></div>
                    </div>
                </div>
                
                <div class="text-center" style="margin-top: var(--spacing-lg);">
                    <div class="winner-badge" id="winner-badge">
                        ${tr.adjustText}
                    </div>
                </div>
            </div>
        `;
        
        // Render each criterion
        const itemsContainer = container.querySelector('#matrix-items');
        criteria.forEach((criterion, index) => {
            const item = createMatrixItem(criterion, index);
            itemsContainer.appendChild(item);
        });
        
        // Calculate and display results
        updateMatrixResults();
        
        // Attach event listeners
        attachMatrixEventListeners(container);
    }

    function createMatrixItem(criterion, index) {
        const item = document.createElement('div');
        item.className = 'matrix-item';
        const tr = getMatrixTranslations();
        
        // Get translated criterion name and description
        const criterionName = t(`criteria.items.${criterion.id}.name`) || criterion.name;
        const criterionDesc = t(`criteria.items.${criterion.id}.description`) || criterion.description;
        
        item.innerHTML = `
            <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                ${criterionName}
                <span class="tooltip-trigger" data-tooltip="${escapeHtml(criterionDesc)}">ℹ️</span>
            </h4>
            <div class="matrix-row">
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="${tr.weightTooltip}">
                            ${tr.weight} ℹ️
                        </span>
                        <span class="slider-value">${criterion.weight}/10</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        value="${criterion.weight}"
                        data-criterion="${index}"
                        data-type="weight"
                        aria-label="${tr.weight} for ${criterionName}"
                    >
                </div>
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="${tr.vanillaScoreTooltip}">
                            ${tr.vanillaScoreLabel} ℹ️
                        </span>
                        <span class="slider-value">${criterion.scores.vanilla}/10</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        value="${criterion.scores.vanilla}"
                        data-criterion="${index}"
                        data-type="vanilla"
                        aria-label="Vanilla JS score for ${criterionName}"
                    >
                </div>
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="${tr.dotnetScoreTooltip}">
                            ${tr.dotnetScoreLabel} ℹ️
                        </span>
                        <span class="slider-value">${criterion.scores.dotnet}/10</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        value="${criterion.scores.dotnet}"
                        data-criterion="${index}"
                        data-type="dotnet"
                        aria-label=".NET + SPA score for ${criterionName}"
                    >
                </div>
            </div>
        `;
        
        // Attach slider listeners
        const sliders = item.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', handleMatrixSliderChange);
        });
        
        return item;
    }

    function handleMatrixSliderChange(e) {
        const index = parseInt(e.target.dataset.criterion);
        const type = e.target.dataset.type;
        const value = parseInt(e.target.value);
        
        // Update display
        const valueDisplay = e.target.previousElementSibling.querySelector('.slider-value');
        valueDisplay.textContent = `${value}/10`;
        
        // Update store
        const criteria = [...store.getState().criteria];
        if (type === 'weight') {
            criteria[index].weight = value;
        } else if (type === 'vanilla') {
            criteria[index].scores.vanilla = value;
        } else if (type === 'dotnet') {
            criteria[index].scores.dotnet = value;
        }
        
        store.setState({ criteria });
        updateMatrixResults();
    }

    function updateMatrixResults() {
        const criteria = store.getState().criteria;
        const tr = getMatrixTranslations();
        
        let vanillaTotalWeighted = 0;
        let dotnetTotalWeighted = 0;
        let totalWeight = 0;
        
        criteria.forEach(criterion => {
            const weight = criterion.weight;
            vanillaTotalWeighted += weight * criterion.scores.vanilla;
            dotnetTotalWeighted += weight * criterion.scores.dotnet;
            totalWeight += weight;
        });
        
        // Calculate normalized scores
        const vanillaScore = totalWeight > 0 ? (vanillaTotalWeighted / totalWeight).toFixed(1) : 0;
        const dotnetScore = totalWeight > 0 ? (dotnetTotalWeighted / totalWeight).toFixed(1) : 0;
        
        // Update displays
        const vanillaTotalEl = document.getElementById('vanilla-total');
        const dotnetTotalEl = document.getElementById('dotnet-total');
        const vanillaBarEl = document.getElementById('vanilla-bar');
        const dotnetBarEl = document.getElementById('dotnet-bar');
        const winnerBadgeEl = document.getElementById('winner-badge');
        
        if (vanillaTotalEl) vanillaTotalEl.textContent = vanillaScore;
        if (dotnetTotalEl) dotnetTotalEl.textContent = dotnetScore;
        
        // Update bars
        const maxScore = Math.max(vanillaScore, dotnetScore);
        if (vanillaBarEl && maxScore > 0) {
            const vanillaPercent = (vanillaScore / maxScore) * 100;
            vanillaBarEl.style.width = `${vanillaPercent}%`;
            vanillaBarEl.textContent = `Vanilla JS: ${vanillaScore}`;
        }
        
        if (dotnetBarEl && maxScore > 0) {
            const dotnetPercent = (dotnetScore / maxScore) * 100;
            dotnetBarEl.style.width = `${dotnetPercent}%`;
            dotnetBarEl.textContent = `.NET + SPA: ${dotnetScore}`;
        }
        
        // Update winner
        if (winnerBadgeEl) {
            if (vanillaScore > dotnetScore) {
                const diff = (vanillaScore - dotnetScore).toFixed(1);
                winnerBadgeEl.textContent = currentLang === 'ar' 
                    ? `🏆 Vanilla JS تتقدم بـ ${diff} نقطة`
                    : `🏆 Vanilla JS Leads by ${diff} points`;
            } else if (dotnetScore > vanillaScore) {
                const diff = (dotnetScore - vanillaScore).toFixed(1);
                winnerBadgeEl.textContent = currentLang === 'ar'
                    ? `🏆 .NET + SPA تتقدم بـ ${diff} نقطة`
                    : `🏆 .NET + SPA Leads by ${diff} points`;
            } else {
                winnerBadgeEl.textContent = currentLang === 'ar' ? '🤝 نتيجة متعادلة' : '🤝 Tied Score';
            }
        }
    }

    function attachMatrixEventListeners(container) {
        // Export button
        const exportBtn = container.querySelector('#export-matrix');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportMatrix);
        }
        
        // Import button
        const importBtn = container.querySelector('#import-matrix');
        const fileInput = container.querySelector('#matrix-file-input');
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', handleImportMatrix);
        }
        
        // Reset button
        const resetBtn = container.querySelector('#reset-matrix');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetMatrix);
        }
    }

    function exportMatrix() {
        const criteria = store.getState().criteria;
        const dataStr = JSON.stringify(criteria, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `decision-matrix-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleImportMatrix(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const criteria = JSON.parse(event.target.result);
                store.setState({ criteria });
                alert('Matrix imported successfully!');
            } catch (error) {
                alert('Error importing matrix: Invalid JSON file');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        e.target.value = '';
    }

    function resetMatrix() {
        if (!confirm('Reset all weights and scores to default values?')) return;
        
        // Default values
        const defaultCriteria = [
            { id: 'time-to-market', name: 'Time-to-Market', description: 'Speed of initial delivery and iteration velocity', weight: 8, scores: { vanilla: 9, dotnet: 6 } },
            { id: 'dev-productivity', name: 'Developer Productivity & DX', description: 'IDE support, debugging, hot reload, IntelliSense', weight: 7, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'maintainability', name: 'Maintainability & Reuse', description: 'Component patterns, code organization, refactoring ease', weight: 9, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'performance', name: 'Performance', description: 'Load time, interaction responsiveness, large data handling', weight: 8, scores: { vanilla: 9, dotnet: 7 } },
            { id: 'operational-complexity', name: 'Operational Complexity', description: 'Build pipelines, tooling, deployment, DevOps overhead', weight: 6, scores: { vanilla: 10, dotnet: 5 } },
            { id: 'security', name: 'Security & Compliance', description: 'AuthN/AuthZ, RBAC, audit logging, OWASP best practices', weight: 10, scores: { vanilla: 6, dotnet: 9 } },
            { id: 'testing', name: 'Testing & Quality', description: 'Unit testing, integration tests, E2E automation, coverage', weight: 8, scores: { vanilla: 6, dotnet: 9 } },
            { id: 'reporting', name: 'Reporting/Printing/BI', description: 'Export capabilities, print layouts, data visualization', weight: 7, scores: { vanilla: 7, dotnet: 8 } },
            { id: 'scalability', name: 'Scalability', description: 'Team growth, codebase growth, feature expansion', weight: 9, scores: { vanilla: 5, dotnet: 9 } },
            { id: 'hiring', name: 'Hiring/Market Availability', description: 'Talent pool, onboarding time, training requirements', weight: 7, scores: { vanilla: 7, dotnet: 8 } },
            { id: 'tco', name: 'Total Cost of Ownership', description: 'Build, operate, and maintain costs over 3 years', weight: 9, scores: { vanilla: 8, dotnet: 7 } }
        ];
        
        store.setState({ criteria: defaultCriteria });
    }

    function initTCOModel(container) {
        renderTCOModel(container);
        store.subscribe('tcoInputs', () => renderTCOModel(container));
    }

    // Get TCO translations
    function getTCOTranslations() {
        if (currentLang === 'ar') {
            return {
                assumptions: 'افتراضات التكلفة الإجمالية',
                adjustInputs: 'اضبط المدخلات أدناه لحساب التكاليف لسيناريو محدد. جميع القيم النقدية بالدينار الكويتي (بالآلاف).',
                teamSetup: 'الفريق والإعداد',
                teamSize: 'حجم الفريق (مطورون)',
                teamSizeTooltip: 'عدد المطورين بدوام كامل العاملين على المشروع. يؤثر على معدل الحرق الشهري والجدول الزمني للمشروع.',
                avgMonthlySalary: 'متوسط الراتب الشهري (دينار كويتي)',
                avgMonthlySalaryTooltip: 'متوسط الراتب الشهري للمطور بما في ذلك الراتب الأساسي والمزايا والمصاريف الإدارية وتكاليف البنية التحتية. النطاق المعتاد: 1,000-5,000 دينار كويتي شهرياً.',
                setupMonths: 'الإعداد والتكوين (بالأشهر)',
                setupMonthsTooltip: 'الوقت المطلوب للإعداد الأولي: إعداد المشروع، خطوط CI/CD، بيئات التطوير، تكوين الأدوات. .NET + SPA عادة يتطلب وقت إعداد أطول.',
                velocityMaintenance: 'السرعة والصيانة',
                vanillaVelocity: 'مضاعف سرعة Vanilla JS',
                vanillaVelocityTooltip: 'مضاعف سرعة التطوير لـ Vanilla JS. 1.0 = السرعة الأساسية، >1.0 = تسليم أسرع (مثلاً 1.2 = أسرع بـ 20%). ضع في الاعتبار خبرة الفريق وتعقيد المتطلبات.',
                dotnetVelocity: 'مضاعف سرعة .NET + SPA',
                dotnetVelocityTooltip: 'مضاعف سرعة التطوير لـ .NET + SPA. 1.0 = السرعة الأساسية، >1.0 = تسليم أسرع. أطر العمل يمكن أن تسرع التطوير للميزات المعقدة لكن لها منحنيات تعلم.',
                baselineText: '1.0 = أساسي، >1.0 = أسرع',
                year1Maintenance: 'صيانة السنة 1 (% من تكلفة البناء)',
                year1MaintenanceTooltip: 'تكلفة الصيانة المستمرة في السنة 1 كنسبة من إجمالي تكلفة البناء. تشمل إصلاح الأخطاء، التحديثات الصغيرة، التصحيحات الأمنية، إضافات الميزات الصغيرة.',
                year3Maintenance: 'صيانة السنة 3 (% من تكلفة البناء)',
                year3MaintenanceTooltip: 'تكلفة الصيانة السنوية في السنة 3 كنسبة من تكلفة البناء. عادة تزيد مع الوقت بسبب الديون التقنية، تحديثات الاعتماديات، والمتطلبات المتطورة.',
                costBreakdown: 'تفصيل التكلفة',
                year1Total: 'إجمالي تكلفة الملكية للسنة 1',
                year2Total: 'إجمالي تكلفة الملكية للسنة 2',
                year3Total: 'إجمالي تكلفة الملكية للسنة 3',
                vanillaJS: 'Vanilla JS',
                dotnetSPA: '.NET + SPA',
                summary: 'الملخص',
                totalSavings: 'إجمالي التوفير (3 سنوات)',
                savingsText: 'أرخص بمقدار',
                lowerCost: 'تكلفة أقل',
                higherCost: 'تكلفة أعلى',
                costDifference: 'فرق التكلفة'
            };
        }
        return {
            assumptions: 'TCO Assumptions',
            adjustInputs: 'Adjust the inputs below to model costs for your specific scenario. All monetary values in KWD (thousands).',
            teamSetup: 'Team & Setup',
            teamSize: 'Team Size (Developers)',
            teamSizeTooltip: 'Number of full-time developers working on the project. This affects the monthly burn rate and overall project timeline.',
            avgMonthlySalary: 'Average Monthly Salary (KWD)',
            avgMonthlySalaryTooltip: 'Average monthly salary per developer including base salary, benefits, overhead, and infrastructure costs. Typical range: 1,000-5,000 KWD per month.',
            setupMonths: 'Setup & Configuration (Months)',
            setupMonthsTooltip: 'Time needed for initial setup: project scaffolding, CI/CD pipelines, dev environments, tooling configuration. .NET + SPA typically requires more setup time.',
            velocityMaintenance: 'Velocity & Maintenance',
            vanillaVelocity: 'Vanilla JS Velocity Multiplier',
            vanillaVelocityTooltip: 'Development speed multiplier for Vanilla JS. 1.0 = baseline speed, >1.0 = faster delivery (e.g., 1.2 = 20% faster). Consider team expertise and requirements complexity.',
            dotnetVelocity: '.NET + SPA Velocity Multiplier',
            dotnetVelocityTooltip: 'Development speed multiplier for .NET + SPA. 1.0 = baseline speed, >1.0 = faster delivery. Frameworks can accelerate development for complex features but have learning curves.',
            baselineText: '1.0 = baseline, >1.0 = faster',
            year1Maintenance: 'Year 1 Maintenance (% of build cost)',
            year1MaintenanceTooltip: 'Ongoing maintenance cost in Year 1 as a percentage of total build cost. Includes bug fixes, minor updates, security patches, and small feature additions.',
            year3Maintenance: 'Year 3 Maintenance (% of build cost)',
            year3MaintenanceTooltip: 'Annual maintenance cost in Year 3 as a percentage of build cost. Typically increases over time due to technical debt, dependency updates, and evolving requirements.',
            costBreakdown: 'Cost Breakdown',
            year1Total: 'Year 1 Total Cost of Ownership',
            year2Total: 'Year 2 Total Cost of Ownership',
            year3Total: 'Year 3 Total Cost of Ownership',
            vanillaJS: 'Vanilla JS',
            dotnetSPA: '.NET + SPA',
            summary: 'Summary',
            totalSavings: 'Total Savings (3 Years)',
            savingsText: 'cheaper by',
            lowerCost: 'lower cost',
            higherCost: 'higher cost',
            costDifference: 'cost difference'
        };
    }

    function renderTCOModel(container) {
        const inputs = store.getState().tcoInputs;
        const tr = getTCOTranslations();
        
        container.innerHTML = `
            <div class="card">
                <h3>${tr.assumptions}</h3>
                <p class="mb-0">${tr.adjustInputs}</p>
            </div>
            
            <div class="intro-grid">
                <div class="card">
                    <h4>${tr.teamSetup}</h4>
                    <div class="form-group">
                        <label for="tco-team-size">
                            <span class="tooltip-label" data-tooltip="${tr.teamSizeTooltip}">
                                ${tr.teamSize} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-team-size" 
                            min="1" 
                            max="50" 
                            value="${inputs.teamSize}"
                            data-field="teamSize"
                        >
                    </div>
                    <div class="form-group">
                        <label for="tco-blended-rate">
                            <span class="tooltip-label" data-tooltip="${tr.avgMonthlySalaryTooltip}">
                                ${tr.avgMonthlySalary} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-blended-rate" 
                            min="1000" 
                            max="50000" 
                            step="1000"
                            value="${inputs.blendedRate}"
                            data-field="blendedRate"
                        >
                    </div>
                    <div class="form-group">
                        <label for="tco-setup-months">
                            <span class="tooltip-label" data-tooltip="${tr.setupMonthsTooltip}">
                                ${tr.setupMonths} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-setup-months" 
                            min="0" 
                            max="12" 
                            value="${inputs.setupMonths}"
                            data-field="setupMonths"
                        >
                    </div>
                </div>
                
                <div class="card">
                    <h4>${tr.velocityMaintenance}</h4>
                    <div class="form-group">
                        <label for="tco-vanilla-velocity">
                            <span class="tooltip-label" data-tooltip="${tr.vanillaVelocityTooltip}">
                                ${tr.vanillaVelocity} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-vanilla-velocity" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value="${inputs.vanillaVelocity}"
                            data-field="vanillaVelocity"
                        >
                        <small style="color: var(--color-text-muted);">${tr.baselineText}</small>
                    </div>
                    <div class="form-group">
                        <label for="tco-dotnet-velocity">
                            <span class="tooltip-label" data-tooltip="${tr.dotnetVelocityTooltip}">
                                ${tr.dotnetVelocity} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-dotnet-velocity" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value="${inputs.dotnetVelocity}"
                            data-field="dotnetVelocity"
                        >
                        <small style="color: var(--color-text-muted);">${tr.baselineText}</small>
                    </div>
                    <div class="form-group">
                        <label for="tco-year1-maintenance">
                            <span class="tooltip-label" data-tooltip="${tr.year1MaintenanceTooltip}">
                                ${tr.year1Maintenance} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-year1-maintenance" 
                            min="0" 
                            max="100" 
                            value="${inputs.year1Maintenance}"
                            data-field="year1Maintenance"
                        >
                    </div>
                    <div class="form-group">
                        <label for="tco-year3-maintenance">
                            <span class="tooltip-label" data-tooltip="${tr.year3MaintenanceTooltip}">
                                ${tr.year3Maintenance} ℹ️
                            </span>
                        </label>
                        <input 
                            type="number" 
                            id="tco-year3-maintenance" 
                            min="0" 
                            max="100" 
                            value="${inputs.year3Maintenance}"
                            data-field="year3Maintenance"
                        >
                    </div>
                </div>
            </div>
            
            <div id="tco-results"></div>
        `;
        
        // Attach input listeners
        const inputElements = container.querySelectorAll('input');
        inputElements.forEach(input => {
            input.addEventListener('input', handleTCOInputChange);
        });
        
        // Calculate and render results
        renderTCOResults(container);
    }

    function handleTCOInputChange(e) {
        const field = e.target.dataset.field;
        let value = parseFloat(e.target.value);
        
        if (isNaN(value)) return;
        
        const inputs = { ...store.getState().tcoInputs };
        inputs[field] = value;
        
        store.setState({ tcoInputs: inputs });
    }

    function renderTCOResults(container) {
        const inputs = store.getState().tcoInputs;
        const resultsContainer = container.querySelector('#tco-results');
        const tr = getTCOTranslations();
        
        // Calculate costs
        const monthlyBurnRate = inputs.teamSize * inputs.blendedRate;
        
        // Vanilla JS costs
        const vanillaSetupCost = (inputs.setupMonths * 0.5) * monthlyBurnRate; // Less setup
        const vanillaBuildMonths = 12 / inputs.vanillaVelocity;
        const vanillaBuildCost = vanillaBuildMonths * monthlyBurnRate;
        const vanillaTotalBuild = vanillaSetupCost + vanillaBuildCost;
        const vanillaYear1Maint = vanillaTotalBuild * (inputs.year1Maintenance / 100);
        const vanillaYear2Maint = vanillaTotalBuild * ((inputs.year1Maintenance + inputs.year3Maintenance) / 2 / 100);
        const vanillaYear3Maint = vanillaTotalBuild * (inputs.year3Maintenance / 100);
        const vanillaYear1Total = vanillaTotalBuild + vanillaYear1Maint;
        const vanillaYear2Total = vanillaTotalBuild + vanillaYear1Maint + vanillaYear2Maint;
        const vanillaYear3Total = vanillaTotalBuild + (vanillaYear1Maint + vanillaYear2Maint + vanillaYear3Maint);
        
        // .NET + SPA costs
        const dotnetSetupCost = inputs.setupMonths * monthlyBurnRate; // Full setup
        const dotnetBuildMonths = 12 / inputs.dotnetVelocity;
        const dotnetBuildCost = dotnetBuildMonths * monthlyBurnRate;
        const dotnetTotalBuild = dotnetSetupCost + dotnetBuildCost;
        const dotnetYear1Maint = dotnetTotalBuild * (inputs.year1Maintenance / 100);
        const dotnetYear2Maint = dotnetTotalBuild * ((inputs.year1Maintenance + inputs.year3Maintenance) / 2 / 100);
        const dotnetYear3Maint = dotnetTotalBuild * (inputs.year3Maintenance / 100);
        const dotnetYear1Total = dotnetTotalBuild + dotnetYear1Maint;
        const dotnetYear2Total = dotnetTotalBuild + dotnetYear1Maint + dotnetYear2Maint;
        const dotnetYear3Total = dotnetTotalBuild + (dotnetYear1Maint + dotnetYear2Maint + dotnetYear3Maint);
        
        const maxYear1 = Math.max(vanillaYear1Total, dotnetYear1Total);
        const maxYear2 = Math.max(vanillaYear2Total, dotnetYear2Total);
        const maxYear3 = Math.max(vanillaYear3Total, dotnetYear3Total);
        
        const setupLabel = currentLang === 'ar' ? 'إعداد' : 'Setup';
        const buildLabel = currentLang === 'ar' ? 'بناء' : 'Build';
        const maintLabel = currentLang === 'ar' ? 'صيانة' : 'Maint';
        const totalThroughYear = currentLang === 'ar' ? 'الإجمالي حتى السنة' : 'Total through Year';
        
        resultsContainer.innerHTML = `
            <div class="card" style="margin-top: var(--spacing-xl);">
                <h3>${tr.costBreakdown}</h3>
                
                <div class="chart-container">
                    <h4>${tr.year1Total}</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.vanillaJS}</strong></span>
                                <span>${formatNumber(vanillaYear1Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    ${setupLabel}: ${formatNumber(vanillaSetupCost)}K | ${buildLabel}: ${formatNumber(vanillaBuildCost)}K | ${maintLabel}: ${formatNumber(vanillaYear1Maint)}K
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.dotnetSPA}</strong></span>
                                <span>${formatNumber(dotnetYear1Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    ${setupLabel}: ${formatNumber(dotnetSetupCost)}K | ${buildLabel}: ${formatNumber(dotnetBuildCost)}K | ${maintLabel}: ${formatNumber(dotnetYear1Maint)}K
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>${tr.year2Total} (${currentLang === 'ar' ? 'تراكمي' : 'Cumulative'})</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.vanillaJS}</strong></span>
                                <span>${formatNumber(vanillaYear2Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear2Total / maxYear2 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    ${totalThroughYear} 2
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.dotnetSPA}</strong></span>
                                <span>${formatNumber(dotnetYear2Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear2Total / maxYear2 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    ${totalThroughYear} 2
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>${tr.year3Total} (${currentLang === 'ar' ? 'تراكمي' : 'Cumulative'})</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.vanillaJS}</strong></span>
                                <span>${formatNumber(vanillaYear3Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear3Total / maxYear3 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    ${totalThroughYear} 3
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>${tr.dotnetSPA}</strong></span>
                                <span>${formatNumber(dotnetYear3Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear3Total / maxYear3 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    ${totalThroughYear} 3
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                    <h4>${currentLang === 'ar' ? 'الرؤى الرئيسية' : 'Key Insights'}</h4>
                    <ul>
                        <li>${currentLang === 'ar' ? 'الفرق في السنة 1' : 'Year 1 difference'}: <strong>${formatNumber(Math.abs(vanillaYear1Total - dotnetYear1Total))}K KWD</strong> 
                            ${vanillaYear1Total < dotnetYear1Total ? (currentLang === 'ar' ? '(Vanilla JS أرخص)' : '(Vanilla JS cheaper)') : (currentLang === 'ar' ? '(.NET + SPA أرخص)' : '(.NET + SPA cheaper)')}</li>
                        <li>${currentLang === 'ar' ? 'الفرق في السنة 2' : 'Year 2 difference'}: <strong>${formatNumber(Math.abs(vanillaYear2Total - dotnetYear2Total))}K KWD</strong> 
                            ${vanillaYear2Total < dotnetYear2Total ? (currentLang === 'ar' ? '(Vanilla JS أرخص)' : '(Vanilla JS cheaper)') : (currentLang === 'ar' ? '(.NET + SPA أرخص)' : '(.NET + SPA cheaper)')}</li>
                        <li>${currentLang === 'ar' ? 'الفرق في السنة 3' : 'Year 3 difference'}: <strong>${formatNumber(Math.abs(vanillaYear3Total - dotnetYear3Total))}K KWD</strong> 
                            ${vanillaYear3Total < dotnetYear3Total ? (currentLang === 'ar' ? '(Vanilla JS أرخص)' : '(Vanilla JS cheaper)') : (currentLang === 'ar' ? '(.NET + SPA أرخص)' : '(.NET + SPA cheaper)')}</li>
                        <li>${currentLang === 'ar' ? 'معدل الحرق الشهري' : 'Monthly burn rate'}: <strong>${formatNumber(monthlyBurnRate)}K KWD</strong></li>
                        <li>${currentLang === 'ar' ? 'وقت بناء Vanilla JS' : 'Vanilla JS build time'}: <strong>${vanillaBuildMonths.toFixed(1)} ${currentLang === 'ar' ? 'أشهر' : 'months'}</strong></li>
                        <li>${currentLang === 'ar' ? 'وقت بناء .NET + SPA' : '.NET + SPA build time'}: <strong>${dotnetBuildMonths.toFixed(1)} ${currentLang === 'ar' ? 'أشهر' : 'months'}</strong></li>
                    </ul>
                    <p><em>${currentLang === 'ar' ? 'ملاحظة: هذه تقديرات. التكاليف الفعلية تختلف بناءً على خبرة الفريق وتعقيد المتطلبات والعوامل التنظيمية.' : 'Note: These are estimates. Actual costs vary based on team experience, requirements complexity, and organizational factors.'}</em></p>
                </div>
            </div>
        `;
    }

    function initRiskRegister(container) {
        renderRiskRegister(container);
    }
    
    // Get Risk Register data (language-specific)
    function getRiskRegisterData() {
        if (currentLang === 'ar') {
            return [
                {
                    category: 'البنية المعمارية وجودة الكود',
                    vanillaRisk: 'الانحراف المعماري بدون حواجز إطار العمل',
                    vanillaProbability: 'عالي',
                    vanillaImpact: 'عالي',
                    vanillaMitigation: 'وضع معايير برمجية، تنفيذ عملية مراجعة الكود، إنشاء مكتبة أنماط',
                    dotnetRisk: 'الهندسة المفرطة بتجريدات غير ضرورية',
                    dotnetProbability: 'متوسط',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'الحفاظ على بنية عملية، تجنب التحسين المبكر، مراجعات معمارية منتظمة'
                },
                {
                    category: 'سرعة التطوير',
                    vanillaRisk: 'تكرار الكود وأنماط غير متسقة',
                    vanillaProbability: 'متوسط',
                    vanillaImpact: 'متوسط',
                    vanillaMitigation: 'إنشاء مكتبة مكونات قابلة لإعادة الاستخدام، فرض مبادئ DRY',
                    dotnetRisk: 'تعقيد سلسلة الأدوات يبطئ التطوير',
                    dotnetProbability: 'متوسط',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'الاستثمار في التدريب، إنشاء CI/CD مبكراً، توثيق إجراءات الإعداد'
                },
                {
                    category: 'الفريق والمعرفة',
                    vanillaRisk: 'مخاطر الشخص الرئيسي (إلمام محدود للفريق)',
                    vanillaProbability: 'متوسط',
                    vanillaImpact: 'عالي',
                    vanillaMitigation: 'التدريب المتبادل، التوثيق الشامل، البرمجة الزوجية',
                    dotnetRisk: 'منحنى تعلم حاد للفريق',
                    dotnetProbability: 'متوسط',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'برنامج تدريب منظم، وقت مخصص للتعلم، الإرشاد'
                },
                {
                    category: 'الصيانة والتحديثات',
                    vanillaRisk: 'مشاكل توافق المتصفح مع الميزات الجديدة',
                    vanillaProbability: 'منخفض',
                    vanillaImpact: 'متوسط',
                    vanillaMitigation: 'استخدام التحسين التدريجي، polyfills، اختبار منتظم للمتصفحات',
                    dotnetRisk: 'تقلبات ترقية إطار العمل والتغييرات الجذرية',
                    dotnetProbability: 'متوسط',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'تثبيت الإصدارات، ترقيات تدريجية، الحفاظ على دليل الترقية'
                },
                {
                    category: 'الأداء',
                    vanillaRisk: 'تدهور الأداء مع نمو الميزات',
                    vanillaProbability: 'متوسط',
                    vanillaImpact: 'متوسط',
                    vanillaMitigation: 'ميزانيات الأداء، التحميل الكسول، تقسيم الكود، عمليات تدقيق منتظمة',
                    dotnetRisk: 'انتفاخ حجم الحزمة يؤثر على وقت التحميل',
                    dotnetProbability: 'منخفض',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'تقسيم الكود، التحميل الكسول، تحليل الحزم في CI، tree shaking'
                },
                {
                    category: 'قابلية التوسع',
                    vanillaRisk: 'صعوبة توسيع قاعدة الكود مع نمو الفريق',
                    vanillaProbability: 'عالي',
                    vanillaImpact: 'عالي',
                    vanillaMitigation: 'بنية معمارية نمطية، اتفاقيات واضحة، دليل أسلوب شامل',
                    dotnetRisk: 'التعقيد يزيد من وقت الإعداد',
                    dotnetProbability: 'متوسط',
                    dotnetImpact: 'متوسط',
                    dotnetMitigation: 'توثيق ممتاز، نظام أصدقاء الإعداد، مهام البداية'
                }
            ];
        }
        // English version
        return [
            {
                category: 'Architecture & Code Quality',
                vanillaRisk: 'Architectural drift without framework guardrails',
                vanillaProbability: 'High',
                vanillaImpact: 'High',
                vanillaMitigation: 'Establish coding standards, implement code review process, create pattern library',
                dotnetRisk: 'Over-engineering with unnecessary abstractions',
                dotnetProbability: 'Medium',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Keep architecture pragmatic, avoid premature optimization, regular architecture reviews'
            },
            {
                category: 'Development Velocity',
                vanillaRisk: 'Code duplication and inconsistent patterns',
                vanillaProbability: 'Medium',
                vanillaImpact: 'Medium',
                vanillaMitigation: 'Create reusable component library, enforce DRY principles',
                dotnetRisk: 'Toolchain complexity slowing development',
                dotnetProbability: 'Medium',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Invest in training, establish CI/CD early, document setup procedures'
            },
            {
                category: 'Team & Knowledge',
                vanillaRisk: 'Key-person risk (limited team familiarity)',
                vanillaProbability: 'Medium',
                vanillaImpact: 'High',
                vanillaMitigation: 'Cross-training, comprehensive documentation, pair programming',
                dotnetRisk: 'Steep learning curve for team',
                dotnetProbability: 'Medium',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Structured training program, dedicated learning time, mentorship'
            },
            {
                category: 'Maintenance & Updates',
                vanillaRisk: 'Browser compatibility issues with new features',
                vanillaProbability: 'Low',
                vanillaImpact: 'Medium',
                vanillaMitigation: 'Use progressive enhancement, polyfills, regular browser testing',
                dotnetRisk: 'Framework upgrade churn and breaking changes',
                dotnetProbability: 'Medium',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Pin versions, gradual upgrades, maintain upgrade runbook'
            },
            {
                category: 'Performance',
                vanillaRisk: 'Performance degradation with feature growth',
                vanillaProbability: 'Medium',
                vanillaImpact: 'Medium',
                vanillaMitigation: 'Performance budgets, lazy loading, code splitting, regular audits',
                dotnetRisk: 'Bundle size bloat impacting load time',
                dotnetProbability: 'Low',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Code splitting, lazy loading, bundle analysis in CI, tree shaking'
            },
            {
                category: 'Scalability',
                vanillaRisk: 'Difficulty scaling codebase with team growth',
                vanillaProbability: 'High',
                vanillaImpact: 'High',
                vanillaMitigation: 'Modular architecture, clear conventions, comprehensive style guide',
                dotnetRisk: 'Complexity increasing onboarding time',
                dotnetProbability: 'Medium',
                dotnetImpact: 'Medium',
                dotnetMitigation: 'Excellent documentation, onboarding buddy system, starter tasks'
            }
        ];
    }
    
    function renderRiskRegister(container) {
        const riskCategories = getRiskRegisterData();
        
        const getRiskBadgeClass = (level) => {
            const levelLower = level.toLowerCase();
            if (levelLower === 'high' || levelLower === 'عالي') return 'risk-high';
            if (levelLower === 'medium' || levelLower === 'متوسط') return 'risk-medium';
            if (levelLower === 'low' || levelLower === 'منخفض') return 'risk-low';
            return '';
        };
        
        const labels = currentLang === 'ar' ? {
            risk: 'المخاطر',
            probability: 'الاحتمالية',
            impact: 'التأثير',
            mitigation: 'التخفيف',
            vs: 'مقابل'
        } : {
            risk: 'Risk',
            probability: 'Probability',
            impact: 'Impact',
            mitigation: 'Mitigation',
            vs: 'VS'
        };
        
        const riskHTML = riskCategories.map(cat => `
            <div class="risk-comparison-card">
                <h3 class="risk-category-title">${cat.category}</h3>
                
                <div class="risk-comparison-grid">
                    <div class="risk-approach-section vanilla-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟦</span> Vanilla JS + Web API
                        </h4>
                        
                        <div class="risk-detail">
                            <div class="risk-label">${labels.risk}:</div>
                            <div class="risk-content">${cat.vanillaRisk}</div>
                        </div>
                        
                        <div class="risk-metrics">
                            <div class="risk-metric">
                                <span class="metric-label">${labels.probability}:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.vanillaProbability)}">${cat.vanillaProbability}</span>
                            </div>
                            <div class="risk-metric">
                                <span class="metric-label">${labels.impact}:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.vanillaImpact)}">${cat.vanillaImpact}</span>
                            </div>
                        </div>
                        
                        <div class="risk-detail">
                            <div class="risk-label">${labels.mitigation}:</div>
                            <div class="risk-content">${cat.vanillaMitigation}</div>
                        </div>
                    </div>
                    
                    <div class="risk-divider">${labels.vs}</div>
                    
                    <div class="risk-approach-section dotnet-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟪</span> .NET Core + SPA
                        </h4>
                        
                        <div class="risk-detail">
                            <div class="risk-label">${labels.risk}:</div>
                            <div class="risk-content">${cat.dotnetRisk}</div>
                        </div>
                        
                        <div class="risk-metrics">
                            <div class="risk-metric">
                                <span class="metric-label">${labels.probability}:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.dotnetProbability)}">${cat.dotnetProbability}</span>
                            </div>
                            <div class="risk-metric">
                                <span class="metric-label">${labels.impact}:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.dotnetImpact)}">${cat.dotnetImpact}</span>
                            </div>
                        </div>
                        
                        <div class="risk-detail">
                            <div class="risk-label">${labels.mitigation}:</div>
                            <div class="risk-content">${cat.dotnetMitigation}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="card">
                <h2>⚠️ ${currentLang === 'ar' ? 'تحليل المخاطر' : 'Risk Analysis'}</h2>
                <p>${currentLang === 'ar' 
                    ? 'مقارنة شاملة للمخاطر عبر المجالات الرئيسية. كل فئة تعرض المخاطر المحتملة، احتماليتها، تأثيرها، واستراتيجيات التخفيف لكلا النهجين.'
                    : 'Comprehensive risk comparison across key areas. Each category shows potential risks, their likelihood, impact, and mitigation strategies for both approaches.'}</p>
            </div>
            
            ${riskHTML}
        `;
    }

    // Get Hiring data (language-specific)
    function getHiringData() {
        if (currentLang === 'ar') {
            return [
                {
                    category: 'حجم مجموعة المواهب',
                    vanillaMetric: 'كبير',
                    vanillaDetails: 'JavaScript هي اللغة الأكثر استخداماً. ومع ذلك، المطورون ذوو المهارات القوية في vanilla JS (بدون اعتماد على إطار عمل) أقل شيوعاً.',
                    vanillaProsCons: {
                        pros: ['مجموعة مواهب عالمية ضخمة', 'JS يُدرّس في كل مكان', 'سهل إيجاد مطورين مبتدئين'],
                        cons: ['معظم المطورين يعتمدون على أطر العمل', 'عدد أقل من خبراء vanilla JS المتقدمين', 'قد تحتاج للتدريب على الأنماط المخصصة']
                    },
                    dotnetMetric: 'كبير جداً',
                    dotnetDetails: 'مطورو .NET + React/Angular متوفرون بكثرة، خاصة في أسواق المؤسسات. نظام بيئي راسخ مع العديد من المحترفين ذوي الخبرة.',
                    dotnetProsCons: {
                        pros: ['مجموعة مواهب ضخمة في المؤسسات', 'مهارات وأنماط موحدة', 'العديد من المطورين المتقدمين متاحين'],
                        cons: ['توقعات راتب أعلى', 'قد يكونون مؤهلين بشكل مفرط للمهام البسيطة', 'معرفة خاصة بإطار العمل مطلوبة']
                    }
                },
                {
                    category: 'وقت التوظيف',
                    vanillaMetric: '4-8 أسابيع',
                    vanillaDetails: 'إيجاد مطورين مرتاحين بدون أطر عمل يستغرق وقتاً أطول. تحتاج لتقييم معرفة JavaScript الخام ومهارات حل المشكلات.',
                    vanillaProsCons: {
                        pros: ['يمكن توظيف مطوري ويب عامين', 'مرونة في متطلبات المهارات', 'يمكن تدريب المبتدئين المتحمسين'],
                        cons: ['أصعب في تقييم مهارات vanilla JS', 'مقابلات تقنية أطول', 'قد تحتاج تحديات برمجية']
                    },
                    dotnetMetric: '2-6 أسابيع',
                    dotnetDetails: 'أسرع في إيجاد مرشحين بخبرة محددة في إطار العمل. العديد من المطورين يبحثون بنشاط عن وظائف .NET.',
                    dotnetProsCons: {
                        pros: ['شهادات إطار العمل متاحة', 'مشاريع المحفظة سهلة التحقق', 'تقييم أسرع للمهارات'],
                        cons: ['منافسة عالية على أفضل المواهب', 'توافق إصدارات إطار العمل', 'قد تكون المعرفة قديمة']
                    }
                },
                {
                    category: 'نطاق الراتب (الكويت)',
                    vanillaMetric: '800-2,000 د.ك/شهرياً',
                    vanillaDetails: 'مطورو vanilla JS متوسطو المستوى: 1,000-1,500 د.ك. متقدمون: 1,500-2,000 د.ك. تكلفة أقل بسبب حزمة تقنية أبسط.',
                    vanillaProsCons: {
                        pros: ['توقعات راتب أقل', 'فعّال من حيث التكلفة للفرق الصغيرة', 'قيمة جيدة للمطورين المهرة'],
                        cons: ['أفضل المواهب قد يفضلون العمل بإطار عمل', 'موهبة متقدمة محدودة', 'قد تحتاج لتبرير نهج بدون إطار عمل']
                    },
                    dotnetMetric: '1,200-2,500 د.ك/شهرياً',
                    dotnetDetails: 'مطورو .NET + SPA متوسطو المستوى: 1,500-2,000 د.ك. متقدمون: 2,000-2,500 د.ك. علاوة لمهارات المؤسسات.',
                    dotnetProsCons: {
                        pros: ['أسعار سوق واضحة', 'يجذب المطورين ذوي الخبرة', 'خلفية مؤسسية شائعة'],
                        cons: ['تكلفة أعلى بنسبة 20-30%', 'تضخم الرواتب في السوق', 'قد يتوقعون مزايا الشركات']
                    }
                },
                {
                    category: 'وقت الإعداد',
                    vanillaMetric: '2-4 أسابيع',
                    vanillaDetails: 'سريع لمطوري JS ذوي الخبرة. منحنى التعلم الرئيسي هو فهم الأنماط المخصصة وقرارات البنية المعمارية.',
                    vanillaProsCons: {
                        pros: ['لا يوجد إطار عمل للتعلم', 'بنية كود أبسط', 'أسرع لذوي الأساسيات القوية'],
                        cons: ['تحتاج لتعلم الأنماط المخصصة', 'يتطلب تدريب مراجعة الكود', 'التوثيق حاسم']
                    },
                    dotnetMetric: '4-8 أسابيع',
                    dotnetDetails: 'أطول بسبب تعقيد سلسلة الأدوات. تحتاج لفهم .NET الخلفية، إطار SPA، عمليات البناء، وخطوط النشر.',
                    dotnetProsCons: {
                        pros: ['مواد إعداد موحدة', 'العديد من الدروس متاحة', 'دعم المجتمع قوي'],
                        cons: ['منحنى تعلم حاد', 'أدوات متعددة للإتقان', 'إعداد البيئة معقد']
                    }
                },
                {
                    category: 'متطلبات التدريب',
                    vanillaMetric: 'معتدل',
                    vanillaDetails: 'التركيز على أساسيات JavaScript، أنماط البنية المعمارية المخصصة، واتفاقيات الفريق. التعلم المستمر لمعايير الويب.',
                    vanillaProsCons: {
                        pros: ['مهارات قابلة للنقل', 'التركيز على المفاهيم الأساسية', 'لا يوجد قفل على إطار عمل'],
                        cons: ['تحتاج لإنشاء مواد تدريب', 'موارد خارجية محدودة', 'انضباط ذاتي مطلوب']
                    },
                    dotnetMetric: 'عالي',
                    dotnetDetails: 'التدريب الرسمي غالباً مطلوب. تحديثات إطار العمل تتطلب تعليماً مستمراً. شهادات متعددة متاحة.',
                    dotnetProsCons: {
                        pros: ['مسارات تعلم منظمة', 'شهادات رسمية', 'موارد تدريب وفيرة'],
                        cons: ['دورات تدريب مكلفة', 'تحديثات متكررة مطلوبة', 'أطر عمل متعددة للتعلم']
                    }
                },
                {
                    category: 'اتجاه الطلب في السوق',
                    vanillaMetric: 'متنامي',
                    vanillaDetails: 'اهتمام متزايد بالتطوير الخالي من أطر العمل. التركيز على الأداء والبساطة يكتسب زخماً.',
                    vanillaProsCons: {
                        pros: ['مهارات مقاومة للمستقبل', 'سوق يركز على الأداء', 'اتجاه نحو تقليل التعقيد'],
                        cons: ['لا يزال نهجاً متخصصاً', 'إعلانات وظائف أقل', 'تحتاج للترويج للنهج']
                    },
                    dotnetMetric: 'مستقر/عالي',
                    dotnetDetails: 'طلب مرتفع باستمرار في سوق المؤسسات. اعتماد .NET Core ينمو بثبات. React/Angular لا يزالان شائعين.',
                    dotnetProsCons: {
                        pros: ['طلب قوي في المؤسسات', 'سوق عمل مستقر', 'فرص كثيرة'],
                        cons: ['منافسة إطار العمل (React vs Angular vs Vue)', 'تفتت الإصدارات', 'تشبع السوق في بعض المناطق']
                    }
                }
            ];
        }
        // English version
        return [
            {
                category: 'Talent Pool Size',
                vanillaMetric: 'Large',
                vanillaDetails: 'JavaScript is the most widely used language. However, developers with strong vanilla JS skills (no framework dependency) are less common.',
                vanillaProsCons: {
                    pros: ['Massive global talent pool', 'JS is taught everywhere', 'Easy to find junior developers'],
                    cons: ['Most developers rely on frameworks', 'Fewer senior vanilla JS experts', 'May need to train on custom patterns']
                },
                dotnetMetric: 'Very Large',
                dotnetDetails: '.NET + React/Angular developers are abundant, especially in enterprise markets. Well-established ecosystem with many experienced professionals.',
                dotnetProsCons: {
                    pros: ['Huge enterprise talent pool', 'Standardized skills and patterns', 'Many senior developers available'],
                    cons: ['Higher salary expectations', 'May be over-qualified for simple tasks', 'Framework-specific knowledge needed']
                }
            },
            {
                category: 'Time to Hire',
                vanillaMetric: '4-8 weeks',
                vanillaDetails: 'Finding developers comfortable without frameworks takes longer. Need to assess raw JavaScript knowledge and problem-solving skills.',
                vanillaProsCons: {
                    pros: ['Can hire general web developers', 'Flexibility in skill requirements', 'Can train motivated juniors'],
                    cons: ['Harder to assess vanilla JS skills', 'Longer technical interviews', 'May need coding challenges']
                },
                dotnetMetric: '2-6 weeks',
                dotnetDetails: 'Faster to find candidates with specific framework experience. Many developers actively seeking .NET positions.',
                dotnetProsCons: {
                    pros: ['Framework certifications available', 'Portfolio projects easy to verify', 'Faster skill assessment'],
                    cons: ['High competition for top talent', 'Framework version compatibility', 'May have outdated knowledge']
                }
            },
            {
                category: 'Salary Range (Kuwait)',
                vanillaMetric: '800-2,000 KWD/month',
                vanillaDetails: 'Mid-level vanilla JS developers: 1,000-1,500 KWD. Senior: 1,500-2,000 KWD. Lower cost due to simpler stack.',
                vanillaProsCons: {
                    pros: ['Lower salary expectations', 'Cost-effective for small teams', 'Good value for skilled developers'],
                    cons: ['Top talent may prefer framework work', 'Limited senior talent', 'May need to justify no-framework approach']
                },
                dotnetMetric: '1,200-2,500 KWD/month',
                dotnetDetails: 'Mid-level .NET + SPA developers: 1,500-2,000 KWD. Senior: 2,000-2,500 KWD. Premium for enterprise skills.',
                dotnetProsCons: {
                    pros: ['Clear market rates', 'Attracts experienced developers', 'Enterprise background common'],
                    cons: ['20-30% higher cost', 'Salary inflation in market', 'May expect corporate benefits']
                }
            },
            {
                category: 'Onboarding Time',
                vanillaMetric: '2-4 weeks',
                vanillaDetails: 'Quick for experienced JS developers. Main learning curve is understanding custom patterns and architecture decisions.',
                vanillaProsCons: {
                    pros: ['No framework to learn', 'Simpler codebase structure', 'Faster for strong fundamentals'],
                    cons: ['Need to learn custom patterns', 'Requires code review training', 'Documentation is critical']
                },
                dotnetMetric: '4-8 weeks',
                dotnetDetails: 'Longer due to toolchain complexity. Need to understand .NET backend, SPA framework, build processes, and deployment pipelines.',
                dotnetProsCons: {
                    pros: ['Standardized onboarding materials', 'Many tutorials available', 'Community support strong'],
                    cons: ['Steep learning curve', 'Multiple tools to master', 'Environment setup complex']
                }
            },
            {
                category: 'Training Requirements',
                vanillaMetric: 'Moderate',
                vanillaDetails: 'Focus on JavaScript fundamentals, custom architecture patterns, and team conventions. Continuous learning of web standards.',
                vanillaProsCons: {
                    pros: ['Transferable skills', 'Focus on core concepts', 'No framework lock-in'],
                    cons: ['Need to create training materials', 'Limited external resources', 'Self-discipline required']
                },
                dotnetMetric: 'High',
                dotnetDetails: 'Formal training often needed. Framework updates require ongoing education. Multiple certifications available.',
                dotnetProsCons: {
                    pros: ['Structured learning paths', 'Official certifications', 'Abundant training resources'],
                    cons: ['Expensive training courses', 'Frequent updates needed', 'Multiple frameworks to learn']
                }
            },
            {
                category: 'Market Demand Trend',
                vanillaMetric: 'Growing',
                vanillaDetails: 'Increasing interest in framework-free development. Focus on performance and simplicity gaining traction.',
                vanillaProsCons: {
                    pros: ['Future-proof skills', 'Performance-focused market', 'Reduced complexity trend'],
                    cons: ['Still niche approach', 'Fewer job postings', 'Need to evangelize approach']
                },
                dotnetMetric: 'Stable/High',
                dotnetDetails: 'Consistently high demand in enterprise market. .NET Core adoption growing steadily. React/Angular remain popular.',
                dotnetProsCons: {
                    pros: ['Strong enterprise demand', 'Stable job market', 'Many opportunities'],
                    cons: ['Framework competition (React vs Angular vs Vue)', 'Version fragmentation', 'Market saturation in some areas']
                }
            }
        ];
    }

    function renderHiringContent(container) {
        const hiringCategories = getHiringData();
        
        const labels = currentLang === 'ar' ? {
            advantages: '✅ المزايا',
            challenges: '⚠️ التحديات',
            vs: 'مقابل'
        } : {
            advantages: '✅ Advantages',
            challenges: '⚠️ Challenges',
            vs: 'VS'
        };
        
        const hiringHTML = hiringCategories.map(cat => `
            <div class="hiring-comparison-card">
                <h3 class="hiring-category-title">${cat.category}</h3>
                
                <div class="hiring-metrics-bar">
                    <div class="hiring-metric-item">
                        <span class="metric-label">🟦 Vanilla JS:</span>
                        <span class="metric-value">${cat.vanillaMetric}</span>
                    </div>
                    <div class="hiring-metric-item">
                        <span class="metric-label">🟪 .NET + SPA:</span>
                        <span class="metric-value">${cat.dotnetMetric}</span>
                    </div>
                </div>
                
                <div class="hiring-comparison-grid">
                    <div class="hiring-approach-section vanilla-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟦</span> Vanilla JS + Web API
                        </h4>
                        
                        <p class="hiring-details">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-grid">
                            <div class="pros-section">
                                <h5 class="pros-title">${labels.advantages}</h5>
                                <ul class="pros-list">
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-section">
                                <h5 class="cons-title">${labels.challenges}</h5>
                                <ul class="cons-list">
                                    ${cat.vanillaProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hiring-divider">${labels.vs}</div>
                    
                    <div class="hiring-approach-section dotnet-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟪</span> .NET Core + SPA
                        </h4>
                        
                        <p class="hiring-details">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-grid">
                            <div class="pros-section">
                                <h5 class="pros-title">${labels.advantages}</h5>
                                <ul class="pros-list">
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-section">
                                <h5 class="cons-title">${labels.challenges}</h5>
                                <ul class="cons-list">
                                    ${cat.dotnetProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="card">
                <h2>👥 ${currentLang === 'ar' ? 'التوظيف وتوفر السوق' : 'Hiring & Market Availability'}</h2>
                <p>${currentLang === 'ar' 
                    ? 'مقارنة تفصيلية لاستقطاب المواهب، التكاليف، وديناميكيات السوق لكلا النهجين التقنيين في سوق الكويت.'
                    : 'Detailed comparison of talent acquisition, costs, and market dynamics for both technology approaches in the Kuwait market.'}</p>
            </div>
            
            ${hiringHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>📊 ${currentLang === 'ar' ? 'ملخص التوصية' : 'Summary Recommendation'}</h3>
                <div class="summary-grid">
                    <div>
                        <h4>${currentLang === 'ar' ? 'اختر Vanilla JS إذا:' : 'Choose Vanilla JS if:'}</h4>
                        <ul>
                            <li>${currentLang === 'ar' ? 'الميزانية محدودة (رواتب أقل)' : 'Budget is tight (lower salaries)'}</li>
                            <li>${currentLang === 'ar' ? 'فريق صغير (2-5 مطورين)' : 'Small team (2-5 developers)'}</li>
                            <li>${currentLang === 'ar' ? 'لديك قيادة تقنية قوية' : 'You have strong technical leadership'}</li>
                            <li>${currentLang === 'ar' ? 'التحكم بالتكلفة طويلة الأجل أولوية' : 'Long-term cost control is priority'}</li>
                        </ul>
                    </div>
                    <div>
                        <h4>${currentLang === 'ar' ? 'اختر .NET + SPA إذا:' : 'Choose .NET + SPA if:'}</h4>
                        <ul>
                            <li>${currentLang === 'ar' ? 'تحتاج للتوظيف بسرعة' : 'Need to hire quickly'}</li>
                            <li>${currentLang === 'ar' ? 'توسيع الفريق بسرعة (6+ مطورين)' : 'Scaling team rapidly (6+ developers)'}</li>
                            <li>${currentLang === 'ar' ? 'تريد مهارات موحدة' : 'Want standardized skills'}</li>
                            <li>${currentLang === 'ar' ? 'ميزات المؤسسات مهمة' : 'Enterprise features are important'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    // Get Security data (language-specific)
    function getSecurityData() {
        if (currentLang === 'ar') {
            return [
                {
                    category: 'المصادقة والتفويض',
                    vanillaApproach: 'تنفيذ يدوي',
                    vanillaDetails: 'بناء معالجة JWT/الجلسات من الصفر. تنفيذ التحكم بالوصول القائم على الأدوار (RBAC) يدوياً. سيطرة كاملة على تدفق المصادقة.',
                    vanillaProsCons: {
                        pros: ['مرونة كاملة', 'لا انتفاخ من ميزات غير مستخدمة', 'تعلم الأمان بعمق', 'مخصص للاحتياجات الدقيقة'],
                        cons: ['سهل ارتكاب الأخطاء', 'تحتاج خبرة أمان', 'مزيد من الاختبار مطلوب', 'وقت تنفيذ أطول']
                    },
                    vanillaComplexity: 'عالي',
                    dotnetApproach: 'ASP.NET Identity مدمج',
                    dotnetDetails: 'ASP.NET Core Identity يوفر نظام مصادقة كامل. دعم مدمج لـ OAuth، JWT، cookies، ومقدمي خدمات خارجيين (Google، Microsoft، إلخ).',
                    dotnetProsCons: {
                        pros: ['أمان مُختبر في المعارك', 'تجزئة كلمات المرور مدمجة', 'مقدمو OAuth جاهزون', 'توثيق شامل'],
                        cons: ['منحنى تعلم للتكوين', 'قد يتضمن ميزات غير ضرورية', 'مرونة أقل', 'اعتماد على إطار العمل']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'الحماية من XSS',
                    vanillaApproach: 'تطهير يدوي',
                    vanillaDetails: 'يجب تطهير/تنظيف جميع مدخلات المستخدم يدوياً قبل العرض. استخدام textContent أو createElement بدلاً من innerHTML. تنفيذ سياسة أمان المحتوى (CSP).',
                    vanillaProsCons: {
                        pros: ['تحكم مباشر بالتطهير', 'حمل أدنى', 'تعلم متجهات XSS بعمق', 'CSP سهل التنفيذ'],
                        cons: ['سهل نسيان التطهير', 'مراجعة الكود حاسمة', 'قوالب السلاسل محفوفة بالمخاطر', 'تدريب الفريق مطلوب']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'ترميز تلقائي',
                    dotnetDetails: 'قوالب Razor تقوم بترميز HTML تلقائياً. React/Angular يهربون القيم تلقائياً. حماية XSS مدمجة في إطار العمل.',
                    dotnetProsCons: {
                        pros: ['حماية تلقائية', 'صعب التجاوز', 'أمان على مستوى إطار العمل', 'أخطاء بشرية أقل'],
                        cons: ['قد يحتاج تدخل يدوي لـ HTML الخام', 'شعور زائف بالأمان', 'معرفة خاصة بإطار العمل', 'لا يزال يحتاج CSP']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'الحماية من CSRF',
                    vanillaApproach: 'نظام رموز مخصص',
                    vanillaDetails: 'تنفيذ رموز مضادة لـ CSRF يدوياً. توليد الرموز من الخادم، التحقق عند كل طلب يغير الحالة. استخدام SameSite cookies.',
                    vanillaProsCons: {
                        pros: ['تنفيذ خفيف', 'سيطرة كاملة على الرموز', 'فهم CSRF بعمق', 'يمكن تحسين لـ SPA'],
                        cons: ['يجب التنفيذ بشكل صحيح', 'إدارة الرموز معقدة', 'سهل تفويت نقاط النهاية', 'حمل الاختبار']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'مضاد التزوير مدمج',
                    dotnetDetails: '.NET Core لديه رموز مضادة للتزوير مدمجة. التحقق التلقائي على POST/PUT/DELETE. واجهات توليد رموز متوافقة مع SPA.',
                    dotnetProsCons: {
                        pros: ['توليد رموز تلقائي', 'تحقق بواسطة إطار العمل', 'مُختبر في الإنتاج', 'تكامل SPA جاهز'],
                        cons: ['تكوين مطلوب', 'قد يتعارض مع APIs', 'إعداد CORS مطلوب', 'حمل إطار العمل']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'منع حقن SQL',
                    vanillaApproach: 'استعلامات مُعلَّمة',
                    vanillaDetails: 'استخدام استعلامات مُعلَّمة أو عبارات محضّرة. ORM غير مطلوب - SQL مباشر مع هروب صحيح. التحقق اليدوي من جميع المدخلات.',
                    vanillaProsCons: {
                        pros: ['تحكم SQL مباشر', 'لا حمل ORM', 'فهم الاستعلامات بالكامل', 'تحسين الأداء سهل'],
                        cons: ['يجب تذكر المعلمات', 'سلاسل الدمج خطيرة', 'مراجعة الكود حاسمة', 'لا أمان للنوع']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'Entity Framework Core',
                    dotnetDetails: 'EF Core يستخدم استعلامات مُعلَّمة افتراضياً. LINQ يوفر استعلامات آمنة للنوع. حقن SQL مستحيل تقريباً مع الاستخدام الصحيح.',
                    dotnetProsCons: {
                        pros: ['معلمات تلقائية', 'أمان النوع', 'صعب ارتكاب الأخطاء', 'فحص وقت الترجمة'],
                        cons: ['طبقة تجريد ORM', 'SQL الخام لا يزال ممكناً', 'حمل الأداء', 'منحنى التعلم']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'تشفير البيانات',
                    vanillaApproach: 'مكتبات طرف ثالث',
                    vanillaDetails: 'استخدام مكتبات التشفير (Web Crypto API، CryptoJS). HTTPS مطلوب. تنفيذ التشفير لتخزين البيانات الحساسة.',
                    vanillaProsCons: {
                        pros: ['اختيار أفضل المكتبات', 'خيارات خفيفة', 'Web Crypto API مدمج', 'سيطرة كاملة'],
                        cons: ['فحص المكتبات مطلوب', 'التشفير صعب', 'إدارة المفاتيح معقدة', 'سهل إساءة الاستخدام']
                    },
                    vanillaComplexity: 'عالي',
                    dotnetApproach: 'تشفير مدمج',
                    dotnetDetails: '.NET لديه مساحة اسم System.Security.Cryptography شاملة. واجهة حماية البيانات لإدارة المفاتيح. مساعدي تشفير مدمجون.',
                    dotnetProsCons: {
                        pros: ['تشفير على مستوى المؤسسة', 'دعم تدوير المفاتيح', 'خيار امتثال FIPS', 'موثق جيداً'],
                        cons: ['واجهة معقدة', 'مبالغ فيه للاحتياجات البسيطة', 'تكوين مطلوب', 'ميزات خاصة بـ Windows']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'تدقيق الأمان والتسجيل',
                    vanillaApproach: 'تسجيل مخصص',
                    vanillaDetails: 'بناء نظام تسجيل أو استخدام مكتبات. تسجيل أحداث الأمان يدوياً. تنفيذ مسارات التدقيق للعمليات الحساسة.',
                    vanillaProsCons: {
                        pros: ['تسجيل ما تحتاجه بالضبط', 'حمل أدنى', 'تنسيق تدقيق مخصص', 'تكامل سهل'],
                        cons: ['سهل تفويت الأحداث', 'تحدي الاتساق', 'لا تحليل مدمج', 'تنفيذ يدوي']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'تسجيل مدمج + Identity',
                    dotnetDetails: 'تسجيل ASP.NET Core مدمج. Identity يتتبع أحداث المصادقة. Serilog/NLog للتسجيل المنظم. تكامل Application Insights.',
                    dotnetProsCons: {
                        pros: ['تسجيل منظم', 'أحداث المصادقة تلقائية', 'تكاملات عديدة', 'جاهز للإنتاج'],
                        cons: ['حمل التكوين', 'يمكن أن يكون مطولاً', 'تكاليف تخزين السجلات', 'بيانات حساسة في السجلات']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'أمان API',
                    vanillaApproach: 'تحديد معدل والتحقق يدوي',
                    vanillaDetails: 'تنفيذ تحديد المعدل يدوياً. التحقق من المدخلات على كل نقطة نهاية. تكوين CORS يدوي. إدارة مفاتيح API.',
                    vanillaProsCons: {
                        pros: ['تحكم دقيق', 'حمل أدنى', 'استراتيجيات مخصصة', 'محسّن للاحتياجات'],
                        cons: ['معقد للتنفيذ', 'يجب معالجة الحالات الحدية', 'الاختبار حاسم', 'عبء الصيانة']
                    },
                    vanillaComplexity: 'عالي',
                    dotnetApproach: 'Middleware والفلاتر',
                    dotnetDetails: 'تحديد المعدل مدمج (ASP.NET Core 7+). التحقق من النموذج تلقائي. CORS middleware جاهز. دعم إصدارات API.',
                    dotnetProsCons: {
                        pros: ['خط أنابيب Middleware', 'أمان تصريحي', 'تحديد المعدل مدمج', 'تكامل OpenAPI/Swagger'],
                        cons: ['معتمد على إطار العمل', 'تكوين معقد', 'حمل الأداء', 'ميزات مفرطة']
                    },
                    dotnetComplexity: 'منخفض'
                },
                {
                    category: 'الامتثال (GDPR، خصوصية البيانات)',
                    vanillaApproach: 'تنفيذ يدوي',
                    vanillaDetails: 'تنفيذ تصدير البيانات، الحذف، وتتبع الموافقة يدوياً. لافتات موافقة الكوكيز. تكامل سياسة الخصوصية.',
                    vanillaProsCons: {
                        pros: ['احتياجات امتثال دقيقة', 'لا ميزات غير ضرورية', 'سير عمل مخصص', 'تنفيذ شفاف'],
                        cons: ['خبرة قانونية مطلوبة', 'سهل تفويت المتطلبات', 'عبء التوثيق', 'مسار التدقيق يدوي']
                    },
                    vanillaComplexity: 'عالي',
                    dotnetApproach: 'مكتبات وقوالب',
                    dotnetDetails: 'Identity يوفر تصدير بيانات المستخدم. العديد من مكتبات GDPR متاحة. Middleware موافقة الكوكيز. قوالب الامتثال.',
                    dotnetProsCons: {
                        pros: ['قوالب الامتثال', 'تصدير بيانات المستخدم جاهز', 'إدارة الموافقة', 'صديق للتدقيق'],
                        cons: ['يجب التحقق من الاكتمال', 'موثوقية المكتبة', 'لا يزال يحتاج مراجعة قانونية', 'تكوين مطلوب']
                    },
                    dotnetComplexity: 'متوسط'
                }
            ];
        }
        // English version
        return [
            {
                category: 'Authentication & Authorization',
                vanillaApproach: 'Manual Implementation',
                vanillaDetails: 'Build JWT/session handling from scratch. Implement role-based access control (RBAC) manually. Full control over authentication flow.',
                vanillaProsCons: {
                    pros: ['Complete flexibility', 'No bloat from unused features', 'Learn security deeply', 'Custom to exact needs'],
                    cons: ['Easy to make mistakes', 'Need security expertise', 'More testing required', 'Longer implementation time']
                },
                vanillaComplexity: 'High',
                dotnetApproach: 'Built-in ASP.NET Identity',
                dotnetDetails: 'ASP.NET Core Identity provides complete authentication system. Built-in support for OAuth, JWT, cookies, and external providers (Google, Microsoft, etc.).',
                dotnetProsCons: {
                    pros: ['Battle-tested security', 'Built-in password hashing', 'OAuth providers ready', 'Extensive documentation'],
                    cons: ['Learning curve for configuration', 'May include unnecessary features', 'Less flexibility', 'Framework dependency']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'XSS Protection',
                vanillaApproach: 'Manual Sanitization',
                vanillaDetails: 'Must manually escape/sanitize all user input before rendering. Use textContent or createElement instead of innerHTML. Implement Content Security Policy (CSP).',
                vanillaProsCons: {
                    pros: ['Direct control over sanitization', 'Minimal overhead', 'Learn XSS vectors deeply', 'CSP easy to implement'],
                    cons: ['Easy to forget sanitization', 'Code review critical', 'Template literals risky', 'Team training needed']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'Automatic Encoding',
                dotnetDetails: 'Razor templates automatically HTML-encode output. React/Angular automatically escape values. Built-in XSS protection in framework.',
                dotnetProsCons: {
                    pros: ['Automatic protection', 'Hard to bypass', 'Framework-level security', 'Less human error'],
                    cons: ['May need manual intervention for raw HTML', 'False sense of security', 'Framework-specific knowledge', 'Still need CSP']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'CSRF Protection',
                vanillaApproach: 'Custom Token System',
                vanillaDetails: 'Implement anti-CSRF tokens manually. Generate tokens server-side, validate on each state-changing request. Use SameSite cookies.',
                vanillaProsCons: {
                    pros: ['Lightweight implementation', 'Full control over tokens', 'Understand CSRF deeply', 'Can optimize for SPA'],
                    cons: ['Must implement correctly', 'Token management complex', 'Easy to miss endpoints', 'Testing overhead']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'Built-in Anti-Forgery',
                dotnetDetails: '.NET Core has built-in anti-forgery tokens. Automatic validation on POST/PUT/DELETE. SPA-friendly token generation APIs.',
                dotnetProsCons: {
                    pros: ['Automatic token generation', 'Validated by framework', 'Production-tested', 'SPA integration ready'],
                    cons: ['Configuration needed', 'May conflict with APIs', 'CORS setup required', 'Framework overhead']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'SQL Injection Prevention',
                vanillaApproach: 'Parameterized Queries',
                vanillaDetails: 'Use parameterized queries or prepared statements. ORM not required - direct SQL with proper escaping. Manual validation of all inputs.',
                vanillaProsCons: {
                    pros: ['Direct SQL control', 'No ORM overhead', 'Understand queries fully', 'Performance optimization easy'],
                    cons: ['Must remember to parameterize', 'String concatenation dangerous', 'Code review critical', 'No type safety']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'Entity Framework Core',
                dotnetDetails: 'EF Core uses parameterized queries by default. LINQ provides type-safe queries. SQL injection nearly impossible with proper usage.',
                dotnetProsCons: {
                    pros: ['Automatic parameterization', 'Type safety', 'Hard to make mistakes', 'Compile-time checking'],
                    cons: ['ORM abstraction layer', 'Raw SQL still possible', 'Performance overhead', 'Learning curve']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'Data Encryption',
                vanillaApproach: 'Third-party Libraries',
                vanillaDetails: 'Use crypto libraries (Web Crypto API, CryptoJS). HTTPS required. Implement encryption for sensitive data storage.',
                vanillaProsCons: {
                    pros: ['Choose best libraries', 'Lightweight options', 'Web Crypto API built-in', 'Full control'],
                    cons: ['Library vetting needed', 'Crypto is hard', 'Key management complex', 'Easy to misuse']
                },
                vanillaComplexity: 'High',
                dotnetApproach: 'Built-in Cryptography',
                dotnetDetails: '.NET has comprehensive System.Security.Cryptography namespace. Data protection API for key management. Built-in encryption helpers.',
                dotnetProsCons: {
                    pros: ['Enterprise-grade crypto', 'Key rotation support', 'FIPS compliance option', 'Well documented'],
                    cons: ['Complex API', 'Overkill for simple needs', 'Configuration required', 'Windows-specific features']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'Security Auditing & Logging',
                vanillaApproach: 'Custom Logging',
                vanillaDetails: 'Build logging system or use libraries. Log security events manually. Implement audit trails for sensitive operations.',
                vanillaProsCons: {
                    pros: ['Log exactly what you need', 'Minimal overhead', 'Custom audit format', 'Easy integration'],
                    cons: ['Easy to miss events', 'Consistency challenge', 'No built-in analysis', 'Manual implementation']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'Built-in Logging + Identity',
                dotnetDetails: 'ASP.NET Core logging built-in. Identity tracks authentication events. Serilog/NLog for structured logging. Application Insights integration.',
                dotnetProsCons: {
                    pros: ['Structured logging', 'Authentication events automatic', 'Many integrations', 'Production-ready'],
                    cons: ['Configuration overhead', 'Can be verbose', 'Log storage costs', 'Sensitive data in logs']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'API Security',
                vanillaApproach: 'Manual Rate Limiting & Validation',
                vanillaDetails: 'Implement rate limiting manually. Input validation on every endpoint. Manual CORS configuration. API key management.',
                vanillaProsCons: {
                    pros: ['Precise control', 'Minimal overhead', 'Custom strategies', 'Optimized for needs'],
                    cons: ['Complex to implement', 'Must handle edge cases', 'Testing critical', 'Maintenance burden']
                },
                vanillaComplexity: 'High',
                dotnetApproach: 'Middleware & Filters',
                dotnetDetails: 'Built-in rate limiting (ASP.NET Core 7+). Model validation automatic. CORS middleware ready. API versioning support.',
                dotnetProsCons: {
                    pros: ['Middleware pipeline', 'Declarative security', 'Rate limiting built-in', 'OpenAPI/Swagger integration'],
                    cons: ['Framework-dependent', 'Configuration complex', 'Performance overhead', 'Over-featured']
                },
                dotnetComplexity: 'Low'
            },
            {
                category: 'Compliance (GDPR, Data Privacy)',
                vanillaApproach: 'Manual Implementation',
                vanillaDetails: 'Implement data export, deletion, and consent tracking manually. Cookie consent banners. Privacy policy integration.',
                vanillaProsCons: {
                    pros: ['Exact compliance needs', 'No unnecessary features', 'Custom workflows', 'Transparent implementation'],
                    cons: ['Legal expertise needed', 'Easy to miss requirements', 'Documentation burden', 'Audit trail manual']
                },
                vanillaComplexity: 'High',
                dotnetApproach: 'Libraries & Templates',
                dotnetDetails: 'Identity provides user data export. Many GDPR libraries available. Cookie consent middleware. Compliance templates.',
                dotnetProsCons: {
                    pros: ['Compliance templates', 'User data export ready', 'Consent management', 'Audit-friendly'],
                    cons: ['Must verify completeness', 'Library trustworthiness', 'Still need legal review', 'Configuration needed']
                },
                dotnetComplexity: 'Medium'
            }
        ];
    }

    function renderSecurityContent(container) {
        const securityCategories = getSecurityData();
        
        const getComplexityClass = (level) => {
            const levelLower = level.toLowerCase();
            if (levelLower === 'high' || levelLower === 'عالي') return 'complexity-high';
            if (levelLower === 'medium' || levelLower === 'متوسط') return 'complexity-medium';
            if (levelLower === 'low' || levelLower === 'منخفض') return 'complexity-low';
            return '';
        };
        
        const labels = currentLang === 'ar' ? {
            approach: 'النهج',
            complexity: 'التعقيد',
            advantages: '✅ المزايا',
            challenges: '⚠️ التحديات'
        } : {
            approach: 'Approach',
            complexity: 'Complexity',
            advantages: '✅ Advantages',
            challenges: '⚠️ Challenges'
        };
        
        const securityHTML = securityCategories.map(cat => `
            <div class="security-row-card">
                <div class="security-row-header">
                    <h3 class="security-row-title">${cat.category}</h3>
                </div>
                
                <div class="security-row-content">
                    <div class="security-column vanilla-column">
                        <div class="column-header">
                            <span class="column-icon">🟦</span>
                            <span class="column-title">Vanilla JS + Web API</span>
                        </div>
                        
                        <div class="approach-badge">
                            <span class="badge-label">${labels.approach}:</span>
                            <span class="badge-value">${cat.vanillaApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">${labels.complexity}:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.vanillaComplexity)}">${cat.vanillaComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${labels.advantages}:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${labels.challenges}:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="security-column-divider"></div>
                    
                    <div class="security-column dotnet-column">
                        <div class="column-header">
                            <span class="column-icon">🟪</span>
                            <span class="column-title">.NET Core + SPA</span>
                        </div>
                        
                        <div class="approach-badge">
                            <span class="badge-label">${labels.approach}:</span>
                            <span class="badge-value">${cat.dotnetApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">${labels.complexity}:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.dotnetComplexity)}">${cat.dotnetComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${labels.advantages}:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${labels.challenges}:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="card">
                <h2>🔒 ${currentLang === 'ar' ? 'الأمان والامتثال' : 'Security & Compliance'}</h2>
                <p>${currentLang === 'ar' 
                    ? 'مقارنة أمان شاملة تغطي المصادقة، حماية البيانات، منع الثغرات، ومتطلبات الامتثال.'
                    : 'Comprehensive security comparison covering authentication, data protection, vulnerability prevention, and compliance requirements.'}</p>
            </div>
            
            ${securityHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>🛡️ ${currentLang === 'ar' ? 'ملخص الأمان' : 'Security Summary'}</h3>
                <div class="summary-grid">
                    <div>
                        <h4>${currentLang === 'ar' ? 'ملف Vanilla JS الأمني:' : 'Vanilla JS Security Profile:'}</h4>
                        <ul>
                            <li><strong>${currentLang === 'ar' ? 'التحكم' : 'Control'}:</strong> ${currentLang === 'ar' ? 'أقصى مرونة وتحكم' : 'Maximum flexibility and control'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الخبرة' : 'Expertise'}:</strong> ${currentLang === 'ar' ? 'يتطلب معرفة أمنية قوية' : 'Requires strong security knowledge'}</li>
                            <li><strong>${currentLang === 'ar' ? 'المخاطر' : 'Risk'}:</strong> ${currentLang === 'ar' ? 'أعلى إذا كان الفريق يفتقر للخبرة' : 'Higher if team lacks experience'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الأفضل لـ' : 'Best for'}:</strong> ${currentLang === 'ar' ? 'فرق واعية بالأمان ذات خبرة' : 'Security-conscious teams with expertise'}</li>
                        </ul>
                    </div>
                    <div>
                        <h4>${currentLang === 'ar' ? 'ملف .NET + SPA الأمني:' : '.NET + SPA Security Profile:'}</h4>
                        <ul>
                            <li><strong>${currentLang === 'ar' ? 'التحكم' : 'Control'}:</strong> ${currentLang === 'ar' ? 'موجّه بأفضل ممارسات إطار العمل' : 'Guided by framework best practices'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الخبرة' : 'Expertise'}:</strong> ${currentLang === 'ar' ? 'الأمان المدمج يقلل العبء' : 'Built-in security reduces burden'}</li>
                            <li><strong>${currentLang === 'ar' ? 'المخاطر' : 'Risk'}:</strong> ${currentLang === 'ar' ? 'أقل بسبب الميزات المُختبرة' : 'Lower due to battle-tested features'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الأفضل لـ' : 'Best for'}:</strong> ${currentLang === 'ar' ? 'احتياجات امتثال المؤسسات' : 'Enterprise compliance needs'}</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>⚡ ${currentLang === 'ar' ? 'توصية حاسمة:' : 'Critical Recommendation:'}</h4>
                    <p>${currentLang === 'ar' 
                        ? '<strong>كلا النهجين يمكن أن يكونا آمنين</strong>، لكن .NET + SPA يوفر <em>الأمان افتراضياً</em> بشكل أكبر. إذا كان فريقك لديه خبرة أمنية محدودة، فإن الحماية المدمجة في إطار العمل تقلل المخاطر بشكل كبير. إذا اخترت Vanilla JS، استثمر بكثافة في التدريب الأمني ومراجعة الكود.'
                        : '<strong>Both approaches can be secure</strong>, but .NET + SPA provides more <em>security by default</em>. If your team has limited security expertise, the framework\'s built-in protections significantly reduce risk. If you choose Vanilla JS, invest heavily in security training and code review.'}</p>
                </div>
            </div>
        `;
    }

    // Get Testing data (language-specific) - simplified version using same structure
    function getTestingData() {
        if (currentLang === 'ar') {
            return [
                {
                    category: 'اختبار الوحدات',
                    vanillaApproach: 'Vitest / Jest',
                    vanillaDetails: 'اختبار وحدات JavaScript بسيط مع Vitest أو Jest. اختبار الدوال النقية والأدوات. لا حاجة لاختبار إطار عمل معقد.',
                    vanillaProsCons: {
                        pros: ['تنفيذ اختبار سريع', 'إعداد بسيط', 'سهل الفهم', 'حمل منخفض', 'اختبار السلوك الفعلي'],
                        cons: ['اختبار DOM يدوي', 'لا أنماط اختبار مكونات', 'أدوات أقل', 'مزيد من الإعداد مطلوب']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'xUnit / NUnit + Jest/Vitest',
                    dotnetDetails: 'اختبار الخلفية مع xUnit/NUnit لـ .NET. اختبار الواجهة مع Jest/React Testing Library أو أدوات اختبار Angular.',
                    dotnetProsCons: {
                        pros: ['أطر اختبار غنية', 'مكتبات اختبار المكونات', 'Mocking مدمج', 'تكامل IDE ممتاز'],
                        cons: ['مجموعتا اختبار منفصلتان', 'مزيد من التكوين', 'منحنى تعلم', 'تنفيذ أبطأ']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'اختبار التكامل',
                    vanillaApproach: 'أدوات اختبار API',
                    vanillaDetails: 'اختبار نقاط نهاية API مباشرة باستخدام أدوات مثل Supertest، Postman، أو نصوص مخصصة. اختبار تكامل قاعدة البيانات يدوياً.',
                    vanillaProsCons: {
                        pros: ['اختبار API مباشر', 'اختبار HTTP بسيط', 'لا حمل إطار عمل', 'تصحيح سهل'],
                        cons: ['تنسيق اختبار يدوي', 'تغذية قاعدة البيانات يدوية', 'لا مساعدين مدمجين', 'مزيد من الكود النمطي']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'WebApplicationFactory',
                    dotnetDetails: 'ASP.NET Core يوفر WebApplicationFactory للاختبار في الذاكرة. خادم اختبار مدمج، محاكاة قاعدة بيانات، ودعم حقن التبعية.',
                    dotnetProsCons: {
                        pros: ['خادم اختبار في الذاكرة', 'اختبار حاوية DI', 'محاكاة قاعدة البيانات سهلة', 'خط أنابيب طلب كامل'],
                        cons: ['إعداد معقد', 'أبطأ من اختبارات الوحدات', 'كثيف الذاكرة', 'حمل تكوين']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'الاختبار الشامل (E2E)',
                    vanillaApproach: 'Playwright / Cypress',
                    vanillaDetails: 'اختبار E2E حديث مع Playwright أو Cypress. اختبار تدفقات المستخدم الحقيقية في متصفحات فعلية. محددات وتأكيدات بسيطة.',
                    vanillaProsCons: {
                        pros: ['نفس الأدوات كـ .NET', 'بنية صفحة بسيطة', 'كتابة اختبار سريعة', 'لا معرفة خاصة بإطار العمل'],
                        cons: ['تحتاج إعداد بيانات اختبار', 'مصادقة يدوية', 'محددات مخصصة', 'إدارة الحالة يدوية']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'Playwright / Cypress',
                    dotnetDetails: 'نفس أدوات E2E (Playwright/Cypress). يمكن الاستفادة من أدوات اختبار خاصة بإطار العمل وسمات بيانات المكونات.',
                    dotnetProsCons: {
                        pros: ['معرفات بيانات اختبار قياسية', 'أوضاع اختبار المكونات', 'نظام بيئي غني', 'أمثلة عديدة متاحة'],
                        cons: ['حالة مكون معقدة', 'محددات خاصة بإطار العمل', 'تحميل صفحة أبطأ', 'تعقيد DOM أكثر']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'تغطية الاختبار',
                    vanillaApproach: 'Istanbul / c8',
                    vanillaDetails: 'تغطية الكود مع Istanbul (nyc) أو c8. تقارير تغطية بسيطة. سهل تحقيق تغطية عالية على الدوال النقية.',
                    vanillaProsCons: {
                        pros: ['تغطية عالية قابلة للتحقيق', 'قاعدة كود بسيطة للتغطية', 'توليد تغطية سريع', 'حالات حدية أقل'],
                        cons: ['تغطية DOM يدوية', 'لا تغطية مكونات', 'يجب الاختبار يدوياً', 'التغطية قد تكون مضللة']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'Coverlet + Istanbul',
                    dotnetDetails: 'تغطية الخلفية مع Coverlet. تغطية الواجهة مع Istanbul. تقارير تغطية منفصلة لكل طبقة.',
                    dotnetProsCons: {
                        pros: ['تغطية شاملة', 'أدوات تغطية إطار العمل', 'تغطية المكونات', 'تكامل IDE'],
                        cons: ['نظاما تغطية', 'تكوين معقد', 'أصعب تحقيق % عالية', 'مسارات كود أكثر']
                    },
                    dotnetComplexity: 'عالي'
                },
                {
                    category: 'المحاكاة والتعويض',
                    vanillaApproach: 'محاكاة يدوية',
                    vanillaDetails: 'إنشاء كائنات ودوال محاكاة بسيطة. تعويض استدعاءات API بمحاكاة fetch. حقن تبعية مباشر.',
                    vanillaProsCons: {
                        pros: ['محاكاة بسيطة', 'لا سحر', 'سهل الفهم', 'تحكم كامل'],
                        cons: ['إنشاء محاكاة يدوي', 'مزيد من الكود النمطي', 'لا محاكاة تلقائية', 'يستغرق وقتاً']
                    },
                    vanillaComplexity: 'متوسط',
                    dotnetApproach: 'Moq / NSubstitute + MSW',
                    dotnetDetails: 'محاكاة .NET مع Moq أو NSubstitute. محاكاة API الواجهة مع Mock Service Worker (MSW). قدرات محاكاة غنية.',
                    dotnetProsCons: {
                        pros: ['مكتبات محاكاة قوية', 'توليد محاكاة تلقائي', 'محاكاة آمنة للنوع', 'تأكيدات غنية'],
                        cons: ['منحنى تعلم', 'سلوك سحري', 'تصحيح أصعب', 'خطر الإفراط في المحاكاة']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'إدارة بيانات الاختبار',
                    vanillaApproach: 'تركيبات JSON',
                    vanillaDetails: 'تخزين بيانات الاختبار في ملفات JSON أو إنشاء دوال مصنع بسيطة. تغذية وتنظيف قاعدة البيانات يدوياً.',
                    vanillaProsCons: {
                        pros: ['ملفات بيانات بسيطة', 'سهل للتحكم بالإصدار', 'لا تعقيد', 'خفيف الوزن'],
                        cons: ['إدارة يدوية', 'لا علاقات', 'تنظيف يدوي', 'خطر انحراف البيانات']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'Entity Builders + Fixtures',
                    dotnetDetails: 'بناة بيانات اختبار مع Bogus/AutoFixture. تركيبات قاعدة بيانات مع Respawn. معالجة علاقات تلقائية.',
                    dotnetProsCons: {
                        pros: ['توليد بيانات تلقائي', 'معالجة العلاقات', 'أدوات تنظيف قاعدة البيانات', 'بيانات واقعية'],
                        cons: ['إعداد معقد', 'منحنى تعلم', 'اختبارات أبطأ', 'اعتماد قاعدة البيانات']
                    },
                    dotnetComplexity: 'عالي'
                },
                {
                    category: 'التكامل المستمر',
                    vanillaApproach: 'خط أنابيب CI بسيط',
                    vanillaDetails: 'تشغيل الاختبارات في GitHub Actions / GitLab CI. أمر اختبار واحد. تنفيذ خط أنابيب سريع. استراتيجية تخزين مؤقت بسيطة.',
                    vanillaProsCons: {
                        pros: ['تشغيل CI سريع', 'تكوين بسيط', 'أمر اختبار واحد', 'استخدام موارد منخفض'],
                        cons: ['تحسين يدوي', 'لا تشغيل متوازٍ مدمج', 'تقارير محدودة', 'لوحات معلومات مخصصة مطلوبة']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'خط أنابيب متعدد المراحل',
                    dotnetDetails: 'مراحل اختبار منفصلة للخلفية والواجهة. تنفيذ اختبار متوازٍ. نشر نتائج الاختبار. تقارير التغطية متكاملة.',
                    dotnetProsCons: {
                        pros: ['تنفيذ متوازٍ', 'تقارير غنية', 'تصنيف الاختبارات', 'artifacts مدمجة'],
                        cons: ['أبطأ بشكل عام', 'تكوين معقد', 'مزيد من الموارد مطلوبة', 'أوقات انتظار أطول']
                    },
                    dotnetComplexity: 'متوسط'
                },
                {
                    category: 'اختبار الأداء',
                    vanillaApproach: 'Lighthouse / k6',
                    vanillaDetails: 'أداء الواجهة مع Lighthouse CI. اختبار الحمل مع k6 أو Artillery. ميزانيات أداء بسيطة.',
                    vanillaProsCons: {
                        pros: ['أداء أساسي أفضل', 'مقاييس أبسط', 'أوقات تحميل أسرع', 'سهل تلبية الميزانيات'],
                        cons: ['تحسين يدوي', 'مراقبة مخصصة', 'لا أدوات إطار عمل', 'تحليل أداء يدوي']
                    },
                    vanillaComplexity: 'منخفض',
                    dotnetApproach: 'Lighthouse + BenchmarkDotNet',
                    dotnetDetails: 'قياس الخلفية مع BenchmarkDotNet. الواجهة مع Lighthouse. أدوات تحليل أداء خاصة بإطار العمل متاحة.',
                    dotnetProsCons: {
                        pros: ['قياس احترافي', 'محللو إطار العمل', 'مقاييس غنية', 'تقارير مفصلة'],
                        cons: ['المزيد للتحسين', 'تحليل معقد', 'أساس أثقل', 'أدوات متعددة مطلوبة']
                    },
                    dotnetComplexity: 'متوسط'
                }
            ];
        }
        // English version - keep original data
        return [
            {
                category: 'Unit Testing',
                vanillaApproach: 'Vitest / Jest',
                vanillaDetails: 'Simple JavaScript unit testing with Vitest or Jest. Test pure functions and utilities. No complex framework testing needed.',
                vanillaProsCons: {
                    pros: ['Fast test execution', 'Simple setup', 'Easy to understand', 'Low overhead', 'Test actual behavior'],
                    cons: ['Manual DOM testing', 'No component testing patterns', 'Less tooling', 'More setup required']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'xUnit / NUnit + Jest/Vitest',
                dotnetDetails: 'Backend testing with xUnit/NUnit for .NET. Frontend testing with Jest/React Testing Library or Angular Testing utilities.',
                dotnetProsCons: {
                    pros: ['Rich testing frameworks', 'Component testing libraries', 'Mocking built-in', 'IDE integration excellent'],
                    cons: ['Two separate test stacks', 'More configuration', 'Learning curve', 'Slower execution']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'Integration Testing',
                vanillaApproach: 'API Testing Tools',
                vanillaDetails: 'Test API endpoints directly with tools like Supertest, Postman, or custom scripts. Test database integration manually.',
                vanillaProsCons: {
                    pros: ['Direct API testing', 'Simple HTTP testing', 'No framework overhead', 'Easy debugging'],
                    cons: ['Manual test orchestration', 'Database seeding manual', 'No built-in helpers', 'More boilerplate']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'WebApplicationFactory',
                dotnetDetails: 'ASP.NET Core provides WebApplicationFactory for in-memory testing. Built-in test server, database mocking, and dependency injection support.',
                dotnetProsCons: {
                    pros: ['In-memory test server', 'DI container testing', 'Database mocking easy', 'Full request pipeline'],
                    cons: ['Complex setup', 'Slower than unit tests', 'Memory intensive', 'Configuration overhead']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'End-to-End (E2E) Testing',
                vanillaApproach: 'Playwright / Cypress',
                vanillaDetails: 'Modern E2E testing with Playwright or Cypress. Test real user flows in actual browsers. Simple selectors and assertions.',
                vanillaProsCons: {
                    pros: ['Same tools as .NET', 'Simple page structure', 'Fast test writing', 'No framework-specific knowledge'],
                    cons: ['Need test data setup', 'Manual authentication', 'Custom selectors', 'State management manual']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'Playwright / Cypress',
                dotnetDetails: 'Same E2E tools (Playwright/Cypress). Can leverage framework-specific testing utilities and component data attributes.',
                dotnetProsCons: {
                    pros: ['Data test IDs standard', 'Component testing modes', 'Rich ecosystem', 'Many examples available'],
                    cons: ['Complex component state', 'Framework-specific selectors', 'Slower page loads', 'More DOM complexity']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'Test Coverage',
                vanillaApproach: 'Istanbul / c8',
                vanillaDetails: 'Code coverage with Istanbul (nyc) or c8. Simple coverage reports. Easy to achieve high coverage on pure functions.',
                vanillaProsCons: {
                    pros: ['High coverage achievable', 'Simple codebase to cover', 'Fast coverage generation', 'Fewer edge cases'],
                    cons: ['Manual DOM coverage', 'No component coverage', 'Must test manually', 'Coverage can be misleading']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'Coverlet + Istanbul',
                dotnetDetails: 'Backend coverage with Coverlet. Frontend coverage with Istanbul. Separate coverage reports for each layer.',
                dotnetProsCons: {
                    pros: ['Comprehensive coverage', 'Framework coverage tools', 'Component coverage', 'IDE integration'],
                    cons: ['Two coverage systems', 'Complex configuration', 'Harder to achieve high %', 'More code paths']
                },
                dotnetComplexity: 'High'
            },
            {
                category: 'Mocking & Stubbing',
                vanillaApproach: 'Manual Mocks',
                vanillaDetails: 'Create simple mock objects and functions. Stub API calls with fetch mock. Straightforward dependency injection.',
                vanillaProsCons: {
                    pros: ['Simple mocks', 'No magic', 'Easy to understand', 'Full control'],
                    cons: ['Manual mock creation', 'More boilerplate', 'No auto-mocking', 'Time consuming']
                },
                vanillaComplexity: 'Medium',
                dotnetApproach: 'Moq / NSubstitute + MSW',
                dotnetDetails: '.NET mocking with Moq or NSubstitute. Frontend API mocking with Mock Service Worker (MSW). Rich mocking capabilities.',
                dotnetProsCons: {
                    pros: ['Powerful mocking libraries', 'Auto-mock generation', 'Type-safe mocks', 'Rich assertions'],
                    cons: ['Learning curve', 'Magic behavior', 'Debugging harder', 'Over-mocking risk']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'Test Data Management',
                vanillaApproach: 'JSON Fixtures',
                vanillaDetails: 'Store test data in JSON files or create simple factory functions. Manual database seeding and cleanup.',
                vanillaProsCons: {
                    pros: ['Simple data files', 'Easy to version control', 'No complexity', 'Lightweight'],
                    cons: ['Manual management', 'No relationships', 'Cleanup manual', 'Data drift risk']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'Entity Builders + Fixtures',
                dotnetDetails: 'Test data builders with Bogus/AutoFixture. Database fixtures with Respawn. Automatic relationship handling.',
                dotnetProsCons: {
                    pros: ['Auto data generation', 'Relationship handling', 'Database cleanup tools', 'Realistic data'],
                    cons: ['Complex setup', 'Learning curve', 'Slower tests', 'Database dependency']
                },
                dotnetComplexity: 'High'
            },
            {
                category: 'Continuous Integration',
                vanillaApproach: 'Simple CI Pipeline',
                vanillaDetails: 'Run tests in GitHub Actions / GitLab CI. Single test command. Fast pipeline execution. Simple caching strategy.',
                vanillaProsCons: {
                    pros: ['Fast CI runs', 'Simple configuration', 'One test command', 'Low resource usage'],
                    cons: ['Manual optimization', 'No built-in parallelization', 'Limited reporting', 'Custom dashboards needed']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'Multi-Stage Pipeline',
                dotnetDetails: 'Separate backend and frontend test stages. Parallel test execution. Test result publishing. Coverage reporting integrated.',
                dotnetProsCons: {
                    pros: ['Parallel execution', 'Rich reporting', 'Test categorization', 'Built-in artifacts'],
                    cons: ['Slower overall', 'Complex configuration', 'More resources needed', 'Longer queue times']
                },
                dotnetComplexity: 'Medium'
            },
            {
                category: 'Performance Testing',
                vanillaApproach: 'Lighthouse / k6',
                vanillaDetails: 'Frontend performance with Lighthouse CI. Load testing with k6 or Artillery. Simple performance budgets.',
                vanillaProsCons: {
                    pros: ['Better baseline performance', 'Simpler metrics', 'Faster load times', 'Easy to meet budgets'],
                    cons: ['Manual optimization', 'Custom monitoring', 'No framework tools', 'DIY profiling']
                },
                vanillaComplexity: 'Low',
                dotnetApproach: 'Lighthouse + BenchmarkDotNet',
                dotnetDetails: 'Backend benchmarking with BenchmarkDotNet. Frontend with Lighthouse. Framework-specific profiling tools available.',
                dotnetProsCons: {
                    pros: ['Professional benchmarking', 'Framework profilers', 'Rich metrics', 'Detailed reports'],
                    cons: ['More to optimize', 'Complex profiling', 'Heavier baseline', 'Multiple tools needed']
                },
                dotnetComplexity: 'Medium'
            }
        ];
    }

    function renderTestingContent(container) {
        const testingCategories = getTestingData();
        
        const getComplexityClass = (level) => {
            const levelLower = level.toLowerCase();
            if (levelLower === 'high' || levelLower === 'عالي') return 'complexity-high';
            if (levelLower === 'medium' || levelLower === 'متوسط') return 'complexity-medium';
            if (levelLower === 'low' || levelLower === 'منخفض') return 'complexity-low';
            return '';
        };
        
        const labels = currentLang === 'ar' ? {
            approach: 'النهج',
            complexity: 'التعقيد',
            advantages: '✅ المزايا',
            challenges: '⚠️ التحديات'
        } : {
            approach: 'Approach',
            complexity: 'Complexity',
            advantages: '✅ Advantages',
            challenges: '⚠️ Challenges'
        };
        
        const testingHTML = testingCategories.map(cat => `
            <div class="security-row-card">
                <div class="security-row-header">
                    <h3 class="security-row-title">${cat.category}</h3>
                </div>
                
                <div class="security-row-content">
                    <div class="security-column vanilla-column">
                        <div class="column-header">
                            <span class="column-icon">🟦</span>
                            <span class="column-title">Vanilla JS + Web API</span>
                        </div>
                        
                        <div class="approach-badge">
                            <span class="badge-label">${labels.approach}:</span>
                            <span class="badge-value">${cat.vanillaApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">${labels.complexity}:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.vanillaComplexity)}">${cat.vanillaComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${labels.advantages}:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${labels.challenges}:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="security-column-divider"></div>
                    
                    <div class="security-column dotnet-column">
                        <div class="column-header">
                            <span class="column-icon">🟪</span>
                            <span class="column-title">.NET Core + SPA</span>
                        </div>
                        
                        <div class="approach-badge">
                            <span class="badge-label">${labels.approach}:</span>
                            <span class="badge-value">${cat.dotnetApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">${labels.complexity}:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.dotnetComplexity)}">${cat.dotnetComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${labels.advantages}:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${labels.challenges}:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="card">
                <h2>✅ ${currentLang === 'ar' ? 'الاختبار وضمان الجودة' : 'Testing & Quality Assurance'}</h2>
                <p>${currentLang === 'ar' 
                    ? 'مقارنة شاملة لاستراتيجيات الاختبار، الأدوات، التغطية، والتكامل المستمر لكلا النهجين التقنيين.'
                    : 'Comprehensive testing comparison covering unit tests, integration tests, E2E testing, coverage, and CI/CD strategies.'}</p>
            </div>
            
            ${testingHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>🧪 ${currentLang === 'ar' ? 'ملخص الاختبار' : 'Testing Summary'}</h3>
                <div class="summary-grid">
                    <div>
                        <h4>${currentLang === 'ar' ? 'ملف Vanilla JS للاختبار:' : 'Vanilla JS Testing Profile:'}</h4>
                        <ul>
                            <li><strong>${currentLang === 'ar' ? 'البساطة' : 'Simplicity'}:</strong> ${currentLang === 'ar' ? 'أدوات أقل، إعداد أبسط' : 'Fewer tools, simpler setup'}</li>
                            <li><strong>${currentLang === 'ar' ? 'السرعة' : 'Speed'}:</strong> ${currentLang === 'ar' ? 'تنفيذ اختبار أسرع بشكل عام' : 'Faster test execution overall'}</li>
                            <li><strong>${currentLang === 'ar' ? 'منحنى التعلم' : 'Learning Curve'}:</strong> ${currentLang === 'ar' ? 'أقل، اختبار JS قياسي' : 'Lower, standard JS testing'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الأفضل لـ' : 'Best for'}:</strong> ${currentLang === 'ar' ? 'فرق صغيرة، تكرار سريع' : 'Small teams, fast iteration'}</li>
                        </ul>
                    </div>
                    <div>
                        <h4>${currentLang === 'ar' ? 'ملف .NET + SPA للاختبار:' : '.NET + SPA Testing Profile:'}</h4>
                        <ul>
                            <li><strong>${currentLang === 'ar' ? 'الثراء' : 'Richness'}:</strong> ${currentLang === 'ar' ? 'مزيد من الأدوات والميزات' : 'More tooling and features'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الشمولية' : 'Completeness'}:</strong> ${currentLang === 'ar' ? 'دعم اختبار كامل المكدس' : 'Full-stack testing support'}</li>
                            <li><strong>${currentLang === 'ar' ? 'منحنى التعلم' : 'Learning Curve'}:</strong> ${currentLang === 'ar' ? 'أعلى، أطر عمل متعددة' : 'Higher, multiple frameworks'}</li>
                            <li><strong>${currentLang === 'ar' ? 'الأفضل لـ' : 'Best for'}:</strong> ${currentLang === 'ar' ? 'معايير جودة المؤسسات' : 'Enterprise quality standards'}</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>💡 ${currentLang === 'ar' ? 'توصية الاختبار:' : 'Testing Recommendation:'}</h4>
                    <p>${currentLang === 'ar' 
                        ? '<strong>كلا النهجين يدعمان اختبار شامل</strong>. Vanilla JS لديه اختبارات أبسط وأسرع ولكن يتطلب مزيد من العمل اليدوي. .NET + SPA يوفر أدوات أكثر ثراءً ولكن مع مزيد من التعقيد. اختر بناءً على نضج فريقك في الاختبار ومتطلبات الجودة.'
                        : '<strong>Both approaches support comprehensive testing</strong>. Vanilla JS has simpler, faster tests but requires more manual work. .NET + SPA provides richer tooling but with more complexity. Choose based on your team\'s testing maturity and quality requirements.'}</p>
                </div>
            </div>
        `;
    }

    function renderVanillaGuide(container) {
        const isArabic = currentLang === 'ar';
        
        const t = {
            pageTitle: isArabic ? '🎨 جعل Vanilla JS عملياً لتطوير ERP' : '🎨 Making Vanilla JS Practical for ERP Development',
            pageIntro: isArabic ? 'توضح لك هذه الصفحة الأنماط الأساسية والهندسة المعمارية اللازمة لبناء تطبيقات ERP جاهزة للإنتاج باستخدام vanilla JavaScript. <strong>هذا الموقع نفسه يوضح كل هذه الأنماط!</strong>' : 'This page shows you the essential patterns and architecture needed to build production-ready ERP applications with vanilla JavaScript. <strong>This very website demonstrates all these patterns!</strong>',
            
            architecture: {
                title: isArabic ? '🗺️ مكونات الهندسة المعمارية الأساسية' : '🗺️ Essential Architecture Components',
                router: {
                    title: isArabic ? '1. الموجه (التنقل القائم على Hash)' : '1. Router (Hash-based Navigation)',
                    desc: isArabic ? 'التعامل مع التنقل أحادي الصفحة بدون إعادة تحميل الصفحة. الاستماع لتغييرات hash وإظهار/إخفاء الأقسام.' : 'Handle single-page navigation without page reloads. Listen to hash changes and show/hide sections.'
                },
                store: {
                    title: isArabic ? '2. مخزن الحالة (نمط Pub/Sub)' : '2. State Store (Pub/Sub Pattern)',
                    desc: isArabic ? 'إدارة حالة مركزية مع اشتراكات تفاعلية. تحديث المكونات تلقائياً عند تغيير الحالة.' : 'Centralized state management with reactive subscriptions. Components auto-update when state changes.'
                },
                component: {
                    title: isArabic ? '3. نمط المكون' : '3. Component Pattern',
                    desc: isArabic ? 'مكونات واجهة مستخدم قابلة لإعادة الاستخدام مع التهيئة والعرض ومعالجة الأحداث. تعريفية وقابلة للصيانة.' : 'Reusable UI components with initialization, rendering, and event handling. Declarative and maintainable.'
                },
                api: {
                    title: isArabic ? '4. عميل HTTP / طبقة API' : '4. HTTP Client / API Layer',
                    desc: isArabic ? 'اتصال API مركزي مع معالجة الأخطاء، حالات التحميل، وتنسيق الاستجابة.' : 'Centralized API communication with error handling, loading states, and response formatting.'
                }
            },
            
            bestPractices: {
                title: isArabic ? '💡 أفضل الممارسات والأنماط' : '💡 Best Practices & Patterns',
                security: {
                    title: isArabic ? '🔒 الأمان أولاً' : '🔒 Security First',
                    items: isArabic ? [
                        'استخدم دائماً <code>textContent</code> أو <code>createElement</code>',
                        'تطهير إدخال المستخدم قبل العرض',
                        'تنفيذ رموز CSRF للطلبات المغيرة للحالة',
                        'استخدام الاستعلامات المعلمية على الخلفية',
                        'تعيين رؤوس Content Security Policy'
                    ] : [
                        'Always use <code>textContent</code> or <code>createElement</code>',
                        'Sanitize user input before rendering',
                        'Implement CSRF tokens for state-changing requests',
                        'Use parameterized queries on backend',
                        'Set Content Security Policy headers'
                    ]
                },
                organization: {
                    title: isArabic ? '📦 تنظيم الكود' : '📦 Code Organization',
                    items: isArabic ? [
                        'مكون واحد لكل ملف',
                        'التجميع حسب الميزة، وليس حسب النوع',
                        'استخدام الوحدات (ES6) للتبعيات',
                        'الحفاظ على المكونات صغيرة ومركزة',
                        'الأدوات المشتركة في مجلد <code>/utils</code>'
                    ] : [
                        'One component per file',
                        'Group by feature, not by type',
                        'Use modules (ES6) for dependencies',
                        'Keep components small and focused',
                        'Shared utilities in <code>/utils</code> folder'
                    ]
                },
                performance: {
                    title: isArabic ? '⚡ الأداء' : '⚡ Performance',
                    items: isArabic ? [
                        'تفويض الأحداث للمحتوى الديناميكي',
                        'Debounce/throttle للأحداث المتكررة',
                        'التحميل الكسول للمكونات والمسارات',
                        'التمرير الافتراضي للقوائم الكبيرة',
                        'تخزين استعلامات DOM مؤقتاً'
                    ] : [
                        'Event delegation for dynamic content',
                        'Debounce/throttle frequent events',
                        'Lazy load components and routes',
                        'Virtual scrolling for large lists',
                        'Cache DOM queries'
                    ]
                },
                testing: {
                    title: isArabic ? '🧪 استراتيجية الاختبار' : '🧪 Testing Strategy',
                    items: isArabic ? [
                        'اختبار الوحدة للدوال النقية',
                        'اختبار التكامل لطبقة API',
                        'اختبار E2E لتدفقات المستخدم الحرجة',
                        'استخدام Playwright لاختبار المتصفح',
                        'محاكاة استدعاءات fetch في الاختبارات'
                    ] : [
                        'Unit test pure functions',
                        'Integration test API layer',
                        'E2E test critical user flows',
                        'Use Playwright for browser testing',
                        'Mock fetch calls in tests'
                    ]
                },
                responsive: {
                    title: isArabic ? '📱 التصميم المتجاوب' : '📱 Responsive Design',
                    items: isArabic ? [
                        'نهج CSS للهواتف المحمولة أولاً',
                        'استخدام CSS Grid و Flexbox',
                        'متغيرات CSS للثيمات',
                        'التحسين التدريجي',
                        'عناصر واجهة مستخدم صديقة للمس'
                    ] : [
                        'Mobile-first CSS approach',
                        'Use CSS Grid and Flexbox',
                        'CSS variables for theming',
                        'Progressive enhancement',
                        'Touch-friendly UI elements'
                    ]
                },
                accessibility: {
                    title: isArabic ? '♿ إمكانية الوصول' : '♿ Accessibility',
                    items: isArabic ? [
                        'عناصر HTML دلالية',
                        'تسميات ARIA عند الحاجة',
                        'دعم التنقل بلوحة المفاتيح',
                        'إدارة التركيز لـ SPAs',
                        'اختبار قارئ الشاشة'
                    ] : [
                        'Semantic HTML elements',
                        'ARIA labels where needed',
                        'Keyboard navigation support',
                        'Focus management for SPAs',
                        'Screen reader testing'
                    ]
                }
            },
            
            utilities: {
                title: isArabic ? '🛠️ الأدوات الأساسية' : '🛠️ Essential Utilities',
                domUtils: isArabic ? 'أدوات DOM' : 'DOM Utilities',
                debounceThrottle: isArabic ? 'Debounce & Throttle' : 'Debounce & Throttle',
                formValidation: isArabic ? 'التحقق من صحة النموذج' : 'Form Validation',
                loadingStates: isArabic ? 'حالات التحميل' : 'Loading States'
            },
            
            realExample: {
                title: isArabic ? '🎯 مثال حقيقي: هذا الموقع!' : '🎯 Real Example: This Website!',
                intro: isArabic ? 'تم بناء موقع المقارنة هذا بالكامل باستخدام الأنماط الموضحة أعلاه. إليك كيفية عمله:' : 'This comparison site is built entirely using the patterns shown above. Here\'s how it works:',
                features: isArabic ? [
                    '<strong>التوجيه القائم على Hash:</strong> انقر على علامات التبويب - لاحظ تغيير عنوان URL بدون إعادة تحميل الصفحة',
                    '<strong>إدارة الحالة:</strong> صفحة مصفوفة القرار وصفحة TCO تشتركان في الحالة - قم بتحديث أحدهما، والآخر يتفاعل',
                    '<strong>المكونات:</strong> كل صفحة هي مكون (العرض، التفاعل، التحديث التلقائي)',
                    '<strong>لا بناء:</strong> افتح أدوات المطور - هذا JavaScript نقي، لا بناء، لا إطار عمل',
                    '<strong>الكود المصدري:</strong> انظر إلى <code>app-bundle.js</code> - تطبيق عالمي حقيقي يعمل في ~ 300 سطر من الكود الأساسي'
                ] : [
                    '<strong>Hash-based routing:</strong> Click tabs - notice URL changes without page reload',
                    '<strong>State management:</strong> Decision Matrix and TCO pages share state - update one, the other reacts',
                    '<strong>Components:</strong> Each page is a component (render, interact, auto-update)',
                    '<strong>No build:</strong> Open DevTools - this is pure JavaScript, no build, no framework',
                    '<strong>Source code:</strong> Look at <code>app-bundle.js</code> - real-world app in ~300 lines of core code'
                ]
            },
            
            erpSpecific: {
                title: isArabic ? '🏢 أنماط خاصة بـ ERP' : '🏢 ERP-Specific Patterns',
                dataGrid: {
                    title: isArabic ? 'شبكات البيانات (الجداول)' : 'Data Grids (Tables)',
                    desc: isArabic ? 'استخدم التمرير الافتراضي للجداول الكبيرة. مكتبات مثل <a href="https://github.com/grid-js/gridjs" target="_blank">Grid.js</a> هي vanilla JS ولا تحتاج إطار عمل.' : 'Use virtual scrolling for large tables. Libraries like <a href="https://github.com/grid-js/gridjs" target="_blank">Grid.js</a> are vanilla JS and framework-free.'
                },
                forms: {
                    title: isArabic ? 'نماذج معقدة' : 'Complex Forms',
                    desc: isArabic ? 'قم ببناء مُنشئ نماذج ديناميكي باستخدام JSON schema. التحقق من صحة البيانات على جانب العميل والخادم.' : 'Build a dynamic form builder with JSON schema. Validate on both client and server.'
                },
                reporting: {
                    title: isArabic ? 'التقارير ولوحات المعلومات' : 'Reporting & Dashboards',
                    desc: isArabic ? 'استخدم <a href="https://www.chartjs.org/" target="_blank">Chart.js</a> للرسوم البيانية (vanilla JS). بناء نظام لوحة معلومات قابل للتخصيص مع السحب والإفلات.' : 'Use <a href="https://www.chartjs.org/" target="_blank">Chart.js</a> for charts (vanilla JS). Build a customizable dashboard system with drag-and-drop.'
                },
                offline: {
                    title: isArabic ? 'دعم Offline' : 'Offline Support',
                    desc: isArabic ? 'استخدم Service Workers + IndexedDB للتخزين المؤقت والمزامنة offline. حرج لـ ERP الميداني.' : 'Use Service Workers + IndexedDB for caching and offline sync. Critical for field ERP.'
                },
                multiTenancy: {
                    title: isArabic ? 'Multi-Tenancy' : 'Multi-Tenancy',
                    desc: isArabic ? 'قم بتضمين معرف المستأجر في جميع طلبات API. تصفية البيانات بناءً على المستأجر على الخلفية (أبداً على الواجهة الأمامية!).' : 'Include tenant ID in all API requests. Filter data by tenant on backend (never frontend!).'
                },
                printing: {
                    title: isArabic ? 'الطباعة والتصدير' : 'Printing & Export',
                    desc: isArabic ? 'استخدم <code>window.print()</code> مع CSS للطباعة. التصدير إلى PDF/Excel على جانب الخادم باستخدام طلبات API.' : 'Use <code>window.print()</code> with print CSS. Export to PDF/Excel on server-side via API requests.'
                }
            },
            
            nextSteps: {
                title: isArabic ? '🚀 الخطوات التالية' : '🚀 Next Steps',
                items: isArabic ? [
                    '<strong>ابدأ صغيراً:</strong> قم ببناء نموذج أولي بسيط لوحدة واحدة (مثل قائمة موظفين بـ CRUD)',
                    '<strong>أضف مكونات تدريجياً:</strong> الموجه أولاً، ثم المخزن، ثم عميل API',
                    '<strong>اختبر مبكراً:</strong> أضف الاختبارات مع نمو التطبيق - أسهل بكثير من الإضافة لاحقاً',
                    '<strong>استخدم Cursor AI:</strong> اطلب من Cursor إنشاء مكونات تتبع هذه الأنماط - سيقوم بعمل ممتاز',
                    '<strong>الوثائق:</strong> احتفظ بملف README يشرح هندستك المعمارية وأنماطك'
                ] : [
                    '<strong>Start small:</strong> Build a simple prototype for one module (e.g., employee list with CRUD)',
                    '<strong>Add components gradually:</strong> Router first, then Store, then API client',
                    '<strong>Test early:</strong> Add tests as app grows - much easier than adding later',
                    '<strong>Use Cursor AI:</strong> Ask Cursor to generate components following these patterns - it will do great',
                    '<strong>Document:</strong> Keep a README explaining your architecture and patterns'
                ]
            },
            
            quickStart: {
                title: isArabic ? '🎯 البداية السريعة: بناء وحدة ERP الأولى باستخدام Vanilla JS' : '🎯 Quick Start: Building Your First Vanilla JS ERP Module',
                steps: isArabic ? [
                    {
                        title: 'إعداد الهندسة المعمارية الأساسية',
                        desc: 'قم بإنشاء الموجه، المخزن، وعميل API. قم بتهيئتهم في ملف التطبيق الرئيسي.'
                    },
                    {
                        title: 'إنشاء هيكل المكونات',
                        desc: 'قم ببناء مكونات قابلة لإعادة الاستخدام تتبع النمط: <code>init() → render() → attachEvents()</code>'
                    },
                    {
                        title: 'تحديد المسارات',
                        desc: 'سجل مساراتك مع الموجه. كل مسار يهيئ مكونه الخاص.'
                    },
                    {
                        title: 'الاتصال بالخلفية',
                        desc: 'استخدم عميل API لجلب البيانات، تحديث الحالة، وتفعيل إعادة العرض.'
                    }
                ] : [
                    {
                        title: 'Set Up Core Architecture',
                        desc: 'Create your Router, Store, and API client. Initialize them in your main app file.'
                    },
                    {
                        title: 'Create Component Structure',
                        desc: 'Build reusable components following the pattern: <code>init() → render() → attachEvents()</code>'
                    },
                    {
                        title: 'Define Routes',
                        desc: 'Register your routes with the router. Each route initializes its component.'
                    },
                    {
                        title: 'Connect to Backend',
                        desc: 'Use your API client to fetch data, update state, and trigger re-renders.'
                    }
                ],
                proTips: {
                    title: isArabic ? '💎 نصائح احترافية:' : '💎 Pro Tips:',
                    items: isArabic ? [
                        '✓ ابدأ بسيطاً - أضف التعقيد فقط عند الحاجة',
                        '✓ ادرس الكود المصدري لهذا الموقع - إنه مثال عملي!',
                        '✓ استخدم أدوات المطور لتصحيح الحالة والأحداث',
                        '✓ حافظ على المكونات نقية وقابلة للاختبار',
                        '✓ وثق قرارات هندستك المعمارية'
                    ] : [
                        '✓ Start simple - add complexity only when needed',
                        '✓ Study this website\'s source code - it\'s a working example!',
                        '✓ Use browser DevTools to debug state and events',
                        '✓ Keep components pure and testable',
                        '✓ Document your architecture decisions'
                    ]
                }
            }
        };
        
        container.innerHTML = `
            <div class="card">
                <h2>${t.pageTitle}</h2>
                <p>${t.pageIntro}</p>
            </div>
            
            <div class="vanilla-guide-section">
                <h3 class="guide-section-title">${t.architecture.title}</h3>
                
                <div class="guide-cards-grid">
                    <div class="guide-card">
                        <h4 class="guide-card-title">${t.architecture.router.title}</h4>
                        <p class="guide-card-desc">${t.architecture.router.desc}</p>
                        <div class="code-block">
                            <div class="code-header">
                                <span>router.js</span>
                            </div>
<pre><code>class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        window.addEventListener('hashchange', 
            () => this.handleRouteChange());
        this.handleRouteChange();
    }
    
    register(path, handler) {
        this.routes[path] = handler;
    }
    
    handleRouteChange() {
        const hash = window.location.hash.slice(1) || 'intro';
        
        // Hide all sections
        document.querySelectorAll('.content-section')
            .forEach(s => s.classList.add('hidden'));
        
        // Show target section
        const section = document.querySelector(
            \`.content-section[data-tab="\${hash}"]\`
        );
        if (section) {
            section.classList.remove('hidden');
            
            // Run route handler if exists
            if (this.routes[hash]) {
                this.routes[hash]();
            }
        }
    }
    
    navigate(path) {
        window.location.hash = path;
    }
}</code></pre>
                        </div>
                    </div>
                    
                    <div class="guide-card">
                        <h4 class="guide-card-title">${t.architecture.store.title}</h4>
                        <p class="guide-card-desc">${t.architecture.store.desc}</p>
                        <div class="code-block">
                            <div class="code-header">
                                <span>store.js</span>
                            </div>
<pre><code>class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = {};
    }
    
    getState() {
        return this.state;
    }
    
    setState(updates) {
        // Merge updates into state
        Object.assign(this.state, updates);
        
        // Notify subscribers
        Object.keys(updates).forEach(key => {
            if (this.subscribers[key]) {
                this.subscribers[key].forEach(fn => fn(this.state[key]));
            }
        });
    }
    
    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
        
        // Call immediately with current value
        callback(this.state[key]);
    }
}</code></pre>
                        </div>
                    </div>
                    
                    <div class="guide-card">
                        <h4 class="guide-card-title">${t.architecture.component.title}</h4>
                        <p class="guide-card-desc">${t.architecture.component.desc}</p>
                        <div class="code-block">
                            <div class="code-header">
                                <span>component-pattern.js</span>
                            </div>
<pre><code>// Component structure
const MyComponent = {
    init(container) {
        this.container = container;
        this.render();
        this.attachEvents();
        
        // Subscribe to state changes
        store.subscribe('data', (data) => {
            this.render();
        });
    },
    
    render() {
        this.container.innerHTML = \`
            <div class="my-component">
                <h3>\${store.getState().title}</h3>
                <button id="action-btn">Click Me</button>
            </div>
        \`;
    },
    
    attachEvents() {
        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'action-btn') {
                this.handleAction();
            }
        });
    },
    
    handleAction() {
        store.setState({ 
            title: 'Updated!' 
        });
    }
};</code></pre>
                        </div>
                    </div>
                    
                    <div class="guide-card">
                        <h4 class="guide-card-title">${t.architecture.api.title}</h4>
                        <p class="guide-card-desc">${t.architecture.api.desc}</p>
                        <div class="code-block">
                            <div class="code-header">
                                <span>api-client.js</span>
                            </div>
<pre><code>class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = null;
    }
    
    setToken(token) {
        this.token = token;
    }
    
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 
                'Authorization': \`Bearer \${this.token}\` 
            }),
            ...options.headers
        };
        
        try {
            const response = await fetch(
                \`\${this.baseURL}\${endpoint}\`, 
                { ...options, headers }
            );
            
            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}\`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    get(endpoint) {
        return this.request(endpoint);
    }
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="vanilla-guide-section">
                <h3 class="guide-section-title">${t.bestPractices.title}</h3>
                
                <div class="best-practices-grid">
                    <div class="practice-card">
                        <div class="practice-icon">🔒</div>
                        <h4>${t.bestPractices.security.title}</h4>
                        <ul>
                            ${t.bestPractices.security.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">📦</div>
                        <h4>${t.bestPractices.organization.title}</h4>
                        <ul>
                            ${t.bestPractices.organization.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">⚡</div>
                        <h4>${t.bestPractices.performance.title}</h4>
                        <ul>
                            ${t.bestPractices.performance.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">🧪</div>
                        <h4>${t.bestPractices.testing.title}</h4>
                        <ul>
                            ${t.bestPractices.testing.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">📱</div>
                        <h4>${t.bestPractices.responsive.title}</h4>
                        <ul>
                            ${t.bestPractices.responsive.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">♿</div>
                        <h4>${t.bestPractices.accessibility.title}</h4>
                        <ul>
                            ${t.bestPractices.accessibility.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="vanilla-guide-section">
                <h3 class="guide-section-title">${t.utilities.title}</h3>
                
                <div class="utilities-grid">
                    <div class="utility-card">
                        <h4>${t.utilities.domUtils}</h4>
                        <div class="code-block">
<pre><code>// Safe HTML escaping
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Query selector shorthand
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Event delegation
function delegate(parent, selector, event, handler) {
    parent.addEventListener(event, (e) => {
        if (e.target.matches(selector)) {
            handler(e);
        }
    });
}</code></pre>
                        </div>
                    </div>
                    
                    <div class="utility-card">
                        <h4>${t.utilities.debounceThrottle}</h4>
                        <div class="code-block">
<pre><code>// Debounce - wait for pause
function debounce(fn, delay = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttle - limit frequency
function throttle(fn, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}</code></pre>
                        </div>
                    </div>
                    
                    <div class="utility-card">
                        <h4>${t.utilities.formValidation}</h4>
                        <div class="code-block">
<pre><code>// Simple validation
function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, value] of Object.entries(formData)) {
        const rule = rules[field];
        if (!rule) continue;
        
        if (rule.required && !value) {
            errors[field] = \`\${field} is required\`;
        }
        
        if (rule.minLength && value.length < rule.minLength) {
            errors[field] = \`Min length: \${rule.minLength}\`;
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || 'Invalid format';
        }
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
}</code></pre>
                        </div>
                    </div>
                    
                    <div class="utility-card">
                        <h4>${t.utilities.loadingStates}</h4>
                        <div class="code-block">
<pre><code>// Loading indicator
class LoadingManager {
    constructor() {
        this.activeRequests = 0;
    }
    
    start() {
        this.activeRequests++;
        this.updateUI();
    }
    
    stop() {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.updateUI();
    }
    
    updateUI() {
        const loader = document.getElementById('global-loader');
        if (this.activeRequests > 0) {
            loader.classList.add('active');
        } else {
            loader.classList.remove('active');
        }
    }
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>${t.quickStart.title}</h3>
                <div class="quick-start-steps">
                    ${t.quickStart.steps.map((step, index) => `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p>${step.desc}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>${t.quickStart.proTips.title}</h4>
                    <ul>
                        ${t.quickStart.proTips.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    function renderCursorPreference(container) {
        const isArabic = currentLang === 'ar';
        
        const t = {
            pageTitle: isArabic ? '🤖 تحليل أداء Cursor AI' : '🤖 Cursor AI Performance Analysis',
            pageIntro: isArabic ? 'تقييم شامل لمدى فعالية Cursor AI في مساعدة التطوير في كل تقنية. بناءً على الاستخدام الفعلي عبر' : 'Comprehensive evaluation of how effectively Cursor AI assists development in each tech stack. Based on real-world usage across',
            keyScenariosText: isArabic ? 'سيناريو تطوير رئيسي.' : 'key development scenarios.',
            verdictTitle: isArabic ? '🏆 حكم Cursor AI' : '🏆 Cursor AI Verdict',
            vanillaJS: isArabic ? 'Vanilla JS + Web API' : 'Vanilla JS + Web API',
            dotnetSPA: isArabic ? '.NET Core + SPA' : '.NET Core + SPA',
            avgPerformance: isArabic ? 'متوسط أداء Cursor AI' : 'Average Cursor AI Performance',
            vsText: isArabic ? 'مقابل' : 'VS',
            keyInsightsTitle: isArabic ? '💡 رؤى رئيسية لتطوير Cursor AI:' : '💡 Key Insights for Cursor AI Development:',
            vanillaWins: isArabic ? 'تفوق Vanilla JS' : 'Vanilla JS Wins',
            dotnetWins: isArabic ? 'تفوق .NET + SPA' : '.NET + SPA Wins',
            bottomLineTitle: isArabic ? '🎯 الخلاصة:' : '🎯 Bottom Line:',
            bottomLineP1: isArabic ? 'Vanilla JS هو الفائز الواضح لتطوير بمساعدة Cursor AI' : 'Vanilla JS is the clear winner for Cursor AI-assisted development',
            withAvgScore: isArabic ? 'بمتوسط نقاط' : 'with an average score of',
            vs: isArabic ? 'مقابل' : 'vs',
            forDotnet: isArabic ? 'لـ .NET + SPA.' : 'for .NET + SPA.',
            bottomLineP2: isArabic ? 'يعمل Cursor AI بشكل أفضل مع الكود البسيط والقابل للتنبؤ. عدم وجود تعقيد إطار العمل يعني توليد أسرع، واتصال أوضح، وإعادة هيكلة أكثر موثوقية. إذا كنت تختار تقنية خصيصاً لتعظيم مساعدة الذكاء الاصطناعي، فإن Vanilla JavaScript هو الخيار الأمثل.' : 'Cursor AI works best with simple, predictable code. The lack of framework complexity means faster generation, clearer communication, and more reliable refactoring. If you\'re choosing a tech stack specifically to maximize AI assistance, <em>Vanilla JavaScript is the optimal choice</em>.',
            bottomLineP3: isArabic ? 'ومع ذلك، .NET + SPA يوفر أماناً أفضل في وقت الترجمة ويكتشف المزيد من الأخطاء قبل وقت التشغيل. المقايضة هي بين سرعة الذكاء الاصطناعي (Vanilla JS) مقابل أمان الأنواع (.NET + SPA).' : '<strong>However</strong>, .NET + SPA offers better compile-time safety and catches more bugs before runtime. The trade-off is between <em>AI velocity</em> (Vanilla JS) vs <em>type safety</em> (.NET + SPA).',
            cursorAdvantages: isArabic ? '✅ مزايا Cursor:' : '✅ Cursor Advantages:',
            limitations: isArabic ? '⚠️ القيود:' : '⚠️ Limitations:',
            excellent: isArabic ? 'ممتاز' : 'Excellent',
            good: isArabic ? 'جيد' : 'Good',
            fair: isArabic ? 'مقبول' : 'Fair',
            poor: isArabic ? 'ضعيف' : 'Poor',
            vanillaWinsItems: isArabic ? [
                '✓ <strong>توليد الكود:</strong> مخرجات أنظف وأبسط (10/10)',
                '✓ <strong>تفاعل المحادثة:</strong> تواصل أوضح (10/10)',
                '✓ <strong>منحنى التعلم:</strong> إنتاجية فورية (9/10)',
                '✓ <strong>السرعة:</strong> أسرع تكرار (9/10)'
            ] : [
                '✓ <strong>Code Generation:</strong> Cleaner, simpler output (10/10)',
                '✓ <strong>Chat Interaction:</strong> Clearer communication (10/10)',
                '✓ <strong>Learning Curve:</strong> Immediate productivity (9/10)',
                '✓ <strong>Velocity:</strong> Fastest iteration (9/10)'
            ],
            dotnetWinsItems: isArabic ? [
                '✓ <strong>كشف الأخطاء:</strong> أمان مدفوع بالأنواع (9/10)',
                '✓ <strong>الاختبار:</strong> أدوات اختبار إطار العمل (8/10)',
                '✓ <strong>التوثيق:</strong> وثائق إطار عمل غنية (8/10)',
                '✓ <strong>الإكمالات:</strong> اقتراحات مدفوعة بالأنواع (8/10)'
            ] : [
                '✓ <strong>Bug Detection:</strong> Type-driven safety (9/10)',
                '✓ <strong>Testing:</strong> Framework test utilities (8/10)',
                '✓ <strong>Documentation:</strong> Rich framework docs (8/10)',
                '✓ <strong>Completions:</strong> Type-driven suggestions (8/10)'
            ]
        };
        
        const cursorCategories = [
            {
                category: isArabic ? 'إكمال الكود والإكمال التلقائي' : 'Code Completion & Autocomplete',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'يتفوق Cursor مع vanilla JavaScript. أنماط بسيطة وقابلة للتنبؤ. لا توجد تعريفات أنواع معقدة. واجهات DOM القياسية معروفة جيداً لنموذج الذكاء الاصطناعي.' : 'Cursor excels with vanilla JavaScript. Simple, predictable patterns. No complex type definitions. Standard DOM APIs are well-known to the AI model.',
                vanillaProsCons: {
                    pros: isArabic ? ['إكمالات سريعة ودقيقة', 'لا غموض في الأنواع', 'واجهات قياسية في بيانات التدريب', 'توقيعات دوال بسيطة'] : ['Fast, accurate completions', 'No type ambiguity', 'Standard APIs in training data', 'Simple function signatures'],
                    cons: isArabic ? ['إرشاد هيكلي أقل', 'لا تلميحات TypeScript', 'فحص الأنواع يدوي', 'السياق قد يكون غامضاً'] : ['Less structural guidance', 'No TypeScript hints', 'Manual type checking', 'Context can be ambiguous']
                },
                dotnetScore: 8,
                dotnetDetails: isArabic ? 'جيد مع TypeScript/Angular/React. معلومات الأنواع الغنية تساعد الذكاء الاصطناعي. واجهات إطار العمل موثقة جيداً. ومع ذلك، الأنواع العامة المعقدة يمكن أن تربك النموذج.' : 'Good with TypeScript/Angular/React. Rich type information helps AI. Framework APIs are well-documented. However, complex generics can confuse the model.',
                dotnetProsCons: {
                    pros: isArabic ? ['اقتراحات مدفوعة بالأنواع', 'إكمالات واعية بإطار العمل', 'intellisense قوي', 'بناء هيكل المكونات'] : ['Type-driven suggestions', 'Framework-aware completions', 'Strong intellisense', 'Component scaffolding'],
                    cons: isArabic ? ['الأنواع المعقدة تبطئ', 'مشاكل استنتاج الأنواع العامة', 'أنماط صياغة متعددة', 'إصدار إطار العمل مهم'] : ['Complex types slow down', 'Generic inference issues', 'Multiple syntax styles', 'Framework version matters']
                }
            },
            {
                category: isArabic ? 'إعادة الهيكلة وتوليد الكود' : 'Refactoring & Code Generation',
                vanillaScore: 10,
                vanillaDetails: isArabic ? 'يتألق Cursor هنا. إعادات هيكلة بسيطة وقابلة للتنبؤ. توليد مكونات كاملة بسهولة. لا قيود إطار عمل. تحويلات JavaScript النقية واضحة ومباشرة.' : 'Cursor shines here. Simple, predictable refactorings. Generate entire components easily. No framework constraints. Pure JavaScript transformations are straightforward.',
                vanillaProsCons: {
                    pros: isArabic ? ['توليد كود نظيف', 'مخرجات سهلة الفهم', 'لا كود نمطي زائد', 'سرعة توليد عالية'] : ['Clean code generation', 'Easy to understand output', 'No boilerplate', 'Fast generation speed'],
                    cons: isArabic ? ['يجب تحديد الأنماط يدوياً', 'لا اتفاقيات إطار عمل', 'الهندسة المعمارية غير مفروضة', 'الاتساق يتطلب توجيهات'] : ['Must specify patterns manually', 'No framework conventions', 'Architecture not enforced', 'Consistency requires prompts']
                },
                dotnetScore: 7,
                dotnetDetails: isArabic ? 'يمكنه توليد الكود النمطي بشكل جيد، لكن أنماط إطار العمل غير مستقرة. أحياناً يولد أنماطاً قديمة. تسلسلات الأنواع المعقدة يمكن أن تسبب أخطاء.' : 'Can generate boilerplate well, but framework-specific patterns are hit-or-miss. Sometimes generates outdated patterns. Complex type hierarchies can cause errors.',
                dotnetProsCons: {
                    pros: isArabic ? ['بناء مكونات كاملة', 'توليد اختبارات', 'يتبع الاتفاقيات', 'مخرجات آمنة من حيث الأنواع'] : ['Scaffolds full components', 'Generates tests', 'Follows conventions', 'Type-safe output'],
                    cons: isArabic ? ['كود نمطي مطول', 'كود خاص بالإصدار', 'إصلاح أخطاء معقد', 'توليد أبطأ'] : ['Verbose boilerplate', 'Version-specific code', 'Complex error fixing', 'Slower generation']
                }
            },
            {
                category: isArabic ? 'اكتشاف الأخطاء وإصلاحها' : 'Bug Detection & Fixing',
                vanillaScore: 8,
                vanillaDetails: isArabic ? 'يمكن لـ Cursor اكتشاف الأخطاء المنطقية بفعالية. أخطاء وقت التشغيل أسهل في التحديد. تتبعات مكدس بسيطة. ومع ذلك، الأخطاء المتعلقة بالأنواع تُكتشف فقط في وقت التشغيل.' : 'Cursor can spot logical errors effectively. Runtime bugs are easier to identify. Simple stack traces. However, type-related bugs only caught at runtime.',
                vanillaProsCons: {
                    pros: isArabic ? ['رسائل خطأ واضحة', 'تصحيح بسيط', 'تتبعات مكدس مباشرة', 'لا أخطاء بناء'] : ['Clear error messages', 'Simple debugging', 'Direct stack traces', 'No build errors'],
                    cons: isArabic ? ['لا فحوصات وقت الترجمة', 'أخطاء الأنواع في وقت التشغيل', 'شبكة أمان أقل', 'التحقق اليدوي مطلوب'] : ['No compile-time checks', 'Type errors at runtime', 'Less safety net', 'Manual validation needed']
                },
                dotnetScore: 9,
                dotnetDetails: isArabic ? 'TypeScript + linting يكتشف العديد من الأخطاء قبل وقت التشغيل. يستفيد Cursor من معلومات الأنواع لاكتشاف أفضل للأخطاء. أمان وقت الترجمة مكسب كبير.' : 'TypeScript + linting catches many errors before runtime. Cursor leverages type information for better bug detection. Compile-time safety is a big win.',
                dotnetProsCons: {
                    pros: isArabic ? ['كشف الأخطاء في وقت الترجمة', 'إصلاحات مدفوعة بالأنواع', 'تكامل Linter', 'أمان وقائي'] : ['Compile-time error detection', 'Type-driven fixes', 'Linter integration', 'Preventive safety'],
                    cons: isArabic ? ['رسائل خطأ معقدة', 'مشاكل خط البناء', 'تعقيد نظام الأنواع', 'المزيد من الأخطاء لإصلاحها'] : ['Complex error messages', 'Build pipeline issues', 'Type system complexity', 'More errors to fix']
                }
            },
            {
                category: isArabic ? 'محادثة AI والطلبات باللغة الطبيعية' : 'AI Chat & Natural Language Requests',
                vanillaScore: 10,
                vanillaDetails: isArabic ? 'يفهم Cursor طلبات "JavaScript البسيطة" بشكل مثالي. لا حاجة لمصطلحات إطار العمل. تواصل مباشر وواضح. سهل لشرح ما تريد.' : 'Cursor understands "simple JavaScript" requests perfectly. No framework jargon needed. Direct, clear communication. Easy to explain what you want.',
                vanillaProsCons: {
                    pros: isArabic ? ['تواصل واضح', 'لا ارتباك بإطار العمل', 'تعليمات مباشرة', 'تكرار سريع'] : ['Clear communication', 'No framework confusion', 'Direct instructions', 'Fast iteration'],
                    cons: isArabic ? ['يجب وصف الهندسة المعمارية', 'لا اختصارات إطار العمل', 'شرح الأنماط مطلوب', 'إعداد السياق مطلوب'] : ['Must describe architecture', 'No framework shortcuts', 'Pattern explanations needed', 'Context setup required']
                },
                dotnetScore: 7,
                dotnetDetails: isArabic ? 'يجب تحديد إصدارات إطار العمل والأنماط. "طريقة Angular" مقابل "طريقة React" مهمة. مصطلحات خاصة بإطار العمل مطلوبة. المزيد من السياق مطلوب في التوجيهات.' : 'Must specify framework versions and patterns. "Angular way" vs "React way" matters. Framework-specific terminology required. More context needed in prompts.',
                dotnetProsCons: {
                    pros: isArabic ? ['اتفاقيات إطار العمل مفهومة', 'معرفة نظام بيئي غنية', 'مكتبات أنماط معروفة', 'أفضل الممارسات مدمجة'] : ['Framework conventions understood', 'Rich ecosystem knowledge', 'Pattern libraries known', 'Best practices built-in'],
                    cons: isArabic ? ['توجيهات خاصة بالإصدار', 'ارتباك إطار العمل', 'تعليمات مطولة', 'توضيح الأنماط مطلوب'] : ['Version-specific prompts', 'Framework confusion', 'Verbose instructions', 'Pattern disambiguation needed']
                }
            },
            {
                category: isArabic ? 'منحنى التعلم للتطوير بمساعدة AI' : 'Learning Curve for AI-Assisted Development',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'يمكن للمطورين المبتدئين البدء فوراً. اقتراحات Cursor سهلة الفهم. لا سحر إطار عمل للتعلم. ارتباط مباشر بين التوجيه والمخرجات.' : 'Junior developers can start immediately. Cursor suggestions are easy to understand. No framework magic to learn. Direct correlation between prompt and output.',
                vanillaProsCons: {
                    pros: isArabic ? ['صديق للمبتدئين', 'مخرجات قابلة للتنبؤ', 'سهل التعديل', 'مسار تعلم واضح'] : ['Beginner-friendly', 'Predictable output', 'Easy to modify', 'Clear learning path'],
                    cons: isArabic ? ['يجب تعلم الأنماط بنفسك', 'لا حواجز حماية إطار العمل', 'قرارات معمارية أصعب', 'المزيد من العمل اليدوي'] : ['Must learn patterns yourself', 'No framework guardrails', 'Architectural decisions harder', 'More manual work']
                },
                dotnetScore: 6,
                dotnetDetails: isArabic ? 'منحنى تعلم حاد حتى مع الذكاء الاصطناعي. يجب فهم إطار العمل أولاً. يمكن لـ Cursor توليد كود لا تفهمه. معرفة إطار العمل لا تزال مطلوبة.' : 'Steep learning curve even with AI. Must understand framework first. Cursor can generate code you don\'t understand. Framework knowledge still required.',
                dotnetProsCons: {
                    pros: isArabic ? ['يولد أنماطاً معقدة', 'أفضل ممارسات إطار العمل', 'يبني الهيكل', 'حلول شاملة'] : ['Generates complex patterns', 'Framework best practices', 'Scaffolds structure', 'Comprehensive solutions'],
                    cons: isArabic ? ['صعب فهم المخرجات', 'معرفة إطار العمل مطلوبة', 'توليد صندوق أسود', 'تصحيح كود AI أصعب'] : ['Hard to understand output', 'Framework knowledge required', 'Black box generation', 'Debugging AI code harder']
                }
            },
            {
                category: isArabic ? 'التوثيق واكتشاف API' : 'Documentation & API Discovery',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'MDN ومعايير الويب موثقة بشكل واسع. يعرف Cursor جميع واجهات API القياسية. توثيق بسيط ومستقر. لا مشاكل إصدارات.' : 'MDN and web standards are extensively documented. Cursor knows all standard APIs. Simple, stable documentation. No versioning issues.',
                vanillaProsCons: {
                    pros: isArabic ? ['واجهات API مستقرة', 'وثائق شاملة', 'لا مشاكل إصدارات', 'معرفة عالمية'] : ['Stable APIs', 'Comprehensive docs', 'No version issues', 'Universal knowledge'],
                    cons: isArabic ? ['يجب اكتشاف الأنماط', 'لا وثائق إطار عمل', 'أنماط المجتمع تختلف', 'أفضل الممارسات متناثرة'] : ['Must discover patterns', 'No framework docs', 'Community patterns vary', 'Best practices scattered']
                },
                dotnetScore: 8,
                dotnetDetails: isArabic ? 'توثيق إطار عمل غني. يعرف Cursor الوثائق الرسمية جيداً. ومع ذلك، إصدارات إطار العمل المتعددة تخلق ارتباكاً. الوثائق تتغير بشكل متكرر.' : 'Rich framework documentation. Cursor knows official docs well. However, multiple framework versions create confusion. Docs change frequently.',
                dotnetProsCons: {
                    pros: isArabic ? ['توثيق رسمي', 'أدلة إطار العمل', 'غني بالأمثلة', 'أنماط المجتمع'] : ['Official documentation', 'Framework guides', 'Example-rich', 'Community patterns'],
                    cons: isArabic ? ['تجزئة الإصدارات', 'الوثائق تصبح قديمة', 'مصادر متعددة', 'أنماط مهجورة'] : ['Version fragmentation', 'Docs go stale', 'Multiple sources', 'Deprecated patterns']
                }
            },
            {
                category: isArabic ? 'توليد كود الاختبار' : 'Testing Code Generation',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'يولد Cursor اختبارات نظيفة وبسيطة. اختبار الدوال النقية واضح ومباشر. توليد Mock بسيط. كود الاختبار سهل الفهم.' : 'Cursor generates clean, simple tests. Pure function testing is straightforward. Mock generation is simple. Test code is easy to understand.',
                vanillaProsCons: {
                    pros: isArabic ? ['توليد اختبارات بسيط', 'مocking سهل', 'تأكيدات واضحة', 'كتابة اختبارات سريعة'] : ['Simple test generation', 'Easy mocking', 'Clear assertions', 'Fast test writing'],
                    cons: isArabic ? ['اختبار DOM يدوي', 'لا اختبار مكونات', 'يجب تحديد الأنماط', 'اختبار بدون إطار عمل'] : ['DOM testing manual', 'No component testing', 'Must define patterns', 'Framework-less testing']
                },
                dotnetScore: 8,
                dotnetDetails: isArabic ? 'يمكنه توليد مجموعات اختبار كاملة. أدوات اختبار إطار العمل معروفة. ومع ذلك، كود الإعداد المعقد والأنماط الخاصة بإطار العمل يمكن أن تكون مربكة.' : 'Can generate full test suites. Framework testing utilities known. However, complex setup code and framework-specific patterns can be confusing.',
                dotnetProsCons: {
                    pros: isArabic ? ['توليد اختبار المكونات', 'أدوات اختبار إطار العمل', 'مجموعات اختبار كاملة', 'mocking مدمج'] : ['Component test generation', 'Framework test utils', 'Complete test suites', 'Mocking built-in'],
                    cons: isArabic ? ['كود اختبار مطول', 'إعداد معقد', 'خاص بإطار العمل', 'أصعب للتعديل'] : ['Verbose test code', 'Complex setup', 'Framework-specific', 'Harder to modify']
                }
            },
            {
                category: isArabic ? 'اقتراحات تحسين الأداء' : 'Performance Optimization Suggestions',
                vanillaScore: 8,
                vanillaDetails: isArabic ? 'يمكن لـ Cursor اقتراح تحسينات أداء مباشرة. تحسينات بسيطة مثل تفويض الأحداث والتخزين المؤقت. ومع ذلك، الأنماط المتقدمة تتطلب تنفيذاً يدوياً.' : 'Cursor can suggest direct performance improvements. Simple optimizations like event delegation, caching. However, advanced patterns require manual implementation.',
                vanillaProsCons: {
                    pros: isArabic ? ['تحسينات مباشرة', 'مكاسب أداء واضحة', 'لا حمل إطار عمل', 'تحسينات قابلة للقياس'] : ['Direct optimizations', 'Clear performance wins', 'No framework overhead', 'Measurable improvements'],
                    cons: isArabic ? ['تنفيذ يدوي', 'لا أنماط إطار عمل', 'التحليل يدوي', 'معرفة الأنماط مطلوبة'] : ['Manual implementation', 'No framework patterns', 'Profiling manual', 'Pattern knowledge needed']
                },
                dotnetScore: 7,
                dotnetDetails: isArabic ? 'تحسينات خاصة بإطار العمل معروفة. Memoization، التحميل الكسول، تقسيم الكود. لكن تعقيد إطار العمل يمكن أن يخفي المشاكل. تحسينات وقت البناء تحتاج خبرة.' : 'Framework-specific optimizations known. Memoization, lazy loading, code splitting. But framework complexity can mask issues. Build-time optimizations need expertise.',
                dotnetProsCons: {
                    pros: isArabic ? ['تحسينات إطار العمل', 'تحليل وقت البناء', 'أدوات التحليل', 'مكتبات أنماط'] : ['Framework optimizations', 'Build-time analysis', 'Profiling tools', 'Pattern libraries'],
                    cons: isArabic ? ['تعقيد إطار العمل', 'صعب القياس', 'تكوين البناء', 'طبقات تحسين متعددة'] : ['Framework complexity', 'Hard to measure', 'Build configuration', 'Multiple optimization layers']
                }
            },
            {
                category: isArabic ? 'التعديلات متعددة الملفات وإعادة الهيكلة الكبيرة' : 'Multi-file Edits & Large Refactors',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'يتعامل Cursor مع التغييرات متعددة الملفات بشكل جيد. استيرادات وتبعيات بسيطة. سهل تتبع التغييرات. لا اعتبارات بناء معقدة.' : 'Cursor handles multi-file changes well. Simple imports and dependencies. Easy to track changes. No complex build considerations.',
                vanillaProsCons: {
                    pros: isArabic ? ['تعديلات متعددة ملفات نظيفة', 'تبعيات بسيطة', 'تتبع سهل', 'تنفيذ سريع'] : ['Clean multi-file edits', 'Simple dependencies', 'Easy tracking', 'Fast execution'],
                    cons: isArabic ? ['تنسيق يدوي', 'لا أمان أنواع', 'أخطاء وقت تشغيل محتملة', 'إدارة الاستيرادات يدوية'] : ['Manual coordination', 'No type safety', 'Runtime errors possible', 'Import management manual']
                },
                dotnetScore: 7,
                dotnetDetails: isArabic ? 'نظام الأنواع يساعد في إعادة الهيكلة. لكن سلاسل التبعية المعقدة يمكن أن تسبب مشاكل. أخطاء البناء بعد تعديلات AI شائعة. إعادات هيكلة TypeScript يمكن أن تكون بطيئة.' : 'Type system helps with refactoring. But complex dependency chains can cause issues. Build errors after AI edits are common. TypeScript refactors can be slow.',
                dotnetProsCons: {
                    pros: isArabic ? ['إعادة هيكلة آمنة من حيث الأنواع', 'تحديث الاستيرادات تلقائياً', 'التحقق في وقت الترجمة', 'تكامل IDE'] : ['Type-safe refactoring', 'Import auto-update', 'Compile-time validation', 'IDE integration'],
                    cons: isArabic ? ['بطيء مع التغييرات الكبيرة', 'أخطاء البناء شائعة', 'تبعيات معقدة', 'أخطاء الأنواع تتسلسل'] : ['Slow with large changes', 'Build errors common', 'Complex dependencies', 'Type errors cascade']
                }
            },
            {
                category: isArabic ? 'سرعة المطور الإجمالية مع Cursor' : 'Overall Developer Velocity with Cursor',
                vanillaScore: 9,
                vanillaDetails: isArabic ? 'أقصى سرعة للمطورين ذوي الخبرة. تكرار سريع. تحكم مباشر. لا حمل إطار عمل. يصبح Cursor شريك برمجة فائق القوة.' : 'Maximum velocity for experienced devs. Fast iteration. Direct control. No framework overhead. Cursor becomes a super-powered coding partner.',
                vanillaProsCons: {
                    pros: isArabic ? ['أسرع تكرار', 'ردود فعل فورية', 'لا وقت بناء', 'تطوير مباشر'] : ['Fastest iteration', 'Immediate feedback', 'No build time', 'Direct development'],
                    cons: isArabic ? ['يجب توجيه الهندسة المعمارية', 'لا اختصارات إطار عمل', 'فرض الأنماط يدوي', 'مواءمة الفريق أصعب'] : ['Must guide architecture', 'No framework shortcuts', 'Pattern enforcement manual', 'Team alignment harder']
                },
                dotnetScore: 7,
                dotnetDetails: isArabic ? 'سرعة جيدة بمجرد معرفة إطار العمل. يساعد Cursor في الكود النمطي. لكن أوقات البناء، أخطاء الأنواع، وتعقيد إطار العمل تبطئ الأمور.' : 'Good velocity once framework is known. Cursor helps with boilerplate. But build times, type errors, and framework complexity slow things down.',
                dotnetProsCons: {
                    pros: isArabic ? ['سرعة البناء الهيكلي', 'اتفاقيات إطار العمل', 'نظام بيئي غني', 'أنماط المؤسسة'] : ['Scaffolding speed', 'Framework conventions', 'Rich ecosystem', 'Enterprise patterns'],
                    cons: isArabic ? ['حمل وقت البناء', 'تصحيح إطار العمل', 'إصلاح أخطاء معقد', 'حلقة ردود فعل أبطأ'] : ['Build time overhead', 'Framework debugging', 'Complex error fixing', 'Slower feedback loop']
                }
            }
        ];
        
        const getScoreClass = (score) => {
            if (score >= 9) return 'score-excellent';
            if (score >= 7) return 'score-good';
            if (score >= 5) return 'score-fair';
            return 'score-poor';
        };
        
        const getScoreLabel = (score) => {
            if (score >= 9) return isArabic ? t.excellent : 'Excellent';
            if (score >= 7) return isArabic ? t.good : 'Good';
            if (score >= 5) return isArabic ? t.fair : 'Fair';
            return isArabic ? t.poor : 'Poor';
        };
        
        const cursorHTML = cursorCategories.map(cat => `
            <div class="cursor-row-card">
                <div class="cursor-row-header">
                    <h3 class="cursor-row-title">${cat.category}</h3>
                    <div class="cursor-scores">
                        <div class="cursor-score-item vanilla-score">
                            <span class="score-label">🟦 ${t.vanillaJS}:</span>
                            <span class="score-badge ${getScoreClass(cat.vanillaScore)}">${cat.vanillaScore}/10 - ${getScoreLabel(cat.vanillaScore)}</span>
                        </div>
                        <div class="cursor-score-item dotnet-score">
                            <span class="score-label">🟪 ${t.dotnetSPA}:</span>
                            <span class="score-badge ${getScoreClass(cat.dotnetScore)}">${cat.dotnetScore}/10 - ${getScoreLabel(cat.dotnetScore)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="cursor-row-content">
                    <div class="cursor-column vanilla-column">
                        <div class="column-header">
                            <span class="column-icon">🟦</span>
                            <span class="column-title">${t.vanillaJS}</span>
                        </div>
                        
                        <p class="cursor-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${t.cursorAdvantages}</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${t.limitations}</strong>
                                <ul>
                                    ${cat.vanillaProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cursor-column-divider"></div>
                    
                    <div class="cursor-column dotnet-column">
                        <div class="column-header">
                            <span class="column-icon">🟪</span>
                            <span class="column-title">${t.dotnetSPA}</span>
                        </div>
                        
                        <p class="cursor-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">${t.cursorAdvantages}</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">${t.limitations}</strong>
                                <ul>
                                    ${cat.dotnetProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Calculate overall winner
        const vanillaTotal = cursorCategories.reduce((sum, cat) => sum + cat.vanillaScore, 0);
        const dotnetTotal = cursorCategories.reduce((sum, cat) => sum + cat.dotnetScore, 0);
        const vanillaAvg = (vanillaTotal / cursorCategories.length).toFixed(1);
        const dotnetAvg = (dotnetTotal / cursorCategories.length).toFixed(1);
        
        container.innerHTML = `
            <div class="card">
                <h2>${t.pageTitle}</h2>
                <p>${t.pageIntro} ${cursorCategories.length} ${t.keyScenariosText}</p>
            </div>
            
            ${cursorHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>${t.verdictTitle}</h3>
                
                <div class="cursor-final-scores">
                    <div class="final-score-card vanilla-final">
                        <div class="final-score-icon">🟦</div>
                        <div class="final-score-details">
                            <h4>${t.vanillaJS}</h4>
                            <div class="final-score-number">${vanillaAvg}/10</div>
                            <p>${t.avgPerformance}</p>
                        </div>
                    </div>
                    
                    <div class="final-score-divider">${t.vsText}</div>
                    
                    <div class="final-score-card dotnet-final">
                        <div class="final-score-icon">🟪</div>
                        <div class="final-score-details">
                            <h4>${t.dotnetSPA}</h4>
                            <div class="final-score-number">${dotnetAvg}/10</div>
                            <p>${t.avgPerformance}</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>${t.keyInsightsTitle}</h4>
                    <div class="insights-grid">
                        <div>
                            <h5>${t.vanillaWins}</h5>
                            <ul>
                                ${t.vanillaWinsItems.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h5>${t.dotnetWins}</h5>
                            <ul>
                                ${t.dotnetWinsItems.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: rgba(99, 102, 241, 0.1); border-radius: var(--border-radius);">
                        <h4>${t.bottomLineTitle}</h4>
                        <p><strong>${t.bottomLineP1}</strong> ${t.withAvgScore} <strong>${vanillaAvg}/10</strong> ${t.vs} <strong>${dotnetAvg}/10</strong> ${t.forDotnet}</p>
                        <p>${t.bottomLineP2}</p>
                        <p>${t.bottomLineP3}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRecommendation(container) {
        const criteria = store.getState().criteria;
        const tcoInputs = store.getState().tcoInputs;
        
        // Calculate Decision Matrix scores
        let vanillaTotal = 0, dotnetTotal = 0, totalWeight = 0;
        criteria.forEach(c => {
            vanillaTotal += c.weight * c.scores.vanilla;
            dotnetTotal += c.weight * c.scores.dotnet;
            totalWeight += c.weight;
        });
        const vanillaScore = (vanillaTotal / totalWeight).toFixed(1);
        const dotnetScore = (dotnetTotal / totalWeight).toFixed(1);
        
        // Calculate TCO (Year 1)
        const monthlyBurnRate = tcoInputs.teamSize * tcoInputs.blendedRate;
        const vanillaSetupCost = (tcoInputs.setupMonths * 0.5) * monthlyBurnRate;
        const vanillaBuildMonths = 12 / tcoInputs.vanillaVelocity;
        const vanillaBuildCost = vanillaBuildMonths * monthlyBurnRate;
        const vanillaTotalBuild = vanillaSetupCost + vanillaBuildCost;
        const vanillaYear1Maint = vanillaTotalBuild * (tcoInputs.year1Maintenance / 100);
        const vanillaYear1Total = vanillaTotalBuild + vanillaYear1Maint;
        
        const dotnetSetupCost = tcoInputs.setupMonths * monthlyBurnRate;
        const dotnetBuildMonths = 12 / tcoInputs.dotnetVelocity;
        const dotnetBuildCost = dotnetBuildMonths * monthlyBurnRate;
        const dotnetTotalBuild = dotnetSetupCost + dotnetBuildCost;
        const dotnetYear1Maint = dotnetTotalBuild * (tcoInputs.year1Maintenance / 100);
        const dotnetYear1Total = dotnetTotalBuild + dotnetYear1Maint;
        
        const tcoDifference = Math.abs(vanillaYear1Total - dotnetYear1Total);
        const tcoCheaper = vanillaYear1Total < dotnetYear1Total ? 'Vanilla JS' : '.NET + SPA';
        
        // Cursor AI scores (hardcoded averages from the analysis)
        const cursorVanillaAvg = 8.9;
        const cursorDotnetAvg = 7.5;
        const cursorProductivityDiff = (cursorVanillaAvg - cursorDotnetAvg) / 10; // 0.14 = 14% relative advantage
        
        // Cursor AI Subscription Costs (annual)
        // Assuming Cursor Pro: $20/month/user = $240/year/user
        const cursorCostPerDev = 0.24; // in thousands KWD (240 KWD per year per developer)
        const cursorAnnualCost = tcoInputs.teamSize * cursorCostPerDev;
        
        // Cursor AI usage estimation for COMPLEX ERP with extensive UI
        // System includes: Accounting, Inventory, HR, Payroll, Reporting
        // Complex UI: Tree grids, data tables, charts, dashboards, multi-step forms
        // Vanilla JS: Higher productivity with Cursor = fewer requests needed for same work
        // .NET + SPA: Much more requests due to framework complexity + UI library setup
        const vanillaTasksPerYear = 1500; // Estimated tasks (modules: accounting, inventory, HR, payroll, reports, dashboards)
        const dotnetTasksPerYear = vanillaTasksPerYear * 1.6; // 60% more tasks due to framework boilerplate, component configuration
        
        // Average requests per task (complex ERP with rich UI = many more iterations)
        // Vanilla: Direct DOM manipulation, custom components, simpler debugging
        // .NET: Component library setup, props/state management, type definitions, build issues
        const vanillaRequestsPerTask = 30; // Tree grids, forms, validations - but straightforward with Cursor
        const dotnetRequestsPerTask = 55; // Angular/React components, state management, type errors, library conflicts, build configuration
        
        // Total Cursor requests
        const vanillaTotalRequests = vanillaTasksPerYear * vanillaRequestsPerTask;
        const dotnetTotalRequests = dotnetTasksPerYear * dotnetRequestsPerTask;
        
        // Request cost impact (higher request volume = more time = more cost)
        // For complex ERP with extensive UI, overhead is significantly higher:
        // - UI component debugging and testing
        // - Cross-module integration
        // - Complex business logic (accounting calculations, inventory transactions, payroll)
        const requestOverheadRate = 0.001; // KWD per request (higher for ERP + complex UI)
        const vanillaRequestCost = vanillaTotalRequests * requestOverheadRate;
        const dotnetRequestCost = dotnetTotalRequests * requestOverheadRate;
        
        // Both teams use Cursor AI, but Vanilla JS gets better productivity
        // Apply productivity boost to BOTH, but Vanilla gets a higher boost
        const vanillaProductivityMultiplier = 1 - (cursorProductivityDiff * 0.6); // 8.4% faster
        const dotnetProductivityMultiplier = 1 - (cursorProductivityDiff * 0.2); // 2.8% faster (less effective)
        
        const vanillaWithCursor = (vanillaYear1Total * vanillaProductivityMultiplier) + cursorAnnualCost + vanillaRequestCost;
        const dotnetWithCursor = (dotnetYear1Total * dotnetProductivityMultiplier) + cursorAnnualCost + dotnetRequestCost;
        
        // Savings calculation
        const vanillaDevSavings = vanillaYear1Total - (vanillaYear1Total * vanillaProductivityMultiplier);
        const dotnetDevSavings = dotnetYear1Total - (dotnetYear1Total * dotnetProductivityMultiplier);
        const totalSavings = dotnetWithCursor - vanillaWithCursor;
        
        // Effective cost difference considering Cursor AI productivity
        const effectiveTcoDifference = Math.abs(vanillaWithCursor - dotnetWithCursor);
        const effectiveTcoCheaper = vanillaWithCursor < dotnetWithCursor ? 'Vanilla JS' : '.NET + SPA';
        
        // Determine overall winner and confidence
        let vanillaPoints = 0;
        let dotnetPoints = 0;
        
        // Decision Matrix winner (40% weight)
        if (parseFloat(vanillaScore) > parseFloat(dotnetScore)) {
            vanillaPoints += 40;
        } else {
            dotnetPoints += 40;
        }
        
        // Effective TCO winner (including Cursor AI productivity) (30% weight)
        if (vanillaWithCursor < dotnetWithCursor) {
            vanillaPoints += 30;
        } else {
            dotnetPoints += 30;
        }
        
        // Cursor AI winner (30% weight)
        if (cursorVanillaAvg > cursorDotnetAvg) {
            vanillaPoints += 30;
        } else {
            dotnetPoints += 30;
        }
        
        const overallWinner = vanillaPoints > dotnetPoints ? 'Vanilla JS + Web API' : '.NET Core + Angular/React';
        const confidence = Math.max(vanillaPoints, dotnetPoints);
        const confidenceLevel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Moderate' : 'Low';
        
        // Translation object
        const isArabic = currentLang === 'ar';
        const t = {
            summaryTitle: isArabic ? '📊 ملخص التحليل الشامل' : '📊 Comprehensive Analysis Summary',
            summaryDesc: isArabic ? 'بناءً على تقييم مصفوفة القرار، نموذج TCO، وتأثير إنتاجية Cursor AI.' : 'Based on your Decision Matrix scoring, TCO modeling, and Cursor AI productivity impact.',
            cursorTeamNote: isArabic ? `⚡ فريقك المكون من ${tcoInputs.teamSize} مطورين سيستخدم Cursor AI - هذه الزيادة في الإنتاجية محسوبة في جميع تكاليف الحساب أدناه.` : `⚡ Your team of ${tcoInputs.teamSize} developers will use Cursor AI - this productivity boost is factored into all cost calculations below.`,
            
            matrixTitle: isArabic ? '🎯 نتائج مصفوفة القرار' : '🎯 Decision Matrix Results',
            vanillaLabel: isArabic ? '🟦 Vanilla JS' : '🟦 Vanilla JS',
            dotnetLabel: isArabic ? '🟪 .NET + SPA' : '🟪 .NET + SPA',
            vs: isArabic ? 'مقابل' : 'VS',
            basedOnCriteria: isArabic ? `بناءً على ${criteria.length} معايير مرجحة حسب أولوياتك` : `Based on ${criteria.length} criteria weighted by your priorities`,
            
            baseTcoTitle: isArabic ? '💰 TCO الأساسي (السنة الأولى، بدون AI)' : '💰 Base TCO (Year 1, No AI)',
            tcoCheaperNote: isArabic ? `<strong>${tcoCheaper}</strong> أرخص بـ ${formatNumber(tcoDifference)}K دينار كويتي (${((tcoDifference / Math.max(vanillaYear1Total, dotnetYear1Total)) * 100).toFixed(0)}% توفير)` : `<strong>${tcoCheaper}</strong> is ${formatNumber(tcoDifference)}K KWD cheaper (${((tcoDifference / Math.max(vanillaYear1Total, dotnetYear1Total)) * 100).toFixed(0)}% savings)`,
            
            cursorPerfTitle: isArabic ? '🤖 أداء Cursor AI' : '🤖 Cursor AI Performance',
            cursorPerfNote: isArabic ? `${(cursorProductivityDiff * 100).toFixed(1)}% ميزة أداء الذكاء الاصطناعي تترجم إلى مكاسب إنتاجية` : `${(cursorProductivityDiff * 100).toFixed(1)}% AI performance advantage translates to productivity gains`,
            
            cursorImpactTitle: isArabic ? '⚡ تحليل تأثير تكلفة Cursor AI' : '⚡ Cursor AI Cost Impact Analysis',
            cursorImpactDesc: isArabic ? `بما أن مطوريك الـ ${tcoInputs.teamSize} سيستخدمون Cursor AI بغض النظر عن اختيار التقنية، فإن الأداء المتفوق للذكاء الاصطناعي مع Vanilla JS يترجم مباشرة إلى توفير في التكاليف من خلال تطوير أسرع وطلبات أقل للذكاء الاصطناعي.` : `Since your ${tcoInputs.teamSize} developers will use Cursor AI regardless of tech stack choice, the AI's superior performance with Vanilla JS translates directly to cost savings through faster development and fewer AI requests.`,
            
            vanillaCursorTitle: isArabic ? '🟦 Vanilla JS + Cursor AI' : '🟦 Vanilla JS + Cursor AI',
            dotnetCursorTitle: isArabic ? '🟪 .NET + SPA + Cursor AI' : '🟪 .NET + SPA + Cursor AI',
            baseCost: isArabic ? 'تكلفة التطوير الأساسية:' : 'Base Development Cost:',
            cursorBoost: isArabic ? 'دفعة Cursor AI' : 'Cursor AI Boost',
            cursorSubscription: isArabic ? 'اشتراك Cursor' : 'Cursor Subscription',
            requestOverhead: isArabic ? 'حمل الطلبات' : 'Request Overhead',
            totalCost: isArabic ? 'التكلفة الإجمالية:' : 'Total Cost:',
            estimatedTasks: isArabic ? 'مهام ERP المقدرة:' : 'Estimated ERP tasks:',
            
            totalSavingsTitle: isArabic ? '💰 إجمالي التوفير مع Cursor AI' : '💰 Total Savings with Cursor AI',
            cheaperWith: isArabic ? `(${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% أرخص مع Vanilla JS + Cursor AI)` : `(${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% cheaper with Vanilla JS + Cursor AI)`,
            devMonths: isArabic ? 'شهور مطور' : 'developer-months',
            additionalCapacity: isArabic ? `هذا يساوي <strong style="color: var(--color-success);">${(totalSavings / tcoInputs.blendedRate).toFixed(1)} ${isArabic ? 'شهور مطور' : 'developer-months'}</strong> من القدرة الإضافية أو توفير الميزانية.` : `This equals <strong style="color: var(--color-success);">${(totalSavings / tcoInputs.blendedRate).toFixed(1)} developer-months</strong> of additional capacity or budget savings.`,
            requestReduction: isArabic ? 'تقليل طلبات Cursor:' : 'Cursor request reduction:',
            fewerRequests: isArabic ? `${(dotnetTotalRequests - vanillaTotalRequests).toLocaleString()} طلب أقل مع Vanilla JS (${(((dotnetTotalRequests - vanillaTotalRequests) / dotnetTotalRequests) * 100).toFixed(0)}% أقل)` : `${(dotnetTotalRequests - vanillaTotalRequests).toLocaleString()} fewer requests with Vanilla JS (${(((dotnetTotalRequests - vanillaTotalRequests) / dotnetTotalRequests) * 100).toFixed(0)}% less)`,
            
            finalRecTitle: isArabic ? '🏆 التوصية النهائية' : '🏆 Final Recommendation',
            confidenceLevel: isArabic ? 'مستوى الثقة:' : 'Confidence Level:',
            high: isArabic ? 'عالي' : 'High',
            moderate: isArabic ? 'متوسط' : 'Moderate',
            low: isArabic ? 'منخفض' : 'Low',
            keyFactorsTitle: isArabic ? '📌 عوامل القرار الرئيسية:' : '📌 Key Decision Factors:',
            
            chooseVanilla: isArabic ? '✅ اختر Vanilla JS إذا:' : '✅ Choose Vanilla JS if:',
            chooseDotnet: isArabic ? '✅ اختر .NET + SPA إذا:' : '✅ Choose .NET + SPA if:',
            
            vanillaReasons: isArabic ? [
                'فريقك سيستخدم Cursor AI وتريد أقصى إنتاجية',
                'تريد تقليل طلبات Cursor AI',
                'حجم فريقك صغير إلى متوسط مع مساعدة AI',
                'الوقت للسوق حرج',
                'توفير التكلفة الإجمالية مهم',
                'تريد من AI توليد كود أنظف وأكثر قابلية للتنبؤ',
                'فريقك لديه أساسيات JavaScript قوية',
                'تعطي الأولوية للأداء والبساطة'
            ] : [
                'Your team will use Cursor AI and you want maximum productivity',
                'You want to minimize Cursor AI requests',
                'Your team size is small to medium with AI assistance',
                'Time to market is critical',
                'Total cost savings matter',
                'You want AI to generate cleaner, more predictable code',
                'Your team has strong JavaScript fundamentals',
                'You prioritize performance and simplicity'
            ],
            
            dotnetReasons: isArabic ? [
                'التكلفة الإضافية مقبولة',
                'حجم طلبات Cursor AI الأعلى ليس مصدر قلق',
                'فريقك كبير أو ينمو بسرعة (6+ مطورين)',
                'ميزات واتفاقيات المؤسسات مطلوبة',
                'أمان الأنواع وفحص وقت الترجمة أولويات',
                'تحتاج مكتبات مكونات واجهة واسعة',
                'الفريق لديه خبرة .NET موجودة',
                'معايير الشركة تفرض استخدام إطار عمل'
            ] : [
                'Additional cost is acceptable',
                'Higher Cursor AI request volume is not a concern',
                'Your team is large or rapidly growing (6+ developers)',
                'Enterprise features and conventions are required',
                'Type safety and compile-time checking are priorities',
                'You need extensive UI component libraries',
                'Team has existing .NET expertise',
                'Corporate standards mandate framework usage'
            ],
            
            criticalConsiderations: isArabic ? '⚠️ اعتبارات حرجة' : '⚠️ Critical Considerations',
            riskFactorsVanilla: isArabic ? 'عوامل المخاطر - Vanilla JS:' : 'Risk Factors - Vanilla JS:',
            riskFactorsDotnet: isArabic ? 'عوامل المخاطر - .NET + SPA:' : 'Risk Factors - .NET + SPA:',
            
            vanillaRisks: isArabic ? [
                { title: 'الانضباط المعماري:', desc: 'يتطلب قيادة تقنية قوية للحفاظ على الاتساق' },
                { title: 'معرفة الفريق:', desc: 'قد يحتاج تدريب على الأنماط والهندسة المعمارية المخصصة' },
                { title: 'تخطيط القابلية للتوسع:', desc: 'حاجة لاتفاقيات واضحة مع نمو الفريق/قاعدة الكود' },
                { title: 'اليقظة الأمنية:', desc: 'الحماية اليدوية من XSS/CSRF تتطلب خبرة' }
            ] : [
                { title: 'Architectural Discipline:', desc: 'Requires strong technical leadership to maintain consistency' },
                { title: 'Team Knowledge:', desc: 'May need training on custom patterns and architecture' },
                { title: 'Scalability Planning:', desc: 'Need clear conventions as team/codebase grows' },
                { title: 'Security Vigilance:', desc: 'Manual XSS/CSRF protection requires expertise' }
            ],
            
            dotnetRisks: isArabic ? [
                { title: 'التعقيد الأولي:', desc: 'وقت إعداد أطول (إعداد كامل)' },
                { title: 'تقلب إطار العمل:', desc: 'ترقيات الإصدار يمكن أن تكون مدمرة' },
                { title: 'منحنى التعلم:', desc: 'تأهيل أكثر حدة (وقت البناء)' },
                { title: 'حمل البناء:', desc: 'تكرار أبطأ مع خطوة الترجمة' }
            ] : [
                { title: 'Initial Complexity:', desc: 'Longer setup time (full setup)' },
                { title: 'Framework Churn:', desc: 'Version upgrades can be disruptive' },
                { title: 'Learning Curve:', desc: 'Steeper onboarding (build time)' },
                { title: 'Build Overhead:', desc: 'Slower iteration with compilation step' }
            ],
            
            nextStepsTitle: isArabic ? '💡 الخطوات التالية' : '💡 Next Steps',
            nextStepsList: isArabic ? [
                { title: 'التحقق من تأثير Cursor AI', desc: 'التوفير يشمل اشتراك + طلبات مقدرة. قم بتشغيل نموذج أولي لمدة أسبوعين للتحقق من أحجام الطلبات.' },
                { title: 'مراجعة مصفوفة القرار', desc: 'تأكد من أن أوزان معاييرك تعكس أولوياتك بدقة' },
                { title: 'التحقق من افتراضات TCO', desc: 'اضبط حجم الفريق، الرواتب، ومضاعفات السرعة' },
                { title: 'تقييم جاهزية الفريق للذكاء الاصطناعي', desc: 'تأكد من أن مطوريك مرتاحون لسير عمل التطوير بمساعدة AI' },
                { title: 'تتبع استخدام Cursor', desc: 'راقب طلبات Cursor AI الفعلية أثناء النموذج الأولي للتحقق من تقديرات مهام ERP' },
                { title: 'تشغيل إثبات المفهوم', desc: 'قم ببناء وحدة ERP صغيرة باستخدام Vanilla JS + Cursor AI للتحقق من الجدول الزمني وكفاءة الطلبات' },
                { title: 'الحصول على موافقة القيادة', desc: 'قدم هذا التحليل القائم على البيانات مع التركيز على ميزة التكلفة بما في ذلك تكاليف Cursor AI' }
            ] : [
                { title: 'Validate Cursor AI Impact', desc: 'The savings includes subscription + estimated requests. Run a 2-week prototype to verify request volumes.' },
                { title: 'Review the Decision Matrix', desc: 'Ensure your criteria weights accurately reflect your priorities' },
                { title: 'Validate TCO Assumptions', desc: 'Adjust team size, salaries, and velocity multipliers' },
                { title: 'Assess Team AI Readiness', desc: 'Confirm your developers are comfortable with AI-assisted development workflows' },
                { title: 'Track Cursor Usage', desc: 'Monitor actual Cursor AI requests during prototype to validate ERP task estimates' },
                { title: 'Run a Proof of Concept', desc: 'Build a small ERP module with Vanilla JS + Cursor AI to validate the timeline and request efficiency' },
                { title: 'Get Leadership Buy-in', desc: 'Present this data-driven analysis emphasizing the cost advantage including Cursor AI costs' }
            ],
            
            configSummaryTitle: isArabic ? '📈 ملخص التكوين الخاص بك (مع Cursor AI):' : '📈 Your Configuration Summary (with Cursor AI):',
            teamSize: isArabic ? 'حجم الفريق:' : 'Team Size:',
            monthlySalary: isArabic ? 'الراتب الشهري:' : 'Monthly Salary:',
            cursorSub: isArabic ? 'اشتراك Cursor:' : 'Cursor Subscription:',
            vanillaBuild: isArabic ? 'بناء Vanilla JS (مع AI):' : 'Vanilla JS Build (with AI):',
            dotnetBuild: isArabic ? 'بناء .NET (مع AI):' : '.NET Build (with AI):',
            vanillaRequests: isArabic ? 'طلبات Cursor لـ Vanilla:' : 'Vanilla Cursor Requests:',
            dotnetRequests: isArabic ? 'طلبات Cursor لـ .NET:' : '.NET Cursor Requests:',
            vanillaTotalCost: isArabic ? 'تكلفة Vanilla الإجمالية:' : 'Vanilla Total Cost:',
            dotnetTotalCost: isArabic ? 'تكلفة .NET الإجمالية:' : '.NET Total Cost:',
            totalSavings: isArabic ? 'إجمالي التوفير:' : 'Total Savings:',
            configTip: isArabic ? '💡 نصيحة: يمكنك ضبط هذه القيم في نموذج TCO. تكاليف Cursor AI تشمل اشتراك + حمل الطلبات. تعزيز إنتاجية Vanilla JS يستند إلى ميزة أداء AI. كلا التقنيتين تستفيدان من Cursor، لكن Vanilla JS تستفيد أكثر.' : '💡 Tip: You can adjust these values in the TCO Model. Cursor AI costs include subscription + request overhead. Vanilla JS productivity boost is based on the AI performance advantage. Both stacks benefit from Cursor, but Vanilla JS benefits more.',
            
            whyCursorBetter: isArabic ? '🎯 لماذا يعمل Cursor AI بشكل أفضل مع Vanilla JS' : '🎯 Why Cursor AI Performs Better with Vanilla JS',
            simplerCode: isArabic ? '1. كود أبسط وأكثر قابلية للتنبؤ (النتيجة: 8.9/10 مقابل 7.5/10)' : '1. Simpler, More Predictable Code (Score: 8.9/10 vs 7.5/10)',
            fewerIterations: isArabic ? '2. يتطلب تكرارات أقل' : '2. Fewer Iterations Needed',
            betterContext: isArabic ? '3. فهم أفضل للسياق' : '3. Better Context Understanding',
            
            vanillaAIBenefits: isArabic ? [
                'معالجة DOM مباشرة',
                'واجهات Web API قياسية',
                'لا إدارة حالة معقدة لإطار العمل',
                'خالية من المكونات المجردة'
            ] : [
                'Direct DOM manipulation',
                'Standard Web APIs',
                'No complex framework state management',
                'Free of component abstractions'
            ],
            
            dotnetAIIssues: isArabic ? [
                'أنواع TypeScript العامة',
                'مفاهيم خاصة بإطار العمل',
                'دورات حياة المكونات',
                'أنماط لا تعد ولا تحصى'
            ] : [
                'TypeScript generic types',
                'Framework-specific concepts',
                'Component lifecycles',
                'Countless patterns'
            ],
            
            vanillaAIDesc: isArabic ? 'Cursor يولد كود JavaScript نظيفاً ومباشراً' : 'Cursor generates clean, straightforward JavaScript',
            dotnetAIDesc: isArabic ? 'Cursor يكافح مع أنماط إطار العمل المتعددة' : 'Cursor struggles with multiple framework patterns',
            
            developers: isArabic ? 'مطورين' : 'developers',
            months: isArabic ? 'أشهر' : 'months',
            year: isArabic ? 'سنة' : 'year',
            tasks: isArabic ? 'مهام' : 'tasks',
            requests: isArabic ? 'طلبات' : 'requests',
            boostVs: isArabic ? 'تعزيز مقابل' : 'boost vs',
            vsRequests: isArabic ? 'مقابل' : 'vs',
            reqYear: isArabic ? 'طلبات/سنة' : 'requests/year',
            cheaper: isArabic ? 'أرخص' : 'cheaper',
            withCursor: isArabic ? 'مع Cursor' : 'with Cursor',
            isAcceptable: isArabic ? 'مقبولة' : 'is acceptable'
        };
        
        // Generate key decision factors
        const keyFactors = [];
        
        if (parseFloat(vanillaScore) > parseFloat(dotnetScore)) {
            keyFactors.push(isArabic 
                ? `✓ <strong>مصفوفة القرار:</strong> Vanilla JS تحصل على نقاط أعلى (${vanillaScore}/10 مقابل ${dotnetScore}/10) بناءً على معاييرك المرجحة`
                : `✓ <strong>Decision Matrix:</strong> Vanilla JS scores higher (${vanillaScore}/10 vs ${dotnetScore}/10) based on your weighted criteria`
            );
        } else {
            keyFactors.push(isArabic
                ? `✓ <strong>مصفوفة القرار:</strong> .NET + SPA تحصل على نقاط أعلى (${dotnetScore}/10 مقابل ${vanillaScore}/10) بناءً على معاييرك المرجحة`
                : `✓ <strong>Decision Matrix:</strong> .NET + SPA scores higher (${dotnetScore}/10 vs ${vanillaScore}/10) based on your weighted criteria`
            );
        }
        
        keyFactors.push(isArabic
            ? `✓ <strong>تكلفة التطوير الأساسية:</strong> ${tcoCheaper} ${isArabic ? 'أرخص بـ' : 'is'} ${formatNumber(tcoDifference)}K ${isArabic ? 'دينار كويتي' : 'KWD cheaper'} (${isArabic ? 'قبل Cursor AI' : 'before Cursor AI'})`
            : `✓ <strong>Base Development Cost:</strong> ${tcoCheaper} is ${formatNumber(tcoDifference)}K KWD cheaper (before Cursor AI)`
        );
        
        keyFactors.push(isArabic
            ? `✓ <strong>اشتراك Cursor AI:</strong> ${cursorAnnualCost.toFixed(2)}K دينار كويتي/سنة لـ ${tcoInputs.teamSize} مطورين (نفس الشيء لكليهما)`
            : `✓ <strong>Cursor AI Subscription:</strong> ${cursorAnnualCost.toFixed(2)}K KWD/year for ${tcoInputs.teamSize} developers (same for both)`
        );
        
        keyFactors.push(isArabic
            ? `✓ <strong>طلبات Cursor المقدرة:</strong> Vanilla: ${vanillaTotalRequests.toLocaleString()} طلب مقابل .NET: ${dotnetTotalRequests.toLocaleString()} طلب/سنة`
            : `✓ <strong>Estimated Cursor Requests:</strong> Vanilla: ${vanillaTotalRequests.toLocaleString()} requests vs .NET: ${dotnetTotalRequests.toLocaleString()} requests/year`
        );
        
        keyFactors.push(isArabic
            ? `✓ <strong>تأثير إنتاجية Cursor:</strong> Vanilla توفر ${formatNumber(vanillaDevSavings)}K دينار كويتي (${(cursorProductivityDiff * 60).toFixed(1)}% دفعة) مقابل .NET توفر ${formatNumber(dotnetDevSavings)}K دينار كويتي (${(cursorProductivityDiff * 20).toFixed(1)}% دفعة)`
            : `✓ <strong>Cursor Productivity Impact:</strong> Vanilla saves ${formatNumber(vanillaDevSavings)}K KWD (${(cursorProductivityDiff * 60).toFixed(1)}% boost) vs .NET saves ${formatNumber(dotnetDevSavings)}K KWD (${(cursorProductivityDiff * 20).toFixed(1)}% boost)`
        );
        
        keyFactors.push(isArabic
            ? `✓ <strong>التكلفة الإجمالية مع Cursor AI:</strong> Vanilla ${formatNumber(vanillaWithCursor)}K دينار كويتي مقابل .NET ${formatNumber(dotnetWithCursor)}K دينار كويتي - توفير ${formatNumber(totalSavings)}K دينار كويتي (${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%)`
            : `✓ <strong>Total Cost with Cursor AI:</strong> Vanilla ${formatNumber(vanillaWithCursor)}K KWD vs .NET ${formatNumber(dotnetWithCursor)}K KWD - saves ${formatNumber(totalSavings)}K KWD (${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%)`
        );
        
        // Team size consideration
        if (tcoInputs.teamSize <= 3) {
            keyFactors.push(isArabic
                ? `✓ <strong>حجم الفريق:</strong> سيقوم مطوروك الـ ${tcoInputs.teamSize} بعمل ${vanillaTotalRequests.toLocaleString()} طلبات Cursor أقل مع Vanilla JS`
                : `✓ <strong>Team Size:</strong> Your ${tcoInputs.teamSize} developers will make ${vanillaTotalRequests.toLocaleString()} fewer Cursor requests with Vanilla JS`
            );
        } else if (tcoInputs.teamSize >= 6) {
            keyFactors.push(isArabic
                ? `✓ <strong>حجم الفريق:</strong> فريقك الأكبر (${tcoInputs.teamSize} مطورين) قد يستفيد من هيكل .NET + SPA`
                : `✓ <strong>Team Size:</strong> Your larger team (${tcoInputs.teamSize} developers) may benefit from .NET + SPA's structure`
            );
        }
        
        // Build time comparison
        const vanillaBuildWithCursor = vanillaBuildMonths * vanillaProductivityMultiplier;
        const dotnetBuildWithCursor = dotnetBuildMonths * dotnetProductivityMultiplier;
        keyFactors.push(isArabic
            ? `✓ <strong>الوقت للوصول إلى السوق (مع Cursor AI):</strong> Vanilla JS: ${vanillaBuildWithCursor.toFixed(1)} أشهر مقابل .NET + SPA: ${dotnetBuildWithCursor.toFixed(1)} أشهر`
            : `✓ <strong>Time to Market (with Cursor AI):</strong> Vanilla JS: ${vanillaBuildWithCursor.toFixed(1)} months vs .NET + SPA: ${dotnetBuildWithCursor.toFixed(1)} months`
        );
        
        container.innerHTML = `
            <div class="card">
                <h2>${t.summaryTitle}</h2>
                <p>${t.summaryDesc}</p>
                <p style="color: var(--color-accent); font-weight: 600; margin-top: var(--spacing-md);">
                    ${t.cursorTeamNote}
                </p>
            </div>
            
            <div class="recommendation-grid">
                <div class="recommendation-card">
                    <h3>${t.matrixTitle}</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">${t.vanillaLabel}</div>
                            <div class="score-value">${vanillaScore}/10</div>
                        </div>
                        <div class="score-divider">${t.vs}</div>
                        <div class="score-item">
                            <div class="score-label">${t.dotnetLabel}</div>
                            <div class="score-value">${dotnetScore}/10</div>
                        </div>
                    </div>
                    <p class="result-note">${t.basedOnCriteria}</p>
                </div>
                
                <div class="recommendation-card">
                    <h3>${t.baseTcoTitle}</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">${t.vanillaLabel}</div>
                            <div class="score-value">${formatNumber(vanillaYear1Total)}K KWD</div>
                        </div>
                        <div class="score-divider">${t.vs}</div>
                        <div class="score-item">
                            <div class="score-label">${t.dotnetLabel}</div>
                            <div class="score-value">${formatNumber(dotnetYear1Total)}K KWD</div>
                        </div>
                    </div>
                    <p class="result-note">${t.tcoCheaperNote}</p>
                </div>
                
                <div class="recommendation-card">
                    <h3>${t.cursorPerfTitle}</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">${t.vanillaLabel}</div>
                            <div class="score-value">${cursorVanillaAvg}/10</div>
                        </div>
                        <div class="score-divider">${t.vs}</div>
                        <div class="score-item">
                            <div class="score-label">${t.dotnetLabel}</div>
                            <div class="score-value">${cursorDotnetAvg}/10</div>
                        </div>
                    </div>
                    <p class="result-note">${t.cursorPerfNote}</p>
                </div>
            </div>
            
            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid var(--color-success);">
                <h3>${t.cursorImpactTitle}</h3>
                <p style="font-size: 1.1rem; margin-bottom: var(--spacing-lg);">
                    ${t.cursorImpactDesc}
                </p>
                <div class="recommendation-grid">
                    <div>
                        <h4 style="color: var(--color-success);">${t.vanillaCursorTitle}</h4>
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.baseCost}</span>
                                <strong>${formatNumber(vanillaYear1Total)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); color: var(--color-success);">
                                <span>${t.cursorBoost} (${(cursorProductivityDiff * 60).toFixed(1)}%):</span>
                                <strong>-${formatNumber(vanillaDevSavings)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.cursorSubscription} (${tcoInputs.teamSize} ${t.developers}):</span>
                                <strong>+${cursorAnnualCost.toFixed(2)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.requestOverhead} (${vanillaTotalRequests.toLocaleString()} ${t.requests}):</span>
                                <strong>+${formatNumber(vanillaRequestCost)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-sm); border-top: 2px solid var(--color-success); font-size: 1.2rem;">
                                <span><strong>${t.totalCost}</strong></span>
                                <strong style="color: var(--color-success);">${formatNumber(vanillaWithCursor)}K KWD</strong>
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                            <strong>${t.estimatedTasks}</strong> ${vanillaTasksPerYear} ${t.tasks} × ${vanillaRequestsPerTask} ${t.requests}/${isArabic ? 'مهمة' : 'task'}
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--color-text-secondary);">${t.dotnetCursorTitle}</h4>
                        <div style="background: rgba(139, 92, 246, 0.05); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-border);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.baseCost}</span>
                                <strong>${formatNumber(dotnetYear1Total)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); color: var(--color-success);">
                                <span>${t.cursorBoost} (${(cursorProductivityDiff * 20).toFixed(1)}%):</span>
                                <strong>-${formatNumber(dotnetDevSavings)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.cursorSubscription} (${tcoInputs.teamSize} ${t.developers}):</span>
                                <strong>+${cursorAnnualCost.toFixed(2)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>${t.requestOverhead} (${dotnetTotalRequests.toLocaleString()} ${t.requests}):</span>
                                <strong>+${formatNumber(dotnetRequestCost)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-sm); border-top: 2px solid var(--color-border); font-size: 1.2rem;">
                                <span><strong>${t.totalCost}</strong></span>
                                <strong>${formatNumber(dotnetWithCursor)}K KWD</strong>
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                            <strong>${t.estimatedTasks}</strong> ${dotnetTasksPerYear} ${t.tasks} × ${dotnetRequestsPerTask} ${t.requests}/${isArabic ? 'مهمة' : 'task'}
                        </p>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.15); border-radius: var(--border-radius); text-align: center; border: 2px solid var(--color-success);">
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-sm);">${t.totalSavingsTitle}</h4>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--color-success); margin: 0;">
                        ${formatNumber(totalSavings)}K KWD
                    </p>
                    <p style="margin-top: var(--spacing-sm); color: var(--color-text-secondary);">
                        ${t.cheaperWith}
                    </p>
                    <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        ${t.additionalCapacity}
                    </p>
                    <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        <strong>${t.requestReduction}</strong> ${t.fewerRequests}
                    </p>
                </div>
            </div>
            
            <div class="card highlight-card final-recommendation">
                <h3>${t.finalRecTitle}</h3>
                
                <div class="recommendation-winner">
                    <div class="winner-badge ${overallWinner.includes('Vanilla') ? 'vanilla-winner' : 'dotnet-winner'}">
                        ${overallWinner.includes('Vanilla') ? '🟦' : '🟪'} ${overallWinner}
                    </div>
                    <div class="confidence-indicator">
                        <span class="confidence-label">${t.confidenceLevel}</span>
                        <span class="confidence-badge confidence-${confidenceLevel.toLowerCase()}">${isArabic ? (confidenceLevel === 'High' ? t.high : confidenceLevel === 'Moderate' ? t.moderate : t.low) : confidenceLevel} (${confidence}%)</span>
                    </div>
                </div>
                
                <div class="key-factors">
                    <h4>${t.keyFactorsTitle}</h4>
                    <ul>
                        ${keyFactors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
                </div>
            </div>
            
            <div class="recommendation-grid">
                <div class="recommendation-card scenario-card">
                    <h4>${t.chooseVanilla}</h4>
                    <ul>
                        <li>${t.vanillaReasons[0]} (${(cursorProductivityDiff * 60).toFixed(1)}% ${t.boostVs} ${(cursorProductivityDiff * 20).toFixed(1)}%)</li>
                        <li>${t.vanillaReasons[1]} (${vanillaTotalRequests.toLocaleString()} ${t.vsRequests} ${dotnetTotalRequests.toLocaleString()} ${t.reqYear})</li>
                        <li>${t.vanillaReasons[2]} (${tcoInputs.teamSize} ${t.developers})</li>
                        <li>${t.vanillaReasons[3]} (${vanillaBuildWithCursor.toFixed(1)} ${t.months} ${t.vsRequests} ${dotnetBuildWithCursor.toFixed(1)} ${t.months} ${t.withCursor})</li>
                        <li>${t.vanillaReasons[4]} (${formatNumber(totalSavings)}K KWD / ${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% ${t.cheaper})</li>
                        <li>${t.vanillaReasons[5]}</li>
                        <li>${t.vanillaReasons[6]}</li>
                        <li>${t.vanillaReasons[7]}</li>
                    </ul>
                </div>
                
                <div class="recommendation-card scenario-card">
                    <h4>${t.chooseDotnet}</h4>
                    <ul>
                        <li>${t.dotnetReasons[0]} (${formatNumber(totalSavings)}K KWD / ${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% ${t.isAcceptable})</li>
                        <li>${t.dotnetReasons[1]} (${dotnetTotalRequests.toLocaleString()} ${t.reqYear})</li>
                        <li>${t.dotnetReasons[2]}</li>
                        <li>${t.dotnetReasons[3]}</li>
                        <li>${t.dotnetReasons[4]}</li>
                        <li>${t.dotnetReasons[5]}</li>
                        <li>${t.dotnetReasons[6]}</li>
                        <li>${t.dotnetReasons[7]}</li>
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <h3>${t.criticalConsiderations}</h3>
                
                <div class="considerations-grid">
                    <div>
                        <h4>${t.riskFactorsVanilla}</h4>
                        <ul>
                            ${t.vanillaRisks.map(risk => `<li><strong>${risk.title}</strong> ${risk.desc}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4>${t.riskFactorsDotnet}</h4>
                        <ul>
                            ${t.dotnetRisks.map(risk => `<li><strong>${risk.title}</strong> ${risk.desc}${risk.title.includes('Complexity') || risk.title.includes('التعقيد') ? ` (${(tcoInputs.setupMonths).toFixed(1)} ${t.months})` : risk.title.includes('Learning') || risk.title.includes('منحنى') ? ` (${dotnetBuildMonths.toFixed(1)} ${t.months})` : ''}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="card highlight-card">
                <h3>${t.nextStepsTitle}</h3>
                <ol class="next-steps-list">
                    <li>
                        <strong>${t.nextStepsList[0].title}</strong> - ${t.nextStepsList[0].desc.replace('التوفير', formatNumber(totalSavings) + 'K KWD').replace('اشتراك', cursorAnnualCost.toFixed(2) + 'K KWD').replace('طلبات مقدرة', vanillaTotalRequests.toLocaleString() + ' ' + t.vsRequests + ' ' + dotnetTotalRequests.toLocaleString() + ' ' + t.requests)}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[1].title}</strong> - ${t.nextStepsList[1].desc}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[2].title}</strong> - ${t.nextStepsList[2].desc.replace('حجم الفريق', tcoInputs.teamSize).replace('الرواتب', tcoInputs.blendedRate + ' KWD')}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[3].title}</strong> - ${t.nextStepsList[3].desc.replace('مطوريك', tcoInputs.teamSize + ' ' + t.developers)}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[4].title}</strong> - ${t.nextStepsList[4].desc.replace('تقديرات مهام ERP', vanillaTasksPerYear + ' ' + t.tasks + '/' + t.year)}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[5].title}</strong> - ${t.nextStepsList[5].desc.replace('الجدول الزمني', vanillaBuildWithCursor.toFixed(1) + '-' + t.months)}
                    </li>
                    <li>
                        <strong>${t.nextStepsList[6].title}</strong> - ${t.nextStepsList[6].desc.replace('ميزة التكلفة', formatNumber(totalSavings) + 'K KWD (' + ((totalSavings / dotnetWithCursor) * 100).toFixed(0) + '%)')}
                    </li>
                </ol>
            </div>
            
            <div class="card" style="background: rgba(99, 102, 241, 0.05);">
                <h4>${t.configSummaryTitle}</h4>
                <div class="config-summary">
                    <div class="config-item">
                        <span class="config-label">${t.teamSize}</span>
                        <span class="config-value">${tcoInputs.teamSize} ${t.developers}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.monthlySalary}</span>
                        <span class="config-value">${tcoInputs.blendedRate} KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.cursorSub}</span>
                        <span class="config-value">${cursorAnnualCost.toFixed(2)}K KWD/${t.year}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.vanillaBuild}</span>
                        <span class="config-value">${vanillaBuildWithCursor.toFixed(1)} ${t.months}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.dotnetBuild}</span>
                        <span class="config-value">${dotnetBuildWithCursor.toFixed(1)} ${t.months}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.vanillaRequests}</span>
                        <span class="config-value" style="color: var(--color-success);">${vanillaTotalRequests.toLocaleString()}/${t.year}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.dotnetRequests}</span>
                        <span class="config-value">${dotnetTotalRequests.toLocaleString()}/${t.year}</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.vanillaTotalCost}</span>
                        <span class="config-value" style="color: var(--color-success);">${formatNumber(vanillaWithCursor)}K KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.dotnetTotalCost}</span>
                        <span class="config-value">${formatNumber(dotnetWithCursor)}K KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">${t.totalSavings}</span>
                        <span class="config-value" style="color: var(--color-success); font-size: 1.3rem;">${formatNumber(totalSavings)}K KWD</span>
                    </div>
                </div>
                <p style="margin-top: var(--spacing-md); font-style: italic; color: var(--color-text-muted);">
                    ${t.configTip.replace('اشتراك', cursorAnnualCost.toFixed(2) + 'K KWD').replace('productivity boost', (cursorProductivityDiff * 60).toFixed(1) + '%').replace('AI performance advantage', (cursorVanillaAvg - cursorDotnetAvg).toFixed(1) + '-' + (isArabic ? 'نقطة' : 'point'))}
                </p>
            </div>
            
            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid var(--color-highlight-a);">
                <h3>${t.whyCursorBetter}</h3>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem; margin-top: var(--spacing-lg);">${t.simplerCode}</h4>
                    
                    <div class="recommendation-grid">
                        <div>
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">🟦 ${t.vanillaAIDesc}</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${t.vanillaAIBenefits[0]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${t.vanillaAIBenefits[1]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${t.vanillaAIBenefits[2]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${t.vanillaAIBenefits[3]}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">🟪 ${t.dotnetAIDesc}</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${t.dotnetAIIssues[0]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${t.dotnetAIIssues[1]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${t.dotnetAIIssues[2]}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${t.dotnetAIIssues[3]}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">${t.fewerIterations}</h4>
                    <p style="margin-bottom: var(--spacing-lg);">${isArabic ? 'بناءً على تقديرات ERP الخاصة بك:' : 'Based on your ERP estimates:'}</p>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">🟦 Vanilla JS: ${vanillaRequestsPerTask} ${t.requests}/${isArabic ? 'مهمة' : 'task'}</h5>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">${isArabic ? 'شبكة شجرية، نموذج، التحقق' : 'Tree grid, form, validation'}</p>
                            <ol style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); margin: 0;">
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب الأول: توليد كود عملي' : 'First request: Generate working code'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 2-10: تحسين منطق الأعمال' : '2nd-10th: Refine business logic'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 11-30: التلميع والتحسين' : '11th-30th: Polish and optimize'}</li>
                            </ol>
                        </div>
                        <div style="background: rgba(248, 113, 113, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">🟪 .NET + SPA: ${dotnetRequestsPerTask} ${t.requests}/${isArabic ? 'مهمة' : 'task'} (${isArabic ? 'تقريباً 2x أكثر!' : 'almost 2x more!'})</h5>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">${isArabic ? 'لماذا؟ مع .NET + SPA:' : 'Why? With .NET + SPA:'}</p>
                            <ol style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); margin: 0;">
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب الأول: توليد المكون' : 'First request: Generate component'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 2-5: إصلاح أخطاء TypeScript' : '2nd-5th: Fix TypeScript errors'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 6-10: إصلاح مشاكل إدارة الحالة' : '6th-10th: Fix state management issues'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 11-15: إصلاح أخطاء البناء' : '11th-15th: Fix build errors'}</li>
                                <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الطلب 16-20: التكامل مع مكتبة UI (AG-Grid، إلخ)' : '16th-20th: Integrate with UI library (AG-Grid, etc.)'}</li>
                                <li style="margin-bottom: var(--spacing-sm);"><strong>${isArabic ? 'الطلب 21+: تنفيذ منطق الأعمال فعلياً!' : '21st+: Actually implement business logic!'}</strong></li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">${t.betterContext}</h4>
                    
                    <div class="recommendation-grid">
                        <div>
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">${isArabic ? 'Cursor AI يتفوق في:' : 'Cursor AI excels at:'}</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${isArabic ? 'أنماط JavaScript القياسية' : 'Standard JavaScript patterns'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${isArabic ? 'معالجة DOM' : 'DOM manipulation'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${isArabic ? 'معالجة أحداث Vanilla' : 'Vanilla event handling'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success);">✅</span>
                                    ${isArabic ? 'دوال نقية' : 'Pure functions'}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">${isArabic ? 'Cursor AI يكافح مع:' : 'Cursor AI struggles with:'}</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${isArabic ? 'سحر خاص بإطار العمل' : 'Framework-specific magic'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${isArabic ? 'أدوات بناء معقدة' : 'Complex build tooling'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${isArabic ? 'بهلوانيات الأنواع' : 'Type gymnastics'}
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-danger);">❌</span>
                                    ${isArabic ? 'واجهات مكتبات المكونات' : 'Component library APIs'}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">${isArabic ? '4. مثال واقعي: شبكة شجرية لدليل الحسابات' : '4. Real-World Example: Tree Grid for Accounting'}</h4>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.05); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 2px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">🟦 ${isArabic ? 'مع Vanilla JS + Cursor:' : 'With Vanilla JS + Cursor:'}</h5>
                            <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); line-height: 1.8;">
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'أنشئ شبكة شجرية لدليل الحسابات المحاسبية' : 'Create a tree grid for accounting chart of accounts'}"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ ${isArabic ? 'يولد هيكل HTML عملي + منطق JS' : 'Generates working HTML structure + JS logic'}
                                </div>
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'أضف وظيفة التوسيع/الطي' : 'Add expand/collapse functionality'}"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ ${isArabic ? 'يضيف مستمعي الأحداث والرسوم المتحركة' : 'Adds event listeners and animations'}
                                </div>
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'أضف السحب والإفلات لإعادة الترتيب' : 'Add drag-drop to reorder'}"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ ${isArabic ? 'ينفذ واجهة السحب والإفلات' : 'Implements drag-drop API'}
                                </div>
                                <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                                    <strong style="color: var(--color-success);">${isArabic ? 'المجموع: ~15-20 طلب' : 'Total: ~15-20 requests'}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(248, 113, 113, 0.05); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 2px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-lg);">🟪 ${isArabic ? 'مع Angular/React + Cursor:' : 'With Angular/React + Cursor:'}</h5>
                            <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); line-height: 1.8;">
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'أنشئ شبكة شجرية لدليل الحسابات المحاسبية' : 'Create a tree grid for accounting chart of accounts'}"<br>
                                    <strong style="color: var(--color-text-secondary);">Cursor:</strong> ${isArabic ? 'يقترح AG-Grid أو مكون مخصص' : 'Suggests AG-Grid or custom component'}
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'استخدم AG-Grid' : 'Use AG-Grid'}"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> ${isArabic ? 'يولد كودًا به أخطاء أنواع' : 'Generates code with type errors'}
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'أصلح أخطاء الأنواع' : 'Fix the type errors'}"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> ${isArabic ? 'يصلح البعض، ويخلق أخطاء جديدة' : 'Fixes some, creates new errors'}
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'المكون لن يُعرض' : 'The component won\'t render'}"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> ${isArabic ? 'يقترح تغييرات في الحالة' : 'Suggests state changes'}
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'ربط البيانات لا يعمل' : 'Data binding not working'}"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> ${isArabic ? 'يعدل props/state' : 'Modifies props/state'}
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">${isArabic ? 'أنت:' : 'You:'}</strong> "${isArabic ? 'البناء يفشل' : 'Build failing'}"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> ${isArabic ? 'يقترح تغييرات في إعدادات البناء' : 'Suggests build config changes'}
                                </div>
                                <div style="margin-bottom: var(--spacing-lg); color: var(--color-text-muted); font-style: italic;">
                                    ${isArabic ? '... أكثر من 30 تكرار إضافي ...' : '... 30+ more iterations ...'}
                                </div>
                                <div style="padding: var(--spacing-md); background: rgba(248, 113, 113, 0.2); border-radius: var(--border-radius);">
                                    <strong style="color: var(--color-danger);">${isArabic ? 'المجموع: ~40-60 طلب' : 'Total: ~40-60 requests'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">${isArabic ? '5. تجربة التطوير الخاصة بك' : '5. Your Development Experience'}</h4>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">${isArabic ? 'مع Vanilla JS:' : 'With Vanilla JS:'}</h5>
                            <ul style="list-style: none; padding-${isArabic ? 'right' : 'left'}: 0;">
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">💚</span>
                                    ${isArabic ? 'Cursor <strong>يثير إعجابك</strong> بكود عملي فوري' : 'Cursor <strong>impresses you</strong> with instant, working code'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">💚</span>
                                    ${isArabic ? 'تقضي الوقت في <strong>منطق الأعمال</strong>، وليس في تصحيح أخطاء الإطار' : 'You spend time on <strong>business logic</strong>, not framework debugging'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">💚</span>
                                    ${isArabic ? 'تشعر بالـ <strong>إنتاجية</strong> والسيطرة' : 'You feel <strong>productive</strong> and in control'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">💚</span>
                                    ${isArabic ? 'يمكنك <strong>فهم وتعديل</strong> كل ما يولده Cursor' : 'You can <strong>understand and modify</strong> everything Cursor generates'}
                                </li>
                            </ul>
                        </div>
                        
                        <div style="background: rgba(248, 113, 113, 0.1); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 1px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-lg);">${isArabic ? 'مع .NET + SPA:' : 'With .NET + SPA:'}</h5>
                            <ul style="list-style: none; padding-${isArabic ? 'right' : 'left'}: 0;">
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">😓</span>
                                    ${isArabic ? 'Cursor يولد كودًا "من المفترض أن يعمل" لكنه لا يعمل' : 'Cursor generates code that "should work" but doesn\'t'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">😓</span>
                                    ${isArabic ? 'تقضي ساعات في تصحيح <strong>مشاكل الإطار</strong>' : 'You spend hours debugging <strong>framework issues</strong>'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">😓</span>
                                    ${isArabic ? 'تشعر وكأنك <strong>تحارب الإطار</strong>' : 'You feel like you\'re <strong>fighting the framework</strong>'}
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; font-size: 1.5rem;">😓</span>
                                    ${isArabic ? 'تضيع الوقت في أخطاء البناء، أخطاء الأنواع، والإعدادات' : 'You waste time on build errors, type errors, configuration'}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%); border-radius: var(--border-radius); border: 3px solid var(--color-success);">
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-lg); font-size: 1.5rem;">📊 ${isArabic ? 'لنظام ERP المعقد الخاص بك:' : 'For Your Complex ERP:'}</h4>
                    <ul style="list-style: none; padding-${isArabic ? 'right' : 'left'}: 0; font-size: 1.1rem;">
                        <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>${vanillaTotalRequests.toLocaleString()} ${isArabic ? 'طلب Cursor' : 'Cursor requests'}</strong> (Vanilla) ${isArabic ? 'مقابل' : 'vs'} <strong>${dotnetTotalRequests.toLocaleString()} ${isArabic ? 'طلب' : 'requests'}</strong> (.NET)
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>${isArabic ? 'تكرارات أقل بـ 3 مرات' : '3x fewer iterations'}</strong> ${isArabic ? 'للحصول على كود عملي' : 'to get working code'}
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>${isArabic ? 'نتائج أكثر إثارة للإعجاب' : 'More impressive results'}</strong> ${isArabic ? 'مع إحباط أقل' : 'with less frustration'}
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; ${isArabic ? 'right' : 'left'}: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>${isArabic ? 'تسليم أسرع' : 'Faster delivery'}</strong> ${isArabic ? 'للميزات' : 'of features'}
                        </li>
                    </ul>
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border-radius: var(--border-radius); border: 3px solid var(--color-highlight-a); text-align: center;">
                    <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 2rem;">🎯 ${isArabic ? 'الخلاصة' : 'Bottom Line'}</h3>
                    <p style="font-size: 1.3rem; margin-bottom: var(--spacing-xl); line-height: 1.6;">
                        <strong>${isArabic ? 'نعم، Cursor سيثير إعجابك أكثر بكثير مع Vanilla JS لأن:' : 'Yes, Cursor will impress you MUCH MORE with Vanilla JS because:'}</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); text-align: ${isArabic ? 'right' : 'left'};">
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'الكود يعمل من أول مرة في كثير من الأحيان' : 'Code works on first try more often'}
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'تكرارات أقل ذهابًا وإيابًا' : 'Fewer back-and-forth iterations'}
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'إكمال أسرع للميزات' : 'Faster feature completion'}
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'إحباط أقل في التصحيح' : 'Less debugging frustration'}
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'وقت أكثر في منطق الأعمال (المحاسبة، المخزون، الموارد البشرية)' : 'More time on business logic (accounting, inventory, HR)'}
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            ${isArabic ? 'ستشعر وكأنك بطل خارق في الإنتاجية 🚀' : 'You\'ll feel like a productivity superhero 🚀'}
                        </div>
                    </div>
                    <p style="font-size: 1.4rem; margin-top: var(--spacing-2xl); font-weight: 700; color: var(--color-success);">
                        ${isArabic ? 'بالنسبة لنظام ERP المعقد الخاص بك مع الشبكات الشجرية والمحاسبة والمخزون والموارد البشرية،' : 'For your complex ERP with tree grids, accounting, inventory, and HR,'}<br>
                        <span style="font-size: 1.6rem;">${isArabic ? 'Vanilla JS + Cursor AI سيكون نقطة تحول! 💪' : 'Vanilla JS + Cursor AI will be a game-changer! 💪'}</span>
                    </p>
                </div>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border: 3px solid var(--color-warning); margin-top: var(--spacing-2xl);">
                <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-lg); font-size: 1.5rem;">⚠️ ${isArabic ? 'عامل النجاح الحرج' : 'Critical Success Factor'}</h3>
                <div style="padding: var(--spacing-lg); background: rgba(251, 191, 36, 0.15); border-radius: var(--border-radius); border-${isArabic ? 'right' : 'left'}: 4px solid var(--color-warning);">
                    <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        <strong style="color: var(--color-warning);">${isArabic ? 'مهم:' : 'IMPORTANT:'}</strong> ${isArabic ? 'نجاح Vanilla JS + Cursor AI <strong>يعتمد بشكل كبير</strong> على امتلاك مطوريك <strong>خلفية قوية في JavaScript</strong>.' : 'The success of Vanilla JS + Cursor AI <strong>strongly depends</strong> on your developers having a <strong>solid JavaScript background</strong>.'}
                    </p>
                    
                    <div style="margin-top: var(--spacing-xl);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-md);">${isArabic ? 'يجب أن يمتلك فريقك:' : 'Your Team MUST Have:'}</h4>
                        <ul style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'فهم عميق لأساسيات JavaScript' : 'Deep understanding of JavaScript fundamentals'}</strong> ${isArabic ? '(closures، prototypes، الأنماط غير المتزامنة، ES6+)' : '(closures, prototypes, async patterns, ES6+)'}
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'القدرة على مراجعة والتحقق من كود Cursor' : 'Ability to review and validate Cursor\'s code'}</strong> - ${isArabic ? 'وليس فقط قبول اقتراحات AI بشكل أعمى' : 'not just blindly accepting AI suggestions'}
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'الخبرة في واجهات DOM APIs' : 'Experience with DOM APIs'}</strong> ${isArabic ? 'ومعايير المتصفح (وليس فقط معرفة الإطارات)' : 'and browser standards (not just framework knowledge)'}
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'القدرة على بناء حلول قابلة للتوسع' : 'Capability to architect scalable solutions'}</strong> ${isArabic ? 'بدون حواجز حماية الإطارات' : 'without framework guardrails'}
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'مهارات تصحيح وتحسين' : 'Skills to debug and optimize'}</strong> ${isArabic ? 'مشاكل الأداء على مستوى المتصفح' : 'performance issues at the browser level'}
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>${isArabic ? 'الوعي الأمني' : 'Security awareness'}</strong> ${isArabic ? 'لتنفيذ حماية XSS/CSRF يدوياً' : 'to implement XSS/CSRF protection manually'}
                            </li>
                        </ul>
                    </div>
                    
                    <div style="padding: var(--spacing-xl); background: rgba(248, 113, 113, 0.15); border-radius: var(--border-radius); border: 2px solid var(--color-danger); margin-top: var(--spacing-xl);">
                        <h4 style="color: var(--color-danger); margin-bottom: var(--spacing-md); font-size: 1.2rem;">🚨 ${isArabic ? 'بدون مهارات JavaScript قوية:' : 'Without Strong JavaScript Skills:'}</h4>
                        <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                            ${isArabic ? 'إذا كان مطوروك <strong>لا يمتلكون أساسيات JavaScript قوية</strong> أو لا يستطيعون بشكل صحيح <strong>توجيه ومراقبة Cursor AI</strong>، إذن:' : 'If your developers <strong>don\'t have solid JavaScript fundamentals</strong> or can\'t properly <strong>guide and monitor Cursor AI</strong>, then:'}
                        </p>
                        <p style="font-size: 1.3rem; font-weight: 700; color: var(--color-danger); text-align: center; padding: var(--spacing-lg); background: rgba(248, 113, 113, 0.2); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            ⚠️ ${isArabic ? 'أدوات الإطارات (.NET + SPA) ستكون الخيار الأفضل!' : 'Framework tools (.NET + SPA) will be the BETTER choice!'}
                        </p>
                        <p style="margin-top: var(--spacing-lg); line-height: 1.8; color: var(--color-text-muted);">
                            ${isArabic ? 'توفر الأطر حواجز حماية واصطلاحات وهيكلاً يساعد المطورين الأقل خبرة على إنتاج كود متناسق. البنية المعمارية ذات الرأي القوي للإطار تقلل من الحاجة إلى خبرة عميقة في JavaScript.' : 'Frameworks provide guardrails, conventions, and structure that help less-experienced developers produce consistent code. The framework\'s opinionated architecture reduces the need for deep JavaScript expertise.'}
                        </p>
                    </div>
                    
                    <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(99, 102, 241, 0.1); border-radius: var(--border-radius); border-${isArabic ? 'right' : 'left'}: 4px solid var(--color-accent);">
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">💡 ${isArabic ? 'سؤال التقييم:' : 'Assessment Question:'}</h4>
                        <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                            ${isArabic ? `هل يمكن لمطوريك الـ ${tcoInputs.teamSize} بثقة:` : `Can your ${tcoInputs.teamSize} developers confidently:`}
                        </p>
                        <ul style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-xl);">
                            <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'شرح حلقة أحداث JavaScript والسلوك غير المتزامن؟' : 'Explain the JavaScript event loop and async behavior?'}</li>
                            <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'تنفيذ معالجة DOM فعالة بدون jQuery؟' : 'Implement efficient DOM manipulation without jQuery?'}</li>
                            <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'تصحيح تسرب الذاكرة واختناقات الأداء؟' : 'Debug memory leaks and performance bottlenecks?'}</li>
                            <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'مراجعة اقتراحات Cursor بحثاً عن ثغرات أمنية؟' : 'Review Cursor\'s suggestions for security vulnerabilities?'}</li>
                            <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'تصميم أنماط معمارية نظيفة بدون مساعدة الإطار؟' : 'Design clean architecture patterns without framework help?'}</li>
                        </ul>
                        <p style="margin-top: var(--spacing-lg); font-weight: 600; color: var(--color-accent);">
                            ✅ ${isArabic ? 'إذا نعم → Vanilla JS + Cursor AI = مكاسب إنتاجية هائلة' : 'If YES → Vanilla JS + Cursor AI = Massive productivity gains'}<br>
                            ❌ ${isArabic ? 'إذا لا → .NET + SPA = نهج أكثر أماناً وهيكلة' : 'If NO → .NET + SPA = Safer, more structured approach'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 3px solid var(--color-highlight-a); margin-top: var(--spacing-2xl);">
                <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 1.6rem; text-align: center;">🎯 ${isArabic ? 'إطار القرار النهائي: بناءً على نهج التطوير الخاص بك' : 'Final Decision Framework: Based on Your Development Approach'}</h3>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-xl); margin-top: var(--spacing-xl);">
                    
                    <!-- Scenario 1: Full Cursor AI Dependence -->
                    <div style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-success); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🤖</div>
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            ${isArabic ? 'التطوير بمساعدة AI بالكامل' : 'Full AI-Assisted Development'}
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">${isArabic ? 'نهجك:' : 'Your Approach:'}</p>
                            <p style="line-height: 1.8;">
                                ${isArabic ? 'سيعتمد المطورون <strong style="color: var(--color-success);">بشكل كامل على Cursor AI</strong> لتوليد معظم الكود' : 'Developers will <strong style="color: var(--color-success);">completely depend on Cursor AI</strong> for generating most of the code'}
                            </p>
                        </div>
                        
                        <div style="background: rgba(52, 211, 153, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-success); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                ${isArabic ? 'اختر Vanilla JS' : 'Choose Vanilla JS'}
                            </h5>
                            <div style="text-align: ${isArabic ? 'right' : 'left'}; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-success);">${isArabic ? 'لماذا:' : 'Why:'}</p>
                                <ul style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); line-height: 1.8;">
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'يولد Cursor <strong>كوداً نظيفاً وعملياً</strong> فوراً' : 'Cursor generates <strong>clean, working code</strong> immediately'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>${vanillaTotalRequests.toLocaleString()} ${isArabic ? 'طلب/سنة' : 'requests/year'}</strong> ${isArabic ? 'مقابل' : 'vs'} ${dotnetTotalRequests.toLocaleString()} ${isArabic ? 'مع .NET' : 'with .NET'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الحد الأدنى من الإصلاحات اليدوية المطلوبة' : 'Minimal manual fixes needed'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'لا حاجة لإعدادات الإطار الإضافية' : 'No framework configuration overhead'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>${isArabic ? 'أقصى إنتاجية AI' : 'Maximum AI productivity'}</strong></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>${isArabic ? 'النتيجة:' : 'Result:'}</strong> ${isArabic ? 'أسرع تطوير، أقل تكلفة، أعلى كفاءة AI' : 'Fastest development, lowest cost, highest AI efficiency'}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Scenario 2: Manual Coding (No AI) -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-highlight-b); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">👨‍💻</div>
                        <h4 style="color: var(--color-highlight-b); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            ${isArabic ? 'البرمجة اليدوية (بدون Cursor AI)' : 'Manual Coding (No Cursor AI)'}
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">${isArabic ? 'نهجك:' : 'Your Approach:'}</p>
                            <p style="line-height: 1.8;">
                                ${isArabic ? 'لن يستخدم المطورون <strong style="color: var(--color-highlight-b);">Cursor AI</strong> وسيكتبون كل الكود يدوياً' : 'Developers will <strong style="color: var(--color-highlight-b);">NOT use Cursor AI</strong> and write all code manually'}
                            </p>
                        </div>
                        
                        <div style="background: rgba(139, 92, 246, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-highlight-b); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                ${isArabic ? 'اختر .NET + SPA' : 'Choose .NET + SPA'}
                            </h5>
                            <div style="text-align: ${isArabic ? 'right' : 'left'}; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-highlight-b);">${isArabic ? 'لماذا:' : 'Why:'}</p>
                                <ul style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); line-height: 1.8;">
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>${isArabic ? 'حواجز حماية الإطار' : 'Framework guardrails'}</strong> ${isArabic ? 'توجه التطوير' : 'guide development'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'أنماط واصطلاحات مدمجة' : 'Built-in patterns and conventions'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'دعم IDE غني (IntelliSense، إعادة الهيكلة)' : 'Rich IDE support (IntelliSense, refactoring)'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'مكتبات مكونات واسعة' : 'Extensive component libraries'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>${isArabic ? 'الهيكل بدون مساعدة AI' : 'Structure without AI help'}</strong></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(139, 92, 246, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>${isArabic ? 'النتيجة:' : 'Result:'}</strong> ${isArabic ? 'تطوير أبطأ، لكن الأطر توفر الهيكل المطلوب' : 'Slower development, but frameworks provide needed structure'}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Scenario 3: Hybrid Approach -->
                    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-warning); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🔀</div>
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            ${isArabic ? 'النهج المختلط (AI + يدوي)' : 'Hybrid Approach (Mix AI + Manual)'}
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">${isArabic ? 'نهجك:' : 'Your Approach:'}</p>
                            <p style="line-height: 1.8;">
                                ${isArabic ? 'سيستخدم المطورون <strong style="color: var(--color-warning);">Cursor AI + البرمجة اليدوية</strong> (50/50 أو خليط مماثل)' : 'Developers will use <strong style="color: var(--color-warning);">Cursor AI + Manual coding</strong> (50/50 or similar mix)'}
                            </p>
                        </div>
                        
                        <div style="background: rgba(139, 92, 246, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-highlight-b); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                ${isArabic ? 'اختر .NET + SPA' : 'Choose .NET + SPA'}
                            </h5>
                            <div style="text-align: ${isArabic ? 'right' : 'left'}; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-warning); font-size: 1.1rem;">${isArabic ? 'لماذا الإطار أفضل للنهج المختلط:' : 'Why Framework is Better for Hybrid:'}</p>
                                <ul style="padding-${isArabic ? 'right' : 'left'}: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-lg);">
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'الإطار <strong>يفرض الاتساق</strong> بين الكود المولد من AI والكود المكتوب يدوياً' : 'Framework <strong>enforces consistency</strong> between AI-generated and manually-written code'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>${isArabic ? 'TypeScript يكتشف مشاكل التكامل' : 'TypeScript catches integration issues'}</strong> ${isArabic ? 'عند خلط كود AI/يدوي' : 'when mixing AI/manual code'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'حدود المكونات تبقى واضحة بغض النظر عمن (AI أو إنسان) كتبها' : 'Component boundaries stay clear regardless of who (AI or human) wrote them'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'إعادة هيكلة الكود المختلط <strong>أكثر أماناً مع دعم IDE</strong>' : 'Refactoring mixed code is <strong>safer with IDE support</strong>'}</li>
                                    <li style="margin-bottom: var(--spacing-sm);">${isArabic ? 'مراجعات الكود أسهل (نفس الأنماط في كل مكان)' : 'Code reviews easier (same patterns throughout)'}</li>
                                </ul>
                                
                                <p style="padding: var(--spacing-md); background: rgba(251, 191, 36, 0.2); border-radius: var(--border-radius); border-${isArabic ? 'right' : 'left'}: 4px solid var(--color-warning); font-size: var(--font-size-sm); line-height: 1.6;">
                                    <strong>⚠️ ${isArabic ? 'فحص الواقع:' : 'Reality Check:'}</strong> ${isArabic ? 'خلط كود AI واليدوي بدون حواجز حماية الإطار يؤدي إلى أنماط غير متناسقة، وانحراف معماري، وصيانة أصعب - حتى مع مطورين JavaScript أقوياء.' : 'Mixing AI and manual code without framework guardrails leads to inconsistent patterns, architectural drift, and harder maintenance - even with strong JavaScript developers.'}
                                </p>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(139, 92, 246, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>${isArabic ? 'استثناء:' : 'Exception:'}</strong> ${isArabic ? 'فقط فكر في Vanilla JS إذا كان لديك مهندس معماري كبير جداً (10+ سنوات) + أنماط موثقة + 2-3 مطورين كحد أقصى + مراجعات كود صارمة' : 'Only consider Vanilla JS if you have a very senior architect (10+ years) + documented patterns + 2-3 developers max + strict code reviews'}
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: rgba(99, 102, 241, 0.2); border-radius: var(--border-radius); border: 2px solid var(--color-highlight-a); text-align: center;">
                    <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 1.4rem;">📋 ${isArabic ? 'مصفوفة القرار السريع' : 'Quick Decision Matrix'}</h4>
                    
                    <div style="display: grid; grid-template-columns: auto 1fr 1fr; gap: var(--spacing-sm); max-width: 800px; margin: 0 auto; text-align: ${isArabic ? 'right' : 'left'}; background: rgba(15, 23, 42, 0.5); padding: var(--spacing-xl); border-radius: var(--border-radius);">
                        <!-- Header Row -->
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border);"></div>
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border); text-align: center; color: var(--color-success);">✅ ${isArabic ? 'اختر Vanilla JS' : 'Choose Vanilla JS'}</div>
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border); text-align: center; color: var(--color-highlight-b);">✅ ${isArabic ? 'اختر .NET + SPA' : 'Choose .NET + SPA'}</div>
                        
                        <!-- Row 1 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">${isArabic ? 'نمط التطوير:' : 'Development Style:'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${isArabic ? '100% Cursor AI' : '100% Cursor AI'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${isArabic ? 'يدوي فقط<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(أو مختلط 50/50)</span>' : 'Manual Only<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(or 50/50 Hybrid)</span>'}</div>
                        
                        <!-- Row 2 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">${isArabic ? 'الأفضل لـ:' : 'Best For:'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${isArabic ? 'التفويض الكامل لـ AI<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(مع إشراف JS قوي)</span>' : 'Full AI delegation<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(with strong JS oversight)</span>'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${isArabic ? 'البرمجة اليدوية<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(أو خليط AI+يدوي)</span>' : 'Manual coding<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(or AI+Manual mix)</span>'}</div>
                        
                        <!-- Row 3 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">${isArabic ? 'طلبات Cursor:' : 'Cursor Requests:'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${vanillaTotalRequests.toLocaleString()}/${isArabic ? 'سنة' : 'year'}<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${isArabic ? '(أقل بـ 3 مرات من .NET)' : '(3x less than .NET)'}</span></div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">${dotnetTotalRequests.toLocaleString()}/${isArabic ? 'سنة أو غير متاح' : 'year or N/A'}<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${isArabic ? '(إذا لم يستخدم Cursor)' : '(if not using Cursor)'}</span></div>
                        
                        <!-- Row 4 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">${isArabic ? 'التكلفة الإجمالية:' : 'Total Cost:'}</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);"><strong>${formatNumber(vanillaWithCursor)}K KWD</strong><br><span style="font-size: var(--font-size-sm); color: var(--color-success);">${isArabic ? `(أرخص بـ ${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%)` : `(${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% cheaper)`}</span></div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);"><strong>${formatNumber(dotnetWithCursor)}K KWD</strong></div>
                    </div>
                    
                    <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%); border-radius: var(--border-radius); border: 2px solid var(--color-accent);">
                        <p style="font-size: 1.3rem; font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-accent);">
                            💡 ${isArabic ? 'الخلاصة:' : 'The Bottom Line:'}
                        </p>
                        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--color-success);">${isArabic ? 'Vanilla JS يفوز' : 'Vanilla JS wins'}</strong> ${isArabic ? 'عندما تذهب <strong>بالكامل في التطوير بمساعدة AI</strong> مع مطورين JavaScript أقوياء يمكنهم توجيه والتحقق من مخرجات Cursor.' : 'when you\'re going <strong>all-in on AI-assisted development</strong> with strong JavaScript developers who can guide and validate Cursor\'s output.'}
                        </p>
                        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--color-highlight-b);">${isArabic ? '.NET + SPA يفوز' : '.NET + SPA wins'}</strong> ${isArabic ? 'عندما تقوم بـ <strong>التطوير اليدوي أو النهج المختلط</strong> (50/50 AI+يدوي)، حيث توفر حواجز حماية الإطار منع الانحراف المعماري.' : 'when you\'re doing <strong>manual development or hybrid approaches</strong> (50/50 AI+manual), where framework guardrails prevent architectural drift.'}
                        </p>
                        <p style="font-size: var(--font-size-base); line-height: 1.8; margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: rgba(251, 191, 36, 0.2); border-radius: var(--border-radius); border-${isArabic ? 'right' : 'left'}: 4px solid var(--color-warning); color: var(--color-text-secondary);">
                            <strong style="color: var(--color-warning);">⚠️ ${isArabic ? 'الواقع الصادق:' : 'Honest Reality:'}</strong> ${isArabic ? 'خلط كود AI واليدوي (مختلط 50/50) يعمل بشكل أفضل مع الأطر في معظم الفرق. اذهب فقط مع Vanilla في النهج المختلط إذا كان لديك مهندس معماري كبير استثنائي + فريق صغير + أنماط موثقة + عملية مراجعة صارمة.' : 'Mixing AI and manual code (50/50 hybrid) works better with frameworks in most teams. Only go Vanilla in hybrid if you have an exceptional senior architect + small team + documented patterns + strict review process.'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRealWorldExamples(container) {
        const isArabic = currentLang === 'ar';
        
        const t = {
            pageTitle: isArabic ? '🔍 التحقق من الواقع: Vanilla JS في أنظمة ERP الإنتاجية' : '🔍 Reality Check: Vanilla JS in Production ERP Systems',
            intro: isArabic ? 'معظم أنظمة ERP الشهيرة واسعة النطاق (مثل SAP، Oracle، Microsoft Dynamics، Odoo) <strong>لا تستخدم Vanilla JS النقي</strong>. ومع ذلك، هناك أمثلة واقعية مقنعة واتجاه متنامٍ.' : 'Most famous, large-scale ERP systems (like SAP, Oracle, Microsoft Dynamics, Odoo) <strong>don\'t use pure Vanilla JS</strong>. However, there are compelling real-world examples and a growing trend.',
            
            majorErps: {
                title: isArabic ? '🏢 أنظمة ERP الرئيسية للمؤسسات' : '🏢 Major Enterprise ERPs',
                whatTheyUse: isArabic ? 'ما يستخدمونه:' : 'What They Use:',
                why: isArabic ? '<strong>لماذا:</strong> تم بناؤها قبل أن يكون vanilla JS قوياً بما فيه الكفاية، الفرق الكبيرة تحتاج هيكلاً، النفور من المخاطرة في المؤسسات' : '<strong>Why:</strong> Built before vanilla JS was powerful enough, large teams need structure, risk aversion in enterprise'
            },
            
            vanillaErps: {
                title: isArabic ? '✅ أنظمة ERP الفعلية بـ Vanilla JS' : '✅ Actual Vanilla JS ERP Systems',
                vsl: {
                    title: isArabic ? '1. VSL ERP (VanillaStackLabs)' : '1. VSL ERP (VanillaStackLabs)',
                    points: isArabic ? [
                        'مبني باستخدام <strong>Django + HTMX</strong>',
                        'يستخدم <strong>JavaScript بسيطاً</strong> (معظمه vanilla)',
                        'التركيز على العرض من جانب الخادم',
                        'نهج التحسين التدريجي',
                        'لـ <strong>العمليات التجارية الداخلية</strong>'
                    ] : [
                        'Built with <strong>Django + HTMX</strong>',
                        'Uses <strong>minimal JavaScript</strong> (mostly vanilla)',
                        'Focus on server-side rendering',
                        'Progressive enhancement approach',
                        'For <strong>in-house business operations</strong>'
                    ],
                    link: isArabic ? 'عرض دراسة الحالة →' : 'View Case Study →'
                },
                inoerp: {
                    title: isArabic ? '2. inoERP (مفتوح المصدر)' : '2. inoERP (Open Source)',
                    points: isArabic ? [
                        'نظام ERP مفتوح المصدر',
                        '<strong>واجهات برمجة تطبيقات Vanilla JavaScript</strong> للتخصيص',
                        'JavaScript خفيف على جانب العميل',
                        'دعم متعدد المنصات (ويب، iOS، أندرويد)',
                        'هندسة معمارية قائمة على REST API'
                    ] : [
                        'Open-source ERP system',
                        '<strong>Vanilla JavaScript APIs</strong> for customization',
                        'Lightweight client-side JavaScript',
                        'Multi-platform support (Web, iOS, Android)',
                        'REST API-driven architecture'
                    ],
                    link: isArabic ? 'عرض على SourceForge →' : 'View on SourceForge →'
                }
            },
            
            majorCompanies: {
                title: isArabic ? '🚀 شركات كبرى تستخدم Vanilla JS' : '🚀 Major Companies Using Vanilla JS',
                intro: isArabic ? 'ليست أنظمة ERP، ولكن شركات تقنية كبرى <strong>تحولت إلى vanilla JS</strong> من أجل الأداء:' : 'Not ERPs, but major tech companies that <strong>switched TO vanilla JS</strong> for performance:',
                netflix: {
                    title: isArabic ? '🎬 Netflix' : '🎬 Netflix',
                    desc: isArabic ? 'تحولت إلى <strong>vanilla JavaScript لكود جانب العميل</strong> (احتفظت بـ React لجانب الخادم)' : 'Switched to <strong>vanilla JavaScript for client-side</strong> code (kept React for server-side)',
                    result: isArabic ? 'النتيجة: تحسينات كبيرة في الأداء' : 'Result: Significant performance improvements'
                },
                github: {
                    title: isArabic ? '💻 GitHub' : '💻 GitHub',
                    desc: isArabic ? 'أزالت jQuery في أواخر 2018، تحولت إلى <strong>vanilla JS + web components</strong>' : 'Removed jQuery in late 2018, switched to <strong>vanilla JS + web components</strong>',
                    result: isArabic ? 'النتيجة: قاعدة كود أسرع وأسهل صيانة' : 'Result: Faster, more maintainable codebase'
                }
            },
            
            whySoFew: {
                title: isArabic ? '🤔 لماذا أنظمة ERP بـ Vanilla JS قليلة جداً؟' : '🤔 Why So Few Vanilla JS ERPs?',
                historical: {
                    title: isArabic ? '🕰️ أسباب تاريخية' : '🕰️ Historical Reasons',
                    desc: isArabic ? 'بُنيت قبل 5-10 سنوات عندما كان vanilla JS يفتقر إلى واجهات برمجة التطبيقات الحديثة (fetch، modules، web components)' : 'Built 5-10 years ago when vanilla JS lacked modern APIs (fetch, modules, web components)'
                },
                largeTeams: {
                    title: isArabic ? '👥 فرق كبيرة' : '👥 Large Teams',
                    desc: isArabic ? 'توفر الأطر هيكلاً لأكثر من 50 مطوراً يعملون على نفس قاعدة الكود' : 'Frameworks provide structure for 50+ developers working on same codebase'
                },
                riskAversion: {
                    title: isArabic ? '🛡️ النفور من المخاطرة' : '🛡️ Risk Aversion',
                    desc: isArabic ? 'الشركات المؤسسية تفضل الأطر "المثبتة" ذات الأنظمة البيئية الكبيرة' : 'Enterprise companies prefer "proven" frameworks with large ecosystems'
                },
                developerPool: {
                    title: isArabic ? '👨‍💻 مجموعة المطورين' : '👨‍💻 Developer Pool',
                    desc: isArabic ? 'عدد أكبر من المطورين يعرفون React/Angular أكثر من أنماط vanilla JS الحديثة' : 'More developers know React/Angular than modern vanilla JS patterns'
                }
            },
            
            opportunity: {
                title: isArabic ? '🚀 فرصتك: كن قصة نجاح مبكرة' : '🚀 Your Opportunity: Be an Early Success Story',
                intro: isArabic ? 'بما أنك تبني <strong>نظام ERP جديد من الصفر مع Cursor AI</strong>، لديك مزايا فريدة:' : 'Since you\'re building a <strong>NEW ERP from scratch with Cursor AI</strong>, you have unique advantages:',
                advantages: isArabic ? [
                    '<strong>لا أمتعة إطار قديم</strong> - ابدأ من جديد بمعايير حديثة',
                    '<strong>واجهات برمجة تطبيقات المتصفح الحديثة قوية</strong> - لا حاجة لـ jQuery أو الأطر في 2024',
                    '<strong>Cursor AI يتفوق في vanilla JS</strong> - طلبات AI أقل بـ 3 أضعاف مقارنة بالأطر',
                    '<strong>ميزة التكلفة</strong> - TCO أقل بكثير (انظر علامة تبويب نموذج TCO)',
                    '<strong>يمكنك أن تكون رائداً</strong> - قصة نجاح في هذا المجال الناشئ'
                ] : [
                    '<strong>No legacy framework baggage</strong> - Start fresh with modern standards',
                    '<strong>Modern browser APIs are powerful</strong> - No jQuery or frameworks needed in 2024',
                    '<strong>Cursor AI excels at vanilla JS</strong> - 3x fewer AI requests needed vs frameworks',
                    '<strong>Cost advantage</strong> - Significantly lower TCO (see TCO Model tab)',
                    '<strong>You can be a pioneer</strong> - Success story in this emerging space'
                ],
                modernReality: {
                    title: isArabic ? '💡 الواقع الحديث (2024)' : '💡 The Modern Reality (2024)',
                    desc: isArabic ? '<strong>Vanilla JS + واجهات الويب الحديثة</strong> يمكن بالتأكيد بناء نظام ERP عالمي المستوى. بينما الأنظمة القديمة لن تُعاد كتابتها (مكلفة جداً/محفوفة بالمخاطر)، <strong>المشاريع الجديدة</strong> مثل مشروعك يمكن أن تستفيد من هذا النهج لتحقيق <strong>أقصى إنتاجية AI، أقل تكلفة، وتحكم كامل</strong>.' : '<strong>Vanilla JS + Modern Web APIs</strong> can absolutely build a world-class ERP. While legacy systems won\'t rewrite (too risky/expensive), <strong>new projects</strong> like yours can leverage this approach for <strong>maximum AI productivity, lowest cost, and complete control</strong>.'
                }
            },
            
            resources: {
                title: isArabic ? '📚 موارد إضافية' : '📚 Additional Resources',
                vanillaJsCommunity: isArabic ? 'مجتمع Vanilla JS:' : 'Vanilla JS Community:',
                modernWebApis: isArabic ? 'واجهات الويب الحديثة:' : 'Modern Web APIs:'
            }
        };
        
        container.innerHTML = `
            <div class="card">
                <h2>${t.pageTitle}</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                    ${t.intro}
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-xl); margin-top: var(--spacing-xl);">
                <!-- Major Enterprise ERPs -->
                <div class="card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%); border: 2px solid var(--color-highlight-b);">
                    <h3 style="color: var(--color-highlight-b); margin-bottom: var(--spacing-lg);">${t.majorErps.title}</h3>
                    <div style="background: rgba(15, 23, 42, 0.5); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-md);">
                        <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.majorErps.whatTheyUse}</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                                <strong>SAP:</strong> SAPUI5 (${isArabic ? 'إطارهم الخاص' : 'their own framework'})
                            </li>
                            <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                                <strong>Oracle:</strong> Oracle JET framework
                            </li>
                            <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                                <strong>Microsoft Dynamics:</strong> Angular/React
                            </li>
                            <li style="padding: var(--spacing-sm) 0;">
                                <strong>Odoo:</strong> Custom framework (jQuery/OWL)
                            </li>
                        </ul>
                    </div>
                    <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); line-height: 1.6;">
                        ${t.majorErps.why}
                    </p>
                </div>
                
                <!-- Real Vanilla JS ERPs -->
                <div class="card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid var(--color-success);">
                    <h3 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">${t.vanillaErps.title}</h3>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">${t.vanillaErps.vsl.title}</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-md);">
                            ${t.vanillaErps.vsl.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                        <a href="https://vanillastacklabs.com/work/vsl-erp/" target="_blank" style="color: var(--color-accent); font-size: var(--font-size-sm);">
                            ${t.vanillaErps.vsl.link}
                        </a>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">${t.vanillaErps.inoerp.title}</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-md);">
                            ${t.vanillaErps.inoerp.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                        <a href="https://sourceforge.net/projects/inoerp/" target="_blank" style="color: var(--color-accent); font-size: var(--font-size-sm);">
                            ${t.vanillaErps.inoerp.link}
                        </a>
                    </div>
                </div>
                
                <!-- Companies That Switched -->
                <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid var(--color-highlight-a);">
                    <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-lg);">${t.majorCompanies.title}</h3>
                    <p style="margin-bottom: var(--spacing-lg); line-height: 1.6;">
                        ${t.majorCompanies.intro}
                    </p>
                    
                    <div style="background: rgba(99, 102, 241, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-md);">
                        <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-sm);">${t.majorCompanies.netflix.title}</h4>
                        <p style="line-height: 1.6; margin-bottom: var(--spacing-sm);">
                            ${t.majorCompanies.netflix.desc}
                        </p>
                        <p style="color: var(--color-success); font-weight: 600;">
                            ${t.majorCompanies.netflix.result}
                        </p>
                    </div>
                    
                    <div style="background: rgba(99, 102, 241, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-sm);">${t.majorCompanies.github.title}</h4>
                        <p style="line-height: 1.6; margin-bottom: var(--spacing-sm);">
                            ${t.majorCompanies.github.desc}
                        </p>
                        <p style="color: var(--color-success); font-weight: 600;">
                            ${t.majorCompanies.github.result}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card highlight-card" style="margin-top: var(--spacing-2xl); background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border: 2px solid var(--color-warning);">
                <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-lg);">${t.whySoFew.title}</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); margin-top: var(--spacing-lg);">
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">${t.whySoFew.historical.title}</h4>
                        <p style="line-height: 1.6;">
                            ${t.whySoFew.historical.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">${t.whySoFew.largeTeams.title}</h4>
                        <p style="line-height: 1.6;">
                            ${t.whySoFew.largeTeams.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">${t.whySoFew.riskAversion.title}</h4>
                        <p style="line-height: 1.6;">
                            ${t.whySoFew.riskAversion.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">${t.whySoFew.developerPool.title}</h4>
                        <p style="line-height: 1.6;">
                            ${t.whySoFew.developerPool.desc}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card" style="margin-top: var(--spacing-2xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%); border: 3px solid var(--color-success);">
                <h3 style="color: var(--color-success); margin-bottom: var(--spacing-xl); font-size: 1.5rem; text-align: center;">${t.opportunity.title}</h3>
                
                <div style="background: rgba(15, 23, 42, 0.5); padding: var(--spacing-2xl); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl);">
                    <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        ${t.opportunity.intro}
                    </p>
                    
                    <ul style="list-style: none; padding: 0;">
                        ${t.opportunity.advantages.map(adv => `
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--color-border);">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            ${adv}
                        </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div style="text-align: center; padding: var(--spacing-xl); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius);">
                    <p style="font-size: 1.3rem; font-weight: 700; color: var(--color-success); margin-bottom: var(--spacing-md);">
                        ${t.opportunity.modernReality.title}
                    </p>
                    <p style="font-size: 1.1rem; line-height: 1.8; max-width: 800px; margin: 0 auto;">
                        ${t.opportunity.modernReality.desc}
                    </p>
                </div>
            </div>
            
            <div class="card" style="margin-top: var(--spacing-2xl); background: rgba(99, 102, 241, 0.05); border: 1px solid var(--color-border);">
                <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">${t.resources.title}</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                    <div>
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">${t.resources.vanillaJsCommunity}</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8;">
                            <li><a href="https://vanjs.org/" target="_blank" style="color: var(--color-accent);">VanJS Framework</a> - ${isArabic ? 'إطار خفيف قائم على vanilla' : 'Lightweight vanilla-based framework'}</li>
                            <li><a href="https://gomakethings.com/" target="_blank" style="color: var(--color-accent);">Go Make Things</a> - ${isArabic ? 'موارد Vanilla JS' : 'Vanilla JS resources'}</li>
                            <li><a href="https://youmightnotneedjquery.com/" target="_blank" style="color: var(--color-accent);">You Might Not Need jQuery</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">${t.resources.modernWebApis}</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8;">
                            <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" style="color: var(--color-accent);">Fetch API</a></li>
                            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" target="_blank" style="color: var(--color-accent);">Web Components</a></li>
                            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" target="_blank" style="color: var(--color-accent);">ES Modules</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFinalDecision(container) {
        const isArabic = currentLang === 'ar';
        
        const t = {
            pageTitle: isArabic ? 'القرار النهائي' : 'Final Decision',
            header: {
                decisionOwner: isArabic ? 'صاحب القرار' : 'Decision Owner',
                decisionOwnerName: isArabic ? 'مدير تقنية المعلومات — نايف العيسى' : 'IT Manager — Naif Al-Eissa',
                organization: isArabic ? 'المؤسسة' : 'Organization',
                orgName: isArabic ? 'مدرسة الرؤية ثنائية اللغة' : 'Alruya Bilingual School',
                including: isArabic ? 'بما في ذلك مؤسسة الرؤية' : 'including Alruya Institution',
                effectiveDate: isArabic ? 'تاريخ السريان' : 'Effective Date',
                immediately: isArabic ? 'فوراً' : 'Immediately'
            },
            mandate: {
                title: isArabic ? 'التفويض' : 'Mandate',
                subtitle: isArabic ? 'هذا القرار ملزم لجميع جهود التطوير' : 'This decision is binding on all development efforts',
                intro: isArabic ? 'بناءً على التحليل الكامل في هذا التقرير والتوجيه المعتمد سابقاً للتوحيد على <strong style="color: var(--color-accent);">Cursor لتطوير التطبيقات</strong>، يفرض قسم تقنية المعلومات ما يلي:' : 'Based on the complete analysis in this report and the previously adopted directive to standardize on <strong style="color: var(--color-accent);">Cursor for applications development</strong>, the IT Department mandates the following:',
                point1: isArabic ? 'جميع تطويرات التطبيقات الجديدة والجارية لـ <strong>مدرسة الرؤية ثنائية اللغة</strong> و<strong>مؤسسة الرؤية</strong> ستستخدم <strong style="color: var(--color-success);">Vanilla JavaScript (مع HTML/CSS)</strong> وتستهلك خدمات الخلفية عبر <strong>Web API</strong>.' : 'All new and ongoing application development for <strong>Alruya Bilingual School</strong> and <strong>Alruya Institution</strong> will use <strong style="color: var(--color-success);">Vanilla JavaScript (with HTML/CSS)</strong> consuming backend services via <strong>Web API</strong>.',
                point2: isArabic ? 'أطر عمل JavaScript (مثل <span style="text-decoration: line-through; color: var(--color-text-muted);">Angular، React، Vue</span>) <strong>غير مسموح بها</strong> إلا إذا تم منح <strong style="color: var(--color-warning);">استثناء كتابي من مدير تقنية المعلومات</strong>.' : 'JavaScript frameworks (e.g., <span style="text-decoration: line-through; color: var(--color-text-muted);">Angular, React, Vue</span>) are <strong>not permitted</strong> unless a <strong style="color: var(--color-warning);">written exception is granted by the IT Manager</strong>.',
                point3: isArabic ? 'هذا القرار <strong style="color: var(--color-accent);">ملزم لجميع جهود التطوير الداخلية والخارجية</strong>.' : 'This decision is <strong style="color: var(--color-accent);">binding on all internal and external development efforts</strong>.'
            },
            rationale: {
                title: isArabic ? 'الأساس المنطقي لاختيار Vanilla JS' : 'Rationale for Choosing Vanilla JS',
                zeroBuild: {
                    title: isArabic ? 'بساطة بدون بناء' : 'Zero-Build Simplicity',
                    desc: isArabic ? 'إعداد ونشر أسرع، عبء تشغيلي مخفض. لا خطوط أنابيب بناء، لا تأخيرات نقل.' : 'Faster setup and deployment, reduced operational overhead. No build pipelines, no transpilation delays.'
                },
                performance: {
                    title: isArabic ? 'الأداء والبصمة الصغيرة' : 'Performance & Small Footprint',
                    desc: isArabic ? 'واجهات سريعة الاستجابة وتحكم أكثر إحكاماً في DOM. لا عبء إطار عمل، وصول مباشر لـ API المتصفح.' : 'Responsive interfaces and tighter DOM control. No framework overhead, direct browser API access.'
                },
                security: {
                    title: isArabic ? 'التحكم في الأمان' : 'Security Control',
                    desc: isArabic ? 'وضع CSP أقوى وسطح تبعية أصغر. تحكم كامل في كل سطر من الكود.' : 'Stronger CSP posture and smaller dependency surface. Complete control over every line of code.'
                },
                cursor: {
                    title: isArabic ? 'توحيد Cursor' : 'Cursor Standardization',
                    desc: isArabic ? 'دورات تشغيل/تكرار فورية وتجربة مطور متسقة. طلبات ذكاء اصطناعي أقل بـ 3 أضعاف مقابل الأطر.' : 'Immediate run/iterate cycles and consistent developer experience. 3x fewer AI requests vs frameworks.'
                }
            },
            governance: {
                title: isArabic ? 'الحوكمة والامتثال' : 'Governance & Compliance',
                intro: isArabic ? '<strong>يجب على جميع الفرق الامتثال لهذه المعايير:</strong>' : '<strong>All teams must comply with these standards:</strong>',
                architecture: isArabic ? 'الهندسة المعمارية' : 'Architecture',
                architectureDesc: isArabic ? 'نمط مكونات Vanilla JS، مخزن خفيف (pub/sub)، عميل HTTP موحد، توجيه قائم على hash' : 'Vanilla JS component pattern, lightweight store (pub/sub), unified HTTP client, hash-based routing',
                apiFirst: isArabic ? 'API أولاً' : 'API-First',
                apiFirstDesc: isArabic ? 'جميع الوصول للبيانات عبر نقاط نهاية Web API موثقة' : 'All data access via documented Web API endpoints',
                security: isArabic ? 'الأمان' : 'Security',
                securityDesc: isArabic ? 'RBAC على API، CSP ممكّن، ترميز إدخال/إخراج، تسجيل التدقيق' : 'RBAC on the API, CSP enabled, input/output encoding, audit logging',
                quality: isArabic ? 'الجودة' : 'Quality',
                qualityDesc: isArabic ? 'اختبارات وحدة + E2E للتدفقات الحرجة؛ مراجعات كود إلزامية' : 'Unit + E2E tests for critical flows; mandatory code reviews',
                exceptions: isArabic ? 'الاستثناءات' : 'Exceptions',
                exceptionsDesc: isArabic ? '<strong style="color: var(--color-danger);">أي انحراف يتطلب موافقة كتابية مسبقة من مدير تقنية المعلومات</strong>' : '<strong style="color: var(--color-danger);">Any deviation requires prior written approval from the IT Manager</strong>'
            },
            team: {
                title: isArabic ? 'فريق التطوير (مدرسة الرؤية ثنائية اللغة)' : 'Development Team (Alruya Bilingual School)',
                members: [
                    { name: 'Ahmed Sodky', role: isArabic ? 'مشرف تقنية المعلومات' : 'IT Supervisor' },
                    { name: 'Ahmed El-Kady', role: isArabic ? 'رئيس قسم البرمجة المدرسية' : 'Head of School Programming Department' },
                    { name: 'Akbar', role: isArabic ? 'مطور أقدم' : 'Senior Developer' },
                    { name: 'Mohamed Ismaiel', role: isArabic ? 'محلل نظم ومطور Full-Stack أقدم' : 'System Analyst & Senior Full-Stack Developer' }
                ]
            },
            footer: {
                message: isArabic ? 'هذا القرار نهائي ويُطبق على جميع أعمال التطوير في مدرسة الرؤية ثنائية اللغة ومؤسسة الرؤية.' : 'This decision is final and applies to all development work under the Alruya Bilingual School and Alruya Institution.',
                issued: isArabic ? 'صادر عن مدير تقنية المعلومات نايف العيسى — ساري المفعول فوراً' : 'Issued by IT Manager Naif Al-Eissa — Effective Immediately'
            }
        };
        
        container.innerHTML = `
            <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 3px solid var(--color-accent); margin-bottom: var(--spacing-2xl);">
                <div style="text-align: center; padding: var(--spacing-xl); border-bottom: 2px solid var(--color-border);">
                    <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">⚖️</div>
                    <h2 style="font-size: 2rem; color: var(--color-accent); margin-bottom: var(--spacing-lg);">${t.pageTitle}</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); text-align: left; margin-top: var(--spacing-xl);">
                        <div>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-xs);">${t.header.decisionOwner}</p>
                            <p style="font-size: 1.2rem; font-weight: 700; color: var(--color-accent);">${t.header.decisionOwnerName}</p>
                        </div>
                        <div>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-xs);">${t.header.organization}</p>
                            <p style="font-size: 1.2rem; font-weight: 700;">${t.header.orgName}</p>
                            <p style="font-size: var(--font-size-base); color: var(--color-text-secondary);">${t.header.including}</p>
                        </div>
                        <div>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-xs);">${t.header.effectiveDate}</p>
                            <p style="font-size: 1.2rem; font-weight: 700; color: var(--color-warning);">${t.header.immediately}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border: 3px solid var(--color-danger); margin-bottom: var(--spacing-2xl);">
                <div style="display: flex; align-items: center; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
                    <div style="font-size: 3rem;">🚨</div>
                    <div>
                        <h3 style="color: var(--color-danger); font-size: 1.8rem; margin-bottom: var(--spacing-sm);">${t.mandate.title}</h3>
                        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); font-style: italic;">${t.mandate.subtitle}</p>
                    </div>
                </div>
                
                <div style="background: rgba(15, 23, 42, 0.6); padding: var(--spacing-xl); border-radius: var(--border-radius); border-left: 4px solid var(--color-danger); margin-bottom: var(--spacing-lg);">
                    <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        ${t.mandate.intro}
                    </p>
                    
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: var(--spacing-md); background: rgba(239, 68, 68, 0.1); border-radius: var(--border-radius); margin-bottom: var(--spacing-md); border-left: 4px solid var(--color-danger);">
                            <strong style="color: var(--color-danger);">1.</strong> ${t.mandate.point1}
                        </li>
                        <li style="padding: var(--spacing-md); background: rgba(239, 68, 68, 0.1); border-radius: var(--border-radius); margin-bottom: var(--spacing-md); border-left: 4px solid var(--color-danger);">
                            <strong style="color: var(--color-danger);">2.</strong> ${t.mandate.point2}
                        </li>
                        <li style="padding: var(--spacing-md); background: rgba(239, 68, 68, 0.1); border-radius: var(--border-radius); border-left: 4px solid var(--color-danger);">
                            <strong style="color: var(--color-danger);">3.</strong> ${t.mandate.point3}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card" style="margin-bottom: var(--spacing-2xl);">
                <h3 style="color: var(--color-success); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2rem;">✓</span>
                    <span>${t.rationale.title}</span>
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg);">
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">⚡</span>
                            ${t.rationale.zeroBuild.title}
                        </h4>
                        <p style="line-height: 1.8; color: var(--color-text-secondary);">
                            ${t.rationale.zeroBuild.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🚀</span>
                            ${t.rationale.performance.title}
                        </h4>
                        <p style="line-height: 1.8; color: var(--color-text-secondary);">
                            ${t.rationale.performance.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🔒</span>
                            ${t.rationale.security.title}
                        </h4>
                        <p style="line-height: 1.8; color: var(--color-text-secondary);">
                            ${t.rationale.security.desc}
                        </p>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🤖</span>
                            ${t.rationale.cursor.title}
                        </h4>
                        <p style="line-height: 1.8; color: var(--color-text-secondary);">
                            ${t.rationale.cursor.desc}
                        </p>
                    </div>
                </div>
            </div>

            <div class="card" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border: 2px solid var(--color-warning); margin-bottom: var(--spacing-2xl);">
                <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2rem;">📋</span>
                    <span>${t.governance.title}</span>
                </h3>
                
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-xl); color: var(--color-text-primary);">
                    ${t.governance.intro}
                </p>
                
                <div style="background: rgba(15, 23, 42, 0.5); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--color-border);">
                                <td style="padding: var(--spacing-md); width: 180px; font-weight: 700; color: var(--color-warning);">${t.governance.architecture}</td>
                                <td style="padding: var(--spacing-md); line-height: 1.8;">${t.governance.architectureDesc}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--color-border);">
                                <td style="padding: var(--spacing-md); font-weight: 700; color: var(--color-warning);">${t.governance.apiFirst}</td>
                                <td style="padding: var(--spacing-md); line-height: 1.8;">${t.governance.apiFirstDesc}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--color-border);">
                                <td style="padding: var(--spacing-md); font-weight: 700; color: var(--color-warning);">${t.governance.security}</td>
                                <td style="padding: var(--spacing-md); line-height: 1.8;">${t.governance.securityDesc}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--color-border);">
                                <td style="padding: var(--spacing-md); font-weight: 700; color: var(--color-warning);">${t.governance.quality}</td>
                                <td style="padding: var(--spacing-md); line-height: 1.8;">${t.governance.qualityDesc}</td>
                            </tr>
                            <tr>
                                <td style="padding: var(--spacing-md); font-weight: 700; color: var(--color-danger);">${t.governance.exceptions}</td>
                                <td style="padding: var(--spacing-md); line-height: 1.8;">${t.governance.exceptionsDesc}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card" style="background: rgba(99, 102, 241, 0.05); border: 2px solid var(--color-accent); margin-bottom: var(--spacing-2xl);">
                <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2rem;">👥</span>
                    <span>${t.team.title}</span>
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                    ${t.team.members.map((member, idx) => `
                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-sm);">
                            <span style="font-size: 2rem;">${['👨‍💼', '👨‍🏫', '👨‍💻', '👨‍💼'][idx]}</span>
                            <div>
                                <p style="font-size: 1.2rem; font-weight: 700; color: var(--color-accent);">${member.name}</p>
                                <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">${member.role}</p>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border: 3px solid var(--color-accent); text-align: center; padding: var(--spacing-2xl);">
                <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">⚖️</div>
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent); margin-bottom: var(--spacing-md);">
                    ${t.footer.message}
                </p>
                <p style="font-size: var(--font-size-base); color: var(--color-text-muted); margin-top: var(--spacing-lg);">
                    ${t.footer.issued}
                </p>
            </div>
        `;
    }

    function renderMigrationPlan(container) {
        const isArabic = currentLang === 'ar';
        
        const t = {
            title: isArabic ? 'الانتقال إلى Vanilla JS' : 'Migration to Vanilla JS',
            mandate: {
                title: isArabic ? 'تفويض تنفيذي' : 'Executive Mandate',
                org: isArabic ? 'مدرسة الرؤية ثنائية اللغة، بما في ذلك مؤسسة الرؤية' : 'Alruya Bilingual School, including Alruya Institution',
                directive: isArabic ? 'توجيه انتقال الواجهة الأمامية' : 'Frontend Migration Directive',
                new: {
                    title: isArabic ? '1. كل التطوير الجديد:' : '1. All New Development:',
                    desc: isArabic ? 'سيتم تنفيذه حصرياً باستخدام <strong style="color: var(--color-success);">Vanilla JavaScript + Web API + HTML/CSS</strong>. لا يُسمح بأطر العمل.' : 'Will be implemented exclusively using <strong style="color: var(--color-success);">Vanilla JavaScript + Web API + HTML/CSS</strong>. No frameworks permitted.'
                },
                existing: {
                    title: isArabic ? '2. انتقال العمل الحالي:' : '2. Existing Work Migration:',
                    desc: isArabic ? 'سيتم نقل جميع التطبيقات الحالية (حالياً <span style="text-decoration: line-through; color: var(--color-text-muted);">ASP.NET Core + Angular</span>) بشكل منهجي إلى <strong style="color: var(--color-success);">Vanilla JS + Web API</strong>.' : 'All existing applications (currently <span style="text-decoration: line-through; color: var(--color-text-muted);">ASP.NET Core + Angular</span>) will be systematically migrated to <strong style="color: var(--color-success);">Vanilla JS + Web API</strong>.',
                    note: isArabic ? '<strong>ملاحظة:</strong> الخلفية تبقى <strong>ASP.NET Core</strong> — هذه استراتيجية انتقال <strong>للواجهة الأمامية فقط</strong>.' : '<strong>Note:</strong> Backend remains <strong>ASP.NET Core</strong> — this is a <strong>frontend-only</strong> migration strategy.'
                },
                binding: isArabic ? 'هذا التوجيه ملزم وساري المفعول فوراً.' : 'This directive is binding and effective immediately.'
            },
            strategy: {
                title: isArabic ? 'استراتيجية الانتقال: نمط الخانق التدريجي' : 'Migration Strategy: Phased Strangler Pattern',
                coreTitle: isArabic ? 'النهج الأساسي' : 'Core Approach',
                coreDesc: isArabic ? 'بالنظر إلى تعقيد ERP والقيود التشغيلية، سنستخدم <strong style="color: var(--color-accent);">نمط شجرة التين الخانق</strong>: استبدال مكونات Angular تدريجياً بوحدات Vanilla JS بينما يتعايش النظامان مؤقتاً. هذا يقلل المخاطر، ويحافظ على استمرارية العمل، ويسمح بالتحقق التدريجي.' : 'Given the ERP\'s complexity and operational constraints, we will employ a <strong style="color: var(--color-accent);">Strangler Fig Pattern</strong>: gradually replace Angular components with Vanilla JS modules while both systems coexist temporarily. This minimizes risk, maintains business continuity, and allows iterative validation.',
                features: {
                    incremental: { title: isArabic ? 'تدريجي' : 'Incremental', sub: isArabic ? 'وحدة تلو الأخرى' : 'Module by module' },
                    lowRisk: { title: isArabic ? 'منخفض المخاطر' : 'Low-Risk', sub: isArabic ? 'وضع التعايش' : 'Coexistence mode' },
                    validated: { title: isArabic ? 'مُتحقق منه' : 'Validated', sub: isArabic ? 'اختبار كل مرحلة' : 'Test each phase' },
                    cursor: { title: isArabic ? 'مدفوع بـ Cursor' : 'Cursor-Driven', sub: isArabic ? 'مُسرّع بالذكاء الاصطناعي' : 'AI accelerated' }
                }
            },
            timeline: {
                title: isArabic ? 'الجدول الزمني للانتقال (خطة 12 شهراً)' : 'Migration Timeline (12-Month Plan)',
                phases: [
                    {
                        num: 0,
                        title: isArabic ? 'المرحلة 0: الأساس والهندسة المعمارية' : 'Phase 0: Foundation & Architecture',
                        weeks: isArabic ? 'الأسابيع 1-4' : 'Weeks 1-4',
                        objectives: isArabic ? 'الأهداف:' : 'Objectives:',
                        objectivesList: isArabic ? [
                            'إنشاء أنماط هندسة Vanilla JS (نموذج المكونات، المخزن، التوجيه، عميل HTTP)',
                            'إنشاء قوالب بداية ومقتطفات محسّنة لـ Cursor',
                            'إعداد بنية تحتية للتعايش (غلاف Angular يمكنه استضافة وحدات Vanilla)',
                            'تحديد عقود Web API وضمان التوافق العكسي',
                            'إنشاء خطوط أنابيب CI/CD لبناءات واجهة أمامية مزدوجة'
                        ] : [
                            'Establish Vanilla JS architecture patterns (component model, store, routing, HTTP client)',
                            'Create starter templates and Cursor-optimized snippets',
                            'Set up coexistence infrastructure (Angular shell can host Vanilla modules)',
                            'Define Web API contracts and ensure backward compatibility',
                            'Establish CI/CD pipelines for dual-frontend builds'
                        ],
                        deliverables: isArabic ? 'المخرجات:' : 'Deliverables:',
                        deliverablesList: isArabic ? [
                            'توثيق إطار عمل Vanilla JS ✓',
                            'مستودع البداية مع الأمثلة ✓',
                            'كود جسر التعايش ✓',
                            'دليل الانتقال وقوائم المراجعة ✓'
                        ] : [
                            'Vanilla JS framework documentation ✓',
                            'Starter repository with examples ✓',
                            'Coexistence bridge code ✓',
                            'Migration runbook and checklists ✓'
                        ]
                    },
                    {
                        num: 1,
                        title: isArabic ? 'المرحلة 1: انتقال الوحدة التجريبية' : 'Phase 1: Pilot Module Migration',
                        weeks: isArabic ? 'الأسابيع 5-10' : 'Weeks 5-10',
                        target: isArabic ? 'الوحدة المستهدفة (مُوصى بها):' : 'Target Module (Recommended):',
                        targetDesc: isArabic ? 'ابدأ بوحدة <strong>منخفضة المخاطر، عالية الرؤية</strong> مثل <strong>التقارير/لوحة المعلومات</strong> أو <strong>إدارة ملف المستخدم</strong>. هذه عادة ما تكون:' : 'Start with a <strong>low-risk, high-visibility</strong> module such as <strong>Reports/Dashboard</strong> or <strong>User Profile Management</strong>. These typically have:',
                        targetList: isArabic ? [
                            'تعقيد محدود في منطق الأعمال',
                            'حدود API واضحة',
                            'تفاعل عالي للمستخدم (أرضية تحقق جيدة)',
                            'مسار غير حرج (الفشل لا يعطل العمليات الأساسية)'
                        ] : [
                            'Limited business logic complexity',
                            'Clear API boundaries',
                            'High user interaction (good validation ground)',
                            'Non-critical path (failure doesn\'t block core operations)'
                        ],
                        execution: isArabic ? 'التنفيذ:' : 'Execution:',
                        executionList: isArabic ? [
                            'إعادة كتابة الوحدة المختارة في Vanilla JS باستخدام Cursor AI',
                            'التكامل عبر جسر التوجيه (Angular يوجه إلى مكون Vanilla)',
                            'اختبار شامل: وحدة، تكامل، E2E، أداء',
                            'النشر إلى التجهيز للتحقق لمدة أسبوعين',
                            'جمع ملاحظات الفريق وتحسين الأنماط'
                        ] : [
                            'Rewrite selected module in Vanilla JS using Cursor AI',
                            'Integrate via routing bridge (Angular routes to Vanilla component)',
                            'Comprehensive testing: unit, integration, E2E, performance',
                            'Deploy to staging for 2-week validation',
                            'Gather team feedback and refine patterns'
                        ],
                        success: isArabic ? 'معايير النجاح:' : 'Success Criteria:',
                        successList: isArabic ? [
                            'تكافؤ الميزات مع نسخة Angular ✓',
                            'أداء مساوٍ أو أفضل (وقت التحميل، التفاعل) ✓',
                            'صفر أخطاء حرجة في التجهيز ✓',
                            'الفريق واثق من نهج Vanilla JS ✓'
                        ] : [
                            'Feature parity with Angular version ✓',
                            'Performance equal or better (load time, interaction) ✓',
                            'Zero critical bugs in staging ✓',
                            'Team confident in Vanilla JS approach ✓'
                        ]
                    },
                    {
                        num: 2,
                        title: isArabic ? 'المرحلة 2: الوحدات التجارية الأساسية' : 'Phase 2: Core Business Modules',
                        weeks: isArabic ? 'الأسابيع 11-28' : 'Weeks 11-28',
                        intro: isArabic ? 'نقل <strong>الوحدات الأساسية الرئيسية</strong> لـ ERP بترتيب الأولوية. هذه هي الأنظمة الأكبر والأكثر أهمية:' : 'Migrate the ERP\'s <strong>major core modules</strong> in priority order. These are the largest, most critical systems:',
                        note: isArabic ? '<strong>ملاحظة:</strong> بمجرد نقل هذه الوحدات الرئيسية، ستكون الميزات الصغيرة المتبقية واضحة وأسهل في الإكمال.' : '<strong>Note:</strong> Once these major modules are migrated, remaining smaller features will be straightforward and easier to complete.',
                        parallel: isArabic ? 'مسارات عمل متوازية:' : 'Parallel Workstreams:',
                        parallelList: isArabic ? [
                            '<strong>المطورون (مع Cursor AI):</strong> الفريق ينقل الوحدات باستخدام Cursor AI للتحويل، توليد الكود، ومساعدة إعادة الهيكلة',
                            '<strong>تقسيم الفريق A & B:</strong> بينما يقوم مطور بنقل الوحدة الحالية مع Cursor، يقوم الآخر بإعداد وتحليل الوحدة التالية',
                            '<strong>ضمان الجودة:</strong> التحقق من كل وحدة مكتملة في التجهيز قبل الترقية للإنتاج',
                            '<strong>الطرح:</strong> النشر وحدة تلو الأخرى، مراقبة مؤشرات الأداء لمدة أسبوع لكل وحدة قبل المتابعة'
                        ] : [
                            '<strong>Developers (with Cursor AI):</strong> Team migrates modules using Cursor AI for conversion, code generation, and refactoring assistance',
                            '<strong>Team A & B Split:</strong> While one developer migrates current module with Cursor, the other prepares and analyzes the next module',
                            '<strong>QA:</strong> Validates each completed module in staging before production promotion',
                            '<strong>Rollout:</strong> Deploy module by module, monitor KPIs for 1 week each before proceeding'
                        ],
                        riskMitigation: isArabic ? 'تخفيف المخاطر:' : 'Risk Mitigation:',
                        riskList: isArabic ? [
                            'الاحتفاظ بنسخة Angular قيد التشغيل (خيار التراجع) ✓',
                            'أعلام الميزات لاختبار A/B ✓',
                            'مجموعة انحدار تلقائية بعد كل انتقال ✓',
                            'اجتماعات يومية لمعالجة العوائق ✓'
                        ] : [
                            'Keep Angular version running (rollback option) ✓',
                            'Feature flags for A/B testing ✓',
                            'Automated regression suite after each migration ✓',
                            'Daily standups to address blockers ✓'
                        ]
                    },
                    {
                        num: 3,
                        title: isArabic ? 'المرحلة 3: إيقاف Angular' : 'Phase 3: Angular Decommission',
                        weeks: isArabic ? 'الأسابيع 29-32' : 'Weeks 29-32',
                        finalSteps: isArabic ? 'الخطوات النهائية:' : 'Final Steps:',
                        stepsList: isArabic ? [
                            'إزالة إطار عمل Angular، التبعيات، وأدوات البناء',
                            'دمج التوجيه إلى Vanilla JS النقي (بدون كود جسر)',
                            'تنظيف البنية التحتية للتعايش',
                            'أرشفة قاعدة كود Angular للمرجع',
                            'تحديث جميع الوثائق ومواد التأهيل',
                            'تدقيق أداء نهائي وتحسين شامل'
                        ] : [
                            'Remove Angular framework, dependencies, and build tooling',
                            'Consolidate routing to pure Vanilla JS (no bridge code)',
                            'Clean up coexistence infrastructure',
                            'Archive Angular codebase for reference',
                            'Update all documentation and onboarding materials',
                            'Final performance audit and optimization pass'
                        ],
                        completion: isArabic ? 'معايير الإكمال:' : 'Completion Criteria:',
                        completionList: isArabic ? [
                            'تحقيق تكافؤ الميزات بنسبة 100% ✓',
                            'صفر تبعيات Angular في قاعدة الكود ✓',
                            'الإنتاج مستقر لمدة 30 يوماً ✓',
                            'الفريق مدرّب بالكامل على أنماط Vanilla JS ✓'
                        ] : [
                            '100% feature parity achieved ✓',
                            'Zero Angular dependencies in codebase ✓',
                            'Production stable for 30 days ✓',
                            'Team fully trained on Vanilla JS patterns ✓'
                        ]
                    },
                    {
                        num: 4,
                        title: isArabic ? 'المرحلة 4: التحسين والتنقيح' : 'Phase 4: Optimization & Refinement',
                        weeks: isArabic ? 'الأسابيع 33-40' : 'Weeks 33-40',
                        intro: isArabic ? 'مع اكتمال الانتقال، التركيز على الصقل والأداء:' : 'With migration complete, focus on polish and performance:',
                        tasksList: isArabic ? [
                            'ضبط الأداء: التحميل الكسول، تقسيم الكود، استراتيجيات التخزين المؤقت',
                            'تحسينات UX بناءً على ملاحظات المستخدمين',
                            'تقوية الأمان: سياسات CSP، منع XSS، تسجيل التدقيق',
                            'تدقيق إمكانية الوصول (امتثال WCAG 2.1)',
                            'تنظيف الديون التقنية وإعادة هيكلة الكود',
                            'أنماط Cursor AI المتقدمة والأتمتة'
                        ] : [
                            'Performance tuning: lazy loading, code splitting, caching strategies',
                            'UX improvements based on user feedback',
                            'Security hardening: CSP policies, XSS prevention, audit logging',
                            'Accessibility audit (WCAG 2.1 compliance)',
                            'Technical debt cleanup and code refactoring',
                            'Advanced Cursor AI patterns and automation'
                        ],
                        outcome: isArabic ? 'النتيجة:' : 'Outcome:',
                        outcomeList: isArabic ? [
                            'تطبيق مصقول بالكامل وجاهز للإنتاج ✅',
                            'جميع أعضاء الفريق مدربون وواثقون من نهج Vanilla JS ✅',
                            'الوثائق كاملة (الهندسة المعمارية، الأنماط، استكشاف الأخطاء) ✅',
                            'تم اجتياز تدقيق الأمان (لا ثغرات حرجة) ✅'
                        ] : [
                            'Fully polished, production-ready application ✅',
                            'All team members trained and confident in Vanilla JS approach ✅',
                            'Documentation complete (architecture, patterns, troubleshooting) ✅',
                            'Security audit passed (no critical vulnerabilities) ✅'
                        ]
                    }
                ]
            }
        };
        
        // Additional sections translations
        const sections = {
            architecture: {
                title: isArabic ? 'الهندسة المعمارية التقنية والأنماط' : 'Technical Architecture & Patterns',
                componentModel: {
                    title: isArabic ? 'نموذج المكونات' : 'Component Model',
                    desc: isArabic ? 'مكونات نمطية ومستقلة مع خطافات دورة حياة واضحة.' : 'Modular, self-contained components with clear lifecycle hooks.'
                },
                stateManagement: {
                    title: isArabic ? 'إدارة الحالة' : 'State Management',
                    desc: isArabic ? 'مخزن تفاعلي خفيف الوزن مع نمط pub/sub.' : 'Lightweight reactive store with pub/sub pattern.'
                },
                apiClient: {
                    title: isArabic ? 'عميل API' : 'API Client',
                    desc: isArabic ? 'عميل HTTP موحد مع المصادقة، معالجة الأخطاء، والمعترضات.' : 'Unified HTTP client with auth, error handling, interceptors.'
                },
                routing: {
                    title: isArabic ? 'التوجيه' : 'Routing',
                    desc: isArabic ? 'توجيه SPA قائم على Hash (لا حاجة لتكوين الخادم).' : 'Hash-based SPA routing (no server config needed).'
                },
                coexistence: {
                    title: isArabic ? 'جسر التعايش (مؤقت)' : 'Coexistence Bridge (Temporary)',
                    intro: isArabic ? 'أثناء الانتقال، استخدم جسر توجيه لتركيب مكونات Vanilla JS داخل غلاف Angular:' : 'During migration, use a routing bridge to mount Vanilla JS components inside the Angular shell:',
                    note: isArabic ? 'هذا يسمح لـ Angular و Vanilla JS بالتعايش خلال فترة الانتقال.' : 'This allows Angular and Vanilla JS to coexist during the transition period.'
                }
            },
            testing: {
                title: isArabic ? 'الاختبار وضمانات الجودة' : 'Testing & Quality Guardrails',
                unit: {
                    title: isArabic ? 'اختبار الوحدة' : 'Unit Testing',
                    items: isArabic ? [
                        'استخدم Vitest أو Jest',
                        'اختبار الوظائف النقية، الأدوات المساعدة',
                        'منطق عرض المكونات',
                        'الهدف: تغطية +80%'
                    ] : [
                        'Use Vitest or Jest',
                        'Test pure functions, utilities',
                        'Component rendering logic',
                        'Target: 80%+ coverage'
                    ]
                },
                integration: {
                    title: isArabic ? 'اختبار التكامل' : 'Integration Testing',
                    items: isArabic ? [
                        'التحقق من عقد API',
                        'تفاعل المكونات',
                        'طفرات حالة المخزن',
                        'التشغيل عند كل دمج PR'
                    ] : [
                        'API contract validation',
                        'Component interaction',
                        'Store state mutations',
                        'Run on every PR merge'
                    ]
                },
                e2e: {
                    title: isArabic ? 'اختبار E2E' : 'E2E Testing',
                    items: isArabic ? [
                        'استخدم Playwright أو Cypress',
                        'رحلات المستخدم الحرجة',
                        'مجموعة الانحدار بعد كل وحدة',
                        'التشغيل ليلاً + قبل النشر'
                    ] : [
                        'Use Playwright or Cypress',
                        'Critical user journeys',
                        'Regression suite after each module',
                        'Run nightly + pre-deploy'
                    ]
                },
                performance: {
                    title: isArabic ? 'اختبار الأداء' : 'Performance Testing',
                    items: isArabic ? [
                        'Lighthouse CI في خط الأنابيب',
                        'مقاييس الأساس: FCP < 1.5 ثانية، TTI < 3 ثوانٍ',
                        'حجم الحزمة < 200KB (مضغوط)',
                        'تحذيرات على الانحدار'
                    ] : [
                        'Lighthouse CI in pipeline',
                        'Baseline metrics: FCP < 1.5s, TTI < 3s',
                        'Bundle size < 200KB (gzipped)',
                        'Alert on regressions'
                    ]
                },
                mandatoryGates: {
                    title: isArabic ? 'بوابات الجودة الإلزامية' : 'Mandatory Quality Gates',
                    items: isArabic ? [
                        '<strong>مراجعة الكود:</strong> جميع PRs تتطلب موافقة واحدة من مطور أقدم',
                        '<strong>الاختبارات التلقائية:</strong> يجب أن يمر CI (وحدة + تكامل)',
                        '<strong>التحقق في التجهيز:</strong> 48 ساعة كحد أدنى لوقت النقع',
                        '<strong>فحص الأداء:</strong> لا تراجعات مقابل نسخة Angular',
                        '<strong>فحص الأمان:</strong> التحليل الثابت (قواعد أمان ESLint، npm audit)'
                    ] : [
                        '<strong>Code Review:</strong> All PRs require 1 approval from senior dev',
                        '<strong>Automated Tests:</strong> CI must pass (unit + integration)',
                        '<strong>Staging Validation:</strong> 48 hours minimum soak time',
                        '<strong>Performance Check:</strong> No regressions vs Angular version',
                        '<strong>Security Scan:</strong> Static analysis (ESLint security rules, npm audit)'
                    ]
                }
            },
            security: {
                title: isArabic ? 'ضمانات الأمان والأداء' : 'Security & Performance Guardrails',
                securityReq: {
                    title: isArabic ? 'متطلبات الأمان' : 'Security Requirements',
                    items: isArabic ? [
                        '<strong>CSP:</strong> سياسة أمان محتوى صارمة (لا نصوص inline)',
                        '<strong>منع XSS:</strong> تطهير دائم لمدخلات المستخدم، استخدم textContent بدلاً من innerHTML',
                        '<strong>CSRF:</strong> رموز مكافحة التزوير على جميع استدعاءات API المغيرة للحالة',
                        '<strong>المصادقة:</strong> رموز JWT مع التحديث، مخزنة في httpOnly cookies',
                        '<strong>RBAC:</strong> التحكم في الوصول على أساس الأدوار يُفرض على مستوى API',
                        '<strong>تسجيل التدقيق:</strong> تتبع جميع العمليات الحساسة'
                    ] : [
                        '<strong>CSP:</strong> Strict Content Security Policy (no inline scripts)',
                        '<strong>XSS Prevention:</strong> Always sanitize user input, use textContent over innerHTML',
                        '<strong>CSRF:</strong> Anti-forgery tokens on all state-changing API calls',
                        '<strong>Auth:</strong> JWT tokens with refresh, stored in httpOnly cookies',
                        '<strong>RBAC:</strong> Role-based access control enforced at API level',
                        '<strong>Audit Logging:</strong> Track all sensitive operations'
                    ]
                },
                performanceTargets: {
                    title: isArabic ? 'أهداف الأداء' : 'Performance Targets',
                    items: isArabic ? [
                        '<strong>أول رسم للمحتوى:</strong> &lt; 1.5 ثانية',
                        '<strong>الوقت للتفاعلية:</strong> &lt; 3.0 ثوانٍ',
                        '<strong>أكبر رسم للمحتوى:</strong> &lt; 2.5 ثانية',
                        '<strong>التحول التراكمي للتخطيط:</strong> &lt; 0.1',
                        '<strong>حجم الحزمة:</strong> JS الأولي &lt; 200KB (مضغوط)',
                        '<strong>استجابة API:</strong> النسبة المئوية 95 &lt; 500 ملي ثانية'
                    ] : [
                        '<strong>First Contentful Paint:</strong> &lt; 1.5s',
                        '<strong>Time to Interactive:</strong> &lt; 3.0s',
                        '<strong>Largest Contentful Paint:</strong> &lt; 2.5s',
                        '<strong>Cumulative Layout Shift:</strong> &lt; 0.1',
                        '<strong>Bundle Size:</strong> Initial JS &lt; 200KB (gzipped)',
                        '<strong>API Response:</strong> 95th percentile &lt; 500ms'
                    ]
                }
            },
            kpis: {
                title: isArabic ? 'مؤشرات الأداء الرئيسية ومعايير القبول' : 'KPIs & Acceptance Criteria',
                intro: isArabic ? 'تتبع هذه المقاييس طوال عملية الانتقال لضمان النجاح:' : 'Track these metrics throughout the migration to ensure success:',
                migrationProgress: {
                    title: isArabic ? 'تقدم الانتقال' : 'Migration Progress',
                    items: isArabic ? [
                        '% من الوحدات المنقولة',
                        'أسطر Angular المتبقية',
                        'تغطية Vanilla JS',
                        'معدل التسليم في الوقت المحدد'
                    ] : [
                        '% of modules migrated',
                        'Angular LOC remaining',
                        'Vanilla JS coverage',
                        'On-time delivery rate'
                    ]
                },
                qualityMetrics: {
                    title: isArabic ? 'مقاييس الجودة' : 'Quality Metrics',
                    items: isArabic ? [
                        'عدد الأخطاء (P1/P2)',
                        'نسبة تغطية الاختبارات',
                        'وقت مراجعة الكود',
                        'حوادث الإنتاج'
                    ] : [
                        'Bug count (P1/P2)',
                        'Test coverage %',
                        'Code review turnaround',
                        'Production incidents'
                    ]
                },
                performanceMetrics: {
                    title: isArabic ? 'الأداء' : 'Performance',
                    items: isArabic ? [
                        'تغير وقت تحميل الصفحة Δ',
                        'نقاط Lighthouse',
                        'تقليل حجم الحزمة',
                        'تأخر API (p95)'
                    ] : [
                        'Page load time Δ',
                        'Lighthouse score',
                        'Bundle size reduction',
                        'API latency (p95)'
                    ]
                },
                teamVelocity: {
                    title: isArabic ? 'سرعة الفريق' : 'Team Velocity',
                    items: isArabic ? [
                        'نقاط القصة لكل سبرنت',
                        'استخدام طلبات Cursor AI',
                        'الوقت المحفوظ للمطورين (تقدير)',
                        'درجة رضا الفريق'
                    ] : [
                        'Story points per sprint',
                        'Cursor AI request usage',
                        'Dev time saved (estimate)',
                        'Team satisfaction score'
                    ]
                },
                successCriteria: {
                    title: isArabic ? 'معايير نجاح المشروع (الإطلاق)' : 'Project Success Criteria (Go-Live)',
                    items: isArabic ? [
                        '✅ <strong>تكافؤ ميزات بنسبة 100%</strong> مع نسخة Angular',
                        '✅ <strong>صفر أخطاء P1</strong> في الإنتاج لمدة 14 يوماً متتالية',
                        '✅ <strong>أداء مساوٍ أو أفضل</strong> (تحميل الصفحة، التفاعلات)',
                        '✅ <strong>جميع أعضاء الفريق مدربون</strong> وواثقون من نهج Vanilla JS',
                        '✅ <strong>الوثائق كاملة</strong> (الهندسة المعمارية، الأنماط، استكشاف الأخطاء)',
                        '✅ <strong>اجتياز تدقيق الأمان</strong> (لا ثغرات حرجة)'
                    ] : [
                        '✅ <strong>100% feature parity</strong> with Angular version',
                        '✅ <strong>Zero P1 bugs</strong> in production for 14 consecutive days',
                        '✅ <strong>Performance equal or better</strong> (page load, interactions)',
                        '✅ <strong>All team members trained</strong> and confident in Vanilla JS approach',
                        '✅ <strong>Documentation complete</strong> (architecture, patterns, troubleshooting)',
                        '✅ <strong>Security audit passed</strong> (no critical vulnerabilities)'
                    ]
                }
            }
        };
        
        container.innerHTML = `
            <!-- Executive Mandate Section -->
            <div class="card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%); border: 3px solid var(--color-danger); margin-bottom: var(--spacing-2xl);">
                <div style="text-align: center; padding: var(--spacing-xl); border-bottom: 2px solid var(--color-border);">
                    <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🚨</div>
                    <h2 style="font-size: 2rem; color: var(--color-danger); margin-bottom: var(--spacing-lg);">${t.mandate.title}</h2>
                    <p style="font-size: var(--font-size-base); color: var(--color-text-muted); font-style: italic;">
                        ${t.mandate.org}
                    </p>
                </div>
                
                <div style="padding: var(--spacing-xl);">
                    <div style="background: rgba(15, 23, 42, 0.6); padding: var(--spacing-xl); border-radius: var(--border-radius); border-left: 4px solid var(--color-danger); margin-bottom: var(--spacing-lg);">
                        <h3 style="color: var(--color-danger); margin-bottom: var(--spacing-lg); font-size: 1.3rem;">${t.mandate.directive}</h3>
                        
                        <div style="background: rgba(239, 68, 68, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-md); border-left: 4px solid var(--color-danger);">
                            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                                <strong style="color: var(--color-danger);">${t.mandate.new.title}</strong>
                            </p>
                            <p style="line-height: 1.8; padding-left: var(--spacing-lg);">
                                ${t.mandate.new.desc}
                            </p>
                        </div>
                        
                        <div style="background: rgba(239, 68, 68, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-danger);">
                            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                                <strong style="color: var(--color-danger);">${t.mandate.existing.title}</strong>
                            </p>
                            <p style="line-height: 1.8; padding-left: var(--spacing-lg); margin-bottom: var(--spacing-md);">
                                ${t.mandate.existing.desc}
                            </p>
                            <p style="line-height: 1.8; padding-left: var(--spacing-lg); color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                                ${t.mandate.existing.note}
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding: var(--spacing-lg); background: rgba(239, 68, 68, 0.1); border-radius: var(--border-radius);">
                        <p style="font-size: 1.2rem; font-weight: 700; color: var(--color-danger);">
                            ${t.mandate.binding}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Migration Strategy Overview -->
            <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid var(--color-accent); margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-accent); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">🎯</span>
                    <span>${t.strategy.title}</span>
                </h2>
                
                <div style="background: rgba(99, 102, 241, 0.15); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl); border-left: 4px solid var(--color-accent);">
                    <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">${t.strategy.coreTitle}</h3>
                    <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        ${t.strategy.coreDesc}
                    </p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); margin-top: var(--spacing-xl);">
                        <div style="text-align: center; padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-sm);">🔄</div>
                            <p style="font-weight: 700; color: var(--color-success);">${t.strategy.features.incremental.title}</p>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t.strategy.features.incremental.sub}</p>
                        </div>
                        <div style="text-align: center; padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-sm);">⚡</div>
                            <p style="font-weight: 700; color: var(--color-success);">${t.strategy.features.lowRisk.title}</p>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t.strategy.features.lowRisk.sub}</p>
                        </div>
                        <div style="text-align: center; padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            <p style="font-weight: 700; color: var(--color-success);">${t.strategy.features.validated.title}</p>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t.strategy.features.validated.sub}</p>
                        </div>
                        <div style="text-align: center; padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-sm);">🚀</div>
                            <p style="font-weight: 700; color: var(--color-success);">${t.strategy.features.cursor.title}</p>
                            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${t.strategy.features.cursor.sub}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Timeline & Phases -->
            <div class="card" style="margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-warning); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">📅</span>
                    <span>${t.timeline.title}</span>
                </h2>
                
                <div style="position: relative; padding-left: var(--spacing-xl); border-left: 4px solid var(--color-accent); margin-left: var(--spacing-lg);">
                    
                    <!-- Phase 0: Foundation -->
                    <div style="position: relative; padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl); border: 2px solid var(--color-accent);">
                        <div style="position: absolute; left: calc(-1 * var(--spacing-xl) - 28px); top: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; color: white; border: 4px solid var(--color-bg-primary);">0</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                            <h3 style="color: var(--color-accent); font-size: 1.4rem;">${t.timeline.phases[0].title}</h3>
                            <span style="background: var(--color-accent); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-size-sm); font-weight: 700;">${t.timeline.phases[0].weeks}</span>
                        </div>
                        
                        <div style="margin-bottom: var(--spacing-lg);">
                            <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.timeline.phases[0].objectives}</h4>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                                ${t.timeline.phases[0].objectivesList.map(obj => `<li>${obj}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: rgba(99, 102, 241, 0.2); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                            <p style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-accent);">${t.timeline.phases[0].deliverables}</p>
                            <p style="font-size: var(--font-size-sm); line-height: 1.6;">
                                ${t.timeline.phases[0].deliverablesList.map(del => `${del}<br>`).join('')}
                            </p>
                        </div>
                    </div>

                    <!-- Phase 1: Pilot Module -->
                    <div style="position: relative; padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl); border: 2px solid var(--color-success);">
                        <div style="position: absolute; left: calc(-1 * var(--spacing-xl) - 28px); top: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; color: white; border: 4px solid var(--color-bg-primary);">1</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                            <h3 style="color: var(--color-success); font-size: 1.4rem;">${t.timeline.phases[1].title}</h3>
                            <span style="background: var(--color-success); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-size-sm); font-weight: 700;">${t.timeline.phases[1].weeks}</span>
                        </div>
                        
                        <div style="margin-bottom: var(--spacing-lg);">
                            <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.timeline.phases[1].target}</h4>
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                                ${t.timeline.phases[1].targetDesc}
                            </p>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8; margin-bottom: var(--spacing-lg);">
                                ${t.timeline.phases[1].targetList.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                            
                            <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.timeline.phases[1].execution}</h4>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                                ${t.timeline.phases[1].executionList.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: rgba(52, 211, 153, 0.2); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                            <p style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-success);">${t.timeline.phases[1].success}</p>
                            <p style="font-size: var(--font-size-sm); line-height: 1.6;">
                                ${t.timeline.phases[1].successList.map(item => `${item}<br>`).join('')}
                            </p>
                        </div>
                    </div>

                    <!-- Phase 2: Core Modules -->
                    <div style="position: relative; padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl); border: 2px solid var(--color-warning);">
                        <div style="position: absolute; left: calc(-1 * var(--spacing-xl) - 28px); top: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-warning); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; color: white; border: 4px solid var(--color-bg-primary);">2</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                            <h3 style="color: var(--color-warning); font-size: 1.4rem;">${t.timeline.phases[2].title}</h3>
                            <span style="background: var(--color-warning); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-size-sm); font-weight: 700;">${t.timeline.phases[2].weeks}</span>
                        </div>
                        
                        <div style="margin-bottom: var(--spacing-lg);">
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                                ${t.timeline.phases[2].intro}
                            </p>
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: rgba(251, 191, 36, 0.1); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning); font-size: var(--font-size-sm);">
                                ${t.timeline.phases[2].note}
                            </p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">1. التسجيل (Registration)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Student enrollment, admissions</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">2. الدرجات (Grades)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Grading, transcripts, reports</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">3. الغياب والحضور (Attendance)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Student attendance tracking</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">4. سلوكيات الطلاب (Student Behavior)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Discipline, conduct records</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">5. التقدم الدراسي (Academic Progress)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Student progress tracking</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">6. الموارد البشرية (Human Resources)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Employee records, management</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">7. الرواتب (Payroll)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Salary processing, benefits</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">8. الصندوق (Cashier/Finance)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Payments, receipts, accounting</p>
                                </div>
                                <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                                    <p style="font-weight: 700; color: var(--color-warning); margin-bottom: var(--spacing-xs); font-size: 1.1rem;">9. المخازن (Inventory)</p>
                                    <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Warehouse, supplies, assets</p>
                                </div>
                            </div>
                            
                            <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.timeline.phases[2].parallel}</h4>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                                ${t.timeline.phases[2].parallelList.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: rgba(251, 191, 36, 0.2); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                            <p style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-warning);">${t.timeline.phases[2].riskMitigation}</p>
                            <p style="font-size: var(--font-size-sm); line-height: 1.6;">
                                ${t.timeline.phases[2].riskList.map(item => `${item}<br>`).join('')}
                            </p>
                        </div>
                    </div>

                    <!-- Phase 3: Decommission -->
                    <div style="position: relative; padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl); border: 2px solid var(--color-highlight-b);">
                        <div style="position: absolute; left: calc(-1 * var(--spacing-xl) - 28px); top: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-highlight-b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; color: white; border: 4px solid var(--color-bg-primary);">3</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                            <h3 style="color: var(--color-highlight-b); font-size: 1.4rem;">${t.timeline.phases[3].title}</h3>
                            <span style="background: var(--color-highlight-b); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-size-sm); font-weight: 700;">${t.timeline.phases[3].weeks}</span>
                        </div>
                        
                        <div style="margin-bottom: var(--spacing-lg);">
                            <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">${t.timeline.phases[3].finalSteps}</h4>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                                ${t.timeline.phases[3].stepsList.map(step => `<li>${step}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: rgba(139, 92, 246, 0.2); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--color-highlight-b);">
                            <p style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-highlight-b);">${t.timeline.phases[3].completion}</p>
                            <p style="font-size: var(--font-size-sm); line-height: 1.6;">
                                ${t.timeline.phases[3].completionList.map(item => `${item}<br>`).join('')}
                            </p>
                        </div>
                    </div>

                    <!-- Phase 4: Optimization -->
                    <div style="position: relative; padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%); border-radius: var(--border-radius); border: 2px solid var(--color-success);">
                        <div style="position: absolute; left: calc(-1 * var(--spacing-xl) - 28px); top: var(--spacing-xl); width: 48px; height: 48px; background: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; color: white; border: 4px solid var(--color-bg-primary);">4</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
                            <h3 style="color: var(--color-success); font-size: 1.4rem;">${t.timeline.phases[4].title}</h3>
                            <span style="background: var(--color-success); color: white; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--border-radius); font-size: var(--font-size-sm); font-weight: 700;">${t.timeline.phases[4].weeks}</span>
                        </div>
                        
                        <div style="margin-bottom: var(--spacing-lg);">
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                                ${t.timeline.phases[4].intro}
                            </p>
                            <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                                ${t.timeline.phases[4].tasksList.map(task => `<li>${task}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div style="background: rgba(52, 211, 153, 0.2); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                            <p style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-success);">${t.timeline.phases[4].outcome}</p>
                            <ul style="font-size: var(--font-size-sm); line-height: 1.8; padding-left: var(--spacing-lg); list-style: none;">
                                ${t.timeline.phases[4].outcomeList.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- Technical Architecture -->
            <div class="card" style="background: rgba(99, 102, 241, 0.05); border: 2px solid var(--color-accent); margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-accent); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">🏗️</span>
                    <span>${sections.architecture.title}</span>
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-lg);">
                    
                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">${sections.architecture.componentModel.title}</h3>
                        <pre style="background: rgba(15, 23, 42, 0.8); padding: var(--spacing-md); border-radius: var(--border-radius); overflow-x: auto; font-size: var(--font-size-sm); line-height: 1.6;"><code>// components/student-list.js
export function init(container, store) {
  store.subscribe('students', render);
  attachEventListeners();
}

function render(students) {
  container.innerHTML = \`...\`;
}</code></pre>
                        <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                            ${sections.architecture.componentModel.desc}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">${sections.architecture.stateManagement.title}</h3>
                        <pre style="background: rgba(15, 23, 42, 0.8); padding: var(--spacing-md); border-radius: var(--border-radius); overflow-x: auto; font-size: var(--font-size-sm); line-height: 1.6;"><code>// store.js (Pub/Sub pattern)
class Store {
  constructor(state = {}) {
    this.state = state;
    this.listeners = {};
  }
  
  subscribe(key, callback) { }
  setState(key, value) { }
}</code></pre>
                        <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                            ${sections.architecture.stateManagement.desc}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">${sections.architecture.apiClient.title}</h3>
                        <pre style="background: rgba(15, 23, 42, 0.8); padding: var(--spacing-md); border-radius: var(--border-radius); overflow-x: auto; font-size: var(--font-size-sm); line-height: 1.6;"><code>// api.js
const api = {
  get: (url) => fetch(url, {
    headers: authHeaders()
  }),
  post: (url, data) => { }
};

export default api;</code></pre>
                        <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                            ${sections.architecture.apiClient.desc}
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">${sections.architecture.routing.title}</h3>
                        <pre style="background: rgba(15, 23, 42, 0.8); padding: var(--spacing-md); border-radius: var(--border-radius); overflow-x: auto; font-size: var(--font-size-sm); line-height: 1.6;"><code>// router.js (Hash-based)
class Router {
  register(path, handler) { }
  navigate(path) {
    window.location.hash = path;
  }
}

export default new Router();</code></pre>
                        <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                            ${sections.architecture.routing.desc}
                        </p>
                    </div>
                    
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(99, 102, 241, 0.1); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                    <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">${sections.architecture.coexistence.title}</h3>
                    <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                        ${sections.architecture.coexistence.intro}
                    </p>
                    <pre style="background: rgba(15, 23, 42, 0.8); padding: var(--spacing-md); border-radius: var(--border-radius); overflow-x: auto; font-size: var(--font-size-sm); line-height: 1.6;"><code>// Angular route
{ path: 'students', component: VanillaWrapperComponent }

// VanillaWrapperComponent.ts
ngOnInit() {
  import('./vanilla/student-list.js').then(module => {
    module.init(this.elementRef.nativeElement, store);
  });
}</code></pre>
                    <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                        ${sections.architecture.coexistence.note}
                    </p>
                </div>
            </div>

            <!-- Testing & Quality Guardrails -->
            <div class="card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%); border: 2px solid var(--color-success); margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-success); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">✅</span>
                    <span>${sections.testing.title}</span>
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
                    
                    <div style="background: rgba(52, 211, 153, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🧪</span>
                            ${sections.testing.unit.title}
                        </h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.testing.unit.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🔗</span>
                            ${sections.testing.integration.title}
                        </h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.testing.integration.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🎭</span>
                            ${sections.testing.e2e.title}
                        </h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.testing.e2e.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">⚡</span>
                            ${sections.testing.performance.title}
                        </h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.testing.performance.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                </div>
                
                <div style="background: rgba(52, 211, 153, 0.2); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                    <h3 style="color: var(--color-success); margin-bottom: var(--spacing-md);">${sections.testing.mandatoryGates.title}</h3>
                    <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                        ${sections.testing.mandatoryGates.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- Security & Performance -->
            <div class="card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%); border: 2px solid var(--color-danger); margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-danger); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">🔒</span>
                    <span>${sections.security.title}</span>
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                    
                    <div>
                        <h3 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">${sections.security.securityReq.title}</h3>
                        <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                            ${sections.security.securityReq.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-md);">${sections.security.performanceTargets.title}</h3>
                        <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                            ${sections.security.performanceTargets.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                </div>
            </div>

            <!-- KPIs & Success Criteria -->
            <div class="card" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%); border: 2px solid var(--color-warning); margin-bottom: var(--spacing-2xl);">
                <h2 style="color: var(--color-warning); margin-bottom: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-md);">
                    <span style="font-size: 2.5rem;">📊</span>
                    <span>${sections.kpis.title}</span>
                </h2>
                
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-xl);">
                    ${sections.kpis.intro}
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg);">
                    
                    <div style="background: rgba(251, 191, 36, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                        <h3 style="color: var(--color-warning); font-size: 1.2rem; margin-bottom: var(--spacing-md);">${sections.kpis.migrationProgress.title}</h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.kpis.migrationProgress.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                        <h3 style="color: var(--color-warning); font-size: 1.2rem; margin-bottom: var(--spacing-md);">${sections.kpis.qualityMetrics.title}</h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.kpis.qualityMetrics.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                        <h3 style="color: var(--color-warning); font-size: 1.2rem; margin-bottom: var(--spacing-md);">${sections.kpis.performanceMetrics.title}</h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.kpis.performanceMetrics.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.15); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                        <h3 style="color: var(--color-warning); font-size: 1.2rem; margin-bottom: var(--spacing-md);">${sections.kpis.teamVelocity.title}</h3>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; font-size: var(--font-size-sm);">
                            ${sections.kpis.teamVelocity.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(251, 191, 36, 0.2); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                    <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-md);">${sections.kpis.successCriteria.title}</h3>
                    <ul style="padding-left: var(--spacing-xl); line-height: 1.8;">
                        ${sections.kpis.successCriteria.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <!-- Final Summary -->
            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border: 3px solid var(--color-accent); text-align: center; padding: var(--spacing-2xl);">
                <div style="font-size: 3rem; margin-bottom: var(--spacing-lg);">🚀</div>
                <h2 style="color: var(--color-accent); font-size: 1.8rem; margin-bottom: var(--spacing-lg);">
                    ${isArabic ? 'ملخص الانتقال: نهج تدريجي على 12 شهراً' : 'Migration Summary: 12-Month Phased Approach'}
                </h2>
                <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                    ${isArabic 
                        ? 'تحقق هذه الخطة التوازن بين <strong style="color: var(--color-success);">السرعة، وتخفيف المخاطر، والجودة</strong>. من خلال اعتماد نمط الخانق والاستفادة من Cursor AI، ستنتقل مدرسة الرؤية ثنائية اللغة من Angular إلى Vanilla JS تدريجياً، مع الحفاظ على استمرارية التشغيل مع تحقيق أداء وتجربة مطور متفوقة.'
                        : 'This plan balances <strong style="color: var(--color-success);">speed, risk mitigation, and quality</strong>. By adopting the Strangler Pattern and leveraging Cursor AI, Alruya Bilingual School will transition from Angular to Vanilla JS incrementally, maintaining operational continuity while achieving superior performance and developer experience.'}
                </p>
                <p style="font-size: var(--font-size-base); color: var(--color-text-muted); margin-top: var(--spacing-xl);">
                    <strong>${isArabic ? 'الإكمال المقدّر:' : 'Estimated Completion:'}</strong> ${isArabic ? '10-12 شهراً' : '10-12 months'} | 
                    <strong>${isArabic ? 'حجم الفريق:' : 'Team Size:'}</strong> ${isArabic ? 'مطوران + Cursor AI' : '2 developers + Cursor AI'} | 
                    <strong>${isArabic ? 'مستوى المخاطر:' : 'Risk Level:'}</strong> ${isArabic ? 'منخفض (نهج تدريجي، مُتحقق منه)' : 'Low (phased, validated approach)'}
                </p>
            </div>
        `;
    }

    // Initialize app
    function initApp() {
        console.log('initApp called');
        initLanguage();
        initTabs();
        
        // Register route for intro (overview) - no handler needed, HTML is already there
        router.register('intro', () => {});
        
        router.register('criteria', () => {
            const container = document.getElementById('kpi-cards-container');
            if (container && !container.dataset.initialized) {
                renderKPICards(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('deep-dive', () => {
            const container = document.getElementById('deep-dive-content');
            if (container && !container.dataset.initialized) {
                renderDeepDive(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('matrix', () => {
            const container = document.getElementById('decision-matrix-container');
            if (container && !container.dataset.initialized) {
                initDecisionMatrix(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('tco', () => {
            const container = document.getElementById('tco-container');
            if (container && !container.dataset.initialized) {
                initTCOModel(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('risks', () => {
            const container = document.getElementById('risk-register-container');
            if (container && !container.dataset.initialized) {
                initRiskRegister(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('hiring', () => {
            const container = document.getElementById('hiring-content');
            if (container && !container.dataset.initialized) {
                renderHiringContent(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('security', () => {
            const container = document.getElementById('security-content');
            if (container && !container.dataset.initialized) {
                renderSecurityContent(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('testing', () => {
            const container = document.getElementById('testing-content');
            if (container && !container.dataset.initialized) {
                renderTestingContent(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('how-vanilla', () => {
            const container = document.getElementById('vanilla-guide-content');
            if (container && !container.dataset.initialized) {
                renderVanillaGuide(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('cursor-preference', () => {
            const container = document.getElementById('cursor-preference-content');
            if (container && !container.dataset.initialized) {
                renderCursorPreference(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('recommendation', () => {
            const container = document.getElementById('recommendation-container');
            if (container && !container.dataset.initialized) {
                renderRecommendation(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('real-world', () => {
            const container = document.getElementById('real-world-container');
            if (container && !container.dataset.initialized) {
                renderRealWorldExamples(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('final-decision', () => {
            const container = document.getElementById('final-decision-container');
            if (container && !container.dataset.initialized) {
                renderFinalDecision(container);
                container.dataset.initialized = 'true';
            }
        });
        
        router.register('migration', () => {
            const container = document.getElementById('migration-container');
            if (container && !container.dataset.initialized) {
                renderMigrationPlan(container);
                container.dataset.initialized = 'true';
            }
        });
        
        // Trigger initial route after a short delay to ensure DOM is ready
        setTimeout(() => {
            router.handleRouteChange();
        }, 150);
    }

    // Start when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})();
