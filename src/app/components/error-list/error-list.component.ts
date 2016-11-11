import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent {

  @Input() errors: string[];

}
