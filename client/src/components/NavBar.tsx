import { BaseSyntheticEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CampgroundCreateModal from "../modals/CampgroundCreateModal";
import '../styles/navbar.css';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [campName, setCampName] = useState('');

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
        setCampName('');
        navigate(`/campgrounds${campName ? `?campName=${campName}` : ''}`, { state: campName })
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
                        <NavLink className="nav-link text-center fw-medium" id="link" to="/campgrounds">Locations</NavLink>
                        <button className="nav-link fw-medium" id="link" onClick={handleShow}>
                            New Location
                        </button>
                    </div>
                    <form className="d-flex ms-auto" onSubmit={handleSubmit} role="search">
                        <input className="form-control me-2" value={campName} onChange={(e) => setCampName(e.target.value)} name="campName" type="search" placeholder="Search" aria-label="Search" />
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
            <CampgroundCreateModal
                show={show}
                onClose={() => setShow(false)} />
        </nav>
    )
}

export default Navbar