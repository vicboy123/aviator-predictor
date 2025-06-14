// /api/predict.js
import { recentCrashes } from './save'; // Reuse in-memory crash data

function weightedPrediction(crashes) {
  if (crashes.length === 0) {
    // No data, return a random safe prediction
    return (Math.random() * 2 + 1).toFixed(2);
  }

  let weightedSum = 0;
  let totalWeight = 0;

  // Use up to the last 10 crash values
  const last10 = crashes.slice(-10);

  last10.forEach((entry, index) => {
    const weight = index + 1; // More recent = more weight
    weightedSum += parseFloat(entry.crash) * weight;
    totalWeight += weight;
  });

  const average = weightedSum / totalWeight;

  // Add slight randomness to simulate real prediction behavior
  const noise = (Math.random() - 0.5) * 0.5;
  const prediction = Math.max(1, average + noise);

  return prediction.toFixed(2);
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const prediction = weightedPrediction(recentCrashes);
    res.status(200).json({ prediction });
  } else {
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }
                 }
