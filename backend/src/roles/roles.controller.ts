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
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  createRole(@Body() body: { name: string; createdById: number }) {
    return this.rolesService.create(body);
  }

  @Put(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name: string; updatedById: number },
  ) {
    return this.rolesService.update(id, body);
  }

  @Delete(':id')
  deleteRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deletedById: number },
  ) {
    return this.rolesService.remove(id, body.deletedById);
  }
}
