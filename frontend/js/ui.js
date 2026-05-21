(function () {
    const emotionLabels = {
        cultural_energy: "Cultural Energy",
        mobility_anxiety: "Mobility Anxiety",
        family_security: "Family Security",
        bureaucratic_friction: "Bureaucratic Friction",
        isolation_risk: "Isolation Risk"
    };

    function toPercent(value) {
        return `${Math.round((Number(value) || 0) * 100)}%`;
    }

    function scoreRow(emotionKey, value, color) {
        const wrap = document.createElement("div");
        wrap.className = "rounded bg-gray-800/70 px-3 py-2 border border-gray-700";

        const title = document.createElement("div");
        title.className = "flex items-center justify-between text-xs text-gray-300";
        title.innerHTML = `<span>${emotionLabels[emotionKey]}</span><span>${toPercent(value)}</span>`;

        const bar = document.createElement("div");
        bar.className = "score-bar";
        const inner = document.createElement("span");
        inner.style.width = toPercent(value);
        inner.style.background = color;
        bar.appendChild(inner);

        wrap.appendChild(title);
        wrap.appendChild(bar);
        return wrap;
    }

    function renderDistrictInfo(district, palette) {
        const panel = document.getElementById("info-panel");
        const title = document.getElementById("district-name");
        const scores = document.getElementById("district-scores");
        const explanation = document.getElementById("district-explanation");

        title.textContent = district.name || "District";
        explanation.textContent = district.explanation || "No AI narrative available yet for this district.";
        scores.innerHTML = "";

        Object.keys(emotionLabels).forEach(function (emotionKey) {
            scores.appendChild(scoreRow(
                emotionKey,
                district.scores && district.scores[emotionKey],
                palette[emotionKey]
            ));
        });

        panel.classList.remove("hidden");
    }

    function initEmotionButtons(onChange, defaultEmotion) {
        const buttons = Array.from(document.querySelectorAll(".emotion-btn"));

        function setActive(activeEmotion) {
            buttons.forEach(function (button) {
                const isActive = button.dataset.emotion === activeEmotion;
                button.classList.toggle("active", isActive);
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                const emotion = button.dataset.emotion;
                setActive(emotion);
                onChange(emotion);
            });
        });

        setActive(defaultEmotion);
    }

    window.CityPulseUI = {
        initEmotionButtons,
        renderDistrictInfo
    };
})();
