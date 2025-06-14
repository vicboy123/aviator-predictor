// pages/api/save.js

let savedPredictions = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { prediction } = req.body;

    if (!prediction) {
      return res.status(400).json({ message: "Missing prediction" });
    }

    savedPredictions.unshift({
      prediction,
      time: new Date().toISOString(),
    });

    if (savedPredictions.length > 20) {
      savedPredictions = savedPredictions.slice(0, 20);
    }

    res.status(200).json({ message: "Saved", prediction });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
