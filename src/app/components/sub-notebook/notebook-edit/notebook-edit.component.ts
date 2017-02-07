import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NotebookService } from '../../../services/notebook.service';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotebookModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';

@Component({
  selector: 'app-notebook-edit',
  templateUrl: './notebook-edit.component.html',
  styleUrls: ['./notebook-edit.component.scss']
})
export class NotebookEditComponent extends BaseFormComponent<NotebookModel> {

  form: FormGroup;

  @Output() close = new EventEmitter<any>();

  @Input() set notebookId(value: number) {
    if (value != null) {
      this.subscriptions.push(
        this.notebookSerice.getNotebook(value).take(1).subscribe(notebook =>
          this.applyFullValue(_.cloneDeep(notebook))
        )
      );
    } else {
      this.restartForm();
    }
  }

  getNewForm() {
    return new FormGroup({
      markdown: new FormControl(undefined),
      name: new FormControl(undefined, [Validators.required]),
      primaryColor: new FormControl(undefined, Validators.required),
      secondaryColor: new FormControl(undefined, Validators.required),
      notebookId: new FormControl(undefined)
    });
  }

  getNewValue(): NotebookModel {
    return {
      notebookId: undefined,
      markdown: '',
      name: '',
      primaryColor: '#ff00000',
      secondaryColor: '#0000ff',
      createdAt: undefined,
      createdBy: undefined,
      createdById: undefined
    };
  }

  constructor(protected notebookSerice: NotebookService) {
    super();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const o = (this.form.value.userNotebookId == null) ?
      this.notebookSerice.addNotebook(this.getValue()) :
      this.notebookSerice.patchNotebook(this.getValue());
    this.subscriptions.push(o.take(1).subscribe(notebook => {
      this.notebookId = notebook.notebookId;
    }));
  }

  doClose() {
    this.close.emit();
  }

}
