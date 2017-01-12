import { Injectable } from '@angular/core';
import { ResponseModel, _BlobModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { responseToResponseModel } from '../utils/converters';
import { FILE_UPLOAD, FILE_REMOVE } from '../utils/urls';

@Injectable()
export class FileService {

  constructor(protected http: Http) { }

  upload(file: any): Observable<ResponseModel> {
    let input = new FormData();
    input.append('file', file);

    return this.http
        .post(FILE_UPLOAD, input)
        .map(responseToResponseModel);
  }

  remove(file: _BlobModel): Observable<ResponseModel> {
    if (!file) {
      return Observable.throw({
        errors: ['File not set']
      });
    }
    return this.http
      .delete(FILE_REMOVE + '/' + file.blobId)
      .map(responseToResponseModel);
  }

}
