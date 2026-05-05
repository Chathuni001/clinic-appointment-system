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
  import { PrivilegesService } from './privileges.service';

@Controller('privileges')
export class PrivilegesController {
    constructor(private readonly privilegesService: PrivilegesService) {}

    @Get()
    getAllPrivileges() {
      return this.privilegesService.findAll();
    }
  
    @Get(':id')
    getPrivilege(@Param('id', ParseIntPipe) id: number) {
      return this.privilegesService.findOne(id);
    }
  
    @Post()
    createPrivilege(@Body() body: { name: string; description: string; createdById: number }) {
      return this.privilegesService.create(body);
    }
  
    @Put(':id')
    updatePrivilege(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { name: string; description: string; updatedById: number },
    ) {
      return this.privilegesService.update(id, body);
    }
  
    @Delete(':id')
    deletePrivilege(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { deletedById: number },
    ) {
      return this.privilegesService.remove(id, body.deletedById);
    }
}
