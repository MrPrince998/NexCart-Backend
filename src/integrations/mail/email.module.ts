import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EMAIL_QUEUE } from '../../jobs/queues/email.queue';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,

    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
