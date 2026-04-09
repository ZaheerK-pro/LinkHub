import { injectable } from "inversify";
import { AppDataSource } from "../data-source.js";
import { Click } from "../entities/Click.js";
import { Link } from "../entities/Link.js";

@injectable()
export class AnalyticsUseCase {
  async getTenantAnalytics(tenantId: string, linkId?: string) {
    const linkRepo = AppDataSource.getRepository(Link);
    const clickRepo = AppDataSource.getRepository(Click);

    const links = await linkRepo.find({ where: { tenant_id: tenantId } });
    const allLinkIds = links.map((link) => link.id);
    if (allLinkIds.length === 0) return { totalClicks: 0, topLinks: [], chart: [] };

    const linkIds = linkId ? [linkId] : allLinkIds;
    if (linkId && !allLinkIds.includes(linkId)) return { totalClicks: 0, topLinks: [], chart: [] };

    const totalClicks = await clickRepo
      .createQueryBuilder("click")
      .leftJoin("click.link", "link")
      .where("link.id IN (:...linkIds)", { linkIds })
      .getCount();

    const topLinks = await clickRepo
      .createQueryBuilder("click")
      .leftJoin("click.link", "link")
      .select("link.id", "id")
      .addSelect("COUNT(click.id)", "clicks")
      .where("link.id IN (:...linkIds)", { linkIds })
      .groupBy("link.id")
      .orderBy("clicks", "DESC")
      .limit(linkId ? 1 : 5)
      .getRawMany();

    const chart = await clickRepo
      .createQueryBuilder("click")
      .leftJoin("click.link", "link")
      .select("DATE(click.created_at)", "day")
      .addSelect("COUNT(click.id)", "clicks")
      .where("link.id IN (:...linkIds)", { linkIds })
      .groupBy("DATE(click.created_at)")
      .orderBy("day", "ASC")
      .getRawMany();

    return { totalClicks, topLinks, chart };
  }
}
