const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://farang-dev.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.post('/api/v1/prediction/:id', async (req, res) => {
  const { question } = req.body;
  const apiKey = process.env.FLOWISE_API_KEY;

  try {
    const flowiseResponse = await axios.post(
      'https://flowise-kjea.onrender.com/api/v1/prediction/b01ef746-e7cd-4c13-a10b-5eb0ed925dec', // Replace with actual Flowise URL and ID
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

app.get('/', (req, res) => {
  res.json({ message: 'API is running, proxying to Flowise' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});