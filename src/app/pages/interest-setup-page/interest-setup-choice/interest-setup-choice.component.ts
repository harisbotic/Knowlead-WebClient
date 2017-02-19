import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InterestModel, FOSModel } from '../../../models/dto';
import { BaseComponent } from '../../../base.component';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-interest-setup-choice',
  templateUrl: './interest-setup-choice.component.html',
  styleUrls: ['./interest-setup-choice.component.scss']
})
export class InterestSetupChoiceComponent extends BaseComponent implements OnInit {

  @Output() remove = new EventEmitter<FOSModel>();
  @Input() interest: InterestModel;
  count: number;

  constructor(protected storageService: StorageService) { super(); }

  ngOnInit() {
    if (!this.interest.fos.unlocked) {
      this.subscriptions.push(this.storageService.getFOSvotes(this.interest.fos).subscribe(count => {
        this.count = count;
      }));
    }
  }

  removed() {
    this.remove.emit(this.interest.fos);
  }

}
