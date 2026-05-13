import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EMAIL_QUEUE } from '../../jobs/queues/email.queue';

@Module({
  imports: [
    ConfigModule,

    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class EmailModule {}
