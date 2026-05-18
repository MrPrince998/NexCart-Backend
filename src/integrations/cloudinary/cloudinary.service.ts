import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  generateSignedUploadParams(folder = 'temp') {
    const uploadId = uuidv4();
    const publicId = `${folder}/${uploadId}`;
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      folder,
      tags: 'pending',
      upload_preset: undefined,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      uploadId,
      publicId,
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }

  // After form submit: move temp -> permanent & tag as active
  async activateImage(tempPublicId: string): Promise<UploadApiResponse> {
    const newPublicId = tempPublicId.replace('temp/', 'products/');

    // Rename (move folder) + replace tag pending -> active
    const result = await cloudinary.uploader.rename(tempPublicId, newPublicId);

    await cloudinary.uploader.replace_tag('active', [newPublicId]);
    await cloudinary.uploader.remove_tag('pending', [newPublicId]);

    return result;
  }

  // Activate multiple images in parallel
  async activateImages(tempPublicIds: string[]): Promise<UploadApiResponse[]> {
    return Promise.all(tempPublicIds.map((id) => this.activateImage(id)));
  }

  // Delete a single image by publicId
  async deleteImage(publicId: string): Promise<void> {
    return await cloudinary.uploader.destroy(publicId);
  }

  // Delete multiple images by publicIds
  async deleteImages(publicIds: string[]): Promise<void> {
    if (!publicIds.length) return;

    await cloudinary.api.delete_resources(publicIds);

    this.logger.log(`Deleted ${publicIds.length} images from Cloudinary`);
  }

  // Cron: purge orphaned pending uploads older than N days
  async purgeOrphanedPendingUploads(olderThanDays = 1): Promise<void> {
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - olderThanDays);

    // search by tag 'pending' uploaded before cutOff
    let nextCursor: string | undefined;

    do {
      const result = await cloudinary.search
        .expression(`tags:pending AND uploaded_at<${cutOff.toISOString()}`)
        .sort_by('uploaded_at', 'asc')
        .max_results(100)
        .next_cursor(nextCursor ?? '')
        .execute();

      const publicIds: string[] = result.resources.map((res) => res.public_id);

      if (publicIds.length) {
        await cloudinary.api.delete_resources(publicIds);
        console.log(
          `[Cleanup] Deleted ${publicIds.length} orphaned pending uploads`,
        );
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);
  }
}
