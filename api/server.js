const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://farang-dev.github.io', // Your GitHub Pages URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.post('/api/v1/prediction/:id', async (req, res) => {
  const { question } = req.body;
  const apiKey = process.env.FLOWISE_API_KEY;
  const flowiseUrl = process.env.FLOWISE_API_URL || 'https://flowise-688733622589.us-east1.run.app/api/v1/prediction/b01ef746-e7cd-4c13-a10b-5eb0ed925dec';

  try {
    const flowiseResponse = await axios.post(
      flowiseUrl,
      { question },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`, // Fixed syntax with template literals
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

app.get('/', (req, res) => {
  res.json({ message: 'API is running, proxying to Flowise' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});