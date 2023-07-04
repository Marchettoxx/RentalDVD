import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./services/auth.guard";
import { LoginComponent } from "./login/login.component";
import { Films } from "./films/films";
import { Films_rentedComponent } from "./films_rented/films_rented.component";
import {LoginGuard} from "./services/login.guard";

/*
  --canActivate-- (https://angular.io/api/router/CanActivate#description)
  Interface that a class can implement to be a guard deciding if a route can be activated.
  If all guards return true, navigation continues. If any guard returns false, navigation is cancelled.
  If any guard returns a UrlTree, the current navigation is cancelled and a new navigation begins to the
  UrlTree returned from the guard.
 */
const routes: Routes = [
  //{ path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path : '', pathMatch : 'full' ,redirectTo : 'home' },
  { path: 'login', component: LoginComponent, canActivate:[LoginGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'films', component: Films, canActivate: [AuthGuard] },
  { path: 'films_rented', component: Films_rentedComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' } // if insert an url not correct
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
