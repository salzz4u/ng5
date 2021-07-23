import {Component} from '@angular/core';
import {OfferDefinition, OfferService} from '../../offer/offer.service';

@Component({
  selector: 'app-bdb-html',
  templateUrl: './bdb-html.component.html',
  styleUrls: ['./bdb-html.component.scss'],
})
export class BdbHtmlComponent {
  offerInterContent: string;
  offerInterDefinition: OfferDefinition;

  constructor(private offerService: OfferService) {
    offerService.getInterOffer('BAL_TRANSFER').subscribe(
      (response) => {
        this.offerInterContent = response.cmsData.data;
        this.offerInterDefinition = response.offerDefinition;
      },
      (error) => {
        console.log('navigate to account page or silent fail');
      }
    );
  }
}
