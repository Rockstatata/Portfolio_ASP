import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const normalizedLine = line.startsWith('export ') ? line.slice(7) : line;
    const eqIndex = normalizedLine.indexOf('=');
    if (eqIndex <= 0) {
      continue;
    }

    const key = normalizedLine.slice(0, eqIndex).trim();
    let value = normalizedLine.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(path.join(projectRoot, '.env'));
loadEnvFile(path.join(projectRoot, '.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function decodeJwtPayload(token) {
  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  try {
    const base64 = segments[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env/.env.local');
  process.exit(1);
}

if (serviceRoleKey.startsWith('sb_publishable_') || serviceRoleKey.startsWith('sb_anon_')) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is a publishable/anon key. Use a secret service-role key.');
  process.exit(1);
}

const keyPayload = decodeJwtPayload(serviceRoleKey);
if (keyPayload?.role && keyPayload.role !== 'service_role') {
  console.error(`SUPABASE_SERVICE_ROLE_KEY has role '${keyPayload.role}', expected 'service_role'.`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const nowIso = new Date().toISOString();
const force = process.argv.includes('--force');
const checkOnly = process.argv.includes('--check');

const seedPlan = [
  {
    table: 'home_sections',
    rows: [
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470001',
        section_name: 'Hero',
        content: 'I design and build modern full-stack products with Next.js, ASP.NET, and Supabase.',
        display_order: 1,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470002',
        section_name: 'About',
        content: 'A developer focused on clean architecture, reliable systems, and elegant UI.',
        display_order: 2,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470003',
        section_name: 'Skills',
        content: 'Core technologies I use to ship production-ready apps.',
        display_order: 3,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470004',
        section_name: 'Projects',
        content: 'Selected work from web, automation, and platform engineering.',
        display_order: 4,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470005',
        section_name: 'Timeline',
        content: 'A quick walkthrough of my journey and key milestones.',
        display_order: 5,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470006',
        section_name: 'Experience',
        content: 'Roles where I delivered measurable product and engineering impact.',
        display_order: 6,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470007',
        section_name: 'Blog',
        content: 'Notes on engineering, product thinking, and practical architecture.',
        display_order: 7,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470008',
        section_name: 'Contact',
        content: 'Open to collaboration, freelance work, and full-time opportunities.',
        display_order: 8,
        is_active: true,
        updated_at: nowIso,
      },
    ],
  },
  {
    table: 'about_sections',
    rows: [
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21001',
        title: 'Who I Am',
        subtitle: 'Full-Stack Developer',
        content:
          'I am a full-stack developer who enjoys turning complex ideas into practical products. My work emphasizes maintainable architecture, predictable delivery, and accessible user experiences.',
        section_type: 'main',
        display_order: 1,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21002',
        title: 'How I Work',
        subtitle: 'Build For Scale',
        content:
          'I prefer shipping in small reliable increments, validating with real usage, and improving from measurable feedback. This keeps products stable while moving fast.',
        section_type: 'workflow',
        display_order: 2,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21003',
        title: 'Technical Leadership',
        subtitle: null,
        content:
          'I enjoy mentoring teammates, improving developer experience, and setting standards that keep teams productive over time.',
        section_type: 'strength:leadership',
        display_order: 3,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21004',
        title: 'Product Thinking',
        subtitle: null,
        content:
          'I focus on building features that clearly map to user value, business goals, and long-term maintainability.',
        section_type: 'strength:product',
        display_order: 4,
      },
    ],
  },
  {
    table: 'skills',
    rows: [
      { id: '40ed1be1-f495-4312-8faa-820f0d583001', category: 'Frontend', skill_name: 'Next.js', skill_icon: 'SiNextdotjs', proficiency: 90, display_order: 1 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583002', category: 'Frontend', skill_name: 'React', skill_icon: 'FaReact', proficiency: 90, display_order: 2 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583003', category: 'Frontend', skill_name: 'TypeScript', skill_icon: 'SiTypescript', proficiency: 88, display_order: 3 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583004', category: 'Frontend', skill_name: 'Tailwind CSS', skill_icon: 'SiTailwindcss', proficiency: 86, display_order: 4 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583005', category: 'Backend', skill_name: 'ASP.NET', skill_icon: 'SiDotnet', proficiency: 87, display_order: 5 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583006', category: 'Backend', skill_name: 'Node.js', skill_icon: 'FaNodeJs', proficiency: 84, display_order: 6 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583007', category: 'Backend', skill_name: 'Python', skill_icon: 'FaPython', proficiency: 82, display_order: 7 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583008', category: 'Database', skill_name: 'PostgreSQL', skill_icon: 'SiPostgresql', proficiency: 86, display_order: 8 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583009', category: 'Database', skill_name: 'Supabase', skill_icon: 'SiSupabase', proficiency: 85, display_order: 9 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583010', category: 'DevOps', skill_name: 'Docker', skill_icon: 'FaDocker', proficiency: 76, display_order: 10 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583011', category: 'DevOps', skill_name: 'GitHub Actions', skill_icon: 'SiGithubactions', proficiency: 74, display_order: 11 },
      { id: '40ed1be1-f495-4312-8faa-820f0d583012', category: 'Tools', skill_name: 'Git', skill_icon: 'FaGitAlt', proficiency: 90, display_order: 12 },
    ],
  },
  {
    table: 'timeline',
    rows: [
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4001',
        year_range: '2019 - 2023',
        title: 'BSc in Computer Science',
        location: 'University Program',
        description: 'Built a strong foundation in software engineering, databases, and system design.',
        type: 'education',
        display_order: 1,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4002',
        year_range: '2023',
        title: 'Launched First Production SaaS',
        location: 'Independent Project',
        description: 'Designed and shipped a multi-user web product with auth, payments, and analytics.',
        type: 'milestone',
        display_order: 2,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4003',
        year_range: '2023 - 2024',
        title: 'Software Engineer',
        location: 'Product Team',
        description: 'Delivered full-stack features across dashboards, APIs, and CI/CD pipelines.',
        type: 'work',
        display_order: 3,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4004',
        year_range: '2024',
        title: 'Portfolio Platform Migration',
        location: 'Personal Brand Project',
        description: 'Migrated legacy stack to Next.js + Supabase with structured admin content management.',
        type: 'milestone',
        display_order: 4,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4005',
        year_range: '2025 - Present',
        title: 'Senior Full-Stack Contributor',
        location: 'Remote',
        description: 'Leading architecture decisions and improving product velocity across web platforms.',
        type: 'work',
        display_order: 5,
      },
    ],
  },
  {
    table: 'experiences',
    rows: [
      {
        id: 'f574b8d0-c0ad-4eeb-92d6-c2a33bc24001',
        company: 'Nimbus Labs',
        position: 'Full-Stack Developer',
        duration: '2023 - 2024',
        description: 'Built customer-facing platform modules with Next.js, C#, and PostgreSQL.',
        responsibilities: 'Led feature delivery,Designed API contracts,Optimized dashboard performance',
        display_order: 1,
      },
      {
        id: 'f574b8d0-c0ad-4eeb-92d6-c2a33bc24002',
        company: 'Vertex Systems',
        position: 'Software Engineer',
        duration: '2024 - 2025',
        description: 'Delivered scalable internal tooling for operations and reporting workflows.',
        responsibilities: 'Implemented RBAC flows,Maintained CI pipelines,Improved release reliability',
        display_order: 2,
      },
      {
        id: 'f574b8d0-c0ad-4eeb-92d6-c2a33bc24003',
        company: 'Independent',
        position: 'Freelance Developer',
        duration: '2025 - Present',
        description: 'Partnering with startups to launch production-ready products faster.',
        responsibilities: 'Own architecture decisions,Ship MVPs end-to-end,Support post-launch growth',
        display_order: 3,
      },
    ],
  },
  {
    table: 'projects',
    rows: [
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1001',
        title: 'Portfolio Command Center',
        description: 'A modern portfolio + admin workflow with dynamic sections, content management, and clean data contracts.',
        technologies: 'Next.js,TypeScript,Tailwind CSS,Supabase',
        project_year: 2025,
        demo_url: 'https://example.com/portfolio-command-center',
        github_url: 'https://github.com/example/portfolio-command-center',
        status: 'active',
        display_order: 1,
        updated_at: nowIso,
      },
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1002',
        title: 'Realtime Ops Dashboard',
        description: 'Realtime operations dashboard for monitoring queues, incidents, and SLA metrics with role-based access.',
        technologies: 'React,Node.js,WebSockets,PostgreSQL',
        project_year: 2024,
        demo_url: 'https://example.com/realtime-ops',
        github_url: 'https://github.com/example/realtime-ops',
        status: 'active',
        display_order: 2,
        updated_at: nowIso,
      },
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1003',
        title: 'Learning Hub LMS',
        description: 'An online learning platform with creator workflows, progress tracking, and layered authorization.',
        technologies: 'Next.js,ASP.NET,Redis,Azure',
        project_year: 2024,
        demo_url: 'https://example.com/learning-hub',
        github_url: 'https://github.com/example/learning-hub',
        status: 'active',
        display_order: 3,
        updated_at: nowIso,
      },
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1004',
        title: 'Finance Insight API',
        description: 'Data aggregation API with scheduled ETL, validation pipelines, and secure client endpoints.',
        technologies: 'Python,FastAPI,PostgreSQL,Docker',
        project_year: 2023,
        demo_url: 'https://example.com/finance-insight',
        github_url: 'https://github.com/example/finance-insight',
        status: 'active',
        display_order: 4,
        updated_at: nowIso,
      },
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1005',
        title: 'Support Automation Bot',
        description: 'Automated support triage assistant that reduced response time using intent routing and workflow rules.',
        technologies: 'Node.js,TypeScript,OpenAI,Queues',
        project_year: 2023,
        demo_url: 'https://example.com/support-bot',
        github_url: 'https://github.com/example/support-bot',
        status: 'active',
        display_order: 5,
        updated_at: nowIso,
      },
      {
        id: '2411d4f4-7c20-4e76-bc62-5897946a1006',
        title: 'Archived Prototype',
        description: 'An early prototype kept for reference and architecture lessons.',
        technologies: 'Vue.js,Firebase',
        project_year: 2022,
        demo_url: null,
        github_url: 'https://github.com/example/archived-prototype',
        status: 'archived',
        display_order: 6,
        updated_at: nowIso,
      },
    ],
  },
  {
    table: 'blog_posts',
    rows: [
      {
        id: 'fefcc0c9-7f8f-4504-8a09-1488f32da001',
        title: 'Designing Admin Panels That Age Well',
        slug: 'designing-admin-panels-that-age-well',
        content:
          'A good admin panel is not only functional on day one, it remains predictable as data and teams scale.\n\nIn this post, I cover naming conventions, schema guardrails, and practical UX defaults that prevent long-term maintenance pain.\n\nYou will also find a checklist for auditing admin features before deploying to production.',
        excerpt: 'Patterns and guardrails for building maintainable admin tools that stay clean under growth.',
        categories: 'Engineering,Architecture',
        tags: 'admin,architecture,ux,maintenance',
        published_at: '2025-01-15T10:00:00.000Z',
        read_time: 6,
        image_url: null,
        status: 'published',
      },
      {
        id: 'fefcc0c9-7f8f-4504-8a09-1488f32da002',
        title: 'From Legacy WebForms to Next.js Without Chaos',
        slug: 'from-legacy-webforms-to-nextjs-without-chaos',
        content:
          'Migrating old systems can be risky if the plan is only code-first.\n\nThe safer path is behavior-first: preserve existing user flows, map data contracts, then modernize layer by layer.\n\nThis article shares the migration sequence I use for reducing production risk during platform transitions.',
        excerpt: 'A practical migration sequence that keeps feature parity while modernizing legacy systems.',
        categories: 'Migration,Next.js',
        tags: 'migration,nextjs,aspnet,delivery',
        published_at: '2025-02-09T09:30:00.000Z',
        read_time: 7,
        image_url: null,
        status: 'published',
      },
      {
        id: 'fefcc0c9-7f8f-4504-8a09-1488f32da003',
        title: 'Supabase RLS: A Practical Starter Template',
        slug: 'supabase-rls-practical-starter-template',
        content:
          'RLS can be the strongest safety net in your stack if it is modeled intentionally.\n\nThis guide explains how to define simple public-read and restricted-write policies, test assumptions, and avoid accidental overexposure.\n\nIt includes a reusable baseline policy strategy for portfolio and CMS-style apps.',
        excerpt: 'A practical baseline for Supabase Row Level Security with real-world policy examples.',
        categories: 'Database,Security',
        tags: 'supabase,rls,postgres,security',
        published_at: '2025-03-02T12:15:00.000Z',
        read_time: 5,
        image_url: null,
        status: 'published',
      },
    ],
  },
  {
    table: 'social_links',
    rows: [
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7001',
        platform: 'GitHub',
        url: 'https://github.com/your-username',
        icon_class: 'FaGithub',
        display_order: 1,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7002',
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/your-username',
        icon_class: 'FaLinkedin',
        display_order: 2,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7003',
        platform: 'X',
        url: 'https://x.com/your-username',
        icon_class: 'FaXTwitter',
        display_order: 3,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7004',
        platform: 'Email',
        url: 'mailto:hello@yourdomain.com',
        icon_class: 'FaEnvelope',
        display_order: 4,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7005',
        platform: 'Website',
        url: 'https://yourdomain.com',
        icon_class: 'FaGlobe',
        display_order: 5,
        is_active: true,
      },
    ],
  },
];

async function countRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact' })
    .limit(1);

  if (error) {
    throw new Error(
      `Failed counting ${table}: ${error.message}`
      + (error.code ? ` (code: ${error.code})` : ''),
    );
  }

  return count ?? 0;
}

async function seedTable({ table, rows }, before) {
  if (!force && before > 0) {
    console.log(`- ${table}: skipped (already has ${before} row${before === 1 ? '' : 's'})`);
    return;
  }

  if (force) {
    const ids = rows
      .map((row) => row.id)
      .filter(Boolean);

    if (ids.length > 0) {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .in('id', ids);

      if (deleteError) {
        const detailText = [deleteError.details, deleteError.hint]
          .filter(Boolean)
          .join(' | ');
        throw new Error(
          `Failed resetting ${table}: ${deleteError.message}`
          + (deleteError.code ? ` (code: ${deleteError.code})` : '')
          + (detailText ? ` | ${detailText}` : ''),
        );
      }
    }
  }

  const { error } = await supabase
    .from(table)
    .insert(rows);

  if (error) {
    const detailText = [error.details, error.hint]
      .filter(Boolean)
      .join(' | ');
    throw new Error(
      `Failed seeding ${table}: ${error.message}`
      + (error.code ? ` (code: ${error.code})` : '')
      + (detailText ? ` | ${detailText}` : ''),
    );
  }

  const after = await countRows(table);
  console.log(`- ${table}: ${before} -> ${after}`);
}

async function run() {
  console.log(`Supabase seed starting (${force ? 'force' : 'if-empty'} mode)...`);

  const preflightCounts = new Map();
  const missingTables = [];

  for (const tableSeed of seedPlan) {
    try {
      const count = await countRows(tableSeed.table);
      preflightCounts.set(tableSeed.table, count);
    } catch (error) {
      missingTables.push({ table: tableSeed.table, message: error.message });
    }
  }

  if (missingTables.length > 0) {
    console.error('Schema check failed. These tables are missing or inaccessible:');
    for (const issue of missingTables) {
      console.error(`- ${issue.table}: ${issue.message}`);
    }
    console.error('Apply client/supabase/schema.sql and ensure "public" is listed in Supabase API exposed schemas, then rerun this command.');
    process.exit(1);
  }

  if (checkOnly) {
    console.log('Schema check passed. Current row counts:');
    for (const tableSeed of seedPlan) {
      const count = preflightCounts.get(tableSeed.table) ?? 0;
      console.log(`- ${tableSeed.table}: ${count}`);
    }
    return;
  }

  for (const tableSeed of seedPlan) {
    await seedTable(tableSeed, preflightCounts.get(tableSeed.table) ?? 0);
  }

  console.log('Seed completed successfully.');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
