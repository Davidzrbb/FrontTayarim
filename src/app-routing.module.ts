import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnexionUserComponent} from "./app/connexion-user/connexion-user.component";
import {AuthGuard} from "./app/auth.guard";
import {PurchaseComponent} from "./app/purchase/purchase.component";




const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: ConnexionUserComponent},
  {path: 'purchase', component: PurchaseComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
