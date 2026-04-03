import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const missingEnv = [
  !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
  !serviceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
].filter(Boolean) as string[];

if (missingEnv.length > 0) {
  console.warn(
    `[supabaseAdmin] Missing environment variable(s): ${missingEnv.join(', ')}`,
  );
}

const rawClient = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  serviceRoleKey ?? 'placeholder-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export const supabaseAdmin = new Proxy(rawClient, {
  get(target, property, receiver) {
    if (missingEnv.length > 0) {
      throw new Error(
        `Missing Supabase admin environment variable(s): ${missingEnv.join(', ')}`,
      );
    }

    const value = Reflect.get(target, property, receiver);
    if (typeof value === 'function') {
      return value.bind(target);
    }
    return value;
  },
}) as typeof rawClient;
