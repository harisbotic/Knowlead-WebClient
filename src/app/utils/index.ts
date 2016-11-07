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
        return _.filter(entry, val => stringContains(val.name, query));
    });
}

export function stringContains(theStr: string, query: string): boolean {
    return theStr.toLowerCase().indexOf(query.toLowerCase()) >= 0;
}

export function iterateObjectAlphabetically(obj: any, callback: (value: any, key: any, original?: any) => void) {
    var arr = [],
        i;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i);
        }
    }

    arr.sort();

    for (i = 0; i < arr.length; i++) {
        var key = obj[arr[i]];
        if (callback) {
            callback(obj[arr[i]], arr[i], obj);
        }
    }
}

export function treeify(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function(obj) {
        lookup[obj[idAttr]] = obj;
    });
    list.forEach(function(obj) {
        if (obj[parentAttr] != null) {
            lookup[obj[parentAttr]][childrenAttr] = lookup[obj[parentAttr]][childrenAttr] || [];
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
};