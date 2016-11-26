import { Injectable, Injector, OnInit } from '@angular/core';
import { STORAGE_CONFIG, STORE_ACCESS_TOKEN, StorageKey } from './../utils/storage.constants';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Http, URLSearchParams } from '@angular/http';
import { parseJwt, iterateObjectAlphabetically, treeify } from './../utils/index';
import { CountryModel, LanguageModel, StateModel, FOSModel } from './../models/dto';
import { responseToResponseModel } from './../utils/converters';
import * as fastjsonpatch from 'fast-json-patch';
import * as _ from 'lodash';
import { SessionService, SessionEvent } from './session.service';

@Injectable()
export class StorageService {

  protected access_token: string;
  protected access_token_value: any;
  protected http: Http;
  protected fosByIds: {[index: number]: FOSModel} = {};

  protected accessTokenStream = new BehaviorSubject<string>(undefined);

  protected getHttp(): Http {
    if (this.http == undefined) {
      this.http = this.injector.get(Http);
    }
    return this.http;
  };

  constructor(protected injector: Injector, protected sessionService: SessionService) {
    this.setAccessToken(localStorage.getItem(STORE_ACCESS_TOKEN));
    this.sessionService.eventStream.subscribe(evt => {
      if (evt == SessionEvent.LOGGED_OUT) {
        this.setAccessToken(null);
      }
    });
    console.info("Storage service created");
  }

  public setAccessToken(value: string) {
    this.access_token = value;
    if (value != undefined) {
      console.debug("Setting access token");
      this.access_token_value = parseJwt(value);
      localStorage.setItem(STORE_ACCESS_TOKEN, value);
    } else {
      this.removeAccessToken();
    }
    this.accessTokenStream.next(value);
  }

  public getAccessToken(): Observable<string> {
    return Observable.of(this.access_token);
  }

  public getAccessTokenStream(): Observable<string> {
    return this.accessTokenStream;
  }

  public removeAccessToken() {
    console.debug("Removing access token");
    delete this.access_token;
    delete this.access_token_value;
    localStorage.removeItem(STORE_ACCESS_TOKEN);
  }

  public hasAccessToken(): boolean {
    return this.access_token != undefined;
  }

  private getCacheKey(key: StorageKey, parameters?: {[key: string]: any}): string {
    let cacheKey = <string>key;
    if (parameters != null) {
      iterateObjectAlphabetically(parameters, (value, key) => {
        cacheKey += "|" + key + "=" + value;
      });
    }
    return cacheKey;
  }

  public clearCache(key?: StorageKey, params? :{[key: string]: any}) {
    console.debug("Clearing cache " + this.getCacheKey(key, params));
    if (key == null) {
      this.cache = {};
    } else {
      delete this.cache[this.getCacheKey(key, params)];
    }
  }

  private cache: {[key: string]: Observable<any>} = {};

  public getFromStorage<T>(key: StorageKey, parameters?: {[key: string]: any}): Observable<T> {
    let cacheKey = this.getCacheKey(key, parameters);
    if (this.cache[cacheKey] != undefined) {
      console.debug("Loading from cache key: " + cacheKey);
      return this.cache[cacheKey];
    }
    console.debug("Loading from API: " + cacheKey);
    let params: URLSearchParams;
    if (parameters != null) {
      params = new URLSearchParams();
      for (let searchkey in parameters)
        params.set(searchkey, parameters[searchkey]);
    }
    let ret = this.getHttp().get(STORAGE_CONFIG[key].api, {search: params})
      .catch(err => {
        this.clearCache(key, parameters);
        return Observable.throw(err);
      })
      .map((response) => {
        return responseToResponseModel(response).object;
      })
      .cache();
    this.cache[cacheKey] = ret;
    return ret;
  }

  public patchToStorage(key: StorageKey, parameters: {[key: string]: any}, patch: any) {
    let cacheKey = this.getCacheKey(key, parameters);
    if (this.cache[cacheKey] != null)
      this.cache[cacheKey] = this.cache[cacheKey]
        .map((value) => {
          console.debug("Patched cache: " + cacheKey);
          fastjsonpatch.apply(value, patch);
          return value;
        })
        .cache();
    else
      console.error("Cache not found (for patching): " + cacheKey);
  }

  public setToStorage(key: StorageKey, parameters: {[key: string]: any}, value: any) {
    let cacheKey = this.getCacheKey(key, parameters);
    if (this.cache[cacheKey] != null)
      this.cache[cacheKey] = this.cache[cacheKey]
        .map((old) => {
          return value;
        })
        .cache();
    else
      console.error("Cache not found (for setting): " + cacheKey);
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

  public getFOSes(): Observable<FOSModel[]> {
    return this.getFromStorage<FOSModel[]>("FOSes");
  }

  public getFOShierarchy(): Observable<FOSModel> {
    return this.getFOSes().map((foses: FOSModel[]) => {
      console.debug("Creating fos hierarchy");
      let ret = <FOSModel>{children: treeify(_.cloneDeep(foses), 'coreLookupId', 'parentFosId', 'children')};
      this.fosByIds = {};
      let recurse = (model: FOSModel) => {
        if (model.coreLookupId) {
          this.fosByIds[model.coreLookupId] = model;
        }
        if (model.children != null) {
          model.children = _.sortBy(model.children, 'name');
          model.children.forEach(child => child.parent = model);
          model.children.forEach(recurse);
        }
      }
      recurse(ret);
      return ret;
    });
  }

  public getFosById(id: number): Observable<FOSModel> {
    return this.getFOShierarchy().map(() => {
      return this.fosByIds[id];
    });
  }

}
