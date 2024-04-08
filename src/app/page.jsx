import { CallToAction } from '../testComponent/CallToAction.jsx'
import { Faqs } from '../testComponent/Faqs.jsx'
import { Footer } from '../testComponent/Footer.jsx'
import { HeaderTEM } from '../testComponent/Header_tem.jsx'
import { Hero } from '../testComponent/Hero.jsx'
import { Pricing } from '../testComponent/Pricing.jsx'
import { PrimaryFeatures } from '../testComponent/PrimaryFeatures.jsx'
import { SecondaryFeatures } from '../testComponent/SecondaryFeatures.jsx'
import { Testimonials } from '../components/Testimonials.jsx'

export default function Home() {
  return (
    <>
      <HeaderTEM />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
