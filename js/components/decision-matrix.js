// ========================================
// Decision Matrix Component
// ========================================

import { store } from '../app.js';

export function initDecisionMatrix(container) {
    render(container);
    
    // Subscribe to state changes
    store.subscribe('criteria', () => render(container));
}

function render(container) {
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
    updateResults();
    
    // Attach event listeners
    attachEventListeners(container);
}

function createMatrixItem(criterion, index) {
    const item = document.createElement('div');
    item.className = 'matrix-item';
    
    item.innerHTML = `
        <h4>${criterion.name}</h4>
        <div class="matrix-row">
            <div class="slider-group">
                <div class="slider-label">
                    <span>Weight</span>
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
                    <span>Vanilla JS Score</span>
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
                    <span>.NET + SPA Score</span>
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
        slider.addEventListener('input', handleSliderChange);
    });
    
    return item;
}

function handleSliderChange(e) {
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
    updateResults();
}

function updateResults() {
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

function attachEventListeners(container) {
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

