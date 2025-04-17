import { ChangeEvent, useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import PageSelector from "../components/PageSelector";
import RenderedLocations from "../components/RenderedLocations";
import { CardsLoader } from "../components/Loaders";
import Skeleton from "@mui/material/Skeleton";
import { listBoundsCalc } from "../utils/listBoundsCalc";
import locationsOrder from "../utils/locationsOrder";

const DateLocations = () => {
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const viewAmount = 12;
    const locationName = useLocation();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [viewLocations, setViewLocations] = useState<DateLocation[]>([]);
    const [orderedBy, setOrderedBy] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([...categoryList]);
    const [isLoading, setIsLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });

    useEffect(() => {
        const fetchLocations = () => {
            setIsLoading(true);
            getLocations(locationName.state)
                .then(res => {
                    const list: DateLocation[] = res.data.locations;
                    setLocations(list);
                    const orderedList = locationsOrder(list, orderedBy);
                    setViewLocations(orderedList);
                    const pagesNum = Math.ceil(list.length / viewAmount)
                    setPages(pagesNum);
                    setListBounds(listBoundsCalc(viewAmount));
                })
                .catch(err => {
                    toast.error(err.message);
                }).finally(() => {

                    setIsLoading(false);
                });
        }
        fetchLocations();

    }, [locationName])

    const handlePickCategory = (category: string) => {
        const isSelected = selectedCategories.includes(category);
        let updatedCategories = isSelected ?
            selectedCategories.length === categoryList.length ?
                [category]
                :
                selectedCategories.filter(val => val !== category)
            :
            [...selectedCategories, category];

        if (updatedCategories.length === 0) updatedCategories = categoryList;

        const updatedLocations = locations.filter(
            location => location.categories.some(
                category => updatedCategories.includes(category)
            )
        );

        const pagesNum = Math.ceil(updatedLocations.length / viewAmount);
        setViewLocations(updatedLocations);
        setPages(pagesNum);
        setSelectedCategories(updatedCategories);
    };

    const handleSelectOrder = (e: ChangeEvent<HTMLSelectElement>) => {
        const order = e.target.value;
        setOrderedBy(order);
        const orderedList = locationsOrder(viewLocations, order);
        setViewLocations(orderedList);
    };
    return (
        <main className="position-relative min-vh-100">
            {isLoading ?
                <>
                    <Skeleton variant="rectangular" height={300} sx={{ my: 3 }} />
                    <CardsLoader amount={viewAmount} />
                </>
                :
                locations.length > 0 ?
                    <>
                        <ClusterMap locations={viewLocations} />
                        <div className="mt-3 d-flex justify-content-between">
                            <div className="d-md-inline d-none">
                                {categoryList.map(category =>
                                    <button
                                        key={category}
                                        onClick={() => handlePickCategory(category)}
                                        className={`btn ${selectedCategories.some(val => val === category) || selectedCategories.length === 0 ? "btn-danger" : "btn-outline-danger"} me-2 fw-medium rounded-5`}>
                                        {category}
                                    </button>
                                )}
                            </div>

                            <div className="dropdown d-md-none">
                                <button className="btn btn-danger rounded-5 fw-medium dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </button>
                                <ul className="dropdown-menu">
                                    {categoryList.map(category =>
                                        <div className="dropdown-item">
                                            <input
                                                type="checkbox"
                                                value={category}
                                                key={category}
                                                id={category}
                                                onClick={() => handlePickCategory(category)}
                                                defaultChecked={selectedCategories.some(val => val === category) || selectedCategories.length === 0} />
                                            <label className="ms-1 fw-medium" htmlFor={category}>{category}</label>
                                        </div>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <select className="form-select rounded-5 border-2 border-danger focus-ring focus-ring-danger" onChange={handleSelectOrder}>
                                    <option value="" disabled>Select an order</option>
                                    <option value="Rating">Rating</option>
                                    <option value="Newest">Newest</option>
                                </select>
                            </div>

                        </div>

                        <RenderedLocations
                            locations={viewLocations}
                            startIndex={listBounds.start}
                            endIndex={listBounds.end} />

                        <PageSelector
                            pagesAmount={pages}
                            onChange={(activePage) => setListBounds({ start: viewAmount * (activePage - 1), end: viewAmount * activePage })}
                        />
                    </>
                    :
                    <h1 className="fw-bold align-items-center text-center mt-3">No Locations To Show...&#x1F494;</h1>
            }
        </main>
    )
}

export default DateLocations