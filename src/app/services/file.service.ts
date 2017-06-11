import { Injectable } from '@angular/core';
import { ResponseModel, _BlobModel, Guid } from '../models/dto';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { responseToResponseModel } from '../utils/converters';
import { FILE_UPLOAD, FILE_REMOVE } from '../utils/urls';
import { BlobModelExtended, FileStatus } from '../models/frontend.models';
import { getGuid } from '../utils/index';
import { Subscription } from 'rxjs';
import { ModelUtilsService } from './model-utils.service';

@Injectable()
export class FileService {

  blobs: {[index: string]: BehaviorSubject<BlobModelExtended>} = {};
  uploadSubscriptions: {[index: string]: Subscription} = {};

  constructor(protected http: Http) { }

  upload(file: any): Observable<BlobModelExtended> {

    const fileId = getGuid();
    const fileModel: BlobModelExtended = {
      blobId: fileId,
      blobType: undefined,
      filename: file.name,
      extension: undefined,
      filesize: 0,
      uploadedById: undefined,
      uploadedBy: undefined,
      status: FileStatus.UPLOADING
    };

    this.blobs[fileId] = new BehaviorSubject<BlobModelExtended>(fileModel);
    this.uploadSubscriptions[fileId] = this.doUpload(fileId, file)
      .subscribe((response: _BlobModel) => {
        this.removeSubscription(fileId);
        this.blobs[response.blobId] = this.blobs[fileId];
        this.setFileStatus(response.blobId, FileStatus.UPLOADED, response);
      });

    return this.blobs[fileId];
  }

  protected setFileStatus(blobId: Guid, status: FileStatus, extendFrom?: _BlobModel) {
    if (this.blobs[blobId]) {
      if (extendFrom) {
        this.blobs[blobId].next(ModelUtilsService.extendBlob(extendFrom, status));
      } else {
        let blob = this.blobs[blobId].getValue();
        blob.status = status;
        this.blobs[blobId].next(blob);
      }
    } else {
      console.warn('Cannot set file ' + blobId + ' to ' + FileStatus[status]);
    }
  }

  protected doUpload(fileId, file) {
    let input = new FormData();
    input.append('file', file);
    return this.http
        .post(FILE_UPLOAD, input)
        .map(responseToResponseModel)
        .map(response => <_BlobModel>response.object)
  }

  protected removeSubscription(fileId: Guid) {
    if (this.uploadSubscriptions[fileId]) {
      this.uploadSubscriptions[fileId].unsubscribe();
      delete this.uploadSubscriptions[fileId];
    } else {
      console.warn('No file upload subscription ' + fileId);
    }
  }

  remove(file: _BlobModel | Guid): Observable<BlobModelExtended> {
    if (!file) {
      return Observable.throw({
        errors: ['File not set']
      });
    }
    if ((<_BlobModel>file).blobId) {
      file = (<_BlobModel>file).blobId;
    }

    const blobId = <Guid>file;

    this.setFileStatus(blobId, FileStatus.CANCELING);

    if (this.uploadSubscriptions[blobId]) {
      this.removeSubscription(blobId);
      this.removeFromService(blobId);
    } else {
      this.http
        .delete(FILE_REMOVE + '/' + file)
        .subscribe(() => {
          this.removeFromService(blobId);
        });
    }

    return this.blobs[<Guid>file];
  }

  getFileStatus(blob: _BlobModel | Guid) {
    let blobId: Guid;
    if ((<_BlobModel>blob).blobId) {
      blobId = (<_BlobModel>blob).blobId;
    } else {
      blobId = <Guid>blob;
    }
    if (!this.blobs[blobId]) {
      console.warn('Cannot get file with id ' + blobId)
    } else {
      return this.blobs[blobId];
    }
  }

  protected removeFromService(blobId: Guid) {
    if (this.blobs[blobId]) {
      this.setFileStatus(blobId, FileStatus.CANCELED);
      this.blobs[blobId].complete();
      // remove all references to this subject (multiple keys may point to the same object)
      for (let refBlobId in this.blobs) {
        if (this.blobs[refBlobId] === this.blobs[blobId] && blobId !== refBlobId) {
          delete this.blobs[refBlobId];
        }
      }
      delete this.blobs[blobId];
    } else {
      console.warn('Cannot remove file ' + blobId + ' from fileservice');
    }
  }

}
