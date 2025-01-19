import { useState } from 'react';
import { DateLocation } from '../models/DateLocation'
import { updateFavLocation } from '../services/authService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Loader } from './Loaders';
import { Link, useNavigate } from 'react-router-dom';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import StarIcon from '@mui/icons-material/Star';

type Props = {
    location: DateLocation
}

const LocationCard = ({ location }: Props) => {
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateFavLocation = () => {
        if (currentUser) {
            setIsLoading(true);
            updateFavLocation({ locationId: location.id })
                .then(res => {
                    updateUser(res.data.user);
                })
                .catch(err => toast.error(err.response.data))
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            toast.error('Sign in to add a location to your favorites');
            navigate('/login');
        }

    };

    return (
        <article className="position-relative col-12 col-sm-6 col-md-4 col-lg-3 p-2 my-2">
            {isLoading && <Loader />}
            <div className="border rounded shadow">
                <img src={location.images[0].url} className="card-img-top rounded-top" alt="location image" />
                <div className="card-body p-2">
                    <div className="card-title d-flex justify-content-between">
                        <h5 className="">
                            {location.title}

                        </h5>
                        <span>
                            <b className='align-bottom'>{location.averageRating}</b> <span className=' text-warning'><StarIcon /></span>
                        </span>
                    </div>
                    <p className="card-text m-0">
                        <span className="text-muted d-block">
                            {location.address}
                        </span>
                        <span className="d-inline-block my-2 fw-semibold ">
                            ${location.price}
                        </span>
                        <span className="d-block">Categories: {<span>{location.categories.join(', ')}</span>}</span>

                    </p>
                    <div className="row justify-content-between align-items-end">
                        <Link className="col-6 mx-2 btn btn-danger" to={`/location/${location.id}`}>
                            View Location
                        </Link>
                        <button className="btn col-2 fs-1 p-0 border-0" onClick={handleUpdateFavLocation}>
                            {currentUser?.favLocations?.some(fav => fav === location.id) ? <IoHeartSharp className="text-danger" /> : <IoHeartOutline />}
                        </button>

                    </div>
                </div>
            </div>
        </article>
    )
}

export default LocationCard