// UI interactions and district info display

function displayDistrictInfo(districtName, properties) {
    const infoPanel = document.getElementById('info-panel');
    const districtNameEl = document.getElementById('district-name');
    const districtScoresEl = document.getElementById('district-scores');
    const districtExplanationEl = document.getElementById('district-explanation');

    // Populate district name
    districtNameEl.textContent = districtName;

    // Populate emotion scores
    districtScoresEl.innerHTML = '';
    const scores = properties.scores || {};

    const emotionLabels = {
        cultural_energy: '🎨 Cultural Energy',
        mobility_anxiety: '🚗 Mobility Anxiety',
        family_security: '👨‍👩‍👧‍👦 Family Security',
        bureaucratic_friction: '📋 Bureaucratic Friction',
        isolation_risk: '🏚️ Isolation Risk'
    };

    Object.entries(emotionLabels).forEach(([key, label]) => {
        const score = scores[key] || 0;
        const percentage = Math.round(score * 100);

        const scoreHTML = `
            <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-semibold">${label}</span>
                    <span class="text-xs text-amber-400">${percentage}%</span>
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        districtScoresEl.innerHTML += scoreHTML;
    });

    // Populate explanation (you can customize this based on scores)
    const explanation = generateExplanation(districtName, scores);
    districtExplanationEl.textContent = explanation;

    // Show info panel
    infoPanel.classList.remove('hidden');
}

function generateExplanation(districtName, scores) {
    // Simple explanation based on highest/lowest scores
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const highest = entries[0];
    const lowest = entries[entries.length - 1];

    const emotionNames = {
        cultural_energy: 'cultural energy',
        mobility_anxiety: 'mobility anxiety',
        family_security: 'family security',
        bureaucratic_friction: 'bureaucratic friction',
        isolation_risk: 'isolation risk'
    };

    return `${districtName} shows strong ${emotionNames[highest[0]]} (${Math.round(highest[1] * 100)}%) but lower ${emotionNames[lowest[0]]} (${Math.round(lowest[1] * 100)}%). Focus interventions on areas with high friction.`;
}

function setupEmotionButtons() {
    const emotionButtons = document.querySelectorAll('.emotion-btn');

    emotionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            emotionButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update map layer
            const emotion = button.dataset.emotion;
            updateEmotionLayer(emotion);
        });
    });
}

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEmotionButtons();
});
