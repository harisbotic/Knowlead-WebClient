import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { P2pService } from '../../../services/p2p.service';
import { P2PModel } from '../../../models/dto';

@Component({
  selector: 'app-default-home-page',
  templateUrl: './default-home-page.component.html',
  styleUrls: ['./default-home-page.component.scss']
})
export class DefaultHomePageComponent extends BaseComponent implements OnInit {

  p2ps: P2PModel[];

  constructor(protected p2pService: P2pService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.p2pService.getAll().subscribe(vals => {
      this.p2ps = vals.slice().sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
    }));
  }

  p2pAdded(p2pId: number) {
    this.subscriptions.push(this.p2pService.get(p2pId).subscribe(p2p => {
      let idx = this.p2ps.findIndex(loaded => p2p.p2pId === loaded.p2pId);
      if (idx === -1) {
        this.p2ps = [p2p].concat(this.p2ps);
      } else {
        this.p2ps[idx] = p2p;
      }
    }));
  }

}
