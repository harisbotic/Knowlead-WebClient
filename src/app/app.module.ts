import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { NglModule, INglConfig } from 'ng-lightning';
import { ProfileSetupPageComponent } from './profile-setup-page/profile-setup-page.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { TranslationTestComponent } from './translation-test/translation-test.component';
import { InterestSetupPageComponent } from './interest-setup-page/interest-setup-page.component';
import { InterestSetupChoiceComponent } from './interest-setup-choice/interest-setup-choice.component';
import { InterestSetupSelectorComponent } from './interest-setup-selector/interest-setup-selector.component';
import { SelectableListComponent } from './selectable-list/selectable-list.component';

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
    TranslationTestComponent,
    InterestSetupPageComponent,
    InterestSetupChoiceComponent,
    InterestSetupSelectorComponent,
    SelectableListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    NglModule.forRoot({
      //svgPath: "https://www.lightningdesignsystem.com/assets"
    }),
    ReactiveFormsModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  providers: [
    StorageService,
    {
      provide: Http,
      useClass: HttpProvider,
      deps: [XHRBackend, RequestOptions, StorageService, Router]
    },
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
