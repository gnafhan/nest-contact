import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrpyt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 401);
    }

    const isPasswordValid = await bcrpyt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid username or password', 401);
    }

    await this.prismaService.user.update({
      where: { username: user.username },
      data: {
        token: uuidv4(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering user ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    const sameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });
    if (sameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrpyt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }
}
