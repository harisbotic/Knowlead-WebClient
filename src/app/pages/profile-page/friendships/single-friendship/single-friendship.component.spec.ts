import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFriendshipComponent } from './single-friendship.component';

describe('SingleFriendshipComponent', () => {
  let component: SingleFriendshipComponent;
  let fixture: ComponentFixture<SingleFriendshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFriendshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFriendshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
