import cluster from 'cluster';
import os from 'os';
import colors from 'colors';

export const startCluster = () => {
  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(colors.cyan(`Primary ${process.pid} is running`));
    console.log(colors.magenta(`🚀 Forking for ${numCPUs} CPUs\n`));

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(colors.red(`Worker ${worker.process.pid} died. Restarting...`));
      cluster.fork();
    });
  } else {
    require('./server.worker');
  }
};
