import { Component, ViewChild, AfterViewInit, forwardRef } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-flatpickr',
  templateUrl: './flatpickr.component.html',
  styleUrls: ['./flatpickr.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FlatpickrComponent),
      multi: true
    }]
})
export class FlatpickrComponent extends BaseFormInputComponent<Date> implements AfterViewInit {

  @ViewChild('flatpickr') element;
  flatpickr: any;
  initialValue: Date;
  constructor() { super(); }

  ngAfterViewInit() {
    this.flatpickr = this.element.nativeElement.flatpickr({
      altInput: true,
      onChange: (date) => this.value = date[0],
      defaultDate: this.initialValue,
      enableTime: true
    });
  }

  writeValue(value: Date) {
    super.writeValue(value);
    if (typeof value === 'string') {
      value = new Date(Date.parse(value));
    }
    if (this.flatpickr) {
      this.flatpickr.setDate(value);
    } else {
      this.initialValue = value;
    }
  }

}
