import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../style/map.css';
import { convertBounds, flipLatLng } from "../../util/bounds";
import Marker from "../marker";
import { fetchPlaces, setPolygon } from "../../util/map";

function CenterMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [places, setPlaces] = useState(null);
    const [placeMarkers, setPlaceMarkers] = useState([]);

    const defaultBounds = [[53.418, 5.05], [52.734, 4.479]];
    const previousBounds = JSON.parse(localStorage.getItem('bounds'));
    const [bounds] = useState(previousBounds || defaultBounds);

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                "version": 8,
                "sources": {
                    "raster-tiles": {
                        "type": "raster",
                        "tiles": [
                            process.env.REACT_APP_TILE_URL
                        ],
                        "tileSize": 256,
                        "attribution": `© ${new Date().getFullYear()} TomTom`
                    },
                },
                'layers': [
                    {
                        'id': 'simple-tiles',
                        'type': 'raster',
                        'source': 'raster-tiles',
                        'minzoom': 0,
                        'maxzoom': 17
                    }
                ]
            },
            bounds: flipLatLng(bounds),
            maxZoom: 15
        });

        const center = new maplibregl.LngLatBounds(flipLatLng(bounds)).getCenter();

        let marker;
        if (center) {
            marker = new maplibregl.Marker({
                element: Marker(),
                draggable: true
            }).setLngLat(center).addTo(map.current);

            props.newLatLng({
                latitude: center.lat,
                longitude: center.lng
            });
        }

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            props.newLatLng({
                latitude: lngLat.lat,
                longitude: lngLat.lng
            });
        }

        marker.on('dragend', onDragEnd);

        map.current.on('load', async () => {
            const bounds = map.current.getBounds();
            const cBounds = convertBounds(bounds);
            await fetchPlaces(cBounds, setPlaces);
        });

        map.current.on('moveend', async () => {
            const bounds = map.current.getBounds();
            const cBounds = convertBounds(bounds);
            await fetchPlaces(cBounds, setPlaces);

            localStorage.setItem('bounds', JSON.stringify(cBounds));
        });
    }, [bounds, props]);

    useEffect(() => {
        if (map.current) {
            if (places && places.length > 0) {
                for (const place of places) {
                    const result = placeMarkers.find((p) => p.id === place.id);
    
                    if (result === undefined) {
                        new maplibregl.Marker({
                            element: Marker(20, 20, 'marker-gray')
                        })
                            .setLngLat([Number(place.longitude), Number(place.latitude)])
                            .setPopup(new maplibregl.Popup({
                                closeButton: false
                            }).setHTML(
                                `<span class="text-gray-600 text-lg">${place.name}</span>`
                            ))
                            .addTo(map.current);
    
                        if (place.polygon) {
                            setPolygon(map, place.polygon, place.id);
                        }
    
                        setPlaceMarkers((prev) => [...prev, {
                            id: place.id,
                            polygon: (place.polygon !== undefined)
                        }]);
                    }
    
                    if (result && !result.polygon && place.polygon) {
                        setPolygon(map, place.polygon, place.id);
                        result.polygon = true;
                    }
                }
            }

            for (const [key, value] of Object.entries(props.polygons)) {
                if (key && value.polygon) {
                    const data = JSON.parse(value.polygon);

                    let polygon;
                    if (value.polygon_type === 1) {
                        polygon = {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'MultiPolygon',
                                    'coordinates': data
                                }
                            }
                        }
                    } else {
                        polygon = {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Polygon',
                                    'coordinates': [
                                        data
                                    ]
                                }
                            }
                        }
                    }

                    // Remove old polygon so there is always
                    // one polygon per admin layer
                    removePolygons(map, key);

                    map.current.addSource(`polygon-${key}`, polygon);
                    map.current.addLayer({
                        'id': `polygon-${key}`,
                        'type': 'line',
                        'source': `polygon-${key}`,
                        'layout': {},
                        'paint': {
                            'line-color': value.color,
                            'line-width': 2
                        }
                    });
                } else {
                    removePolygons(map, key);
                }
            }
        }
    }, [props.polygons, places, placeMarkers]);

    function removePolygons(map, key) {
        if (map.current.getLayer(`polygon-${key}`)) {
            map.current.removeLayer(`polygon-${key}`);
        }

        if (map.current.getSource(`polygon-${key}`)) {
            map.current.removeSource(`polygon-${key}`);
        }
    }

    return (
        <div className="map-inline">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default CenterMap;