import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import AuthRouter from "./auth.router";
import AuthRouter from "./auth.router";
import UserService from "../User/user.service";

const userService = new UserService();
const authService = new AuthService();
const authController = new AuthController(authService, userService);
const authRouter = new AuthRouter(authController);

export default {
    router: authRouter.router,
};
