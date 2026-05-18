import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { EMAIL_QUEUE, SendEmailJob } from '@/jobs/queues';

let emailQueue: Queue<SendEmailJob> | null = null;

export async function enqueueEmailJob(data: SendEmailJob) {
  if (!process.env.REDIS_URL) return null;

  if (!emailQueue) {
    emailQueue = new Queue<SendEmailJob>(EMAIL_QUEUE, {
      connection: new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
      }),
    });
  }

  return emailQueue.add('send-email', data);
}
