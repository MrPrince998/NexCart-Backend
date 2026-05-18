export const INVOICE_QUEUE = 'invoice-queue';

// Invoice job types
export interface GenerateInvoiceJob {
  orderId: string;
  userId: string;
  emailTo: string;
}

export interface ExportInvoicesJob {
  format: 'pdf' | 'csv';
  filters: Record<string, any>;
  emailTo: string;
}
