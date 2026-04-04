import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = supabasePublishableKey ?? supabaseAnonKey;
const missingEnv = [
  !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
  !supabaseKey && 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
].filter(Boolean) as string[];

const rawClient = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-publishable-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);

if (missingEnv.length > 0) {
  console.warn(
    `[supabase] Missing environment variable(s): ${missingEnv.join(', ')}`,
  );
}

export const supabase = new Proxy(rawClient, {
  get(target, property, receiver) {
    if (missingEnv.length > 0) {
      throw new Error(
        `Missing Supabase environment variable(s): ${missingEnv.join(', ')}`,
      );
    }

    const value = Reflect.get(target, property, receiver);
    if (typeof value === 'function') {
      return value.bind(target);
    }
    return value;
  },
}) as typeof rawClient;
