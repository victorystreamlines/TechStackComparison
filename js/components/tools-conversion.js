// ========================================
// Tools & Conversion Component
// ========================================

export function renderToolsConversion(container) {
    container.innerHTML = `
        <!-- Best Tools for Vanilla JS -->
        <div class="card">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: 0.5rem;">
                🛠️ Essential Tools for Vanilla JavaScript Development
            </h3>
            
            <div style="display: grid; gap: var(--spacing-xl);">
                <!-- Development Tools -->
                <div>
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Development Environment</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                            <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">🤖 Cursor AI (Primary Tool)</h5>
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-sm);"><strong>Why:</strong> As mandated by Alruya School's decision, Cursor AI is the primary development assistant.</p>
                            <p style="line-height: 1.8; color: var(--color-text-secondary);">
                                <strong>Features:</strong> AI-powered code completion, context-aware suggestions, excellent with vanilla JS patterns, 
                                faster iterations compared to framework development.
                            </p>
                        </div>
                        
                        <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                            <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">💻 VS Code / Visual Studio Code</h5>
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-sm);"><strong>Why:</strong> Lightweight, fast, excellent JavaScript support, integrates seamlessly with Cursor.</p>
                            <p style="line-height: 1.8; color: var(--color-text-secondary);">
                                <strong>Extensions:</strong> ESLint, Prettier, Live Server, JavaScript (ES6) code snippets, Path Intellisense.
                            </p>
                        </div>
                        
                        <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                            <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">🌐 Live Server</h5>
                            <p style="line-height: 1.8; margin-bottom: var(--spacing-sm);"><strong>Why:</strong> Instant reload on file changes, no build process needed.</p>
                            <p style="line-height: 1.8; color: var(--color-text-secondary);">
                                <strong>Alternative:</strong> Python's <code>http.server</code> or Node's <code>http-server</code> for simple static serving.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Code Quality Tools -->
                <div>
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Code Quality & Linting</h4>
                    <div style="display: grid; gap: var(--spacing-md);">
                        <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                            <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">✅ ESLint</h5>
                            <p style="line-height: 1.8; color: var(--color-text-secondary);">
                                Catch errors early, enforce coding standards. Recommended config: <code>eslint-config-airbnb-base</code> for vanilla JS.
                            </p>
                        </div>
                        
                        <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                            <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-sm);">🎨 Prettier</h5>
                            <p style="line-height: 1.8; color: var(--color-text-secondary);">
                                Automatic code formatting. Configure once, forget about formatting debates. Works perfectly with vanilla JS.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Browser DevTools -->
                <div>
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Browser Developer Tools</h4>
                    <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-accent);">
                        <ul style="line-height: 2; color: var(--color-text-secondary);">
                            <li><strong>Chrome DevTools:</strong> Excellent debugging, performance profiling, network inspection</li>
                            <li><strong>Firefox Developer Edition:</strong> Great for CSS Grid/Flexbox debugging</li>
                            <li><strong>Edge DevTools:</strong> Similar to Chrome with additional enterprise features</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Best Web APIs -->
        <div class="card">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: 0.5rem;">
                🌐 Best Web API for Vanilla JavaScript Backend
            </h3>
            
            <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); padding: var(--spacing-2xl); border-radius: 8px; border-left: 5px solid var(--color-accent); margin-bottom: var(--spacing-xl);">
                <h4 style="color: var(--color-accent); margin-bottom: var(--spacing-lg); font-size: 1.5rem;">
                    ⭐ Recommended: ASP.NET Core Web API (Keep Your Backend!)
                </h4>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
                    <strong>Good News:</strong> You can keep your existing ASP.NET Core backend! Only the frontend needs migration. 
                    This significantly reduces migration risk and cost.
                </p>
                <div style="background: white; padding: var(--spacing-lg); border-radius: 8px; border: 2px solid var(--color-border); margin-top: var(--spacing-lg);">
                    <h5 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Why ASP.NET Core Web API is Perfect:</h5>
                    <ul style="line-height: 2;">
                        <li>✅ <strong>Already Built:</strong> Your backend logic, database access, business rules are done</li>
                        <li>✅ <strong>RESTful by Design:</strong> Easy to consume from vanilla JavaScript using Fetch API</li>
                        <li>✅ <strong>Performance:</strong> One of the fastest web frameworks (benchmarks prove it)</li>
                        <li>✅ <strong>Security:</strong> Built-in JWT authentication, CORS support, data protection</li>
                        <li>✅ <strong>Type Safety:</strong> C# backend ensures data integrity and validation</li>
                        <li>✅ <strong>Scalability:</strong> Handles high loads efficiently</li>
                        <li>✅ <strong>Team Knowledge:</strong> Your team already knows ASP.NET Core</li>
                    </ul>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px;">
                    <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">Alternative Option 1: Node.js + Express</h5>
                    <p style="line-height: 1.8; color: var(--color-text-secondary); margin-bottom: var(--spacing-sm);">
                        <strong>Pros:</strong> Same language (JavaScript), huge ecosystem, fast development
                    </p>
                    <p style="line-height: 1.8; color: var(--color-text-secondary);">
                        <strong>Cons:</strong> Requires complete backend rewrite, migration complexity
                    </p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: var(--color-bg-secondary); border-radius: 8px;">
                    <h5 style="color: var(--color-accent); margin-bottom: var(--spacing-md);">Alternative Option 2: FastAPI (Python)</h5>
                    <p style="line-height: 1.8; color: var(--color-text-secondary); margin-bottom: var(--spacing-sm);">
                        <strong>Pros:</strong> Modern, fast, automatic API documentation, type hints
                    </p>
                    <p style="line-height: 1.8; color: var(--color-text-secondary);">
                        <strong>Cons:</strong> Different language, requires backend rewrite, learning curve
                    </p>
                </div>
            </div>
            
            <div style="background: rgba(251, 191, 36, 0.1); padding: var(--spacing-lg); border-radius: 8px; border-left: 4px solid var(--color-warning); margin-top: var(--spacing-lg);">
                <div style="font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-warning);">💡 Recommendation for Alruya School:</div>
                <p style="line-height: 1.8; color: var(--color-text-primary);">
                    <strong>Keep your ASP.NET Core Web API backend.</strong> Only migrate the Angular frontend to Vanilla JavaScript. 
                    This approach minimizes risk, reduces cost, and leverages your existing infrastructure and team expertise.
                </p>
            </div>
        </div>
        
        <!-- Migration Strategy -->
        <div class="card" style="border: 3px solid var(--color-accent);">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: 0.5rem;">
                🔄 Migration Strategy: ASP.NET Core + Angular → ASP.NET Core + Vanilla JS
            </h3>
            
            <!-- Phase-Based Approach -->
            <div style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); padding: var(--spacing-xl); border-radius: 8px; margin-bottom: var(--spacing-xl);">
                <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">✅ Recommended: Incremental Migration Strategy</h4>
                <p style="line-height: 1.8; font-size: 1.05rem;">
                    Migrate one module at a time while keeping both systems running in parallel. This reduces risk and allows for continuous delivery.
                </p>
            </div>
            
            <!-- Phase 1 -->
            <div style="margin-bottom: var(--spacing-2xl);">
                <div style="background: var(--color-accent); color: white; padding: var(--spacing-md) var(--spacing-lg); border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1.2rem;">
                    Phase 1: Preparation & Setup (Week 1-2)
                </div>
                <div style="border: 2px solid var(--color-border); border-top: none; padding: var(--spacing-lg); border-radius: 0 0 8px 8px;">
                    <ol style="line-height: 2;">
                        <li><strong>API Documentation:</strong> Document all existing ASP.NET Core API endpoints
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Use Swagger/OpenAPI to auto-generate documentation</li>
                                <li>Document request/response formats, authentication requirements</li>
                                <li>Test all endpoints with Postman/Insomnia</li>
                            </ul>
                        </li>
                        <li><strong>Enable CORS:</strong> Configure your ASP.NET Core API to accept requests from vanilla JS
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Add CORS middleware to <code>Program.cs</code></li>
                                <li>Specify allowed origins, methods, headers</li>
                            </ul>
                        </li>
                        <li><strong>Setup Development Environment:</strong> Install Cursor AI, VS Code, Live Server</li>
                        <li><strong>Create Project Structure:</strong> Setup folder structure for vanilla JS app
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li><code>/js/components/</code> - UI components</li>
                                <li><code>/js/services/</code> - API communication</li>
                                <li><code>/js/utils/</code> - Helper functions</li>
                                <li><code>/assets/css/</code> - Stylesheets</li>
                            </ul>
                        </li>
                        <li><strong>Select Pilot Module:</strong> Choose simplest, least critical module for first migration</li>
                    </ol>
                </div>
            </div>
            
            <!-- Phase 2 -->
            <div style="margin-bottom: var(--spacing-2xl);">
                <div style="background: var(--color-accent); color: white; padding: var(--spacing-md) var(--spacing-lg); border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1.2rem;">
                    Phase 2: Core Architecture Setup (Week 3-4)
                </div>
                <div style="border: 2px solid var(--color-border); border-top: none; padding: var(--spacing-lg); border-radius: 0 0 8px 8px;">
                    <ol style="line-height: 2;">
                        <li><strong>Build API Service Layer:</strong> Create JavaScript classes to communicate with ASP.NET Core API
<pre style="background: #1e293b; color: #e2e8f0; padding: var(--spacing-md); border-radius: 4px; overflow-x: auto; margin: var(--spacing-sm) 0;"><code>// js/services/api-service.js
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('auth_token');
    }
    
    async get(endpoint) {
        const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
            headers: { 
                'Authorization': \`Bearer \${this.token}\`,
                'Content-Type': 'application/json' 
            }
        });
        return await response.json();
    }
    
    async post(endpoint, data) {
        const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
            method: 'POST',
            headers: { 
                'Authorization': \`Bearer \${this.token}\`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
}</code></pre>
                        </li>
                        <li><strong>Setup State Management:</strong> Create simple store pattern (like this comparison tool uses)</li>
                        <li><strong>Build Router:</strong> Implement hash-based routing for SPA navigation</li>
                        <li><strong>Authentication Flow:</strong> Implement JWT token management
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Store JWT tokens in localStorage or httpOnly cookies</li>
                                <li>Intercept API calls to attach auth headers</li>
                                <li>Handle token refresh logic</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </div>
            
            <!-- Phase 3 -->
            <div style="margin-bottom: var(--spacing-2xl);">
                <div style="background: var(--color-accent); color: white; padding: var(--spacing-md) var(--spacing-lg); border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1.2rem;">
                    Phase 3: Migrate Pilot Module (Week 5-6)
                </div>
                <div style="border: 2px solid var(--color-border); border-top: none; padding: var(--spacing-lg); border-radius: 0 0 8px 8px;">
                    <ol style="line-height: 2;">
                        <li><strong>Analyze Angular Components:</strong> Map Angular components to vanilla JS components</li>
                        <li><strong>Convert Templates:</strong> Transform Angular HTML to standard HTML
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Remove <code>*ngFor</code>, <code>*ngIf</code> - use template literals and JS logic</li>
                                <li>Replace Angular directives with vanilla JS event listeners</li>
                                <li>Convert data binding to manual DOM updates or use state management</li>
                            </ul>
                        </li>
                        <li><strong>Migrate Business Logic:</strong> Extract logic from Angular services to vanilla JS modules</li>
                        <li><strong>Recreate Forms:</strong> Build form validation without Angular Forms
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Use HTML5 validation attributes</li>
                                <li>Add custom JavaScript validation</li>
                                <li>Handle form submission with Fetch API</li>
                            </ul>
                        </li>
                        <li><strong>Test Thoroughly:</strong> User acceptance testing on pilot module</li>
                    </ol>
                </div>
            </div>
            
            <!-- Phase 4 -->
            <div style="margin-bottom: var(--spacing-2xl);">
                <div style="background: var(--color-accent); color: white; padding: var(--spacing-md) var(--spacing-lg); border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1.2rem;">
                    Phase 4: Parallel Deployment (Week 7-8)
                </div>
                <div style="border: 2px solid var(--color-border); border-top: none; padding: var(--spacing-lg); border-radius: 0 0 8px 8px;">
                    <ol style="line-height: 2;">
                        <li><strong>Deploy Vanilla JS Module:</strong> Host alongside existing Angular app
                            <ul style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                <li>Use subdomain: <code>new.alruyaschool.com</code></li>
                                <li>Or use path routing: <code>alruyaschool.com/app-v2/</code></li>
                            </ul>
                        </li>
                        <li><strong>Gradual User Migration:</strong> Start with internal users, then expand</li>
                        <li><strong>Monitor Performance:</strong> Track load times, API response times, errors</li>
                        <li><strong>Gather Feedback:</strong> Collect user feedback, fix issues</li>
                    </ol>
                </div>
            </div>
            
            <!-- Phase 5 -->
            <div style="margin-bottom: var(--spacing-2xl);">
                <div style="background: var(--color-accent); color: white; padding: var(--spacing-md) var(--spacing-lg); border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1.2rem;">
                    Phase 5: Full Migration (Month 3-6)
                </div>
                <div style="border: 2px solid var(--color-border); border-top: none; padding: var(--spacing-lg); border-radius: 0 0 8px 8px;">
                    <ol style="line-height: 2;">
                        <li><strong>Repeat for Each Module:</strong> Apply lessons learned from pilot to remaining modules</li>
                        <li><strong>Optimize Performance:</strong> Lazy load components, cache API responses</li>
                        <li><strong>Complete Testing:</strong> End-to-end testing, security audits</li>
                        <li><strong>Final Cutover:</strong> Switch primary domain to vanilla JS app</li>
                        <li><strong>Decommission Angular:</strong> Keep Angular app as backup for 30 days, then remove</li>
                    </ol>
                </div>
            </div>
        </div>
        
        <!-- Best Practices -->
        <div class="card">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">💡 Migration Best Practices</h3>
            
            <div style="display: grid; gap: var(--spacing-md);">
                <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-left: 4px solid var(--color-success); border-radius: 4px;">
                    <h5 style="color: var(--color-success); margin-bottom: var(--spacing-sm);">✅ DO: Reuse Your Backend</h5>
                    <p style="line-height: 1.8;">Keep your ASP.NET Core API unchanged. It's battle-tested, performant, and already integrated with your database.</p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-left: 4px solid var(--color-success); border-radius: 4px;">
                    <h5 style="color: var(--color-success); margin-bottom: var(--spacing-sm);">✅ DO: Use Cursor AI Throughout</h5>
                    <p style="line-height: 1.8;">Let Cursor AI assist with converting Angular patterns to vanilla JS. It excels at this type of refactoring.</p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: rgba(52, 211, 153, 0.1); border-left: 4px solid var(--color-success); border-radius: 4px;">
                    <h5 style="color: var(--color-success); margin-bottom: var(--spacing-sm);">✅ DO: Migrate Incrementally</h5>
                    <p style="line-height: 1.8;">Never do a "big bang" rewrite. Migrate one feature at a time. Run both apps in parallel during transition.</p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--color-danger); border-radius: 4px;">
                    <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-sm);">❌ DON'T: Rewrite Everything at Once</h5>
                    <p style="line-height: 1.8;">Big bang migrations fail 80% of the time. They're risky, expensive, and delay delivering value to users.</p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--color-danger); border-radius: 4px;">
                    <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-sm);">❌ DON'T: Change Backend & Frontend Together</h5>
                    <p style="line-height: 1.8;">Changing both simultaneously multiplies risk. Keep the backend stable while you migrate the frontend.</p>
                </div>
                
                <div style="padding: var(--spacing-lg); background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--color-danger); border-radius: 4px;">
                    <h5 style="color: var(--color-danger); margin-bottom: var(--spacing-sm);">❌ DON'T: Skip Testing</h5>
                    <p style="line-height: 1.8;">Test every migrated module thoroughly. ERP systems handle critical business operations—bugs are costly.</p>
                </div>
            </div>
        </div>
        
        <!-- Code Migration Examples -->
        <div class="card">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">📝 Code Migration Examples</h3>
            
            <div style="display: grid; gap: var(--spacing-xl);">
                <!-- Example 1: Component -->
                <div>
                    <h4 style="margin-bottom: var(--spacing-md);">Example 1: Converting Angular Component to Vanilla JS</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                        <div>
                            <div style="background: #dc2626; color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: 4px 4px 0 0; font-weight: 600;">
                                ❌ Angular Component
                            </div>
<pre style="background: #1e293b; color: #e2e8f0; padding: var(--spacing-md); border-radius: 0 0 4px 4px; overflow-x: auto; margin: 0;"><code>// users.component.ts
@Component({
  selector: 'app-users',
  template: \`
    &lt;div *ngFor="let user of users"&gt;
      {{user.name}}
    &lt;/div&gt;
  \`
})
export class UsersComponent {
  users = [];
  
  ngOnInit() {
    this.http.get('/api/users')
      .subscribe(data => {
        this.users = data;
      });
  }
}</code></pre>
                        </div>
                        
                        <div>
                            <div style="background: #16a34a; color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: 4px 4px 0 0; font-weight: 600;">
                                ✅ Vanilla JavaScript
                            </div>
<pre style="background: #1e293b; color: #e2e8f0; padding: var(--spacing-md); border-radius: 0 0 4px 4px; overflow-x: auto; margin: 0;"><code>// users.js
export class UsersComponent {
  constructor(container) {
    this.container = container;
    this.users = [];
    this.init();
  }
  
  async init() {
    await this.loadUsers();
    this.render();
  }
  
  async loadUsers() {
    const response = await fetch('/api/users');
    this.users = await response.json();
  }
  
  render() {
    this.container.innerHTML = \`
      \${this.users.map(user => \`
        &lt;div&gt;\${user.name}&lt;/div&gt;
      \`).join('')}
    \`;
  }
}</code></pre>
                        </div>
                    </div>
                </div>
                
                <!-- Example 2: Form -->
                <div>
                    <h4 style="margin-bottom: var(--spacing-md);">Example 2: Form Handling</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                        <div>
                            <div style="background: #dc2626; color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: 4px 4px 0 0; font-weight: 600;">
                                ❌ Angular Form
                            </div>
<pre style="background: #1e293b; color: #e2e8f0; padding: var(--spacing-md); border-radius: 0 0 4px 4px; overflow-x: auto; margin: 0;"><code>// Angular Template
&lt;form [formGroup]="form" 
      (ngSubmit)="onSubmit()"&gt;
  &lt;input formControlName="email"&gt;
  &lt;button type="submit"&gt;
    Submit
  &lt;/button&gt;
&lt;/form&gt;

// Component
this.form = new FormGroup({
  email: new FormControl('', 
    Validators.required)
});</code></pre>
                        </div>
                        
                        <div>
                            <div style="background: #16a34a; color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: 4px 4px 0 0; font-weight: 600;">
                                ✅ Vanilla JavaScript
                            </div>
<pre style="background: #1e293b; color: #e2e8f0; padding: var(--spacing-md); border-radius: 0 0 4px 4px; overflow-x: auto; margin: 0;"><code>// HTML
&lt;form id="myForm"&gt;
  &lt;input name="email" 
         type="email" required&gt;
  &lt;button type="submit"&gt;
    Submit
  &lt;/button&gt;
&lt;/form&gt;

// JavaScript
document.getElementById('myForm')
  .addEventListener('submit', 
    async (e) =&gt; {
      e.preventDefault();
      const formData = 
        new FormData(e.target);
      const data = 
        Object.fromEntries(formData);
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    });</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Timeline -->
        <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);">
            <h3 style="color: var(--color-accent); margin-bottom: var(--spacing-lg);">📅 Estimated Timeline for Alruya School</h3>
            
            <div style="display: grid; gap: var(--spacing-md);">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: var(--spacing-md); padding: var(--spacing-md); background: white; border-radius: 8px; border-left: 4px solid var(--color-accent);">
                    <div style="font-weight: 700; color: var(--color-accent);">Month 1</div>
                    <div>Setup, documentation, pilot module migration</div>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: var(--spacing-md); padding: var(--spacing-md); background: white; border-radius: 8px; border-left: 4px solid var(--color-accent);">
                    <div style="font-weight: 700; color: var(--color-accent);">Month 2-3</div>
                    <div>Core modules migration (dashboards, reports, user management)</div>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: var(--spacing-md); padding: var(--spacing-md); background: white; border-radius: 8px; border-left: 4px solid var(--color-accent);">
                    <div style="font-weight: 700; color: var(--color-accent);">Month 4-5</div>
                    <div>Complex modules (inventory, finance, scheduling)</div>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: var(--spacing-md); padding: var(--spacing-md); background: white; border-radius: 8px; border-left: 4px solid var(--color-accent);">
                    <div style="font-weight: 700; color: var(--color-accent);">Month 6</div>
                    <div>Testing, optimization, final cutover, Angular decommission</div>
                </div>
            </div>
            
            <div style="background: rgba(99, 102, 241, 0.1); padding: var(--spacing-lg); border-radius: 8px; margin-top: var(--spacing-lg);">
                <strong>Total Estimated Duration: 6 months for complete migration</strong><br>
                <span style="color: var(--color-text-secondary);">With 4 developers working collaboratively using Cursor AI</span>
            </div>
        </div>
    `;
}

