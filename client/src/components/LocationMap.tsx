import { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../styles/map.css';
import { DateLocation } from '../models/DateLocation';
interface Props {
    location: DateLocation
}

export default function LocationMap({ location }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map>();
    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    useEffect(() => {
        if (map.current) return
        map.current = new maptilersdk.Map({
            container: mapContainer.current as HTMLElement,
            style: maptilersdk.MapStyle.STREETS,
            center: location.geometry.coordinates,
            zoom: 3
        });

        new maptilersdk.Marker()
            .setLngLat(location.geometry.coordinates)
            .setPopup(
                new maptilersdk.Popup()
                    .setHTML(
                        `<h4>${location.title}</h4><p>${location.address}</p>`
                    )
            )
            .addTo(map.current)
    }, [location]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map rounded" />
        </div>
    );
}