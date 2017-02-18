import { Observable, Subscriber } from 'rxjs/Rx';
import { URLSearchParams, Http } from '@angular/http';
import { STORAGE_CONFIG, StorageKey } from '../utils/storage.constants';
import { responseToResponseModel } from '../utils/converters';
import * as _ from 'lodash';
import { StorageService } from './storage.service';
import { Subscription } from 'rxjs';

export type StorageFiller<T> = (value: T) => Observable<T>;

export class StorageSubject<T> extends Observable<T> {
    public value: T;

    public subscribers: Subscriber<T>[] = [];
    fetching: boolean;
    public cacheKey: string;
    fillerSubscription: Subscription;

    constructor(
            protected key: StorageKey,
            protected parameters: {[key: string]: string},
            protected http: Http,
            protected filler?: StorageFiller<T>) {
        super();
        this.cacheKey = StorageService.getCacheKey(this.key, this.parameters);
        this._subscribe = this.subscribed.bind(this);
        if (STORAGE_CONFIG[key].parameters) {
            STORAGE_CONFIG[key].parameters.forEach(kkey => {
                if (parameters[kkey] === undefined) {
                    throw new Error('Parameter not found for request: ' + kkey);
                }
            });
        }
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
        this.value = newValue;
        this.notifyObservers();
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
                this.setValue(newValue);
            });
        } else {
            this.setValue(newValue);
        }
    }

    public refresh(force?: boolean) {
        // console.debug(`Cache ${this.cacheKey}: Loading from API`);
        if (this.fetching && !force) {
            return;
        }
        const cfg = STORAGE_CONFIG[this.key];
        if (cfg.mock) {
            if (cfg.mock.type === 'object') {
                this.changeValue(cfg.mock.value);
            } else if (cfg.mock.type === 'array') {
                this.changeValue(<T>_.find(cfg.mock.value, v => v[cfg.mock.idKey] === this.parameters['id']));
            }
            return;
        }
        this.fetching = true;
        let params: URLSearchParams;
        let suffix = '';
        if (this.parameters != null) {
            let parameters = _.clone(this.parameters);
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
            this.changeValue(undefined);
        }
    }

    public modifyWithFunction(func: (oldValue: T) => T) {
        if (this.value != null) {
            this.changeValue(func(this.value));
        }
    }
}
