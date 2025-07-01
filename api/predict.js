// predict.js — Level 5 Prediction Engine

function calculatePrediction(parts) { const mean = parts.reduce((a, b) => a + b, 0) / parts.length; const variance = parts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / parts.length; const stdDev = Math.sqrt(variance);

let prediction = mean + (Math.random() - 0.5) * stdDev; prediction = Math.max(1.00, Math.min(prediction, 10)).toFixed(2);

const zScore = (prediction - mean) / stdDev; const confidence = (1 - Math.min(Math.abs(zScore) / 3, 1)) * 100;

return { prediction: parseFloat(prediction), confidence: parseFloat(confidence.toFixed(1)) }; }

module.exports = { calculatePrediction };

