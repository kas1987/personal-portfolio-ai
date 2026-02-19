import type { CandidateContext, JDAnalysisResult } from '../types/domain'
import { ChatResponseSchema, JDAnalysisSchema } from './contracts'
import { honestyChecklist } from './honesty'
import { requestChatMessage, requestJdAnalysis } from './aiApiClient'
import { getCandidateContextFromSources, upsertCandidateContextToSources } from './candidateContextClient'
import { mockAnalyzeJobDescription, mockChatMessage } from './mockAiClient'
import { seedContext } from './seedData'

const USE_MOCK_AI = (import.meta.env.VITE_USE_MOCK_AI || 'true').toLowerCase() === 'true'

export async function getCandidateContext(): Promise<CandidateContext> {
  return getCandidateContextFromSources()
}

export async function upsertCandidateContext(next: CandidateContext): Promise<CandidateContext> {
  return upsertCandidateContextToSources(next)
}

export async function analyzeJobDescription(
  jobDescription: string,
): Promise<{ result: JDAnalysisResult; honestyPass: boolean; honestyIssues: string[] }> {
  if (USE_MOCK_AI) {
    const result = mockAnalyzeJobDescription(jobDescription)
    const check = honestyChecklist(result)
    return { result, honestyPass: check.pass, honestyIssues: check.issues }
  }

  const json = await requestJdAnalysis(jobDescription)
  const result = JDAnalysisSchema.parse(json)
  const check = honestyChecklist(result)
  return { result, honestyPass: check.pass, honestyIssues: check.issues }
}

export async function sendChatMessage(
  message: string,
  sessionId: string,
  context: CandidateContext,
): Promise<string> {
  if (USE_MOCK_AI) {
    return mockChatMessage(message, context)
  }

  const json = await requestChatMessage(message, sessionId)
  const parsed = ChatResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Chat response contract mismatch')
  }
  return parsed.data.message
}

export function getSuggestedQuestions(): string[] {
  return [
    "What's your biggest weakness?",
    'Tell me about a project that failed',
    'Why did you leave your last role?',
    'What would your manager say about you?',
  ]
}

export function getDefaultContext(): CandidateContext {
  return seedContext
}
