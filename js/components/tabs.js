// ========================================
// Tabs Component
// ========================================

const tabs = [
    { id: 'intro', label: 'Overview', icon: '📋' },
    { id: 'criteria', label: 'Criteria', icon: '🎯' },
    { id: 'deep-dive', label: 'Deep Dive', icon: '🔍' },
    { id: 'matrix', label: 'Decision Matrix', icon: '📊' },
    { id: 'tco', label: 'TCO Model', icon: '💰' },
    { id: 'risks', label: 'Risks', icon: '⚠️' },
    { id: 'hiring', label: 'Hiring', icon: '👥' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'testing', label: 'Testing', icon: '✅' },
    { id: 'how-vanilla', label: 'Vanilla Guide', icon: '🛠️' },
    { id: 'recommendation', label: 'Recommendation', icon: '📝' }
];

export function initTabs() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    
    const tabsNav = document.createElement('div');
    tabsNav.className = 'tabs';
    tabsNav.setAttribute('role', 'tablist');
    
    tabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.dataset.tab = tab.id;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', tab.id);
        button.setAttribute('aria-selected', 'false');
        button.textContent = `${tab.icon} ${tab.label}`;
        
        button.addEventListener('click', () => {
            window.location.hash = tab.id;
        });
        
        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
            let targetButton = null;
            const buttons = Array.from(tabsNav.querySelectorAll('.tab-button'));
            const currentIndex = buttons.indexOf(button);
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetButton = buttons[currentIndex - 1] || buttons[buttons.length - 1];
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetButton = buttons[currentIndex + 1] || buttons[0];
                    break;
                case 'Home':
                    e.preventDefault();
                    targetButton = buttons[0];
                    break;
                case 'End':
                    e.preventDefault();
                    targetButton = buttons[buttons.length - 1];
                    break;
            }
            
            if (targetButton) {
                targetButton.focus();
                targetButton.click();
            }
        });
        
        tabsNav.appendChild(button);
    });
    
    container.appendChild(tabsNav);
}

