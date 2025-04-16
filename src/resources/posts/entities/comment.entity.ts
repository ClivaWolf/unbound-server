import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { PostEntity } from "src/resources/posts/entities/post.entity";
import { VoteEntity } from "./vote.entity";


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

  @Column({ default: 0 })
  voteScore: number; // Сумма голосов (+1/-1)

  @OneToMany(() => VoteEntity, (vote) => vote.comment)
  votes: VoteEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}