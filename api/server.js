// api/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Allow your frontend origins
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

// Handle CORS pre-flight requests
app.options('/api/v1/prediction/:id', cors());

// Proxy request to Flowise API
app.post('/api/v1/prediction/:id', async (req, res) => {
  const { question } = req.body;
  const apiKey = process.env.FLOWISE_API_KEY;
  const flowiseUrl = `https://flowise-688733622589.us-east1.run.app/api/v1/prediction/${req.params.id}`;

  console.log('API Key:', apiKey);
  console.log('Flowise URL:', flowiseUrl);
  console.log('Request Body:', { question });

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
    console.log('Flowise Response:', flowiseResponse.data);
    res.json(flowiseResponse.data);
  } catch (error) {
    console.error('Flowise API error:', error.response?.data || error.message);
    res.status(500).json({ text: 'Error connecting to Flowise API' });
  }
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running, proxying to Flowise' });
});

// Use Vercel’s port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});