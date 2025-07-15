const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from server-side!');
});

// Example endpoint for your function
app.get('/api/my-function', (req, res) => {
  // Run your function logic here
  res.json({ result: 'Function output here' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

