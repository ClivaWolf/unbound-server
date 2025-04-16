import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { PostEntity } from "./post.entity";
import { CommentEntity } from "./comment.entity";

@Entity()
export class VoteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  value: number; // +1 для положительного, -1 для отрицательного

  @ManyToOne(() => UserEntity, (user) => user.votes)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.votes, { nullable: true })
  post: PostEntity | null;

  @ManyToOne(() => CommentEntity, (comment) => comment.votes, { nullable: true })
  comment: CommentEntity | null;
}