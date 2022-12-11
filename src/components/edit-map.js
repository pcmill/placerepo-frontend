import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '../style/map.css';

function EditMap(props) {
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
    
                console.log(geojson);
    
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
    }, [API_KEY, props, props.latitude, props.longitude]);

    useEffect(() => {
        if (props.latitude && props.longitude) {
            new maplibregl.Marker()
                .setLngLat([Number(props.longitude), Number(props.latitude)])
                .setPopup(new maplibregl.Popup({
                    closeButton: false
                }).setHTML(
                    `<a class="text-gray-600 text-lg">${props.name}</a>`
                ))
                .addTo(map.current);
        }
    }, [map, props.latitude, props.longitude, props.name]);

    return (
        <div className="map-large">
            <div ref={mapContainer} className="map" />
        </div>
    )
}

export default EditMap;