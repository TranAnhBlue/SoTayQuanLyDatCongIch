const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        user: req.user?.id || 'No user'
    });
    next();
});

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
