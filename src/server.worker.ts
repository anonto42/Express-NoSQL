import colors from 'colors';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import Database from './DB/db';
import { Seeder } from './DB/seedAdmin';

let server: any;

async function main() {
  try {
    await Database.connect(); 
    await Seeder.seedSuperAdmin(); 

    const port = Number(config.port);
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`♻️ Server running on port: ${port}`));
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: { origin: '*' },
    });

    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;

  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to start server'), error);
    process.exit(1);
  }
}

// Handle unhandled rejections globally
process.on('unhandledRejection', error => {
  errorLogger.error('Unhandled Rejection detected', error);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

main();
