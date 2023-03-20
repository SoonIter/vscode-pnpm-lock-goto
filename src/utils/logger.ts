const logger = {
  trace: (...content: unknown[]) => {
    console.log('[pnpm-lock-goto-logger]trace:', ...content);
  },
  log: (...content: unknown[]) => {
    console.log('[pnpm-lock-goto-logger]log:', ...content);
  },
};
export { logger };
