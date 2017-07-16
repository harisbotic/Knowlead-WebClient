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
  @Input() disableMax: Date;

  used = false;
  constructor() { super(); }

  onDateChanged(date) {
    this.value = date[0];
  }

  ngAfterViewInit() {
    let config = {
      altInput: true,
      onChange: this.onDateChanged.bind(this),
      defaultDate: this.initialValue,
      enableTime: true,
      enable: [],
      time_24hr: true
    };
    if (this.disablePast) {
      config.enable.push((date: Date) => {
        let d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        let ret = d.getTime() <= date.getTime();
        if (this.disableMax) {
          ret = ret && this.disableMax.getTime() > date.getTime();
        }
        return ret;
      });
    }
    this.flatpickr = this.element.nativeElement.flatpickr(config);
  }

  writeValue(value: Date) {
    if (!this.used && value) {
      this.used = true;
      return;
    }
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
