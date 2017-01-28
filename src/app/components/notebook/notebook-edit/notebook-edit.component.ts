import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserNotebookModel } from '../../../models/dto';
import { NotebookService } from '../../../services/notebook.service';
import { BaseComponent } from '../../../base.component';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-notebook-edit',
  templateUrl: './notebook-edit.component.html',
  styleUrls: ['./notebook-edit.component.scss']
})
export class NotebookEditComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  @Output() close = new EventEmitter<any>();

  @Input() set notebookId(value: number) {
    if (value != null) {
      this.subscriptions.push(
        this.notebookSerice.getNotebook(value).take(1).subscribe(notebook =>
          this.form.patchValue(_.cloneDeep(notebook))
        )
      );
    } else {
      this.form.reset();
    }
  }

  constructor(protected notebookSerice: NotebookService) {
    super();
    this.form = new FormGroup({
      markdown: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      userNotebookId: new FormControl()
    });
  }

  ngOnInit() {
  }

  save() {
    if (!this.form.valid) {
      return;
    }
    const o = (this.form.value.userNotebookId == null) ?
      this.notebookSerice.addNotebook(this.form.value) :
      this.notebookSerice.patchNotebook(this.form.value);
    this.subscriptions.push(o.take(1).subscribe(notebook => {
      this.notebookId = notebook.userNotebookId;
    }));
  }

  doClose() {
    this.close.emit();
  }

}
