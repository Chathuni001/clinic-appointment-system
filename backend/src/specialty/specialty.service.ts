import { Injectable, BadRequestException, ConflictException, NotFoundException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpecialtyService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.specialty.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.specialty.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(data: { name: string;  createdById: number }) {

    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Specialty name is required and cannot be empty.',
      );
    }

    const normalizedName = data.name.trim();

    // 2. Check for duplicates (only check against non-deleted records)
    const existingSpecialty = await this.prisma.specialty.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
      },
    });

    if (existingSpecialty) {
      throw new ConflictException(
        `Specialty "${normalizedName}" already exists.`,
      );
    }

    // 3. Create the record
    return this.prisma.specialty.create({
      data: {
        name: normalizedName,
        createdById: data.createdById,
      },
    });
  }

  async update(id: number, data: { name: string;  updatedById: number }) {
    // 1. Check for null or empty
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException(
        'Specialty name is required and cannot be empty.',
      );
    }
  
    const normalizedName = data.name.trim();
  
    // 2. Check for duplicates (EXCLUDE the current record)
    const existingSpecialty = await this.prisma.specialty.findFirst({
      where: {
        name: normalizedName,
        deletedAt: null,
        id: { not: id },
      },
    });
  
    if (existingSpecialty) {
      throw new ConflictException(
        `Specialty "${normalizedName}" already exists.`,
      );
    }
  
    // 3. Update the record using the TRIMMED name
    return this.prisma.specialty.update({
      where: { id },
      data: {
        name: normalizedName,
        updatedById: data.updatedById,
      },
    });
  }

  async remove(id: number, deletedById: number) {
    // 1. Check if any active doctors are using this specialty
    const doctorCount = await this.prisma.doctor.count({
      where: {
        specialtyId: id,
        deletedAt: null,
      },
    });

    // 2. If doctors exist, block the deletion
    if (doctorCount > 0) {
      throw new ConflictException(
        `This specialty is currently assigned to ${doctorCount} doctor(s).`,
      );
    }

    // 3. Proceed with Soft Delete if no doctors are linked
    return this.prisma.specialty.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }
}
