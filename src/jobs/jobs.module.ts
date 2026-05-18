import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { EMAIL_QUEUE, NOTIFICATION_QUEUE, INVOICE_QUEUE } from './queues';
import { EmailProcessor } from './processors/email.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { InvoiceProcessor } from './processors/invoice.processor';

/**
 * Jobs Module - BullMQ Queue Configuration
 * Handles asynchronous job processing for:
 * - Email sending
 * - Notifications
 * - Invoice generation
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: EMAIL_QUEUE },
      { name: NOTIFICATION_QUEUE },
      { name: INVOICE_QUEUE },
    ),
  ],
  providers: [EmailProcessor, NotificationProcessor, InvoiceProcessor],
  exports: [BullModule],
})
export class JobsModule {}
