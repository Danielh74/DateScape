import { BaseSyntheticEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CampgroundCreateModal from "../modals/CampgroundCreateModal";
import '../styles/navbar.css'

const NavBar = () => {
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate()
    const [show, setShow] = useState(false);

    const handleShow = () => {
        if (currentUser) {
            setShow(true);
        }
    }

    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        navigate('/campgrounds?campName', { state: data.campName })
    }

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
                        <NavLink className="nav-link" id="link" to="/">Home</NavLink>
                        <NavLink className="nav-link" id="link" to="/campgrounds">campgrounds</NavLink>
                        <button className="nav-link" id="link" onClick={handleShow}>
                            New Campground
                        </button>
                    </div>
                    <form className="d-flex ms-auto" onSubmit={handleSubmit} role="search">
                        <input className="form-control me-2" name="campName" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-dark" type="submit">Search</button>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <button className="nav-link" id="link" onClick={handleLogout}>Logout</button>
                            :
                            <>
                                <NavLink className="nav-link" id="link" to="/login">Login</NavLink>
                                <NavLink className="nav-link" id="link" to="/register">Sign up</NavLink>
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

export default NavBar