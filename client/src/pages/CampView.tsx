import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Campground } from "../models/Campground";
import { reviewSrevice } from "../services/reviewService";
import { campgroundsService } from "../services/campgroundService";
import useAuth from "../hooks/useAuth";

interface ReviewProp {
    rating: number;
    body: string;
}

const CampView = () => {
    const { id } = useParams();
    const [campground, setCampground] = useState<Campground>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchCamp = () => {
            if (id) {
                campgroundsService.getCampground(id)
                    .then(res => setCampground(res.data.campground))
                    .catch(e => console.log(e));
            }
            //Make a component that pop up when the id is undefined
        }
        fetchCamp();
    }, [id]);

    const handleCreateReview = (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const form = e.target;
        if (form.checkValidity()) {
            const formData = new FormData(form);
            const review: ReviewProp = {
                rating: parseInt(formData.get('rating') as string, 10),
                body: formData.get('body') as string
            }
            reviewSrevice.createReview(id, review)
                .then(res => {
                    setCampground(res.data.campground);
                })
        } else {
            form.classList.add('was-validated');
        }
    };

    const handleDeleteReview = (reviewId: string) => {
        reviewSrevice.deleteReview(id, reviewId)
            .then(res => console.log(res))
            .catch(e => console.log(e)) //Make something happpen when an error accure
    };

    const handleEditCamp = () => {
        navigate(`edit`, { state: { campground } });
    }

    const handleDeleteCamp = () => {
        if (id && currentUser) {
            campgroundsService.deleteCampground(id, currentUser).then(() => {
                navigate('/campgrounds');
            })
        }

    }

    return (
        campground ? <div className="row my-3">
            <div id="map" className="col-4"></div>
            <div className="col-5">
                <div className="card">
                    <div id="campgroundCarousel" className="carousel slide">
                        <div className="carousel-inner">
                            {campground?.images.map(img =>
                                <div key={img._id} className="carousel-item active">
                                    <img src={img.url} className="rounded-top w-100" alt="" />
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
                        <h3 className="card-title">
                            {campground.title}
                        </h3>
                        <p className="card-text">
                            {campground.description}
                        </p>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-secondary">
                            {campground.location}
                        </li>
                        <li className="list-group-item">
                            ${campground.price}/night
                        </li>
                        <li className="list-group-item">
                            Submitted by {campground.author.username}
                        </li>
                    </ul>
                    {currentUser && currentUser._id === campground.author._id &&
                        <div className="card-body">
                            <button onClick={handleEditCamp} className="btn btn-info">Edit</button>
                            <form className="d-inline">
                                <button className="btn btn-danger" onClick={handleDeleteCamp}>Delete</button>
                            </form>
                        </div>
                    }
                </div>
            </div>

            <div className="col-3">
                {currentUser &&
                    <>
                        <h2>Leave a Review</h2>
                        <form className="needs-validation mb-2" onSubmit={(e) => { handleCreateReview(e) }} noValidate>
                            <div>
                                <fieldset className="starability-basic">
                                    <input type="radio" id="first-rate1" name="rating" value="1" />
                                    <label htmlFor="first-rate1" title="Terrible">1 star</label>
                                    <input type="radio" id="first-rate2" name="rating" value="2" />
                                    <label htmlFor="first-rate2" title="Not good">2 stars</label>
                                    <input type="radio" id="first-rate3" name="rating" value="3" />
                                    <label htmlFor="first-rate3" title="Average">3 stars</label>
                                    <input type="radio" id="first-rate4" name="rating" value="4" />
                                    <label htmlFor="first-rate4" title="Very good">4 stars</label>
                                    <input type="radio" id="first-rate5" name="rating" value="5" defaultChecked />
                                    <label htmlFor="first-rate5" title="Amazing">5 stars</label>
                                </fieldset>
                            </div>
                            <div className="mb-2">
                                <label className="form-label" htmlFor="body">Review</label>
                                <textarea className="form-control" name="body" id="body" required></textarea>
                                <div className="invalid-feedback">
                                    Can't send empty.
                                </div>
                            </div>
                            <button className="btn btn-success">Submit</button>
                        </form>
                    </>
                }
                {campground.reviews.map(review =>
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
                )

                }
            </div>
        </div >
            :
            <div>
                No Camp found
            </div>



    )
}

export default CampView