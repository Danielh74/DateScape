import '../styles/home.css'

const Home = () => {
    return (
        <div className='d-flex vh-100 text-white bg-dark body'>
            <div className="container">
                <div className="row h-100">
                    <header className="col-12 p-3">
                        <div className="row justify-content-between">
                            <h3 className="col">YelpCamp</h3>
                            <nav className="nav nav-masthead col-12 col-md-6 justify-content-md-end">
                                <a className="nav-link active" id='nav-link' href="">Home</a>
                                <a className="nav-link" id='nav-link' href="/campgrounds">Campgrounds</a>
                                {/* {!currentUser ? (
                            <>
                                <a className="nav-link" href="/login">Login</a>
                                <a className="nav-link" href="/register">Register</a>
                            </>
                        ) : (
                            <a className="nav-link" href="/logout">Logout</a>
                        )} */}
                            </nav>
                        </div>
                    </header>
                    <main className="col align-self-center text-center">
                        <h2 className="mb-3">Welcome to YelpCamp!</h2>
                        <p className="lead">
                            Discover Amazing Campgrounds Around the World! <br />
                            Whether you're planning your next outdoor adventure or just exploring, connect with
                            stunning camping destinations across the globe. <br />
                            Start your journey today — explore, plan, and make memories in nature.
                        </p>
                        <a className="btn btn-secondary" href="/campgrounds">Go To Campgrounds</a>
                    </main>
                    <footer className="mt-auto pb-2">&copy; 2024 YelpCamp</footer>
                </div>
            </div>
        </div>
    );
}

export default Home