import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { P2pService } from '../../../services/p2p.service';
import { P2PModel, FOSModel } from '../../../models/dto';
import { sortByDateFunction } from '../../../utils/index';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { DropdownValueInterface } from '../../../models/frontend.models';

@Component({
  selector: 'app-default-home-page',
  templateUrl: './default-home-page.component.html',
  styleUrls: ['./default-home-page.component.scss']
})
export class DefaultHomePageComponent extends BaseComponent implements OnInit {

  p2ps: P2PModel[];

  constructor(protected p2pService: P2pService,
              protected activatedRoute: ActivatedRoute,
              protected storageService: StorageService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
      if (params['fos']) {
        const foses = <string>params['fos'];
        const fosIds = foses.split(',').map(parseInt);
        this.subscriptions.push(this.p2pService.getByFosIds(fosIds).subscribe(vals => {
          this.p2ps = vals;
        }));
      } else {
        this.subscriptions.push(this.p2pService.getAll(undefined).subscribe(vals => {
          this.p2ps = vals;
        }));
      }
    }));
  }

  loadMore() {
    let oldest: Date = undefined;
    if (this.p2ps.length !== 0) {
      oldest = this.p2ps[this.p2ps.length - 1].dateCreated;
    }
    this.subscriptions.push(this.p2pService.getAll(oldest).subscribe(vals => {
      this.p2ps = this.p2ps.concat(vals.slice());
      this.refresh();
    }));
  }

  refresh() {
    this.p2ps = this.p2ps.slice().sort(sortByDateFunction<P2PModel>('dateCreated'));
  }

  p2pAdded(p2pId: number) {
    this.subscriptions.push(this.p2pService.get(p2pId).subscribe(p2p => {
      let idx = this.p2ps.findIndex(loaded => p2p.p2pId === loaded.p2pId);
      if (idx === -1) {
        this.p2ps.push(p2p);
      } else {
        this.p2ps[idx] = p2p;
      }
      this.refresh();
    }));
  }

}
