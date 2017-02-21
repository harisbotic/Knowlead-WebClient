import { FOSModel } from '../models/dto';
import * as _ from 'lodash';
import { Subscriber, Observable } from 'rxjs/Rx';

export * from './urls';
export * from './storage.constants';
export * from './converters';

export function urlFormEncode(data: any): string {
    let rets = [];
    for (let key of Object.keys(data)) {
        rets.push(key + '=' + data[key]);
    }
    return rets.join('&');
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
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

interface NameInterface {
    name: string;
}

export function baseLookup(source: Observable<NameInterface[]>, query: string): Observable<any[]> {
    return source.map((entry: NameInterface[]) => {
        return _.filter(entry, val => stringContains(val.name, query));
    }).map(value => value.length > 0 ? value : null);
}

export function stringContains(theStr: string, query: string): boolean {
    return theStr.toLowerCase().indexOf(query.toLowerCase()) >= 0;
}

export function iterateObjectAlphabetically(obj: any, callback: (value: any, key: any, original?: any) => void) {
    let arr = [],
        i;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i);
        }
    }

    arr.sort();

    for (i = 0; i < arr.length; i++) {
        if (callback) {
            callback(obj[arr[i]], arr[i], obj);
        }
    }
}

export function treeify(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr) { idAttr = 'id'; }
    if (!parentAttr) { parentAttr = 'parent'; }
    if (!childrenAttr) { childrenAttr = 'children'; }

    let treeList = [];
    let lookup = {};
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

export function fillArray<T>(array: T[], key: string): T[] {
    let ret = <T[]>{};
    array.forEach(val => ret[val[key]] = val);
    return ret;
}

export function getFOSParents(value: FOSModel): FOSModel[] {
    let ret = <FOSModel[]>[];
    let cb = (fos: FOSModel) => {
        if (!fos) {
            return;
        }
        if (fos.coreLookupId != null) {
            ret.push(fos);
        }
        if (fos.parent != null) {
        cb(fos.parent);
        }
    };
    if (value) {
        cb(value.parent);
    }
    return ret;
}

export function getGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export const PATTERN_EMAIL = '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*';
export const PATTERN_ONE_LOWERCASE = '.*[a-z].*';

export function notifyOnObservableCancel<T>(observable: Observable<T>, callback: () => void): Observable<T> {
    return new Observable<T>((subscriber: Subscriber<T>) => {
        let canceled = true;
        let subscription = observable.do(() => {
            canceled = false;
        }).subscribe((val: T) => {
            subscriber.next(val);
        }, (err) => {
            subscriber.error(err);
        }, () => {
            subscriber.complete();
        });
        return () => {
            subscription.unsubscribe();
            if (canceled) {
                callback();
            }
        };
    });
}

export function tomorrow(): Date {
    let ret = new Date();
    ret.setDate(new Date().getDate() + 1);
    ret.setHours(0);
    ret.setMinutes(0);
    return ret;
}

export function stopMediaStream(mediaStream: MediaStream) {
    for (let track of mediaStream.getTracks()) {
        track.stop();
    }
    if (mediaStream.stop) {
        mediaStream.stop();
    }
}

export function getDateIfValid(day: number, month: number, year: number): Date {
    if (year < 1900 || year > 2050 || month <= 0 || month > 12) {
        return undefined;
    }
    const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        monthLength[1] = 29;
    }
    // Check the range of the day
    if (day > 0 && day <= monthLength[month - 1]) {
        return new Date(year, month - 1, day);
    } else {
        return undefined;
    }
}

export function getGmtDate(date: Date): Date {
    let ret = new Date(date.getTime());
    ret.setMinutes(ret.getMinutes() + ret.getTimezoneOffset());
    return ret;
}

export function getLocalDate(date: Date): Date {
    let ret = new Date(date.getTime());
    ret.setMinutes(ret.getMinutes() - ret.getTimezoneOffset());
    return ret;
}

export function calculateHash(str: string) {
    let hash = 0, i, chr, len;
    if (str.length === 0) {
        return hash;
    };
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        // tslint:disable-next-line:no-bitwise
        hash  = ((hash << 5) - hash) + chr;
        // tslint:disable-next-line:no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export function sortByDateFunction<T>(key: keyof T, reverse?: boolean) {
    return (a: T, b: T) => {
        try {
            const da: Date = <any>a[key];
            const db: Date = <any>b[key];
            if (reverse) {
                return da.getTime() - db.getTime();
            }
            return db.getTime() - da.getTime();
        } catch (e) {
            return 0;
        }
    }
}
