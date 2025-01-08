import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { DateLocation } from "../models/DateLocation";
import { createReview, deleteReview } from "../services/reviewService";
import { getLocation, deleteLocation } from "../services/locationService";
import useAuth from "../hooks/useAuth";
import LocationMap from "../components/LocationMap";
import LocationEditModal from "../modals/LocationEditModal";
import { useForm } from "react-hook-form";
import '../styles/starts.css';
import { toast } from 'react-toastify';

interface ReviewProp {
    rating: number;
    body: string;
}

const LocationView = () => {
    const { id } = useParams() as { id: string };
    const [location, setLocation] = useState<DateLocation>();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState({ review: false, location: false });
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewProp>({
        defaultValues: {
            rating: 5,
            body: ""
        }
    })

    useEffect(() => {
        const fetchLocation = () => {
            getLocation(id)
                .then(res => setLocation(res.data.location))
                .catch(err => {
                    if (err.status === 404) {
                        toast.error(err.response.data);
                    } else {
                        toast.error(err.message);
                    }
                    navigate('/locations');
                });
        }
        fetchLocation();
    }, [navigate, id]);

    const onReviewSubmit = (data: ReviewProp) => {
        setIsLoading(prev => ({ ...prev, review: true }));
        createReview(id, data)
            .then(res => {
                setLocation(res.data.location);
                reset();
                toast.success(res.data.message);
            }).catch(err => {
                if (err.status === 404) {
                    toast.error(err.response.data);
                } else {
                    toast.error(err.message);
                }
            }).finally(() => {
                setIsLoading(prev => ({ ...prev, review: false }));
            });
    };

    const handleDeleteReview = (reviewId: string) => {
        setIsLoading(prev => ({ ...prev, review: true }));
        deleteReview(id, reviewId)
            .then(res => {
                setLocation(res.data.location);
                toast.success(res.data.message);
                reset();
            }).catch(err => {
                if (err.status === 404) {
                    toast.error(err.response.data);
                } else {
                    toast.error(err.message);
                }
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, review: false }));
            });
    };

    const handleDeleteLocation = () => {
        setIsLoading(prev => ({ ...prev, location: true }));
        deleteLocation(id)
            .then((res) => {
                toast.success(res.data);
                navigate('/locations')
            }).catch(err => {
                if (err.status === 404) {
                    toast.error(err.response.data);
                } else {
                    toast.error(err.message);
                }
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, location: false }));
            });

    }

    return (
        location ?
            <div className="row my-3">
                <div className="col-12 col-md-3 mb-2">
                    <LocationMap location={location} />
                </div>
                <div className="col-12 col-md-6">
                    <div className="card">
                        <div className="row">
                            <div id="locationCarousel" className="carousel slide">
                                <div className="carousel-inner">
                                    {location?.images.map((img, i) =>
                                        <div key={img._id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                            <img src={img.url} style={{ height: 300 }} className="rounded-top object-fit-fill w-100" alt="" />
                                        </div>
                                    )}
                                </div>
                                {location.images.length > 1 &&
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#locationCarousel"
                                            data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#locationCarousel"
                                            data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                }
                            </div>
                            <div className="card-body">
                                <h3 className="card-title ps-2">
                                    {location.title}
                                </h3>
                                <p className="card-text ps-2">
                                    {location.description}
                                </p>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item fw-medium text-secondary">
                                        {location.address}
                                    </li>
                                    <li className="list-group-item">
                                        ${location.price}/night
                                    </li>
                                    <li className="list-group-item">
                                        Submitted by {location.author.username} <br />
                                        <small className="text-secondary">{location.updatedAt}</small>
                                    </li>
                                    <li className="list-group-item">

                                    </li>
                                </ul>
                                {currentUser && currentUser._id === location.author._id &&
                                    <div className="ps-2">
                                        <button type="button" className="btn btn-info" onClick={() => setShow(true)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger ms-2" disabled={isLoading.location} onClick={handleDeleteLocation}>{isLoading.location ? 'Loading...' : 'Delete'}</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="position-relative col-md-3 col-12 mt-md-0 mt-2">
                    {isLoading.review && <div className="position-absolute bg-secondary w-100 h-100 z-1 align-content-center text-center fs-3 fw-bold bg-opacity-50 rounded">Loading...</div>}
                    {currentUser &&
                        <>
                            <h2>Leave a Review</h2>
                            <form className="needs-validation mb-2" onSubmit={handleSubmit(onReviewSubmit)}>
                                <div>
                                    <fieldset className="starability-heart" >
                                        <input type="radio" id="first-rate1" {...register('rating', { required: true })} value="1" />
                                        <label htmlFor="first-rate1" title="Terrible">1 star</label>
                                        <input type="radio" id="first-rate2" {...register('rating')} value="2" />
                                        <label htmlFor="first-rate2" title="Not good">2 stars</label>
                                        <input type="radio" id="first-rate3" {...register('rating')} value="3" />
                                        <label htmlFor="first-rate3" title="Average">3 stars</label>
                                        <input type="radio" id="first-rate4" {...register('rating')} value="4" />
                                        <label htmlFor="first-rate4" title="Very good">4 stars</label>
                                        <input type="radio" id="first-rate5" {...register('rating')} value="5" defaultChecked />
                                        <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                                    </fieldset>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label" htmlFor="body">Review</label>
                                    <textarea className={`form-control ${errors.body && 'border-danger'}`} {...register('body', { required: "Review body can't be empty" })} id="body"></textarea>
                                    {errors.body && <small className="text-danger">{errors.body.message}</small>}
                                </div>
                                <button className="btn btn-success">Submit</button>
                            </form>
                        </>
                    }
                    {location.reviews?.length > 0 ? (
                        location.reviews.map(review => (
                            <div key={review._id} className="card mb-2">
                                <div className="card-body">
                                    <p className="starability-result" data-rating={review.rating}>
                                        Rated: {review.rating} stars
                                    </p>
                                    <p className="card-text">
                                        {review.body}
                                    </p>
                                    <p className="card-text text-body-secondary">
                                        {review.author.username}
                                    </p>
                                    {(currentUser && (currentUser._id === review.author._id)) &&
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(review._id)}>Delete</button>
                                    }
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first to leave one!</p>
                    )}
                </div>
                <LocationEditModal
                    show={show}
                    onClose={() => setShow(false)}
                    location={location}
                    onUpdate={(updatedLocation: DateLocation) => setLocation(updatedLocation)} />
            </div >
            :
            <div>
                No Location found
            </div>
    )
}

export default LocationView