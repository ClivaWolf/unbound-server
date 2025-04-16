import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PostEntity } from "./entities/post.entity";
import { UserEntity } from "../users/entities/user.entity";
import { CommentEntity } from "./entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}