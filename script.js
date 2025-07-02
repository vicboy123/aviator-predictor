let balance = 05;
let historyList = [];

window.onload = function() {
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

async function predictAndBet() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  const target = parseFloat(document.getElementById("targetMultiplier").value);

  if (isNaN(bet) || isNaN(target) || bet <= 0 || bet > balance) {
    document.getElementById("status").innerText = "⚠️ Invalid bet or target.";
    return;
  }

  document.getElementById("status").innerText = "🔍 Fetching prediction...";
  document.getElementById("prediction").innerText = "--";
  document.getElementById("result").innerText = "--";

  const predicted = await getServerPrediction();

  // Simulated actual crash logic
  const rand = Math.random();
  const actual = rand < 0.01 ? 1.00 : +(Math.floor((1 / (1 - rand)) * 100) / 100).toFixed(2);

  const win = actual >= target;
  const resultText = win
    ? `✅ WIN! You got R${(bet * target).toFixed(2)}`
    : `❌ Lost R${bet}`;

  balance += win ? (bet * target) - bet : -bet;

  document.getElementById("status").innerText = `🎯 Target: ${target}x`;
  document.getElementById("prediction").innerText = `AI Predicts: ${predicted}`;
  document.getElementById("result").innerText = `💥 Crashed at: ${actual}x → ${resultText}`;
  updateBalance();

  const now = new Date().toLocaleTimeString();
  historyList.unshift(`${now} → Bet: R${bet} @ ${target}x → Crash: ${actual}x → ${win ? 'WIN' : 'LOSE'}`);
  if (historyList.length > 10) historyList.pop();

  updateHistory();
  saveData();
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
