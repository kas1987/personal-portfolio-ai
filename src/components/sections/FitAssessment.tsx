import { useState } from 'react'
import type { CandidateContext } from '../../types/domain'
import { useJDAnalyzer } from '../../hooks/useJDAnalyzer'

type Props = {
  context: CandidateContext | undefined
}

const strongExample = `We are a $120M manufacturer with a 14-day close, fragmented planning in spreadsheets, and no trusted forecast. We need a 90-day AI Finance Assessment to identify automation opportunities, redesign FP&A operating cadence, and produce an executive-ready implementation roadmap.`
const weakExample = `We need a senior iOS engineer to ship a consumer mobile app in SwiftUI, own App Store releases, and optimize in-app purchase funnels.`

export function FitAssessment({ context }: Props) {
  const [jobDescription, setJobDescription] = useState('')
  const analyzer = useJDAnalyzer(context)

  function setExample(mode: 'strong' | 'weak') {
    setJobDescription(mode === 'strong' ? strongExample : weakExample)
  }

  return (
    <section id="fit-check" className="section-shell">
      <h3>Client Fit Assessment</h3>
      <p className="section-subtext">
        Describe your finance problem and get a direct assessment of whether this consulting engagement is
        the right fit.
      </p>

      <div className="row">
        <button className="btn btn-secondary" onClick={() => setExample('strong')}>
          Good-Fit Client Example
        </button>
        <button className="btn btn-secondary" onClick={() => setExample('weak')}>
          Poor-Fit Client Example
        </button>
      </div>

      <textarea
        className="jd-input"
        placeholder="Paste your finance operating context, constraints, and outcomes you need..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => analyzer.mutate(jobDescription)}
        disabled={analyzer.isPending || jobDescription.trim().length < 20}
      >
        {analyzer.isPending ? 'Assessing...' : 'Assess Engagement Fit'}
      </button>

      {analyzer.data && (
        <div className="result-panel card">
          <h4>Assessment Result — {analyzer.data.result.headline}</h4>
          <p>{analyzer.data.result.opening}</p>
          <h5>Where This Engagement Does Not Fit</h5>
          <ul>
            {analyzer.data.result.gaps.map((gap) => (
              <li key={gap.gapTitle}>
                <strong>{gap.gapTitle}</strong>: {gap.explanation}
              </li>
            ))}
          </ul>
          <h5>What Still Transfers</h5>
          <p>{analyzer.data.result.transfers}</p>
          <h5>Recommendation</h5>
          <p>{analyzer.data.result.recommendation}</p>
          {!analyzer.data.honestyPass && (
            <div className="warning-box">
              Honesty checks flagged: {analyzer.data.honestyIssues.join('; ')}
            </div>
          )}
        </div>
      )}
      <div className="philosophy-callout">
        This signals something different than please consider my resume. You are qualifying fit from
        both sides, and your time is valuable too.
      </div>
    </section>
  )
}

