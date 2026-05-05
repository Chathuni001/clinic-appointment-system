import { Module } from '@nestjs/common';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from './privileges.service';

@Module({
  controllers: [PrivilegesController],
  providers: [PrivilegesService]
})
export class PrivilegesModule {}
