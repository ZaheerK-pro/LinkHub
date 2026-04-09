import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import { ClickParams, ClickParamsSchema } from "../schemas/clickSchemas.js";
import { ClickUseCase } from "../usecases/clickUsecase.js";

export async function clickController(fastify: FastifyInstance) {
  fastify.post<{ Params: ClickParams }>(
    "/:linkId",
    {
      schema: {
        tags: ["Click"],
        description: "Track click for public link",
      } as any,
    },
    track,
  );

  async function track(
    request: FastifyRequest<{ Params: ClickParams }>,
    reply: FastifyReply,
  ) {
    const params = ClickParamsSchema.parse(request.params);
    const clickUseCase = container.get<ClickUseCase>(TYPES.ClickUseCase);
    const success = await clickUseCase.track(params.linkId);
    if (!success) return reply.code(404).send({ message: "Link not found" });
    return { success: true };
  }
}
