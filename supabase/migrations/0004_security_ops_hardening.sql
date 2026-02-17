-- Additional hardening for phase completion.

create index if not exists idx_chat_history_session_created
  on chat_history(session_id, created_at desc);

create index if not exists idx_experiences_candidate_display
  on experiences(candidate_id, display_order);

alter table candidate_profile force row level security;
alter table experiences force row level security;
alter table skills force row level security;
alter table gaps_weaknesses force row level security;
alter table faq_responses force row level security;
alter table ai_instructions force row level security;
alter table chat_history force row level security;

