import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DvdsComponent } from './dvds/dvds.component';
import { MessagesComponent } from './messages/messages.component';
import { HttpClientModule } from '@angular/common/http';
import { DvdSearchComponent } from './dvd-search/dvd-search.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GraphQLModule } from './graphql.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DvdsComponent,
    MessagesComponent,
    DvdSearchComponent,
    HomeComponent,
    LoginComponent
  ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        GraphQLModule,
        BrowserAnimationsModule,
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
