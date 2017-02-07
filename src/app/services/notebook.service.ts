import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NotebookModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';
import { Http } from '@angular/http';
import { NOTEBOOK_ALL, NOTEBOOK_GET } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';

@Injectable()
export class NotebookService {

  notebookFiller = undefined;

  constructor(protected storageService: StorageService, protected http: Http) {}

  prepareNotebookForPatch(notebook: NotebookModel): NotebookModel {
    const ret = _.cloneDeep(notebook);
    delete ret.createdAt;
    delete ret.createdById;
    delete ret.createdBy;
    return ret;
  }

  getNotebooks(): Observable<NotebookModel[]> {
    return this.http.get(NOTEBOOK_ALL).map(responseToResponseModel).map(a => a.object)
      .do((notebooks: NotebookModel[]) => {
        for (let notebook of notebooks) {
          this.storageService.setToStorage('notebook', this.notebookFiller, {id: notebook.notebookId}, notebook);
        }
      });
  }

  getNotebook(id: number): Observable<NotebookModel> {
    return this.storageService.getFromStorage('notebook', this.notebookFiller, {id: id});
  }

  patchNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    return this.getNotebook(notebook.notebookId).take(1).map(oldNotebook => {
      const old = this.prepareNotebookForPatch(oldNotebook);
      const now = this.prepareNotebookForPatch(notebook);
      const patches = fastjsonpatch.compare(old, now);
      return patches;
    }).flatMap(patches => {
      return this.http.patch(NOTEBOOK_GET + '/' + notebook.notebookId, patches)
        .map(responseToResponseModel)
        .map(a => a.object);
    }).do((newNotebook: NotebookModel) => {
      this.storageService.setToStorage('notebook', this.notebookFiller, {id: newNotebook.notebookId}, newNotebook);
    });
  }

  addNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    return this.http.post(NOTEBOOK_GET, notebook)
      .map(responseToResponseModel)
      .map(a => a.object)
      .do((n: NotebookModel) => this.storageService.setToStorage('notebook', this.notebookFiller, {id: n.notebookId}, n));
  }
}
