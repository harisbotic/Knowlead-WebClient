/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CallPageComponent } from './call-page.component';

describe('CallPageComponent', () => {
  let component: CallPageComponent;
  let fixture: ComponentFixture<CallPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
