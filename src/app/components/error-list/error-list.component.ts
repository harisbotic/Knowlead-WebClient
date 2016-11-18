import { Component, Input, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent implements DoCheck {

  display: string[];

  refresh = () => {
    this.display = [];
    if (this._errors)
      this.display = _.clone(this._errors);
    if (this._formControl && this._formControl.dirty)
      this.display = this.display.concat(Object.keys(this._formControl.errors || {}).map(c => "validation:" + c));
  }

  _errors: string[];
  @Input() set errors(value: string[]) {
    this._errors = value;
    this.refresh();
  }

  _formControl: FormControl;

  @Input() set formControlProperty(value: FormControl) {
    this._formControl = value;
    if (value)
      value.registerOnChange(this.refresh);
    this.refresh();
  }
  get Object() { return Object; };

  ngDoCheck() {
    this.refresh();
  }

}
