// ========================================
// Risk Register Component
// ========================================

import { store } from '../app.js';

export function initRiskRegister(container) {
    render(container);
    
    // Subscribe to state changes
    store.subscribe('risks', () => render(container));
}

function render(container) {
    const risks = store.getState().risks;
    
    container.innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
                <div>
                    <h3 style="margin: 0;">Risk Management</h3>
                    <p style="margin: var(--spacing-sm) 0 0 0; color: var(--color-text-secondary);">
                        Track and mitigate risks for both approaches
                    </p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" id="add-risk-btn">
                        ➕ Add Risk
                    </button>
                    <button class="btn btn-secondary" id="export-risks-btn">
                        💾 Export
                    </button>
                    <button class="btn btn-secondary" id="import-risks-btn">
                        📥 Import
                    </button>
                </div>
            </div>
            <input type="file" id="risks-file-input" accept=".json" style="display: none;">
        </div>
        
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Approach</th>
                        <th>Risk</th>
                        <th>Probability</th>
                        <th>Impact</th>
                        <th>Mitigation</th>
                        <th>Owner</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="risks-tbody">
                    ${risks.map(risk => createRiskRow(risk)).join('')}
                </tbody>
            </table>
        </div>
        
        ${risks.length === 0 ? '<p class="text-center" style="color: var(--color-text-muted); margin-top: var(--spacing-xl);">No risks added yet. Click "Add Risk" to get started.</p>' : ''}
    `;
    
    // Attach event listeners
    attachEventListeners(container);
}

function createRiskRow(risk) {
    const probabilityColor = 
        risk.probability === 'High' ? 'var(--color-danger)' :
        risk.probability === 'Medium' ? 'var(--color-warning)' :
        'var(--color-success)';
    
    const impactColor = 
        risk.impact === 'High' ? 'var(--color-danger)' :
        risk.impact === 'Medium' ? 'var(--color-warning)' :
        'var(--color-success)';
    
    const approachBadgeClass = risk.approach.includes('Vanilla') ? 'approach-a' : 'approach-b';
    
    return `
        <tr data-risk-id="${risk.id}">
            <td><span class="badge ${approachBadgeClass}">${escapeHtml(risk.approach)}</span></td>
            <td>${escapeHtml(risk.risk)}</td>
            <td><span style="color: ${probabilityColor}; font-weight: 600;">⚠ ${escapeHtml(risk.probability)}</span></td>
            <td><span style="color: ${impactColor}; font-weight: 600;">⚡ ${escapeHtml(risk.impact)}</span></td>
            <td>${escapeHtml(risk.mitigation)}</td>
            <td>${escapeHtml(risk.owner)}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: var(--font-size-sm);" data-action="edit" data-risk-id="${risk.id}">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: var(--font-size-sm);" data-action="delete" data-risk-id="${risk.id}">
                    🗑️
                </button>
            </td>
        </tr>
    `;
}

function attachEventListeners(container) {
    // Add risk button
    const addBtn = container.querySelector('#add-risk-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => showRiskModal());
    }
    
    // Export button
    const exportBtn = container.querySelector('#export-risks-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportRisks);
    }
    
    // Import button
    const importBtn = container.querySelector('#import-risks-btn');
    const fileInput = container.querySelector('#risks-file-input');
    if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleImportRisks);
    }
    
    // Edit and delete buttons
    const tbody = container.querySelector('#risks-tbody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-action]');
            if (!button) return;
            
            const action = button.dataset.action;
            const riskId = button.dataset.riskId;
            
            if (action === 'edit') {
                editRisk(riskId);
            } else if (action === 'delete') {
                deleteRisk(riskId);
            }
        });
    }
}

function showRiskModal(existingRisk = null) {
    const isEdit = !!existingRisk;
    const risk = existingRisk || {
        id: '',
        approach: 'Vanilla JS',
        risk: '',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: '',
        owner: ''
    };
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: var(--spacing-lg);
    `;
    
    modal.innerHTML = `
        <div class="card" style="max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <h3>${isEdit ? 'Edit Risk' : 'Add New Risk'}</h3>
            <form id="risk-form">
                <div class="form-group">
                    <label for="risk-approach">Approach</label>
                    <select id="risk-approach" required>
                        <option value="Vanilla JS" ${risk.approach === 'Vanilla JS' ? 'selected' : ''}>Vanilla JS</option>
                        <option value=".NET + SPA" ${risk.approach === '.NET + SPA' ? 'selected' : ''}>.NET + SPA</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="risk-description">Risk Description</label>
                    <textarea id="risk-description" required>${risk.risk}</textarea>
                </div>
                <div class="form-group">
                    <label for="risk-probability">Probability</label>
                    <select id="risk-probability" required>
                        <option value="Low" ${risk.probability === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Medium" ${risk.probability === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="High" ${risk.probability === 'High' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="risk-impact">Impact</label>
                    <select id="risk-impact" required>
                        <option value="Low" ${risk.impact === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Medium" ${risk.impact === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="High" ${risk.impact === 'High' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="risk-mitigation">Mitigation Strategy</label>
                    <textarea id="risk-mitigation" required>${risk.mitigation}</textarea>
                </div>
                <div class="form-group">
                    <label for="risk-owner">Owner</label>
                    <input type="text" id="risk-owner" value="${risk.owner}" required>
                </div>
                <div class="btn-group" style="margin-top: var(--spacing-lg);">
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? '💾 Save Changes' : '➕ Add Risk'}
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancel-risk-btn">
                        ❌ Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus first input
    setTimeout(() => {
        modal.querySelector('#risk-approach').focus();
    }, 100);
    
    // Handle form submission
    const form = modal.querySelector('#risk-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newRisk = {
            id: isEdit ? risk.id : `risk-${Date.now()}`,
            approach: form.querySelector('#risk-approach').value,
            risk: form.querySelector('#risk-description').value,
            probability: form.querySelector('#risk-probability').value,
            impact: form.querySelector('#risk-impact').value,
            mitigation: form.querySelector('#risk-mitigation').value,
            owner: form.querySelector('#risk-owner').value
        };
        
        const risks = [...store.getState().risks];
        
        if (isEdit) {
            const index = risks.findIndex(r => r.id === risk.id);
            if (index !== -1) {
                risks[index] = newRisk;
            }
        } else {
            risks.push(newRisk);
        }
        
        store.setState({ risks });
        document.body.removeChild(modal);
    });
    
    // Handle cancel
    const cancelBtn = modal.querySelector('#cancel-risk-btn');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Handle click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function editRisk(riskId) {
    const risks = store.getState().risks;
    const risk = risks.find(r => r.id === riskId);
    if (risk) {
        showRiskModal(risk);
    }
}

function deleteRisk(riskId) {
    if (!confirm('Are you sure you want to delete this risk?')) return;
    
    const risks = store.getState().risks.filter(r => r.id !== riskId);
    store.setState({ risks });
}

function exportRisks() {
    const risks = store.getState().risks;
    const dataStr = JSON.stringify(risks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-register-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleImportRisks(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const risks = JSON.parse(event.target.result);
            store.setState({ risks });
            alert('Risks imported successfully!');
        } catch (error) {
            alert('Error importing risks: Invalid JSON file');
            console.error(error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

