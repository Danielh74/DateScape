import { BaseSyntheticEvent, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import '../styles/navbar.css';
import { Avatar } from '@mui/material'
import { IoSearch } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [locationName, setLocationName] = useState('');

    const handleSubmit = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        setLocationName('');
        navigate(`/locations${locationName ? `?locationName=${locationName}` : ''}`, { state: locationName })
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top rounded-5 m-2 bg-light border border-dark-subtle shadow" style={{ direction: "ltr" }}>
            <div className="container-fluid text-danger">
                <NavLink className="navbar-brand fs-4 fw-medium text-danger" to="/"><img src="/map.png" alt="logo" className="logo" /> DateScape</NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link text-center fw-medium align-self-center" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/locations">{t('home')}</NavLink>
                    </div>
                    <form className="col-12 offset-lg-2 col-lg-5 col-xl-6" onSubmit={handleSubmit} role="search">
                        <div className="input-group">
                            <input className="form-control rounded-start-4 focus-ring focus-ring-danger" value={locationName} onChange={(e) => setLocationName(e.target.value)} name="locationName" type="search" placeholder={t('search')} aria-label="Search" />
                            <button className="btn btn-danger rounded-end-4" type="submit"><IoSearch className="fs-5" /></button>
                        </div>
                    </form>
                    <div className="navbar-nav ms-auto">
                        {currentUser ?
                            <>
                                <div className="btn-group d-none d-lg-inline">
                                    <span className="align-self-center fw-medium">{t('welcome')}, {currentUser.username}</span>
                                    <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Avatar style={{ height: 50, width: 50 }} src={currentUser.image?.url || undefined}>
                                            {!currentUser.image?.url && currentUser.username[0]}
                                        </Avatar>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><Link className="dropdown-item text-center fw-medium" to="/profile">{t('profile')}</Link></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/mylocations">{t('my_locations')}</Link></li>
                                        <li><Link className="dropdown-item text-center fw-medium" onClick={() => sessionStorage.setItem('activePage', '1')} to="/favorites">{t('favorites')}</Link></li>
                                        <li><button className="dropdown-item text-center fw-medium" onClick={handleLogout}>{t('button.logout')}</button></li>
                                    </ul>
                                </div>
                                <div className="d-lg-none navbar-nav align-items-center">
                                    <NavLink className="nav-link text-center fw-medium" id="link" to="/profile">{t('profile')}</NavLink>
                                    <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/mylocations">{t('my_locations')}</NavLink>
                                    <NavLink className="nav-link text-center fw-medium" id="link" onClick={() => sessionStorage.setItem('activePage', '1')} to="/favorites">{t('favorites')}</NavLink>
                                    <button className="nav-link fw-medium" id="link" onClick={handleLogout}>{t('button.logout')}</button>
                                </div>
                            </>
                            :
                            <>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/login">{t('button.login')}</NavLink>
                                <NavLink className="nav-link text-center fw-medium" id="link" to="/register">{t('button.signup')}</NavLink>
                            </>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar