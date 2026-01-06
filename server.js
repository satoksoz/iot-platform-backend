const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'IoT Backend Working!',
    endpoints: ['/api/register', '/api/telemetry']
  });
});

app.post('/api/register', (req, res) => {
  const deviceId = 'ESP32-' + Date.now();
  const authToken = Math.random().toString(36).substr(2);
  res.json({
    success: true,
    device_id: deviceId,
    auth_token: authToken
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});