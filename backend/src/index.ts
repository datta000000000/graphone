import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess } from './lib/response';

import { companiesRouter } from './modules/companies/companies.router';
import { investorsRouter } from './modules/investors/investors.router';
import { productsRouter } from './modules/products/products.router';
import { newsRouter } from './modules/news/news.router';
import { statsRouter } from './modules/stats/stats.router';

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

// Mount modular routers
app.use('/api/v1/companies', companiesRouter);
app.use('/api/v1/investors', investorsRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/stats', statsRouter);

// Global Error Handler (Must be registered last)
app.use(errorHandler);

// Start server
const port = env.PORT;
app.listen(port, () => {
  console.log(`🚀 GraphOne API running on port ${port} in ${env.NODE_ENV} mode`);
});

export default app;
