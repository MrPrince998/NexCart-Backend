import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async mine(userId: string) {
    return successResponse(
      await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      }),
      'Notifications retrieved successfully',
    );
  }

  async markRead(userId: string, id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id, userId } });
    if (!notification) throw new NotFoundException('Notification not found');
    notification.isRead = true;
    return successResponse(await this.notificationRepository.save(notification), 'Notification marked as read');
  }

  async markAllRead(userId: string) {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    return emptyReponse('Notifications marked as read');
  }
}
