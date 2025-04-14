import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { FilesModule } from './resources/files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './resources/users/users.module';
import { TypeOrmConfig } from './app/type-orm.config';
import { DatabaseModule } from './app/database.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './resources/roles/roles.module';
import { PostsModule } from './resources/posts/posts.module';

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule], // Указываем DatabaseModule в imports
      useFactory: async (configService: ConfigService, typeOrmConfig: TypeOrmConfig) => {
        return typeOrmConfig.createConnectionOptions();
      },
      inject: [ConfigService, TypeOrmConfig],
    }),
    UsersModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
