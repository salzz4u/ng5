import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BdbJsonComponent } from './bdb-json.component';

describe('BdbJsonComponent', () => {
  let component: BdbJsonComponent;
  let fixture: ComponentFixture<BdbJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BdbJsonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdbJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
