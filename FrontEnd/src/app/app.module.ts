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
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { DetailsFilmComponent } from './details-film/details-film.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
@NgModule({
    declarations: [
        AppComponent,
        Films,
        HomeComponent,
        LoginComponent,
        Films_rentedComponent,
        DetailsFilmComponent
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
        A11yModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatOptionModule,
        MatAutocompleteModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
