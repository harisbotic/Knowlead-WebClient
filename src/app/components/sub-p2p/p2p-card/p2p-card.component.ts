import { Component, OnInit, Input } from '@angular/core';
import { P2pComponent } from '../p2p/p2p.component';
import { AccountService } from '../../../services/account.service';
import { P2pService } from '../../../services/p2p.service';
import { StorageService } from '../../../services/storage.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { RealtimeService } from '../../../services/realtime.service';
import { Router, ActivatedRoute } from '@angular/router';
import { P2PDifficultyLevel } from '../../../models/dto';

@Component({
  selector: 'app-p2p-card',
  templateUrl: './p2p-card.component.html',
  styleUrls: ['./p2p-card.component.scss']
})
export class P2pCardComponent extends P2pComponent implements OnInit {
  @Input() set p2pCardId(value: number) {
    this.p2pId = value;
  }
  get p2pCardId(): number {
    return this.p2pId;
  }

  static colorLevels = ['low', 'mediocre', 'high'];
  deadlineColor: string;
  fosColor: string;
  priceColor: string;
  languageColor: string;
  difficultyColor: string;
  P2PDifficultyLevel = P2PDifficultyLevel;

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

  calculateDeadlineColor() {
    if (this.p2p && this.p2p.deadline) {
      const today: number = new Date().getTime();
      const deadline: number = this.p2p.deadline.getTime();
      const days = 1000 * 60 * 60 * 24;
      if (deadline - today > 5 * days) {
        this.deadlineColor = P2pCardComponent.colorLevels[0];
      }
      if (deadline - today <= 5 * days) {
        this.deadlineColor = P2pCardComponent.colorLevels[1];
      }
      if (deadline - today < 1 * days) {
        this.deadlineColor = P2pCardComponent.colorLevels[2];
      }
    }
  }

  calculateFosColor() {
    if (this.user && this.p2p) {
      this.fosColor = P2pCardComponent.colorLevels[0];
      for (let interest of this.user.interests) {
        if (interest.fosId === this.p2p.fosId) {
          if (interest.stars <= 3) {
            this.fosColor = P2pCardComponent.colorLevels[1];
          } else {
            this.fosColor = P2pCardComponent.colorLevels[2];
          }
        }
      }
    }
  }

  calculatePriceColor() {
    if (this.p2p) {
      if (this.p2p.actualPrice > 40) {
        this.priceColor = P2pCardComponent.colorLevels[2];
      }
      if (this.p2p.actualPrice <= 40) {
        this.priceColor = P2pCardComponent.colorLevels[1];
      }
      if (this.p2p.actualPrice <= 20) {
        this.priceColor = P2pCardComponent.colorLevels[0];
      }
    }
  }

  calculateLanguageColor() {
    if (this.p2p && this.p2p.languages && this.user) {
      this.languageColor = P2pCardComponent.colorLevels[0];
      for (let language of this.p2p.languages) {
        if (this.user.motherTongueId === language.coreLookupId) {
          this.languageColor = P2pCardComponent.colorLevels[2];
          return;
        }
        for (let speakLanguage of this.user.languages) {
          if (language.coreLookupId === speakLanguage.coreLookupId) {
            this.languageColor = P2pCardComponent.colorLevels[1];
          }
        }
      }
    }
  }

  calculateDifficultyColor() {
    if (this.p2p) {
      this.difficultyColor = 'level-' + P2PDifficultyLevel[this.p2p.difficultyLevel];
    }
  }

  refresh() {
    super.refresh();
    this.calculateDeadlineColor();
    this.calculateFosColor();
    this.calculatePriceColor();
    this.calculateLanguageColor();
    this.calculateDifficultyColor();
  }
}
