import { Injectable, Injector } from '@angular/core';
import { STORAGE_CONFIG, STORE_ACCESS_TOKEN } from './utils/storage.constants';
import { Observable } from 'rxjs/Rx';
import { Http, URLSearchParams } from '@angular/http';
import { parseJwt } from './utils/index';
import { CountryModel, LanguageModel, StateModel } from './models/dto';
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

  public getFromStorage<T>(key: string, parameters?: {[key: string]: any}): Observable<T> {
    let params: URLSearchParams;
    if (parameters != null) {
      params = new URLSearchParams();
      for (let searchkey in parameters)
        params.set(searchkey, parameters[searchkey]);
    }
    return this.getHttp().get(STORAGE_CONFIG[key].api, {search: params})
      .map((response) => {
        return responseToResponseModel(response).object;
      });
  }

  public patchToStorage(parameter: string, patch: any) {
    console.error("NOT IMPLEMENTED YET");
  }

  public getCountries(): Observable<CountryModel[]> {
    return this.getFromStorage<CountryModel[]>("countries");
  }

  public getLanguages(): Observable<LanguageModel[]> {
    return this.getFromStorage<LanguageModel[]>("languages");
  }

  public getStates(country: CountryModel): Observable<StateModel[]> {
    return this.getFromStorage<StateModel[]>("states", {countryId: country.geoLookupId});
  }

}
