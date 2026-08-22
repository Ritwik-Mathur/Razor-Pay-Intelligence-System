export const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[RPAI INFO] [${new Date().toISOString()}] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[RPAI WARN] [${new Date().toISOString()}] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[RPAI ERROR] [${new Date().toISOString()}] ${msg}`, ...args),
  debug: (msg: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[RPAI DEBUG] [${new Date().toISOString()}] ${msg}`, ...args);
    }
  },
};
