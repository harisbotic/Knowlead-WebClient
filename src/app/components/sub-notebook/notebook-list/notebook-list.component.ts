import { Component, OnInit, Input } from '@angular/core';
import { NotebookService } from '../../../services/notebook.service';
import { NotebookModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
import { StorageService } from '../../../services/storage.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.scss'],
  providers: []
})
export class NotebookListComponent extends BaseComponent implements OnInit {

  modalOpened = false;
  viewingNotebook: number;
  @Input() inLibrary = false;
  notebookList: NotebookModel[];

  constructor(protected notebookService: NotebookService, protected storageService: StorageService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.notebookService.getNotebooks().subscribe());
    this.subscriptions.push(Observable.timer(0, 1000).subscribe(() => {
      this.notebookList = this.getNotebookList();
    }));
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
      if (this.storageService.cache[key].key === 'notebook' && this.storageService.cache[key].value != null) {
        ret.push(this.storageService.cache[key].value);
      }
    }
    return ret;
  }

}
