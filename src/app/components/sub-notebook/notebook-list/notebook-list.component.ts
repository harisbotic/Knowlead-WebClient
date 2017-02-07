import { Component, OnInit } from '@angular/core';
import { NotebookService } from '../../../services/notebook.service';
import { NotebookModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-notebook-list',
  templateUrl: './notebook-list.component.html',
  styleUrls: ['./notebook-list.component.scss'],
  providers: []
})
export class NotebookListComponent extends BaseComponent implements OnInit {

  notebooks: NotebookModel[];
  modalOpened = false;
  viewingNotebook: number;

  constructor(protected notebookService: NotebookService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.notebookService.getNotebooks().subscribe(notebooks => this.notebooks = notebooks));
  }

  closeModal() {
    this.modalOpened = false;
    delete this.viewingNotebook;
  }

  openNotebook(notebook: NotebookModel) {
    this.modalOpened = true;
    this.viewingNotebook = notebook.notebookId;
  }

}
