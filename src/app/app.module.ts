import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { MomentModule } from 'angular2-moment';

import { AppRouting } from "./app.routing"
import { AppComponent } from './app.component';
import { GuestHomePageComponent } from './pages/guest-home-page/guest-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { ConfirmEmailPageComponent } from './pages/confirm-email-page/confirm-email-page.component';

import { SessionService } from './services/session.service';
import { HttpProvider } from './http.provider';
import { StorageService } from './services/storage.service';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { Router } from '@angular/router';
import { NglModule, INglConfig } from 'ng-lightning';
import { ProfileSetupPageComponent } from './pages/profile-setup-page/profile-setup-page.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { TranslationTestComponent } from './pages/translation-test/translation-test.component';
import { InterestSetupPageComponent } from './pages/interest-setup-page/interest-setup-page.component';
import { InterestSetupChoiceComponent } from './pages/interest-setup-page/interest-setup-choice/interest-setup-choice.component';
import { InterestSetupSelectorComponent } from './pages/interest-setup-page/interest-setup-selector/interest-setup-selector.component';
import { SelectableListComponent } from './components/selectable-list/selectable-list.component';
import { P2pCreateComponent } from './components/p2p-create/p2p-create.component';
import { FosSelectorComponent } from './components/fos-selector/fos-selector.component';
import { EmptyLookupComponent } from './components/empty-lookup/empty-lookup.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { NotificationService } from './services/notification.service';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { TranslateParametricPipe } from './pipes/translate-parametric.pipe';
import { RealtimeService } from './services/realtime.service';
import { P2pComponent } from './components/p2p/p2p.component';
import { P2pDiscussionComponent } from './pages/p2p-discussion/p2p-discussion.component';
import { ModelUtilsService } from './services/model-utils.service';
import { P2pService } from './services/p2p.service';
import { AccountService } from './services/account.service';
import { CallDialogComponent } from './components/call-dialog/call-dialog.component';

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
    SelectableListComponent,
    P2pCreateComponent,
    FosSelectorComponent,
    EmptyLookupComponent,
    FileUploadComponent,
    NotificationsComponent,
    DatepickerComponent,
    TranslateParametricPipe,
    P2pComponent,
    P2pDiscussionComponent,
    CallDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    MomentModule,
    NglModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
      deps: [Http]
    })
  ],
  providers: [
    StorageService,
    RealtimeService,
    {
      provide: Http,
      useClass: HttpProvider,
      deps: [XHRBackend, RequestOptions, StorageService, SessionService, Router]
    },
    SessionService,
    NotificationService,
    ModelUtilsService,
    P2pService,
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
