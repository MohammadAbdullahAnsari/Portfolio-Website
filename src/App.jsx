import { useState } from 'react'
import Hero from './components/Hero'
import About from "./components/About";
import Projects from "./components/Projects";
import './App.css'
import Footer from "./components/Footer";
import SectionDivider from './components/SectionDivider';
import Dashboard from "./components/Dashboard";
function App() {


  return (
    <>
      <Hero />
     <SectionDivider/>
      <About />
     <SectionDivider/>

      <Projects />
     <SectionDivider/>

      {/* <Contact/> */}
      <Dashboard />
     <SectionDivider/>

<Footer />
    </>
  )
}

export default App
