import { Link } from 'react-router-dom'
import { ExperienceForm } from '../components/admin/ExperienceForm'
import { FAQForm } from '../components/admin/FAQForm'
import { GapsForm } from '../components/admin/GapsForm'
import { InstructionsForm } from '../components/admin/InstructionsForm'
import { ProfileForm } from '../components/admin/ProfileForm'
import { SkillsForm } from '../components/admin/SkillsForm'
import { useCandidateData, useSaveCandidateData } from '../hooks/useCandidateData'

export function AdminDashboardPage() {
  const { data: context, isLoading } = useCandidateData()
  const saveMutation = useSaveCandidateData()

  if (isLoading || !context) {
    return <main className="container">Loading admin context...</main>
  }

  return (
    <main className="container">
      <header className="admin-header">
        <h1>Admin Context Console</h1>
        <Link to="/" className="btn btn-secondary">
          Back to Public Site
        </Link>
      </header>
      <p>
        Edit private and public context, then save section-by-section. Changes are persisted to the
        active data store.
      </p>
      {saveMutation.isSuccess && <div className="success-box">Saved.</div>}

      <ProfileForm
        value={context.profile}
        onSave={(profile) => saveMutation.mutate({ ...context, profile })}
      />
      <ExperienceForm
        value={context.experiences}
        onSave={(experiences) => saveMutation.mutate({ ...context, experiences })}
      />
      <SkillsForm value={context.skills} onSave={(skills) => saveMutation.mutate({ ...context, skills })} />
      <GapsForm value={context.gaps} onSave={(gaps) => saveMutation.mutate({ ...context, gaps })} />
      <FAQForm
        value={context.faqResponses}
        onSave={(faqResponses) => saveMutation.mutate({ ...context, faqResponses })}
      />
      <InstructionsForm
        value={context.aiInstructions}
        onSave={(aiInstructions) => saveMutation.mutate({ ...context, aiInstructions })}
      />
    </main>
  )
}

