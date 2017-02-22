import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-tooltip',
  templateUrl: './error-tooltip.component.html',
  styleUrls: ['./error-tooltip.component.scss']
})
export class ErrorTooltipComponent implements OnInit {

  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
