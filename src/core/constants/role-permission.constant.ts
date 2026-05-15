import { Role } from '@/common/enums';
import { Permission } from '@/common/enums/permissions.enum';

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.CUSTOMER]: [
    Permission.ReadOwnOrders,
    Permission.CancelOwnOrder,
    Permission.ReadOwnProfile,
    Permission.ReadProduct,
    Permission.ReadOwnOrders,
  ],
  [Role.VENDOR]: [
    Permission.ReadProduct,
    Permission.CreateProduct,
    Permission.EditOwnProduct,
    Permission.DeleteOwnProduct,
    Permission.ReadOwnOrders,
    Permission.ManageOwnStore,
    Permission.ReadOwnProfile,
  ],
  [Role.ADMIN]: Object.values(Permission), // all
};
