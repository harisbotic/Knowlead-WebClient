import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { extractTranslationPage, extractTranslationName } from './../utils/translate-utils';

@Component({
  selector: 'app-translation-test',
  templateUrl: './translation-test.component.html',
  styleUrls: ['./translation-test.component.scss']
})
export class TranslationTestComponent {

  languages: string[] = [];
  data: {[index: string]: string}[] = [];

  constructor(translate: TranslateService) {
    this.languages = translate.getLangs();
    for (let language of translate.getLangs()) {
      translate.getTranslation(language)
        .subscribe(translation => {
          for (var key in translation) {
            var row = null;
            for (var tmprow in this.data) {
              if (tmprow["key"] == key) {
                row = tmprow;
                break;
              }
            }
            if (row == null) {
              row = {
                key: key,
                page: extractTranslationPage(key),
                name: extractTranslationName(key)
              };
              this.data.push(row);
            }
            row[language] = translation[key];
          }
        });
    }
  }
}
