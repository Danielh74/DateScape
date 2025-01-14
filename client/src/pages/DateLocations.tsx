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
    const { currentUser, updateUser } = useAuth();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>(['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic']);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewAmount, setViewAmount] = useState(0);
    const [pages, setPages] = useState({ active: 1, amount: 0 });
    const [listBounds, setListBounds] = useState({ start: 0, end: viewAmount });

    useEffect(() => {
        const fetchLocations = () => {
            setIsLoading(true);
            getLocations(locationName.state, selectedCategories.join(','))
                .then(res => {
                    const list: DateLocation[] = res.data.locations;
                    const orderedList = list.sort((a, b) => a.averageRating - b.averageRating).reverse();
                    setLocations(orderedList);
                    setViewAmount(res.data.limit);
                    setPages(prev => ({ ...prev, amount: res.data.pages }));
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
            setPages(prev => ({ ...prev, active: currentPageNum }));
            setListBounds({ start: (currentPageNum - 1) * viewAmount, end: currentPageNum * viewAmount });
        }

    }, [locationName, selectedCategories, viewAmount])

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
        if (action === 'increment' && pages.active < pages.amount) {
            setListBounds(prev => ({ start: prev.start + viewAmount, end: prev.end + viewAmount }));
            setPages({ ...pages, active: pages.active + 1 });
            sessionStorage.setItem('activePage', (pages.active + 1).toString());
        } else if (action === 'decrement' && pages.active > 1) {
            setListBounds(prev => ({ start: prev.start - viewAmount, end: prev.end - viewAmount }));
            setPages({ ...pages, active: pages.active - 1 });
            sessionStorage.setItem('activePage', (pages.active - 1).toString());
        } else if (action === 'random') {
            setListBounds({ start: (index) * viewAmount, end: (index + 1) * viewAmount });
            setPages({ ...pages, active: index + 1 });
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
                    <div className="row ">
                        {locations.slice(listBounds.start, listBounds.end).map(location =>
                            <div key={location.id} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2 my-2">
                                <div className="border rounded shadow">
                                    <img src={location.images[0].url} className="card-img-top rounded-top" alt="location image" />
                                    <div className="card-body p-2">
                                        <p className="card-title d-flex justify-content-between">
                                            <h5 className="">
                                                {location.title}

                                            </h5>
                                            <span className="">
                                                {location.averageRating} ★
                                            </span>
                                        </p>
                                        <p className="card-text m-0">
                                            <span className="text-muted d-block">
                                                {location.address}
                                            </span>
                                            <span className="d-inline-block my-2 fw-semibold ">
                                                ${location.price}
                                            </span>
                                            <span className="d-block">Categories: {<span>{location.categories.join(', ')}</span>}</span>

                                        </p>
                                        <div className="row justify-content-between align-items-end">
                                            <Link className="col-6 mx-2 btn btn-danger" to={`/location/${location.id}`}>
                                                View Location
                                            </Link>
                                            <button className="btn col-2 fs-1 p-0" onClick={() => handleUpdateFavLocation({ locationId: location.id })}>
                                                {currentUser?.favLocations?.some(fav => fav === location.id) ? <IoHeartSharp className="text-danger" /> : <IoHeartOutline />}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-center">
                        <button className="btn border-0" disabled={pages.active === 1} onClick={() => handleChangePage('decrement')}>prev</button>
                        {locations.slice(0, pages.amount).map((_, index) =>
                            <button
                                key={index}
                                className={`btn col mx-3 p-0 ${pages.active === index + 1 && 'fw-bold'}`}
                                onClick={() => { handleChangePage('random', index) }}>
                                {index + 1}
                            </button>
                        )}
                        <button className="btn border-0" disabled={pages.active === pages.amount} onClick={() => handleChangePage('increment')}>next</button>
                    </p>
                </>
                :
                <p className="fw-bold fs-2 align-items-center text-center mt-3">No Locations To Show...&#x1F494;</p>}
        </div>
    )
}

export default DateLocations