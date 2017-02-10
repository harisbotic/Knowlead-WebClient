import { Routes, RouterModule } from '@angular/router';
import { FriendshipPageComponent } from './pages/friendship-page/friendship-page.component';
import { ModuleWithProviders } from '@angular/core';
import { GuestHomePageComponent } from './pages/guest-home-page/guest-home-page.component';
import { ConfirmEmailPageComponent} from './pages/confirm-email-page/confirm-email-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { TranslationTestComponent } from './pages/translation-test/translation-test.component';
import { ProfileSetupPageComponent } from './pages/profile-setup-page/profile-setup-page.component';
import { InterestSetupPageComponent } from './pages/interest-setup-page/interest-setup-page.component';
import { P2pCreateComponent } from './components/sub-p2p/p2p-create/p2p-create.component';
import { P2pDiscussionComponent } from './pages/p2p-discussion/p2p-discussion.component';
import { CallPageComponent } from './pages/call-page/call-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AuthGuard } from './guards/auth.guard';
import { MediatestComponent } from './pages/mediatest/mediatest.component';
import { RegisteredGuard } from './guards/registered.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { RegisterSuccessPageComponent } from './pages/register-success-page/register-success-page.component';

const appRoutes: Routes = [
    { path: 'login', redirectTo: '/' },
    { path: '', component: GuestHomePageComponent, children: [
        { path: '', component: LoginPageComponent },
        { path: 'register', component: RegisterPageComponent },
        { path: 'registerSuccess', component: RegisterSuccessPageComponent }
    ] },
    { path: 'confirmemail', component: ConfirmEmailPageComponent },
    { path: 'home', component: UserHomePageComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'translatetest', component: TranslationTestComponent },
    { path: 'profilesetup', component: ProfileSetupPageComponent, canActivate: [AuthGuard] },
    { path: 'interestsetup', component: InterestSetupPageComponent, canActivate: [AuthGuard] },
    { path: 'p2ptest', component: P2pCreateComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'p2p/:id', component: P2pDiscussionComponent },
    { path: 'call/:id', component: CallPageComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'profile/:id', component: ProfilePageComponent },
    { path: 'friendships', component: FriendshipPageComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'mediatest', component: MediatestComponent, canActivate: [AuthGuard, RegisteredGuard] },
];

export const appRoutingProviders: any[] = [
];

export const freePaths = ['login', 'register', '', 'confirmemail', 'registerSuccess'];

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
