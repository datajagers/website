import './styles/global.css'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './sections/Hero/Hero'
import { ValueProp } from './sections/ValueProp/ValueProp'
import { Services } from './sections/Services/Services'
import { Process } from './sections/Process/Process'
import { Testimonials } from './sections/Testimonials/Testimonials'
import { FAQ } from './sections/FAQ/FAQ'
import { Contact } from './sections/Contact/Contact'
import { Footer } from './sections/Footer/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProp />
        <Services />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
