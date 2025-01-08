import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Campground } from "../models/Campground";
import { createReview, deleteReview } from "../services/reviewService";
import { getCampground, deleteCampground } from "../services/campgroundService";
import useAuth from "../hooks/useAuth";
import CampMap from "../components/CampMap";
import CampgroundEditModal from "../modals/CampgroundEditModal";
import { useForm } from "react-hook-form";
import '../styles/starts.css';

interface ReviewProp {
    rating: number;
    body: string;
}

const CampView = () => {
    const { id } = useParams() as { id: string };
    const [campground, setCampground] = useState<Campground>();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewProp>({
        defaultValues: {
            rating: 5,
            body: ""
        }
    })

    useEffect(() => {
        const fetchCamp = () => {
            getCampground(id)
                .then(res => setCampground(res.data.campground))
                .catch(err => {
                    console.log(err.response);
                    navigate('/campgrounds')
                });
        }
        fetchCamp();
    }, [navigate, id]);

    const onSubmit = (data: ReviewProp) => {
        createReview(id, data)
            .then(res => {
                setCampground(res.data.campground);
                reset();
            })
    };

    const handleDeleteReview = (reviewId: string) => {
        deleteReview(id, reviewId)
            .then(res => {
                setCampground(res.data.campground);
                reset();
            })
            .catch(e => console.log(e)) //Make something happpen when an error accure
    };

    const handleDeleteCamp = () => {
        deleteCampground(id).then((res) => {
            console.log(res);
            navigate('/campgrounds')
        }).catch(e => console.log(e))

    }

    return (
        campground ?
            <div className="row my-3">
                <div className="col-12 col-md-3 mb-2">
                    <CampMap campground={campground} />
                </div>
                <div className="col-12 col-md-6">
                    <div className="card">
                        <div className="row">
                            <div id="campgroundCarousel" className="carousel slide">
                                <div className="carousel-inner">
                                    {campground?.images.map((img, i) =>
                                        <div key={img._id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                                            <img src={img.url} style={{ height: 300 }} className="rounded-top object-fit-fill w-100" alt="" />
                                        </div>
                                    )}
                                </div>
                                {campground.images.length > 1 &&
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel"
                                            data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel"
                                            data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                }
                            </div>
                            <div className="card-body">
                                <h3 className="card-title ps-2">
                                    {campground.title}
                                </h3>
                                <p className="card-text ps-2">
                                    {campground.description}
                                </p>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item fw-medium text-secondary">
                                        {campground.location}
                                    </li>
                                    <li className="list-group-item">
                                        ${campground.price}/night
                                    </li>
                                    <li className="list-group-item">
                                        Submitted by {campground.author.username} <br />
                                        <small className="text-secondary">{campground.updatedAt}</small>
                                    </li>
                                    <li className="list-group-item">

                                    </li>
                                </ul>
                                {currentUser && currentUser._id === campground.author._id &&
                                    <div className="ps-2">
                                        <button type="button" className="btn btn-info" onClick={() => setShow(true)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger ms-2" onClick={handleDeleteCamp}>Delete</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 col-12 mt-md-0 mt-2">
                    {currentUser &&
                        <>
                            <h2>Leave a Review</h2>
                            <form className="needs-validation mb-2" onSubmit={handleSubmit(onSubmit)}>
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
                    {campground.reviews?.length > 0 ? (
                        campground.reviews.map(review => (
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
                <CampgroundEditModal
                    show={show}
                    onClose={() => setShow(false)}
                    campground={campground}
                    onUpdate={(updatedCamp: Campground) => setCampground(updatedCamp)} />
            </div >
            :
            <div>
                No Camp found
            </div>
    )
}

export default CampView