import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import PageSelector from "../components/PageSelector";
import { CardsLoader } from "../components/Loaders";
import RenderedLocations from "../components/RenderedLocations";

const FavoriteLocations = () => {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState<DateLocation[]>([]);
    const [viewAmount, setViewAmount] = useState(0);
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getFavoriteLocations()
            .then(res => {
                setFavorites(res.data.favorites);
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
                toast.error(err.response.data)
            }).finally(() => {
                setIsLoading(false);
            });
    }, [viewAmount, currentUser])

    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={viewAmount} />
                :
                favorites.length > 0 ?
                    <>
                        <RenderedLocations
                            locations={favorites}
                            startIndex={listBounds.start}
                            endIndex={listBounds.end} />

                        <PageSelector
                            pagesAmount={pages}
                            onChange={(activePage) => setListBounds({ start: viewAmount * (activePage - 1), end: viewAmount * activePage })}
                        />
                    </>
                    :
                    <h1 className="text-center mt-3">You have no locations saved as favorites</h1>
            }

        </main>
    )
}

export default FavoriteLocations