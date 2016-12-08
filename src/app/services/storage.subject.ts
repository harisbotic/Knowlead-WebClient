import { Observable, Subscriber } from 'rxjs/Rx';
import { URLSearchParams, Http } from '@angular/http';
import { STORAGE_CONFIG } from '../utils/storage.constants';
import { responseToResponseModel } from '../utils/converters';
import * as _ from 'lodash';

export type StorageFiller<T> = (value: T) => Observable<T>; 

export class StorageSubject<T> extends Observable<T> {
    value: T;

    subscribers: Subscriber<T>[] = [];
    fetching: boolean;

    constructor(
            protected key: string,
            protected parameters: {[key: string]: string},
            protected http: Http,
            protected filler?: StorageFiller<T>) {
        super();
        this._subscribe = this.subscribed.bind(this);
        if (STORAGE_CONFIG[key].parameters) {
            STORAGE_CONFIG[key].parameters.forEach(key => {
                if (!parameters[key])
                    throw new Error("Parameter not found for request: " + key);
            });
        }
    }

    protected subscribed(subscriber: Subscriber<T>): () => void {
        // console.warn("New subscriber " + this.key + " (value: " + this.value + ")");
        if (!this.value) {
            if (!this.fetching) {
                this.refresh();
            } else {
                console.debug(`Cache ${this.key}: Waiting for response ...`)
            }
        } else {
            console.debug(`Cache ${this.key}: Emitting cached value`);
            subscriber.next(this.value);
        }
        this.subscribers.push(subscriber);
        return () => {};
    }

    private setValue(newValue: T) {
        this.value = newValue;
        this.notifyObservers();
    }

    public changeValue(newValue: T) {
        console.debug(`Cache ${this.key}: Value is changed`);
        if (this.filler) {
            this.filler(newValue).subscribe(filledValue => {
                this.setValue(newValue);
            });
        } else {
            this.setValue(newValue);
        }
    }

    public refresh() {
        console.debug(`Cache ${this.key}: Loading from API`);
        this.fetching = true;
        let params: URLSearchParams;
        let suffix = "";
        if (this.parameters != null) {
            if (this.parameters["id"]) {
                suffix = "/" + this.parameters["id"];
                delete this.parameters["id"];
            }
            params = new URLSearchParams();
            for (let searchkey in this.parameters)
                params.set(searchkey, this.parameters[searchkey]);
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
        this.subscribers.forEach(subscriber => {
            subscriber.next(this.value);
        });
        this.subscribers = this.subscribers.filter(s => !s.closed);
    }
}