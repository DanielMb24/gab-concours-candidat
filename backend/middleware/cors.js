
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3002',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3002',
    'http://localhost:8088',
    'http://127.0.0.1:8088'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

module.exports = cors(corsOptions);
