import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../style/map.css';
import { convertBounds, flipLatLng } from "../../util/bounds";
import { fetchPlaces, setPolygon } from "../../util/map";
import Marker from "../marker";

function HomeMap() {
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
                        'maxzoom': 16
                    }
                ]
            },
            bounds: flipLatLng(bounds),
            maxZoom: 14
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

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
    }, [bounds]);

    useEffect(() => {
        if (places && places.length > 0) {
            for (const place of places) {
                const result = placeMarkers.find((p) => p.id === place.id);

                if (result === undefined) {
                    new maplibregl.Marker({
                        element: Marker()
                    })
                        .setLngLat([Number(place.longitude), Number(place.latitude)])
                        .setPopup(new maplibregl.Popup({
                            closeButton: false
                        }).setHTML(
                            `<a href="/place/${place.id}" class="text-gray-600 text-lg underline">${place.name}</a>`
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
    }, [places, map, placeMarkers]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default HomeMap;