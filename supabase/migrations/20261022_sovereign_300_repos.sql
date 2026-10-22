-- ============================================================================
-- THE SOVEREIGN 300: PLANETARY AI REPOSITORIES & LINEAGE DAG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sovereign_300_repos (
  repo_index INTEGER PRIMARY KEY CHECK (repo_index >= 1 AND repo_index <= 300),
  discipline_id TEXT NOT NULL,
  discipline_name TEXT NOT NULL,
  meta_layer TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT UNIQUE NOT NULL,
  depends_on_discipline TEXT,
  stars BIGINT NOT NULL DEFAULT 0,
  forks BIGINT NOT NULL DEFAULT 0,
  open_issues INTEGER NOT NULL DEFAULT 0,
  watchers INTEGER NOT NULL DEFAULT 0,
  primary_language TEXT NOT NULL DEFAULT 'Python',
  license_spdx TEXT NOT NULL DEFAULT 'Apache-2.0',
  default_branch TEXT NOT NULL DEFAULT 'main',
  latest_pushed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  spawning_velocity_est_per_day BIGINT NOT NULL DEFAULT 0,
  sha256_record_digest CHAR(64) NOT NULL,
  probed_via TEXT NOT NULL,
  synced_at_iso TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sovereign_300_discipline ON public.sovereign_300_repos (discipline_id);
CREATE INDEX IF NOT EXISTS idx_sovereign_300_stars ON public.sovereign_300_repos (stars DESC);

ALTER TABLE public.sovereign_300_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on sovereign_300_repos"
  ON public.sovereign_300_repos FOR SELECT USING (true);

CREATE POLICY "Allow service upsert on sovereign_300_repos"
  ON public.sovereign_300_repos FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service update on sovereign_300_repos"
  ON public.sovereign_300_repos FOR UPDATE USING (true);
