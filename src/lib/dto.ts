import type { CandidateContext, PublicPortfolioDTO } from '../types/domain'

export function toPublicPortfolioDTO(context: CandidateContext): PublicPortfolioDTO {
  return {
    profile: {
      fullName: context.profile.fullName,
      title: context.profile.title,
      targetTitles: context.profile.targetTitles,
      targetCompanyStages: context.profile.targetCompanyStages,
      availabilityStatus: context.profile.availabilityStatus,
      elevatorPitch: context.profile.elevatorPitch,
      socialLinks: context.profile.socialLinks,
    },
    experiences: context.experiences.map((exp) => ({
      id: exp.id,
      companyName: exp.companyName,
      title: exp.title,
      dateRange: exp.dateRange,
      bulletPoints: exp.bulletPoints,
      aiContext: {
        situation: exp.aiContext.situation,
        approach: exp.aiContext.approach,
        technicalWork: exp.aiContext.technicalWork,
        lessonsLearned: exp.aiContext.lessonsLearned,
      },
    })),
    skills: context.skills.map((skill) => ({
      ...skill,
      honestNotes: skill.category === 'gap' ? skill.honestNotes : '',
    })),
  }
}

