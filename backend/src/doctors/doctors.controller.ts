import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  getAllDoctors() {
    return this.doctorsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; specialtyId: number; createdById: number }) {
    return this.doctorsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name: string; specialtyId: number; updatedById: number },
  ) {
    return this.doctorsService.update(id, body);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deletedById: number },
  ) {
    return this.doctorsService.remove(id, body.deletedById);
  }
}
