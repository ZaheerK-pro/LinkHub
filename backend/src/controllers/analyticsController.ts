import { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import {
  AnalyticsQuery,
  AnalyticsQuerySchema,
} from "../schemas/analyticsSchemas.js";
import { AnalyticsUseCase } from "../usecases/analyticsUsecase.js";
import { authGuard as authenticate } from "../plugins/auth.js";

export async function analyticsController(fastify: FastifyInstance) {
  fastify.get<{ Querystring: AnalyticsQuery }>(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Analytics"],
        description: "Get tenant analytics with optional link filter",
      } as any,
    },
    getAnalytics,
  );

  async function getAnalytics(
    request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
  ) {
    const query = AnalyticsQuerySchema.parse(request.query);
    const analyticsUseCase = container.get<AnalyticsUseCase>(
      TYPES.AnalyticsUseCase,
    );
    return analyticsUseCase.getTenantAnalytics(
      request.auth.tenantId,
      query.linkId,
    );
  }
}
