import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend, Response, RequestOptionsArgs, Request, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject, Subscriber } from 'rxjs/Rx';
import { StorageService } from './storage.service';
import { API } from './utils/urls';
import { ResponseModel } from './models/dto';
import { responseToResponseModel, responseToLoginResponse } from './utils/converters';
import { ErrorCodes } from './models/constants';
import { FrontendErrorCodes } from './models/frontend.constants';
import { LoginPageComponent } from './login-page/login-page.component';

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
        return observable.catch((errorResponse: Response) => {
            let error = responseToResponseModel(errorResponse);
            if (error != null && error.errors != null && error.errors.indexOf(ErrorCodes.notLoggedIn) > -1) {
                this.router.navigate(['/login']);
                return Observable.empty();
            } else {
                if (errorResponse.status == 0) {
                    return Observable.throw(<ResponseModel>{errors: [FrontendErrorCodes.networkError]});
                } else if (errorResponse.status / 100 == 5) {
                    return Observable.throw(<ResponseModel>{errors: [FrontendErrorCodes.backendError]});
                }
                return Observable.throw(error);
            }
        });
    }
}