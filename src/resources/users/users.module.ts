import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/resources/roles/roles.module';
// import { AboutTeacherEntity } from './entities/about-teacher.entity';
import { AboutUserEntity } from './entities/about-user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, AboutUserEntity]),
    RolesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
