import { Repository } from "typeorm";
import { injectable } from "inversify";
import { AppDataSource } from "../data-source.js";
import { User } from "../entities/User.js";

@injectable()
export class UserRepository {
  private repo: Repository<User> = AppDataSource.getRepository(User);

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(user: Partial<User>) {
    return this.repo.save(this.repo.create(user));
  }
}
