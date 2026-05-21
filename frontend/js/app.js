// Main application orchestration

let appState = {
    currentEmotion: 'cultural_energy',
    selectedDistrict: null,
    districtData: null
};

async function initializeApp() {
    try {
        // Load local GeoJSON
        const response = await fetch('data/districts.json');
        let geoJSON = await response.json();

        // Enrich with backend data if available
        geoJSON = await enrichDistrictsWithBackendData(geoJSON);
        appState.districtData = geoJSON;

        // Initialize map with enriched data
        initMap();

        // Setup UI interactions
        setupEmotionButtons();

        console.log('✨ App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function handleDistrictSelection(districtName, properties) {
    appState.selectedDistrict = districtName;
    displayDistrictInfo(districtName, properties);
}

// Override global function for cleaner state management
window.displayDistrictInfo = handleDistrictSelection;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeApp);
