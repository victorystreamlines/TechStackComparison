// ========================================
// KPI Cards Component
// ========================================

import { store } from '../app.js';

export function renderKPICards(container) {
    const criteria = store.getState().criteria;
    
    const grid = document.createElement('div');
    grid.className = 'kpi-grid';
    
    criteria.forEach(criterion => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        
        card.innerHTML = `
            <h3>${criterion.name}</h3>
            <p>${criterion.description}</p>
        `;
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

