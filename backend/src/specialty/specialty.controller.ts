import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get()
  getAllSpecialty() {
    return this.specialtyService.findAll();
  }

  @Get(':id')
  getSpecialty(@Param('id', ParseIntPipe) id: number) {
    return this.specialtyService.findOne(id);
  }

  @Post()
  createSpecialty(@Body() body: { name: string ; createdById: number}) {
    return this.specialtyService.create(body);
  }

  @Put(':id')
  updateSpecialty(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name: string; updatedById: number },
  ) {
    return this.specialtyService.update(id, body);
  }

  @Delete(':id')
  deleteSpecialty(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deletedById: number },
  ) {
    return this.specialtyService.remove(id, body.deletedById);
  }
}