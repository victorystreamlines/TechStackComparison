// ========================================
// Simple Pub/Sub Store for State Management
// ========================================
class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Map();
    }

    getState() {
        return this.state;
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify(updates);
    }

    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    notify(updates) {
        // Notify all global listeners
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(callback => callback(this.state));
        }
        
        // Notify specific key listeners
        Object.keys(updates).forEach(key => {
            if (this.listeners.has(key)) {
                this.listeners.get(key).forEach(callback => callback(updates[key]));
            }
        });
    }
}

// ========================================
// Hash-based Router
// ========================================
class Router {
    constructor(defaultRoute = 'intro') {
        this.defaultRoute = defaultRoute;
        this.routes = new Map();
        this.currentRoute = null;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('load', () => this.handleRouteChange());
    }

    register(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || this.defaultRoute;
        
        if (this.currentRoute !== hash) {
            this.currentRoute = hash;
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show current section
            const section = document.querySelector(`[data-tab="${hash}"]`);
            if (section) {
                section.classList.remove('hidden');
                
                // Update active tab
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.tab === hash) {
                        btn.classList.add('active');
                    }
                });
                
                // Call route handler if exists
                if (this.routes.has(hash)) {
                    this.routes.get(hash)();
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

// ========================================
// Global Store Instance
// ========================================
export const store = new Store({
    // Decision Matrix state
    criteria: [
        {
            id: 'time-to-market',
            name: 'Time-to-Market',
            description: 'Speed of initial delivery and iteration velocity',
            weight: 8,
            scores: { vanilla: 9, dotnet: 6 }
        },
        {
            id: 'dev-productivity',
            name: 'Developer Productivity & DX',
            description: 'IDE support, debugging, hot reload, IntelliSense',
            weight: 7,
            scores: { vanilla: 5, dotnet: 9 }
        },
        {
            id: 'maintainability',
            name: 'Maintainability & Reuse',
            description: 'Component patterns, code organization, refactoring ease',
            weight: 9,
            scores: { vanilla: 5, dotnet: 9 }
        },
        {
            id: 'performance',
            name: 'Performance',
            description: 'Load time, interaction responsiveness, large data handling',
            weight: 8,
            scores: { vanilla: 9, dotnet: 7 }
        },
        {
            id: 'operational-complexity',
            name: 'Operational Complexity',
            description: 'Build pipelines, tooling, deployment, DevOps overhead',
            weight: 6,
            scores: { vanilla: 10, dotnet: 5 }
        },
        {
            id: 'security',
            name: 'Security & Compliance',
            description: 'AuthN/AuthZ, RBAC, audit logging, OWASP best practices',
            weight: 10,
            scores: { vanilla: 6, dotnet: 9 }
        },
        {
            id: 'testing',
            name: 'Testing & Quality',
            description: 'Unit testing, integration tests, E2E automation, coverage',
            weight: 8,
            scores: { vanilla: 6, dotnet: 9 }
        },
        {
            id: 'reporting',
            name: 'Reporting/Printing/BI',
            description: 'Export capabilities, print layouts, data visualization',
            weight: 7,
            scores: { vanilla: 7, dotnet: 8 }
        },
        {
            id: 'scalability',
            name: 'Scalability',
            description: 'Team growth, codebase growth, feature expansion',
            weight: 9,
            scores: { vanilla: 5, dotnet: 9 }
        },
        {
            id: 'hiring',
            name: 'Hiring/Market Availability',
            description: 'Talent pool, onboarding time, training requirements',
            weight: 7,
            scores: { vanilla: 7, dotnet: 8 }
        },
        {
            id: 'tco',
            name: 'Total Cost of Ownership',
            description: 'Build, operate, and maintain costs over 3 years',
            weight: 9,
            scores: { vanilla: 8, dotnet: 7 }
        }
    ],
    
    // TCO Model state
    tcoInputs: {
        teamSize: 5,
        blendedRate: 100,
        setupMonths: 2,
        vanillaVelocity: 1.2,
        dotnetVelocity: 1.0,
        year1Maintenance: 20,
        year3Maintenance: 35
    },
    
    // Risk Register state
    risks: [
        {
            id: 'vanilla-1',
            approach: 'Vanilla JS',
            risk: 'Architectural drift without framework guardrails',
            probability: 'High',
            impact: 'High',
            mitigation: 'Establish coding standards, implement code review process, create pattern library',
            owner: 'Tech Lead'
        },
        {
            id: 'vanilla-2',
            approach: 'Vanilla JS',
            risk: 'Code duplication and inconsistent patterns',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Create reusable component kernel, enforce DRY principles',
            owner: 'Development Team'
        },
        {
            id: 'vanilla-3',
            approach: 'Vanilla JS',
            risk: 'Key-person risk (limited team familiarity)',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Cross-training, documentation, pair programming',
            owner: 'Engineering Manager'
        },
        {
            id: 'dotnet-1',
            approach: '.NET + SPA',
            risk: 'Toolchain complexity and learning curve',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Invest in training, establish CI/CD early, document setup',
            owner: 'DevOps Team'
        },
        {
            id: 'dotnet-2',
            approach: '.NET + SPA',
            risk: 'Framework upgrade churn and breaking changes',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Pin versions, gradual upgrades, maintain upgrade runbook',
            owner: 'Tech Lead'
        },
        {
            id: 'dotnet-3',
            approach: '.NET + SPA',
            risk: 'Bundle size bloat impacting performance',
            probability: 'Low',
            impact: 'Medium',
            mitigation: 'Code splitting, lazy loading, bundle analysis in CI',
            owner: 'Frontend Lead'
        }
    ]
});

// ========================================
// Router Instance
// ========================================
export const router = new Router('intro');

// ========================================
// Initialize App
// ========================================
export async function initApp() {
    // Dynamically import components
    const { initTabs } = await import('./components/tabs.js');
    const { renderKPICards } = await import('./components/kpi-cards.js');
    const { initDecisionMatrix } = await import('./components/decision-matrix.js');
    const { initTCOModel } = await import('./components/tco-model.js');
    const { initRiskRegister } = await import('./components/risk-register.js');
    const { renderDeepDive } = await import('./components/table-compare.js');
    const { renderRecommendation } = await import('./components/recommendation.js');
    const { renderHiringContent, renderSecurityContent, renderTestingContent, renderVanillaGuide } = await import('./components/content.js');
    
    // Initialize tabs navigation
    initTabs();
    
    // Register routes
    router.register('criteria', () => {
        const container = document.getElementById('kpi-cards-container');
        if (container && !container.hasChildNodes()) {
            renderKPICards(container);
        }
    });
    
    router.register('deep-dive', () => {
        const container = document.getElementById('deep-dive-content');
        if (container && !container.hasChildNodes()) {
            renderDeepDive(container);
        }
    });
    
    router.register('matrix', () => {
        const container = document.getElementById('decision-matrix-container');
        if (container && !container.hasChildNodes()) {
            initDecisionMatrix(container);
        }
    });
    
    router.register('tco', () => {
        const container = document.getElementById('tco-container');
        if (container && !container.hasChildNodes()) {
            initTCOModel(container);
        }
    });
    
    router.register('risks', () => {
        const container = document.getElementById('risk-register-container');
        if (container && !container.hasChildNodes()) {
            initRiskRegister(container);
        }
    });
    
    router.register('hiring', () => {
        const container = document.getElementById('hiring-content');
        if (container && !container.hasChildNodes()) {
            renderHiringContent(container);
        }
    });
    
    router.register('security', () => {
        const container = document.getElementById('security-content');
        if (container && !container.hasChildNodes()) {
            renderSecurityContent(container);
        }
    });
    
    router.register('testing', () => {
        const container = document.getElementById('testing-content');
        if (container && !container.hasChildNodes()) {
            renderTestingContent(container);
        }
    });
    
    router.register('how-vanilla', () => {
        const container = document.getElementById('vanilla-guide-content');
        if (container && !container.hasChildNodes()) {
            renderVanillaGuide(container);
        }
    });
    
    router.register('recommendation', () => {
        const container = document.getElementById('recommendation-container');
        if (container && !container.hasChildNodes()) {
            renderRecommendation(container);
        }
    });
    
    // Trigger initial route
    router.handleRouteChange();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

