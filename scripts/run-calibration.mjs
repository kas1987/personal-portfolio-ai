import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('tests/calibration/jd-cases.json')
const cases = JSON.parse(fs.readFileSync(file, 'utf8'))

function analyze(jobDescription) {
  const jd = jobDescription.toLowerCase()
  const mentionsMobile = jd.includes('mobile') || jd.includes('ios') || jd.includes('android')
  const mentionsFinance = jd.includes('finance') || jd.includes('fp&a') || jd.includes('forecast')
  if (mentionsMobile && !mentionsFinance) return 'probably_not'
  if (mentionsFinance) return 'strong_fit'
  return 'worth_conversation'
}

let fail = 0
for (const item of cases) {
  const actual = analyze(item.jobDescription)
  const pass = actual === item.expectedVerdict
  console.log(`${pass ? 'PASS' : 'FAIL'} ${item.id}: expected=${item.expectedVerdict} actual=${actual}`)
  if (!pass) fail += 1
}

if (fail > 0) {
  console.error(`Calibration failed (${fail} case(s))`)
  process.exit(1)
}

console.log('Calibration passed')

