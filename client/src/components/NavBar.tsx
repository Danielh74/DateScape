import { BaseSyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const currentUser = true;
    const navigate = useNavigate()

    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        navigate('/campgrounds?campName', { state: data.campName })
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top bg-dark bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/campgrounds">YelpCamp</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link" href="/">Home</a>
                        <a className="nav-link" href="/campgrounds">campgrounds</a>
                        <a className="nav-link" href="/campgrounds/new">New Campground</a>
                    </div>
                    <form className="d-flex ms-auto" onSubmit={handleSubmit} role="search">
                        <input className="form-control me-2" name="campName" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <a className="nav-link" href="/logout">Logout</a>
                            :
                            <>
                                <a className="nav-link" href="/login">Login</a>
                                <a className="nav-link" href="/register">Sign up</a>
                            </>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar