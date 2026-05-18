import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import * as crypto from 'crypto';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // client calls this first tog get signed params
  @Get('sign')
  getSignedParams() {
    return this.cloudinaryService.generateSignedUploadParams();
  }

  // cloudinary calls this after every successful upload
  @Post('webhook')
  async handleWebHook(
    @Body() payload: any,
    @Headers('x-cld-signature') signature: string,
    @Headers('x-cld-timestamp') timestamp: string,
  ) {
    this.verifyWebhookSignature(payload, signature, timestamp);

    const { public_id, tags, secure_url, bytes, format } = payload;
    this.logger.log(`Received webhook for ${public_id} with tags ${tags}`);

    return { received: true };
  }

  // Verify Clodinary's HMAC signature
  private verifyWebhookSignature(
    body: any,
    signature: string,
    timestamp: string,
  ) {
    const payload = JSON.stringify(body) + timestamp;
    const expected = crypto
      .createHmac('sha256', process.env.CLOUDINARY_WEBHOOK_SECRET!)
      .update(payload)
      .digest('hex');

    if (expected !== signature) {
      throw new UnauthorizedException('Invalid Cloudinary webhook signature');
    }
  }
}
