import 'dotenv/config';
import { Role as RoleName } from '@/common/enums';
import { RolePermissions } from '@/core/constants/role-permission.constant';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { AppDataSource } from '../../ormconfig';

async function seedRoles() {
  const roleRepository = AppDataSource.getRepository(Role);

  for (const roleName of Object.values(RoleName)) {
    const existing = await roleRepository.findOne({
      where: { name: roleName as Role['name'] },
    });

    const role = existing ?? roleRepository.create({ name: roleName as Role['name'] });
    role.description = `${roleName.replace('_', ' ')} role`;
    role.isSystem = true;
    role.permissions = RolePermissions[roleName] ?? [];

    await roleRepository.save(role);
  }
}

async function seedCategories() {
  const categoryRepository = AppDataSource.getRepository(ProductCategory);
  const existing = await categoryRepository.findOne({
    where: { slug: 'uncategorized' },
    withDeleted: true,
  });

  const category =
    existing ??
    categoryRepository.create({
      name: 'Uncategorized',
      slug: 'uncategorized',
    });

  category.name = 'Uncategorized';
  category.slug = 'uncategorized';
  category.description = 'Fallback category for products without a category.';
  category.image = null;
  category.parentCategoryId = null;
  category.isActive = true;
  category.sortOrder = 9999;

  await categoryRepository.save(category);
}

async function main() {
  await AppDataSource.initialize();
  await seedRoles();
  await seedCategories();
  await AppDataSource.destroy();
  console.log('Seed completed successfully');
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
