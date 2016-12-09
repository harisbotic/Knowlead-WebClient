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
import { notifyOnObservableCancel } from '../utils/index';
import { StorageSubject, StorageFiller } from './storage.subject';

@Injectable()
export class StorageService {

  protected access_token: string;
  protected access_token_value: any;
  protected http: Http;
  protected fosByIds: {[index: number]: FOSModel} = {};
  protected fosHierarchy: FOSModel;

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

  public static getCacheKey(key: StorageKey, parameters?: {[key: string]: any}): string {
    let cacheKey = <string>key;
    if (parameters != null) {
      iterateObjectAlphabetically(parameters, (value, key) => {
        cacheKey += "|" + key + "=" + value;
      });
    }
    return cacheKey;
  }

  public clearCache<T>(filler: StorageFiller<T>, key?: StorageKey, params? :{[key: string]: any}) {
    console.debug("Clearing cache " + StorageService.getCacheKey(key, params));
    if (key == null) {
      this.cache = {};
    } else {
      this.getOrCreateSubject(key, filler, params).changeValue(null);
    }
  }

  public cache: {[key: string]: StorageSubject<any>} = {};

  private getOrCreateSubject<T>(key: StorageKey, filler: StorageFiller<T>, parameters?: {[key: string]: any}) {
    let cacheKey = StorageService.getCacheKey(key, parameters);
    if (this.cache[cacheKey] == undefined) {
      this.cache[cacheKey] = new StorageSubject<T>(key, parameters, this.getHttp(), filler);
    }
    return this.cache[cacheKey];
  }

  public getFromStorage<T>(key: StorageKey, filler: StorageFiller<T>, parameters?: {[key: string]: any}): Observable<T> {
    return this.getOrCreateSubject(key, filler, parameters);
  }

  public setToStorage<T>(key: StorageKey, filler: StorageFiller<T>, parameters: {[key: string]: any}, value: T) {
    this.getOrCreateSubject(key, filler, parameters).changeValue(value);
  }

  public getCountries(): Observable<CountryModel[]> {
    return this.getFromStorage<CountryModel[]>("countries", null);
  }

  public getLanguages(): Observable<LanguageModel[]> {
    return this.getFromStorage<LanguageModel[]>("languages", null);
  }

  public getStates(country: CountryModel): Observable<StateModel[]> {
    return this.getFromStorage<StateModel[]>("states", null, {countryId: country.geoLookupId});
  }

  public getFOSes(): Observable<FOSModel[]> {
    return this.getFromStorage<FOSModel[]>("FOSes", null);
  }

  public getFOShierarchy(): Observable<FOSModel> {
    return this.getFOSes().map((foses: FOSModel[]) => {
      if (!!this.fosHierarchy)
        return this.fosHierarchy;
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
      this.fosHierarchy = ret;
      return ret;
    })
    .cache();
  }

  public getFosById(id: number): Observable<FOSModel> {
    return this.getFOShierarchy().map(() => {
      return this.fosByIds[id];
    })
    .cache();
  }

}
