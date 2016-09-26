import { Injectable, Injector } from '@angular/core';
import { STORAGE_CONFIG, STORE_ACCESS_TOKEN } from './utils/storage.constants';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';

@Injectable()
export class StorageService {

  protected access_token: string;
  protected http: Http;
  protected getHttp(): Http {
    if (this.http == undefined) {
      this.http = this.injector.get(Http);
    }
    return this.http;
  };

  constructor(protected injector: Injector) {
    this.access_token = localStorage.getItem(STORE_ACCESS_TOKEN);
    console.log("Loaded access token: " + this.access_token);
  }

  public setAccessToken(value: string) {
    console.log("Setting access token");
    this.access_token = value;
    localStorage.setItem(STORE_ACCESS_TOKEN, value);
  }

  public getAccessToken(): string {
    return this.access_token;
  }

  public removeAccessToken() {
    delete this.access_token;
    localStorage.removeItem(STORE_ACCESS_TOKEN);
  }

  public hasAccessToken(): boolean {
    console.log("Has access token ... " + (this.access_token != undefined));
    return this.access_token != undefined;
  }

  public getFromStorage<T>(parameter: string): Observable<T> {
    return this.getHttp().get(STORAGE_CONFIG["user"].api)
      .map((data) => {
        return data.json();
      });
  }

}
