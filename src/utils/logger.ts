function createLogLevel(name: string, level: string) {
  return (...content: unknown[]) => {
    console.log(`[${name}]${level}:`, ...content);
  };
}

class Logger {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  private level(level: string) {
    return createLogLevel(this.name, level);
  }

  trace = this.level('trace');
  log = this.level('log');
  error = this.level('error');
}
const logger = new Logger('pnpm-lock-goto-logger');

function exit(message: string) {
  logger.error(message);
  throw new Error(message);
}
export { logger, exit };
