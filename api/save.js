let crashHistory = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { crash, time } = req.body;

  if (!crash || isNaN(crash)) {
    return res.status(400).json({ error: 'Invalid crash value' });
  }

  crashHistory.unshift({ crash: parseFloat(crash), time });
  if (crashHistory.length > 100) crashHistory.pop();

  return res.status(200).json({ success: true, recent: crashHistory.slice(0, 10) });
      }
