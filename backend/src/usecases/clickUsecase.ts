import { inject, injectable } from "inversify";
import { ClickRepository } from "../repositories/clickRepository.js";
import { LinkRepository } from "../repositories/linkRepository.js";
import { TYPES } from "../inversify/types.js";

@injectable()
export class ClickUseCase {
  constructor(
    @inject(TYPES.ClickRepository) private readonly clickRepo: ClickRepository,
    @inject(TYPES.LinkRepository) private readonly linkRepo: LinkRepository
  ) {}

  async track(linkId: string) {
    const link = await this.linkRepo.findById(linkId);
    if (!link) return false;
    await this.clickRepo.create(link);
    return true;
  }
}
