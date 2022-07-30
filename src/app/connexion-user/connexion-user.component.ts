import {Component, OnInit} from '@angular/core';
import {UserConnect} from "../models/UserConnect";
import {ConnexionService} from "../services/connexion.service";
import {Params, Router} from "@angular/router";

@Component({
  selector: 'app-connexion-user',
  templateUrl: './connexion-user.component.html',
  styleUrls: ['./connexion-user.component.scss']
})
export class ConnexionUserComponent implements OnInit {
  userConnect: UserConnect = new UserConnect();
  public returnError = false;
  public returnMessage: string = "";

  constructor(private connexionService: ConnexionService, private router: Router) {
  }

  ngOnInit(): void {
  }

  checkConnected(login: string, password: string): void {
    if (login.trim() != "" && password.trim() != "") {
      this.userConnect.login = login;
      this.userConnect.password = password;
      this.connexionService.connectUser(this.userConnect).subscribe(
        async res => {
          if (res.response) {
            this.returnError = false;
            localStorage.setItem("token", res.connexion.token);
            const queryParams: Params = {connect: "ok"};
            await this.router.navigate(
              ['/purchase'],
              {
                queryParams: queryParams,
              });
          }
        },
        error => {
          this.returnError = true;
          this.returnMessage = error.error.message;
        });
    }
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem("token") != null;
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  closeAlert() {
    this.returnError = false;
  }
}
