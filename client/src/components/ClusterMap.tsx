
import { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../styles/map.css';
import { DateLocation } from '../models/DateLocation';

interface Props {
    locations: DateLocation[]
}

export default function ClusterMap({ locations }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maptilersdk.Map>();
    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    useEffect(() => {
        if (!map.current) {
            map.current = new maptilersdk.Map({

                container: mapContainer.current as HTMLElement,
                style: maptilersdk.MapStyle.STREETS,
                center: [-103.59179687498357, 40.66995747013945],
                zoom: 3
            });

            map.current.on('load', function () {
                map.current?.addSource('locations', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: locations.map(location => ({
                            type: 'Feature',
                            properties: {
                                popUpMarkup: JSON.stringify({
                                    id: location.id,
                                    title: location.title,
                                    address: location.address,
                                }),
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: location.geometry.coordinates,
                            },
                        })),
                    },
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50,
                });

                map.current?.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'locations',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            'darkOrange',
                            10,
                            'orange',
                            30,
                            'gold'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            15,
                            10,
                            20,
                            30,
                            25
                        ]
                    }
                });

                map.current?.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'locations',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.current?.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'locations',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': 'orangeRed',
                        'circle-radius': 4,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });

                map.current?.on('click', 'clusters', async (e) => {
                    const features = map.current?.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });

                    if (!features || features.length === 0) {
                        console.error('No features found at the clicked point');
                        return;
                    }

                    const clusterId = features[0]?.properties?.cluster_id;

                    if (clusterId === undefined) {
                        console.error('Cluster ID is undefined');
                        return;
                    }

                    const geometry = features[0]?.geometry;

                    if (!geometry || geometry.type !== 'Point') {
                        console.error('Feature geometry is not a Point');
                        return;
                    }

                    const coordinates = geometry.coordinates; // TypeScript now knows it's a Point

                    try {
                        // Cast the source to GeoJSONSource to access getClusterExpansionZoom
                        const source = map.current?.getSource('locations') as maptilersdk.GeoJSONSource;

                        if (!source || typeof source.getClusterExpansionZoom !== 'function') {
                            console.error('Source is not cluster-enabled or method is unavailable');
                            return;
                        }

                        const zoom = await source.getClusterExpansionZoom(clusterId);

                        map.current?.easeTo({
                            center: coordinates as [number, number],
                            zoom
                        });
                    } catch (error) {
                        console.error('Error expanding cluster:', error);
                    }
                });

                map.current?.on('click', 'unclustered-point', function (e) {
                    if (!e.features || e.features.length === 0) {
                        console.error('No features found at the clicked point');
                        return;
                    }

                    // Extract the first feature
                    const feature = e.features[0];

                    // Ensure properties and geometry exist
                    if (!feature.properties || !feature.geometry || feature.geometry.type !== 'Point') {
                        console.error('Feature properties or geometry are missing or invalid');
                        return;
                    }

                    if (!feature.properties || !feature.properties.popUpMarkup) {
                        console.error('popUpMarkup property is missing in the feature:', feature.properties);
                        return;
                    }

                    // Parse popup data from feature properties
                    let popUpData;
                    try {
                        popUpData = JSON.parse(feature.properties.popUpMarkup);
                    } catch (error) {
                        console.error('Failed to parse popUpMarkup:', error);
                        return;
                    }

                    const { id, title, address } = popUpData;

                    // Ensure geometry coordinates exist and are valid
                    const coordinates = [...feature.geometry.coordinates]; // Clone coordinates to avoid mutation
                    if (!coordinates || coordinates.length < 2) {
                        console.error('Invalid geometry coordinates');
                        return;
                    }

                    // Construct popup content
                    const popUpText = `
                    <h5><a href="/location/${id}">${title}</a></h5>
                    <span>${address}</span>
                `;

                    // Adjust for map wrapping
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Create and add popup
                    new maptilersdk.Popup()
                        .setLngLat(coordinates as [number, number])
                        .setHTML(popUpText)
                        .addTo(map.current as maptilersdk.Map);
                });
            });
        }
    }, [locations]);

    useEffect(() => {
        // Ensure map is initialized and source exists
        if (map.current && map.current.isStyleLoaded() && map.current.getSource('locations')) {
            const source = map.current.getSource('locations') as maptilersdk.GeoJSONSource;

            source.setData({
                type: 'FeatureCollection',
                features: locations.map(location => ({
                    type: 'Feature',
                    properties: {
                        popUpMarkup: JSON.stringify({
                            id: location.id,
                            title: location.title,
                            address: location.address,
                        }),
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: location.geometry.coordinates,
                    },
                })),
            });
        }
    }, [locations]); // This will trigger only when `locations` changes

    useEffect(() => {
        if (map.current) return; // Skip if map is already initialized
    }, []);


    return (
        <div className="cluster-map-wrap">
            <div ref={mapContainer} className="map rounded-bottom" />
        </div>
    );
}