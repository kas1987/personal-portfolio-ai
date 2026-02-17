import { createClient } from '@supabase/supabase-js'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

async function loadSeedContext() {
  const seedPath = path.resolve(projectRoot, 'src', 'lib', 'seedData.ts')
  const source = await readFile(seedPath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  })

  const tempPath = path.resolve(projectRoot, '.tmp.seed-data.module.mjs')
  await writeFile(tempPath, transpiled.outputText, 'utf8')
  const mod = await import(pathToFileURL(tempPath).href + `?t=${Date.now()}`)
  await unlink(tempPath)

  if (!mod.seedContext) {
    throw new Error('seedContext export not found in src/lib/seedData.ts')
  }

  return mod.seedContext
}

function toNullable(value) {
  return value === undefined || value === '' ? null : value
}

function assertNoError(result, label) {
  if (result.error) {
    throw new Error(`${label} failed: ${result.error.message}`)
  }
}

async function main() {
  if (process.env.ALLOW_PROD_OVERWRITE !== 'true') {
    throw new Error('Refusing overwrite. Set ALLOW_PROD_OVERWRITE=true to continue.')
  }

  const supabaseUrl = requiredEnv('SUPABASE_URL')
  const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY')
  const seedContext = await loadSeedContext()

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const existingProfiles = await supabase.from('candidate_profile').select('id')
  assertNoError(existingProfiles, 'Fetch existing profiles')

  if ((existingProfiles.data || []).length > 0) {
    const deleteProfiles = await supabase.from('candidate_profile').delete().not('id', 'is', null)
    assertNoError(deleteProfiles, 'Delete existing profiles')
  }

  const profileId = crypto.randomUUID()
  const profilePayload = {
    id: profileId,
    full_name: seedContext.profile.fullName,
    title: seedContext.profile.title,
    target_titles: seedContext.profile.targetTitles,
    target_company_stages: seedContext.profile.targetCompanyStages,
    location: toNullable(seedContext.profile.location),
    remote_preference: toNullable(seedContext.profile.remotePreference),
    availability_status: seedContext.profile.availabilityStatus,
    availability_date: toNullable(seedContext.profile.availabilityDate),
    salary_min: seedContext.profile.salaryMin ?? null,
    salary_max: seedContext.profile.salaryMax ?? null,
    linkedin_url: toNullable(seedContext.profile.socialLinks.linkedin),
    github_url: toNullable(seedContext.profile.socialLinks.github),
    email: toNullable(seedContext.profile.socialLinks.email),
    elevator_pitch: seedContext.profile.elevatorPitch,
    career_narrative: seedContext.profile.careerNarrative,
    known_for: toNullable(seedContext.profile.knownFor),
    looking_for: toNullable(seedContext.profile.lookingFor),
    not_looking_for: toNullable(seedContext.profile.notLookingFor),
    management_style: toNullable(seedContext.profile.managementStyle),
    work_style_preferences: toNullable(seedContext.profile.workStylePreferences),
    must_haves: seedContext.valuesCultureFit.mustHaves || [],
    dealbreakers: seedContext.valuesCultureFit.dealbreakers || [],
    team_size_preference: toNullable(seedContext.valuesCultureFit.teamSizePreference),
    conflict_style: toNullable(seedContext.valuesCultureFit.conflictStyle),
    ambiguity_style: toNullable(seedContext.valuesCultureFit.ambiguityStyle),
    failure_style: toNullable(seedContext.valuesCultureFit.failureStyle),
  }
  const insertProfile = await supabase.from('candidate_profile').insert(profilePayload)
  assertNoError(insertProfile, 'Insert candidate_profile')

  const experiencesRows = seedContext.experiences.map((exp) => ({
    id: crypto.randomUUID(),
    candidate_id: profileId,
    company_name: exp.companyName,
    title: exp.title,
    title_progression: toNullable(exp.titleProgression),
    date_range: exp.dateRange,
    start_date: toNullable(exp.startDate),
    end_date: toNullable(exp.endDate),
    is_current: Boolean(exp.isCurrent),
    display_order: exp.displayOrder ?? null,
    bullet_points: exp.bulletPoints,
    situation: toNullable(exp.aiContext.situation),
    approach: toNullable(exp.aiContext.approach),
    technical_work: toNullable(exp.aiContext.technicalWork),
    lessons_learned: toNullable(exp.aiContext.lessonsLearned),
    why_joined: toNullable(exp.aiContext.whyJoined),
    why_left: toNullable(exp.aiContext.whyLeft),
    actual_contributions: toNullable(exp.aiContext.actualContributions),
    proudest_achievement: toNullable(exp.aiContext.proudestAchievement),
    would_do_differently: toNullable(exp.aiContext.wouldDoDifferently),
    challenges_faced: toNullable(exp.aiContext.challengesFaced),
    manager_would_say: toNullable(exp.aiContext.managerWouldSay),
    reports_would_say: toNullable(exp.aiContext.reportsWouldSay),
    conflicts_challenges: toNullable(exp.aiContext.conflictsOrChallenges),
    quantified_impact: toNullable(exp.aiContext.quantifiedImpact),
  }))

  const skillsRows = seedContext.skills.map((skill) => ({
    id: crypto.randomUUID(),
    candidate_id: profileId,
    skill_name: skill.skillName,
    category: skill.category,
    self_rating: skill.selfRating,
    years_experience: skill.yearsExperience ?? null,
    evidence: toNullable(skill.evidence),
    honest_notes: toNullable(skill.honestNotes),
    last_used: toNullable(skill.lastUsed),
  }))

  const gapsRows = seedContext.gaps.map((gap) => ({
    id: crypto.randomUUID(),
    candidate_id: profileId,
    gap_type: gap.gapType,
    description: gap.description,
    why_its_a_gap: gap.whyItsAGap,
    interest_in_learning: Boolean(gap.interestInLearning),
    role_types_bad_fit: gap.roleTypesBadFit || [],
    environments_to_avoid: gap.environmentsToAvoid || [],
    past_feedback: toNullable(gap.pastFeedback),
    improvement_areas: gap.improvementAreas || [],
    no_interest_areas: gap.noInterestAreas || [],
  }))

  const faqRows = seedContext.faqResponses.map((faq) => ({
    id: crypto.randomUUID(),
    candidate_id: profileId,
    question: faq.question,
    answer: faq.answer,
    is_common_question: Boolean(faq.isCommonQuestion),
  }))

  const instructionsRows = seedContext.aiInstructions.map((instruction) => ({
    id: crypto.randomUUID(),
    candidate_id: profileId,
    instruction_type: instruction.instructionType,
    instruction: instruction.instruction,
    priority: instruction.priority,
    active: true,
  }))

  if (experiencesRows.length) {
    const insertExperiences = await supabase.from('experiences').insert(experiencesRows)
    assertNoError(insertExperiences, 'Insert experiences')
  }
  if (skillsRows.length) {
    const insertSkills = await supabase.from('skills').insert(skillsRows)
    assertNoError(insertSkills, 'Insert skills')
  }
  if (gapsRows.length) {
    const insertGaps = await supabase.from('gaps_weaknesses').insert(gapsRows)
    assertNoError(insertGaps, 'Insert gaps_weaknesses')
  }
  if (faqRows.length) {
    const insertFaq = await supabase.from('faq_responses').insert(faqRows)
    assertNoError(insertFaq, 'Insert faq_responses')
  }
  if (instructionsRows.length) {
    const insertInstructions = await supabase.from('ai_instructions').insert(instructionsRows)
    assertNoError(insertInstructions, 'Insert ai_instructions')
  }

  const summary = {
    candidate_profile: 1,
    experiences: experiencesRows.length,
    skills: skillsRows.length,
    gaps_weaknesses: gapsRows.length,
    faq_responses: faqRows.length,
    ai_instructions: instructionsRows.length,
  }

  console.log('Seed overwrite completed successfully.')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error(`seed:remote failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
