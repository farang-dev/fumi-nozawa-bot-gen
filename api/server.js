const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://farang-dev.github.io', // Update to your GitHub Pages domain
  methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allow POST
}));

app.post('/api/v1/prediction', (req, res) => {
  const { question } = req.body;
  // Example response (replace with Flowise logic)
  res.json({ text: `Response to: ${question}` });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


