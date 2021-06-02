import {AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {OfferDefinition, OfferService} from '../offer/offer.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisplayComponent implements OnChanges, AfterViewInit {
  @Input() updatedFieldName: string;
  @Input() offerContent: string;
  @Input() offerDefinition: OfferDefinition;
  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  offerParsed: any;

  constructor(public sanitizer: DomSanitizer, private offerService: OfferService) {}

  ngOnChanges() {
    this.offerParsed = this.sanitizer.bypassSecurityTrustHtml(
      this.offerService.offerParser(this.offerContent, this.offerDefinition, this.updatedFieldName)
    );
  }

  ngAfterViewInit() {
    const parentElement = this.contentWrapper.nativeElement;
    const accept: HTMLElement = parentElement.querySelector('.accept');
    // console.log(accept);
    if (accept) {
      accept.addEventListener('click', (e) => this.handleResponse(e, 'accept-inter'));
    }
  }

  handleResponse(e: Event, eventName: string) {
    e.preventDefault();
    console.log(eventName);
  }
}
