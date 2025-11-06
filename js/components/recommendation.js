// ========================================
// Recommendation Component
// ========================================

import { store } from '../app.js';

export function renderRecommendation(container) {
    container.innerHTML = `
        <div class="card">
            <h3>Generate Executive Recommendation</h3>
            <p>Based on your weighted decision matrix, TCO model, and risk assessment, generate a customized recommendation document for leadership.</p>
        </div>
        
        <div class="card">
            <h4>Business Context</h4>
            <div class="form-group">
                <label for="rec-context">
                    Describe your organization's context, constraints, and priorities
                </label>
                <textarea 
                    id="rec-context" 
                    placeholder="E.g., We are a mid-size manufacturing company with 200 employees, looking to replace our legacy ERP system. Our IT team is small (3 developers), and we need to go live within 12 months. Budget is constrained but we value long-term maintainability..."
                    rows="6"
                ></textarea>
            </div>
        </div>
        
        <div id="rec-output-container"></div>
        
        <div class="btn-group" style="margin-top: var(--spacing-lg);">
            <button class="btn btn-primary" id="generate-rec-btn">
                📝 Generate Recommendation
            </button>
            <button class="btn btn-secondary" id="copy-rec-btn" style="display: none;">
                📋 Copy to Clipboard
            </button>
            <button class="btn btn-secondary" id="download-rec-btn" style="display: none;">
                💾 Download as Text
            </button>
        </div>
    `;
    
    attachEventListeners(container);
}

function attachEventListeners(container) {
    const generateBtn = container.querySelector('#generate-rec-btn');
    const copyBtn = container.querySelector('#copy-rec-btn');
    const downloadBtn = container.querySelector('#download-rec-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', () => generateRecommendation(container));
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyRecommendation);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadRecommendation);
    }
}

function generateRecommendation(container) {
    const context = container.querySelector('#rec-context').value;
    const state = store.getState();
    
    // Calculate decision matrix results
    const criteria = state.criteria;
    let vanillaTotalWeighted = 0;
    let dotnetTotalWeighted = 0;
    let totalWeight = 0;
    
    criteria.forEach(criterion => {
        const weight = criterion.weight;
        vanillaTotalWeighted += weight * criterion.scores.vanilla;
        dotnetTotalWeighted += weight * criterion.scores.dotnet;
        totalWeight += weight;
    });
    
    const vanillaScore = (vanillaTotalWeighted / totalWeight).toFixed(1);
    const dotnetScore = (dotnetTotalWeighted / totalWeight).toFixed(1);
    const winner = vanillaScore > dotnetScore ? 'Vanilla JS + Web API' : '.NET Core + Angular/React';
    const scoreDiff = Math.abs(vanillaScore - dotnetScore).toFixed(1);
    
    // Calculate TCO
    const inputs = state.tcoInputs;
    const hoursPerMonth = 160;
    const monthlyBurnRate = inputs.teamSize * hoursPerMonth * inputs.blendedRate;
    
    const vanillaSetupCost = (inputs.setupMonths * 0.5) * monthlyBurnRate;
    const vanillaBuildMonths = 12 / inputs.vanillaVelocity;
    const vanillaBuildCost = vanillaBuildMonths * monthlyBurnRate;
    const vanillaTotalBuild = vanillaSetupCost + vanillaBuildCost;
    const vanillaYear1Maint = vanillaTotalBuild * (inputs.year1Maintenance / 100);
    const vanillaYear1Total = vanillaTotalBuild + vanillaYear1Maint;
    
    const dotnetSetupCost = inputs.setupMonths * monthlyBurnRate;
    const dotnetBuildMonths = 12 / inputs.dotnetVelocity;
    const dotnetBuildCost = dotnetBuildMonths * monthlyBurnRate;
    const dotnetTotalBuild = dotnetSetupCost + dotnetBuildCost;
    const dotnetYear1Maint = dotnetTotalBuild * (inputs.year1Maintenance / 100);
    const dotnetYear1Total = dotnetTotalBuild + dotnetYear1Maint;
    
    const tcoCheaper = vanillaYear1Total < dotnetYear1Total ? 'Vanilla JS' : '.NET + SPA';
    const tcoSavings = Math.abs(vanillaYear1Total - dotnetYear1Total).toFixed(0);
    
    // Get top risks
    const risks = state.risks;
    const vanillaRisks = risks.filter(r => r.approach.includes('Vanilla')).slice(0, 3);
    const dotnetRisks = risks.filter(r => r.approach.includes('.NET')).slice(0, 3);
    
    // Generate recommendation text
    const recommendationText = `
EXECUTIVE RECOMMENDATION: ERP TECHNOLOGY STACK DECISION
========================================================

Date: ${new Date().toLocaleDateString()}
Prepared by: Technology Leadership Team

BUSINESS CONTEXT
----------------
${context || 'No specific context provided. Please add your organization\'s context above.'}


DECISION SUMMARY
----------------
Based on our weighted analysis across 11 key criteria, our recommendation is:

*** ${winner.toUpperCase()} ***

This approach scored ${winner === 'Vanilla JS + Web API' ? vanillaScore : dotnetScore} vs. ${winner === 'Vanilla JS + Web API' ? dotnetScore : vanillaScore} 
(difference of ${scoreDiff} points on a 0-10 scale).


WEIGHTED CRITERIA ANALYSIS
---------------------------
The following criteria were evaluated with customized weights based on organizational priorities:

${criteria.map(c => `
${c.name} (Weight: ${c.weight}/10)
  - Vanilla JS Score: ${c.scores.vanilla}/10
  - .NET + SPA Score: ${c.scores.dotnet}/10
  - Weighted Impact: ${winner === 'Vanilla JS + Web API' && c.scores.vanilla > c.scores.dotnet ? '✓ Favors Vanilla' : 
                       winner !== 'Vanilla JS + Web API' && c.scores.dotnet > c.scores.vanilla ? '✓ Favors .NET' : '≈ Neutral'}
`).join('')}

TOTAL COST OF OWNERSHIP
------------------------
Year 1 Projected Costs:
- Vanilla JS + Web API: $${formatNumber(vanillaYear1Total)}K
- .NET Core + Angular/React: $${formatNumber(dotnetYear1Total)}K

Cost Advantage: ${tcoCheaper} saves approximately $${formatNumber(tcoSavings)}K in Year 1

Key Cost Assumptions:
- Team size: ${inputs.teamSize} developers
- Blended rate: $${inputs.blendedRate}/hour
- Vanilla build time: ${vanillaBuildMonths.toFixed(1)} months
- .NET + SPA build time: ${dotnetBuildMonths.toFixed(1)} months


KEY RISKS AND MITIGATIONS
--------------------------
${winner === 'Vanilla JS + Web API' ? `
Vanilla JS + Web API Risks:
${vanillaRisks.map((r, i) => `
${i + 1}. ${r.risk}
   Probability: ${r.probability} | Impact: ${r.impact}
   Mitigation: ${r.mitigation}
   Owner: ${r.owner}
`).join('')}
` : `
.NET Core + Angular/React Risks:
${dotnetRisks.map((r, i) => `
${i + 1}. ${r.risk}
   Probability: ${r.probability} | Impact: ${r.impact}
   Mitigation: ${r.mitigation}
   Owner: ${r.owner}
`).join('')}
`}

RECOMMENDATION RATIONALE
------------------------
${winner === 'Vanilla JS + Web API' ? `
We recommend Vanilla JS + Web API because:

✓ PROS:
  - Faster time-to-market with zero build configuration
  - Lower operational complexity - no toolchain overhead
  - Better performance and smaller bundle sizes
  - Full control over architecture and dependencies
  - Lower TCO in Year 1
  - Excellent for teams with strong web fundamentals

⚠ CONSIDERATIONS:
  - Requires strong architectural discipline and code review
  - Limited out-of-the-box component libraries
  - Team must establish and enforce coding patterns
  - Less suitable for very large distributed teams
  - Junior developers need more guidance

CRITICAL SUCCESS FACTORS:
1. Hire or designate senior developers to establish patterns
2. Create a component kernel early (router, state, base component)
3. Document architecture decisions and coding standards
4. Implement rigorous code review process
5. Invest in developer training on web fundamentals
` : `
We recommend .NET Core + Angular/React because:

✓ PROS:
  - Mature ecosystem with extensive component libraries
  - Strong developer productivity with TypeScript and tooling
  - Better maintainability at scale with framework guardrails
  - Excellent for large, distributed development teams
  - Built-in security and testing patterns
  - Easier to scale team and onboard developers

⚠ CONSIDERATIONS:
  - Higher operational complexity (build pipelines, tooling)
  - Framework upgrade cycles require ongoing maintenance
  - Larger bundle sizes impact initial load performance
  - Higher learning curve for the framework
  - More expensive setup phase

CRITICAL SUCCESS FACTORS:
1. Invest in training on chosen framework (Angular or React)
2. Establish CI/CD pipeline early with automated testing
3. Configure bundle optimization and code splitting
4. Create shared component library for consistency
5. Plan for regular framework updates
`}

GO/NO-GO DECISION
-----------------
✅ GO if:
${winner === 'Vanilla JS + Web API' ? `
   - Your team has strong JavaScript fundamentals
   - Time-to-market is critical (< 6 months for MVP)
   - You value simplicity and minimal operational overhead
   - Team size is small to medium (< 10 developers)
   - Performance is a top priority
` : `
   - You need mature UI component libraries
   - Team will scale beyond 10 developers
   - Long-term maintainability is prioritized
   - You have budget for tooling and training
   - Existing .NET expertise in the organization
`}

🛑 RECONSIDER if:
${winner === 'Vanilla JS + Web API' ? `
   - Team lacks senior web developers to establish patterns
   - You need extensive pre-built UI components
   - Team will grow rapidly (> 15 developers)
   - Junior developers will form majority of team
` : `
   - Budget is severely constrained
   - Time-to-market is critical (< 4 months)
   - Team is very small (< 3 developers)
   - Operational simplicity is paramount
`}


NEXT STEPS
----------
1. Review this recommendation with stakeholders
2. Validate assumptions (especially team size, timeline, budget)
3. Conduct proof-of-concept (POC) for 2-4 weeks
4. Finalize technology decision by [DATE]
5. Begin team training and environment setup
6. Establish development standards and guidelines
7. Set up CI/CD pipeline and quality gates
8. Plan phased rollout strategy


APPENDIX: CUSTOMIZATION NOTES
------------------------------
This recommendation was generated based on:
- Custom weights assigned to ${criteria.length} decision criteria
- TCO model with your specific team size and rates
- Risk register with ${risks.length} identified risks

To update this recommendation:
1. Adjust weights in the Decision Matrix tab
2. Modify TCO assumptions in the TCO Model tab
3. Add/edit risks in the Risk Register tab
4. Regenerate this recommendation

========================================================
End of Recommendation
    `.trim();
    
    // Display the recommendation
    const outputContainer = container.querySelector('#rec-output-container');
    outputContainer.innerHTML = `
        <div class="card" style="margin-top: var(--spacing-xl);">
            <h3>Generated Recommendation</h3>
            <pre style="white-space: pre-wrap; background-color: var(--color-bg-secondary); padding: var(--spacing-lg); border-radius: var(--border-radius-md); max-height: 600px; overflow-y: auto;">${escapeHtml(recommendationText)}</pre>
        </div>
    `;
    
    // Show action buttons
    container.querySelector('#copy-rec-btn').style.display = 'inline-flex';
    container.querySelector('#download-rec-btn').style.display = 'inline-flex';
    
    // Store recommendation text for later use
    container.dataset.recommendation = recommendationText;
}

function copyRecommendation(e) {
    const container = e.target.closest('#recommendation-container');
    const text = container.dataset.recommendation;
    
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = e.target.textContent;
        e.target.textContent = '✅ Copied!';
        setTimeout(() => {
            e.target.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard');
        console.error(err);
    });
}

function downloadRecommendation(e) {
    const container = e.target.closest('#recommendation-container');
    const text = container.dataset.recommendation;
    
    if (!text) return;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `erp-recommendation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatNumber(num) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

