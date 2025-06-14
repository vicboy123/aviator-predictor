// pages/api/recent.js

let savedPredictions = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(savedPredictions);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

// You can link this with `save.js` by using a shared store or database for persistence.
