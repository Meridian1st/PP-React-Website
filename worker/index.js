/**
 * Purpose Partners — preview access gate (Cloudflare Worker).
 *
 * Runs in front of every request to the site and asks for a password before
 * serving anything. The password is NOT stored here — it lives hashed in
 * Postgres, and this Worker asks the admin app on Railway to check it. Changing
 * or revoking it is a database operation, not a redeploy.
 *
 * Once a visitor is through they get a signed cookie, so the check happens once
 * rather than on every page load.
 *
 * This replaces the Pages-style functions/_middleware.js: Workers do not read a
 * functions/ directory. The gate runs first because wrangler.jsonc sets
 * assets.run_worker_first, and static files are served through env.ASSETS.
 *
 * To open the site to the public: set PREVIEW_DISABLED=true, or drop
 * run_worker_first / main from wrangler.jsonc and delete this file.
 *
 * Variables (Workers dashboard → Settings → Variables and Secrets):
 *   PREVIEW_API_URL       plaintext  https://admin.purposepartners.co.uk/api/preview-access
 *   PREVIEW_COOKIE_SECRET secret     a long random string
 *   PREVIEW_DISABLED      plaintext  optional; "true" switches the gate off
 */

const COOKIE_NAME = 'pp_preview'
const SESSION_HOURS = 12
const LOGIN_PATH = '/__preview-login'

/* -------------------------------------------------------------------------- */
/* Cookie signing — HMAC-SHA256 via WebCrypto.                                */
/* The cookie is "<expiry>.<signature>": no personal data, it only answers     */
/* "did we let this person in, and has that lapsed?".                          */
/* -------------------------------------------------------------------------- */

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/** Length-independent comparison, so timing does not leak the signature. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function mintCookie(secret) {
  const expiry = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000)
  return `${expiry}.${await hmac(secret, expiry)}`
}

async function cookieIsValid(value, secret) {
  if (!value) return false
  const [expiry, signature] = value.split('.')
  if (!expiry || !signature) return false
  if (!/^\d+$/.test(expiry)) return false
  if (Date.now() > Number(expiry)) return false
  return safeEqual(signature, await hmac(secret, expiry))
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return null
}

/* -------------------------------------------------------------------------- */
/* The password form                                                          */
/* -------------------------------------------------------------------------- */

function loginPage({ error = false, status = 200 } = {}) {
  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Purpose Partners — private preview</title>
<style>
  :root { --teal: #027F7C; --ink: #14201f; --paper: #f7f5f1; --error: #9c3327; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 1.5rem; background: var(--paper); color: var(--ink);
    font: 16px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .card {
    width: 100%; max-width: 25rem; background: #fff; padding: 2.5rem 2rem;
    border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.07);
  }
  h1 { margin: 0 0 .5rem; font-size: 1.3rem; letter-spacing: -.01em; }
  p  { margin: 0 0 1.75rem; color: rgba(20,32,31,.62); font-size: .925rem; }
  label { display: block; font-size: .8rem; font-weight: 600; margin-bottom: .4rem;
          text-transform: uppercase; letter-spacing: .06em; color: rgba(20,32,31,.55); }
  input {
    width: 100%; padding: .7rem .85rem; font-size: 1rem; font-family: inherit;
    border: 1.5px solid rgba(20,32,31,.18); border-radius: 8px; background: #fff; color: inherit;
  }
  input:focus-visible { outline: 2px solid var(--teal); outline-offset: 1px; border-color: var(--teal); }
  button {
    width: 100%; margin-top: 1.1rem; padding: .78rem 1rem; font: inherit; font-weight: 600;
    color: #fff; background: var(--teal); border: 0; border-radius: 8px; cursor: pointer;
  }
  button:hover { filter: brightness(1.08); }
  button:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .error {
    margin: 0 0 1.25rem; padding: .7rem .85rem; font-size: .875rem;
    color: var(--error); background: rgba(156,51,39,.08);
    border-left: 3px solid var(--error); border-radius: 4px;
  }
  .foot { margin: 1.75rem 0 0; font-size: .8rem; color: rgba(20,32,31,.45); text-align: center; }
</style>
</head>
<body>
  <main class="card">
    <h1>Private preview</h1>
    <p>This site isn&rsquo;t public yet. Enter the password you were sent to take a look.</p>
    ${error ? '<p class="error" role="alert">That password wasn&rsquo;t right. Try again.</p>' : ''}
    <form method="POST" action="${LOGIN_PATH}">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password"
             required autofocus enterkeyhint="go">
      <button type="submit">View the site</button>
    </form>
    <p class="foot">Purpose Partners</p>
  </main>
</body>
</html>`

  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

/* -------------------------------------------------------------------------- */
/* The gate                                                                   */
/* -------------------------------------------------------------------------- */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // An escape hatch that needs no redeploy: flip the variable to open up.
    if (env.PREVIEW_DISABLED === 'true') return env.ASSETS.fetch(request)

    const secret = env.PREVIEW_COOKIE_SECRET
    const apiUrl = env.PREVIEW_API_URL

    // Fail closed, loudly. A missing secret must never mean "let everyone in".
    if (!secret || !apiUrl) {
      return new Response(
        'Preview gate is misconfigured: PREVIEW_COOKIE_SECRET and PREVIEW_API_URL must both be set.',
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    // ---- Submitting the password ------------------------------------------
    if (url.pathname === LOGIN_PATH) {
      if (request.method !== 'POST') {
        return new Response(null, { status: 303, headers: { Location: '/' } })
      }

      let password = ''
      try {
        password = String((await request.formData()).get('password') ?? '')
      } catch {
        return loginPage({ error: true, status: 400 })
      }

      let allowed = false
      try {
        const check = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })
        allowed = check.ok
      } catch {
        // Railway unreachable — say so rather than pretending the password was wrong.
        return new Response(
          'The preview gate cannot reach the admin service right now. Please try again shortly.',
          { status: 502, headers: { 'Cache-Control': 'no-store' } },
        )
      }

      if (!allowed) return loginPage({ error: true, status: 401 })

      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Cache-Control': 'no-store',
          'Set-Cookie': [
            `${COOKIE_NAME}=${await mintCookie(secret)}`,
            'Path=/',
            'HttpOnly',
            'Secure',
            'SameSite=Lax',
            `Max-Age=${SESSION_HOURS * 60 * 60}`,
          ].join('; '),
        },
      })
    }

    // ---- Everything else ---------------------------------------------------
    if (await cookieIsValid(readCookie(request, COOKIE_NAME), secret)) {
      const response = await env.ASSETS.fetch(request)

      // Keep the whole preview out of search results while it is gated.
      // Rebuild explicitly — a Response's fields are not own enumerable
      // properties, so spreading it silently loses the status.
      const headers = new Headers(response.headers)
      headers.set('X-Robots-Tag', 'noindex, nofollow')
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }

    // A failed asset/API request should get a status, not a page of HTML.
    const wantsHtml = (request.headers.get('Accept') ?? '').includes('text/html')
    if (!wantsHtml) {
      return new Response('Unauthorized', {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    return loginPage({ status: 401 })
  },
}