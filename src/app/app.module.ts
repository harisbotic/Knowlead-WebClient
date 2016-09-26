import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';

import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdInputModule } from '@angular2-material/input';
import { MdCoreModule } from '@angular2-material/core';

import { AppRouting } from "./app.routing"
import { AppComponent } from './app.component';
import { GuestHomePageComponent } from './guest-home-page/guest-home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ErrorListComponent } from './error-list/error-list.component';
import { ConfirmEmailPageComponent } from './confirm-email-page/confirm-email-page.component';

import { SessionService } from './session.service';
import { HttpProvider } from './http.provider';
import { StorageService } from './storage.service';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    GuestHomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ErrorListComponent, ConfirmEmailPageComponent, UserHomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    MdButtonModule.forRoot(),
    MdCoreModule.forRoot(),
    MdCardModule.forRoot(),
    MdInputModule.forRoot()
  ],
  providers: [
    {provide: Http, useClass: HttpProvider, deps: [XHRBackend, RequestOptions, StorageService, Router]},
    SessionService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
