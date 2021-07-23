import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BdbHtmlComponent} from './bdb-html.component';

describe('BdbHtmlComponent', () => {
  let component: BdbHtmlComponent;
  let fixture: ComponentFixture<BdbHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BdbHtmlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdbHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
