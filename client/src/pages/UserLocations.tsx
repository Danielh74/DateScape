import { useEffect, useState } from "react";
import { getUserLocations } from "../services/locationService";
import { DateLocation } from "../models/DateLocation";
import { toast } from "react-toastify";
import { CardsLoader } from "../components/Loaders";
import LocationCreateModal from "../modals/LocationCreateModal";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { VIEW_AMOUNT } from "../utils/constantVars";
import Pagination from "@mui/material/Pagination";
import LocationCard from "../components/LocationCard";

const UserLocations = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pages, setPages] = useState(0);
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(
        Number(sessionStorage.getItem('activeUserPage')) || 1
    );

    useEffect(() => {
        setIsLoading(true);
        getUserLocations()
            .then(res => {
                const list: DateLocation[] = res.data.locations.map(
                    (location: DateLocation) => ({
                        ...location,
                        updatedAt: new Date(location.updatedAt)
                    })
                );
                setLocations(list);
                setPages(res.data.pagination.totalPages);
            }).catch((err) => {
                toast.error(err.response.data)
            }).finally(() => {
                setIsLoading(false)
            });
    }, [currentUser]);

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
        sessionStorage.setItem('activeUserPage', String(value));
    };


    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={VIEW_AMOUNT} />
                :
                <>
                    <button className="btn btn-danger rounded-5 fw-medium mt-3" onClick={() => setShow(true)}>
                        {t('create_location')}
                    </button>
                    {locations.length > 0 ?
                        <>
                            <div className="row">
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
                        <p className="text-center mt-3 fw-semibold fs-3">{t('no_location_posted')}</p>}
                </>
            }

            <LocationCreateModal
                show={show}
                onClose={() => setShow(false)} />
        </main>
    )
};

export default UserLocations;