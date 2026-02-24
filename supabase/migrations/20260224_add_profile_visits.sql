-- Profile visits tracking (anonymous notifications)
CREATE TABLE IF NOT EXISTS profile_visits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visitor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visitor_career text,
    visitor_university text,
    visited_at timestamptz NOT NULL DEFAULT now(),
    seen_at timestamptz DEFAULT NULL
);

-- Index for fetching a user's recent visits efficiently
CREATE INDEX idx_pv_profile ON profile_visits(profile_id, visited_at DESC);

-- Index for deduplication check (same visitor within 24h)
CREATE INDEX idx_pv_dedup ON profile_visits(profile_id, visitor_id, visited_at);

-- RLS policies
ALTER TABLE profile_visits ENABLE ROW LEVEL SECURITY;

-- Users can read visits to their own profile
CREATE POLICY "Users can view their own visits"
    ON profile_visits FOR SELECT
    USING (auth.uid() = profile_id);

-- Authenticated users can insert visits (the app controls logic)
CREATE POLICY "Authenticated users can insert visits"
    ON profile_visits FOR INSERT
    WITH CHECK (auth.uid() = visitor_id);

-- Users can update seen_at on their own visits
CREATE POLICY "Users can mark their visits as seen"
    ON profile_visits FOR UPDATE
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);
