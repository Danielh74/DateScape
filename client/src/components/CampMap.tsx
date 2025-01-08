import { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../styles/map.css';
import { Campground } from '../models/Campground';
interface Props {
    campground: Campground
}

export default function CampMap({ campground }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map>();
    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    useEffect(() => {
        if (map.current) return
        map.current = new maptilersdk.Map({
            container: mapContainer.current as HTMLElement,
            style: maptilersdk.MapStyle.STREETS,
            center: campground.geometry.coordinates,
            zoom: 3
        });

        new maptilersdk.Marker()
            .setLngLat(campground.geometry.coordinates)
            .setPopup(
                new maptilersdk.Popup()
                    .setHTML(
                        `<h4>${campground.title}</h4><p>${campground.location}</p>`
                    )
            )
            .addTo(map.current)
    }, [campground]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map rounded" />
        </div>
    );
}