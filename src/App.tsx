import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Charities from './pages/Charities'
import Business from './pages/Business'
import ScrollToTop from './lib/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/charities" element={<Charities />} />
          <Route path="/business" element={<Business />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
