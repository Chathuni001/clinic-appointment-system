import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: { name: string; createdById: number }) {
    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Role name is required and cannot be empty.',
      );
    }

    const normalizedName = data.name.trim();

    // 2. Check for duplicates (only check against non-deleted records)
    const existingRole = await this.prisma.role.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
      },
    });

    if (existingRole) {
      throw new ConflictException(
        `Specialty "${normalizedName}" already exists.`,
      );
    }

    // 3. Create the record
    return this.prisma.role.create({
      data: {
        name: normalizedName,
        createdById: data.createdById,
      },
    });
  }

  async update(id: number, data: { name: string; updatedById: number }) {
    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Role name is required and cannot be empty.',
      );
    }

    const normalizedName = data.name.trim();

    // 2. Check for duplicates (EXCLUDE the current record)
    const existingRole = await this.prisma.role.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingRole) {
      throw new ConflictException(`Role "${normalizedName}" already exists.`);
    }

    // 3. Update the record using the TRIMMED name
    return this.prisma.role.update({
      where: { id },
      data: {
        name: normalizedName,
        updatedById: data.updatedById,
      },
    });
  }

  async remove(id: number, deletedById: number) {
    // 1. Check if any active user are using this role
    const userCount = await this.prisma.user.count({
      where: {
        roleId: id,
        deletedAt: null,
      },
    });

    // 2. If doctors exist, block the deletion
    if (userCount > 0) {
      throw new ConflictException(
        `This role is currently assigned to ${userCount} user(s).`,
      );
    }

    // 3. Proceed with Soft Delete if no doctors are linked
    return this.prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }

  async assignPrivileges(roleId: number, privilegeIds: number[]) {
    // 1. Delete old privileges for this role
    await this.prisma.rolePrivilege.deleteMany({
      where: { roleId },
    });
  
    // 2. Assign new ones
    const data = privilegeIds.map((pId) => ({
      roleId,
      privilegeId: pId,
    }));
  
    return this.prisma.rolePrivilege.createMany({
      data,
    });
  }
}
