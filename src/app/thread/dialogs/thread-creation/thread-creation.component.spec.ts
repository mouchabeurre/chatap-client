import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadCreationComponent } from './thread-creation.component';

describe('ThreadCreationComponent', () => {
  let component: ThreadCreationComponent;
  let fixture: ComponentFixture<ThreadCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
