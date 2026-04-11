require('dotenv').config();

const express = require('express');
const { port } = require('./src/config/env');
const loggerMiddleware = require('./src/middlewares/logger');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler');
const healthRoutes = require('./src/routes/health.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(healthRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`api-gateway listening on port ${port}`);
});