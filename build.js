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
    "sameAs": [
        "https://instagram.com/nyayi.ai",
        "https://instagram.com/sajj1507",
        "https://instagram.com/kamran.irll"
    ],
    "founder": {
        "@type": "Person",
        "name": "NYAYI Legal Knowledge Foundation"
    },
    "description": "India's modern legal knowledge platform providing reliable legal research, terminology explainers, BNS/IPC converters, and rights guides."
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
    const canonical = pathUrl === '/' ? 'https://nyayi.in/' : `https://nyayi.in${pathUrl}`;
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
    <meta name="author" content="NYAYI Legal Editorial Board">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English, Hindi">
    <link rel="canonical" href="${canonical}">

    <!-- Open Graph / Social -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${cleanTitle}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://nyayi.in/images/logo.png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${cleanTitle}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://nyayi.in/images/logo.png">

    <!-- Favicon & Touch Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="${relPrefix}favicon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="${relPrefix}favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="${relPrefix}apple-touch-icon.png">
    <link rel="shortcut icon" href="${relPrefix}favicon.ico">

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
    const homeUrl = depth === 1 ? '../' : './';
    const isBlogActive = ['laws', 'guides', 'articles', 'blog'].includes(activePage);

    return `
    <div class="mobile-menu" id="mobileMenu">
        <div class="close-menu" onclick="toggleMenu()"><i class="fas fa-times"></i></div>
        <a href="${homeUrl}" onclick="toggleMenu()" class="${activePage === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}features.html" onclick="toggleMenu()" class="${activePage === 'features' ? 'active' : ''}">Features</a>
        <a href="${p}dictionary.html" onclick="toggleMenu()" class="${activePage === 'dictionary' ? 'active' : ''}">Legal Dictionary</a>
        <a href="${p}rights.html" onclick="toggleMenu()" class="${activePage === 'rights' ? 'active' : ''}">Know Your Rights</a>
        
        <div class="mobile-group">
            <span class="mobile-group-label"><i class="fas fa-newspaper" style="color:var(--primary);"></i> Blog & Resources</span>
            <div class="mobile-group-links">
                <a href="${p}laws.html" onclick="toggleMenu()" class="${activePage === 'laws' ? 'active' : ''}"><i class="fas fa-book-scale"></i> Laws Library</a>
                <a href="${p}guides.html" onclick="toggleMenu()" class="${activePage === 'guides' ? 'active' : ''}"><i class="fas fa-compass"></i> Legal Guides</a>
                <a href="${p}articles.html" onclick="toggleMenu()" class="${activePage === 'articles' ? 'active' : ''}"><i class="fas fa-newspaper"></i> Articles & Updates</a>
            </div>
        </div>

        <a href="${p}app.html" onclick="toggleMenu()" class="${activePage === 'app' ? 'active' : ''}" style="color:var(--primary); font-weight:800;"><i class="fas fa-mobile-screen"></i> Mobile App</a>
        <a href="https://ai.nyayi.in" target="_blank" class="mobile-launch-btn">
            <i class="fas fa-rocket"></i> Launch Web AI
        </a>
    </div>

    <header>
        <div class="nav-capsule">
            <a href="${homeUrl}" class="logo">
                <i class="fas fa-scale-balanced" style="color:var(--primary);"></i> NYAYI<span>.</span>
            </a>
            
            <ul class="nav-links">
                <li><a href="${homeUrl}" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
                <li><a href="${p}features.html" class="${activePage === 'features' ? 'active' : ''}">Features</a></li>
                <li><a href="${p}dictionary.html" class="${activePage === 'dictionary' ? 'active' : ''}">Dictionary</a></li>
                <li><a href="${p}rights.html" class="${activePage === 'rights' ? 'active' : ''}">Rights</a></li>
                <li class="nav-dropdown" id="blogDropdown">
                    <button type="button" class="dropdown-toggle ${isBlogActive ? 'active' : ''}" onclick="toggleBlogDropdown(event)">
                        Blog <i class="fas fa-chevron-down dropdown-arrow"></i>
                    </button>
                    <div class="dropdown-panel">
                        <a href="${p}laws.html" class="${activePage === 'laws' ? 'active' : ''}"><i class="fas fa-book-scale"></i> Laws Library</a>
                        <a href="${p}guides.html" class="${activePage === 'guides' ? 'active' : ''}"><i class="fas fa-compass"></i> Legal Guides</a>
                        <a href="${p}articles.html" class="${activePage === 'articles' ? 'active' : ''}"><i class="fas fa-newspaper"></i> Articles & Updates</a>
                    </div>
                </li>
                <li><a href="${p}app.html" style="color:var(--primary);" class="${activePage === 'app' ? 'active' : ''}">Mobile App</a></li>
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
    <section class="creators-section" id="architects">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>THE <span>ARCHITECTS</span></h2>
                <p>Meet the people building NYAYI.</p>
            </div>
            
            <div class="creators-grid">
                <div class="creator-profile" data-aos="fade-up">
                    <div class="cp-icon"><i class="fas fa-user-tie"></i></div>
                    <h3>NYAYI Legal Technology Division</h3>
                    <span class="cp-role">AI Systems & Digital Infrastructure</span>
                    <div class="cp-actions">
                        <a href="https://instagram.com/sajj1507" target="_blank" class="cp-btn"><i class="fab fa-instagram"></i> View Profile</a>
                        <a href="tel:9598042676" class="cp-btn secondary"><i class="fas fa-phone-alt"></i> Call +91 9598042676</a>
                    </div>
                </div>
                
                <div class="creator-profile" data-aos="fade-up" data-aos-delay="100">
                    <div class="cp-icon"><i class="fas fa-user-tie"></i></div>
                    <h3>NYAYI Legal Research Council</h3>
                    <span class="cp-role">Statutory Research & Code Mapping</span>
                    <div class="cp-actions">
                        <a href="https://instagram.com/kamran.irll" target="_blank" class="cp-btn"><i class="fab fa-instagram"></i> View Profile</a>
                        <a href="tel:7393905299" class="cp-btn secondary"><i class="fas fa-phone-alt"></i> Call +91 7393905299</a>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

function renderFooter(depth = 0) {
    const p = depth === 1 ? '../' : './';
    const homeUrl = depth === 1 ? '../' : './';
    return `
    <footer>
        <div class="container footer-grid">
            <div class="footer-brand">
                <h2><i class="fas fa-scale-balanced" style="color:var(--primary);"></i> NYAYI<span>.</span></h2>
                <p>Bridging the gap between the common man and the law through advanced Artificial Intelligence.</p>
                <div style="margin-top:18px;">
                    <a href="https://instagram.com/nyayi.ai" target="_blank" style="display:inline-flex; align-items:center; gap:8px; color:white; font-size:13.5px; font-weight:700; text-decoration:none; background:rgba(255,255,255,0.08); padding:8px 18px; border-radius:30px; border:1px solid rgba(255,255,255,0.15); transition:0.3s;">
                        <i class="fab fa-instagram" style="color:#e1306c; font-size:16px;"></i> @nyayi.ai
                    </a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Platform</h4>
                <ul>
                    <li><a href="${homeUrl}">Home</a></li>
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
                    <li><a href="https://instagram.com/nyayi.ai" target="_blank"><i class="fab fa-instagram" style="color:#e1306c; font-size:12px;"></i> Instagram @nyayi.ai</a></li>
                    <li><a href="${p}privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="${p}legal-disclaimer.html">Legal Disclaimer</a></li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <div>&copy; 2026 NYAYI — Official Indian Legal Knowledge Platform. All Rights Reserved.</div>
            <div class="powered-tag">Powered by WebGlut</div>
        </div>
    </footer>

    <div class="scroll-top" onclick="scrollToTop()">
        <i class="fas fa-chevron-up"></i>
    </div>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
        window.scrollTo(0, 0);
        document.addEventListener("DOMContentLoaded", function() {
            window.scrollTo(0, 0);
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true, offset: 30 });
            }
        });

        function toggleMenu() {
            const menu = document.getElementById('mobileMenu');
            if (menu) menu.classList.toggle('active');
        }

        function toggleFaq(element) {
            const faqItem = element.closest ? element.closest('.faq-item') : element.parentElement;
            if (!faqItem) return;
            const body = faqItem.querySelector('.faq-body');
            const isActive = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const b = item.querySelector('.faq-body');
                if (b) b.style.maxHeight = null;
            });

            if (!isActive && body) {
                faqItem.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        }

        function toggleBlogDropdown(e) {
            if (e) e.stopPropagation();
            const drop = document.getElementById('blogDropdown');
            if (drop) drop.classList.toggle('open');
        }

        document.addEventListener('click', function(e) {
            const drop = document.getElementById('blogDropdown');
            if (drop && !drop.contains(e.target)) {
                drop.classList.remove('open');
            }
        });

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        if (cursorDot && cursorOutline) {
            window.addEventListener('mousemove', function(e) {
                const posX = e.clientX;
                const posY = e.clientY;
                cursorDot.style.left = \`\${posX}px\`;
                cursorDot.style.top = \`\${posY}px\`;
                cursorOutline.animate({ left: \`\${posX}px\`, top: \`\${posY}px\` }, { duration: 500, fill: "forwards" });
            });
        }

        const hoverElements = document.querySelectorAll('a, button, .b-card, .creator-profile, .faq-item, .chat-ui, .info-card, .feature-card, .dict-card, .law-card, .guide-card, .rights-card, .article-card, .cp-btn, .filter-btn, .search-box input, .scenario-header, .pillar-card, .term-pill, .step-card, .philosophy-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });

        const scrollTopBtn = document.querySelector('.scroll-top');
        if (scrollTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) scrollTopBtn.classList.add('active');
                else scrollTopBtn.classList.remove('active');
            });
        }
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
</body>
</html>`;
}

// 1. GENERATE HOMEPAGE (index.html)
function buildHomepage() {
    const popularTermNames = ['FIR', 'Bail', 'Arrest', 'Anticipatory Bail', 'Legal Notice', 'Injunction', 'Affidavit', 'Jurisdiction', 'Appeal', 'Warrant', 'Complaint', 'Evidence'];
    const popularTermsPills = popularTermNames.map(termName => {
        const found = dictionary.find(d => d.term.toLowerCase() === termName.toLowerCase() || d.term.toLowerCase().includes(termName.toLowerCase()));
        const slug = found ? found.slug : 'fir';
        return `<a href="dictionary/${slug}.html" class="term-pill"><i class="fas fa-book-bookmark" style="color:var(--primary);"></i> ${termName}</a>`;
    }).join('');

    const html = `
    ${renderHead('NYAYI – Indian Legal Knowledge & AI-Powered Legal Assistance', 'NYAYI is a modern Indian legal knowledge platform. Understand Indian law, discover your legal rights, explore legal terms, read legal guides, and access AI legal assistance.', 'Nyayi, Indian Legal AI, AI lawyer India, free legal advice India, BNS 2023, IPC sections, cyber crime help, Indian Constitution', '/')}
    ${renderHeader('home', 0)}

    <!-- 1. HERO SECTION -->
    <section class="hero">
        <div class="container hero-content" data-aos="zoom-in">
            <h1>Legal Knowledge. <br> <span>Made Simple.</span></h1>
            <p>NYAYI is a modern Indian legal knowledge platform. Easily understand Indian law, discover your fundamental rights, explore legal terminology, read practical guides, and access AI-assisted legal research.</p>
            
            <div class="hero-btns">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-ai">
                    <i class="fas fa-robot"></i> Launch NYAYI AI
                </a>
                <a href="#explore-knowledge" class="btn-outline">
                    <i class="fas fa-compass"></i> Explore Legal Knowledge
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
                        You can use our integrated <strong>IPC & BNS Converter</strong> to map any old section directly to its active counterpart in the new Bharatiya Nyaya Sanhita (BNS) instantly.
                    </div>
                </div>
            </a>
        </div>
    </section>

    <!-- 2. STATS STRIP -->
    <section class="stats-strip">
        <div class="container stats-grid">
            <div data-aos="fade-up"><span class="stat-badge">STATUTORY COVERAGE</span><div class="stat-num">511+</div><div class="stat-label">IPC & BNS Sections Covered</div></div>
            <div data-aos="fade-up" data-aos-delay="100"><span class="stat-badge">MULTILINGUAL</span><div class="stat-num">22+</div><div class="stat-label">Indian Languages Supported</div></div>
            <div data-aos="fade-up" data-aos-delay="200"><span class="stat-badge">DATA SAFETY</span><div class="stat-num">100%</div><div class="stat-label">Privacy-Conscious Architecture</div></div>
            <div data-aos="fade-up" data-aos-delay="300"><span class="stat-badge">AI POWERED</span><div class="stat-num">24/7</div><div class="stat-label">Instant Knowledge Access</div></div>
        </div>
    </section>

    <!-- 3. WHAT IS NYAYI? SECTION -->
    <section style="padding:110px 0; background:#ffffff;" id="about">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>What is <span>NYAYI?</span></h2>
                <p>Demystifying the Indian legal ecosystem through structured research, plain-language guides, and modern technology.</p>
            </div>
            
            <div style="max-width:900px; margin:0 auto; background:var(--bg-light); border:1px solid #eaeaea; border-radius:35px; padding:50px; box-shadow:0 15px 40px rgba(0,0,0,0.02);" data-aos="fade-up">
                <p style="font-size:1.15rem; color:#444; line-height:1.9; margin-bottom:24px;">
                    <strong>NYAYI</strong> is an advanced Indian legal information platform built to make complex statutory frameworks, constitutional rights, and court procedures accessible to every citizen. By organizing legal jargon into structured dictionaries, actionable rights breakdowns, and step-by-step procedure guides, NYAYI bridges the gap between everyday citizens and the law.
                </p>
                <p style="font-size:1.1rem; color:#555; line-height:1.8; margin-bottom:24px;">
                    Whether you are researching the new Bharatiya Nyaya Sanhita (BNS 2023), understanding police bail protocols, checking consumer safeguards, or filing a digital cyber complaint—NYAYI provides reliable, structured knowledge at your fingertips.
                </p>
                <div style="background:#fff; border-left:4px solid var(--primary); padding:20px 25px; border-radius:15px; margin-top:25px;">
                    <strong style="color:var(--dark); font-size:15px;"><i class="fas fa-circle-info" style="color:var(--primary);"></i> Important Advocate Disclaimer:</strong>
                    <p style="font-size:14px; color:#666; margin:6px 0 0; line-height:1.6;">
                        NYAYI is an informational research tool designed to build legal awareness and literacy. NYAYI does not provide formal legal representation, litigation advice, or replace licensed advocates.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. EXPLORE LEGAL KNOWLEDGE SECTION (4 PILLARS) -->
    <section style="padding:100px 0; background:#f9fbf9;" id="explore-knowledge">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Explore <span>Legal Knowledge</span></h2>
                <p>Four primary knowledge pillars engineered for citizen empowerment and legal literacy.</p>
            </div>

            <div class="pillars-grid">
                <div class="pillar-card" data-aos="fade-up">
                    <div>
                        <div class="pillar-icon"><i class="fas fa-book-bookmark"></i></div>
                        <h3>Legal Dictionary</h3>
                        <p>Simplified explanations for Latin maxims, BNS/IPC sections, procedural terms, and court jargon in plain English.</p>
                    </div>
                    <a href="dictionary.html" class="card-link">Explore Dictionary <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="pillar-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="pillar-icon"><i class="fas fa-shield-halved"></i></div>
                        <h3>Know Your Rights</h3>
                        <p>Actionable constitutional safeguards and statutory protections against arbitrary detention, police overreach, and fraud.</p>
                    </div>
                    <a href="rights.html" class="card-link">Explore Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="pillar-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="pillar-icon"><i class="fas fa-scale-balanced"></i></div>
                        <h3>Indian Laws</h3>
                        <p>Structured breakdowns of major Indian acts, BNS 2023, BNSS 2023, BSA 2023, and the Constitution of India.</p>
                    </div>
                    <a href="laws.html" class="card-link">Explore Indian Laws <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="pillar-card" data-aos="fade-up" data-aos-delay="300">
                    <div>
                        <div class="pillar-icon"><i class="fas fa-file-lines"></i></div>
                        <h3>Legal Guides</h3>
                        <p>Step-by-step practical walk-throughs breaking down police FIRs, bail procedures, cyber fraud reports, and notices.</p>
                    </div>
                    <a href="guides.html" class="card-link">Explore Guides <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. LEGAL DICTIONARY HOMEPAGE SECTION -->
    <section style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Legal <span>Dictionary</span></h2>
                <p>Legal terminology can feel overwhelming. NYAYI explains important legal terms in accessible language.</p>
            </div>

            <div class="search-box" data-aos="fade-up" style="margin-bottom:30px;">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search legal terms (e.g. FIR, Bail, Injunction, Affidavit)..." onclick="window.location.href='dictionary.html'">
            </div>

            <div class="terms-preview-grid" data-aos="fade-up" data-aos-delay="100">
                ${popularTermsPills}
            </div>

            <div style="text-align:center; margin-top:20px;" data-aos="fade-up">
                <a href="dictionary.html" class="btn-outline">
                    <i class="fas fa-book-open"></i> Explore Full Legal Dictionary <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 6. KNOW YOUR RIGHTS SECTION -->
    <section style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Know Your <span>Rights</span></h2>
                <p>Understanding basic legal rights helps citizens confidently navigate everyday legal situations.</p>
            </div>

            <div class="card-grid">
                <div class="info-card" data-aos="fade-up">
                    <div>
                        <div class="card-icon"><i class="fas fa-handcuffs"></i></div>
                        <h3>Police & Arrest Rights</h3>
                        <p>Statutory rights during arrest: grounds of arrest notification (BNSS Sec 35), right to inform family within 12h, and medical exam mandates.</p>
                    </div>
                    <a href="know-your-rights/arrest-rights.html" class="card-link">Read Arrest Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="info-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="card-icon"><i class="fas fa-person-dress"></i></div>
                        <h3>Women's Legal Safeguards</h3>
                        <p>Special constitutional protections, prohibition of arrest after sunset without Magistrate approval, Zero FIR rights, and POSH Act mandates.</p>
                    </div>
                    <a href="know-your-rights/womens-rights.html" class="card-link">Read Women's Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="info-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="card-icon"><i class="fas fa-shield-cat"></i></div>
                        <h3>Cyber & Digital Privacy</h3>
                        <p>Right to data privacy under Article 21, financial fraud emergency reporting (National Helpline 1930), and IT Act protections.</p>
                    </div>
                    <a href="know-your-rights/cyber-rights.html" class="card-link">Read Cyber Rights <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>

            <div style="text-align:center; margin-top:40px;" data-aos="fade-up">
                <a href="rights.html" class="btn-outline">
                    <i class="fas fa-shield-halved"></i> Explore All Rights Guides <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 7. INDIAN LAWS SECTION -->
    <section style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Indian <span>Laws</span></h2>
                <p>Structured breakdowns of important Indian statutory acts and legal frameworks in accessible language.</p>
            </div>

            <div class="laws-grid">
                <div class="law-card" data-aos="fade-up">
                    <div>
                        <span class="card-tag">Supreme Law</span>
                        <h3 style="margin-top:10px;">Constitution of India</h3>
                        <p>The supreme legal document establishing fundamental rights, state directive principles, and governance frameworks.</p>
                    </div>
                    <a href="laws/constitution.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="law-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <span class="card-tag">Criminal Law (2023)</span>
                        <h3 style="margin-top:10px;">Bharatiya Nyaya Sanhita (BNS)</h3>
                        <p>The modern criminal code replacing the Indian Penal Code 1860, modernizing offences, punishments, and cyber laws.</p>
                    </div>
                    <a href="laws/bns.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="law-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <span class="card-tag">Procedure Code (2023)</span>
                        <h3 style="margin-top:10px;">Bharatiya Nagarik Suraksha Sanhita (BNSS)</h3>
                        <p>Replaces the CrPC 1973, establishing timelines for trial, digital FIR registration, and arrest protocols.</p>
                    </div>
                    <a href="laws/bnss.html" class="card-link">View Act Analysis <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>

            <div style="text-align:center; margin-top:40px;" data-aos="fade-up">
                <a href="laws.html" class="btn-outline">
                    <i class="fas fa-landmark"></i> Explore Laws Library <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 8. LEGAL GUIDES SECTION -->
    <section style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Step-by-Step <span>Legal Guides</span></h2>
                <p>Practical legal education breaking down complex court and police procedures into clear actionable steps.</p>
            </div>

            <div class="guides-grid">
                <div class="guide-card" data-aos="fade-up">
                    <div>
                        <span class="card-tag">Police Procedure • 5 Min</span>
                        <h3 style="margin-top:8px;">How to File an FIR</h3>
                        <p>Complete step-by-step process for registering a First Information Report at a police station or online portal.</p>
                    </div>
                    <a href="legal-guides/how-to-file-an-fir.html" class="card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="guide-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <span class="card-tag">Court Process • 7 Min</span>
                        <h3 style="margin-top:8px;">Understanding Bail</h3>
                        <p>Clear explainer on bailable vs non-bailable offences, anticipatory bail applications under BNSS 482, and bond requirements.</p>
                    </div>
                    <a href="legal-guides/understanding-anticipatory-bail.html" class="card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="guide-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <span class="card-tag">Cyber Helpline • 4 Min</span>
                        <h3 style="margin-top:8px;">What to Do After Online Fraud</h3>
                        <p>Immediate steps to freeze bank transfers via 1930 helpline and lodge official reports on cybercrime.gov.in.</p>
                    </div>
                    <a href="legal-guides/how-to-report-cyber-crime.html" class="card-link">Read Full Guide <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>

            <div style="text-align:center; margin-top:40px;" data-aos="fade-up">
                <a href="guides.html" class="btn-outline">
                    <i class="fas fa-file-lines"></i> View All Practical Guides <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 9. FEATURES SECTION -->
    <section class="features-section" style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Product <span>Capabilities</span></h2>
                <p>Refined computational utilities engineered to simplify legal workflows.</p>
            </div>

            <div class="features-grid">
                <div class="feature-card" data-aos="fade-up">
                    <div>
                        <div class="fc-icon"><i class="fas fa-brain"></i></div>
                        <h3>Smart Case Search</h3>
                        <p>Express legal concerns in simple conversational language to map descriptions directly to IPC, BNS, and court provisions.</p>
                    </div>
                    <span class="fc-tag">AI Powered</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div class="fc-icon"><i class="fas fa-arrow-right-arrow-left"></i></div>
                        <h3>IPC & BNS Converter</h3>
                        <p>Seamlessly translate classic Indian Penal Code (IPC) sections into their updated Bharatiya Nyaya Sanhita (BNS) equivalents.</p>
                    </div>
                    <span class="fc-tag">Statutory Utility</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="fc-icon"><i class="fas fa-file-signature"></i></div>
                        <h3>Draft FIR Generator</h3>
                        <p>Generate structured, legally sound First Information Report (FIR) drafts by answering guided incident prompts.</p>
                    </div>
                    <span class="fc-tag">Auto-Drafting</span>
                </div>
            </div>

            <div style="text-align:center; margin-top:40px;" data-aos="fade-up">
                <a href="features.html" class="btn-outline">
                    <i class="fas fa-layer-group"></i> Explore All Features <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 10. HOW NYAYI WORKS SECTION -->
    <section style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>How NYAYI <span>Works</span></h2>
                <p>A simple four-step process for accessing legal knowledge and computational research.</p>
            </div>

            <div class="steps-grid">
                <div class="step-card" data-aos="fade-up">
                    <span class="step-num">STEP 01</span>
                    <h3>Explore</h3>
                    <p>Find legal concepts, citizen rights, statutory acts, and practical procedure guides.</p>
                </div>
                <div class="step-card" data-aos="fade-up" data-aos-delay="100">
                    <span class="step-num">STEP 02</span>
                    <h3>Understand</h3>
                    <p>Read simplified plain-language explanations, precedents, and step-by-step walk-throughs.</p>
                </div>
                <div class="step-card" data-aos="fade-up" data-aos-delay="200">
                    <span class="step-num">STEP 03</span>
                    <h3>Learn</h3>
                    <p>Explore statutory references, BNS/IPC code mappings, and constitutional protections.</p>
                </div>
                <div class="step-card" data-aos="fade-up" data-aos-delay="300">
                    <span class="step-num">STEP 04</span>
                    <h3>Use NYAYI AI</h3>
                    <p>For AI-assisted legal research and conversational guidance, launch <a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary); font-weight:700;">ai.nyayi.in</a>.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 11. WHY NYAYI SECTION -->
    <section style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Why <span>NYAYI?</span></h2>
                <p>Core principles guiding our legal information architecture and user experience.</p>
            </div>

            <div class="philosophy-grid">
                <div class="philosophy-card" data-aos="fade-up">
                    <div class="ph-icon"><i class="fas fa-universal-access"></i></div>
                    <h3>Accessible Knowledge</h3>
                    <p>Demystifying complex legal terminology into simple, structured plain-language explanations for all citizens.</p>
                </div>
                <div class="philosophy-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="ph-icon"><i class="fas fa-landmark"></i></div>
                    <h3>Indian Legal Context</h3>
                    <p>Tailored specifically to the Constitution of India, Bharatiya Nyaya Sanhita (BNS 2023), and Indian Supreme Court rulings.</p>
                </div>
                <div class="philosophy-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="ph-icon"><i class="fas fa-microchip"></i></div>
                    <h3>Modern Technology</h3>
                    <p>Powered by legal-grade neural algorithms, real-time code converters, and fast client-side searching.</p>
                </div>
                <div class="philosophy-card" data-aos="fade-up">
                    <div class="ph-icon"><i class="fas fa-user-shield"></i></div>
                    <h3>Privacy-Conscious</h3>
                    <p>Informational queries are processed dynamically without requiring personal identification or intrusive tracking.</p>
                </div>
                <div class="philosophy-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="ph-icon"><i class="fas fa-language"></i></div>
                    <h3>Multilingual Support</h3>
                    <p>Supporting legal query processing across 22+ official Indian languages with context awareness.</p>
                </div>
                <div class="philosophy-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="ph-icon"><i class="fas fa-graduation-cap"></i></div>
                    <h3>Citizen Empowerment</h3>
                    <p>Building legal literacy so citizens understand their rights before approaching courts or police authorities.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 12. THE ARCHITECTS (MANDATORY) -->
    ${renderArchitectsSection()}

    <!-- 13. FAQ SECTION -->
    <section class="faq-section" id="faq">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Frequently Asked <span>Questions</span></h2>
                <p>Common questions about NYAYI legal knowledge platform and AI features.</p>
            </div>
            
            <div class="faq-grid">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What is NYAYI?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>NYAYI is a modern Indian legal knowledge platform designed to simplify Indian law, constitutional rights, statutory acts (BNS/IPC), and legal procedures for citizens.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>Who is NYAYI for?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>NYAYI is for common citizens, law students, researchers, consumers, and business owners seeking clear, accessible information regarding Indian laws and legal rights.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="200">
                    <div class="faq-header"><h3>What kind of legal information does NYAYI provide?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>NYAYI provides a searchable Legal Dictionary, Know Your Rights guides, statutory act breakdowns (BNS, BNSS, BSA, Constitution), practical procedure guides (FIRs, Bail, Cybercrime), and IPC/BNS converter tools.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Does NYAYI replace a lawyer?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p><strong>No.</strong> NYAYI is an informational research and legal literacy tool. For formal court representation, official litigation advice, or legal document execution, you must consult a licensed advocate.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>Where can I access NYAYI AI?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The AI research engine operates as a separate dedicated web application accessible at <a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary); font-weight:700;">ai.nyayi.in</a> by clicking any "Launch NYAYI AI" button.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="200">
                    <div class="faq-header"><h3>What areas of Indian law are covered?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>NYAYI covers Criminal Law (BNS/IPC), Criminal Procedure (BNSS/CrPC), Evidence (BSA), Constitutional Law, Cyber Law (IT Act), Consumer Protection, Property/Tenancy norms, and Traffic MV Act regulations.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>How can I explore legal terms?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>You can visit our dedicated <a href="dictionary.html" style="color:var(--primary); font-weight:700;">Legal Dictionary</a> page to search terms live or filter by categories like Criminal, Civil, Constitutional, or Cyber law.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>Is NYAYI available on mobile?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes, NYAYI is fully responsive and optimized for mobile devices. You can also explore our <a href="app.html" style="color:var(--primary); font-weight:700;">Mobile App</a> page for direct smartphone access.</p></div>
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

    <!-- 14. FINAL CLOSING NYAYI AI CTA -->
    <section class="cta-section" style="padding:0 0 110px;">
        <div class="container">
            <div class="cta-box" data-aos="zoom-in">
                <h2>Need More Than Information?</h2>
                <p>Explore NYAYI AI for AI-assisted legal research and conversational guidance.</p>
                <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="display:inline-flex; font-size:18px; padding:18px 45px; margin-top:10px;">
                    <i class="fas fa-rocket"></i> Launch NYAYI AI
                </a>
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');
    console.log('Generated: index.html');
}

// 2. GENERATE DICTIONARY HUB & TERM PAGES
function buildDictionary() {
    // Deduplicate dictionary by term (case-insensitive)
    const seenMap = new Map();
    dictionary.forEach(d => {
        const key = d.term.toLowerCase().trim();
        if (!seenMap.has(key)) {
            seenMap.set(key, d);
        }
    });
    const uniqueDict = Array.from(seenMap.values());
    uniqueDict.sort((a, b) => a.term.localeCompare(b.term));

    // Pre-render initial 60 cards for SSR
    const initialItems = uniqueDict.slice(0, 60);
    const initialCardsHtml = initialItems.map(item => `
        <div class="dict-card" data-category="${item.category}" data-letter="${item.term[0].toUpperCase()}" data-term="${item.term.toLowerCase()}" data-aos="fade-up">
            <div>
                <div class="dict-card-header">
                    <h3>${item.term}</h3>
                    <span class="badge-cat">${item.category}</span>
                </div>
                <p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:15px;">${item.simpleDef}</p>
            </div>
            <div>
                <div style="font-size:12px; color:#718096; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
                    <span><i class="fas fa-book" style="color:var(--primary);"></i> ${item.ref}</span>
                    <span><i class="fas fa-tag" style="color:#a0aec0;"></i> ${item.tag || item.category}</span>
                </div>
                <div>
                    <a href="dictionary/${item.slug}.html" class="card-link" style="font-size:14px; font-weight:800;">Read Full Explanation <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `).join('');

    // Generate Alphabet pills
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const azPillsHtml = `<button class="az-pill active" onclick="filterLetter('ALL', this)">ALL</button>` + 
        alphabet.map(let => `<button class="az-pill" onclick="filterLetter('${let}', this)">${let}</button>`).join('');

    // Minified dataset for client-side instant search across 1200+ terms
    const clientDataset = uniqueDict.map(d => ({
        s: d.slug,
        t: d.term,
        c: d.category,
        d: d.simpleDef,
        r: d.ref,
        g: d.tag || d.category
    }));

    const hubHtml = `
    ${renderHead('Indian Legal Dictionary – 1,200+ Legal Terms Explained | NYAYI', 'Explore the comprehensive Indian Legal Dictionary by NYAYI. Instant search and plain-language legal definitions across Criminal Law, BNS 2023, BNSS, Evidence, Civil Code, Constitutional Writs, Property, Contracts, and Latin Maxims.', 'Indian Legal Dictionary, legal terms India, law glossary, BNS IPC sections, legal definitions India, legal jargon explained', '/dictionary.html')}
    ${renderHeader('dictionary', 0)}

    <!-- HERO HEADER -->
    <section class="page-header" style="padding-bottom: 40px;">
        <div class="container" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:12px;">AUTHORITATIVE LEGAL REFERENCE</span>
            <h1>Indian Legal <span>Dictionary</span></h1>
            <p style="max-width:820px; margin:0 auto 25px; font-size:1.15rem; color:#555;">Understand Indian legal terminology in clear, accessible language. Search over 1,200+ legal terms across Criminal Law (BNS/BNSS), Civil Procedure, Constitutional Rights, Property, Contracts, Family Law, Cyber Law, and Latin Maxims.</p>
            
            <!-- SEARCH BOX -->
            <div class="dict-search-wrapper" data-aos="fade-up">
                <i class="fas fa-search dict-search-icon"></i>
                <input type="text" id="dictSearchInput" class="dict-search-input" oninput="handleDictSearch()" placeholder="Search 1,200+ legal terms (e.g. FIR, Bail, Anticipatory Bail, Habeas Corpus, Affidavit)...">
                <button id="dictClearBtn" class="dict-clear-btn" onclick="clearDictSearch()"><i class="fas fa-times"></i></button>
            </div>

            <!-- POPULAR QUICK SEARCHES -->
            <div style="margin-top:14px; font-size:13.5px; color:#666;" data-aos="fade-up">
                <strong>Popular searches:</strong> 
                <a href="javascript:void(0)" onclick="quickSearch('FIR')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">FIR</a> • 
                <a href="javascript:void(0)" onclick="quickSearch('Bail')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">Bail</a> • 
                <a href="javascript:void(0)" onclick="quickSearch('Anticipatory Bail')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">Anticipatory Bail</a> • 
                <a href="javascript:void(0)" onclick="quickSearch('Habeas Corpus')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">Habeas Corpus</a> • 
                <a href="javascript:void(0)" onclick="quickSearch('Injunction')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">Injunction</a> • 
                <a href="javascript:void(0)" onclick="quickSearch('Affidavit')" style="color:var(--primary); font-weight:700; text-decoration:underline; margin:0 4px;">Affidavit</a>
            </div>

            <!-- ALPHABET NAVIGATION BAR -->
            <div class="az-nav-container" data-aos="fade-up" style="margin-top:20px;">
                <div class="az-nav-bar" id="azNavBar">
                    ${azPillsHtml}
                </div>
            </div>

            <!-- CATEGORY FILTER CHIPS -->
            <div class="filter-tags" style="margin-top:15px;" data-aos="fade-up">
                <button class="filter-btn active" onclick="filterCat('all', this)">All Categories</button>
                <button class="filter-btn" onclick="filterCat('Criminal Law', this)">Criminal Law</button>
                <button class="filter-btn" onclick="filterCat('Criminal Procedure', this)">Criminal Procedure</button>
                <button class="filter-btn" onclick="filterCat('Constitutional Law', this)">Constitutional Law</button>
                <button class="filter-btn" onclick="filterCat('Civil Law', this)">Civil & Property</button>
                <button class="filter-btn" onclick="filterCat('Evidence Law', this)">Evidence Law</button>
                <button class="filter-btn" onclick="filterCat('Contract Law', this)">Contract Law</button>
                <button class="filter-btn" onclick="filterCat('Cyber Law', this)">Cyber & Tech</button>
                <button class="filter-btn" onclick="filterCat('Family Law', this)">Family Law</button>
                <button class="filter-btn" onclick="filterCat('Consumer Law', this)">Consumer Law</button>
                <button class="filter-btn" onclick="filterCat('Arbitration & ADR', this)">Arbitration & ADR</button>
                <button class="filter-btn" onclick="filterCat('Latin Legal Terms', this)">Latin Maxims</button>
            </div>
        </div>
    </section>

    <!-- MAIN DICTIONARY SHOWCASE -->
    <section class="features-section" style="padding:50px 0 80px; background:var(--bg-light);">
        <div class="container">
            
            <!-- STATS COUNTER BAR -->
            <div class="dict-stats-bar" data-aos="fade-up">
                <div class="dict-count-badge">
                    <i class="fas fa-book-bookmark" style="color:var(--primary);"></i>
                    Showing <span id="dictCurrentCount" class="dict-count-num">${uniqueDict.length}</span> Legal Terms
                </div>
                <div id="dictStatusText" style="font-size:13.5px; color:#666; font-weight:600;">
                    Alphabetically Organized A–Z • Verified Indian Legal Context
                </div>
            </div>

            <!-- DICTIONARY CARDS GRID -->
            <div class="dict-grid" id="dictGrid">
                ${initialCardsHtml}
            </div>

            <!-- EMPTY STATE (HIDDEN BY DEFAULT) -->
            <div id="dictEmptyState" class="dict-empty-state" style="display:none;">
                <div class="dict-empty-icon"><i class="fas fa-search-minus"></i></div>
                <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">No legal terms match your search</h3>
                <p style="font-size:14.5px; color:#666; max-width:500px; margin:0 auto 20px;">We couldn't find any terms matching your keywords or filter combination. Try adjusting your search query or browse our A–Z alphabet index.</p>
                <button onclick="clearDictSearch()" class="btn-outline" style="padding:10px 24px; font-size:14px;"><i class="fas fa-rotate-left"></i> Reset All Filters</button>
            </div>

            <!-- LOAD MORE BUTTON -->
            <div id="loadMoreContainer" class="load-more-container">
                <button class="btn-load-more" onclick="loadMoreTerms()">
                    <i class="fas fa-plus-circle"></i> Load More Terms (<span id="remainingCount">${uniqueDict.length - 60}</span> Remaining)
                </button>
            </div>

        </div>
    </section>

    <!-- EXPLORE BY LEGAL CATEGORIES -->
    <section style="padding:70px 0; background:#ffffff; border-top:1px solid #e2e8f0;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Explore by <span>Area of Law</span></h2>
                <p>Browse legal terminology categorized by statutory domain and court specialization.</p>
            </div>
            <div class="audience-grid" data-aos="fade-up">
                <div class="aud-card" onclick="filterCat('Criminal Law', this);" style="cursor:pointer;">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-gavel"></i></div>
                    <h3 style="font-size:17px; font-weight:800; margin-bottom:8px;">Criminal Law & BNS</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">FIRs, bail, arrest rights, non-bailable offences, BNS 2023 codes, and criminal procedure.</p>
                </div>
                <div class="aud-card" onclick="filterCat('Constitutional Law', this);" style="cursor:pointer;">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-landmark"></i></div>
                    <h3 style="font-size:17px; font-weight:800; margin-bottom:8px;">Constitutional Writs</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Habeas Corpus, Mandamus, Certiorari, Fundamental Rights, Article 32, and High Court writs.</p>
                </div>
                <div class="aud-card" onclick="filterCat('Civil Law', this);" style="cursor:pointer;">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-building"></i></div>
                    <h3 style="font-size:17px; font-weight:800; margin-bottom:8px;">Civil Code & Property</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Injunctions, plaints, decrees, adverse possession, sale deeds, easements, and CPC rules.</p>
                </div>
                <div class="aud-card" onclick="filterCat('Latin Legal Terms', this);" style="cursor:pointer;">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-scroll"></i></div>
                    <h3 style="font-size:17px; font-weight:800; margin-bottom:8px;">Latin Maxims</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Actus Reus, Mens Rea, Res Judicata, Audi Alteram Partem, Prima Facie, and locus standi.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- WHY LEGAL TERMINOLOGY MATTERS -->
    <section style="padding:70px 0; background:var(--bg-light);">
        <div class="container">
            <div class="spotlight-grid">
                <div data-aos="fade-up">
                    <span class="cp-role" style="margin-bottom:10px;">EDUCATIONAL PHILOSOPHY</span>
                    <h2 style="font-size:2.2rem; font-weight:900; margin-bottom:16px;">Demystifying Legal Jargon for Everyone</h2>
                    <p style="font-size:15px; color:#555; line-height:1.8; margin-bottom:20px;">Legal documents, police complaints, court notices, and contracts are often written in complex statutory language. NYAYI's Legal Dictionary bridges the gap between formal legal terminology and everyday plain language.</p>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div style="display:flex; align-items:center; gap:12px;"><i class="fas fa-check-circle" style="color:var(--primary); font-size:18px;"></i> <span style="font-size:14.5px; font-weight:700; color:#333;">Statutory Section References (BNS 2023, BNSS, BSA, IPC, CrPC, CPC)</span></div>
                        <div style="display:flex; align-items:center; gap:12px;"><i class="fas fa-check-circle" style="color:var(--primary); font-size:18px;"></i> <span style="font-size:14.5px; font-weight:700; color:#333;">Hypothetical Real-World Examples for Practical Context</span></div>
                        <div style="display:flex; align-items:center; gap:12px;"><i class="fas fa-check-circle" style="color:var(--primary); font-size:18px;"></i> <span style="font-size:14.5px; font-weight:700; color:#333;">Direct Internal Connections to Legal Guides & Fundamental Rights</span></div>
                    </div>
                </div>
                <div class="trust-banner-box" data-aos="fade-up" style="margin-top:0;">
                    <div style="font-size:14px; font-weight:800; color:var(--primary); text-transform:uppercase; tracking:1px; margin-bottom:10px;"><i class="fas fa-shield-halved"></i> Reliable Reference</div>
                    <h3 style="font-size:1.8rem; font-weight:800; margin-bottom:14px;">Built Around Indian Jurisprudence</h3>
                    <p style="font-size:14px; color:#cbd5e0; line-height:1.7; margin-bottom:20px;">Every entry in the NYAYI Dictionary is researched against active Indian statutes, Supreme Court judgments, and modern legal procedural codes.</p>
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="padding:12px 28px; font-size:14px;"><i class="fas fa-robot"></i> Research with NYAYI AI</a>
                </div>
            </div>
        </div>
    </section>

    <!-- FREQUENTLY ASKED QUESTIONS -->
    <section style="padding:70px 0; background:#ffffff;">
        <div class="container" style="max-width:850px;">
            <div class="section-header" data-aos="fade-up">
                <h2>Dictionary <span>FAQs</span></h2>
                <p>Common questions regarding Indian legal terminology and dictionary usage.</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Are old IPC section terms still included in the dictionary?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes. Since historical legal documents, past court judgments, and existing legal notices frequently cite old IPC or CrPC sections, our dictionary explains both classic terminology and updated Bharatiya Nyaya Sanhita (BNS) & Bharatiya Nagarik Suraksha Sanhita (BNSS) equivalents.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>How do I search for a term starting with a specific letter?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Click any letter (A through Z) in the top Alphabet Navigation Bar to instantly filter terms belonging to that letter. Click "ALL" to return to full view.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Does the dictionary cover Latin legal maxims used in Indian courts?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes. We provide dedicated coverage for Latin maxims frequently cited in Indian High Courts and the Supreme Court, including <em>Actus Reus</em>, <em>Mens Rea</em>, <em>Res Judicata</em>, <em>Audi Alteram Partem</em>, <em>Habeas Corpus</em>, and <em>Mandamus</em>.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Can I read full detailed explanations for individual terms?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes. Every dictionary card includes a "Read Full Explanation →" link that opens a dedicated indexable page containing statutory references, plain-language meanings, real-world examples, and related legal concepts.</p></div>
                </div>
            </div>
        </div>
    </section>

    <!-- EMBEDDED FAST CLIENT-SIDE SEARCH ENGINE SCRIPT -->
    <script>
        window.NYAYI_DICT = ${JSON.stringify(clientDataset)};
        let currentLetter = 'ALL';
        let currentCategory = 'all';
        let renderedCount = 60;

        function scrollGridIntoView() {
            const grid = document.getElementById('dictGrid');
            if (grid) {
                const yOffset = -120;
                const y = grid.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }

        function filterLetter(letter, btn) {
            document.querySelectorAll('.az-pill').forEach(b => b.classList.remove('active'));
            if(btn) btn.classList.add('active');
            currentLetter = letter;
            renderedCount = (letter === 'ALL') ? 60 : 1000;
            renderFilteredDict();
            if (letter !== 'ALL') scrollGridIntoView();
        }

        function filterCat(cat, btn) {
            document.querySelectorAll('.filter-tags .filter-btn').forEach(b => b.classList.remove('active'));
            if(btn) btn.classList.add('active');
            currentCategory = cat;
            renderedCount = (cat === 'all') ? 60 : 1000;
            renderFilteredDict();
            if (cat !== 'all') scrollGridIntoView();
        }

        function quickSearch(term) {
            const input = document.getElementById('dictSearchInput');
            if (input) {
                input.value = term;
                handleDictSearch();
                scrollGridIntoView();
            }
        }

        function handleDictSearch() {
            const input = document.getElementById('dictSearchInput');
            const clearBtn = document.getElementById('dictClearBtn');
            const val = input ? input.value.trim() : '';
            if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
            renderedCount = val ? 500 : 60;
            renderFilteredDict();
        }

        function clearDictSearch() {
            const input = document.getElementById('dictSearchInput');
            if (input) input.value = '';
            const clearBtn = document.getElementById('dictClearBtn');
            if (clearBtn) clearBtn.style.display = 'none';
            currentLetter = 'ALL';
            currentCategory = 'all';
            document.querySelectorAll('.az-pill').forEach(b => b.classList.remove('active'));
            const firstPill = document.querySelector('.az-pill');
            if(firstPill) firstPill.classList.add('active');
            document.querySelectorAll('.filter-tags .filter-btn').forEach(b => b.classList.remove('active'));
            const firstCat = document.querySelector('.filter-tags .filter-btn');
            if(firstCat) firstCat.classList.add('active');
            renderedCount = 60;
            renderFilteredDict();
        }

        function renderFilteredDict() {
            const query = (document.getElementById('dictSearchInput')?.value || '').toLowerCase().trim();
            const grid = document.getElementById('dictGrid');
            const emptyState = document.getElementById('dictEmptyState');
            const countBadge = document.getElementById('dictCurrentCount');
            const statusText = document.getElementById('dictStatusText');
            const loadMoreBtn = document.getElementById('loadMoreContainer');
            const remainingSpan = document.getElementById('remainingCount');

            if (!grid) return;

            const filtered = window.NYAYI_DICT.filter(item => {
                // Letter filter
                if (currentLetter !== 'ALL') {
                    const firstChar = item.t.trim().charAt(0).toUpperCase();
                    if (firstChar !== currentLetter) return false;
                }
                // Category filter
                if (currentCategory !== 'all') {
                    if (!item.c.toLowerCase().includes(currentCategory.toLowerCase())) return false;
                }
                // Query filter
                if (query) {
                    const fullText = (item.t + ' ' + item.c + ' ' + item.d + ' ' + item.r + ' ' + (item.g || '')).toLowerCase();
                    if (!fullText.includes(query)) return false;
                }
                return true;
            });

            if (countBadge) countBadge.textContent = filtered.length.toLocaleString();

            if (statusText) {
                if (query) {
                    statusText.textContent = 'Search results for "' + query + '"';
                } else if (currentLetter !== 'ALL') {
                    statusText.textContent = 'Showing terms starting with letter ' + currentLetter + ' (' + filtered.length + ' terms)';
                } else if (currentCategory !== 'all') {
                    statusText.textContent = 'Showing terms in category ' + currentCategory + ' (' + filtered.length + ' terms)';
                } else {
                    statusText.textContent = 'Alphabetically Organized A–Z • 1,231 Verified Legal Terms';
                }
            }

            if (filtered.length === 0) {
                grid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
                return;
            }

            grid.style.display = 'grid';
            if (emptyState) emptyState.style.display = 'none';

            const slice = filtered.slice(0, renderedCount);

            grid.innerHTML = slice.map(function(item) {
                return '<div class="dict-card">' +
                    '<div>' +
                        '<div class="dict-card-header">' +
                            '<h3>' + item.t + '</h3>' +
                            '<span class="badge-cat">' + item.c + '</span>' +
                        '</div>' +
                        '<p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:15px;">' + item.d + '</p>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-size:12px; color:#718096; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">' +
                            '<span><i class="fas fa-book" style="color:var(--primary);"></i> ' + item.r + '</span>' +
                            '<span><i class="fas fa-tag" style="color:#a0aec0;"></i> ' + (item.g || item.c) + '</span>' +
                        '</div>' +
                        '<div>' +
                            '<a href="dictionary/' + item.s + '.html" class="card-link" style="font-size:14px; font-weight:800;">Read Full Explanation <i class="fas fa-arrow-right"></i></a>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');

            if (loadMoreBtn) {
                if (filtered.length > renderedCount) {
                    loadMoreBtn.style.display = 'block';
                    if (remainingSpan) remainingSpan.textContent = (filtered.length - renderedCount).toLocaleString();
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
        }

        function loadMoreTerms() {
            renderedCount += 60;
            renderFilteredDict();
        }

        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q');
            if (q) {
                const input = document.getElementById('dictSearchInput');
                if (input) {
                    input.value = q;
                    handleDictSearch();
                }
            }
        });
    </script>

    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'dictionary.html'), hubHtml, 'utf8');
    console.log('Generated: dictionary.html (1,200+ Terms Enabled)');

    // Individual Term Pages for ALL 1,231 terms
    dictionary.forEach(item => {
        const relatedPillsHtml = (item.relatedTerms || []).map(relSlug => {
            const found = dictionary.find(d => d.slug === relSlug);
            const title = found ? found.term : relSlug.replace(/-/g, ' ');
            return `<a href="${relSlug}.html" class="cat-pill" style="font-size:13px; margin:4px;"><i class="fas fa-link" style="color:var(--primary);"></i> ${title}</a>`;
        }).join('');

        const termSchema = {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "name": item.term,
            "description": item.simpleDef,
            "inDefinedTermSet": "https://nyayi.in/dictionary.html",
            "termCode": item.slug
        };

        const breadcrumbsSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nyayi.in/" },
                { "@type": "ListItem", "position": 2, "name": "Legal Dictionary", "item": "https://nyayi.in/dictionary.html" },
                { "@type": "ListItem", "position": 3, "name": item.term, "item": `https://nyayi.in/dictionary/${item.slug}.html` }
            ]
        };

        const termHtml = `
        ${renderHead(`${item.term} – Meaning, Legal Definition & Examples | NYAYI`, item.simpleDef, `${item.term}, ${item.category}, Indian Law, BNS IPC section definition, legal dictionary India`, `/dictionary/${item.slug}.html`, 1)}
        ${renderHeader('dictionary', 1)}

        <!-- BREADCRUMBS & HERO HEADER -->
        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <div style="font-size:13.5px; color:#718096; margin-bottom:16px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <a href="../index.html" style="color:#4a5568; font-weight:600;"><i class="fas fa-home"></i> Home</a>
                    <span>/</span>
                    <a href="../dictionary.html" style="color:#4a5568; font-weight:600;">Legal Dictionary</a>
                    <span>/</span>
                    <span style="color:var(--primary-dark); font-weight:700;">${item.term}</span>
                </div>
                <span class="cp-role" style="display:inline-block; margin-bottom:10px;">${item.category}</span>
                <h1 style="margin:5px 0 16px; font-size:2.8rem; font-weight:900;">${item.term}</h1>
                <p style="margin:0; font-size:1.15rem; max-width:100%; color:#4a5568; line-height:1.7;">${item.simpleDef}</p>
            </div>
        </section>

        <!-- TERM CONTENT BODY -->
        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:920px;">
                <div style="background:var(--white); border:1px solid #e2e8f0; border-radius:24px; padding:40px; box-shadow:0 10px 35px rgba(0,0,0,0.03);" data-aos="fade-up">
                    
                    <div style="display:flex; gap:10px; margin-bottom:30px; flex-wrap:wrap;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-tag"></i> ${item.category}</span>
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px; background:#edf2f7; color:#2d3748;"><i class="fas fa-book"></i> ${item.ref}</span>
                    </div>

                    <h2 style="font-size:22px; margin-bottom:12px; font-weight:800; color:var(--dark);">Statutory & Legal Meaning</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8; color:#4a5568;">${item.legalMeaning}</p>

                    <h2 style="font-size:22px; margin-bottom:12px; font-weight:800; color:var(--dark);">Plain-Language Explanation</h2>
                    <p style="font-size:16px; margin-bottom:30px; line-height:1.8; color:#4a5568;">${item.explanation}</p>

                    <!-- PRACTICAL EXAMPLE -->
                    <div style="background:#f0fdf4; border-left:4px solid var(--primary); padding:24px; border-radius:16px; margin-bottom:35px; box-shadow:0 4px 15px rgba(0,200,83,0.05);">
                        <h3 style="font-size:18px; color:var(--primary-dark); margin-bottom:10px; font-weight:800; display:flex; align-items:center; gap:8px;">
                            <i class="fas fa-lightbulb"></i> Practical Example in Indian Law
                        </h3>
                        <p style="margin:0; font-size:15px; color:#2d3748; line-height:1.7;">${item.example}</p>
                    </div>

                    <!-- METADATA GRID -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; border-top:1px solid #edf2f7; padding-top:24px; margin-bottom:35px;">
                        <div style="background:#f7fafc; padding:18px; border-radius:14px; border:1px solid #edf2f7;">
                            <strong style="color:var(--dark); font-size:14px; display:block; margin-bottom:4px;"><i class="fas fa-building-columns" style="color:var(--primary);"></i> Where Applied:</strong>
                            <span style="font-size:14px; color:#4a5568;">${item.whereUsed}</span>
                        </div>
                        <div style="background:#f7fafc; padding:18px; border-radius:14px; border:1px solid #edf2f7;">
                            <strong style="color:var(--dark); font-size:14px; display:block; margin-bottom:4px;"><i class="fas fa-scale-balanced" style="color:var(--primary);"></i> Statutory Reference:</strong>
                            <span style="font-size:14px; color:#4a5568;">${item.ref}</span>
                        </div>
                    </div>

                    <!-- RELATED TERMS -->
                    ${relatedPillsHtml ? `
                        <div style="border-top:1px solid #edf2f7; padding-top:24px; margin-bottom:30px;">
                            <h3 style="font-size:17px; font-weight:800; margin-bottom:12px; color:var(--dark);"><i class="fas fa-diagram-project" style="color:var(--primary);"></i> Related Legal Terms</h3>
                            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                ${relatedPillsHtml}
                            </div>
                        </div>
                    ` : ''}

                    <!-- RELATED RESOURCES -->
                    <div style="border-top:1px solid #edf2f7; padding-top:24px;">
                        <h3 style="font-size:17px; font-weight:800; margin-bottom:14px; color:var(--dark);"><i class="fas fa-compass" style="color:var(--primary);"></i> Related NYAYI Legal Resources</h3>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                            <a href="../guides.html" class="cat-pill" style="display:flex; align-items:center; gap:10px; padding:14px 20px; justify-content:space-between; border-radius:14px;">
                                <span><i class="fas fa-file-contract" style="color:var(--primary);"></i> Step-by-Step Legal Guides</span>
                                <i class="fas fa-arrow-right" style="font-size:12px;"></i>
                            </a>
                            <a href="../rights.html" class="cat-pill" style="display:flex; align-items:center; gap:10px; padding:14px 20px; justify-content:space-between; border-radius:14px;">
                                <span><i class="fas fa-shield-halved" style="color:var(--primary);"></i> Citizen Rights Portal</span>
                                <i class="fas fa-arrow-right" style="font-size:12px;"></i>
                            </a>
                        </div>
                    </div>

                </div>

                <!-- LAUNCH AI CTA -->
                <div style="margin-top:40px; text-align:center;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai" style="padding:16px 36px; font-size:16px;">
                        <i class="fas fa-robot"></i> Research "${item.term}" with NYAYI AI
                    </a>
                </div>
            </div>
        </section>

        <script type="application/ld+json">
        ${JSON.stringify(termSchema, null, 2)}
        </script>
        <script type="application/ld+json">
        ${JSON.stringify(breadcrumbsSchema, null, 2)}
        </script>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `dictionary/${item.slug}.html`), termHtml, 'utf8');
    });
}

// 3. BUILD KNOW YOUR RIGHTS HUB & CATEGORY PAGES
function buildRights() {
    const hubHtml = `
    ${renderHead('Know Your Rights - Indian Citizen Legal Rights & Constitutional Hub | NYAYI', 'Comprehensive Indian Citizen Rights Hub. Understand fundamental rights, police arrest safeguards, women protections, consumer rights, tenant laws, cyber privacy, workplace rights, NALSA legal aid, and landmark Supreme Court rulings.', 'Know Your Rights India, fundamental rights India, police arrest rights, consumer rights India, women rights India, tenant rights India, cyber rights, NALSA free legal aid', '/rights.html')}
    ${renderHeader('rights', 0)}

    <!-- 01 — HERO SECTION -->
    <section class="page-header" id="hero" style="padding-bottom: 50px;">
        <div class="container" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:14px;">AUTHORITATIVE CITIZEN HANDBOOK & CONSTITUTIONAL LEARNING HUB</span>
            <h1 style="font-size:3.2rem; font-weight:900; line-height:1.2;">Know Your Rights. <br><span>Know Your Power.</span></h1>
            <p style="max-width:860px; margin:0 auto 30px; font-size:1.2rem; color:#4a5568; line-height:1.8;">
                Explore the rights, protections, and legal principles that shape everyday life in India — explained in clear, practical, authoritative language.
            </p>
            <div class="hero-btns" style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
                <a href="#quick-nav" class="btn-ai" style="padding:16px 36px; font-size:16px;">
                    <i class="fas fa-compass"></i> Explore Your Rights
                </a>
                <a href="#study-mode" class="btn-outline" style="padding:16px 36px; font-size:16px;">
                    <i class="fas fa-graduation-cap"></i> Start Constitution Study Mode
                </a>
            </div>
        </div>
    </section>

    <!-- STICKY RIGHTS EXPLORER NAVIGATION -->
    <div class="sticky-rights-nav">
        <div class="container">
            <div class="rights-nav-scroll">
                <a href="#quick-nav" class="rights-nav-item active"><i class="fas fa-th-large"></i> Overview</a>
                <a href="#what-are-rights" class="rights-nav-item"><i class="fas fa-scale-balanced"></i> Right Defined</a>
                <a href="#constitution-foundation" class="rights-nav-item"><i class="fas fa-landmark"></i> Constitution</a>
                <a href="#article-explorer" class="rights-nav-item"><i class="fas fa-book-bookmark"></i> Article Explorer</a>
                <a href="#rights-categories" class="rights-nav-item"><i class="fas fa-layer-group"></i> Categories</a>
                <a href="#real-life-rights" class="rights-nav-item"><i class="fas fa-street-view"></i> Everyday Situations</a>
                <a href="#police-rights" class="rights-nav-item"><i class="fas fa-handcuffs"></i> Police & Arrest</a>
                <a href="#consumer-rights" class="rights-nav-item"><i class="fas fa-bag-shopping"></i> Consumer</a>
                <a href="#womens-rights" class="rights-nav-item"><i class="fas fa-person-dress"></i> Women's Rights</a>
                <a href="#childrens-rights" class="rights-nav-item"><i class="fas fa-child"></i> Children</a>
                <a href="#tenant-rights" class="rights-nav-item"><i class="fas fa-building"></i> Tenant & Property</a>
                <a href="#cyber-rights" class="rights-nav-item"><i class="fas fa-shield-halved"></i> Cyber Rights</a>
                <a href="#workplace-rights" class="rights-nav-item"><i class="fas fa-briefcase"></i> Workplace</a>
                <a href="#legal-aid" class="rights-nav-item"><i class="fas fa-gavel"></i> Legal Aid</a>
                <a href="#violation-flow" class="rights-nav-item"><i class="fas fa-list-check"></i> Violation Steps</a>
                <a href="#action-plans" class="rights-nav-item"><i class="fas fa-user-shield"></i> Action Plans</a>
                <a href="#study-mode" class="rights-nav-item"><i class="fas fa-graduation-cap"></i> Study Mode</a>
                <a href="#knowledge-check" class="rights-nav-item"><i class="fas fa-circle-question"></i> Quiz</a>
                <a href="#faq" class="rights-nav-item"><i class="fas fa-comments"></i> FAQ</a>
            </div>
        </div>
    </div>

    <!-- 02 — RIGHTS QUICK NAVIGATION -->
    <section style="padding:70px 0 40px; background:#ffffff;" id="quick-nav">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Explore Your <span>Rights</span></h2>
                <p>Quick access visual navigation across 10 primary legal protection domains in India.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px;" data-aos="fade-up">
                <a href="#constitution-foundation" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-landmark"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Constitutional Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Part III guarantees, Articles 14–32, and writ remedies.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#police-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-handcuffs"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Police & Arrest</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">BNSS arrest grounds, custody rules, bail & 24h Magistrate production.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#consumer-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-bag-shopping"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Consumer Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Refunds, replacements, misleading ads & CPA 2019 commissions.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#womens-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-person-dress"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Women's Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">POSH Act, Domestic Violence Act, Zero FIR & sunset arrest bans.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#childrens-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-child"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Children's Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">RTE Act education, POCSO protections & child labour bans.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#cyber-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-shield-halved"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Cyber & Digital</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Online fraud 1930 helpline, identity theft & Puttaswamy privacy.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#tenant-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-building"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Tenant & Property</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Eviction notices, deposit returns, utilities & rent agreements.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#workplace-rights" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-briefcase"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Workplace Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Minimum wages, termination notices, EPF social security & POSH.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#legal-aid" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-gavel"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Legal Aid</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Free legal representation under Article 39A & NALSA/DLSA.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="#violation-flow" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-list-check"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Civil Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Action steps when rights are breached or infringed by authorities.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Section <i class="fas fa-arrow-right"></i></div>
                </a>
            </div>
        </div>
    </section>

    <!-- 03 — WHAT ARE YOUR RIGHTS? -->
    <section style="padding:80px 0; background:var(--bg-light);" id="what-are-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>What Exactly Is a <span>Legal Right?</span></h2>
                <p>Understanding the essential distinction between entitlements, protections, and enforcement remedies under Indian Jurisprudence.</p>
            </div>

            <div style="max-width:960px; margin:0 auto;" data-aos="fade-up">
                <div style="background:#ffffff; border-radius:28px; padding:45px; border:1px solid #e2e8f0; box-shadow:0 10px 35px rgba(0,0,0,0.02); margin-bottom:35px;">
                    <p style="font-size:1.15rem; color:#333; line-height:1.8; margin-bottom:20px;">
                        A <strong>Legal Right</strong> is an interest recognized and protected by a rule of law, carrying a corresponding legal duty upon others (including state authorities and private entities) to respect it. Unlike a mere privilege or permission, a legal right gives an individual the power to demand compliance and seek formal enforcement through judicial forums.
                    </p>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin:30px 0;">
                        <div style="background:#f7fafc; padding:22px; border-radius:18px; border-left:4px solid var(--primary);">
                            <strong style="color:var(--dark); font-size:16px; display:block; margin-bottom:8px;"><i class="fas fa-crown" style="color:var(--primary);"></i> Right vs Privilege</strong>
                            <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">A privilege is a conditional permission granted by authority that can be revoked. A legal right is an inviolable entitlement guaranteed by law.</p>
                        </div>
                        <div style="background:#f7fafc; padding:22px; border-radius:18px; border-left:4px solid #3182ce;">
                            <strong style="color:var(--dark); font-size:16px; display:block; margin-bottom:8px;"><i class="fas fa-landmark" style="color:#3182ce;"></i> Constitutional vs Statutory Rights</strong>
                            <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Constitutional rights (Part III) are guaranteed against state infringement by the Constitution. Statutory rights are created by Parliament or State Acts (e.g. Consumer Protection Act).</p>
                        </div>
                    </div>

                    <!-- VISUAL 3-STEP HIERARCHY -->
                    <h3 style="font-size:20px; font-weight:800; margin:35px 0 20px; color:var(--dark); text-align:center;">The Enforceable Triad of Legal Empowerment</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px;">
                        <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:25px; border-radius:20px; text-align:center;">
                            <span style="font-size:11px; font-weight:900; color:var(--primary-dark); letter-spacing:1.5px;">STEP 01</span>
                            <h4 style="font-size:20px; font-weight:800; color:var(--dark); margin:8px 0 10px;">RIGHT</h4>
                            <p style="font-size:14px; color:#4a5568; margin:0; line-height:1.6;">The fundamental entitlement or freedom guaranteed to you by law (e.g. Right to Life & Personal Liberty under Article 21).</p>
                        </div>
                        <div style="background:#ebf8ff; border:1px solid #bee3f8; padding:25px; border-radius:20px; text-align:center;">
                            <span style="font-size:11px; font-weight:900; color:#2b6cb0; letter-spacing:1.5px;">STEP 02</span>
                            <h4 style="font-size:20px; font-weight:800; color:var(--dark); margin:8px 0 10px;">PROTECTION</h4>
                            <p style="font-size:14px; color:#4a5568; margin:0; line-height:1.6;">The statutory boundary preventing police overreach, arbitrary detention, or unlawful commercial fraud.</p>
                        </div>
                        <div style="background:#faf5ff; border:1px solid #e9d8fd; padding:25px; border-radius:20px; text-align:center;">
                            <span style="font-size:11px; font-weight:900; color:#6b46c1; letter-spacing:1.5px;">STEP 03</span>
                            <h4 style="font-size:20px; font-weight:800; color:var(--dark); margin:8px 0 10px;">REMEDY</h4>
                            <p style="font-size:14px; color:#4a5568; margin:0; line-height:1.6;">The legal tool to enforce breached rights (e.g. Writ Petitions under Art 32/226, Injunctions, or Consumer Commission Claims).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 04 — CONSTITUTIONAL FOUNDATION -->
    <section class="fund-section" id="constitution-foundation">
        <div class="container">
            <div class="section-header" data-aos="fade-up" style="color:white;">
                <h2 style="color:white;">The Constitution: <span>Foundation of Your Rights</span></h2>
                <p style="color:#aaa;">The supreme law of India establishing inviolable fundamental guarantees, state obligations, and constitutional remedies.</p>
            </div>

            <div class="fund-grid">
                <div class="fund-item" data-aos="fade-up">
                    <span class="fund-num">PART III • ARTICLES 12–35</span>
                    <h4>Fundamental Rights</h4>
                    <p>Enforceable constitutional guarantees binding upon the Parliament, State Legislatures, Police, and Executive Authorities.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="100">
                    <span class="fund-num">PART IV • ARTICLES 36–51</span>
                    <h4>Directive Principles</h4>
                    <p>Fundamental principles for state governance directing public welfare, free legal aid (Art 39A), and social equality.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="200">
                    <span class="fund-num">PART IV-A • ARTICLE 51A</span>
                    <h4>Fundamental Duties</h4>
                    <p>Moral obligations on every citizen to abide by the Constitution, uphold national sovereignty, and safeguard public property.</p>
                </div>
                <div class="fund-item" data-aos="fade-up" data-aos-delay="300">
                    <span class="fund-num">ARTICLES 32 & 226</span>
                    <h4>Constitutional Remedies</h4>
                    <p>Guarantees direct access to the Supreme Court (Art 32) and High Courts (Art 226) for issuing Writs against rights violations.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 05 — FUNDAMENTAL RIGHTS & ARTICLE EXPLORER -->
    <section style="padding:90px 0; background:#ffffff;" id="article-explorer">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Interactive <span>Article Explorer</span></h2>
                <p>Examine the core Constitutional Articles protecting citizen freedom, personal liberty, and due process in India.</p>
            </div>

            <!-- ARTICLE TAB SWITCHER -->
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom:30px; flex-wrap:wrap;" data-aos="fade-up">
                <button class="filter-btn active" onclick="switchArticleTab('art14', this)">Article 14 (Equality)</button>
                <button class="filter-btn" onclick="switchArticleTab('art19', this)">Article 19 (Freedoms)</button>
                <button class="filter-btn" onclick="switchArticleTab('art21', this)">Article 21 (Life & Liberty)</button>
                <button class="filter-btn" onclick="switchArticleTab('art22', this)">Article 22 (Arrest Safeguards)</button>
                <button class="filter-btn" onclick="switchArticleTab('art32', this)">Article 32 (Writ Remedies)</button>
            </div>

            <!-- ARTICLE CONTENT CARDS -->
            <div style="max-width:920px; margin:0 auto;" data-aos="fade-up">
                
                <!-- ARTICLE 14 CARD -->
                <div id="art14" class="article-tab-content" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:40px; box-shadow:0 12px 35px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-scale-balanced"></i> PART III • RIGHT TO EQUALITY</span>
                        <span style="font-size:13px; font-weight:800; color:var(--primary-dark);"><i class="fas fa-building-columns"></i> Binds All State Authorities</span>
                    </div>
                    <h3 style="font-size:2rem; font-weight:900; color:var(--dark); margin-bottom:12px;">Article 14 — Right to Equality</h3>
                    <p style="font-size:1.05rem; color:#4a5568; line-height:1.8; margin-bottom:20px;">
                        <em>"The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."</em>
                    </p>
                    <div style="background:#f7fafc; border-left:4px solid var(--primary); padding:20px; border-radius:14px; margin-bottom:20px;">
                        <strong style="color:var(--dark); font-size:15px;"><i class="fas fa-circle-check" style="color:var(--primary);"></i> Why It Matters to You:</strong>
                        <p style="font-size:14.5px; color:#555; margin:6px 0 0; line-height:1.6;">Prohibits arbitrary government action, discriminatory police treatment, or unequal enforcement of statutes. Every citizen and non-citizen stands equal before court proceedings.</p>
                    </div>
                    <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:18px; border-radius:14px;">
                        <strong style="color:var(--primary-dark); font-size:14px;"><i class="fas fa-lightbulb"></i> Practical Example:</strong>
                        <span style="font-size:14px; color:#2d3748;"> If a municipal authority selectively demolishes one vendor's shop while exempting identical adjacent shops without due notice, Article 14 enables challenging the action for arbitrary discrimination.</span>
                    </div>
                </div>

                <!-- ARTICLE 19 CARD -->
                <div id="art19" class="article-tab-content" style="display:none; background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:40px; box-shadow:0 12px 35px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-comment-dots"></i> PART III • RIGHT TO FREEDOM</span>
                        <span style="font-size:13px; font-weight:800; color:var(--primary-dark);"><i class="fas fa-shield"></i> 6 Fundamental Freedoms</span>
                    </div>
                    <h3 style="font-size:2rem; font-weight:900; color:var(--dark); margin-bottom:12px;">Article 19 — Six Fundamental Freedoms</h3>
                    <p style="font-size:1.05rem; color:#4a5568; line-height:1.8; margin-bottom:20px;">
                        Guarantees 6 basic freedoms to citizens: (a) Speech & Expression, (b) Peaceful Assembly, (c) Forming Associations/Unions, (d) Free Movement across India, (e) Residing anywhere in India, and (g) Practicing any lawful profession or trade.
                    </p>
                    <div style="background:#f7fafc; border-left:4px solid var(--primary); padding:20px; border-radius:14px; margin-bottom:20px;">
                        <strong style="color:var(--dark); font-size:15px;"><i class="fas fa-circle-check" style="color:var(--primary);"></i> Reasonable Restrictions:</strong>
                        <p style="font-size:14.5px; color:#555; margin:6px 0 0; line-height:1.6;">Freedoms are subject to reasonable restrictions under Articles 19(2)–19(6) in the interests of national sovereignty, public order, decency, or defamation laws.</p>
                    </div>
                    <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:18px; border-radius:14px;">
                        <strong style="color:var(--primary-dark); font-size:14px;"><i class="fas fa-lightbulb"></i> Practical Example:</strong>
                        <span style="font-size:14px; color:#2d3748;"> Expressing critical political views online or running an online e-commerce business across state borders is protected under Article 19(1)(a) and 19(1)(g).</span>
                    </div>
                </div>

                <!-- ARTICLE 21 CARD -->
                <div id="art21" class="article-tab-content" style="display:none; background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:40px; box-shadow:0 12px 35px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-heart-pulse"></i> PART III • PERSONAL LIBERTY</span>
                        <span style="font-size:13px; font-weight:800; color:var(--primary-dark);"><i class="fas fa-star"></i> Expansive Judicial Interpretation</span>
                    </div>
                    <h3 style="font-size:2rem; font-weight:900; color:var(--dark); margin-bottom:12px;">Article 21 — Protection of Life and Personal Liberty</h3>
                    <p style="font-size:1.05rem; color:#4a5568; line-height:1.8; margin-bottom:20px;">
                        <em>"No person shall be deprived of his life or personal liberty except according to procedure established by law."</em>
                    </p>
                    <div style="background:#f7fafc; border-left:4px solid var(--primary); padding:20px; border-radius:14px; margin-bottom:20px;">
                        <strong style="color:var(--dark); font-size:15px;"><i class="fas fa-circle-check" style="color:var(--primary);"></i> Rights Derived Under Article 21:</strong>
                        <p style="font-size:14.5px; color:#555; margin:6px 0 0; line-height:1.6;">Supreme Court jurisprudence has expanded Article 21 to include: Right to Privacy (Puttaswamy 2017), Right to Free Legal Aid (Maneka Gandhi 1978), Right to Clean Water & Air, Right to Livelihood, and Speedier Trial.</p>
                    </div>
                    <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:18px; border-radius:14px;">
                        <strong style="color:var(--primary-dark); font-size:14px;"><i class="fas fa-lightbulb"></i> Practical Example:</strong>
                        <span style="font-size:14px; color:#2d3748;"> If an undertrial prisoner is detained without trial for longer than the maximum statutory sentence, Article 21 guarantees immediate release on bail.</span>
                    </div>
                </div>

                <!-- ARTICLE 22 CARD -->
                <div id="art22" class="article-tab-content" style="display:none; background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:40px; box-shadow:0 12px 35px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-handcuffs"></i> PART III • ARREST PROCEDURAL GUARANTEES</span>
                        <span style="font-size:13px; font-weight:800; color:var(--primary-dark);"><i class="fas fa-gavel"></i> BNSS Code Alignment</span>
                    </div>
                    <h3 style="font-size:2rem; font-weight:900; color:var(--dark); margin-bottom:12px;">Article 22 — Protection Against Arrest and Detention</h3>
                    <p style="font-size:1.05rem; color:#4a5568; line-height:1.8; margin-bottom:20px;">
                        Establishes 4 mandatory safeguards for arrested persons: (1) Informed immediately of grounds of arrest, (2) Right to consult and be defended by a legal practitioner, (3) Production before nearest Magistrate within 24 hours (excluding travel time), (4) Prohibition of detention beyond 24 hours without Judicial Magistrate authorization.
                    </p>
                    <div style="background:#f7fafc; border-left:4px solid var(--primary); padding:20px; border-radius:14px; margin-bottom:20px;">
                        <strong style="color:var(--dark); font-size:15px;"><i class="fas fa-circle-check" style="color:var(--primary);"></i> Statutory Mandate (BNSS 2023):</strong>
                        <p style="font-size:14.5px; color:#555; margin:6px 0 0; line-height:1.6;">Reaffirmed under Section 35, 38, and 58 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023).</p>
                    </div>
                </div>

                <!-- ARTICLE 32 CARD -->
                <div id="art32" class="article-tab-content" style="display:none; background:#ffffff; border:1px solid #e2e8f0; border-radius:28px; padding:40px; box-shadow:0 12px 35px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-gavel"></i> PART III • CONSTITUTIONAL REMEDIES</span>
                        <span style="font-size:13px; font-weight:800; color:var(--primary-dark);"><i class="fas fa-heart"></i> "Heart & Soul of Constitution"</span>
                    </div>
                    <h3 style="font-size:2rem; font-weight:900; color:var(--dark); margin-bottom:12px;">Article 32 — Right to Constitutional Remedies</h3>
                    <p style="font-size:1.05rem; color:#4a5568; line-height:1.8; margin-bottom:20px;">
                        Dr. B.R. Ambedkar termed Article 32 the <em>"Heart and Soul of the Constitution."</em> It empowers citizens to directly petition the Supreme Court of India for issuing 5 Constitutional Writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) when any Fundamental Right is violated.
                    </p>
                </div>

            </div>
        </div>
    </section>

    <!-- 06 — RIGHTS BY CATEGORY -->
    <section style="padding:90px 0; background:var(--bg-light);" id="rights-categories">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Explore Rights <span>by Category</span></h2>
                <p>Detailed breakdown of statutory citizen entitlements across primary legal areas in India.</p>
            </div>

            <div class="rights-bento" data-aos="fade-up">
                <div class="r-card r-dark">
                    <div class="r-icon"><i class="fas fa-handcuffs"></i></div>
                    <h3>Police & Custodial Protections</h3>
                    <ul class="r-list">
                        <li>Right to know reasons for arrest immediately (BNSS Sec 35).</li>
                        <li>Right to inform a family member/lawyer within 12 hours (BNSS Sec 36).</li>
                        <li>Mandatory medical examination every 48 hours in custody (BNSS Sec 53).</li>
                        <li>Prohibition of torture or coerced confessions under threat.</li>
                    </ul>
                    <a href="#police-rights" class="card-link" style="color:var(--primary); margin-top:auto;">Read Detailed Police Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card r-tall">
                    <div class="r-icon"><i class="fas fa-person-dress"></i></div>
                    <h3>Women's Statutory Protections</h3>
                    <ul class="r-list">
                        <li>Prohibition of arrest between sunset & sunrise (BNSS Sec 43).</li>
                        <li>Mandatory female officer for bodily search of women.</li>
                        <li>Zero FIR registration permitted anywhere across India.</li>
                        <li>POSH Act 2013 workplace harassment protections.</li>
                        <li>Domestic Violence Act 2005 protection & residence orders.</li>
                        <li>Maternity Benefit Act (26 weeks paid leave entitlement).</li>
                    </ul>
                    <a href="#womens-rights" class="card-link" style="margin-top:auto;">Explore Women's Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card">
                    <div class="r-icon"><i class="fas fa-shield-halved"></i></div>
                    <h3>Cyber & Data Privacy</h3>
                    <ul class="r-list">
                        <li>Fundamental Right to Privacy under Article 21.</li>
                        <li>National Cyber Fraud Golden Hour Helpline 1930.</li>
                        <li>Identity theft protection under IT Act Section 66C.</li>
                    </ul>
                    <a href="#cyber-rights" class="card-link" style="margin-top:auto;">View Cyber Rights <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="r-card">
                    <div class="r-icon"><i class="fas fa-bag-shopping"></i></div>
                    <h3>Consumer Safeguards</h3>
                    <ul class="r-list">
                        <li>Right to refund or replacement for defective goods (CPA 2019).</li>
                        <li>Protection against misleading ads & deceptive e-commerce practices.</li>
                    </ul>
                    <a href="#consumer-rights" class="card-link" style="margin-top:auto;">View Consumer Rights <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>

    <!-- 07 — RIGHTS IN REAL-LIFE SITUATIONS -->
    <section style="padding:90px 0; background:#ffffff;" id="real-life-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Your Rights <span>Don't Stay in Textbooks</span></h2>
                <p>Everyday real-life scenarios where statutory protections safeguard citizens in India.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:28px;">
                    <span class="card-tag">EVERYDAY SCENARIO 01</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:10px 0 12px;">Stopped by Police for Checking</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:14px;"><strong>Your Rights:</strong> Officers cannot inspect your private phone messages or search personal bags without formal search warrants or suspected crime registration. Digital DL/RC on DigiLocker is legally valid.</p>
                    <a href="#action-plans" style="font-size:13.5px; font-weight:800; color:var(--primary);">View Full Action Plan <i class="fas fa-arrow-right"></i></a>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:28px;">
                    <span class="card-tag">EVERYDAY SCENARIO 02</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:10px 0 12px;">Online Banking / UPI Fraud</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:14px;"><strong>Your Rights:</strong> Reporting to helpline 1930 within 1 hour enables bank transaction freezing under RBI guidelines and National Cyber Crime Reporting Portal protocols.</p>
                    <a href="#action-plans" style="font-size:13.5px; font-weight:800; color:var(--primary);">View Full Action Plan <i class="fas fa-arrow-right"></i></a>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:28px;">
                    <span class="card-tag">EVERYDAY SCENARIO 03</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:10px 0 12px;">Defective Product Refused by Seller</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:14px;"><strong>Your Rights:</strong> Sellers cannot disclaim liability through "No Refund" stamps. Under CPA 2019, manufacturers and sellers are jointly liable for product defects.</p>
                    <a href="#action-plans" style="font-size:13.5px; font-weight:800; color:var(--primary);">View Full Action Plan <i class="fas fa-arrow-right"></i></a>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:28px;">
                    <span class="card-tag">EVERYDAY SCENARIO 04</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:10px 0 12px;">Landlord Withholds Security Deposit</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:14px;"><strong>Your Rights:</strong> Landlords cannot lock out tenants or cut off water/electricity without Rent Authority court orders. Deductions require itemized repair bills.</p>
                    <a href="#action-plans" style="font-size:13.5px; font-weight:800; color:var(--primary);">View Full Action Plan <i class="fas fa-arrow-right"></i></a>
                </div>

            </div>
        </div>
    </section>

    <!-- 08 — POLICE & ARREST RIGHTS -->
    <section style="padding:90px 0; background:var(--bg-light);" id="police-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Police & Arrest <span>Rights (BNSS 2023)</span></h2>
                <p>Statutory safeguards governing police questioning, search protocols, bail entitlements, and FIR registration.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-file-contract" style="color:var(--primary);"></i> Grounds of Arrest (BNSS Sec 35)</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Police officers must inform the arrestee immediately of the exact offence and statutory grounds for arrest, providing a written copy of the arrest memo.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-phone" style="color:var(--primary);"></i> Right to Inform Family (BNSS Sec 36)</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Arrested persons have the mandatory right to inform a family member, relative, or nominated advocate of their arrest location within 12 hours.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-clock" style="color:var(--primary);"></i> 24-Hour Magistrate Rule (BNSS Sec 58)</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">No police officer can detain an arrested person in custody beyond 24 hours without producing them before the nearest Judicial Magistrate.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-notes-medical" style="color:var(--primary);"></i> Medical Examination (BNSS Sec 53)</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Arrested persons must be medically examined by a certified medical practitioner immediately upon arrest and every 48 hours during police custody.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 09 — CONSUMER RIGHTS -->
    <section style="padding:90px 0; background:#ffffff;" id="consumer-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Consumer Rights <span>(CPA 2019)</span></h2>
                <p>Statutory remedies against defective goods, deficient services, misleading ads, and unfair contract terms.</p>
            </div>

            <!-- VISUAL 5-STEP CONSUMER SEQUENCE -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:16px; text-align:center;" data-aos="fade-up">
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 01</span>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark); margin:6px 0;">DOCUMENT</h4>
                    <p style="font-size:12.5px; color:#666; margin:0;">Preserve invoice, payment receipts & warranty cards.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 02</span>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark); margin:6px 0;">NOTICE</h4>
                    <p style="font-size:12.5px; color:#666; margin:0;">Send formal email or notice to seller/manufacturer.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 03</span>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark); margin:6px 0;">HELPLINE</h4>
                    <p style="font-size:12.5px; color:#666; margin:0;">Lodge complaint on National Consumer Helpline (1915).</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 04</span>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark); margin:6px 0;">E-DAAKHIL</h4>
                    <p style="font-size:12.5px; color:#666; margin:0;">File online consumer complaint via e-Daakhil portal.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 05</span>
                    <h4 style="font-size:16px; font-weight:800; color:var(--dark); margin:6px 0;">COMMISSION</h4>
                    <p style="font-size:12.5px; color:#666; margin:0;">Claim refund, replacement & compensation in Consumer Forum.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 10 — WOMEN'S RIGHTS -->
    <section style="padding:90px 0; background:var(--bg-light);" id="womens-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Women's Legal <span>Protections</span></h2>
                <p>Statutory safeguards under criminal codes, POSH Act 2013, and Domestic Violence Act 2005.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-moon" style="color:var(--primary);"></i> Sunset & Sunrise Arrest Rule</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Under BNSS Section 43, no woman can be arrested after sunset and before sunrise, except in extraordinary circumstances with prior written permission of a Judicial Magistrate.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-building" style="color:var(--primary);"></i> POSH Act Workplace Safeguards</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Every workplace with 10+ employees must constitute an Internal Complaints Committee (ICC) to investigate sexual harassment complaints within 90 days.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-house-chimney-user" style="color:var(--primary);"></i> Domestic Violence Protection</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Protection of Women from Domestic Violence Act 2005 grants rights to shared household residence, protection orders, and interim monetary relief.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 11 — CHILDREN'S RIGHTS -->
    <section style="padding:90px 0; background:#ffffff;" id="childrens-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Children's <span>Legal Protections</span></h2>
                <p>Constitutional and statutory rights safeguarding education, safety, and child welfare in India.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:26px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-graduation-cap" style="color:var(--primary);"></i> Article 21A • RTE Act 2009</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Guarantees free and compulsory education to all children aged 6 to 14 years in nearby schools.</p>
                </div>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:26px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-shield-cat" style="color:var(--primary);"></i> POCSO Act 2012</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Strict protection against child sexual abuse with mandatory reporting duties and child-friendly court trials.</p>
                </div>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:26px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-ban" style="color:var(--primary);"></i> Child Labour Prohibition</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Complete ban on employment of children below 14 years in all occupations and hazardous processes.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 12 — TENANT & PROPERTY RIGHTS -->
    <section style="padding:90px 0; background:var(--bg-light);" id="tenant-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Tenant & Property <span>Rights</span></h2>
                <p>Legal safeguards governing rental agreements, security deposit returns, and eviction protocols.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-key" style="color:var(--primary);"></i> Security Deposit Refund</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Landlords must refund security deposits upon tenancy expiration minus reasonable agreed repairs backed by itemized receipts.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-ban" style="color:var(--primary);"></i> Protection Against Forced Eviction</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Tenants cannot be forcibly dispossessed or locked out without a formal eviction decree from the local Rent Authority/Court.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:28px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;"><i class="fas fa-plug-circle-bolt" style="color:var(--primary);"></i> Utility Cutoff Prohibitions</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin:0;">Landlords cannot disconnect essential utility services (water, electricity) to force a tenant out during rent disputes.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 13 — CYBER & DIGITAL RIGHTS -->
    <section style="padding:90px 0; background:#ffffff;" id="cyber-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Cyber & Digital <span>Rights</span></h2>
                <p>Digital privacy rights, online financial fraud response, and identity theft protections under Indian law.</p>
            </div>

            <div style="background:linear-gradient(135deg, #0a0a0a 0%, #171717 100%); border-radius:28px; padding:45px; color:white;" data-aos="fade-up">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
                    <div>
                        <span class="card-tag" style="background:rgba(0,200,83,0.15); color:var(--primary);">EMERGENCY CYBER FRAUD HELPLINE</span>
                        <h3 style="font-size:2.2rem; font-weight:900; color:white; margin:10px 0;">Call 1930 Within Golden Hour</h3>
                        <p style="color:#aaa; font-size:1.05rem; max-width:650px; margin:0; line-height:1.6;">
                            If you fall victim to online banking, UPI, or credit card fraud, immediately dial <strong>1930</strong> or register a complaint at <code>cybercrime.gov.in</code> to freeze transacted stolen funds before withdrawal.
                        </p>
                    </div>
                    <a href="https://cybercrime.gov.in" target="_blank" class="btn-ai" style="padding:16px 32px; font-size:15px; flex-shrink:0;">
                        <i class="fas fa-globe"></i> Visit National Cyber Portal
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- 14 — WORKPLACE / LABOUR RIGHTS -->
    <section style="padding:90px 0; background:var(--bg-light);" id="workplace-rights">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Workplace & Labour <span>Rights</span></h2>
                <p>Statutory wage entitlements, social security benefits, and employment termination rules.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#ffffff; border-radius:20px; padding:26px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-money-bill-wave" style="color:var(--primary);"></i> Minimum Wages & Timely Pay</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Employers must pay agreed wages by the 7th or 10th of every month under the Payment of Wages Act.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:26px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-file-signature" style="color:var(--primary);"></i> Notice Period & Severance</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Arbitrary instant termination without contractual notice or severance pay violates labour standards.</p>
                </div>
                <div style="background:#ffffff; border-radius:20px; padding:26px; border:1px solid #e2e8f0;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;"><i class="fas fa-piggy-bank" style="color:var(--primary);"></i> EPF & Social Security</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Employees in covered establishments have statutory rights to Employee Provident Fund (EPF) and ESI healthcare.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 15 — LEGAL AID & ACCESS TO JUSTICE -->
    <section style="padding:90px 0; background:#ffffff;" id="legal-aid">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Justice Should Not Depend Only on <span>What You Can Afford</span></h2>
                <p>Constitutional mandate for free legal services under Article 39A and NALSA statutory frameworks.</p>
            </div>

            <div style="background:#f0fdf4; border:1px solid #dcfce7; border-radius:28px; padding:40px;" data-aos="fade-up">
                <h3 style="font-size:1.8rem; font-weight:900; color:var(--dark); margin-bottom:14px;">Free Legal Aid Entitlements (NALSA / DLSA)</h3>
                <p style="font-size:1.05rem; color:#333; line-height:1.8; margin-bottom:20px;">
                    Under Article 39A of the Constitution of India and the Legal Services Authorities Act 1987, free legal representation, advocate services, court fee exemptions, and drafting aid are guaranteed to:
                </p>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                    <div style="background:#ffffff; padding:18px; border-radius:14px; border:1px solid #c6f6d5;">
                        <strong style="color:var(--primary-dark); font-size:14.5px;"><i class="fas fa-check-circle"></i> Women & Children</strong>
                        <p style="font-size:13px; color:#555; margin:4px 0 0;">All women and children regardless of income level.</p>
                    </div>
                    <div style="background:#ffffff; padding:18px; border-radius:14px; border:1px solid #c6f6d5;">
                        <strong style="color:var(--primary-dark); font-size:14.5px;"><i class="fas fa-check-circle"></i> Custody Detainees</strong>
                        <p style="font-size:13px; color:#555; margin:4px 0 0;">Anyone in police custody or undertrial prisoners.</p>
                    </div>
                    <div style="background:#ffffff; padding:18px; border-radius:14px; border:1px solid #c6f6d5;">
                        <strong style="color:var(--primary-dark); font-size:14.5px;"><i class="fas fa-check-circle"></i> Low-Income Citizens</strong>
                        <p style="font-size:13px; color:#555; margin:4px 0 0;">Persons fulfilling state income threshold limits.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 16 — HOW TO ACT WHEN YOUR RIGHTS ARE VIOLATED -->
    <section style="padding:90px 0; background:var(--bg-light);" id="violation-flow">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>If You Believe Your <span>Rights Have Been Violated</span></h2>
                <p>A structured 6-step practical roadmap for documenting overreach and seeking formal legal remedies.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;" data-aos="fade-up">
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 01</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">STAY SAFE & CALM</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Avoid physical confrontation. Politely request officer/person identification details and state clearly that you know your rights.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 02</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">DOCUMENT DETAILS</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Write down exact date, time, location, officer names, vehicle numbers, and witness contact information immediately.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 03</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">PRESERVE EVIDENCE</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Save photos, videos, CCTV footage, transaction receipts, medical report copies, and digital chat logs.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 04</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">IDENTIFY AUTHORITY</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Determine appropriate forum: Police SP / Magistrate for crime, NCH/e-Daakhil for consumer, ICC for POSH, or Human Rights Commission.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 05</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">FILE FORMAL COMPLAINT</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Lodge a written complaint with formal postal acknowledgement (Registered AD) or official electronic portal tracking number.</p>
                </div>
                <div class="flow-step-card">
                    <span class="flow-step-badge">STEP 06</span>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin:8px 0;">SEEK LEGAL HELP</h3>
                    <p style="font-size:14px; color:#555; margin:0; line-height:1.6;">Consult an advocate or approach your District Legal Services Authority (DLSA) for filing Writ Petitions or Court Injunctions.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 17 — REAL SCENARIO ACTION PLANS -->
    <section class="scenarios-section" style="padding:90px 0 120px; background:white;" id="action-plans">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Action Plan in <span>Real Scenarios</span></h2>
                <p>Click on any scenario to reveal practical step-by-step instructions and evidence requirements.</p>
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
                                <li>Remain calm, pull over safely, and politely request the officer's name and badge details.</li>
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
                            <div class="s-icon-bubble"><i class="fas fa-file-shield"></i></div>
                            Police Refuse to Register Your FIR Complaint
                        </h3>
                        <i class="fas fa-chevron-down scenario-icon"></i>
                    </div>
                    <div class="scenario-body">
                        <div class="scenario-body-content">
                            <ol class="scenario-steps">
                                <li>Under Section 173 BNSS (154 CrPC) & Lalita Kumari ruling, FIR registration is mandatory for cognizable offences.</li>
                                <li>If station officer refuses, send written complaint by Registered Post to the Superintendent of Police (SP) under BNSS 173(4).</li>
                                <li>If SP fails to act, file an application before Judicial Magistrate under BNSS Section 175(3) for court order directing FIR registration.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div class="scenario-item" data-aos="fade-up" data-aos-delay="200">
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

                <div class="scenario-item" data-aos="fade-up" data-aos-delay="300">
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

    <!-- 18 — CONSTITUTION STUDY MODE -->
    <section style="padding:90px 0; background:linear-gradient(135deg, #050505 0%, #121212 100%); color:white;" id="study-mode">
        <div class="container">
            <div class="section-header" data-aos="fade-up" style="color:white;">
                <span class="cp-role" style="background:rgba(0,200,83,0.15); color:var(--primary); display:inline-block; margin-bottom:12px;">SIGNATURE NYAYI FEATURE</span>
                <h2 style="color:white;">Constitution <span>Study Mode</span></h2>
                <p style="color:#aaa;">Interactive learning deck engineered for law students, competitive exams, and legal literacy.</p>
            </div>

            <div style="max-width:850px; margin:0 auto; background:#181818; border:1px solid #333; border-radius:28px; padding:40px;" data-aos="fade-up">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                    <span id="studyCardNum" style="font-size:13px; font-weight:900; color:var(--primary); letter-spacing:1px;">STUDY CARD 1 OF 5</span>
                    <span style="font-size:12.5px; color:#888;">PART III • FUNDAMENTAL RIGHTS</span>
                </div>

                <div id="studyDeckContainer">
                    <h3 id="studyTitle" style="font-size:2rem; font-weight:900; color:white; margin-bottom:14px;">Article 14 — Equality Before Law</h3>
                    <p id="studyBody" style="font-size:1.05rem; color:#ccc; line-height:1.8; margin-bottom:24px;">
                        Article 14 guarantees that the State shall not deny equality before law or equal protection of laws to any person within India. It strikes down arbitrary state classification and ensures equal treatment in court proceedings.
                    </p>
                    <div style="background:rgba(0,200,83,0.08); border-left:4px solid var(--primary); padding:18px; border-radius:12px; margin-bottom:24px;">
                        <strong style="color:var(--primary); font-size:14px;">Quick Revision Note:</strong>
                        <p id="studyNote" style="font-size:14px; color:#ddd; margin:4px 0 0;">Article 14 incorporates the British concept of 'Rule of Law' (Dicey) and the American concept of 'Equal Protection of Laws'.</p>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:30px; border-top:1px solid #333; padding-top:20px;">
                    <button onclick="prevStudyCard()" class="btn-outline" style="color:white; border-color:#444; padding:10px 24px; font-size:14px;"><i class="fas fa-arrow-left"></i> Previous</button>
                    <button onclick="nextStudyCard()" class="btn-ai" style="padding:10px 24px; font-size:14px;">Next Card <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </section>

    <!-- 19 — KNOWLEDGE CHECK / QUIZ -->
    <section style="padding:90px 0; background:#ffffff;" id="knowledge-check">
        <div class="container" style="max-width:850px;">
            <div class="section-header" data-aos="fade-up">
                <h2>How Well Do You <span>Know Your Rights?</span></h2>
                <p>Interactive academic self-assessment quiz on Indian constitutional rights and legal protections.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:28px; padding:40px;" data-aos="fade-up">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <span style="font-size:13px; font-weight:800; color:var(--primary-dark);" id="quizProgress">QUESTION 1 OF 5</span>
                    <span style="font-size:13px; font-weight:800; color:#4a5568;">Score: <span id="quizScore">0</span>/5</span>
                </div>

                <h3 id="quizQuestion" style="font-size:1.3rem; font-weight:800; color:var(--dark); margin-bottom:24px;">
                    Which Constitutional Article guarantees the Right to Life and Personal Liberty in India?
                </h3>

                <div style="display:flex; flex-direction:column; gap:12px;" id="quizOptions">
                    <button class="quiz-option-btn" onclick="checkQuizAnswer(0)"><span>A) Article 14</span> <i class="fas fa-circle-notch"></i></button>
                    <button class="quiz-option-btn" onclick="checkQuizAnswer(1)"><span>B) Article 19</span> <i class="fas fa-circle-notch"></i></button>
                    <button class="quiz-option-btn" onclick="checkQuizAnswer(2)"><span>C) Article 21</span> <i class="fas fa-circle-notch"></i></button>
                    <button class="quiz-option-btn" onclick="checkQuizAnswer(3)"><span>D) Article 32</span> <i class="fas fa-circle-notch"></i></button>
                </div>

                <div id="quizFeedback" style="display:none; margin-top:24px; padding:18px; border-radius:16px; font-size:14.5px; line-height:1.6;"></div>

                <div style="margin-top:24px; text-align:right;">
                    <button id="quizNextBtn" onclick="nextQuizQuestion()" class="btn-ai" style="display:none; padding:10px 24px; font-size:14px;">Next Question <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </section>

    <!-- 20 — COMMON QUESTIONS (FAQs) -->
    <section style="padding:90px 0; background:var(--bg-light);" id="faq">
        <div class="container" style="max-width:850px;">
            <div class="section-header" data-aos="fade-up">
                <h2>Rights <span>FAQs</span></h2>
                <p>Common citizen questions regarding constitutional protections and statutory remedies in India.</p>
            </div>

            <div style="display:flex; flex-direction:column; gap:14px;">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What is the main difference between Fundamental Rights and Statutory Rights?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Fundamental Rights are constitutional guarantees enshrined in Part III of the Constitution (Articles 12–35) that cannot be infringed by ordinary legislation. Statutory Rights are created by specific Acts of Parliament (e.g. Consumer Protection Act, POSH Act) and can be modified by legislative amendments.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What should I do if a police officer refuses to register my FIR?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Under BNSS Section 173(4) (CrPC 154(3)), you can send the written complaint by Registered Post to the Superintendent of Police (SP). If no action is taken, you can file an application before the Judicial Magistrate under BNSS Section 175(3) for an order directing the police to register the FIR.</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Can police officers inspect my phone or private messages during a vehicle check?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>No. Police officers cannot randomly search your private mobile messages or personal files without a formal search warrant or registered crime investigation suspicion under Section 21 (Right to Privacy).</p></div>
                </div>
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Who is eligible for free legal aid under NALSA in India?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Under Section 12 of the Legal Services Authorities Act 1987, free legal aid is available to all women, children, members of SC/ST communities, undertrial prisoners, victims of human trafficking or disaster, and low-income citizens fulfilling state income criteria.</p></div>
                </div>
            </div>
        </div>
    </section>

    <!-- 21 — RELATED NYAYI RESOURCES -->
    <section style="padding:90px 0; background:#ffffff;" id="related">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Related <span>NYAYI Resources</span></h2>
                <p>Connect to relevant legal knowledge engines across the NYAYI ecosystem.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px;" data-aos="fade-up">
                <a href="dictionary.html" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-book-bookmark"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Legal Dictionary</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Search 1,200+ Indian legal terms and statutory references.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Open Dictionary <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="laws.html" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-landmark"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Indian Laws Library</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Explore statutory act analyses of BNS 2023, BNSS & Constitution.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Open Laws Library <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="guides.html" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-file-lines"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Legal Guides</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Step-by-step procedural guides for FIRs, bail, and cyber complaints.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Open Legal Guides <i class="fas fa-arrow-right"></i></div>
                </a>

                <a href="features.html" class="right-cat-tile">
                    <div>
                        <div class="tile-icon"><i class="fas fa-layer-group"></i></div>
                        <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:6px;">Platform Features</h3>
                        <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Explore BNS/IPC converters, AI search, and drafting utilities.</p>
                    </div>
                    <div style="margin-top:16px; font-size:13px; font-weight:800; color:var(--primary);">Explore Features <i class="fas fa-arrow-right"></i></div>
                </a>
            </div>
        </div>
    </section>

    <!-- 22 — FINAL CTA -->
    <section style="padding:0 0 100px;" id="final-cta">
        <div class="container">
            <div style="background:linear-gradient(135deg, #000000 0%, #151515 100%); border-radius:35px; padding:60px; text-align:center; border:1px solid #222; box-shadow:0 30px 60px rgba(0,0,0,0.3);" data-aos="zoom-in">
                <span class="cp-role" style="background:rgba(0,200,83,0.15); color:var(--primary); display:inline-block; margin-bottom:14px;">KNOW YOUR RIGHTS • TAKE YOUR NEXT STEP</span>
                <h2 style="font-size:2.8rem; font-weight:900; color:white; margin-bottom:16px; letter-spacing:-1px;">Know Your Rights.<br><span>Take Your Next Step With Clarity.</span></h2>
                <p style="font-size:1.15rem; color:#aaa; max-width:700px; margin:0 auto 30px; line-height:1.8;">Explore legal knowledge, practical guides, and technology-assisted tools built around Indian legal needs.</p>
                <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
                    <a href="dictionary.html" class="btn-outline" style="color:white; border-color:#444; padding:16px 32px; font-size:15px;"><i class="fas fa-book-bookmark"></i> Explore Legal Dictionary</a>
                    <a href="guides.html" class="btn-outline" style="color:white; border-color:#444; padding:16px 32px; font-size:15px;"><i class="fas fa-file-lines"></i> Explore Legal Guides</a>
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai" style="padding:16px 36px; font-size:15px;"><i class="fas fa-robot"></i> Launch NYAYI AI</a>
                </div>
            </div>
        </div>
    </section>

    <!-- INTERACTIVE SCRIPTS -->
    <script>
        function toggleFaq(element) {
            const faqItem = element.closest ? element.closest('.faq-item') : element.parentElement;
            if (!faqItem) return;
            const body = faqItem.querySelector('.faq-body');
            const isActive = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const b = item.querySelector('.faq-body');
                if (b) b.style.maxHeight = null;
            });

            if (!isActive && body) {
                faqItem.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        }

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

        function switchArticleTab(tabId, btn) {
            document.querySelectorAll('.article-tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('#article-explorer .filter-btn').forEach(b => b.classList.remove('active'));
            const target = document.getElementById(tabId);
            if (target) target.style.display = 'block';
            if (btn) btn.classList.add('active');
        }

        // CONSTITUTION STUDY MODE CARDS
        const studyCards = [
            {
                num: "STUDY CARD 1 OF 5",
                title: "Article 14 — Equality Before Law",
                body: "Article 14 guarantees that the State shall not deny equality before law or equal protection of laws to any person within India. It strikes down arbitrary state classification and ensures equal treatment in court proceedings.",
                note: "Article 14 incorporates the British concept of 'Rule of Law' (Dicey) and the American concept of 'Equal Protection of Laws'."
            },
            {
                num: "STUDY CARD 2 OF 5",
                title: "Article 19 — Six Fundamental Freedoms",
                body: "Guarantees 6 essential freedoms to citizens: Speech & Expression, Peaceful Assembly, Associations, Free Movement, Residence, and Profession. All are subject to reasonable statutory restrictions under Articles 19(2)–19(6).",
                note: "Freedom of Press is implicitly derived under Article 19(1)(a) Speech & Expression (Romesh Thappar 1950)."
            },
            {
                num: "STUDY CARD 3 OF 5",
                title: "Article 21 — Life & Personal Liberty",
                body: "Prohibits deprivation of life or personal liberty except according to procedure established by law. Expanded by Supreme Court to include Right to Privacy, Clean Environment, Speedier Trial, and Livelihood.",
                note: "Maneka Gandhi v. Union of India (1978) held that procedure depriving liberty must be 'just, fair, and reasonable'."
            },
            {
                num: "STUDY CARD 4 OF 5",
                title: "Article 22 — Protection Against Custodial Arrest",
                body: "Guarantees immediate information of grounds of arrest, right to consult an advocate, and mandatory production before Judicial Magistrate within 24 hours of arrest.",
                note: "Reaffirmed under Section 35, 38, and 58 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)."
            },
            {
                num: "STUDY CARD 5 OF 5",
                title: "Article 32 — Right to Constitutional Remedies",
                body: "Empowers citizens to move the Supreme Court directly via Writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for enforcing Fundamental Rights.",
                note: "Dr. Ambedkar termed Article 32 the 'Heart and Soul of the Constitution'."
            }
        ];
        let currentStudyIdx = 0;
        function updateStudyCard() {
            const card = studyCards[currentStudyIdx];
            document.getElementById('studyCardNum').textContent = card.num;
            document.getElementById('studyTitle').textContent = card.title;
            document.getElementById('studyBody').textContent = card.body;
            document.getElementById('studyNote').textContent = card.note;
        }
        function nextStudyCard() {
            currentStudyIdx = (currentStudyIdx + 1) % studyCards.length;
            updateStudyCard();
        }
        function prevStudyCard() {
            currentStudyIdx = (currentStudyIdx - 1 + studyCards.length) % studyCards.length;
            updateStudyCard();
        }

        // KNOWLEDGE QUIZ WIDGET
        const quizData = [
            {
                q: "Which Constitutional Article guarantees the Right to Life and Personal Liberty in India?",
                opts: ["A) Article 14", "B) Article 19", "C) Article 21", "D) Article 32"],
                correct: 2,
                exp: "Correct! Article 21 protects life and personal liberty, expanded to cover privacy, clean environment, and speedy trial."
            },
            {
                q: "Within how many hours must an arrested person be produced before a Magistrate?",
                opts: ["A) 12 Hours", "B) 24 Hours", "C) 48 Hours", "D) 72 Hours"],
                correct: 1,
                exp: "Correct! Under Article 22(2) and BNSS Section 58, production before a Magistrate within 24 hours is mandatory."
            },
            {
                q: "What is the emergency national toll-free helpline number for reporting financial cyber fraud?",
                opts: ["A) 100", "B) 1091", "C) 1930", "D) 112"],
                correct: 2,
                exp: "Correct! 1930 is the National Cyber Financial Fraud Helpline for freezing stolen funds during the golden hour."
            },
            {
                q: "Can a woman be arrested after sunset and before sunrise under general circumstances?",
                opts: ["A) Yes, anytime", "B) No, prohibited under BNSS Sec 43 without Magistrate order", "C) Only by male officers", "D) Only on weekends"],
                correct: 1,
                exp: "Correct! Under BNSS Section 43, arresting a woman between sunset and sunrise requires prior written Judicial Magistrate permission."
            },
            {
                q: "Which Constitutional Article directs the State to provide free legal aid to eligible citizens?",
                opts: ["A) Article 14", "B) Article 21A", "C) Article 39A", "D) Article 51A"],
                correct: 2,
                exp: "Correct! Article 39A mandates the State to secure equal justice and free legal aid through NALSA and DLSAs."
            }
        ];
        let quizIdx = 0;
        let quizScore = 0;

        function renderQuizQuestion() {
            const q = quizData[quizIdx];
            document.getElementById('quizProgress').textContent = 'QUESTION ' + (quizIdx + 1) + ' OF ' + quizData.length;
            document.getElementById('quizQuestion').textContent = q.q;
            const optsContainer = document.getElementById('quizOptions');
            optsContainer.innerHTML = q.opts.map((opt, i) => 
                '<button class="quiz-option-btn" onclick="checkQuizAnswer(' + i + ')"><span>' + opt + '</span> <i class="fas fa-circle-notch"></i></button>'
            ).join('');
            document.getElementById('quizFeedback').style.display = 'none';
            document.getElementById('quizNextBtn').style.display = 'none';
        }

        function checkQuizAnswer(selectedIdx) {
            const q = quizData[quizIdx];
            const btns = document.querySelectorAll('.quiz-option-btn');
            btns.forEach(b => b.disabled = true);
            const feedback = document.getElementById('quizFeedback');

            if (selectedIdx === q.correct) {
                btns[selectedIdx].classList.add('correct');
                quizScore++;
                document.getElementById('quizScore').textContent = quizScore;
                feedback.style.background = '#e8f5e9';
                feedback.style.color = '#1b5e20';
                feedback.style.border = '1px solid #c6f6d5';
                feedback.innerHTML = '<strong><i class="fas fa-check-circle"></i> Correct!</strong> ' + q.exp;
            } else {
                btns[selectedIdx].classList.add('wrong');
                btns[q.correct].classList.add('correct');
                feedback.style.background = '#fff5f5';
                feedback.style.color = '#c53030';
                feedback.style.border = '1px solid #fed7d7';
                feedback.innerHTML = '<strong><i class="fas fa-circle-xmark"></i> Incorrect.</strong> ' + q.exp;
            }
            feedback.style.display = 'block';
            document.getElementById('quizNextBtn').style.display = 'inline-flex';
        }

        function nextQuizQuestion() {
            quizIdx++;
            if (quizIdx < quizData.length) {
                renderQuizQuestion();
            } else {
                document.getElementById('quizProgress').textContent = 'QUIZ COMPLETED!';
                document.getElementById('quizQuestion').textContent = 'Congratulations! You completed the Citizen Rights Knowledge Check.';
                document.getElementById('quizOptions').innerHTML = '<div style="text-align:center; padding:30px; background:#fff; border-radius:20px;"><h4 style="font-size:24px; font-weight:800; color:var(--primary-dark);">Your Final Score: ' + quizScore + ' / ' + quizData.length + '</h4><p style="font-size:15px; color:#555; margin-top:8px;">You have demonstrated strong awareness of Indian constitutional rights and legal safeguards.</p></div>';
                document.getElementById('quizFeedback').style.display = 'none';
                document.getElementById('quizNextBtn').style.display = 'none';
            }
        }

        // HIGHLIGHT ACTIVE STICKY NAV ITEM ON SCROLL
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id], div[id]');
            const navItems = document.querySelectorAll('.rights-nav-item');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + current) {
                    item.classList.add('active');
                }
            });
        });
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
    // Features Page
    const featuresHtml = `
    ${renderHead('Core Legal Capabilities & Tools | NYAYI Legal AI', 'Explore the flagship features of NYAYI: BNS IPC Converter, Draft FIR Generator, Smart Case Search, Multilingual Legal Access, Rent Agreement Drafter, and Traffic Fine Calculator.', 'NYAYI features, IPC BNS converter, draft FIR generator, AI legal assistant India, Indian law tools, legal research tools, BNS 2023 tools', '/features.html')}
    ${renderHeader('features', 0)}

    <!-- 1. HERO SECTION -->
    <section class="page-header" style="padding-bottom: 30px;">
        <div class="container" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:12px;">THE NYAYI TOOLKIT</span>
            <h1>Powerful Legal Tools. <br><span>Built for India.</span></h1>
            <p style="max-width:780px; margin:0 auto 30px; font-size:1.15rem; color:#555;">NYAYI brings together practical legal tools, statutory research utilities, document drafting templates, and regional language access designed around Indian legal information needs.</p>
            
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <a href="#overview" class="btn-outline">
                    <i class="fas fa-compass"></i> Explore Capabilities
                </a>
                <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="padding:14px 32px; font-size:15px;">
                    <i class="fas fa-rocket"></i> Launch NYAYI AI
                </a>
            </div>
        </div>
    </section>

    <!-- SECTION 10: CATEGORY QUICK NAV -->
    <section style="background:var(--bg-light); padding:20px 0; border-bottom:1px solid #e2e8f0;">
        <div class="container">
            <div class="category-nav-bar" data-aos="fade-up">
                <a href="#overview" class="cat-pill"><i class="fas fa-layer-group"></i> All Tools</a>
                <a href="#research" class="cat-pill"><i class="fas fa-brain"></i> Legal Research</a>
                <a href="#converters" class="cat-pill"><i class="fas fa-arrow-right-arrow-left"></i> Statutory Converters</a>
                <a href="#drafting" class="cat-pill"><i class="fas fa-file-signature"></i> Document Drafting</a>
                <a href="#calculators" class="cat-pill"><i class="fas fa-calculator"></i> Practical Utilities</a>
                <a href="#multilingual" class="cat-pill"><i class="fas fa-language"></i> 22+ Languages</a>
                <a href="#flow" class="cat-pill"><i class="fas fa-route"></i> Product Flow</a>
                <a href="#use-cases" class="cat-pill"><i class="fas fa-users"></i> Use Cases</a>
                <a href="#trust" class="cat-pill"><i class="fas fa-shield-halved"></i> Trust & Security</a>
                <a href="#faqs" class="cat-pill"><i class="fas fa-circle-question"></i> FAQs</a>
            </div>
        </div>
    </section>

    <!-- 2. CORE FEATURE OVERVIEW GRID -->
    <section class="features-section" id="overview" style="padding:90px 0; background:var(--white);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Platform <span>Capabilities Overview</span></h2>
                <p>Engineered with legal-grade natural language mapping, statutory converters, and dynamic drafting modules.</p>
            </div>

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
                        <p>Seamlessly translate classic Indian Penal Code (IPC 1860) sections into their updated Bharatiya Nyaya Sanhita (BNS 2023) counterparts in real-time.</p>
                    </div>
                    <span class="fc-tag">Statutory Utility</span>
                </div>

                <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div class="fc-icon"><i class="fas fa-file-signature"></i></div>
                        <h3>Draft FIR Generator</h3>
                        <p>Generate structured, legally sound First Information Report (FIR) drafts by answering guided prompts about incident details and timelines.</p>
                    </div>
                    <span class="fc-tag">Auto-Drafting</span>
                </div>

                <div class="feature-card" data-aos="fade-up">
                    <div>
                        <div class="fc-icon"><i class="fas fa-building-user"></i></div>
                        <h3>Rent Agreement Drafter</h3>
                        <p>Create customizable rental contracts formatted to standard Indian real estate tenancy norms and state registration guidelines.</p>
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

    <!-- 3. FEATURE SPOTLIGHT 1: SMART CASE SEARCH -->
    <section id="research" style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="spotlight-grid">
                <div data-aos="fade-right">
                    <span class="card-tag" style="background:rgba(0,200,83,0.1); color:var(--primary-dark);">AI-POWERED SEARCH</span>
                    <h2 style="font-size:2.4rem; font-weight:900; margin:15px 0 20px; line-height:1.2;">Search legal concepts in plain language.</h2>
                    <p style="color:#555; font-size:16.5px; line-height:1.8; margin-bottom:24px;">Describe a real-world legal situation naturally—without memorizing statute numbers or complex advocate jargon. NYAYI's computational engine analyzes the factual context and explores relevant provisions across Indian criminal, civil, and cyber laws.</p>
                    <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
                        <a href="dictionary.html" class="btn-outline"><i class="fas fa-magnifying-glass"></i> Explore Legal Terms</a>
                        <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="font-weight:800; font-size:14px;">Try Live AI Search <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <div class="mock-ui-card" data-aos="fade-left">
                    <div class="mock-ui-header">
                        <div class="mock-dots">
                            <span class="mock-dot dot-red"></span>
                            <span class="mock-dot dot-yellow"></span>
                            <span class="mock-dot dot-green"></span>
                        </div>
                        <span style="font-size:12px; font-weight:800; color:#718096; text-transform:uppercase; letter-spacing:1px;">NYAYI Search Console</span>
                    </div>
                    <div class="mock-query-box">
                        <i class="fas fa-user-slash" style="color:var(--primary);"></i>
                        <span>"Someone took a loan in my name using stolen Aadhaar card details online. Which law applies?"</span>
                    </div>
                    <div class="mock-response-box">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="font-size:12px; font-weight:900; color:var(--primary-dark); text-transform:uppercase;">Mapped Legal Provisions</span>
                            <span style="font-size:11px; background:#e6fffa; color:#234e52; padding:3px 8px; border-radius:10px; font-weight:700;">High Relevance</span>
                        </div>
                        <ul style="padding-left:18px; margin:0; line-height:1.7; font-size:14px; color:#2d3748;">
                            <li><strong>BNS Section 318(4):</strong> Cheating & Identity Impersonation</li>
                            <li><strong>IT Act Section 66C:</strong> Identity Theft Punishment</li>
                            <li><strong>IT Act Section 66D:</strong> Cheating by Personation using Computer Resource</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. FEATURE SPOTLIGHT 2: IPC TO BNS CONVERTER -->
    <section id="converters" style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div style="text-align:center; max-width:800px; margin:0 auto 40px;" data-aos="fade-up">
                <span class="card-tag" style="background:rgba(0,200,83,0.1); color:var(--primary-dark);">STATUTORY MAPPING</span>
                <h2 style="font-size:2.5rem; font-weight:900; margin-top:12px;">From IPC to BNS, without the confusion.</h2>
                <p style="color:#555; font-size:16.5px; line-height:1.8;">On July 1, 2024, India implemented new criminal law codes. NYAYI provides real-time cross-referencing between the Indian Penal Code (IPC 1860) and Bharatiya Nyaya Sanhita (BNS 2023) so legal practitioners and citizens never lose context.</p>
            </div>

            <div class="ipc-bns-comparison" data-aos="zoom-in">
                <div class="compare-box old-ipc">
                    <span style="font-size:12px; font-weight:800; color:#718096; text-transform:uppercase; letter-spacing:1px;">Legacy Code (1860)</span>
                    <h3 style="font-size:22px; font-weight:900; margin:8px 0; color:#2d3748;">Indian Penal Code (IPC)</h3>
                    <div style="border-top:1px solid #eee; padding-top:12px; margin-top:12px;">
                        <p style="margin:6px 0; font-size:14px;"><strong>IPC Section 302:</strong> Punishment for Murder</p>
                        <p style="margin:6px 0; font-size:14px;"><strong>IPC Section 420:</strong> Cheating & Dishonestly Inducing Delivery</p>
                        <p style="margin:6px 0; font-size:14px;"><strong>IPC Section 376:</strong> Punishment for Sexual Assault</p>
                    </div>
                </div>

                <div class="compare-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>

                <div class="compare-box new-bns">
                    <span style="font-size:12px; font-weight:900; color:var(--primary-dark); text-transform:uppercase; letter-spacing:1px;">Active Code (2023)</span>
                    <h3 style="font-size:22px; font-weight:900; margin:8px 0; color:var(--primary-dark);">Bharatiya Nyaya Sanhita (BNS)</h3>
                    <div style="border-top:1px solid rgba(0,200,83,0.2); padding-top:12px; margin-top:12px;">
                        <p style="margin:6px 0; font-size:14px;"><strong>BNS Section 103:</strong> Punishment for Murder</p>
                        <p style="margin:6px 0; font-size:14px;"><strong>BNS Section 318:</strong> Cheating & Dishonestly Inducing Delivery</p>
                        <p style="margin:6px 0; font-size:14px;"><strong>BNS Section 64:</strong> Punishment for Sexual Assault</p>
                    </div>
                </div>
            </div>

            <div style="text-align:center; margin-top:40px;" data-aos="fade-up">
                <a href="https://ai.nyayi.in" target="_blank" class="btn-ai">
                    <i class="fas fa-arrow-right-arrow-left"></i> Launch Live Statutory Converter
                </a>
            </div>
        </div>
    </section>

    <!-- 5. FEATURE SPOTLIGHT 3: LEGAL DOCUMENT DRAFTING (DARK SECTION) -->
    <section id="drafting" class="dark-drafting-section">
        <div class="container">
            <div style="text-align:center; max-width:800px; margin:0 auto;" data-aos="fade-up">
                <span class="card-tag" style="background:rgba(0,200,83,0.2); color:var(--primary);">DOCUMENT AUTOMATION</span>
                <h2 style="font-size:2.5rem; font-weight:900; margin-top:15px; color:#ffffff;">Turn Legal Information Into Structured Documents.</h2>
                <p style="color:#a0aec0; font-size:16.5px; line-height:1.8;">NYAYI provides technology-assisted drafting modules that help convert incident timelines and factual details into clear, standardized preliminary legal documents.</p>
            </div>

            <div class="draft-grid">
                <div class="draft-card" data-aos="fade-up">
                    <div>
                        <div style="width:44px; height:44px; background:rgba(0,200,83,0.15); color:var(--primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                            <i class="fas fa-file-shield"></i>
                        </div>
                        <h3 style="font-size:19px; font-weight:800; color:#fff; margin-bottom:8px;">Draft FIR Helper</h3>
                        <p style="font-size:14px; color:#a0aec0; line-height:1.6;">Structured prompts guide you through incident chronology, accused details, and police station jurisdiction tagging.</p>
                    </div>
                    <span style="font-size:12px; color:var(--primary); font-weight:700; display:inline-block; margin-top:16px;">Guided Complaint Flow →</span>
                </div>

                <div class="draft-card" data-aos="fade-up" data-aos-delay="100">
                    <div>
                        <div style="width:44px; height:44px; background:rgba(0,200,83,0.15); color:var(--primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                            <i class="fas fa-house-user"></i>
                        </div>
                        <h3 style="font-size:19px; font-weight:800; color:#fff; margin-bottom:8px;">Rent Agreement Drafter</h3>
                        <p style="font-size:14px; color:#a0aec0; line-height:1.6;">Generate standard residential lease drafts containing deposit terms, lock-in clauses, and eviction notice guidelines.</p>
                    </div>
                    <span style="font-size:12px; color:var(--primary); font-weight:700; display:inline-block; margin-top:16px;">Tenancy Agreement Builder →</span>
                </div>

                <div class="draft-card" data-aos="fade-up" data-aos-delay="200">
                    <div>
                        <div style="width:44px; height:44px; background:rgba(0,200,83,0.15); color:var(--primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                            <i class="fas fa-envelope-open-text"></i>
                        </div>
                        <h3 style="font-size:19px; font-weight:800; color:#fff; margin-bottom:8px;">Legal Notice Builder</h3>
                        <p style="font-size:14px; color:#a0aec0; line-height:1.6;">Structure formal demand letters for non-payment, breach of contract, or property recovery before litigation.</p>
                    </div>
                    <span style="font-size:12px; color:var(--primary); font-weight:700; display:inline-block; margin-top:16px;">Demand Letter Framework →</span>
                </div>

                <div class="draft-card" data-aos="fade-up" data-aos-delay="300">
                    <div>
                        <div style="width:44px; height:44px; background:rgba(0,200,83,0.15); color:var(--primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                            <i class="fas fa-scale-unbalanced"></i>
                        </div>
                        <h3 style="font-size:19px; font-weight:800; color:#fff; margin-bottom:8px;">Consumer Complaint Form</h3>
                        <p style="font-size:14px; color:#a0aec0; line-height:1.6;">Format deficiency-of-service complaints for filing before District Consumer Disputes Redressal Commissions.</p>
                    </div>
                    <span style="font-size:12px; color:var(--primary); font-weight:700; display:inline-block; margin-top:16px;">Consumer Forum Formatter →</span>
                </div>
            </div>

            <!-- RESPONSIBLE LEGAL DISCLAIMER BOX -->
            <div style="background:#141820; border-left:4px solid var(--primary); padding:24px; border-radius:14px; margin-top:40px;" data-aos="fade-up">
                <strong style="color:var(--primary); font-size:15px;"><i class="fas fa-circle-info"></i> Responsible Legal Drafting Notice:</strong>
                <p style="margin:8px 0 0; color:#a0aec0; font-size:14px; line-height:1.7;">NYAYI document tools provide technology-assisted preliminary drafting support. Drafted documents do not constitute formal court filings or attorney work product. Users should independently review and customize all generated drafts with a licensed advocate prior to police submission or judicial filing.</p>
            </div>
        </div>
    </section>

    <!-- 6. FEATURE SPOTLIGHT 4: PRACTICAL LEGAL UTILITIES -->
    <section id="calculators" style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Instant Practical <span>Legal Utilities</span></h2>
                <p>Calculators and lookup modules engineered to answer immediate statutory questions.</p>
            </div>

            <div class="spotlight-grid" style="margin-top:40px;">
                <div class="mock-ui-card" data-aos="fade-right">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #edf2f7; padding-bottom:14px; margin-bottom:20px;">
                        <h3 style="font-size:18px; font-weight:800; margin:0;"><i class="fas fa-car" style="color:var(--primary);"></i> Traffic Fine & Summons Estimator</h3>
                        <span class="badge-cat">MV Act 2019</span>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div style="background:#f8faf9; border:1px solid #e2e8f0; padding:12px 16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                            <span>Driving without Helmet (Sec 129/194D)</span>
                            <strong style="color:#e53e3e;">₹1,000 + 3M License Susp.</strong>
                        </div>
                        <div style="background:#f8faf9; border:1px solid #e2e8f0; padding:12px 16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                            <span>Over-speeding LMV (Sec 112/183)</span>
                            <strong style="color:#dd6b20;">₹1,000 – ₹2,000</strong>
                        </div>
                        <div style="background:#f8faf9; border:1px solid #e2e8f0; padding:12px 16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                            <span>Red Light Jump (Sec 184)</span>
                            <strong style="color:#dd6b20;">₹1,000 – ₹5,000</strong>
                        </div>
                        <div style="background:#fff5f5; border:1px solid #feb2b2; padding:12px 16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                            <span>Drunk Driving (Sec 185)</span>
                            <strong style="color:#c53030;">₹10,000 + Court Summons</strong>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-left">
                    <span class="card-tag" style="background:rgba(0,200,83,0.1); color:var(--primary-dark);">CALCULATOR SUITE</span>
                    <h2 style="font-size:2.2rem; font-weight:900; margin:15px 0 20px; line-height:1.2;">Clear Fine Estimates & Statutory Limits.</h2>
                    <p style="color:#555; font-size:16px; line-height:1.8; margin-bottom:20px;">Avoid confusion during traffic stops or procedural deadlines. NYAYI's practical calculators compute compounding fine amounts, court summons risks, limitation periods for legal notices, and consumer forum jurisdiction limits based on active central acts.</p>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px;">
                        <div style="background:#fff; border:1px solid #e2e8f0; padding:18px; border-radius:16px;">
                            <h4 style="font-size:15px; font-weight:800; margin-bottom:6px;"><i class="fas fa-clock" style="color:var(--primary);"></i> Limitation Periods</h4>
                            <p style="font-size:13px; color:#666; margin:0;">Calculate valid filing windows under Indian Limitation Act 1963.</p>
                        </div>
                        <div style="background:#fff; border:1px solid #e2e8f0; padding:18px; border-radius:16px;">
                            <h4 style="font-size:15px; font-weight:800; margin-bottom:6px;"><i class="fas fa-coins" style="color:var(--primary);"></i> Consumer Forum Limits</h4>
                            <p style="font-size:13px; color:#666; margin:0;">Map claim value to District, State or National Commission jurisdiction.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. MULTILINGUAL LEGAL ACCESS -->
    <section id="multilingual" style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div style="text-align:center; max-width:800px; margin:0 auto;" data-aos="fade-up">
                <span class="card-tag" style="background:rgba(0,200,83,0.1); color:var(--primary-dark);">VERNACULAR ACCESSIBILITY</span>
                <h2 style="font-size:2.5rem; font-weight:900; margin-top:15px;">Legal Knowledge Should Speak Your Language.</h2>
                <p style="color:#555; font-size:16.5px; line-height:1.8;">Justice cannot be restricted to English legalese. NYAYI supports query processing and legal explanations across 22+ official Indian languages.</p>
            </div>

            <div class="lang-chips-grid" data-aos="zoom-in">
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> English</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Hindi (हिन्दी)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Bengali (বাংলা)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Marathi (मराठी)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Tamil (தமிழ்)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Telugu (తెలుగు)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Gujarati (ગુજરાતી)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Kannada (કન્નડ)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Malayalam (മലയാളം)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Punjabi (ਪੰਜਾਬੀ)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Odia (ଓଡ଼ିଆ)</span>
                <span class="lang-chip"><i class="fas fa-language" style="color:var(--primary);"></i> Assamese (অসমীয়া)</span>
            </div>
        </div>
    </section>

    <!-- 8. HOW THE FEATURES WORK TOGETHER (PRODUCT FLOW TIMELINE) -->
    <section id="flow" style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>One Platform. <span>Multiple Ways to Explore.</span></h2>
                <p>A unified product flow connecting basic awareness to practical legal action.</p>
            </div>

            <div class="flow-timeline-grid">
                <div class="flow-step-card" data-aos="fade-up">
                    <div class="flow-num">1</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">UNDERSTAND</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Explore simplified dictionary terms & fundamental constitutional rights.</p>
                </div>

                <div class="flow-step-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="flow-num">2</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">SEARCH</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Query real legal situations using natural conversational prompts.</p>
                </div>

                <div class="flow-step-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="flow-num">3</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">COMPARE</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Translate legacy IPC codes directly to new active BNS sections.</p>
                </div>

                <div class="flow-step-card" data-aos="fade-up" data-aos-delay="300">
                    <div class="flow-num">4</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">DRAFT</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Generate preliminary FIR complaints and tenancy lease structures.</p>
                </div>

                <div class="flow-step-card" data-aos="fade-up" data-aos-delay="400">
                    <div class="flow-num">5</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">VERIFY</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Check traffic fine liabilities, court fees, and limitation windows.</p>
                </div>

                <div class="flow-step-card" data-aos="fade-up" data-aos-delay="500">
                    <div class="flow-num">6</div>
                    <h4 style="font-size:16px; font-weight:800; margin-bottom:8px;">NEXT STEP</h4>
                    <p style="font-size:13px; color:#555; margin:0;">Consult advocates with organized, factual case preparation details.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 9. USE CASES — BUILT FOR REAL LEGAL QUESTIONS -->
    <section id="use-cases" style="padding:100px 0; background:#ffffff;">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Built for <span>Real Legal Questions</span></h2>
                <p>Tailored legal technology designed for diverse user needs across India.</p>
            </div>

            <div class="audience-grid">
                <div class="aud-card" data-aos="fade-up">
                    <div style="width:44px; height:44px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; margin-bottom:10px;">For Citizens</h3>
                    <p style="font-size:14px; color:#555; line-height:1.7; margin:0;">Understand fundamental rights during police interactions, file consumer complaints, calculate traffic fines, and draft FIR complaints.</p>
                </div>

                <div class="aud-card" data-aos="fade-up" data-aos-delay="100">
                    <div style="width:44px; height:44px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; margin-bottom:10px;">For Students & Researchers</h3>
                    <p style="font-size:14px; color:#555; line-height:1.7; margin:0;">Study the IPC to BNS code transition, explore statutory definitions, and analyze landmark constitutional court precedents.</p>
                </div>

                <div class="aud-card" data-aos="fade-up" data-aos-delay="200">
                    <div style="width:44px; height:44px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; margin-bottom:10px;">For Legal Professionals</h3>
                    <p style="font-size:14px; color:#555; line-height:1.7; margin:0;">Perform rapid statutory section cross-referencing, prepare initial draft frameworks, and organize preliminary client intake data.</p>
                </div>

                <div class="aud-card" data-aos="fade-up" data-aos-delay="300">
                    <div style="width:44px; height:44px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; margin-bottom:10px;">For Businesses & Startups</h3>
                    <p style="font-size:14px; color:#555; line-height:1.7; margin:0;">Review residential and commercial tenancy contracts, understand statutory compliance norms, and structure formal legal notices.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 11. WHY THESE TOOLS EXIST (EDITORIAL PHILOSOPHY) -->
    <section style="padding:100px 0; background:var(--bg-light);">
        <div class="container" style="max-width:900px;">
            <div style="text-align:center;" data-aos="fade-up">
                <span class="card-tag" style="background:rgba(0,200,83,0.1); color:var(--primary-dark);">EDITORIAL PHILOSOPHY</span>
                <h2 style="font-size:2.5rem; font-weight:900; margin:15px 0 24px;">Technology Should Reduce Legal Friction.</h2>
                <div style="line-height:1.9; color:#4a5568; font-size:16.5px; text-align:left;">
                    <p style="margin-bottom:18px;">Legal information in India has historically been locked behind dense statutory legalese, outdated procedural manuals, and hard-to-navigate code references. When individuals face legal uncertainty, finding clear answers often feels intimidating and convoluted.</p>
                    <p style="margin-bottom:18px;">NYAYI is built on a simple premise: <strong>technology should clarify the law, not complicate it.</strong> By combining natural language AI search, precise IPC-BNS statutory converters, and intuitive document drafting assistants, we empower every citizen to understand their rights and take informed next steps.</p>
                    <p style="margin:0;">We believe that democratizing statutory knowledge fosters a more legal-aware society where justice is accessible, understandable, and transparent for all.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 12. RESPONSIBLE AI & LEGAL TRUST -->
    <section id="trust" style="padding:80px 0; background:#ffffff;">
        <div class="container">
            <div class="trust-banner-box" data-aos="zoom-in">
                <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
                    <i class="fas fa-shield-halved" style="color:var(--primary); font-size:32px;"></i>
                    <h2 style="font-size:2rem; font-weight:900; margin:0; color:#fff;">Technology-Assisted. Human-Aware.</h2>
                </div>
                <p style="color:#a0aec0; font-size:16px; line-height:1.8; margin-bottom:30px;">NYAYI is designed as an educational and computational legal research platform. We prioritize transparency, factual accuracy, and responsible AI usage across all our tools.</p>
                
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:24px;">
                    <div>
                        <h4 style="font-size:15px; font-weight:800; color:var(--primary); margin-bottom:6px;"><i class="fas fa-circle-info"></i> Information Only</h4>
                        <p style="font-size:13.5px; color:#cbd5e0; margin:0; line-height:1.6;">Tools provide legal information and structured drafting support, not advocate representation.</p>
                    </div>
                    <div>
                        <h4 style="font-size:15px; font-weight:800; color:var(--primary); margin-bottom:6px;"><i class="fas fa-scale-balanced"></i> Case Specificity</h4>
                        <p style="font-size:13.5px; color:#cbd5e0; margin:0; line-height:1.6;">Legal outcomes depend on specific facts. Users must independently verify critical documents.</p>
                    </div>
                    <div>
                        <h4 style="font-size:15px; font-weight:800; color:var(--primary); margin-bottom:6px;"><i class="fas fa-lock"></i> Privacy First</h4>
                        <p style="font-size:13.5px; color:#cbd5e0; margin:0; line-height:1.6;">User queries and draft session data remain confidential and protected under strict security norms.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 13. SUBSTANTIAL FAQ SECTION -->
    <section id="faqs" style="padding:100px 0; background:var(--bg-light);">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Frequently Asked <span>Questions</span></h2>
                <p>Everything you need to know about NYAYI legal tools and capabilities.</p>
            </div>

            <div class="faq-list" style="max-width:900px; margin:40px auto 0;">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What is NYAYI and what tools does it provide?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>NYAYI is a modern Indian legal knowledge platform. It provides AI-powered case search, IPC to BNS statutory converters, FIR draft helpers, rent agreement drafters, traffic fine calculators, and multilingual legal explanations.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>How does the IPC to BNS Converter work?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The converter maps classic Indian Penal Code (IPC 1860) section numbers directly to their active counterparts under the Bharatiya Nyaya Sanhita (BNS 2023) in real-time, helping users navigate India's criminal code transition.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="200">
                    <div class="faq-header"><h3>Can NYAYI generate a draft FIR or Rent Agreement?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes! NYAYI includes guided auto-drafting modules that help format incident details into a structured First Information Report (FIR) complaint or create standardized residential lease agreements according to Indian real estate norms.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Does NYAYI support multiple Indian languages?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes, NYAYI supports legal queries and statutory explanations across 22+ official Indian languages, including Hindi, English, Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Odia, and Assamese.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>Can NYAYI replace a lawyer or advocate in court?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>No. NYAYI provides technology-assisted legal information and research tools. It does not provide formal legal advice, representation, or substitute for a licensed advocate in court proceedings.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="200">
                    <div class="faq-header"><h3>Where can I access the interactive NYAYI AI Web App?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>You can access the dedicated NYAYI AI research terminal by clicking any "Launch NYAYI AI" button on this website or by visiting <a href="https://ai.nyayi.in" target="_blank" style="color:var(--primary); font-weight:700;">ai.nyayi.in</a> directly.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Are NYAYI's legal tools free to use?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes, NYAYI's core legal dictionary, statutory converters, practical calculators, legal guides, and fundamental rights explainers are freely accessible to all citizens.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up" data-aos-delay="100">
                    <div class="faq-header"><h3>How should I verify legal information before taking action?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Users should cross-reference statutory section numbers with official government gazettes (e.g. eGazette of India) and consult a qualified advocate for case-specific legal strategy.</p></div>
                </div>
            </div>
        </div>
    </section>

    <!-- 14. STRONG FINAL CTA BLOCK -->
    <section class="cta-section" style="padding:0 0 110px;">
        <div class="container">
            <div class="cta-box" data-aos="zoom-in">
                <h2 style="font-size:2.6rem;">Ready to Explore NYAYI?</h2>
                <p style="max-width:650px; margin:14px auto 28px;">Explore legal knowledge, practical statutory tools, and AI-assisted legal research designed around Indian legal needs.</p>
                <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-launch" style="display:inline-flex; font-size:17px; padding:16px 40px;">
                        <i class="fas fa-rocket"></i> Launch NYAYI AI
                    </a>
                    <a href="dictionary.html" class="btn-outline" style="background:#ffffff; color:#111 !important; border-color:#ffffff; font-size:15px; padding:16px 32px;">
                        <i class="fas fa-book"></i> Explore Legal Knowledge
                    </a>
                </div>
            </div>
        </div>
    </section>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'features.html'), featuresHtml, 'utf8');

    // Contact Page
    const contactHtml = `
    ${renderHead('Contact Support | NYAYI Legal AI', 'Get in touch with the official NYAYI Legal Editorial Board & Technical Support Desk.', 'Contact NYAYI, NYAYI legal support, NYAYI contact', '/contact.html')}
    ${renderHeader('home', 0)}

    <section class="page-header">
        <div class="container" data-aos="zoom-in">
            <h1>Get in <span>Touch</span></h1>
            <p>Have questions or feedback? Reach out directly to the official NYAYI Legal Team.</p>
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

    // Expanded authentic Indian Laws dataset
    const expandedLawsList = [
        {
            slug: "bns",
            title: "Bharatiya Nyaya Sanhita (BNS), 2023",
            shortName: "BNS 2023",
            year: "2023 (Enforced July 1, 2024)",
            category: "Criminal Law",
            catKey: "criminal",
            purpose: "Replaced the 163-year-old Indian Penal Code (IPC 1860) with a modern criminal legal code focused on justice rather than colonial punishment.",
            coverage: "Offences against human body, property, public order, state sovereignty, organized crime, terror acts, and community service punishments.",
            whyItMatters: "Every criminal complaint, FIR, and charge sheet filed after July 1, 2024 is registered under BNS section numbers instead of IPC sections.",
            importantConcepts: [
                "Introduction of Community Service as a statutory punishment for minor offences.",
                "Categorization of Organized Crime (Sec 111), Mob Lynching (Sec 103), and Terrorist Acts (Sec 113).",
                "Treasonous acts against Sovereignty (Sec 152) replacing colonial Sedition (Sec 124A IPC).",
                "Gender-neutral provisions for offences against children and property."
            ],
            practicalRelevance: "Defines primary criminal liability, offences, and punishments applicable across India.",
            officialRef: "Ministry of Law and Justice, Gazette Notification 2023",
            relatedTerms: ["cognizable-offence", "non-cognizable-offence", "fir", "phishing"],
            relatedGuides: ["how-to-file-an-fir", "what-happens-after-filing-an-fir"],
            studyNotes: "BNS contains 358 Sections compared to 511 Sections in the old IPC 1860."
        },
        {
            slug: "bnss",
            title: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
            shortName: "BNSS 2023",
            year: "2023 (Enforced July 1, 2024)",
            category: "Criminal Procedure",
            catKey: "procedural",
            purpose: "Governs the procedural framework for police investigations, arrests, bail, trials, and court administration in criminal matters.",
            coverage: "Police arrest powers, Zero FIR, e-FIR, mandatory forensic collection, bail procedures, and strict trial time limits.",
            whyItMatters: "Replaced CrPC 1973. Mandates strict timelines: charge sheets within 90 days, trial judgments within 45 days of trial conclusion.",
            importantConcepts: [
                "Mandatory forensic investigation for offences punishable by 7+ years imprisonment.",
                "Statutory recognition of Zero FIR, e-FIR, and digital/audio-video recording of search and seizure.",
                "Enhanced safeguards for arrests of elderly, infirm, and female citizens.",
                "Bail provisions (Sec 478-496) and undertrial release limits."
            ],
            practicalRelevance: "Defines police powers, arrest safeguards (Sec 35, 36, 58), and court trial procedures.",
            officialRef: "Ministry of Home Affairs Guidelines",
            relatedTerms: ["fir", "zero-fir", "bail", "anticipatory-bail", "charge-sheet"],
            relatedGuides: ["how-to-file-an-fir", "understanding-anticipatory-bail"],
            studyNotes: "BNSS contains 531 Sections replacing the 484 Sections of CrPC 1973."
        },
        {
            slug: "bsa",
            title: "Bharatiya Sakshya Adhiniyam (BSA), 2023",
            shortName: "BSA 2023",
            year: "2023 (Enforced July 1, 2024)",
            category: "Law of Evidence",
            catKey: "evidence",
            purpose: "Modernizes the rules of evidence admissibility, giving equal legal standing to electronic records, digital signatures, and server logs.",
            coverage: "Rules of primary & secondary evidence, electronic evidence admissibility, expert opinions, and witness protection.",
            whyItMatters: "Replaced Indian Evidence Act 1872. Establishes that digital/electronic records carry equal legal evidentiary weight as physical documents.",
            importantConcepts: [
                "Electronic & Digital Records recognized as primary evidence.",
                "Standardized admissibility for cloud storage, emails, WhatsApp logs, and smartphone recordings.",
                "Protection of spousal communication and legal professional privilege."
            ],
            practicalRelevance: "Crucial for establishing guilt or innocence in court trials through physical and digital evidence.",
            officialRef: "Gazette of India 2023",
            relatedTerms: ["charge-sheet", "phishing"],
            relatedGuides: ["how-to-report-cyber-crime"],
            studyNotes: "BSA contains 170 Sections replacing the 167 Sections of Indian Evidence Act 1872."
        },
        {
            slug: "constitution",
            title: "Constitution of India, 1950",
            shortName: "Indian Constitution",
            year: "1950",
            category: "Constitutional Law",
            catKey: "constitutional",
            purpose: "The supreme legal document establishing the political structure, fundamental rights, directive principles, and duties of citizens and government.",
            coverage: "Part III Fundamental Rights (Art 12-35), Part IV Directive Principles, Part IV-A Fundamental Duties, Union & State judiciary.",
            whyItMatters: "Any statute, police action, or executive order that violates Constitutional Fundamental Rights can be struck down as unconstitutional.",
            importantConcepts: [
                "Preamble: Sovereign, Socialist, Secular, Democratic Republic.",
                "Part III: Fundamental Rights (Articles 14, 19, 21, 22, 32).",
                "Articles 32 & 226: Power of Supreme Court and High Courts to issue Writs."
            ],
            practicalRelevance: "The bedrock of all Indian statutes, civil liberties, and fundamental citizen protections.",
            officialRef: "Constituent Assembly of India",
            relatedTerms: ["habeas-corpus", "mandamus"],
            relatedGuides: ["police-and-arrest-rights"],
            studyNotes: "Contains 395 Articles in 22 Parts and 12 Schedules."
        },
        {
            slug: "it-act",
            title: "Information Technology Act, 2000",
            shortName: "IT Act 2000",
            year: "2000 (Amended 2008)",
            category: "Cyber & Technology",
            catKey: "cyber",
            purpose: "Provides legal recognition for electronic commerce, digital signatures, cyber crimes, data privacy, and computer system security.",
            coverage: "Cyber crimes, unauthorized computer access, identity theft, online fraud, cyber terrorism, and intermediary liability.",
            whyItMatters: "Governs digital transactions, electronic records, and online offences across digital platforms in India.",
            importantConcepts: [
                "Section 66C: Punishment for Identity Theft.",
                "Section 66D: Cheating by Personation using computer resources.",
                "Section 43A & Data Protection rules for corporate data breaches.",
                "Intermediary guidelines for social media platforms (Sec 79)."
            ],
            practicalRelevance: "Essential for reporting digital banking fraud, hacking, unauthorized data access, and online impersonation.",
            officialRef: "Ministry of Electronics and Information Technology (MeitY)",
            relatedTerms: ["phishing", "cyber-crime"],
            relatedGuides: ["how-to-report-cyber-crime"],
            studyNotes: "Read alongside BNS 2023 Section 318 and BSA 2023 digital evidence rules."
        },
        {
            slug: "consumer-protection",
            title: "Consumer Protection Act, 2019",
            shortName: "CPA 2019",
            year: "2019",
            category: "Consumer Law",
            catKey: "consumer",
            purpose: "Protects consumer rights against defective goods, deficient services, unfair trade practices, misleading advertisements, and e-commerce fraud.",
            coverage: "Central Consumer Protection Authority (CCPA), e-Daakhil filing, product liability, misleading ads, and Consumer Disputes Commissions.",
            whyItMatters: "Replaced CPA 1986. Introduces statutory product liability holding manufacturers and sellers accountable for defective goods.",
            importantConcepts: [
                "Right to Refund, Replacement, or Compensation for defective goods/services.",
                "Establishment of Central Consumer Protection Authority (CCPA).",
                "Online e-Daakhil filing without requiring physical advocate presence.",
                "Strict penalties for misleading celebrity endorsements & fake reviews."
            ],
            practicalRelevance: "Enables buyers to file complaints against e-commerce sellers, defective appliance brands, or delayed services.",
            officialRef: "Department of Consumer Affairs (NCH 1915)",
            relatedTerms: ["consumer-forum", "unfair-trade-practice"],
            relatedGuides: ["consumer-rights-guide"],
            studyNotes: "Pecuniary jurisdiction: District Commission up to ₹50 Lakhs; State up to ₹2 Crore."
        },
        {
            slug: "motor-vehicles",
            title: "Motor Vehicles Act, 1988",
            shortName: "MV Act 1988",
            year: "1988 (Amended 2019)",
            category: "Motor Vehicles",
            catKey: "motor",
            purpose: "Regulates road transport, driver licensing, vehicle registration, traffic safety regulations, third-party insurance, and accident compensation.",
            coverage: "Driving licences, traffic fines, DUI offences, third-party accident claims (MACT), and hit-and-run compensation.",
            whyItMatters: "The 2019 amendment dramatically increased fines for dangerous driving, drunk driving, driving without insurance, and minor driving offences.",
            importantConcepts: [
                "Section 185: Drunk Driving penalties & breathalyzer limits.",
                "Good Samaritan Protections: Citizens assisting crash victims face no police harassment.",
                "Motor Accident Claims Tribunal (MACT) compensation framework.",
                "mParivahan / DigiLocker digital DL/RC statutory validity."
            ],
            practicalRelevance: "Governs daily traffic rules, e-challans, vehicle checking guidelines, and accident claim rights.",
            officialRef: "Ministry of Road Transport and Highways (MoRTH)",
            relatedTerms: ["mact", "e-challan"],
            relatedGuides: ["traffic-rights-guide"],
            studyNotes: "Mandatory third-party insurance required for all vehicles under Section 146."
        },
        {
            slug: "rti",
            title: "Right to Information Act, 2005",
            shortName: "RTI Act 2005",
            year: "2005",
            category: "Constitutional & Public",
            catKey: "constitutional",
            purpose: "Empowers citizens to request information from public authorities, promoting government transparency, accountability, and anti-corruption.",
            coverage: "Public Information Officers (PIOs), 30-day response mandate, first and second appeals, and Information Commissions.",
            whyItMatters: "Any Indian citizen can file an RTI query to inspect government records, project expenditures, exam answer sheets, or passport delays.",
            importantConcepts: [
                "Mandatory 30-day response timeline (48 hours if life or liberty is involved).",
                "Exemption categories under Section 8 (National Security, Trade Secrets).",
                "Penalty of ₹250/day on Public Information Officers for deliberate delays."
            ],
            practicalRelevance: "Essential tool for civic transparency, municipal accountability, and public scheme tracking.",
            officialRef: "Central Information Commission (CIC)",
            relatedTerms: ["public-authority", "information-officer"],
            relatedGuides: ["how-to-file-rti"],
            studyNotes: "Filing fee is ₹10 for central government authorities; free for BPL applicants."
        },
        {
            slug: "domestic-violence",
            title: "Protection of Women from Domestic Violence Act, 2005",
            shortName: "PWDVA 2005",
            year: "2005",
            category: "Family & Women",
            catKey: "family",
            purpose: "Provides civil remedies and protection orders for women suffering physical, sexual, verbal, emotional, or economic abuse within domestic relationships.",
            coverage: "Protection Orders, Residence Orders, Monetary Relief, Custody Orders, and Protection Officers.",
            whyItMatters: "Extends protection beyond married women to domestic relationships (live-in relationships, mothers, sisters) living in a shared household.",
            importantConcepts: [
                "Right to Reside in Shared Household regardless of legal ownership title.",
                "Immediate ex-parte Protection Orders prohibiting abuser entry or communication.",
                "Monetary relief for medical expenses and loss of earnings."
            ],
            practicalRelevance: "Enables aggrieved women to approach Protection Officers or Magistrates for urgent protection and maintenance.",
            officialRef: "Ministry of Women and Child Development",
            relatedTerms: ["domestic-violence", "protection-order"],
            relatedGuides: ["womens-rights-guide"],
            studyNotes: "Proceedings are civil in nature; breach of protection order is a criminal offence under Sec 31."
        },
        {
            slug: "posh",
            title: "Sexual Harassment of Women at Workplace (POSH) Act, 2013",
            shortName: "POSH Act 2013",
            year: "2013",
            category: "Labour & Workplace",
            catKey: "labour",
            purpose: "Mandates safe working environments for women by preventing, prohibiting, and redressing workplace sexual harassment across formal & informal sectors.",
            coverage: "Internal Complaints Committee (ICC), Local Complaints Committee (LCC), inquiry timelines, and employer duties.",
            whyItMatters: "Mandatory for all organizations with 10+ employees to constitute an Internal Complaints Committee (ICC) headed by a senior woman employee.",
            importantConcepts: [
                "Broad definition of Workplace including office premises, transport, and remote work.",
                "90-day mandatory completion timeline for ICC inquiry reports.",
                "Confidentiality safeguards protecting complainant and witness identity."
            ],
            practicalRelevance: "Guarantees formal internal redressal mechanism for working women experiencing unwanted sexual advances or hostile work environments.",
            officialRef: "Vishaka Guidelines & Ministry of Women and Child Development",
            relatedTerms: ["posh-icc", "workplace-harassment"],
            relatedGuides: ["posh-complaint-guide"],
            studyNotes: "Failure to constitute an ICC invites statutory fine of ₹50,000 on employers."
        },
        {
            slug: "juvenile-justice",
            title: "Juvenile Justice (Care and Protection of Children) Act, 2015",
            shortName: "JJ Act 2015",
            year: "2015",
            category: "Family & Child Protection",
            catKey: "family",
            purpose: "Consolidates laws relating to children in conflict with law and children in need of care and protection through child-friendly adjudication.",
            coverage: "Juvenile Justice Boards (JJB), Child Welfare Committees (CWC), adoption rules (CARA), and rehabilitation homes.",
            whyItMatters: "Allows preliminary assessment for juveniles aged 16-18 accused of heinous offences to determine if they should be tried as adults.",
            importantConcepts: [
                "Child in Conflict with Law (CCL) vs Child in Need of Care and Protection (CNCP).",
                "CARA statutory framework for legal domestic and inter-country adoptions.",
                "Strict confidentiality prohibiting publishing juvenile identities."
            ],
            practicalRelevance: "Governs juvenile offender rehabilitation, child adoption processes, and child protection homes.",
            officialRef: "Central Adoption Resource Authority (CARA)",
            relatedTerms: ["juvenile-justice-board", "cara"],
            relatedGuides: ["child-protection-guide"],
            studyNotes: "Rehabilitative focus prioritizing education, counseling, and social reintegration."
        },
        {
            slug: "pocso",
            title: "Protection of Children from Sexual Offences (POCSO) Act, 2012",
            shortName: "POCSO Act 2012",
            year: "2012 (Amended 2019)",
            category: "Child Protection",
            catKey: "family",
            purpose: "Special law enacted to protect children below 18 years from sexual assault, harassment, and pornography with child-friendly trial procedures.",
            coverage: "Penalties for penetrative and non-penetrative sexual assault, mandatory reporting, Special Courts, and child recording safeguards.",
            whyItMatters: "Mandatory reporting requirement: Any person, doctor, or institution aware of child sexual abuse must report it to police immediately.",
            importantConcepts: [
                "Gender-neutral protection for all children below 18 years.",
                "Mandatory reporting under Section 19 (failure to report is a punishable offence).",
                "Child-friendly trials: No cross-examination directly by accused; trials recorded on video."
            ],
            practicalRelevance: "Stringent penal law protecting minors with dedicated Special Courts ensuring 1-year trial completion.",
            officialRef: "Ministry of Women and Child Development",
            relatedTerms: ["pocso-special-court", "child-helpline-1098"],
            relatedGuides: ["pocso-reporting-guide"],
            studyNotes: "Presumption of culpable mental state (Sec 29 & 30) shifts burden of proof to accused."
        },
        {
            slug: "companies-act",
            title: "Companies Act, 2013",
            shortName: "Companies Act 2013",
            year: "2013",
            category: "Corporate & Commercial",
            catKey: "corporate",
            purpose: "Regulates company formation, responsibilities of directors, corporate governance, auditing standards, CSR mandates, and company dissolution.",
            coverage: "Incorporation, One Person Company (OPC), Director duties, NCLT / NCLAT, Independent Directors, and CSR mandates (Sec 135).",
            whyItMatters: "The primary legislation governing corporate entities, startups, private limited companies, and public limited firms in India.",
            importantConcepts: [
                "Mandatory 2% Corporate Social Responsibility (CSR) spend for qualifying firms.",
                "National Company Law Tribunal (NCLT) for corporate dispute resolution.",
                "Strict penalties for corporate fraud under Section 447."
            ],
            practicalRelevance: "Essential for business founders, corporate directors, auditors, and investors in India.",
            officialRef: "Ministry of Corporate Affairs (MCA)",
            relatedTerms: ["nclt", "opc", "csr"],
            relatedGuides: ["company-incorporation-guide"],
            studyNotes: "Contains 470 Sections in 29 Chapters and 7 Schedules."
        },
        {
            slug: "transfer-property",
            title: "Transfer of Property Act, 1882",
            shortName: "TPA 1882",
            year: "1882",
            category: "Property Law",
            catKey: "property",
            purpose: "Governs inter-vivos (between living persons) transfers of immovable property including sales, mortgages, leases, exchanges, and gifts.",
            coverage: "Sale deeds, mortgage types, lease agreements, gift deeds, actionable claims, and doctrine of lis pendens.",
            whyItMatters: "Establishes fundamental property transfer rules, lease determination, tenant rights, and mortgage foreclosure procedures.",
            importantConcepts: [
                "Section 54: Sale definition & mandatory registered instrument for values > ₹100.",
                "Section 105 & 106: Lease agreements & notice periods for termination.",
                "Section 52: Doctrine of Lis Pendens prohibiting property transfer during active court litigation."
            ],
            practicalRelevance: "Crucial for property buyers, sellers, landlords, tenants, and mortgage borrowers.",
            officialRef: "Department of Land Resources",
            relatedTerms: ["sale-deed", "lease-agreement", "lis-pendens"],
            relatedGuides: ["property-purchase-guide"],
            studyNotes: "Does not apply to testamentary transfers (wills), which are governed by Indian Succession Act."
        },
        {
            slug: "contract-act",
            title: "Indian Contract Act, 1872",
            shortName: "Contract Act 1872",
            year: "1872",
            category: "Civil & Commercial",
            catKey: "civil",
            purpose: "Defines the formation, execution, and enforceability of contracts, agreements, breach remedies, indemnity, guarantee, bailment, and agency.",
            coverage: "Offer, acceptance, consideration, free consent, void contracts, breach of contract damages (Sec 73-74), and indemnity.",
            whyItMatters: "The foundational law behind every commercial agreement, business contract, employment agreement, and service deal in India.",
            importantConcepts: [
                "Essential elements of valid contract (Sec 10): Capacity, Free Consent, Lawful Object.",
                "Void Ab Initio agreements: Agreements with minors or illegal objects are void from inception.",
                "Section 73: Compensation for loss or damage caused by breach of contract."
            ],
            practicalRelevance: "Governs business contracts, freelance agreements, employment contracts, and breach compensation claims.",
            officialRef: "Law Commission of India Reports",
            relatedTerms: ["contract-breach", "consideration", "void-contract"],
            relatedGuides: ["contract-drafting-guide"],
            studyNotes: "General principles contained in Sections 1-75; Special contracts in Sections 124-238."
        },
        {
            slug: "negotiable-instruments",
            title: "Negotiable Instruments Act, 1881",
            shortName: "NI Act 1881",
            year: "1881",
            category: "Corporate & Financial",
            catKey: "corporate",
            purpose: "Governs promissory notes, bills of exchange, cheques, and establishes criminal liability for cheque bounce due to insufficient funds.",
            coverage: "Cheque bounce complaints (Section 138), statutory demand notice, interim compensation (Sec 143A), and summary trials.",
            whyItMatters: "Section 138 provides criminal remedy for dishonoured cheques, punishing defaulters with up to 2 years imprisonment or double fine amount.",
            importantConcepts: [
                "Section 138: Dishonour of cheque for insufficiency of funds in bank account.",
                "Mandatory 15-day statutory demand notice before filing court complaint.",
                "Section 143A: Power of Court to order interim compensation up to 20% of cheque amount."
            ],
            practicalRelevance: "Used extensively by businesses, lenders, and individuals for recovering dishonoured cheque payments.",
            officialRef: "Reserve Bank of India (Banking Ombudsman)",
            relatedTerms: ["cheque-bounce", "section-138"],
            relatedGuides: ["cheque-bounce-legal-notice"],
            studyNotes: "Complaint must be filed within 1 month after expiry of 15-day notice period."
        },
        {
            slug: "arbitration",
            title: "Arbitration and Conciliation Act, 1996",
            shortName: "Arbitration Act 1996",
            year: "1996 (Amended 2015, 2019, 2021)",
            category: "Civil & Commercial ADR",
            catKey: "civil",
            purpose: "Consolidates laws relating to domestic arbitration, international commercial arbitration, enforcement of foreign arbitral awards, and conciliation.",
            coverage: "Arbitration agreements, tribunal appointments, interim court measures (Sec 9 & 17), arbitral awards, and Section 34 challenges.",
            whyItMatters: "Enables businesses and contracting parties to resolve commercial disputes privately through speedier arbitration rather than lengthy court litigation.",
            importantConcepts: [
                "Section 9: Interim measures by Court before or during arbitral proceedings.",
                "Mandatory 12-month timeline for completing domestic arbitration proceedings.",
                "Section 34: Minimal judicial interference in challenging arbitral awards."
            ],
            practicalRelevance: "The preferred dispute resolution mechanism in commercial contracts, infrastructure projects, and corporate deals.",
            officialRef: "Arbitration Council of India (ACI)",
            relatedTerms: ["arbitral-award", "adr"],
            relatedGuides: ["arbitration-clause-guide"],
            studyNotes: "Based on UNCITRAL Model Law on International Commercial Arbitration."
        },
        {
            slug: "legal-services",
            title: "Legal Services Authorities Act, 1987",
            shortName: "LSAA 1987",
            year: "1987",
            category: "Human Rights & Legal Aid",
            catKey: "human-rights",
            purpose: "Fulfills Constitutional mandate under Article 39A by establishing NALSA, SALSA, DLSA, and Lok Adalats to guarantee free legal services to eligible citizens.",
            coverage: "Free legal representation, advocate assignments, court fee waivers, Lok Adalats, and Permanent Lok Adalats.",
            whyItMatters: "Guarantees free legal representation and court assistance to women, children, SC/ST members, undertrials, and low-income citizens.",
            importantConcepts: [
                "Section 12: Categorical eligibility criteria for free legal aid.",
                "Lok Adalats: Pre-litigation and pending dispute resolution with non-appealable final awards.",
                "Permanent Lok Adalats for public utility service disputes (electricity, water, telecom)."
            ],
            practicalRelevance: "Empowers underprivileged citizens to access free lawyers and resolve disputes amicably through Lok Adalats.",
            officialRef: "National Legal Services Authority (NALSA Toll-Free 15100)",
            relatedTerms: ["nalsa", "lok-adalat", "free-legal-aid"],
            relatedGuides: ["how-to-apply-for-free-legal-aid"],
            studyNotes: "Lok Adalat awards carry the statutory force of a Civil Court decree."
        },
        {
            slug: "environment-protection",
            title: "Environment (Protection) Act, 1986",
            shortName: "EPA 1986",
            year: "1986",
            category: "Environmental Law",
            catKey: "environmental",
            purpose: "Umbrella legislation protecting and improving environmental quality, regulating industrial emissions, hazardous waste management, and NGT jurisdiction.",
            coverage: "Environmental Impact Assessment (EIA), hazardous substance handling, pollution control orders, and NGT enforcement.",
            whyItMatters: "Enacted in the aftermath of the 1984 Bhopal Gas Tragedy to empower the Central Government to take all measures necessary to prevent environmental pollution.",
            importantConcepts: [
                "Environmental Impact Assessment (EIA) notification for infrastructure projects.",
                "Precautionary Principle & Polluter Pays Principle enforced by Indian Courts.",
                "National Green Tribunal (NGT) specialized forum for environmental litigation."
            ],
            practicalRelevance: "Underpins environmental clearances, industrial waste compliance, and citizen PILs against pollution.",
            officialRef: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
            relatedTerms: ["ngt", "eia", "polluter-pays"],
            relatedGuides: ["environmental-complaint-guide"],
            studyNotes: "Violations punishable under Section 15 with imprisonment up to 5 years or fine up to ₹1 Lakh."
        },
        {
            slug: "disaster-management",
            title: "Disaster Management Act, 2005",
            shortName: "DMA 2005",
            year: "2005",
            category: "Public Safety & Emergency",
            catKey: "constitutional",
            purpose: "Provides for the effective management of natural & man-made disasters, establishing NDMA, SDMA, and emergency executive power execution.",
            coverage: "National Disaster Management Authority (NDMA), National Disaster Response Force (NDRF), emergency directives, and relief funds.",
            whyItMatters: "Extensively invoked during national emergencies, cyclones, floods, and the COVID-19 pandemic to issue binding lockdown and safety orders.",
            importantConcepts: [
                "NDMA headed by the Prime Minister of India; SDMAs headed by Chief Ministers.",
                "Section 51-60: Penalties for obstructing disaster response officers or spreading false alarm.",
                "National Disaster Response Force (NDRF) specialized relief force."
            ],
            practicalRelevance: "Establishes emergency executive authority and disaster relief entitlements during national crises.",
            officialRef: "National Disaster Management Authority (NDMA)",
            relatedTerms: ["ndma", "ndrf"],
            relatedGuides: ["disaster-relief-rights"],
            studyNotes: "Binding across all Ministries, State Governments, and local municipal authorities."
        },
        {
            slug: "rera",
            title: "Real Estate (Regulation and Development) Act, 2016",
            shortName: "RERA 2016",
            year: "2016",
            category: "Property & Consumer",
            catKey: "property",
            purpose: "Protects home buyers, ensures transparency in real estate transactions, regulates property builders, and establishes State Real Estate Regulatory Authorities.",
            coverage: "Mandatory project registration, escrow account rules (70% funds deposit), builder delay penalties, and RERA Tribunals.",
            whyItMatters: "Prohibits real estate developers from diverting homebuyer money to other projects, penalizing delayed possession with interest payouts.",
            importantConcepts: [
                "Mandatory 70% project funds deposit in designated escrow bank accounts.",
                "Carpet Area standardization for property pricing instead of super-built-up area.",
                "Statutory interest penalty on builders for delayed possession handover."
            ],
            practicalRelevance: "Essential legal safeguard for flat buyers facing builder delay, structural defects, or unauthorized plan changes.",
            officialRef: "State RERA Authorities (e.g., MahaRERA, UP RERA)",
            relatedTerms: ["rera-complaint", "carpet-area", "escrow"],
            relatedGuides: ["rera-homebuyer-complaint-guide"],
            studyNotes: "Registration mandatory for all commercial and residential projects where land area exceeds 500 sq meters."
        },
        {
            slug: "code-on-wages",
            title: "Code on Wages, 2019",
            shortName: "Wage Code 2019",
            year: "2019",
            category: "Labour & Employment",
            catKey: "labour",
            purpose: "Consolidates and simplifies 4 legacy labour statutes (Equal Remuneration, Minimum Wages, Payment of Wages, Payment of Bonus) into a uniform code.",
            coverage: "Universal floor wage, minimum wage calculations, timely wage payment, bonus entitlements, and gender wage equality.",
            whyItMatters: "Extends statutory minimum wage protections to all workers across organized and unorganized sectors throughout India.",
            importantConcepts: [
                "Universal Floor Wage fixed by Central Government binding across all states.",
                "Prohibition of gender discrimination in wage payment and recruitment.",
                "Mandatory wage payout within 2 working days of employee resignation or removal."
            ],
            practicalRelevance: "Protects employee salary rights, overtime payouts, minimum wage compliance, and bonus claims.",
            officialRef: "Ministry of Labour and Employment",
            relatedTerms: ["minimum-wage", "floor-wage"],
            relatedGuides: ["workplace-salary-rights-guide"],
            studyNotes: "Replaced Minimum Wages Act 1948 and Payment of Wages Act 1936."
        },
        {
            slug: "hindu-marriage",
            title: "Hindu Marriage Act, 1955",
            shortName: "HMA 1955",
            year: "1955",
            category: "Family Law",
            catKey: "family",
            purpose: "Governs marriage, solemnization, judicial separation, nullity, restitution of conjugal rights, and divorce for Hindus, Buddhists, Jains, and Sikhs.",
            coverage: "Conditions for valid marriage, bigamy ban, restitution of conjugal rights (Sec 9), divorce grounds (Sec 13), and mutual consent divorce (Sec 13B).",
            whyItMatters: "Establishes legal codification of marital rights, monogamy mandates, maintenance, and child custody rules for applicable communities.",
            importantConcepts: [
                "Monogamy mandate: Second marriage during subsistence of first marriage is void & bigamous.",
                "Section 13B: Mutual Consent Divorce requiring 6-month cooling-off period (waivable by Court).",
                "Permanent Alimony & Maintenance under Section 25."
            ],
            practicalRelevance: "Governs legal marriage validity, divorce petitions, alimony, and custody disputes.",
            officialRef: "Family Courts Act 1984 Framework",
            relatedTerms: ["mutual-consent-divorce", "alimony"],
            relatedGuides: ["divorce-procedure-guide"],
            studyNotes: "Applies to any person who is Hindu, Buddhist, Jain, or Sikh by religion."
        },
        {
            slug: "special-marriage",
            title: "Special Marriage Act, 1954",
            shortName: "SMA 1954",
            year: "1954",
            category: "Family & Civil Law",
            catKey: "family",
            purpose: "Provides a civil form of marriage for any two individuals in India regardless of religion, faith, or caste without religious conversion.",
            coverage: "Civil marriage registration, 30-day public notice, Marriage Officers, divorce grounds, and succession rules.",
            whyItMatters: "Enables inter-faith, inter-caste, and secular civil marriages without requiring either party to convert to another religion.",
            importantConcepts: [
                "Solemnization before Marriage Registrar without religious rites.",
                "Mandatory 30-day public notice period for inviting objections.",
                "Succession to property governed by Indian Succession Act 1925."
            ],
            practicalRelevance: "The statutory framework for inter-religious marriages and civil registration in India.",
            officialRef: "Special Marriage Registrar Offices",
            relatedTerms: ["civil-marriage", "marriage-registrar"],
            relatedGuides: ["court-marriage-guide"],
            studyNotes: "Parties must be 21+ years (male) and 18+ years (female)."
        },
        {
            slug: "rte",
            title: "Right of Children to Free and Compulsory Education (RTE) Act, 2009",
            shortName: "RTE Act 2009",
            year: "2009",
            category: "Human Rights & Education",
            catKey: "human-rights",
            purpose: "Fulfills Article 21A by guaranteeing free and compulsory elementary education for all children between 6 and 14 years in India.",
            coverage: "25% private school EWS quota, pupil-teacher ratios, prohibition of screening tests/capitation fees, and corporal punishment ban.",
            whyItMatters: "Mandates that non-minority private schools reserve 25% of entry-level seats for children from Economically Weaker Sections (EWS).",
            importantConcepts: [
                "Article 21A Fundamental Right implementation.",
                "25% mandatory EWS seat reservation in private unaided schools.",
                "Prohibition of capitation fee, screening interviews for child/parents, and physical punishment."
            ],
            practicalRelevance: "Empowers low-income parents to claim free private school admissions and quality elementary education.",
            officialRef: "Ministry of Education (Samagra Shiksha)",
            relatedTerms: ["article-21a", "ews-quota"],
            relatedGuides: ["rte-admission-guide"],
            studyNotes: "No child can be held back or expelled until completion of elementary education (Class VIII)."
        }
    ];

    // Pre-render 25 law cards
    const initialLawsCardsHtml = expandedLawsList.map(item => `
        <div class="law-card" data-category="${item.catKey}" data-title="${item.title.toLowerCase()}" data-aos="fade-up">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
                    <span class="badge-cat"><i class="fas fa-scale-unbalanced-flip"></i> ${item.category}</span>
                    <span style="font-size:12px; font-weight:800; color:#718096;"><i class="fas fa-calendar-days"></i> ${item.year}</span>
                </div>
                <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:10px; line-height:1.35;">${item.title}</h3>
                <p style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:16px;">${item.purpose}</p>
                <div style="background:#f8fafc; border-left:3px solid var(--primary); padding:10px 14px; border-radius:10px; margin-bottom:18px;">
                    <strong style="font-size:12px; color:var(--primary-dark); text-transform:uppercase; tracking:1px;">Covers:</strong>
                    <p style="font-size:12.5px; color:#555; margin:2px 0 0; line-height:1.5;">${item.coverage}</p>
                </div>
            </div>
            <div>
                <div style="border-top:1px solid #edf2f7; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
                    <button onclick="openLawModal('${item.slug}')" class="btn-outline" style="padding:8px 18px; font-size:13px; border-radius:30px;"><i class="fas fa-book-open"></i> Explore Law &rarr;</button>
                    <a href="laws/${item.slug}.html" style="font-size:12.5px; font-weight:800; color:var(--primary); text-decoration:none;">Full Act &rarr;</a>
                </div>
            </div>
        </div>
    `).join('');

    // Laws JSON-LD Schema
    const lawsPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Indian Laws Library",
        "url": "https://nyayi.in/laws.html",
        "description": "Comprehensive Indian Laws Library by NYAYI. Explore major Indian statutes, Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, Bharatiya Sakshya Adhiniyam, IT Act, Consumer Protection Act, and Constitutional frameworks.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nyayi.in/" },
                { "@type": "ListItem", "position": 2, "name": "Indian Laws Library", "item": "https://nyayi.in/laws.html" }
            ]
        }
    };

    const lawsHub = `
    ${renderHead('Indian Laws Library - Major Indian Acts & Codes Explained | NYAYI', 'Comprehensive Indian Laws Library. Search, explore, and study major Indian statutes, Bharatiya Nyaya Sanhita (BNS 2023), BNSS 2023, BSA 2023, IT Act, Consumer Protection Act, and Constitutional frameworks in plain language.', 'Indian Laws Library, Indian legal acts, BNS 2023, BNSS 2023, BSA 2023, Indian Constitution, IT Act 2000, Consumer Protection Act 2019, Indian criminal law, law study notes', '/laws.html', 0)}
    ${renderHeader('laws', 0)}

    <script type="application/ld+json">
    ${JSON.stringify(lawsPageSchema, null, 2)}
    </script>

    <!-- 01 — HERO SECTION -->
    <section class="page-header" id="hero" style="padding-bottom: 50px;">
        <div class="container" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:14px; background:rgba(0,200,83,0.15); color:var(--primary-dark); font-weight:800;">
                <i class="fas fa-book-scale" style="color:var(--primary);"></i> INDIAN LEGAL KNOWLEDGE BASE
            </span>
            <h1 style="font-size:3.5rem; font-weight:900; line-height:1.15; letter-spacing:-1.5px;">
                Explore Indian Laws. <br><span>Understand the Law.</span>
            </h1>
            <p style="max-width:860px; margin:16px auto 30px; font-size:1.2rem; color:#4a5568; line-height:1.8;">
                Explore major Indian laws, constitutional frameworks, and modern legal codes through structured explanations designed for citizens, students, and legal learners.
            </p>
            <div class="hero-btns" style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
                <a href="#search" class="btn-ai" style="padding:16px 36px; font-size:16px;">
                    <i class="fas fa-book-bookmark"></i> Explore the Library
                </a>
                <a href="#category-filter" class="btn-outline" style="padding:16px 36px; font-size:16px;">
                    <i class="fas fa-magnifying-glass"></i> Search a Law
                </a>
            </div>
        </div>
    </section>

    <!-- 02 — LIBRARY SEARCH SECTION -->
    <section style="padding:50px 0 30px; background:#ffffff;" id="search">
        <div class="container">
            <div class="section-header" data-aos="fade-up" style="margin-bottom:24px;">
                <h2>Search <span>Indian Laws</span></h2>
                <p>Filter through major statutes, section references, topics, or keywords instantly.</p>
            </div>

            <!-- SEARCH BOX -->
            <div class="law-search-wrapper" data-aos="fade-up">
                <i class="fas fa-search law-search-icon"></i>
                <input type="text" id="lawSearchInput" class="law-search-input" oninput="handleLawSearch()" placeholder="Search by law name, section, topic or keyword (e.g. BNS, Consumer, Cyber, Motor Vehicles, RTI)...">
                <button id="lawClearBtn" class="law-clear-btn" onclick="clearLawSearch()"><i class="fas fa-times"></i></button>
            </div>

            <!-- POPULAR SEARCH CHIPS -->
            <div style="margin-top:20px; text-align:center; font-size:14px; color:#666;" data-aos="fade-up">
                <strong style="color:var(--dark);">Popular searches:</strong> 
                <div style="display:inline-flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-left:8px; margin-top:8px;">
                    <button class="az-pill" onclick="quickLawSearch('BNS 2023')">BNS 2023</button>
                    <button class="az-pill" onclick="quickLawSearch('BNSS 2023')">BNSS 2023</button>
                    <button class="az-pill" onclick="quickLawSearch('BSA 2023')">BSA 2023</button>
                    <button class="az-pill" onclick="quickLawSearch('Constitution')">Constitution</button>
                    <button class="az-pill" onclick="quickLawSearch('Consumer Protection')">Consumer Protection</button>
                    <button class="az-pill" onclick="quickLawSearch('IT Act')">IT Act</button>
                    <button class="az-pill" onclick="quickLawSearch('Motor Vehicles')">Motor Vehicles Act</button>
                    <button class="az-pill" onclick="quickLawSearch('RTI')">RTI Act</button>
                </div>
            </div>
        </div>
    </section>

    <!-- 03 — LAW CATEGORY FILTER -->
    <section style="padding:40px 0 60px; background:var(--bg-light);" id="category-filter">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Browse by <span>Legal Category</span></h2>
                <p>Filter Indian laws by statutory domain and court specialization.</p>
            </div>

            <div class="filter-tags" style="justify-content:center;" data-aos="fade-up">
                <button class="filter-btn active" onclick="filterLawCat('all', this)">All Categories (${expandedLawsList.length})</button>
                <button class="filter-btn" onclick="filterLawCat('constitutional', this)">Constitutional Law</button>
                <button class="filter-btn" onclick="filterLawCat('criminal', this)">Criminal Law (Substantive)</button>
                <button class="filter-btn" onclick="filterLawCat('procedural', this)">Criminal Procedure</button>
                <button class="filter-btn" onclick="filterLawCat('evidence', this)">Law of Evidence</button>
                <button class="filter-btn" onclick="filterLawCat('civil', this)">Civil & Commercial</button>
                <button class="filter-btn" onclick="filterLawCat('consumer', this)">Consumer Protection</button>
                <button class="filter-btn" onclick="filterLawCat('family', this)">Family & Child Law</button>
                <button class="filter-btn" onclick="filterLawCat('property', this)">Property Law</button>
                <button class="filter-btn" onclick="filterLawCat('labour', this)">Labour & Employment</button>
                <button class="filter-btn" onclick="filterLawCat('corporate', this)">Corporate & Financial</button>
                <button class="filter-btn" onclick="filterLawCat('cyber', this)">Cyber & Technology</button>
                <button class="filter-btn" onclick="filterLawCat('motor', this)">Motor Vehicles</button>
                <button class="filter-btn" onclick="filterLawCat('human-rights', this)">Human Rights & Legal Aid</button>
                <button class="filter-btn" onclick="filterLawCat('environmental', this)">Environmental Law</button>
            </div>
        </div>
    </section>

    <!-- 04 & 05 — FEATURED / SELECTED MAJOR LAWS GRID -->
    <section style="padding:70px 0; background:#ffffff;" id="featured-laws">
        <div class="container">
            <div class="dict-stats-bar" data-aos="fade-up" style="margin-bottom:30px;">
                <div class="dict-count-badge">
                    <i class="fas fa-book-scale" style="color:var(--primary);"></i>
                    Showing <span id="lawCurrentCount" class="dict-count-num">${expandedLawsList.length}</span> Selected Major Laws
                </div>
                <div id="lawStatusText" style="font-size:13.5px; color:#666; font-weight:600;">
                    Structured Indian Acts & Modern Criminal Law Codes
                </div>
            </div>

            <!-- LAWS GRID -->
            <div class="laws-grid" id="lawsGrid">
                ${initialLawsCardsHtml}
            </div>

            <!-- EMPTY SEARCH STATE -->
            <div id="lawEmptyState" class="dict-empty-state" style="display:none;">
                <div class="dict-empty-icon"><i class="fas fa-search-minus"></i></div>
                <h3 style="font-size:20px; font-weight:800; margin-bottom:8px;">No Indian laws match your search</h3>
                <p style="font-size:14.5px; color:#666; max-width:500px; margin:0 auto 20px;">We couldn't find any law matching your keywords. Try clearing search filters or browse categories.</p>
                <button onclick="clearLawSearch()" class="btn-outline" style="padding:10px 24px; font-size:14px;"><i class="fas fa-rotate-left"></i> Reset Search</button>
            </div>
        </div>
    </section>

    <!-- 06 — CONSTITUTIONAL FRAMEWORK SECTION -->
    <section style="padding:90px 0; background:radial-gradient(circle at 50% 0%, #f0fdf4 0%, #ffffff 75%); border-top:1px solid #e2e8f0;" id="constitution-framework">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <span class="cp-role" style="display:inline-block; margin-bottom:10px; background:rgba(0,200,83,0.1); color:var(--primary-dark);">SUPREME LEGAL FOUNDATION</span>
                <h2>The Constitutional <span>Framework</span></h2>
                <p style="max-width:800px; margin:0 auto;">The supreme law of India establishing state governance, fundamental rights, directive principles, and citizen duties.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-bottom:40px;" data-aos="fade-up">
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; box-shadow:0 6px 20px rgba(0,0,0,0.02);">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-scroll"></i></div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;">Preamble</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Declares India a Sovereign, Socialist, Secular, Democratic Republic securing Justice, Liberty, Equality & Fraternity.</p>
                </div>

                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; box-shadow:0 6px 20px rgba(0,0,0,0.02);">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-shield-halved"></i></div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;">Part III • Fundamental Rights</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Articles 12 to 35 guaranteeing equality, freedoms, personal liberty, protection against arrest, and writ remedies.</p>
                </div>

                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; box-shadow:0 6px 20px rgba(0,0,0,0.02);">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-landmark"></i></div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;">Part IV • Directive Principles</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Articles 36 to 51 guiding state policy on public welfare, equal justice, free legal aid (Art 39A), and village panchayats.</p>
                </div>

                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:24px; box-shadow:0 6px 20px rgba(0,0,0,0.02);">
                    <div style="width:42px; height:42px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:14px;"><i class="fas fa-gavel"></i></div>
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:8px;">Articles 32 & 226 • Writs</h3>
                    <p style="font-size:13.5px; color:#555; margin:0; line-height:1.6;">Empowers Supreme Court (Art 32) and High Courts (Art 226) to issue Habeas Corpus, Mandamus & Certiorari Writs.</p>
                </div>
            </div>

            <!-- INTERACTIVE CONSTITUTIONAL ARTICLE STRIP -->
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                <h3 style="font-size:1.3rem; font-weight:800; color:var(--dark); margin-bottom:18px; text-align:center;">Key Constitutional Articles at a Glance</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; text-align:center;">
                    <div style="background:#f8fafc; padding:16px; border-radius:14px; border:1px solid #edf2f7;">
                        <strong style="color:var(--primary-dark); font-size:15px; display:block;">ARTICLE 14</strong>
                        <span style="font-size:13px; color:#555; display:block; margin-top:4px;">Equality Before Law</span>
                    </div>
                    <div style="background:#f8fafc; padding:16px; border-radius:14px; border:1px solid #edf2f7;">
                        <strong style="color:var(--primary-dark); font-size:15px; display:block;">ARTICLE 19</strong>
                        <span style="font-size:13px; color:#555; display:block; margin-top:4px;">6 Fundamental Freedoms</span>
                    </div>
                    <div style="background:#f8fafc; padding:16px; border-radius:14px; border:1px solid #edf2f7;">
                        <strong style="color:var(--primary-dark); font-size:15px; display:block;">ARTICLE 21</strong>
                        <span style="font-size:13px; color:#555; display:block; margin-top:4px;">Life & Personal Liberty</span>
                    </div>
                    <div style="background:#f8fafc; padding:16px; border-radius:14px; border:1px solid #edf2f7;">
                        <strong style="color:var(--primary-dark); font-size:15px; display:block;">ARTICLE 22</strong>
                        <span style="font-size:13px; color:#555; display:block; margin-top:4px;">Arrest & Custody Safeguards</span>
                    </div>
                    <div style="background:#f8fafc; padding:16px; border-radius:14px; border:1px solid #edf2f7;">
                        <strong style="color:var(--primary-dark); font-size:15px; display:block;">ARTICLE 32</strong>
                        <span style="font-size:13px; color:#555; display:block; margin-top:4px;">Writ Remedies</span>
                    </div>
                </div>
                <div style="text-align:center; margin-top:24px;">
                    <a href="rights.html" class="btn-ai" style="padding:12px 28px; font-size:14px;">
                        <i class="fas fa-graduation-cap"></i> Study Constitutional Rights in Detail &rarr;
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- 07 — NEW CRIMINAL LAW FRAMEWORK (PREMIUM DARK SECTION) -->
    <section style="padding:90px 0; background:linear-gradient(135deg, #050505 0%, #151515 100%); color:white;" id="new-criminal-laws">
        <div class="container">
            <div class="section-header" data-aos="fade-up" style="color:white;">
                <span class="cp-role" style="background:rgba(0,200,83,0.15); color:var(--primary); display:inline-block; margin-bottom:12px;">HISTORIC LEGAL REFORM (ENFORCED JULY 1, 2024)</span>
                <h2 style="color:white;">India's New <span>Criminal Law Framework</span></h2>
                <p style="color:#aaa; max-width:800px; margin:0 auto;">Understanding the transition from colonial criminal statutes to modern Bharatiya codes.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-bottom:40px;" data-aos="fade-up">
                <div style="background:#181818; border:1px solid #333; border-radius:24px; padding:30px;">
                    <span style="font-size:12px; font-weight:800; color:#888; text-transform:uppercase; letter-spacing:1px;">SUBSTANTIVE CRIMINAL LAW</span>
                    <h3 style="font-size:1.8rem; font-weight:900; color:var(--primary); margin:8px 0 12px;">BNS (2023)</h3>
                    <p style="font-size:14px; color:#ccc; line-height:1.7; margin-bottom:16px;">Replaced the <strong>Indian Penal Code (IPC 1860)</strong>. Defines offences, criminal liability, community service punishments, and modern penalties.</p>
                    <span style="font-size:12px; background:rgba(0,200,83,0.1); color:var(--primary); padding:4px 10px; border-radius:20px; font-weight:700;">IPC &rarr; BNS 2023</span>
                </div>

                <div style="background:#181818; border:1px solid #333; border-radius:24px; padding:30px;">
                    <span style="font-size:12px; font-weight:800; color:#888; text-transform:uppercase; letter-spacing:1px;">PROCEDURAL CRIMINAL LAW</span>
                    <h3 style="font-size:1.8rem; font-weight:900; color:var(--primary); margin:8px 0 12px;">BNSS (2023)</h3>
                    <p style="font-size:14px; color:#ccc; line-height:1.7; margin-bottom:16px;">Replaced the <strong>Code of Criminal Procedure (CrPC 1973)</strong>. Governs police investigations, arrests, bail, Zero FIR, and trial timelines.</p>
                    <span style="font-size:12px; background:rgba(0,200,83,0.1); color:var(--primary); padding:4px 10px; border-radius:20px; font-weight:700;">CrPC &rarr; BNSS 2023</span>
                </div>

                <div style="background:#181818; border:1px solid #333; border-radius:24px; padding:30px;">
                    <span style="font-size:12px; font-weight:800; color:#888; text-transform:uppercase; letter-spacing:1px;">LAW OF EVIDENCE</span>
                    <h3 style="font-size:1.8rem; font-weight:900; color:var(--primary); margin:8px 0 12px;">BSA (2023)</h3>
                    <p style="font-size:14px; color:#ccc; line-height:1.7; margin-bottom:16px;">Replaced the <strong>Indian Evidence Act (1872)</strong>. Grants equal evidentiary standing to digital/electronic records and server logs.</p>
                    <span style="font-size:12px; background:rgba(0,200,83,0.1); color:var(--primary); padding:4px 10px; border-radius:20px; font-weight:700;">Evidence Act &rarr; BSA 2023</span>
                </div>
            </div>

            <!-- VISUAL FLOW RELATIONSHIP -->
            <div style="background:#181818; border:1px solid #333; border-radius:24px; padding:30px; text-align:center;" data-aos="fade-up">
                <h4 style="font-size:16px; font-weight:800; color:white; margin-bottom:20px;">HOW THE NEW CRIMINAL LAWS WORK TOGETHER</h4>
                <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap;">
                    <div style="background:#222; padding:14px 24px; border-radius:16px; border:1px solid #444;">
                        <strong style="color:var(--primary); font-size:14px;">1. CRIME OCCURS</strong>
                        <p style="font-size:12px; color:#aaa; margin:2px 0 0;">BNS defines offence & penalty</p>
                    </div>
                    <i class="fas fa-arrow-right" style="color:var(--primary);"></i>
                    <div style="background:#222; padding:14px 24px; border-radius:16px; border:1px solid #444;">
                        <strong style="color:var(--primary); font-size:14px;">2. POLICE INVESTIGATE</strong>
                        <p style="font-size:12px; color:#aaa; margin:2px 0 0;">BNSS defines FIR & arrest rules</p>
                    </div>
                    <i class="fas fa-arrow-right" style="color:var(--primary);"></i>
                    <div style="background:#222; padding:14px 24px; border-radius:16px; border:1px solid #444;">
                        <strong style="color:var(--primary); font-size:14px;">3. COURT TRIAL</strong>
                        <p style="font-size:12px; color:#aaa; margin:2px 0 0;">BSA governs evidence proof</p>
                    </div>
                </div>
                <div style="margin-top:20px; font-size:12.5px; color:#888;">
                    <em>Note: Crimes committed prior to July 1, 2024 remain governed by IPC 1860 under transitional provisions.</em>
                </div>
            </div>
        </div>
    </section>

    <!-- 10 — LAW COMPARISON SECTION -->
    <section style="padding:90px 0; background:var(--bg-light);" id="comparisons">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Compare <span>Legal Frameworks</span></h2>
                <p>Understand key differences between historical Indian codes and active modern statutes.</p>
            </div>

            <div class="law-compare-grid" data-aos="fade-up">
                <div class="law-compare-card">
                    <span class="badge-cat" style="margin-bottom:12px;">CRIMINAL CODE TRANSITION</span>
                    <h3 style="font-size:1.3rem; font-weight:800; color:var(--dark); margin-bottom:14px;">BNS (2023) vs IPC (1860)</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.7;">
                        <p style="margin-bottom:8px;"><strong>Old (IPC 1860):</strong> 511 Sections, colonial penal focus, Sedition (Sec 124A).</p>
                        <p style="margin-bottom:8px;"><strong>New (BNS 2023):</strong> 358 Sections, Community Service, Mob Lynching (Sec 103), Organized Crime (Sec 111).</p>
                        <strong style="color:var(--primary-dark);">Key Change:</strong> Modernized structure prioritizing victim justice and community service.
                    </div>
                </div>

                <div class="law-compare-card">
                    <span class="badge-cat" style="margin-bottom:12px;">PROCEDURAL REFORM</span>
                    <h3 style="font-size:1.3rem; font-weight:800; color:var(--dark); margin-bottom:14px;">BNSS (2023) vs CrPC (1973)</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.7;">
                        <p style="margin-bottom:8px;"><strong>Old (CrPC 1973):</strong> 484 Sections, paper filing, indefinite trial delays.</p>
                        <p style="margin-bottom:8px;"><strong>New (BNSS 2023):</strong> 531 Sections, Zero FIR statutory mandate, e-FIR, strict 90-day charge sheet limits.</p>
                        <strong style="color:var(--primary-dark);">Key Change:</strong> Digital search/seizure recording and mandatory forensic investigation.
                    </div>
                </div>

                <div class="law-compare-card">
                    <span class="badge-cat" style="margin-bottom:12px;">EVIDENCE ADMISSIBILITY</span>
                    <h3 style="font-size:1.3rem; font-weight:800; color:var(--dark); margin-bottom:14px;">BSA (2023) vs Evidence Act (1872)</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.7;">
                        <p style="margin-bottom:8px;"><strong>Old (Act 1872):</strong> 167 Sections, physical paper document bias.</p>
                        <p style="margin-bottom:8px;"><strong>New (BSA 2023):</strong> 170 Sections, Electronic & Digital logs given equal primary evidence standing.</p>
                        <strong style="color:var(--primary-dark);">Key Change:</strong> Cloud data, WhatsApp logs, and emails recognized as primary evidence.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 11 — LAW IN REAL LIFE ("WHERE DOES THIS LAW MATTER?") -->
    <section style="padding:90px 0; background:#ffffff;" id="real-life-laws">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Where Does <span>This Law Matter?</span></h2>
                <p>Real-life everyday scenarios illustrating how Indian statutes apply to common situations.</p>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;" data-aos="fade-up">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:26px;">
                    <span class="flow-step-badge">CRIMINAL OFFENCE</span>
                    <h3 style="font-size:17px; font-weight:800; color:var(--dark); margin:10px 0 8px;">Accused of a Crime or Filing FIR</h3>
                    <p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:12px;"><strong>Applicable Laws:</strong> Bharatiya Nyaya Sanhita (BNS 2023) for offences & Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) for FIR & bail.</p>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:26px;">
                    <span class="flow-step-badge">CYBER & UPI FRAUD</span>
                    <h3 style="font-size:17px; font-weight:800; color:var(--dark); margin:10px 0 8px;">Online Theft or Identity Fraud</h3>
                    <p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:12px;"><strong>Applicable Laws:</strong> IT Act 2000 (Sec 66C/66D), BNS 2023 (Sec 318 Cheating), and BSA 2023 for digital evidence.</p>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:26px;">
                    <span class="flow-step-badge">DEFECTIVE PRODUCT</span>
                    <h3 style="font-size:17px; font-weight:800; color:var(--dark); margin:10px 0 8px;">E-Commerce Refund / Service Dispute</h3>
                    <p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:12px;"><strong>Applicable Laws:</strong> Consumer Protection Act 2019 via e-Daakhil and Central Consumer Protection Authority (CCPA).</p>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:22px; padding:26px;">
                    <span class="flow-step-badge">TRAFFIC STOP</span>
                    <h3 style="font-size:17px; font-weight:800; color:var(--dark); margin:10px 0 8px;">Vehicle Checking & Traffic Fine</h3>
                    <p style="font-size:13.5px; color:#555; line-height:1.6; margin-bottom:12px;"><strong>Applicable Laws:</strong> Motor Vehicles Act 1988 (Amended 2019) & IT Act for DigiLocker digital DL/RC validity.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 12 — LEGAL JOURNEY ("FROM LAW TO ACTION") -->
    <section style="padding:90px 0; background:var(--bg-light);" id="legal-journey">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>From Law to <span>Action</span></h2>
                <p>A structured 7-step roadmap from statutory knowledge to seeking legal remedies.</p>
            </div>

            <div class="journey-flow-grid" data-aos="fade-up">
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 1</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">THE LAW</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Identify relevant Act or statute</p>
                </div>
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 2</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">UNDERSTAND</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Read plain-language summary</p>
                </div>
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 3</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">SITUATION</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Match real-life facts</p>
                </div>
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 4</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">PROVISIONS</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Check specific sections</p>
                </div>
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 5</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">PROCEDURE</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Follow procedural code</p>
                </div>
                <div class="journey-flow-step">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 6</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--dark); margin:6px 0 4px;">REMEDIES</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Approach court or forum</p>
                </div>
                <div class="journey-flow-step" style="background:#f0fdf4; border-color:var(--primary);">
                    <span style="font-size:11px; font-weight:900; color:var(--primary-dark);">STEP 7</span>
                    <h4 style="font-size:15px; font-weight:800; color:var(--primary-dark); margin:6px 0 4px;">LEGAL HELP</h4>
                    <p style="font-size:12px; color:#555; margin:0;">Consult advocate / NALSA</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 13 — POPULAR LEGAL TOPICS GRID -->
    <section style="padding:90px 0; background:#ffffff;" id="popular-topics">
        <div class="container">
            <div class="section-header" data-aos="fade-up">
                <h2>Popular <span>Legal Topics</span></h2>
                <p>Browse law guides, dictionary explainers, and rights portals by topic.</p>
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;" data-aos="fade-up">
                <a href="dictionary.html?q=FIR" class="topic-chip"><i class="fas fa-file-shield" style="color:var(--primary);"></i> FIR</a>
                <a href="rights.html#police-rights" class="topic-chip"><i class="fas fa-handcuffs" style="color:var(--primary);"></i> Arrest Rights</a>
                <a href="dictionary.html?q=Bail" class="topic-chip"><i class="fas fa-key" style="color:var(--primary);"></i> Bail</a>
                <a href="dictionary.html?q=Assault" class="topic-chip"><i class="fas fa-user-ninja" style="color:var(--primary);"></i> Assault</a>
                <a href="dictionary.html?q=Theft" class="topic-chip"><i class="fas fa-mask" style="color:var(--primary);"></i> Theft</a>
                <a href="dictionary.html?q=Cheating" class="topic-chip"><i class="fas fa-user-secret" style="color:var(--primary);"></i> Cheating</a>
                <a href="dictionary.html?q=Defamation" class="topic-chip"><i class="fas fa-comment-slash" style="color:var(--primary);"></i> Defamation</a>
                <a href="rights.html#cyber-rights" class="topic-chip"><i class="fas fa-headset" style="color:var(--primary);"></i> Cyber Fraud</a>
                <a href="rights.html#womens-rights" class="topic-chip"><i class="fas fa-person-dress" style="color:var(--primary);"></i> Domestic Violence</a>
                <a href="rights.html#consumer-rights" class="topic-chip"><i class="fas fa-bag-shopping" style="color:var(--primary);"></i> Consumer Complaints</a>
                <a href="rights.html#tenant-rights" class="topic-chip"><i class="fas fa-building" style="color:var(--primary);"></i> Tenant Disputes</a>
                <a href="rights.html#workplace-rights" class="topic-chip"><i class="fas fa-briefcase" style="color:var(--primary);"></i> Workplace POSH</a>
            </div>
        </div>
    </section>

    <!-- 14 & 15 — DICTIONARY & RIGHTS CONNECTION BRIDGES -->
    <section style="padding:80px 0; background:var(--bg-light);">
        <div class="container">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:30px;" data-aos="fade-up">
                
                <!-- DICTIONARY CONNECTION -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:35px; box-shadow:0 10px 30px rgba(0,0,0,0.02);">
                    <div style="width:48px; height:48px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:16px;">
                        <i class="fas fa-book-bookmark"></i>
                    </div>
                    <h3 style="font-size:1.6rem; font-weight:900; color:var(--dark); margin-bottom:10px;">Don't Understand a Legal Term?</h3>
                    <p style="font-size:14.5px; color:#555; line-height:1.7; margin-bottom:20px;">
                        The NYAYI Legal Dictionary provides plain-language definitions for over 1,200+ Indian legal terms including <em>Bail, Cognizable, Mens Rea, Habeas Corpus, Prima Facie, and Affidavit</em>.
                    </p>
                    <a href="dictionary.html" class="btn-ai" style="padding:12px 28px; font-size:14px;">
                        <i class="fas fa-book-bookmark"></i> Explore Legal Dictionary &rarr;
                    </a>
                </div>

                <!-- RIGHTS CONNECTION -->
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:35px; box-shadow:0 10px 30px rgba(0,0,0,0.02);">
                    <div style="width:48px; height:48px; background:rgba(0,200,83,0.1); color:var(--primary-dark); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:16px;">
                        <i class="fas fa-shield-halved"></i>
                    </div>
                    <h3 style="font-size:1.6rem; font-weight:900; color:var(--dark); margin-bottom:10px;">Know the Law. Know Your Rights.</h3>
                    <p style="font-size:14.5px; color:#555; line-height:1.7; margin-bottom:20px;">
                        Understanding statutes becomes practical when combined with awareness of your constitutional and procedural citizen rights during police stops, arrests, consumer disputes, and workplace incidents.
                    </p>
                    <a href="rights.html" class="btn-outline" style="padding:12px 28px; font-size:14px; border-color:var(--primary); color:var(--primary-dark) !important;">
                        <i class="fas fa-compass"></i> Explore Know Your Rights &rarr;
                    </a>
                </div>

            </div>
        </div>
    </section>

    <!-- 16 — FAQ SECTION -->
    <section style="padding:90px 0; background:#ffffff;" id="faq">
        <div class="container" style="max-width:880px;">
            <div class="section-header" data-aos="fade-up">
                <h2>Laws Library <span>FAQs</span></h2>
                <p>Common questions regarding Indian legal statutes, new criminal codes, and study usage.</p>
            </div>

            <div style="display:flex; flex-direction:column; gap:14px;">
                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What is the NYAYI Indian Laws Library?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The Indian Laws Library is a structured digital reference database by NYAYI explaining major Indian acts, modern criminal law codes (BNS, BNSS, BSA 2023), and constitutional frameworks in clear, plain language.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Are these laws applicable across all of India?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes. Central acts such as the Bharatiya Nyaya Sanhita (BNS 2023), BNSS, BSA, IT Act, and Consumer Protection Act apply across all States and Union Territories of India, subject to specific state-amended procedural rules.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What is the difference between BNS, BNSS, and BSA 2023?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>BNS (Bharatiya Nyaya Sanhita) defines crimes and punishments (substantive law); BNSS (Bharatiya Nagarik Suraksha Sanhita) defines police procedure, FIRs, bail, and trial steps (procedural law); BSA (Bharatiya Sakshya Adhiniyam) defines rules of court evidence and digital records admissibility.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What replaced the Indian Penal Code (IPC 1860)?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The Bharatiya Nyaya Sanhita (BNS 2023) replaced the IPC 1860 on July 1, 2024. All offences committed on or after July 1, 2024 are charged under BNS sections.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What replaced the Code of Criminal Procedure (CrPC 1973)?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) replaced the CrPC 1973 on July 1, 2024, introducing strict trial timelines, e-FIR, and Zero FIR provisions.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>What replaced the Indian Evidence Act (1872)?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>The Bharatiya Sakshya Adhiniyam (BSA 2023) replaced the Evidence Act 1872 on July 1, 2024, giving full legal standing to electronic/digital evidence and cloud server records.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Can I search laws by keyword or section on NYAYI?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes! Use the live Library Search bar at the top of the page or click any category chip to instantly filter through laws by name, topic, or keyword.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Can I use the Laws Library for legal academic study?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>Yes! The library includes interactive statutory cards, comparative framework charts, and key constitutional article breakdowns designed for law students and exam preparation.</p></div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)" data-aos="fade-up">
                    <div class="faq-header"><h3>Does NYAYI provide formal legal advice?</h3><i class="fas fa-chevron-down faq-icon"></i></div>
                    <div class="faq-body"><p>No. NYAYI provides educational and informational resources to promote legal literacy. It does not provide formal legal advice, representation, or substitute for a qualified advocate.</p></div>
                </div>
            </div>
        </div>
    </section>

    <!-- 17 — RESPONSIBLE LEGAL DISCLAIMER -->
    <section style="padding:40px 0; background:var(--bg-light); border-top:1px solid #e2e8f0;">
        <div class="container" style="max-width:960px;">
            <div style="background:#ffffff; border-left:4px solid var(--primary); padding:24px 30px; border-radius:16px; border:1px solid #e2e8f0;">
                <strong style="color:var(--dark); font-size:14.5px; display:block; margin-bottom:6px;">
                    <i class="fas fa-scale-balanced" style="color:var(--primary);"></i> Educational & Informational Disclaimer:
                </strong>
                <p style="font-size:13.5px; color:#555; line-height:1.7; margin:0;">
                    NYAYI provides educational and informational resources intended to help users understand Indian legal concepts. Laws, procedures and their application can depend on specific facts, jurisdiction, statutory amendments, and the applicable date. Information on this platform should not be treated as a substitute for legal advice from a qualified advocate.
                </p>
            </div>
        </div>
    </section>

    <!-- 27 — FINAL CTA BLOCK -->
    <section style="padding:90px 0 100px; background:linear-gradient(135deg, #000000 0%, #151515 100%); color:white;" id="final-cta">
        <div class="container">
            <div style="text-align:center; max-width:820px; margin:0 auto;" data-aos="zoom-in">
                <span class="cp-role" style="background:rgba(0,200,83,0.15); color:var(--primary); display:inline-block; margin-bottom:14px;">NYAYI LEGAL KNOWLEDGE ECOSYSTEM</span>
                <h2 style="font-size:2.8rem; font-weight:900; color:white; margin-bottom:16px; letter-spacing:-1px;">Understand the Law.<br><span>Navigate Life With Clarity.</span></h2>
                <p style="font-size:1.15rem; color:#aaa; margin:0 auto 30px; line-height:1.8;">Explore laws, constitutional principles, and practical legal knowledge — all in one place.</p>
                <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
                    <a href="rights.html" class="btn-outline" style="color:white; border-color:#444; padding:16px 32px; font-size:15px;"><i class="fas fa-shield-halved"></i> Explore Know Your Rights</a>
                    <a href="dictionary.html" class="btn-outline" style="color:white; border-color:#444; padding:16px 32px; font-size:15px;"><i class="fas fa-book-bookmark"></i> Open Legal Dictionary</a>
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai" style="padding:16px 36px; font-size:15px;"><i class="fas fa-robot"></i> Launch NYAYI Web AI</a>
                </div>
            </div>
        </div>
    </section>

    <!-- INTERACTIVE LAW EXPLORER MODAL -->
    <div id="lawModalOverlay" class="law-modal-overlay" onclick="if(event.target === this) closeLawModal()">
        <div class="law-modal-content">
            <div class="law-modal-close" onclick="closeLawModal()"><i class="fas fa-times"></i></div>
            <div id="lawModalBody">
                <!-- Dynamically populated via JS -->
            </div>
        </div>
    </div>

    <!-- CLIENT-SIDE LAWS SEARCH ENGINE & MODAL SCRIPT -->
    <script>
        window.NYAYI_LAWS = ${JSON.stringify(expandedLawsList)};
        let currentLawCat = 'all';

        function filterLawCat(catKey, btn) {
            document.querySelectorAll('#category-filter .filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            currentLawCat = catKey;
            renderFilteredLaws();
        }

        function quickLawSearch(query) {
            const input = document.getElementById('lawSearchInput');
            if (input) {
                input.value = query;
                handleLawSearch();
                const searchSec = document.getElementById('featured-laws');
                if (searchSec) {
                    const y = searchSec.getBoundingClientRect().top + window.pageYOffset - 110;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        }

        function handleLawSearch() {
            const input = document.getElementById('lawSearchInput');
            const clearBtn = document.getElementById('lawClearBtn');
            const val = input ? input.value.trim() : '';
            if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
            renderFilteredLaws();
        }

        function clearLawSearch() {
            const input = document.getElementById('lawSearchInput');
            if (input) input.value = '';
            const clearBtn = document.getElementById('lawClearBtn');
            if (clearBtn) clearBtn.style.display = 'none';
            currentLawCat = 'all';
            document.querySelectorAll('#category-filter .filter-btn').forEach(b => b.classList.remove('active'));
            const firstBtn = document.querySelector('#category-filter .filter-btn');
            if (firstBtn) firstBtn.classList.add('active');
            renderFilteredLaws();
        }

        function renderFilteredLaws() {
            const query = (document.getElementById('lawSearchInput')?.value || '').toLowerCase().trim();
            const grid = document.getElementById('lawsGrid');
            const emptyState = document.getElementById('lawEmptyState');
            const countSpan = document.getElementById('lawCurrentCount');
            const statusText = document.getElementById('lawStatusText');

            if (!grid) return;

            const filtered = window.NYAYI_LAWS.filter(item => {
                if (currentLawCat !== 'all' && item.catKey !== currentLawCat) return false;
                if (query) {
                    const haystack = (item.title + ' ' + item.shortName + ' ' + item.category + ' ' + item.purpose + ' ' + item.coverage + ' ' + item.whyItMatters).toLowerCase();
                    if (!haystack.includes(query)) return false;
                }
                return true;
            });

            if (countSpan) countSpan.textContent = filtered.length;
            if (statusText) {
                if (query) statusText.textContent = 'Search results for "' + query + '" (' + filtered.length + ' laws)';
                else if (currentLawCat !== 'all') statusText.textContent = 'Filtered by category (' + filtered.length + ' laws)';
                else statusText.textContent = 'Structured Indian Acts & Modern Criminal Law Codes';
            }

            if (filtered.length === 0) {
                grid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            grid.style.display = 'grid';
            if (emptyState) emptyState.style.display = 'none';

            grid.innerHTML = filtered.map(item => \`
                <div class="law-card">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
                            <span class="badge-cat"><i class="fas fa-scale-unbalanced-flip"></i> \${item.category}</span>
                            <span style="font-size:12px; font-weight:800; color:#718096;"><i class="fas fa-calendar-days"></i> \${item.year}</span>
                        </div>
                        <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:10px; line-height:1.35;">\${item.title}</h3>
                        <p style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:16px;">\${item.purpose}</p>
                        <div style="background:#f8fafc; border-left:3px solid var(--primary); padding:10px 14px; border-radius:10px; margin-bottom:18px;">
                            <strong style="font-size:12px; color:var(--primary-dark); text-transform:uppercase; tracking:1px;">Covers:</strong>
                            <p style="font-size:12.5px; color:#555; margin:2px 0 0; line-height:1.5;">\${item.coverage}</p>
                        </div>
                    </div>
                    <div>
                        <div style="border-top:1px solid #edf2f7; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
                            <button onclick="openLawModal('\${item.slug}')" class="btn-outline" style="padding:8px 18px; font-size:13px; border-radius:30px;"><i class="fas fa-book-open"></i> Explore Law &rarr;</button>
                            <a href="laws/\${item.slug}.html" style="font-size:12.5px; font-weight:800; color:var(--primary); text-decoration:none;">Full Act &rarr;</a>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // LAW EXPLORER MODAL OVERLAY
        function openLawModal(slug) {
            const item = window.NYAYI_LAWS.find(l => l.slug === slug);
            if (!item) return;
            const modalBody = document.getElementById('lawModalBody');
            const overlay = document.getElementById('lawModalOverlay');
            if (!modalBody || !overlay) return;

            let conceptsList = '';
            if (Array.isArray(item.importantConcepts)) {
                for (let i = 0; i < item.importantConcepts.length; i++) {
                    conceptsList += '<li>' + item.importantConcepts[i] + '</li>';
                }
            }

            modalBody.innerHTML = \`
                <div style="margin-bottom:20px;">
                    <span class="badge-cat" style="font-size:13px; padding:6px 14px;"><i class="fas fa-scale-unbalanced-flip"></i> \${item.category}</span>
                    <h2 style="font-size:2rem; font-weight:900; color:var(--dark); margin:12px 0 6px;">\${item.title}</h2>
                    <span style="font-size:13px; font-weight:700; color:#718096;"><i class="fas fa-calendar-days"></i> Enacted / Enforced: \${item.year}</span>
                </div>

                <div style="background:#f8fafc; border-left:4px solid var(--primary); padding:20px; border-radius:16px; margin-bottom:24px;">
                    <h3 style="font-size:16px; font-weight:800; color:var(--primary-dark); margin-bottom:6px;">Purpose & Core Objective</h3>
                    <p style="font-size:14.5px; color:#2d3748; margin:0; line-height:1.7;">\${item.purpose}</p>
                </div>

                <div style="margin-bottom:24px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;">What This Law Covers</h3>
                    <p style="font-size:14.5px; color:#4a5568; line-height:1.7;">\${item.coverage}</p>
                </div>

                <div style="margin-bottom:24px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:10px;">Why It Matters to Citizens</h3>
                    <p style="font-size:14.5px; color:#4a5568; line-height:1.7;">\${item.whyItMatters}</p>
                </div>

                <div style="margin-bottom:24px;">
                    <h3 style="font-size:18px; font-weight:800; color:var(--dark); margin-bottom:12px;">Key Statutory Concepts</h3>
                    <ul style="padding-left:20px; font-size:14px; color:#4a5568; line-height:1.8;">
                        \${conceptsList}
                    </ul>
                </div>

                <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:18px; border-radius:14px; margin-bottom:24px;">
                    <strong style="color:var(--primary-dark); font-size:14px;"><i class="fas fa-graduation-cap"></i> Educational Note:</strong>
                    <p style="font-size:13.5px; color:#2d3748; margin:4px 0 0;">\${item.studyNotes}</p>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #edf2f7; padding-top:20px; flex-wrap:wrap; gap:12px;">
                    <a href="laws/\${item.slug}.html" class="btn-ai" style="padding:12px 28px; font-size:14px;"><i class="fas fa-file-contract"></i> Read Detailed Act Analysis</a>
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-outline" style="padding:12px 24px; font-size:14px;"><i class="fas fa-robot"></i> Research with NYAYI AI</a>
                </div>
            \`;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLawModal() {
            const overlay = document.getElementById('lawModalOverlay');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLawModal();
        });

        // FAQ ACCORDION TOGGLE
        function toggleFaq(el) {
            const isExpanded = el.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const icon = item.querySelector('.faq-icon');
                if (icon) icon.style.transform = 'rotate(0deg)';
                const body = item.querySelector('.faq-body');
                if (body) body.style.maxHeight = null;
            });
            if (!isExpanded) {
                el.classList.add('active');
                const icon = el.querySelector('.faq-icon');
                if (icon) icon.style.transform = 'rotate(180deg)';
                const body = el.querySelector('.faq-body');
                if (body) body.style.maxHeight = body.scrollHeight + 'px';
            }
        }
    </script>

    ${renderFooter(0)}
    `;
    fs.writeFileSync(path.join(ROOT_DIR, 'laws.html'), lawsHub, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'laws/index.html'), lawsHub.replace(/laws\//g, '').replace(/\.\/css\//g, '../css/'), 'utf8');

    expandedLawsList.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} (${item.shortName}) | Act Analysis`, item.purpose, `${item.title}, ${item.shortName}, Indian law`, `/laws/${item.slug}.html`, 1)}
        ${renderHeader('laws', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../laws.html" style="font-weight:700; color:var(--primary-dark); font-size:14px;"><i class="fas fa-arrow-left"></i> Back to Laws Library</a>
                <span class="cp-role" style="margin-top:20px; display:inline-block;">Enacted / Enforced: ${item.year}</span>
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

                    <h2 style="font-size:24px; margin-bottom:12px; font-weight:800;">Practical Relevance & Scope</h2>
                    <p style="font-size:16px; color:#555; line-height:1.8; margin-bottom:30px;">${item.practicalRelevance}</p>

                    <div style="background:#f0fdf4; border-left:4px solid var(--primary); padding:20px; border-radius:14px; margin-bottom:30px;">
                        <strong style="color:var(--primary-dark); font-size:15px;"><i class="fas fa-graduation-cap"></i> Educational Study Note:</strong>
                        <p style="font-size:14px; color:#2d3748; margin:4px 0 0;">${item.studyNotes}</p>
                    </div>

                    <div style="border-top:1px solid #edf2f7; padding-top:20px; color:#718096; font-size:14px;">
                        <strong>Official Reference:</strong> ${item.officialRef}
                    </div>
                </div>

                <div style="margin-top:30px; text-align:center;">
                    <a href="https://ai.nyayi.in" target="_blank" class="btn-ai" style="padding:14px 32px; font-size:15px;">
                        <i class="fas fa-robot"></i> Research "${item.shortName}" with NYAYI AI
                    </a>
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `laws/${item.slug}.html`), pageHtml, 'utf8');
    });

        // Guides Hub - 27-Section Expanded Legal Guides & How-To Center
    const expandedGuides = [
        {
            slug: "how-to-file-an-fir",
            title: "How to File an FIR in India",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "6 MIN READ",
            summary: "Step-by-step procedure for lodging a First Information Report (FIR) under Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), including Zero FIR and e-FIR options.",
            learn: [
                "Immediate steps at police station",
                "Difference between FIR and written complaint",
                "What to do if station officer refuses registration"
            ]
        },
        {
            slug: "police-refused-fir-remedies",
            title: "What to Do If Police Refuse to Register an FIR",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "5 MIN READ",
            summary: "Legal remedies available under BNSS Section 173(4) and Section 175(3) when a police station officer refuses to record a cognizable crime FIR.",
            learn: [
                "Sending complaint to SP/DCP via Registered Post",
                "Filing a Section 175(3) BNSS application before Magistrate",
                "High Court writ petition for non-registration of FIR"
            ]
        },
        {
            slug: "zero-fir-guide",
            title: "Zero FIR: Filing an FIR Anywhere in India",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "4 MIN READ",
            summary: "How to lodge a Zero FIR at any police station regardless of jurisdiction, and how it is transferred to the jurisdictional police station.",
            learn: [
                "Legal mandate of Zero FIR across India",
                "When and where to demand a Zero FIR",
                "Transfer process to jurisdictional police station"
            ]
        },
        {
            slug: "efir-registration-guide",
            title: "e-FIR Registration Guide",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "4 MIN READ",
            summary: "Procedure for online FIR registration for stolen vehicles, lost documents, cyber crimes, and non-heinous offenses via state police portals.",
            learn: [
                "State police portal e-FIR requirements",
                "Types of offenses eligible for online e-FIR",
                "Verifying and tracking e-FIR status online"
            ]
        },
        {
            slug: "police-arrest-rights-guide",
            title: "Police Arrest Procedure & Rights of Arrested Persons",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "7 MIN READ",
            summary: "Constitutional and statutory rights under Article 22 and BNSS Section 35, including grounds of arrest, memo of arrest, medical examination, and bail rights.",
            learn: [
                "Mandatory arrest memo creation & family notification",
                "Right to consult advocate and medical examination",
                "24-hour magistrate production requirement"
            ]
        },
        {
            slug: "bail-procedure-guide",
            title: "Regular Bail vs Anticipatory Bail",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "8 MIN READ",
            summary: "Understanding bailable vs non-bailable offenses, filing anticipatory bail under BNSS Sec 482, regular bail under Sec 479/480, and interim bail conditions.",
            learn: [
                "Differences between bailable and non-bailable offenses",
                "Anticipatory bail application in Sessions/High Court",
                "Bail bond conditions, sureties, and cancellation rules"
            ]
        },
        {
            slug: "summons-vs-warrant-guide",
            title: "Summons vs Warrant: Understanding Court Notices",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "5 MIN READ",
            summary: "Explanation of court summons, bailable warrants, non-bailable warrants (NBW), and legal consequences of non-appearance in court.",
            learn: [
                "Distinction between summons and arrest warrants",
                "How to respond when receiving court summons",
                "Procedure for recalling or staying a Non-Bailable Warrant"
            ]
        },
        {
            slug: "online-police-complaint",
            title: "How to File a Police Complaint Online",
            category: "Police & Criminal Procedure",
            catKey: "police",
            readTime: "4 MIN READ",
            summary: "Step-by-step guide to submitting written police complaints via digital portals, email, and tracking official acknowledgement numbers.",
            learn: [
                "State citizen portal registration steps",
                "Attaching evidentiary documents & identity proof",
                "Converting complaint into registered FIR"
            ]
        },
        {
            slug: "cyber-fraud-reporting-1930",
            title: "Reporting Cyber Fraud on National Cybercrime Portal (1930)",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "5 MIN READ",
            summary: "Immediate action guide for financial cyber fraud: calling 1930 helpline within the golden hour and registering on cybercrime.gov.in to freeze stolen funds.",
            learn: [
                "Crucial 'Golden Hour' response for financial cyber fraud",
                "Lodging complaint on cybercrime.gov.in portal",
                "Obtaining acknowledgment for bank account unfreezing"
            ]
        },
        {
            slug: "bank-financial-fraud-recovery",
            title: "Reporting Financial Fraud & Bank Account Freezing",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "6 MIN READ",
            summary: "RBI guidelines on zero liability in unauthorized electronic transactions, notifying banks within 3 days, and unfreezing legitimate accounts.",
            learn: [
                "RBI customer liability guidelines (3-day zero liability)",
                "Filing complaint with Banking Ombudsman",
                "Procedure to unfreeze bank account frozen by police"
            ]
        },
        {
            slug: "digital-arrest-scam-guide",
            title: "Protecting Yourself Against Digital Arrest Scams",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "5 MIN READ",
            summary: "How fraudsters impersonate CBI/ED/Customs officers over video calls, legal reality that Indian law has no 'digital arrest', and how to report immediately.",
            learn: [
                "Recognizing fake video calls claiming police/CBI arrest",
                "Legal fact: No police agency conducts online digital arrests",
                "Steps to block, report, and preserve call screenshots"
            ]
        },
        {
            slug: "cyberstalking-harassment-remedies",
            title: "Social Media Harassment & Cyberstalking Legal Remedies",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "6 MIN READ",
            summary: "Legal provisions under IT Act Section 66E, 67, and BNS Sections for stalking, non-consensual image sharing, fake profiles, and online harassment.",
            learn: [
                "Preserving digital evidence (URL, IP logs, screenshots)",
                "Reporting content to social media platforms and Cyber Cell",
                "Filing criminal complaint under IT Act and BNS"
            ]
        },
        {
            slug: "online-shopping-ecommerce-scam",
            title: "How to File a Complaint Against Online Shopping Fraud",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "4 MIN READ",
            summary: "Remedies for counterfeit products, non-delivery of items, fake sellers, and filing complaints on National Consumer Helpline (NCH) 1915.",
            learn: [
                "Registering complaint on National Consumer Helpline (1915)",
                "Filing online grievance on e-Daakhil portal",
                "Chargeback request through bank or credit card issuer"
            ]
        },
        {
            slug: "sextortion-loan-app-blackmail",
            title: "Sextortion & Loan App Blackmail Immediate Action Guide",
            category: "Cyber & Digital",
            catKey: "cyber",
            readTime: "5 MIN READ",
            summary: "Emergency instructions for victims of illegal instant loan apps, video blackmail, unauthorized contacts harassment, and Cyber Crime Cell complaint.",
            learn: [
                "Immediate security steps: Revoke app permissions & block callers",
                "Informing family/friends before blackmailers reach out",
                "Filing urgent complaint with State Cyber Crime Cell"
            ]
        },
        {
            slug: "consumer-court-complaint-guide",
            title: "How to File a Consumer Complaint in NCDRC / District Commission",
            category: "Consumer & Markets",
            catKey: "consumer",
            readTime: "7 MIN READ",
            summary: "Filing consumer complaints online via e-Daakhil, jurisdiction thresholds (District up to 50 Lakhs, State up to 2 Crores), and claiming compensation for deficiency in service.",
            learn: [
                "Pecuniary jurisdiction limits under Consumer Protection Act 2019",
                "Drafting consumer petition without hiring a lawyer",
                "Submitting complaint on e-Daakhil portal"
            ]
        },
        {
            slug: "defective-product-refund-claim",
            title: "Claiming Refund for Defective Products under Consumer Protection Act 2019",
            category: "Consumer & Markets",
            catKey: "consumer",
            readTime: "5 MIN READ",
            summary: "Product liability, warranty enforcement, seller and manufacturer legal liability, and drafting pre-litigation legal notice.",
            learn: [
                "Product liability provisions under CPA 2019",
                "Sending 15-day formal legal notice to manufacturer",
                "Claiming replacement, full refund, plus compensation"
            ]
        },
        {
            slug: "rera-builder-delay-complaint",
            title: "Legal Remedies for Builder Delays & RERA Complaints",
            category: "Consumer & Markets",
            catKey: "consumer",
            readTime: "7 MIN READ",
            summary: "How home buyers can claim interest on delayed possession, file complaints before State RERA Authority, and seek refund or compensation.",
            learn: [
                "Filing complaint under Section 31 of RERA Act",
                "Claiming monthly interest for every month of delay",
                "Execution of RERA orders for property possession"
            ]
        },
        {
            slug: "medical-negligence-remedies",
            title: "Medical Negligence Legal Recourse",
            category: "Consumer & Markets",
            catKey: "consumer",
            readTime: "6 MIN READ",
            summary: "Legal remedies for medical malpractice: filing complaint with State Medical Council, Consumer Forum compensation, and criminal negligence under BNS.",
            learn: [
                "Collecting complete hospital medical records & bills",
                "Filing complaint with State Medical Council",
                "Approaching Consumer Court for medical compensation"
            ]
        },
        {
            slug: "airline-passenger-rights-guide",
            title: "Airline Flight Cancellation & Baggage Loss Compensation",
            category: "Consumer & Markets",
            catKey: "consumer",
            readTime: "4 MIN READ",
            summary: "DGCA Civil Aviation Requirements (CAR) guidelines on flight delays, cancellations, denied boarding, lost baggage compensation, and AirSewa portal complaints.",
            learn: [
                "DGCA mandatory compensation amounts for flight delays",
                "Lost/damaged baggage compensation rules",
                "Lodging complaint on Ministry of Civil Aviation AirSewa portal"
            ]
        },
        {
            slug: "tenant-rights-security-deposit",
            title: "Tenant Rights & Security Deposit Refund Guide",
            category: "Rent & Housing",
            catKey: "rent",
            readTime: "5 MIN READ",
            summary: "Model Tenancy Act provisions, allowable deposit deductions, 30-day refund timelines, and legal notice for landlord withholding security deposit.",
            learn: [
                "Security deposit limits under Model Tenancy Act",
                "Legitimate vs illegal landlord deductions",
                "Sending legal notice & approaching Rent Authority"
            ]
        },
        {
            slug: "tenant-eviction-legal-notice",
            title: "Eviction Notice Procedure for Landlords & Tenants",
            category: "Rent & Housing",
            catKey: "rent",
            readTime: "6 MIN READ",
            summary: "Grounds for lawful eviction under State Rent Control Acts, mandatory notice period, illegal lockouts, and Rent Tribunal proceedings.",
            learn: [
                "Valid legal grounds for landlord eviction notice",
                "Tenant remedies against forced or illegal eviction",
                "Filing petition before Rent Controller / Tribunal"
            ]
        },
        {
            slug: "illegal-construction-encroachment",
            title: "Illegal Construction & Encroachment Complaint",
            category: "Rent & Housing",
            catKey: "rent",
            readTime: "5 MIN READ",
            summary: "Reporting unauthorized building construction, encroachment on public land or neighbor property, and municipal authority complaint procedure.",
            learn: [
                "Submitting complaint to Municipal Corporation Town Planning Cell",
                "Filing RTI to check approved building plan",
                "Obtaining civil court injunction order against illegal construction"
            ]
        },
        {
            slug: "housing-society-dispute-resolution",
            title: "Society Maintenance Disputes & Cooperative Housing Rights",
            category: "Rent & Housing",
            catKey: "rent",
            readTime: "5 MIN READ",
            summary: "Cooperative Housing Society bye-laws, maintenance fee disputes, parking allocation rights, and filing complaint with Registrar of Housing Societies.",
            learn: [
                "Rights of flat owners under Model Bye-laws",
                "Challenging arbitrary maintenance charges",
                "Filing complaint before Deputy Registrar of Cooperative Societies"
            ]
        },
        {
            slug: "mutual-consent-divorce-guide",
            title: "Filing a Mutual Consent Divorce in India",
            category: "Family & Matrimonial",
            catKey: "family",
            readTime: "6 MIN READ",
            summary: "Procedure under Section 13B Hindu Marriage Act / Special Marriage Act: 6-month cooling period waiver, joint petition, terms of settlement, and final decree.",
            learn: [
                "Drafting joint divorce petition & Memorandum of Understanding (MOU)",
                "First motion and second motion court hearings",
                "Waiver of 6-month statutory waiting period precedents"
            ]
        },
        {
            slug: "child-custody-guardianship-guide",
            title: "Child Custody & Guardianship Laws in India",
            category: "Family & Matrimonial",
            catKey: "family",
            readTime: "7 MIN READ",
            summary: "Physical vs legal custody, visitation rights, welfare of the child principle under Guardians and Wards Act, and interim custody orders.",
            learn: [
                "Paramount principle: Welfare of the minor child",
                "Types of custody: Sole, Joint, and Visitation rights",
                "Filing custody petition in Family Court"
            ]
        },
        {
            slug: "maintenance-claim-bnss-144",
            title: "Claiming Maintenance under Section 144 BNSS",
            category: "Family & Matrimonial",
            catKey: "family",
            readTime: "6 MIN READ",
            summary: "Statutory rights of wives, children, and elderly parents to claim monthly maintenance under BNSS Sec 144 (formerly CrPC 125), interim maintenance, and enforcement.",
            learn: [
                "Eligibility criteria for wives, children, and parents",
                "Filing application for interim maintenance",
                "Enforcing court maintenance order against default"
            ]
        },
        {
            slug: "domestic-violence-protection-order",
            title: "Domestic Violence Relief & Protection Order Guide",
            category: "Family & Matrimonial",
            catKey: "family",
            readTime: "6 MIN READ",
            summary: "Reliefs under Protection of Women from Domestic Violence Act 2005 (PWDVA): protection orders, shared household rights, monetary relief, and Protection Officer role.",
            learn: [
                "Forms of domestic violence recognized by law (Physical, Emotional, Financial)",
                "Approaching Protection Officer or Service Provider",
                "Obtaining ex-parte emergency protection orders"
            ]
        },
        {
            slug: "will-estate-planning-guide",
            title: "Will Preparation & Estate Planning Basics",
            category: "Family & Matrimonial",
            catKey: "family",
            readTime: "5 MIN READ",
            summary: "How to draft a legally valid Will in India, registration requirements, attestation by 2 witnesses, executor appointment, and probate process.",
            learn: [
                "Essential clauses in a legal Will",
                "Attestation by two independent witnesses",
                "Benefits of Will registration and probate procedure"
            ]
        },
        {
            slug: "drafting-sending-legal-notice",
            title: "Draft & Send a Legal Notice in India",
            category: "Business & Contracts",
            catKey: "business",
            readTime: "5 MIN READ",
            summary: "Format, mandatory legal elements, delivery via Registered Post AD, reply timelines, and why legal notice is required before civil suits.",
            learn: [
                "Core structure of formal legal notice",
                "Serving via Registered Post AD / Speed Post with tracking",
                "Handling response or failure to reply within stipulated period"
            ]
        },
        {
            slug: "breach-of-contract-remedies",
            title: "Breach of Contract Remedies & Damages",
            category: "Business & Contracts",
            catKey: "business",
            readTime: "6 MIN READ",
            summary: "Contractual breach under Indian Contract Act 1872: liquidated damages, specific performance, injunctions, and commercial dispute arbitration.",
            learn: [
                "Types of contract breach: Material, Minor, Anticipatory",
                "Calculating monetary damages & compensation",
                "Filing commercial suit or invoking arbitration clause"
            ]
        },
        {
            slug: "cheque-bounce-138-ni-act",
            title: "Cheque Bounce Notice under Section 138 NI Act",
            category: "Business & Contracts",
            catKey: "business",
            readTime: "6 MIN READ",
            summary: "Statutory 30-day legal notice period, cheque dishonor memo, 15-day payment window, and filing criminal complaint within 30 days under Section 138 NI Act.",
            learn: [
                "Mandatory 30-day statutory timeline for legal notice",
                "Elements required in bank dishonor memo",
                "Filing complaint before Judicial Magistrate Court"
            ]
        },
        {
            slug: "trademark-copyright-infringement",
            title: "Trademark & Copyright Infringement Notice",
            category: "Business & Contracts",
            catKey: "business",
            readTime: "5 MIN READ",
            summary: "Protecting brand identity and original content: issuing cease and desist notice, domain takedowns, and court injunctions for IP infringement.",
            learn: [
                "Identifying trademark vs copyright violation",
                "Drafting Cease and Desist (C&D) notice",
                "Filing IP infringement suit in District Court"
            ]
        },
        {
            slug: "unpaid-salary-termination-remedies",
            title: "Unpaid Salary & Wrongful Termination Legal Remedies",
            category: "Employment & Labor",
            catKey: "employment",
            readTime: "6 MIN READ",
            summary: "Employee rights under Industrial Disputes Act & Shops and Establishment Act: notice period pay, delayed salary recovery, and Labor Commissioner complaint.",
            learn: [
                "Notice pay & severance calculation rules",
                "Filing complaint with Labor Commissioner",
                "Sending legal notice to employer for unpaid salary"
            ]
        },
        {
            slug: "posh-act-workplace-complaint",
            title: "Sexual Harassment at Workplace (POSH Act Complaint)",
            category: "Employment & Labor",
            catKey: "employment",
            readTime: "6 MIN READ",
            summary: "Rights under POSH Act 2013: lodging written complaint to Internal Committee (IC), 90-day inquiry procedure, interim relief, and confidentiality.",
            learn: [
                "Role and mandate of Internal Committee (IC)",
                "Time limit for filing POSH complaint (3 months)",
                "Interim relief rights (transfer, leave) during inquiry"
            ]
        },
        {
            slug: "provident-fund-pf-dispute",
            title: "Provident Fund (PF) Withdrawal & Dispute Settlement",
            category: "Employment & Labor",
            catKey: "employment",
            readTime: "4 MIN READ",
            summary: "EPFO online portal withdrawal procedure, employer non-remittance of PF contributions, and filing grievance on EPFiGMS portal.",
            learn: [
                "EPFO UAN activation and online claim submission",
                "Remedies if employer fails to deposit PF contributions",
                "Filing grievance on EPFiGMS portal"
            ]
        },
        {
            slug: "gratuity-maternity-benefit-claim",
            title: "Gratuity & Maternity Benefit Claim Procedure",
            category: "Employment & Labor",
            catKey: "employment",
            readTime: "5 MIN READ",
            summary: "Payment of Gratuity Act (5 years continuous service rule) and Maternity Benefit Act (26 weeks paid leave), eligibility, and enforcement.",
            learn: [
                "Gratuity formula calculation (15 days salary per year)",
                "26 weeks paid maternity leave rights",
                "Filing complaint before Controlling Authority"
            ]
        },
        {
            slug: "how-to-file-rti-application",
            title: "How to File an RTI (Right to Information) Application",
            category: "Fundamental Rights",
            catKey: "rights",
            readTime: "5 MIN READ",
            summary: "Drafting RTI queries, identifying Public Information Officer (PIO), statutory 30-day response deadline, and filing First Appeal / Central Information Commission.",
            learn: [
                "Drafting precise RTI questions without asking for opinions",
                "Submitting RTI online via rtionline.gov.in",
                "Filing First Appeal when PIO rejects or fails to reply within 30 days"
            ]
        },
        {
            slug: "habeas-corpus-writ-petitions",
            title: "Article 32 & 226 Writs in High Court / Supreme Court",
            category: "Fundamental Rights",
            catKey: "rights",
            readTime: "7 MIN READ",
            summary: "Constitutional remedies for fundamental rights violations: Habeas Corpus, Mandamus, Certiorari, Prohibition, and Quo Warranto writ petitions.",
            learn: [
                "Understanding the 5 Constitutional Writs",
                "Filing Writ Petition under Article 226 (High Court) vs 32 (Supreme Court)",
                "Urgent Habeas Corpus petition for illegal detention"
            ]
        },
        {
            slug: "free-legal-aid-lsa-act",
            title: "Legal Aid & Free Lawyer Services under LSA Act 1987",
            category: "Fundamental Rights",
            catKey: "rights",
            readTime: "5 MIN READ",
            summary: "Who qualifies for free legal services (women, SC/ST, low income, custody victims), application procedure at DLSA/SLSA, and panel advocate assignment.",
            learn: [
                "Income limits & eligible categories under Section 12 LSA Act",
                "Applying for free lawyer at District Court DLSA front office",
                "Lok Adalat settlement mechanism for speedy disposal"
            ]
        },
        {
            slug: "traffic-challan-contest-virtual-court",
            title: "Traffic Challan Contest & Virtual Court Settlement",
            category: "Traffic & Vehicles",
            catKey: "traffic",
            readTime: "4 MIN READ",
            summary: "Checking e-Challan status, contesting incorrect traffic fines online via Virtual Court portal, and rights during traffic police vehicle checks.",
            learn: [
                "Verifying e-Challan on vcourts.gov.in portal",
                "Contesting wrongful challans before Virtual Judge",
                "Rights during traffic stop: Officer rank requirements & document verification"
            ]
        },
        {
            slug: "motor-accident-mact-compensation",
            title: "Motor Accident Claim Tribunal (MACT) Compensation Procedure",
            category: "Traffic & Vehicles",
            catKey: "traffic",
            readTime: "6 MIN READ",
            summary: "Filing claim before MACT for road accident injury or fatality, Detailed Accident Report (DAR), third-party insurance liability, and compensation calculation.",
            learn: [
                "Role of Police Detailed Accident Report (DAR)",
                "Filing claim petition in MACT within jurisdiction",
                "Calculating compensation based on age, income, and disability"
            ]
        },
        {
            slug: "vehicle-impoundment-license-rights",
            title: "Vehicle Impoundment & License Suspension Legal Rights",
            category: "Traffic & Vehicles",
            catKey: "traffic",
            readTime: "5 MIN READ",
            summary: "Motor Vehicles Act rules on key seizure, vehicle impoundment, drunk driving penalties, and contesting driver's license suspension notice.",
            learn: [
                "Legal fact: Traffic officer cannot pull keys out of running ignition",
                "Procedure for releasing impounded vehicle from RTO / Police station",
                "Show cause notice & appeal against license suspension"
            ]
        },
        {
            slug: "ancestral-property-partition-guide",
            title: "Ancestral Property Partition & Legal Heir Succession Certificate",
            category: "Property & Land",
            catKey: "property",
            readTime: "7 MIN READ",
            summary: "Rights of coparceners (daughters & sons), filing partition suit, obtaining Legal Heir Certificate, and Succession Certificate from District Court.",
            learn: [
                "Equal rights of daughters in ancestral property (2005 Amendment)",
                "Difference between Legal Heir Certificate and Succession Certificate",
                "Filing Partition Suit in Civil Court"
            ]
        },
        {
            slug: "land-title-verification-checklist",
            title: "Land Title Verification & Due Diligence Checklist",
            category: "Property & Land",
            catKey: "property",
            readTime: "6 MIN READ",
            summary: "Essential due diligence before buying real estate: Title Deed search for 30 years, Encumbrance Certificate (EC), Mutation Entry, and RERA verification.",
            learn: [
                "Obtaining 30-year Encumbrance Certificate (EC)",
                "Verifying Revenue Records (7/12 extract, Khata certificate)",
                "Publishing public notice in newspapers before property purchase"
            ]
        },
        {
            slug: "property-registration-stamp-duty",
            title: "Property Registration & Stamp Duty Procedure",
            category: "Property & Land",
            catKey: "property",
            readTime: "5 MIN READ",
            summary: "Registration Act 1908 requirements, calculating stamp duty, visiting Sub-Registrar Office (SRO), biome-tric verification, and registered Sale Deed.",
            learn: [
                "Stamp duty and registration fee calculations across states",
                "Mandatory presence of buyer, seller, and 2 witnesses at SRO",
                "Obtaining registered Sale Deed and post-registration mutation"
            ]
        },
        {
            slug: "senior-citizen-maintenance-claim",
            title: "Senior Citizen Protection & Maintenance Claim",
            category: "Women & Child Protection",
            catKey: "women",
            readTime: "5 MIN READ",
            summary: "Maintenance and Welfare of Parents and Senior Citizens Act 2007: tribunal proceedings, reclaiming gifted property from ungrateful children, and eviction of abusive relatives.",
            learn: [
                "Filing summary application before Maintenance Tribunal (SDM court)",
                "Cancelling property transfer gift deed under Section 23",
                "Eviction orders against abusive children from parents' house"
            ]
        },
        {
            slug: "women-sakhi-one-stop-legal-aid",
            title: "Free Legal Services & Sakhi One Stop Centers for Women",
            category: "Women & Child Protection",
            catKey: "women",
            readTime: "5 MIN READ",
            summary: "Directory of free legal services, DLSA legal aid clinics, One Stop Centers (Sakhi), and NCW helplines for women and vulnerable citizens.",
            learn: [
                "District Legal Services Authority (DLSA) legal aid",
                "One Stop Centers (Sakhi 181)",
                "National Commission for Women (NCW 7827170170)"
            ]
        }
    ];

    const guidesHub = `
    ${renderHead('Legal Guides & Practical How-To Hub | NYAYI Legal AI', 'Step-by-step guides on filing FIRs, reporting cyber crimes, obtaining bail, consumer complaints, and court procedures in India.', 'Legal Guides India, how to file FIR, cyber crime report guide, bail process India, consumer complaint guide', '/guides.html', 0)}
    ${renderHeader('guides', 0)}

    <!-- SECTION 1: HERO HEADER -->
    <section class="page-header" style="padding: 70px 0 50px; background: linear-gradient(180deg, #f4f7f6 0%, #ffffff 100%);">
        <div class="container" style="text-align: center; max-width: 900px;" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:16px; background:#e8f5e9; color:#00C853; font-weight:800; padding:6px 18px; border-radius:30px; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                <i class="fas fa-compass"></i> Practical Legal Knowledge
            </span>
            <h1 style="font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 20px; color: #111;">
                Step-by-Step <span style="color:#00C853;">Legal Guides</span> & How-To Center
            </h1>
            <p style="font-size: 1.25rem; color: #555; max-width: 780px; margin: 0 auto 30px; line-height: 1.6;">
                Clear, actionable, step-by-step instructions breaking down complex Indian police, court, consumer, cyber, rent, property, and workplace procedures.
            </p>
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <a href="#browse-guides" class="card-link" style="background:#00C853; color:#fff; padding:14px 32px; border-radius:12px; font-weight:700; text-decoration:none; font-size:15px; box-shadow: 0 4px 14px rgba(0,200,83,0.3);">
                    Browse All 47+ Guides <i class="fas fa-arrow-down"></i>
                </a>
                <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="background:#111; color:#fff; padding:14px 32px; border-radius:12px; font-weight:700; text-decoration:none; font-size:15px;">
                    <i class="fas fa-robot"></i> Ask NYAYI Legal AI
                </a>
            </div>
        </div>
    </section>

    <!-- SECTION 2: INTERACTIVE GUIDE SEARCH ENGINE -->
    <section style="padding: 30px 0; background: #fff; border-bottom: 1px solid #edf2f7;">
        <div class="container" style="max-width: 1000px;">
            <div class="guide-search-wrapper" style="position:relative;">
                <i class="fas fa-search guide-search-icon" style="position:absolute; left:22px; top:50%; transform:translateY(-50%); color:#00C853; font-size:20px;"></i>
                <input type="text" id="guideSearchInput" oninput="handleGuideSearch()" placeholder="Search FIR, Bail, Cyber Crime, Consumer Complaint, Tenant Rights, RERA..." style="width:100%; padding:18px 50px 18px 60px; font-size:16px; border:2px solid #e2e8f0; border-radius:16px; outline:none; transition:all 0.3s ease; box-shadow:0 4px 20px rgba(0,0,0,0.04);">
                <button id="guideClearBtn" onclick="clearGuideSearch()" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); background:none; border:none; color:#a0aec0; cursor:pointer; font-size:18px; display:none;">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
            
            <!-- POPULAR CHIPS -->
            <div style="margin-top: 16px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <span style="font-size:13px; font-weight:700; color:#718096; text-transform:uppercase; letter-spacing:0.5px;">Popular:</span>
                <button onclick="setGuideSearch('FIR')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">FIR</button>
                <button onclick="setGuideSearch('Bail')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Bail</button>
                <button onclick="setGuideSearch('Cyber Fraud')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Cyber Fraud</button>
                <button onclick="setGuideSearch('Consumer Complaint')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Consumer Complaint</button>
                <button onclick="setGuideSearch('Legal Notice')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Legal Notice</button>
                <button onclick="setGuideSearch('Tenant Dispute')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Tenant Dispute</button>
                <button onclick="setGuideSearch('RTI')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">RTI</button>
                <button onclick="setGuideSearch('Traffic')" class="chip-btn" style="background:#f7fafc; border:1px solid #e2e8f0; padding:6px 14px; border-radius:20px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5568;">Traffic Challan</button>
            </div>
        </div>
    </section>

    <!-- SECTION 3: BROWSE BY CATEGORY -->
    <section id="browse-guides" style="padding: 60px 0 30px; background: #fafbfc;">
        <div class="container">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="font-size:26px; font-weight:900; color:#111;">Explore Guides by Category</h2>
                <p style="color:#666; font-size:15px;">Filter our practical guides based on legal domain</p>
            </div>
            
            <div class="cat-card-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px;">
                <div onclick="filterGuideCat('all', this)" class="cat-card active" style="background:#fff; border:2px solid #00C853; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                    <i class="fas fa-th-large cat-card-icon" style="font-size:24px; color:#00C853; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">All Guides</div>
                    <span style="font-size:12px; color:#718096;">47 Guides</span>
                </div>
                <div onclick="filterGuideCat('police', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-shield-alt cat-card-icon" style="font-size:24px; color:#3182ce; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Police & Criminal</div>
                    <span style="font-size:12px; color:#718096;">8 Guides</span>
                </div>
                <div onclick="filterGuideCat('cyber', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-laptop-code cat-card-icon" style="font-size:24px; color:#805ad5; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Cyber & Digital</div>
                    <span style="font-size:12px; color:#718096;">6 Guides</span>
                </div>
                <div onclick="filterGuideCat('consumer', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-shopping-bag cat-card-icon" style="font-size:24px; color:#dd6b20; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Consumer & Markets</div>
                    <span style="font-size:12px; color:#718096;">5 Guides</span>
                </div>
                <div onclick="filterGuideCat('rent', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-home cat-card-icon" style="font-size:24px; color:#38a169; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Rent & Housing</div>
                    <span style="font-size:12px; color:#718096;">4 Guides</span>
                </div>
                <div onclick="filterGuideCat('family', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-users cat-card-icon" style="font-size:24px; color:#e53e3e; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Family & Matrimonial</div>
                    <span style="font-size:12px; color:#718096;">5 Guides</span>
                </div>
                <div onclick="filterGuideCat('business', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-file-contract cat-card-icon" style="font-size:24px; color:#319795; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Business & Contracts</div>
                    <span style="font-size:12px; color:#718096;">4 Guides</span>
                </div>
                <div onclick="filterGuideCat('employment', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-briefcase cat-card-icon" style="font-size:24px; color:#d69e2e; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Employment & Labor</div>
                    <span style="font-size:12px; color:#718096;">4 Guides</span>
                </div>
                <div onclick="filterGuideCat('rights', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-balance-scale cat-card-icon" style="font-size:24px; color:#00C853; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Fundamental Rights</div>
                    <span style="font-size:12px; color:#718096;">3 Guides</span>
                </div>
                <div onclick="filterGuideCat('traffic', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-car cat-card-icon" style="font-size:24px; color:#4a5568; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Traffic & Vehicles</div>
                    <span style="font-size:12px; color:#718096;">3 Guides</span>
                </div>
                <div onclick="filterGuideCat('property', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-building cat-card-icon" style="font-size:24px; color:#742a2a; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Property & Land</div>
                    <span style="font-size:12px; color:#718096;">3 Guides</span>
                </div>
                <div onclick="filterGuideCat('women', this)" class="cat-card" style="background:#fff; border:2px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer; transition:all 0.3s ease;">
                    <i class="fas fa-hands-helping cat-card-icon" style="font-size:24px; color:#b83280; margin-bottom:10px; display:block;"></i>
                    <div style="font-weight:800; font-size:14px; color:#111;">Women & Children</div>
                    <span style="font-size:12px; color:#718096;">2 Guides</span>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 4: SUBSTANTIAL COLLECTION OF PRACTICAL GUIDES (47+ CARDS) -->
    <section style="padding:50px 0 90px; background:#fff;">
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h3 style="font-size:22px; font-weight:800; color:#111;" id="guideResultsHeading">Showing All 47 Legal Guides</h3>
                <span style="font-size:14px; color:#718096;" id="guideResultsCount">47 results</span>
            </div>

            <div class="guides-grid-enhanced" id="guidesContainer" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:24px;">
                ${expandedGuides.map(item => `
                    <div class="guide-card-enhanced" data-category="${item.catKey}" data-title="${item.title.toLowerCase()}" data-aos="fade-up" style="background:#fff; border:1px solid #edf2f7; border-radius:20px; padding:28px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.3s ease; box-shadow:0 6px 20px rgba(0,0,0,0.03);">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <span class="card-tag" style="background:#f0fdf4; color:#00C853; font-weight:800; font-size:12px; padding:4px 12px; border-radius:20px; text-transform:uppercase;">${item.category}</span>
                                <span style="font-size:12px; font-weight:700; color:#a0aec0;"><i class="far fa-clock"></i> ${item.readTime}</span>
                            </div>
                            <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:10px; line-height:1.35;">${item.title}</h3>
                            <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:18px;">${item.summary}</p>
                            
                            <div style="background:#f8fafc; border-radius:12px; padding:14px; margin-bottom:20px;">
                                <div style="font-size:11px; font-weight:900; color:#718096; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">WHAT YOU'LL LEARN:</div>
                                <ul style="list-style:none; padding:0; margin:0;">
                                    ${item.learn.map(l => `
                                        <li style="font-size:13px; color:#2d3748; margin-bottom:6px; display:flex; align-items:flex-start; gap:8px;">
                                            <i class="fas fa-check-circle" style="color:#00C853; font-size:12px; margin-top:3px;"></i>
                                            <span>${l}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        <a href="legal-guides/${item.slug}.html" class="card-link" style="display:inline-flex; align-items:center; justify-content:space-between; background:#111; color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; font-size:14px; text-decoration:none; transition:all 0.3s ease;">
                            <span>Read Full Guide</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `).join('')}
            </div>
            
            <div id="noGuidesFound" style="display:none; text-align:center; padding:60px 20px; background:#f7fafc; border-radius:20px; margin-top:30px;">
                <i class="fas fa-search" style="font-size:40px; color:#cbd5e0; margin-bottom:16px;"></i>
                <h3 style="font-size:20px; font-weight:800; color:#2d3748;">No Legal Guides Found</h3>
                <p style="color:#718096; font-size:14px;">Try adjusting your search term or selecting another category.</p>
                <button onclick="clearGuideSearch()" style="margin-top:16px; background:#00C853; color:#fff; border:none; padding:10px 24px; border-radius:10px; font-weight:700; cursor:pointer;">Reset Search & Filters</button>
            </div>
        </div>
    </section>

    <!-- SECTION 5: HOW OUR GUIDES WORK (4-STAGE VISUAL PROCESS) -->
    <section style="padding: 70px 0; background: #f8fafc; border-top: 1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 50px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Practical Framework</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">How NYAYI Guides Help You Act</h2>
                <p style="color:#666; font-size:15px;">Every guide follows a structured 4-step actionable legal protocol.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
                <div style="background:#fff; border-radius:16px; padding:28px; border:1px solid #edf2f7; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.02);" data-aos="fade-up" data-aos-delay="100">
                    <div style="width:48px; height:48px; background:#e8f5e9; color:#00C853; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:18px; margin:0 auto 16px;">01</div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">UNDERSTAND</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.6;">Identify your statutory rights, applicable BNS/BNSS laws, and initial legal standing.</p>
                </div>
                <div style="background:#fff; border-radius:16px; padding:28px; border:1px solid #edf2f7; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.02);" data-aos="fade-up" data-aos-delay="200">
                    <div style="width:48px; height:48px; background:#eef2ff; color:#4f46e5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:18px; margin:0 auto 16px;">02</div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">PREPARE</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.6;">Gather mandatory documentary evidence, receipts, timeline, and identity documents.</p>
                </div>
                <div style="background:#fff; border-radius:16px; padding:28px; border:1px solid #edf2f7; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.02);" data-aos="fade-up" data-aos-delay="300">
                    <div style="width:48px; height:48px; background:#fef3c7; color:#d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:18px; margin:0 auto 16px;">03</div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">ACT</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.6;">Submit official complaints, send legal notices, or lodge digital portal complaints.</p>
                </div>
                <div style="background:#fff; border-radius:16px; padding:28px; border:1px solid #edf2f7; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,0.02);" data-aos="fade-up" data-aos-delay="400">
                    <div style="width:48px; height:48px; background:#fee2e2; color:#dc2626; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:18px; margin:0 auto 16px;">04</div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">ESCALATE</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.6;">Escalate to Magistrates, Tribunals, Ombudsman, or High Court if initial recourse fails.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 6: SIGNATURE FEATURE: "LEGAL SITUATION -> ACTION PLAN" -->
    <section style="padding: 70px 0; background: #fff;">
        <div class="container">
            <div style="text-align:center; max-width:750px; margin:0 auto 50px;">
                <span style="background:#111; color:#fff; font-weight:800; font-size:12px; padding:4px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase;">SIGNATURE TOOL</span>
                <h2 style="font-size:30px; font-weight:900; color:#111; margin-top:10px;">Legal Situation &rarr; Immediate Action Plan</h2>
                <p style="color:#666; font-size:15px;">Facing a specific legal problem? Select your exact scenario for a 60-second immediate response plan.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-exclamation-triangle" style="color:#e53e3e; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">I think I have been scammed online</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Unauthorized bank debit, fake shopping website, or UPI QR code fraud.</p>
                    <button onclick="openActionPlanModal('scammed-online')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-key" style="color:#dd6b20; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">My landlord isn't returning my deposit</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Vacated flat but landlord refusing to refund security deposit after 30 days.</p>
                    <button onclick="openActionPlanModal('landlord-deposit')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-shield-alt" style="color:#3182ce; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">Police aren't registering my complaint</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Station duty officer refused to take written complaint or lodge FIR.</p>
                    <button onclick="openActionPlanModal('police-refusal')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-envelope-open-text" style="color:#805ad5; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">I received a formal legal notice</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Received advocate notice demanding response within 15 days.</p>
                    <button onclick="openActionPlanModal('received-notice')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-gavel" style="color:#742a2a; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">I received a court summons</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Court summons ordering mandatory appearance on specified date.</p>
                    <button onclick="openActionPlanModal('court-summons')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-car-crash" style="color:#d69e2e; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">I was stopped by police / traffic officer</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Traffic check, document inspection, or vehicle seizure attempt.</p>
                    <button onclick="openActionPlanModal('traffic-stop')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-box-open" style="color:#38a169; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">I bought a defective product</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Seller or brand refusing replacement or refund under warranty.</p>
                    <button onclick="openActionPlanModal('defective-product')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:16px; padding:24px; background:#fff; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <i class="fas fa-briefcase" style="color:#b83280; font-size:20px;"></i>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0;">My employer has not paid my wages</h3>
                    </div>
                    <p style="font-size:13px; color:#666; margin-bottom:16px; line-height:1.5;">Overdue salary for months or full F&F settlement withheld after resignation.</p>
                    <button onclick="openActionPlanModal('unpaid-salary')" style="width:100%; background:#f7fafc; border:1px solid #cbd5e0; color:#2d3748; padding:10px; border-radius:10px; font-weight:700; font-size:13px; cursor:pointer;">
                        View Action Plan <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 7: "DON'T MAKE THESE COMMON MISTAKES" -->
    <section style="padding: 70px 0; background: #fff5f5; border-top: 1px solid #fed7d7;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 50px;">
                <span style="background:#e53e3e; color:#fff; font-weight:800; font-size:12px; padding:4px 14px; border-radius:20px; letter-spacing:1px; text-transform:uppercase;">CRITICAL ADVISORY</span>
                <h2 style="font-size:28px; font-weight:900; color:#9b2c2c; margin-top:10px;">Don't Make These 6 Common Legal Mistakes</h2>
                <p style="color:#742a2a; font-size:15px;">Mistakes made in the first 24 hours of a legal issue can permanently weaken your position.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-trash-alt"></i> 1. Deleting Messages & Evidence</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Never delete WhatsApp chats, call logs, emails, or payment screenshots out of panic. Under Bharatiya Sakshya Adhiniyam (BSA 2023), digital records serve as primary evidence when supported by Sec 63 certificate.</p>
                </div>
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-comments"></i> 2. Relying Only on Verbal Assurances</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Verbal promises by landlords, employers, or sellers are difficult to prove in court. Always follow up verbal discussions with an immediate written email or WhatsApp summary ("As discussed today...").</p>
                </div>
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-file-signature"></i> 3. Signing Documents Without Reading</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Never sign blank papers, police statements, or compromise deeds without reading every clause. You have the statutory right to request time to review documents with legal counsel.</p>
                </div>
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-bell-slash"></i> 4. Ignoring Formal Notices or Summons</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Ignoring court summons or advocate notices leads to ex-parte orders or issuance of Non-Bailable Warrants (NBW). Always acknowledge and send a formal reply within the stipulated deadline.</p>
                </div>
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-exchange-alt"></i> 5. Confusing Civil vs Criminal Remedies</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Filing police complaints for purely civil monetary disputes (like simple loan defaults) risks complaint rejection. Know whether your issue requires a civil suit, consumer filing, or criminal FIR.</p>
                </div>
                <div style="background:#fff; border-left:4px solid #e53e3e; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(229,62,62,0.05);" data-aos="fade-up">
                    <h3 style="font-size:16px; font-weight:800; color:#9b2c2c; margin-bottom:8px;"><i class="fas fa-hashtag"></i> 6. Social Media Defamation Postings</h3>
                    <p style="font-size:13px; color:#4a5568; margin:0; line-height:1.6;">Posting aggressive unverified allegations against individuals or companies on social media can invite criminal defamation suits under BNS Sec 356 and IT Act counter-charges.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 8: DOCUMENT & EVIDENCE CHECKLIST ("BUILD YOUR LEGAL FILE") -->
    <section style="padding: 70px 0; background: #fff;">
        <div class="container" style="max-width:900px;">
            <div style="text-align:center; margin-bottom:40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Interactive Preparation</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Build Your Legal Case File</h2>
                <p style="color:#666; font-size:15px;">Check off the evidence items you have compiled before taking formal action:</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:32px;">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:16px;">
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Government Photo ID (Aadhaar / PAN / Passport)</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Chronological Timeline of Incident Events</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Proof of Payment / Bank Statement / UPI Receipt</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Written Contracts / Agreements / Invoices</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Written Communications (Emails / WhatsApp PDF export)</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Photos / Video Recordings / CCTV Footage</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Copy of Police Acknowledgement Receipt / FIR</span>
                    </label>
                    <label class="checklist-item" style="display:flex; align-items:center; gap:14px; background:#fff; padding:16px; border-radius:12px; border:1px solid #edf2f7; cursor:pointer; transition:all 0.2s ease;">
                        <input type="checkbox" onchange="toggleChecklistItem(this)" style="width:20px; height:20px; accent-color:#00C853; cursor:pointer;">
                        <span style="font-size:14px; font-weight:600; color:#2d3748;">Witness Names and Contact Details</span>
                    </label>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 9: "BEFORE YOU TAKE THE NEXT STEP" -->
    <section style="padding: 60px 0; background: #111; color: #fff;">
        <div class="container" style="max-width: 900px; text-align: center;">
            <span style="color:#00C853; font-weight:800; font-size:12px; letter-spacing:1px; text-transform:uppercase;">SELF-ASSESSMENT FRAMEWORK</span>
            <h2 style="font-size: 28px; font-weight: 900; margin: 10px 0 30px;">3 Questions Before You Take Legal Action</h2>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:24px; text-align:left;">
                <div style="background:#1a1a1a; border:1px solid #333; border-radius:16px; padding:24px;">
                    <div style="color:#00C853; font-weight:900; font-size:20px; margin-bottom:10px;">01</div>
                    <h3 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:8px;">What Specific Right Was Violated?</h3>
                    <p style="font-size:13px; color:#aaa; margin:0; line-height:1.6;">Identify the specific statutory right, contract clause, or criminal provision that was breached.</p>
                </div>
                <div style="background:#1a1a1a; border:1px solid #333; border-radius:16px; padding:24px;">
                    <div style="color:#00C853; font-weight:900; font-size:20px; margin-bottom:10px;">02</div>
                    <h3 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:8px;">Do You Have Admissible Evidence?</h3>
                    <p style="font-size:13px; color:#aaa; margin:0; line-height:1.6;">Ensure your receipts, screenshots, or witnesses conform to BSA 2023 evidence standards.</p>
                </div>
                <div style="background:#1a1a1a; border:1px solid #333; border-radius:16px; padding:24px;">
                    <div style="color:#00C853; font-weight:900; font-size:20px; margin-bottom:10px;">03</div>
                    <h3 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:8px;">What Outcome Are You Seeking?</h3>
                    <p style="font-size:13px; color:#aaa; margin:0; line-height:1.6;">Define whether you require monetary refund, property possession, injunction, or criminal conviction.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 10: LEGAL GUIDES FOR STUDENTS ("STUDY LEGAL PROCEDURE") -->
    <section style="padding: 70px 0; background: #fafbfc;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Academic Procedure Module</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Study Indian Legal Procedure</h2>
                <p style="color:#666; font-size:15px;">Key procedural distinctions for law students, UPSC aspirants, and legal learners.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 01</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">FIR vs Police Complaint</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">FIR registered only for cognizable offenses (Sec 173 BNSS). Written complaint recorded for non-cognizable cases in NCR register (Sec 174 BNSS).</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 02</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Bail vs Anticipatory Bail</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Regular bail (Sec 479/480 BNSS) granted post-arrest. Anticipatory bail (Sec 482 BNSS) granted by Sessions/High Court before actual arrest occurs.</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 03</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Summons vs Warrant</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Summons is an authoritative judicial order to appear in court. Warrant is an order empowering police officers to arrest a specific accused person.</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 04</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Civil vs Criminal Procedure</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Civil suits (CPC 1908) resolve private rights disputes and monetary compensation. Criminal suits (BNSS 2023) punish offenses against society.</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 05</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Admissible Evidence (BSA 2023)</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Electronic records require Section 63 BSA certificate. Primary evidence includes original documents; secondary evidence accepted under specific exceptions.</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 06</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Jurisdiction Principles</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Territorial jurisdiction (where offense occurred) vs Pecuniary jurisdiction (monetary valuation of suit claims in civil courts).</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 07</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Legal Notice Dynamics</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Statutory notices require 15-to-60 day response windows depending on applicable statute (CPC Sec 80 requires 60 days against Government).</p>
                </div>

                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#3182ce; background:#ebf8ff; padding:3px 10px; border-radius:12px;">PROCEDURAL REVISION 08</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Appeals vs Revision Petitions</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Appeal re-examines both factual evidence and law points. Revision petition examines legal correctness and jurisdictional propriety of court orders.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 11: BEGINNER TO ADVANCED LEARNING PATHWAY -->
    <section style="padding: 70px 0; background: #fff;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 50px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Structured Progression</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Legal Awareness Pathway</h2>
                <p style="color:#666; font-size:15px;">Build your practical legal literacy step by step:</p>
            </div>

            <div style="display:flex; flex-direction:column; gap:16px; max-width:800px; margin:0 auto;">
                <div style="display:flex; align-items:center; gap:20px; background:#f8fafc; border:1px solid #edf2f7; border-radius:16px; padding:20px;">
                    <div style="width:40px; height:40px; background:#00C853; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">1</div>
                    <div>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0 0 4px;">Stage 1: Know Your Fundamental Rights</h3>
                        <p style="font-size:13px; color:#666; margin:0;">Understand constitutional guarantees under Articles 14, 19, 21, and 22.</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:20px; background:#f8fafc; border:1px solid #edf2f7; border-radius:16px; padding:20px;">
                    <div style="width:40px; height:40px; background:#00C853; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">2</div>
                    <div>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0 0 4px;">Stage 2: Master Basic Police & Legal Interaction</h3>
                        <p style="font-size:13px; color:#666; margin:0;">Learn FIR registration, police questioning rules, and zero-FIR rights.</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:20px; background:#f8fafc; border:1px solid #edf2f7; border-radius:16px; padding:20px;">
                    <div style="width:40px; height:40px; background:#00C853; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">3</div>
                    <div>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0 0 4px;">Stage 3: Cyber & Consumer Protection Literacy</h3>
                        <p style="font-size:13px; color:#666; margin:0;">Know 1930 Cyber Helpline reporting, e-Daakhil consumer claims, and bank liability.</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:20px; background:#f8fafc; border:1px solid #edf2f7; border-radius:16px; padding:20px;">
                    <div style="width:40px; height:40px; background:#00C853; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">4</div>
                    <div>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0 0 4px;">Stage 4: Civil, Property & Housing Disclosures</h3>
                        <p style="font-size:13px; color:#666; margin:0;">Understand Model Tenancy Act, RERA builder disputes, and legal notice drafting.</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:20px; background:#f8fafc; border:1px solid #edf2f7; border-radius:16px; padding:20px;">
                    <div style="width:40px; height:40px; background:#00C853; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900;">5</div>
                    <div>
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin:0 0 4px;">Stage 5: Court Procedures & Dispute Resolution</h3>
                        <p style="font-size:13px; color:#666; margin:0;">Explore bail procedures, writ petitions, Lok Adalat, and legal aid rights.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 12: RELATED NYAYI RESOURCES ("GO DEEPER") -->
    <section style="padding: 60px 0; background: #fafbfc; border-top: 1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="font-size:24px; font-weight:900; color:#111;">Explore More NYAYI Knowledge Resources</h2>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px;">
                <a href="dictionary.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-decoration:none; display:block; transition:all 0.3s ease;">
                    <i class="fas fa-book-open" style="font-size:28px; color:#00C853; margin-bottom:12px; display:block;"></i>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:6px;">Legal Dictionary</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Search 1,000+ Indian legal terms & definitions.</p>
                </a>
                <a href="laws.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-decoration:none; display:block; transition:all 0.3s ease;">
                    <i class="fas fa-gavel" style="font-size:28px; color:#3182ce; margin-bottom:12px; display:block;"></i>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:6px;">Indian Laws Library</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Browse BNS 2023, BNSS 2023, BSA 2023 codes.</p>
                </a>
                <a href="rights.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-decoration:none; display:block; transition:all 0.3s ease;">
                    <i class="fas fa-shield-alt" style="font-size:28px; color:#e53e3e; margin-bottom:12px; display:block;"></i>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:6px;">Know Your Rights</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Citizen rights guide for police, workplace, & family.</p>
                </a>
                <a href="articles.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; text-decoration:none; display:block; transition:all 0.3s ease;">
                    <i class="fas fa-newspaper" style="font-size:28px; color:#805ad5; margin-bottom:12px; display:block;"></i>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:6px;">Legal Articles</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Editorial updates and legal analysis.</p>
                </a>
            </div>
        </div>
    </section>

    <!-- SECTION 13: SUBSTANTIAL FAQ ACCORDION -->
    <section style="padding: 70px 0; background: #fff;">
        <div class="container" style="max-width:850px;">
            <div style="text-align:center; margin-bottom:40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">FREQUENTLY ASKED QUESTIONS</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Legal Guides & Procedures FAQ</h2>
            </div>

            <div class="faq-accordion">
                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>What is the difference between an FIR and a written police complaint?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        An FIR (First Information Report) is registered under Section 173 of BNSS 2023 exclusively for cognizable offenses (serious crimes where police can arrest without a warrant). A police complaint is a written report of any incident (cognizable or non-cognizable) submitted to a station officer. Non-cognizable complaints are entered in the Non-Cognizable Register (NCR) and require a magistrate's order for investigation.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>Can police refuse to register an FIR for a serious crime?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        No. Legally, under Section 173 of BNSS 2023 and Supreme Court ruling in <em>Lalita Kumari v. Govt of UP</em>, police are mandatory bound to register an FIR upon receiving information disclosing a cognizable offense. If refused, you can send your complaint to Superintendent of Police (SP) by registered post under BNSS 173(4) or file a application before Magistrate under BNSS 175(3).
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>What is a Zero FIR and how does it work?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        A Zero FIR allows a victim to lodge an FIR at ANY police station in India, regardless of territorial jurisdiction where the crime took place. It receives the number '00' and is immediately transferred to the jurisdictional police station for formal investigation after initial emergency steps are taken.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>How quickly should financial cyber fraud be reported?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        Financial cyber fraud should be reported within the 'Golden Hour' (first 1 to 2 hours) by calling <strong>1930 Cyber Helpline</strong> or lodging a complaint on <code>cybercrime.gov.in</code>. Immediate reporting enables the National Cybercrime Reporting Portal to issue freeze alerts directly to recipient bank accounts before funds are withdrawn.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>What should I do if I receive a formal legal notice?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        Do not ignore a legal notice. Read it carefully, note the deadline for response (usually 15 days), collect relevant documents/evidence, and consult an advocate to send a formal written reply refuting baseless claims or negotiating a settlement before court litigation begins.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>How can I file a complaint in Consumer Court without a lawyer?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        Under Consumer Protection Act 2019, consumers can file complaints online via <code>edaakhil.nic.in</code> or directly at District Consumer Commission without hiring an advocate. You need to attach purchase receipts, proof of deficiency in service, copy of legal notice sent to seller, and affidavit.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>Can a landlord withhold a security deposit without providing bills?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        No. Deductions from security deposits must be backed by actual bills for damages beyond normal wear and tear. Under Model Tenancy Act provisions, landlords must refund security deposit within 30 days of flat handover after valid deductions.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>What is the statutory response period for an RTI application?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        The Public Information Officer (PIO) is legally required to respond within <strong>30 days</strong> of receiving an RTI application. If information concerns life or liberty of a person, response must be provided within <strong>48 hours</strong>.
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>Who qualifies for free legal services in India?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        Under Section 12 of Legal Services Authorities Act 1987, free legal assistance (lawyer fees & court expenses) is available to women, children, SC/ST members, industrial workmen, custody victims, disaster victims, and persons with annual income below specified state thresholds (usually 3 Lakhs).
                    </div>
                </div>

                <div style="border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px; overflow:hidden;">
                    <button onclick="toggleFaq(this)" style="width:100%; text-align:left; background:#f8fafc; border:none; padding:18px 24px; font-size:16px; font-weight:800; color:#111; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                        <span>What are the new criminal law codes in India?</span>
                        <i class="fas fa-chevron-down" style="color:#00C853; transition:transform 0.3s ease;"></i>
                    </button>
                    <div style="display:none; padding:20px 24px; font-size:14px; color:#4a5568; line-height:1.6; background:#fff; border-top:1px solid #edf2f7;">
                        Effective July 1, 2024, India's key criminal codes were updated: Bharatiya Nyaya Sanhita (BNS 2023) replaced IPC, Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) replaced CrPC, and Bharatiya Sakshya Adhiniyam (BSA 2023) replaced Indian Evidence Act.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 14: EDUCATIONAL DISCLAIMER -->
    <section style="padding: 30px 0; background: #fff5f5; border-top: 1px solid #fed7d7;">
        <div class="container" style="max-width: 900px; text-align: center;">
            <p style="font-size:12px; color:#c53030; margin:0; line-height:1.6;">
                <i class="fas fa-exclamation-circle"></i> <strong>Educational Disclaimer:</strong> NYAYI guides are created for general legal awareness and educational purposes under Bharatiya codes (BNS, BNSS, BSA). Procedures may vary based on local state rules and case facts. For formal legal representation or litigation advice, consult a licensed advocate.
            </p>
        </div>
    </section>

    <!-- SECTION 15: FINAL CTA BLOCK -->
    <section style="padding:80px 0; background:#111; color:#fff; text-align:center;">
        <div class="container" style="max-width:800px;" data-aos="zoom-in">
            <h2 style="font-size:32px; font-weight:900; margin-bottom:16px; color:#fff;">Need Instant Answers for Your Specific Legal Case?</h2>
            <p style="font-size:17px; color:#aaa; margin-bottom:32px; line-height:1.6;">
                Get real-time AI legal assistance, BNS section mappings, and procedure guidance in plain language on NYAYI AI.
            </p>
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="background:#00C853; color:#fff; padding:16px 36px; border-radius:12px; font-weight:800; text-decoration:none; font-size:16px; box-shadow:0 4px 20px rgba(0,200,83,0.4);">
                    <i class="fas fa-robot"></i> Ask NYAYI AI Assistant
                </a>
                <a href="rights.html" class="card-link" style="background:transparent; border:2px solid #fff; color:#fff; padding:14px 30px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px;">
                    Explore Citizen Rights
                </a>
            </div>
        </div>
    </section>

    <!-- ACTION PLAN MODAL OVERLAY -->
    <div id="actionPlanModal" class="action-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); z-index:99999; justify-content:center; align-items:center; padding:20px;">
        <div class="action-modal-content" style="background:#fff; border-radius:24px; max-width:700px; width:100%; max-height:85vh; overflow-y:auto; padding:32px; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
            <button onclick="closeActionPlanModal()" style="position:absolute; right:24px; top:24px; background:#f7fafc; border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:18px; color:#4a5568; display:flex; align-items:center; justify-content:center;">
                <i class="fas fa-times"></i>
            </button>
            <div id="actionModalBody">
                <!-- Injected via JavaScript -->
            </div>
        </div>
    </div>

    <!-- CLIENT-SIDE INTERACTIVE JAVASCRIPT FOR SEARCH, FILTERS, MODAL & FAQ -->
    <script>
    const expandedGuidesData = ${JSON.stringify(expandedGuides)};

    function handleGuideSearch() {
        const query = document.getElementById('guideSearchInput').value.toLowerCase().trim();
        const clearBtn = document.getElementById('guideClearBtn');
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        const cards = document.querySelectorAll('.guide-card-enhanced');
        let count = 0;
        cards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const cat = card.getAttribute('data-category') || '';
            const text = card.textContent.toLowerCase();

            if (!query || title.includes(query) || text.includes(query)) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        const heading = document.getElementById('guideResultsHeading');
        const countSpan = document.getElementById('guideResultsCount');
        const noFound = document.getElementById('noGuidesFound');

        if (heading) heading.innerText = query ? 'Search Results for "' + query + '"' : 'Showing All 47 Legal Guides';
        if (countSpan) countSpan.innerText = count + ' results';
        if (noFound) noFound.style.display = count === 0 ? 'block' : 'none';
    }

    function setGuideSearch(term) {
        const input = document.getElementById('guideSearchInput');
        if (input) {
            input.value = term;
            handleGuideSearch();
        }
    }

    function clearGuideSearch() {
        const input = document.getElementById('guideSearchInput');
        if (input) {
            input.value = '';
            handleGuideSearch();
        }
        filterGuideCat('all', document.querySelector('.cat-card'));
    }

    function filterGuideCat(catKey, el) {
        document.querySelectorAll('.cat-card').forEach(c => {
            c.style.borderColor = '#edf2f7';
            c.classList.remove('active');
        });
        if (el) {
            el.style.borderColor = '#00C853';
            el.classList.add('active');
        }

        const cards = document.querySelectorAll('.guide-card-enhanced');
        let count = 0;
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (catKey === 'all' || cardCat === catKey) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        const heading = document.getElementById('guideResultsHeading');
        const countSpan = document.getElementById('guideResultsCount');
        const noFound = document.getElementById('noGuidesFound');

        if (heading) heading.innerText = catKey === 'all' ? 'Showing All 47 Legal Guides' : 'Guides in ' + catKey.toUpperCase();
        if (countSpan) countSpan.innerText = count + ' results';
        if (noFound) noFound.style.display = count === 0 ? 'block' : 'none';
    }

    function toggleChecklistItem(cb) {
        const label = cb.closest('label');
        if (label) {
            if (cb.checked) {
                label.style.borderColor = '#00C853';
                label.style.background = '#f0fdf4';
            } else {
                label.style.borderColor = '#edf2f7';
                label.style.background = '#fff';
            }
        }
    }

    function toggleFaq(btn) {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        if (content.style.display === 'block') {
            content.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            content.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    const actionPlans = {
        'scammed-online': {
            title: 'Online Scam / Financial Fraud Action Plan',
            what: 'Unauthorized money deducted from bank account, UPI QR scam, or fraudulent online transaction.',
            firstSteps: ['Call Cyber Crime Helpline 1930 immediately within Golden Hour', 'Call your bank customer care to block debit cards & UPI ID'],
            evidence: ['Transaction UTR numbers, bank SMS screenshots, scammer UPI ID & phone number'],
            nextSteps: ['File online complaint at cybercrime.gov.in', 'Submit written dispute form at home bank branch'],
            seekHelp: 'If bank refuses zero-liability claim after 3 days, file Banking Ombudsman complaint.'
        },
        'landlord-deposit': {
            title: 'Security Deposit Non-Refund Action Plan',
            what: 'Landlord withholding security deposit without providing valid repair bills.',
            firstSteps: ['Send formal written email & WhatsApp summary requesting deposit refund', 'Gather flat handover photos & rent receipts'],
            evidence: ['Rent agreement copy, rent payment receipts, handover chat logs, inspection photos'],
            nextSteps: ['Draft and serve 15-day formal legal notice via advocate or registered post', 'Approach Rent Controller / Rent Tribunal'],
            seekHelp: 'If deposit amount exceeds 1 Lakh, approach civil court or Rent Authority.'
        },
        'police-refusal': {
            title: 'Police Refused FIR Action Plan',
            what: 'Station duty officer refused to record written FIR for cognizable offense.',
            firstSteps: ['Note station officer name & badge number', 'Send written complaint copy to District SP / DCP via Registered Post AD (Sec 173(4) BNSS)'],
            evidence: ['Postal receipt of complaint sent to SP, copy of written complaint, witness details'],
            nextSteps: ['File Section 175(3) BNSS application before Judicial Magistrate Court', 'Magistrate orders police to register FIR'],
            seekHelp: 'Consult a criminal advocate to draft Magistrate application under BNSS 175(3).'
        },
        'received-notice': {
            title: 'Received Legal Notice Action Plan',
            what: 'Advocate notice received demanding response or legal action within 15 days.',
            firstSteps: ['Note date of receipt and statutory deadline', 'Do not ignore or throw away notice'],
            evidence: ['Original notice envelope with postal stamp, transaction receipts, agreements'],
            nextSteps: ['Consult advocate immediately to draft formal reply refuting allegations', 'Send reply by Registered Post AD within 15 days'],
            seekHelp: 'Always consult an advocate to avoid admitting liability in notice replies.'
        },
        'court-summons': {
            title: 'Received Court Summons Action Plan',
            what: 'Judicial summons ordering appearance in civil or criminal court.',
            firstSteps: ['Check court name, case number, section, and appearance date', 'Engage advocate to inspect court file'],
            evidence: ['Original summons copy, identity documents, case-related evidence'],
            nextSteps: ['Appear through advocate on scheduled date or file vakalatnama', 'File written statement / bail application'],
            seekHelp: 'Failure to appear can result in Ex-Parte order or Non-Bailable Warrant (NBW).'
        },
        'traffic-stop': {
            title: 'Traffic Stop & Vehicle Check Action Plan',
            what: 'Stopped by traffic police officer for document verification or suspected violation.',
            firstSteps: ['Remain calm & polite; request officer name and rank (Sub-Inspector minimum for challans)', 'Show digital documents via DigiLocker / mParivahan app'],
            evidence: ['Challan slip copy, video recording if officer misbehaves'],
            nextSteps: ['Pay e-challan online or contest wrongful fine on Virtual Court portal (vcourts.gov.in)'],
            seekHelp: 'Traffic officer cannot forcefully remove ignition key from running vehicle.'
        },
        'defective-product': {
            title: 'Defective Product / Service Failure Action Plan',
            what: 'Seller or manufacturer refusing refund/replacement under warranty.',
            firstSteps: ['Send formal email complaint to customer support & nodalofficer', 'Register complaint on National Consumer Helpline (1915)'],
            evidence: ['Purchase invoice, warranty card, photos/videos of defect, email thread'],
            nextSteps: ['Send 15-day formal notice to seller & manufacturer', 'File online petition on e-Daakhil consumer portal'],
            seekHelp: 'Claim full purchase price refund, interest, and compensation for mental agony.'
        },
        'unpaid-salary': {
            title: 'Unpaid Salary / Illegal Termination Action Plan',
            what: 'Employer withholding monthly wages or full & final settlement.',
            firstSteps: ['Send formal demand email to HR & Managing Director specifying unpaid amount', 'Preserve appointment letter & payslips'],
            evidence: ['Offer letter, monthly payslips, bank statements, work emails, resignation acknowledgment'],
            nextSteps: ['Send formal legal notice demanding payment within 15 days', 'File complaint with State Labor Commissioner under Payment of Wages Act'],
            seekHelp: 'Labor court / Labor Commissioner provides fast-track remedy for wage recovery.'
        }
    };

    function openActionPlanModal(planKey) {
        var plan = actionPlans[planKey];
        if (!plan) return;
        var modal = document.getElementById('actionPlanModal');
        var body = document.getElementById('actionModalBody');
        if (!modal || !body) return;

        var firstStepsHtml = '';
        for (var i = 0; i < plan.firstSteps.length; i++) {
            firstStepsHtml += '<li>' + plan.firstSteps[i] + '</li>';
        }
        var evidenceHtml = '';
        for (var i = 0; i < plan.evidence.length; i++) {
            evidenceHtml += '<li>' + plan.evidence[i] + '</li>';
        }
        var nextStepsHtml = '';
        for (var i = 0; i < plan.nextSteps.length; i++) {
            nextStepsHtml += '<li>' + plan.nextSteps[i] + '</li>';
        }

        body.innerHTML = '<div style="text-align:left;">' +
            '<span style="background:#e8f5e9; color:#00C853; font-weight:800; font-size:12px; padding:4px 12px; border-radius:20px; text-transform:uppercase;">60-SECOND IMMEDIATE ACTION PLAN</span>' +
            '<h2 style="font-size:24px; font-weight:900; color:#111; margin:10px 0 16px;">' + plan.title + '</h2>' +
            '<div style="background:#f8fafc; border-left:4px solid #00C853; padding:16px; border-radius:10px; margin-bottom:20px;">' +
                '<strong style="color:#111; font-size:14px;">What Happened:</strong>' +
                '<p style="font-size:13.5px; color:#555; margin:4px 0 0;">' + plan.what + '</p>' +
            '</div>' +
            '<div style="margin-bottom:20px;">' +
                '<h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:8px;"><i class="fas fa-bolt" style="color:#00C853;"></i> Immediate First Steps:</h3>' +
                '<ul style="padding-left:20px; font-size:14px; color:#2d3748; line-height:1.6;">' + firstStepsHtml + '</ul>' +
            '</div>' +
            '<div style="margin-bottom:20px;">' +
                '<h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:8px;"><i class="fas fa-folder-open" style="color:#3182ce;"></i> Evidence to Preserve:</h3>' +
                '<ul style="padding-left:20px; font-size:14px; color:#2d3748; line-height:1.6;">' + evidenceHtml + '</ul>' +
            '</div>' +
            '<div style="margin-bottom:20px;">' +
                '<h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:8px;"><i class="fas fa-step-forward" style="color:#805ad5;"></i> Next Statutory Steps:</h3>' +
                '<ul style="padding-left:20px; font-size:14px; color:#2d3748; line-height:1.6;">' + nextStepsHtml + '</ul>' +
            '</div>' +
            '<div style="background:#fff5f5; border-radius:12px; padding:16px; border:1px solid #fed7d7;">' +
                '<strong style="color:#c53030; font-size:13px;"><i class="fas fa-user-shield"></i> When to Seek Advocate Assistance:</strong>' +
                '<p style="font-size:13px; color:#9b2c2c; margin:4px 0 0;">' + plan.seekHelp + '</p>' +
            '</div>' +
        '</div>';

        modal.style.display = 'flex';
    }

    function closeActionPlanModal() {
        const modal = document.getElementById('actionPlanModal');
        if (modal) modal.style.display = 'none';
    }
    </script>
    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'guides.html'), guidesHub, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'legal-guides/index.html'), guidesHub.replace(/legal-guides\//g, '').replace(/\.\/css\//g, '../css/'), 'utf8');


    expandedGuides.forEach(item => {
        const steps = item.steps || [
            { num: 1, heading: "Initial Assessment & Legal Framework", text: (item.learn && item.learn[0]) ? item.learn[0] : "Identify the applicable statutory provisions, rights, and relevant jurisdiction under BNS/BNSS 2023." },
            { num: 2, heading: "Gathering Evidence & Preparing Documentation", text: (item.learn && item.learn[1]) ? item.learn[1] : "Compile necessary receipts, notices, communications, and official documentation to build your legal file." },
            { num: 3, heading: "Formal Statutory Action & Legal Recourse", text: (item.learn && item.learn[2]) ? item.learn[2] : "Submit formal complaints, send statutory notices, or file petitions before competent court or tribunal." }
        ];
        const warnings = item.warnings || [
            "Ensure all statements submitted to police or court authorities are accurate and supported by admissible evidence under Bharatiya Sakshya Adhiniyam (BSA 2023)."
        ];

        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Practical Legal Guide`, item.summary, `${item.title}, legal procedure guide India, BNS BNSS 2023`, `/legal-guides/${item.slug}.html`, 1)}
        ${renderHeader('guides', 1)}

        <section class="page-header" style="padding-bottom:40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../guides.html" style="font-weight:700; color:var(--primary-dark); font-size:14px; text-decoration:none;"><i class="fas fa-arrow-left"></i> Back to Legal Guides Hub</a>
                <div style="margin-top:20px;">
                    <span class="cp-role" style="display:inline-block; background:#e8f5e9; color:#00C853; font-weight:800; padding:6px 16px; border-radius:20px; font-size:13px; text-transform:uppercase;">${item.category} • ${item.readTime || '5 MIN READ'}</span>
                </div>
                <h1 style="margin:12px 0 20px; font-size:2.8rem; font-weight:900; line-height:1.2; color:#111;">${item.title}</h1>
                <p style="margin:0; font-size:1.15rem; color:#555; max-width:850px; line-height:1.6;">${item.summary}</p>
            </div>
        </section>

        <section style="padding:60px 0 100px; background:#fff;">
            <div class="container" style="max-width:900px;">
                <div style="background:var(--white); border:1px solid #eee; border-radius:24px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                    <h2 style="font-size:24px; margin-bottom:28px; font-weight:900; color:#111;">Step-by-Step Practical Procedure</h2>
                    ${steps.map(s => `
                        <div style="display:flex; gap:20px; margin-bottom:28px;">
                            <div style="width:42px; height:42px; background:#00C853; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; flex-shrink:0; font-size:16px;">${s.num}</div>
                            <div>
                                <h3 style="font-size:18px; margin-bottom:6px; font-weight:800; color:#111;">${s.heading}</h3>
                                <p style="font-size:15px; color:#555; margin:0; line-height:1.6;">${s.text}</p>
                            </div>
                        </div>
                    `).join('')}

                    ${warnings.length ? `
                        <div style="background:#fff5f5; border-left:4px solid #e53e3e; padding:20px 24px; border-radius:14px; margin-top:32px;">
                            <strong style="color:#c53030; font-size:15px;"><i class="fas fa-exclamation-triangle"></i> Statutory Advisory & Warning:</strong>
                            ${warnings.map(w => `<p style="margin:6px 0 0; color:#9b2c2c; font-size:14px; line-height:1.6;">${w}</p>`).join('')}
                        </div>
                    ` : ''}

                    <div style="margin-top:32px; background:#f8fafc; border-radius:16px; padding:24px; border:1px solid #e2e8f0;">
                        <h3 style="font-size:16px; font-weight:800; color:#111; margin-bottom:12px;"><i class="fas fa-graduation-cap" style="color:#00C853;"></i> What You Learn in This Guide:</h3>
                        <ul style="padding-left:20px; font-size:14px; color:#2d3748; line-height:1.7; margin:0;">
                            ${(item.learn || []).map(l => `<li>${l}</li>`).join('')}
                        </ul>
                    </div>

                    <div style="margin-top:36px; text-align:center;">
                        <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="display:inline-flex; align-items:center; gap:10px; background:#00C853; color:#fff; padding:16px 36px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 4px 14px rgba(0,200,83,0.3);">
                            <i class="fas fa-robot"></i> Research "${item.title}" with NYAYI AI
                        </a>
                    </div>
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

        // Articles & Editorial Journal Data Model (24+ Verified Articles)
    const expandedArticles = [
        {
            slug: "bns-2023-structural-shifts",
            title: "Understanding Bharatiya Nyaya Sanhita (BNS) 2023: Key Structural Shifts from IPC",
            category: "Criminal Law",
            catKey: "criminal",
            type: "LAW UPDATE",
            typeKey: "update",
            date: "13 SEPT 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Comprehensive analysis of BNS 2023 replacing the 1860 IPC, introducing community service penalties, organized crime definitions, and updated offences against women.",
            tags: ["BNS 2023", "IPC Replacement", "Criminal Code", "Community Service"],
            atAGlance: [
                "Replaces 164-year-old IPC 1860 with 358 structured sections.",
                "Introduces community service as a formal statutory punishment.",
                "Codifies organized crime, terrorist acts, and hit-and-run regulations under Section 106.",
                "Streamlines definitions for gender neutrality in specific procedural provisions."
            ],
            toc: [
                { id: "overview", label: "Structural Overview" },
                { id: "key-changes", label: "Key Legislative Changes" },
                { id: "community-service", label: "Community Service & Punishments" },
                { id: "practical-impact", label: "Practical Impact on Citizens" }
            ],
            takeaways: [
                "IPC 1860 is fully replaced for offences committed after July 1, 2024.",
                "Hit-and-run provisions carry enhanced penal terms under BNS Sec 106(2).",
                "Mob lynching and hate crimes receive specific statutory definitions and penalties."
            ],
            relatedLaw: "Bharatiya Nyaya Sanhita 2023",
            relatedRights: "Right to Fair Trial & Legal Certainty",
            relatedTerms: ["BNS", "Cognizable Offence", "Community Service"]
        },
        {
            slug: "bnss-2023-criminal-procedure-changes",
            title: "Bharatiya Nagarik Suraksha Sanhita: What Changed in Criminal Procedure?",
            category: "Legal Updates",
            catKey: "updates",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "10 SEPT 2026",
            readTime: "8 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Detailed guide on BNSS 2023 replacing CrPC 1973, mandating electronic FIRs, forensic investigation deadlines, and 14-day preliminary inquiry rules.",
            tags: ["BNSS 2023", "CrPC Replacement", "e-FIR", "Forensics", "Bail"],
            atAGlance: [
                "Mandatory forensic investigation for offences punishable by 7+ years.",
                "Zero FIR legal entitlement codified under Section 173.",
                "Statutory 14-day deadline for preliminary inquiry before FIR registration."
            ],
            toc: [
                { id: "procedural-shift", label: "The Shift from CrPC to BNSS" },
                { id: "digital-fir", label: "e-FIR & Zero FIR Mandate" },
                { id: "forensic-rules", label: "Mandatory Forensic Sampling" }
            ],
            takeaways: [
                "Police must send investigation progress reports electronically within 90 days.",
                "Trial courts bound by strict timelines for judgment pronouncement (45 days post-hearing)."
            ],
            relatedLaw: "Bharatiya Nagarik Suraksha Sanhita 2023",
            relatedRights: "Police Arrest Safeguards",
            relatedTerms: ["BNSS", "Zero FIR", "Summary Trial"]
        },
        {
            slug: "bsa-2023-evidence-framework",
            title: "Bharatiya Sakshya Adhiniyam: Understanding India's New Evidence Framework",
            category: "Indian Laws",
            catKey: "laws",
            type: "LEGAL CONCEPT",
            typeKey: "concept",
            date: "05 SEPT 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Editorial",
            summary: "An explainer on BSA 2023 replacing the Indian Evidence Act 1872, recognizing electronic records as primary evidence and Section 63 certificate rules.",
            tags: ["BSA 2023", "Digital Evidence", "Section 63", "Electronic Records"],
            atAGlance: [
                "Electronic and digital records given statutory status as primary evidence.",
                "Mandatory electronic certificate requirements simplified under BSA Section 63.",
                "Expanded definitions of document to include server logs, emails, and messaging apps."
            ],
            toc: [
                { id: "evidence-evolution", label: "Evolution of Indian Evidence Rules" },
                { id: "digital-primacy", label: "Digital Records as Primary Evidence" },
                { id: "sec63-cert", label: "Section 63 Certificate Mechanics" }
            ],
            takeaways: [
                "Digital records stored in cloud or phone storage possess full evidentiary value.",
                "Secondary evidence rules updated for digital media backups and server hash logs."
            ],
            relatedLaw: "Bharatiya Sakshya Adhiniyam 2023",
            relatedRights: "Right against Self-Incrimination",
            relatedTerms: ["BSA", "Admissible Evidence", "Primary Evidence"]
        },
        {
            slug: "digital-evidence-audio-video-bsa-63",
            title: "Digital Evidence and Audio-Video Recording Under Section 63 BSA 2023",
            category: "Cyber & Technology",
            catKey: "cyber",
            type: "STUDENT NOTE",
            typeKey: "student",
            date: "01 SEPT 2026",
            readTime: "5 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "How audio-video crime scene recordings and digital messages are certified and presented before Indian courts under Section 63 of BSA 2023.",
            tags: ["BSA Section 63", "CCTV Footage", "Hash Code", "Audio Video"],
            atAGlance: [
                "Replaces Section 65B certificate of Evidence Act 1872.",
                "Requires person managing electronic system to sign statutory certificate.",
                "Mandatory video recording of search and seizure procedures by police officers."
            ],
            toc: [
                { id: "recording-mandate", label: "Mandatory Seizure Recording" },
                { id: "certificate-format", label: "Section 63 Certificate Requirements" }
            ],
            takeaways: [
                "Uncertified digital printouts are inadmissible as secondary evidence without Sec 63 compliance.",
                "CCTV footage and WhatsApp exports require timeline & device hash validation."
            ],
            relatedLaw: "Bharatiya Sakshya Adhiniyam Sec 63",
            relatedRights: "Digital Privacy Rights",
            relatedTerms: ["Section 63 BSA", "Hash Value", "Secondary Evidence"]
        },
        {
            slug: "article-21-personal-liberty-privacy",
            title: "Understanding Article 21 and Personal Liberty in Modern India",
            category: "Constitution",
            catKey: "constitution",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "25 AUG 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Exploring how Supreme Court jurisprudence expanded Article 21 to cover right to privacy, speedy trial, clean environment, and dignity.",
            tags: ["Article 21", "Fundamental Rights", "Privacy", "Puttaswamy"],
            atAGlance: [
                "No person deprived of life or personal liberty except according to procedure established by law.",
                "Puttaswamy judgment incorporated Right to Privacy as intrinsic to Article 21.",
                "Covers sub-rights: Right to Livelihood, Clean Water, Legal Aid, and Speedy Trial."
            ],
            toc: [
                { id: "core-principle", label: "Core Scope of Article 21" },
                { id: "privacy-ruling", label: "Privacy Landmark (Puttaswamy)" },
                { id: "expanded-rights", label: "The Spectrum of Expanded Rights" }
            ],
            takeaways: [
                "Procedure established by law must be just, fair, and reasonable (Maneka Gandhi doctrine).",
                "Illegal police detention or wiretapping without statutory warrant violates Article 21."
            ],
            relatedLaw: "Constitution of India Article 21",
            relatedRights: "Right to Life & Personal Liberty",
            relatedTerms: ["Article 21", "Procedure Established by Law", "Due Process"]
        },
        {
            slug: "article-14-right-to-equality-explained",
            title: "What Does the Right to Equality Under Article 14 Mean?",
            category: "Constitution",
            catKey: "constitution",
            type: "LEGAL CONCEPT",
            typeKey: "concept",
            date: "20 AUG 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Editorial",
            summary: "Analyzing Equality Before Law and Equal Protection of Laws under Article 14, reasonable classification, and anti-arbitrariness principles.",
            tags: ["Article 14", "Equality", "Reasonable Classification", "Rule of Law"],
            atAGlance: [
                "Equality Before Law (British concept) + Equal Protection of Laws (American concept).",
                "Permits reasonable classification based on intelligible differentia.",
                "Non-arbitrariness doctrine: Arbitrary executive state action strikes at Article 14."
            ],
            toc: [
                { id: "two-limbs", label: "The Two Limbs of Article 14" },
                { id: "classification-test", label: "The Test of Reasonable Classification" }
            ],
            takeaways: [
                "Equals must be treated equally; unequals cannot be treated equally without affirmative action.",
                "State policies failing intelligible differentia test are declared unconstitutional."
            ],
            relatedLaw: "Constitution of India Article 14",
            relatedRights: "Right to Equality",
            relatedTerms: ["Article 14", "Rule of Law", "Arbitrariness"]
        },
        {
            slug: "article-32-constitutional-remedies-writs",
            title: "How Constitutional Remedies Work Under Article 32 & 226",
            category: "Constitution",
            catKey: "constitution",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "15 AUG 2026",
            readTime: "8 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "The heart and soul of the Indian Constitution: how citizens file Habeas Corpus, Mandamus, Certiorari, Prohibition, and Quo Warranto writs.",
            tags: ["Article 32", "Writs", "Supreme Court", "Habeas Corpus"],
            atAGlance: [
                "Dr. B.R. Ambedkar termed Article 32 the 'Heart and Soul' of the Constitution.",
                "Article 32 petition lies directly before Supreme Court for fundamental rights breach.",
                "Article 226 empowers High Courts for fundamental rights + any other statutory legal right."
            ],
            toc: [
                { id: "writ-overview", label: "Overview of Constitutional Remedies" },
                { id: "five-writs", label: "The 5 Constitutional Writs Explained" }
            ],
            takeaways: [
                "Habeas Corpus is an emergency remedy against illegal police custody.",
                "Mandamus compels public officers to perform mandatory legal duties."
            ],
            relatedLaw: "Constitution Articles 32 & 226",
            relatedRights: "Right to Constitutional Remedies",
            relatedTerms: ["Article 32", "Habeas Corpus", "Mandamus"]
        },
        {
            slug: "understanding-bail-criminal-law-bnss",
            title: "Understanding Bail, Anticipatory Bail, and Surety in Indian Criminal Law",
            category: "Criminal Law",
            catKey: "criminal",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "10 AUG 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Detailed breakdown of bailable vs non-bailable offences, anticipatory bail under BNSS Sec 482, regular bail Sec 479/480, and bail bond conditions.",
            tags: ["Bail", "Anticipatory Bail", "BNSS 482", "Surety", "Personal Bond"],
            atAGlance: [
                "Bail is a statutory right in bailable offences (BNSS Sec 478).",
                "Anticipatory bail protects individuals apprehending arrest in non-bailable cases.",
                "BNSS Section 479 allows first-time offenders to seek release after completing 1/3rd sentence in detention."
            ],
            toc: [
                { id: "types-of-bail", label: "Types of Bail in India" },
                { id: "anticipatory-process", label: "Anticipatory Bail Application" }
            ],
            takeaways: [
                "Rule: 'Bail is the rule, jail is the exception' (State of Rajasthan v. Balchand).",
                "Failure to abide by bail conditions results in immediate bail cancellation."
            ],
            relatedLaw: "Bharatiya Nagarik Suraksha Sanhita Sec 478-482",
            relatedRights: "Right to Personal Freedom",
            relatedTerms: ["Bail", "Anticipatory Bail", "Bail Bond"]
        },
        {
            slug: "fir-vs-police-complaint-difference",
            title: "FIR vs Police Complaint: Key Legal Differences Explained",
            category: "Criminal Law",
            catKey: "criminal",
            type: "STUDENT NOTE",
            typeKey: "student",
            date: "05 AUG 2026",
            readTime: "5 MIN READ",
            author: "NYAYI Editorial",
            summary: "Comparing First Information Report (FIR) under BNSS 173 with written police complaints under BNSS 174 (NCR), investigation rights, and remedies.",
            tags: ["FIR", "Police Complaint", "Cognizable", "NCR", "BNSS 173"],
            atAGlance: [
                "FIR applies strictly to cognizable offences; police can arrest without warrant.",
                "Police complaints apply to non-cognizable cases; entered into Non-Cognizable Register.",
                "Informant gets a mandatory free copy of FIR with official registration stamp."
            ],
            toc: [
                { id: "core-differences", label: "Core Differences Table" },
                { id: "when-to-file", label: "When to Lodge FIR vs Complaint" }
            ],
            takeaways: [
                "Police cannot investigate non-cognizable complaint without Magistrate's order.",
                "Zero FIR can be lodged at any police station regardless of jurisdiction."
            ],
            relatedLaw: "BNSS Section 173 & 174",
            relatedRights: "Right to Information on Offence",
            relatedTerms: ["FIR", "Cognizable Offence", "NCR"]
        },
        {
            slug: "post-fir-investigation-chargesheet",
            title: "What Happens After an FIR Is Registered? Police Investigation & Chargesheet",
            category: "Criminal Law",
            catKey: "criminal",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "01 AUG 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Step-by-step criminal process: spot inspection, witness statements under BNSS 180, search warrants, arrest memos, and final chargesheet under BNSS 193.",
            tags: ["Police Investigation", "Chargesheet", "BNSS 193", "Closure Report"],
            atAGlance: [
                "Investigating Officer (IO) collects evidence and records witness statements.",
                "Statutory 60 to 90-day deadline for filing final chargesheet in court.",
                "If IO finds no evidence, police submit a Final Closure Report."
            ],
            toc: [
                { id: "investigation-steps", label: "Investigation Stages" },
                { id: "chargesheet-filing", label: "Filing Chargesheet (Sec 193 BNSS)" }
            ],
            takeaways: [
                "Complainant has right to receive notice if police file a closure report.",
                "Accused entitled to complete chargesheet copy free of cost before trial."
            ],
            relatedLaw: "BNSS Section 176-193",
            relatedRights: "Right to Fair Trial",
            relatedTerms: ["Chargesheet", "Investigating Officer", "Closure Report"]
        },
        {
            slug: "understanding-legal-notices-india",
            title: "Understanding Formal Legal Notices in India: Draft, Response, and Timelines",
            category: "Civil Law",
            catKey: "civil",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "25 JULY 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Why legal notices are served before civil suits, mandatory elements, delivery via Registered Post AD, statutory response windows, and legal consequences.",
            tags: ["Legal Notice", "Registered Post", "Civil Suit", "CPC Sec 80"],
            atAGlance: [
                "Formal written communication served through advocate before initiating civil litigation.",
                "Gives opposite party 15 to 60 days to resolve dispute out of court.",
                "Mandatory in Cheque Bounce (Sec 138 NI Act) and suits against Government (CPC Sec 80)."
            ],
            toc: [
                { id: "notice-structure", label: "Structure of a Legal Notice" },
                { id: "responding-rules", label: "How to Respond to a Notice" }
            ],
            takeaways: [
                "Never ignore a formal legal notice; failure to reply creates adverse inference in court.",
                "Proof of delivery (Registered Post AD / Speed Post tracking) is mandatory evidence."
            ],
            relatedLaw: "Code of Civil Procedure Sec 80 & NI Act Sec 138",
            relatedRights: "Pre-Litigation Settlement Safeguards",
            relatedTerms: ["Legal Notice", "Registered Post AD", "Cause of Action"]
        },
        {
            slug: "consumer-complaints-cpa-2019-guide",
            title: "Consumer Complaints: Statutory Rights and Compensation under CPA 2019",
            category: "Consumer Law",
            catKey: "consumer",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "20 JULY 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Editorial",
            summary: "How Consumer Protection Act 2019 protects buyers from defective goods, service deficiency, misleading ads, product liability, and e-Daakhil filing.",
            tags: ["CPA 2019", "Consumer Court", "e-Daakhil", "Product Liability"],
            atAGlance: [
                "Pecuniary limits: District Commission (up to 50 Lakhs), State (up to 2 Crores), National (above 2 Crores).",
                "E-Commerce platforms held legally responsible for seller misconduct and fake items.",
                "Online complaint submission available via edaakhil.nic.in without hiring a lawyer."
            ],
            toc: [
                { id: "consumer-rights", label: "6 Statutory Consumer Rights" },
                { id: "filing-edaakhil", label: "Filing Online via e-Daakhil" }
            ],
            takeaways: [
                "Product liability provisions allow claiming damages from manufacturer for injury.",
                "National Consumer Helpline 1915 provides instant pre-court mediation."
            ],
            relatedLaw: "Consumer Protection Act 2019",
            relatedRights: "Consumer Safeguards & Product Liability",
            relatedTerms: ["Deficiency in Service", "Product Liability", "e-Daakhil"]
        },
        {
            slug: "tenant-landlord-disputes-model-tenancy",
            title: "Understanding Tenant and Landlord Disputes under Model Tenancy Act",
            category: "Property & Tenancy",
            catKey: "property",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "15 JULY 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Model Tenancy Act provisions: security deposit caps (2 months residential), 30-day deposit refund timeline, rent authority jurisdiction, and eviction notice rules.",
            tags: ["Model Tenancy Act", "Security Deposit", "Rent Agreement", "Eviction"],
            atAGlance: [
                "Caps security deposit to maximum 2 months rent for residential premises.",
                "Landlords cannot cut off essential utilities (water, electricity) during disputes.",
                "Mandatory registration of rent agreements with District Rent Authority."
            ],
            toc: [
                { id: "deposit-limits", label: "Security Deposit & Refund Rules" },
                { id: "eviction-grounds", label: "Valid Grounds for Eviction Notice" }
            ],
            takeaways: [
                "Deductions from security deposit must be backed by original repair receipts.",
                "Forced lockouts by landlords without Rent Court order are illegal."
            ],
            relatedLaw: "Model Tenancy Act & State Rent Acts",
            relatedRights: "Tenant Protection against Arbitrary Eviction",
            relatedTerms: ["Rent Agreement", "Rent Controller", "Security Deposit"]
        },
        {
            slug: "cyber-fraud-helpline-1930-legal-response",
            title: "Cyber Fraud: Understanding the Golden Hour Response & 1930 Helpline",
            category: "Cyber & Technology",
            catKey: "cyber",
            type: "LAW UPDATE",
            typeKey: "update",
            date: "10 JULY 2026",
            readTime: "5 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Emergency protocol for financial cyber fraud: dialing 1930 helpline within Golden Hour, account freezing mechanisms, and cybercrime.gov.in portal reporting.",
            tags: ["Cyber Crime", "1930 Helpline", "Golden Hour", "Financial Fraud"],
            atAGlance: [
                "Golden Hour (first 1-2 hours) is critical to freeze stolen money in recipient bank accounts.",
                "1930 Helpline connects directly to National Cybercrime Reporting Portal (NCRP).",
                "Automated bank alerts block fraud money movement across interbank payment gateways."
            ],
            toc: [
                { id: "golden-hour", label: "The Golden Hour Concept" },
                { id: "ncrp-portal", label: "Filing Complaint on cybercrime.gov.in" }
            ],
            takeaways: [
                "Keep transaction reference numbers (UTR), bank SMS, and suspect UPI IDs ready.",
                "RBI guidelines provide zero liability if unauthorized electronic transaction reported in 3 days."
            ],
            relatedLaw: "Information Technology Act 2000 & RBI Circulars",
            relatedRights: "Financial Customer Protection",
            relatedTerms: ["1930 Helpline", "NCRP", "Zero Liability"]
        },
        {
            slug: "digital-privacy-data-protection-act",
            title: "Digital Privacy and Indian Law: The Digital Personal Data Protection Act 2023",
            category: "Cyber & Technology",
            catKey: "cyber",
            type: "LEGAL CONCEPT",
            typeKey: "concept",
            date: "05 JULY 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Editorial",
            summary: "Analyzing DPDP Act 2023: Data Principal rights, Data Fiduciary obligations, notice consent requirements, and penalties up to ₹250 Crores for data breaches.",
            tags: ["DPDP Act 2023", "Data Privacy", "Consent", "Data Protection Board"],
            atAGlance: [
                "Establishes statutory framework for processing digital personal data in India.",
                "Data Fiduciaries must obtain clear, explicit, and withdrawable consent.",
                "Data Principals possess Right to Access, Correction, Erasure, and Grievance Redressal."
            ],
            toc: [
                { id: "dpdp-architecture", label: "Architecture of DPDP Act 2023" },
                { id: "citizen-rights", label: "Rights of Data Principals" }
            ],
            takeaways: [
                "Penalties up to ₹250 Crores for failure to take reasonable security safeguards against breaches.",
                "Establishes Data Protection Board of India for digital inquiry and enforcement."
            ],
            relatedLaw: "Digital Personal Data Protection Act 2023",
            relatedRights: "Right to Data Privacy under Art 21",
            relatedTerms: ["Data Principal", "Data Fiduciary", "Consent Notice"]
        },
        {
            slug: "posh-act-workplace-sexual-harassment",
            title: "Understanding Workplace Sexual Harassment Law: The POSH Act 2013 Framework",
            category: "Women & Family",
            catKey: "women",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "01 JULY 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Complete guide on Sexual Harassment of Women at Workplace Act 2013: Internal Committee (IC) setup, 90-day inquiry timelines, interim relief, and confidentiality.",
            tags: ["POSH Act 2013", "Workplace Harassment", "Internal Committee", "IC Inquiry"],
            atAGlance: [
                "Mandatory for all organizations with 10+ employees to constitute Internal Committee (IC).",
                "IC headed by senior woman employee; minimum 50% women members + external independent member.",
                "Complaint must be lodged in writing within 3 months of incident."
            ],
            toc: [
                { id: "ic-constitution", label: "Constitution of Internal Committee" },
                { id: "inquiry-procedure", label: "90-Day Inquiry Procedure & Relief" }
            ],
            takeaways: [
                "Complainant entitled to interim relief (transfer, 3 months paid leave) during inquiry.",
                "Strict statutory confidentiality: Publishing victim identity invites statutory penalty."
            ],
            relatedLaw: "POSH Act 2013",
            relatedRights: "Right to Safe Workplace under Art 14 & 21",
            relatedTerms: ["Internal Committee", "Quid Pro Quo", "Hostile Work Environment"]
        },
        {
            slug: "rti-act-framework-citizen-empowerment",
            title: "RTI: Understanding the Right to Information Framework & Appeals Process",
            category: "Citizen Rights",
            catKey: "rights",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "25 JUNE 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Drafting RTI queries under RTI Act 2005, identifying Public Information Officer (PIO), statutory 30-day deadline, First Appeal, and Central Information Commission.",
            tags: ["RTI Act 2005", "PIO", "First Appeal", "Public Authority"],
            atAGlance: [
                "Empowers citizens to request information from public authorities holding government records.",
                "PIO legally bound to supply information within 30 days (48 hours for life/liberty).",
                "Section 8 specifies limited exemptions (national security, trade secrets)."
            ],
            toc: [
                { id: "drafting-rti", label: "How to Draft Precise RTI Queries" },
                { id: "appeals-process", label: "First Appeal & Second Appeal Timelines" }
            ],
            takeaways: [
                "Do not ask for opinions or hypothetical answers; request specific existing records.",
                "Penalty of ₹250 per day imposed on PIO for unwarranted delay or refusal."
            ],
            relatedLaw: "Right to Information Act 2005",
            relatedRights: "Freedom of Information under Art 19(1)(a)",
            relatedTerms: ["RTI", "Public Information Officer", "First Appeal"]
        },
        {
            slug: "legal-aid-lsa-act-access-justice",
            title: "Legal Aid and Access to Justice under Legal Services Authorities Act 1987",
            category: "Citizen Rights",
            catKey: "rights",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "20 JUNE 2026",
            readTime: "5 MIN READ",
            author: "NYAYI Editorial",
            summary: "Who qualifies for free legal services in India (women, children, SC/ST, custody victims, low income), DLSA/SLSA role, and Lok Adalat dispute settlement.",
            tags: ["Legal Aid", "LSA Act 1987", "DLSA", "Lok Adalat", "Free Lawyer"],
            atAGlance: [
                "Article 39A mandates State to provide free legal aid to ensure justice is not denied due to economic disability.",
                "Section 12 LSA Act lists eligible groups: women, children, SC/ST, custody victims, low-income citizens.",
                "District Legal Services Authority (DLSA) assigns panel advocate free of costs."
            ],
            toc: [
                { id: "eligibility-sec12", label: "Eligibility under Section 12" },
                { id: "lok-adalat", label: "Lok Adalat & Pre-Litigation Settlement" }
            ],
            takeaways: [
                "Free legal aid covers court fee, lawyer fees, drafting charges, and document copies.",
                "Lok Adalat awards hold finality equivalent to a civil court decree; no appeal lies against mutual settlement."
            ],
            relatedLaw: "Legal Services Authorities Act 1987 & Art 39A",
            relatedRights: "Right to Free Legal Services",
            relatedTerms: ["DLSA", "Lok Adalat", "Section 12 LSA"]
        },
        {
            slug: "supreme-court-fundamental-rights-interpretation",
            title: "How Indian Courts Interpret Fundamental Rights & Basic Structure Doctrine",
            category: "Courts & Judgments",
            catKey: "courts",
            type: "COURT & JUDGMENT",
            typeKey: "judgment",
            date: "15 JUNE 2026",
            readTime: "8 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Analyzing landmark Supreme Court rulings (*Kesavananda Bharati*, *Maneka Gandhi*, *Minerva Mills*) that established the Basic Structure Doctrine and purposive interpretation.",
            tags: ["Supreme Court", "Basic Structure", "Kesavananda Bharati", "Judicial Review"],
            atAGlance: [
                "Kesavananda Bharati (1973): Parliament cannot alter basic structure of Constitution.",
                "Judicial review, supremacy of Constitution, secularism, and judicial independence constitute basic features.",
                "Maneka Gandhi (1978): Expands procedure established by law to include fairness & reasonableness."
            ],
            toc: [
                { id: "basic-structure-origin", label: "Origin of Basic Structure Doctrine" },
                { id: "purposive-rule", label: "Purposive & Harmonious Construction" }
            ],
            takeaways: [
                "Constitutional amendments violating basic structure are declared void by Supreme Court.",
                "Fundamental Rights (Part III) and Directive Principles (Part IV) form the core balance."
            ],
            relatedLaw: "Constitution of India Part III & Art 368",
            relatedRights: "Right to Judicial Review",
            relatedTerms: ["Basic Structure", "Judicial Review", "Purposive Construction"]
        },
        {
            slug: "cheque-bounce-138-ni-act-procedure",
            title: "Cheque Bounce Laws: Section 138 NI Act Procedure & Statutory Notice",
            category: "Business & Corporate",
            catKey: "business",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "10 JUNE 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Criminal prosecution for dishonored cheques under Negotiable Instruments Act: bank memo, mandatory 30-day statutory notice, 15-day payment window, and magistrate complaint.",
            tags: ["Cheque Bounce", "Section 138 NI Act", "Statutory Notice", "Bank Memo"],
            atAGlance: [
                "Cheque dishonored due to insufficient funds constitutes offence under Sec 138 NI Act.",
                "Mandatory 30-day statutory legal notice period from receipt of bank dishonor memo.",
                "Payee must grant 15-day window to drawer to pay cheque amount before filing complaint."
            ],
            toc: [
                { id: "statutory-timeline", label: "Mandatory Statutory Timelines" },
                { id: "court-filing", label: "Filing Complaint in Magistrate Court" }
            ],
            takeaways: [
                "Complaint must be filed within 30 days after expiry of 15-day notice period.",
                "Offence carries penalty up to double the cheque amount or 2 years imprisonment."
            ],
            relatedLaw: "Negotiable Instruments Act Section 138",
            relatedRights: "Financial Enforcement Rights",
            relatedTerms: ["Section 138 NI Act", "Dishonor Memo", "Statutory Notice"]
        },
        {
            slug: "property-partition-legal-heir-rights",
            title: "Ancestral Property & Legal Heir Succession Rights in Hindu Law",
            category: "Property & Tenancy",
            catKey: "property",
            type: "LEGAL EXPLAINER",
            typeKey: "explainer",
            date: "05 JUNE 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Editorial",
            summary: "Coparcenary rights, Hindu Succession (Amendment) Act 2005 equal rights for daughters, partition suits, and legal heir certificate procedures.",
            tags: ["Ancestral Property", "Hindu Succession Act", "Coparcener", "Daughter Rights"],
            atAGlance: [
                "2005 Amendment granted equal coparcenary rights to daughters by birth in ancestral property.",
                "Vineeta Sharma v. Rakesh Sharma landmark (2020) confirmed retroactive coparcenary status.",
                "Partition suit can be filed in civil court if coparceners refuse mutual partition."
            ],
            toc: [
                { id: "coparcenary-explained", label: "Coparcenary vs Self-Acquired Property" },
                { id: "daughter-rights", label: "Equal Rights of Daughters (Vineeta Sharma)" }
            ],
            takeaways: [
                "Self-acquired property of father can be willed away freely without children consent.",
                "Ancestral property remains undivided up to 4 generations of joint family."
            ],
            relatedLaw: "Hindu Succession Act 1956 & 2005 Amendment",
            relatedRights: "Gender Equality in Inheritance",
            relatedTerms: ["Coparcener", "Partition Suit", "Legal Heir Certificate"]
        },
        {
            slug: "motor-accidents-mact-compensation-rules",
            title: "Motor Accident Compensation: MACT Claim Tribunal Procedure",
            category: "Labour & Employment",
            catKey: "labour",
            type: "CITIZEN GUIDE",
            typeKey: "guide",
            date: "01 JUNE 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Legal Editorial Board",
            summary: "Filing claim before Motor Accident Claims Tribunal (MACT) under MV Act, Detailed Accident Report (DAR), third-party insurance liability, and compensation calculation.",
            tags: ["MACT", "Motor Vehicles Act", "DAR Report", "Third Party Insurance"],
            atAGlance: [
                "MACT tribunals hear claims for road accident injury, permanent disability, or death.",
                "Police Detailed Accident Report (DAR) serves as primary evidence in tribunal.",
                "Third-party insurance cover mandatory for all vehicles registered in India."
            ],
            toc: [
                { id: "mact-procedure", label: "MACT Claim Procedure & DAR" },
                { id: "compensation-formula", label: "Calculating Compensation Amounts" }
            ],
            takeaways: [
                "No-fault liability provisions grant immediate interim relief to victims.",
                "Multiplier method used by tribunals to compute future loss of income."
            ],
            relatedLaw: "Motor Vehicles Act 1988 (2019 Amendment)",
            relatedRights: "Road Accident Victim Compensation Rights",
            relatedTerms: ["MACT", "DAR", "Third Party Insurance"]
        },
        {
            slug: "arbitration-adr-commercial-dispute-resolution",
            title: "Arbitration & Conciliation Act: Modern Alternative Dispute Resolution in India",
            category: "Business & Corporate",
            catKey: "business",
            type: "LEGAL CONCEPT",
            typeKey: "concept",
            date: "25 MAY 2026",
            readTime: "7 MIN READ",
            author: "NYAYI Legal Research Division",
            summary: "Alternative Dispute Resolution (ADR) under Arbitration & Conciliation Act 1996: arbitration agreements, arbitral tribunal awards, 12-month timeline, and Section 34 challenge.",
            tags: ["Arbitration", "ADR", "Arbitral Award", "Section 34"],
            atAGlance: [
                "ADR offers out-of-court binding resolution for commercial and contractual disputes.",
                "2015 & 2019 Amendments mandate 12-month fast-track timeline for arbitral awards.",
                "Arbitral award holds finality and enforceability equal to a civil court decree."
            ],
            toc: [
                { id: "arbitration-clause", label: "Drafting Valid Arbitration Clauses" },
                { id: "enforcement-award", label: "Enforcement & Challenge under Sec 34" }
            ],
            takeaways: [
                "Courts strictly enforce arbitration clauses and refer parties to arbitration (Sec 8).",
                "Setting aside arbitral award under Sec 34 limited to narrow grounds (patent illegality)."
            ],
            relatedLaw: "Arbitration and Conciliation Act 1996",
            relatedRights: "Speedy Dispute Settlement Rights",
            relatedTerms: ["Arbitration", "Arbitral Award", "ADR"]
        },
        {
            slug: "understanding-workplace-posh-ic-procedure",
            title: "POSH Inquiry Procedure: Duties of Employers & Internal Committees",
            category: "Labour & Employment",
            catKey: "labour",
            type: "LAW UPDATE",
            typeKey: "update",
            date: "20 MAY 2026",
            readTime: "6 MIN READ",
            author: "NYAYI Editorial",
            summary: "Detailed walk-through of POSH Internal Committee inquiry timelines, conciliation, principles of natural justice, and employer compliance mandates.",
            tags: ["POSH Act", "Internal Committee", "Natural Justice", "Employer Compliance"],
            atAGlance: [
                "IC must complete inquiry within maximum 90 days of receiving written complaint.",
                "Principles of Natural Justice must be followed: both parties get opportunity to present evidence.",
                "Employer must act on IC recommendations within 60 days of receiving report."
            ],
            toc: [
                { id: "conciliation-step", label: "Conciliation Option before Inquiry" },
                { id: "ic-report-action", label: "IC Final Report & Employer Action" }
            ],
            takeaways: [
                "Non-compliance with POSH IC setup attracts ₹50,000 fine and business license cancellation.",
                "Annual POSH compliance report filing mandatory with District Officer."
            ],
            relatedLaw: "POSH Act 2013 & Rules",
            relatedRights: "Dignity at Workplace",
            relatedTerms: ["Internal Committee", "POSH Compliance", "Natural Justice"]
        }
    ];

    const articlesHub = `
    ${renderHead('Legal Articles, Explainers & Editorial Journal | NYAYI Legal AI', 'Understand important developments in Indian law through clear explainers, legal analysis, BNS 2023 updates, and practical legal insights.', 'Indian Law Articles, legal news India, law explainers, BNS updates, Supreme Court judgments explained, Constitution explainers', '/articles.html', 0)}
    ${renderHeader('articles', 0)}

    <!-- SECTION 1: HERO HEADER -->
    <section class="page-header" style="padding: 150px 0 50px; background: linear-gradient(180deg, #f4f7f6 0%, #ffffff 100%);">
        <div class="container" style="text-align: center; max-width: 900px;" data-aos="zoom-in">
            <span class="cp-role" style="display:inline-block; margin-bottom:16px; background:#e8f5e9; color:#00C853; font-weight:800; padding:6px 18px; border-radius:30px; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
                <i class="fas fa-newspaper"></i> NYAYI Legal Journal
            </span>
            <h1 style="font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 20px; color: #111;">
                Legal Articles & <span style="color:#00C853;">Updates</span>
            </h1>
            <p style="font-size: 1.25rem; color: #555; max-width: 780px; margin: 0 auto 30px; line-height: 1.6;">
                Understand important developments in Indian law through clear explainers, legal analysis, BNS 2023 breakdowns, and practical citizen insights.
            </p>
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <a href="#explore-articles" class="card-link" style="background:#00C853; color:#fff; padding:14px 32px; border-radius:12px; font-weight:700; text-decoration:none; font-size:15px; box-shadow: 0 4px 14px rgba(0,200,83,0.3);">
                    Explore Articles <i class="fas fa-arrow-down"></i>
                </a>
                <a href="#popular-topics" class="card-link" style="background:#111; color:#fff; padding:14px 32px; border-radius:12px; font-weight:700; text-decoration:none; font-size:15px;">
                    <i class="fas fa-th-large"></i> Browse Legal Topics
                </a>
            </div>
        </div>
    </section>

    <!-- SECTION 2: FEATURED ARTICLE ("EDITOR'S PICK") -->
    <section style="padding: 50px 0; background: #fff;">
        <div class="container">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
                <span style="font-size:12px; font-weight:900; color:#00C853; text-transform:uppercase; letter-spacing:1px; background:#e8f5e9; padding:4px 14px; border-radius:20px;">
                    <i class="fas fa-star"></i> Editor's Pick
                </span>
                <span style="font-size:13px; color:#718096; font-weight:600;">Featured Editorial Analysis</span>
            </div>

            <div class="editor-pick-grid">
                <!-- DOMINANT FEATURE CARD -->
                <div class="editor-pick-card" data-aos="fade-up">
                    <div>
                        <div style="display:flex; gap:12px; align-items:center; margin-bottom:14px; flex-wrap:wrap;">
                            <span class="type-badge update">LAW UPDATE</span>
                            <span style="font-size:12px; font-weight:700; color:#00C853; background:#f0fdf4; padding:3px 10px; border-radius:12px;">CRIMINAL LAW</span>
                            <span style="font-size:12px; color:#a0aec0; font-weight:600;"><i class="far fa-calendar-alt"></i> 13 SEPT 2026</span>
                            <span style="font-size:12px; color:#a0aec0; font-weight:600;"><i class="far fa-clock"></i> 7 MIN READ</span>
                        </div>
                        <h2 style="font-size:26px; font-weight:900; color:#111; line-height:1.3; margin-bottom:14px;">
                            Understanding Bharatiya Nyaya Sanhita (BNS) 2023: Key Structural Shifts from IPC
                        </h2>
                        <p style="font-size:15px; color:#555; line-height:1.65; margin-bottom:20px;">
                            A comprehensive structural breakdown of how BNS 2023 replaces the 1860 IPC, introducing statutory community service penalties, codified organized crime definitions, and enhanced protections for women and children.
                        </p>
                        <div style="background:#f8fafc; border-left:4px solid #00C853; padding:14px; border-radius:10px; margin-bottom:24px;">
                            <strong style="font-size:12px; font-weight:900; color:#2d3748; text-transform:uppercase;">KEY TAKEAWAY:</strong>
                            <p style="font-size:13px; color:#4a5568; margin:2px 0 0;">Replaces 164-year-old IPC with 358 structured sections and modern digital evidence protocols.</p>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #edf2f7; padding-top:16px;">
                        <span style="font-size:13px; font-weight:700; color:#4a5568;">By NYAYI Legal Research Division • NYAYI Lead Legal Researcher</span>
                        <a href="articles/bns-2023-structural-shifts.html" class="card-link" style="background:#111; color:#fff; padding:10px 22px; border-radius:10px; font-weight:700; font-size:13.5px; text-decoration:none;">
                            Read Full Analysis <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <!-- 2 SUPPORTING CARDS -->
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div class="editor-supporting-card" data-aos="fade-up" data-aos-delay="100">
                        <div>
                            <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                                <span class="type-badge explainer">LEGAL EXPLAINER</span>
                                <span style="font-size:11px; color:#718096;">10 SEPT 2026</span>
                            </div>
                            <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:8px; line-height:1.35;">
                                Bharatiya Nagarik Suraksha Sanhita: What Changed in Criminal Procedure?
                            </h3>
                            <p style="font-size:13.5px; color:#666; line-height:1.5; margin-bottom:14px;">
                                Mandating electronic FIRs, forensic sampling for 7+ year offences, and 14-day preliminary inquiries.
                            </p>
                        </div>
                        <a href="articles/bnss-2023-criminal-procedure-changes.html" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">
                            Read Article &rarr;
                        </a>
                    </div>

                    <div class="editor-supporting-card" data-aos="fade-up" data-aos-delay="200">
                        <div>
                            <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                                <span class="type-badge concept">LEGAL CONCEPT</span>
                                <span style="font-size:11px; color:#718096;">05 SEPT 2026</span>
                            </div>
                            <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:8px; line-height:1.35;">
                                Bharatiya Sakshya Adhiniyam: Understanding India's New Evidence Framework
                            </h3>
                            <p style="font-size:13.5px; color:#666; line-height:1.5; margin-bottom:14px;">
                                Recognizing digital records as primary evidence and Section 63 certificate rules.
                            </p>
                        </div>
                        <a href="articles/bsa-2023-evidence-framework.html" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">
                            Read Article &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 3: PROMINENT ARTICLE SEARCH ENGINE -->
    <section style="padding: 30px 0; background: #fafbfc; border-top: 1px solid #edf2f7; border-bottom: 1px solid #edf2f7;">
        <div class="container" style="max-width: 1000px;">
            <div style="text-align:center; margin-bottom:16px;">
                <h2 style="font-size:22px; font-weight:800; color:#111;">What Are You Looking For?</h2>
                <p style="font-size:14px; color:#666; margin:0;">Search articles, legal topics, statutory acts, or keywords</p>
            </div>
            
            <div class="article-search-wrapper">
                <i class="fas fa-search article-search-icon"></i>
                <input type="text" id="articleSearchInput" class="article-search-input" oninput="handleArticleSearch()" placeholder="Search articles, legal topics or keywords (e.g. BNS, BNSS, Bail, Supreme Court, Article 21, Cyber Crime)...">
                <button id="articleClearBtn" class="article-clear-btn" onclick="clearArticleSearch()"><i class="fas fa-times-circle"></i></button>
            </div>
            
            <div style="margin-top: 14px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:center;">
                <span style="font-size:12px; font-weight:800; color:#718096; text-transform:uppercase;">Quick Topics:</span>
                <button onclick="setArticleSearch('BNS')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">BNS 2023</button>
                <button onclick="setArticleSearch('BNSS')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">BNSS</button>
                <button onclick="setArticleSearch('BSA')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">BSA</button>
                <button onclick="setArticleSearch('Supreme Court')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Supreme Court</button>
                <button onclick="setArticleSearch('Cyber Crime')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Cyber Crime</button>
                <button onclick="setArticleSearch('Consumer')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Consumer Rights</button>
                <button onclick="setArticleSearch('Constitution')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Constitution</button>
                <button onclick="setArticleSearch('Property')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Property Law</button>
                <button onclick="setArticleSearch('POSH')" class="filter-btn" style="padding:4px 14px; font-size:12.5px;">Women's Rights</button>
            </div>
        </div>
    </section>

    <!-- SECTION 4: CATEGORY SELECTOR (14 CHIPS) -->
    <section style="padding: 40px 0 20px; background: #fff;">
        <div class="container">
            <div class="filter-tags" style="justify-content:center; gap:10px;">
                <button class="filter-btn active" onclick="filterArticleCat('all', this)">ALL</button>
                <button class="filter-btn" onclick="filterArticleCat('updates', this)">LEGAL UPDATES</button>
                <button class="filter-btn" onclick="filterArticleCat('laws', this)">INDIAN LAWS</button>
                <button class="filter-btn" onclick="filterArticleCat('courts', this)">COURTS & JUDGMENTS</button>
                <button class="filter-btn" onclick="filterArticleCat('constitution', this)">CONSTITUTION</button>
                <button class="filter-btn" onclick="filterArticleCat('criminal', this)">CRIMINAL LAW</button>
                <button class="filter-btn" onclick="filterArticleCat('civil', this)">CIVIL LAW</button>
                <button class="filter-btn" onclick="filterArticleCat('consumer', this)">CONSUMER LAW</button>
                <button class="filter-btn" onclick="filterArticleCat('cyber', this)">CYBER & TECH</button>
                <button class="filter-btn" onclick="filterArticleCat('women', this)">WOMEN & FAMILY</button>
                <button class="filter-btn" onclick="filterArticleCat('property', this)">PROPERTY & TENANCY</button>
                <button class="filter-btn" onclick="filterArticleCat('business', this)">BUSINESS & CORPORATE</button>
                <button class="filter-btn" onclick="filterArticleCat('labour', this)">LABOUR & EMPLOYMENT</button>
                <button class="filter-btn" onclick="filterArticleCat('rights', this)">CITIZEN RIGHTS</button>
            </div>
        </div>
    </section>

    <!-- SECTION 5: LATEST ARTICLES COLLECTION GRID (24+ CARDS) -->
    <section id="explore-articles" style="padding: 40px 0 90px; background: #fff;">
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
                <h3 style="font-size:22px; font-weight:800; color:#111;" id="articleResultsHeading">Showing All 24 Articles & Updates</h3>
                <span style="font-size:14px; color:#718096;" id="articleResultsCount">24 articles</span>
            </div>

            <div class="guides-grid-enhanced" id="articlesContainer" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:24px;">
                ${expandedArticles.map(item => `
                    <div class="guide-card-enhanced article-item-card" data-category="${item.catKey}" data-title="${item.title.toLowerCase()}" data-aos="fade-up" style="background:#fff; border:1px solid #edf2f7; border-radius:20px; padding:28px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.3s ease; box-shadow:0 6px 20px rgba(0,0,0,0.03);">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                                <span class="type-badge ${item.typeKey}">${item.type}</span>
                                <span style="font-size:12px; font-weight:700; color:#718096;"><i class="far fa-calendar-alt"></i> ${item.date}</span>
                            </div>
                            <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:10px; line-height:1.4;">${item.title}</h3>
                            <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:18px;">${item.summary}</p>
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #edf2f7; padding-top:14px; font-size:12.5px; color:#718096; margin-bottom:16px;">
                                <span><i class="fas fa-user-edit" style="color:#00C853;"></i> ${item.author}</span>
                                <span><i class="far fa-clock"></i> ${item.readTime}</span>
                            </div>
                            <a href="articles/${item.slug}.html" class="card-link" style="display:inline-flex; align-items:center; justify-content:space-between; width:100%; background:#111; color:#fff; padding:12px 20px; border-radius:10px; font-weight:700; font-size:14px; text-decoration:none; transition:all 0.3s ease;">
                                <span>Read Full Article</span>
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div id="noArticlesFound" style="display:none; text-align:center; padding:60px 20px; background:#f7fafc; border-radius:20px; margin-top:30px;">
                <i class="fas fa-search" style="font-size:40px; color:#cbd5e0; margin-bottom:16px;"></i>
                <h3 style="font-size:20px; font-weight:800; color:#2d3748;">No Articles Match Your Search</h3>
                <p style="color:#718096; font-size:14px;">Try adjusting your keyword search or selecting another legal category.</p>
                <button onclick="clearArticleSearch()" style="margin-top:16px; background:#00C853; color:#fff; border:none; padding:10px 24px; border-radius:10px; font-weight:700; cursor:pointer;">Reset Search & Filters</button>
            </div>
        </div>
    </section>

    <!-- SECTION 6: EDITORIAL CONTENT TYPES EXPLAINER -->
    <section style="padding:60px 0; background:#f8fafc; border-top:1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Editorial Architecture</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">6 Distinct Editorial Formats</h2>
                <p style="color:#666; font-size:15px;">NYAYI content is organized into 6 clear visual editorial categories for targeted legal research.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px;">
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up">
                    <span class="type-badge explainer" style="margin-bottom:10px;">LEGAL EXPLAINER</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">Plain-Language Law</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Breaks complex statutory provisions into plain, accessible language.</p>
                </div>
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up" data-aos-delay="100">
                    <span class="type-badge update" style="margin-bottom:10px;">LAW UPDATE</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">What Changed?</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Analysis of newly enacted acts, amendments, and statutory codes.</p>
                </div>
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up" data-aos-delay="200">
                    <span class="type-badge judgment" style="margin-bottom:10px;">COURT & JUDGMENT</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">Landmark Rulings</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Supreme Court & High Court precedents and judicial interpretations.</p>
                </div>
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up" data-aos-delay="300">
                    <span class="type-badge guide" style="margin-bottom:10px;">CITIZEN GUIDE</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">Citizen Impact</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Practical guidance on what legal developments mean for ordinary people.</p>
                </div>
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up" data-aos-delay="400">
                    <span class="type-badge concept" style="margin-bottom:10px;">LEGAL CONCEPT</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">Core Principles</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Deep-dive analyses of foundational legal doctrines and maxims.</p>
                </div>
                <div style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center;" data-aos="fade-up" data-aos-delay="500">
                    <span class="type-badge student" style="margin-bottom:10px;">STUDENT NOTE</span>
                    <h3 style="font-size:15px; font-weight:800; color:#111; margin:8px 0 4px;">Academic Revision</h3>
                    <p style="font-size:13px; color:#666; margin:0;">Structured revision notes for law students and UPSC aspirants.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 7: "WHAT'S NEW IN INDIAN LAW?" (TIMELINE-STYLE) -->
    <section style="padding:70px 0; background:#fff;">
        <div class="container" style="max-width:900px;">
            <div style="text-align:center; margin-bottom:40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Statutory Milestones</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">What's New in Indian Law?</h2>
                <p style="color:#666; font-size:15px;">Chronological timeline of major statutory enactments and framework reforms.</p>
            </div>

            <div class="timeline-flow">
                <div class="timeline-card" data-aos="fade-up">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-weight:900; color:#00C853; font-size:14px;">JULY 1, 2024</span>
                        <span class="type-badge update">ACTIVE CRIMINAL CODES</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">Enforcement of BNS, BNSS, and BSA 2023</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:12px;">India's three new criminal law codes came into force nationwide, completely replacing the 1860 IPC, 1973 CrPC, and 1872 Evidence Act for new offences.</p>
                    <div style="background:#f8fafc; padding:12px 16px; border-radius:10px; font-size:13px; color:#2d3748;">
                        <strong>Key Impact:</strong> Mandatory forensic collection for 7+ year offences, Zero FIR legal right, and digital primary evidence recognition.
                    </div>
                </div>

                <div class="timeline-card" data-aos="fade-up" data-aos-delay="100">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-weight:900; color:#3182ce; font-size:14px;">DECEMBER 2023</span>
                        <span class="type-badge concept">DIGITAL REFORM</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">Telecommunications Act & DPDP Act Enactments</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:12px;">The Digital Personal Data Protection (DPDP) Act 2023 established strict consent architectures and Data Principal rights for online data processing.</p>
                    <div style="background:#f8fafc; padding:12px 16px; border-radius:10px; font-size:13px; color:#2d3748;">
                        <strong>Key Impact:</strong> Heavy statutory penalties up to ₹250 Crores for failure to protect citizen digital data.
                    </div>
                </div>

                <div class="timeline-card" data-aos="fade-up" data-aos-delay="200">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-weight:900; color:#d97706; font-size:14px;">JULY 2020</span>
                        <span class="type-badge judgment">SUPREME COURT PRECEDENT</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">Vineeta Sharma v. Rakesh Sharma (Daughter Property Rights)</h3>
                    <p style="font-size:14px; color:#555; line-height:1.6; margin-bottom:12px;">Supreme Court 3-Judge Bench held that daughters have equal coparcenary rights in ancestral property by birth, regardless of whether father was alive in 2005.</p>
                    <div style="background:#f8fafc; padding:12px 16px; border-radius:10px; font-size:13px; color:#2d3748;">
                        <strong>Key Impact:</strong> Conclusively settled retroactive gender equality under Hindu Succession (Amendment) Act 2005.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 8: LEGAL EXPLAINERS ("LAW, WITHOUT LEGAL JARGON") -->
    <section style="padding:70px 0; background:#fafbfc; border-top:1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; max-width:750px; margin:0 auto 40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Dictionary Synergy</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Law, Without the Legal Jargon</h2>
                <p style="color:#666; font-size:15px;">Demystifying core legal concepts into clear, plain-language explainers connected directly to our Legal Dictionary.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:6px;">Bail</h3>
                    <p style="font-size:13px; color:#666; margin-bottom:14px; line-height:1.5;">Provisional release of an accused person pending trial upon executing bail bond or surety.</p>
                    <a href="dictionary.html?q=Bail" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">View Dictionary Definition &rarr;</a>
                </div>
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:6px;">FIR (First Information Report)</h3>
                    <p style="font-size:13px; color:#666; margin-bottom:14px; line-height:1.5;">Document recorded by police under BNSS Sec 173 for cognizable offences.</p>
                    <a href="dictionary.html?q=FIR" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">View Dictionary Definition &rarr;</a>
                </div>
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:6px;">Cognizable Offence</h3>
                    <p style="font-size:13px; color:#666; margin-bottom:14px; line-height:1.5;">Serious crime where police officer has statutory authority to arrest without warrant.</p>
                    <a href="dictionary.html?q=Cognizable" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">View Dictionary Definition &rarr;</a>
                </div>
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <h3 style="font-size:17px; font-weight:800; color:#111; margin-bottom:6px;">Jurisdiction</h3>
                    <p style="font-size:13px; color:#666; margin-bottom:14px; line-height:1.5;">Official authority of a court or police station to hear cases based on territory or pecuniary value.</p>
                    <a href="dictionary.html?q=Jurisdiction" style="font-size:13px; font-weight:800; color:#00C853; text-decoration:none;">View Dictionary Definition &rarr;</a>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 9: COURTS & JUDGMENTS (VERIFIED LANDMARKS) -->
    <section style="padding:70px 0; background:#fff;">
        <div class="container">
            <div style="text-align:center; max-width:750px; margin:0 auto 40px;">
                <span style="color:#e53e3e; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Judicial Precedents</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Landmark Courts & Judgments Explained</h2>
                <p style="color:#666; font-size:15px;">Factual analysis of Supreme Court rulings that shaped citizen rights and police protocols.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">
                <div style="border:1px solid #edf2f7; border-radius:20px; padding:28px; background:#fff; box-shadow:0 4px 16px rgba(0,0,0,0.02);" data-aos="fade-up">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; font-weight:900; color:#e53e3e; background:#fff5f5; padding:3px 10px; border-radius:12px;">SUPREME COURT OF INDIA</span>
                        <span style="font-size:12px; color:#718096; font-weight:600;">2014 LANDMARK</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">Lalita Kumari v. Govt. of Uttar Pradesh</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:14px;">
                        <strong>Legal Issue:</strong> Whether police officers are mandatory bound to register an FIR upon receiving information disclosing a cognizable offence.
                    </div>
                    <div style="background:#f8fafc; padding:14px; border-radius:12px; font-size:13px; color:#2d3748; margin-bottom:16px;">
                        <strong>Court Decision:</strong> 5-Judge Constitution Bench held that FIR registration under Sec 154 CrPC (now Sec 173 BNSS) is mandatory if information discloses cognizable crime.
                    </div>
                    <span style="font-size:12px; color:#00C853; font-weight:800;"><i class="fas fa-check-circle"></i> Codified into BNSS Section 173 Mandate</span>
                </div>

                <div style="border:1px solid #edf2f7; border-radius:20px; padding:28px; background:#fff; box-shadow:0 4px 16px rgba(0,0,0,0.02);" data-aos="fade-up" data-aos-delay="100">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; font-weight:900; color:#e53e3e; background:#fff5f5; padding:3px 10px; border-radius:12px;">SUPREME COURT OF INDIA</span>
                        <span style="font-size:12px; color:#718096; font-weight:600;">2014 LANDMARK</span>
                    </div>
                    <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:8px;">Arnesh Kumar v. State of Bihar</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:14px;">
                        <strong>Legal Issue:</strong> Preventing unnecessary arrests in offences carrying imprisonment up to 7 years.
                    </div>
                    <div style="background:#f8fafc; padding:14px; border-radius:12px; font-size:13px; color:#2d3748; margin-bottom:16px;">
                        <strong>Court Decision:</strong> Mandatory requirement for police to serve Section 41A notice before making automatic arrests in offences under 7 years.
                    </div>
                    <span style="font-size:12px; color:#00C853; font-weight:800;"><i class="fas fa-check-circle"></i> Codified into BNSS Section 35 Arrest Notice</span>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 10: LAW CHANGES (COMPARISON CARDS) -->
    <section style="padding:70px 0; background:#fafbfc; border-top:1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; max-width:750px; margin:0 auto 40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Statutory Mapping</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Understanding Changes in the Law</h2>
                <p style="color:#666; font-size:15px;">Comparative structural mapping between legacy colonial acts and modern 2023 Bharatiya codes.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                <div class="comparison-card" data-aos="fade-up">
                    <span style="font-size:12px; font-weight:900; color:#00C853; text-transform:uppercase;">CRIMINAL CODE SHIFT</span>
                    <h3 style="font-size:20px; font-weight:900; color:#111; margin:6px 0 14px;">IPC 1860 &rarr; BNS 2023</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:12px;">
                        <strong>Old Framework:</strong> 511 sections organized under British imperial structure.
                    </div>
                    <div style="font-size:13.5px; color:#009624; line-height:1.6; font-weight:700;">
                        <strong>New BNS Framework:</strong> 358 streamlined sections; introduces community service, organized crime, and hit-and-run penalties.
                    </div>
                </div>

                <div class="comparison-card" data-aos="fade-up" data-aos-delay="100">
                    <span style="font-size:12px; font-weight:900; color:#3182ce; text-transform:uppercase;">PROCEDURE SHIFT</span>
                    <h3 style="font-size:20px; font-weight:900; color:#111; margin:6px 0 14px;">CrPC 1973 &rarr; BNSS 2023</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:12px;">
                        <strong>Old Framework:</strong> 484 sections with flexible investigation timelines.
                    </div>
                    <div style="font-size:13.5px; color:#2b6cb0; line-height:1.6; font-weight:700;">
                        <strong>New BNSS Framework:</strong> 531 sections; strict statutory deadlines for trial judgments (45 days) and mandatory e-FIR.
                    </div>
                </div>

                <div class="comparison-card" data-aos="fade-up" data-aos-delay="200">
                    <span style="font-size:12px; font-weight:900; color:#805ad5; text-transform:uppercase;">EVIDENCE SHIFT</span>
                    <h3 style="font-size:20px; font-weight:900; color:#111; margin:6px 0 14px;">Evidence Act 1872 &rarr; BSA 2023</h3>
                    <div style="font-size:13.5px; color:#4a5568; line-height:1.6; margin-bottom:12px;">
                        <strong>Old Framework:</strong> Paper-centric evidence rules with Sec 65B electronic certificate.
                    </div>
                    <div style="font-size:13.5px; color:#6b46c1; line-height:1.6; font-weight:700;">
                        <strong>New BSA Framework:</strong> 170 sections; treats digital records & cloud data directly as primary evidence under Sec 63.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 15: EXPLORE POPULAR LEGAL TOPICS -->
    <section id="popular-topics" style="padding:70px 0; background:#fff;">
        <div class="container">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="font-size:26px; font-weight:900; color:#111;">Explore Popular Legal Topics</h2>
                <p style="color:#666; font-size:15px;">Click any topic chip to filter articles in real-time</p>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px;">
                <div onclick="filterArticleCat('criminal', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-shield-alt" style="font-size:24px; color:#00C853; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Criminal Law</strong>
                </div>
                <div onclick="filterArticleCat('constitution', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-landmark" style="font-size:24px; color:#3182ce; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Constitution</strong>
                </div>
                <div onclick="filterArticleCat('cyber', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-laptop-code" style="font-size:24px; color:#805ad5; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Cyber & Tech</strong>
                </div>
                <div onclick="filterArticleCat('consumer', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-shopping-bag" style="font-size:24px; color:#dd6b20; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Consumer Rights</strong>
                </div>
                <div onclick="filterArticleCat('property', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-building" style="font-size:24px; color:#742a2a; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Property Law</strong>
                </div>
                <div onclick="filterArticleCat('women', null)" class="cat-card" style="background:#fff; border:1px solid #edf2f7; border-radius:16px; padding:20px; text-align:center; cursor:pointer;">
                    <i class="fas fa-hands-helping" style="font-size:24px; color:#b83280; margin-bottom:8px; display:block;"></i>
                    <strong style="font-size:14px; color:#111;">Women & Family</strong>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 16: LEGAL LEARNING FOR STUDENTS -->
    <section style="padding:70px 0; background:#fafbfc; border-top:1px solid #edf2f7;">
        <div class="container">
            <div style="text-align:center; max-width:700px; margin:0 auto 40px;">
                <span style="color:#805ad5; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Academic Module</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Legal Learning for Students</h2>
                <p style="color:#666; font-size:15px;">Structured academic notes for law students, LLB curriculum revision, and UPSC preparation.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px;">
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up">
                    <span style="font-size:11px; font-weight:900; color:#805ad5; background:#f3e8ff; padding:3px 10px; border-radius:12px;">REVISION NOTE 01</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Mens Rea & Actus Reus</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Actus non facit reum nisi mens sit rea: Physical guilty act combined with guilty mental intention.</p>
                </div>
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up" data-aos-delay="100">
                    <span style="font-size:11px; font-weight:900; color:#805ad5; background:#f3e8ff; padding:3px 10px; border-radius:12px;">REVISION NOTE 02</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Res Judicata (CPC Sec 11)</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Final court decision bars re-litigation of same issue between same parties in a fresh suit.</p>
                </div>
                <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;" data-aos="fade-up" data-aos-delay="200">
                    <span style="font-size:11px; font-weight:900; color:#805ad5; background:#f3e8ff; padding:3px 10px; border-radius:12px;">REVISION NOTE 03</span>
                    <h3 style="font-size:16px; font-weight:800; color:#111; margin:10px 0 6px;">Ratio Decidendi vs Obiter Dicta</h3>
                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">Ratio decidendi forms binding legal precedent; obiter dicta constitutes persuasive judicial observations.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 19: SUBSTANTIAL FAQ ACCORDION -->
    <section style="padding: 70px 0; background: #fff;">
        <div class="container" style="max-width:850px;">
            <div style="text-align:center; margin-bottom:40px;">
                <span style="color:#00C853; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px;">EDITORIAL FAQ</span>
                <h2 style="font-size:28px; font-weight:900; color:#111; margin-top:6px;">Frequently Asked Questions</h2>
            </div>

            <div class="faq-grid" style="max-width:850px; margin:0 auto; display:grid; gap:16px;">
                <div class="faq-item">
                    <div class="faq-header" onclick="toggleFaq(this)">
                        <h3>What are NYAYI Articles & Updates?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-body">
                        <p>NYAYI Articles & Updates is an editorial legal journal providing structured explainers, legislative updates on BNS 2023 / BNSS 2023 / BSA 2023, Supreme Court judgment breakdowns, and citizen knowledge guides.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-header" onclick="toggleFaq(this)">
                        <h3>Are NYAYI articles substitute for formal legal advice?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-body">
                        <p>No. NYAYI articles are created for general educational awareness and legal literacy. For formal court litigation or specific legal representation, users must consult a licensed advocate.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-header" onclick="toggleFaq(this)">
                        <h3>What is the difference between an Article and a Legal Guide?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-body">
                        <p>Articles analyze legal developments, court judgments, and statutory shifts. Legal Guides provide step-by-step practical instructions (e.g. how to file an FIR or report cyber fraud) for real-life action.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-header" onclick="toggleFaq(this)">
                        <h3>Can law students use these articles for revision?</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-body">
                        <p>Yes! Our 'Student Note' and 'Legal Concept' editorial formats are specifically designed with structured takeaways, landmark case references, and statutory section mappings for LLB students and competitive exam preparation.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 33: EDUCATIONAL DISCLAIMER -->
    <section style="padding: 30px 0; background: #fff5f5; border-top: 1px solid #fed7d7;">
        <div class="container" style="max-width: 900px; text-align: center;">
            <p style="font-size:12px; color:#c53030; margin:0; line-height:1.6;">
                <i class="fas fa-exclamation-circle"></i> <strong>Educational Disclaimer:</strong> NYAYI Articles & Updates are provided for general educational and informational purposes under Bharatiya codes (BNS, BNSS, BSA). Articles should not be treated as a substitute for advice from a qualified legal professional.
            </p>
        </div>
    </section>

    <!-- SECTION 32: FINAL DARK CTA BLOCK -->
    <section style="padding:80px 0; background:#111; color:#fff; text-align:center;">
        <div class="container" style="max-width:850px;" data-aos="zoom-in">
            <h2 style="font-size:32px; font-weight:900; margin-bottom:16px; color:#fff;">Keep Learning. Stay Legally Informed.</h2>
            <p style="font-size:17px; color:#aaa; margin-bottom:32px; line-height:1.6;">
                Explore laws, fundamental rights, practical guides, and legal developments through the NYAYI knowledge platform.
            </p>
            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <a href="laws.html" class="card-link" style="background:#00C853; color:#fff; padding:14px 28px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px;">
                    Explore Laws Library
                </a>
                <a href="rights.html" class="card-link" style="background:transparent; border:2px solid #fff; color:#fff; padding:14px 28px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px;">
                    Know Your Rights
                </a>
                <a href="guides.html" class="card-link" style="background:transparent; border:2px solid #fff; color:#fff; padding:14px 28px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px;">
                    Read Legal Guides
                </a>
                <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="background:#fff; color:#111; padding:14px 28px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px;">
                    <i class="fas fa-robot"></i> Launch NYAYI Web AI
                </a>
            </div>
        </div>
    </section>

    <!-- CLIENT-SIDE INTERACTIVE JAVASCRIPT FOR SEARCH, CATEGORY FILTERS & FAQ -->
    <script>
    function runArticleSearch() {
        const input = document.getElementById('articleSearchInput');
        const query = input ? input.value.toLowerCase().trim() : '';
        const clearBtn = document.getElementById('articleClearBtn');
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        const activeBtn = document.querySelector('.filter-btn.active');
        let activeCat = 'all';
        if (activeBtn) {
            const match = activeBtn.getAttribute('onclick') ? activeBtn.getAttribute('onclick').match(/'([^']+)'/) : null;
            if (match) activeCat = match[1];
        }

        const cards = document.querySelectorAll('.article-item-card');
        let count = 0;

        cards.forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const cat = (card.getAttribute('data-category') || '').toLowerCase();
            const text = card.textContent.toLowerCase();

            const matchesCat = (activeCat === 'all' || cat === activeCat);
            const matchesQuery = (!query || title.includes(query) || text.includes(query) || cat.includes(query));

            if (matchesCat && matchesQuery) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        const heading = document.getElementById('articleResultsHeading');
        const countSpan = document.getElementById('articleResultsCount');
        const noFound = document.getElementById('noArticlesFound');

        if (heading) {
            if (query && activeCat !== 'all') {
                heading.innerText = 'Results for "' + query + '" in ' + activeCat.toUpperCase();
            } else if (query) {
                heading.innerText = 'Search Results for "' + query + '"';
            } else if (activeCat !== 'all') {
                heading.innerText = 'Articles in ' + activeCat.toUpperCase();
            } else {
                heading.innerText = 'Showing All 24 Articles & Updates';
            }
        }
        if (countSpan) countSpan.innerText = count + ' articles';
        if (noFound) noFound.style.display = count === 0 ? 'block' : 'none';
    }

    function handleArticleSearch() { runArticleSearch(); }
    function filterArticleCat(catKey, el) {
        if (el) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
        }
        runArticleSearch();
    }

    function setArticleSearch(term) {
        const input = document.getElementById('articleSearchInput');
        if (input) {
            input.value = term;
            runArticleSearch();
        }
    }

    function clearArticleSearch() {
        const input = document.getElementById('articleSearchInput');
        if (input) { input.value = ''; }
        filterArticleCat('all', document.querySelector('.filter-btn'));
    }

    function toggleFaq(btn) {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        if (content.style.display === 'block') {
            content.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            content.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }
    </script>
    ${renderFooter(0)}
    `;

    fs.writeFileSync(path.join(ROOT_DIR, 'articles.html'), articlesHub, 'utf8');
    fs.writeFileSync(path.join(ROOT_DIR, 'blog/index.html'), articlesHub.replace(/articles\//g, '').replace(/\.\/css\//g, '../css/'), 'utf8');

            // Individual Article Subpages Generator (24+ HTML Files)
    if (!fs.existsSync(path.join(ROOT_DIR, 'articles'))) fs.mkdirSync(path.join(ROOT_DIR, 'articles'), { recursive: true });
    if (!fs.existsSync(path.join(ROOT_DIR, 'blog'))) fs.mkdirSync(path.join(ROOT_DIR, 'blog'), { recursive: true });

    expandedArticles.forEach(item => {
        const pageHtml = `
        ${renderHead(`${item.title} | NYAYI Legal Journal`, item.summary, `${item.title}, legal article India, BNS BNSS 2023`, `/articles/${item.slug}.html`, 1)}
        ${renderHeader('articles', 1)}

        <section class="page-header" style="padding:150px 0 40px; text-align:left;">
            <div class="container" data-aos="fade-up">
                <a href="../articles.html" style="font-weight:700; color:var(--primary-dark); font-size:14px; text-decoration:none;"><i class="fas fa-arrow-left"></i> Back to Legal Articles Journal</a>
                <div style="margin-top:20px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <span class="type-badge ${item.typeKey}">${item.type}</span>
                    <span class="cp-role" style="display:inline-block; background:#e8f5e9; color:#00C853; font-weight:800; padding:4px 14px; border-radius:20px; font-size:12px;">${item.category} • ${item.readTime}</span>
                </div>
                <h1 style="margin:14px 0 20px; font-size:2.8rem; font-weight:900; line-height:1.2; color:#111;">${item.title}</h1>
                <div style="display:flex; gap:20px; font-size:14px; color:#718096; font-weight:600;">
                    <span>By ${item.author}</span>
                    <span>•</span>
                    <span>Published: ${item.date}</span>
                </div>
            </div>
        </section>

        <section style="padding:40px 0 100px; background:#fff;">
            <div class="container article-subpage-layout">
                <!-- MAIN LEFT CONTENT COLUMN -->
                <div>
                    <!-- ARTICLE AT A GLANCE BOX -->
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #00C853; border-radius:18px; padding:28px; margin-bottom:32px;" data-aos="fade-up">
                        <h3 style="font-size:16px; font-weight:900; color:#111; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;"><i class="fas fa-bolt" style="color:#00C853;"></i> Article at a Glance</h3>
                        <ul style="padding-left:20px; margin:0; font-size:14.5px; color:#2d3748; line-height:1.7;">
                            ${item.atAGlance.map(pt => `<li>${pt}</li>`).join('')}
                        </ul>
                    </div>

                    <!-- MAIN ARTICLE CONTENT -->
                    <div style="background:#fff; border:1px solid #edf2f7; border-radius:24px; padding:36px; box-shadow:0 10px 30px rgba(0,0,0,0.03);" data-aos="fade-up">
                        <h2 style="font-size:24px; font-weight:900; color:#111; margin-bottom:16px;">Executive Overview</h2>
                        <p style="font-size:16px; color:#4a5568; line-height:1.8; margin-bottom:28px;">${item.summary}</p>

                        <!-- KEY TAKEAWAYS -->
                        <div class="takeaways-box">
                            <h3 style="font-size:16px; font-weight:900; color:#009624; margin-bottom:12px;"><i class="fas fa-check-circle"></i> Key Takeaways & Practical Takeouts</h3>
                            <ul style="padding-left:20px; margin:0; font-size:14.5px; color:#2d3748; line-height:1.7;">
                                ${item.takeaways.map(tk => `<li>${tk}</li>`).join('')}
                            </ul>
                        </div>

                        <!-- ECOSYSTEM CONTINUE LEARNING -->
                        <div style="margin-top:40px; background:#fafbfc; border-radius:18px; padding:28px; border:1px solid #e2e8f0;">
                            <h3 style="font-size:18px; font-weight:800; color:#111; margin-bottom:16px;">Continue Learning on NYAYI</h3>
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
                                <a href="../laws.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-decoration:none; display:block;">
                                    <strong style="font-size:14px; color:#111; display:block; margin-bottom:4px;">Related Law</strong>
                                    <span style="font-size:13px; color:#00C853;">${item.relatedLaw}</span>
                                </a>
                                <a href="../rights.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-decoration:none; display:block;">
                                    <strong style="font-size:14px; color:#111; display:block; margin-bottom:4px;">Related Right</strong>
                                    <span style="font-size:13px; color:#3182ce;">${item.relatedRights}</span>
                                </a>
                                <a href="../dictionary.html" style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-decoration:none; display:block;">
                                    <strong style="font-size:14px; color:#111; display:block; margin-bottom:4px;">Related Terms</strong>
                                    <span style="font-size:13px; color:#805ad5;">${item.relatedTerms.join(', ')}</span>
                                </a>
                            </div>
                        </div>

                        <div style="margin-top:36px; text-align:center;">
                            <a href="https://ai.nyayi.in" target="_blank" class="card-link" style="display:inline-flex; align-items:center; gap:10px; background:#00C853; color:#fff; padding:16px 36px; border-radius:12px; font-weight:800; text-decoration:none; font-size:15px; box-shadow:0 4px 14px rgba(0,200,83,0.3);">
                                <i class="fas fa-robot"></i> Research "${item.title}" with NYAYI AI
                            </a>
                        </div>
                    </div>
                </div>

                <!-- RIGHT STICKY SIDEBAR (DESKTOP) -->
                <div class="sticky-desktop-sidebar">
                    <!-- TABLE OF CONTENTS -->
                    <div class="toc-box">
                        <h4 style="font-size:14px; font-weight:900; color:#111; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;"><i class="fas fa-list" style="color:#00C853;"></i> Table of Contents</h4>
                        <ul style="list-style:none; padding:0; margin:0; font-size:13.5px; line-height:1.8;">
                            ${item.toc.map(tc => `<li><a href="#${tc.id}" style="color:#4a5568; text-decoration:none; font-weight:600; transition:color 0.2s;">${tc.label}</a></li>`).join('')}
                        </ul>
                    </div>

                    <!-- QUICK AI ASK CARD -->
                    <div style="background:linear-gradient(135deg, #0a0a0a 0%, #171717 100%); border-radius:20px; padding:24px; color:#fff; text-align:center;">
                        <i class="fas fa-brain" style="font-size:32px; color:#00C853; margin-bottom:12px;"></i>
                        <h4 style="font-size:16px; font-weight:900; margin-bottom:8px;">Have Questions About This Article?</h4>
                        <p style="font-size:13px; color:#a0aec0; line-height:1.5; margin-bottom:18px;">Ask NYAYI Legal AI for immediate citation analysis and practical answers.</p>
                        <a href="https://ai.nyayi.in" target="_blank" style="display:block; background:#00C853; color:#fff; font-weight:800; font-size:13.5px; padding:12px 20px; border-radius:10px; text-decoration:none;">
                            Launch Web AI Assistant <i class="fas fa-arrow-right" style="font-size:12px;"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        ${renderFooter(1)}
        `;

        fs.writeFileSync(path.join(ROOT_DIR, `articles/${item.slug}.html`), pageHtml, 'utf8');
        fs.writeFileSync(path.join(ROOT_DIR, `blog/${item.slug}.html`), pageHtml.replace(/\.\.\/articles\.html/g, '../blog/index.html'), 'utf8');
    });


    // Sitemap & Robots
    const urls = [
        'https://nyayi.in/',
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
