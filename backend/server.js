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

// Trust proxy (required for correct client IP detection behind reverse proxies like Render/Vercel)
app.set('trust proxy', 1);

// Configure CORS allowed origins
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, etc.)
    if (!origin) return callback(null, true);
    
    const isOriginAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                            allowedOrigins.includes('*') || 
                            origin.endsWith('.vercel.app') || 
                            /^https?:\/\/[a-zA-Z0-9-_]+\.vercel\.app$/.test(origin);

    if (isOriginAllowed) {
      callback(null, true);
    } else {
      console.warn(`Origin Blocked by CORS: ${origin}`);
      // Pass false to callback to block request via standard CORS header omission instead of throwing Error
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
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
app.use(cors(corsOptions));
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
