import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserModel, ImageBlobModel, Guid } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { BaseComponent } from '../../base.component';
import { AccountService } from '../../services/account.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileStatus } from '../../models/frontend.models';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  providers: [FileService]
})
export class ProfilePictureComponent extends BaseComponent implements OnInit {

  @Input() set user(user: ApplicationUserModel) {
    delete this.url;
    if (user && user.profilePictureId) {
      this.url = ModelUtilsService.getImageBlobUrl(user.profilePictureId);
    }
    this.profilePictureId = (user) ? user.profilePictureId : undefined;
    if (!this.url) {
      this.url = '/assets/images/default_profile.jpg';
    }
    this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + this.url + ')');
  }
  @Input() uploadable: boolean;
  @Input() size = 'small';
  profilePictureId: Guid;
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
      console.log('FILE SELECTED');
      this.subscriptions.push(
        // First upload the picture
        this.fileService.upload(element.files[0])
          .do(file => console.log(file.status.toString()))
          .filter(blob => blob.status === FileStatus.UPLOADED).subscribe(image => {
            // Then set the profile picture to uploaded image
            const oldImage = this.profilePictureId;
            this.subscriptions.push(this.accountService.changeProfilePicture(<any>image).subscribe(() => {
              // Remove old profile picture from server
              if (oldImage) {
                this.fileService.remove(oldImage);
              }
            }));
        })
      );
    } else {
      console.error('No file selected');
    }
  }

  remove() {
    const tmp = this.profilePictureId;
    if (this.profilePictureId) {
      const sub = this.accountService.removeProfilePicture().subscribe(() => {
        sub.unsubscribe();
        this.subscriptions.push(this.fileService.remove(tmp).subscribe());
      });
    }
  }

}
