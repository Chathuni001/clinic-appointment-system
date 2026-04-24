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

  @Get(':id')
  getDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  createDoctor(@Body() body: { name: string; specialty: string }) {
    return this.doctorsService.create(body);
  }

  @Put(':id')
  updateDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; specialty?: string },
  ) {
    return this.doctorsService.update(id, body);
  }

  @Delete(':id')
  deleteDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}