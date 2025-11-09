// ========================================
// Final Decision Component
// ========================================

import { store } from '../app.js';

export function renderFinalDecision(container) {
    const state = store.getState();
    const criteria = state.criteria;
    const inputs = state.tcoInputs;
    const risks = state.risks;
    
    // Calculate decision matrix results
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
    const scoreDiff = Math.abs(vanillaScore - dotnetScore).toFixed(1);
    const scoreLead = vanillaScore > dotnetScore ? 'Vanilla JS' : '.NET + SPA';
    
    // Calculate TCO
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
    
    const tcoLead = vanillaYear1Total < dotnetYear1Total ? 'Vanilla JS' : '.NET + SPA';
    const tcoSavings = Math.abs(vanillaYear1Total - dotnetYear1Total);
    
    // Risk counts
    const vanillaHighRisks = risks.filter(r => r.approach.includes('Vanilla') && r.impact === 'High').length;
    const dotnetHighRisks = risks.filter(r => r.approach.includes('.NET') && r.impact === 'High').length;
    
    // Determine recommended approach
    let recommendedApproach = '';
    let confidence = 'Moderate';
    
    if (vanillaScore > dotnetScore && vanillaYear1Total < dotnetYear1Total) {
        recommendedApproach = 'Vanilla JS + Web API';
        confidence = scoreDiff > 1.0 ? 'High' : 'Moderate';
    } else if (dotnetScore > vanillaScore && dotnetYear1Total < vanillaYear1Total) {
        recommendedApproach = '.NET Core + Angular/React';
        confidence = scoreDiff > 1.0 ? 'High' : 'Moderate';
    } else if (vanillaScore > dotnetScore) {
        recommendedApproach = 'Vanilla JS + Web API';
        confidence = 'Moderate';
    } else {
        recommendedApproach = '.NET Core + Angular/React';
        confidence = 'Moderate';
    }
    
    if (scoreDiff < 0.5) {
        confidence = 'Low';
    }
    
    container.innerHTML = `
        <!-- Hero Decision Card -->
        <div class="card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 3px solid var(--color-accent); padding: var(--spacing-2xl); text-align: center;">
            <h3 style="font-size: 1.8rem; margin-bottom: var(--spacing-lg); color: var(--color-accent);">
                🎯 Recommended Technology Stack
            </h3>
            <div style="font-size: 3rem; font-weight: 900; margin-bottom: var(--spacing-md); color: var(--color-text-primary);">
                ${recommendedApproach}
            </div>
            <div class="confidence-indicator" style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                <span style="color: var(--color-text-secondary); font-weight: 600; font-size: 1.1rem;">Confidence Level:</span>
                <span class="confidence-badge ${confidence === 'High' ? 'confidence-high' : confidence === 'Moderate' ? 'confidence-moderate' : 'confidence-low'}" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 700; font-size: 1.2rem;">
                    ${confidence === 'High' ? '🟢 High' : confidence === 'Moderate' ? '🟡 Moderate' : '🟠 Low'}
                </span>
            </div>
        </div>
        
        <!-- Analysis Summary Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-xl); margin: var(--spacing-2xl) 0;">
            <!-- Weighted Score Card -->
            <div class="card" style="border-left: 4px solid ${vanillaScore > dotnetScore ? 'var(--color-highlight-a)' : 'var(--color-highlight-b)'};">
                <h4 style="color: var(--color-accent); display: flex; align-items: center; gap: 0.5rem;">
                    📊 Decision Matrix Results
                </h4>
                <div style="margin: var(--spacing-lg) 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <span style="font-size: 1.1rem; font-weight: 600;">Vanilla JS</span>
                        <span style="font-size: 2rem; font-weight: 700; color: var(--color-highlight-a);">${vanillaScore}</span>
                    </div>
                    <div class="result-bar" style="height: 30px; margin-bottom: var(--spacing-lg);">
                        <div class="result-bar-fill approach-a" style="width: ${(vanillaScore / 10) * 100}%;"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <span style="font-size: 1.1rem; font-weight: 600;">.NET + SPA</span>
                        <span style="font-size: 2rem; font-weight: 700; color: var(--color-highlight-b);">${dotnetScore}</span>
                    </div>
                    <div class="result-bar" style="height: 30px;">
                        <div class="result-bar-fill approach-b" style="width: ${(dotnetScore / 10) * 100}%;"></div>
                    </div>
                </div>
                <div style="padding: var(--spacing-md); background: var(--color-bg-secondary); border-radius: 8px; text-align: center;">
                    <strong style="color: ${vanillaScore > dotnetScore ? 'var(--color-highlight-a)' : 'var(--color-highlight-b)'};">
                        ${scoreLead} leads by ${scoreDiff} points
                    </strong>
                </div>
            </div>
            
            <!-- TCO Card -->
            <div class="card" style="border-left: 4px solid ${vanillaYear1Total < dotnetYear1Total ? 'var(--color-success)' : 'var(--color-warning)'};">
                <h4 style="color: var(--color-accent); display: flex; align-items: center; gap: 0.5rem;">
                    💰 Total Cost of Ownership (Year 1)
                </h4>
                <div style="margin: var(--spacing-lg) 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                        <span style="font-size: 1.1rem; font-weight: 600;">Vanilla JS</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--color-highlight-a);">$${formatNumber(vanillaYear1Total)}K</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                        <span style="font-size: 1.1rem; font-weight: 600;">.NET + SPA</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--color-highlight-b);">$${formatNumber(dotnetYear1Total)}K</span>
                    </div>
                </div>
                <div style="padding: var(--spacing-md); background: var(--color-bg-secondary); border-radius: 8px; text-align: center;">
                    <strong style="color: ${vanillaYear1Total < dotnetYear1Total ? 'var(--color-success)' : 'var(--color-warning)'};">
                        ${tcoLead} saves $${formatNumber(tcoSavings)}K
                    </strong>
                </div>
            </div>
            
            <!-- Risk Assessment Card -->
            <div class="card" style="border-left: 4px solid var(--color-danger);">
                <h4 style="color: var(--color-accent); display: flex; align-items: center; gap: 0.5rem;">
                    ⚠️ Risk Assessment
                </h4>
                <div style="margin: var(--spacing-lg) 0;">
                    <div style="margin-bottom: var(--spacing-lg);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
                            <span style="font-weight: 600;">Vanilla JS High Risks</span>
                            <span style="font-size: 1.5rem; font-weight: 700; color: ${vanillaHighRisks > 0 ? 'var(--color-danger)' : 'var(--color-success)'};">${vanillaHighRisks}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-text-muted);">Total: ${risks.filter(r => r.approach.includes('Vanilla')).length} risks tracked</div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
                            <span style="font-weight: 600;">.NET + SPA High Risks</span>
                            <span style="font-size: 1.5rem; font-weight: 700; color: ${dotnetHighRisks > 0 ? 'var(--color-danger)' : 'var(--color-success)'};">${dotnetHighRisks}</span>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--color-text-muted);">Total: ${risks.filter(r => r.approach.includes('.NET')).length} risks tracked</div>
                    </div>
                </div>
                <div style="padding: var(--spacing-md); background: var(--color-bg-secondary); border-radius: 8px; text-align: center;">
                    <a href="#risks" style="color: var(--color-accent); text-decoration: underline;">Review all risks →</a>
                </div>
            </div>
        </div>
        
        <!-- Decision Criteria -->
        <div class="card">
            <h3 style="margin-bottom: var(--spacing-lg);">✅ Decision Checklist</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
                <div>
                    <h4 style="color: var(--color-success); margin-bottom: var(--spacing-md);">Your Analysis is Complete If:</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                <input type="checkbox" id="check-matrix" style="width: 20px; height: 20px;">
                                <span>Customized weights in Decision Matrix</span>
                            </label>
                        </li>
                        <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                <input type="checkbox" id="check-scores" style="width: 20px; height: 20px;">
                                <span>Adjusted scores to match your assessment</span>
                            </label>
                        </li>
                        <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                <input type="checkbox" id="check-tco" style="width: 20px; height: 20px;">
                                <span>Configured TCO with your team & rates</span>
                            </label>
                        </li>
                        <li style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border);">
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                <input type="checkbox" id="check-risks" style="width: 20px; height: 20px;">
                                <span>Reviewed and updated Risk Register</span>
                            </label>
                        </li>
                        <li style="padding: var(--spacing-sm) 0;">
                            <label style="display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer;">
                                <input type="checkbox" id="check-recommendation" style="width: 20px; height: 20px;">
                                <span>Generated Executive Recommendation</span>
                            </label>
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h4 style="color: var(--color-warning); margin-bottom: var(--spacing-md);">Before Finalizing, Consider:</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: var(--spacing-md); margin-bottom: var(--spacing-sm); background: rgba(251, 191, 36, 0.1); border-left: 3px solid var(--color-warning); border-radius: 4px;">
                            <strong>Team Capabilities:</strong> Does your team have the skills needed?
                        </li>
                        <li style="padding: var(--spacing-md); margin-bottom: var(--spacing-sm); background: rgba(251, 191, 36, 0.1); border-left: 3px solid var(--color-warning); border-radius: 4px;">
                            <strong>Timeline Constraints:</strong> Does this fit your go-live date?
                        </li>
                        <li style="padding: var(--spacing-md); margin-bottom: var(--spacing-sm); background: rgba(251, 191, 36, 0.1); border-left: 3px solid var(--color-warning); border-radius: 4px;">
                            <strong>Budget Reality:</strong> Is the TCO within budget?
                        </li>
                        <li style="padding: var(--spacing-md); background: rgba(251, 191, 36, 0.1); border-left: 3px solid var(--color-warning); border-radius: 4px;">
                            <strong>Risk Tolerance:</strong> Can you mitigate high-impact risks?
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Final Decision Form -->
        <div class="card" style="border: 2px solid var(--color-accent);">
            <h3 style="margin-bottom: var(--spacing-lg);">🎯 Make Your Final Decision</h3>
            <form id="final-decision-form">
                <div class="form-group">
                    <label style="font-size: 1.1rem; font-weight: 600;">
                        <span style="color: var(--color-danger);">*</span> I hereby decide to proceed with:
                    </label>
                    <div style="display: flex; gap: var(--spacing-lg); margin-top: var(--spacing-md);">
                        <label style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-lg); border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; flex: 1; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-highlight-a)'; this.style.background='rgba(99, 102, 241, 0.05)';" onmouseout="this.style.borderColor='var(--color-border)'; this.style.background='transparent';">
                            <input type="radio" name="final-choice" value="Vanilla JS + Web API" required style="width: 24px; height: 24px;">
                            <div>
                                <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-highlight-a);">Vanilla JS + Web API</div>
                                <div style="font-size: 0.85rem; color: var(--color-text-muted);">Buildless, performance-focused approach</div>
                            </div>
                        </label>
                        
                        <label style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-lg); border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; flex: 1; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-highlight-b)'; this.style.background='rgba(139, 92, 246, 0.05)';" onmouseout="this.style.borderColor='var(--color-border)'; this.style.background='transparent';">
                            <input type="radio" name="final-choice" value=".NET Core + Angular/React" required style="width: 24px; height: 24px;">
                            <div>
                                <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-highlight-b);">.NET Core + Angular/React</div>
                                <div style="font-size: 0.85rem; color: var(--color-text-muted);">Framework-based, enterprise approach</div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="decision-rationale">
                        <span style="color: var(--color-danger);">*</span> Decision Rationale (Why this choice?)
                    </label>
                    <textarea 
                        id="decision-rationale" 
                        rows="4" 
                        required
                        placeholder="Explain your reasoning based on the analysis (scores, TCO, risks, team capabilities, etc.)..."
                    ></textarea>
                </div>
                
                <div class="form-group">
                    <label for="decision-stakeholders">Key Stakeholders (Who needs to approve/be informed?)</label>
                    <input 
                        type="text" 
                        id="decision-stakeholders" 
                        placeholder="e.g., CTO, Engineering Manager, Project Sponsor, Development Team"
                    >
                </div>
                
                <div class="form-group">
                    <label for="decision-timeline">Implementation Timeline</label>
                    <input 
                        type="text" 
                        id="decision-timeline" 
                        placeholder="e.g., POC in 2 weeks, Full implementation starting Q2 2025"
                    >
                </div>
                
                <div class="form-group">
                    <label for="decision-next-steps">Immediate Next Steps</label>
                    <textarea 
                        id="decision-next-steps" 
                        rows="3"
                        placeholder="e.g., 1. Get stakeholder approval, 2. Set up dev environment, 3. Begin proof-of-concept..."
                    ></textarea>
                </div>
                
                <div style="border-top: 2px solid var(--color-border); padding-top: var(--spacing-lg); margin-top: var(--spacing-lg);">
                    <label style="display: flex; align-items: start; gap: var(--spacing-md); cursor: pointer;">
                        <input type="checkbox" id="decision-confirm" required style="width: 20px; height: 20px; margin-top: 2px;">
                        <span style="font-size: 0.95rem;">
                            I confirm that I have reviewed all analysis tabs (Decision Matrix, TCO Model, Risk Register) and 
                            this decision is based on comprehensive evaluation of both approaches for our specific context.
                        </span>
                    </label>
                </div>
                
                <div class="btn-group" style="margin-top: var(--spacing-xl);">
                    <button type="submit" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                        ✅ Finalize Decision
                    </button>
                    <button type="button" class="btn btn-secondary" id="export-decision-btn" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                        💾 Export Decision Document
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Success Message (Hidden Initially) -->
        <div id="decision-success" style="display: none;">
            <div class="card" style="background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%); border: 3px solid var(--color-success); text-align: center; padding: var(--spacing-2xl);">
                <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">🎉</div>
                <h3 style="font-size: 2rem; color: var(--color-success); margin-bottom: var(--spacing-lg);">
                    Decision Finalized!
                </h3>
                <div style="font-size: 1.2rem; margin-bottom: var(--spacing-xl);" id="decision-summary"></div>
                <div class="btn-group" style="justify-content: center;">
                    <button class="btn btn-success" onclick="window.print()" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                        🖨️ Print Decision
                    </button>
                    <button class="btn btn-secondary" id="download-decision-btn" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                        📥 Download Document
                    </button>
                    <button class="btn btn-secondary" onclick="location.reload()" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                        🔄 Start New Analysis
                    </button>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners(container);
}

function attachEventListeners(container) {
    const form = container.querySelector('#final-decision-form');
    const exportBtn = container.querySelector('#export-decision-btn');
    
    if (form) {
        form.addEventListener('submit', handleDecisionSubmit);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDecisionDocument);
    }
}

function handleDecisionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const decision = {
        choice: formData.get('final-choice'),
        rationale: document.getElementById('decision-rationale').value,
        stakeholders: document.getElementById('decision-stakeholders').value,
        timeline: document.getElementById('decision-timeline').value,
        nextSteps: document.getElementById('decision-next-steps').value,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        analysis: {
            criteria: store.getState().criteria,
            tco: store.getState().tcoInputs,
            risks: store.getState().risks
        }
    };
    
    // Store decision
    localStorage.setItem('erp-final-decision', JSON.stringify(decision));
    
    // Show success message
    const successDiv = document.getElementById('decision-success');
    const summaryDiv = document.getElementById('decision-summary');
    const formCard = e.target.closest('.card');
    
    summaryDiv.innerHTML = `
        <strong>Selected Approach:</strong> ${decision.choice}<br>
        <strong>Decision Date:</strong> ${decision.date}<br>
        <strong>Next Steps:</strong> ${decision.nextSteps || 'Pending'}
    `;
    
    formCard.style.display = 'none';
    successDiv.style.display = 'block';
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Setup download button
    const downloadBtn = document.getElementById('download-decision-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => downloadDecision(decision));
    }
}

function exportDecisionDocument() {
    const form = document.getElementById('final-decision-form');
    const formData = new FormData(form);
    
    if (!formData.get('final-choice')) {
        alert('Please select your final decision before exporting.');
        return;
    }
    
    const decision = {
        choice: formData.get('final-choice'),
        rationale: document.getElementById('decision-rationale').value,
        stakeholders: document.getElementById('decision-stakeholders').value,
        timeline: document.getElementById('decision-timeline').value,
        nextSteps: document.getElementById('decision-next-steps').value,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        analysis: {
            criteria: store.getState().criteria,
            tco: store.getState().tcoInputs,
            risks: store.getState().risks
        }
    };
    
    downloadDecision(decision);
}

function downloadDecision(decision) {
    const state = store.getState();
    
    // Calculate scores
    let vanillaWeighted = 0, dotnetWeighted = 0, totalWeight = 0;
    state.criteria.forEach(c => {
        vanillaWeighted += c.weight * c.scores.vanilla;
        dotnetWeighted += c.weight * c.scores.dotnet;
        totalWeight += c.weight;
    });
    
    const vanillaScore = (vanillaWeighted / totalWeight).toFixed(1);
    const dotnetScore = (dotnetWeighted / totalWeight).toFixed(1);
    
    const document = `
═══════════════════════════════════════════════════════════════
  FINAL ERP TECHNOLOGY STACK DECISION
═══════════════════════════════════════════════════════════════

Decision Date: ${decision.date}
Document Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════════
  EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

FINAL DECISION: ${decision.choice.toUpperCase()}

Decision Rationale:
${decision.rationale}

Key Stakeholders:
${decision.stakeholders || 'Not specified'}

Implementation Timeline:
${decision.timeline || 'To be determined'}

═══════════════════════════════════════════════════════════════
  SUPPORTING ANALYSIS
═══════════════════════════════════════════════════════════════

1. WEIGHTED DECISION MATRIX RESULTS
   ────────────────────────────────
   Vanilla JS + Web API:     ${vanillaScore} / 10
   .NET Core + Angular/React: ${dotnetScore} / 10
   
   Lead: ${vanillaScore > dotnetScore ? 'Vanilla JS' : '.NET + SPA'} by ${Math.abs(vanillaScore - dotnetScore).toFixed(1)} points

2. TOTAL COST OF OWNERSHIP (Year 1)
   ────────────────────────────────
   Team Size: ${state.tcoInputs.teamSize} developers
   Blended Rate: $${state.tcoInputs.blendedRate}/hour
   
   [TCO calculations included in analysis]

3. RISK ASSESSMENT
   ────────────────────────────────
   Total Risks Identified: ${state.risks.length}
   - Vanilla JS Risks: ${state.risks.filter(r => r.approach.includes('Vanilla')).length}
   - .NET + SPA Risks: ${state.risks.filter(r => r.approach.includes('.NET')).length}
   
   High Impact Risks Requiring Immediate Attention:
   ${state.risks.filter(r => r.impact === 'High').map((r, i) => `
   ${i + 1}. ${r.risk} (${r.approach})
      Mitigation: ${r.mitigation}
      Owner: ${r.owner}
   `).join('')}

═══════════════════════════════════════════════════════════════
  IMMEDIATE NEXT STEPS
═══════════════════════════════════════════════════════════════

${decision.nextSteps || 'To be defined by the implementation team'}

═══════════════════════════════════════════════════════════════
  SIGN-OFF
═══════════════════════════════════════════════════════════════

This decision was made after comprehensive analysis using the 
ERP Tech Stack Comparison Tool, including:
  ✓ Customized weighted decision matrix
  ✓ Total cost of ownership modeling
  ✓ Risk assessment and mitigation planning
  ✓ Team capabilities evaluation

Decision Confirmed: ${decision.date}

Approved By: _________________________    Date: __________

═══════════════════════════════════════════════════════════════
End of Decision Document
═══════════════════════════════════════════════════════════════
    `.trim();
    
    const blob = new Blob([document], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ERP-Final-Decision-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatNumber(num) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

