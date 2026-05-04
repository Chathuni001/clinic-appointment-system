import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SpecialtyModule } from './specialty/specialty.module';

@Module({
  imports: [PrismaModule, DoctorsModule, UsersModule, RolesModule, AuthModule, SpecialtyModule],
  controllers: [AppController, RolesController],
  providers: [AppService],
})
export class AppModule {}
