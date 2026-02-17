import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('tests/calibration/jd-cases.json')
const cases = JSON.parse(fs.readFileSync(file, 'utf8'))

function analyze(jobDescription) {
  const jd = jobDescription.toLowerCase()
  const mentionsMobile = jd.includes('mobile') || jd.includes('ios') || jd.includes('android')
  const mentionsFinance = jd.includes('finance') || jd.includes('fp&a') || jd.includes('forecast')
  if (mentionsMobile && !mentionsFinance) {
    return {
      verdict: 'probably_not',
      recommendation: "If this role requires deep mobile execution, I'm probably not your person.",
    }
  }
  if (mentionsFinance) {
    return {
      verdict: 'strong_fit',
      recommendation: 'Strong fit for finance-operations transformation scope.',
    }
  }
  return {
    verdict: 'worth_conversation',
    recommendation: 'Worth a conversation if systems and operating rigor are priorities.',
  }
}

const bannedMarketingTerms = ['world-class', 'best-in-class', 'revolutionary', 'perfect fit']
let fail = 0
for (const item of cases) {
  const actual = analyze(item.jobDescription)
  const verdictPass = actual.verdict === item.expectedVerdict
  const recommendationLower = actual.recommendation.toLowerCase()
  const bannedFound = bannedMarketingTerms.filter((term) => recommendationLower.includes(term))
  const honestyPass = bannedFound.length === 0
  const pass = verdictPass && honestyPass
  console.log(
    `${pass ? 'PASS' : 'FAIL'} ${item.id}: expected=${item.expectedVerdict} actual=${actual.verdict}` +
      (honestyPass ? '' : ` bannedTerms=${bannedFound.join(',')}`),
  )
  if (!pass) fail += 1
}

if (fail > 0) {
  console.error(`Calibration failed (${fail} case(s))`)
  process.exit(1)
}

console.log('Calibration passed')

