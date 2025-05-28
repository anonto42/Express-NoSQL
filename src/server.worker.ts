import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';


let server: any;
async function main() {
  try {
    await mongoose.connect(`mongodb://${config.database_user_name}:${config.databse_user_password}@mongo:${config.database_port}/${config.database_name}?authSource=admin`);
    logger.info(colors.green('🚀 Database connected successfully'));
    await seedSuperAdmin();

    const port = Number(config.port);
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`♻️  Worker app running on port:${config.port}`));
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
    errorLogger.error(colors.red('🤢 Failed to connect Database'), error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandleRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();
