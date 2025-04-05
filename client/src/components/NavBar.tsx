import { BaseSyntheticEvent, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import '../styles/navbar.css';
import { Avatar } from '@mui/material'
import { IoSearch } from "react-icons/io5";


const Navbar = () => {
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate()

    const [locationName, setLocationName] = useState('');

    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        setLocationName('');
        navigate(`/locations${locationName ? `?locationName=${locationName}` : ''}`, { state: locationName })
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top bg-danger bg-gradient rounded-bottom-4">
            <div className="container-fluid">
                <NavLink className="navbar-brand fs-4 fw-medium" to="/"><img src="/map.png" alt="logo" className="logo" /> DateScape</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/locations">Home</NavLink>
                    </div>
                    <form className="d-flex ms-auto w-25" onSubmit={handleSubmit} role="search">
                        <div className="input-group">
                            <input className="form-control" value={locationName} onChange={(e) => setLocationName(e.target.value)} name="locationName" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-dark" type="submit"><IoSearch className="fs-5" /></button>
                        </div>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <>
                                <div className="btn-group d-none d-lg-inline">
                                    <span className="align-self-center fw-medium">Welcome, {currentUser.username}</span>
                                    <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Avatar src={currentUser.image?.url || undefined}>
                                            {!currentUser.image?.url && currentUser.username[0]}
                                        </Avatar>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><Link className="dropdown-item text-center fw-medium" to="/profile">Profile</Link></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/mylocations">My Locations</Link></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/favorites">Favorites</Link></li>
                                        <li><button className="dropdown-item text-center fw-medium" onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                </div>
                                <div className="d-lg-none navbar-nav">
                                    <NavLink className="nav-link text-center fw-medium" id="link" to="/profile">Profile</NavLink>
                                    <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/mylocations">My Locations</NavLink>
                                    <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/favorites">Favorites</NavLink>
                                    <button className="nav-link fw-medium" id="link" onClick={handleLogout}>Logout</button>
                                </div>
                            </>
                            :
                            <>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/login">Login</NavLink>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/register">Sign up</NavLink>
                            </>
                        }
                    </div>
                </div>
            </div>

        </nav>
    )
}

export default Navbar