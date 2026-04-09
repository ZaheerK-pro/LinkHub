import "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: string;
      tenantId: string;
      username: string;
    };
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      tenantId: string;
      username: string;
    };
    user: {
      userId: string;
      tenantId: string;
      username: string;
    };
  }
}
