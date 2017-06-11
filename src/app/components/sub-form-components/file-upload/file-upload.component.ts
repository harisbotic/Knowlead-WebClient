import { Component, OnInit, forwardRef, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { getGuid } from '../../../utils/index';
import { FileService } from '../../../services/file.service';
import { ResponseModel, _BlobModel } from '../../../models/dto';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { NotificationService } from '../../../services/notifications/notification.service';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';
import { BlobModelExtended, FileStatus } from '../../../models/frontend.models';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    FileService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent extends BaseFormInputComponent<_BlobModel> implements OnInit, OnDestroy {
  id: string;
  subscription: Subscription;
  @Output() removed = new EventEmitter<_BlobModel>();
  @Input() outputType = 'object';
  FileStatus = FileStatus;

  emitChange() {
    if (this.outputType === 'object') {
      this.changeCb(this.value);
    } else if (this.outputType === 'id') {
      this.changeCb(this.value ? this.value.blobId : null);
    }
  }

  constructor(protected fileService: FileService, protected notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.id = getGuid();
  }

  fileSelected(event: Event) {
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.value = <_BlobModel>{};
      console.log(element.files[0]);
      this.subscription = this.fileService.upload(element.files[0])
        .subscribe(this.fileStatusChanged.bind(this), (response: ResponseModel) => {
          this.notificationService.error('file|fail', response);
          this.deleted();
        });
      this.subscriptions.push(this.subscription);
    } else {
      console.warn('No file selected');
    }
  }

  protected removeSubscription() {
      this.subscription.unsubscribe();
      delete this.subscription;
  }

  fileStatusChanged(file: BlobModelExtended) {
    if (file.status !== FileStatus.CANCELED) {
      this.value = file;
    } else {
      this.value = undefined;
      this.removeSubscription();
    }
  }

  deleted(): void {
    this.fileService.remove(this.value);
    this.removed.emit(this.value);
  }

  writeValue(value: _BlobModel) {
    if (this.subscription) {
      this.removeSubscription();
    }
    if (value) {
      const fileStatus = this.fileService.getFileStatus(value);
      if (fileStatus) {
        this.subscription = fileStatus.subscribe(this.fileStatusChanged.bind(this));
        super.writeValue(value);
      } else {
        // This shouldn't happen. This happens if value written to this component is non-existing file.
        super.writeValue(undefined);
      }
    } else {
      super.writeValue(undefined);
    }
  }

}
