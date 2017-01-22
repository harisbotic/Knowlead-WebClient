import { OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BaseComponent } from '../../base.component';

export type InputCallbackType = (value: any) => void;

export class BaseFormInputComponent<T> extends BaseComponent implements ControlValueAccessor {

  protected _value: T;
  protected changeCb: InputCallbackType = () => {};
  protected touchCb: InputCallbackType = () => {};

  protected emitChange(): void {
    this.changeCb(this.value);
  }

  constructor() { super(); }

  registerOnChange(cb: InputCallbackType): void {
    this.changeCb = cb;
  }

  registerOnTouched(cb: InputCallbackType): void {
    this.touchCb = cb;
  }

  set value(obj: T) {
    if (!this._value && !obj) {
      return;
    }
    this._value = obj;
    if (this.changeCb) {
      this.emitChange();
    }
  }

  get value(): T {
    return this._value;
  }

  writeValue(value: T): void {
    this.value = value;
  }

}
