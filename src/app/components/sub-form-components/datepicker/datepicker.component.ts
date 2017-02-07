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
  monthsList = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

  @Input() text: string;
  @Input() saveText: string;
  @Input() title: string;
  @Input() timePick = false;

  dayValue: number;
  monthValue: number;
  yearValue: number;

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
    this.refreshValue();
  }
  monthSelected(value: DropdownValueInterface<number>) {
    this.refreshValue();
  }
  yearSelected(value: DropdownValueInterface<number>) {
    this.refreshValue();
  }

  refreshValue() {
    if (this.dayValue === undefined || this.monthValue === undefined || this.yearValue === undefined) {
      this.value = undefined;
    } else {
      this.value = getDateIfValid(this.dayValue, this.monthValue, this.yearValue);
    }
  }

  public writeValue(value: Date) {
    super.writeValue(value);
    if (value) {
      this.dayValue = <any>[value.getDate()];
      this.monthValue = <any>[value.getMonth() + 1];
      this.yearValue = <any>[value.getFullYear()];
      this.refreshValue();
    } else {
      this.dayValue = undefined;
      this.monthValue = undefined;
      this.yearValue = undefined;
      this.refreshValue();
    }
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
      this.months.push({value: i, label: this.monthsList[i - 1]});
    }
    for (let i = 1900; i <= 2050; i++) {
      this.years.push({value: i, label: i.toString()});
    }
  }

}
