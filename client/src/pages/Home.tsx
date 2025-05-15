import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/home.css';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { currentUser, handleLogout } = useAuth();
    const { t } = useTranslation();
    return (
        <div className='d-flex vh-100 text-white bg-dark body'>
            <div className="container">
                <div className="row h-100">
                    <header className="col-12 p-3">
                        <div className="row justify-content-between">
                            <h3 className="col">DateScape</h3>
                            <nav className="nav nav-masthead col-12 col-md-6 justify-content-md-end">
                                <a className="nav-link active" id='nav-link' href="">{t('home')}</a>
                                <Link className="nav-link" id='nav-link' to="/locations">{t('locations')}</Link>
                                {!currentUser ? (
                                    <>
                                        <Link className="nav-link" id='nav-link' to="/login">{t('log_in')}</Link>
                                        <Link className="nav-link" id='nav-link' to="/register">{t('sign_up')}</Link>
                                    </>
                                ) : (
                                    <Link id='nav-link' className="nav-link" to={'#'} onClick={handleLogout}>{t('button.logout')}</Link>
                                )}
                            </nav>
                        </div>
                    </header>
                    <main className="col align-self-center text-center">
                        <h2 className="mb-3">{t('homePage.title')} <span>&#10084;</span></h2>
                        <p className="lead">
                            {t('homePage.paragraph1')}
                        </p>
                        <p className="lead">
                            {t('homePage.paragraph2')}
                        </p>
                        <p className="lead">
                            {t('homePage.paragraph3')}
                        </p>
                        <Link className="btn btn-secondary fw-medium" to="/locations">{t('button.homePage')}</Link>
                    </main>
                    <footer className="mt-auto pb-2">&copy; 2025 DateScape</footer>
                </div>
            </div>
        </div>
    );
}

export default Home