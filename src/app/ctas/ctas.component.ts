import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { CtaDefinition } from '../offer/offer.service';

enum ctaResponseCodes {
  'LOG_REJECT' = 'LogReject',
  'LOG_FOLLOW_UP' = 'LogFollowUp',
}

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
  @Input() formControlName: string;
  onTouched: boolean;
  ctasForm: FormGroup = new FormGroup({});
  showForm = false;
  hideCtaType = false;
  hideCtaUrl = false;
  disableDropdown = false;
  ctaTypes = [
    { label: 'Please select a value', value: '' },
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
    { label: 'SSO', value: 'sso' },
  ];
  responseCodes = [
    { label: 'Please select a value', value: '' },
    { label: 'LogContact', value: 'LogContact' },
    { label: 'LogAcceptFulfill', value: 'LogAcceptFulfill' },
    { label: 'LogCreateReferral', value: 'LogCreateReferral' },
    { label: 'LogAcceptAppointment', value: 'LogAcceptAppointment' },
    { label: 'LogReject', value: 'LogReject' },
    { label: 'LogFollowUp', value: 'LogFollowUp' },
    { label: 'LogClicked', value: 'LogClicked' },
    { label: 'LogFulfilledSales', value: 'LogFulfilledSales' },
    { label: 'LogFulfilledService', value: 'LogFulfilledService' },
    { label: 'LogFulfilledOther', value: 'LogFulfilledOther' },
    { label: 'LogFulfilledRedirect', value: 'LogFulfilledRedirect' },
    { label: 'LogApplicationStart', value: 'LogApplicationStart' },
  ];

  constructor() {
  }

  ngOnInit() {
    this.ctasForm.addControl('ctaLmeResponseCode',
      new FormControl(this.ctaValue && this.ctaValue.ctaLmeResponseCode ? this.ctaValue.ctaLmeResponseCode : '',
        [Validators.required]));
    this.ctasForm.addControl('ctaType', new FormControl(this.ctaValue && this.ctaValue.ctaType ? this.ctaValue.ctaType : ''));
    this.ctasForm.addControl('ctaUrl', new FormControl(this.ctaValue && this.ctaValue.ctaUrl ? this.ctaValue.ctaUrl : ''));
    if (this.formControlName === 'Marketing') {
      this.ctaTypes.push({ label: 'Marketing', value: 'Marketing' })
      const ctaValue = { "ctaLmeResponseCode": 'LogClicked', "ctaType": 'Marketing', "ctaUrl": '' }
      // this.ctasForm.patchValue({ "ctaLmeResponseCode": 'LogClicked', "ctaType": "Marketing" });
      this.ctasForm.patchValue(ctaValue);
      this.disableDropdown = true;
      this.hideCtaUrl = true;
      this.writeValue(this.ctasForm.valid ? ctaValue : null);
    } else {
      this.disableDropdown = false;
      this.hideCtaUrl = false;
    }
  }

  ngAfterViewInit() {
    this.ctasForm.valueChanges.pipe().subscribe(value => {
      if (value && value.ctaLmeResponseCode === ctaResponseCodes.LOG_REJECT || value.ctaLmeResponseCode === ctaResponseCodes.LOG_FOLLOW_UP) {
        this.hideCtaType = true;
        this.hideCtaUrl = true;
        for (const field in this.ctasForm.controls) {
          this.ctasForm.controls[field].setErrors(null);
        }
        const ctaValue = { "ctaLmeResponseCode": value.ctaLmeResponseCode, "ctaType": '', "ctaUrl": '' }
        this.onChange(this.ctasForm.valid ? ctaValue : null);
      } else {
        this.hideCtaType = false;
        this.hideCtaUrl = false;
        for (const field in this.ctasForm.controls) {
          const control = this.ctasForm.get(field);
          if (control.value === '') {
            this.ctasForm.controls[field].setErrors({ 'error': true });
          }
        }
        this.onChange(this.ctasForm.valid ? value : null);
      }

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
