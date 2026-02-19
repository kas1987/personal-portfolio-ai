import type { CandidateContext } from '../types/domain'

export type ProfileRow = {
  id: string
  full_name: string
  title: string
  target_titles: string[] | null
  target_company_stages: string[] | null
  location: string | null
  remote_preference: string | null
  availability_status: string | null
  availability_date: string | null
  salary_min: number | null
  salary_max: number | null
  linkedin_url: string | null
  github_url: string | null
  email: string | null
  elevator_pitch: string
  career_narrative: string
  known_for: string | null
  looking_for: string | null
  not_looking_for: string | null
  management_style: string | null
  work_style_preferences: string | null
  must_haves: string[] | null
  dealbreakers: string[] | null
  team_size_preference: string | null
  conflict_style: string | null
  ambiguity_style: string | null
  failure_style: string | null
}

export function mapRowsToCandidateContext(
  profile: ProfileRow,
  experiences: Array<Record<string, unknown>>,
  skills: Array<Record<string, unknown>>,
  gaps: Array<Record<string, unknown>>,
  faqResponses: Array<Record<string, unknown>>,
  aiInstructions: Array<Record<string, unknown>>,
): CandidateContext {
  return {
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      title: profile.title,
      targetTitles: profile.target_titles || [],
      targetCompanyStages: profile.target_company_stages || [],
      location: profile.location || '',
      remotePreference: profile.remote_preference || '',
      availabilityStatus: profile.availability_status || 'open_to_conversation',
      availabilityDate: profile.availability_date || undefined,
      salaryMin: profile.salary_min ?? undefined,
      salaryMax: profile.salary_max ?? undefined,
      socialLinks: {
        linkedin: profile.linkedin_url || undefined,
        github: profile.github_url || undefined,
        email: profile.email || undefined,
      },
      elevatorPitch: profile.elevator_pitch,
      careerNarrative: profile.career_narrative,
      knownFor: profile.known_for || '',
      lookingFor: profile.looking_for || '',
      notLookingFor: profile.not_looking_for || '',
      managementStyle: profile.management_style || '',
      workStylePreferences: profile.work_style_preferences || '',
    },
    experiences: experiences.map((exp) => ({
      id: String(exp.id),
      companyName: String(exp.company_name || ''),
      title: String(exp.title || ''),
      titleProgression: exp.title_progression ? String(exp.title_progression) : undefined,
      dateRange: String(exp.date_range || ''),
      startDate: exp.start_date ? String(exp.start_date) : undefined,
      endDate: exp.end_date ? String(exp.end_date) : undefined,
      isCurrent: Boolean(exp.is_current),
      displayOrder: exp.display_order == null ? undefined : Number(exp.display_order),
      bulletPoints: Array.isArray(exp.bullet_points) ? exp.bullet_points.map(String) : [],
      aiContext: {
        situation: String(exp.situation || ''),
        approach: String(exp.approach || ''),
        technicalWork: String(exp.technical_work || ''),
        lessonsLearned: String(exp.lessons_learned || ''),
        whyJoined: exp.why_joined ? String(exp.why_joined) : undefined,
        whyLeft: exp.why_left ? String(exp.why_left) : undefined,
        actualContributions: exp.actual_contributions ? String(exp.actual_contributions) : undefined,
        proudestAchievement: exp.proudest_achievement ? String(exp.proudest_achievement) : undefined,
        wouldDoDifferently: exp.would_do_differently ? String(exp.would_do_differently) : undefined,
        challengesFaced: exp.challenges_faced ? String(exp.challenges_faced) : undefined,
        managerWouldSay: exp.manager_would_say ? String(exp.manager_would_say) : undefined,
        reportsWouldSay: exp.reports_would_say ? String(exp.reports_would_say) : undefined,
        conflictsOrChallenges: exp.conflicts_challenges ? String(exp.conflicts_challenges) : undefined,
        quantifiedImpact: exp.quantified_impact ? String(exp.quantified_impact) : undefined,
      },
    })),
    skills: skills.map((item) => ({
      id: String(item.id),
      skillName: String(item.skill_name || ''),
      category: (item.category as 'strong' | 'moderate' | 'gap') || 'moderate',
      selfRating: Number(item.self_rating || 3),
      evidence: String(item.evidence || ''),
      honestNotes: String(item.honest_notes || ''),
      yearsExperience: item.years_experience == null ? undefined : Number(item.years_experience),
      lastUsed: item.last_used ? String(item.last_used) : undefined,
    })),
    gaps: gaps.map((gap) => ({
      id: String(gap.id),
      gapType: (gap.gap_type as 'skill' | 'experience' | 'environment' | 'role_type') || 'skill',
      description: String(gap.description || ''),
      whyItsAGap: String(gap.why_its_a_gap || ''),
      interestInLearning: Boolean(gap.interest_in_learning),
      roleTypesBadFit: Array.isArray(gap.role_types_bad_fit)
        ? gap.role_types_bad_fit.map(String)
        : undefined,
      environmentsToAvoid: Array.isArray(gap.environments_to_avoid)
        ? gap.environments_to_avoid.map(String)
        : undefined,
      pastFeedback: gap.past_feedback ? String(gap.past_feedback) : undefined,
      improvementAreas: Array.isArray(gap.improvement_areas)
        ? gap.improvement_areas.map(String)
        : undefined,
      noInterestAreas: Array.isArray(gap.no_interest_areas)
        ? gap.no_interest_areas.map(String)
        : undefined,
    })),
    faqResponses: faqResponses.map((faq) => ({
      id: String(faq.id),
      question: String(faq.question || ''),
      answer: String(faq.answer || ''),
      isCommonQuestion: Boolean(faq.is_common_question),
    })),
    aiInstructions: aiInstructions.map((instruction) => ({
      id: String(instruction.id),
      instructionType: (instruction.instruction_type as 'honesty' | 'tone' | 'boundaries') || 'honesty',
      instruction: String(instruction.instruction || ''),
      priority: Number(instruction.priority || 50),
    })),
    valuesCultureFit: {
      mustHaves: profile.must_haves || [],
      dealbreakers: profile.dealbreakers || [],
      teamSizePreference: profile.team_size_preference || '',
      conflictStyle: profile.conflict_style || '',
      ambiguityStyle: profile.ambiguity_style || '',
      failureStyle: profile.failure_style || '',
    },
  }
}

export function mapProfileToPayload(next: CandidateContext, profileId: string) {
  return {
    id: profileId,
    full_name: next.profile.fullName,
    title: next.profile.title,
    target_titles: next.profile.targetTitles,
    target_company_stages: next.profile.targetCompanyStages,
    location: next.profile.location || null,
    remote_preference: next.profile.remotePreference || null,
    availability_status: next.profile.availabilityStatus,
    availability_date: next.profile.availabilityDate || null,
    salary_min: next.profile.salaryMin ?? null,
    salary_max: next.profile.salaryMax ?? null,
    linkedin_url: next.profile.socialLinks.linkedin || null,
    github_url: next.profile.socialLinks.github || null,
    email: next.profile.socialLinks.email || null,
    elevator_pitch: next.profile.elevatorPitch,
    career_narrative: next.profile.careerNarrative,
    known_for: next.profile.knownFor || null,
    looking_for: next.profile.lookingFor || null,
    not_looking_for: next.profile.notLookingFor || null,
    management_style: next.profile.managementStyle || null,
    work_style_preferences: next.profile.workStylePreferences || null,
    must_haves: next.valuesCultureFit.mustHaves || [],
    dealbreakers: next.valuesCultureFit.dealbreakers || [],
    team_size_preference: next.valuesCultureFit.teamSizePreference || null,
    conflict_style: next.valuesCultureFit.conflictStyle || null,
    ambiguity_style: next.valuesCultureFit.ambiguityStyle || null,
    failure_style: next.valuesCultureFit.failureStyle || null,
  }
}

export function mapExperiencesToRows(next: CandidateContext, profileId: string) {
  return next.experiences.map((exp) => ({
    id: exp.id,
    candidate_id: profileId,
    company_name: exp.companyName,
    title: exp.title,
    title_progression: exp.titleProgression || null,
    date_range: exp.dateRange,
    start_date: exp.startDate || null,
    end_date: exp.endDate || null,
    is_current: exp.isCurrent ?? false,
    display_order: exp.displayOrder ?? null,
    bullet_points: exp.bulletPoints,
    situation: exp.aiContext.situation,
    approach: exp.aiContext.approach,
    technical_work: exp.aiContext.technicalWork,
    lessons_learned: exp.aiContext.lessonsLearned,
    why_joined: exp.aiContext.whyJoined || null,
    why_left: exp.aiContext.whyLeft || null,
    actual_contributions: exp.aiContext.actualContributions || null,
    proudest_achievement: exp.aiContext.proudestAchievement || null,
    would_do_differently: exp.aiContext.wouldDoDifferently || null,
    challenges_faced: exp.aiContext.challengesFaced || null,
    manager_would_say: exp.aiContext.managerWouldSay || null,
    reports_would_say: exp.aiContext.reportsWouldSay || null,
    conflicts_challenges: exp.aiContext.conflictsOrChallenges || null,
    quantified_impact: exp.aiContext.quantifiedImpact || null,
  }))
}

export function mapSkillsToRows(next: CandidateContext, profileId: string) {
  return next.skills.map((skill) => ({
    id: skill.id,
    candidate_id: profileId,
    skill_name: skill.skillName,
    category: skill.category,
    self_rating: skill.selfRating,
    years_experience: skill.yearsExperience ?? null,
    evidence: skill.evidence,
    honest_notes: skill.honestNotes,
    last_used: skill.lastUsed ?? null,
  }))
}

export function mapGapsToRows(next: CandidateContext, profileId: string) {
  return next.gaps.map((gap) => ({
    id: gap.id,
    candidate_id: profileId,
    gap_type: gap.gapType,
    description: gap.description,
    why_its_a_gap: gap.whyItsAGap,
    interest_in_learning: gap.interestInLearning,
    role_types_bad_fit: gap.roleTypesBadFit || [],
    environments_to_avoid: gap.environmentsToAvoid || [],
    past_feedback: gap.pastFeedback || null,
    improvement_areas: gap.improvementAreas || [],
    no_interest_areas: gap.noInterestAreas || [],
  }))
}

export function mapFaqToRows(next: CandidateContext, profileId: string) {
  return next.faqResponses.map((faq) => ({
    id: faq.id,
    candidate_id: profileId,
    question: faq.question,
    answer: faq.answer,
    is_common_question: faq.isCommonQuestion ?? false,
  }))
}

export function mapInstructionsToRows(next: CandidateContext, profileId: string) {
  return next.aiInstructions.map((instruction) => ({
    id: instruction.id,
    candidate_id: profileId,
    instruction_type: instruction.instructionType,
    instruction: instruction.instruction,
    priority: instruction.priority,
    active: true,
  }))
}
