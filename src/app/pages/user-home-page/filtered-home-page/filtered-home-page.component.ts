import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { P2pService } from '../../../services/p2p.service';
import { P2PModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
import { ListP2PsRequest } from '../../../models/constants';
import { sortByDateFunction } from '../../../utils/index';

@Component({
  selector: 'app-filtered-home-page',
  templateUrl: './filtered-home-page.component.html',
  styleUrls: ['./filtered-home-page.component.scss']
})
export class FilteredHomePageComponent extends BaseComponent implements OnInit {

  p2ps: P2PModel[];
  wasProblem = false;

  constructor(protected activatedRoute: ActivatedRoute, protected p2pService: P2pService) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      let value: ListP2PsRequest = params['id'];
      if (ListP2PsRequest[value] === undefined) {
        this.wasProblem = true;
      } else {
        this.subscriptions.push(this.p2pService.getFiltered(value).subscribe(p2ps => {
          this.p2ps = p2ps.slice().sort(sortByDateFunction<P2PModel>('dateCreated'));
        }));
      }
    }));
  }

}
