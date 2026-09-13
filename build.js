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
['dictionary', 'know-your-rights', 'laws', 'legal-guides', 'blog', 'rights'].forEach(dir => {
    const fullPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// BASE SCHEMAS
const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nyayi Legal AI",
    "url": "https://nyayi.in/",
    "logo": "https://nyayi.in/images/logo.png",
    "founder": {
        "@type": "Person",
        "name": "Farhan Khan"
    },
    "description": "India's most advanced AI legal assistant providing reliable legal advice on BNS, IPC, FIRs, cyber fraud, and rights."
};

const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nyayi Legal AI",
    "url": "https://nyayi.in/",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nyayi.in/dictionary.html?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

// COMMON RENDERING HELPERS
function renderHead(title, description, keywords, pathUrl, depth = 0) {
    const canonical = `https://nyayi.in${pathUrl}`;
    const relPrefix = depth === 1 ? '../' : './';
    const cleanTitle = title.includes('NYAYI') || title.includes('Nyayi') ? title : `${title} | Nyayi Legal AI`;
    const schemas = [orgSchema, webSiteSchema];
    const schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n    ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${cleanTitle}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="Farhan Khan">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English, Hindi">
    <link rel="canonical" href="${canonical}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${cleanTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://nyayi.in/images/logo.png">

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="${relPrefix}css/styles.css">
    
    ${schemaScripts}
</head>
<body>
    <div class="cursor-dot"></div>
    <div class="cursor-outline"></div>`;
}

function renderHeader(activePage = '', depth = 0) {
    const p = depth === 1 ? '../' : './';
    const isBlogActive = ['blog', 'laws', 'guides', 'articles'].includes(activePage);
    return `
    <div class="mobile-menu" id="mobileMenu">
        <div class="close-menu" onclick="toggleMenu()"><i class="fas fa-times"></i></div>
        <a href="${p}index.html" onclick="toggleMenu()" class="${activePage === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}features.html" onclick="toggleMenu()" class="${activePage === 'features' ? 'active' : ''}">Features</a>
        <a href="${p}dictionary.html" onclick="toggleMenu()" class="${activePage === 'dictionary' ? 'active' : ''}">Legal Dictionary</a>
        <a href="${p}rights.html" onclick="toggleMenu()" class="${activePage === 'rights' ? 'active' : ''}">Know Rights</a>
        <a href="${p}laws.html" onclick="toggleMenu()" class="${activePage === 'laws' ? 'active' : ''}">Laws Library</a>
        <a href="${p}guides.html" onclick="toggleMenu()" class="${activePage === 'guides' ? 'active' : ''}">Legal Guides</a>
        <a href="${p}articles.html" onclick="toggleMenu()" class="${activePage === 'articles' ? 'active' : ''}">Articles & Updates</a>
        <a href="${p}app.html" onclick="toggleMenu()" class="${activePage === 'app' ? 'active' : ''}" style="color:var(--primary); font-weight:800;"><i class="fas fa-mobile-screen"></i> Mobile App</a>
        <a href="https://ai.nyayi.in" target="_blank" class="mobile-launch-btn">
            <i class="fas fa-rocket"></i> Launch Web AI
        </a>
    </div>

    <header>
        <div class="nav-capsule">
            <a href="${p}index.html" class="logo">
                <i class="fas fa-scale-balanced" style="color:var(--primary);"></i> NYAYI<span>.</span>
            </a>
            
            <ul class="nav-links">
                <li><a href="${p}index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
                <li><a href="${p}features.html" class="${activePage === 'features' ? 'active' : ''}">Features</a></li>
                <li><a href="${p}dictionary.html" class="${activePage === 'dictionary' ? 'active' : ''}">Dictionary</a></li>
                <li><a href="${p}rights.html" class="${activePage === 'rights' ? 'active' : ''}">Rights</a></li>
                <li class="nav-dropdown">
                    <a href="${p}articles.html" class="dropdown-trigger ${isBlogActive ? 'active' : ''}">
                        Blog <i class="fas fa-chevron-down"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a href="${p}laws.html" class="dropdown-item ${activePage === 'laws' ? 'active' : ''}">
                            <div class="dd-icon"><i class="fas fa-book-bookmark"></i></div>
                            <div class="dd-text">
                                <strong>Laws Library</strong>
                                <span>BNS, BNSS, BSA & Constitution</span>
                            </div>
                        </a>
                        <a href="${p}guides.html" class="dropdown-item ${activePage === 'guides' ? 'active' : ''}">
                            <div class="dd-icon"><i class="fas fa-list-check"></i></div>
                            <div class="dd-text">
                                <strong>Legal Guides</strong>
                                <span>Practical procedural walk-throughs</span>
                            </div>
                        </a>
                        <a href="${p}articles.html" class="dropdown-item ${activePage === 'articles' ? 'active' : ''}">
                            <div class="dd-icon"><i class="fas fa-newspaper"></i></div>
                            <div class="dd-text">
                                <strong>Articles & Insights</strong>
                                <span>Editorial updates & legal tech analysis</span>
                            </div>
                        </a>
                    </div>
                </li>
                <li><a href="${p}app.html" style="color:var(--primary);" class="${activePage === 'app' ? 'active' : ''}"><i class="fas fa-mobile-screen"></i> Mobile App</a></li>
            </ul>

            <div style="display:flex; align-items:center;">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-launch">
                    <i class="fas fa-rocket"></i> Launch Web AI
                </a>
                <div class="menu-toggle" onclick="toggleMenu()"><i class="fas fa-bars"></i></div>
            </div>
        </div>
    </header>`;
}

function renderArchitectsSection() {
    return `
    <section class="creators-section">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>The <span>Architects</span></h2>
                <p>Connect with the minds behind the technological revolution.</p>
            </div>
            
            <div class="creators-grid">
                <div class="creator-profile" data-aos="fade-up">
                    <div class="cp-icon"><i class="fas fa-user-tie"></i></div>
                    <h3>Farhan Khan</h3>
                    <span class="cp-role">Founder & Lead Developer</span>
                    <div class="cp-actions">
                        <a href="https://instagram.com/sajj1507" target="_blank" class="cp-btn"><i class="fab fa-instagram"></i> View</a>
                        <a href="tel:9598042676" class="cp-btn secondary"><i class="fas fa-phone-alt"></i> Call Now</a>
                    </div>
                </div>
                
                <div class="creator-profile" data-aos="fade-up" data-aos-delay="100">
                    <div class="cp-icon"><i class="fas fa-user-tie"></i></div>
                    <h3>Kamran Sheikh</h3>
                    <span class="cp-role">Lead Legal Researcher</span>
                    <div class="cp-actions">
                        <a href="https://instagram.com/kamran.irll" target="_blank" class="cp-btn"><i class="fab fa-instagram"></i> View</a>
                        <a href="tel:7393905299" class="cp-btn secondary"><i class="fas fa-phone-alt"></i> Call Now</a>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderFooter(depth = 0) {
    const p = depth === 1 ? '../' : './';
    return `
    <footer>
        <div class="container footer-grid">
            <div class="footer-brand">
                <h2><i class="fas fa-scale-balanced" style="color:var(--primary);"></i> NYAYI<span>.</span></h2>
                <p>Bridging the gap between the common man and the law through advanced Artificial Intelligence.</p>
            </div>
            <div class="footer-col">
                <h4>Platform</h4>
                <ul>
                    <li><a href="${p}index.html">Home</a></li>
                    <li><a href="${p}features.html">Features</a></li>
                    <li><a href="${p}app.html">Mobile App</a></li>
                    <li><a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary); font-weight:700;">Launch Web AI</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Knowledge</h4>
                <ul>
                    <li><a href="${p}dictionary.html">Legal Dictionary</a></li>
                    <li><a href="${p}rights.html">Know Rights</a></li>
                    <li><a href="${p}laws.html">Laws Library</a></li>
                    <li><a href="${p}guides.html">Legal Guides</a></li>
                    <li><a href="${p}articles.html">Articles & Updates</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact & Support</h4>
                <ul>
                    <li><a href="${p}contact.html">Contact Us</a></li>
                    <li><a href="tel:9598042676"><i class="fas fa-phone-alt" style="color:var(--primary); font-size:12px;"></i> +91 9598042676</a></li>
                    <li><a href="tel:7393905299"><i class="fas fa-phone-alt" style="color:var(--primary); font-size:12px;"></i> +91 7393905299</a></li>
                    <li><a href="${p}privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="${p}legal-disclaimer.html">Legal Disclaimer</a></li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <div>&copy; 2026 Nyayi AI. Designed & Developed by Farhan Khan.</div>
            <div class="powered-tag">Powered by WebGlut</div>
        </div>
    </footer>

    <div class="scroll-top" onclick="scrollToTop()">
        <i class="fas fa-chevron-up"></i>
    </div>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({ duration: 800, once: true });

        function toggleMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
        }

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        window.addEventListener('mousemove', function(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = \`\${posX}px\`;
            cursorDot.style.top = \`\${posY}px\`;
            cursorOutline.animate({ left: \`\${posX}px\`, top: \`\${posY}px\` }, { duration: 500, fill: "forwards" });
        });

        const hoverElements = document.querySelectorAll('a, button, .b-card, .creator-profile, .dropdown-item, .nav-dropdown, .faq-item, .chat-ui, .info-card, .feature-card, .dict-card, .law-card, .guide-card, .rights-card, .article-card, .cp-btn, .filter-btn, .search-box input');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        const scrollTopBtn = document.querySelector('.scroll-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('active');
            else scrollTopBtn.classList.remove('active');
        });
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
</body>
</html>`;
}

// 1. GENERATE HOMEPAGE (index.html)
function buildHomepage() {
    const dictCards = dictionary.slice(0, 6).map(item => `
        <div class="info-card" data-aos="fade-up">
            <div>
                <span class="card-tag">${item.category}</span>
                <h3 style="margin-top:4px;">${item.term}</h3>
                <p>${item.simpleDef}</p>
            </div>
            <a href="dictionary/${item.slug}.html" class="card-link">Read Full Explanation <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    const rightsCards = rights.map(item => `
        <div class="info-card" data-aos="fade-up">
            <div>
                <div class="card-icon"><i class="fas fa-shield-halved"></i></div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
            <a href="know-your-rights/${item.slug}.html" class="card-link">Explore Rights <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    const html = `
    ${renderHead('NYAYI | India\'s #1 Legal AI', 'Nyayi (NYAYI) is India\'s most advanced AI legal assistant. Get instant, reliable legal advice on Indian laws, FIRs, cyber fraud, and rights.', 'Nyayi, Indian Legal AI, AI lawyer India, free legal advice India, BNS 2023, IPC sections, cyber crime help, Indian Constitution', '/')}
    ${renderHeader('home', 0)}

    <section class="hero">
        <div class="container hero-content" data-aos="zoom-in">
            <h1>Legal Intelligence <br> <span>Reimagined.</span></h1>
            <p>Explore cutting-edge AI tools engineered to simplify the complex matrix of the Indian legal system. From context-aware research to dynamic document workflows—get precise, fast, and secure guidance instantly.</p>
            
            <div class="hero-btns">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-ai">
                    <i class="fas fa-robot"></i> Start AI Chat
                </a>
                <a href="features.html" class="btn-outline">
                    <i class="fas fa-layer-group"></i> Explore Features
                </a>
            </div>

            <a href="https://ai.nyayi.in" target="_blank" class="chat-ui-link">
                <div class="chat-ui" data-aos="fade-up" data-aos-delay="200">
                    <div class="chat-header">
                        <div class="bot-img"><i class="fas fa-robot"></i></div>
                        <div style="text-align:left;"><strong>Nyayi Neural Engine</strong><br><span style="font-size:12px; color:green;">● Online • Click to Chat</span></div>
                    </div>
                    <div class="msg msg-user">How do I map an old crime to the new laws?</div>
                    <div class="msg msg-ai">
                        You can use our integrated <strong>IPC & BNS Converter</strong> to map any old section directly to its active counterpart in the new Bharatiya Nyaya Sanhita instantly.
                    </div>
                </div>
            </a>
        </div>
    </section>

    <!-- STATS STRIP -->
    <section class="stats-strip">
        <div class="container stats-grid">
            <div data-aos="fade-up"><span class="stat-badge">#1 IN INDIA</span><div class="stat-num">511+</div><div class="stat-label">IPC & BNS Sections Covered</div></div>
            <div data-aos="fade-up" data-aos-delay="100"><span class="stat-badge">MULTILINGUAL</span><div class="stat-num">22+</div><div class="stat-label">Indian Languages</div></div>
            <div data-aos="fade-up" data-aos-delay="200"><span class="stat-badge">SECURE</span><div class="stat-num">100%</div><div class="stat-label">Data Privacy Guard</div></div>
            <div data-aos="fade-up" data-aos-delay="300"><span class="stat-badge">AI DRIVEN</span><div class="stat-num">24/7</div><div class="stat-label">Instant Solution Delivery</div></div>
        </div>
    </section>

    <!-- BENTO GRID -->
    <section class="bento-section">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Powerful <span>Legal Tools</span></h2>
                <p>Advanced computational engines designed to empower the modern citizen.</p>
            </div>

            <div class="bento-grid">
                <div class="b-card b-dark" data-aos="fade-right">
                    <div class="b-icon"><i class="fas fa-search-location"></i></div>
                    <h3>Smart Case Search</h3>
                    <p>Describe your situation in simple stories or casual phrases. Our custom neural network scans the entire Indian Penal Code (IPC), Constitution, and active court precedents to reveal the exact legal sections and penalties relevant to you.</p>
                </div>
                <div class="b-card" data-aos="fade-left">
                    <div class="b-icon"><i class="fas fa-file-contract"></i></div>
                    <h3>Dynamic Document Drafting</h3>
                    <p>Create legally tight documents instantly. Generate a formal Draft FIR or customized Rent Agreements tailored to your specific inputs inside 30 seconds.</p>
                </div>
                <div class="b-card" data-aos="fade-left" data-aos-delay="100">
                    <div class="b-icon"><i class="fas fa-calculator"></i></div>
                    <h3>Challan & Code Utilities</h3>
                    <p>Calculate road liabilities instantly with our Traffic Fine Calculator, or cross-check statutory transformations smoothly through the active IPC & BNS Converter.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: LEGAL DICTIONARY PREVIEW -->
    <section style="padding:90px 0; background:white;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Searchable Legal <span>Dictionary</span></h2>
                <p>Demystifying Latin maxims, procedural terms, and court jargon in plain English & Hindi.</p>
            </div>
            <div class="card-grid">
                ${dictCards}
            </div>
            <div style="text-align:center; margin-top:40px;">
                <a href="dictionary.html" class="btn-outline">Browse All Legal Terms <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </section>

    <!-- SECTION: KNOW YOUR RIGHTS -->
    <section style="padding:90px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Know Your Fundamental <span>Rights</span></h2>
                <p>Knowledge is your first line of defense against illegal detention, police overreach, and consumer exploitation.</p>
            </div>
            <div class="card-grid">
                ${rightsCards}
            </div>
        </div>
    </section>

    <!-- SECTION: THE ARCHITECTS -->
    ${renderArchitectsSection()}

    <!-- SECTION: FAQ ACCORDION -->
    <section class="faq-section">
        <div class="container">
            <div class="section-header" data-aos="fade-up"><h2>Frequently Asked <span>Questions</span></h2></div>
            <div class="faq-grid">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Is Nyayi free for citizens?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes, our core mission is accessibility. Features like Case Search, Dictionary, Converter utilities, and Basic Drafting are completely free for public use.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>Is my data secure and private?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>We prioritize absolute privacy. We use industry-standard encryption protocols for all data operations. Your queries are processed dynamically but never personally linked, stored, or distributed.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="200">
                    <div class="faq-header"><h3>Does this platform replace an advocate?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p><strong>No.</strong> Nyayi is an informational tool built for research and legal literacy. For formal court representations, active litigation advice, or official filings, you can browse verified advocates through our dedicated lawyer portal.</p></div>
                </div>
            </div>
        </div>
    </section>

    <script>
        function toggleFaq(element) {
            const allFaqs = document.querySelectorAll('.faq-item');
            allFaqs.forEach(item => {
                if (item !== element) {
                    item.classList.remove('active');
                    item.querySelector('.faq-body').style.maxHeight = null;
                }
            });
            element.classList.toggle('active');
            const body = element.querySelector('.faq-body');
            if (element.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        }
    </script>

    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');
    console.log('Generated: index.html');
}

// 2. GENERATE DICTIONARY HUB & TERM PAGES
function buildDictionary() {
    const termCards = dictionary.map(item => `
        <div class="dict-card" data-category="${item.category}" data-aos="fade-up">
            <div>
                <div class="dict-header">
                    <h3>${item.term}</h3>
                    <span class="badge-cat">${item.category}</span>
                </div>
                <p>${item.simpleDef}</p>
            </div>
            <div class="dict-meta">
                <span><i class="fas fa-book"></i> ${item.ref}</span>
                <span><i class="fas fa-shield-halved"></i> ${item.tag || item.category}</span>
                <a href="dictionary/${item.slug}.html" class="card-link">Explore <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');

    const hubHtml = `
    ${renderHead('Legal Dictionary | Nyayi Legal AI', 'Nyayi Legal Dictionary: Simplified explanations for Indian legal jargon, Latin maxims, BNS/IPC sections, and constitutional terms.', 'Nyayi, Legal Dictionary India, law glossary, legal terms, IPC sections, BNS codes', '/dictionary.html')}
    ${renderHeader('dictionary', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Legal <span>Dictionary</span></h1>
            <p>Simplified explanations for legal jargon, Latin maxims, BNS/IPC sections, and constitutional terms.</p>
            
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="dictSearch" onkeyup="filterDict()" placeholder="Search terms (e.g. Cognizable, Bail, FIR, Habeas Corpus)...">
            </div>

            <div class="filter-tags">
                <button class="filter-btn active" onclick="filterCat('all', this)">All Terms</button>
                <button class="filter-btn" onclick="filterCat('Criminal Law', this)">Criminal Law</button>
                <button class="filter-btn" onclick="filterCat('Constitutional Law', this)">Constitutional</button>
                <button class="filter-btn" onclick="filterCat('Civil Law', this)">Civil & Property</button>
                <button class="filter-btn" onclick="filterCat('Cyber Law', this)">Cyber & Tech</button>
            </div>
        </div>
    </section>

    <section style="padding:40px 0 100px; background:#fff;">
        <div class="container">
            <div class="dict-grid" id="dictGrid">
                ${termCards}
            </div>
        </div>
    </section>

    <script>
        function filterDict() {
            const query = document.getElementById('dictSearch').value.toLowerCase();
            const cards = document.querySelectorAll('#dictGrid .dict-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'flex' : 'none';
            });
        }
        function filterCat(cat, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cards = document.querySelectorAll('#dictGrid .dict-card');
            cards.forEach(card => {
                if(cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>

    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'dictionary.html'), hubHtml, 'utf8');
    console.log('Generated: dictionary.html');

    // Individual Term Pages
    dictionary.forEach(item => {
        const termHtml = `
        ${renderHead(`${item.term} - Meaning & Legal Definition`, item.simpleDef, `${item.term}, ${item.category}, Indian Law, BNS IPC definition`, `/dictionary/${item.slug}.html`, 1)}
        ${renderHeader('dictionary', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../dictionary.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Legal Dictionary</a>
                <span class="cp-role" style="margin-top:20px; display:inline-block;">${item.category}</span>
                <h1 style="margin:10px 0 20px; font-size:3rem;">${item.term}</h1>
                <p style="margin:0; font-size:1.2rem; max-width:100%; color:#555;">${item.simpleDef}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid #eee; border-radius:24px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h2 style="font-size:24px; margin-bottom:12px; font-weight:800;">Legal Meaning & Statutory Context</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8; color:#555;">${item.legalMeaning}</p>

                    <h2 style="font-size:24px; margin-bottom:12px; font-weight:800;">Detailed Plain-Language Explanation</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8; color:#555;">${item.explanation}</p>

                    <div style="background:#f0fdf4; border-left:4px solid var(--primary); padding:24px; border-radius:12px; margin-bottom:30px;">
                        <h3 style="font-size:18px; color:var(--primary-dark); margin-bottom:8px; font-weight:800;"><i class="fas fa-lightbulb"></i> Practical Example</h3>
                        <p style="margin:0; color:#333;">${item.example}</p>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; border-top:1px solid #edf2f7; padding-top:24px;">
                        <div>
                            <strong style="color:var(--dark); font-size:14px;">Where Used:</strong>
                            <p style="font-size:14px; margin:4px 0 0; color:#666;">${item.whereUsed}</p>
                        </div>
                        <div>
                            <strong style="color:var(--dark); font-size:14px;">Statutory Reference:</strong>
                            <p style="font-size:14px; margin:4px 0 0; color:#666;">${item.ref}</p>
                        </div>
                    </div>
                </div>

                <div style="margin-top:50px; text-align:center;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai"><i class="fas fa-robot"></i> Ask NYAYI AI About ${item.term}</a>
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `dictionary/${item.slug}.html`), termHtml, 'utf8');
    });
}

// 3. BUILD KNOW YOUR RIGHTS HUB & CATEGORY PAGES
function buildRights() {
    const hubHtml = `
    ${renderHead('Know Your Rights | Citizen Protections in India', 'Understand your legal rights against arbitrary arrest, police overreach, consumer fraud, cybercrime, and workplace harassment.', 'Know Your Rights India, police rights, arrest rights, womens rights India, consumer rights', '/rights.html')}
    ${renderHeader('rights', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Your Shield. <span>Your Rights.</span></h1>
            <p>Know your fundamental and legal rights as an Indian citizen under the Constitution and active criminal procedure laws.</p>
            <div class="hero-btns" style="margin-bottom:0;">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-ai"><i class="fas fa-robot"></i> Start AI Consultation</a>
                <a href="#rightsGrid" class="btn-outline"><i class="fas fa-shield-halved"></i> Explore Safeguards</a>
            </div>
        </div>
    </section>

    <!-- CONSTITUTION ARTICLES STRIP -->
    <section class="fund-section">
        <div class="container">
            <div class="section-header" style="margin-bottom:40px;" data-aos="fade-up">
                <h2 style="color:white; font-size:2.8rem;">Constitutional <span>Pillars</span></h2>
                <p style="color:#aaa;">Foundational articles protecting citizen liberty, equality, and dignity.</p>
            </div>
            <div class="fund-grid">
                <div class="fund-item" data-aos="fade-up">
                    <span class="fund-num">ARTICLE 21</span>
                    <h4>Right to Life & Liberty</h4>
                    <p>Guarantees personal freedom, human dignity, and privacy against state overreach.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="100">
                    <span class="fund-num">ARTICLE 22</span>
                    <h4>Protection Against Arrest</h4>
                    <p>Mandates informing grounds of arrest, right to counsel, and magistrate production within 24h.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="200">
                    <span class="fund-num">ARTICLE 19</span>
                    <h4>Freedom of Speech</h4>
                    <p>Protects speech, peaceful assembly, freedom of movement, and lawful trade across India.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="300">
                    <span class="fund-num">ARTICLE 32</span>
                    <h4>Constitutional Remedies</h4>
                    <p>Direct right to approach the Supreme Court via Habeas Corpus, Mandamus, and Certiorari.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- RIGHTS BENTO GRID -->
    <section class="rights-grid-section" id="rightsGrid" style="padding:100px 0; background:#fcfcfc;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Essential <span>Legal Protections</span></h2>
                <p>Actionable protections every citizen should know when dealing with authorities, online threats, and consumer transactions.</p>
            </div>

            <div class="rights-bento">
                <div class="r-card r-dark" data-aos="fade-right">
                    <div>
                        <div class="r-icon"><i class="fas fa-handcuffs"></i></div>
                        <h3>Police & Arrest Safeguards</h3>
                        <ul class="r-list">
                            <li>Police must display clear identification and name badges before any search or arrest.</li>
                            <li>A formal Arrest Memo must be prepared with date, time, and witness signature.</li>
                            <li>You have the constitutional right to inform a family member or advocate immediately.</li>
                            <li>Mandatory medical examination by a certified doctor every 48 hours in custody.</li>
                        </ul>
                    </div>
                    <a href="know-your-rights/arrest-rights.html" class="card-link" style="color:var(--primary); font-size:15px; margin-top:20px;">Read Full Arrest Rights Guide <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card r-tall" data-aos="fade-left">
                    <div>
                        <div class="r-icon"><i class="fas fa-person-dress"></i></div>
                        <h3>Women's Protections</h3>
                        <ul class="r-list">
                            <li>Women cannot be arrested between sunset and sunrise except in exceptional circumstances with judicial magistrate prior sanction.</li>
                            <li>Arrest and body search of a female must strictly be performed only by a female officer.</li>
                            <li>Zero FIR mandate: Police cannot refuse to register sexual offence complaints on jurisdiction grounds.</li>
                            <li>Protection from domestic violence (PWDVA Act) and workplace harassment (POSH Act).</li>
                        </ul>
                    </div>
                    <a href="know-your-rights/womens-rights.html" class="card-link" style="color:var(--primary-dark); font-size:15px; margin-top:20px;">Read Women's Rights Guide <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card" data-aos="fade-up">
                    <div>
                        <div class="r-icon"><i class="fas fa-shield-virus"></i></div>
                        <h3>Cyber & Digital Rights</h3>
                        <ul class="r-list">
                            <li>Immediate financial freeze by reporting UPI or banking fraud on national helpline <strong>1930</strong>.</li>
                            <li>Right to privacy against unauthorized data leaks and digital harassment under IT Act.</li>
                            <li>Right to report deepfakes, morphing, and online stalking anonymously on cybercrime.gov.in.</li>
                        </ul>
                    </div>
                    <a href="know-your-rights/cyber-rights.html" class="card-link" style="font-size:15px; margin-top:20px;">Read Cyber Rights Guide <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="r-icon"><i class="fas fa-basket-shopping"></i></div>
                        <h3>Consumer Safeguards</h3>
                        <ul class="r-list">
                            <li>Protection against deceptive advertisements, unfair trade practices, and spurious goods.</li>
                            <li>File online consumer claims via E-Daakhil portal without mandatory advocate representation.</li>
                            <li>Statutory right to product liability compensation for defects causing financial or bodily harm.</li>
                        </ul>
                    </div>
                    <a href="know-your-rights/consumer-rights.html" class="card-link" style="font-size:15px; margin-top:20px;">Read Consumer Guide <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>

    <!-- ACTION BANNER PANEL -->
    <section style="padding:40px 0 80px; background:#fcfcfc;">
        <div class="container">
            <div class="banner-panel" data-aos="zoom-in">
                <div class="bp-left">
                    <h3>Unsure of Your <span>Current Situation?</span></h3>
                    <p>Ask NYAYI AI to analyze your case facts against relevant Indian laws, court precedents, and rights in real time.</p>
                </div>
                <a href="https://ai.nyayi.in" target="_blank" class="bp-right-btn">
                    <i class="fas fa-robot"></i> Ask AI Assistant
                </a>
            </div>
        </div>
    </section>

    <!-- LANDMARK PRECEDENTS -->
    <section class="precedents-section">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Landmark <span>Supreme Court</span> Precedents</h2>
                <p>Key apex court rulings that establish enforceable safeguards for Indian citizens.</p>
            </div>

            <div class="prec-grid">
                <div class="prec-card" data-aos="fade-up">
                    <span class="prec-case">D.K. Basu v. State of West Bengal (1997)</span>
                    <h4>Mandatory Arrest & Custody Protocols</h4>
                    <p>Established strict mandatory protocols for arrest and interrogation: visible identification tags for police, written arrest memo, informing family within 12h, and medical checks every 48 hours.</p>
                </div>

                <div class="prec-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="prec-case">K.S. Puttaswamy v. Union of India (2017)</span>
                    <h4>Fundamental Right to Privacy</h4>
                    <p>A 9-judge constitutional bench declared privacy as a fundamental right under Article 21, protecting personal data, communications, and bodily autonomy against state surveillance.</p>
                </div>

                <div class="prec-card" data-aos="fade-up">
                    <span class="prec-case">Lalita Kumari v. Govt. of UP (2014)</span>
                    <h4>Mandatory Registration of FIR</h4>
                    <p>Held that registration of an FIR is mandatory under Section 154 CrPC / BNSS Sec 173 if information discloses the commission of a cognizable offence, with no preliminary inquiry permitted in such cases.</p>
                </div>

                <div class="prec-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="prec-case">Arnesh Kumar v. State of Bihar (2014)</span>
                    <h4>Notice Before Arrest for Offences Under 7 Years</h4>
                    <p>Prohibited routine arrests in offences punishable with up to 7 years imprisonment without serving a Section 41A CrPC notice of appearance, preventing arbitrary police harassment.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- INTERACTIVE SCENARIOS -->
    <section class="scenarios-section" style="padding:80px 0 100px; background:white;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Action Plan in <span>Real Scenarios</span></h2>
                <p>Click on any scenario to reveal practical step-by-step instructions.</p>
            </div>

            <div class="scenario-grid">
                <div class="scenario-item" data-aos="fade-up">
                    <div class="scenario-header" onclick="toggleScenario(this)">
                        <h3>
                            <div class="s-icon-bubble"><i class="fas fa-shield-halved"></i></div>
                            Police Stop You for Late-Night Vehicle Checking
                        </h3>
                        <i class="fas fa-chevron-down scenario-icon"></i>
                    </div>
                    <div class="scenario-body">
                        <div class="scenario-body-content">
                            <ol class="scenario-steps">
                                <li>Remain calm, pull over safely, and politely request the officer's name and identity badge.</li>
                                <li>Present valid digital driving license and vehicle registration through DigiLocker or mParivahan apps (statutorily valid under IT Act & MV Act).</li>
                                <li>Officers cannot seize your mobile phone or search personal bags without a formal search authorization or registered crime suspicion.</li>
                                <li>If challaned, demand an official electronic e-challan or printed receipt—never pay cash without a government challan receipt.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div class="scenario-item" data-aos="fade-up" data-aos-delay="100">
                    <div class="scenario-header" onclick="toggleScenario(this)">
                        <h3>
                            <div class="s-icon-bubble"><i class="fas fa-headset"></i></div>
                            Cyber Fraud or Online Money Theft
                        </h3>
                        <i class="fas fa-chevron-down scenario-icon"></i>
                    </div>
                    <div class="scenario-body">
                        <div class="scenario-body-content">
                            <ol class="scenario-steps">
                                <li>Immediately call the national cyber financial fraud helpline at <strong>1930</strong> within the "golden hour" to freeze transacted amounts.</li>
                                <li>Block your affected bank account, credit/debit card, or UPI handles through your banking app or emergency bank numbers.</li>
                                <li>Save screenshots of transaction IDs, fraud messages, and caller numbers as digital evidence.</li>
                                <li>Lodge a formal digital complaint on the national cyber crime portal (<code>cybercrime.gov.in</code>).</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div class="scenario-item" data-aos="fade-up" data-aos-delay="200">
                    <div class="scenario-header" onclick="toggleScenario(this)">
                        <h3>
                            <div class="s-icon-bubble"><i class="fas fa-house-chimney-crack"></i></div>
                            Illegal Eviction or Security Deposit Harassment by Landlord
                        </h3>
                        <i class="fas fa-chevron-down scenario-icon"></i>
                    </div>
                    <div class="scenario-body">
                        <div class="scenario-body-content">
                            <ol class="scenario-steps">
                                <li>Landlords cannot disconnect essential services (electricity, water) or lock tenants out without a formal eviction decree from the Rent Authority.</li>
                                <li>Ensure you possess a written copy of the signed Rental Agreement and bank payment proofs of rent.</li>
                                <li>If threatened with forceful eviction, file a police complaint for criminal trespass (BNS Section 329) and unlawful restraint.</li>
                                <li>Approach the local Rent Controller / Civil Court for immediate injunction against unlawful dispossession.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        function toggleScenario(headerElement) {
            const scenarioItem = headerElement.parentElement;
            const body = scenarioItem.querySelector('.scenario-body');
            const isActive = scenarioItem.classList.contains('active');

            document.querySelectorAll('.scenario-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.scenario-body').style.maxHeight = null;
            });

            if (!isActive) {
                scenarioItem.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        }
    </script>

    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'rights.html'), hubHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'rights/index.html'), hubHtml, 'utf8');

    // Individual rights guides
    rights.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Rights Guide`, item.description, `${item.title}, legal rights India, citizen protections`, `/know-your-rights/${item.slug}.html`, 1)}
        ${renderHeader('rights', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../rights.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Rights Overview</a>
                <h1 style="margin:16px 0 20px; font-size:3rem;">${item.title}</h1>
                <p style="margin:0; font-size:1.2rem; color:#555; max-width:100%;">${item.description}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid #eee; border-radius:24px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.03); margin-bottom:30px;" data-aos="fade-up">
                    <h2 style="font-size:24px; margin-bottom:16px; font-weight:800;">Important Legal Points to Know</h2>
                    <ul style="padding-left:20px; line-height:1.9; color:#555; margin-bottom:30px;">
                        ${item.importantPoints.map(p => `<li style="margin-bottom:12px;">${p}</li>`).join('')}
                    </ul>

                    <h2 style="font-size:24px; margin-bottom:16px; font-weight:800;">Practical Action Steps</h2>
                    <ol style="padding-left:20px; line-height:1.9; color:#555;">
                        ${item.practicalSteps.map(s => `<li style="margin-bottom:12px;">${s}</li>`).join('')}
                    </ol>
                </div>

                <div style="text-align:center; margin-top:40px;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai"><i class="fas fa-robot"></i> Ask AI About Your Rights</a>
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `know-your-rights/${item.slug}.html`), pageHtml, 'utf8');
    });
}

// 4. BUILD FEATURES, CONTACT, APP, LAWS, GUIDES, POLICIES
function buildFeaturesAndOther() {
    // Features Page with original 6 feature cards and CTA box
    const featuresHtml = `
    ${renderHead('Features | NYAYI Legal AI', 'Explore features of NYAYI: BNS IPC Converter, FIR Drafter, Case Search, 22+ Languages, and AI Legal Terminal.', 'NYAYI features, IPC BNS converter, draft FIR generator, AI legal assistant', '/features.html')}
    ${renderHeader('features', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Core <span>Legal Capabilities</span></h1>
            <p>Engineered with legal-grade natural language AI, precision converters, and dynamic drafting modules.</p>
        </div>
    </section>

    <section class="features-section">
        <div class="container">
            <div class="features-grid">
                
                <div class="feature-card" data-aos="fade-up">
                    <div>
                        <div class="fc-icon"><i class="fas fa-brain"></i></div>
                        <h3>Smart Case Search</h3>
                        <p>Express legal concerns in simple conversational language. The neural core maps descriptions directly to relevant IPC, BNS, and Constitutional provisions.</p>
                    </div>
                    <span class="fc-tag">AI Powered</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="fc-icon"><i class="fas fa-arrow-right-arrow-left"></i></div>
                        <h3>IPC & BNS Converter</h3>
                        <p>Seamlessly translate classic Indian Penal Code (IPC) sections into their updated Bharatiya Nyaya Sanhita (BNS) equivalents in real-time.</p>
                    </div>
                    <span class="fc-tag">Statutory Utility</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="fc-icon"><i class="fas fa-file-signature"></i></div>
                        <h3>Draft FIR Generator</h3>
                        <p>Generate structured, legally sound First Information Report (FIR) drafts by answering guided prompts about incident details.</p>
                    </div>
                    <span class="fc-tag">Auto-Drafting</span>
                </div>

                <div class="feature-card" data-aos="fade-up">
                    <div>
                        <div class="fc-icon"><i class="fas fa-building-user"></i></div>
                        <h3>Rent Agreement Drafter</h3>
                        <p>Create customizable rental contracts formatted to standard Indian real estate legal norms in less than 30 seconds.</p>
                    </div>
                    <span class="fc-tag">Document Builder</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="fc-icon"><i class="fas fa-calculator"></i></div>
                        <h3>Traffic Fine Calculator</h3>
                        <p>Calculate fine amounts, legal liabilities, and court summons risks based on the active Motor Vehicles Amendment Act.</p>
                    </div>
                    <span class="fc-tag">Instant Calculator</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="fc-icon"><i class="fas fa-language"></i></div>
                        <h3>22+ Indian Languages</h3>
                        <p>Query, process, and read legal outputs in 22+ official Indian languages with context-aware voice query support.</p>
                    </div>
                    <span class="fc-tag">Multilingual AI</span>
                </div>

            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <div class="cta-box" data-aos="zoom-in">
                <h2>Experience AI Legal Assistance</h2>
                <p>Get fast, confidential, and intelligent guidance for your legal queries right now.</p>
                <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="display:inline-flex; font-size:18px; padding:18px 45px;">
                    <i class="fas fa-rocket"></i> Launch NYAYI Web AI
                </a>
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'features.html'), featuresHtml, 'utf8');

    // Contact Page
    const contactHtml = `
    ${renderHead('Contact Support | NYAYI Legal AI', 'Get in touch with Farhan Khan & Kamran Sheikh regarding NYAYI platform support or feedback.', 'Contact NYAYI, Farhan Khan contact, Kamran Sheikh contact', '/contact.html')}
    ${renderHeader('home', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Get in <span>Touch</span></h1>
            <p>Have questions or feedback? Reach out directly to the creators of NYAYI.</p>
        </div>
    </section>

    ${renderArchitectsSection()}

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'contact.html'), contactHtml, 'utf8');

    // App Page
    const appHtml = `
    ${renderHead('Mobile App | NYAYI Legal AI', 'Download NYAYI Mobile App or launch the Web AI terminal directly on your smartphone.', 'NYAYI app, legal AI app India', '/app.html')}
    ${renderHeader('app', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>NYAYI <span>Mobile App</span></h1>
            <p>Access voice-assisted legal answers and case search on any mobile device.</p>
            <div style="margin-top:30px;">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-ai"><i class="fas fa-mobile-screen"></i> Launch Web App Immediately</a>
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'app.html'), appHtml, 'utf8');

    // Laws Hub: generate laws.html and laws/index.html
    const lawsHub = `
    ${renderHead('Indian Laws Library | NYAYI Legal AI', 'Comprehensive guide to major Indian acts, Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Constitutional laws.', 'Indian Laws Library, BNS 2023, BNSS 2023, BSA 2023, Constitution of India', '/laws.html', 0)}
    ${renderHeader('laws', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Indian Laws <span>Library</span></h1>
            <p>Structured breakdowns of major Indian acts, new criminal codes, and constitutional frameworks.</p>
        </div>
    </section>

    <section style="padding:40px 0 100px; background:#fff;">
        <div class="container">
            <div class="laws-grid">
                ${laws.map(item => `
                    <div class="law-card" data-aos="fade-up">
                        <div>
                            <span class="card-tag">${item.category}</span>
                            <h3 style="margin-top:10px;">${item.title}</h3>
                            <p>${item.purpose}</p>
                        </div>
                        <a href="laws/${item.slug}.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'laws.html'), lawsHub, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'laws/index.html'), lawsHub.replace(/laws\//g, '').replace(/\.\/css\//g, '../css/'), 'utf8');

    laws.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} (${item.shortName}) | Act Analysis`, item.purpose, `${item.title}, ${item.shortName}, Indian law`, `/laws/${item.slug}.html`, 1)}
        ${renderHeader('laws', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../laws.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Laws Library</a>
                <span class="cp-role" style="margin-top:20px; display:inline-block;">Enacted: ${item.enacted}</span>
                <h1 style="margin:10px 0 20px; font-size:3rem;">${item.title}</h1>
                <p style="margin:0; font-size:1.2rem; color:#555; max-width:100%;">${item.purpose}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid #eee; border-radius:24px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h2 style="font-size:24px; margin-bottom:16px; font-weight:800;">Key Concepts & Structural Highlights</h2>
                    <ul style="padding-left:20px; line-height:1.9; color:#555; margin-bottom:30px;">
                        ${item.importantConcepts.map(c => `<li style="margin-bottom:12px;">${c}</li>`).join('')}
                    </ul>

                    <h2 style="font-size:24px; margin-bottom:12px; font-weight:800;">Practical Relevance</h2>
                    <p style="font-size:16px; color:#555; line-height:1.8; margin-bottom:30px;">${item.practicalRelevance}</p>

                    <div style="border-top:1px solid #edf2f7; padding-top:20px; color:#718096; font-size:14px;">
                        <strong>Official Reference:</strong> ${item.officialRef}
                    </div>
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `laws/${item.slug}.html`), pageHtml, 'utf8');
    });

    // Guides Hub: generate guides.html and legal-guides/index.html
    const guidesHub = `
    ${renderHead('Legal Guides | Practical Procedures in India', 'Step-by-step guides on filing FIRs, reporting cyber crimes, obtaining bail, and understanding court procedures.', 'Legal Guides India, how to file FIR, cyber crime report guide, bail process India', '/guides.html', 0)}
    ${renderHeader('guides', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Step-by-Step <span>Legal Guides</span></h1>
            <p>Clear, practical instructions breaking down complex court and police procedures into understandable steps.</p>
        </div>
    </section>

    <section style="padding:40px 0 100px; background:#fff;">
        <div class="container">
            <div class="guides-grid">
                ${guides.map(item => `
                    <div class="guide-card" data-aos="fade-up">
                        <div>
                            <span class="card-tag">${item.category} • ${item.readingTime}</span>
                            <h3 style="margin-top:8px;">${item.title}</h3>
                            <p>${item.summary}</p>
                        </div>
                        <a href="legal-guides/${item.slug}.html" class="card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'guides.html'), guidesHub, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'legal-guides/index.html'), guidesHub.replace(/legal-guides\//g, '').replace(/\.\/css\//g, '../css/'), 'utf8');

    guides.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Guide`, item.summary, `${item.title}, legal procedure guide India`, `/legal-guides/${item.slug}.html`, 1)}
        ${renderHeader('guides', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../guides.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Legal Guides</a>
                <span class="cp-role" style="margin-top:20px; display:inline-block;">${item.category}</span>
                <h1 style="margin:10px 0 20px; font-size:3rem;">${item.title}</h1>
                <p style="margin:0; font-size:1.2rem; color:#555; max-width:100%;">${item.summary}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid #eee; border-radius:24px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h2 style="font-size:24px; margin-bottom:24px; font-weight:800;">Step-by-Step Procedure</h2>
                    ${item.steps.map(s => `
                        <div style="display:flex; gap:20px; margin-bottom:28px;">
                            <div style="width:40px; height:40px; background:var(--primary); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; flex-shrink:0;">${s.num}</div>
                            <div>
                                <h3 style="font-size:18px; margin-bottom:6px; font-weight:800;">${s.heading}</h3>
                                <p style="font-size:15px; color:#555; margin:0;">${s.text}</p>
                            </div>
                        </div>
                    `).join('')}

                    ${item.warnings.length ? `
                        <div style="background:#fff5f5; border-left:4px solid #e53e3e; padding:20px; border-radius:12px; margin-top:30px;">
                            <strong style="color:#c53030;"><i class="fas fa-exclamation-triangle"></i> Important Warning:</strong>
                            ${item.warnings.map(w => `<p style="margin:6px 0 0; color:#9b2c2c; font-size:14px;">${w}</p>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `legal-guides/${item.slug}.html`), pageHtml, 'utf8');
    });

    // Policy Pages
    const disclaimerHtml = `
    ${renderHead('Legal Disclaimer | NYAYI Legal AI', 'Important disclaimer: NYAYI provides legal information, not professional advocate representation.', 'NYAYI disclaimer', '/legal-disclaimer.html', 0)}
    ${renderHeader('home', 0)}
    <section class="page-header">
        <div class="container" style="max-width:800px;" data-aos="zoom-in">
            <h1>Legal <span>Disclaimer</span></h1>
            <div style="line-height:1.8; color:#555; text-align:left; margin-top:30px;">
                <p><strong>1. Informational Purpose Only:</strong> NYAYI is an educational and legal information platform. The content provided on this website, including legal dictionary terms, guides, and AI responses, does NOT constitute formal legal advice or create an advocate-client relationship.</p>
                <p><strong>2. No Guarantee of Court Outcome:</strong> Legal statutes and court precedents vary based on individual case facts. For formal court representation or litigation advice, users must consult a licensed advocate.</p>
            </div>
        </div>
    </section>
    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'legal-disclaimer.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'privacy-policy.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'terms-of-use.html'), disclaimerHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'cookie-policy.html'), disclaimerHtml, 'utf8');

    // Articles Page
    const blogHtml = `
    ${renderHead('Legal Articles | NYAYI Legal AI', 'Read legal insights, BNS 2023 updates, and legal awareness articles written by Farhan Khan & Kamran Sheikh.', 'Legal articles India, BNS updates, legal tech blog', '/articles.html', 0)}
    ${renderHeader('articles', 0)}
    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Legal <span>Articles</span></h1>
            <p>Editorial updates, deep-dive law explainers, and technology insights.</p>
        </div>
    </section>
    <section style="padding:40px 0 100px; background:#fff;">
        <div class="container">
            <div class="articles-grid">
                ${articles.map(art => `
                    <div class="article-card" data-aos="fade-up">
                        <div>
                            <span class="card-tag">${art.category} • ${art.date}</span>
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
    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'articles.html'), blogHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'blog/index.html'), blogHtml, 'utf8');

    // Sitemap & Robots
    const urls = [
        'https://nyayi.in/index.html',
        'https://nyayi.in/features.html',
        'https://nyayi.in/dictionary.html',
        'https://nyayi.in/rights.html',
        'https://nyayi.in/laws.html',
        'https://nyayi.in/guides.html',
        'https://nyayi.in/articles.html',
        'https://nyayi.in/contact.html',
        'https://nyayi.in/app.html',
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
    console.log('Generated: Sitemap & Robots.txt');
}

// EXECUTE ALL BUILD STEPS
console.log('Starting NYAYI Static Site Generator Build...');
buildHomepage();
buildDictionary();
buildRights();
buildFeaturesAndOther();
console.log('BUILD COMPLETE! All static pages generated successfully with exact original visual aesthetics.');
