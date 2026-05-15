import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsUrl()
  image!: string;

  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;
}
