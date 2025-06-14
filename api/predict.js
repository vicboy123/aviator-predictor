// pages/api/predict.js

export default function handler(req, res) {
  const min = 1.00;
  const max = 5.00;

  // Generate a random number between 1.00 and 5.00
  const prediction = (Math.random() * (max - min) + min).toFixed(2);
  res.status(200).json({ prediction });
}
