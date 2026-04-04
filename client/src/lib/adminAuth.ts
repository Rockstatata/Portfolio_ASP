export const ADMIN_AUTH_COOKIE = 'portfolio_admin_session';

const DEFAULT_ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const MINIMUM_PASSKEY_LENGTH = 8;
const RECOMMENDED_PASSKEY_LENGTH = 12;
const MINIMUM_SESSION_SECRET_LENGTH = 32;
const ADMIN_SESSION_SUBJECT = 'portfolio-admin';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type AdminSessionHeader = {
  alg: 'HS256';
  typ: 'JWT';
};

type AdminSessionPayload = {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
};

function toBase64Url(base64Value: string) {
  return base64Value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64UrlValue: string) {
  const base64Value = base64UrlValue.replace(/-/g, '+').replace(/_/g, '/');
  const missingPadding = base64Value.length % 4;
  if (missingPadding === 0) {
    return base64Value;
  }

  return `${base64Value}${'='.repeat(4 - missingPadding)}`;
}

function encodeBase64(bytes: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function decodeBase64(base64Value: string) {
  try {
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(base64Value, 'base64'));
    }

    const binary = atob(base64Value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

function encodeJsonToBase64Url(value: object) {
  const serialized = JSON.stringify(value);
  return toBase64Url(encodeBase64(textEncoder.encode(serialized)));
}

function decodeJsonFromBase64Url<T>(value: string) {
  const decodedBytes = decodeBase64(fromBase64Url(value));
  if (!decodedBytes) {
    return null;
  }

  try {
    return JSON.parse(textDecoder.decode(decodedBytes)) as T;
  } catch {
    return null;
  }
}

function getCrypto() {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available in this runtime.');
  }

  return crypto;
}

async function importHmacKey(secret: string) {
  const runtimeCrypto = getCrypto();
  return runtimeCrypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signTokenPayload(signingInput: string, secret: string) {
  const runtimeCrypto = getCrypto();
  const key = await importHmacKey(secret);
  const signature = await runtimeCrypto.subtle.sign(
    'HMAC',
    key,
    textEncoder.encode(signingInput),
  );

  return toBase64Url(encodeBase64(new Uint8Array(signature)));
}

async function verifyTokenSignature(signingInput: string, signature: string, secret: string) {
  const runtimeCrypto = getCrypto();
  const key = await importHmacKey(secret);
  const signatureBytes = decodeBase64(fromBase64Url(signature));
  if (!signatureBytes) {
    return false;
  }

  return runtimeCrypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    textEncoder.encode(signingInput),
  );
}

function getUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function getSessionTokenId() {
  const runtimeCrypto = getCrypto();
  if (typeof runtimeCrypto.randomUUID === 'function') {
    return runtimeCrypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getAdminPasskey() {
  const configured = process.env.ADMIN_PASSKEY?.trim();
  if (!configured) {
    throw new Error('Missing required environment variable: ADMIN_PASSKEY');
  }

  if (configured.length < MINIMUM_PASSKEY_LENGTH) {
    throw new Error(
      `ADMIN_PASSKEY must be at least ${MINIMUM_PASSKEY_LENGTH} characters.`,
    );
  }

  if (configured.length < RECOMMENDED_PASSKEY_LENGTH) {
    console.warn(
      `[adminAuth] ADMIN_PASSKEY is accepted but shorter than the recommended ${RECOMMENDED_PASSKEY_LENGTH} characters.`,
    );
  }

  return configured;
}

export function getAdminSessionSecret() {
  const configured = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!configured) {
    throw new Error('Missing required environment variable: ADMIN_SESSION_SECRET');
  }

  if (configured.length < MINIMUM_SESSION_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_SESSION_SECRET must be at least ${MINIMUM_SESSION_SECRET_LENGTH} characters.`,
    );
  }

  return configured;
}

export function getAdminSessionTtlSeconds() {
  const configured = process.env.ADMIN_SESSION_TTL_SECONDS?.trim();
  if (!configured) {
    return DEFAULT_ADMIN_SESSION_TTL_SECONDS;
  }

  const parsed = Number.parseInt(configured, 10);
  if (!Number.isFinite(parsed) || parsed < 60 || parsed > 60 * 60 * 24 * 30) {
    console.warn(
      '[adminAuth] Invalid ADMIN_SESSION_TTL_SECONDS value. Falling back to default (8 hours).',
    );
    return DEFAULT_ADMIN_SESSION_TTL_SECONDS;
  }

  return parsed;
}

export function constantTimeEquals(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;

  for (let index = 0; index < maxLength; index += 1) {
    const leftCode = left.charCodeAt(index) || 0;
    const rightCode = right.charCodeAt(index) || 0;
    mismatch |= leftCode ^ rightCode;
  }

  return mismatch === 0;
}

export async function createAdminSessionToken() {
  const issuedAt = getUnixTimestamp();
  const header: AdminSessionHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload: AdminSessionPayload = {
    sub: ADMIN_SESSION_SUBJECT,
    iat: issuedAt,
    exp: issuedAt + getAdminSessionTtlSeconds(),
    jti: getSessionTokenId(),
  };

  const encodedHeader = encodeJsonToBase64Url(header);
  const encodedPayload = encodeJsonToBase64Url(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await signTokenPayload(signingInput, getAdminSessionSecret());

  return `${signingInput}.${signature}`;
}

export async function verifyAdminSessionToken(sessionToken: string | null | undefined) {
  if (!sessionToken) {
    return false;
  }

  const [encodedHeader, encodedPayload, signature, ...rest] = sessionToken.split('.');
  if (!encodedHeader || !encodedPayload || !signature || rest.length > 0) {
    return false;
  }

  let sessionSecret: string;
  try {
    sessionSecret = getAdminSessionSecret();
  } catch {
    return false;
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const validSignature = await verifyTokenSignature(signingInput, signature, sessionSecret);
  if (!validSignature) {
    return false;
  }

  const parsedHeader = decodeJsonFromBase64Url<AdminSessionHeader>(encodedHeader);
  if (!parsedHeader || parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') {
    return false;
  }

  const payload = decodeJsonFromBase64Url<AdminSessionPayload>(encodedPayload);
  if (!payload || payload.sub !== ADMIN_SESSION_SUBJECT) {
    return false;
  }

  const now = getUnixTimestamp();
  if (
    typeof payload.iat !== 'number'
    || typeof payload.exp !== 'number'
    || payload.iat > now + 60
    || payload.exp <= now
    || payload.exp - payload.iat > 60 * 60 * 24 * 31
    || typeof payload.jti !== 'string'
    || payload.jti.length < 8
  ) {
    return false;
  }

  return true;
}
