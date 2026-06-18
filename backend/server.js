const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const { apiLimiter, authLimiter, aiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }
});

// Attach Socket.io instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Configure Socket.io connections
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join user room for private events/toasts
  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);
    }
  });

  // Join story room for story updates
  socket.on('join_story', (storyId) => {
    if (storyId) {
      socket.join(`story_${storyId}`);
      console.log(`Socket ${socket.id} joined room story_${storyId}`);
    }
  });

  // Leave story room
  socket.on('leave_story', (storyId) => {
    if (storyId) {
      socket.leave(`story_${storyId}`);
      console.log(`Socket ${socket.id} left room story_${storyId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate Limiters
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));
app.use('/api/contributions', require('./routes/contributionRoutes'));
app.use('/api/ai', aiLimiter, require('./routes/aiRoutes'));
app.use('/api/dashboard', require('./routes/analyticsRoutes'));

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Collaborative Story Platform API' });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Route - ${req.originalUrl} Not Found` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
