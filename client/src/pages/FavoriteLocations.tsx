import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FavoriteLocations = () => {
    const [favorites, setFavorites] = useState<DateLocation[]>([]);

    useEffect(() => {
        getFavoriteLocations()
            .then(res => setFavorites(res.data.favorites))
            .catch(err => {
                toast.error(err.response.data)
            })
    }, [])

    return (
        favorites.length > 0 ?
            favorites.map(location =>
                <div key={location.id} className="card my-3">
                    <div className="row">
                        <div className="col-12 col-md-3">
                            <img className="img-fluid rounded-top rounded w-100 h-100 object-fit-cover" src={location.images[0].url}
                                alt="location image" />
                        </div>
                        <div className="card-body col-md-9">
                            <div className="row">
                                <div className="col-12 mb-0">
                                    <span className="row">
                                        <h3 className="col-9">{location.title}</h3>
                                    </span>
                                </div>
                                <span className="col-12 text-secondary">
                                    {location.address}
                                </span>
                                <p className="col-12 card-text mb-0">
                                    {location.description}
                                </p>
                                <p className="mt-2">Categories: {<span>{location.categories.join(', ')}</span>}</p>
                                <div className="col d-flex justify-content-start align-items-end">
                                    <Link className="btn btn-danger" to={`/location/${location.id}`}>
                                        View {location.title}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            :
            <p className="text-center mt-3 fw-semibold fs-3">You have no locations saved as favorites</p>

    )
}

export default FavoriteLocations