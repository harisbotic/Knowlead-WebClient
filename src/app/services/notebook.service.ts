import { Injectable, Injector } from '@angular/core';
import { StorageService } from './storage.service';
import { NotebookModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';
import { Http } from '@angular/http';
import { NOTEBOOK } from '../utils/urls';
import { responseToResponseModel } from '../utils/converters';
import { ModelUtilsService } from './model-utils.service';

@Injectable()
export class NotebookService {

  notebookFiller = undefined;

  get modelUtilsService(): ModelUtilsService {
    return this.injector.get(ModelUtilsService);
  }

  constructor(protected storageService: StorageService, protected http: Http, protected injector: Injector) {
    this.notebookFiller = this.modelUtilsService.fillNotebook.bind(this.modelUtilsService);
  }

  prepareNotebookForPatch(notebook: NotebookModel): NotebookModel {
    const ret = _.cloneDeep(notebook);
    delete ret.createdAt;
    delete ret.createdById;
    delete ret.createdBy;
    delete ret.isDeleted;
    return ret;
  }

  getNotebooks(): Observable<NotebookModel[]> {
    return this.http.get(NOTEBOOK).map(responseToResponseModel).map(a => a.object)
      .flatMap(notebooks => this.modelUtilsService.fillNotebooks(notebooks));
  }

  getNotebook(id: number | NotebookModel): Observable<NotebookModel> {
    if (typeof id !== 'number') {
      this.storageService.setToStorage('notebook', this.notebookFiller, {id: id.notebookId}, id);
      id = id.notebookId;
    }
    return this.storageService.getFromStorage('notebook', this.notebookFiller, {id: id});
  }

  patchNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    return this.getNotebook(notebook.notebookId).take(1).map(oldNotebook => {
      const old = this.prepareNotebookForPatch(oldNotebook);
      const now = this.prepareNotebookForPatch(notebook);
      const patches = fastjsonpatch.compare(old, now);
      return patches;
    }).flatMap(patches => {
      return this.http.post(NOTEBOOK + '/patch/' + notebook.notebookId, patches)
        .map(responseToResponseModel)
        .map(a => a.object);
    }).do((newNotebook: NotebookModel) => {
      this.storageService.setToStorage('notebook', this.notebookFiller, {id: newNotebook.notebookId}, newNotebook);
    });
  }

  addNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    return this.http.post(NOTEBOOK, notebook)
      .map(responseToResponseModel)
      .map(a => a.object)
      .do((n: NotebookModel) => this.storageService.setToStorage('notebook', this.notebookFiller, {id: n.notebookId}, n));
  }
}
