import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import { ThemeInput, ThemeInputSchema } from "../schemas/themeSchemas.js";
import { ThemeUseCase } from "../usecases/themeUsecase.js";
import { authGuard as authenticate } from "../plugins/auth.js";

export async function themeController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [authenticate],
      schema: { tags: ["Theme"], description: "Get tenant theme" } as any,
    },
    getTheme,
  );
  fastify.put<{ Body: ThemeInput }>(
    "/",
    {
      preHandler: [authenticate],
      schema: { tags: ["Theme"], description: "Update tenant theme" } as any,
    },
    updateTheme,
  );

  async function getTheme(request: FastifyRequest, reply: FastifyReply) {
    const themeUseCase = container.get<ThemeUseCase>(TYPES.ThemeUseCase);
    const theme = await themeUseCase.getByTenant(request.auth.tenantId);
    if (!theme) return reply.code(404).send({ message: "Tenant not found" });
    return theme;
  }

  async function updateTheme(
    request: FastifyRequest<{ Body: ThemeInput }>,
    reply: FastifyReply,
  ) {
    const payload = ThemeInputSchema.parse(request.body);
    const themeUseCase = container.get<ThemeUseCase>(TYPES.ThemeUseCase);
    const theme = await themeUseCase.updateByTenant(
      request.auth.tenantId,
      payload,
    );
    if (!theme) return reply.code(404).send({ message: "Tenant not found" });
    return theme;
  }
}
