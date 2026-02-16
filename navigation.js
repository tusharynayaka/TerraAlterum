async function loadNavigation() {
    // Fallback navigation in case config.json fails to load
    const fallbackNav = [
        { "label": "🏠 Home", "link": "/index.html" },
        { "label": "🌍 Globe Explorer", "link": "/globe.html" },
        { "label": "🌦️ Weather", "link": "/open.html" },
        { "label": "🤖 ML Insights", "link": "/ML.html" },
        { "label": "🚀 Simulation", "link": "/simulation.html" },
        { "label": "📞 Contact", "link": "/Contact.html" }
    ];

    try {
        // Try to fetch config.json with relative path
        const response = await fetch('./config.json');

        if (!response.ok) {
            throw new Error('Config not found, using fallback');
        }

        const config = await response.json();
        const navUl = document.querySelector('nav ul');

        if (navUl && config.navigation) {
            navUl.innerHTML = config.navigation.map(item => `
                <li><a href="${item.link}">${item.label}</a></li>
            `).join('');
        } else {
            // Use fallback if config doesn't have navigation
            renderFallbackNav(navUl);
        }

        // Apply standard styles if needed
        applyNavStyles();
    } catch (error) {
        console.warn('Failed to load navigation from config.json, using fallback:', error);
        const navUl = document.querySelector('nav ul');
        renderFallbackNav(navUl);
        applyNavStyles();
    }
}

function renderFallbackNav(navUl) {
    const fallbackNav = [
        { "label": "🏠 Home", "link": "/index.html" },
        { "label": "🌍 Globe Explorer", "link": "/globe.html" },
        { "label": "🌦️ Weather", "link": "/open.html" },
        { "label": "🤖 ML Insights", "link": "/ML.html" },
        { "label": "🚀 Simulation", "link": "/simulation.html" },
        { "label": "📞 Contact", "link": "/Contact.html" }
    ];

    if (navUl) {
        navUl.innerHTML = fallbackNav.map(item => `
            <li><a href="${item.link}">${item.label}</a></li>
        `).join('');
    }
}

function applyNavStyles() {
    // Only apply styles if the page doesn't have custom nav styles
    if (!document.querySelector('.navbar-custom') && !document.getElementById('nav-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-styles';
        style.textContent = `
            nav {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 1rem 2rem;
                position: sticky;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                width: 100%;
            }
            nav ul {
                list-style: none;
                display: flex;
                justify-content: center;
                gap: 2rem;
                flex-wrap: wrap;
                margin: 0;
                padding: 0;
            }
            nav a {
                color: white !important;
                text-decoration: none;
                font-weight: 600;
                transition: opacity 0.3s ease;
                font-size: 1.1rem;
            }
            nav a:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', loadNavigation);
