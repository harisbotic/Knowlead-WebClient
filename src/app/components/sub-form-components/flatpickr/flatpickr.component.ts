import { Component, ViewChild, AfterViewInit, forwardRef, Input } from '@angular/core';
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

  @Input() placeholder: string;
  @Input() disablePast = false;
  constructor() { super(); }

  ngAfterViewInit() {
    let config = {
      altInput: true,
      onChange: (date) => this.value = date[0],
      defaultDate: this.initialValue,
      enableTime: true,
      disable: [],
      time_24hr: true
    };
    if (this.disablePast) {
      config.disable.push((date: Date) => {
        let d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d.getTime() > date.getTime();
      });
    }
    this.flatpickr = this.element.nativeElement.flatpickr(config);
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
