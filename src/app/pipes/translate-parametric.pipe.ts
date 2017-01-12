import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Pipe({
  name: 'translateParametric'
})
export class TranslateParametricPipe implements PipeTransform {

  translatePipe: TranslatePipe;

  constructor(protected translateService: TranslateService, protected changeDetectorRef: ChangeDetectorRef) {
    this.translatePipe = new TranslatePipe(translateService, changeDetectorRef);
  }

  transform(value: string, args?: any): any {
    if (value.indexOf(':') === -1) {
      return this.translatePipe.transform(value);
    } else {
      let sp = value.split(':', 1);

      if (sp.length !== 1) {
        console.error('Error splitting \'' + value + '\' for parametric translate. Expected at least 1 colon (:).');
      }

      return this.translatePipe.transform(sp[0], {param: value.substr(sp[0].length + 1)});
    }
  }

}
