import { Component } from '@angular/core';
import { OfferDefinition, OfferService } from '../../offer/offer.service';

@Component({
  selector: 'app-bdb-json',
  templateUrl: './bdb-json.component.html',
  styleUrls: ['./bdb-json.component.scss'],
})
export class BdbJsonComponent {
  offerContent: string;

  offerDefinition: OfferDefinition;

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
  }
}
