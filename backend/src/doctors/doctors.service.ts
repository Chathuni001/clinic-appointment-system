import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  // Only get doctors where deletedAt is NULL
  findAll() {
    return this.prisma.doctor.findMany({
      where: { deletedAt: null },
      include: { specialty: true },
    });
  }

  // Create with createdById
  async create(data: { name: string; specialtyId: number; createdById: number; image?: string }) {
    return this.prisma.doctor.create({
      data: {
        name: data.name,
        specialtyId: data.specialtyId,
        createdById: data.createdById,
        image: data.image,
      },
    });
  }

  async update(id: number, data: { name: string; specialtyId: number; updatedById: number; image?: string }) {
    // 1. Find the current record to check for an existing image
    const oldDoctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: { image: true },
    });

    // 2. If there's a new image and an old image exists, delete the old one
    if (data.image && oldDoctor?.image) {
      // The DB stores "/uploads/filename.png", we need to point to the actual file
      // We remove the leading "/" to make the path relative: "uploads/filename.png"
      const relativePath = oldDoctor.image.startsWith('/') 
        ? oldDoctor.image.substring(1) 
        : oldDoctor.image;
        
      const fullPath = join(process.cwd(), relativePath);

      // Check if file exists before trying to delete it
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath); // Delete the file
          console.log(`Successfully deleted old image: ${fullPath}`);
        } catch (err) {
          console.error(`Failed to delete old image: ${err}`);
          // We don't throw an error here so the DB update can still finish
        }
      }
    }

    // 3. Perform the update in Prisma
    return this.prisma.doctor.update({
      where: { id },
      data: {
        name: data.name,
        specialtyId: data.specialtyId,
        updatedById: data.updatedById,
        ...(data.image && { image: data.image }),
      },
    });
  }
  
  // Soft Delete: Set deletedAt and deletedById
  async remove(id: number, deletedById: number) {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }
}