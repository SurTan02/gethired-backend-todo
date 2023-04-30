import { Router } from "express";
import { activity } from "./activity.route";
import { todo } from "./todo.route";

const routes = Router();

routes.use(activity);
routes.use(todo);
export { routes };