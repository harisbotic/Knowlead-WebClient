import { Component, OnInit } from '@angular/core';
import { NotebookService } from '../../../services/notebook.service';
import { NotebookModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.scss'],
  providers: []
})
export class NotebookListComponent extends BaseComponent implements OnInit {

  modalOpened = false;
  viewingNotebook: number;

  constructor(protected notebookService: NotebookService, protected storageService: StorageService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.notebookService.getNotebooks().subscribe());
  }

  closeModal() {
    this.modalOpened = false;
    delete this.viewingNotebook;
  }

  openNotebook(notebook: NotebookModel) {
    this.modalOpened = true;
    this.viewingNotebook = notebook.notebookId;
  }

  getNotebookList(): NotebookModel[] {
    let ret = [];
    for (let key of Object.keys(this.storageService.cache)) {
      if (key.startsWith('notebook') && this.storageService.cache[key].value != null) {
        ret.push(this.storageService.cache[key].value);
      }
    }
    return ret;
  }

}
