import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./services/auth.guard";
import { LoginComponent } from "./login/login.component";
import { Films } from "./films/films";
import { Films_rentedComponent } from "./films_rented/films_rented.component";
import {LoginGuard} from "./services/login.guard";

const routes: Routes = [
  { path : '', pathMatch : 'full' ,redirectTo : 'home' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
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
