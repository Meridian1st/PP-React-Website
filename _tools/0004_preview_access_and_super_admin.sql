-- Purpose Partners — migration 0004
--
-- Two things:
--   1. preview_access — the password that gates the Cloudflare preview site.
--   2. user.role      — makes the developer's super-admin account undeletable
--                       through the admin UI.
--
-- Safe to run on a database with existing data. Reversible (see the bottom).

BEGIN;

-- 1 -------------------------------------------------------------------------
-- One row, id = 'preview'. The password is stored hashed, never in plaintext,
-- using the same scrypt parameters Better Auth uses so one helper covers both.
CREATE TABLE IF NOT EXISTS "preview_access" (
  "id"            text PRIMARY KEY DEFAULT 'preview',
  "password_hash" text NOT NULL,
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now()
);

-- 2 -------------------------------------------------------------------------
-- 'admin' = an ordinary admin, manageable from /admin/settings as today.
-- 'super' = the developer account. Created and changed only by direct SQL.
--
-- Existing rows all become 'admin', which is what they already were in effect.
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'admin';

-- A belt-and-braces guard at the database level, so the rule holds even if a
-- future code path forgets it: a super admin cannot be deleted by an ordinary
-- DELETE. Dropping the trigger is itself a deliberate database operation.
CREATE OR REPLACE FUNCTION protect_super_admin() RETURNS trigger AS $$
BEGIN
  IF OLD.role = 'super' AND current_setting('app.allow_super_delete', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION
      'Refusing to delete a super admin. This account is managed by direct database access only.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_super_admin_delete ON "user";
CREATE TRIGGER protect_super_admin_delete
  BEFORE DELETE ON "user"
  FOR EACH ROW EXECUTE FUNCTION protect_super_admin();

-- Same for demotion or an email/role change that would sneak around the above.
CREATE OR REPLACE FUNCTION protect_super_admin_role() RETURNS trigger AS $$
BEGIN
  IF OLD.role = 'super' AND NEW.role <> 'super'
     AND current_setting('app.allow_super_delete', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION 'Refusing to demote a super admin from the application.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_super_admin_update ON "user";
CREATE TRIGGER protect_super_admin_update
  BEFORE UPDATE ON "user"
  FOR EACH ROW EXECUTE FUNCTION protect_super_admin_role();

COMMIT;


-- ---------------------------------------------------------------------------
-- HOW TO ACTUALLY DELETE OR CHANGE A SUPER ADMIN (you, at a psql prompt)
-- ---------------------------------------------------------------------------
-- The trigger checks a session setting the application never sets, so only a
-- direct database session can turn it off — and only for that one session.
--
--   BEGIN;
--   SET LOCAL app.allow_super_delete = 'on';
--   DELETE FROM "user" WHERE email = 'you@purposepartners.co.uk';
--   COMMIT;
--
-- To change the super admin's password, replace the hash on their account row
-- (generate it with make-super-admin.mjs, or reuse the account it prints):
--
--   UPDATE "account" SET password = '<new-hash>', updated_at = now()
--   WHERE user_id = (SELECT id FROM "user" WHERE email = 'you@purposepartners.co.uk')
--     AND provider_id = 'credential';
--
-- ---------------------------------------------------------------------------
-- ROLLBACK, if ever needed
-- ---------------------------------------------------------------------------
--   DROP TRIGGER IF EXISTS protect_super_admin_delete ON "user";
--   DROP TRIGGER IF EXISTS protect_super_admin_update ON "user";
--   DROP FUNCTION IF EXISTS protect_super_admin();
--   DROP FUNCTION IF EXISTS protect_super_admin_role();
--   ALTER TABLE "user" DROP COLUMN IF EXISTS "role";
--   DROP TABLE IF EXISTS "preview_access";
