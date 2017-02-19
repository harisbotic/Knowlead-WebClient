import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { P2PModel, LanguageModel, FOSModel } from '../../../models/dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { DropdownValueInterface } from '../../../models/frontend.models';
import { StorageService } from '../../../services/storage.service';
import { ArrayValidator } from '../../../validators/array.validator';
import { dateValidator } from '../../../validators/date.validator';
import { BaseFormComponent } from '../../../base-form.component';

@Component({
  selector: 'app-p2p-create',
  templateUrl: './p2p-create.component.html',
  styleUrls: ['./p2p-create.component.scss'],
})
export class P2pCreateComponent extends BaseFormComponent<P2PModel> implements OnInit {

  form: FormGroup;
  steps = ['fosId', 'initialPrice', 'languages', 'deadline'];
  iconMapping = {
    'fosId': 'kl-subject',
    'initialPrice': 'kl-currency',
    'languages': 'kl-globe',
    'deadline': 'kl-clock'
  };
  iconClass: string;
  step = 0;
  languages: DropdownValueInterface<LanguageModel>[];
  foses: DropdownValueInterface<number>[];
  @Output() created = new EventEmitter<number>();

  constructor(protected p2pService: P2pService,
      protected notificationService: NotificationService,
      protected storageService: StorageService) {
    super();
  }

  getControlForStep(step: string | number): FormControl {
    if (typeof(step) === 'number') {
      step = this.steps[step];
    }
    return <FormControl>this.form.controls[step];
  }

  checkStep() {
    for (let i = 1; i < Math.min(this.steps.length, this.step + 1); i++) {
      if (!this.getControlForStep(i).valid) {
        if (this.step > i) {
          this.step = i;
        }
        break;
      }
    }
  }

  setStep(value: number) {
    this.step = value;
    this.checkStep();
    this.iconClass = this.iconMapping[this.stepStr];
  }

  get stepStr(): string {
    return this.steps[this.step];
  }

  get availableSteps() {
    const ret = [this.steps[0]];
    for (let i = 1; i < this.steps.length; i++) {
      if (this.getControlForStep(i - 1).valid) {
        ret.push(this.steps[i]);
      } else {
        this.checkStep();
        break;
      }
    }
    return ret;
  }

  getNewForm() {
    return new FormGroup({
      text: new FormControl(null, Validators.required),
      fosId: new FormControl(null, Validators.required),
      // blobs: new FormArray([]),
      initialPrice: new FormControl(null, [Validators.required]),
      deadline: new FormControl(null, dateValidator({minDate: new Date()})),
      languages: new FormControl(null, [Validators.required, ArrayValidator({min: 1})])
    });
  }

  getNewValue(): P2PModel {
    return {
      text: '',
      fosId: undefined,
      initialPrice: undefined,
      deadline: undefined,
      languages: undefined,
      blobs: undefined,

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
      canBookmark: undefined
    };
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

  onSubmit() {
    this.subscriptions.push(this.p2pService.create(this.getValue()).take(1).subscribe(p2p => {
      this.restartForm();
      this.step = 0;
      this.created.emit(p2p.p2pId);
    }, (err) => {
      this.notificationService.error('error creating p2p', err);
    }));
  }

  getValue(): P2PModel {
    const ret = super.getValue();
    if (typeof(ret.fosId) !== 'number') {
      ret.fosId = ret.fosId[0];
    }
    return ret;
  }

}
