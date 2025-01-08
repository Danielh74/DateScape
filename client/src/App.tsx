import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/NavBar'
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <Navbar />
      <div className='container'>
        <Outlet />
        <ToastContainer />
      </div>
    </>)

}

export default App
