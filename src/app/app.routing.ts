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
 
const appRoutes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: '', component: GuestHomePageComponent },
    { path: 'confirmemail', component: ConfirmEmailPageComponent },
    { path: 'home', component: UserHomePageComponent },
    { path: 'translatetest', component: TranslationTestComponent },
    { path: 'profilesetup', component: ProfileSetupPageComponent },
    { path: 'interestsetup', component: InterestSetupPageComponent }
];

export const appRoutingProviders: any[] = [
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
