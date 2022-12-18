import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../style/map.css';
import Marker from "./marker";

function DetailMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/ff2bdd4a-7b41-466d-9c1a-7331ec687f1b/style.json?key=${API_KEY}`,
            center: [Number(props.longitude), Number(props.latitude)],
            zoom: 12,
            maxZoom: 14
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, [API_KEY, props.latitude, props.longitude]);

    useEffect(() => {
        if (props.latitude && props.longitude) {
            new maplibregl.Marker({
                element: Marker()
            })
                .setLngLat([Number(props.longitude), Number(props.latitude)])
                .setPopup(new maplibregl.Popup({
                    closeButton: false
                }).setHTML(
                    `<a class="text-gray-600 text-lg">${props.name}</a>`
                ))
                .addTo(map.current);
        }
    }, [map, props.latitude, props.longitude, props.name]);

    useEffect(() => {
        if (map.current && props.polygon) {
            const data = JSON.parse(props.polygon);

            map.current.on('load', () => {
                map.current.addSource('polygon', {
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
                });

                map.current.addLayer({
                    'id': 'polygon',
                    'type': 'fill',
                    'source': 'polygon',
                    'layout': {},
                    'paint': {
                        'fill-color': '#D3D3D3',
                        'fill-opacity': 0.35
                    }
                });
            });
        }
    }, [map, props.polygon]);

    return (
        <div className="map-inline">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default DetailMap;