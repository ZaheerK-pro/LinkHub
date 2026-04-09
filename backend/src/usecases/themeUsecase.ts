import { inject, injectable } from "inversify";
import { TenantRepository } from "../repositories/tenantRepository.js";
import { TYPES } from "../inversify/types.js";

@injectable()
export class ThemeUseCase {
  constructor(@inject(TYPES.TenantRepository) private readonly tenantRepo: TenantRepository) {}

  async getByTenant(tenantId: string) {
    const tenant = await this.tenantRepo.findById(tenantId);
    return tenant?.theme ?? null;
  }

  async updateByTenant(tenantId: string, theme: Record<string, string>) {
    const tenant = await this.tenantRepo.updateTheme(tenantId, theme);
    return tenant?.theme ?? null;
  }
}
