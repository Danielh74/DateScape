import { ChangeEvent, useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { Link, useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import { updateFavLocation } from "../services/authService";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

type updateProp = {
    locationId: string
}

const DateLocations = () => {
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const locationName = useLocation();
    const viewNum = 10;
    const { currentUser, updateUser } = useAuth();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>(['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic']);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState<number>(1);
    const [pagination, setPagination] = useState({ start: 0, end: viewNum });

    useEffect(() => {
        const fetchLocations = () => {
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
        }
        fetchLocations();

        const currentPage = sessionStorage.getItem('activePage');
        if (currentPage) {
            const currentPageNum = parseInt(currentPage);
            setActivePage(currentPageNum);
            setPagination({ start: (currentPageNum - 1) * viewNum, end: currentPageNum * viewNum });
        }

    }, [locationName, selectedCategories, activePage])

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        if (checked) {
            setFilteredCategories([...filteredCategories, value]);
        } else {
            setFilteredCategories(prev => prev.filter(val => val !== value));
        }
    };

    const handleUpdateFavLocation = (locationId: updateProp) => {
        setIsLoading(true);
        updateFavLocation(locationId)
            .then(res => {
                updateUser(res.data.user);
            })
            .catch(err => toast.error(err.response.data))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleChangePage = (action: string, index = 0) => {
        if (action === 'increment') {
            setPagination(prev => ({ start: prev.start + viewNum, end: prev.end + viewNum }));
            setActivePage(prev => prev + 1);
            sessionStorage.setItem('activePage', (activePage + 1).toString());
        } else if (action === 'decrement') {
            setPagination(prev => ({ start: prev.start - viewNum, end: prev.end - viewNum }));
            setActivePage(prev => prev - 1);
            sessionStorage.setItem('activePage', (activePage - 1).toString());
        } else if (action === 'random') {
            setPagination({ start: (index) * viewNum, end: (index + 1) * viewNum });
            setActivePage(index + 1);
            sessionStorage.setItem('activePage', (index + 1).toString())
        }
    };

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
                    {locations.slice(pagination.start, pagination.end).map(location =>
                        <div key={location.id} className="card my-3">
                            <div className="row g-0">
                                <div className="col-12 col-md-3">
                                    <img className="img-fluid rounded-top rounded w-100 h-100 object-fit-cover" src={location.images[0].url}
                                        alt="location image" />
                                </div>
                                <div className="card-body d-flex col-md-9">
                                    <div className="row">
                                        <div className="col-12 mb-0">
                                            <span className="row">
                                                <h3 className="col-12 col-md-7">{location.title}</h3>
                                                <span className="col d-flex justify-content-md-end">
                                                    <span className="me-1 align-self-center">{`(${location.reviews.length})`}</span>
                                                    <p className="d-inline starability-result" data-rating={location.averageRating}>
                                                        Rated: {location.averageRating} stars
                                                    </p>
                                                </span>
                                            </span>
                                        </div>
                                        <span className="col-12 text-muted">
                                            {location.address}
                                        </span>
                                        <p className="col-12 card-text mb-0">
                                            {location.description}
                                        </p>
                                        <p className="mt-2">Categories: {<span>{location.categories.join(', ')}</span>}</p>
                                        <div className="col d-flex justify-content-between align-items-center">
                                            <Link className="btn btn-danger" to={`/location/${location.id}`}>
                                                View {location.title}
                                            </Link>
                                            <button className="btn fs-1 p-0" onClick={() => handleUpdateFavLocation({ locationId: location.id })}>
                                                {currentUser?.favLocations.some(fav => fav === location.id) ? <IoHeartSharp className="text-danger" /> : <IoHeartOutline />}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-center">
                        <button className="btn" onClick={() => handleChangePage('decrement')}>prev</button>
                        {locations.slice(0, Math.ceil(locations.length / viewNum)).map((_, index) =>
                            <button
                                className={`btn col mx-3 p-0 ${activePage === index + 1 && 'fw-bold'}`}
                                onClick={() => { handleChangePage('random', index) }}>
                                {index + 1}
                            </button>
                        )}
                        <button className="btn" onClick={() => handleChangePage('increment')}>next</button>
                    </p>
                </>
                :
                <p className="fw-bold fs-2 align-items-center text-center mt-3">No Locations To Show...&#x1F494;</p>}
        </div>
    )
}

export default DateLocations