export function Marker(width = 20, height = 20, className = 'marker') {
    // create a DOM element for the marker
    const el = document.createElement('div');
    el.className = className;

    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    return el;
}

export default Marker;