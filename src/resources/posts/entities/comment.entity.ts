import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { PostEntity } from "src/resources/posts/entities/post.entity";


@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}