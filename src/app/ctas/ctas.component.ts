import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CtaDefinition } from '../offer/offer.service';

enum CtaResponseCodes {
  'LOG_REJECT' = 'LogReject',
  'LOG_FOLLOW_UP' = 'LogFollowUp',
  'LOG_CLICKED' = 'LogClicked'
}

enum CtaType {
  'SSO' = 'sso',
  'MARKETING' = 'Marketing',
  'NEXT' = 'NEXT',
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
  hideCtaUrl = false;
  showSSOError = false;
  ctaTypes = [
    { label: 'Please select a value', value: '' },
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
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
       /* Adding the marketing option to the existing dropdown and setting the ctaType as 'Marketing' and marking the ctaType as readonly.
       CtaUrl is hidden for the marketing scenario */
      this.ctaTypes.push({ label: CtaType.MARKETING, value: CtaType.MARKETING });
      const ctaValue = { 'ctaLmeResponseCode': CtaResponseCodes.LOG_CLICKED, 'ctaType': CtaType.MARKETING, 'ctaUrl': '' };
      this.ctasForm.setValue(ctaValue);
      this.ctaType.disable();
      this.ctaLmeResponseCode.disable();
      this.hideCtaUrl = true;
      this.ctaUrl.setValidators(null);
      this.onChange(ctaValue);
    } /* Adding the SSO option to the existing dropdown if the ctaType is set to SSO on ngOnInit */
    else if (this.ctaType.value === CtaType.SSO) {
      this.ctaTypes.push({ label: CtaType.SSO, value: CtaType.SSO });
    } else {
      this.hideCtaUrl = false;
    }

    this.ctasForm.valueChanges.pipe(debounceTime(0)).subscribe(value => {

      if (value && value.ctaLmeResponseCode === CtaResponseCodes.LOG_REJECT ||
        value.ctaLmeResponseCode === CtaResponseCodes.LOG_FOLLOW_UP) {
        this.handleRejectFollupScenario(value);
      } else if (this.ctaProductId && this.ctaProductType || this.showSSOError) {
        this.handleSsoScenario(value);
      } else {
        this.handleOtherScenarios(value);
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

  handleRejectFollupScenario(value) {
    /* Setting the ctaType as NEXT and marking the ctaType as readonly if the ctaResponseCode is either LogReject or LogFollowUp. 
    ctaUrl is hidden and adding the NEXT option to the dropdown if it doesn't exist */
    this.ctasForm.setErrors(null);
    this.hideCtaUrl = true;
    if (!this.ctaTypes.some(ctaType => ctaType.value === CtaType.NEXT)) {
      this.ctaTypes.push({ label: CtaType.NEXT, value: CtaType.NEXT });
    }
    this.ctaType.setValue(CtaType.NEXT, { emitEvent: false });
    setTimeout(() => this.ctaType.disable());
    const ctaValue = { 'ctaLmeResponseCode': value.ctaLmeResponseCode, 'ctaType': CtaType.NEXT, 'ctaUrl': '' };
    this.onChange(this.ctasForm.valid ? ctaValue : null);
  }

  handleSsoScenario(value) {
    this.ctaType.setValue(CtaType.SSO, { emitEvent: false });
    this.hideCtaUrl = false;
    /* Setting the validity of the form as invalid if there is an error in the template  */
    if (this.showSSOError || (!this.ctaLmeResponseCode.value || !this.ctaUrl.value)) {
      this.ctasForm.setErrors({ 'invalid': true });
    }
    /* Setting the validity of the form as invalid if there is either the responseCode or ctaUrl is empty  */
    if (!this.ctaLmeResponseCode.value || !this.ctaUrl.value) {
      setTimeout(() => this.ctasForm.setErrors({ 'invalid': true }));
    }
    const ctaValue = { 'ctaLmeResponseCode': value.ctaLmeResponseCode, 'ctaType': CtaType.SSO, 'ctaUrl': value.ctaUrl };
    this.onChange(this.ctasForm.valid ? ctaValue : null);
  }

  handleOtherScenarios(value) {
    this.hideCtaUrl = false;
    /* Enabling the dropdown if the user switch from LogRejectFollowUpScenario to other scenarios and setting the ctaType to default  */
    if (this.ctaType.value === CtaType.NEXT) {
      setTimeout(() => this.ctaType.enable());
      this.ctaType.setValue("", { emitEvent: false });
    } else {
      /* Removing the NEXT option from the dropdown if the ctaResponseCode is neither LogReject or LogFollowUp */
      this.ctaTypes = this.ctaTypes.filter(ctaType => ctaType.value != CtaType.NEXT);
    }
    if (!this.ctaType.value || !this.ctaUrl.value || !this.ctaLmeResponseCode.value) {
      setTimeout(() => this.ctasForm.setErrors({ 'invalid': true }));
    }
    setTimeout(() => this.onChange(this.ctasForm.valid ? value : null));
  }


}
