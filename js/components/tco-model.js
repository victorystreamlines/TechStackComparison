// ========================================
// TCO Model Component
// ========================================

import { store } from '../app.js';

export function initTCOModel(container) {
    render(container);
    
    // Subscribe to state changes
    store.subscribe('tcoInputs', () => render(container));
}

function render(container) {
    const inputs = store.getState().tcoInputs;
    
    container.innerHTML = `
        <div class="card">
            <h3>TCO Assumptions</h3>
            <p class="mb-0">Adjust the inputs below to model costs for your specific scenario. All monetary values in USD (thousands).</p>
        </div>
        
        <div class="intro-grid">
            <div class="card">
                <h4>Team & Setup</h4>
                <div class="form-group">
                    <label for="tco-team-size">
                        Team Size (Developers)
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
                        Blended Hourly Rate ($)
                    </label>
                    <input 
                        type="number" 
                        id="tco-blended-rate" 
                        min="50" 
                        max="300" 
                        value="${inputs.blendedRate}"
                        data-field="blendedRate"
                    >
                </div>
                <div class="form-group">
                    <label for="tco-setup-months">
                        Setup & Configuration (Months)
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
                        Vanilla JS Velocity Multiplier
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
                        .NET + SPA Velocity Multiplier
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
                        Year 1 Maintenance (% of build cost)
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
                        Year 3 Maintenance (% of build cost)
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
        input.addEventListener('input', handleInputChange);
    });
    
    // Calculate and render results
    renderResults(container);
}

function handleInputChange(e) {
    const field = e.target.dataset.field;
    let value = parseFloat(e.target.value);
    
    if (isNaN(value)) return;
    
    const inputs = { ...store.getState().tcoInputs };
    inputs[field] = value;
    
    store.setState({ tcoInputs: inputs });
}

function renderResults(container) {
    const inputs = store.getState().tcoInputs;
    const resultsContainer = container.querySelector('#tco-results');
    
    // Calculate costs
    const hoursPerMonth = 160; // Standard work month
    const monthlyBurnRate = inputs.teamSize * hoursPerMonth * inputs.blendedRate;
    
    // Vanilla JS costs
    const vanillaSetupCost = (inputs.setupMonths * 0.5) * monthlyBurnRate; // Less setup
    const vanillaBuildMonths = 12 / inputs.vanillaVelocity;
    const vanillaBuildCost = vanillaBuildMonths * monthlyBurnRate;
    const vanillaTotalBuild = vanillaSetupCost + vanillaBuildCost;
    const vanillaYear1Maint = vanillaTotalBuild * (inputs.year1Maintenance / 100);
    const vanillaYear3Maint = vanillaTotalBuild * (inputs.year3Maintenance / 100);
    const vanillaYear1Total = vanillaTotalBuild + vanillaYear1Maint;
    const vanillaYear3Total = vanillaTotalBuild + (vanillaYear1Maint + vanillaYear3Maint * 2);
    
    // .NET + SPA costs
    const dotnetSetupCost = inputs.setupMonths * monthlyBurnRate; // Full setup
    const dotnetBuildMonths = 12 / inputs.dotnetVelocity;
    const dotnetBuildCost = dotnetBuildMonths * monthlyBurnRate;
    const dotnetTotalBuild = dotnetSetupCost + dotnetBuildCost;
    const dotnetYear1Maint = dotnetTotalBuild * (inputs.year1Maintenance / 100);
    const dotnetYear3Maint = dotnetTotalBuild * (inputs.year3Maintenance / 100);
    const dotnetYear1Total = dotnetTotalBuild + dotnetYear1Maint;
    const dotnetYear3Total = dotnetTotalBuild + (dotnetYear1Maint + dotnetYear3Maint * 2);
    
    const maxYear1 = Math.max(vanillaYear1Total, dotnetYear1Total);
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
                            <span>$${formatNumber(vanillaYear1Total)}K</span>
                        </div>
                        <div class="chart-bar-visual">
                            <div class="chart-bar-fill" style="width: ${(vanillaYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);">
                                Setup: $${formatNumber(vanillaSetupCost)}K | Build: $${formatNumber(vanillaBuildCost)}K | Maint: $${formatNumber(vanillaYear1Maint)}K
                            </div>
                        </div>
                    </div>
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">
                            <span><strong>.NET + SPA</strong></span>
                            <span>$${formatNumber(dotnetYear1Total)}K</span>
                        </div>
                        <div class="chart-bar-visual">
                            <div class="chart-bar-fill" style="width: ${(dotnetYear1Total / maxYear1 * 100)}%; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);">
                                Setup: $${formatNumber(dotnetSetupCost)}K | Build: $${formatNumber(dotnetBuildCost)}K | Maint: $${formatNumber(dotnetYear1Maint)}K
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chart-container">
                <h4>Year 3 Total Cost of Ownership</h4>
                <div class="chart-bars">
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">
                            <span><strong>Vanilla JS</strong></span>
                            <span>$${formatNumber(vanillaYear3Total)}K</span>
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
                            <span>$${formatNumber(dotnetYear3Total)}K</span>
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
                    <li>Year 1 difference: <strong>$${formatNumber(Math.abs(vanillaYear1Total - dotnetYear1Total))}K</strong> 
                        ${vanillaYear1Total < dotnetYear1Total ? '(Vanilla JS cheaper)' : '(.NET + SPA cheaper)'}</li>
                    <li>Year 3 difference: <strong>$${formatNumber(Math.abs(vanillaYear3Total - dotnetYear3Total))}K</strong> 
                        ${vanillaYear3Total < dotnetYear3Total ? '(Vanilla JS cheaper)' : '(.NET + SPA cheaper)'}</li>
                    <li>Monthly burn rate: <strong>$${formatNumber(monthlyBurnRate)}K</strong></li>
                    <li>Vanilla JS build time: <strong>${vanillaBuildMonths.toFixed(1)} months</strong></li>
                    <li>.NET + SPA build time: <strong>${dotnetBuildMonths.toFixed(1)} months</strong></li>
                </ul>
                <p><em>Note: These are estimates. Actual costs vary based on team experience, requirements complexity, and organizational factors.</em></p>
            </div>
        </div>
    `;
}

function formatNumber(num) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

