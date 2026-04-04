import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

async function getLegacyPortfolioFragment() {
  const fragmentPath = path.join(
    process.cwd(),
    'public',
    'legacy',
    'portfolio-fragment.html',
  );

  try {
    return await readFile(fragmentPath, 'utf8');
  } catch {
    return '<main class="main-content"><section class="section"><div class="container"><h1>Legacy portfolio fragment missing.</h1></div></section></main>';
  }
}

export default async function HomePage() {
  const legacyFragment = await getLegacyPortfolioFragment();

  return (
    <>
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); @import url('/legacy/Content/styles.css');"}
      </style>

      <div
        className="body-base"
        dangerouslySetInnerHTML={{ __html: legacyFragment }}
      />

      <Script src="/legacy/Scripts/script.js" strategy="afterInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
