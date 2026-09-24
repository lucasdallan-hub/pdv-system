const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do React em produção
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Import Database
const db = require('./database/db');

// Initialize Database
db.initialize();

// Import Routes
const salesRoutes = require('./routes/sales');
const receiveRoutes = require('./routes/receives');
const paymentRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');
const whatsappRoutes = require('./routes/whatsapp');
const customersRoutes = require('./routes/customers');

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/receives', receiveRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/customers', customersRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// Fallback para SPA em produção
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    }
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PDV System running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  if (NODE_ENV === 'development') {
    console.log(`📊 Dashboard: http://localhost:3000`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
  }
});
