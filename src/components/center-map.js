import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../style/map.css';
import { convertBounds, flipLatLng } from "../util/bounds";
import Marker from "./marker";

function CenterMap(props) {
    const apiKey = localStorage.getItem('apiKey');
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');

    const defaultBounds = [[53.418, 5.05], [52.734, 4.479]];
    const previousBounds = JSON.parse(localStorage.getItem('bounds'));
    const [bounds] = useState(previousBounds || defaultBounds);

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/ff2bdd4a-7b41-466d-9c1a-7331ec687f1b/style.json?key=${API_KEY}`,
            bounds: flipLatLng(bounds),
            maxZoom: 14
        });

        const center = new maplibregl.LngLatBounds(flipLatLng(bounds)).getCenter();

        const marker = new maplibregl.Marker({
            element: Marker(),
            draggable: true
        }).setLngLat(center).addTo(map.current);

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            props.newLatLng({
                latitude: lngLat.lat,
                longitude: lngLat.lng
            });
        }

        marker.on('dragend', onDragEnd);

        map.current.on('moveend', async () => {
            const bounds = map.current.getBounds();
            const cBounds = convertBounds(bounds);
            localStorage.setItem('bounds', JSON.stringify(cBounds));
        });
    }, [bounds, apiKey, API_KEY, props]);

    return (
        <div className="map-inline">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default CenterMap;