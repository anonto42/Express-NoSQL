import colors from 'colors';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import Database from './DB/db';
import { Seeder } from './DB/seedAdmin';


process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception:', error);
  process.exit(1);
});

let server: any;

async function main() {
  try {
    
    await Database.connect(); 
    await Seeder.seedSuperAdmin(); 

    const port = Number(config.port);
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`♻️ Dev server running on port: ${config.port}`));
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red('❌ Failed to connect to DB in dev'), error);
  }

  process.on('unhandledRejection', error => {
    errorLogger.error('Unhandled Rejection:', error);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down...');
  if (server) server.close();
});
