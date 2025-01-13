import { ChangeEvent, useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { Link, useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import { updateFavLocation } from "../services/authService";
import Loader from "../components/Loader";

type updateProp = {
    locationId: string
}

const DateLocations = () => {
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>(['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic']);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const locationName = useLocation();

    useEffect(() => {
        setIsLoading(true);
        getLocations(locationName.state, selectedCategories.join(','))
            .then(res => {
                setLocations(res.data.locations);
            })
            .catch(err => {
                toast.error(err.message);
            }).finally(() => {
                setIsLoading(false);
            });
    }, [locationName, selectedCategories])

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        if (checked) {
            setFilteredCategories([...filteredCategories, value]);
        } else {
            setFilteredCategories(prev => prev.filter(val => val !== value));
        }
    };

    const handleUpdateFavLocation = (locationId: updateProp) => {
        updateFavLocation(locationId).then(res => console.log(res))
    }

    return (
        <div className="position-relative min-vh-100">
            {isLoading && <Loader />}
            {locations.length > 0 ?
                <>
                    <ClusterMap locations={locations} />
                    <button className="btn btn-outline-dark mt-3" onClick={() => setShowFilter(prev => !prev)}>Filter By Category</button>
                    {showFilter && <div className="mt-3">
                        {categoryList.map((category, index) =>
                            <span key={`category-${index}`} className='ms-2'>
                                <input className={'form-check-input'} type="checkbox" checked={filteredCategories.some(val => val === category)} value={category} onChange={handleCheck} id={category} />
                                <label className="form-check-label ms-1" htmlFor={category}>{category}</label>
                            </span>
                        )}
                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setSelectedCategories([...filteredCategories]); setShowFilter(false) }}>Set Filter</button>
                    </div>}
                    {locations.map(location =>
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
                                        <p className="mt-2">Categories: {<span>{location.categories.join(', ')}</span>}</p>
                                        <button onClick={() => handleUpdateFavLocation({ locationId: location.id })}>fav</button>
                                        <div className="col d-flex justify-content-start align-items-end">
                                            <Link className="btn btn-danger" to={`/location/${location.id}`}>
                                                View {location.title}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                :
                <p>No Locations To Show...</p>}
        </div>
    )
}

export default DateLocations