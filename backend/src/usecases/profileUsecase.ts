import { inject, injectable } from "inversify";
import { LinkRepository } from "../repositories/linkRepository.js";
import { TenantRepository } from "../repositories/tenantRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { TYPES } from "../inversify/types.js";

@injectable()
export class ProfileUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: UserRepository,
    @inject(TYPES.TenantRepository) private readonly tenantRepo: TenantRepository,
    @inject(TYPES.LinkRepository) private readonly linkRepo: LinkRepository
  ) {}

  async getByUsername(username: string) {
    const user = await this.userRepo.findByUsername(username);
    if (!user) return null;
    const tenant = await this.tenantRepo.findById(user.tenant_id);
    const links = await this.linkRepo.findByTenant(user.tenant_id);
    return {
      username: user.username,
      tenant,
      links
    };
  }
}
