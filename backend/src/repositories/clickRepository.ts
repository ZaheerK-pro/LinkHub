import { Repository } from "typeorm";
import { injectable } from "inversify";
import { AppDataSource } from "../data-source.js";
import { Click } from "../entities/Click.js";
import { Link } from "../entities/Link.js";

@injectable()
export class ClickRepository {
  private repo: Repository<Click> = AppDataSource.getRepository(Click);

  async create(link: Link) {
    return this.repo.save(this.repo.create({ link }));
  }
}
