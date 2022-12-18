function Marker(width = 20, height = 20) {
    // create a DOM element for the marker
    const el = document.createElement('div');
    el.className = 'marker';

    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    return el;
}

export default Marker;