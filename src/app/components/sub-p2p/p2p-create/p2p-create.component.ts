import { Component, OnInit } from '@angular/core';
import { P2PModel, LanguageModel } from '../../../models/dto';
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
  providers: [P2pService]
})
export class P2pCreateComponent extends BaseFormComponent<P2PModel> implements OnInit {

  form: FormGroup;
  steps = ['fosId', 'chargePerMinute', 'languages', 'deadline'];
  step = 0;
  languages: DropdownValueInterface<LanguageModel>[];

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
      title: new FormControl(null),
      // blobs: new FormArray([]),
      chargePerMinute: new FormControl(null, Validators.required),
      deadline: new FormControl(null, dateValidator({minDate: new Date()})),
      languages: new FormControl(null, [Validators.required, ArrayValidator({min: 1})])
    });
  }

  getNewValue(): P2PModel {
    return {
      text: '',
      fosId: undefined,
      title: 'test',
      chargePerMinute: undefined,
      deadline: undefined,
      languages: undefined,
      blobs: undefined,

      fos: undefined,
      p2pId: undefined,
      scheduledAt: undefined,
      isDeleted: false,
      scheduledWith: undefined,
      scheduledWithId: undefined,
      createdBy: undefined,
      createdById: undefined,
      p2pMessageModels: undefined,
      status: undefined
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.push(this.storageService.getLanguages().take(1).subscribe(languages => {
      this.languages = languages.map(l => { return {label: l.name, value: l}; });
    }));
  }

  onSubmit() {
    this.subscriptions.push(this.p2pService.create(this.getValue()).subscribe(response => {
      this.notificationService.info('p2p created');
      this.restartForm();
      this.checkStep();
    }, (err) => {
      this.notificationService.error('error creating p2p', err);
    }));
  }

}
