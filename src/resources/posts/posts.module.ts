import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PostEntity } from "./entities/post.entity";
import { UserEntity } from "../users/entities/user.entity";
import { CommentEntity } from "./entities/comment.entity";
import { VoteEntity } from "./entities/vote.entity";
import { VotesService } from "./votes.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity,VoteEntity])],
  controllers: [PostsController],
  providers: [PostsService, VotesService],
})
export class PostsModule {}