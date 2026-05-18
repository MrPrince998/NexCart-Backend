import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { ImageEntity } from '@/common/enums';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  // ── Attach images to any entity on create ───────────────────────────────────
  // Call this after saving the parent entity (product, user, etc.)
  async attachImages(
    entityType: ImageEntity,
    entityId: string,
    publicIds: string[],
  ): Promise<Image[]> {
    if (!publicIds.length) return [];

    // 1. Activate all on clodinary (temp -> permanent)
    const activatedImages =
      await this.cloudinaryService.activateImages(publicIds);

    // 2. Build image rows
    const images = activatedImages.map((result, index) => {
      return this.imageRepo.create({
        entityType,
        entityId,
        url: result.secure_url,
        publicId: result.public_id,
        position: index, // maintain order
        isPrimary: index === 0, // first image is primary by default
      });
    });

    return this.imageRepo.save(images);
  }

  async syncImages(
    entityType: ImageEntity,
    entityId: string,
    incomingPublicIds: string[],
  ): Promise<Image[]> {
    // 1. Fetch existing images for the entity
    const existingImage = await this.findByEntity(entityType, entityId);

    const exisitingIds = new Set(existingImage.map((img) => img.publicId));
    const incomingSet = new Set(incomingPublicIds);

    // 2. Images removed by the user before submit
    const toDelete = existingImage.filter(
      (img) => !incomingSet.has(img.publicId),
    );

    // 3. Brand-new uploads not yet in DB (still in temp state on Cloudinary)
    const toAdd = incomingPublicIds.filter((id) => !exisitingIds.has(id));

    // 4. Delete removed images
    if (toDelete.length) {
      await this.cloudinaryService.deleteImages(
        toDelete.map((i) => i.publicId),
      );
      await this.imageRepo.remove(toDelete);
    }

    // 5. Active & insert new images
    if (toAdd.length) {
      await this.attachImages(entityType, entityId, toAdd);
    }

    // 6. Reposition all surviving images by incomingPublicIds order
    const remaning = await this.findByEntity(entityType, entityId);

    const reordered = remaning.map((image) => {
      const position = incomingPublicIds.indexOf(image.publicId);

      return {
        ...image,
        position: position === -1 ? image.position : position,
        isPrimary: position === 0,
      };
    });

    return this.imageRepo.save(reordered);
  }

  // Delete all image for an entity
  async deleteAllForEntity(
    entityType: ImageEntity,
    entityId: string,
  ): Promise<void> {
    const images = await this.findByEntity(entityType, entityId);
    if (!images.length) return;

    await this.cloudinaryService.deleteImages(images.map((i) => i.publicId));
    await this.imageRepo.remove(images);
  }

  // query helper
  findByEntity(entityType: ImageEntity, entityId: string): Promise<Image[]> {
    return this.imageRepo.find({
      where: { entityType, entityId },
      order: { position: 'ASC' },
    });
  }

  findPrimary(
    entityType: ImageEntity,
    entityId: string,
  ): Promise<Image | null> {
    return this.imageRepo.findOne({
      where: { entityType, entityId, isPrimary: true },
    });
  }
}
