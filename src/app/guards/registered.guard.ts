import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../services/account.service';

export class RegisteredGuard implements CanActivate {
    constructor(protected router: Router, protected accountService: AccountService) {}
    canActivate(): Observable<boolean> {
        return this.accountService.currentUser().take(1).map((user) => {
            if (user) {
                if (user.name) {
                    return true;
                } else {
                    this.router.navigate(['/profilesetup']);
                }
            } else {
                this.router.navigate(['/login']);
            }
            return false;
        });
    }
}
