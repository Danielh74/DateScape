import { useState } from 'react';
import { DateLocation } from '../models/DateLocation'
import { updateFavLocation } from '../services/locationService';
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
            updateFavLocation(location.id)
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

            <div className="location-card position-relative overflow-hidden rounded-4 shadow">

                {/* Background image */}
                <img
                    src={location.images[0].url}
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    alt={location.title}
                />

                {/* Gradient overlay */}
                <div className="location-card-overlay position-absolute top-0 start-0 w-100 h-100"></div>

                {/* Content */}
                <div className="location-card-content position-relative d-flex flex-column justify-content-end h-100 p-3 text-white">

                    <div className="d-flex justify-content-between align-items-start">
                        <h5 className="mb-1">
                            {location.title}
                        </h5>

                        <span className="text-nowrap">
                            <b>{location.averageRating}</b>
                            <span className="text-warning">
                                <StarIcon />
                            </span>
                        </span>
                    </div>

                    <p className="mb-1 text-light">
                        {location.address}
                    </p>

                    <span className="fw-semibold mb-1">
                        {location.price > 0
                            ? `Avg. $${location.price}`
                            : t('free')}
                    </span>

                    <span className="small text-light mb-3">
                        {t('categories')}: {location.categories.map(c => t(c)).join(', ')}
                    </span>

                    <div className="d-flex justify-content-between align-items-center">

                        <Link
                            className="btn btn-outline-light rounded-5 px-3"
                            to={`/location/${location.id}`}
                        >
                            {t('view_location')}
                        </Link>

                        <button
                            className="btn p-0 border-0 d-flex justify-content-center align-items-center"
                            style={{ width: '40px', height: '40px' }}
                            onClick={handleUpdateFavLocation}
                        >
                            {currentUser?.favLocations?.some(
                                fav => fav === location.id
                            ) ? (
                                <FaHeart className="text-danger fs-2" />
                            ) : (
                                <CiHeart className="text-secondary fs-1 heart" />
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </article>
    )
}

export default LocationCard