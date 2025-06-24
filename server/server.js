// server/server.js

require('dotenv').config();            // Load .env into process.env
const express = require('express');
const cors    = require('cors');
const db      = require('./database'); // your ./database.js connection module
const app     = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*'    // adjust to your front-end domain for production
}));
app.use(express.json());               // parse JSON bodies

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Mount your controllers (assuming they export an Express router)
// e.g. server/controllers/userController.js → router handling /users
const userRoutes = require('./controllers/userController');
app.use('/api/users', userRoutes);

// (Repeat for other controllers)
// const authRoutes = require('./controllers/authController');
// app.use('/api/auth', authRoutes);

// Connect to DB and then start server
db.authenticate()                     // if you’re using Sequelize
  .then(() => {
    console.log('🔥 Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1);
  });
