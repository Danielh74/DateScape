import axios from "axios";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Campground } from "../models/Campground";

const CampView = () => {
    const { id } = useParams();
    const [campground, setCampground] = useState<Campground>();

    useEffect(() => {
        const fetchCamp = () => {
            axios.get(`http://localhost:8080/api/campgrounds/${id}`)
                .then(res => setCampground(res.data.campground));
        }
        fetchCamp();
    }, [id])

    const showData = (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const form = e.target;

        if (form.checkValidity()) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log('Form submitted successfully:', data);
        } else {
            form.classList.add('was-validated');
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
                    {/* <% if (currentUser && currentUser._id.equals(campground.author._id)) { %> */}
                    <div className="card-body">
                        <a href="/campgrounds/<%=campground._id%>/edit" className="btn btn-info">Edit</a>
                        <form className="d-inline" action="/campgrounds/<%=campground._id%>?_method=DELETE" method="post">
                            <button className="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-3">
                {/* <% if (currentUser) { %> */}
                <h2>Leave a Review</h2>
                <form className="needs-validation mb-2" onSubmit={(e) => { showData(e) }} noValidate>
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
                            {/* (currentUser && currentUser._id.equals(review.author._id))  */}
                            <form>
                                <button className="btn btn-sm btn-danger">Delete</button>
                            </form>

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