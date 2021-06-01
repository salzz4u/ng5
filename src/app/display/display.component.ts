import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { OfferDefinition, OfferService } from '../offer/offer.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
})
export class DisplayComponent implements OnChanges, AfterViewInit {
  content: any;
  @Input() offerContent: string;
  @Input() offerDefinition: OfferDefinition;
  @ViewChild('contentWrapper') contentWrapper: ElementRef;
  offerParsed: any;

  constructor(public sanitizer: DomSanitizer, private offerService: OfferService) {}

  ngOnChanges() {
    this.offerParsed = this.sanitizer.bypassSecurityTrustHtml(
      this.offerService.offerParser(this.offerContent, this.offerDefinition)
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
