import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../services/account.service';

export class RegisteredGuard implements CanActivate {
    constructor(protected router: Router, protected accountService: AccountService) {}
    canActivate(): Observable<boolean> {
        return this.accountService.currentUser().take(1).map((user) => {
            if (user) {
                if (user.name && user.interests && user.interests.length > 0) {
                    return true;
                } else {
                    if (!user.name) {
                        this.router.navigate(['/profilesetup']);
                    } else if (!user.interests || user.interests.length === 0) {
                        this.router.navigate(['/interestsetup']);
                    } else {
                        console.error('Error redirecting this stuff');
                    }
                }
            } else {
                this.router.navigate(['/login']);
            }
            return false;
        });
    }
}
