import { inject, injectable } from "inversify";
import { LinkRepository } from "../repositories/linkRepository.js";
import { TYPES } from "../inversify/types.js";

@injectable()
export class LinksUseCase {
  constructor(@inject(TYPES.LinkRepository) private readonly linkRepo: LinkRepository) {}

  listByTenant(tenantId: string) {
    return this.linkRepo.findByTenant(tenantId);
  }

  async create(tenantId: string, payload: { title: string; url: string }) {
    const existing = await this.linkRepo.findByTenant(tenantId);
    return this.linkRepo.create({
      tenant_id: tenantId,
      title: payload.title,
      url: payload.url,
      order_index: existing.length
    });
  }

  async updateById(tenantId: string, linkId: string, payload: { title?: string; url?: string }) {
    const link = await this.linkRepo.findById(linkId);
    if (!link) return { status: "not_found" as const };
    if (link.tenant_id !== tenantId) return { status: "forbidden" as const };
    const updated = await this.linkRepo.update(link.id, payload);
    return { status: "ok" as const, data: updated };
  }

  async deleteById(tenantId: string, linkId: string) {
    const link = await this.linkRepo.findById(linkId);
    if (!link) return "not_found" as const;
    if (link.tenant_id !== tenantId) return "forbidden" as const;
    await this.linkRepo.remove(link.id);
    return "deleted" as const;
  }

  async reorder(tenantId: string, ids: string[]) {
    const links = await this.linkRepo.findByTenant(tenantId);
    const linkMap = new Map(links.map((item) => [item.id, item]));
    for (let i = 0; i < ids.length; i += 1) {
      const link = linkMap.get(ids[i]);
      if (!link) return null;
      await this.linkRepo.update(link.id, { order_index: i });
    }
    return this.linkRepo.findByTenant(tenantId);
  }
}
