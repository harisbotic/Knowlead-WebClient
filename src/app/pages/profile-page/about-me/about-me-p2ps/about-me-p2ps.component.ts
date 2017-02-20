import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { ActivatedRoute } from '@angular/router';
import { P2pService } from '../../../../services/p2p.service';

@Component({
  selector: 'app-about-me-p2ps',
  templateUrl: './about-me-p2ps.component.html',
  styleUrls: ['./about-me-p2ps.component.scss']
})
export class AboutMeP2psComponent extends BaseComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected p2pService: P2pService) { super(); }

  ngOnInit() {
  }

}
