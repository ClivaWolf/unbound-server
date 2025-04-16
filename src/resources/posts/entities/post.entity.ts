import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { CommentEntity } from "src/resources/posts/entities/comment.entity";
import { VoteEntity } from "./vote.entity";

export enum PostVisibility {
  PUBLIC = "public",
  FOLLOWERS = "followers",
  PRIVATE = "private",
}

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  author: UserEntity;

  @Column({ type: "jsonb" })
  blocks: { layout: { width: string; content: string }[] }[];

  @Column({ nullable: true })
  background: string;

  @Column({ nullable: true })
  border: string;

  @Column({ type: "enum", enum: PostVisibility, default: PostVisibility.PUBLIC })
  visibility: PostVisibility;

  @Column({ default: 0 })
  views: number; // Статистика просмотров

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @Column({ default: 0 })
  voteScore: number; // Сумма голосов (+1/-1)

  @OneToMany(() => VoteEntity, (vote) => vote.post)
  votes: VoteEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}