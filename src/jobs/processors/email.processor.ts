import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EMAIL_QUEUE, SendEmailJob, SendEmailsJob } from '../queues';

/**
 * Email Processor
 * Handles async email sending jobs from the email queue
 * Integrates with email service for actual sending
 */
@Injectable()
@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<SendEmailJob | SendEmailsJob>): Promise<any> {
    try {
      if (job.name === 'send-email') {
        return await this.handleSendEmail(job as Job<SendEmailJob>);
      } else if (job.name === 'send-bulk-emails') {
        return await this.handleSendBulkEmails(job as Job<SendEmailsJob>);
      }
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed:`, error);
      throw error; // Bull will retry based on config
    }
  }

  private async handleSendEmail(job: Job<SendEmailJob>) {
    this.logger.log(`Processing email job: ${job.id} to ${job.data.to}`);

    // TODO: Implement actual email sending logic
    // Example:
    // await this.emailService.send({
    //   to: job.data.to,
    //   subject: job.data.subject,
    //   template: job.data.template,
    //   data: job.data.data,
    // });

    this.logger.log(`Email job ${job.id} completed`);
    return { success: true, jobId: job.id };
  }

  private async handleSendBulkEmails(job: Job<SendEmailsJob>) {
    this.logger.log(
      `Processing bulk email job: ${job.id} with ${job.data.recipients.length} recipients`,
    );

    // TODO: Send emails in parallel with concurrency control
    // const results = await Promise.allSettled(
    //   job.data.recipients.map((recipient) =>
    //     this.emailService.send({
    //       to: recipient.to,
    //       subject: recipient.subject,
    //       template: recipient.template,
    //       data: recipient.data,
    //     })
    //   )
    // );

    this.logger.log(`Bulk email job ${job.id} completed`);
    return { success: true, jobId: job.id };
  }
}
