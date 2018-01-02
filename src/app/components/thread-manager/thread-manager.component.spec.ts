import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadManagerComponent } from './thread-manager.component';

describe('ThreadManagerComponent', () => {
  let component: ThreadManagerComponent;
  let fixture: ComponentFixture<ThreadManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
