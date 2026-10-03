import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { CardsLoader } from "../components/Loaders";
import { useTranslation } from "react-i18next";
import LocationCard from "../components/LocationCard";
import Pagination from "@mui/material/Pagination";
import { VIEW_AMOUNT } from "../utils/constantVars";

const FavoriteLocations = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [favorites, setFavorites] = useState<DateLocation[]>([]);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(
        Number(sessionStorage.getItem('activeFavPage')) || 1
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getFavoriteLocations()
            .then(res => {
                const list: DateLocation[] = res.data.favorites.map(
                    (location: DateLocation) => ({
                        ...location,
                        updatedAt: new Date(location.updatedAt)
                    })
                );
                setFavorites(list);
                setPages(res.data.pagination.totalPages);
            })
            .catch(err => {
                toast.error(err.response.data)
            }).finally(() => {
                setIsLoading(false);
            });
    }, [currentUser])

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
        sessionStorage.setItem('activeFavPage', String(value));
    };

    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={VIEW_AMOUNT} />
                :
                favorites?.length > 0 ?
                    <>
                        <div className="row">
                            {favorites.map(location =>
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
                    <h1 className="text-center mt-3">{t('no_favorites')}</h1>
            }

        </main>
    )
}

export default FavoriteLocations