import { Component, OnInit } from '@angular/core';
import { P2PModel, LanguageModel } from '../../../models/dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import * as _ from 'lodash';
import { BaseComponent } from '../../../base.component';
import { DropdownValueInterface } from '../../../models/frontend.models';
import { StorageService } from '../../../services/storage.service';
import { ArrayValidator } from '../../../validators/array.validator';
import { dateValidator } from '../../../validators/date.validator';

@Component({
  selector: 'app-p2p-create',
  templateUrl: './p2p-create.component.html',
  styleUrls: ['./p2p-create.component.scss'],
  providers: [P2pService]
})
export class P2pCreateComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  steps = ['fosId', 'chargePerMinute', 'languages', 'deadline'];
  step = 0;
  languages: DropdownValueInterface<LanguageModel>[];

  get value(): P2PModel {
    let ret: P2PModel = _.cloneDeep(this.form.value);
    ret.blobs = _.without(ret.blobs, null);
    return ret;
  }

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

  ngOnInit() {
    let initial = {
      text: new FormControl(null, Validators.required),
      fosId: new FormControl(null, Validators.required),
      title: new FormControl('ovo ono'),
      // blobs: new FormArray([]),
      chargePerMinute: new FormControl(null, Validators.required),
      deadline: new FormControl(null, dateValidator({minDate: new Date()})),
      languages: new FormControl(null, [Validators.required, ArrayValidator({min: 1})])
    };
    this.form = new FormGroup(initial);
    this.subscriptions.push(this.storageService.getLanguages().take(1).subscribe(languages => {
      this.languages = languages.map(l => { return {label: l.name, value: l}; });
    }));
  }

  submit() {
    this.subscriptions.push(this.p2pService.create(this.value).subscribe(response => {
      this.notificationService.info('p2p created');
      this.form.reset();
      this.checkStep();
    }, (err) => {
      this.notificationService.error('error creating p2p', err);
    }));
  }

}
