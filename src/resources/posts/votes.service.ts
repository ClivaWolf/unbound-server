import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VoteEntity } from "./entities/vote.entity";
import { PostEntity } from "./entities/post.entity";
import { CommentEntity } from "./entities/comment.entity";
import { UserEntity } from "../users/entities/user.entity";
import { CreateVoteDto } from "./dto/create-vote.dto";

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async votePost(postId: string, userId: string, dto: CreateVoteDto) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new HttpException("Пост не найден", 404);
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException("Пользователь не существует", 404);
    }
    const existingVote = await this.voteRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (existingVote) {
      if (existingVote.value === dto.value) {
        throw new HttpException("Вы уже проголосовали так", 400);
      }
      // Обновляем голос
      existingVote.value = dto.value;
      await this.voteRepository.save(existingVote);
      await this.updatePostVoteScore(postId);
      return existingVote;
    }
    const vote = this.voteRepository.create({
      value: dto.value,
      user,
      post,
      comment: null,
    });
    await this.voteRepository.save(vote);
    await this.updatePostVoteScore(postId);
    return vote;
  }

  async voteComment(commentId: string, userId: string, dto: CreateVoteDto) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new HttpException("Комментарий не найден", 404);
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException("Пользователь не существует", 404);
    }
    const existingVote = await this.voteRepository.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });
    if (existingVote) {
      if (existingVote.value === dto.value) {
        throw new HttpException("Вы уже проголосовали так", 400);
      }
      // Обновляем голос
      existingVote.value = dto.value;
      await this.voteRepository.save(existingVote);
      await this.updateCommentVoteScore(commentId);
      return existingVote;
    }
    const vote = this.voteRepository.create({
      value: dto.value,
      user,
      post: null,
      comment,
    });
    await this.voteRepository.save(vote);
    await this.updateCommentVoteScore(commentId);
    return vote;
  }

  async removeVotePost(postId: string, userId: string) {
    const vote = await this.voteRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (!vote) {
      throw new HttpException("Голос не найден", 404);
    }
    await this.voteRepository.delete(vote.id);
    await this.updatePostVoteScore(postId);
    return { message: "Голос удалён" };
  }

  async removeVoteComment(commentId: string, userId: string) {
    const vote = await this.voteRepository.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });
    if (!vote) {
      throw new HttpException("Голос не найден", 404);
    }
    await this.voteRepository.delete(vote.id);
    await this.updateCommentVoteScore(commentId);
    return { message: "Голос удалён" };
  }

  private async updatePostVoteScore(postId: string) {
    const votes = await this.voteRepository.find({
      where: { post: { id: postId } },
    });
    const voteScore = votes.reduce((sum, vote) => sum + vote.value, 0);
    await this.postRepository.update(postId, { voteScore });
  }

  private async updateCommentVoteScore(commentId: string) {
    const votes = await this.voteRepository.find({
      where: { comment: { id: commentId } },
    });
    const voteScore = votes.reduce((sum, vote) => sum + vote.value, 0);
    await this.commentRepository.update(commentId, { voteScore });
  }
}