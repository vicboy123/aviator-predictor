const historyList = [];
let autoPlay = false;
let intervalId = null;

async function onPredict() {
  const predictionEl = document.getElementById('prediction');
  const statusEl = document.getElementById('ai-status');
  const historyEl = document.getElementById('historyList');

  statusEl.innerText = "AI Analyzing...";
  predictionEl.innerText = "--";

  try {
    const res = await fetch('/api/predict');
    const data = await res.json();

    const predicted = data.prediction + "x";

    predictionEl.innerText = predicted;
    statusEl.innerText = "AI Prediction Complete ✅";

    const now = new Date().toLocaleTimeString();
    historyList.unshift(`${now} → ${predicted}`);
    if (historyList.length > 10) historyList.pop();

    historyEl.innerHTML = historyList
      .map(item => `<div class="history-item">${item}</div>`)
      .join("");

  } catch (err) {
    console.error("Prediction fetch error:", err);
    statusEl.innerText = "Error fetching prediction ❌";
  }
}

function toggleAutoPlay() {
  const btn = document.getElementById("auto-btn");

  autoPlay = !autoPlay;

  if (autoPlay) {
    btn.innerText = "🛑 Stop Auto-Predict";
    intervalId = setInterval(onPredict, 6000); // every 6 seconds
  } else {
    btn.innerText = "▶️ Start Auto-Predict";
    clearInterval(intervalId);
  }
}
