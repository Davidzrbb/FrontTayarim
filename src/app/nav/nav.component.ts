import {Component, OnInit} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public isConnectedBool: boolean = false;

  constructor(private authService: ConnexionService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      await this.isConnected();
    });
  }

  async isConnected() {
    let user = await this.authService.isUserLoggedIn();
    this.isConnectedBool = !!user;
  }

  async isDeconnected() {
    this.authService.logout();
    this.isConnectedBool = false;
    await this.router.navigate(
      ['/login']);
  }

}
