import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../resources/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { UserEntity } from 'src/resources/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(login: string, password: string): Promise<{ access_token: string }> {
    const user = login.includes('@')
      ? await this.usersService.findByEmail(login)
      : await this.usersService.findByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
    return this.generateToken(user);
  }

  async register(user: CreateUserDto): Promise<{ access_token: string }> {
    const newUser: UserEntity = await this.usersService.create(user);
    if (!newUser) {
      throw new HttpException('Пользователь не создан', 400);
    }
    const token = this.generateToken(newUser)
    if (!token) {
      throw new ForbiddenException('Не удалось создать токен');
    }
    return token
  }

  async generateToken(user: UserEntity): Promise<{ access_token: string }> {
    const payload = { sub: user.id, login: user.login, roles: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
