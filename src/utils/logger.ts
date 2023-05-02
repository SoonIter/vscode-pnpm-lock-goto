import { logger as createLogger, streamParser } from '@pnpm/logger';
import { blue, gray, red, yellow } from 'picocolors';

const logger = createLogger('pnpm-lock-goto-logger');

function exit(message: string) {
  logger.error(new Error(message));
  throw new Error(message);
}

streamParser.on('data', (msg: any) => {
  switch (msg.level) {
    case 'error':
      console.log(red('ERROR'), msg?.name);
      break;
    case 'debug':
      console.log(gray('debug'), msg?.name, msg);
      break;
    case 'warn':
      console.log(yellow('warn'), msg?.name);
      break;
    case 'info':
      console.log(blue('info'), msg?.name, msg?.prefix, msg?.message);
      break;
  }
});

export { logger, exit };
