import { AuthGuard } from "./auth-guard.service";

export const authProviders = [
  AuthGuard
];

export const appRoutes = [
  { path: "", redirectTo: "/groceries", pathMatch: "full" },
  { path: "groceries", loadChildren: "./groceries/groceries.module#GroceriesModule" },
  { path: "login", loadChildren: "./login/login.module#LoginModule" },
];
