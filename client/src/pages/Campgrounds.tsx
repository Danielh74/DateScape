import { useEffect, useState } from "react"
import { Campground } from "../models/Campground";
import { Link, useLocation } from "react-router-dom";
import { getAllCampgrounds } from "../services/campgroundService";
import ClusterMap from '../components/ClusterMap';

const Campgrounds = () => {
    const [camps, setCamps] = useState<Campground[]>([]);
    const location = useLocation();
    useEffect(() => {
        getAllCampgrounds(location.state)
            .then(res => {
                console.log(res)
                setCamps(res.data.campgrounds);
            })
            .catch(e => {
                console.log(e);
            });
    }, [location])

    return (
        <div>
            <ClusterMap campgrounds={camps} />
            {camps.length > 0 ? camps.map(camp =>
                <div key={camp.id} className="card my-3">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <img className="img-fluid rounded-top rounded h-100  w-100" src={camp.images[0].url}
                                alt="camp image" />
                        </div>
                        <div className="card-body col-md-8">
                            <div className="row h-100">
                                <div className="col-12 mb-0">
                                    <span className="row">
                                        <h3 className="col-9">{camp.title}</h3>
                                        <span className="col d-flex justify-content-md-end">
                                            <span className="me-1 align-self-center">{`(${camp.reviews.length})`}</span>
                                            <p className="d-inline starability-result" data-rating={camp.averageRating}>
                                                Rated: {camp.averageRating} stars
                                            </p>
                                        </span>
                                    </span>
                                </div>
                                <span className="col-12 text-secondary">
                                    {camp.location}
                                </span>
                                <p className="col-12 card-text mb-0">
                                    {camp.description}
                                </p>
                                <div className="col d-flex justify-content-start align-items-end">
                                    <Link className="btn btn-danger" to={`/campground/${camp.id}`}>
                                        View {camp.title}
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) :
                <p>No Campgrounds Available...</p>}
        </div>
    )
}

export default Campgrounds