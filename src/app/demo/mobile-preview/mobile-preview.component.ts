import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {OfferDefinition, OfferService} from '../../offer/offer.service';
import {OfferComponent} from '../../offer/offer.component';

@Component({
  selector: 'app-mobile-preview',
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss'],
})
export class MobilePreviewComponent implements AfterViewInit, OnChanges {
  @ViewChild('iframe') iframe: ElementRef;
  @Input() updatedFieldName: string;
  @Input() offerContent: string;
  @Input() offerDefinition: OfferDefinition;
  doc;
  compRef: ComponentRef<OfferComponent>;

  constructor(
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private offerService: OfferService
  ) {
    this.setIt();

  }

  ngOnChanges(changes: SimpleChanges) {
    this.createComponent();
  }

  ngAfterViewInit() {

  }

  createComponent() {
    const compFactory = this.resolver.resolveComponentFactory(OfferComponent);
    this.compRef = this.vcRef.createComponent(compFactory);
    this.compRef.location.nativeElement.id = 'innerComp';
    (this.compRef.instance as OfferComponent).offerContent = this.offerContent;
    (this.compRef.instance as OfferComponent).offerDefinition = this.offerDefinition;
    (this.compRef.instance as OfferComponent).updatedFieldName = this.updatedFieldName;
    (this.compRef.instance as OfferComponent).ngOnChanges();
    this.doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    this.doc.body.innerHTML = '';
    this.doc.body.appendChild(this.compRef.location.nativeElement);
  }

  setIt() {
    // A typical mobile device will report it's width as 320px - 400px. On the screen of a typical computer,
    // an emulated device of this width will look far too big compared to the real, physical device.
    // So we scale all the devices a little bit. Scaling keeps same "width" and "height"
    // so the media queries still work inside the iframes, but they're displayed as smaller.

    const scaleModifier = 0.75;
    // A list of devices that we need + a default device. The devicePixelRatio for each device must be looked up on the webs...
    const devices = {
      iphone7Plus: {
        resX: 1080,
        resY: 1920,
        devicePixelRatio: 3,
      },
      iphone4: {
        resX: 640,
        resY: 980,
        devicePixelRatio: 2,
      },
      defaultDevice: {
        resX: 640,
        resY: 980,
        devicePixelRatio: 2,
      },
    };

    const emulators = Array.from(document.querySelectorAll('.emulator__item'));

    emulators.forEach((em: HTMLElement) => {
      const emulatorDevice = em.getAttribute('device');
      if (emulatorDevice in devices) {
        // If a key with the same device name exists in our devices object...
        em.setAttribute('width', String(devices[emulatorDevice].resX / devices[emulatorDevice].devicePixelRatio));
        em.setAttribute('height', String(devices[emulatorDevice].resY / devices[emulatorDevice].devicePixelRatio));
      } else {
        // else we use a defaultDevice
        em.setAttribute('width', String(devices.defaultDevice.resX / devices[emulatorDevice].devicePixelRatio));
        em.setAttribute('height', String(devices.defaultDevice.resY / devices[emulatorDevice].devicePixelRatio));
      }
      // Apply our scale modifier to make the emulators reasonably sized
      em.style.transform = 'scale(' + scaleModifier + ')';
    });
  }
}
