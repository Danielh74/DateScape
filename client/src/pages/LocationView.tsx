import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { DateLocation } from "../models/DateLocation";
import { createReview, deleteReview } from "../services/reviewService";
import { getLocation, deleteLocation } from "../services/locationService";
import useAuth from "../hooks/useAuth";
import LocationMap from "../components/LocationMap";
import LocationEditModal from "../modals/LocationEditModal";
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-toastify';
import { CardLoader, Loader } from "../components/Loaders";
import StarIcon from '@mui/icons-material/Star';
import Rating from "@mui/material/Rating";
import { convertToLocalDate } from "../utils/convertToLocalDate";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ReviewProp>({
        defaultValues: {
            rating: 2,
            body: ""
        }
    })

    useEffect(() => {
        const fetchLocation = () => {
            setIsLoading(prev => ({ ...prev, location: true }))
            getLocation(id)
                .then(res => setLocation(res.data.location))
                .catch(err => {
                    if (err.status === 404) {
                        toast.error(err.response.data);
                    } else {
                        toast.error(err.message);
                    }
                    navigate('/locations');
                }).finally(() => {
                    setIsLoading(prev => ({ ...prev, location: false }));
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
        <>
            {location ?
                <main className="row my-3">
                    <section className="col-12 col-lg-3 mb-2">
                        <LocationMap location={location} />
                    </section>
                    <article className="col-12 col-lg-6">
                        {isLoading.location ? <CardLoader />
                            :
                            <div className="card shadow">
                                <div className="row">
                                    <div id="locationCarousel" className="carousel slide">
                                        <div className="carousel-inner">
                                            {location?.images.map((img, i) =>
                                                <div key={img._id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                                    <img src={img.url} className="rounded-top object-fit-cover w-100" alt="camp image" />
                                                </div>
                                            )}
                                        </div>
                                        {location.images.length > 1 &&
                                            <>
                                                <button className="carousel-control-prev" type="button" data-bs-target="#locationCarousel"
                                                    data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">{t('button.previous')}</span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target="#locationCarousel"
                                                    data-bs-slide="next">
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">{t('button.next')}</span>
                                                </button>
                                            </>
                                        }
                                    </div>
                                    <div className="card-body px-4">
                                        <div className="card-title d-flex justify-content-between">
                                            <h5>
                                                {location.title}
                                            </h5>
                                            <span>
                                                <b className="align-bottom">{location.averageRating}</b> <StarIcon className="text-warning" />
                                            </span>
                                        </div>
                                        <p className="card-text">
                                            {location.description}
                                        </p>

                                        <ul className="list-group list-group-flush p-0">
                                            <li className="list-group-item fw-medium text-secondary">
                                                {location.address}
                                            </li>
                                            <li className="list-group-item">
                                                Avg. ${location.price}
                                            </li>
                                            <li className="list-group-item">
                                                {t('submitted_by')} {location.author.username} <br />
                                                <small className="text-secondary">{convertToLocalDate(location.updatedAt.toString().split('T')[0])}</small>
                                            </li>
                                            <li className="list-group-item">

                                            </li>
                                        </ul>
                                        {currentUser && currentUser._id === location.author._id &&
                                            <div className="row px-2 gap-2">
                                                <button type="button" className="col-2 btn btn-info rounded-5" onClick={() => setShow(true)}>
                                                    {t('button.edit')}
                                                </button>
                                                <button className="col-2 btn btn-danger rounded-5" disabled={isLoading.location} onClick={handleDeleteLocation}>
                                                    {isLoading.location ? t('loading') + '...' : t('button.delete')}
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </article>

                    <aside className="position-relative col-lg-3 col-12 mt-2">
                        {isLoading.review && <Loader />}
                        {currentUser &&
                            <>
                                <h2>{t('leave_review')}</h2>
                                <form className="needs-validation mb-2" onSubmit={handleSubmit(onReviewSubmit)}>
                                    <Controller
                                        name="rating"
                                        control={control}
                                        rules={{ required: 'Rating is required' }}
                                        render={({ field }) => (
                                            <Rating
                                                {...field}
                                                value={field.value || 0}
                                                onChange={(_, value) => field.onChange(value)}
                                                size="large"
                                            />
                                        )}
                                    />

                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="body">{t('review')}</label>
                                        <textarea className={`form-control ${errors.body && 'border-danger'}`} {...register('body', { required: "Review body can't be empty" })} id="body"></textarea>
                                        {errors.body && <small className="text-danger">{errors.body.message}</small>}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <button className="btn btn-success rounded-5">{t('button.submit')}</button>
                                        {location.reviews.length} {t('reviews')}
                                    </div>

                                </form>
                            </>
                        }
                        {location.reviews?.length > 0 ? (
                            <div className="overflow-auto h-50">
                                {location.reviews.map(review => (
                                    <article key={review._id} className="card mb-2">
                                        <div className="card-body">
                                            <Rating value={review.rating} readOnly />
                                            <p className="card-text">
                                                {review.body}
                                            </p>
                                            <p className="card-text text-body-secondary">
                                                {review.author.username}
                                            </p>
                                            {(currentUser && (currentUser._id === review.author._id)) &&
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(review._id)}>{t('button.delete')}</button>
                                            }
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p>{t('noReviews.title')} {currentUser ? t('noReviews.authMessage') : t('noReviews.notAuthMessage')}</p>
                        )}
                    </aside>
                    <LocationEditModal
                        show={show}
                        onClose={() => setShow(false)}
                        location={location}
                        onUpdate={(updatedLocation: DateLocation) => setLocation(updatedLocation)} />
                </main >
                :
                <h1>
                    {t('no_location')}
                </h1>}
        </>

    )
}

export default LocationView