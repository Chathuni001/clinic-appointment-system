import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  getAllDoctors() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorsService.findOne(Number(id));
  }
}
