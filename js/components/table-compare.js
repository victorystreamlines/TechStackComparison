// ========================================
// Deep Dive Comparison Component
// ========================================

import { store } from '../app.js';

const comparisons = [
    {
        criterion: 'Time-to-Market',
        vanilla: {
            strengths: [
                'Zero build configuration - start coding immediately',
                'No transpilation delays in development',
                'Minimal dependencies to audit and manage',
                'Rapid prototyping with instant feedback'
            ],
            caveats: [
                'Manual dependency management',
                'May need custom solutions for common patterns',
                'Initial velocity advantage may diminish at scale'
            ],
            practices: [
                'Use ES modules for clean code organization',
                'Implement a simple router and state manager early',
                'Create reusable component templates',
                'Leverage browser DevTools effectively'
            ]
        },
        dotnet: {
            strengths: [
                'Rich CLI tooling (dotnet new, scaffolding)',
                'Hot reload for both frontend and backend',
                'Comprehensive project templates',
                'Strong IDE integration for rapid development'
            ],
            caveats: [
                'Initial setup and learning curve',
                'Build pipeline configuration overhead',
                'Node/npm/NuGet ecosystem management'
            ],
            practices: [
                'Use Angular CLI or Create React App for fast setup',
                'Leverage scaffolding generators',
                'Configure hot module replacement (HMR)',
                'Establish coding standards early'
            ]
        }
    },
    {
        criterion: 'Developer Productivity & DX',
        vanilla: {
            strengths: [
                'Direct browser debugging with source maps',
                'No magic - explicit control over everything',
                'Lightweight development environment',
                'Fast iteration without build steps'
            ],
            caveats: [
                'Limited IntelliSense without TypeScript',
                'Manual type checking prone to runtime errors',
                'Fewer automated refactoring tools',
                'No built-in hot module replacement'
            ],
            practices: [
                'Use JSDoc comments for better IDE support',
                'Implement strict linting rules (ESLint)',
                'Create developer documentation',
                'Use browser extensions for debugging'
            ]
        },
        dotnet: {
            strengths: [
                'TypeScript provides excellent IntelliSense',
                'Comprehensive error detection at compile-time',
                'Advanced refactoring tools in IDEs',
                'Rich debugging experience with source maps',
                'Hot reload and fast refresh'
            ],
            caveats: [
                'Build times can slow iteration',
                'Complex error messages from bundlers',
                'Toolchain complexity (webpack, babel, etc.)'
            ],
            practices: [
                'Enable strict TypeScript mode',
                'Use Angular/React DevTools browser extensions',
                'Configure sourcemaps properly',
                'Implement code snippets and generators'
            ]
        }
    },
    {
        criterion: 'Maintainability & Reuse',
        vanilla: {
            strengths: [
                'No framework lock-in or version constraints',
                'Code is portable and future-proof',
                'Full control over architecture',
                'No dependency upgrade cycles'
            ],
            caveats: [
                'Requires strong architectural discipline',
                'Easy to drift into inconsistent patterns',
                'Component reuse requires manual abstraction',
                'No enforced separation of concerns'
            ],
            practices: [
                'Establish clear component patterns (e.g., Base class)',
                'Document architecture decisions (ADRs)',
                'Create a style guide and enforce it',
                'Use template literals for consistent rendering',
                'Implement code review standards'
            ]
        },
        dotnet: {
            strengths: [
                'Component model enforces encapsulation',
                'Strong conventions and best practices',
                'Rich ecosystem of reusable UI components',
                'Built-in dependency injection',
                'Clear separation of concerns'
            ],
            caveats: [
                'Framework updates may require refactoring',
                'Over-abstraction can reduce clarity',
                'Learning curve for framework patterns',
                'Vendor lock-in concerns'
            ],
            practices: [
                'Follow framework conventions (e.g., Angular style guide)',
                'Create shared component libraries',
                'Use state management patterns (NgRx, Redux)',
                'Implement feature modules for organization',
                'Document component APIs with Storybook'
            ]
        }
    },
    {
        criterion: 'Performance',
        vanilla: {
            strengths: [
                'Minimal payload - no framework overhead',
                'Direct DOM manipulation is very fast',
                'No virtual DOM reconciliation cost',
                'Full control over lazy loading strategy',
                'Excellent Lighthouse scores by default'
            ],
            caveats: [
                'Manual optimization required for large lists',
                'Easy to create memory leaks without cleanup',
                'No automatic change detection optimization'
            ],
            practices: [
                'Implement virtual scrolling for large tables',
                'Use IntersectionObserver for lazy loading',
                'Debounce/throttle event handlers',
                'Clean up event listeners in unmount',
                'Use requestAnimationFrame for animations',
                'Server-side pagination for large datasets'
            ]
        },
        dotnet: {
            strengths: [
                'Virtual DOM optimizes many updates',
                'Framework-level performance optimizations',
                'OnPush change detection (Angular)',
                'React.memo and useMemo for optimization',
                'Built-in code splitting and lazy loading'
            ],
            caveats: [
                'Framework bundle size (50-200KB+ gzipped)',
                'Virtual DOM overhead for simple UIs',
                'Can be over-kill for simple pages',
                'Requires bundler configuration for optimization'
            ],
            practices: [
                'Enable production builds with minification',
                'Use OnPush change detection (Angular)',
                'Implement React.memo for expensive components',
                'Configure route-based code splitting',
                'Analyze bundle size regularly',
                'Use React Profiler or Angular DevTools'
            ]
        }
    },
    {
        criterion: 'Security & Compliance',
        vanilla: {
            strengths: [
                'Smaller attack surface - fewer dependencies',
                'Direct control over CSP policies',
                'No hidden framework vulnerabilities',
                'Explicit security implementation'
            ],
            caveats: [
                'Manual CSRF/XSS protection required',
                'No built-in authentication patterns',
                'Security is developer\'s responsibility',
                'Must implement RBAC manually'
            ],
            practices: [
                'Use HTTPOnly cookies for tokens',
                'Implement strict CSP headers',
                'Sanitize all user inputs before rendering',
                'Use textContent instead of innerHTML where possible',
                'Integrate with ASP.NET Core Identity on backend',
                'Implement audit logging patterns',
                'Regular security audits of dependencies'
            ]
        },
        dotnet: {
            strengths: [
                'ASP.NET Core Identity for AuthN/AuthZ',
                'Built-in CSRF protection',
                'Framework-level XSS mitigations',
                'Policy-based authorization',
                'Comprehensive audit logging libraries',
                'OWASP compliance guidance'
            ],
            caveats: [
                'Framework vulnerabilities require updates',
                'Complex dependency trees to audit',
                'Must stay current with security patches',
                'Third-party library risks'
            ],
            practices: [
                'Use ASP.NET Core Identity with JWT',
                'Implement role-based and claims-based authorization',
                'Enable CORS properly',
                'Use Angular/React security best practices',
                'Regular npm audit and vulnerability scanning',
                'Implement Content Security Policy',
                'Use HttpClient with CSRF tokens'
            ]
        }
    },
    {
        criterion: 'Testing & Quality',
        vanilla: {
            strengths: [
                'Simple DOM testing with no framework mocks',
                'Direct unit testing of functions',
                'Fast test execution',
                'No test-specific build configuration'
            ],
            caveats: [
                'Limited testing ecosystem',
                'Manual setup for component testing',
                'No test generators or conventions',
                'Requires custom test utilities'
            ],
            practices: [
                'Use Playwright or Cypress for E2E tests',
                'Simple assert-based unit tests',
                'Test pure functions extensively',
                'Mock fetch/API calls properly',
                'Implement integration tests for critical flows',
                'Use code coverage tools (c8, istanbul)'
            ]
        },
        dotnet: {
            strengths: [
                'Rich testing ecosystem (xUnit, Jest, Testing Library)',
                'Built-in test utilities and mocks',
                'Component testing conventions',
                'TestBed and ComponentFixture (Angular)',
                'React Testing Library best practices',
                'Snapshot testing'
            ],
            caveats: [
                'Test configuration can be complex',
                'Framework-specific testing knowledge required',
                'Slower test execution with full builds',
                'Over-mocking can reduce test value'
            ],
            practices: [
                'Use Jest for unit tests',
                'Implement Testing Library for component tests',
                'Use Playwright/Cypress for E2E',
                'Achieve >80% code coverage',
                'Test user interactions, not implementation',
                'Integrate tests in CI/CD pipeline',
                'Use snapshot tests judiciously'
            ]
        }
    }
];

export function renderDeepDive(container) {
    comparisons.forEach(comparison => {
        const section = document.createElement('div');
        section.className = 'comparison-section';
        section.style.marginBottom = 'var(--spacing-2xl)';
        
        const title = document.createElement('h3');
        title.textContent = comparison.criterion;
        title.style.marginBottom = 'var(--spacing-lg)';
        section.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'comparison-item';
        
        // Vanilla JS card
        const vanillaCard = createComparisonCard(
            'Vanilla JS + Web API',
            'approach-a',
            comparison.vanilla
        );
        grid.appendChild(vanillaCard);
        
        // .NET + SPA card
        const dotnetCard = createComparisonCard(
            '.NET Core + Angular/React',
            'approach-b',
            comparison.dotnet
        );
        grid.appendChild(dotnetCard);
        
        section.appendChild(grid);
        container.appendChild(section);
    });
}

function createComparisonCard(title, className, data) {
    const card = document.createElement('div');
    card.className = `comparison-card ${className}`;
    
    card.innerHTML = `
        <h4>
            ${title}
            <span class="badge ${className}">${className === 'approach-a' ? 'Approach A' : 'Approach B'}</span>
        </h4>
        
        <div style="margin-bottom: var(--spacing-md);">
            <strong style="color: var(--color-success);">✅ Strengths</strong>
            <ul>
                ${data.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
        
        <div style="margin-bottom: var(--spacing-md);">
            <strong style="color: var(--color-warning);">⚠️ Caveats</strong>
            <ul>
                ${data.caveats.map(c => `<li>${c}</li>`).join('')}
            </ul>
        </div>
        
        <div>
            <strong style="color: var(--color-accent);">🛠️ Best Practices</strong>
            <ul>
                ${data.practices.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
    `;
    
    return card;
}

