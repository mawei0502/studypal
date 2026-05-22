import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProjectSection from './components/ProjectSection'
import AboutSection from './components/AboutSection'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectSection />
        <AboutSection />
      </main>
    </>
  )
}

export default App
