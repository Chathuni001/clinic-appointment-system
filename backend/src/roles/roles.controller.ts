import { Controller, Get, Param, Query } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.roleService.findAll();
  }

  @Get(':id')
  getRoleById(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }
}

