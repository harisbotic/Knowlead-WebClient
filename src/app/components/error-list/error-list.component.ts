import { Component, Input, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { translateValidations } from '../../utils/translators';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent implements DoCheck {

  display: string[];

  refresh = () => {
    this.display = [];
    if (this._errors) {
      this.display = _.clone(this._errors);
    }
    if (this._formControl && (!this.checkDirty || this._formControl.dirty)) {
      this.display = this.display.concat(translateValidations(this._formControl.errors));
    }
  }

  @Input() checkDirty = true;

  _errors: string[];
  @Input() set errors(value: string[]) {
    this._errors = value;
    this.refresh();
  }

  _formControl: FormControl;

  @Input() set formControlProperty(value: FormControl) {
    this._formControl = value;
    if (value && value.registerOnChange)
      value.registerOnChange(this.refresh);
    else
      console.warn("Form control set to " + value);
    this.refresh();
  }
  get Object() { return Object; };

  ngDoCheck() {
    this.refresh();
  }

}
