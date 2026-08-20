# Purpose Partners — Cloudflare setup

**Updated 20 August 2026** after your first deploy. Where you actually are, what
changed, and what's left.

---

## Where you are

| | Step | Status |
| --- | --- | --- |
| 1 | Code pushed to GitHub | **Done** — `origin/main` is at `6c25676` |
| 2 | Cloudflare project created and building | **Done** — build succeeded in 2.87s |
| 3 | Live URL | **Done** — `https://pp-react-website.harrygraham294.workers.dev` |
| 4 | Password gate | **Not running** — see below |
| 5 | Test it | To do |
| 6 | Send to Becci | To do |

Two things to know before anything else.

### You created a **Worker**, not a Pages project

Your build log ends with `npx wrangler deploy` and `Worker Name: pp-react-website`.
That's Cloudflare's newer path, and it's the better one to be on — but it changes
one thing that matters: **Workers do not read a `functions/` directory at all.**

That's the whole explanation for the site being wide open. `functions/_middleware.js`
was never uploaded — look at your build log, it lists 15 assets and the middleware
isn't among them. It isn't broken, it simply isn't there. Part 1 below fixes that
with a Worker version of the same gate.

### The live site is one commit behind

Your deploy ran at 16:07 and built **72 modules / 14.20 kB CSS**. The current code
builds **75 modules / 17.02 kB CSS**. That difference is the contact page — three
modules and 217 lines of CSS. So the deployed site predates your push.

Nothing to fix; the next deploy picks it up. Just don't judge the site by what's
live right now.

---

# Part 1 — Get the gate actually running

Three files change. Two are supplied alongside this guide.

### 1.1 Add the Worker

| File | Where |
| --- | --- |
| `worker/index.js` | new folder at the repo root, next to `src` |
| `wrangler.jsonc` | repo root |

`wrangler.jsonc` is the important one. Cloudflare's autoconfig generated its own
version on the build machine, and yours needs two things that one doesn't have:

```jsonc
"main": "worker/index.js",        // there is a Worker script at all
"assets": {
  "run_worker_first": true        // it runs BEFORE any file is served
}
```

Without `main` Cloudflare just serves the files. Without `run_worker_first` the
files get handed out before the password is ever checked. Both are needed.

The `assets` block also sets `not_found_handling: "single-page-application"`,
which is the Workers equivalent of `public/_redirects` — it's what makes `/about`
work on a refresh. Keep `_redirects` too if you like; Workers supports it and it
does no harm, it's just belt and braces now.

### 1.2 Remove the Pages version

It does nothing on Workers and will only confuse whoever reads this next:

```bash
git rm -r functions
```

### 1.3 Pin wrangler, and ignore its working files

Your build installed wrangler 4.124.0 on the fly each time. Pinning it makes
builds faster and stops a future wrangler release changing your deploy without
warning:

```bash
npm install -D wrangler
```

Then add these to `.gitignore`:

```gitignore
.wrangler/
.dev.vars
_tools/
```

> **Don't run `npx wrangler setup`**, even though the build log suggests it. It
> generates a config without `main` or `run_worker_first` and would overwrite
> yours. The `wrangler.jsonc` supplied here is that file, done properly.

---

# Part 2 — The password itself

The scripts are now on your machine, in `React-Site\_tools\` — that's why Node
couldn't find `set-preview-password.mjs` earlier, it had only ever been sent to
the chat, never written to disk.

### 2.1 Run the migration

`_tools\0004_preview_access_and_super_admin.sql`, against the **Railway**
Postgres. It creates the `preview_access` table and does the super-admin role
work at the same time.

### 2.2 Set the password

```bash
node _tools\set-preview-password.mjs "the-password-for-becci"
```

It prints an SQL statement — run that against the Railway database. The password
is hashed before it goes anywhere near Postgres.

To change it later, run the script again with a new password. To revoke access
instantly:

```sql
DELETE FROM "preview_access" WHERE id = 'preview';
```

With no row, every password is refused. It fails closed.

---

# Part 3 — The endpoint on Railway

In the Next.js repo (`fantastic-octo-guide-PP`):

**a)** Add the table to `src/db/schema.ts`:

```ts
/** The password gating the Cloudflare preview site. One row, id = "preview". */
export const previewAccess = pgTable("preview_access", {
  id: text("id").primaryKey().default("preview"),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
```

**b)** Put `preview-access-route.ts` at `src/app/api/preview-access/route.ts`.

**c)** Commit and push — Railway redeploys itself.

**d)** Check it's live. This should return **401**, not 404:

```bash
curl -i -X POST https://fantastic-octo-guide-pp-production.up.railway.app/api/preview-access -H "Content-Type: application/json" -d "{\"password\":\"wrong\"}"
```

404 means the route didn't deploy. 503 means the app can't see the database.

> No CORS headers on it, deliberately — it's called server-to-server by the
> Worker, never by a browser, so a browser on another site can't reach it. It
> also rate-limits to 10 attempts per IP per 10 minutes.

---

# Part 4 — Wire the two together

Cloudflare dashboard → **Workers & Pages** → **pp-react-website** → **Settings**
→ **Variables and Secrets**.

| Name | Type | Value |
| --- | --- | --- |
| `PREVIEW_API_URL` | Text | `https://fantastic-octo-guide-pp-production.up.railway.app/api/preview-access` |
| `PREVIEW_COOKIE_SECRET` | **Secret** | a long random string |

Generate the secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

It must be a **Secret**, not Text — it signs the "you're allowed in" cookie, and
anyone holding it can forge one.

Swap `PREVIEW_API_URL` to `https://admin.purposepartners.co.uk/api/preview-access`
once that DNS is in. Nothing else changes.

**Variables only apply to new deployments.** Push your changes (which triggers a
deploy anyway) and the gate comes up with them.

```bash
git add -A
git commit -m "Move preview gate from Pages middleware to a Worker"
git push
```

---

# Part 5 — Test it before Becci does

Use a **private/incognito window**.

| Try this | Expected |
| --- | --- |
| Visit the site | Password form, teal, "Private preview" |
| Wrong password | "That password wasn't right." No way through |
| Right password | Straight to the homepage |
| Click About → Charities → Business → Get in touch | All load, no re-prompt |
| **Refresh while on `/about`** | Loads normally — this is the SPA-routing check |
| New incognito window | Password again |
| On your phone | Form and site both usable |

I've already run exactly this against the real wrangler runtime (same version as
your build, 4.124.0) with the real built site: 12 of 12 passed, including SPA
routing on all four pages, assets serving correctly, and the gate holding for a
fresh visitor. It also returns **503 rather than opening** if the variables are
missing — so if you see that, it's the variables, and it's failing safe.

---

# Part 6 — Sending it to Becci

Send the link and the password **separately** — link by email, password by text.
One forwarded email then doesn't expose the site.

Worth telling her up front, or she'll report them as bugs:

- the second team member on About is placeholder Latin text
- the contact form isn't connected yet — it opens her email client instead
- the LinkedIn link in the footer goes nowhere yet

Every gated page is sent `noindex, nofollow`, so Google won't index the preview
even if the link gets out.

---

# Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Site loads with no password prompt | `main`/`run_worker_first` missing from `wrangler.jsonc`, or the deploy didn't include it | Check the build log lists a Worker script, not just assets |
| 503 "Preview gate is misconfigured" | Variables not set, or set but not deployed | Add both, then redeploy |
| 502 "cannot reach the admin service" | Railway down, or `PREVIEW_API_URL` wrong | Curl the endpoint directly (Part 3d) |
| Correct password refused | No row in `preview_access` | Re-run `set-preview-password.mjs` and its SQL |
| `/about` 404s on refresh | `not_found_handling` missing | It's in the supplied `wrangler.jsonc` |
| Build fails on `tsc` | Type error the dev server tolerated | Run `npm run build` locally first |

---

# When you go live

The gate is temporary. To open the site up:

- **No deploy needed:** add `PREVIEW_DISABLED` = `true` in the dashboard variables.
- **Permanent:** delete `main` and `run_worker_first` from `wrangler.jsonc`, delete
  `worker/index.js`, push.

Then attach the real domain: **Settings** → **Domains & Routes** → **Add** →
`purposepartners.co.uk`. If DNS is on Cloudflare by then the records are created
for you; if it's still at IONOS, see the DNS runbook — this is the point where
the nameserver decision matters.

---

## Files with this guide

| File | Goes where |
| --- | --- |
| `wrangler.jsonc` | React site repo root — **replaces** any generated one |
| `worker/index.js` | React site repo → `worker/index.js` |
| `preview-access-route.ts` | Next.js repo → `src/app/api/preview-access/route.ts` |
| `0004_preview_access_and_super_admin.sql` | already in `_tools\`, run against Railway |
| `set-preview-password.mjs` | already in `_tools\` |
| `make-super-admin.mjs` | already in `_tools\` |
