import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { responseToResponseModel } from '../utils/converters';
import { FILE_UPLOAD } from '../utils/urls';

@Injectable()
export class FileService {

  constructor(protected http: Http) { }

  upload(file: any): Observable<ResponseModel> {
    let input = new FormData();
    input.append("file", file);

    return this.http
        .post(FILE_UPLOAD, input)
        .map(responseToResponseModel);
  }

}
