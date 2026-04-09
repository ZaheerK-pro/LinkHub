import { Repository } from "typeorm";
import { injectable } from "inversify";
import { AppDataSource } from "../data-source.js";
import { Link } from "../entities/Link.js";

@injectable()
export class LinkRepository {
  private repo: Repository<Link> = AppDataSource.getRepository(Link);

  findByTenant(tenantId: string) {
    return this.repo.find({
      where: { tenant_id: tenantId },
      order: { order_index: "ASC" }
    });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(link: Partial<Link>) {
    return this.repo.save(this.repo.create(link));
  }

  async update(linkId: string, payload: Partial<Link>) {
    await this.repo.update({ id: linkId }, payload);
    return this.findById(linkId);
  }

  remove(linkId: string) {
    return this.repo.delete({ id: linkId });
  }
}
