export const crashHistory = [];

export default function handler(req, res) {
  res.status(200).json({
    recent: crashHistory.slice(0, 20),
    total: crashHistory.length
  });
}
