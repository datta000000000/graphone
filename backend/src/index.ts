import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess } from './lib/response';

const app = express();

// CORS configuration
const corsOrigin = env.NODE_ENV === 'development' ? '*' : env.CORS_ORIGIN;
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  sendSuccess(res, { status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount modular routers here in future phases

// Global Error Handler (Must be registered last)
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  console.log(`🚀 GraphOne API running on port ${port} in ${env.NODE_ENV} mode`);
});

export default app;
