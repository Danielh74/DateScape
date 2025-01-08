import { useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { Link, useLocation } from "react-router-dom";
import { getAllLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';

const DateLocations = () => {
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const locationName = useLocation();
    useEffect(() => {
        getAllLocations(locationName.state)
            .then(res => {
                console.log(res)
                setLocations(res.data.locations);
            })
            .catch(err => {
                toast.error(err.message);
            });
    }, [locationName])

    return (
        <div>
            <ClusterMap locations={locations} />
            {locations.length > 0 ? locations.map(location =>
                <div key={location.id} className="card my-3">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <img className="img-fluid rounded-top rounded h-100  w-100" src={location.images[0].url}
                                alt="location image" />
                        </div>
                        <div className="card-body col-md-8">
                            <div className="row h-100">
                                <div className="col-12 mb-0">
                                    <span className="row">
                                        <h3 className="col-9">{location.title}</h3>
                                        <span className="col d-flex justify-content-md-end">
                                            <span className="me-1 align-self-center">{`(${location.reviews.length})`}</span>
                                            <p className="d-inline starability-result" data-rating={location.averageRating}>
                                                Rated: {location.averageRating} stars
                                            </p>
                                        </span>
                                    </span>
                                </div>
                                <span className="col-12 text-secondary">
                                    {location.address}
                                </span>
                                <p className="col-12 card-text mb-0">
                                    {location.description}
                                </p>
                                <div className="col d-flex justify-content-start align-items-end">
                                    <Link className="btn btn-danger" to={`/location/${location.id}`}>
                                        View {location.title}
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) :
                <p>No Locations Available...</p>}

        </div>
    )
}

export default DateLocations