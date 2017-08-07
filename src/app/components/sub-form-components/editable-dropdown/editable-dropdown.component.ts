import {
  Component,
  OnInit,
  Input,
  forwardRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  BaseFormInputComponent
} from '../base-form-input/base-form-input.component';
import {
  DropdownValueInterface
} from '../../../models/frontend.models';

@Component({
  selector: 'app-editable-dropdown',
  templateUrl: './editable-dropdown.component.html',
  styleUrls: ['./editable-dropdown.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EditableDropdownComponent),
    multi: true
  }]
})
export class EditableDropdownComponent extends BaseFormInputComponent < any | any[] > {

  @Input() editable: boolean;
  @Input() options: DropdownValueInterface < any > [];
  @Input() placeholder: string;
  @Input() multiple: boolean;

  getValue() {
    if (this.options && this.value) {
      let result = [];
      for (let index = 0; index < this.options.length; index++) {
        if (Array.isArray(this.value)) {
          for (let j = 0; j < this.value.length; j++) {
            // tslint:disable-next-line:triple-equals
            if (this.options[index].value == this.value[j]) {
              result.push(this.options[index].label);
            }
          }
        } else {
          // tslint:disable-next-line:triple-equals
          if (this.options[index].value == this.value) {
            return this.options[index].label;
          }
        }
      }
      return result.join(', ');
    }
  }
}
