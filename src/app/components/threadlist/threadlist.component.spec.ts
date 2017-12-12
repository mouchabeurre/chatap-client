import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadlistComponent } from './threadlist.component';

describe('ThreadlistComponent', () => {
  let component: ThreadlistComponent;
  let fixture: ComponentFixture<ThreadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
