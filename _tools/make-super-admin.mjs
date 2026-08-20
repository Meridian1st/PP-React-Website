/**
 * Purpose Partners — super-admin record generator.
 *
 * Prints the exact SQL to create an admin account directly in Postgres, with a
 * password hashed the way Better Auth 1.7 hashes it (node:crypto scrypt,
 * N=16384 r=16 p=1 dkLen=64, salt kept as its hex string, stored "salt:key").
 *
 * Nothing here touches a database. It prints SQL; you run it.
 *
 *   node make-super-admin.mjs "email@example.com" "Display Name" "the-password"
 */
import { randomBytes, scrypt } from 'node:crypto'

const CONFIG = { N: 16384, r: 16, p: 1, dkLen: 64 }

/** Better Auth's own alphabet and length for generated ids. */
const ID_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const ID_LENGTH = 32

/** Rejection sampling, so every character is equally likely. */
function generateId() {
  const out = []
  while (out.length < ID_LENGTH) {
    for (const byte of randomBytes(ID_LENGTH)) {
      if (byte < 248) out.push(ID_ALPHABET[byte % ID_ALPHABET.length])
      if (out.length === ID_LENGTH) break
    }
  }
  return out.join('')
}

function generateKey(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      CONFIG.dkLen,
      { N: CONFIG.N, r: CONFIG.r, p: CONFIG.p, maxmem: 128 * CONFIG.N * CONFIG.r * 2 },
      (err, key) => (err ? reject(err) : resolve(key)),
    )
  })
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const key = await generateKey(password, salt)
  return `${salt}:${key.toString('hex')}`
}

/** Single-quote escaping for a Postgres string literal. */
const q = (value) => `'${String(value).replace(/'/g, "''")}'`

export async function buildSql({ email, name, password }) {
  const userId = generateId()
  const accountId = generateId()
  const hash = await hashPassword(password)

  return { userId, accountId, hash, sql: `-- Purpose Partners — create the super-admin account.
-- Run this against the production database as a single transaction.
-- The password is already hashed; the plaintext appears nowhere in this file.

BEGIN;

INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
VALUES (
  ${q(userId)},
  ${q(name)},
  ${q(email)},
  true,
  now(),
  now()
);

INSERT INTO "account" (
  id, issuer, account_id, provider_id, user_id, password, created_at, updated_at
)
VALUES (
  ${q(accountId)},
  -- 'local:credential' and 'credential' are exactly what Better Auth 1.7 writes
  -- for an email+password account. Verified against a real signUpEmail() run.
  'local:credential',
  ${q(userId)},  -- account_id mirrors user.id for credential accounts
  'credential',
  ${q(userId)},
  ${q(hash)},
  now(),
  now()
);

COMMIT;

-- Confirm it landed:
-- SELECT u.email, u.name, a.provider_id, a.issuer
-- FROM "user" u JOIN "account" a ON a.user_id = u.id
-- WHERE u.email = ${q(email)};
` }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [email, name, password] = process.argv.slice(2)

  if (!email || !name || !password) {
    console.error('Usage: node make-super-admin.mjs "<email>" "<name>" "<password>"')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters (Better Auth\'s minimum).')
    process.exit(1)
  }

  const { sql } = await buildSql({
    email: email.trim().toLowerCase(), // admins.ts lower-cases; match it or the UI's duplicate check misses this row
    name,
    password,
  })
  console.log(sql)
}
