import {AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {OfferDefinition, OfferService} from './offer.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfferComponent implements OnChanges, AfterViewInit {
  @Input() updatedFieldName: string;
  @Input() offerContent: string;
  @Input() offerDefinition: OfferDefinition;
  @ViewChild('content') content: ElementRef;

  offerParsed: any;

  constructor(public sanitizer: DomSanitizer, private offerService: OfferService) {}

  ngOnChanges() {
    this.offerParsed = this.sanitizer.bypassSecurityTrustHtml(
      this.offerService.offerParser(this.offerContent, this.offerDefinition, this.updatedFieldName)
    );
  }

  ngAfterViewInit() {
    const parentElement = this.content.nativeElement;
    const accept: HTMLElement = parentElement.querySelector('.accept');
    // console.log(accept);
    if (accept) {
      accept.addEventListener('click', (e) => this.handleResponse(accept, e, 'accept'));
    }

  }

  handleResponse(elem: HTMLElement, e, eventName: string) {
    e.preventDefault();
    console.log('disabled', elem.classList.contains('btnDisable'), eventName);
  }
}
