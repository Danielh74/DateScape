import { useEffect, useState } from "react"
import { CampgroundList } from "../models/Campground";
import { Link, useLocation } from "react-router-dom";
import { getAllCampgrounds } from "../services/campgroundService";
import ClusterMap from '../components/ClusterMap';

const Campgrounds = () => {
    const [camps, setCamps] = useState<CampgroundList[]>([]);
    const location = useLocation();
    useEffect(() => {
        getAllCampgrounds(location.state)
            .then(res => {
                setCamps(res.data.campgrounds);
            })
            .catch(e => {
                console.log(e);
            });
    }, [location])

    return (
        <div>
            <ClusterMap campgrounds={camps} />
            {camps.length > 0 && camps.map(camp =>
                <div key={camp.id} className="card my-3">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <img className="img-fluid rounded-start" src={camp.images[0].url}
                                alt="camp image" />
                        </div>
                        <div className="card-body col-md-8">
                            <div className="row h-100">
                                <h3 className="col-12 mb-0">
                                    {camp.title}
                                </h3>
                                <span className="text-secondary col-12">
                                    {camp.location}
                                </span>
                                <p className="card-text mb-0 col-12">
                                    {camp.description}
                                </p>
                                <Link className="btn btn-primary col-4 align-self-end" to={`/campground/${camp.id}`}>
                                    View {camp.title}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Campgrounds