import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  INVOICE_QUEUE,
  GenerateInvoiceJob,
  ExportInvoicesJob,
} from '../queues';

/**
 * Invoice Processor
 * Handles async invoice generation and export jobs
 * Integrates with invoice and storage services
 */
@Injectable()
@Processor(INVOICE_QUEUE)
export class InvoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(InvoiceProcessor.name);

  async process(
    job: Job<GenerateInvoiceJob | ExportInvoicesJob>,
  ): Promise<any> {
    try {
      if (job.name === 'generate-invoice') {
        return await this.handleGenerateInvoice(job as Job<GenerateInvoiceJob>);
      } else if (job.name === 'export-invoices') {
        return await this.handleExportInvoices(job as Job<ExportInvoicesJob>);
      }
    } catch (error) {
      this.logger.error(`Invoice job ${job.id} failed:`, error);
      throw error;
    }
  }

  private async handleGenerateInvoice(job: Job<GenerateInvoiceJob>) {
    this.logger.log(
      `Processing invoice generation job: ${job.id} for order ${job.data.orderId}`,
    );

    // TODO: Implement invoice generation logic
    // Example:
    // const invoice = await this.invoiceService.generate({
    //   orderId: job.data.orderId,
    //   userId: job.data.userId,
    // });
    //
    // // Send email with invoice
    // await this.emailQueue.add('send-email', {
    //   to: job.data.emailTo,
    //   subject: 'Your Invoice',
    //   template: 'invoice',
    //   data: { invoiceUrl: invoice.url },
    // });

    this.logger.log(`Invoice generation job ${job.id} completed`);
    return { success: true, jobId: job.id };
  }

  private async handleExportInvoices(job: Job<ExportInvoicesJob>) {
    this.logger.log(
      `Processing invoice export job: ${job.id} in ${job.data.format} format`,
    );

    // TODO: Implement bulk invoice export logic
    // Example:
    // const filePath = await this.invoiceService.exportInvoices({
    //   format: job.data.format,
    //   filters: job.data.filters,
    // });
    //
    // // Send to user via email
    // await this.emailQueue.add('send-email', {
    //   to: job.data.emailTo,
    //   subject: 'Invoices Export',
    //   template: 'invoice-export',
    //   data: { downloadUrl: filePath },
    // });

    this.logger.log(`Invoice export job ${job.id} completed`);
    return { success: true, jobId: job.id };
  }
}
