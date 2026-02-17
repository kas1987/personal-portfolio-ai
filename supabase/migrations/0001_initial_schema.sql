-- Portfolio AI: baseline relational schema
-- Public/private boundaries are enforced by explicit projection views.

create extension if not exists pgcrypto;

create table if not exists candidate_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  title text not null,
  target_titles text[] not null default '{}',
  target_company_stages text[] not null default '{}',
  location text,
  remote_preference text,
  availability_status text not null default 'open_to_conversation',
  availability_date date,
  salary_min integer,
  salary_max integer,
  linkedin_url text,
  github_url text,
  elevator_pitch text not null,
  career_narrative text not null,
  known_for text,
  looking_for text,
  not_looking_for text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  company_name text not null,
  title text not null,
  date_range text not null,
  bullet_points text[] not null default '{}',
  situation text,
  approach text,
  technical_work text,
  lessons_learned text,
  why_joined text,
  why_left text,
  actual_contributions text,
  manager_would_say text,
  reports_would_say text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  skill_name text not null,
  category text not null check (category in ('strong', 'moderate', 'gap')),
  self_rating integer not null check (self_rating between 1 and 5),
  years_experience numeric(4, 1),
  evidence text,
  honest_notes text,
  last_used text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gaps_weaknesses (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  gap_type text not null check (gap_type in ('skill', 'experience', 'environment', 'role_type')),
  description text not null,
  why_its_a_gap text not null,
  interest_in_learning boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists faq_responses (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_instructions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  instruction_type text not null check (instruction_type in ('honesty', 'tone', 'boundaries')),
  instruction text not null,
  priority integer not null default 50,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidate_profile(id) on delete cascade,
  session_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  prompt_version text,
  verdict_class text,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create or replace view public_portfolio_profile as
select
  id,
  full_name,
  title,
  target_titles,
  target_company_stages,
  availability_status,
  linkedin_url,
  github_url,
  elevator_pitch
from candidate_profile;

create or replace view public_portfolio_experiences as
select
  id,
  candidate_id,
  company_name,
  title,
  date_range,
  bullet_points,
  situation,
  approach,
  technical_work,
  lessons_learned
from experiences;

alter table candidate_profile enable row level security;
alter table experiences enable row level security;
alter table skills enable row level security;
alter table gaps_weaknesses enable row level security;
alter table faq_responses enable row level security;
alter table ai_instructions enable row level security;
alter table chat_history enable row level security;

