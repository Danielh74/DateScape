import { ChangeEvent, useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import PageSelector from "../components/PageSelector";
import RenderedLocations from "../components/RenderedLocations";

const DateLocations = () => {
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const locationName = useLocation();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>(['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic']);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewAmount, setViewAmount] = useState(0);
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });

    useEffect(() => {
        const fetchLocations = () => {
            setIsLoading(true);
            getLocations(locationName.state, selectedCategories.join(','))
                .then(res => {
                    const list: DateLocation[] = res.data.locations;
                    const orderedList = list.sort((a, b) => a.averageRating - b.averageRating).reverse();
                    setLocations(orderedList);
                    setViewAmount(res.data.limit);
                    setPages(res.data.pages);

                    const currentPage = sessionStorage.getItem('activePage');
                    if (currentPage) {
                        const currentPageNum = parseInt(currentPage);
                        setListBounds({ start: (currentPageNum - 1) * viewAmount, end: currentPageNum * viewAmount });
                    } else {
                        setListBounds({ start: 0, end: res.data.limit });
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                }).finally(() => {

                    setIsLoading(false);
                });
        }
        fetchLocations();

    }, [locationName, selectedCategories, viewAmount])

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        if (checked) {
            setFilteredCategories([...filteredCategories, value]);
        } else {
            setFilteredCategories(prev => prev.filter(val => val !== value));
        }
    };

    return (
        <div className="position-relative min-vh-100">
            {isLoading ? <Loader />
                :
                locations.length > 0 ?
                    <>
                        <ClusterMap locations={locations} />
                        <button className="btn btn-outline-dark mt-3" onClick={() => setShowFilter(prev => !prev)}>Filter By Category</button>
                        {showFilter &&
                            <div className="mt-3">
                                {categoryList.map((category, index) =>
                                    <span key={`category-${index}`} className='ms-2'>
                                        <input className={'form-check-input'} type="checkbox" checked={filteredCategories.some(val => val === category)} value={category} onChange={handleCheck} id={category} />
                                        <label className="form-check-label ms-1" htmlFor={category}>{category}</label>
                                    </span>
                                )}
                                <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setSelectedCategories([...filteredCategories]); setShowFilter(false) }}>Set Filter</button>
                            </div>}

                        <RenderedLocations
                            locations={locations}
                            startIndex={listBounds.start}
                            endIndex={listBounds.end} />

                        <PageSelector
                            pagesAmount={pages}
                            onChange={(activePage) => setListBounds({ start: viewAmount * (activePage - 1), end: viewAmount * activePage })}
                        />
                    </>
                    :
                    <p className="fw-bold fs-2 align-items-center text-center mt-3">No Locations To Show...&#x1F494;</p>
            }
        </div>
    )
}

export default DateLocations