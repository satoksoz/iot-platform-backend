// KESİN ÇALIŞAN ESP32 IoT BACKEND v6.0
// Created for: satoksoz
// Date: 2024-01-06

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK - ESP32 BUNU TEST EDİYOR
app.get('/health', (req, res) => {
  console.log('🏥 Health check - OK');
  res.json({
    status: 'healthy',
    service: 'iot-backend',
    timestamp: new Date().toISOString(),
    version: '6.0',
    message: 'Backend is running and ready for ESP32'
  });
});

// 2. ROOT ENDPOINT - INFO
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ESP32 IoT Platform Backend - SATOKSOZ',
    version: '6.0',
    endpoints: {
      health: 'GET /health',
      register: 'POST /api/register',
      telemetry: 'POST /api/telemetry'
    },
    instructions: 'Use these endpoints with your ESP32 device'
  });
});

// 3. DEVICE REGISTRATION - ESP32 KAYIT
app.post('/api/register', (req, res) => {
  try {
    console.log('📝 Device registration request:', req.body);
    
    // Validation
    if (!req.body.email || !req.body.device_name) {
      return res.status(400).json({
        success: false,
        error: 'Email and device_name are required'
      });
    }
    
    // Generate unique device ID
    const deviceId = 'ESP32-' + Date.now();
    
    // Generate auth token
    const authToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    console.log(`✅ New device registered: ${deviceId}`);
    
    res.json({
      success: true,
      device_id: deviceId,
      auth_token: authToken,
      message: 'Device registered successfully',
      created_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
});

// 4. TELEMETRY ENDPOINT - ESP32 VERİ GÖNDERİMİ
app.post('/api/telemetry', (req, res) => {
  try {
    console.log('📡 Telemetry data received');
    
    // Check for X-Auth-Token header
    const authToken = req.headers['x-auth-token'];
    if (!authToken) {
      return res.status(401).json({
        success: false,
        error: 'X-Auth-Token header is required'
      });
    }
    
    // Validate required fields
    if (!req.body.device_id) {
      return res.status(400).json({
        success: false,
        error: 'device_id is required'
      });
    }
    
    // Log the received data
    console.log('Device:', req.body.device_id);
    console.log('Temperature:', req.body.temperature || 'N/A');
    console.log('Humidity:', req.body.humidity || 'N/A');
    console.log('Battery:', req.body.battery || 'N/A');
    console.log('RSSI:', req.body.rssi || 'N/A');
    
    // Successful response
    res.json({
      success: true,
      message: 'Telemetry data received successfully',
      device_id: req.body.device_id,
      data: {
        temperature: req.body.temperature || null,
        humidity: req.body.humidity || null,
        battery: req.body.battery || null,
        rssi: req.body.rssi || null
      },
      received_at: new Date().toISOString(),
      server: 'satoksoz-iot-backend'
    });
    
  } catch (error) {
    console.error('❌ Telemetry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process telemetry data'
    });
  }
});

// 5. ALTERNATIVE ENDPOINT - /telemetry (without /api prefix)
app.post('/telemetry', (req, res) => {
  console.log('📡 Telemetry via /telemetry endpoint');
  res.json({
    success: true,
    message: 'Data received via /telemetry endpoint',
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

// 6. 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET  /',
      'GET  /health',
      'POST /api/register',
      'POST /api/telemetry',
      'POST /telemetry'
    ],
    help: 'Check the documentation or use GET / for available endpoints'
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 ESP32 IoT BACKEND v6.0');
  console.log('========================================');
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Telemetry: http://localhost:${PORT}/api/telemetry`);
  console.log(`📡 Alternative: http://localhost:${PORT}/telemetry`);
  console.log('📱 Ready for ESP32 connections!');
  console.log('========================================');
});
