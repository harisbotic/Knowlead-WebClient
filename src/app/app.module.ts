import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { PopoverModule } from 'ngx-popover';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { GuestHomePageComponent } from './pages/guest-home-page/guest-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ErrorListComponent } from './components/sub-form-components/error-list/error-list.component';
import { ConfirmEmailPageComponent } from './pages/confirm-email-page/confirm-email-page.component';

import { SessionService } from './services/session.service';
import { HttpProvider } from './http.provider';
import { StorageService } from './services/storage.service';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { Router } from '@angular/router';
import { NglModule } from 'ng-lightning';
import { ProfileSetupPageComponent } from './pages/profile-setup-page/profile-setup-page.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { TranslationTestComponent } from './pages/translation-test/translation-test.component';
import { InterestSetupPageComponent } from './pages/interest-setup-page/interest-setup-page.component';
import { InterestSetupChoiceComponent } from './pages/interest-setup-page/interest-setup-choice/interest-setup-choice.component';
import { InterestSetupSelectorComponent } from './pages/interest-setup-page/interest-setup-selector/interest-setup-selector.component';
import { SelectableListComponent } from './components/selectable-list/selectable-list.component';
import { P2pCreateComponent } from './components/sub-p2p/p2p-create/p2p-create.component';
import { FosSelectorComponent } from './components/sub-form-components/fos-selector/fos-selector.component';
import { EmptyLookupComponent } from './components/sub-form-components/empty-lookup/empty-lookup.component';
import { FileUploadComponent } from './components/sub-form-components/file-upload/file-upload.component';
import { NotificationService } from './services/notifications/notification.service';
import { NotificationsComponent } from './components/sub-popups/notifications/notifications.component';
import { DatepickerComponent } from './components/sub-form-components/datepicker/datepicker.component';
import { TranslateParametricPipe } from './pipes/translate-parametric.pipe';
import { RealtimeService } from './services/realtime.service';
import { P2pComponent } from './components/sub-p2p/p2p/p2p.component';
import { P2pDiscussionComponent } from './pages/p2p-discussion/p2p-discussion.component';
import { ModelUtilsService } from './services/model-utils.service';
import { P2pService } from './services/p2p.service';
import { AccountService } from './services/account.service';
import { CallDialogComponent } from './components/sub-popups/call-dialog/call-dialog.component';
import { CallPageComponent } from './pages/call-page/call-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ChatService } from './services/chat.service';
import { ChatComponent } from './components/sub-chat/chat/chat.component';
import { ChatConverisationComponent } from './components/sub-chat/chat-converisation/chat-converisation.component';
import { FriendshipPageComponent } from './pages/friendship-page/friendship-page.component';
import { FriendshipStripComponent } from './components/friendship-strip/friendship-strip.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthGuard } from './guards/auth.guard';
import { MediatestComponent } from './pages/mediatest/mediatest.component';
import { FeedbackFormComponent } from './components/sub-popups/feedback-form/feedback-form.component';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AnalyticsService } from './services/analytics.service';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { NotebookListComponent } from './components/sub-notebook/notebook-list/notebook-list.component';
import { NotebookEditComponent } from './components/sub-notebook/notebook-edit/notebook-edit.component';
import { TextInputComponent } from './components/sub-form-components/text-input/text-input.component';
import { SingleNotificationComponent } from './components/sub-notifications/single-notification/single-notification.component';
import { NotificationIconComponent } from './components/sub-notifications/notification-icon/notification-icon.component';

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
    CallDialogComponent,
    CallPageComponent,
    ProfilePageComponent,
    ChatComponent,
    ChatConverisationComponent,
    FriendshipPageComponent,
    FriendshipStripComponent,
    HeaderComponent,
    MediatestComponent,
    FeedbackFormComponent,
    ProfilePictureComponent,
    NotebookListComponent,
    NotebookEditComponent,
    TextInputComponent,
    SingleNotificationComponent,
    NotificationIconComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    MomentModule,
    PopoverModule,
    NglModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: getLoader,
      deps: [Http]
    })
  ],
  providers: [
    // this solves problem "Unknown parameters for DI in constructor"
    {
      provide: AuthGuard,
      deps: [Router, SessionService],
      useClass: AuthGuard
    },
    AccountService,
    ModelUtilsService,
    ChatService,
    P2pService,
    StorageService,
    RealtimeService,
    AnalyticsService,
    {
      provide: Http,
      useClass: HttpProvider,
      deps: [XHRBackend, RequestOptions, StorageService, SessionService, Router]
    },
    SessionService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getLoader(http: Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}
