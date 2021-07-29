import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {CtaDefinition} from '../offer/offer.service';

enum CtaResponseCodes {
  'LOG_REJECT' = 'LogReject',
  'LOG_FOLLOW_UP' = 'LogFollowUp',
  'LOG_CLICKED' = 'LogClicked'
}

enum CtaType {
  'SSO' = 'sso',
  'MARKETING' = 'Marketing',
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
  @Input() ctaProductId: string;
  @Input() ctaProductType: string;
  onTouched: boolean;
  ctasForm: FormGroup = new FormGroup({});
  ctaLmeResponseCode: FormControl;
  ctaType: FormControl;
  ctaUrl: FormControl;

  showForm = false;
  hideCtaType = false;
  hideCtaUrl = false;
  showSSOError = false;
  ctaTypes = [
    {label: 'Please select a value', value: ''},
    {label: 'Internal', value: 'internal'},
    {label: 'External', value: 'external'},
  ];
  responseCodes = [
    {label: 'Please select a value', value: ''},
    {label: 'LogContact', value: 'LogContact'},
    {label: 'LogAcceptFulfill', value: 'LogAcceptFulfill'},
    {label: 'LogCreateReferral', value: 'LogCreateReferral'},
    {label: 'LogAcceptAppointment', value: 'LogAcceptAppointment'},
    {label: 'LogReject', value: 'LogReject'},
    {label: 'LogFollowUp', value: 'LogFollowUp'},
    {label: 'LogClicked', value: 'LogClicked'},
    {label: 'LogFulfilledSales', value: 'LogFulfilledSales'},
    {label: 'LogFulfilledService', value: 'LogFulfilledService'},
    {label: 'LogFulfilledOther', value: 'LogFulfilledOther'},
    {label: 'LogFulfilledRedirect', value: 'LogFulfilledRedirect'},
    {label: 'LogApplicationStart', value: 'LogApplicationStart'},
  ];

  constructor() {
  }

  ngOnInit() {
    this.ctaLmeResponseCode = new FormControl(this.ctaValue && this.ctaValue.ctaLmeResponseCode ? this.ctaValue.ctaLmeResponseCode : '',
      [Validators.required]);
    this.ctaUrl = new FormControl(this.ctaValue && this.ctaValue.ctaUrl ? this.ctaValue.ctaUrl : '');
    this.ctaType = new FormControl(this.ctaValue && this.ctaValue.ctaType ? this.ctaValue.ctaType : '');
    this.ctasForm.addControl('ctaLmeResponseCode', this.ctaLmeResponseCode);
    this.ctasForm.addControl('ctaType', this.ctaType);
    this.ctasForm.addControl('ctaUrl', this.ctaUrl);

    // Setting the cta type to "SSO" if data-product-id and data-product-type is present and not empty
    if (this.ctaProductId && this.ctaProductType) {
      this.ctaType.setValue(CtaType.SSO);
      this.ctaType.disable();
    }

    // Setting the cta type to "SSO" and showing an error if either of data-product-id and data-product-type is not present
    if (!this.ctaProductId && this.ctaProductType ||
      !this.ctaProductType && this.ctaProductId ||
      this.ctaProductType === '' || this.ctaProductId === '') {
      this.ctaType.setValue(CtaType.SSO);
      this.showSSOError = true;
      this.ctaType.disable();
    }
  }

  ngAfterViewInit() {

    if (this.formControlName === CtaType.MARKETING) {
      this.ctaTypes.push({label: CtaType.MARKETING, value: CtaType.MARKETING});
      const ctaValue = {'ctaLmeResponseCode': CtaResponseCodes.LOG_CLICKED, 'ctaType': CtaType.MARKETING, 'ctaUrl': ''};
      this.ctasForm.setValue(ctaValue);
      this.ctaType.disable();
      this.ctaLmeResponseCode.disable();
      this.hideCtaUrl = true;
      this.ctaUrl.setValidators(null);
      this.onChange(ctaValue);
    } else if (this.ctaType.value === CtaType.SSO) {
      this.ctaTypes.push({label: CtaType.SSO, value: CtaType.SSO});
    } else {
      this.hideCtaUrl = false;
    }

    this.ctasForm.valueChanges.pipe().subscribe(value => {
      if (value && value.ctaLmeResponseCode === CtaResponseCodes.LOG_REJECT ||
        value.ctaLmeResponseCode === CtaResponseCodes.LOG_FOLLOW_UP) {
        this.ctasForm.setErrors(null);
        this.hideCtaType = true;
        this.hideCtaUrl = true;
        const ctaValue = {'ctaLmeResponseCode': value.ctaLmeResponseCode, 'ctaType': '', 'ctaUrl': ''};
        this.onChange(this.ctasForm.valid ? ctaValue : null);
      } else if(this.ctaProductId && this.ctaProductType || this.showSSOError){
        this.hideCtaType = false;
        this.hideCtaUrl = false;
        if(this.showSSOError || (!this.ctaLmeResponseCode.value || !this.ctaUrl.value)){
          this.ctasForm.setErrors({'invalid': true});
        }
        if(!this.ctaLmeResponseCode.value || !this.ctaUrl.value){
          setTimeout(() => this.ctasForm.setErrors({'invalid': true}));
        }
        const ctaValue= {'ctaLmeResponseCode': value.ctaLmeResponseCode, 'ctaType': CtaType.SSO, 'ctaUrl': value.ctaUrl};
        this.onChange(this.ctasForm.valid ? ctaValue : null);
      }else {
        this.hideCtaType = false;
        this.hideCtaUrl = false;
        if (!this.ctaType.value || !this.ctaUrl.value || !this.ctaLmeResponseCode.value) {
          setTimeout(() => this.ctasForm.setErrors({'invalid': true}));
        }
        setTimeout(() => this.onChange(this.ctasForm.valid ? value : null)); 
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
