import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { PopoverModule } from 'ngx-popover';
import { SelectModule } from 'angular2-select';
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { Autosize } from 'angular2-autosize/angular2-autosize';


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
import { RegisteredGuard } from './guards/registered.guard';
import { UiSwitchComponent } from './components/sub-form-components/ui-switch/ui-switch.component';
import { NotebookService } from './services/notebook.service';
import { SingleNotebookComponent } from './components/sub-notebook/single-notebook/single-notebook.component';
import { FriendshipNotificationsService } from './services/notifications/friendship-notifications.service';
import { UserNotificationsService } from './services/notifications/user-notifications.service';
import { RegisterSuccessPageComponent } from './pages/register-success-page/register-success-page.component';
import { FlatpickrComponent } from './components/sub-form-components/flatpickr/flatpickr.component';
import { P2pDiscussionComponent } from './components/sub-p2p/p2p-discussion/p2p-discussion.component';
import { P2pThreadComponent } from './components/sub-p2p/p2p-thread/p2p-thread.component';
import { DefaultHomePageComponent } from './pages/user-home-page/default-home-page/default-home-page.component';
import { SingleP2pComponent } from './pages/user-home-page/single-p2p/single-p2p.component';
import { ReferralsPageComponent } from './pages/store/referrals-page/referrals-page.component';
import { CallChatComponent } from './pages/call-page/call-chat/call-chat.component';
import { FullNamePipe } from './pipes/full-name.pipe';
import { UserProfileLinkPipe } from './pipes/user-profile-link.pipe';
import { AboutMeComponent } from './pages/profile-page/about-me/about-me.component';
import { AboutMeReviewsComponent } from './pages/profile-page/about-me/about-me-reviews/about-me-reviews.component';
import { AboutMeP2psComponent } from './pages/profile-page/about-me/about-me-p2ps/about-me-p2ps.component';
import { LibraryComponent } from './pages/profile-page/library/library.component';
import { FriendshipsComponent } from './pages/profile-page/friendships/friendships.component';
import { SingleFriendshipComponent } from './pages/profile-page/friendships/single-friendship/single-friendship.component';
import { FeedbackFormDirective } from './directives/feedback-form.directive';
import { HeaderSearchComponent } from './components/header/header-search/header-search.component';
import { FilteredHomePageComponent } from './pages/user-home-page/filtered-home-page/filtered-home-page.component';
import { SingleReviewComponent } from './pages/profile-page/about-me/about-me-reviews/single-review/single-review.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { FormControlErrorDirective } from './directives/form-control-error.directive';
import { ErrorTooltipComponent } from './components/sub-popups/error-tooltip/error-tooltip.component';
import { NotebookEditPopupComponent } from './components/sub-notebook/notebook-edit-popup/notebook-edit-popup.component';
import { ChatNotificationsService } from './services/notifications/chat-notifications.service';
import { P2pCardComponent } from './components/sub-p2p/p2p-card/p2p-card.component';

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
    NotificationIconComponent,
    UiSwitchComponent,
    SingleNotebookComponent,
    RegisterSuccessPageComponent,
    Autosize,
    FlatpickrComponent,
    P2pDiscussionComponent,
    P2pThreadComponent,
    DefaultHomePageComponent,
    SingleP2pComponent,
    ReferralsPageComponent,
    CallChatComponent,
    FullNamePipe,
    UserProfileLinkPipe,
    AboutMeComponent,
    AboutMeReviewsComponent,
    AboutMeP2psComponent,
    LibraryComponent,
    FriendshipsComponent,
    SingleFriendshipComponent,
    FeedbackFormDirective,
    HeaderSearchComponent,
    FilteredHomePageComponent,
    SingleReviewComponent,
    TermsConditionsPageComponent,
    FormControlErrorDirective,
    ErrorTooltipComponent,
    NotebookEditPopupComponent,
    P2pCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    MomentModule,
    PopoverModule,
    SelectModule,
    PerfectScrollbarModule,
    NglModule.forRoot({
      svgPath: '/assets'
    }),
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
    {
      provide: RegisteredGuard,
      deps: [Router, AccountService],
      useClass: RegisteredGuard
    },
    ModelUtilsService,
    AccountService,
    ChatService,
    AnalyticsService,
    P2pService,
    NotebookService,
    StorageService,
    RealtimeService,
    {
      provide: Http,
      useClass: HttpProvider,
      deps: [XHRBackend, RequestOptions, StorageService, SessionService, Router]
    },
    SessionService,
    NotificationService,
    FriendshipNotificationsService,
    UserNotificationsService,
    ChatNotificationsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ChatConverisationComponent]
})
export class AppModule { }

export function getLoader(http: Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}
