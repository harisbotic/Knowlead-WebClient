import { Component, OnInit, Input } from '@angular/core';
import { _FeedbackModel } from '../../../../../models/dto';

@Component({
  selector: 'app-single-review',
  templateUrl: './single-review.component.html',
  styleUrls: ['./single-review.component.scss']
})
export class SingleReviewComponent implements OnInit {

  @Input() review: _FeedbackModel;

  constructor() { }

  ngOnInit() {
  }

}
