import { useMutation } from '@tanstack/react-query'
import type { CandidateContext } from '../types/domain'
import { analyzeJobDescription } from '../lib/repository'

export function useJDAnalyzer(context: CandidateContext | undefined) {
  return useMutation({
    mutationFn: async (jobDescription: string) => {
      if (!context) {
        throw new Error('Candidate context not loaded')
      }
      return analyzeJobDescription(jobDescription)
    },
  })
}

