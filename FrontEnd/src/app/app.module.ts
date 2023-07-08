import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from "@angular/common";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Films} from './films/films';
import {Films_rentedComponent} from './films_rented/films_rented.component';
import {HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {GraphQLModule} from './utilities/graphql.module';
import {A11yModule} from "@angular/cdk/a11y";

@NgModule({
    declarations: [
        AppComponent,
        Films,
        HomeComponent,
        LoginComponent,
        Films_rentedComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        GraphQLModule,
        NgOptimizedImage,
        A11yModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
