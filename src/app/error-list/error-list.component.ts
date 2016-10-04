import { Component, Input } from '@angular/core';
import { ResponseModel } from './../models/dto';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent {

  @Input() errors: string[];

}
