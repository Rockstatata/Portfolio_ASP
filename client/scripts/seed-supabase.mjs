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

function toIsoDate(dateText) {
  if (!dateText) {
    return null;
  }

  const parsed = Date.parse(dateText);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed).toISOString();
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

loadEnvFile(path.join(projectRoot, '.env'));
loadEnvFile(path.join(projectRoot, '.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

const blogSeedRaw = [
  {
    title: 'Building Modern Web Applications with ASP.NET',
    excerpt:
      'Exploring the latest features and best practices for developing scalable web applications using ASP.NET Web Forms and modern techniques.',
    categories: 'Programming,Frontend',
    tags: 'development,website,Css',
    date: 'Apr 3, 2026',
    readTime: 4,
  },
  {
    title: 'Database Design Patterns for Portfolio Applications',
    excerpt:
      'Best practices for designing and implementing database schemas for portfolio and content management systems.',
    categories: 'Development,Cloud and Database',
    tags: 'Database,SQL Server,Architecture',
    date: 'Mar 27, 2026',
    readTime: 6,
  },
  {
    title: 'C# Development Tips for Aspiring Developers',
    excerpt:
      'Essential tips and tricks for writing clean, efficient C# code and building robust applications.',
    categories: 'Programming',
    tags: 'C#,Web Development,Best Practices',
    date: 'Mar 20, 2026',
    readTime: 5,
  },
];

const blogSeedIds = [
  'fefcc0c9-7f8f-4504-8a09-1488f32da001',
  'fefcc0c9-7f8f-4504-8a09-1488f32da002',
  'fefcc0c9-7f8f-4504-8a09-1488f32da003',
];

const blogRows = blogSeedRaw.map((item, index) => {
  const slug = slugify(item.title) || `blog-post-${index + 1}`;
  const publishedAt = toIsoDate(item.date) ?? null;

  return {
    id: blogSeedIds[index],
    title: item.title,
    slug,
    content: `${item.excerpt}\n\nThis article is now managed from the admin panel and database.`,
    excerpt: item.excerpt,
    categories: item.categories,
    tags: item.tags,
    published_at: publishedAt,
    read_time: item.readTime,
    image_url: null,
    status: 'published',
  };
});

const seedPlan = [
  {
    table: 'home_sections',
    rows: [
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470001',
        section_name: 'Status',
        content: 'Available for Projects',
        display_order: 1,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470002',
        section_name: 'Full Name',
        content: 'Sarwad Hasan Siddiqui',
        display_order: 2,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470003',
        section_name: 'Tagline',
        content: 'Crafting Digital Experiences with Innovation and Precision',
        display_order: 3,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470004',
        section_name: 'Description',
        content: 'Full-stack developer transforming ideas into scalable, user-focused applications.',
        display_order: 4,
        is_active: true,
        updated_at: nowIso,
      },
      {
        id: '8b6ff9c3-1f5d-4d03-88ac-6f9a1d470005',
        section_name: 'Skill Tags',
        content: 'Full Stack, Python Enthusiast, React Dev, UI/UX',
        display_order: 5,
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
        title: 'CSE Undergraduate',
        subtitle: 'Building innovative solutions for real-world problems with full-stack engineering and machine learning.',
        content:
          'I am a dedicated third-year Computer Science and Engineering student at KUET, currently working as a Software Developer Intern at Algosoft Technologies Ltd. I specialize in full-stack development, machine learning, and data-driven product engineering.',
        section_type: 'main',
        display_order: 1,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21002',
        title: 'React Native',
        subtitle: null,
        content: 'React Native',
        section_type: 'strength:skill',
        display_order: 2,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21003',
        title: 'React/Next.js',
        subtitle: null,
        content: 'React/Next.js',
        section_type: 'strength:skill',
        display_order: 3,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21004',
        title: 'UI/UX Design',
        subtitle: null,
        content: 'UI/UX Design',
        section_type: 'strength:skill',
        display_order: 4,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21005',
        title: 'FastAPI',
        subtitle: null,
        content: 'FastAPI',
        section_type: 'strength:skill',
        display_order: 5,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21006',
        title: 'Machine Learning',
        subtitle: null,
        content: 'Machine Learning',
        section_type: 'strength:skill',
        display_order: 6,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21007',
        title: 'Databases',
        subtitle: null,
        content: 'Databases',
        section_type: 'strength:skill',
        display_order: 7,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21008',
        title: 'Astronomical Data',
        subtitle: null,
        content: 'Astronomical Data',
        section_type: 'strength:research',
        display_order: 8,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21009',
        title: 'ML Algorithms',
        subtitle: null,
        content: 'ML Algorithms',
        section_type: 'strength:research',
        display_order: 9,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21010',
        title: 'Deep Learning',
        subtitle: null,
        content: 'Deep Learning',
        section_type: 'strength:research',
        display_order: 10,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21011',
        title: 'Natural Language Processing',
        subtitle: null,
        content: 'Natural Language Processing',
        section_type: 'strength:research',
        display_order: 11,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21012',
        title: 'Master AI/ML',
        subtitle: null,
        content: 'Master AI/ML',
        section_type: 'strength:goal',
        display_order: 12,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21013',
        title: 'Open Source',
        subtitle: null,
        content: 'Open Source',
        section_type: 'strength:goal',
        display_order: 13,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21014',
        title: 'Problem Solving',
        subtitle: null,
        content: 'Problem Solving',
        section_type: 'strength:goal',
        display_order: 14,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21015',
        title: 'Code in Space',
        subtitle: null,
        content: 'Code in Space',
        section_type: 'strength:goal',
        display_order: 15,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21016',
        title: 'Advanced AI/ML',
        subtitle: null,
        content: 'Deep Learning and Neural Networks',
        section_type: 'strength:learning',
        display_order: 16,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21017',
        title: 'Cloud Architecture',
        subtitle: null,
        content: 'AWS, Docker, Kubernetes',
        section_type: 'strength:learning',
        display_order: 17,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21018',
        title: 'Data Science',
        subtitle: null,
        content: 'Analytics and Visualization',
        section_type: 'strength:learning',
        display_order: 18,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21019',
        title: 'Web3 and Blockchain',
        subtitle: null,
        content: 'Decentralized Applications',
        section_type: 'strength:learning',
        display_order: 19,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21020',
        title: 'Cybersecurity',
        subtitle: null,
        content: 'Network Security and Penetration Testing',
        section_type: 'strength:learning',
        display_order: 20,
      },
      {
        id: '3a2d83a4-ef4f-4e89-a2e0-0cb0f6a21021',
        title: 'IoT Development',
        subtitle: null,
        content: 'Smart Devices and Automation',
        section_type: 'strength:learning',
        display_order: 21,
      },
    ],
  },
  {
    table: 'skills',
    rows: [
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583001',
        category: 'Frontend',
        skill_name: 'HTML',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        proficiency: 92,
        display_order: 1,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583002',
        category: 'Frontend',
        skill_name: 'CSS',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        proficiency: 90,
        display_order: 2,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583003',
        category: 'Frontend',
        skill_name: 'JavaScript',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        proficiency: 90,
        display_order: 3,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583004',
        category: 'Frontend',
        skill_name: 'React',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        proficiency: 88,
        display_order: 4,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583005',
        category: 'Backend',
        skill_name: 'Node.js',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        proficiency: 86,
        display_order: 5,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583006',
        category: 'Backend',
        skill_name: 'Python',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        proficiency: 85,
        display_order: 6,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583007',
        category: 'Backend',
        skill_name: 'MongoDB',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        proficiency: 82,
        display_order: 7,
      },
      {
        id: '40ed1be1-f495-4312-8faa-820f0d583008',
        category: 'Backend',
        skill_name: 'MySQL',
        skill_icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        proficiency: 82,
        display_order: 8,
      },
    ],
  },
  {
    table: 'timeline',
    rows: [
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4001',
        year_range: '2009-2015',
        title: 'BN College',
        location: 'Dhaka, Bangladesh',
        description: 'Primary Education',
        type: 'education',
        display_order: 1,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4002',
        year_range: '2015-2019',
        title: 'Adamjee Cantonment Public School',
        location: 'Dhaka, Bangladesh',
        description: 'Secondary Education (SSC)',
        type: 'education',
        display_order: 2,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4003',
        year_range: '2019-2022',
        title: 'Notre Dame College',
        location: 'Dhaka, Bangladesh',
        description: 'Higher Secondary Certificate (HSC) - Science',
        type: 'education',
        display_order: 3,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4004',
        year_range: '2023-Current',
        title: 'Khulna University of Engineering and Technology',
        location: 'Khulna, Bangladesh',
        description: 'B.Sc. in Computer Science and Engineering',
        type: 'education',
        display_order: 4,
      },
      {
        id: '67f69073-6f4b-49d0-a422-43d6990b4005',
        year_range: '2025-Current',
        title: 'Algosoft Technologies Ltd.',
        location: 'Dhaka, Bangladesh',
        description: 'Software Developer Intern',
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
        company: 'Algosoft Technologies Ltd.',
        position: 'Software Developer Intern',
        duration: '2025 - Current',
        description: 'Working as a Software Developer Intern, focusing on web development and application architecture.',
        responsibilities: 'Web Development,ASP.NET,Team Collaboration,Best Practices',
        display_order: 1,
      },
      {
        id: 'f574b8d0-c0ad-4eeb-92d6-c2a33bc24002',
        company: 'Freelance Work',
        position: 'Full Stack Developer',
        duration: '2023 - Present',
        description: 'Working on various freelance projects, developing websites and applications for clients.',
        responsibilities: 'Responsive Design,Client Management,Database Design,API Development',
        display_order: 2,
      },
    ],
  },
  {
    table: 'projects',
    rows: [],
  },
  {
    table: 'blog_posts',
    rows: blogRows,
  },
  {
    table: 'social_links',
    rows: [
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7001',
        platform: 'GitHub',
        url: 'https://github.com/Rockstatata',
        icon_class: 'FaGithub',
        display_order: 1,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7002',
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/sarwad-hasan-siddiqui/',
        icon_class: 'FaLinkedin',
        display_order: 2,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7003',
        platform: 'Email',
        url: 'mailto:sarwad015@gmail.com',
        icon_class: 'FaEnvelope',
        display_order: 3,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7004',
        platform: 'X',
        url: 'https://x.com/Shspianto',
        icon_class: 'FaXTwitter',
        display_order: 4,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7005',
        platform: 'Instagram',
        url: 'https://instagram.com/pianto._',
        icon_class: 'FaInstagram',
        display_order: 5,
        is_active: true,
      },
      {
        id: 'f89ca8a4-a0d6-4f06-bb07-41e8b4fd7006',
        platform: 'Facebook',
        url: 'https://facebook.com/Hasa.Sarwad07',
        icon_class: 'FaFacebook',
        display_order: 6,
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

async function truncateTable(table) {
  const { error } = await supabase
    .from(table)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    const detailText = [error.details, error.hint]
      .filter(Boolean)
      .join(' | ');

    throw new Error(
      `Failed clearing ${table}: ${error.message}`
      + (error.code ? ` (code: ${error.code})` : '')
      + (detailText ? ` | ${detailText}` : ''),
    );
  }
}

async function insertRows(table, rows) {
  if (!rows.length) {
    return;
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
}

async function seedTable({ table, rows }, before) {
  if (!force && before > 0) {
    console.log(`- ${table}: skipped (already has ${before} row${before === 1 ? '' : 's'})`);
    return;
  }

  if (force) {
    await truncateTable(table);
    await insertRows(table, rows);

    const after = await countRows(table);
    console.log(`- ${table}: ${before} -> ${after}`);
    return;
  }

  await insertRows(table, rows);
  const after = await countRows(table);
  console.log(`- ${table}: ${before} -> ${after}`);
}

async function run() {
  console.log(`Supabase seed starting (${force ? 'force-sync' : 'if-empty'} mode)...`);

  const preflightCounts = new Map();
  const missingTables = [];
  const requiredTables = [...seedPlan.map((tableSeed) => tableSeed.table), 'storage_files'];

  for (const tableName of requiredTables) {
    try {
      const count = await countRows(tableName);
      preflightCounts.set(tableName, count);
    } catch (error) {
      missingTables.push({ table: tableName, message: error.message });
    }
  }

  if (missingTables.length > 0) {
    console.error('Schema check failed. These tables are missing or inaccessible:');
    for (const issue of missingTables) {
      console.error(`- ${issue.table}: ${issue.message}`);
    }
    console.error('Apply client/supabase/schema.sql and ensure public schema exposure in Supabase API settings, then rerun this command.');
    process.exit(1);
  }

  if (checkOnly) {
    console.log('Schema check passed. Current row counts:');
    for (const tableName of requiredTables) {
      const count = preflightCounts.get(tableName) ?? 0;
      console.log(`- ${tableName}: ${count}`);
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
