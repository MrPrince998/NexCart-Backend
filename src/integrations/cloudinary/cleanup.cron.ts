import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CloudinaryCleanupCron {
  private readonly logger = new Logger(CloudinaryCleanupCron.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    this.logger.log('Starting Cloudinary cleanup task');

    await this.cloudinaryService.purgeOrphanedPendingUploads(7);

    this.logger.log('Cloudinary cleanup task completed');
  }
}
