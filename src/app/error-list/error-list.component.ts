import { Component, Input } from '@angular/core';
import { ErrorModel } from "../models";

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent {

  @Input() errors: ErrorModel[];
  @Input() error: ErrorModel;

}
