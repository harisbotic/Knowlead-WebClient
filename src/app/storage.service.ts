import { Injectable, Injector } from '@angular/core';
import { STORAGE_CONFIG, STORE_ACCESS_TOKEN } from './utils/storage.constants';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { parseJwt } from './utils/index';

@Injectable()
export class StorageService {

  protected access_token: string;
  protected access_token_value: any;
  protected http: Http;
  protected getHttp(): Http {
    if (this.http == undefined) {
      this.http = this.injector.get(Http);
    }
    return this.http;
  };

  constructor(protected injector: Injector) {
    this.setAccessToken(localStorage.getItem(STORE_ACCESS_TOKEN));
  }

  public setAccessToken(value: string) {
    console.log("Setting access token");
    this.access_token_value = parseJwt(value);
    this.access_token = value;
    console.log(this.access_token_value);
    localStorage.setItem(STORE_ACCESS_TOKEN, value);
  }

  public getAccessToken(): Observable<string> {
    return Observable.from([this.access_token]);
  }

  public removeAccessToken() {
    delete this.access_token;
    delete this.access_token_value;
    localStorage.removeItem(STORE_ACCESS_TOKEN);
  }

  public hasAccessToken(): boolean {
    return this.access_token != undefined;
  }

  public getFromStorage<T>(parameter: string): Observable<T> {
    return this.getHttp().get(STORAGE_CONFIG["user"].api)
      .map((data) => {
        return data.json();
      });
  }

}
