import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { GuestHomePageComponent } from "./guest-home-page/guest-home-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";

const appRoutes: Routes = [
    { path: 'welcome', component: GuestHomePageComponent },
    { path: 'login', component: LoginPageComponent }
];

export const appRoutingProviders: any[] = [
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
