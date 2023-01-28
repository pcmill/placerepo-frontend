import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../style/map.css';
import { convertBounds, flipLatLng } from "../../util/bounds";
import Marker from "../marker";

function CenterMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [API_KEY] = useState('dyK35oSh2RzcM1TQJdy8');

    const defaultBounds = [[53.418, 5.05], [52.734, 4.479]];
    const previousBounds = JSON.parse(localStorage.getItem('bounds'));
    const [bounds] = useState(previousBounds || defaultBounds);
    const [polygonIds, setPolygonIds] = useState([]);

    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/ff2bdd4a-7b41-466d-9c1a-7331ec687f1b/style.json?key=${API_KEY}`,
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

        map.current.on('moveend', async () => {
            const bounds = map.current.getBounds();
            const cBounds = convertBounds(bounds);
            localStorage.setItem('bounds', JSON.stringify(cBounds));
        });
    }, [bounds, API_KEY, props]);

    useEffect(() => {
        if (map.current && props.polygons) {
            for (const value of Object.values(props.polygons)) {
                if (value.polygon) {
                    const id = polygonIds.find((id) => id === value.admin_id);

                    if (!id) {
                        setPolygonIds([...polygonIds, value.admin_id]);
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

                        map.current.addSource(`polygon-${value.admin_id}`, polygon);
                        map.current.addLayer({
                            'id': `polygon-${value.admin_id}`,
                            'type': 'line',
                            'source': `polygon-${value.admin_id}`,
                            'layout': {},
                            'paint': {
                                'line-color': value.color,
                                'line-width': 2
                            }
                        });
                    }
                }
            }
        }
    }, [props.polygons]);

    return (
        <div className="map-inline">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default CenterMap;