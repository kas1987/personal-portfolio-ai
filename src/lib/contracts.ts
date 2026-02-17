import { z } from 'zod'

export const FitVerdictSchema = z.enum([
  'strong_fit',
  'worth_conversation',
  'probably_not',
  'needs_clarification',
])

export const JDAnalysisSchema = z.object({
  verdict: FitVerdictSchema,
  headline: z.string().min(1),
  opening: z.string().min(1),
  gaps: z.array(
    z.object({
      requirement: z.string().min(1),
      gapTitle: z.string().min(1),
      explanation: z.string().min(1),
    }),
  ),
  transfers: z.string().min(1),
  recommendation: z.string().min(1),
})

export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
})

export const ChatResponseSchema = z.object({
  message: z.string().min(1),
})

export const JDAnalyzeRequestSchema = z.object({
  jobDescription: z.string().min(30),
})

export const ApiErrorSchema = z.object({
  error: z.string().min(1),
})

export type JDAnalysisPayload = z.infer<typeof JDAnalysisSchema>

