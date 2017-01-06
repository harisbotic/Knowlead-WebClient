/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FriendshipStripComponent } from './friendship-strip.component';

describe('FriendshipStripComponent', () => {
  let component: FriendshipStripComponent;
  let fixture: ComponentFixture<FriendshipStripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendshipStripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendshipStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
