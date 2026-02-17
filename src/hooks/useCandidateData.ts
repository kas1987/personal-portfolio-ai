import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CandidateContext } from '../types/domain'
import { getCandidateContext, upsertCandidateContext } from '../lib/repository'

const KEY = ['candidate-context']

export function useCandidateData() {
  return useQuery({
    queryKey: KEY,
    queryFn: getCandidateContext,
  })
}

export function useSaveCandidateData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (context: CandidateContext) => upsertCandidateContext(context),
    onSuccess: (data) => {
      queryClient.setQueryData(KEY, data)
    },
  })
}

