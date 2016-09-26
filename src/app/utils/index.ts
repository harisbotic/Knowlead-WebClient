import { Response } from "@angular/http";
import { LoginResponse, ActionResponse } from "../models";
import { Observable } from 'rxjs/observable';
import { User } from './../models/user.model';

export * from "./urls";
export * from "./storage.constants";

export function mapToLoginResponse(response:Response) : LoginResponse {
    return response.json();
}

export function mapToActionResponse(response:Response) : ActionResponse {
    return response.json();
}

export function mapToUser(response:Response) : User {
    return response.json();
}

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