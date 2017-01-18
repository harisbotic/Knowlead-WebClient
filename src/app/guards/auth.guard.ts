import { CanActivate, Router } from '@angular/router';
import { SessionService, SessionEvent } from '../services/session.service';
import { Observable } from 'rxjs/Rx';

export class AuthGuard implements CanActivate {
    constructor(protected router: Router, protected sessionService: SessionService) {}
    canActivate(): Observable<boolean> {
        return this.sessionService.eventStream.filter(val => val !== undefined).take(1).map((val) => {
            const ret = val === SessionEvent.LOGGED_IN;
            if (!ret) {
                this.router.navigate(['/login']);
            }
            return ret;
        });
    }
}
