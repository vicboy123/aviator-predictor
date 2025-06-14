const historyList = [];

async function onPredict() {
  const predictionEl = document.getElementById('prediction');
  const statusEl = document.getElementById('ai-status');
  const historyEl = document.getElementById('historyList');

  // Show loading state
  statusEl.innerText = "AI Analyzing...";
  predictionEl.innerText = "--";

  try {
    // Call prediction API
    const res = await fetch('/api/predict');
    const data = await res.json();

    // Parse prediction
    const predicted = data.prediction + "x";

    // Update UI
    predictionEl.innerText = predicted;
    statusEl.innerText = "AI Prediction Complete ✅";

    // Save to history
    const now = new Date().toLocaleTimeString();
    historyList.unshift(`${now} → ${predicted}`);
    if (historyList.length > 10) historyList.pop();

    // Render history
    historyEl.innerHTML = historyList
      .map(item => `<div class="history-item">${item}</div>`)
      .join("");

  } catch (err) {
    console.error("Prediction fetch error:", err);
    statusEl.innerText = "Error fetching prediction ❌";
  }
  }
