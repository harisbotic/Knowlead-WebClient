import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
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

  applyFullValue(value: NotebookModel) {
    super.applyFullValue(value);
    // this.primaryColor = value.primaryColor;
    // this.secondaryColor = value.secondaryColor;
  }

  getNewValue(): NotebookModel {
    const pc = '#00ff00';
    const sc = '#ff0000';
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

  submit(shouldClose?: boolean) {
    const o = (this.getValue().notebookId == null) ?
      this.notebookSerice.addNotebook(this.getValue()) :
      this.notebookSerice.patchNotebook(this.getValue());
    this.subscriptions.push(o.take(1).subscribe(notebook => {
      this.notebookId = notebook.notebookId;
      if (shouldClose) {
        this.doClose();
      }
    }));
  }

  reapply() {
    this.form.patchValue({
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor
    });
  }

  doClose() {
    this.close.emit();
    this.router.navigate(['notebook'], {relativeTo: this.activatedRoute.parent});
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.notebookId = parseInt(params['id'], 10);
      }
    }));
  }

}