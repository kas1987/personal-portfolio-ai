-- Lovable exact-spec expansion for deeper candidate context.

alter table candidate_profile
  add column if not exists management_style text,
  add column if not exists work_style_preferences text,
  add column if not exists must_haves text[] not null default '{}',
  add column if not exists dealbreakers text[] not null default '{}',
  add column if not exists team_size_preference text,
  add column if not exists conflict_style text,
  add column if not exists ambiguity_style text,
  add column if not exists failure_style text;

alter table experiences
  add column if not exists title_progression text,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists is_current boolean not null default false,
  add column if not exists display_order integer,
  add column if not exists proudest_achievement text,
  add column if not exists would_do_differently text,
  add column if not exists challenges_faced text,
  add column if not exists conflicts_challenges text,
  add column if not exists quantified_impact text;

alter table gaps_weaknesses
  add column if not exists role_types_bad_fit text[] not null default '{}',
  add column if not exists environments_to_avoid text[] not null default '{}',
  add column if not exists past_feedback text,
  add column if not exists improvement_areas text[] not null default '{}',
  add column if not exists no_interest_areas text[] not null default '{}';

alter table faq_responses
  add column if not exists is_common_question boolean not null default false;

