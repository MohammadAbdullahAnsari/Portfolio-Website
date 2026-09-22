import { useState } from 'react'
import Hero from './components/Hero'
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import './App.css'
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import Skills from './components/Skills';
function App() {


  return (
    <>
      <Hero />
  
     

      <Skills />
      <Projects />

  

      
      <Dashboard />
    <Contact/>

<Footer />
    </>
  )
}

export default App
