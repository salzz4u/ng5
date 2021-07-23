import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OfferComponent} from './offer.component';
import {OfferService} from './offer.service';

@NgModule({
  declarations: [OfferComponent],
  exports: [OfferComponent],
  imports: [CommonModule],
  providers: [OfferService],
})
export class OfferModule {
}
