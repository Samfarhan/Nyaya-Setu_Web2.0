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
        "name": "Farhan Khan"
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
    <meta name="author" content="Farhan Khan">
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
                    <h3>Farhan Khan</h3>
                    <span class="cp-role">Founder & Lead Developer</span>
                    <div class="cp-actions">
                        <a href="https://instagram.com/sajj1507" target="_blank" class="cp-btn"><i class="fab fa-instagram"></i> View Profile</a>
                        <a href="tel:9598042676" class="cp-btn secondary"><i class="fas fa-phone-alt"></i> Call +91 9598042676</a>
                    </div>
                </div>
                
                <div class="creator-profile" data-aos="fade-up" data-aos-delay="100">
                    <div class="cp-icon"><i class="fas fa-user-tie"></i></div>
                    <h3>Kamran Sheikh</h3>
                    <span class="cp-role">Lead Legal Researcher</span>
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
            if (menu) menu.classList.toggle('active');
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

    // Laws Hub
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

    // Guides Hub
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
