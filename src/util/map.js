export function setPolygon(map, polygon, id) {
    if (polygon) {
        const data = JSON.parse(polygon);
    
        map.current.addSource(`polygon-${id}`, {
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
            'id': `polygon-${id}`,
            'type': 'fill',
            'source': `polygon-${id}`,
            'layout': {},
            'paint': {
                'fill-color': '#D3D3D3',
                'fill-opacity': 0.35
            }
        });
    }
}

export async function fetchPlaces(currentBounds, setPlaces) {
    const body = JSON.stringify({
        "boundingbox": currentBounds
    });

    const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/place/boundingbox`, {
        method: 'POST',
        body: body,
        headers: {
            'content-type': 'application/json',
        }
    });

    const p = await data.json();

    if (p) {
        setPlaces(p.places);
    }
}