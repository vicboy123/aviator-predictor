const historyList = [];
let autoPlay = false;
let intervalId = null;

async function onPredict() {
  const predictionEl = document.getElementById('prediction');
  const statusEl = document.getElementById('ai-status');
  const historyEl = document.getElementById('historyList');
  const plane = document.getElementById('plane');

  statusEl.innerText = "AI Analyzing...";
  predictionEl.innerText = "--";
  plane.classList.add("fly");

  try {
    const res = await fetch('/api/predict');
    const data = await res.json();
    const predicted = data.prediction + "x";

    setTimeout(() => {
      predictionEl.innerText = predicted;
      predictionEl.classList.add("pop");

      setTimeout(() => predictionEl.classList.remove("pop"), 300);
      plane.classList.remove("fly");

      statusEl.innerText = "AI Prediction Complete ✅";

      const now = new Date().toLocaleTimeString();
      historyList.unshift(`${now} → ${predicted}`);
      if (historyList.length > 10) historyList.pop();

      historyEl.innerHTML = historyList
        .map(item => `<div class="history-item">${item}</div>`)
        .join("");
    }, 800);

  } catch (err) {
    console.error("Prediction fetch error:", err);
    statusEl.innerText = "Error fetching prediction ❌";
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
