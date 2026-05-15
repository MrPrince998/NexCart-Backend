export enum Permission {
  // Orders
  ReadOwnOrders = 'orders:read:own',
  ReadAllOrders = 'orders:read:all',
  CancelOwnOrder = 'orders:cancel:own',
  ManageOrders = 'orders:manage',

  // Products
  ReadProduct = 'products:read',
  CreateProduct = 'products:create',
  EditOwnProduct = 'products:edit:own',
  EditAnyProduct = 'products:edit:any',
  DeleteOwnProduct = 'products:delete:own',
  DeleteAnyProduct = 'products:delete:any',

  // Users
  ReadOwnProfile = 'users:read:own',
  ManageUsers = 'users:manage',

  // Vendor
  ManageOwnStore = 'store:manage:own',
}
