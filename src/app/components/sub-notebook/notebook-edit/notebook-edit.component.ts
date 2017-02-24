import { Component, OnInit } from '@angular/core';
import { NotebookService } from '../../../services/notebook.service';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotebookModel } from '../../../models/dto';
import { BaseFormComponent } from '../../../base-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notebook-edit',
  templateUrl: './notebook-edit.component.html',
  styleUrls: ['./notebook-edit.component.scss']
})
export class NotebookEditComponent extends BaseFormComponent<NotebookModel> implements OnInit {

  form: FormGroup;
  primaryColor: string;
  secondaryColor: string;

  setNotebookId(value: string) {
    if (value != null && value !== 'new') {
      this.subscriptions.push(
        this.notebookSerice.getNotebook(parseInt(value, 10)).take(1).subscribe(notebook =>
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

  applyFullValue(value: NotebookModel) {
    super.applyFullValue(value);
    // this.primaryColor = value.primaryColor;
    // this.secondaryColor = value.secondaryColor;
  }

  getNewValue(): NotebookModel {
    const sc = '#071923';
    const pc = '#007bb6';
    this.primaryColor = pc;
    this.secondaryColor = sc;
    return {
      notebookId: undefined,
      markdown: '',
      name: '',
      primaryColor: pc,
      secondaryColor: sc,

      createdAt: undefined,
      createdBy: undefined,
      createdById: undefined,
      isDeleted: undefined
    };
  }

  constructor(protected notebookSerice: NotebookService,
      protected activatedRoute: ActivatedRoute,
      protected router: Router) {
    super();
  }

  submit() {
    const o = (this.getValue().notebookId == null) ?
      this.notebookSerice.addNotebook(this.getValue()) :
      this.notebookSerice.patchNotebook(this.getValue());
    this.subscriptions.push(o.take(1).subscribe(notebook => {
      this.setNotebookId(notebook.notebookId.toString());
      this.doClose();
    }));
  }

  reapply() {
    this.form.patchValue({
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor
    });
  }

  doClose() {
    this.router.navigate(['notebook'], {relativeTo: this.activatedRoute.parent});
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.setNotebookId(params['id']);
      }
    }));
  }

}