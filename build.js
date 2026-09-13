const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;

// Read JSON Data
const dictionary = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/dictionary.json'), 'utf8'));
const rights = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/rights.json'), 'utf8'));
const laws = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/laws.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/guides.json'), 'utf8'));
const architectsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/architects.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/articles.json'), 'utf8'));

// Ensure Output Subdirectories Exist
['dictionary', 'know-your-rights', 'laws', 'legal-guides', 'blog'].forEach(dir => {
    const fullPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// BASE SCHEMAS
const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NYAYI Legal AI",
    "url": "https://nyayi.in/",
    "logo": "https://nyayi.in/images/logo.png",
    "founder": {
        "@type": "Person",
        "name": "Farhan Khan"
    },
    "description": "India's premier AI legal knowledge platform providing accessible legal guidance, BNS mapping, and constitutional rights."
};

const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NYAYI Legal Knowledge Platform",
    "url": "https://nyayi.in/",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nyayi.in/dictionary.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

// COMMON RENDERING HELPERS
function renderHead(title, description, keywords, pathUrl, extraSchemas = []) {
    const canonical = `https://nyayi.in${pathUrl}`;
    const schemas = [orgSchema, webSiteSchema, ...extraSchemas];
    const schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n    ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | NYAYI</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="Farhan Khan">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonical}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://nyayi.in/images/logo.png">

    <!-- Fonts & Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/styles.css">
    
    ${schemaScripts}
</head>
<body>`;
}

function renderHeader(activePage = '') {
    return `
    <div class="mobile-drawer" id="mobileDrawer">
        <div class="close-drawer" onclick="toggleMenu()"><i class="fas fa-times"></i></div>
        <a href="/" onclick="toggleMenu()">Home</a>
        <a href="/features.html" onclick="toggleMenu()">Features</a>
        <a href="/dictionary.html" onclick="toggleMenu()">Dictionary</a>
        <a href="/rights.html" onclick="toggleMenu()">Know Rights</a>
        <a href="/laws/" onclick="toggleMenu()">Laws Library</a>
        <a href="/legal-guides/" onclick="toggleMenu()">Guides</a>
        <a href="/articles.html" onclick="toggleMenu()">Articles</a>
        <a href="/about.html" onclick="toggleMenu()">About</a>
        <a href="/contact.html" onclick="toggleMenu()">Contact</a>
        <a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary); font-weight:900; margin-top:20px;">Launch NYAYI AI <i class="fas fa-arrow-up-right-from-square"></i></a>
    </div>

    <header class="site-header">
        <div class="nav-capsule">
            <a href="/" class="logo">
                <i class="fas fa-scale-balanced"></i> NYAYI<span>.</span>
            </a>
            
            <ul class="nav-links">
                <li><a href="/" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
                <li><a href="/features.html" class="${activePage === 'features' ? 'active' : ''}">Features</a></li>
                <li><a href="/dictionary.html" class="${activePage === 'dictionary' ? 'active' : ''}">Dictionary</a></li>
                <li><a href="/rights.html" class="${activePage === 'rights' ? 'active' : ''}">Rights</a></li>
                <li><a href="/laws/" class="${activePage === 'laws' ? 'active' : ''}">Laws</a></li>
                <li><a href="/legal-guides/" class="${activePage === 'guides' ? 'active' : ''}">Guides</a></li>
                <li><a href="/about.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
            </ul>

            <div style="display:flex; align-items:center; gap:12px;">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-launch">
                    <i class="fas fa-rocket"></i> Launch NYAYI AI
                </a>
                <div class="menu-toggle" onclick="toggleMenu()"><i class="fas fa-bars"></i></div>
            </div>
        </div>
    </header>`;
}

function renderArchitectsSection() {
    const archCards = architectsData.architects.map(a => `
        <div class="architect-card">
            <div>
                <div class="arch-header">
                    <div class="arch-avatar"><i class="fas ${a.icon}"></i></div>
                    <div class="arch-info">
                        <h3>${a.name}</h3>
                        <span class="arch-role">${a.role}</span>
                    </div>
                </div>
                <p class="arch-desc">${a.description}</p>
            </div>
            <div class="arch-actions">
                <a href="${a.instagram}" target="_blank" class="arch-btn"><i class="fab fa-instagram"></i> View Profile</a>
                <a href="tel:${a.phone}" class="arch-btn"><i class="fas fa-phone"></i> Direct Contact</a>
            </div>
        </div>
    `).join('');

    return `
    <section class="architects-section">
        <div class="container">
            <div class="section-header">
                <h2>${architectsData.title}</h2>
                <p>${architectsData.subtitle}</p>
            </div>
            <div class="architects-grid">
                ${archCards}
            </div>
        </div>
    </section>`;
}

function renderFooter() {
    return `
    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-brand">
                <h2><i class="fas fa-scale-balanced" style="color:var(--primary);"></i> NYAYI<span>.</span></h2>
                <p>Bridging the gap between citizens and Indian law through structured legal knowledge and advanced Artificial Intelligence.</p>
            </div>
            <div class="footer-col">
                <h4>Platform</h4>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/features.html">Features</a></li>
                    <li><a href="/app.html">Mobile App</a></li>
                    <li><a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary);">Launch AI Terminal</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Legal Knowledge</h4>
                <ul>
                    <li><a href="/dictionary.html">Legal Dictionary</a></li>
                    <li><a href="/rights.html">Know Your Rights</a></li>
                    <li><a href="/laws/">Indian Laws Library</a></li>
                    <li><a href="/legal-guides/">Step-by-Step Guides</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Legal & Policy</h4>
                <ul>
                    <li><a href="/about.html">About NYAYI</a></li>
                    <li><a href="/contact.html">Contact Support</a></li>
                    <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="/legal-disclaimer.html">Legal Disclaimer</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div>&copy; 2026 NYAYI AI. Designed & Developed by Farhan Khan.</div>
            <div class="powered-tag">Powered by WebGlut</div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('mobileDrawer').classList.toggle('active');
        }
    </script>
</body>
</html>`;
}

// 1. GENERATE HOMEPAGE (index.html)
function buildHomepage() {
    const dictCards = dictionary.slice(0, 6).map(item => `
        <div class="info-card">
            <div>
                <span style="font-size:12px; font-weight:800; color:var(--primary-dark); text-transform:uppercase;">${item.category}</span>
                <h3 style="margin-top:8px;">${item.term}</h3>
                <p>${item.simpleDef}</p>
            </div>
            <a href="/dictionary/${item.slug}.html" class="card-link">Read Full Explanation <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    const rightsCards = rights.map(item => `
        <div class="info-card">
            <div>
                <div class="card-icon"><i class="fas fa-shield-halved"></i></div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
            <a href="/know-your-rights/${item.slug}.html" class="card-link">Explore Your Rights <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    const lawsCards = laws.map(item => `
        <div class="info-card">
            <div>
                <span class="highlight" style="font-size:12px; font-weight:800;">${item.category}</span>
                <h3 style="margin-top:8px;">${item.title}</h3>
                <p>${item.purpose}</p>
            </div>
            <a href="/laws/${item.slug}.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    const html = `
    ${renderHead('Legal Knowledge. Made Simple.', 'NYAYI is India\'s premier legal knowledge platform. Access simplified explanations of BNS, IPC, FIRs, constitutional rights, and AI legal advice.', 'NYAYI, Indian Legal Knowledge, BNS 2023, IPC sections, Know Your Rights India, AI lawyer', '/')}
    ${renderHeader('home')}

    <section class="hero-section">
        <div class="container">
            <div class="hero-tag"><i class="fas fa-balance-scale"></i> Empowering 1.4 Billion Citizens</div>
            <h1 class="hero-title">Legal Knowledge. <br><span class="highlight">Made Accessible & Simple.</span></h1>
            <p class="hero-subtitle">Understand Indian law, discover your rights, explore legal terminology, and access practical guides — all in one modern platform.</p>
            <div class="hero-actions">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-primary"><i class="fas fa-rocket"></i> Launch NYAYI AI</a>
                <a href="/dictionary.html" class="btn-secondary"><i class="fas fa-book"></i> Explore Dictionary</a>
            </div>
        </div>
    </section>

    <!-- SECTION: WHAT IS NYAYI -->
    <section style="padding:80px 0; background:#fafafa;">
        <div class="container">
            <div class="section-header">
                <h2>Re-architecting Legal Literacy for India</h2>
                <p>Navigating Indian law should not require a law degree. NYAYI bridges the gap between dense statutory codes and citizen clarity.</p>
            </div>
            <div class="card-grid">
                <div class="info-card">
                    <div class="card-icon"><i class="fas fa-language"></i></div>
                    <h3>Multi-Lingual Clarity</h3>
                    <p>Legal concepts and procedural steps synthesized across 22+ official Indian languages for true grassroots accessibility.</p>
                </div>
                <div class="info-card">
                    <div class="card-icon"><i class="fas fa-diagram-project"></i></div>
                    <h3>BNS & IPC Mapping</h3>
                    <p>Instant cross-referencing between the old Indian Penal Code (1860) and the new Bharatiya Nyaya Sanhita (BNS 2023).</p>
                </div>
                <div class="info-card">
                    <div class="card-icon"><i class="fas fa-gavel"></i></div>
                    <h3>Actionable Guidance</h3>
                    <p>Practical step-by-step walk-throughs for FIRs, bail applications, consumer complaints, and cyber fraud recovery.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: LEGAL DICTIONARY PREVIEW -->
    <section style="padding:100px 0;">
        <div class="container">
            <div class="section-header">
                <h2>Searchable Legal <span>Dictionary</span></h2>
                <p>Demystifying Latin maxims, procedural terms, and court jargon in plain English & Hindi.</p>
            </div>
            <div class="card-grid">
                ${dictCards}
            </div>
            <div style="text-align:center; margin-top:40px;">
                <a href="/dictionary.html" class="btn-secondary">Browse All Legal Terms <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </section>

    <!-- SECTION: KNOW YOUR RIGHTS -->
    <section style="padding:100px 0; background:var(--gray-light);">
        <div class="container">
            <div class="section-header">
                <h2>Know Your Fundamental <span>Rights</span></h2>
                <p>Knowledge is your first line of defense against illegal detention, police overreach, and consumer exploitation.</p>
            </div>
            <div class="card-grid">
                ${rightsCards}
            </div>
        </div>
    </section>

    <!-- SECTION: INDIAN LAWS LIBRARY -->
    <section style="padding:100px 0;">
        <div class="container">
            <div class="section-header">
                <h2>Indian Laws <span>Library</span></h2>
                <p>Comprehensive breakdowns of major Indian acts, criminal codes, and constitutional frameworks.</p>
            </div>
            <div class="card-grid">
                ${lawsCards}
            </div>
        </div>
    </section>

    <!-- SECTION: THE ARCHITECTS -->
    ${renderArchitectsSection()}

    <!-- SECTION: AI CTA BANNER -->
    <section class="container">
        <div class="cta-banner">
            <h2>Experience NYAYI Neural Engine</h2>
            <p>Get instant answers to your specific legal questions from our dedicated AI Assistant terminal.</p>
            <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="display:inline-flex; font-size:16px; padding:16px 40px;"><i class="fas fa-rocket"></i> Launch NYAYI AI Terminal</a>
        </div>
    </section>

    ${renderFooter()}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');
    console.log('Generated: index.html');
}

// 2. GENERATE DICTIONARY HUB & TERM PAGES
function buildDictionary() {
    // Hub Page
    const termCards = dictionary.map(item => `
        <div class="info-card" data-category="${item.category}">
            <div>
                <span style="font-size:11px; font-weight:800; color:var(--primary-dark); text-transform:uppercase;">${item.category}</span>
                <h3 style="margin-top:6px; font-size:20px;">${item.term}</h3>
                <p style="font-size:14px; margin-bottom:16px;">${item.simpleDef}</p>
            </div>
            <div style="border-top:1px solid #edf2f7; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#718096; font-weight:700;"><i class="fas fa-book"></i> ${item.ref}</span>
                <a href="/dictionary/${item.slug}.html" class="card-link" style="font-size:13px;">View <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');

    const hubHtml = `
    ${renderHead('Legal Dictionary | Search Indian Legal Terms', 'Search simplified explanations of over 80+ Indian legal terms, Latin maxims, BNS/IPC sections, and constitutional definitions.', 'Indian legal dictionary, IPC BNS terms, FIR definition, bail legal meaning, Latin legal maxims', '/dictionary.html')}
    ${renderHeader('dictionary')}

    <section class="hero-section" style="padding-bottom:50px;">
        <div class="container">
            <h1 class="hero-title">Legal <span>Dictionary</span></h1>
            <p class="hero-subtitle">Simplified explanations for legal jargon, Latin maxims, BNS/IPC sections, and constitutional terminology.</p>
            
            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="dictSearch" onkeyup="filterDict()" placeholder="Search terms (e.g. Cognizable, Bail, FIR, Habeas Corpus)...">
            </div>

            <div class="filter-bar">
                <button class="filter-chip active" onclick="filterCat('all', this)">All Categories</button>
                <button class="filter-chip" onclick="filterCat('Criminal Law', this)">Criminal Law</button>
                <button class="filter-chip" onclick="filterCat('Constitutional Law', this)">Constitutional Law</button>
                <button class="filter-chip" onclick="filterCat('Civil Law', this)">Civil Law</button>
                <button class="filter-chip" onclick="filterCat('Cyber Law', this)">Cyber Law</button>
            </div>
        </div>
    </section>

    <section style="padding:40px 0 100px;">
        <div class="container">
            <div class="card-grid" id="dictGrid">
                ${termCards}
            </div>
        </div>
    </section>

    <script>
        function filterDict() {
            const query = document.getElementById('dictSearch').value.toLowerCase();
            const cards = document.querySelectorAll('#dictGrid .info-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'flex' : 'none';
            });
        }
        function filterCat(cat, btn) {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cards = document.querySelectorAll('#dictGrid .info-card');
            cards.forEach(card => {
                if(cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>

    ${renderFooter()}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'dictionary.html'), hubHtml, 'utf8');
    console.log('Generated: dictionary.html');

    // Individual Term Pages
    dictionary.forEach(item => {
        const termHtml = `
        ${renderHead(`${item.term} - Meaning & Legal Definition`, item.simpleDef, `${item.term}, ${item.category}, Indian Law, BNS IPC definition`, `/dictionary/${item.slug}.html`)}
        ${renderHeader('dictionary')}

        <section class="hero-section" style="padding-bottom:40px; text-align:left;">
            <div class="container">
                <a href="/dictionary.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Legal Dictionary</a>
                <span class="hero-tag" style="margin-top:20px; display:inline-block;">${item.category}</span>
                <h1 class="hero-title" style="margin:10px 0 20px;">${item.term}</h1>
                <p class="hero-subtitle" style="margin:0;">${item.simpleDef}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid var(--border); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-sm);">
                    <h2 style="font-size:24px; margin-bottom:12px;">Legal Meaning & Statutory Context</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8;">${item.legalMeaning}</p>

                    <h2 style="font-size:24px; margin-bottom:12px;">Detailed Plain-Language Explanation</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8;">${item.explanation}</p>

                    <div style="background:var(--primary-light); border-left:4px solid var(--primary); padding:24px; border-radius:var(--radius-sm); margin-bottom:30px;">
                        <h3 style="font-size:18px; color:var(--primary-dark); margin-bottom:8px;"><i class="fas fa-lightbulb"></i> Practical Example</h3>
                        <p style="margin:0; color:#2d3748;">${item.example}</p>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; border-top:1px solid #edf2f7; padding-top:24px;">
                        <div>
                            <strong style="color:var(--dark); font-size:14px;">Where Used:</strong>
                            <p style="font-size:14px; margin:4px 0 0;">${item.whereUsed}</p>
                        </div>
                        <div>
                            <strong style="color:var(--dark); font-size:14px;">Statutory Reference:</strong>
                            <p style="font-size:14px; margin:4px 0 0;">${item.ref}</p>
                        </div>
                    </div>
                </div>

                <div style="margin-top:50px; text-align:center;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-primary"><i class="fas fa-robot"></i> Ask NYAYI AI About ${item.term}</a>
                </div>
            </div>
        </section>

        ${renderFooter()}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `dictionary/${item.slug}.html`), termHtml, 'utf8');
    });
    console.log(`Generated: ${dictionary.length} individual dictionary term pages.`);
}

// 3. BUILD KNOW YOUR RIGHTS HUB & CATEGORY PAGES
function buildRights() {
    const hubHtml = `
    ${renderHead('Know Your Rights | Citizen Protections in India', 'Understand your legal rights against arbitrary arrest, police overreach, consumer fraud, cybercrime, and workplace harassment.', 'Know Your Rights India, police rights, arrest rights, womens rights India, consumer rights', '/rights.html')}
    ${renderHeader('rights')}

    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">Know Your <span>Rights</span></h1>
            <p class="hero-subtitle">Empowering Indian citizens with actionable constitutional safeguards and practical protections.</p>
        </div>
    </section>

    <section style="padding:60px 0 100px;">
        <div class="container">
            <div class="card-grid">
                ${rights.map(item => `
                    <div class="info-card">
                        <div>
                            <div class="card-icon"><i class="fas fa-shield-halved"></i></div>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                        <a href="/know-your-rights/${item.slug}.html" class="card-link">Explore Rights Guide <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter()}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'rights.html'), hubHtml, 'utf8');
    console.log('Generated: rights.html');

    rights.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Rights Guide`, item.description, `${item.title}, legal rights India, citizen protections`, `/know-your-rights/${item.slug}.html`)}
        ${renderHeader('rights')}

        <section class="hero-section" style="padding-bottom:40px; text-align:left;">
            <div class="container">
                <a href="/rights.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Rights Overview</a>
                <h1 class="hero-title" style="margin:16px 0 20px;">${item.title}</h1>
                <p class="hero-subtitle" style="margin:0;">${item.description}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid var(--border); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-sm); margin-bottom:30px;">
                    <h2 style="font-size:24px; margin-bottom:16px;">Important Legal Points to Know</h2>
                    <ul style="padding-left:20px; line-height:1.9; color:#4a5568; margin-bottom:30px;">
                        ${item.importantPoints.map(p => `<li style="margin-bottom:12px;">${p}</li>`).join('')}
                    </ul>

                    <h2 style="font-size:24px; margin-bottom:16px;">Practical Action Steps</h2>
                    <ol style="padding-left:20px; line-height:1.9; color:#4a5568;">
                        ${item.practicalSteps.map(s => `<li style="margin-bottom:12px;">${s}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </section>

        ${renderFooter()}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `know-your-rights/${item.slug}.html`), pageHtml, 'utf8');
    });
    console.log(`Generated: ${rights.length} individual rights pages.`);
}

// 4. BUILD LAWS LIBRARY (laws/index.html & laws/*.html)
function buildLaws() {
    const hubHtml = `
    ${renderHead('Indian Laws Library | BNS, BNSS, BSA & Constitution', 'Comprehensive guide to major Indian acts, Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Constitutional laws.', 'Indian Laws Library, BNS 2023, BNSS 2023, BSA 2023, Constitution of India', '/laws/')}
    ${renderHeader('laws')}

    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">Indian Laws <span>Library</span></h1>
            <p class="hero-subtitle">Structured breakdowns of major Indian acts, new criminal codes, and constitutional frameworks.</p>
        </div>
    </section>

    <section style="padding:60px 0 100px;">
        <div class="container">
            <div class="card-grid">
                ${laws.map(item => `
                    <div class="info-card">
                        <div>
                            <span class="highlight" style="font-size:12px; font-weight:800; text-transform:uppercase;">${item.category}</span>
                            <h3 style="margin-top:10px;">${item.title}</h3>
                            <p>${item.purpose}</p>
                        </div>
                        <a href="/laws/${item.slug}.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter()}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'laws/index.html'), hubHtml, 'utf8');
    console.log('Generated: laws/index.html');

    laws.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} (${item.shortName}) | Act Analysis`, item.purpose, `${item.title}, ${item.shortName}, Indian law`, `/laws/${item.slug}.html`)}
        ${renderHeader('laws')}

        <section class="hero-section" style="padding-bottom:40px; text-align:left;">
            <div class="container">
                <a href="/laws/" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Laws Library</a>
                <span class="hero-tag" style="margin-top:20px; display:inline-block;">Enacted: ${item.enacted}</span>
                <h1 class="hero-title" style="margin:10px 0 20px;">${item.title}</h1>
                <p class="hero-subtitle" style="margin:0;">${item.purpose}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid var(--border); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-sm);">
                    <h2 style="font-size:24px; margin-bottom:16px;">Key Concepts & Structural Highlights</h2>
                    <ul style="padding-left:20px; line-height:1.9; color:#4a5568; margin-bottom:30px;">
                        ${item.importantConcepts.map(c => `<li style="margin-bottom:12px;">${c}</li>`).join('')}
                    </ul>

                    <h2 style="font-size:24px; margin-bottom:12px;">Practical Relevance</h2>
                    <p style="font-size:16px; color:#4a5568; line-height:1.8; margin-bottom:30px;">${item.practicalRelevance}</p>

                    <div style="border-top:1px solid #edf2f7; padding-top:20px; color:#718096; font-size:14px;">
                        <strong>Official Reference:</strong> ${item.officialRef}
                    </div>
                </div>
            </div>
        </section>

        ${renderFooter()}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `laws/${item.slug}.html`), pageHtml, 'utf8');
    });
    console.log(`Generated: ${laws.length} individual law pages.`);
}

// 5. BUILD GUIDES (legal-guides/index.html & legal-guides/*.html)
function buildGuides() {
    const hubHtml = `
    ${renderHead('Legal Guides | Practical Procedures in India', 'Step-by-step guides on filing FIRs, reporting cyber crimes, obtaining bail, and understanding court procedures.', 'Legal Guides India, how to file FIR, cyber crime report guide, bail process India', '/legal-guides/')}
    ${renderHeader('guides')}

    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">Step-by-Step <span>Legal Guides</span></h1>
            <p class="hero-subtitle">Clear, practical instructions breaking down complex court and police procedures into understandable steps.</p>
        </div>
    </section>

    <section style="padding:60px 0 100px;">
        <div class="container">
            <div class="card-grid">
                ${guides.map(item => `
                    <div class="info-card">
                        <div>
                            <span style="font-size:12px; font-weight:800; color:var(--primary-dark); text-transform:uppercase;">${item.category} • ${item.readingTime}</span>
                            <h3 style="margin-top:8px;">${item.title}</h3>
                            <p>${item.summary}</p>
                        </div>
                        <a href="/legal-guides/${item.slug}.html" class="card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter()}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'legal-guides/index.html'), hubHtml, 'utf8');
    console.log('Generated: legal-guides/index.html');

    guides.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Guide`, item.summary, `${item.title}, legal procedure guide India`, `/legal-guides/${item.slug}.html`)}
        ${renderHeader('guides')}

        <section class="hero-section" style="padding-bottom:40px; text-align:left;">
            <div class="container">
                <a href="/legal-guides/" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Legal Guides</a>
                <span class="hero-tag" style="margin-top:20px; display:inline-block;">${item.category}</span>
                <h1 class="hero-title" style="margin:10px 0 20px;">${item.title}</h1>
                <p class="hero-subtitle" style="margin:0;">${item.summary}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid var(--border); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-sm);">
                    <h2 style="font-size:24px; margin-bottom:24px;">Step-by-Step Procedure</h2>
                    ${item.steps.map(s => `
                        <div style="display:flex; gap:20px; margin-bottom:28px;">
                            <div style="width:40px; height:40px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; shrink:0;">${s.num}</div>
                            <div>
                                <h3 style="font-size:18px; margin-bottom:6px;">${s.heading}</h3>
                                <p style="font-size:15px; color:#4a5568; margin:0;">${s.text}</p>
                            </div>
                        </div>
                    `).join('')}

                    ${item.warnings.length ? `
                        <div style="background:#fff5f5; border-left:4px solid #e53e3e; padding:20px; border-radius:var(--radius-sm); margin-top:30px;">
                            <strong style="color:#c53030;"><i class="fas fa-exclamation-triangle"></i> Important Warning:</strong>
                            ${item.warnings.map(w => `<p style="margin:6px 0 0; color:#9b2c2c; font-size:14px;">${w}</p>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </section>

        ${renderFooter()}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `legal-guides/${item.slug}.html`), pageHtml, 'utf8');
    });
    console.log(`Generated: ${guides.length} individual legal guide pages.`);
}

// 6. BUILD ARTICLES / BLOG, APP, CONTACT, POLICIES, & SEO METADATA
function buildRemainingPages() {
    // Articles / Blog Page
    const blogHtml = `
    ${renderHead('Legal Articles & Editorial Updates | NYAYI', 'Read legal insights, BNS 2023 updates, and legal awareness articles written by Farhan Khan & Kamran Sheikh.', 'Legal articles India, BNS updates, legal tech blog', '/articles.html')}
    ${renderHeader()}

    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">Legal <span>Insights & Blog</span></h1>
            <p class="hero-subtitle">Editorial updates, deep-dive law explainers, and technology insights.</p>
        </div>
    </section>

    <section style="padding:60px 0 100px;">
        <div class="container">
            <div class="card-grid">
                ${articles.map(art => `
                    <div class="info-card">
                        <div>
                            <span style="font-size:12px; font-weight:800; color:var(--primary-dark); text-transform:uppercase;">${art.category} • ${art.date}</span>
                            <h3 style="margin-top:8px;">${art.title}</h3>
                            <p>${art.summary}</p>
                        </div>
                        <div style="border-top:1px solid #edf2f7; padding-top:12px; font-size:13px; color:#718096; display:flex; justify-content:space-between;">
                            <span>By ${art.author}</span>
                            <span>${art.readTime}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter()}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'articles.html'), blogHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'blog/index.html'), blogHtml, 'utf8');
    console.log('Generated: articles.html & blog/index.html');

    // App Page
    const appHtml = `
    ${renderHead('NYAYI Mobile App | AI Legal Assistant on Mobile', 'Download NYAYI Mobile App or launch the Web AI terminal directly on your smartphone.', 'NYAYI app, legal AI app India', '/app.html')}
    ${renderHeader()}
    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">NYAYI <span>Mobile Experience</span></h1>
            <p class="hero-subtitle">Access voice-assisted legal answers and case search on any mobile device.</p>
            <div style="margin-top:30px;">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-primary"><i class="fas fa-mobile-screen"></i> Launch Web App Immediately</a>
            </div>
        </div>
    </section>
    ${renderFooter()}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'app.html'), appHtml, 'utf8');

    // Contact Page
    const contactHtml = `
    ${renderHead('Contact NYAYI Support', 'Get in touch with Farhan Khan & Kamran Sheikh regarding NYAYI platform support or feedback.', 'Contact NYAYI, Farhan Khan contact, Kamran Sheikh contact', '/contact.html')}
    ${renderHeader()}
    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">Get in <span>Touch</span></h1>
            <p class="hero-subtitle">Have questions or feedback? Reach out directly to the creators of NYAYI.</p>
        </div>
    </section>
    ${renderArchitectsSection()}
    ${renderFooter()}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'contact.html'), contactHtml, 'utf8');

    // Legal Disclaimers & Policies
    const disclaimerHtml = `
    ${renderHead('Legal Disclaimer | NYAYI', 'Important disclaimer: NYAYI provides legal information, not professional advocate representation.', 'NYAYI disclaimer', '/legal-disclaimer.html')}
    ${renderHeader()}
    <section style="padding:150px 0 100px;">
        <div class="container" style="max-width:800px;">
            <h1 style="font-size:2.5rem; margin-bottom:20px;">Legal Disclaimer</h1>
            <div style="line-height:1.8; color:#4a5568;">
                <p><strong>1. Informational Purpose Only:</strong> NYAYI is an educational and legal information platform. The content provided on this website, including legal dictionary terms, guides, and AI responses, does NOT constitute formal legal advice or create an advocate-client relationship.</p>
                <p><strong>2. No Guarantee of Court Outcome:</strong> Legal statutes and court precedents vary based on individual case facts. For formal court representation or litigation advice, users must consult a licensed advocate.</p>
            </div>
        </div>
    </section>
    ${renderFooter()}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'legal-disclaimer.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'privacy-policy.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'terms-of-use.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'cookie-policy.html'), disclaimerHtml, 'utf8');
    console.log('Generated: Legal policy pages.');

    // Sitemap & Robots
    const urls = [
        'https://nyayi.in/',
        'https://nyayi.in/features.html',
        'https://nyayi.in/dictionary.html',
        'https://nyayi.in/rights.html',
        'https://nyayi.in/laws/',
        'https://nyayi.in/legal-guides/',
        'https://nyayi.in/articles.html',
        'https://nyayi.in/about.html',
        'https://nyayi.in/app.html',
        'https://nyayi.in/contact.html',
        'https://nyayi.in/legal-disclaimer.html',
        ...dictionary.map(d => `https://nyayi.in/dictionary/${d.slug}.html`),
        ...rights.map(r => `https://nyayi.in/know-your-rights/${r.slug}.html`),
        ...laws.map(l => `https://nyayi.in/laws/${l.slug}.html`),
        ...guides.map(g => `https://nyayi.in/legal-guides/${g.slug}.html`)
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>\n        <loc>${u}</loc>\n        <lastmod>2026-09-13</lastmod>\n        <changefreq>weekly</changefreq>\n        <priority>0.8</priority>\n    </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://nyayi.in/sitemap.xml`;
    fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
    console.log('Generated: sitemap.xml & robots.txt');
}

// EXECUTE ALL BUILD STEPS
console.log('Starting NYAYI Static Site Generator Build...');
buildHomepage();
buildDictionary();
buildRights();
buildLaws();
buildGuides();
buildRemainingPages();
console.log('BUILD COMPLETE! All static pages generated successfully.');

