import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./login/login.component";
import {DvdsComponent} from "./dvds/dvds.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DvdDetailComponent} from "./dvd-detail/dvd-detail.component";

/*
  --canActivate-- (https://angular.io/api/router/CanActivate#description)
  Interface that a class can implement to be a guard deciding if a route can be activated.
  If all guards return true, navigation continues. If any guard returns false, navigation is cancelled.
  If any guard returns a UrlTree, the current navigation is cancelled and a new navigation begins to the
  UrlTree returned from the guard.
 */
const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'dvds', component: DvdsComponent, canActivate: [AuthGuard]},
  { path: 'detail/:id', component: DvdDetailComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
