const express = require('express');
const connectDB = require('./config/db');
const teamRoutes = require('./routes/teamRoutes');
const debugRoutes = require('./routes/debugRoutes');
const bankRoutes = require('./routes/bankRoutes');
const adminRoutes = require('./routes/adminRoutes')
const questionRoutes = require('./routes/questionRoutes');
const checkEventStatus = require('./middlewares/checkEventStatus');
const cors = require('cors');
const logger = require('./config/logger');

require('dotenv').config();


const requiredEnvVars = ['PORT', 'JWT_SECRET','FRONTEND_URL','MONGO_URI','SOCKET_PORT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        logger.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const HTTP_PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
connectDB();

logger.stream = {
  write: function (message) {
    logger.info(message.trim());
  },
};

// Override logger.log to use winston
logger.log = function (message) {
  logger.info(message);
};

const allowedOrigins = ["https://codopoly-kriya2025.vercel.app", "http://localhost:5173","http://localhost:5174"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            logger.warn(`Blocked request from unauthorized origin: ${origin}`);
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('user-agent')
  });
  next();
});
app.use(checkEventStatus);

app.get('/', (req, res) => {
  res.send('Codopoly Backend is up !');
});
app.use('/debug', debugRoutes);
app.use('/bank', bankRoutes);
app.use('/team', teamRoutes);
app.use('/admin', adminRoutes);
app.use('/question', questionRoutes);

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    route: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  res.status(err.status || 500).send({
    error: {
      message: err.message,
    },
  });
});

app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});




// Start the HTTP server
app.listen(HTTP_PORT, '0.0.0.0',() => {
  console.log(`HTTP Server is running at http://localhost:${HTTP_PORT}`);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
      error: err.message,
      stack: err.stack
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', {
      error: err.message,
      stack: err.stack
  });
  process.exit(1);
});