import { Http, RequestOptions, ConnectionBackend, Response, RequestOptionsArgs, Request, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { StorageService } from './storage.service';
export class HttpProvider extends Http {
    constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions, protected storageService: StorageService) {
        super(_backend, _defaultOptions);
    }
    
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }
 
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url,options));
    }
 
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {   
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }
 
    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }
 
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }
    
    getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (this.storageService.hasAccessToken()) {
            options.headers.append("Authentication", "Bearer " + this.storageService.getAccessToken());
        }
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable;
    }
}