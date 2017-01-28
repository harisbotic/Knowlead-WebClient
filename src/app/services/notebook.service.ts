import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserNotebookModel } from '../models/dto';
import { Observable } from 'rxjs/Rx';
import { notebooksMock } from '../utils/storage.constants';
import * as _ from 'lodash';
import * as fastjsonpatch from 'fast-json-patch';

@Injectable()
export class NotebookService {

  constructor(protected storageService: StorageService) {}

  prepareNotebookForPatch(notebook: UserNotebookModel): UserNotebookModel {
    const ret = _.cloneDeep(notebook);
    delete ret.createdAt;
    delete ret.imageBlob;
    delete ret.createdById;
    delete ret.createdBy;
    return ret;
  }

  getNotebooks(): Observable<UserNotebookModel[]> {
    return Observable.of(notebooksMock)
      .do((notebooks: UserNotebookModel[]) => {
        for (let notebook of notebooks) {
          this.storageService.setToStorage('notebook', undefined, {id: notebook.userNotebookId}, notebook);
        }
      });
  }

  getNotebook(id: number): Observable<UserNotebookModel> {
    return this.storageService.getFromStorage('notebook', undefined, {id: id});
  }

  patchNotebook(notebook: UserNotebookModel): Observable<UserNotebookModel> {
    return this.getNotebook(notebook.userNotebookId).take(1).map(oldNotebook => {
      const old = this.prepareNotebookForPatch(oldNotebook);
      const now = this.prepareNotebookForPatch(notebook);
      const patches = fastjsonpatch.compare(old, now);
      console.log(patches);
      return patches;
    }).flatMap(patches => {
      // TODO: CALL HTTP HERE
      return this.getNotebook(notebook.userNotebookId).take(1).map(oldNotebook => {
        fastjsonpatch.apply(oldNotebook, patches);
        return oldNotebook;
      });
    }).do((newNotebook: UserNotebookModel) => {
      this.storageService.setToStorage('notebook', undefined, {id: newNotebook.userNotebookId}, newNotebook);
      // TODO: REMOVE WHEN API BECOMES AVAILABLE
      notebooksMock.splice(notebooksMock.findIndex(n => n.userNotebookId === newNotebook.userNotebookId), 1);
      notebooksMock.push(newNotebook);
    });
  }

  addNotebook(notebook: UserNotebookModel): Observable<UserNotebookModel> {
    // TODO: CALL HTTP HERE
    notebook.userNotebookId = Math.random();
    this.storageService.setToStorage('notebook', undefined, {id: notebook.userNotebookId}, notebook);
    notebooksMock.push(notebook);
    return this.storageService.getFromStorage('notebook', undefined, {id: notebook.userNotebookId});
  }

}
