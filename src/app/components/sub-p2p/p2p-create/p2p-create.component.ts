import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { P2PModel, LanguageModel, FOSModel, _BlobModel, P2PDifficultyLevel } from '../../../models/dto';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { DropdownValueInterface } from '../../../models/frontend.models';
import { StorageService } from '../../../services/storage.service';
import { ArrayValidator } from '../../../validators/array.validator';
import { dateValidator } from '../../../validators/date.validator';
import { BaseFormComponent } from '../../../base-form.component';
import { addHoursToDate } from '../../../utils/index';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-p2p-create',
  templateUrl: './p2p-create.component.html',
  styleUrls: ['./p2p-create.component.scss'],
})
export class P2pCreateComponent extends BaseFormComponent<P2PModel> implements OnInit {

  form: FormGroup;
  files: FormArray;
  languages: DropdownValueInterface<LanguageModel>[];
  foses: DropdownValueInterface<number>[];
  initialDate = new Date();
  difficulties = P2PDifficultyLevel;
  specificDate = new Date();

  constructor(protected p2pService: P2pService,
      protected notificationService: NotificationService,
      protected storageService: StorageService,
      protected router: Router) {
    super();
  }

  protected getNewFileControl() {
    return new FormControl();
  }

  getNewForm() {
    this.files = new FormArray([this.getNewFileControl()], null);
    this.subscriptions.push(this.files.valueChanges.subscribe(this.checkFiles.bind(this)));
    return new FormGroup({
      text: new FormControl(null, Validators.required),
      fosId: new FormControl(null, Validators.required),
      blobs: this.files,
      initialPrice: new FormControl(null, [Validators.required]),
      deadline: new FormControl(null, dateValidator({minDate: new Date()})),
      languages: new FormControl(null, [Validators.required, ArrayValidator({min: 1})]),
      difficultyLevel: new FormControl(null, null)
    });
  }

  getNewValue(): P2PModel {
    return {
      text: '',
      fosId: undefined,
      initialPrice: undefined,
      deadline: undefined,
      languages: undefined,
      blobs: [undefined],
      difficultyLevel: P2PDifficultyLevel.Basic,

      fos: undefined,
      p2pId: undefined,
      dateTimeAgreed: undefined,
      priceAgreed: undefined,
      isDeleted: undefined,
      scheduledWith: undefined,
      scheduledWithId: undefined,
      createdBy: undefined,
      createdById: undefined,
      p2pMessageModels: undefined,
      status: undefined,
      dateCreated: undefined,
      bookmarkCount: undefined,
      offerCount: undefined,
      didBookmark: undefined,
      canBookmark: undefined,
      teacherReady: undefined,
      createdAt: undefined
    };
  }

  getDateAfterHours(hours: number): string {
    return addHoursToDate(this.initialDate, hours).toISOString();
  }

  checkFiles() {
    const blobs: _BlobModel[] = this.files.value;
    for (let idx = 0; idx < blobs.length; idx++) {
      if (blobs[idx] == null && idx < blobs.length - 1) {
        this.files.removeAt(idx);
      }
    }
    if (blobs[blobs.length - 1] != null) {
      this.files.push(this.getNewFileControl());
    }
  }

  // this fixes some aot compilation problems in html
  anyFormGet(): any {
    return this.form;
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.storageService.getLanguages().subscribe(languages => {
      this.languages = languages.map(l => { return {label: l.name, value: l}; });
    }));
    this.subscriptions.push(this.storageService.getFOShierarchy().subscribe(root => {
      this.foses = [];
      const s = (fos: FOSModel) => {
        if (!fos.children || fos.children.length === 0) {
          this.foses.push({
            label: fos.name,
            value: fos.coreLookupId
          });
        } else {
          if (fos.children) {
            fos.children.forEach(s);
          }
        }
      };
      s(root);
    }));
  }

  submit() {
    console.log(this.getValue());
    this.subscriptions.push(this.p2pService.create(this.getValue()).take(1).subscribe(p2p => {
      this.restartForm();
      this.router.navigate(['/']);
    }, (err) => {
      this.notificationService.error('error creating p2p', err);
    }));
  }

  getValue(): P2PModel {
    // clone value so that we don't mess with original one
    const ret = super.getValue();
    ret.blobs = _.cloneDeep(ret.blobs);
    // remove all files which are undefined/null
    ret.blobs = ret.blobs.filter(blob => blob);
    return ret;
  }

  setSpecificDate() {
    if (this.specificDate) {
      this.form.patchValue({
        deadline: this.specificDate
      });
    }
  }

  removeSpecificDate() {
    delete this.specificDate;
  }

}
