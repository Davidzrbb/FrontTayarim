import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ConnexionService} from "./services/connexion.service";

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(
    private connexionService: ConnexionService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }

  private async authenticate(): Promise<boolean> {
    let user = await this.connexionService.isUserLoggedIn();
    if (!user) {
      await this.router.navigateByUrl("/login");
      return false;
    }
    if (user.role !== "admin") {
      await this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}
