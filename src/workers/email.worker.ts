import { Worker } from "bullmq";
import { redisConfig } from "../config/redis";

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);

    // Example email sending logic
    const { to, subject, body } = job.data;
    // await emailHelper.sendEmail({ to, subject, body });

    return { status: "sent", to };
  },
  { connection: redisConfig }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});
