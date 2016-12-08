import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { RealtimeService } from './services/realtime.service';
import { StorageService } from './services/storage.service';
import { StorageSubject } from './services/storage.subject';
import * as _ from 'lodash';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {

  caches = [];

  constructor(translate: TranslateService, realtimeService: RealtimeService, protected storageService: StorageService) {
    super();
    translate.addLangs(["en"]);
    translate.setDefaultLang("en");
    translate.use("en");
    setInterval(() => {
      this.caches = _.values(this.storageService.cache).map(cache => {
        return {
          cacheKey: cache.cacheKey,
          subscribers: {
            length: cache.subscribers.length
          }
        }
      });
    }, 200);
  }
}
