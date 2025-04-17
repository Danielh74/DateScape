import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import PageSelector from "../components/PageSelector";
import { CardsLoader } from "../components/Loaders";
import RenderedLocations from "../components/RenderedLocations";
import { listBoundsCalc } from "../utils/listBoundsCalc";

const FavoriteLocations = () => {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState<DateLocation[]>([]);
    const viewAmount = 12;
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getFavoriteLocations()
            .then(res => {
                const list: DateLocation[] = res.data.favorites;
                setFavorites(list);
                const pagesNum = Math.ceil(list.length / viewAmount)
                setPages(pagesNum);
                setListBounds(listBoundsCalc(viewAmount));
            })
            .catch(err => {
                toast.error(err.response.data)
            }).finally(() => {
                setIsLoading(false);
            });
    }, [currentUser])

    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={viewAmount} />
                :
                favorites?.length > 0 ?
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