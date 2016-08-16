import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';
import { LoginService } from "./shared";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) { }

  canActivate() {
    if (this.loginService.isLogged) {
      return true;
    }
    else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}

