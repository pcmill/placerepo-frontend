import { useEffect, useRef } from "react";
import maplibregl from 'maplibre-gl';
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '../../style/map.css';
import Marker from "../marker";

function EditMap(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

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
            center: [Number(props.longitude), Number(props.latitude)],
            zoom: 12,
            maxZoom: 15
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        const draw = new mapboxGlDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            }
        });
        
        map.current.on('load', () => {
            map.current.addControl(draw);
            
            if (props.polygon) {
                const geojson = {
                    type: 'Polygon',
                    coordinates: [
                        JSON.parse(props.polygon)
                    ]
                };

                draw.add(geojson);
            }
        });

        map.current.on('draw.create', (e) => {
            const data = e.features[0].geometry.coordinates[0];
            props.setPolygon(JSON.stringify(data));
        });

        map.current.on('draw.update', (e) => {
            const data = e.features[0].geometry.coordinates[0];
            props.setPolygon(JSON.stringify(data));
        });

        // There can only be one polygon at a time, so delete all other polygons when a new one is created.
        map.current.on('draw.modechange', (e) => {
            const data = draw.getAll();

            if (data.features.length > 0) {
                const pids = [];
                const lid = data.features[data.features.length - 1].id;
    
                data.features.forEach((f) => {
                  if (f.geometry.type === 'Polygon' && f.id !== lid) {
                    pids.push(f.id);
                  }
                });
    
                draw.delete(pids);
            }
        });
    }, [props, props.latitude, props.longitude]);

    useEffect(() => {
        if (props.latitude && props.longitude) {
            if (marker.current) return;

            marker.current = new maplibregl.Marker({
                element: Marker(),
                draggable: true
            })
                .setLngLat([Number(props.longitude), Number(props.latitude)])
                .setPopup(new maplibregl.Popup({
                    closeButton: false
                }).setHTML(
                    `<a class="text-gray-600 text-lg">${props.name}</a>`
                ))
                .addTo(map.current);

            function onDragEnd() {
                const lngLat = marker.current.getLngLat();

                props.setLatlong({
                    latitude: lngLat.lat,
                    longitude: lngLat.lng
                });
            }
    
            marker.current.on('dragend', onDragEnd);
        }
    }, [map, props, props.latitude, props.longitude, props.name]);

    return (
        <div className="map-large">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default EditMap;