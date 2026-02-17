import { useState } from 'react'
import { ChatDrawer } from '../components/chat/ChatDrawer'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { FitAssessment } from '../components/sections/FitAssessment'
import { HeroSection } from '../components/sections/HeroSection'
import { SkillsMatrix } from '../components/sections/SkillsMatrix'
import { useCandidateData } from '../hooks/useCandidateData'
import { toPublicPortfolioDTO } from '../lib/dto'

export function PublicPortfolioPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const { data: context, isLoading } = useCandidateData()

  if (isLoading || !context) {
    return <main className="container">Loading portfolio context...</main>
  }
  const publicData = toPublicPortfolioDTO(context)

  return (
    <main className="container">
      <Navbar onAskAI={() => setChatOpen(true)} />
      <HeroSection profile={publicData.profile} onAskAI={() => setChatOpen(true)} />
      <ExperienceSection experiences={publicData.experiences} />
      <SkillsMatrix skills={publicData.skills} />
      <FitAssessment context={context} />
      <Footer profile={publicData.profile} />
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} context={context} />
    </main>
  )
}

