import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { paginate } from '@/common/handler/pagination.helper';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Role } from '@/modules/roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return successResponse(user, 'Profile retrieved successfully');
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { roleId, status, isEmailVerified, ...profileUpdates } = dto;
    Object.assign(user, profileUpdates);

    return successResponse(
      await this.userRepository.save(user),
      'Profile updated successfully',
    );
  }

  async deleteProfile(userId: string) {
    const result = await this.userRepository.softDelete(userId);
    if (!result.affected) throw new NotFoundException('User not found');
    return emptyReponse('Profile deleted successfully');
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
      withDeleted: true,
    });
    if (existing) throw new ConflictException('Email already exists');

    const roleId = dto.roleId ?? (await this.getDefaultRoleId());
    const user = this.userRepository.create({
      ...dto,
      roleId,
      phone: dto.phone ?? null,
      image: dto.image ?? null,
      status: dto.status ?? 'active',
      isEmailVerified: dto.isEmailVerified ?? false,
    });

    return successResponse(
      await this.userRepository.save(user),
      'User created successfully',
      201,
    );
  }

  async getAllUsers(query: UserQueryDto = {}) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.deletedAt IS NULL');

    if (query.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.name ILIKE :search', { search: `%${query.search}%` })
            .orWhere('user.email ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('user.phone ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    if (query.role) {
      queryBuilder.andWhere('(role.name = :role OR user.roleId = :role)', {
        role: query.role,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('user.status = :status', { status: query.status });
    }

    if (typeof query.isEmailVerified === 'boolean') {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: query.isEmailVerified,
      });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC');

    return paginate(queryBuilder, query, 'Users retrieved successfully');
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return successResponse(user, 'User retrieved successfully');
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, {
      ...dto,
      phone: dto.phone ?? user.phone,
      image: dto.image ?? user.image,
    });

    return successResponse(
      await this.userRepository.save(user),
      'User updated successfully',
    );
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.status = dto.status;
    return successResponse(
      await this.userRepository.save(user),
      'User status updated successfully',
    );
  }

  async updateUserRole(id: string, dto: UpdateUserRoleDto) {
    const [user, role] = await Promise.all([
      this.userRepository.findOne({ where: { id } }),
      this.roleRepository.findOne({ where: { id: dto.roleId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!role) throw new NotFoundException('Role not found');

    user.roleId = dto.roleId;
    return successResponse(
      await this.userRepository.save(user),
      'User role updated successfully',
    );
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('User not found');
    return emptyReponse('User deleted successfully');
  }

  private async getDefaultRoleId() {
    const role = await this.roleRepository.findOne({
      where: [{ name: 'customer' }, { name: 'admin' }],
      order: { name: 'DESC' },
    });
    if (!role) throw new NotFoundException('Default role not found');
    return role.id;
  }
}
