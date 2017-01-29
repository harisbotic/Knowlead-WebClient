import { Component, OnInit, forwardRef, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { getGuid } from '../../../utils/index';
import { FileService } from '../../../services/file.service';
import { ResponseModel, _BlobModel } from '../../../models/dto';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { NotificationService } from '../../../services/notification.service';
import { BaseFormInputComponent } from '../base-form-input/base-form-input.component';


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
  @Output() removed = new EventEmitter<any>();
  @Output() uploading = new EventEmitter<any>();
  @Input() outputType = 'object';

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

  fileRemoved(index: number) {
    console.log(index);
  }

  fileSelected(event: Event) {
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.value = <_BlobModel>{};
      this.uploading.emit();
      this.subscription = this.fileService.upload(element.files[0])
        .subscribe(response => {
          this.value = response.object;
        }, (response: ResponseModel) => {
          this.notificationService.error('file|fail', response);
          this.deleted();
        });
    } else {
      console.error('No file selected');
    }
  }

  deleted(): void {
    if (!this.subscription) {
      return;
    }
    let tmp: Observable<any>;
    if (!this.subscription.closed) {
      tmp = Observable.of(null);
      this.subscription.unsubscribe();
      console.debug('Canceling request');
    } else {
      tmp = this.fileService.remove(this.value);
      console.debug('Removing file from backend');
    }
    this.subscriptions.push(tmp.subscribe(response => {
      this.removed.emit();
      this.subscription = null;
      this.value = null;
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
