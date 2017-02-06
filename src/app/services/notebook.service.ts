import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NotebookModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { notebooksMock } from '../utils/storage.constants';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';

@Injectable()
export class NotebookService {

  constructor(protected storageService: StorageService) {}

  prepareNotebookForPatch(notebook: NotebookModel): NotebookModel {
    const ret = _.cloneDeep(notebook);
    delete ret.createdAt;
    delete ret.createdById;
    delete ret.createdBy;
    return ret;
  }

  getNotebooks(): Observable<NotebookModel[]> {
    return Observable.of(notebooksMock)
      .do((notebooks: NotebookModel[]) => {
        for (let notebook of notebooks) {
          this.storageService.setToStorage('notebook', undefined, {id: notebook.notebookId}, notebook);
        }
      });
  }

  getNotebook(id: number): Observable<NotebookModel> {
    return this.storageService.getFromStorage('notebook', undefined, {id: id});
  }

  patchNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    return this.getNotebook(notebook.notebookId).take(1).map(oldNotebook => {
      const old = this.prepareNotebookForPatch(oldNotebook);
      const now = this.prepareNotebookForPatch(notebook);
      const patches = fastjsonpatch.compare(old, now);
      console.log(patches);
      return patches;
    }).flatMap(patches => {
      // TODO: CALL HTTP HERE
      return this.getNotebook(notebook.notebookId).take(1).map(oldNotebook => {
        fastjsonpatch.apply(oldNotebook, patches);
        return oldNotebook;
      });
    }).do((newNotebook: NotebookModel) => {
      this.storageService.setToStorage('notebook', undefined, {id: newNotebook.notebookId}, newNotebook);
      // TODO: REMOVE WHEN API BECOMES AVAILABLE
      notebooksMock.splice(notebooksMock.findIndex(n => n.notebookId === newNotebook.notebookId), 1);
      notebooksMock.push(newNotebook);
    });
  }

  addNotebook(notebook: NotebookModel): Observable<NotebookModel> {
    // TODO: CALL HTTP HERE
    notebook.notebookId = Math.random();
    this.storageService.setToStorage('notebook', undefined, {id: notebook.notebookId}, notebook);
    notebooksMock.push(notebook);
    return this.storageService.getFromStorage('notebook', undefined, {id: notebook.notebookId});
  }

}
