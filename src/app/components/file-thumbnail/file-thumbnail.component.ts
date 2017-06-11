import { Component, OnInit, Input } from '@angular/core';
import { _BlobModel } from '../../models/dto';

@Component({
  selector: 'app-file-thumbnail',
  templateUrl: './file-thumbnail.component.html',
  styleUrls: ['./file-thumbnail.component.scss']
})
export class FileThumbnailComponent implements OnInit {

  @Input() file: _BlobModel;

  constructor() { }

  ngOnInit() {
  }

}
