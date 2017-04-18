import { Component, OnInit, Input } from '@angular/core';
import { P2PModel } from '../../../models/dto';

@Component({
  selector: 'app-p2p-masonry-list',
  templateUrl: './p2p-masonry-list.component.html',
  styleUrls: ['./p2p-masonry-list.component.scss']
})
export class P2pMasonryListComponent implements OnInit {

  @Input() p2ps: P2PModel[];

  constructor() { }

  ngOnInit() {
  }

}
