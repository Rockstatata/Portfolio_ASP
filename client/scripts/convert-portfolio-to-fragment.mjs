import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const aspxPath = path.join(repoRoot, "server", "admin_panel", "portfolio.aspx");
const outputPath = path.join(repoRoot, "client", "public", "legacy", "portfolio-fragment.html");

const formatDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

const resolveExpression = (expr) => {
  const getSettingMatch = expr.match(/GetSetting\([^,]+,\s*"([^"]*)"\s*\)/);
  if (getSettingMatch) return getSettingMatch[1];

  if (/^CurrentYear$/.test(expr)) return String(new Date().getFullYear());

  const formatDateMatch = expr.match(/FormatDate\(DateTime\.Now(?:\.AddDays\(([-\d]+)\))?,\s*"MMM d, yyyy"\)/);
  if (formatDateMatch) return formatDate(Number(formatDateMatch[1] || 0));

  return "";
};

const raw = fs.readFileSync(aspxPath, "utf8");
const bodyMatch = raw.match(/<div id="vanta-background"[\s\S]*?<\/form>/i);
if (!bodyMatch) throw new Error("Could not extract portfolio body fragment from portfolio.aspx");

const source = bodyMatch[0].replace(/<\/form>\s*$/i, "");

const tokens = [];
let cursor = 0;
const serverTagRegex = /<%([\s\S]*?)%>/g;
let match;
while ((match = serverTagRegex.exec(source)) !== null) {
  if (match.index > cursor) tokens.push({ type: "text", value: source.slice(cursor, match.index) });
  tokens.push({ type: "code", value: match[1] });
  cursor = serverTagRegex.lastIndex;
}
if (cursor < source.length) tokens.push({ type: "text", value: source.slice(cursor) });

const stack = [{ kind: "root", include: true }];
const isIncluded = () => stack.every((entry) => entry.include !== false);

let out = "";

for (const token of tokens) {
  if (token.type === "text") {
    if (isIncluded()) out += token.value;
    continue;
  }

  const rawCode = token.value.replace(/\r/g, "").trim();
  if (!rawCode) continue;

  const compact = rawCode.replace(/\s+/g, " ").trim();
  if (compact.startsWith("@")) continue;

  const exprMatch = compact.match(/^[:=]\s*([\s\S]+)$/);
  if (exprMatch) {
    if (isIncluded()) out += resolveExpression(exprMatch[1].trim());
    continue;
  }

  if (/^}\s*else\b/.test(compact)) {
    const previous = stack.pop();
    stack.push({ kind: "else", include: previous && previous.kind === "if" ? previous.parentInclude : false });
    continue;
  }

  if (/^}\s*(\/\/.*)?$/.test(compact)) {
    if (stack.length > 1) stack.pop();
    continue;
  }

  if (/\bif\s*\(/.test(compact) && compact.endsWith("{")) {
    stack.push({ kind: "if", include: false, parentInclude: isIncluded() });
    continue;
  }

  if (/\b(foreach|for|while)\s*\(/.test(compact) && compact.endsWith("{")) {
    stack.push({ kind: "loop", include: false });
    continue;
  }

  if (compact.endsWith("{")) {
    stack.push({ kind: "block", include: isIncluded() });
  }
}

let fragment = out;

const aboutSection = `
<section id="about" class="about-section">
  <div class="about-container">
    <div class="about-header">
      <h2 class="about-title">About Me</h2>
      <p class="about-description">Discover my journey, passions, and the technologies that drive my creative vision</p>
    </div>

    <div class="bento-grid">
      <div class="bento-card bento-card-large group">
        <div class="card-content">
          <div class="card-header">
            <div>
              <h3 class="card-title">CSE Undergraduate</h3>
            </div>
          </div>

          <p class="card-text card-mb-8">
            I'm a dedicated third-year
            <span class="text-blue-600 text-semibold">Computer Science & Engineering student at KUET</span>, currently working as a
            <span class="text-purple-600 text-semibold">Software Developer Intern at Algosoft Technologies Ltd</span>.
          </p>

          <p class="text-large card-mb-8 text-relaxed text-gray-700">
            My passion lies in <span class="text-blue-700 text-semibold">building innovative solutions</span> that solve real-world problems.
            I specialize in <span class="text-cyan-700 text-semibold">full-stack development</span> using the MERN stack, React Native,
            Python FastAPI, and Laravel, combined with my growing expertise in
            <span class="text-green-700 text-semibold">machine learning</span> across Computer Vision, NLP, and Deep Learning.
          </p>

          <p class="text-large card-mb-8 text-relaxed text-gray-700">
            I work with diverse databases including
            <span class="text-orange-700 text-semibold">MongoDB, PostgreSQL, MySQL, and Redis</span>, creating performant data solutions.
            I find immense satisfaction in <span class="text-rose-700 text-semibold">building things from scratch and seeing them come to life</span>.
          </p>

          <p class="text-large card-mb-6 text-relaxed text-gray-700">
            My ultimate dream is to work for <span class="text-indigo-700 text-semibold">NASA</span> and contribute to space exploration through technology.
            <span class="text-amber-700 text-semibold text-italic">One day, I want my code to reach the stars.</span>
          </p>
        </div>

        <div class="floating-element floating-element-1"></div>
        <div class="floating-element floating-element-2"></div>
      </div>

      <div class="bento-card bento-card-wide group">
        <div class="card-header-mb-6">
          <span class="text-small text-gray-500 text-medium text-uppercase text-tracking-wider">What I Do</span>
          <h3 class="card-title card-mt-1">Development Arsenal</h3>
        </div>

        <div class="skills-grid skills-mb-4">
          <div class="skill-item skill-item-wide"><div class="skill-name text-blue-700">React Native</div></div>
          <div class="skill-item"><div class="skill-name text-cyan-700">React/Next.js</div></div>
          <div class="skill-item"><div class="skill-name text-pink-700">UI/UX Design</div></div>
          <div class="skill-item skill-item-wide"><div class="skill-name text-green-700">FastAPI</div></div>
          <div class="skill-item skill-item-wide"><div class="skill-name text-purple-700">Machine Learning</div></div>
          <div class="skill-item"><div class="skill-name text-orange-700">Databases</div></div>
        </div>

        <p class="text-small text-gray-600">Building cross-platform applications with clean, modular, and maintainable code.</p>
      </div>

      <div class="bento-card bento-card-wide group">
        <h3 class="card-title card-mb-4">Research Focus</h3>
        <div class="research-grid text-small">
          <div class="research-item research-item-wide"><span class="research-name text-purple-700">Astronomical Data</span></div>
          <div class="research-item"><span class="research-name text-indigo-700">ML Algorithms</span></div>
          <div class="research-item"><span class="research-name text-teal-700">Deep Learning</span></div>
          <div class="research-item research-item-wide"><span class="research-name text-blue-700">Natural Language Processing</span></div>
        </div>
        <p class="text-extra-small text-gray-500 research-mt-4">Exploring the intersection of space science and AI.</p>
      </div>

      <div class="bento-card group">
        <h3 class="card-title card-mb-4">Future Goals</h3>
        <div class="goals-list">
          <div class="goal-item"><span class="goal-dot"></span><span class="goal-text">Master AI/ML</span></div>
          <div class="goal-item"><span class="goal-dot goal-dot-teal"></span><span class="goal-text goal-text-teal">Open Source</span></div>
          <div class="goal-item"><span class="goal-dot goal-dot-purple"></span><span class="goal-text goal-text-purple">Problem Solving</span></div>
          <div class="goal-item"><span class="goal-dot goal-dot-blue"></span><span class="goal-text goal-text-blue">Code in Space</span></div>
        </div>
        <p class="text-extra-small text-gray-500 goals-mt-4">Creating impactful solutions for humanity.</p>
      </div>

      <div class="bento-card bento-card-wider group">
        <div class="flex-items-start-justify-between learning-mb-6">
          <h3 class="card-title learning-mt-1">Current Focus Areas</h3>
        </div>
        <div class="learning-grid">
          <div class="learning-item"><div class="learning-title text-blue-700">Advanced AI/ML</div><div class="learning-desc">Deep Learning & Neural Networks</div></div>
          <div class="learning-item"><div class="learning-title text-green-700">Cloud Architecture</div><div class="learning-desc">AWS, Docker, Kubernetes</div></div>
          <div class="learning-item"><div class="learning-title text-orange-700">Data Science</div><div class="learning-desc">Analytics & Visualization</div></div>
          <div class="learning-item"><div class="learning-title text-purple-700">Web3 & Blockchain</div><div class="learning-desc">Decentralized Applications</div></div>
          <div class="learning-item"><div class="learning-title text-gray-700">Cybersecurity</div><div class="learning-desc">Network Security & Penetration Testing</div></div>
          <div class="learning-item"><div class="learning-title text-yellow-700">IoT Development</div><div class="learning-desc">Smart Devices & Automation</div></div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const timelineSection = `
<section id="timeline" class="section">
  <div class="timeline-container">
    <div class="timeline-header">
      <h1 class="section-title">Timeline</h1>
      <p class="section-subtitle">My educational and professional journey</p>
    </div>

    <div class="timeline-content">
      <div class="timeline-line"></div>

      <div class="timeline-item" data-position="top">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-year">2009-2015</div>
          <div class="timeline-title">BN College</div>
          <div class="timeline-location">Dhaka, Bangladesh</div>
          <div class="timeline-degree">Primary Education</div>
        </div>
      </div>

      <div class="timeline-item" data-position="bottom">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-year">2015-2019</div>
          <div class="timeline-title">Adamjee Cantonment Public School</div>
          <div class="timeline-location">Dhaka, Bangladesh</div>
          <div class="timeline-degree">Secondary Education (SSC)</div>
        </div>
      </div>

      <div class="timeline-item" data-position="top">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-year">2019-2022</div>
          <div class="timeline-title">Notre Dame College</div>
          <div class="timeline-location">Dhaka, Bangladesh</div>
          <div class="timeline-degree">Higher Secondary Certificate (HSC) - Science</div>
        </div>
      </div>

      <div class="timeline-item" data-position="bottom">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-year">2023-Current</div>
          <div class="timeline-title">Khulna University of Engineering & Technology</div>
          <div class="timeline-location">Khulna, Bangladesh</div>
          <div class="timeline-degree">B.Sc. in Computer Science & Engineering</div>
        </div>
      </div>

      <div class="timeline-item" data-position="top">
        <div class="timeline-dot timeline-dot-current"></div>
        <div class="timeline-card">
          <div class="timeline-year">2025-Current</div>
          <div class="timeline-title">Algosoft Technologies Ltd.</div>
          <div class="timeline-location">Dhaka, Bangladesh</div>
          <div class="timeline-degree">Software Developer Intern</div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const skillsSection = `
<section id="skills" class="section">
  <div class="skills-container">
    <div class="skills-header">
      <h1 class="section-title">Skills</h1>
      <p class="section-subtitle">Technologies and tools I work with</p>
    </div>

    <div class="skills-categories-grid">
      <div class="glass-card skills-category">
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title text-accent-red">Frontend</h3>
            <div class="category-icon">
              <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 7.996c0-1.107.896-2.004 2.004-2.004s2.004.897 2.004 2.004S11.111 10 10.004 10 8 9.103 8 7.996zM14 18H6v-1.5l2-2 1.5 1.5L12 13l2 2v3z"/>
              </svg>
            </div>
          </div>
          <div class="skills-grid">
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" class="skill-icon"><span>HTML</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" class="skill-icon"><span>CSS</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" class="skill-icon"><span>JavaScript</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" class="skill-icon"><span>React</span></div>
          </div>
        </div>
      </div>

      <div class="glass-card skills-category">
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title text-accent-orange">Backend</h3>
            <div class="category-icon">
              <svg class="skill-category-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div class="skills-grid">
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" class="skill-icon"><span>Node.js</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" class="skill-icon"><span>Python</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" class="skill-icon"><span>MongoDB</span></div>
            <div class="skill-tag"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" class="skill-icon"><span>MySQL</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

const projectsSection = `
<section id="projects" class="section projects-section">
  <div class="projects-container">
    <div class="projects-header">
      <h1 class="section-title">Projects</h1>
      <p class="section-subtitle">
        A collection of my most significant projects, showcasing my expertise in full-stack development, cloud architecture, and innovative problem-solving.
      </p>
    </div>

    <div class="projects-grid">
      <article class="glass-card project-card">
        <div class="project-image">
          <img src="https://picsum.photos/600/300?random=101" alt="Portfolio Management System" class="project-img" />
        </div>
        <div class="project-content">
          <h3 class="project-title">Portfolio Management System</h3>
          <div class="project-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="project-year">2026</span>
          </div>
          <p class="project-desc">A complete portfolio and content management platform with dynamic sections, admin controls, and modular architecture.</p>
          <div class="project-tags">
            <span class="tag tag-blue">Next.js</span>
            <span class="tag tag-orange">TypeScript</span>
            <span class="tag tag-teal">Supabase</span>
            <span class="tag tag-purple">UI/UX</span>
          </div>
          <div class="project-actions">
            <a class="btn btn-outline" href="#" onclick="return false;" style="opacity: 0.7; cursor: not-allowed;">Coming Soon</a>
          </div>
        </div>
      </article>

      <article class="glass-card project-card">
        <div class="project-image">
          <img src="https://picsum.photos/600/300?random=202" alt="Lost & Found Platform" class="project-img" />
        </div>
        <div class="project-content">
          <h3 class="project-title">Lost & Found Platform</h3>
          <div class="project-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="project-year">2025</span>
          </div>
          <p class="project-desc">A university-focused platform to report, match, and recover lost items with streamlined workflows and responsive UX.</p>
          <div class="project-tags">
            <span class="tag tag-green">React</span>
            <span class="tag tag-red">Node.js</span>
            <span class="tag tag-cyan">PostgreSQL</span>
            <span class="tag tag-gray">REST API</span>
          </div>
          <div class="project-actions">
            <a class="btn btn-outline" href="#" onclick="return false;" style="opacity: 0.7; cursor: not-allowed;">Coming Soon</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
`;

const experienceSection = `
<section id="experience" class="section projects-section">
  <div class="projects-container">
    <div class="projects-header">
      <h1 class="section-title">Experience</h1>
      <p class="section-subtitle">My professional journey and work experience in software development and technology.</p>
    </div>

    <div class="projects-grid">
      <article class="glass-card project-card">
        <div class="project-content">
          <h3 class="project-title">Algosoft Technologies Ltd.</h3>
          <div class="project-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="project-year">Software Developer Intern</span>
          </div>
          <p class="project-desc">2025 - Current</p>
          <p class="project-desc">Working as a Software Developer Intern, focusing on web development and application architecture.</p>
          <div class="project-tags">
            <span class="tag tag-blue">Web Development</span>
            <span class="tag tag-orange">System Design</span>
            <span class="tag tag-teal">Team Collaboration</span>
            <span class="tag tag-red">Best Practices</span>
          </div>
        </div>
      </article>

      <article class="glass-card project-card">
        <div class="project-content">
          <h3 class="project-title">Freelance Work</h3>
          <div class="project-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span class="project-year">Full Stack Developer</span>
          </div>
          <p class="project-desc">2023 - Present</p>
          <p class="project-desc">Building websites and applications for clients with a focus on responsive design and maintainable code.</p>
          <div class="project-tags">
            <span class="tag tag-purple">Responsive Design</span>
            <span class="tag tag-gray">Client Management</span>
            <span class="tag tag-cyan">Database Design</span>
            <span class="tag tag-green">API Development</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
`;

const blogSection = `
<section id="blog" class="section blog-section">
  <div class="container">
    <div class="blog-container">
      <div class="blog-header">
        <div class="blog-title-container">
          <h1 class="section-title">Blogs</h1>
        </div>
        <p class="section-subtitle">Insights and stories from my journey as a developer.</p>
      </div>
    </div>

    <div class="blog-scroll-container">
      <div class="scroll-controls">
        <button class="scroll-btn scroll-btn-left" id="scrollLeft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="scroll-btn scroll-btn-right" id="scrollRight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div class="blog-grid-scroll" id="blogGrid">
        <article class="blog-card glass-card">
          <div class="blog-content">
            <div class="blog-categories">
              <span class="blog-category programming">Programming</span>
              <span class="blog-category frontend">Frontend</span>
            </div>
            <div class="blog-tags">
              <span class="blog-tag">development</span>
              <span class="blog-tag">website</span>
              <span class="blog-tag">Css</span>
            </div>
            <h3 class="blog-post-title">Building Modern Web Applications with ASP.NET</h3>
            <p class="blog-excerpt">Exploring the latest features and best practices for developing scalable web applications using ASP.NET Web Forms and modern techniques.</p>
            <div class="blog-meta">
              <span class="blog-date">${formatDate(0)}</span>
              <span class="blog-separator">?</span>
              <span class="blog-read-time">4 min read</span>
              <div class="blog-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></div>
            </div>
          </div>
        </article>

        <article class="blog-card glass-card">
          <div class="blog-content">
            <div class="blog-categories">
              <span class="blog-category development">Development</span>
              <span class="blog-category cloud">Cloud and Database</span>
            </div>
            <div class="blog-tags">
              <span class="blog-tag">Database</span>
              <span class="blog-tag">SQL Server</span>
              <span class="blog-tag">Architecture</span>
            </div>
            <h3 class="blog-post-title">Database Design Patterns for Portfolio Applications</h3>
            <p class="blog-excerpt">Best practices for designing and implementing database schemas for portfolio and content management systems.</p>
            <div class="blog-meta">
              <span class="blog-date">${formatDate(-7)}</span>
              <span class="blog-separator">?</span>
              <span class="blog-read-time">6 min read</span>
              <div class="blog-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></div>
            </div>
          </div>
        </article>

        <article class="blog-card glass-card">
          <div class="blog-content">
            <div class="blog-categories">
              <span class="blog-category programming">Programming</span>
            </div>
            <div class="blog-tags">
              <span class="blog-tag">C#</span>
              <span class="blog-tag">Web Development</span>
              <span class="blog-tag">Best Practices</span>
            </div>
            <h3 class="blog-post-title">C# Development Tips for Aspiring Developers</h3>
            <p class="blog-excerpt">Essential tips and tricks for writing clean, efficient C# code and building robust applications.</p>
            <div class="blog-meta">
              <span class="blog-date">${formatDate(-14)}</span>
              <span class="blog-separator">?</span>
              <span class="blog-read-time">5 min read</span>
              <div class="blog-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></div>
            </div>
          </div>
        </article>
      </div>

      <div class="scroll-indicator-dots">
        <div class="scroll-dot active" data-index="0"></div>
        <div class="scroll-dot" data-index="1"></div>
        <div class="scroll-dot" data-index="2"></div>
      </div>
    </div>
  </div>
</section>
`;

const replaceSection = (html, id, replacement) => {
  const rx = new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`, "i");
  return html.replace(rx, replacement.trim());
};

fragment = replaceSection(fragment, "about", aboutSection);
fragment = replaceSection(fragment, "timeline", timelineSection);
fragment = replaceSection(fragment, "skills", skillsSection);
fragment = replaceSection(fragment, "projects", projectsSection);
fragment = replaceSection(fragment, "experience", experienceSection);
fragment = replaceSection(fragment, "blog", blogSection);

fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtName"[\s\S]*?\/>/gi,
  '<input id="txtName" type="text" placeholder="Your Name *" class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtEmail"[\s\S]*?\/>/gi,
  '<input id="txtEmail" type="email" placeholder="Your Email *" class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtSubject"[\s\S]*?\/>/gi,
  '<input id="txtSubject" type="text" placeholder="Your Subject..." class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtMessage"[\s\S]*?\/>/gi,
  '<textarea id="txtMessage" rows="6" placeholder="Your message..." class="form-textarea"></textarea>',
);
fragment = fragment.replace(
  /<asp:Button[\s\S]*?ID="btnSubmitContact"[\s\S]*?\/>/gi,
  '<button type="button" id="btnSubmitContact" class="contact-submit-btn">SEND</button>',
);

fragment = fragment.replace(/(\.\/)?Content\/assets\//g, "/legacy/assets/");
fragment = fragment.replace(/>\s*f\s*<\/iframe>/g, "></iframe>");
fragment = fragment.replace(/fill="none,\s*stroke=/g, 'fill="none" stroke=');
fragment = fragment.replace(/\n{3,}/g, "\n\n").trim() + "\n";

fs.writeFileSync(outputPath, fragment, "utf8");
console.log(`Wrote ${outputPath}`);
