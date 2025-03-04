import { BaseSyntheticEvent, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import '../styles/navbar.css';
import { Avatar } from '@mui/material'

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
                <span className="navbar-brand fs-4 fw-medium">DataScape</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link text-center fw-medium" id="link" to="/">Home</NavLink>
                        <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/locations">Locations</NavLink>
                    </div>
                    <form className="d-flex ms-auto" onSubmit={handleSubmit} role="search">
                        <input className="form-control me-2" value={locationName} onChange={(e) => setLocationName(e.target.value)} name="locationName" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-dark" type="submit">Search</button>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <>
                                <div className="btn-group d-none d-lg-inline">
                                    <span className="align-self-center fw-medium">Welcome, {currentUser.username}</span>
                                    <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Avatar>{currentUser.username.charAt(0)}</Avatar>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a className="dropdown-item text-center fw-medium" href="#">Profile</a></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/mylocations">My Locations</Link></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/favorites">Favorites</Link></li>
                                        <li><button className="dropdown-item text-center fw-medium" onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                </div>
                                <div className="d-lg-none navbar-nav">
                                    <NavLink className="nav-link text-center fw-medium" id="link" to="#">Profile</NavLink>
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