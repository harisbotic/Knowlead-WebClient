/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CallChatComponent } from './call-chat.component';

describe('CallChatComponent', () => {
  let component: CallChatComponent;
  let fixture: ComponentFixture<CallChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
