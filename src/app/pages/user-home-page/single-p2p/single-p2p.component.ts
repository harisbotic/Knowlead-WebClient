import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-p2p',
  templateUrl: './single-p2p.component.html',
  styleUrls: ['./single-p2p.component.scss']
})
export class SingleP2pComponent extends BaseComponent implements OnInit {

  p2pId: number;
  constructor(protected activatedRoute: ActivatedRoute) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.p2pId = parseInt(params['id'], 10);
    }));
  }

}
