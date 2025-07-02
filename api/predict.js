async function getServerPrediction() {
  try {
    const res = await fetch('/aviator-prediction');
    const data = await res.json();
    return data.prediction || 'Unavailable';
  } catch (err) {
    console.error('❌ Failed to get prediction:', err);
    return 'Unavailable';
  }
}
