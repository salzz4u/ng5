import { Component } from '@angular/core';
import { OfferDefinition, OfferService } from './offer/offer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'POC: get offer and content';
  offerContent: string;
  offerInterContent: string;
  offerDefinition: OfferDefinition;
  offerInterDefinition: OfferDefinition;

  constructor(private offerService: OfferService) {
    offerService.getOffer('2345').subscribe(
      (response) => {
        this.offerContent = response.cmsData.data;
        this.offerDefinition = response.offerDefinition;
      },
      (error) => {
        console.log('navigate to account page or silent fail');
      }
    );

    offerService.getInterOffer('OFFER-4000').subscribe(
      (response) => {
        this.offerInterContent = response.cmsData.data;
        this.offerInterDefinition = response.offerDefinition;
      },
      (error) => {
        console.log('navigate to account page or silent fail');
      }
    );

    // offerService.getHtmlContent('.main__wrapper').subscribe(data => this.offerInterContent = data)
  }
}
