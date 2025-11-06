// ========================================
// Content Component
// Static content for various sections
// ========================================

export function renderHiringContent(container) {
    container.innerHTML = `
        <div class="card">
            <h3>Talent Market Analysis</h3>
            <p>Understanding the availability and characteristics of talent for each approach is critical for long-term success.</p>
        </div>
        
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Factor</th>
                        <th>Vanilla JS + Web API</th>
                        <th>.NET Core + Angular/React</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Talent Pool Size</strong></td>
                        <td>Large - all web developers know fundamentals</td>
                        <td>Very Large - highly popular frameworks</td>
                    </tr>
                    <tr>
                        <td><strong>Skill Verification</strong></td>
                        <td>Easy - test DOM manipulation, async patterns</td>
                        <td>Moderate - framework-specific patterns</td>
                    </tr>
                    <tr>
                        <td><strong>Onboarding Time</strong></td>
                        <td>Fast for seniors, variable for juniors</td>
                        <td>Moderate - framework learning curve</td>
                    </tr>
                    <tr>
                        <td><strong>Training Resources</strong></td>
                        <td>MDN, vanilla tutorials, fundamentals courses</td>
                        <td>Official docs, Pluralsight, Udemy, bootcamps</td>
                    </tr>
                    <tr>
                        <td><strong>Market Rate</strong></td>
                        <td>$80-150K (varies by fundamentals strength)</td>
                        <td>$90-160K (framework expertise premium)</td>
                    </tr>
                    <tr>
                        <td><strong>Junior Developer Fit</strong></td>
                        <td>Requires strong mentoring and patterns</td>
                        <td>Better - framework guardrails help</td>
                    </tr>
                    <tr>
                        <td><strong>Retention</strong></td>
                        <td>Good if team values fundamentals</td>
                        <td>Good - popular tech on resume</td>
                    </tr>
                    <tr>
                        <td><strong>Team Scalability</strong></td>
                        <td>Requires strong architecture and code review</td>
                        <td>Easier to scale with conventions</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="intro-grid">
            <div class="card highlight-card">
                <h4>Hiring Recommendation: Vanilla JS</h4>
                <ul>
                    <li>Look for developers with strong CS fundamentals</li>
                    <li>Test async/await, closures, event handling, DOM APIs</li>
                    <li>Value experience building without frameworks</li>
                    <li>Prioritize senior developers who can establish patterns</li>
                    <li>Invest in code review and architectural mentorship</li>
                </ul>
            </div>
            
            <div class="card highlight-card">
                <h4>Hiring Recommendation: .NET + SPA</h4>
                <ul>
                    <li>Look for certified or experienced framework developers</li>
                    <li>Test framework-specific patterns and best practices</li>
                    <li>Evaluate component architecture knowledge</li>
                    <li>Mix of senior and mid-level works well</li>
                    <li>Junior developers can be productive faster</li>
                </ul>
            </div>
        </div>
    `;
}

export function renderSecurityContent(container) {
    container.innerHTML = `
        <div class="card">
            <h3>Security & Compliance Comparison</h3>
            <p>Both approaches can be secured properly, but the implementation strategy differs significantly.</p>
        </div>
        
        <div class="comparison-item">
            <div class="comparison-card approach-a">
                <h4>
                    Vanilla JS + Web API
                    <span class="badge approach-a">Approach A</span>
                </h4>
                
                <h5>Authentication & Authorization</h5>
                <ul>
                    <li><strong>AuthN:</strong> JWT tokens issued by ASP.NET Core backend</li>
                    <li><strong>Storage:</strong> HttpOnly cookies or localStorage (with considerations)</li>
                    <li><strong>AuthZ:</strong> Backend validates claims; frontend hides UI based on roles</li>
                    <li><strong>RBAC:</strong> Manual implementation using claims from token</li>
                </ul>
                
                <h5>XSS Prevention</h5>
                <ul>
                    <li>Use <code>textContent</code> instead of <code>innerHTML</code> for user data</li>
                    <li>Sanitize HTML if rendering is required (DOMPurify library)</li>
                    <li>Implement strict Content Security Policy (CSP)</li>
                    <li>Escape all user inputs in templates</li>
                </ul>
                
                <h5>CSRF Protection</h5>
                <ul>
                    <li>Use anti-forgery tokens with state-changing requests</li>
                    <li>Validate tokens on backend (.NET Core middleware)</li>
                    <li>SameSite cookie attributes</li>
                    <li>Double-submit cookie pattern if needed</li>
                </ul>
                
                <h5>API Security</h5>
                <ul>
                    <li>CORS configured properly on backend</li>
                    <li>HTTPS only in production</li>
                    <li>Rate limiting at gateway or backend</li>
                    <li>Input validation on both client and server</li>
                </ul>
                
                <h5>Audit & Compliance</h5>
                <ul>
                    <li>Backend logs all authentication events</li>
                    <li>Track data access and modifications</li>
                    <li>Implement PII masking in logs</li>
                    <li>GDPR: consent management, data export/delete APIs</li>
                </ul>
            </div>
            
            <div class="comparison-card approach-b">
                <h4>
                    .NET Core + Angular/React
                    <span class="badge approach-b">Approach B</span>
                </h4>
                
                <h5>Authentication & Authorization</h5>
                <ul>
                    <li><strong>AuthN:</strong> ASP.NET Core Identity + JWT or OAuth2/OIDC</li>
                    <li><strong>Storage:</strong> HttpOnly cookies or token service</li>
                    <li><strong>AuthZ:</strong> Angular Guards or React HOCs enforce routes</li>
                    <li><strong>RBAC:</strong> Policy-based authorization in .NET Core</li>
                    <li>Libraries: oidc-client-js, angular-oauth2-oidc</li>
                </ul>
                
                <h5>XSS Prevention</h5>
                <ul>
                    <li>Angular: automatic HTML sanitization built-in</li>
                    <li>React: JSX escapes by default; avoid dangerouslySetInnerHTML</li>
                    <li>Both: implement CSP headers</li>
                    <li>Use framework security best practices</li>
                </ul>
                
                <h5>CSRF Protection</h5>
                <ul>
                    <li>Angular HttpClient includes XSRF token handling</li>
                    <li>React: integrate CSRF tokens in Axios/fetch</li>
                    <li>ASP.NET Core ValidateAntiForgeryToken attribute</li>
                    <li>SameSite cookie attributes on backend</li>
                </ul>
                
                <h5>API Security</h5>
                <ul>
                    <li>HttpClient/Axios interceptors add auth headers</li>
                    <li>CORS properly configured on backend</li>
                    <li>HTTPS enforced</li>
                    <li>Rate limiting via middleware or API gateway</li>
                    <li>Input validation with data annotations (.NET)</li>
                </ul>
                
                <h5>Audit & Compliance</h5>
                <ul>
                    <li>ASP.NET Core middleware for audit logging</li>
                    <li>Entity Framework Core interceptors for data changes</li>
                    <li>Structured logging (Serilog, NLog)</li>
                    <li>GDPR: built-in consent UI (if using Identity)</li>
                    <li>PII redaction in logs</li>
                </ul>
            </div>
        </div>
        
        <div class="card">
            <h3>Security Checklist (Both Approaches)</h3>
            <div class="intro-grid">
                <div>
                    <h4>Development Phase</h4>
                    <ul>
                        <li>✅ Enable HTTPS locally</li>
                        <li>✅ Implement authentication early</li>
                        <li>✅ Use environment variables for secrets</li>
                        <li>✅ Regular dependency audits (npm audit, NuGet)</li>
                        <li>✅ Code review for security issues</li>
                        <li>✅ Static analysis tools (ESLint security rules)</li>
                    </ul>
                </div>
                <div>
                    <h4>Production Deployment</h4>
                    <ul>
                        <li>✅ Enforce HTTPS with HSTS headers</li>
                        <li>✅ Implement rate limiting</li>
                        <li>✅ Configure CSP headers</li>
                        <li>✅ Regular security updates</li>
                        <li>✅ WAF or API gateway</li>
                        <li>✅ Penetration testing</li>
                        <li>✅ Log monitoring and alerting</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

export function renderTestingContent(container) {
    container.innerHTML = `
        <div class="card">
            <h3>Testing Strategy & Quality Assurance</h3>
            <p>A comprehensive testing strategy is essential for both approaches. The tooling and patterns differ.</p>
        </div>
        
        <div class="comparison-item">
            <div class="comparison-card approach-a">
                <h4>
                    Vanilla JS + Web API
                    <span class="badge approach-a">Approach A</span>
                </h4>
                
                <h5>Unit Testing</h5>
                <ul>
                    <li><strong>Tools:</strong> Native assert, Mocha, or simple test runners</li>
                    <li><strong>Approach:</strong> Test pure functions and business logic</li>
                    <li><strong>Mocking:</strong> Manual mocks for fetch/API calls</li>
                    <li><strong>DOM Testing:</strong> JSDOM or happy-dom for lightweight tests</li>
                </ul>
                
                <h5>Integration Testing</h5>
                <ul>
                    <li>Test component mounting and unmounting</li>
                    <li>Verify event handlers and user interactions</li>
                    <li>Test state changes and re-renders</li>
                    <li>Mock API responses for predictable tests</li>
                </ul>
                
                <h5>E2E Testing</h5>
                <ul>
                    <li><strong>Tools:</strong> Playwright or Cypress</li>
                    <li><strong>Approach:</strong> Test complete user workflows</li>
                    <li><strong>Coverage:</strong> Critical paths, authentication, data entry</li>
                    <li>Run against staging environment</li>
                </ul>
                
                <h5>Sample Test (Vanilla)</h5>
                <pre><code>// Simple unit test
import { formatCurrency } from './utils.js';

function testFormatCurrency() {
    const result = formatCurrency(1234.56);
    console.assert(result === '$1,234.56', 'Currency format failed');
}

// DOM integration test
function testButtonClick() {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    
    let clicked = false;
    button.addEventListener('click', () => clicked = true);
    
    button.click();
    console.assert(clicked === true, 'Button click failed');
}
</code></pre>
            </div>
            
            <div class="comparison-card approach-b">
                <h4>
                    .NET Core + Angular/React
                    <span class="badge approach-b">Approach B</span>
                </h4>
                
                <h5>Unit Testing</h5>
                <ul>
                    <li><strong>Frontend:</strong> Jest + Testing Library (React) or Jasmine/Karma (Angular)</li>
                    <li><strong>Backend:</strong> xUnit, NUnit, or MSTest</li>
                    <li><strong>Mocking:</strong> Jest mocks, Moq (.NET)</li>
                    <li><strong>Coverage:</strong> Built-in coverage tools</li>
                </ul>
                
                <h5>Component Testing</h5>
                <ul>
                    <li>Angular: TestBed and ComponentFixture</li>
                    <li>React: Testing Library for user-centric tests</li>
                    <li>Test component props, state, and lifecycle</li>
                    <li>Snapshot testing for UI consistency</li>
                </ul>
                
                <h5>Integration Testing</h5>
                <ul>
                    <li>Test API endpoints with WebApplicationFactory (.NET)</li>
                    <li>In-memory database for data tests</li>
                    <li>Test Angular services with HttpClientTestingModule</li>
                    <li>React: MSW (Mock Service Worker) for API mocking</li>
                </ul>
                
                <h5>E2E Testing</h5>
                <ul>
                    <li><strong>Tools:</strong> Playwright, Cypress, or Protractor (Angular legacy)</li>
                    <li><strong>Approach:</strong> Full application testing</li>
                    <li>Run in CI/CD pipeline</li>
                    <li>Parallel execution for speed</li>
                </ul>
                
                <h5>Sample Test (React + Jest)</h5>
                <pre><code>// React component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('button handles click', () => {
    const handleClick = jest.fn();
    render(&lt;Button onClick={handleClick}&gt;Click me&lt;/Button&gt;);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
});

// .NET integration test
[Fact]
public async Task GetUsers_ReturnsOkResult()
{
    var client = _factory.CreateClient();
    var response = await client.GetAsync("/api/users");
    
    response.EnsureSuccessStatusCode();
    var users = await response.Content.ReadAsAsync&lt;List&lt;User&gt;&gt;();
    Assert.NotEmpty(users);
}
</code></pre>
            </div>
        </div>
        
        <div class="card">
            <h3>Testing Best Practices (Both Approaches)</h3>
            <ul>
                <li>Aim for 80%+ code coverage on critical business logic</li>
                <li>Test behavior, not implementation details</li>
                <li>Write tests before or alongside code (TDD/BDD)</li>
                <li>Run tests in CI/CD pipeline on every commit</li>
                <li>Keep tests fast - under 1 second per unit test</li>
                <li>Use E2E tests sparingly - they're slow and brittle</li>
                <li>Mock external dependencies (APIs, databases)</li>
                <li>Test error handling and edge cases</li>
                <li>Maintain test code with same quality as production code</li>
            </ul>
        </div>
    `;
}

export function renderVanillaGuide(container) {
    container.innerHTML = `
        <div class="card">
            <h3>Making Vanilla JS Practical at Scale</h3>
            <p>To make Vanilla JS a viable long-term option for an ERP system, you need a lightweight kernel with router, state, and component patterns.</p>
        </div>
        
        <div class="card">
            <h4>Core Kernel Components</h4>
            <p>These are the essential building blocks for a maintainable Vanilla JS application:</p>
            
            <div class="intro-grid">
                <div>
                    <h5>1. Hash-Based Router</h5>
                    <ul>
                        <li>Listen to <code>hashchange</code> events</li>
                        <li>Map routes to view functions</li>
                        <li>Handle 404s and redirects</li>
                        <li>Support route parameters</li>
                    </ul>
                </div>
                
                <div>
                    <h5>2. Pub/Sub State Store</h5>
                    <ul>
                        <li>Central state object</li>
                        <li>Subscribe to state changes</li>
                        <li><code>setState()</code> updates and notifies</li>
                        <li>Selective subscriptions by key</li>
                    </ul>
                </div>
                
                <div>
                    <h5>3. Base Component Class</h5>
                    <ul>
                        <li><code>mount(root)</code> lifecycle</li>
                        <li><code>unmount()</code> cleanup</li>
                        <li><code>render()</code> to generate HTML</li>
                        <li>Event binding and delegation</li>
                    </ul>
                </div>
                
                <div>
                    <h5>4. HTTP Client</h5>
                    <ul>
                        <li>Wrapper around <code>fetch</code></li>
                        <li>Global error handling</li>
                        <li>Authentication headers</li>
                        <li>Request/response interceptors</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h4>Example: Base Component Pattern</h4>
            <pre><code>// BaseComponent.js
export class BaseComponent {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.root = null;
        this.eventListeners = [];
    }
    
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.rerender();
    }
    
    mount(root) {
        this.root = root;
        this.render();
        this.attachEvents();
    }
    
    unmount() {
        this.removeEvents();
        if (this.root) {
            this.root.innerHTML = '';
        }
    }
    
    render() {
        if (!this.root) return;
        const html = this.template();
        this.root.innerHTML = html;
    }
    
    rerender() {
        this.removeEvents();
        this.render();
        this.attachEvents();
    }
    
    template() {
        return '&lt;div&gt;Override this method&lt;/div&gt;';
    }
    
    attachEvents() {
        // Override in subclass
    }
    
    removeEvents() {
        this.eventListeners.forEach(({ el, event, handler }) =&gt; {
            el.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }
    
    on(selector, event, handler) {
        const el = this.root.querySelector(selector);
        if (el) {
            el.addEventListener(event, handler);
            this.eventListeners.push({ el, event, handler });
        }
    }
}

// Usage: Concrete Component
class UserList extends BaseComponent {
    template() {
        return \`
            &lt;div class="user-list"&gt;
                &lt;h2&gt;Users&lt;/h2&gt;
                &lt;ul&gt;
                    \${this.state.users?.map(u =&gt; \`
                        &lt;li data-id="\${u.id}"&gt;\${u.name}&lt;/li&gt;
                    \`).join('') || '&lt;li&gt;Loading...&lt;/li&gt;'}
                &lt;/ul&gt;
                &lt;button id="refresh-btn"&gt;Refresh&lt;/button&gt;
            &lt;/div&gt;
        \`;
    }
    
    attachEvents() {
        this.on('#refresh-btn', 'click', () =&gt; this.loadUsers());
    }
    
    async loadUsers() {
        const users = await fetch('/api/users').then(r =&gt; r.json());
        this.setState({ users });
    }
}
</code></pre>
        </div>
        
        <div class="card">
            <h4>Example: Minimal Router</h4>
            <pre><code>// router.js
class Router {
    constructor() {
        this.routes = new Map();
        window.addEventListener('hashchange', () =&gt; this.navigate());
        window.addEventListener('load', () =&gt; this.navigate());
    }
    
    register(path, handler) {
        this.routes.set(path, handler);
    }
    
    navigate() {
        const path = window.location.hash.slice(1) || 'home';
        const handler = this.routes.get(path) || this.routes.get('404');
        if (handler) handler();
    }
}

export const router = new Router();

// Usage
router.register('home', () =&gt; {
    document.getElementById('app').innerHTML = '&lt;h1&gt;Home&lt;/h1&gt;';
});

router.register('users', () =&gt; {
    const component = new UserList();
    component.mount(document.getElementById('app'));
});
</code></pre>
        </div>
        
        <div class="card">
            <h4>Project Structure Recommendation</h4>
            <pre><code>/src
  /core
    router.js
    store.js
    http.js
    BaseComponent.js
  /components
    UserList.js
    UserDetail.js
    Dashboard.js
  /utils
    validators.js
    formatters.js
  /styles
    main.css
  app.js
  index.html
</code></pre>
        </div>
        
        <div class="card highlight-card">
            <h4>Key Principles for Vanilla JS Success</h4>
            <ul>
                <li><strong>Establish patterns early</strong> - Don't let architecture drift</li>
                <li><strong>Document everything</strong> - No framework means no docs by default</li>
                <li><strong>Code review rigorously</strong> - Enforce consistency manually</li>
                <li><strong>Keep it simple</strong> - Don't reinvent React; stay lean</li>
                <li><strong>Use ES modules</strong> - Organize code in maintainable files</li>
                <li><strong>Leverage platform APIs</strong> - IntersectionObserver, ResizeObserver, etc.</li>
                <li><strong>Write tests</strong> - Even without framework test utils</li>
                <li><strong>Monitor performance</strong> - Use Lighthouse and WebPageTest regularly</li>
            </ul>
        </div>
    `;
}

