import { useState } from 'react'
import type { CandidateContext } from '../../types/domain'
import { useJDAnalyzer } from '../../hooks/useJDAnalyzer'

type Props = {
  context: CandidateContext | undefined
}

const strongExample = `Looking for a strategic finance and operations leader with experience in forecasting, scenario planning, executive communication, and process automation.`
const weakExample = `Seeking a senior iOS engineer with 8+ years of Swift/UIKit experience and deep App Store shipping history.`

export function FitAssessment({ context }: Props) {
  const [jobDescription, setJobDescription] = useState('')
  const analyzer = useJDAnalyzer(context)

  function setExample(mode: 'strong' | 'weak') {
    setJobDescription(mode === 'strong' ? strongExample : weakExample)
  }

  return (
    <section id="fit-check" className="section-shell">
      <h3>Honest Fit Assessment</h3>
      <p className="section-subtext">Paste a JD and get an honest assessment, including when fit is poor.</p>

      <div className="row">
        <button className="btn btn-secondary" onClick={() => setExample('strong')}>
          Strong Fit Example
        </button>
        <button className="btn btn-secondary" onClick={() => setExample('weak')}>
          Weak Fit Example
        </button>
      </div>

      <textarea
        className="jd-input"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => analyzer.mutate(jobDescription)}
        disabled={analyzer.isPending || jobDescription.trim().length < 20}
      >
        {analyzer.isPending ? 'Analyzing...' : 'Analyze Fit'}
      </button>

      {analyzer.data && (
        <div className="result-panel card">
          <h4>⚠ Honest Assessment — {analyzer.data.result.headline}</h4>
          <p>{analyzer.data.result.opening}</p>
          <h5>Where I Don't Fit</h5>
          <ul>
            {analyzer.data.result.gaps.map((gap) => (
              <li key={gap.gapTitle}>
                <strong>{gap.gapTitle}</strong>: {gap.explanation}
              </li>
            ))}
          </ul>
          <h5>What Transfers</h5>
          <p>{analyzer.data.result.transfers}</p>
          <h5>My Recommendation</h5>
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

