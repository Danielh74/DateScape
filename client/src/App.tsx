import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div className='container my-3'>
      <Outlet />
    </div>)
}

export default App
