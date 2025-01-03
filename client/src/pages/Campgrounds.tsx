import axios from "axios"
import { useEffect, useState } from "react"
import { CampgroundList } from "../models/Campground";

const Campgrounds = () => {
    const [camps, setCamps] = useState<CampgroundList[]>([]);
    useEffect(() => {
        const fetchCamps = async () => {
            await axios.get('http://localhost:8080/api/campgrounds')
                .then(res => {
                    setCamps(res.data.campgrounds);

                })
                .catch(e => {
                    console.log(e);
                });
        }
        fetchCamps();
    }, [])
    return (
        <div>
            <button onClick={() => console.log(camps)}>show</button>
            <ul>
                {camps.map(c =>
                    <li key={c.id}>{c.title}</li>
                )}
            </ul>
        </div>
    )
}

export default Campgrounds