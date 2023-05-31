import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Films_availableComponent } from './films_available/films_available.component';
import { Films_rentedComponent } from './films_rented/films_rented.component';
import { MessagesComponent } from './messages/messages.component';
import { HttpClientModule } from '@angular/common/http';
import { DvdSearchComponent } from './dvd-search/dvd-search.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GraphQLModule } from './utilities/graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    Films_availableComponent,
    MessagesComponent,
    DvdSearchComponent,
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
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
