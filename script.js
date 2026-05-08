async function initSchedule() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        renderTabs(data);
        renderContent(data);
        setupTabs();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function renderTabs(data) {
    const container = document.getElementById('tabs-container');
    container.innerHTML = data.map((day, index) => `
        <button class="tab-btn ${index === 0 ? 'active' : ''}" data-target="${day.id}">
            ${day.name}
        </button>
    `).join('');
}

function renderContent(data) {
    const container = document.getElementById('schedule-content');
    
    container.innerHTML = data.map((day, index) => `
        <div id="${day.id}" class="schedule-day ${index === 0 ? 'active' : ''}">
            ${day.events.map(event => renderEventRow(event)).join('')}
        </div>
    `).join('');
}

function renderEventRow(event) {
    let content = '';
    
    if (event.type === 'announcement') {
        content = `
            <div class="card card-announcement">
                <div class="stage-name">${event.stage}</div>
                <div class="event-title">${event.title}</div>
            </div>
        `;
    } else if (event.type === 'keynote') {
        const speaker = event.speakers[0];
        content = `
            <div class="card card-keynote">
                <div class="card-header" style="background-color: rgba(38, 54, 0, 0.4);">
                    <span class="stage-name">${event.stage}</span>
                </div>
                <div class="keynote-body">
                    <div class="keynote-content">
                        <div class="keynote-speaker-info">
                            <img src="${speaker.photo}" class="speaker-photo photo-keynote" alt="${speaker.name}">
                            <div class="speaker-details">
                                <span class="tag">${speaker.tag}</span>
                                <div class="speaker-name">${speaker.name}</div>
                                <div class="speaker-role">${speaker.role}</div>
                            </div>
                        </div>
                        <div class="keynote-title">${event.title}</div>
                    </div>
                </div>
            </div>
        `;
    } else if (event.type === 'normal') {
        content = event.cards.map(card => {
            const themeMap = { 'incorporação': 'incorp', 'vendas': 'vendas', 'painel': 'painel', 'empreendedorismo': 'emp', 'aluguel': 'aluguel', 'soluções': 'solucoes' };
            
            // Find the first theme that exists in our themeMap
            let themeClass = 'incorp'; // default
            for(let t of card.themes) {
                const normalized = t.toLowerCase();
                if(themeMap[normalized]) {
                    themeClass = themeMap[normalized];
                    break;
                }
            }

            return `
            <div class="card card-normal theme-${themeClass}">
                <div class="card-header" style="background-color: var(--theme-${themeClass})">
                    <span class="stage-name">${card.stage}</span>
                    <div class="theme-container">
                        ${card.themes.map(t => `<span class="theme-tag">${t}</span>`).join('')}
                    </div>
                </div>
                <div class="card-body">
                    <div class="event-title">${card.title}</div>
                    <div class="speakers-container" style="display: flex; flex-direction: column; gap: 15px;">
                        ${card.speakers.map(speaker => `
                            <div class="normal-speaker-info">
                                <img src="${speaker.photo}" class="speaker-photo photo-normal" alt="${speaker.name}">
                                <div class="speaker-details">
                                    <div class="speaker-name">${speaker.name}</div>
                                    <div class="speaker-role">${speaker.role}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } else if (event.type === 'break') {
        const iconUrl = event.photo || 'https://cupolasummit.com.br/wp-content/uploads/2026/04/almoco-vetor.svg';
        content = `
            <div class="card card-announcement">
                <div class="timeline-break" style="padding: 0;">
                    <div class="break-icon" style="background-color: var(--theme-incorp); border: none; overflow: hidden; width: 44px; height: 44px;">
                        <img src="${iconUrl}" alt="icon" style="width: 100%; height: 100%; object-fit: contain; padding: 10px;">
                    </div>
                    <div class="break-text" style="color: var(--text-dark);">${event.title}</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="timeline-row">
            <div class="timeline-time"><span class="time-badge">${event.time}</span></div>
            <div class="timeline-cards" style="${event.type !== 'normal' ? 'grid-template-columns: 1fr' : ''}">
                ${content}
            </div>
        </div>
    `;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const days = document.querySelectorAll('.schedule-day');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            days.forEach(day => day.classList.remove('active'));
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', initSchedule);
