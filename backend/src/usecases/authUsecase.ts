import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import { themes } from "../constants/themes.js";
import { TenantRepository } from "../repositories/tenantRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { TYPES } from "../inversify/types.js";

@injectable()
export class AuthUseCase {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: UserRepository,
    @inject(TYPES.TenantRepository) private readonly tenantRepo: TenantRepository
  ) {}

  async signup(payload: { email: string; password: string; username: string; name: string }) {
    const existingEmail = await this.userRepo.findByEmail(payload.email);
    const existingUsername = await this.userRepo.findByUsername(payload.username);
    if (existingEmail || existingUsername) return null;

    const tenantName = await this.buildUniqueTenantName(payload.username, payload.name);
    const tenant = await this.tenantRepo.create({ name: tenantName, theme: themes.light });
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await this.userRepo.create({
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      tenant_id: tenant.id
    });

    return user;
  }

  private async buildUniqueTenantName(username: string, displayName: string) {
    const slug = (username || displayName || "tenant")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "tenant";

    let candidate = slug;
    let suffix = 1;
    while (await this.tenantRepo.findByName(candidate)) {
      suffix += 1;
      candidate = `${slug}-${suffix}`;
    }
    return candidate;
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(payload.email);
    if (!user) return null;
    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) return null;
    return user;
  }

  getMe(userId: string) {
    return this.userRepo.findById(userId);
  }
}
