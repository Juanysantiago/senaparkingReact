import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


import { Nabvar1 } from './components/Narbar1/nabvar1'
import {Greeting, Greeting2} from './components/Greeting/greeting'
import GreetingDefault from './components/Greeting/greting-default'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nabvar1/>
    <Greeting/>
    <Greeting2/>
    <GreetingDefault/>
     hola mundo!!

    </>
  )
}

export default App
