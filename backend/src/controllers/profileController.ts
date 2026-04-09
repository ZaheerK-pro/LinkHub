import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import {
  ProfileParams,
  ProfileParamsSchema,
} from "../schemas/profileSchemas.js";
import { ProfileUseCase } from "../usecases/profileUsecase.js";

export async function profileController(fastify: FastifyInstance) {
  fastify.get<{ Params: ProfileParams }>(
    "/:username",
    {
      schema: {
        tags: ["Profile"],
        description: "Get public profile by username",
      } as any,
    },
    getByUsername,
  );

  async function getByUsername(
    request: FastifyRequest<{ Params: ProfileParams }>,
    reply: FastifyReply,
  ) {
    const params = ProfileParamsSchema.parse(request.params);
    const profileUseCase = container.get<ProfileUseCase>(TYPES.ProfileUseCase);
    const profile = await profileUseCase.getByUsername(params.username);
    if (!profile) return reply.code(404).send({ message: "Profile not found" });
    return profile;
  }
}
