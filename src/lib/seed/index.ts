import type { CandidateContext } from '../../types/domain'
import { seedAiInstructions } from './aiInstructions'
import { seedExperiences } from './experiences'
import { seedFaqResponses } from './faqResponses'
import { seedGaps } from './gaps'
import { seedProfile } from './profile'
import { seedSkills } from './skills'
import { seedValuesCultureFit } from './valuesCultureFit'

export const seedContext: CandidateContext = {
  profile: seedProfile,
  experiences: seedExperiences,
  skills: seedSkills,
  gaps: seedGaps,
  faqResponses: seedFaqResponses,
  aiInstructions: seedAiInstructions,
  valuesCultureFit: seedValuesCultureFit,
}
