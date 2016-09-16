import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";

export const routes = [
  { path: "", component: LoginPage },
  { path: "list", component: ListPage }
];

export const navigatableComponents = [
    LoginPage,
    ListPage,
];
