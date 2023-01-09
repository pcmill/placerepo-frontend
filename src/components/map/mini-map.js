import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../style/map.css';
import Marker from "../marker";

function MiniMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');

    useEffect(() => {
        if (map.current) return;

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

    useEffect(() => {
        if (map.current) {
            map.current.on('load', () => {
                if (props.oldPolygon) {
                    const data = JSON.parse(props.oldPolygon);

                    map.current.addSource('old-polygon', {
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
                        'id': 'old-polygon',
                        'type': 'line',
                        'source': 'old-polygon',
                        'layout': {},
                        'paint': {
                            'line-color': 'red',
                            'line-width': 2
                        }
                    });
                }

                if (props.newPolygon) {
                    const data = JSON.parse(props.newPolygon);

                    map.current.addSource('new-polygon', {
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
                        'id': 'new-polygon',
                        'type': 'line',
                        'source': 'new-polygon',
                        'layout': {},
                        'paint': {
                            'line-color': 'lightgreen',
                            'line-width': 2
                        }
                    });
                }
            });
        }
    }, [map, props.oldPolygon, props.newPolygon]);

    return (
        <div className="map-mini">
            <div ref={mapContainer} className="map rounded" />
        </div>
    )
}

export default MiniMap;