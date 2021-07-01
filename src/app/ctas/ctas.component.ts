import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {CtaDefinition} from '../offer/offer.service';

@Component({
  selector: 'app-ctas',
  templateUrl: './ctas.component.html',
  styleUrls: ['./ctas.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CtasComponent
    }
  ]
})
export class CtasComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() ctaName: string;
  @Input() ctaValue: CtaDefinition;
  onTouched: boolean;
  ctasForm: FormGroup = new FormGroup({});
  showForm = false;

  constructor() {
  }

  ngOnInit() {
    this.ctasForm.addControl('ctaLmeResponseCode',
      new FormControl(this.ctaValue && this.ctaValue.ctaLmeResponseCode ? this.ctaValue.ctaLmeResponseCode : '',
        [Validators.required]));
    this.ctasForm.addControl('ctaType', new FormControl(this.ctaValue && this.ctaValue.ctaType ? this.ctaValue.ctaType : '',
      [Validators.required]));
    this.ctasForm.addControl('ctaUrl', new FormControl(this.ctaValue && this.ctaValue.ctaUrl ? this.ctaValue.ctaUrl : '',
      [Validators.required]));
  }

  ngAfterViewInit() {
    this.ctasForm.valueChanges.pipe().subscribe(value => {
      this.onChange(this.ctasForm.valid ? value : null);
    });
  }

  onChange = (ctaValue) => {
  };

  writeValue(ctaValue: CtaDefinition) {
    this.ctaValue = ctaValue;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

}
