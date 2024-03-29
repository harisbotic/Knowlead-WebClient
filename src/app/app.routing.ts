import { Routes, RouterModule, RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { FriendshipPageComponent } from './pages/friendship-page/friendship-page.component';
import { ModuleWithProviders, Component } from '@angular/core';
import { GuestHomePageComponent } from './pages/guest-home-page/guest-home-page.component';
import { ConfirmEmailPageComponent} from './pages/confirm-email-page/confirm-email-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { TranslationTestComponent } from './pages/translation-test/translation-test.component';
import { ProfileSetupPageComponent } from './pages/profile-setup-page/profile-setup-page.component';
import { InterestSetupPageComponent } from './pages/interest-setup-page/interest-setup-page.component';
import { CallPageComponent } from './pages/call-page/call-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AuthGuard } from './guards/auth.guard';
import { MediatestComponent } from './pages/mediatest/mediatest.component';
import { RegisteredGuard } from './guards/registered.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { RegisterSuccessPageComponent } from './pages/register-success-page/register-success-page.component';
import { DefaultHomePageComponent } from './pages/user-home-page/default-home-page/default-home-page.component';
import { SingleP2pComponent } from './pages/user-home-page/single-p2p/single-p2p.component';
import { ReferralsPageComponent } from './pages/store/referrals-page/referrals-page.component';
import { CallChatComponent } from './pages/call-page/call-chat/call-chat.component';
import { NotebookListComponent } from './components/sub-notebook/notebook-list/notebook-list.component';
import { NotebookEditComponent } from './components/sub-notebook/notebook-edit/notebook-edit.component';
import { AboutMeComponent } from './pages/profile-page/about-me/about-me.component';
import { AboutMeReviewsComponent } from './pages/profile-page/about-me/about-me-reviews/about-me-reviews.component';
import { AboutMeP2psComponent } from './pages/profile-page/about-me/about-me-p2ps/about-me-p2ps.component';
import { LibraryComponent } from './pages/profile-page/library/library.component';
import { FriendshipsComponent } from './pages/profile-page/friendships/friendships.component';
import { FilteredHomePageComponent } from './pages/user-home-page/filtered-home-page/filtered-home-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { NotebookEditPopupComponent } from './components/sub-notebook/notebook-edit-popup/notebook-edit-popup.component';
import { P2pCreateComponent } from './components/sub-p2p/p2p-create/p2p-create.component';
import { P2pCreatePageComponent } from './pages/p2p-create-page/p2p-create-page.component';
import { AllMessagesPageComponent } from './pages/user-home-page/all-messages-page/all-messages-page.component';

const appRoutes: Routes = [
    { path: 'login', redirectTo: '/' },
    { path: '', component: GuestHomePageComponent, children: [
        { path: '', component: LoginPageComponent },
        { path: 'register', component: RegisterPageComponent },
        { path: 'terms', component: TermsConditionsPageComponent },
        { path: 'registerSuccess', component: RegisterSuccessPageComponent }
    ] },
    { path: 'confirmemail', component: ConfirmEmailPageComponent },
    { path: 'home', component: UserHomePageComponent, canActivate: [AuthGuard, RegisteredGuard], children: [
        { path: '', component: DefaultHomePageComponent },
        { path: 'filtered/:id', component: FilteredHomePageComponent },
        { path: 'p2p/:id', component: SingleP2pComponent },
        { path: 'messages', component: AllMessagesPageComponent }
    ] },
    { path: 'translatetest', component: TranslationTestComponent },
    { path: 'profilesetup', component: ProfileSetupPageComponent, canActivate: [AuthGuard] },
    { path: 'interestsetup', component: InterestSetupPageComponent, canActivate: [AuthGuard] },
    { path: 'call/:id', component: CallPageComponent, canActivate: [AuthGuard, RegisteredGuard], children: [
        { path: 'chat', component: CallChatComponent, pathMatch: 'full' },
        { path: 'notebook', component: NotebookListComponent, pathMatch: 'full' },
        { path: 'notebook/:id', component: NotebookEditComponent, pathMatch: 'full' },
        { path: '', redirectTo: 'chat', pathMatch: 'full' }
    ] },
    { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuard, RegisteredGuard], children: [{
        path: '', component: AboutMeComponent, children: [
            {path: '', component: AboutMeReviewsComponent},
            {path: 'p2ps', component: AboutMeP2psComponent}
        ]
    }, {
        path: 'library', component: LibraryComponent, children: [{
            path: '',
            children: []
        }, {
            path: ':id',
            component: NotebookEditPopupComponent
        }]
    }, {
        path: 'friends', component: FriendshipsComponent
    }] },
    { path: 'friendships', component: FriendshipPageComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'mediatest', component: MediatestComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'store', component: ReferralsPageComponent, canActivate: [AuthGuard, RegisteredGuard] },
    { path: 'p2p', component: P2pCreatePageComponent, canActivate: [AuthGuard, RegisteredGuard]}
];

export const appRoutingProviders: any[] = [
];

export const freePaths = ['login', 'register', '', 'confirmemail', 'registerSuccess', 'terms'];

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

// export interface ShouldReuse {
//     shouldStore(route: ActivatedRouteSnapshot, data: any): boolean;
//     store(): any;
//     shouldRestore(route: ActivatedRouteSnapshot, data: any): boolean;
//     restore(data: any);
// }

// function isShouldReuseComponent(component: Component): component is ShouldReuse {
//     const tmp: any = component;
//     return tmp.shouldRestore && tmp.store && tmp.shouldRestore && tmp.restore;
// }

// export class CustomReuseStrategy implements RouteReuseStrategy {

//     handlers: {[key: string]: DetachedRouteHandle} = {};
//     data: {[key: string]: any} = {};

//     private getData(route: ActivatedRouteSnapshot): any {
//         if (!!route.routeConfig) {
//             return this.data[route.routeConfig.path];
//         }
//     }

//     private setData(route: ActivatedRouteSnapshot, data: any) {
//         if (!!route.routeConfig) {
//             this.data[route.routeConfig.path] = data;
//         }
//     }

//     private getHandler(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//         if (!!route.routeConfig) {
//             return this.handlers[route.routeConfig.path];
//         }
//     }

//     private setHandler(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
//         if (!!route.routeConfig) {
//             this.handlers[route.routeConfig.path] = handle;
//         }
//     }

//     shouldDetach(route: ActivatedRouteSnapshot): boolean {
//         const tmp: ShouldReuse = <any>route.component;
//         return (isShouldReuseComponent(route.component)) ? tmp.shouldStore(route, this.getData(route)) : false;
//     }

//     store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//         const tmp: ShouldReuse = <any>route.component;
//         this.setData(route, tmp.store());
//         this.setHandler(route, handle);
//     }

//     shouldAttach(route: ActivatedRouteSnapshot): boolean {
//         if (!!route.routeConfig && isShouldReuseComponent(route.component)) {
//             const tmp: ShouldReuse = <any>route.component;
//             const rest = tmp.shouldRestore(route, this.getData(route));
//             if (rest && this.getHandler(route)) {
//                 return true;
//             }
//             if (!rest && this.getData(route)) {
//                 delete this.data[route.routeConfig.path];
//             }
//             if (!rest && this.getHandler(route)) {
//                 delete this.handlers[route.routeConfig.path];
//             }
//         }
//         return false;
//     }

//     retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//         if (!route.routeConfig) {
//             return null;
//         }
//         const tmp: ShouldReuse = <any>route.component;
//         if (this.)
//         tmp.restore(this.getData(route));
//         return this.getHandler(route);
//     }

//     shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//         return future.routeConfig === curr.routeConfig;
//     }

// }