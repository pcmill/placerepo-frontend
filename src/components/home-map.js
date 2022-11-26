import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../style/map.css';
import { convertBounds, flipLatLng } from "../util/bounds";

function HomeMap() {
    const apiKey = localStorage.getItem('apiKey');
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');
    const [places, setPlaces] = useState(null);
    const [placeMarkers, setPlaceMarkers] = useState([]);

    const defaultBounds = [[53.418, 5.05], [52.734, 4.479]];
    const previousBounds = JSON.parse(localStorage.getItem('bounds'));
    const [bounds] = useState(previousBounds || defaultBounds);

    useEffect(() => {
        fetchPlaces(bounds, apiKey, setPlaces);
    }, [apiKey, setPlaces, bounds]);

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/ff2bdd4a-7b41-466d-9c1a-7331ec687f1b/style.json?key=${API_KEY}`,
            bounds: flipLatLng(bounds),
            maxZoom: 14
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('moveend', async () => {
            const bounds = map.current.getBounds();
            const cBounds = convertBounds(bounds);
            await fetchPlaces(cBounds, apiKey, setPlaces);

            localStorage.setItem('bounds', JSON.stringify(cBounds));
        });
    }, [bounds, apiKey, API_KEY]);

    useEffect(() => {
        if (places && places.length > 0) {
            for (const place of places) {
                const result = placeMarkers.find((p) => p === place.id);

                if (result === undefined) {
                    setPlaceMarkers([...placeMarkers, place.id]);

                    new maplibregl.Marker()
                        .setLngLat([Number(place.longitude), Number(place.latitude)])
                        .setPopup(new maplibregl.Popup({
                            closeButton: false
                        }).setHTML(
                            `<a class="text-gray-600 text-lg">${place.name}</a>`
                        ))
                        .addTo(map.current);
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

async function fetchPlaces(currentBounds, apiKey, setPlaces) {
    const body = JSON.stringify({
        "boundingbox": currentBounds
    });

    const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/place/boundingbox`, {
        method: 'POST',
        body: body,
        headers: {
            'x-api-key': apiKey,
            'content-type': 'application/json',
        }
    });

    const p = await data.json();

    if (p) {
        setPlaces(p.places);
    }
}

export default HomeMap;