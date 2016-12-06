import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend, Response, RequestOptionsArgs, Request, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject, Subscriber } from 'rxjs/Rx';
import { StorageService } from './services/storage.service';
import { API } from './utils/urls';
import { ResponseModel } from './models/dto';
import { responseToResponseModel, responseToLoginResponse } from './utils/converters';
import { ErrorCodes } from './models/constants';
import { FrontendErrorCodes } from './models/frontend.constants';
import { SessionService } from './services/session.service';

@Injectable()
export class HttpProvider extends Http {
    constructor(_backend: ConnectionBackend,
                _defaultOptions: RequestOptions,
                protected storageService: StorageService,
                protected sessionService: SessionService,
                protected router: Router) {
        super(_backend, _defaultOptions);
    }

    emit(method: string, url: string | Request, options: RequestOptionsArgs, body?: string): Observable<Response> {
        if (url.toString().toLowerCase().startsWith(API + "/api")) {
            return this.getRequestOptionArgs(options).flatMap((args) => {
                return this.intercept(method, url, args, body);
            });
        } else {
            return this.intercept(method, url, options, body);
        }
    }
    
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        //return this.emit("request", url, options);
        return super.request(url, options);
    }
 
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.emit("get", url, options);
    }
 
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {  
        return this.emit("post", url, options, body);
    }
 
    patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {  
        return this.emit("patch", url, options, body);
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
            return Observable.of(options);
        }
    }

    intercept(method: string, url: string | Request, options: RequestOptionsArgs, body?: string): Observable<Response> {
        console.info(`${method}: ${url} - ${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
        let observable: Observable<Response> =
            (body !== undefined) ? super[method](url, body, options) : super[method](url, options);
        return observable.catch((errorResponse: Response) => {
            if (errorResponse == null) {
                errorResponse = <any>{
                    errors: [FrontendErrorCodes.unknownError]
                }
            }
            if (typeof (<any>errorResponse).errors !== "undefined") {
                return Observable.throw(errorResponse);
            }
            let error = responseToResponseModel(errorResponse);
            if (error != null && error.errors != null && error.errors.indexOf(ErrorCodes.notLoggedIn) > -1) {
                this.sessionService.logout();
                this.router.navigate(['/login']);
                return Observable.throw(error);
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
