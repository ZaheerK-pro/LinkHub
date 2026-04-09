import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "../inversify/container.js";
import { TYPES } from "../inversify/types.js";
import {
  LoginInput,
  LoginInputSchema,
  SignupInput,
  SignupInputSchema,
} from "../schemas/authSchemas.js";
import { AuthUseCase } from "../usecases/authUsecase.js";
import { authGuard as authenticate } from "../plugins/auth.js";

export async function authController(fastify: FastifyInstance) {
  fastify.post<{ Body: SignupInput }>(
    "/signup",
    {
      schema: {
        tags: ["Auth"],
        description: "Create user account and tenant",
      } as any,
    },
    signup,
  );

  fastify.post<{ Body: LoginInput }>(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "Authenticate existing user",
      } as any,
    },
    login,
  );

  fastify.get(
    "/me",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        description: "Get authenticated user profile",
      } as any,
    },
    me,
  );

  async function signup(
    request: FastifyRequest<{ Body: SignupInput }>,
    reply: FastifyReply,
  ) {
    const parsed = SignupInputSchema.safeParse(request.body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue.path.includes("password"))
        return reply
          .code(400)
          .send({ message: "Password must be at least 6 characters" });
      if (issue.path.includes("email"))
        return reply
          .code(400)
          .send({ message: "Please enter a valid email address" });
      if (issue.path.includes("username"))
        return reply
          .code(400)
          .send({
            message:
              "Username must be lowercase letters, numbers, or underscore",
          });
      return reply
        .code(400)
        .send({ message: "Please check your signup details and try again" });
    }

    const authUseCase = container.get<AuthUseCase>(TYPES.AuthUseCase);
    const user = await authUseCase.signup(parsed.data);
    if (!user)
      return reply
        .code(400)
        .send({ message: "Email or username already in use" });

    const token = request.server.jwt.sign({
      userId: user.id,
      tenantId: user.tenant_id,
      username: user.username,
    });
    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        tenant_id: user.tenant_id,
      },
    });
  }

  async function login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ) {
    const parsed = LoginInputSchema.safeParse(request.body);
    if (!parsed.success)
      return reply
        .code(400)
        .send({ message: "Please enter valid login details" });

    const authUseCase = container.get<AuthUseCase>(TYPES.AuthUseCase);
    const user = await authUseCase.login(parsed.data);
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const token = request.server.jwt.sign({
      userId: user.id,
      tenantId: user.tenant_id,
      username: user.username,
    });
    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        tenant_id: user.tenant_id,
      },
    });
  }

  async function me(request: FastifyRequest) {
    const authUseCase = container.get<AuthUseCase>(TYPES.AuthUseCase);
    const user = await authUseCase.getMe(request.auth.userId);
    if (!user) return { user: null };
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        tenant_id: user.tenant_id,
      },
    };
  }
}
