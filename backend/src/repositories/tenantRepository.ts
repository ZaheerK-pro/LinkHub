import { Repository } from "typeorm";
import { injectable } from "inversify";
import { AppDataSource } from "../data-source.js";
import { Tenant } from "../entities/Tenant.js";

@injectable()
export class TenantRepository {
  private repo: Repository<Tenant> = AppDataSource.getRepository(Tenant);

  create(tenant: Partial<Tenant>) {
    return this.repo.save(this.repo.create(tenant));
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async updateTheme(tenantId: string, theme: Record<string, string>) {
    await this.repo.update({ id: tenantId }, { theme });
    return this.findById(tenantId);
  }
}
