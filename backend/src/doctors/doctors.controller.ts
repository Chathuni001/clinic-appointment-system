import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorsService } from './doctors.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  getAllDoctors() {
    return this.doctorsService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const data = {
      name: body.name,
      specialtyId: parseInt(body.specialtyId),
      createdById: parseInt(body.createdById),
      // ✅ FIX: Only include 'image' if a file was uploaded
      ...(file && { image: `/uploads/${file.filename}` }),
    };
    return this.doctorsService.create(data);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const data = {
      name: body.name,
      specialtyId: parseInt(body.specialtyId),
      updatedById: parseInt(body.updatedById),
      ...(file && { image: `/uploads/${file.filename}` }),
    };
    return this.doctorsService.update(id, data);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deletedById: number },
  ) {
    return this.doctorsService.remove(id, body.deletedById);
  }
}