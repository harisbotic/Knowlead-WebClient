import { Injectable, Injector } from '@angular/core';
import { STORAGE_CONFIG, STORE_ACCESS_TOKEN } from './utils/storage.constants';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { parseJwt } from './utils/index';
import { CountryModel, LanguageModel } from './models/dto';
import { responseToResponseModel } from './utils/converters';

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
    console.log("storage service created");
  }

  public setAccessToken(value: string) {
    console.log("Setting access token");
    this.access_token = value;
    if (value != undefined) {
      this.access_token_value = parseJwt(value);
      localStorage.setItem(STORE_ACCESS_TOKEN, value);
    } else {
      this.removeAccessToken();
    }
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
    return this.getHttp().get(STORAGE_CONFIG[parameter].api)
      .map((response) => {
        return responseToResponseModel(response).object;
      });
  }

  public patchToStorage(parameter: string, patch: any) {
    console.error("NOT IMPLEMENTED YET");
  }

  public getCountries(): Observable<CountryModel> {
    return Observable.from([{
      geoLookupId: 0,
      code: 'ba',
      name: "Bosnia and Herzegovina"
    },{
      geoLookupId: 1,
      code: 'gb',
      name: "Great Britain"
    },{
      geoLookupId: 2,
      code: 'us',
      name: "United States of America"
    }]);
  }

  public getLanguages(): Observable<LanguageModel> {
    return Observable.from([{
      coreLookupId: 0,
      code: 'ba',
      name: 'Bosnian'
    },{
      coreLookupId: 1,
      code: 'en',
      name: 'English'
    }])
  }

  public getStates(country: CountryModel): Observable<CountryModel> {
    if (country.code == "us") {
      return Observable.from([{
        geoLookupId: 3,
        code: "wa",
        name: "Washington d. c."
      },{
        geoLookupId: 4,
        code: "ny",
        name: "New York"
      }]);
    } else return Observable.from([]);
  }

}
