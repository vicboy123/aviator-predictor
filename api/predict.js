let balance = 10;  // Starting balance set to 10 Rand
let historyList = [];

// Load saved data
window.onload = function() {
  const saved = localStorage.getItem("aviator_data");
  if (saved) {
    const data = JSON.parse(saved);
    balance = data.balance || 10;
    historyList = data.history || [];
    updateBalance();
    updateHistory();
  }
  connectLiveData();
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
  const parts = input.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
  const bet = parseFloat(document.getElementById("betAmount").value);
  const target = parseFloat(document.getElementById("targetMultiplier").value);

  if (parts.length < 2 || isNaN(bet) || isNaN(target)) {
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
    const avg = parts.reduce((a, b) => a + b) / parts.length;
    let predicted;
    if (avg < 1.5) predicted = (Math.random() * 2 + 1).toFixed(2);
    else if (avg < 3) predicted = (Math.random() * 3 + 1.5).toFixed(2);
    else predicted = (Math.random() * 5 + 2.5).toFixed(2);

    const rand = Math.random();
    const actual = rand < 0.01 ? 1.00 : +(Math.floor((1 / (1 - rand)) * 100) / 100).toFixed(2);

    let win = actual >= target;
    let resultText = win ? `✅ WIN! You got R${(bet * target).toFixed(2)}` : `❌ Lost R${bet}`;
    balance += win ? (bet * target) - bet : -bet;

    document.getElementById("status").innerText = `🎯 Target: ${target}x`;
    document.getElementById("prediction").innerText = `AI Predicts: ${predicted}x`;
    document.getElementById("result").innerText = `💥 Crashed at: ${actual}x → ${resultText}`;
    updateBalance();

    const now = new Date().toLocaleTimeString();
    historyList.unshift(`${now} → Bet: R${bet} @ ${target}x → Crash: ${actual}x → ${win ? 'WIN' : 'LOSE'}`);
    if (historyList.length > 10) historyList.pop();

    updateHistory();
    saveData();
  }, 1500);
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

// Optional: Live crash multiplier stream listener (if server sends updates)
function connectLiveData() {
  try {
    const source = new EventSource("/api/stream");
    source.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data && data.crash) {
        document.getElementById("streamStatus").innerText = `Live: Last crash ${data.crash}x`;
      }
    };
    source.onerror = function() {
      document.getElementById("streamStatus").innerText = "Live: Connection failed.";
    };
  } catch (e) {
    document.getElementById("streamStatus").innerText = "Live: Not available.";
  }
}
