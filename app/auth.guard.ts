import { Injectable } from "@angular/core";
import { Router, CanActivate } from '@angular/router';
import { BackendService } from "./shared";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private backend: BackendService) { }

  canActivate() {
    if (this.backend.hasActiveToken()) {
      return true;
    }
    else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}

