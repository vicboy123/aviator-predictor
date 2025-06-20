let balance = 10;
let historyList = [];

window.onload = function () {
  const saved = localStorage.getItem("aviator_data");
  if (saved) {
    const data = JSON.parse(saved);
    balance = data.balance || 10;
    historyList = data.history || [];
    updateBalance();
    updateHistory();
  }
};

function saveData() {
  localStorage.setItem("aviator_data", JSON.stringify({
    balance,
    history: historyList
  }));
}

function updateBalance() {
  document.getElementById("balance").innerText = `💰 Balance: R${balance.toFixed(2)}`;
}

function updateHistory() {
  document.getElementById("historyList").innerHTML = historyList.map(i => `<div class="item">${i}</div>`).join("");
}

function predictAndBet() {
  const input = document.getElementById("inputData").value;
  const crashes = input.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
  const bet = parseFloat(document.getElementById("betAmount").value);
  const target = parseFloat(document.getElementById("targetMultiplier").value);

  if (crashes.length < 3 || isNaN(bet) || isNaN(target)) {
    document.getElementById("status").innerText = "⚠️ Fill all fields correctly.";
    return;
  }

  if (bet > balance || bet <= 0) {
    document.getElementById("status").innerText = "❌ Invalid or insufficient bet.";
    return;
  }

  document.getElementById("status").innerText = "🔍 Analyzing...";
  document.getElementById("prediction").innerText = "--";
  document.getElementById("result").innerText = "--";

  setTimeout(() => {
    // Smart prediction: weighted average
    const weights = crashes.map((_, i) => i + 1);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const weightedAvg = crashes.reduce((sum, val, i) => sum + val * weights[i], 0) / weightSum;

    let predicted;
    if (weightedAvg < 1.6) predicted = (Math.random() * 1 + 1.3);
    else if (weightedAvg < 2.5) predicted = (Math.random() * 1.2 + 1.8);
    else predicted = (Math.random() * 2 + 2.5);

    predicted = +predicted.toFixed(2);

    const actual = +(Math.random() * 4 + 1).toFixed(2);
    const win = actual >= target;

    const volatility = Math.max(...crashes) - Math.min(...crashes);
    const confidence = Math.max(40, Math.min(95, 100 - volatility * 10)).toFixed(1);

    let resultText = win ? `✅ WIN! R${(bet * target).toFixed(2)}` : `❌ Lost R${bet}`;
    balance += win ? (bet * target) - bet : -bet;

    document.getElementById("status").innerText = `🎯 Target: ${target}x (Conf: ${confidence}%)`;
    document.getElementById("prediction").innerText = `📈 AI Prediction: ${predicted}x`;
    document.getElementById("result").innerText = `💥 Crashed at: ${actual}x → ${resultText}`;
    updateBalance();

    const now = new Date().toLocaleTimeString();
    historyList.unshift(`${now} → Bet R${bet} @ ${target}x → Crash: ${actual}x → ${win ? 'WIN' : 'LOSE'}`);
    if (historyList.length > 10) historyList.pop();

    updateHistory();
    saveData();
  }, 1200);
}

function resetAll() {
  if (confirm("Reset all data?")) {
    balance = 10;
    historyList = [];
    updateBalance();
    updateHistory();
    localStorage.removeItem("aviator_data");
    document.getElementById("status").innerText = "🔄 Reset complete.";
    document.getElementById("prediction").innerText = "--";
    document.getElementById("result").innerText = "--";
  }
    }
