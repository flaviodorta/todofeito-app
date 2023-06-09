import path from 'path';
import fs from 'fs';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../entities/User.entity';
import { usersRepository, userTokensRepository } from '../repositories';
import { config } from '../config';
import { uploadConfig } from '../helpers/upload';
import { addHours, isAfter } from 'date-fns';
import { EthrealMail } from '../helpers/EtherealMail';

interface IRequest {
  id: string;
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
  photoURL: string;
  language: string;
  token: string;
}

export class UsersServices {
  public async getAll(): Promise<User[]> {
    const allUsers = await usersRepository.find({
      relations: ['todos', 'projects'],
    });

    return allUsers;
  }

  public async getById({ id }: Pick<IRequest, 'id'>): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('User not exist');
    }

    return user;
  }

  public async create({
    name,
    email,
    password,
    language,
    photoURL,
  }: Pick<
    IRequest,
    'name' | 'email' | 'password' | 'language' | 'photoURL'
  >): Promise<User> {
    const emailExists = await usersRepository.findByEmail(email);

    if (emailExists) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
      photoURL,
      language,
    });

    await usersRepository.save(user);

    return user;
  }

  public async update({
    id,
    name,
    email,
    password,
    language,
    photoURL,
  }: Pick<
    IRequest,
    'id' | 'email' | 'name' | 'password' | 'language' | 'photoURL'
  >): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (language) user.language = language;
    if (photoURL) user.photoURL = photoURL;

    await usersRepository.save(user);

    return user;
  }

  public async delete({ id }: Pick<IRequest, 'id'>): Promise<void> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new Error('user not found');
    }

    await usersRepository.remove(user);
  }

  public async createSessions({
    email,
    password,
  }: Pick<IRequest, 'email' | 'password'>): Promise<{
    user: User;
    token: string;
  }> {
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new Error('User not exist');

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) throw new Error('Incorrect password');

    const token = sign({}, config.jwt.secret, {
      subject: user.id,
      expiresIn: config.jwt.expiresIn,
    });

    return { user, token };
  }

  public async updatePhotoURL({
    id,
    photoURL,
  }: Pick<IRequest, 'id' | 'photoURL'>): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) throw new Error('User not found');

    if (user.photoURL) {
      const userPhotoURLFilepath = path.join(
        uploadConfig.directory,
        user.photoURL
      );
      const userPhotoURLFileExist = await fs.promises.stat(
        userPhotoURLFilepath
      );

      if (userPhotoURLFileExist) {
        await fs.promises.unlink(userPhotoURLFilepath);
      }
    }

    user.photoURL = photoURL;

    await usersRepository.save(user);

    console.log(photoURL);

    return user;
  }

  public async sendForgotPasswordEmail({
    email,
  }: Pick<IRequest, 'email'>): Promise<void> {
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new Error('User not exist');

    const { token } = await userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'ForgotPassword.hbs'
    );

    await EthrealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }

  public async resetForgotPasswordEmail({
    token,
    password,
  }: Pick<IRequest, 'token' | 'password'>): Promise<void> {
    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) throw new Error('User does not exist');

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) throw new Error('User does not exist');

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) throw new Error('Token expired');

    user.password = await hash(password, 8);

    await usersRepository.save(user);
  }

  public async showProfile({
    user_id,
  }: Pick<IRequest, 'user_id'>): Promise<User> {
    const user = await usersRepository.findById(user_id);

    if (!user) throw new Error('User nnot found');

    return user;
  }

  public async updateProfile({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Pick<
    IRequest,
    'user_id' | 'name' | 'email' | 'password' | 'old_password'
  >): Promise<User> {
    const user = await usersRepository.findById(user_id);

    if (!user) throw new Error('User not found');

    const userUpdateEmail = await usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new Error('There is already one user with this email');
    }

    if (password && !old_password) {
      throw new Error('Old password is required');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new Error('Old password does not match');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return user;
  }
}
export const usersServices = new UsersServices();
