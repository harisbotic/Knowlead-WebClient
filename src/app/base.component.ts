import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
export class BaseComponent implements OnDestroy {
    protected subscriptions: Subscription[] = [];
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
