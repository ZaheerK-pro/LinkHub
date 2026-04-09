import { Container } from "inversify";
import { ClickRepository } from "../repositories/clickRepository.js";
import { LinkRepository } from "../repositories/linkRepository.js";
import { TenantRepository } from "../repositories/tenantRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { AnalyticsUseCase } from "../usecases/analyticsUsecase.js";
import { AuthUseCase } from "../usecases/authUsecase.js";
import { ClickUseCase } from "../usecases/clickUsecase.js";
import { LinksUseCase } from "../usecases/linksUsecase.js";
import { ProfileUseCase } from "../usecases/profileUsecase.js";
import { ThemeUseCase } from "../usecases/themeUsecase.js";
import { TYPES } from "./types.js";

const container = new Container();

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<TenantRepository>(TYPES.TenantRepository).to(TenantRepository).inSingletonScope();
container.bind<LinkRepository>(TYPES.LinkRepository).to(LinkRepository).inSingletonScope();
container.bind<ClickRepository>(TYPES.ClickRepository).to(ClickRepository).inSingletonScope();

container.bind<AuthUseCase>(TYPES.AuthUseCase).to(AuthUseCase).inSingletonScope();
container.bind<LinksUseCase>(TYPES.LinksUseCase).to(LinksUseCase).inSingletonScope();
container.bind<ClickUseCase>(TYPES.ClickUseCase).to(ClickUseCase).inSingletonScope();
container.bind<ProfileUseCase>(TYPES.ProfileUseCase).to(ProfileUseCase).inSingletonScope();
container.bind<ThemeUseCase>(TYPES.ThemeUseCase).to(ThemeUseCase).inSingletonScope();
container.bind<AnalyticsUseCase>(TYPES.AnalyticsUseCase).to(AnalyticsUseCase).inSingletonScope();

export { container };
