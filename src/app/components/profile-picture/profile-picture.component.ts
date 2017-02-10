import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel, ImageBlobModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../services/account.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  providers: [FileService]
})
export class ProfilePictureComponent extends BaseComponent implements OnInit {

  @Input() set user(user: ApplicationUserModel) {
    delete this.url;
    if (user && user.profilePicture) {
      this.url = ModelUtilsService.getImageBlobUrl(user.profilePicture);
    }
    if (!this.url) {
      this.url = 'https://cdn0.vox-cdn.com/images/verge/default-avatar.v9899025.gif';
    }
    this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + this.url + ')');
  }
  @Input() uploadable: boolean;
  @Input() size = 'small';
  id = getGuid();
  url: any;

  constructor(protected fileService: FileService,
            protected accountService: AccountService,
            protected sanitizer: DomSanitizer) { super(); }

  ngOnInit() {
  }

  fileSelected(event: Event) {
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.subscriptions.push(
          this.fileService.upload(element.files[0]).map(response => <ImageBlobModel>response.object).subscribe(image => {
        this.subscriptions.push(this.accountService.changeProfilePicture(image).subscribe());
      }));
    } else {
      console.error('No file selected');
    }
  }

}
