import { Component } from '@angular/core';
import { P2PModel } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent extends BaseComponent {

  p2ps: P2PModel[] = [];

  constructor(protected p2pService: P2pService) {
    super();
  }

}
