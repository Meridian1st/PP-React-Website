/**
 * Purpose Partners — set (or change) the preview-site password.
 *
 * Prints SQL and nothing else. Never connects to a database, never prints the
 * plaintext password. Run the SQL it gives you against the Railway Postgres.
 *
 *   node set-preview-password.mjs "the-password-to-give-becci"
 *
 * Hashing matches Better Auth 1.7 exactly (node:crypto scrypt, N=16384 r=16
 * p=1 dkLen=64, NFKC-normalised, salt used as its hex string, stored
 * "salt:key"), because the endpoint that checks it uses Better Auth's own
 * verifyPassword.
 */
import { randomBytes, scrypt } from 'node:crypto'

const CONFIG = { N: 16384, r: 16, p: 1, dkLen: 64 }

const generateKey = (password, salt) =>
  new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      CONFIG.dkLen,
      { N: CONFIG.N, r: CONFIG.r, p: CONFIG.p, maxmem: 128 * CONFIG.N * CONFIG.r * 2 },
      (err, key) => (err ? reject(err) : resolve(key)),
    )
  })

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${(await generateKey(password, salt)).toString('hex')}`
}

const password = process.argv[2]

if (!password) {
  console.error('Usage: node set-preview-password.mjs "<password>"')
  process.exit(1)
}
if (password.length < 8) {
  console.error('Use at least 8 characters — this is the only thing standing between the preview and the public.')
  process.exit(1)
}

const hash = await hashPassword(password)

console.log(`-- Purpose Partners — set the preview-site password.
-- Run against the Railway Postgres database. Safe to re-run: it replaces
-- whatever password was set before, and everyone currently signed in stays
-- signed in until their 12-hour cookie lapses.

INSERT INTO "preview_access" (id, password_hash, updated_at)
VALUES ('preview', '${hash}', now())
ON CONFLICT (id) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      updated_at    = now();

-- To take the gate down entirely and lock everyone out immediately:
--   DELETE FROM "preview_access" WHERE id = 'preview';
-- (With no row, the endpoint refuses every password — it fails closed.)
`)
