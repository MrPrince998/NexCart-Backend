import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({
      where: { name: createRoleDto.name as any },
    });
    if (existing) throw new ConflictException('Role already exists');

    const role = this.roleRepository.create({
      name: createRoleDto.name as any,
      description: createRoleDto.description,
      isSystem: createRoleDto.isSystem ?? false,
      permissions: createRoleDto.permissions ?? null,
    });
    return successResponse(await this.roleRepository.save(role), 'Role created successfully', 201);
  }

  async findAll() {
    return successResponse(
      await this.roleRepository.find({ order: { createdAt: 'DESC' } }),
      'Roles retrieved successfully',
    );
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return successResponse(role, 'Role retrieved successfully');
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    Object.assign(role, updateRoleDto);
    return successResponse(await this.roleRepository.save(role), 'Role updated successfully');
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new ConflictException('System roles cannot be deleted');
    await this.roleRepository.delete(id);
    return emptyReponse('Role deleted successfully');
  }
}
