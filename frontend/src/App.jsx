import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="border-4 border-blue-500 p-6 rounded-lg bg-gray-900 flex justify-center items-center min-h-screen">
      <p className="text-5xl font-extrabold text-white underline italic drop-shadow-lg">
        Hello World!
      </p> 
    </div>
  )
}

export default App
