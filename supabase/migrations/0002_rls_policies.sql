-- Phase-2 security controls:
-- - keep private data in base tables protected by RLS
-- - allow only authenticated/service-role access to base tables
-- - allow public read through projection views only

revoke all on table candidate_profile from anon;
revoke all on table experiences from anon;
revoke all on table skills from anon;
revoke all on table gaps_weaknesses from anon;
revoke all on table faq_responses from anon;
revoke all on table ai_instructions from anon;
revoke all on table chat_history from anon;

grant select on public_portfolio_profile to anon;
grant select on public_portfolio_experiences to anon;

drop policy if exists candidate_profile_authenticated_rw on candidate_profile;
create policy candidate_profile_authenticated_rw
on candidate_profile
for all
to authenticated
using (true)
with check (true);

drop policy if exists experiences_authenticated_rw on experiences;
create policy experiences_authenticated_rw
on experiences
for all
to authenticated
using (true)
with check (true);

drop policy if exists skills_authenticated_rw on skills;
create policy skills_authenticated_rw
on skills
for all
to authenticated
using (true)
with check (true);

drop policy if exists gaps_authenticated_rw on gaps_weaknesses;
create policy gaps_authenticated_rw
on gaps_weaknesses
for all
to authenticated
using (true)
with check (true);

drop policy if exists faq_authenticated_rw on faq_responses;
create policy faq_authenticated_rw
on faq_responses
for all
to authenticated
using (true)
with check (true);

drop policy if exists ai_instructions_authenticated_rw on ai_instructions;
create policy ai_instructions_authenticated_rw
on ai_instructions
for all
to authenticated
using (true)
with check (true);

drop policy if exists chat_history_authenticated_rw on chat_history;
create policy chat_history_authenticated_rw
on chat_history
for all
to authenticated
using (true)
with check (true);

