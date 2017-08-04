import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-editable-flatpickr',
  templateUrl: './editable-flatpickr.component.html',
  styleUrls: ['./editable-flatpickr.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableFlatpickrComponent),
      multi: true
    }]
})
export class EditableFlatpickrComponent extends BaseFormInputComponent<Date> {

  @Input() editable: Boolean;
  @Input() placeholder: string;

}
