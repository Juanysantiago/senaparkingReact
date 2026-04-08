import { useState } from 'react'
import './App.css'
import { Button, Nav } from 'reactstrap';
import { Example } from './components/Example/example';
import { Navbar2 } from './components/Navbar/navbar2';
import { Navbar3 } from './components/Navbar3/navbar3';


function App() {
  const [count, setCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button color="danger">Danger!</Button>
      <Example color="light" light expand="md" />
      <Navbar2 />
      <Navbar3 />
    </>
  )
}

export default App
