import fs from 'node:fs'
import path from 'node:path'

const dtoPath = path.resolve('src/lib/dto.ts')
const apiContractsPath = path.resolve('docs/API-CONTRACTS.md')
const dtoSource = fs.readFileSync(dtoPath, 'utf8')
const apiContracts = fs.readFileSync(apiContractsPath, 'utf8')

const forbiddenPublicFields = [
  'salaryMin',
  'salaryMax',
  'whyJoined',
  'whyLeft',
  'actualContributions',
  'conflictsOrChallenges',
  'quantifiedImpact',
]

let fail = 0

for (const field of forbiddenPublicFields) {
  if (dtoSource.includes(`.${field}`)) {
    console.error(`FAIL boundary: forbidden field exposed in public DTO mapping (${field})`)
    fail += 1
  } else {
    console.log(`PASS boundary: ${field} not exposed in public DTO mapping`)
  }
}

if (!apiContracts.includes('Error format always follows')) {
  console.error('FAIL contracts: API error contract section missing')
  fail += 1
} else {
  console.log('PASS contracts: API error contract section present')
}

if (fail > 0) {
  console.error(`Regression failed (${fail} issue(s))`)
  process.exit(1)
}

console.log('Regression passed')

