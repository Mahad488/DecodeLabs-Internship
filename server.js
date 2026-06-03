require('dotenv').config();
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { connectMongo } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// --- 1. API ROUTES (Sabse pehle) ---

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Watches', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80' }
  ]);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }
  res.json({ status: 'success', message: 'Message received!', data: { name, email } });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- 2. PAGE ROUTES ---

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- 3. STATIC FILES ---
app.use(express.static(__dirname));

// --- 4. 404 HANDLER ---
app.use((req, res) => {
  console.log(`⚠️ 404 Error for: ${req.method} ${req.url}`);
  res.status(404).send(`Resource not found: ${req.url}`);
});

(async () => {
  try {
    await connectMongo();
    console.log('✅ MongoDB connected, continuing startup');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed; starting server without MongoDB:', err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 SmartShop Backend API running at http://localhost:${PORT}`);
    console.log(`🏠 Website URL: http://localhost:${PORT}`);
    console.log(`🛠️  API Endpoints Registered:`);
    console.log(`   - [POST] /api/users/register (Registration)`);
    console.log(`   - [POST] /api/users/login    (Login)`);
    console.log(`   - [GET]  /api/users          (List Users)`);
    console.log(`   - [GET]  /api/categories     (Categories)`);
    console.log(`   - [CRUD] /api/products       (Local JSON products)`);
  });
})();
