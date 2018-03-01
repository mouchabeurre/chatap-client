import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarAccountComponent } from './toolbar-account.component';

describe('ToolbarAccountComponent', () => {
  let component: ToolbarAccountComponent;
  let fixture: ComponentFixture<ToolbarAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
