import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrivilegesService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.privilege.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.privilege.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: {
    name: string;
    description: string;
    createdById: number;
  }) {
    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Privilege name is required and cannot be empty.',
      );
    }

    if (!data.description || data.description.trim() === '') {
      throw new BadRequestException(
        'Privilege description is required and cannot be empty.',
      );
    }

    const normalizedName = data.name.trim().toUpperCase();
    const normalizedDescription = data.description.trim();

    // 2. Check for duplicates (only check against non-deleted records)
    const existingPrivilege = await this.prisma.privilege.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
      },
    });

    if (existingPrivilege) {
      throw new ConflictException(
        `Privilege "${normalizedName}" already exists.`,
      );
    }

    // 3. Create the record
    return this.prisma.privilege.create({
      data: {
        name: normalizedName,
        description: normalizedDescription,
        createdById: data.createdById,
      },
    });
  }

  async update(id: number, data: { name: string; description: string; updatedById: number }) {
    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Privilege name is required and cannot be empty.',
      );
    }

    if (!data.description || data.description.trim() === '') {
        throw new BadRequestException(
          'Privilege description is required and cannot be empty.',
        );
      }

    const normalizedName = data.name.trim().toUpperCase();
    const normalizedDescription = data.description.trim();

    // 2. Check for duplicates (EXCLUDE the current record)
    const existingPrivilege = await this.prisma.privilege.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (existingPrivilege) {
      throw new ConflictException(`Privilege "${normalizedName}" already exists.`);
    }

    // 3. Update the record using the TRIMMED name
    return this.prisma.privilege.update({
      where: { id },
      data: {
        name: normalizedName,
        description: normalizedDescription,
        updatedById: data.updatedById,
      },
    });
  }

  async remove(id: number, deletedById: number) {
    // 1. Check if any active user are using this privilege
    const roleCount = await this.prisma.rolePrivilege.count({
      where: {
        privilegeId: id,
      },
    });

    // 2. If doctors exist, block the deletion
    if (roleCount > 0) {
      throw new ConflictException(
        `This privilage is currently assigned to ${roleCount} role(s).`,
      );
    }

    // 3. Proceed with Soft Delete if no doctors are linked
    return this.prisma.privilege.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }
}
