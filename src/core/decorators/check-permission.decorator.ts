import { Permission } from '@/common/enums/permissions.enum';
import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSION_KEY = 'check_permissions';
export const CheckPermission = (...permissions: Permission[]) =>
  SetMetadata(CHECK_PERMISSION_KEY, permissions);
