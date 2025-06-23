
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3002',
    'http://localhost:8080',
    'http://localhost:8083',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3002',
    'http://localhost:8080',
    'http://127.0.0.1:8080'

  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

module.exports = cors(corsOptions);
