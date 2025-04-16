import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity, PostVisibility } from "./entities/post.entity";
import { CreatePostDto, UpdatePostDto } from "./dto/create-post.dto";
import { UserEntity } from "../users/entities/user.entity";
import { CreateCommentDto, UpdateCommentDto } from "./dto/create-comment.dto";
import { CommentEntity } from "./entities/comment.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    // @InjectRepository(UpvoteEntity)
    // private upvoteRepository: Repository<UpvoteEntity>,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log('try posts user', user);
    if (!user) {
      throw new HttpException("Пользователь не существует", 404);
    }
    const post = this.repository.create({ ...dto, author: user });
    return this.repository.save(post);
  }

  async findById(id: string) {
    const post = await this.repository.findOne({
      where: { id },
      relations: ["author", "comments", "comments.author", "votes", "votes.user"],
    });
    if (!post) {
      throw new HttpException("Пост не найден", 404);
    }
    // Увеличиваем счётчик просмотров
    post.views += 1;
    await this.repository.save(post);
    return post;
  }

  async findByUserLogin(login: string, page: number = 1, limit: number = 10) {
    const user = await this.userRepository.findOneBy({ login });
    if (!user) {
      throw new HttpException("Пользователь не существует", 404);
    }
    const skip = (page - 1) * limit;
    const [posts, total] = await this.repository.findAndCount({
      where: { author: { login }, visibility: PostVisibility.PUBLIC },
      relations: ["author", "comments", "votes"],
      take: limit,
      skip,
      order: { createdAt: "DESC" },
    });
    return { items: posts, total };
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    const post = await this.repository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!post) {
      throw new HttpException("Пост не найден или доступ запрещён", 403);
    }
    Object.assign(post, dto);
    return this.repository.save(post);
  }

  async delete(id: string, userId: string) {
    const post = await this.repository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!post) {
      throw new HttpException("Пост не найден или доступ запрещён", 403);
    }
    await this.repository.softDelete(id);
    return { message: "Пост удалён" };
  }

  async createComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.repository.findOneBy({ id: postId });
    if (!post) {
      throw new HttpException("Пост не найден", 404);
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException("Пользователь не существует", 404);
    }
    const comment = this.commentRepository.create({
      ...dto,
      post,
      author: user,
    });
    return this.commentRepository.save(comment);
  }

  async updateComment(id: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!comment) {
      throw new HttpException("Комментарий не найден или доступ запрещён", 403);
    }
    Object.assign(comment, dto);
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id, author: { id: userId } },
    });
    if (!comment) {
      throw new HttpException("Комментарий не найден или доступ запрещён", 403);
    }
    await this.commentRepository.softDelete(id);
    return { message: "Комментарий удалён" };
  }
}