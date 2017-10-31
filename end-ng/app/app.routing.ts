import { LoginComponent } from "./login/login.component";
import { ListComponent } from "./list/list.component";

export const routes = [
  { path: "", component: LoginComponent },
  { path: "list", component: ListComponent }
];

export const navigatableComponents = [
  LoginComponent,
  ListComponent
];
