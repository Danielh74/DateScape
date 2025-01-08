import { BaseSyntheticEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LocationCreateModal from "../modals/LocationCreateModal";
import '../styles/navbar.css';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [locationName, setLocationName] = useState('');

    const handleShow = () => {
        if (currentUser) {
            setShow(true);
        } else {
            toast.error('Must be logged in');
            navigate('/login')
        }
    };

    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        setLocationName('');
        navigate(`/locations${locationName ? `?locationName=${locationName}` : ''}`, { state: locationName })
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top bg-danger bg-body-primary">
            <div className="container-fluid">
                <span className="navbar-brand fs-4 fw-medium">DataScape</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link text-center fw-medium" id="link" to="/">Home</NavLink>
                        <NavLink className="nav-link text-center fw-medium" id="link" to="/locations">Locations</NavLink>
                        <button className="nav-link fw-medium" id="link" onClick={handleShow}>
                            New Location
                        </button>
                    </div>
                    <form className="d-flex ms-auto" onSubmit={handleSubmit} role="search">
                        <input className="form-control me-2" value={locationName} onChange={(e) => setLocationName(e.target.value)} name="locationName" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-dark" type="submit">Search</button>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <button className="nav-link" id="link" onClick={handleLogout}>Logout</button>
                            :
                            <>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/login">Login</NavLink>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/register">Sign up</NavLink>
                            </>
                        }
                    </div>
                </div>
            </div>
            <LocationCreateModal
                show={show}
                onClose={() => setShow(false)} />
        </nav>
    )
}

export default Navbar