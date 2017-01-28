import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel, ImageBlobModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  providers: [FileService]
})
export class ProfilePictureComponent extends BaseComponent implements OnInit {

  @Input() user: ApplicationUserModel;
  @Input() uploadable: boolean;
  id = getGuid();

  constructor(protected fileService: FileService, protected accountService: AccountService) { super(); }

  ngOnInit() {
  }

  getSrc(): string {
    if (this.user && this.user.profilePictureId) {
      return ModelUtilsService.getImageBlobUrl(this.user.profilePicture);
    } else {
      return 'https://cdn0.vox-cdn.com/images/verge/default-avatar.v9899025.gif';
    }
  }
  fileSelected(event: Event) {
    if (!this.user) {
      return;
    }
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.subscriptions.push(
          this.fileService.upload(element.files[0]).map(response => <ImageBlobModel>response.object).subscribe(image => {
        this.subscriptions.push(this.accountService.patchUser([{
          op: 'replace',
          path: '/profilePictureId', // TODO: MAKE THIS STRONGLY TYPED
          value: image.blobId
        }]).subscribe());
      }));
    } else {
      console.error('No file selected');
    }
  }

}
