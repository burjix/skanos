-- Add onboarding fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_data JSONB NOT NULL DEFAULT '{}';

-- Add goal fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS health_goals JSONB NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS wealth_goals JSONB NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS spirituality_goals JSONB NOT NULL DEFAULT '{}';

-- Add daily checkup preference fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_checkup_enabled BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_checkup_time VARCHAR(5) DEFAULT '09:00';