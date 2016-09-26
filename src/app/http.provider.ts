import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend, Response, RequestOptionsArgs, Request, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { StorageService } from './storage.service';
import { ErrorModel } from './models/error.model';
import { ERROR_NOT_LOGGED_IN } from './utils/error.constants';

@Injectable()
export class HttpProvider extends Http {
    constructor(_backend: ConnectionBackend,
                _defaultOptions: RequestOptions,
                protected storageService: StorageService,
                protected router: Router) {
        super(_backend, _defaultOptions);
    }
    
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
    }
 
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    }
 
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }
 
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }
 
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
    }
    
    getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (this.storageService.hasAccessToken()) {
            options.headers.append("Authorization", "Bearer " + this.storageService.getAccessToken());
        }
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((errorResponse) => {
            let error = ErrorModel.fromResponse(errorResponse);
            if (error.errorCode == ERROR_NOT_LOGGED_IN) {
                this.router.navigate(['/login']);
                return Observable.empty();
            } else {
                return Observable.throw(errorResponse);
            }
        });
    }
}