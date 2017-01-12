import { Routes, RouterModule } from '@angular/router';
import { FriendshipPageComponent } from './pages/friendship-page/friendship-page.component';
import { ModuleWithProviders } from '@angular/core';
import { GuestHomePageComponent } from './pages/guest-home-page/guest-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ConfirmEmailPageComponent} from './pages/confirm-email-page/confirm-email-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { TranslationTestComponent } from './pages/translation-test/translation-test.component';
import { ProfileSetupPageComponent } from './pages/profile-setup-page/profile-setup-page.component';
import { InterestSetupPageComponent } from './pages/interest-setup-page/interest-setup-page.component';
import { P2pCreateComponent } from './components/p2p-create/p2p-create.component';
import { P2pDiscussionComponent } from './pages/p2p-discussion/p2p-discussion.component';
import { CallPageComponent } from './pages/call-page/call-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: '', component: GuestHomePageComponent },
    { path: 'confirmemail', component: ConfirmEmailPageComponent },
    { path: 'home', component: UserHomePageComponent },
    { path: 'translatetest', component: TranslationTestComponent },
    { path: 'profilesetup', component: ProfileSetupPageComponent },
    { path: 'interestsetup', component: InterestSetupPageComponent },
    { path: 'p2ptest', component: P2pCreateComponent },
    { path: 'p2p/:id', component: P2pDiscussionComponent },
    { path: 'call/:id', component: CallPageComponent },
    { path: 'profile/:id', component: ProfilePageComponent },
    { path: 'friendships', component: FriendshipPageComponent }
];

export const appRoutingProviders: any[] = [
];

export const freePaths = ['login', 'register', '', 'confirmemail'];

export function isPathFree(path: string): boolean {
    if (path.startsWith('/')) {
        path = path.substr(1);
    }
    if (path.indexOf('?') !== -1) {
        path = path.substr(0, path.indexOf('?'));
    }
    return freePaths.indexOf(path) !== -1;
}

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
