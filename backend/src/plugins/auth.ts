import { FastifyReply, FastifyRequest } from "fastify";

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.auth = request.user;
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
