import { useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import PageSelector from "../components/PageSelector";
import RenderedLocations from "../components/RenderedLocations";
import { CardsLoader } from "../components/Loaders";
import Skeleton from "@mui/material/Skeleton";

const DateLocations = () => {
    const categoryList = ['Outdoor', 'Food', 'Culture', 'Fun', 'Active', 'Romantic'];
    const locationName = useLocation();
    const [locations, setLocations] = useState<DateLocation[]>([]);
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

    const handlePickCategory = (category: string) => {
        let tempCategories = [];
        if (selectedCategories.some(val => val === category)) {
            setSelectedCategories(prev => prev.filter(val => val !== category));
        } else {
            tempCategories = [...selectedCategories, category];
            if (tempCategories.length === categoryList.length) {
                setSelectedCategories([]);
            } else {
                setSelectedCategories(tempCategories);
            }
        }
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
                        <ClusterMap locations={locations} />
                        <div className="mt-3 d-flex">
                            {categoryList.map(category =>
                                <button
                                    key={category}
                                    onClick={() => handlePickCategory(category)}
                                    className={`btn ${selectedCategories.some(val => val === category) || selectedCategories.length === 0 ? "btn-danger" : "btn-outline-secondary"} me-2 fw-semibold rounded-5`}>
                                    {category}
                                </button>
                            )}
                        </div>

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
                    <h1 className="fw-bold align-items-center text-center mt-3">No Locations To Show...&#x1F494;</h1>
            }
        </main>
    )
}

export default DateLocations