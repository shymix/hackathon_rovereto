// Map initialization and district management

let map;
let districtGeoJSON;
let currentEmotion = 'cultural_energy';
let heatLayer;
let districtLayers = {};

const emotionColors = {
    cultural_energy: { min: '#0a1f4d', max: '#00FF00' },
    mobility_anxiety: { min: '#1a0000', max: '#FF1744' },
    family_security: { min: '#0d2d0d', max: '#00FF88' },
    bureaucratic_friction: { min: '#2d0052', max: '#FF00FF' },
    isolation_risk: { min: '#0a0f1f', max: '#00FFFF' }
};

function initMap() {
    // Initialize Leaflet map centered on Rovereto
    map = L.map('map', {
        preferCanvas: true
    }).setView([45.8865, 11.0514], 13);

    // Use OpenStreetMap as base - simple and reliable
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Load district GeoJSON
    loadDistricts();
}

function loadDistricts() {
    fetch('data/districts.json')
        .then(response => response.json())
        .then(data => {
            districtGeoJSON = data;
            renderDistricts();
        })
        .catch(error => console.error('Error loading districts:', error));
}

function renderDistricts() {
    Object.values(districtLayers).forEach(layer => map.removeLayer(layer));
    districtLayers = {};

    if (!districtGeoJSON || !districtGeoJSON.features) return;

    districtGeoJSON.features.forEach(feature => {
        const districtName = feature.properties.name;
        const score = feature.properties.scores?.[currentEmotion] || 0.5;

        const layer = L.geoJSON(feature, {
            style: {
                fillColor: interpolateColor(score, emotionColors[currentEmotion]),
                weight: 3,
                opacity: 1,
                color: '#00FF88',
                fillOpacity: 0.75
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => selectDistrict(districtName, feature.properties));
                layer.on('mouseover', () => {
                    layer.setStyle({
                        weight: 4,
                        color: '#FFFFFF',
                        fillOpacity: 0.9
                    });
                });
                layer.on('mouseout', () => {
                    layer.setStyle({
                        weight: 3,
                        color: '#00FF88',
                        fillOpacity: 0.75
                    });
                });
            }
        }).addTo(map);

        districtLayers[districtName] = layer;
    });
}

function interpolateColor(value, colorRange) {
    value = Math.max(0, Math.min(1, value));

    const minHex = colorRange.min.replace('#', '');
    const maxHex = colorRange.max.replace('#', '');

    const minRGB = parseInt(minHex, 16);
    const maxRGB = parseInt(maxHex, 16);

    const r = Math.round((minRGB >> 16 & 255) + (((maxRGB >> 16 & 255) - (minRGB >> 16 & 255)) * value));
    const g = Math.round((minRGB >> 8 & 255) + (((maxRGB >> 8 & 255) - (minRGB >> 8 & 255)) * value));
    const b = Math.round((minRGB & 255) + (((maxRGB & 255) - (minRGB & 255)) * value));

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function updateEmotionLayer(emotion) {
    currentEmotion = emotion;
    renderDistricts();
}

function selectDistrict(districtName, properties) {
    window.displayDistrictInfo(districtName, properties);
}

document.addEventListener('DOMContentLoaded', initMap);
