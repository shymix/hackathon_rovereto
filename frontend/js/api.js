// API integration with backend

const API_BASE_URL = 'http://localhost:5000/api';

async function fetchDistrictScores(districtId) {
    try {
        const response = await fetch(`${API_BASE_URL}/districts/${districtId}/scores`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching district scores:', error);
        return null;
    }
}

async function fetchAllDistricts() {
    try {
        const response = await fetch(`${API_BASE_URL}/districts`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching districts:', error);
        return null;
    }
}

async function submitFeedback(districtName, emotion, feedback) {
    try {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                district: districtName,
                emotion: emotion,
                feedback: feedback,
                timestamp: new Date().toISOString()
            })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return null;
    }
}

async function enrichDistrictsWithBackendData(localGeoJSON) {
    // Merge local GeoJSON with backend scores
    const backendData = await fetchAllDistricts();

    if (!backendData || !localGeoJSON.features) return localGeoJSON;

    localGeoJSON.features.forEach(feature => {
        const districtName = feature.properties.name;
        const backendDistrict = backendData.find(d => d.name === districtName);

        if (backendDistrict && backendDistrict.scores) {
            feature.properties.scores = backendDistrict.scores;
        }
    });

    return localGeoJSON;
}
