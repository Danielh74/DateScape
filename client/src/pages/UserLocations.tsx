import { useEffect, useState } from "react"
import { getUserLocations } from "../services/locationService"
import { DateLocation } from "../models/DateLocation"
import PageSelector from "../components/PageSelector"
import { toast } from "react-toastify"
import { CardsLoader } from "../components/Loaders"
import RenderedLocations from "../components/RenderedLocations"
import LocationCreateModal from "../modals/LocationCreateModal"
import useAuth from "../hooks/useAuth"
import { listBoundsCalc } from "../utils/listBoundsCalc"

const UserLocations = () => {
    const { currentUser } = useAuth();
    const [locations, setLocations] = useState<DateLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const viewAmount = 12;
    const [pages, setPages] = useState(0);
    const [listBounds, setListBounds] = useState({ start: 0, end: 0 });
    const [show, setShow] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getUserLocations()
            .then(res => {
                const list: DateLocation[] = res.data.locations;
                setLocations(list);
                const pagesNum = Math.ceil(list.length / viewAmount)
                setPages(pagesNum);
                setListBounds(listBoundsCalc(viewAmount));
            })
            .catch((err) => toast.error(err.response.data))
            .finally(() => setIsLoading(false));
    }, [currentUser])

    return (
        <main className="position-relative min-vh-100">
            {isLoading ? <CardsLoader amount={viewAmount} />
                :
                <>
                    <button className="btn btn-danger rounded-5 fw-medium mt-3" onClick={() => setShow(true)}>
                        Create New Location
                    </button>
                    {locations.length > 0 ?
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
                        <p className="text-center mt-3 fw-semibold fs-3">You have not posted any locations yet</p>}
                </>
            }

            <LocationCreateModal
                show={show}
                onClose={() => setShow(false)} />
        </main>
    )
};

export default UserLocations