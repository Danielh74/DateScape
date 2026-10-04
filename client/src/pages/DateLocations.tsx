import { ChangeEvent, useEffect, useState } from "react"
import { DateLocation } from "../models/DateLocation";
import { useLocation } from "react-router-dom";
import { getLocations } from "../services/locationService";
import ClusterMap from '../components/ClusterMap';
import { toast } from 'react-toastify';
import { CardsLoader } from "../components/Loaders";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import LocationCard from "../components/LocationCard";
import Pagination from "@mui/material/Pagination";
import { CATEGORY_LIST, VIEW_AMOUNT } from "../utils/constantVars";

const DateLocations = () => {
    const locationName = useLocation();
    const { t } = useTranslation();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [orderedBy, setOrderedBy] = useState("newest");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([...CATEGORY_LIST]);
    const [isLoading, setIsLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(
        Number(sessionStorage.getItem('activeMainPage')) || 1
    );

    useEffect(() => {
        setIsLoading(true);

        const categoriesToSend =
            selectedCategories.length === CATEGORY_LIST.length
                ? []
                : selectedCategories;

        getLocations(
            String(currentPage),
            locationName.state,
            orderedBy,
            categoriesToSend
        ).then(res => {
            const list: DateLocation[] = res.data.locations.map(
                (location: DateLocation) => ({
                    ...location,
                    updatedAt: new Date(location.updatedAt)
                })
            );

            setLocations(list);
            setPages(res.data.pagination.totalPages);
            if (locationName.state) {
                setCurrentPage(1);
            }
        }).catch(err => {
            toast.error(err.message);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [currentPage, locationName.state, orderedBy, selectedCategories]);

    const handlePickCategory = (category: string) => {
        const isSelected = selectedCategories.includes(category);

        let updatedCategories = isSelected
            ? selectedCategories.length === CATEGORY_LIST.length
                ? [category]
                : selectedCategories.filter(val => val !== category)
            : [...selectedCategories, category];

        if (updatedCategories.length === 0)
            updatedCategories = CATEGORY_LIST;

        setSelectedCategories(updatedCategories);

        setCurrentPage(1);
        sessionStorage.setItem('activeMainPage', "1");
    };

    const handleSelectOrder = (e: ChangeEvent<HTMLSelectElement>) => {
        const order = e.target.value;
        setOrderedBy(order);
        setCurrentPage(1);
        sessionStorage.setItem('activeMainPage', "1");
    };

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
        sessionStorage.setItem('activeMainPage', String(value));
    };

    return (
        <main className="position-relative min-vh-100">
            {isLoading ?
                <>
                    <Skeleton variant="rectangular" height={300} sx={{ my: 3 }} />
                    <CardsLoader amount={VIEW_AMOUNT} />
                </>
                :
                locations.length > 0 ?
                    <>
                        <ClusterMap locations={locations} />
                        <div className="mt-3 d-flex justify-content-between">
                            <div className="d-md-inline d-none">
                                {CATEGORY_LIST.map(category =>
                                    <button
                                        key={category}
                                        onClick={() => handlePickCategory(category)}
                                        className={`btn ${selectedCategories.includes(category)
                                            ? "btn-danger"
                                            : "btn-outline-danger"
                                            } me-2 fw-medium rounded-5`}>
                                        {t(category)}
                                    </button>
                                )}
                            </div>

                            <div className="dropdown d-md-none">
                                <button className="btn btn-danger rounded-5 fw-medium dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {t('categories')}
                                </button>
                                <ul className="dropdown-menu">
                                    {CATEGORY_LIST.map(category =>
                                        <div className="dropdown-item" key={category}>
                                            <input
                                                type="checkbox"
                                                value={category}
                                                id={category}
                                                onChange={() => handlePickCategory(category)}
                                                checked={selectedCategories.includes(category)} />
                                            <label className="ms-1 fw-medium" htmlFor={category}>{t(category)}</label>
                                        </div>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <select className="form-select rounded-5 border-2 border-danger focus-ring focus-ring-danger" value={orderedBy} onChange={handleSelectOrder}>
                                    <option value="" disabled>{t('select_order')}</option>
                                    <option value="rating">{t('rating')}</option>
                                    <option value="newest">{t('newest')}</option>
                                </select>
                            </div>

                        </div>

                        <div className="row ">
                            {locations.map(location =>
                                <LocationCard key={location.id} location={location} />
                            )}
                        </div>

                        <footer className="d-flex justify-content-center mb-2" style={{ direction: "ltr" }}>
                            <Pagination
                                count={pages}
                                page={currentPage}
                                showFirstButton
                                showLastButton
                                onChange={handlePageChange} />
                        </footer>
                    </>
                    :
                    <h1 className="fw-bold align-items-center text-center mt-3">{t('no_locations')}...&#x1F494;</h1>
            }
        </main>
    )
}

export default DateLocations