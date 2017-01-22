import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { RealtimeService } from './services/realtime.service';
import { StorageService } from './services/storage.service';
import * as _ from 'lodash';
import { BaseComponent } from './base.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent extends BaseComponent {

  caches = [];

  constructor(translate: TranslateService,
      realtimeService: RealtimeService,
      protected storageService: StorageService,
      protected analiticsService: AnalyticsService) {
    super();
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
    setInterval(() => {
      this.caches = _.values(this.storageService.cache).map(cache => {
        return {
          cacheKey: cache.cacheKey,
          subscribers: {
            length: cache.subscribers.length
          },
          value: cache.value
        };
      });
    }, 200);
  }

  safeJson(o) {
    let cache = [];
    return JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
  }
}
