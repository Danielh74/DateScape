import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='text-center mt-3'>
            <h1>Page not found &#x1F494;</h1>
            <p>There is no love to be found here.</p>
            <p>Don't give app and get back to the game!</p>
            <Link className='btn btn-primary' to='/locations'>Go back home</Link>
        </div>
    )
}

export default NotFound