import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { getDateIfValid } from '../../../utils/index';
import { DropdownValueInterface } from '../../../models/frontend.models';

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

  days: DropdownValueInterface<number>[];
  months: DropdownValueInterface<number>[];
  years: DropdownValueInterface<number>[];
  open = false;

  @Input() text: string;
  @Input() saveText: string;
  @Input() title: string;
  @Input() timePick = false;

  month = 1;
  year = 2000;
  day: number;

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

  daySelected(value: DropdownValueInterface<number>) {
    this.day = value.value;
    this.refreshValue();
  }
  monthSelected(value: DropdownValueInterface<number>) {
    this.month = value.value;
    this.refreshValue();
  }
  yearSelected(value: DropdownValueInterface<number>) {
    this.year = value.value;
    this.refreshValue();
  }

  refreshValue() {
    this.value = getDateIfValid(this.day, this.month, this.year);
  }

  constructor() {
    super();
    this.days = [];
    this.months = [];
    this.years = [];
    for (let i = 1; i <= 31; i++) {
      this.days.push({value: i, label: i.toString()});
    }
    for (let i = 1; i <= 12; i++) {
      this.months.push({value: i, label: i.toString()});
    }
    for (let i = 1900; i <= 2050; i++) {
      this.years.push({value: i, label: i.toString()});
    }
  }

}
