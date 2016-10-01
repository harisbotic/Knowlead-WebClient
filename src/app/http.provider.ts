import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend, Response, RequestOptionsArgs, Request, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject, Subscriber } from 'rxjs/Rx';
import { StorageService } from './storage.service';
import { API } from './utils/urls';
import { ErrorModel } from './models/dto';
import { responseToErrorModel } from './utils/converters';
import { ErrorCodes } from './models/constants';

@Injectable()
export class HttpProvider extends Http {
    constructor(_backend: ConnectionBackend,
                _defaultOptions: RequestOptions,
                protected storageService: StorageService,
                protected router: Router) {
        super(_backend, _defaultOptions);
    }

    emit(method: string, url: string | Request, options: RequestOptionsArgs, body?: string): Observable<Response> {
        console.log(method + ": " + url);
        if (url.toString().toLowerCase().startsWith(API + "/api")) {
            return this.getRequestOptionArgs(options).flatMap((args) => {
                return this.intercept(method, url, args, body);
            });
        } else {
            return this.intercept(method, url, options, body);
        }
    }
    
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.emit("request", url, options);
    }
 
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.emit("get", url, options);
    }
 
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {  
        return this.emit("post", url, options, body);
    }
 
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.emit("put", url, options, body);
    }
 
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.emit("delete", url, options);
    }
    
    getRequestOptionArgs(options?: RequestOptionsArgs) : Observable<RequestOptionsArgs> {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (this.storageService.hasAccessToken()) {
            return this.storageService.getAccessToken().map<RequestOptionsArgs>((value) => {
                options.headers.append("Authorization", "Bearer " + value);
                return options;
            });
        } else {
            return Observable.from([options]);
        }
    }

    intercept(method: string, url: string | Request, options: RequestOptionsArgs, body?: string): Observable<Response> {
        let observable: Observable<Response> =
            (body !== undefined) ? super[method](url, body, options) : super[method](url, options);
        return observable.catch((errorResponse) => {
            let error = responseToErrorModel(errorResponse);
            if (error != null && error.errorCode == ErrorCodes.NotLoggedIn) {
                this.router.navigate(['/login']);
                return Observable.empty();
            } else {
                return Observable.throw(errorResponse);
            }
        });
    }
}