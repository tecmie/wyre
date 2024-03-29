import logger from './core/logger';
import queue from './queue';
import server from './server';
import { env as secrets } from '@wyrecc/env/worker';

const PORT = secrets.PORT || 8888;

async function main() {
  /* Instantiate the Redis Queue Here */
  queue();

  /* Start & Listen on HTTP Server */
  await server.listen(PORT);
  logger.info(`Running at http://localhost:${PORT}`);
}

process.on('unhandledRejection', (err) => {
  if (err) {
    console.error(err);
    logger.debug(err);
  }
  process.exit(1);
});

main();
