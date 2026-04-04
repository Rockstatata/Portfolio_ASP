import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const repoRoot = path.resolve(scriptDir, '..', '..');

const aspxPath = path.join(repoRoot, 'server', 'admin_panel', 'portfolio.aspx');
const outputDir = path.join(repoRoot, 'client', 'public', 'legacy');
const outputPath = path.join(outputDir, 'portfolio-fragment.html');

const formatDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const resolveExpression = (expression) => {
  const getSettingMatch = expression.match(/GetSetting\([^,]+,\s*"([^"]*)"\s*\)/);
  if (getSettingMatch) {
    return getSettingMatch[1];
  }

  if (/^CurrentYear$/.test(expression)) {
    return String(new Date().getFullYear());
  }

  const formatDateMatch = expression.match(
    /FormatDate\(DateTime\.Now(?:\.AddDays\(([-\d]+)\))?,\s*"MMM d, yyyy"\)/,
  );
  if (formatDateMatch) {
    return formatDate(Number(formatDateMatch[1] || 0));
  }

  return '';
};

const replaceSectionById = (html, sectionId, transformer) => {
  const sectionRegex = new RegExp(`<section id="${sectionId}"[\\s\\S]*?<\\/section>`, 'i');
  const sectionMatch = html.match(sectionRegex);
  if (!sectionMatch) {
    return html;
  }

  const originalSection = sectionMatch[0];
  const transformedSection = transformer(originalSection);
  if (!transformedSection || transformedSection === originalSection) {
    return html;
  }

  return html.replace(originalSection, transformedSection);
};

const raw = fs.readFileSync(aspxPath, 'utf8');
const bodyMatch = raw.match(/<div id="vanta-background"[\s\S]*?<\/form>/i);
if (!bodyMatch) {
  throw new Error('Could not extract portfolio body fragment from portfolio.aspx');
}

const source = bodyMatch[0].replace(/<\/form>\s*$/i, '');

const tokens = [];
let cursor = 0;
const serverTagRegex = /<%([\s\S]*?)%>/g;
let serverTagMatch;
while ((serverTagMatch = serverTagRegex.exec(source)) !== null) {
  if (serverTagMatch.index > cursor) {
    tokens.push({ type: 'text', value: source.slice(cursor, serverTagMatch.index) });
  }

  tokens.push({ type: 'code', value: serverTagMatch[1] });
  cursor = serverTagRegex.lastIndex;
}

if (cursor < source.length) {
  tokens.push({ type: 'text', value: source.slice(cursor) });
}

const stack = [{ kind: 'root', include: true }];

const isIncluded = () => stack.every((entry) => entry.include !== false);

let fragment = '';

for (const token of tokens) {
  if (token.type === 'text') {
    if (isIncluded()) {
      fragment += token.value;
    }
    continue;
  }

  const code = token.value.replace(/\r/g, '').trim();
  if (!code) {
    continue;
  }

  const compactCode = code.replace(/\s+/g, ' ').trim();

  if (compactCode.startsWith('@')) {
    continue;
  }

  const expressionMatch = compactCode.match(/^[:=]\s*([\s\S]+)$/);
  if (expressionMatch) {
    if (isIncluded()) {
      fragment += resolveExpression(expressionMatch[1].trim());
    }
    continue;
  }

  if (/^}\s*else\b/.test(compactCode)) {
    const previous = stack.pop();
    stack.push({
      kind: 'else',
      include: previous && previous.kind === 'if' ? previous.parentInclude : false,
      parentInclude: previous && previous.parentInclude,
    });
    continue;
  }

  if (/^}\s*(\/\/.*)?$/.test(compactCode)) {
    if (stack.length > 1) {
      stack.pop();
    }
    continue;
  }

  if (/\bif\s*\(/.test(compactCode) && compactCode.endsWith('{')) {
    stack.push({ kind: 'if', include: false, parentInclude: isIncluded() });
    continue;
  }

  if (/\b(foreach|for|while)\s*\(/.test(compactCode) && compactCode.endsWith('{')) {
    stack.push({ kind: 'loop', include: false, parentInclude: isIncluded() });
    continue;
  }

  if (compactCode.endsWith('{')) {
    stack.push({ kind: 'block', include: isIncluded() });
  }
}

fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtName"[\s\S]*?\/>/gi,
  '<input id="txtName" name="name" type="text" placeholder="Your Name *" class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtEmail"[\s\S]*?\/>/gi,
  '<input id="txtEmail" name="email" type="email" placeholder="Your Email *" class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtSubject"[\s\S]*?\/>/gi,
  '<input id="txtSubject" name="subject" type="text" placeholder="Your Subject..." class="form-input" />',
);
fragment = fragment.replace(
  /<asp:TextBox[\s\S]*?ID="txtMessage"[\s\S]*?\/>/gi,
  '<textarea id="txtMessage" name="message" rows="6" placeholder="Your message..." class="form-textarea"></textarea>',
);
fragment = fragment.replace(
  /<asp:Button[\s\S]*?ID="btnSubmitContact"[\s\S]*?\/>/gi,
  '<button type="submit" id="btnSubmitContact" class="contact-submit-btn">SEND</button>',
);

fragment = fragment.replace(/\srunat="server"/gi, '');
fragment = fragment.replace(/<\/asp:[^>]+>/gi, '');
fragment = fragment.replace(/<asp:[^>]+>/gi, '');

fragment = fragment.replace(/(\.\/)?Content\/assets\//g, '/legacy/assets/');
fragment = fragment.replace(/id="contactFormDiv"/g, 'id="contactForm"');
fragment = fragment.replace(
  /<div class="contact-form" id="contactForm">/g,
  '<form class="contact-form" id="contactForm">',
);
fragment = fragment.replace(
  /(<button type="submit" id="btnSubmitContact" class="contact-submit-btn">SEND<\/button>)\s*<\/div>/,
  '$1\n                  </form>',
);
fragment = fragment.replace(
  /<div class="scroll-indicator-dots">\s*<\/div>/g,
  '<div class="scroll-indicator-dots"><div class="scroll-dot active" data-index="0"></div><div class="scroll-dot" data-index="1"></div><div class="scroll-dot" data-index="2"></div></div>',
);
fragment = fragment.replace(/>\s*f\s*<\/iframe>/g, '></iframe>');
fragment = fragment.replace(/fill="none,\s*stroke=/g, 'fill="none" stroke=');

fragment = replaceSectionById(fragment, 'skills', (section) =>
  section.replace(/<!--\s*Category\s*-->[\s\S]*?(?=<!-- Frontend Category -->)/i, ''),
);

fragment = replaceSectionById(fragment, 'timeline', (section) => {
  return section.replace(
    /<div class="timeline-content">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
    `<div class="timeline-content">
            <div class="timeline-line"></div>
          </div>
        </div>
      </section>`,
  );
});

fragment = replaceSectionById(fragment, 'projects', (section) => {
  if (/article class="glass-card project-card"/i.test(section)) {
    return section;
  }

  return section.replace(
    /<div class="projects-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
    `<div class="projects-grid">
          </div>
        </div>
      </section>`,
  );
});

fragment = replaceSectionById(fragment, 'experience', (section) =>
  section.replace(
    /<div class="projects-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
    `<div class="projects-grid">
          </div>
        </div>
      </section>`,
  ),
);

fragment = replaceSectionById(fragment, 'blog', (section) =>
  section.replace(
    /<div class="blog-grid-scroll" id="blogGrid">[\s\S]*?<\/div>\s*\n\s*<!-- Scroll Indicator -->/i,
    `<div class="blog-grid-scroll" id="blogGrid">
            </div>

            <!-- Scroll Indicator -->`,
  ),
);

fragment = replaceSectionById(fragment, 'home', (section) => {
  let nextSection = section;

  nextSection = nextSection.replace(
    /<span class="status-text">[\s\S]*?<\/span>/i,
    '<span class="status-text"></span>',
  );

  nextSection = nextSection.replace(
    /<h1 class="main-heading">[\s\S]*?<\/h1>/i,
    `<h1 class="main-heading">
                  <div class="name-line">
                    <span class="slide-up text-gradient-primary" style="--delay: 0ms"></span>
                  </div>
                  <div class="name-line">
                    <span class="slide-up name-middle" style="--delay: 100ms"></span>
                  </div>
                  <div class="name-line">
                    <span class="slide-up text-gradient-secondary" style="--delay: 200ms"></span>
                  </div>
                </h1>`,
  );

  nextSection = nextSection.replace(
    /<h2 class="tagline">[\s\S]*?<\/h2>/i,
    '<h2 class="tagline"></h2>',
  );

  nextSection = nextSection.replace(
    /<p class="description">[\s\S]*?<\/p>/i,
    '<p class="description"></p>',
  );

  nextSection = nextSection.replace(
    /<div class="skill-tags slide-up"[^>]*>[\s\S]*?<\/div>/i,
    '<div class="skill-tags slide-up" style="--delay: 500ms"></div>',
  );

  nextSection = nextSection.replace(
    /<div class="social-links">[\s\S]*?<\/div>/i,
    '<div class="social-links">\n                </div>',
  );

  return nextSection;
});

fragment = replaceSectionById(fragment, 'about', () => `
      <section id="about" class="about-section">
        <div class="about-container">
          <div class="about-header">
            <h2 class="about-title">About Me</h2>
            <p class="about-description">
              Discover my journey, passions, and the technologies that drive my
              creative vision
            </p>
          </div>

          <div class="bento-grid">
            <div class="bento-card bento-card-large group">
              <div class="card-content">
                <div class="card-header">
                  <div>
                    <h3 class="card-title"></h3>
                  </div>
                </div>

                <p class="card-text card-mb-8"></p>
                <p class="text-large card-mb-8 text-relaxed text-gray-700"></p>
                <p class="text-large card-mb-8 text-relaxed text-gray-700"></p>
                <p class="text-large card-mb-6 text-relaxed text-gray-700"></p>
              </div>

              <div class="floating-element floating-element-1"></div>
              <div class="floating-element floating-element-2"></div>
            </div>

            <div class="bento-card bento-card-wide group">
              <div class="card-header-mb-6">
                <span class="text-small text-gray-500 text-medium text-uppercase text-tracking-wider">What I Do</span>
                <h3 class="card-title card-mt-1">Development Arsenal</h3>
              </div>

              <div class="skills-grid skills-mb-4"></div>

              <p class="text-small text-gray-600">
                Building cross-platform applications with clean, modular, and
                maintainable code
              </p>
            </div>

            <div class="bento-card bento-card-wide group">
              <h3 class="card-title card-mb-4">Research Focus</h3>

              <div class="research-grid text-small"></div>

              <p class="text-extra-small text-gray-500 research-mt-4">
                Exploring the intersection of space science and AI
              </p>
            </div>

            <div class="bento-card group">
              <div>
                <h3 class="card-title card-mb-4">Future Goals</h3>

                <div class="goals-list"></div>

                <p class="text-extra-small text-gray-500 goals-mt-4">
                  Creating impactful solutions for humanity
                </p>
              </div>
            </div>

            <div class="bento-card bento-card-wider group">
              <div class="flex-items-start-justify-between learning-mb-6">
                <div>
                  <h3 class="card-title learning-mt-1">Current Focus Areas</h3>
                </div>
              </div>

              <div class="learning-grid"></div>
            </div>
          </div>
        </div>
      </section>
`);

fragment = replaceSectionById(fragment, 'skills', (section) =>
  section.replace(
    /<div class="skills-categories-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
    `<div class="skills-categories-grid">
          </div>
        </div>
      </section>`,
  ),
);

fragment = replaceSectionById(fragment, 'contact', (section) =>
  section.replace(
    /<div class="social-links-contact">[\s\S]*?<\/div>/i,
    '<div class="social-links-contact">\n              </div>',
  ),
);

fragment = fragment.replace(
  /<form class="contact-form" id="contactForm">\s*<form class="contact-form" id="contactForm">/i,
  '<form class="contact-form" id="contactForm">',
);

fragment = fragment.replace(
  /<span class="brand-text">[\s\S]*?<\/span>/i,
  '<span class="brand-text"></span>',
);

fragment = fragment.replace(
  /(<a[^>]*class="footer-link"[^>]*>)[\s\S]*?(<\/a>)/i,
  '$1$2',
);

fragment = fragment.replace(
  /alt="Sarwad Hasan Siddiqui"/gi,
  'alt="Profile photo"',
);

fragment = fragment.replace(/\n{3,}/g, '\n\n').trim() + '\n';

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, fragment, 'utf8');

console.log(`Wrote ${outputPath}`);
