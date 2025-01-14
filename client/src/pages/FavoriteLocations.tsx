import { useEffect, useState } from "react";
import { DateLocation } from "../models/DateLocation";
import { getFavoriteLocations } from "../services/locationService";
import { toast } from "react-toastify";
import LocationCard from "../components/LocationCard";
import useAuth from "../hooks/useAuth";

const FavoriteLocations = () => {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState<DateLocation[]>([]);

    useEffect(() => {
        getFavoriteLocations()
            .then(res => setFavorites(res.data.favorites))
            .catch(err => {
                toast.error(err.response.data)
            })
    }, [currentUser])

    return (
        favorites.length > 0 ?
            favorites.map(location =>
                <LocationCard key={location.id} location={location} />
            )
            :
            <p className="text-center mt-3 fw-semibold fs-3">You have no locations saved as favorites</p>

    )
}

export default FavoriteLocations