import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import {
  LinkIdParams,
  LinkIdParamsSchema,
  LinkInput,
  LinkInputSchema,
  ReorderInput,
  ReorderInputSchema,
} from "../schemas/linksSchemas.js";
import { LinksUseCase } from "../usecases/linksUsecase.js";
import { authGuard as authenticate } from "../plugins/auth.js";

export async function linksController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Links"],
        description: "List links for current tenant",
      } as any,
    },
    list,
  );
  fastify.post<{ Body: LinkInput }>(
    "/",
    {
      preHandler: [authenticate],
      schema: { tags: ["Links"], description: "Create new link" } as any,
    },
    create,
  );
  fastify.put<{ Params: LinkIdParams; Body: Partial<LinkInput> }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: { tags: ["Links"], description: "Update a link by id" } as any,
    },
    update,
  );
  fastify.delete<{ Params: LinkIdParams }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: { tags: ["Links"], description: "Delete a link by id" } as any,
    },
    remove,
  );
  fastify.put<{ Body: ReorderInput }>(
    "/reorder/all",
    {
      preHandler: [authenticate],
      schema: { tags: ["Links"], description: "Reorder all links" } as any,
    },
    reorder,
  );

  async function list(request: FastifyRequest) {
    const linksUseCase = container.get<LinksUseCase>(TYPES.LinksUseCase);
    return linksUseCase.listByTenant(request.auth.tenantId);
  }

  async function create(
    request: FastifyRequest<{ Body: LinkInput }>,
    reply: FastifyReply,
  ) {
    const payload = LinkInputSchema.parse(request.body);
    const linksUseCase = container.get<LinksUseCase>(TYPES.LinksUseCase);
    const link = await linksUseCase.create(request.auth.tenantId, payload);
    return reply.code(201).send(link);
  }

  async function update(
    request: FastifyRequest<{ Params: LinkIdParams; Body: Partial<LinkInput> }>,
    reply: FastifyReply,
  ) {
    const params = LinkIdParamsSchema.parse(request.params);
    const payload = LinkInputSchema.partial().parse(request.body);
    const linksUseCase = container.get<LinksUseCase>(TYPES.LinksUseCase);
    const updated = await linksUseCase.updateById(
      request.auth.tenantId,
      params.id,
      payload,
    );
    if (updated.status === "not_found")
      return reply.code(404).send({ message: "Not found" });
    if (updated.status === "forbidden")
      return reply.code(403).send({ message: "Forbidden" });
    return updated.data;
  }

  async function remove(
    request: FastifyRequest<{ Params: LinkIdParams }>,
    reply: FastifyReply,
  ) {
    const params = LinkIdParamsSchema.parse(request.params);
    const linksUseCase = container.get<LinksUseCase>(TYPES.LinksUseCase);
    const status = await linksUseCase.deleteById(
      request.auth.tenantId,
      params.id,
    );
    if (status === "not_found")
      return reply.code(404).send({ message: "Not found" });
    if (status === "forbidden")
      return reply.code(403).send({ message: "Forbidden" });
    return reply.code(204).send();
  }

  async function reorder(
    request: FastifyRequest<{ Body: ReorderInput }>,
    reply: FastifyReply,
  ) {
    const payload = ReorderInputSchema.parse(request.body);
    const linksUseCase = container.get<LinksUseCase>(TYPES.LinksUseCase);
    const result = await linksUseCase.reorder(
      request.auth.tenantId,
      payload.ids,
    );
    if (!result)
      return reply.code(403).send({ message: "Forbidden reorder payload" });
    return result;
  }
}
