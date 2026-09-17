import { useState } from 'react'
import Hero from './components/Hero'
import About from "./components/About";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import './App.css'
import Dashboard from "./components/Dashboard";
function App() {


  return (
    <>
      <Hero />
  
      <About />
     

      <Projects />
  

      {/* <Contact/> */}
      <Dashboard />
    

<Footer />
    </>
  )
}

export default App
