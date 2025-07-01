let balance = 10.0; let historyList = [];

window.onload = function () { const saved = localStorage.getItem("aviator_data"); if (saved) { const data = JSON.parse(saved); balance = data.balance || 10; historyList = data.history || []; updateBalance(); updateHistory(); } connectLiveData(); };

function saveData() { localStorage.setItem( "aviator_data", JSON.stringify({ balance, history: historyList }) ); }

function updateBalance() { document.getElementById("balance").innerText = 💰 Balance: R${balance.toFixed( 2 )}; }

function updateHistory() { document.getElementById("historyList").innerHTML = historyList .map((i) => <div class="item">${i}</div>) .join(""); }

function calculatePrediction(parts) { const mean = parts.reduce((a, b) => a + b, 0) / parts.length; const variance = parts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / parts.length; const stdDev = Math.sqrt(variance);

let prediction = mean + (Math.random() - 0.5) * stdDev; prediction = Math.max(1.00, Math.min(prediction, 10)).toFixed(2);

const zScore = (prediction - mean) / stdDev; const confidence = (1 - Math.min(Math.abs(zScore) / 3, 1)) * 100;

return { prediction, confidence: confidence.toFixed(1) }; }

function predictAndBet() { const input = document.getElementById("inputData").value; const parts = input .split(",") .map((x) => parseFloat(x.trim())) .filter((x) => !isNaN(x));

const bet = parseFloat(document.getElementById("betAmount").value); const target = parseFloat( document.getElementById("targetMultiplier").value );

if (parts.length < 5 || isNaN(bet) || isNaN(target)) { document.getElementById("status").innerText = "⚠️ Enter at least 5 valid crash multipliers."; return; }

if (bet > balance || bet <= 0) { document.getElementById("status").innerText = "❌ Invalid or insufficient bet."; return; }

document.getElementById("status").innerText = "🔍 Calculating..."; document.getElementById("prediction").innerText = "--"; document.getElementById("result").innerText = "--";

setTimeout(() => { const { prediction, confidence } = calculatePrediction(parts);

const rand = Math.random();
const actual = rand < 0.01 ? 1.0 : +(Math.floor((1 / (1 - rand)) * 100) / 100).toFixed(2);
const win = actual >= target;
const resultText = win
  ? `✅ WIN! You got R${(bet * target).toFixed(2)}`
  : `❌ Lost R${bet.toFixed(2)}`;

balance += win ? bet * (target - 1) : -bet;

document.getElementById("status").innerText = `🎯 Target: ${target}x`;
document.getElementById("prediction").innerText = `🤖 Predicted: ${prediction}x | Confidence: ${confidence}%`;
document.getElementById("result").innerText = `💥 Crashed at: ${actual}x → ${resultText}`;

const now = new Date().toLocaleTimeString();
historyList.unshift(
  `${now} → Bet: R${bet} @ ${target}x → Crash: ${actual}x → ${
    win ? "WIN" : "LOSE"
  }`
);
if (historyList.length > 10) historyList.pop();

updateBalance();
updateHistory();
saveData();

}, 1500); }

function resetAll() { if (confirm("Reset all data?")) { balance = 10; historyList = []; updateBalance(); updateHistory(); localStorage.removeItem("aviator_data"); document.getElementById("status").innerText = "🔄 Reset complete."; document.getElementById("prediction").innerText = "--"; document.getElementById("result").innerText = "--"; } }

function connectLiveData() { try { const source = new EventSource("/api/stream"); source.onmessage = function (event) { const data = JSON.parse(event.data); if (data && data.crash) { document.getElementById("streamStatus").innerText = Live: Last crash ${data.crash}x; } }; source.onerror = function () { document.getElementById("streamStatus").innerText = "Live: Connection failed."; }; } catch (e) { document.getElementById("streamStatus").innerText = "Live: Not available."; } }

