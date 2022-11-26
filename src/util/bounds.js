import { roundTo } from "./number";

export function convertBounds(bounds) {
    if (bounds) {
        const northEast = [roundTo(bounds._ne.lat, 3), roundTo(bounds._ne.lng, 3)];
        const southWest = [roundTo(bounds._sw.lat, 3), roundTo(bounds._sw.lng, 3)];
    
        return [northEast, southWest];
    }
}

/* 
    MapLibre uses the LngLat format and we use LatLng so we need to flip
    the bounds to use them in the map.
*/
export function flipLatLng(bounds) {
    if (bounds) {
        const northEast = [bounds[0][1], bounds[0][0]];
        const southWest = [bounds[1][1], bounds[1][0]];
    
        return [northEast, southWest];
    }
}