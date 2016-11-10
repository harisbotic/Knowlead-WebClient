import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { GuestHomePageComponent } from "./guest-home-page/guest-home-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { ConfirmEmailPageComponent} from './confirm-email-page/confirm-email-page.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { TranslationTestComponent } from './translation-test/translation-test.component';
import { ProfileSetupPageComponent } from './profile-setup-page/profile-setup-page.component';
import { InterestSetupPageComponent } from './interest-setup-page/interest-setup-page.component';
import { InterestSetupChoiceComponent } from './interest-setup-choice/interest-setup-choice.component';
import { P2pCreateComponent } from './p2p-create/p2p-create.component';
 
const appRoutes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: '', component: GuestHomePageComponent },
    { path: 'confirmemail', component: ConfirmEmailPageComponent },
    { path: 'home', component: UserHomePageComponent },
    { path: 'translatetest', component: TranslationTestComponent },
    { path: 'profilesetup', component: ProfileSetupPageComponent },
    { path: 'interestsetup', component: InterestSetupPageComponent },
    { path: 'p2ptest', component: P2pCreateComponent }
];

export const appRoutingProviders: any[] = [
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
