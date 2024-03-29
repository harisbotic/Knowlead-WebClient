import { Observable, Subscriber } from 'rxjs/Rx';
import { URLSearchParams, Http } from '@angular/http';
import { STORAGE_CONFIG, StorageKey } from '../utils/storage.constants';
import { responseToResponseModel } from '../utils/converters';
import { StorageService } from './storage.service';
import { Subscription } from 'rxjs';
import { cloneDeep, clone, find, isEqual } from 'lodash';

export type StorageFiller<T> = (value: T) => Observable<T>;

export class StorageSubject<T> extends Observable<T> {
    public value: T;

    public subscribers: Subscriber<T>[] = [];
    fetching: boolean;
    public cacheKey: string;
    fillerSubscription: Subscription;
    firstTime = true;

    constructor(
            public key: StorageKey,
            protected parameters: {[key: string]: string},
            protected http: Http,
            protected filler?: StorageFiller<T>) {
        super();
        this.cacheKey = StorageService.getCacheKey(this.key, this.parameters);
        this._subscribe = this.subscribed.bind(this);
        if (STORAGE_CONFIG[key].parameters) {
            STORAGE_CONFIG[key].parameters.forEach(kkey => {
                if (parameters[kkey] === undefined) {
                    throw new Error('Parameter not found for request: ' + kkey + ' (storage key: ' + key + ')');
                }
            });
        }
        if (STORAGE_CONFIG[key].storeOffline) {
            this.value = this.getLocalStorageValue();
        }
    }

    private getLocalStorageKey(): string {
        return 'storage-cache:' + this.cacheKey;
    }

    private hasValueInLocalStorage(): boolean {
        return !!localStorage.getItem(this.getLocalStorageKey());
    }

    private setValueToLocalStorage() {
        if (this.value) {
            const obj = {
                value: this.value,
                version: 0
            };
            localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(obj));
        } else {
            this.clearValueInLocalStorage();
        }
    }

    private getLocalStorageValue() {
        if (this.hasValueInLocalStorage()) {
            console.log('Loading from local storage: ' + this.key);
            return <T>JSON.parse(localStorage.getItem(this.getLocalStorageKey())).value;
        } else {
            console.log('No data to load from local storage: ' + this.key);
        }
    }

    private clearValueInLocalStorage() {
        console.log('Clearing local storage: ' + this.key);
        localStorage.removeItem(this.getLocalStorageKey());
    }

    protected pause() {
        /*if (this.key == "p2p")
            debugger;*/
    }

    protected subscribed(subscriber: Subscriber<T>): () => void {
        this.pause();
        if (!this.value) {
            this.refresh();
        } else {
            // console.debug(`Cache ${this.cacheKey}: Emitting cached value`);
            subscriber.next(this.value);
        }
        this.subscribers.push(subscriber);
        return () => {
            subscriber.unsubscribe();
            this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
        };
    }

    // Set value without involving filler
    private setValue(newValue: T) {
        const oldValue = this.value;
        this.value = newValue;
        if (!isEqual(oldValue, newValue)) {
            if (STORAGE_CONFIG[this.key].storeOffline) {
                this.setValueToLocalStorage();
            }
            this.notifyObservers();
        }
    }

    public dispose() {
        this.changeValue(null);
        this.subscribers.forEach(sub => sub.unsubscribe());
        this.subscribers = [];
    }

    // Set value with filler
    public changeValue(newValue: T) {
        this.pause();
        if (this.fillerSubscription) {
            this.fillerSubscription.unsubscribe();
            delete this.fillerSubscription;
        }
        // console.debug(`Cache ${this.cacheKey}: Value is changed`);
        if (this.filler && newValue) {
            this.fetching = true;
            this.fillerSubscription = this.filler(newValue).finally(() => this.fetching = false).subscribe(filledValue => {
                this.setValue(filledValue);
            });
        } else {
            this.setValue(newValue);
        }
    }

    public refresh(force?: boolean) {
        // console.debug(`Cache ${this.cacheKey}: Loading from API`);
        if (this.fetching && !force && !this.firstTime) {
            return;
        }
        this.firstTime = false;
        const cfg = STORAGE_CONFIG[this.key];
        if (cfg.mock) {
            if (cfg.mock.type === 'object') {
                this.changeValue(cfg.mock.value);
            } else if (cfg.mock.type === 'array') {
                this.changeValue(<T>find(cfg.mock.value, v => v[cfg.mock.idKey] === this.parameters['id']));
            }
            return;
        }
        this.fetching = true;
        let params: URLSearchParams;
        let suffix = '';
        if (this.parameters != null) {
            let parameters = clone(this.parameters);
            if (parameters['id']) {
                suffix = '/' + parameters['id'];
                delete parameters['id'];
            }
            params = new URLSearchParams();
            for (let searchkey of Object.keys(parameters)) {
                params.set(searchkey, parameters[searchkey]);
            }
        }
        this.http.get(cfg.api + suffix, {search: params})
            // .retry(10)
            .finally(() => {
                this.fetching = false;
            })
            .map(responseToResponseModel)
            .map(r => r.object)
            .subscribe(object => {
                this.changeValue(object);
            });
    }

    protected notifyObservers() {
        this.subscribers = this.subscribers.filter(s => !s.closed);
        this.subscribers.forEach(subscriber => {
            subscriber.next(this.value);
        });
    }

    public handleLogout() {
        if (STORAGE_CONFIG[this.key].clearOnLogout) {
            Observable.timer(0).take(1).subscribe(() => {
                this.changeValue(undefined);
            });
            this.clearValueInLocalStorage();
        }
    }

    public modifyWithFunction(func: (oldValue: T) => T) {
        if (this.value != null) {
            this.changeValue(func(cloneDeep(this.value)));
        }
    }
}
