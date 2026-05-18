import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { otpTemplate } from './templates/otp.template';
import {
  orderReceiptTemplate,
  OrderReceiptTemplateData,
} from './templates/order-receipt.template';
import { passwordResetTemplate } from './templates/password-reset.template';
import { aboutAppTemplate } from './templates/about-app.template';
import { reviewRequestTemplate } from './templates/review-request.template';
import { sellerApprovedTemplate } from './templates/seller-approved.template';
import { statusUpdateTemplate } from './templates/status-update.template';
import { verificationTemplate } from './templates/verification.template';
import { welcomeTemplate } from './templates/welcome.template';

export interface SendEmailInput {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

type TemplateData = Record<string, unknown>;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(input: SendEmailInput) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL');
    const fromName =
      this.configService.get<string>('RESEND_FROM_NAME') ?? 'NexCart';

    if (!apiKey || !fromEmail) {
      this.logger.warn(
        `Email skipped for ${input.to}: Resend is not configured`,
      );
      return { skipped: true };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: input.to,
        subject: input.subject,
        html: this.renderTemplate(input.template, input.data),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend email failed (${response.status}): ${body}`);
    }

    return (await response.json()) as unknown;
  }

  private renderTemplate(template: string, data: Record<string, any>) {
    const templateData = data as TemplateData;

    switch (template) {
      case 'welcome':
        return welcomeTemplate(
          this.toString(templateData.userName ?? templateData.name),
        );
      case 'about-app':
        return aboutAppTemplate(
          this.toString(templateData.userName ?? templateData.name),
        );
      case 'verify-email':
        return verificationTemplate(
          this.toString(templateData.userName ?? templateData.name),
          this.toString(templateData.verificationLink),
        );
      case 'password-reset':
        return passwordResetTemplate(
          this.toString(templateData.userName ?? templateData.name),
          this.toString(templateData.resetLink),
        );
      case 'otp':
        return otpTemplate(
          this.toString(templateData.userName ?? templateData.name),
          this.toString(templateData.otp),
        );
      case 'order-receipt':
        return orderReceiptTemplate(data as OrderReceiptTemplateData);
      case 'seller-approved':
        return sellerApprovedTemplate(
          this.toString(templateData.userName ?? templateData.name),
          this.toString(templateData.sellerDashboardUrl),
        );
      case 'status-update':
        return statusUpdateTemplate({
          userName: this.toString(templateData.userName ?? templateData.name),
          title: this.toString(templateData.title, 'Status update'),
          message: this.toString(templateData.message, ''),
          actionUrl: this.optionalString(templateData.actionUrl),
          actionText: this.optionalString(templateData.actionText),
        });
      case 'review-request':
        return reviewRequestTemplate(
          this.toString(templateData.userName ?? templateData.name),
          this.toString(templateData.orderNumber),
          this.toString(templateData.reviewUrl),
        );
      case 'email-verified':
        return verificationTemplate(
          this.toString(
            templateData.userName ?? templateData.name ?? templateData.email,
          ),
          this.toString(templateData.dashboardUrl),
          'Your email has been verified',
          'You can now continue to your dashboard.',
          'Go to Dashboard',
        );
      case 'farewell':
        return welcomeTemplate(
          this.toString(templateData.userName),
          'Your NexCart account has been closed.',
        );
      case 'account-blocked':
      case 'account-suspended':
      case 'account-active':
        return welcomeTemplate(
          this.toString(templateData.email),
          `Your account status is now ${this.toString(templateData.status)}.`,
        );
      default:
        return welcomeTemplate(
          this.toString(templateData.userName ?? templateData.name),
        );
    }
  }

  private toString(value: unknown, fallback = 'there') {
    return typeof value === 'string' && value.length > 0 ? value : fallback;
  }

  private optionalString(value: unknown) {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
}
