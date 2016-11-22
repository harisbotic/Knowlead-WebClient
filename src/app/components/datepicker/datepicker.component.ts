import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class DatepickerComponent implements OnInit, ControlValueAccessor {

  _value: Date;
  open = false;
  get value(): Date {
    return this._value;
  }
  set value(date: Date) {
    this._value = date;
    if (this.changed)
      this.changed(date);
  }
  changed: (date: any) => void;
  touched: (date: any) => void;

  @Input() text : string;
  @Input() saveText : string;
  @Input() title : string;

  constructor() { }

  ngOnInit() {
  }

  writeValue(value: Date) {
    if (typeof value == "object")
      this.value = value;
    else if (typeof value == "string")
      this.value = JSON.parse(value);
    else
      console.error("Invalid value for datepicker: " + value);
  }

  registerOnChange(cb) {
    this.changed = cb;
  }

  registerOnTouched(cb) {
    this.touched = cb;
  }

  openModal() {
    this.open = true;
  }

}
