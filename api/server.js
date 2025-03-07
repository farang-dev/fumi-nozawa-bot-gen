const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://<your-username>.github.io', // Replace with your GitHub Pages URL
}));

app.post('/api/v1/prediction/:id', (req, res) => {
  const expectedApiKey = process.env.FLOWISE_API_KEY;
  // Simulate Flowise API response
  // In a real Flowise setup, this would handle the prediction logic
  res.json({ text: 'Response from Flowise API' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});