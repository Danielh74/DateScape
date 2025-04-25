import { useState } from 'react';
import { DateLocation } from '../models/DateLocation'
import { updateFavLocation } from '../services/authService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Loader } from './Loaders';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';

type Props = {
    location: DateLocation
}

const LocationCard = ({ location }: Props) => {
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

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
            <div className="border rounded shadow h-100">
                <img src={location.images[0].url} className="card-img-top rounded-top h-50 object-fit-fill" alt="location image" />
                <div className="d-flex flex-column card-body p-2 h-50">
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
                            {location.price > 0 ? `Avg. $${location.price}` : t('free')}
                        </span>
                        <span className="d-block">{t('categories')}: {<span>{location.categories.map(c => t(c)).join(', ')}</span>}</span>

                    </p>
                    <div className="row justify-content-between align-items-end mt-auto">
                        <Link className="col-6 mx-2 btn btn-outline-danger" to={`/location/${location.id}`}>
                            {t('view_location')}
                        </Link>
                        <button className="btn col-2 fs-1 p-0 border-0" onClick={handleUpdateFavLocation}>
                            {currentUser?.favLocations?.some(fav => fav === location.id) ? <FaHeart className="text-danger fs-2" /> : <CiHeart />}
                        </button>

                    </div>
                </div>
            </div>
        </article>
    )
}

export default LocationCard