-- ============================================================
--  Supabase Setup for Portfolio Contact Form
--  Run this SQL in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id          UUID                        DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT                        NOT NULL,
    email       TEXT                        NOT NULL,
    subject     TEXT,
    message     TEXT                        NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE    DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    is_read     BOOLEAN                     DEFAULT FALSE
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Only authenticated users (you, the owner) can SELECT / UPDATE / DELETE
CREATE POLICY "allow_auth_select"
    ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "allow_auth_update"
    ON public.contacts
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "allow_auth_delete"
    ON public.contacts
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE  ON public.contacts TO authenticated;

-- 5. Index for fast queries in your dashboard
CREATE INDEX IF NOT EXISTS contacts_created_at_idx
    ON public.contacts (created_at DESC);

-- ============================================================
--  After running this SQL:
--  1. Go to Project Settings → API
--  2. Copy "Project URL" and "anon / public" key
--  3. Paste them into assets/js/contact.js
-- ============================================================
