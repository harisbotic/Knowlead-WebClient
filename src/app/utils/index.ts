import { Response } from "@angular/http";
import { Observable } from 'rxjs/observable';
import { ApplicationUserModel } from './../models/dto';

export * from "./urls";
export * from "./storage.constants";
export * from "./converters";

export function urlFormEncode(data:any) : string {
    let rets = [];
    for (var key in data) {
        rets.push(key + "=" + data[key]);
    }
    return rets.join("&");
}

export function fromObservable<T>(
        observable: Observable<T>,
        object: any,
        property: string) {
    observable.subscribe((data) => {
        object[property] = data;
    });
}

export function parseJwt(token: string): any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

interface NameInterface {
    name: string
}

export function baseLookup(source: Observable<NameInterface[]>, query: string): Observable<any[]> {
    return source.map((entry: NameInterface[]) => {
        return _.filter(entry, val => val.name.toLowerCase().indexOf(query) > -1);
    });
}