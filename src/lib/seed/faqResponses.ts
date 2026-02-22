import type { FAQResponse } from '../../types/domain'

export const seedFaqResponses: FAQResponse[] = [
  {
    id: 'faq-1',
    question: 'What makes you different from McKinsey/Deloitte?',
    answer:
      "I'm not selling you a team of juniors with a partner who shows up twice. You get me \u2014 someone who has managed a $90M P&L, holds a CPA and SPHR, and writes Python. The assessment is $3,500, not $350,000.",
    isCommonQuestion: true,
  },
  {
    id: 'faq-2',
    question: 'Can you implement the recommendations?',
    answer:
      'The assessment is standalone \u2014 your team or an implementation partner can execute the roadmap. If you want ongoing advisory support, we can discuss that separately.',
    isCommonQuestion: true,
  },
  {
    id: 'faq-3',
    question: "What if AI isn't right for our finance function?",
    answer:
      "Then the assessment will say that clearly. You're paying for an honest evaluation, not a sales document.",
    isCommonQuestion: true,
  },
  {
    id: 'faq-4',
    question: "What's your biggest weakness?",
    answer:
      "I'm direct about fit and constraints. If I'm not the right person for your situation, I'll tell you and refer you to someone who is.",
    isCommonQuestion: true,
  },
]
