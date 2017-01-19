/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MediatestComponent } from './mediatest.component';

describe('MediatestComponent', () => {
  let component: MediatestComponent;
  let fixture: ComponentFixture<MediatestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediatestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
