-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Trending Repositories Table (Trendshift CDN Mirror)
CREATE TABLE IF NOT EXISTS public.census_trending_repos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT UNIQUE NOT NULL,
    description TEXT,
    language TEXT,
    stars_total INTEGER DEFAULT 0,
    stars_gained INTEGER DEFAULT 0,
    forks_total INTEGER DEFAULT 0,
    forks_gained INTEGER DEFAULT 0,
    github_url TEXT NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Agent Registries Table
CREATE TABLE IF NOT EXISTS public.census_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name TEXT UNIQUE NOT NULL,
    lifecycle_status TEXT NOT NULL DEFAULT 'INITIALIZING',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Telemetry Event Stream (Merkle WAL Partition)
CREATE TABLE IF NOT EXISTS public.census_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES public.census_agents(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    merkle_proof TEXT NOT NULL,
    latency_ms NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS & Security Policies
ALTER TABLE public.census_trending_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.census_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on census_trending_repos" ON public.census_trending_repos FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on census_trending_repos" ON public.census_trending_repos USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access on census_agents" ON public.census_agents FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on census_agents" ON public.census_agents USING (auth.role() = 'service_role');
