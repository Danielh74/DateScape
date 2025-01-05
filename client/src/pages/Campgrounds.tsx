import axios from "axios"
import { useEffect, useState } from "react"
import { CampgroundList } from "../models/Campground";

const Campgrounds = () => {
    const [camps, setCamps] = useState<CampgroundList[]>([]);
    useEffect(() => {
        const fetchCamps = async () => {
            await axios.get('http://localhost:8080/api/campgrounds')
                .then(res => {
                    console.log(res.data)
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
            <div id="map" className="mb-3 rounded"></div>
            {camps.map(camp =>
                <div key={camp.id} className="card mb-3">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <img className="img-fluid rounded-start" src={camp.images[0].url}
                                alt="camp image" />
                        </div>
                        <div className="card-body col-md-8">
                            <div className="row h-100">
                                <h3 className="col-12 mb-0">
                                    {camp.title}
                                </h3>
                                <span className="text-secondary col-12">
                                    {camp.location}
                                </span>
                                <p className="card-text mb-0 col-12">
                                    {camp.description}
                                </p>

                                <a className="btn btn-primary col-4 align-self-end" href={`/campground/${camp.id}`}>View
                                    {camp.title}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Campgrounds