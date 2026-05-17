-- UPFACE Database Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  score_global INT,
  score_symetrie INT,
  score_proportions INT,
  score_structure INT,
  score_peau INT,
  score_grooming INT,
  score_aura INT,
  tier TEXT CHECK (tier IN ('elite','attractive','average','below')),
  percentile INT,
  observations JSONB,
  routine JSONB,
  focus_dimensions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- subscriptions table (Stripe webhooks write here)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT CHECK (plan IN ('report', 'pro', 'pro_annual')),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS routine_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  category TEXT NOT NULL,
  action_index INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, analysis_id, day_number, category, action_index)
);

-- Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_progress ENABLE ROW LEVEL SECURITY;

-- Analyses RLS
CREATE POLICY "Users see own analyses"
  ON analyses FOR ALL
  USING (auth.uid() = user_id);

-- Allow anonymous insert for initial analysis (before signup)
CREATE POLICY "Allow anonymous insert"
  ON analyses FOR INSERT
  WITH CHECK (true);

-- Routine progress RLS
CREATE POLICY "Users see own progress"
  ON routine_progress FOR ALL
  USING (auth.uid() = user_id);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to photos bucket
CREATE POLICY "Anyone can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Public can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');
