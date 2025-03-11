const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Allow both your Vercel app and GitHub Pages
const allowedOrigins = [
  'https://farang-dev.github.io',
  'https://fumi-nozawa-bot-gen.vercel.app',
];

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Proxy request to Flowise API
app.post('/api/v1/prediction/:id', async (req, res) => {
  const { question } = req.body;
  const apiKey = process.env.FLOWISE_API_KEY;
  const flowiseUrl = process.env.FLOWISE_API_URL || `https://flowise-688733622589.us-east1.run.app/api/v1/prediction/${req.params.id}`;

  try {
    const flowiseResponse = await axios.post(
      flowiseUrl,
      { question },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(flowiseResponse.data);
  } catch (error) {
    console.error('Flowise API error:', error.message);
    res.status(500).json({ text: 'Error connecting to Flowise API' });
  }
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running, proxying to Flowise' });
});

// Use Cloud Run's provided port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
