import './App.css'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {

  return (
    <>
      <NavBar />
      <div className='container my-3'>
        <Outlet />
      </div>
    </>)

}

export default App
