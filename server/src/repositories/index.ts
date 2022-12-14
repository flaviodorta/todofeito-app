import { dataSource } from '../database';
import { Label } from '../entities/Label.entity';
import { Project } from '../entities/Project.entity';
import { Section } from '../entities/Section.entity';
import { Todo } from '../entities/Todo.entity';
import { User } from '../entities/User.entity';
import { UserToken } from '../entities/UserToken.entity';

export const labelsRepository = dataSource.getRepository(Label);

export const projectsRepository = dataSource.getRepository(Project).extend({
  async findByTitle(title: string) {
    return this.createQueryBuilder('project')
      .where('project.title = :title', { title })
      .getOne();
  },

  async findAll() {
    return (
      this.createQueryBuilder('project')
        .leftJoinAndSelect('project.user', 'user')
        // .where('project.title = :title', { title })
        .getManyAndCount()
    );
  },

  async findById(id: string) {
    return this.createQueryBuilder('project')
      .where('project.id = :id', { id })
      .getOne();
  },
});

export const sectionsRepository = dataSource.getRepository(Section).extend({
  async findByTitle(title: string) {
    return this.createQueryBuilder('section')
      .where('section.title = :title', { title })
      .getOne();
  },

  async findAll() {
    return (
      this.createQueryBuilder('section')
        // .leftJoinAndSelect('section.user', 'user')
        // .where('project.title = :title', { title })
        .getManyAndCount()
    );
  },

  async findById(id: string) {
    return this.createQueryBuilder('section')
      .where('section.id = :id', { id })
      .getOne();
  },
});

export const todosRepository = dataSource.getRepository(Todo);

export const usersRepository = dataSource.getRepository(User).extend({
  async findByName(name: string) {
    return this.createQueryBuilder('user')
      .where('user.name = :name', { name })
      .getOne();
  },
  async findByEmail(email: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  },
  async findById(id: string) {
    return this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  },
});

export const userTokensRepository = dataSource.getRepository(UserToken).extend({
  async findByToken(token: string) {
    const userToken = await this.findOne({
      where: {
        token,
      },
    });
    return userToken;
  },
  async findByEmail(email: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  },
  async generate(user_id: string) {
    const userToken = await this.create({
      user_id,
    });
    await this.save(userToken);
    return userToken;
  },
});
