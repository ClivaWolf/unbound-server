import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity, PostVisibility } from "./entities/post.entity";
import { CreatePostDto, UpdatePostDto } from "./dto/create-post.dto";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
      relations: ["author"],
    });
    if (!post) {
      throw new HttpException("Пост не найден", 404);
    }
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
      relations: ["author"],
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
}