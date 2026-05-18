export const NOTIFICATION_QUEUE = 'notification-queue';

// Notification job types
export interface SendNotificationJob {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: Record<string, any>;
}

export interface SendPushNotificationJob {
  userIds: string[];
  title: string;
  body: string;
  deepLink?: string;
}

export interface SendBulkNotificationJob {
  recipients: string[];
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
