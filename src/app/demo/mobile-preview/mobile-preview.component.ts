import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DisplayComponent } from '../../display/display.component';
import { OfferDefinition, OfferService } from '../../offer/offer.service';

@Component({
  selector: 'app-mobile-preview',
  templateUrl: './mobile-preview.component.html',
  styleUrls: ['./mobile-preview.component.scss'],
})
export class MobilePreviewComponent implements AfterViewInit {
  @ViewChild('iframe') iframe: ElementRef;
  url = 'https://kasparasanusauskas.github.io/stackoverflow-demos/demo-app-responsive/index.html';
  offerInterContent: string;
  offerInterDefinition: OfferDefinition;
  doc;
  compRef: ComponentRef<DisplayComponent>;

  constructor(
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private offerService: OfferService
  ) {
    offerService.getInterOffer('BAL_TRANSFER').subscribe(
      (response) => {
        this.offerInterContent = response.cmsData.data;
        this.offerInterDefinition = response.offerDefinition;
        this.createComponent();
      },
      (error) => {
        console.log('navigate to account page or silent fail');
      }
    );
    this.setIt();

  }

  ngAfterViewInit() {

  }

  createComponent() {
    const compFactory = this.resolver.resolveComponentFactory(DisplayComponent);
    this.compRef = this.vcRef.createComponent(compFactory);
    this.compRef.location.nativeElement.id = 'innerComp';
    (this.compRef.instance as DisplayComponent).offerContent = this.offerInterContent;
    (this.compRef.instance as DisplayComponent).offerDefinition = this.offerInterDefinition;
    (this.compRef.instance as DisplayComponent).ngOnChanges();
    this.doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
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

    const emulators = document.querySelectorAll('.emulator__item');

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
