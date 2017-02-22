import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { TranslateService } from 'ng2-translate/ng2-translate';

interface TranslateInterface {
  value: string;
  param?: {[index: string]: string};
}

@Pipe({
  name: 'translateParametric'
})
export class TranslateParametricPipe implements PipeTransform {

  translatePipe: TranslatePipe;

  static prepareForTranslate(value: string): TranslateInterface {

    if (value.indexOf(':') === -1) {
      return {value: value};
    } else {
      let sp = value.split(':', 1);

      if (sp.length !== 1) {
        console.error('Error splitting \'' + value + '\' for parametric translate. Expected at least 1 colon (:).');
      }

      return {value: sp[0], param: {param: value.substr(sp[0].length + 1)}};
    }
  }

  constructor(protected translateService: TranslateService, protected changeDetectorRef: ChangeDetectorRef) {
    this.translatePipe = new TranslatePipe(translateService, changeDetectorRef);
  }

  transform(value: string, args?: any): any {
    if (typeof value !== 'string') {
      console.error('Translate parametric, didnt get string');
      console.error(value);
      return '';
    }
    const translated = TranslateParametricPipe.prepareForTranslate(value);
    return this.translatePipe.transform(translated.value, translated.param);
  }

}
