// public/script.js

const historyList = [];
let autoPlay = false;
let intervalId = null;

async function onPredict() {
  const predictionEl = document.getElementById('prediction');
  const statusEl = document.getElementById('ai-status');
  const historyEl = document.getElementById('historyList');
  const plane = document.getElementById('plane');

  // Animation begins
  statusEl.innerText = "🧠 AI Analyzing...";
  predictionEl.innerText = "--";
  plane.classList.add("fly");

  try {
    const res = await fetch('/api/predict');
    const data = await res.json();

    const predicted = `${data.prediction}x`;

    setTimeout(() => {
      // Show prediction
      predictionEl.innerText = predicted;
      predictionEl.classList.add("pop");

      // Reset animations
      setTimeout(() => predictionEl.classList.remove("pop"), 300);
      plane.classList.remove("fly");

      statusEl.innerText = "✅ AI Prediction Ready";

      // Update history
      const now = new Date().toLocaleTimeString();
      historyList.unshift({ time: now, value: predicted });
      if (historyList.length > 10) historyList.pop();

      // Render leaderboard table
      historyEl.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #444;">
              <th style="text-align:left; padding: 4px;">⏱️ Time</th>
              <th style="text-align:right; padding: 4px;">🎯 Prediction</th>
            </tr>
          </thead>
          <tbody>
            ${historyList.map(row => `
              <tr style="border-bottom: 1px solid #333;">
                <td style="text-align:left; padding: 4px;">${row.time}</td>
                <td style="text-align:right; padding: 4px;">${row.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }, 800);

  } catch (err) {
    console.error("Prediction fetch error:", err);
    statusEl.innerText = "❌ Prediction Error";
    plane.classList.remove("fly");
  }
}

function toggleAutoPlay() {
  const btn = document.getElementById("auto-btn");
  autoPlay = !autoPlay;

  if (autoPlay) {
    btn.innerText = "🛑 Stop Auto-Predict";
    btn.classList.add("active");
    intervalId = setInterval(onPredict, 6000);
  } else {
    btn.innerText = "▶️ Start Auto-Predict";
    btn.classList.remove("active");
    clearInterval(intervalId);
  }
        }
