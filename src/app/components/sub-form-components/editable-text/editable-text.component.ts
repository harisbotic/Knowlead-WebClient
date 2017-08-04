import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableTextComponent),
      multi: true
    }]
})
export class EditableTextComponent extends BaseFormInputComponent<string> {

  @Input() editable: Boolean;
  @Input() placeholder: string;
}
