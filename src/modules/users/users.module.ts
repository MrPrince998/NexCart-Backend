import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/modules/roles/entities/role.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { User } from './entities/user.entity';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
