import { Routes } from "@angular/router";
import { AuthGuard } from "./auth-guard.service";

export const authProviders = [
  AuthGuard
];

export const appRoutes: Routes = [
  { path: "", redirectTo: "/groceries", pathMatch: "full" }
];