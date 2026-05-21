(function () {
    const LOCAL_DATA_PATH = "data/districts.json";

    function getBaseUrl() {
        if (window.CITY_PULSE_CONFIG && window.CITY_PULSE_CONFIG.apiBaseUrl) {
            return String(window.CITY_PULSE_CONFIG.apiBaseUrl).replace(/\/$/, "");
        }
        return "";
    }

    async function fetchJson(url) {
        const response = await fetch(url, {
            headers: { "Accept": "application/json" }
        });
        if (!response.ok) {
            throw new Error(`Request failed (${response.status}): ${url}`);
        }
        return response.json();
    }

    async function getDistricts() {
        const baseUrl = getBaseUrl();
        if (baseUrl) {
            try {
                return await fetchJson(`${baseUrl}/districts`);
            } catch (error) {
                console.warn("City Pulse API fallback to local districts.json", error);
            }
        }
        return fetchJson(LOCAL_DATA_PATH);
    }

    async function getDistrictInsight(districtId, emotion) {
        const baseUrl = getBaseUrl();
        if (!baseUrl) {
            return null;
        }
        try {
            const query = emotion ? `?emotion=${encodeURIComponent(emotion)}` : "";
            return await fetchJson(`${baseUrl}/districts/${encodeURIComponent(districtId)}/insight${query}`);
        } catch (error) {
            console.warn("City Pulse insight endpoint unavailable", error);
            return null;
        }
    }

    window.CityPulseAPI = {
        getDistricts,
        getDistrictInsight
    };
})();
