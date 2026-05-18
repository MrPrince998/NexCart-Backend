export const EMAIL_QUEUE = 'email-queue';

// Email job types
export interface SendEmailJob {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface SendEmailsJob {
  recipients: Array<{
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
  }>;
}
