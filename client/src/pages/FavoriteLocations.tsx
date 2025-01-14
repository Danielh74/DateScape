import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import LocationCard from "../components/LocationCard";
import useAuth from "../hooks/useAuth";
import PageSelector from "../components/PageSelector";
import Loader from "../components/Loader";

const FavoriteLocations = () => {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState<DateLocation[]>([]);
    const [viewAmount, setViewAmount] = useState(0);
    const [pages, setPages] = useState({ active: 1, amount: 0 });
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getFavoriteLocations()
            .then(res => {
                setFavorites(res.data.favorites);
                setViewAmount(res.data.limit);
                setPages(prev => ({ ...prev, amount: res.data.pages }));

                const currentPage = sessionStorage.getItem('activePage');
                if (currentPage) {
                    const currentPageNum = parseInt(currentPage);
                    setListBounds({ start: (currentPageNum - 1) * viewAmount, end: currentPageNum * viewAmount });
                } else {
                    setListBounds({ start: 0, end: res.data.limit });
                }
            })
            .catch(err => {
                toast.error(err.response.data)
            }).finally(() => {
                setIsLoading(false);
            });
    }, [viewAmount, currentUser])

    return (
        <div className="position-relative min-vh-100">
            {isLoading ? <Loader />
                :
                favorites.length > 0 ?
                    <>
                        {favorites.slice(listBounds.start, listBounds.end).map(location =>
                            <LocationCard key={location.id} location={location} />
                        )}
                        <PageSelector
                            pagesAmount={pages.amount}
                            onChange={(activePage) => setListBounds({ start: viewAmount * (activePage - 1), end: viewAmount * activePage })}
                        />
                    </>
                    :
                    <p className="text-center mt-3 fw-semibold fs-3">You have no locations saved as favorites</p>
            }

        </div>
    )
}

export default FavoriteLocations