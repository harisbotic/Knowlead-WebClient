import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  access_token: string;

  constructor() {
    this.access_token = localStorage.getItem("access_token");
  }

  public setAccessToken(value: string) {
    this.access_token = value;
    localStorage.setItem("access_token", value);
  }

  public getAccessToken(): string {
    return this.access_token;
  }

  public removeAccessToken() {
    delete this.access_token;
    localStorage.removeItem("access_token");
  }

  public hasAccessToken(): boolean {
    return this.access_token != undefined;
  }


}
