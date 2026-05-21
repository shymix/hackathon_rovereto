(function () {
    const defaultEmotion = "cultural_energy";

    async function bootstrap() {
        const mapApi = window.CityPulseMap;
        const uiApi = window.CityPulseUI;
        const api = window.CityPulseAPI;

        mapApi.initMap("map");

        let activeEmotion = defaultEmotion;
        uiApi.initEmotionButtons(function (emotion) {
            activeEmotion = emotion;
            mapApi.setEmotion(emotion);
        }, defaultEmotion);

        const districtsGeoJson = await api.getDistricts();

        mapApi.loadDistricts(districtsGeoJson, async function (district) {
            const insightPayload = await api.getDistrictInsight(district.id, activeEmotion);
            const mergedDistrict = insightPayload
                ? {
                    ...district,
                    scores: insightPayload.scores || district.scores,
                    explanation: insightPayload.explanation || district.explanation
                }
                : district;

            uiApi.renderDistrictInfo(mergedDistrict, mapApi.palette);
        });

        mapApi.setEmotion(defaultEmotion);
    }

    document.addEventListener("DOMContentLoaded", function () {
        bootstrap().catch(function (error) {
            console.error("City Pulse failed to initialize", error);
        });
    });
})();
