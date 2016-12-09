import { Observable, Subscriber } from 'rxjs/Rx';
import { URLSearchParams, Http } from '@angular/http';
import { STORAGE_CONFIG, StorageKey } from '../utils/storage.constants';
import { responseToResponseModel } from '../utils/converters';
import * as _ from 'lodash';
import { StorageService } from './storage.service';

export type StorageFiller<T> = (value: T) => Observable<T>; 

export class StorageSubject<T> extends Observable<T> {
    public value: T;

    public subscribers: Subscriber<T>[] = [];
    fetching: boolean;
    public cacheKey: string;

    constructor(
            protected key: StorageKey,
            protected parameters: {[key: string]: string},
            protected http: Http,
            protected filler?: StorageFiller<T>) {
        super();
        this.cacheKey = StorageService.getCacheKey(this.key, this.parameters);
        this._subscribe = this.subscribed.bind(this);
        if (STORAGE_CONFIG[key].parameters) {
            STORAGE_CONFIG[key].parameters.forEach(key => {
                if (!parameters[key])
                    throw new Error("Parameter not found for request: " + key);
            });
        }
    }

    protected subscribed(subscriber: Subscriber<T>): () => void {
        if (!this.value) {
            if (!this.fetching) {
                this.refresh();
            } else {
                // console.debug(`Cache ${this.cacheKey}: Waiting for response ...`)
            }
        } else {
            // console.debug(`Cache ${this.cacheKey}: Emitting cached value`);
            subscriber.next(this.value);
        }
        this.subscribers.push(subscriber);
        return () => {
            subscriber.unsubscribe();
            this.subscribers = this.subscribers.filter((sub) => sub != subscriber);
        };
    }

    private setValue(newValue: T) {
        this.value = newValue;
        this.notifyObservers();
    }

    public changeValue(newValue: T) {
        // console.debug(`Cache ${this.cacheKey}: Value is changed`);
        if (this.filler) {
            this.filler(newValue).subscribe(filledValue => {
                this.setValue(newValue);
            });
        } else {
            this.setValue(newValue);
        }
    }

    public refresh() {
        // console.debug(`Cache ${this.cacheKey}: Loading from API`);
        this.fetching = true;
        let params: URLSearchParams;
        let suffix = "";
        if (this.parameters != null) {
            let parameters = _.clone(this.parameters);
            if (parameters["id"]) {
                suffix = "/" + parameters["id"];
                delete parameters["id"];
            }
            params = new URLSearchParams();
            for (let searchkey in parameters)
                params.set(searchkey, parameters[searchkey]);
        }
        let o = this.http.get(STORAGE_CONFIG[this.key].api + suffix, {search: params})
            .retry(10)
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
        let before = this.subscribers.length;
        this.subscribers = this.subscribers.filter(s => !s.closed);
        this.subscribers.forEach(subscriber => {
            subscriber.next(this.value);
        });
        // console.debug(`Cache ${this.cacheKey}: subscribers count: ${this.subscribers.length} (${before - this.subscribers.length} deleted)`);
    }
}