import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../style/map.css';
import Marker from "./marker";

function MiniMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');

    useEffect(() => {
        if (map.current) return;

        console.log(props);

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/ff2bdd4a-7b41-466d-9c1a-7331ec687f1b/style.json?key=${API_KEY}`,
            center: [props.longitude, props.latitude],
            zoom: 12
        });

        new maplibregl.Marker({
            element: Marker()
        }).setLngLat([props.longitude, props.latitude]).addTo(map.current);

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, [API_KEY, props]);

    return (
        <div className="map-mini">
            <div ref={mapContainer} className="map rounded" />
        </div>
    )
}

export default MiniMap;