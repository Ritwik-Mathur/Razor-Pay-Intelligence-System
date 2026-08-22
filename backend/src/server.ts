import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

async function startServer() {
  await connectDB();
  
  app.listen(ENV.PORT, () => {
    logger.info(`==================================================`);
    logger.info(` RPAI Server running on port ${ENV.PORT}`);
    logger.info(` Mode: ${ENV.NODE_ENV}`);
    logger.info(` Health Check: http://localhost:${ENV.PORT}/health`);
    logger.info(`==================================================`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to launch RPAI server', err);
});
