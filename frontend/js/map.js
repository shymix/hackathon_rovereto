(function () {
    const palette = {
        cultural_energy: "#FFD700",
        mobility_anxiety: "#FF4444",
        family_security: "#4CAF50",
        bureaucratic_friction: "#9C27B0",
        isolation_risk: "#1A237E"
    };

    let map;
    let districtLayer;
    let heatLayer;
    let activeEmotion = "cultural_energy";
    let lastGeoJson;
    let districtClickHandler = function () {};

    function initMap(containerId) {
        map = L.map(containerId, {
            zoomControl: true,
            preferCanvas: true
        }).setView([45.8887, 11.0392], 13);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 20
        }).addTo(map);

        return map;
    }

    function getScore(feature) {
        const scores = feature && feature.properties && feature.properties.scores;
        const value = scores && Number(scores[activeEmotion]);
        if (Number.isFinite(value)) {
            return Math.max(0, Math.min(1, value));
        }
        return 0;
    }

    function districtStyle(feature) {
        const score = getScore(feature);
        return {
            color: palette[activeEmotion],
            weight: 1.5,
            fillColor: palette[activeEmotion],
            fillOpacity: 0.18 + score * 0.52
        };
    }

    function computeCenter(geometry) {
        if (!geometry || !geometry.coordinates) {
            return null;
        }

        const points = geometry.type === "MultiPolygon"
            ? geometry.coordinates.flat(2)
            : geometry.coordinates[0] || [];

        if (!points.length) {
            return null;
        }

        let latSum = 0;
        let lngSum = 0;
        points.forEach(function (point) {
            lngSum += point[0];
            latSum += point[1];
        });

        return [latSum / points.length, lngSum / points.length];
    }

    function redrawHeat() {
        if (!map) {
            return;
        }

        if (heatLayer) {
            map.removeLayer(heatLayer);
        }

        if (!lastGeoJson || !lastGeoJson.features) {
            return;
        }

        const heatPoints = lastGeoJson.features
            .map(function (feature) {
                const center = computeCenter(feature.geometry);
                if (!center) {
                    return null;
                }
                return [center[0], center[1], 0.25 + getScore(feature) * 0.75];
            })
            .filter(Boolean);

        heatLayer = L.layerGroup(
            heatPoints.map(function (point) {
                return L.circle([point[0], point[1]], {
                    radius: 180 + point[2] * 520,
                    stroke: false,
                    fillColor: palette[activeEmotion],
                    fillOpacity: 0.1 + point[2] * 0.24
                });
            })
        ).addTo(map);
    }

    function loadDistricts(geoJson, onDistrictClick) {
        lastGeoJson = geoJson;
        districtClickHandler = onDistrictClick || districtClickHandler;

        if (districtLayer) {
            map.removeLayer(districtLayer);
        }

        districtLayer = L.geoJSON(geoJson, {
            style: districtStyle,
            onEachFeature: function (feature, layer) {
                const districtName = feature.properties && feature.properties.name
                    ? feature.properties.name
                    : "Unknown district";

                layer.bindTooltip(districtName, {
                    className: "city-pulse-tooltip",
                    direction: "top"
                });

                layer.on("click", function () {
                    districtClickHandler(feature.properties || {});
                    layer.setStyle({ weight: 2.5 });
                    setTimeout(function () {
                        if (districtLayer) {
                            districtLayer.resetStyle(layer);
                        }
                    }, 600);
                });
            }
        }).addTo(map);

        const bounds = districtLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.15));
        }

        redrawHeat();
    }

    function setEmotion(emotion) {
        activeEmotion = palette[emotion] ? emotion : activeEmotion;
        if (districtLayer) {
            districtLayer.setStyle(districtStyle);
        }
        redrawHeat();
    }

    window.CityPulseMap = {
        initMap,
        loadDistricts,
        setEmotion,
        palette
    };
})();
