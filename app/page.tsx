import {
  Header,
  Hero,
  NetworkEffect,
  Demo,
  ForStudents,
  ForUniversities,
  ForCompanies,
  UseCases,
  CTA,
  FAQ,
  Footer,
} from '@/components/landing'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <NetworkEffect />
        <Demo />
        <ForStudents />
        <ForUniversities />
        <ForCompanies />
        <UseCases />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
