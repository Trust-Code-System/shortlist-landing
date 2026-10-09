export const SESSION_COOKIE = "shortlist_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

const DEFAULT_ADMIN_EMAILS = ["hello@trustcodesystem.tech"];

export function allowedEmails() {
  const configured = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return configured?.length ? configured : DEFAULT_ADMIN_EMAILS;
}

export function isAllowedEmail(email: string) {
  return allowedEmails().includes(email.trim().toLowerCase());
}

function secret() {
  const value = process.env.AUTH_SECRET || process.env.BUILD_SESSION_SECRET;
  if (!value) throw new Error("No session secret configured");
  return value;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(email: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${toBase64Url(encoder.encode(email.trim().toLowerCase()))}.${expires}`;
  return `${payload}.${await sign(payload)}`;
}

export async function readSessionToken(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedEmail, expires, signature] = parts;
  const payload = `${encodedEmail}.${expires}`;
  if (!safeEqual(signature, await sign(payload))) return null;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return null;
  let email: string;
  try {
    email = fromBase64Url(encodedEmail);
  } catch {
    return null;
  }
  return isAllowedEmail(email) ? { email } : null;
}
