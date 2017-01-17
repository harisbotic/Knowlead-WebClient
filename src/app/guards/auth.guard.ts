import { CanActivate, Router } from '@angular/router';
import { SessionService, SessionEvent } from '../services/session.service';

export class AuthGuard implements CanActivate {
    constructor(protected router: Router, protected sessionService: SessionService) {}
    canActivate(): boolean {
        const lastEvent = this.sessionService.getLastEventSync();
        if (lastEvent === SessionEvent.LOGGED_OUT || lastEvent === undefined) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
