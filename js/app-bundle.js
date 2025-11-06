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
        { id: 'intro', label: 'Overview', icon: '📋' },
        { id: 'criteria', label: 'Criteria', icon: '🎯' },
        { id: 'deep-dive', label: 'Deep Dive', icon: '🔍' },
        { id: 'matrix', label: 'Decision Matrix', icon: '📊' },
        { id: 'tco', label: 'TCO Model', icon: '💰' },
        { id: 'risks', label: 'Risks', icon: '⚠️' },
        { id: 'hiring', label: 'Hiring', icon: '👥' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'testing', label: 'Testing', icon: '✅' },
        { id: 'how-vanilla', label: 'Vanilla Guide', icon: '🛠️' },
        { id: 'cursor-preference', label: 'Cursor AI', icon: '🤖' },
        { id: 'real-world', label: 'Real World', icon: '🌍' },
        { id: 'recommendation', label: 'Recommendation', icon: '📝' }
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
            button.textContent = `${tab.icon} ${tab.label}`;
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
            card.innerHTML = `<h3>${criterion.name}</h3><p>${criterion.description}</p>`;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    }

    // Deep Dive - PROFESSIONAL VERSION with Cursor AI considerations
    function renderDeepDive(container) {
        const comparisons = [
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

    function renderDecisionMatrix(container) {
        const criteria = store.getState().criteria;
        
        container.innerHTML = `
            <div class="matrix-controls">
                <div class="btn-group">
                    <button class="btn btn-primary" id="export-matrix">
                        💾 Export Matrix
                    </button>
                    <button class="btn btn-secondary" id="import-matrix">
                        📥 Import Matrix
                    </button>
                    <button class="btn btn-secondary" id="reset-matrix">
                        🔄 Reset to Defaults
                    </button>
                </div>
                <input type="file" id="matrix-file-input" accept=".json" style="display: none;">
            </div>
            
            <div id="matrix-items"></div>
            
            <div class="matrix-results">
                <h3 class="text-center">Weighted Results</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <h3>Vanilla JS Score</h3>
                        <div class="result-score" id="vanilla-total">0</div>
                    </div>
                    <div class="result-item">
                        <h3>.NET + SPA Score</h3>
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
                        Adjust weights and scores above
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
        
        item.innerHTML = `
            <h4 style="display: flex; align-items: center; gap: 0.5rem;">
                ${criterion.name}
                <span class="tooltip-trigger" data-tooltip="${escapeHtml(criterion.description)}">ℹ️</span>
            </h4>
            <div class="matrix-row">
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="How important is this criterion to your organization? (0 = not important, 10 = critical)">
                            Weight ℹ️
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
                        aria-label="Weight for ${criterion.name}"
                    >
                </div>
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="How well does Vanilla JS + Web API perform on this criterion? (0 = poor, 10 = excellent)">
                            Vanilla JS Score ℹ️
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
                        aria-label="Vanilla JS score for ${criterion.name}"
                    >
                </div>
                <div class="slider-group">
                    <div class="slider-label">
                        <span class="tooltip-label" data-tooltip="How well does .NET Core + SPA (Angular/React) perform on this criterion? (0 = poor, 10 = excellent)">
                            .NET + SPA Score ℹ️
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
                        aria-label=".NET + SPA score for ${criterion.name}"
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
                winnerBadgeEl.textContent = `🏆 Vanilla JS Leads by ${(vanillaScore - dotnetScore).toFixed(1)} points`;
            } else if (dotnetScore > vanillaScore) {
                winnerBadgeEl.textContent = `🏆 .NET + SPA Leads by ${(dotnetScore - vanillaScore).toFixed(1)} points`;
            } else {
                winnerBadgeEl.textContent = '🤝 Tied Score';
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

    function renderTCOModel(container) {
        const inputs = store.getState().tcoInputs;
        
        container.innerHTML = `
            <div class="card">
                <h3>TCO Assumptions</h3>
                <p class="mb-0">Adjust the inputs below to model costs for your specific scenario. All monetary values in KWD (thousands).</p>
            </div>
            
            <div class="intro-grid">
                <div class="card">
                    <h4>Team & Setup</h4>
                    <div class="form-group">
                        <label for="tco-team-size">
                            <span class="tooltip-label" data-tooltip="Number of full-time developers working on the project. This affects the monthly burn rate and overall project timeline.">
                                Team Size (Developers) ℹ️
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
                            <span class="tooltip-label" data-tooltip="Average monthly salary per developer including base salary, benefits, overhead, and infrastructure costs. Typical range: 1,000-5,000 KWD per month.">
                                Average Monthly Salary (KWD) ℹ️
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
                            <span class="tooltip-label" data-tooltip="Time needed for initial setup: project scaffolding, CI/CD pipelines, dev environments, tooling configuration. .NET + SPA typically requires more setup time.">
                                Setup & Configuration (Months) ℹ️
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
                    <h4>Velocity & Maintenance</h4>
                    <div class="form-group">
                        <label for="tco-vanilla-velocity">
                            <span class="tooltip-label" data-tooltip="Development speed multiplier for Vanilla JS. 1.0 = baseline speed, >1.0 = faster delivery (e.g., 1.2 = 20% faster). Consider team expertise and requirements complexity.">
                                Vanilla JS Velocity Multiplier ℹ️
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
                        <small style="color: var(--color-text-muted);">1.0 = baseline, >1.0 = faster</small>
                    </div>
                    <div class="form-group">
                        <label for="tco-dotnet-velocity">
                            <span class="tooltip-label" data-tooltip="Development speed multiplier for .NET + SPA. 1.0 = baseline speed, >1.0 = faster delivery. Frameworks can accelerate development for complex features but have learning curves.">
                                .NET + SPA Velocity Multiplier ℹ️
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
                        <small style="color: var(--color-text-muted);">1.0 = baseline, >1.0 = faster</small>
                    </div>
                    <div class="form-group">
                        <label for="tco-year1-maintenance">
                            <span class="tooltip-label" data-tooltip="Ongoing maintenance cost in Year 1 as a percentage of total build cost. Includes bug fixes, minor updates, security patches, and small feature additions.">
                                Year 1 Maintenance (% of build cost) ℹ️
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
                            <span class="tooltip-label" data-tooltip="Annual maintenance cost in Year 3 as a percentage of build cost. Typically increases over time due to technical debt, dependency updates, and evolving requirements.">
                                Year 3 Maintenance (% of build cost) ℹ️
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
        
        resultsContainer.innerHTML = `
            <div class="card" style="margin-top: var(--spacing-xl);">
                <h3>Cost Breakdown</h3>
                
                <div class="chart-container">
                    <h4>Year 1 Total Cost of Ownership</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>Vanilla JS</strong></span>
                                <span>${formatNumber(vanillaYear1Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    Setup: ${formatNumber(vanillaSetupCost)}K | Build: ${formatNumber(vanillaBuildCost)}K | Maint: ${formatNumber(vanillaYear1Maint)}K
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>.NET + SPA</strong></span>
                                <span>${formatNumber(dotnetYear1Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    Setup: ${formatNumber(dotnetSetupCost)}K | Build: ${formatNumber(dotnetBuildCost)}K | Maint: ${formatNumber(dotnetYear1Maint)}K
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>Year 2 Total Cost of Ownership (Cumulative)</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>Vanilla JS</strong></span>
                                <span>${formatNumber(vanillaYear2Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear2Total / maxYear2 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    Total through Year 2
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>.NET + SPA</strong></span>
                                <span>${formatNumber(dotnetYear2Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear2Total / maxYear2 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    Total through Year 2
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>Year 3 Total Cost of Ownership (Cumulative)</h4>
                    <div class="chart-bars">
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>Vanilla JS</strong></span>
                                <span>${formatNumber(vanillaYear3Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(vanillaYear3Total / maxYear3 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                    Total through Year 3
                                </div>
                            </div>
                        </div>
                        <div class="chart-bar-item">
                            <div class="chart-bar-label">
                                <span><strong>.NET + SPA</strong></span>
                                <span>${formatNumber(dotnetYear3Total)}K KWD</span>
                            </div>
                            <div class="chart-bar-visual">
                                <div class="chart-bar-fill" style="width: ${(dotnetYear3Total / maxYear3 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                    Total through Year 3
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                    <h4>Key Insights</h4>
                    <ul>
                        <li>Year 1 difference: <strong>${formatNumber(Math.abs(vanillaYear1Total - dotnetYear1Total))}K KWD</strong> 
                            ${vanillaYear1Total < dotnetYear1Total ? '(Vanilla JS cheaper)' : '(.NET + SPA cheaper)'}</li>
                        <li>Year 2 difference: <strong>${formatNumber(Math.abs(vanillaYear2Total - dotnetYear2Total))}K KWD</strong> 
                            ${vanillaYear2Total < dotnetYear2Total ? '(Vanilla JS cheaper)' : '(.NET + SPA cheaper)'}</li>
                        <li>Year 3 difference: <strong>${formatNumber(Math.abs(vanillaYear3Total - dotnetYear3Total))}K KWD</strong> 
                            ${vanillaYear3Total < dotnetYear3Total ? '(Vanilla JS cheaper)' : '(.NET + SPA cheaper)'}</li>
                        <li>Monthly burn rate: <strong>${formatNumber(monthlyBurnRate)}K KWD</strong></li>
                        <li>Vanilla JS build time: <strong>${vanillaBuildMonths.toFixed(1)} months</strong></li>
                        <li>.NET + SPA build time: <strong>${dotnetBuildMonths.toFixed(1)} months</strong></li>
                    </ul>
                    <p><em>Note: These are estimates. Actual costs vary based on team experience, requirements complexity, and organizational factors.</em></p>
                </div>
            </div>
        `;
    }

    function initRiskRegister(container) {
        renderRiskRegister(container);
    }
    
    function renderRiskRegister(container) {
        const riskCategories = [
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
        
        const getRiskBadgeClass = (level) => {
            switch(level.toLowerCase()) {
                case 'high': return 'risk-high';
                case 'medium': return 'risk-medium';
                case 'low': return 'risk-low';
                default: return '';
            }
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
                            <div class="risk-label">Risk:</div>
                            <div class="risk-content">${cat.vanillaRisk}</div>
                        </div>
                        
                        <div class="risk-metrics">
                            <div class="risk-metric">
                                <span class="metric-label">Probability:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.vanillaProbability)}">${cat.vanillaProbability}</span>
                            </div>
                            <div class="risk-metric">
                                <span class="metric-label">Impact:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.vanillaImpact)}">${cat.vanillaImpact}</span>
                            </div>
                        </div>
                        
                        <div class="risk-detail">
                            <div class="risk-label">Mitigation:</div>
                            <div class="risk-content">${cat.vanillaMitigation}</div>
                        </div>
                    </div>
                    
                    <div class="risk-divider">VS</div>
                    
                    <div class="risk-approach-section dotnet-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟪</span> .NET Core + SPA
                        </h4>
                        
                        <div class="risk-detail">
                            <div class="risk-label">Risk:</div>
                            <div class="risk-content">${cat.dotnetRisk}</div>
                        </div>
                        
                        <div class="risk-metrics">
                            <div class="risk-metric">
                                <span class="metric-label">Probability:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.dotnetProbability)}">${cat.dotnetProbability}</span>
                            </div>
                            <div class="risk-metric">
                                <span class="metric-label">Impact:</span>
                                <span class="risk-badge ${getRiskBadgeClass(cat.dotnetImpact)}">${cat.dotnetImpact}</span>
                            </div>
                        </div>
                        
                        <div class="risk-detail">
                            <div class="risk-label">Mitigation:</div>
                            <div class="risk-content">${cat.dotnetMitigation}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="card">
                <h2>⚠️ Risk Analysis</h2>
                <p>Comprehensive risk comparison across key areas. Each category shows potential risks, their likelihood, impact, and mitigation strategies for both approaches.</p>
            </div>
            
            ${riskHTML}
        `;
    }

    function renderHiringContent(container) {
        const hiringCategories = [
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
                                <h5 class="pros-title">✅ Advantages</h5>
                                <ul class="pros-list">
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-section">
                                <h5 class="cons-title">⚠️ Challenges</h5>
                                <ul class="cons-list">
                                    ${cat.vanillaProsCons.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hiring-divider">VS</div>
                    
                    <div class="hiring-approach-section dotnet-section">
                        <h4 class="approach-title">
                            <span class="approach-icon">🟪</span> .NET Core + SPA
                        </h4>
                        
                        <p class="hiring-details">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-grid">
                            <div class="pros-section">
                                <h5 class="pros-title">✅ Advantages</h5>
                                <ul class="pros-list">
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-section">
                                <h5 class="cons-title">⚠️ Challenges</h5>
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
                <h2>👥 Hiring & Market Availability</h2>
                <p>Detailed comparison of talent acquisition, costs, and market dynamics for both technology approaches in the Kuwait market.</p>
            </div>
            
            ${hiringHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>📊 Summary Recommendation</h3>
                <div class="summary-grid">
                    <div>
                        <h4>Choose Vanilla JS if:</h4>
                        <ul>
                            <li>Budget is tight (lower salaries)</li>
                            <li>Small team (2-5 developers)</li>
                            <li>You have strong technical leadership</li>
                            <li>Long-term cost control is priority</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Choose .NET + SPA if:</h4>
                        <ul>
                            <li>Need to hire quickly</li>
                            <li>Scaling team rapidly (6+ developers)</li>
                            <li>Want standardized skills</li>
                            <li>Enterprise features are important</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSecurityContent(container) {
        const securityCategories = [
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
        
        const getComplexityClass = (level) => {
            switch(level.toLowerCase()) {
                case 'high': return 'complexity-high';
                case 'medium': return 'complexity-medium';
                case 'low': return 'complexity-low';
                default: return '';
            }
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
                            <span class="badge-label">Approach:</span>
                            <span class="badge-value">${cat.vanillaApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">Complexity:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.vanillaComplexity)}">${cat.vanillaComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Advantages:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Challenges:</strong>
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
                            <span class="badge-label">Approach:</span>
                            <span class="badge-value">${cat.dotnetApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">Complexity:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.dotnetComplexity)}">${cat.dotnetComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Advantages:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Challenges:</strong>
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
                <h2>🔒 Security & Compliance</h2>
                <p>Comprehensive security comparison covering authentication, data protection, vulnerability prevention, and compliance requirements.</p>
            </div>
            
            ${securityHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>🛡️ Security Summary</h3>
                <div class="summary-grid">
                    <div>
                        <h4>Vanilla JS Security Profile:</h4>
                        <ul>
                            <li><strong>Control:</strong> Maximum flexibility and control</li>
                            <li><strong>Expertise:</strong> Requires strong security knowledge</li>
                            <li><strong>Risk:</strong> Higher if team lacks experience</li>
                            <li><strong>Best for:</strong> Security-conscious teams with expertise</li>
                        </ul>
                    </div>
                    <div>
                        <h4>.NET + SPA Security Profile:</h4>
                        <ul>
                            <li><strong>Control:</strong> Guided by framework best practices</li>
                            <li><strong>Expertise:</strong> Built-in security reduces burden</li>
                            <li><strong>Risk:</strong> Lower due to battle-tested features</li>
                            <li><strong>Best for:</strong> Enterprise compliance needs</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>⚡ Critical Recommendation:</h4>
                    <p><strong>Both approaches can be secure</strong>, but .NET + SPA provides more <em>security by default</em>. If your team has limited security expertise, the framework's built-in protections significantly reduce risk. If you choose Vanilla JS, invest heavily in security training and code review.</p>
                </div>
            </div>
        `;
    }

    function renderTestingContent(container) {
        const testingCategories = [
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
        
        const getComplexityClass = (level) => {
            switch(level.toLowerCase()) {
                case 'high': return 'complexity-high';
                case 'medium': return 'complexity-medium';
                case 'low': return 'complexity-low';
                default: return '';
            }
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
                            <span class="badge-label">Approach:</span>
                            <span class="badge-value">${cat.vanillaApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">Complexity:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.vanillaComplexity)}">${cat.vanillaComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Advantages:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Challenges:</strong>
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
                            <span class="badge-label">Approach:</span>
                            <span class="badge-value">${cat.dotnetApproach}</span>
                        </div>
                        
                        <div class="complexity-indicator">
                            <span class="complexity-label">Complexity:</span>
                            <span class="complexity-badge ${getComplexityClass(cat.dotnetComplexity)}">${cat.dotnetComplexity}</span>
                        </div>
                        
                        <p class="approach-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Advantages:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Challenges:</strong>
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
                <h2>✅ Testing & Quality Assurance</h2>
                <p>Comprehensive testing comparison covering unit tests, integration tests, E2E testing, coverage, and CI/CD strategies.</p>
            </div>
            
            ${testingHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>🧪 Testing Summary</h3>
                <div class="summary-grid">
                    <div>
                        <h4>Vanilla JS Testing Profile:</h4>
                        <ul>
                            <li><strong>Simplicity:</strong> Fewer tools, simpler setup</li>
                            <li><strong>Speed:</strong> Faster test execution overall</li>
                            <li><strong>Learning Curve:</strong> Lower, standard JS testing</li>
                            <li><strong>Best for:</strong> Small teams, fast iteration</li>
                        </ul>
                    </div>
                    <div>
                        <h4>.NET + SPA Testing Profile:</h4>
                        <ul>
                            <li><strong>Richness:</strong> More tooling and features</li>
                            <li><strong>Completeness:</strong> Full-stack testing support</li>
                            <li><strong>Learning Curve:</strong> Higher, multiple frameworks</li>
                            <li><strong>Best for:</strong> Enterprise quality standards</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>💡 Testing Recommendation:</h4>
                    <p><strong>Both approaches support comprehensive testing</strong>. Vanilla JS has simpler, faster tests but requires more manual work. .NET + SPA provides richer tooling but with more complexity. Choose based on your team's testing maturity and quality requirements.</p>
                </div>
            </div>
        `;
    }

    function renderVanillaGuide(container) {
        container.innerHTML = `
            <div class="card">
                <h2>🎨 Making Vanilla JS Practical for ERP Development</h2>
                <p>This page shows you the essential patterns and architecture needed to build production-ready ERP applications with vanilla JavaScript. <strong>This very website demonstrates all these patterns!</strong></p>
            </div>
            
            <div class="vanilla-guide-section">
                <h3 class="guide-section-title">🗺️ Essential Architecture Components</h3>
                
                <div class="guide-cards-grid">
                    <div class="guide-card">
                        <h4 class="guide-card-title">1. Router (Hash-based Navigation)</h4>
                        <p class="guide-card-desc">Handle single-page navigation without page reloads. Listen to hash changes and show/hide sections.</p>
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
                        <h4 class="guide-card-title">2. State Store (Pub/Sub Pattern)</h4>
                        <p class="guide-card-desc">Centralized state management with reactive subscriptions. Components auto-update when state changes.</p>
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
                        <h4 class="guide-card-title">3. Component Pattern</h4>
                        <p class="guide-card-desc">Reusable UI components with initialization, rendering, and event handling. Declarative and maintainable.</p>
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
                        <h4 class="guide-card-title">4. HTTP Client / API Layer</h4>
                        <p class="guide-card-desc">Centralized API communication with error handling, loading states, and response formatting.</p>
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
                <h3 class="guide-section-title">💡 Best Practices & Patterns</h3>
                
                <div class="best-practices-grid">
                    <div class="practice-card">
                        <div class="practice-icon">🔒</div>
                        <h4>Security First</h4>
                        <ul>
                            <li>Always use <code>textContent</code> or <code>createElement</code></li>
                            <li>Sanitize user input before rendering</li>
                            <li>Implement CSRF tokens for state-changing requests</li>
                            <li>Use parameterized queries on backend</li>
                            <li>Set Content Security Policy headers</li>
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">📦</div>
                        <h4>Code Organization</h4>
                        <ul>
                            <li>One component per file</li>
                            <li>Group by feature, not by type</li>
                            <li>Use modules (ES6) for dependencies</li>
                            <li>Keep components small and focused</li>
                            <li>Shared utilities in <code>/utils</code> folder</li>
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">⚡</div>
                        <h4>Performance</h4>
                        <ul>
                            <li>Event delegation for dynamic content</li>
                            <li>Debounce/throttle frequent events</li>
                            <li>Lazy load components and routes</li>
                            <li>Virtual scrolling for large lists</li>
                            <li>Cache DOM queries</li>
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">🧪</div>
                        <h4>Testing Strategy</h4>
                        <ul>
                            <li>Unit test pure functions</li>
                            <li>Integration test API layer</li>
                            <li>E2E test critical user flows</li>
                            <li>Use Playwright for browser testing</li>
                            <li>Mock fetch calls in tests</li>
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">📱</div>
                        <h4>Responsive Design</h4>
                        <ul>
                            <li>Mobile-first CSS approach</li>
                            <li>Use CSS Grid and Flexbox</li>
                            <li>CSS variables for theming</li>
                            <li>Progressive enhancement</li>
                            <li>Touch-friendly UI elements</li>
                        </ul>
                    </div>
                    
                    <div class="practice-card">
                        <div class="practice-icon">♿</div>
                        <h4>Accessibility</h4>
                        <ul>
                            <li>Semantic HTML elements</li>
                            <li>ARIA labels where needed</li>
                            <li>Keyboard navigation support</li>
                            <li>Focus management for SPAs</li>
                            <li>Screen reader testing</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="vanilla-guide-section">
                <h3 class="guide-section-title">🛠️ Essential Utilities</h3>
                
                <div class="utilities-grid">
                    <div class="utility-card">
                        <h4>DOM Utilities</h4>
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
                        <h4>Debounce & Throttle</h4>
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
                        <h4>Form Validation</h4>
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
                        <h4>Loading States</h4>
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
                <h3>🎯 Quick Start: Building Your First Vanilla JS ERP Module</h3>
                <div class="quick-start-steps">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Set Up Core Architecture</h4>
                            <p>Create your Router, Store, and API client. Initialize them in your main app file.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Create Component Structure</h4>
                            <p>Build reusable components following the pattern: <code>init() → render() → attachEvents()</code></p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Define Routes</h4>
                            <p>Register your routes with the router. Each route initializes its component.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Connect to Backend</h4>
                            <p>Use your API client to fetch data, update state, and trigger re-renders.</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>💎 Pro Tips:</h4>
                    <ul>
                        <li>✓ Start simple - add complexity only when needed</li>
                        <li>✓ Study this website's source code - it's a working example!</li>
                        <li>✓ Use browser DevTools to debug state and events</li>
                        <li>✓ Keep components pure and testable</li>
                        <li>✓ Document your architecture decisions</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function renderCursorPreference(container) {
        const cursorCategories = [
            {
                category: 'Code Completion & Autocomplete',
                vanillaScore: 9,
                vanillaDetails: 'Cursor excels with vanilla JavaScript. Simple, predictable patterns. No complex type definitions. Standard DOM APIs are well-known to the AI model.',
                vanillaProsCons: {
                    pros: ['Fast, accurate completions', 'No type ambiguity', 'Standard APIs in training data', 'Simple function signatures'],
                    cons: ['Less structural guidance', 'No TypeScript hints', 'Manual type checking', 'Context can be ambiguous']
                },
                dotnetScore: 8,
                dotnetDetails: 'Good with TypeScript/Angular/React. Rich type information helps AI. Framework APIs are well-documented. However, complex generics can confuse the model.',
                dotnetProsCons: {
                    pros: ['Type-driven suggestions', 'Framework-aware completions', 'Strong intellisense', 'Component scaffolding'],
                    cons: ['Complex types slow down', 'Generic inference issues', 'Multiple syntax styles', 'Framework version matters']
                }
            },
            {
                category: 'Refactoring & Code Generation',
                vanillaScore: 10,
                vanillaDetails: 'Cursor shines here. Simple, predictable refactorings. Generate entire components easily. No framework constraints. Pure JavaScript transformations are straightforward.',
                vanillaProsCons: {
                    pros: ['Clean code generation', 'Easy to understand output', 'No boilerplate', 'Fast generation speed'],
                    cons: ['Must specify patterns manually', 'No framework conventions', 'Architecture not enforced', 'Consistency requires prompts']
                },
                dotnetScore: 7,
                dotnetDetails: 'Can generate boilerplate well, but framework-specific patterns are hit-or-miss. Sometimes generates outdated patterns. Complex type hierarchies can cause errors.',
                dotnetProsCons: {
                    pros: ['Scaffolds full components', 'Generates tests', 'Follows conventions', 'Type-safe output'],
                    cons: ['Verbose boilerplate', 'Version-specific code', 'Complex error fixing', 'Slower generation']
                }
            },
            {
                category: 'Bug Detection & Fixing',
                vanillaScore: 8,
                vanillaDetails: 'Cursor can spot logical errors effectively. Runtime bugs are easier to identify. Simple stack traces. However, type-related bugs only caught at runtime.',
                vanillaProsCons: {
                    pros: ['Clear error messages', 'Simple debugging', 'Direct stack traces', 'No build errors'],
                    cons: ['No compile-time checks', 'Type errors at runtime', 'Less safety net', 'Manual validation needed']
                },
                dotnetScore: 9,
                dotnetDetails: 'TypeScript + linting catches many errors before runtime. Cursor leverages type information for better bug detection. Compile-time safety is a big win.',
                dotnetProsCons: {
                    pros: ['Compile-time error detection', 'Type-driven fixes', 'Linter integration', 'Preventive safety'],
                    cons: ['Complex error messages', 'Build pipeline issues', 'Type system complexity', 'More errors to fix']
                }
            },
            {
                category: 'AI Chat & Natural Language Requests',
                vanillaScore: 10,
                vanillaDetails: 'Cursor understands "simple JavaScript" requests perfectly. No framework jargon needed. Direct, clear communication. Easy to explain what you want.',
                vanillaProsCons: {
                    pros: ['Clear communication', 'No framework confusion', 'Direct instructions', 'Fast iteration'],
                    cons: ['Must describe architecture', 'No framework shortcuts', 'Pattern explanations needed', 'Context setup required']
                },
                dotnetScore: 7,
                dotnetDetails: 'Must specify framework versions and patterns. "Angular way" vs "React way" matters. Framework-specific terminology required. More context needed in prompts.',
                dotnetProsCons: {
                    pros: ['Framework conventions understood', 'Rich ecosystem knowledge', 'Pattern libraries known', 'Best practices built-in'],
                    cons: ['Version-specific prompts', 'Framework confusion', 'Verbose instructions', 'Pattern disambiguation needed']
                }
            },
            {
                category: 'Learning Curve for AI-Assisted Development',
                vanillaScore: 9,
                vanillaDetails: 'Junior developers can start immediately. Cursor suggestions are easy to understand. No framework magic to learn. Direct correlation between prompt and output.',
                vanillaProsCons: {
                    pros: ['Beginner-friendly', 'Predictable output', 'Easy to modify', 'Clear learning path'],
                    cons: ['Must learn patterns yourself', 'No framework guardrails', 'Architectural decisions harder', 'More manual work']
                },
                dotnetScore: 6,
                dotnetDetails: 'Steep learning curve even with AI. Must understand framework first. Cursor can generate code you don\'t understand. Framework knowledge still required.',
                dotnetProsCons: {
                    pros: ['Generates complex patterns', 'Framework best practices', 'Scaffolds structure', 'Comprehensive solutions'],
                    cons: ['Hard to understand output', 'Framework knowledge required', 'Black box generation', 'Debugging AI code harder']
                }
            },
            {
                category: 'Documentation & API Discovery',
                vanillaScore: 9,
                vanillaDetails: 'MDN and web standards are extensively documented. Cursor knows all standard APIs. Simple, stable documentation. No versioning issues.',
                vanillaProsCons: {
                    pros: ['Stable APIs', 'Comprehensive docs', 'No version issues', 'Universal knowledge'],
                    cons: ['Must discover patterns', 'No framework docs', 'Community patterns vary', 'Best practices scattered']
                },
                dotnetScore: 8,
                dotnetDetails: 'Rich framework documentation. Cursor knows official docs well. However, multiple framework versions create confusion. Docs change frequently.',
                dotnetProsCons: {
                    pros: ['Official documentation', 'Framework guides', 'Example-rich', 'Community patterns'],
                    cons: ['Version fragmentation', 'Docs go stale', 'Multiple sources', 'Deprecated patterns']
                }
            },
            {
                category: 'Testing Code Generation',
                vanillaScore: 9,
                vanillaDetails: 'Cursor generates clean, simple tests. Pure function testing is straightforward. Mock generation is simple. Test code is easy to understand.',
                vanillaProsCons: {
                    pros: ['Simple test generation', 'Easy mocking', 'Clear assertions', 'Fast test writing'],
                    cons: ['DOM testing manual', 'No component testing', 'Must define patterns', 'Framework-less testing']
                },
                dotnetScore: 8,
                dotnetDetails: 'Can generate full test suites. Framework testing utilities known. However, complex setup code and framework-specific patterns can be confusing.',
                dotnetProsCons: {
                    pros: ['Component test generation', 'Framework test utils', 'Complete test suites', 'Mocking built-in'],
                    cons: ['Verbose test code', 'Complex setup', 'Framework-specific', 'Harder to modify']
                }
            },
            {
                category: 'Performance Optimization Suggestions',
                vanillaScore: 8,
                vanillaDetails: 'Cursor can suggest direct performance improvements. Simple optimizations like event delegation, caching. However, advanced patterns require manual implementation.',
                vanillaProsCons: {
                    pros: ['Direct optimizations', 'Clear performance wins', 'No framework overhead', 'Measurable improvements'],
                    cons: ['Manual implementation', 'No framework patterns', 'Profiling manual', 'Pattern knowledge needed']
                },
                dotnetScore: 7,
                dotnetDetails: 'Framework-specific optimizations known. Memoization, lazy loading, code splitting. But framework complexity can mask issues. Build-time optimizations need expertise.',
                dotnetProsCons: {
                    pros: ['Framework optimizations', 'Build-time analysis', 'Profiling tools', 'Pattern libraries'],
                    cons: ['Framework complexity', 'Hard to measure', 'Build configuration', 'Multiple optimization layers']
                }
            },
            {
                category: 'Multi-file Edits & Large Refactors',
                vanillaScore: 9,
                vanillaDetails: 'Cursor handles multi-file changes well. Simple imports and dependencies. Easy to track changes. No complex build considerations.',
                vanillaProsCons: {
                    pros: ['Clean multi-file edits', 'Simple dependencies', 'Easy tracking', 'Fast execution'],
                    cons: ['Manual coordination', 'No type safety', 'Runtime errors possible', 'Import management manual']
                },
                dotnetScore: 7,
                dotnetDetails: 'Type system helps with refactoring. But complex dependency chains can cause issues. Build errors after AI edits are common. TypeScript refactors can be slow.',
                dotnetProsCons: {
                    pros: ['Type-safe refactoring', 'Import auto-update', 'Compile-time validation', 'IDE integration'],
                    cons: ['Slow with large changes', 'Build errors common', 'Complex dependencies', 'Type errors cascade']
                }
            },
            {
                category: 'Overall Developer Velocity with Cursor',
                vanillaScore: 9,
                vanillaDetails: 'Maximum velocity for experienced devs. Fast iteration. Direct control. No framework overhead. Cursor becomes a super-powered coding partner.',
                vanillaProsCons: {
                    pros: ['Fastest iteration', 'Immediate feedback', 'No build time', 'Direct development'],
                    cons: ['Must guide architecture', 'No framework shortcuts', 'Pattern enforcement manual', 'Team alignment harder']
                },
                dotnetScore: 7,
                dotnetDetails: 'Good velocity once framework is known. Cursor helps with boilerplate. But build times, type errors, and framework complexity slow things down.',
                dotnetProsCons: {
                    pros: ['Scaffolding speed', 'Framework conventions', 'Rich ecosystem', 'Enterprise patterns'],
                    cons: ['Build time overhead', 'Framework debugging', 'Complex error fixing', 'Slower feedback loop']
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
            if (score >= 9) return 'Excellent';
            if (score >= 7) return 'Good';
            if (score >= 5) return 'Fair';
            return 'Poor';
        };
        
        const cursorHTML = cursorCategories.map(cat => `
            <div class="cursor-row-card">
                <div class="cursor-row-header">
                    <h3 class="cursor-row-title">${cat.category}</h3>
                    <div class="cursor-scores">
                        <div class="cursor-score-item vanilla-score">
                            <span class="score-label">🟦 Vanilla JS:</span>
                            <span class="score-badge ${getScoreClass(cat.vanillaScore)}">${cat.vanillaScore}/10 - ${getScoreLabel(cat.vanillaScore)}</span>
                        </div>
                        <div class="cursor-score-item dotnet-score">
                            <span class="score-label">🟪 .NET + SPA:</span>
                            <span class="score-badge ${getScoreClass(cat.dotnetScore)}">${cat.dotnetScore}/10 - ${getScoreLabel(cat.dotnetScore)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="cursor-row-content">
                    <div class="cursor-column vanilla-column">
                        <div class="column-header">
                            <span class="column-icon">🟦</span>
                            <span class="column-title">Vanilla JS + Web API</span>
                        </div>
                        
                        <p class="cursor-description">${cat.vanillaDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Cursor Advantages:</strong>
                                <ul>
                                    ${cat.vanillaProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Limitations:</strong>
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
                            <span class="column-title">.NET Core + SPA</span>
                        </div>
                        
                        <p class="cursor-description">${cat.dotnetDetails}</p>
                        
                        <div class="pros-cons-compact">
                            <div class="pros-compact">
                                <strong class="section-title">✅ Cursor Advantages:</strong>
                                <ul>
                                    ${cat.dotnetProsCons.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="cons-compact">
                                <strong class="section-title">⚠️ Limitations:</strong>
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
                <h2>🤖 Cursor AI Performance Analysis</h2>
                <p>Comprehensive evaluation of how effectively Cursor AI assists development in each tech stack. Based on real-world usage across ${cursorCategories.length} key development scenarios.</p>
            </div>
            
            ${cursorHTML}
            
            <div class="card highlight-card" style="margin-top: var(--spacing-xl);">
                <h3>🏆 Cursor AI Verdict</h3>
                
                <div class="cursor-final-scores">
                    <div class="final-score-card vanilla-final">
                        <div class="final-score-icon">🟦</div>
                        <div class="final-score-details">
                            <h4>Vanilla JS + Web API</h4>
                            <div class="final-score-number">${vanillaAvg}/10</div>
                            <p>Average Cursor AI Performance</p>
                        </div>
                    </div>
                    
                    <div class="final-score-divider">VS</div>
                    
                    <div class="final-score-card dotnet-final">
                        <div class="final-score-icon">🟪</div>
                        <div class="final-score-details">
                            <h4>.NET Core + SPA</h4>
                            <div class="final-score-number">${dotnetAvg}/10</div>
                            <p>Average Cursor AI Performance</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                    <h4>💡 Key Insights for Cursor AI Development:</h4>
                    <div class="insights-grid">
                        <div>
                            <h5>Vanilla JS Wins</h5>
                            <ul>
                                <li>✓ <strong>Code Generation:</strong> Cleaner, simpler output (10/10)</li>
                                <li>✓ <strong>Chat Interaction:</strong> Clearer communication (10/10)</li>
                                <li>✓ <strong>Learning Curve:</strong> Immediate productivity (9/10)</li>
                                <li>✓ <strong>Velocity:</strong> Fastest iteration (9/10)</li>
                            </ul>
                        </div>
                        <div>
                            <h5>.NET + SPA Wins</h5>
                            <ul>
                                <li>✓ <strong>Bug Detection:</strong> Type-driven safety (9/10)</li>
                                <li>✓ <strong>Testing:</strong> Framework test utilities (8/10)</li>
                                <li>✓ <strong>Documentation:</strong> Rich framework docs (8/10)</li>
                                <li>✓ <strong>Completions:</strong> Type-driven suggestions (8/10)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: rgba(99, 102, 241, 0.1); border-radius: var(--border-radius);">
                        <h4>🎯 Bottom Line:</h4>
                        <p><strong>Vanilla JS is the clear winner for Cursor AI-assisted development</strong> with an average score of <strong>${vanillaAvg}/10</strong> vs <strong>${dotnetAvg}/10</strong> for .NET + SPA.</p>
                        <p>Cursor AI works best with simple, predictable code. The lack of framework complexity means faster generation, clearer communication, and more reliable refactoring. If you're choosing a tech stack specifically to maximize AI assistance, <em>Vanilla JavaScript is the optimal choice</em>.</p>
                        <p><strong>However</strong>, .NET + SPA offers better compile-time safety and catches more bugs before runtime. The trade-off is between <em>AI velocity</em> (Vanilla JS) vs <em>type safety</em> (.NET + SPA).</p>
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
        
        // Generate key decision factors
        const keyFactors = [];
        
        if (parseFloat(vanillaScore) > parseFloat(dotnetScore)) {
            keyFactors.push(`✓ <strong>Decision Matrix:</strong> Vanilla JS scores higher (${vanillaScore}/10 vs ${dotnetScore}/10) based on your weighted criteria`);
        } else {
            keyFactors.push(`✓ <strong>Decision Matrix:</strong> .NET + SPA scores higher (${dotnetScore}/10 vs ${vanillaScore}/10) based on your weighted criteria`);
        }
        
        keyFactors.push(`✓ <strong>Base Development Cost:</strong> ${tcoCheaper} is ${formatNumber(tcoDifference)}K KWD cheaper (before Cursor AI)`);
        
        keyFactors.push(`✓ <strong>Cursor AI Subscription:</strong> ${cursorAnnualCost.toFixed(2)}K KWD/year for ${tcoInputs.teamSize} developers (same for both)`);
        
        keyFactors.push(`✓ <strong>Estimated Cursor Requests:</strong> Vanilla: ${vanillaTotalRequests.toLocaleString()} requests vs .NET: ${dotnetTotalRequests.toLocaleString()} requests/year`);
        
        keyFactors.push(`✓ <strong>Cursor Productivity Impact:</strong> Vanilla saves ${formatNumber(vanillaDevSavings)}K KWD (${(cursorProductivityDiff * 60).toFixed(1)}% boost) vs .NET saves ${formatNumber(dotnetDevSavings)}K KWD (${(cursorProductivityDiff * 20).toFixed(1)}% boost)`);
        
        keyFactors.push(`✓ <strong>Total Cost with Cursor AI:</strong> Vanilla ${formatNumber(vanillaWithCursor)}K KWD vs .NET ${formatNumber(dotnetWithCursor)}K KWD - saves ${formatNumber(totalSavings)}K KWD (${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%)`);
        
        // Team size consideration
        if (tcoInputs.teamSize <= 3) {
            keyFactors.push(`✓ <strong>Team Size:</strong> Your ${tcoInputs.teamSize} developers will make ${vanillaTotalRequests.toLocaleString()} fewer Cursor requests with Vanilla JS`);
        } else if (tcoInputs.teamSize >= 6) {
            keyFactors.push(`✓ <strong>Team Size:</strong> Your larger team (${tcoInputs.teamSize} developers) may benefit from .NET + SPA's structure`);
        }
        
        // Build time comparison
        const vanillaBuildWithCursor = vanillaBuildMonths * vanillaProductivityMultiplier;
        const dotnetBuildWithCursor = dotnetBuildMonths * dotnetProductivityMultiplier;
        keyFactors.push(`✓ <strong>Time to Market (with Cursor AI):</strong> Vanilla JS: ${vanillaBuildWithCursor.toFixed(1)} months vs .NET + SPA: ${dotnetBuildWithCursor.toFixed(1)} months`);
        
        container.innerHTML = `
            <div class="card">
                <h2>📊 Comprehensive Analysis Summary</h2>
                <p>Based on your Decision Matrix scoring, TCO modeling, and Cursor AI productivity impact.</p>
                <p style="color: var(--color-accent); font-weight: 600; margin-top: var(--spacing-md);">
                    ⚡ Your team of ${tcoInputs.teamSize} developers will use Cursor AI - this productivity boost is factored into all cost calculations below.
                </p>
            </div>
            
            <div class="recommendation-grid">
                <div class="recommendation-card">
                    <h3>🎯 Decision Matrix Results</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">🟦 Vanilla JS</div>
                            <div class="score-value">${vanillaScore}/10</div>
                        </div>
                        <div class="score-divider">VS</div>
                        <div class="score-item">
                            <div class="score-label">🟪 .NET + SPA</div>
                            <div class="score-value">${dotnetScore}/10</div>
                        </div>
                    </div>
                    <p class="result-note">Based on ${criteria.length} criteria weighted by your priorities</p>
                </div>
                
                <div class="recommendation-card">
                    <h3>💰 Base TCO (Year 1, No AI)</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">🟦 Vanilla JS</div>
                            <div class="score-value">${formatNumber(vanillaYear1Total)}K KWD</div>
                        </div>
                        <div class="score-divider">VS</div>
                        <div class="score-item">
                            <div class="score-label">🟪 .NET + SPA</div>
                            <div class="score-value">${formatNumber(dotnetYear1Total)}K KWD</div>
                        </div>
                    </div>
                    <p class="result-note"><strong>${tcoCheaper}</strong> is ${formatNumber(tcoDifference)}K KWD cheaper (${((tcoDifference / Math.max(vanillaYear1Total, dotnetYear1Total)) * 100).toFixed(0)}% savings)</p>
                </div>
                
                <div class="recommendation-card">
                    <h3>🤖 Cursor AI Performance</h3>
                    <div class="score-comparison">
                        <div class="score-item">
                            <div class="score-label">🟦 Vanilla JS</div>
                            <div class="score-value">${cursorVanillaAvg}/10</div>
                        </div>
                        <div class="score-divider">VS</div>
                        <div class="score-item">
                            <div class="score-label">🟪 .NET + SPA</div>
                            <div class="score-value">${cursorDotnetAvg}/10</div>
                        </div>
                    </div>
                    <p class="result-note">${(cursorProductivityDiff * 100).toFixed(1)}% AI performance advantage translates to productivity gains</p>
                </div>
            </div>
            
            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid var(--color-success);">
                <h3>⚡ Cursor AI Cost Impact Analysis</h3>
                <p style="font-size: 1.1rem; margin-bottom: var(--spacing-lg);">
                    Since your ${tcoInputs.teamSize} developers will use Cursor AI regardless of tech stack choice, the AI's superior performance with Vanilla JS translates directly to cost savings through faster development and fewer AI requests.
                </p>
                <div class="recommendation-grid">
                    <div>
                        <h4 style="color: var(--color-success);">🟦 Vanilla JS + Cursor AI</h4>
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Base Development Cost:</span>
                                <strong>${formatNumber(vanillaYear1Total)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); color: var(--color-success);">
                                <span>Cursor AI Boost (${(cursorProductivityDiff * 60).toFixed(1)}%):</span>
                                <strong>-${formatNumber(vanillaDevSavings)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Cursor Subscription (${tcoInputs.teamSize} devs):</span>
                                <strong>+${cursorAnnualCost.toFixed(2)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Request Overhead (${vanillaTotalRequests.toLocaleString()} req):</span>
                                <strong>+${formatNumber(vanillaRequestCost)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-sm); border-top: 2px solid var(--color-success); font-size: 1.2rem;">
                                <span><strong>Total Cost:</strong></span>
                                <strong style="color: var(--color-success);">${formatNumber(vanillaWithCursor)}K KWD</strong>
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                            <strong>Estimated ERP tasks:</strong> ${vanillaTasksPerYear} tasks × ${vanillaRequestsPerTask} requests/task
                        </p>
                    </div>
                    <div>
                        <h4 style="color: var(--color-text-secondary);">🟪 .NET + SPA + Cursor AI</h4>
                        <div style="background: rgba(139, 92, 246, 0.05); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-border);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Base Development Cost:</span>
                                <strong>${formatNumber(dotnetYear1Total)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); color: var(--color-success);">
                                <span>Cursor AI Boost (${(cursorProductivityDiff * 20).toFixed(1)}%):</span>
                                <strong>-${formatNumber(dotnetDevSavings)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Cursor Subscription (${tcoInputs.teamSize} devs):</span>
                                <strong>+${cursorAnnualCost.toFixed(2)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                                <span>Request Overhead (${dotnetTotalRequests.toLocaleString()} req):</span>
                                <strong>+${formatNumber(dotnetRequestCost)}K KWD</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-sm); border-top: 2px solid var(--color-border); font-size: 1.2rem;">
                                <span><strong>Total Cost:</strong></span>
                                <strong>${formatNumber(dotnetWithCursor)}K KWD</strong>
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                            <strong>Estimated ERP tasks:</strong> ${dotnetTasksPerYear} tasks × ${dotnetRequestsPerTask} requests/task
                        </p>
                    </div>
                </div>
                <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.15); border-radius: var(--border-radius); text-align: center; border: 2px solid var(--color-success);">
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-sm);">💰 Total Savings with Cursor AI</h4>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--color-success); margin: 0;">
                        ${formatNumber(totalSavings)}K KWD
                    </p>
                    <p style="margin-top: var(--spacing-sm); color: var(--color-text-secondary);">
                        (${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% cheaper with Vanilla JS + Cursor AI)
                    </p>
                    <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        This equals <strong style="color: var(--color-success);">${(totalSavings / tcoInputs.blendedRate).toFixed(1)} developer-months</strong> of additional capacity or budget savings.
                    </p>
                    <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        <strong>Cursor request reduction:</strong> ${(dotnetTotalRequests - vanillaTotalRequests).toLocaleString()} fewer requests with Vanilla JS (${(((dotnetTotalRequests - vanillaTotalRequests) / dotnetTotalRequests) * 100).toFixed(0)}% less)
                    </p>
                </div>
            </div>
            
            <div class="card highlight-card final-recommendation">
                <h3>🏆 Final Recommendation</h3>
                
                <div class="recommendation-winner">
                    <div class="winner-badge ${overallWinner.includes('Vanilla') ? 'vanilla-winner' : 'dotnet-winner'}">
                        ${overallWinner.includes('Vanilla') ? '🟦' : '🟪'} ${overallWinner}
                    </div>
                    <div class="confidence-indicator">
                        <span class="confidence-label">Confidence Level:</span>
                        <span class="confidence-badge confidence-${confidenceLevel.toLowerCase()}">${confidenceLevel} (${confidence}%)</span>
                    </div>
                </div>
                
                <div class="key-factors">
                    <h4>📌 Key Decision Factors:</h4>
                    <ul>
                        ${keyFactors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
                </div>
            </div>
            
            <div class="recommendation-grid">
                <div class="recommendation-card scenario-card">
                    <h4>✅ Choose Vanilla JS if:</h4>
                    <ul>
                        <li>Your team will use Cursor AI and you want maximum productivity (${(cursorProductivityDiff * 60).toFixed(1)}% boost vs ${(cursorProductivityDiff * 20).toFixed(1)}%)</li>
                        <li>You want to minimize Cursor AI requests (${vanillaTotalRequests.toLocaleString()} vs ${dotnetTotalRequests.toLocaleString()} requests/year)</li>
                        <li>Your team size is small to medium (${tcoInputs.teamSize} developers with AI assistance)</li>
                        <li>Time to market is critical (${vanillaBuildWithCursor.toFixed(1)} months vs ${dotnetBuildWithCursor.toFixed(1)} months with Cursor)</li>
                        <li>Total cost savings matter (${formatNumber(totalSavings)}K KWD / ${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% cheaper)</li>
                        <li>You want AI to generate cleaner, more predictable code</li>
                        <li>Your team has strong JavaScript fundamentals</li>
                        <li>You prioritize performance and simplicity</li>
                    </ul>
                </div>
                
                <div class="recommendation-card scenario-card">
                    <h4>✅ Choose .NET + SPA if:</h4>
                    <ul>
                        <li>Additional cost (${formatNumber(totalSavings)}K KWD / ${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%) is acceptable</li>
                        <li>Higher Cursor AI request volume (${dotnetTotalRequests.toLocaleString()} req/year) is not a concern</li>
                        <li>Your team is large or rapidly growing (6+ developers)</li>
                        <li>Enterprise features and conventions are required</li>
                        <li>Type safety and compile-time checking are priorities</li>
                        <li>You need extensive UI component libraries</li>
                        <li>Team has existing .NET expertise</li>
                        <li>Corporate standards mandate framework usage</li>
                    </ul>
                </div>
            </div>
            
            <div class="card">
                <h3>⚠️ Critical Considerations</h3>
                
                <div class="considerations-grid">
                    <div>
                        <h4>Risk Factors - Vanilla JS:</h4>
                        <ul>
                            <li><strong>Architectural Discipline:</strong> Requires strong technical leadership to maintain consistency</li>
                            <li><strong>Team Knowledge:</strong> May need training on custom patterns and architecture</li>
                            <li><strong>Scalability Planning:</strong> Need clear conventions as team/codebase grows</li>
                            <li><strong>Security Vigilance:</strong> Manual XSS/CSRF protection requires expertise</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Risk Factors - .NET + SPA:</h4>
                        <ul>
                            <li><strong>Initial Complexity:</strong> Longer setup time (${(tcoInputs.setupMonths).toFixed(1)} months full setup)</li>
                            <li><strong>Framework Churn:</strong> Version upgrades can be disruptive</li>
                            <li><strong>Learning Curve:</strong> Steeper onboarding (${dotnetBuildMonths.toFixed(1)} months build time)</li>
                            <li><strong>Build Overhead:</strong> Slower iteration with compilation step</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="card highlight-card">
                <h3>💡 Next Steps</h3>
                <ol class="next-steps-list">
                    <li>
                        <strong>Validate Cursor AI Impact</strong> - The ${formatNumber(totalSavings)}K KWD savings includes ${cursorAnnualCost.toFixed(2)}K KWD subscription + estimated ${vanillaTotalRequests.toLocaleString()} vs ${dotnetTotalRequests.toLocaleString()} requests. Run a 2-week prototype to verify request volumes.
                    </li>
                    <li>
                        <strong>Review the Decision Matrix</strong> - Ensure your criteria weights accurately reflect your priorities
                    </li>
                    <li>
                        <strong>Validate TCO Assumptions</strong> - Adjust team size (${tcoInputs.teamSize}), salaries (${tcoInputs.blendedRate} KWD), and velocity multipliers
                    </li>
                    <li>
                        <strong>Assess Team AI Readiness</strong> - Confirm your ${tcoInputs.teamSize} developers are comfortable with AI-assisted development workflows
                    </li>
                    <li>
                        <strong>Track Cursor Usage</strong> - Monitor actual Cursor AI requests during prototype to validate ERP task estimates (${vanillaTasksPerYear} tasks/year)
                    </li>
                    <li>
                        <strong>Run a Proof of Concept</strong> - Build a small ERP module with Vanilla JS + Cursor AI to validate the ${vanillaBuildWithCursor.toFixed(1)}-month timeline and request efficiency
                    </li>
                    <li>
                        <strong>Get Leadership Buy-in</strong> - Present this data-driven analysis emphasizing the ${formatNumber(totalSavings)}K KWD (${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}%) cost advantage including Cursor AI costs
                    </li>
                </ol>
            </div>
            
            <div class="card" style="background: rgba(99, 102, 241, 0.05);">
                <h4>📈 Your Configuration Summary (with Cursor AI):</h4>
                <div class="config-summary">
                    <div class="config-item">
                        <span class="config-label">Team Size:</span>
                        <span class="config-value">${tcoInputs.teamSize} developers</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Monthly Salary:</span>
                        <span class="config-value">${tcoInputs.blendedRate} KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Cursor Subscription:</span>
                        <span class="config-value">${cursorAnnualCost.toFixed(2)}K KWD/year</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Vanilla JS Build (with AI):</span>
                        <span class="config-value">${vanillaBuildWithCursor.toFixed(1)} months</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">.NET Build (with AI):</span>
                        <span class="config-value">${dotnetBuildWithCursor.toFixed(1)} months</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Vanilla Cursor Requests:</span>
                        <span class="config-value" style="color: var(--color-success);">${vanillaTotalRequests.toLocaleString()}/year</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">.NET Cursor Requests:</span>
                        <span class="config-value">${dotnetTotalRequests.toLocaleString()}/year</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Vanilla Total Cost:</span>
                        <span class="config-value" style="color: var(--color-success);">${formatNumber(vanillaWithCursor)}K KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">.NET Total Cost:</span>
                        <span class="config-value">${formatNumber(dotnetWithCursor)}K KWD</span>
                    </div>
                    <div class="config-item">
                        <span class="config-label">Total Savings:</span>
                        <span class="config-value" style="color: var(--color-success); font-size: 1.3rem;">${formatNumber(totalSavings)}K KWD</span>
                    </div>
                </div>
                <p style="margin-top: var(--spacing-md); font-style: italic; color: var(--color-text-muted);">
                    💡 Tip: You can adjust these values in the TCO Model. Cursor AI costs include ${cursorAnnualCost.toFixed(2)}K KWD subscription + request overhead. Vanilla JS productivity boost (${(cursorProductivityDiff * 60).toFixed(1)}%) is based on the ${(cursorVanillaAvg - cursorDotnetAvg).toFixed(1)}-point AI performance advantage. Both stacks benefit from Cursor, but Vanilla JS benefits more.
                </p>
            </div>
            
            <div class="card highlight-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid var(--color-highlight-a);">
                <h3>🎯 Why Cursor AI Performs Better with Vanilla JS</h3>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem; margin-top: var(--spacing-lg);">1. Simpler, More Predictable Code (Score: 8.9/10 vs 7.5/10)</h4>
                    
                    <div class="recommendation-grid">
                        <div>
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">🟦 Vanilla JS: Cursor generates clean, straightforward JavaScript</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Direct DOM manipulation
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Standard Web APIs
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    No framework-specific syntax
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Code works immediately
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">🟪 .NET + SPA: Cursor struggles with:</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Framework-specific patterns (Angular decorators, React hooks)
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Complex type definitions
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Build configuration
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Component lifecycle quirks
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">2. Fewer Iterations Needed</h4>
                    <p style="margin-bottom: var(--spacing-lg);">Based on your ERP estimates:</p>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">🟦 Vanilla JS: ${vanillaRequestsPerTask} requests/task</h5>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">Tree grid, form, validation</p>
                            <ol style="padding-left: var(--spacing-lg); margin: 0;">
                                <li style="margin-bottom: var(--spacing-sm);">First request: Generate working code</li>
                                <li style="margin-bottom: var(--spacing-sm);">2nd-10th: Refine business logic</li>
                                <li style="margin-bottom: var(--spacing-sm);">11th-30th: Polish and optimize</li>
                            </ol>
                        </div>
                        <div style="background: rgba(248, 113, 113, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border: 1px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">🟪 .NET + SPA: ${dotnetRequestsPerTask} requests/task (almost 2x more!)</h5>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">Why? With .NET + SPA:</p>
                            <ol style="padding-left: var(--spacing-lg); margin: 0;">
                                <li style="margin-bottom: var(--spacing-sm);">First request: Generate component</li>
                                <li style="margin-bottom: var(--spacing-sm);">2nd-5th: Fix TypeScript errors</li>
                                <li style="margin-bottom: var(--spacing-sm);">6th-10th: Fix state management issues</li>
                                <li style="margin-bottom: var(--spacing-sm);">11th-15th: Fix build errors</li>
                                <li style="margin-bottom: var(--spacing-sm);">16th-20th: Integrate with UI library (AG-Grid, etc.)</li>
                                <li style="margin-bottom: var(--spacing-sm);"><strong>21st+: Actually implement business logic!</strong></li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">3. Better Context Understanding</h4>
                    
                    <div class="recommendation-grid">
                        <div>
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Cursor AI excels at:</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Standard JavaScript patterns
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    DOM manipulation
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Vanilla event handling
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-success);">✅</span>
                                    Pure functions
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-md);">Cursor AI struggles with:</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Framework-specific magic
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Complex build tooling
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Type gymnastics
                                </li>
                                <li style="padding: var(--spacing-sm) 0; padding-left: var(--spacing-lg); position: relative;">
                                    <span style="position: absolute; left: 0; color: var(--color-danger);">❌</span>
                                    Component library APIs
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">4. Real-World Example: Tree Grid for Accounting</h4>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.05); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 2px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">🟦 With Vanilla JS + Cursor:</h5>
                            <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); line-height: 1.8;">
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Create a tree grid for accounting chart of accounts"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ Generates working HTML structure + JS logic
                                </div>
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Add expand/collapse functionality"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ Adds event listeners and animations
                                </div>
                                <div style="margin-bottom: var(--spacing-md);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Add drag-drop to reorder"<br>
                                    <strong style="color: var(--color-success);">Cursor:</strong> ✅ Implements drag-drop API
                                </div>
                                <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                                    <strong style="color: var(--color-success);">Total: ~15-20 requests</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(248, 113, 113, 0.05); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 2px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-lg);">🟪 With Angular/React + Cursor:</h5>
                            <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); line-height: 1.8;">
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Create a tree grid for accounting chart of accounts"<br>
                                    <strong style="color: var(--color-text-secondary);">Cursor:</strong> Suggests AG-Grid or custom component
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Use AG-Grid"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> Generates code with type errors
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Fix the type errors"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> Fixes some, creates new errors
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "The component won't render"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> Suggests state changes
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Data binding not working"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> Modifies props/state
                                </div>
                                <div style="margin-bottom: var(--spacing-sm);">
                                    <strong style="color: var(--color-accent);">You:</strong> "Build failing"<br>
                                    <strong style="color: var(--color-danger);">Cursor:</strong> Suggests build config changes
                                </div>
                                <div style="margin-bottom: var(--spacing-lg); color: var(--color-text-muted); font-style: italic;">
                                    ... 30+ more iterations ...
                                </div>
                                <div style="padding: var(--spacing-md); background: rgba(248, 113, 113, 0.2); border-radius: var(--border-radius);">
                                    <strong style="color: var(--color-danger);">Total: ~40-60 requests</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="vanilla-guide-section">
                    <h4 class="guide-section-title" style="color: var(--color-accent); font-size: 1.3rem;">5. Your Development Experience</h4>
                    
                    <div class="recommendation-grid">
                        <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 1px solid var(--color-success);">
                            <h5 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">With Vanilla JS:</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">💚</span>
                                    Cursor <strong>impresses you</strong> with instant, working code
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">💚</span>
                                    You spend time on <strong>business logic</strong>, not framework debugging
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">💚</span>
                                    You feel <strong>productive</strong> and in control
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">💚</span>
                                    You can <strong>understand and modify</strong> everything Cursor generates
                                </li>
                            </ul>
                        </div>
                        
                        <div style="background: rgba(248, 113, 113, 0.1); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 1px solid var(--color-danger);">
                            <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-lg);">With .NET + SPA:</h5>
                            <ul style="list-style: none; padding-left: 0;">
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">😓</span>
                                    Cursor generates code that "should work" but doesn't
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">😓</span>
                                    You spend hours debugging <strong>framework issues</strong>
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">😓</span>
                                    You feel like you're <strong>fighting the framework</strong>
                                </li>
                                <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                                    <span style="position: absolute; left: 0; font-size: 1.5rem;">😓</span>
                                    You waste time on build errors, type errors, configuration
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%); border-radius: var(--border-radius); border: 3px solid var(--color-success);">
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-lg); font-size: 1.5rem;">📊 For Your Complex ERP:</h4>
                    <ul style="list-style: none; padding-left: 0; font-size: 1.1rem;">
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>${vanillaTotalRequests.toLocaleString()} Cursor requests</strong> (Vanilla) vs <strong>${dotnetTotalRequests.toLocaleString()} requests</strong> (.NET)
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>3x fewer iterations</strong> to get working code
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>More impressive results</strong> with less frustration
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-weight: 700;">→</span>
                            <strong>Faster delivery</strong> of features
                        </li>
                    </ul>
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border-radius: var(--border-radius); border: 3px solid var(--color-highlight-a); text-align: center;">
                    <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 2rem;">🎯 Bottom Line</h3>
                    <p style="font-size: 1.3rem; margin-bottom: var(--spacing-xl); line-height: 1.6;">
                        <strong>Yes, Cursor will impress you MUCH MORE with Vanilla JS because:</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); text-align: left;">
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            Code works on first try more often
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            Fewer back-and-forth iterations
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            Faster feature completion
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            Less debugging frustration
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            More time on business logic (accounting, inventory, HR)
                        </div>
                        <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-radius: var(--border-radius);">
                            <div style="font-size: 1.5rem; margin-bottom: var(--spacing-sm);">✅</div>
                            You'll feel like a productivity superhero 🚀
                        </div>
                    </div>
                    <p style="font-size: 1.4rem; margin-top: var(--spacing-2xl); font-weight: 700; color: var(--color-success);">
                        For your complex ERP with tree grids, accounting, inventory, and HR,<br>
                        <span style="font-size: 1.6rem;">Vanilla JS + Cursor AI will be a game-changer! 💪</span>
                    </p>
                </div>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border: 3px solid var(--color-warning); margin-top: var(--spacing-2xl);">
                <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-lg); font-size: 1.5rem;">⚠️ Critical Success Factor</h3>
                <div style="padding: var(--spacing-lg); background: rgba(251, 191, 36, 0.15); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning);">
                    <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        <strong style="color: var(--color-warning);">IMPORTANT:</strong> The success of Vanilla JS + Cursor AI <strong>strongly depends</strong> on your developers having a <strong>solid JavaScript background</strong>.
                    </p>
                    
                    <div style="margin-top: var(--spacing-xl);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-md);">Your Team MUST Have:</h4>
                        <ul style="padding-left: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Deep understanding of JavaScript fundamentals</strong> (closures, prototypes, async patterns, ES6+)
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Ability to review and validate Cursor's code</strong> - not just blindly accepting AI suggestions
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Experience with DOM APIs</strong> and browser standards (not just framework knowledge)
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Capability to architect scalable solutions</strong> without framework guardrails
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Skills to debug and optimize</strong> performance issues at the browser level
                            </li>
                            <li style="margin-bottom: var(--spacing-md); line-height: 1.6;">
                                <strong>Security awareness</strong> to implement XSS/CSRF protection manually
                            </li>
                        </ul>
                    </div>
                    
                    <div style="padding: var(--spacing-xl); background: rgba(248, 113, 113, 0.15); border-radius: var(--border-radius); border: 2px solid var(--color-danger); margin-top: var(--spacing-xl);">
                        <h4 style="color: var(--color-danger); margin-bottom: var(--spacing-md); font-size: 1.2rem;">🚨 Without Strong JavaScript Skills:</h4>
                        <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                            If your developers <strong>don't have solid JavaScript fundamentals</strong> or can't properly <strong>guide and monitor Cursor AI</strong>, then:
                        </p>
                        <p style="font-size: 1.3rem; font-weight: 700; color: var(--color-danger); text-align: center; padding: var(--spacing-lg); background: rgba(248, 113, 113, 0.2); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            ⚠️ Framework tools (.NET + SPA) will be the BETTER choice!
                        </p>
                        <p style="margin-top: var(--spacing-lg); line-height: 1.8; color: var(--color-text-muted);">
                            Frameworks provide guardrails, conventions, and structure that help less-experienced developers produce consistent code. The framework's opinionated architecture reduces the need for deep JavaScript expertise.
                        </p>
                    </div>
                    
                    <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: rgba(99, 102, 241, 0.1); border-radius: var(--border-radius); border-left: 4px solid var(--color-accent);">
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">💡 Assessment Question:</h4>
                        <p style="line-height: 1.8; margin-bottom: var(--spacing-md);">
                            Can your ${tcoInputs.teamSize} developers confidently:
                        </p>
                        <ul style="padding-left: var(--spacing-xl);">
                            <li style="margin-bottom: var(--spacing-sm);">Explain the JavaScript event loop and async behavior?</li>
                            <li style="margin-bottom: var(--spacing-sm);">Implement efficient DOM manipulation without jQuery?</li>
                            <li style="margin-bottom: var(--spacing-sm);">Debug memory leaks and performance bottlenecks?</li>
                            <li style="margin-bottom: var(--spacing-sm);">Review Cursor's suggestions for security vulnerabilities?</li>
                            <li style="margin-bottom: var(--spacing-sm);">Design clean architecture patterns without framework help?</li>
                        </ul>
                        <p style="margin-top: var(--spacing-lg); font-weight: 600; color: var(--color-accent);">
                            ✅ If YES → Vanilla JS + Cursor AI = Massive productivity gains<br>
                            ❌ If NO → .NET + SPA = Safer, more structured approach
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 3px solid var(--color-highlight-a); margin-top: var(--spacing-2xl);">
                <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 1.6rem; text-align: center;">🎯 Final Decision Framework: Based on Your Development Approach</h3>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-xl); margin-top: var(--spacing-xl);">
                    
                    <!-- Scenario 1: Full Cursor AI Dependence -->
                    <div style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-success); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🤖</div>
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            Full AI-Assisted Development
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">Your Approach:</p>
                            <p style="line-height: 1.8;">
                                Developers will <strong style="color: var(--color-success);">completely depend on Cursor AI</strong> for generating most of the code
                            </p>
                        </div>
                        
                        <div style="background: rgba(52, 211, 153, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-success); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                Choose Vanilla JS
                            </h5>
                            <div style="text-align: left; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-success);">Why:</p>
                                <ul style="padding-left: var(--spacing-lg); line-height: 1.8;">
                                    <li style="margin-bottom: var(--spacing-sm);">Cursor generates <strong>clean, working code</strong> immediately</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>45,000 requests/year</strong> vs 132,000 with .NET</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Minimal manual fixes needed</li>
                                    <li style="margin-bottom: var(--spacing-sm);">No framework configuration overhead</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>Maximum AI productivity</strong></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>Result:</strong> Fastest development, lowest cost, highest AI efficiency
                            </p>
                        </div>
                    </div>
                    
                    <!-- Scenario 2: Manual Coding (No AI) -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-highlight-b); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">👨‍💻</div>
                        <h4 style="color: var(--color-highlight-b); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            Manual Coding (No Cursor AI)
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">Your Approach:</p>
                            <p style="line-height: 1.8;">
                                Developers will <strong style="color: var(--color-highlight-b);">NOT use Cursor AI</strong> and write all code manually
                            </p>
                        </div>
                        
                        <div style="background: rgba(139, 92, 246, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-highlight-b); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                Choose .NET + SPA
                            </h5>
                            <div style="text-align: left; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-highlight-b);">Why:</p>
                                <ul style="padding-left: var(--spacing-lg); line-height: 1.8;">
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>Framework guardrails</strong> guide development</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Built-in patterns and conventions</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Rich IDE support (IntelliSense, refactoring)</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Extensive component libraries</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>Structure without AI help</strong></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(139, 92, 246, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>Result:</strong> Slower development, but frameworks provide needed structure
                            </p>
                        </div>
                    </div>
                    
                    <!-- Scenario 3: Hybrid Approach -->
                    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%); padding: var(--spacing-xl); border-radius: var(--border-radius); border: 3px solid var(--color-warning); text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🔀</div>
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-lg); font-size: 1.3rem; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                            Hybrid Approach (Mix AI + Manual)
                        </h4>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg);">
                            <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">Your Approach:</p>
                            <p style="line-height: 1.8;">
                                Developers will use <strong style="color: var(--color-warning);">Cursor AI + Manual coding</strong> (50/50 or similar mix)
                            </p>
                        </div>
                        
                        <div style="background: rgba(139, 92, 246, 0.3); padding: var(--spacing-xl); border-radius: var(--border-radius); margin-top: var(--spacing-lg);">
                            <div style="font-size: 2.5rem; margin-bottom: var(--spacing-md);">✅</div>
                            <h5 style="color: var(--color-highlight-b); font-size: 1.4rem; margin-bottom: var(--spacing-md); font-weight: 700;">
                                Choose .NET + SPA
                            </h5>
                            <div style="text-align: left; margin-top: var(--spacing-lg);">
                                <p style="font-weight: 600; margin-bottom: var(--spacing-md); color: var(--color-warning); font-size: 1.1rem;">Why Framework is Better for Hybrid:</p>
                                <ul style="padding-left: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-lg);">
                                    <li style="margin-bottom: var(--spacing-sm);">Framework <strong>enforces consistency</strong> between AI-generated and manually-written code</li>
                                    <li style="margin-bottom: var(--spacing-sm);"><strong>TypeScript catches integration issues</strong> when mixing AI/manual code</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Component boundaries stay clear regardless of who (AI or human) wrote them</li>
                                    <li style="margin-bottom: var(--spacing-sm);">Refactoring mixed code is <strong>safer with IDE support</strong></li>
                                    <li style="margin-bottom: var(--spacing-sm);">Code reviews easier (same patterns throughout)</li>
                                </ul>
                                
                                <p style="padding: var(--spacing-md); background: rgba(251, 191, 36, 0.2); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning); font-size: var(--font-size-sm); line-height: 1.6;">
                                    <strong>⚠️ Reality Check:</strong> Mixing AI and manual code without framework guardrails leads to inconsistent patterns, architectural drift, and harder maintenance - even with strong JavaScript developers.
                                </p>
                            </div>
                        </div>
                        
                        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: rgba(139, 92, 246, 0.2); border-radius: var(--border-radius);">
                            <p style="font-size: var(--font-size-sm); line-height: 1.6; color: var(--color-text-secondary);">
                                <strong>Exception:</strong> Only consider Vanilla JS if you have a very senior architect (10+ years) + documented patterns + 2-3 developers max + strict code reviews
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-2xl); background: rgba(99, 102, 241, 0.2); border-radius: var(--border-radius); border: 2px solid var(--color-highlight-a); text-align: center;">
                    <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-xl); font-size: 1.4rem;">📋 Quick Decision Matrix</h4>
                    
                    <div style="display: grid; grid-template-columns: auto 1fr 1fr; gap: var(--spacing-sm); max-width: 800px; margin: 0 auto; text-align: left; background: rgba(15, 23, 42, 0.5); padding: var(--spacing-xl); border-radius: var(--border-radius);">
                        <!-- Header Row -->
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border);"></div>
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border); text-align: center; color: var(--color-success);">✅ Choose Vanilla JS</div>
                        <div style="padding: var(--spacing-md); font-weight: 700; border-bottom: 2px solid var(--color-border); text-align: center; color: var(--color-highlight-b);">✅ Choose .NET + SPA</div>
                        
                        <!-- Row 1 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">Development Style:</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">100% Cursor AI</div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">Manual Only<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(or 50/50 Hybrid)</span></div>
                        
                        <!-- Row 2 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">Best For:</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">Full AI delegation<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(with strong JS oversight)</span></div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">Manual coding<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(or AI+Manual mix)</span></div>
                        
                        <!-- Row 3 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">Cursor Requests:</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);">45,000/year<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(3x less than .NET)</span></div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);">132,000/year or N/A<br><span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">(if not using Cursor)</span></div>
                        
                        <!-- Row 4 -->
                        <div style="padding: var(--spacing-md); font-weight: 600;">Total Cost:</div>
                        <div style="padding: var(--spacing-md); background: rgba(52, 211, 153, 0.1); text-align: center; border-radius: var(--border-radius-sm);"><strong>${formatNumber(vanillaWithCursor)}K KWD</strong><br><span style="font-size: var(--font-size-sm); color: var(--color-success);">(${((totalSavings / dotnetWithCursor) * 100).toFixed(0)}% cheaper)</span></div>
                        <div style="padding: var(--spacing-md); background: rgba(139, 92, 246, 0.1); text-align: center; border-radius: var(--border-radius-sm);"><strong>${formatNumber(dotnetWithCursor)}K KWD</strong></div>
                    </div>
                    
                    <div style="margin-top: var(--spacing-2xl); padding: var(--spacing-xl); background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%); border-radius: var(--border-radius); border: 2px solid var(--color-accent);">
                        <p style="font-size: 1.3rem; font-weight: 700; margin-bottom: var(--spacing-lg); color: var(--color-accent);">
                            💡 The Bottom Line:
                        </p>
                        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--color-success);">Vanilla JS wins</strong> when you're going <strong>all-in on AI-assisted development</strong> with strong JavaScript developers who can guide and validate Cursor's output.
                        </p>
                        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <strong style="color: var(--color-highlight-b);">.NET + SPA wins</strong> when you're doing <strong>manual development or hybrid approaches</strong> (50/50 AI+manual), where framework guardrails prevent architectural drift.
                        </p>
                        <p style="font-size: var(--font-size-base); line-height: 1.8; margin-top: var(--spacing-lg); padding: var(--spacing-lg); background: rgba(251, 191, 36, 0.2); border-radius: var(--border-radius); border-left: 4px solid var(--color-warning); color: var(--color-text-secondary);">
                            <strong style="color: var(--color-warning);">⚠️ Honest Reality:</strong> Mixing AI and manual code (50/50 hybrid) works better with frameworks in most teams. Only go Vanilla in hybrid if you have an exceptional senior architect + small team + documented patterns + strict review process.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRealWorldExamples(container) {
        container.innerHTML = `
            <div class="card">
                <h2>🔍 Reality Check: Vanilla JS in Production ERP Systems</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                    Most famous, large-scale ERP systems (like SAP, Oracle, Microsoft Dynamics, Odoo) <strong>don't use pure Vanilla JS</strong>. However, there are compelling real-world examples and a growing trend.
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-xl); margin-top: var(--spacing-xl);">
                <!-- Major Enterprise ERPs -->
                <div class="card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%); border: 2px solid var(--color-highlight-b);">
                    <h3 style="color: var(--color-highlight-b); margin-bottom: var(--spacing-lg);">🏢 Major Enterprise ERPs</h3>
                    <div style="background: rgba(15, 23, 42, 0.5); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-md);">
                        <h4 style="color: var(--color-text-primary); margin-bottom: var(--spacing-md);">What They Use:</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                                <strong>SAP:</strong> SAPUI5 (their own framework)
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
                        <strong>Why:</strong> Built before vanilla JS was powerful enough, large teams need structure, risk aversion in enterprise
                    </p>
                </div>
                
                <!-- Real Vanilla JS ERPs -->
                <div class="card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid var(--color-success);">
                    <h3 style="color: var(--color-success); margin-bottom: var(--spacing-lg);">✅ Actual Vanilla JS ERP Systems</h3>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-lg); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">1. VSL ERP (VanillaStackLabs)</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <li>Built with <strong>Django + HTMX</strong></li>
                            <li>Uses <strong>minimal JavaScript</strong> (mostly vanilla)</li>
                            <li>Focus on server-side rendering</li>
                            <li>Progressive enhancement approach</li>
                            <li>For <strong>in-house business operations</strong></li>
                        </ul>
                        <a href="https://vanillastacklabs.com/work/vsl-erp/" target="_blank" style="color: var(--color-accent); font-size: var(--font-size-sm);">
                            View Case Study →
                        </a>
                    </div>
                    
                    <div style="background: rgba(52, 211, 153, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); border-left: 4px solid var(--color-success);">
                        <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">2. inoERP (Open Source)</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8; margin-bottom: var(--spacing-md);">
                            <li>Open-source ERP system</li>
                            <li><strong>Vanilla JavaScript APIs</strong> for customization</li>
                            <li>Lightweight client-side JavaScript</li>
                            <li>Multi-platform support (Web, iOS, Android)</li>
                            <li>REST API-driven architecture</li>
                        </ul>
                        <a href="https://sourceforge.net/projects/inoerp/" target="_blank" style="color: var(--color-accent); font-size: var(--font-size-sm);">
                            View on SourceForge →
                        </a>
                    </div>
                </div>
                
                <!-- Companies That Switched -->
                <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid var(--color-highlight-a);">
                    <h3 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-lg);">🚀 Major Companies Using Vanilla JS</h3>
                    <p style="margin-bottom: var(--spacing-lg); line-height: 1.6;">
                        Not ERPs, but major tech companies that <strong>switched TO vanilla JS</strong> for performance:
                    </p>
                    
                    <div style="background: rgba(99, 102, 241, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius); margin-bottom: var(--spacing-md);">
                        <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-sm);">🎬 Netflix</h4>
                        <p style="line-height: 1.6; margin-bottom: var(--spacing-sm);">
                            Switched to <strong>vanilla JavaScript for client-side</strong> code (kept React for server-side)
                        </p>
                        <p style="color: var(--color-success); font-weight: 600;">
                            Result: Significant performance improvements
                        </p>
                    </div>
                    
                    <div style="background: rgba(99, 102, 241, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-highlight-a); margin-bottom: var(--spacing-sm);">💻 GitHub</h4>
                        <p style="line-height: 1.6; margin-bottom: var(--spacing-sm);">
                            Removed jQuery in late 2018, switched to <strong>vanilla JS + web components</strong>
                        </p>
                        <p style="color: var(--color-success); font-weight: 600;">
                            Result: Faster, more maintainable codebase
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card highlight-card" style="margin-top: var(--spacing-2xl); background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%); border: 2px solid var(--color-warning);">
                <h3 style="color: var(--color-warning); margin-bottom: var(--spacing-lg);">🤔 Why So Few Vanilla JS ERPs?</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); margin-top: var(--spacing-lg);">
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">🕰️ Historical Reasons</h4>
                        <p style="line-height: 1.6;">
                            Built 5-10 years ago when vanilla JS lacked modern APIs (fetch, modules, web components)
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">👥 Large Teams</h4>
                        <p style="line-height: 1.6;">
                            Frameworks provide structure for 50+ developers working on same codebase
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">🛡️ Risk Aversion</h4>
                        <p style="line-height: 1.6;">
                            Enterprise companies prefer "proven" frameworks with large ecosystems
                        </p>
                    </div>
                    
                    <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: var(--border-radius);">
                        <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-sm);">👨‍💻 Developer Pool</h4>
                        <p style="line-height: 1.6;">
                            More developers know React/Angular than modern vanilla JS patterns
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="card" style="margin-top: var(--spacing-2xl); background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%); border: 3px solid var(--color-success);">
                <h3 style="color: var(--color-success); margin-bottom: var(--spacing-xl); font-size: 1.5rem; text-align: center;">🚀 Your Opportunity: Be an Early Success Story</h3>
                
                <div style="background: rgba(15, 23, 42, 0.5); padding: var(--spacing-2xl); border-radius: var(--border-radius); margin-bottom: var(--spacing-xl);">
                    <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-lg);">
                        Since you're building a <strong>NEW ERP from scratch with Cursor AI</strong>, you have unique advantages:
                    </p>
                    
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--color-border);">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            <strong>No legacy framework baggage</strong> - Start fresh with modern standards
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--color-border);">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            <strong>Modern browser APIs are powerful</strong> - No jQuery or frameworks needed in 2024
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--color-border);">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            <strong>Cursor AI excels at vanilla JS</strong> - 3x fewer AI requests needed vs frameworks
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative; border-bottom: 1px solid var(--color-border);">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            <strong>Cost advantage</strong> - Significantly lower TCO (see TCO Model tab)
                        </li>
                        <li style="padding: var(--spacing-md) 0; padding-left: var(--spacing-xl); position: relative;">
                            <span style="position: absolute; left: 0; color: var(--color-success); font-size: 1.5rem;">✅</span>
                            <strong>You can be a pioneer</strong> - Success story in this emerging space
                        </li>
                    </ul>
                </div>
                
                <div style="text-align: center; padding: var(--spacing-xl); background: rgba(52, 211, 153, 0.2); border-radius: var(--border-radius);">
                    <p style="font-size: 1.3rem; font-weight: 700; color: var(--color-success); margin-bottom: var(--spacing-md);">
                        💡 The Modern Reality (2024)
                    </p>
                    <p style="font-size: 1.1rem; line-height: 1.8; max-width: 800px; margin: 0 auto;">
                        <strong>Vanilla JS + Modern Web APIs</strong> can absolutely build a world-class ERP. While legacy systems won't rewrite (too risky/expensive), <strong>new projects</strong> like yours can leverage this approach for <strong>maximum AI productivity, lowest cost, and complete control</strong>.
                    </p>
                </div>
            </div>
            
            <div class="card" style="margin-top: var(--spacing-2xl); background: rgba(99, 102, 241, 0.05); border: 1px solid var(--color-border);">
                <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">📚 Additional Resources</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                    <div>
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">Vanilla JS Community:</h4>
                        <ul style="padding-left: var(--spacing-lg); line-height: 1.8;">
                            <li><a href="https://vanjs.org/" target="_blank" style="color: var(--color-accent);">VanJS Framework</a> - Lightweight vanilla-based framework</li>
                            <li><a href="https://gomakethings.com/" target="_blank" style="color: var(--color-accent);">Go Make Things</a> - Vanilla JS resources</li>
                            <li><a href="https://youmightnotneedjquery.com/" target="_blank" style="color: var(--color-accent);">You Might Not Need jQuery</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">Modern Web APIs:</h4>
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

    // Initialize app
    function initApp() {
        console.log('initApp called');
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
