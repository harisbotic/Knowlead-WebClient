import { Component } from '@angular/core';
import { NotebookEditComponent } from '../notebook-edit/notebook-edit.component';
import { NotebookService } from '../../../services/notebook.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notebook-edit-popup',
  templateUrl: './notebook-edit-popup.component.html',
  styleUrls: ['./notebook-edit-popup.component.scss']
})
export class NotebookEditPopupComponent extends NotebookEditComponent {

  opened = true;

  constructor(notebookService: NotebookService, activatedRoute: ActivatedRoute, router: Router) {
    super(notebookService, activatedRoute, router);
  }

  doClose() {
    this.router.navigate(['.'], {relativeTo: this.activatedRoute.parent});
  }
}
