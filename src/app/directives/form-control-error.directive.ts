import { Directive, ComponentRef, OnInit, ComponentFactoryResolver, ViewContainerRef, Injector, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { translateValidations } from '../utils/translators';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ErrorTooltipComponent } from '../components/sub-popups/error-tooltip/error-tooltip.component';
import { Router } from '@angular/router';
import { TranslateParametricPipe } from '../pipes/translate-parametric.pipe';

@Directive({
  selector: '[appFormControlError]'
})
export class FormControlErrorDirective extends BaseComponent implements OnInit {

  display: string;
  className = 'error-tooltip';
  wrapClassName = 'tooltip-parent';
  tooltipElement: HTMLElement;

  constructor(protected el: ElementRef, protected control: NgControl, protected translateService: TranslateService) {
    super();
  }

  ngOnInit() {
    if (!this.parent.classList.contains(this.wrapClassName)) {
      console.error('Error initializing form control error for ' + this.control.name +
        ': Parent doesn\'t contain class: ' + this.wrapClassName);
    }
    this.subscriptions.push(this.control.valueChanges.subscribe(this.refresh));
    this.subscriptions.push(this.control.statusChanges.subscribe(this.refresh));
  }

  refresh = () => {
    if (this.control && this.control.dirty) {
      this.display = translateValidations(this.control.errors)[0];
    }
    if (this.display && this.display.length > 0) {
      if (!this.tooltipElement) {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.classList.add(this.className);
        this.parent.appendChild(this.tooltipElement);
      }
      const tmp = TranslateParametricPipe.prepareForTranslate(this.display);
      this.translateService.get(tmp.value, tmp.param).take(1).subscribe(translation => {
        if (this.tooltipElement) {
          this.tooltipElement.innerText = translation;
        }
      });
    } else {
      if (this.tooltipElement) {
        this.parent.removeChild(this.tooltipElement);
        delete this.tooltipElement;
      }
    }
  }

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  get parent(): HTMLElement {
    return this.element.parentElement;
  }

}
