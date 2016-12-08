import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
export class BaseComponent implements OnDestroy {
    protected subscriptions: Subscription[] = [];
    ngOnDestroy() {
        console.debug("Destroying " + this.constructor.name);
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}