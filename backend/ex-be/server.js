// server.js
const express = require('express');
const app = express();
const PORT = 5000;

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/tweets', (req, res) => {
  res.json([
    { id: 1, user: 'elon', text: 'Building rockets 🚀' },
    { id: 2, user: 'jack', text: 'Decentralized social FTW' },
  ]);
});

app.listen(PORT, () => {
  console.log(`🟢 Backend API running at http://localhost:${PORT}`);
});
