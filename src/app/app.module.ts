import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';

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
import { NglModule } from 'ng-lightning';
import { ProfileSetupPageComponent } from './profile-setup-page/profile-setup-page.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { TranslationTestComponent } from './translation-test/translation-test.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestHomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ErrorListComponent,
    ConfirmEmailPageComponent,
    UserHomePageComponent,
    ProfileSetupPageComponent,
    TranslationTestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    NglModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  providers: [
    {
      provide: Http,
      useClass: HttpProvider,
      deps: [XHRBackend, RequestOptions, StorageService, Router]
    },
    SessionService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
