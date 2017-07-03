import { Component, OnInit, Input } from '@angular/core';
import { _BlobModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-file-thumbnail',
  templateUrl: './file-thumbnail.component.html',
  styleUrls: ['./file-thumbnail.component.scss']
})
export class FileThumbnailComponent implements OnInit {

  @Input() file: _BlobModel;
  isImage: boolean;
  backgroundUrl: string;

  constructor() { }

  ngOnInit() {
    this.isImage = this.file.blobType === 'Image';
    if (this.isImage) {
      this.backgroundUrl = ModelUtilsService.getImageBlobUrl(this.file.blobId);
    }
  }

}
