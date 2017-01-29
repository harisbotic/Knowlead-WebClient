import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }]
})
export class DatepickerComponent extends BaseFormInputComponent<Date> {

  open = false;

  @Input() text: string;
  @Input() saveText: string;
  @Input() title: string;
  @Input() timePick: boolean = false;

  setHours(hours: number) {
    if (this.value == null) {
      this.value = new Date();
    }
    this.value.setHours(hours);
    this.value = this.value;
  }

  setMinutes(minutes: number) {
    if (this.value == null) {
      this.value = new Date();
    }
    this.value.setMinutes(minutes);
    this.value = this.value;
  }

  constructor() { super(); }

  openModal() {
    this.open = true;
  }

}
