import { useEffect, useState } from "react"
import { getUserLocations } from "../services/locationService"
import { DateLocation } from "../models/DateLocation"
import PageSelector from "../components/PageSelector"
import { toast } from "react-toastify"
import { CardsLoader } from "../components/Loaders"
import RenderedLocations from "../components/RenderedLocations"

const UserLocations = () => {
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewAmount, setViewAmount] = useState(0);
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });

    useEffect(() => {
        setIsLoading(true);
        getUserLocations()
            .then(res => {
                setLocations(res.data.locations);
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
            .catch((err) => toast.error(err.response.data))
            .finally(() => setIsLoading(false));
    }, [viewAmount])

    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={viewAmount} />
                :
                locations.length > 0 ?
                    <>
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
                    <p className="text-center mt-3 fw-semibold fs-3">You have not posted any locations yet</p>
            }
        </main>

    )
}

export default UserLocations