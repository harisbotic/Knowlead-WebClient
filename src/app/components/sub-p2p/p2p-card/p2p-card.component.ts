import { Component, OnInit, Input } from '@angular/core';
import { P2pComponent } from '../p2p/p2p.component';
import { AccountService } from '../../../services/account.service';
import { P2pService } from '../../../services/p2p.service';
import { StorageService } from '../../../services/storage.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { RealtimeService } from '../../../services/realtime.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-p2p-card',
  templateUrl: './p2p-card.component.html',
  styleUrls: ['./p2p-card.component.scss']
})
export class P2pCardComponent extends P2pComponent implements OnInit {
  @Input() set p2pId(value: number) {
    super.p2pId = value;
  }
  get p2pId(): number {
    return super.p2pId;
  }

  constructor(protected accountService: AccountService,
              protected storageService: StorageService,
              protected p2pService: P2pService,
              protected notificationService: NotificationService,
              protected modelUtilsService: ModelUtilsService,
              protected realtimeService: RealtimeService,
              protected router: Router,
              protected activatedRoute: ActivatedRoute) {
    super(accountService, storageService, p2pService, notificationService,
          modelUtilsService, realtimeService, router, activatedRoute);
  }
}
