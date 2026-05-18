import { Logger, Module } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { EMAIL_QUEUE, INVOICE_QUEUE, NOTIFICATION_QUEUE } from './queues';

type JobData = Record<string, unknown>;

function createNoopQueue(queueName: string) {
  const logger = new Logger(`NoopQueue:${queueName}`);

  return {
    async add(jobName: string, data: JobData) {
      logger.warn(
        `Skipped job "${jobName}" because REDIS_URL is not configured`,
      );

      return {
        id: `noop:${queueName}:${jobName}:${Date.now()}`,
        name: jobName,
        data,
      };
    },
  };
}

@Module({
  providers: [
    {
      provide: getQueueToken(EMAIL_QUEUE),
      useValue: createNoopQueue(EMAIL_QUEUE),
    },
    {
      provide: getQueueToken(INVOICE_QUEUE),
      useValue: createNoopQueue(INVOICE_QUEUE),
    },
    {
      provide: getQueueToken(NOTIFICATION_QUEUE),
      useValue: createNoopQueue(NOTIFICATION_QUEUE),
    },
  ],
  exports: [
    getQueueToken(EMAIL_QUEUE),
    getQueueToken(INVOICE_QUEUE),
    getQueueToken(NOTIFICATION_QUEUE),
  ],
})
export class NoopJobsModule {}
