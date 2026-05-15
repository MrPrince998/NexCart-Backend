import { ExecutionContext } from '@nestjs/common';
import { Permission } from '../enums/permissions.enum';
import { RolePermissions } from '@/core/constants/role-permission.constant';

export interface IPolicyHandler {
  handle(context: ExecutionContext): boolean | Promise<boolean>;
}

// simple permission check
export class PermissionHandler implements IPolicyHandler {
  constructor(private permission: Permission) {}

  handle(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    const permissions = RolePermissions[user.role] ?? [];
    return permissions.includes(this.permission);
  }
}

export class OwnershipHandler implements IPolicyHandler {
  constructor(
    private permission: Permission,
    private getResourceOwnerId: (req: any) => Promise<string> | string,
  ) {}

  async handle(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    const permissions = RolePermissions[user.role] ?? [];

    // Admin-level permissions -> skip ownership check
    if (permissions.includes(this.getAdminPermission())) return true;

    // check own permission + ownership
    if (permissions.includes(this.permission)) {
      const ownerId = await this.getResourceOwnerId(request);
      return ownerId === user.id;
    }

    return false;
  }

  private getAdminPermission(): Permission {
    // e.g EditOwnProduct -> EditAnyProduct
    return this.permission.replace(':own', ':any') as Permission;
  }
}
