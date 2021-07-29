import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { adminStyle } from './offer.model';

export interface OfferDefinition {
  id: string;
  extractTag?: string;

  [key: string]: any;
}

export interface CtaDefinition {
  ctaLmeResponseCode: string;
  ctaType: string;
  ctaUrl: string;
}

export interface ConsolidatedOffer {
  cmsData: CmsData;
  offerDefinition: OfferDefinition;
}

export interface CmsData {
  data: string;
}

export interface CtaProductInfo{
  ctaProductId: string;
  ctaProductType: string;
  ctaName?: string;
}

export interface OfferAdminData {
  cmsData: CmsData;
  offerFormControlMetaArray: Array<OfferFormControlMeta>;
  offerCtaFormControlMetaArray: Array<OfferCtaFormControlMeta>;
}

export interface OfferFormControlMeta {
  formControlName: string;
  formControlType?: string;
}

export interface OfferCtaFormControlMeta {
  formControlName: string;
  formControlType: string;
  productId: string;
  productType: string;
  displayName: string;
}

export enum offerContentPath {
  'OFFER-4000' = '/assets/mocks/mp1/en_interstial.html',
  'CREDIT_LIMIT' = '/assets/mocks/mp2/credit-limit_inter_en.html',
  'BAL_TRANSFER' = '/assets/mocks/mp3/balanceTransfer_inter_en.html',
  'INTERSTITIAL' = '/assets/mocks/mp4/interstitial_en.html',
  'MARKETING' = '/assets/mocks/mp5/marketing_en.html',
  'PRE-APPROVED-OFFER' = '/assets/mocks/mp6/pre-approved-offer_en.html',
  'OTHER-OFFER' = '/assets/mocks/mp7/other-offer_en.html',
}

enum offerWrapper {
  'OFFER-4000' = '.main__wrapper',
  'CREDIT_LIMIT' = '.site__wrapper',
  'BAL_TRANSFER' = '.site__wrapper',
  'INTERSTITIAL' = '.site__wrapper',
  'MARKETING' = '.site__wrapper',
  'PRE-APPROVED-OFFER' = '.site__wrapper',
  'OTHER-OFFER' = '.site__wrapper',
}

export const objDiffKey = (o1, o2) => {
  const objDiff = Object.keys(o2).reduce((diff, key) => {
    if (o1[key] === o2[key]) {
      return diff;
    }
    return {
      ...diff,
      [key]: o2[key],
    };
  }, {});
  return Object.keys(objDiff)[0];
};

@Injectable()
export class OfferService {
  offerCtas: NodeListOf<HTMLAnchorElement>;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ) {
  }

  public getInterOfferFromAdmin(id: string): Observable<OfferAdminData> {
    return this.http.request('GET', offerContentPath[id], { responseType: 'text' }).pipe(
      map((html) => {
        let cmsData: CmsData;
        const offerContentHtml = this.convertTextToDom(html);
        const template = offerContentHtml.querySelector(offerWrapper[id]);
        const scripts = Array.from(offerContentHtml.querySelectorAll('script[data-name="bdb"]'));
        const styles = Array.from(offerContentHtml.querySelectorAll('style[data-name="bdb"]'));
        this.offerCtas = offerContentHtml.querySelectorAll('a');
        if (scripts.length > 0) {
          scripts.forEach((script) => template.prepend(script));
        }
        if (styles.length > 0) {
          styles.forEach((style) => template.prepend(style));
        }
        if (offerWrapper[id]) {
          cmsData = { data: template.outerHTML };
        } else {
          cmsData = { data: html };
        }
        return cmsData;
      }),
      switchMap((cmsData) => {
        return this.getFormControlsFromTemplate(cmsData);
      }),
    );
  }

  public getFormControlsFromTemplate(cmsData: CmsData): Observable<OfferAdminData> {
    const offerAdminData = {} as OfferAdminData;
    offerAdminData.cmsData = cmsData;
    const offerFormControlMetaArray: Array<OfferFormControlMeta> = [];
    const ctaFormControlMetaArray: Array<OfferCtaFormControlMeta> = [];
    const fieldMatches: Array<string> = cmsData.data.match(/(?<=\[\[).+?(?=\]\])/g);
    const uniqueFieldMatches: Array<string> = fieldMatches.filter(this.onlyUnique);

    uniqueFieldMatches.map((ctrlName) => {
      const offerFormControlMeta = {} as OfferFormControlMeta;
      offerFormControlMeta.formControlName = ctrlName.split('_')[0];
      offerFormControlMeta.formControlType = ctrlName.split('_')[1] ? ctrlName.split('_')[1] : 'STR';
      offerFormControlMetaArray.push(offerFormControlMeta);
    });

    Array.from(this.offerCtas).map(cta => {
      if(cta.attributes.getNamedItem("data-cta-name") && cta.attributes.getNamedItem("data-cta-name").value){
      const ctaFormControlMeta = {} as OfferCtaFormControlMeta;
      ctaFormControlMeta.formControlName = cta.attributes.getNamedItem("data-cta-name") && (cta.attributes.getNamedItem("data-cta-name").value).replace(/-/g, ' ');
      ctaFormControlMeta.formControlType = 'STR';
      ctaFormControlMeta.displayName = (cta.text).replace(/\s+/g, ' ').trim();
      if (cta.hasAttribute('data-product-id') || cta.hasAttribute('data-product-type')) {
        ctaFormControlMeta.productId = cta.attributes.getNamedItem("data-product-id") && cta.attributes.getNamedItem("data-product-id").value;
        ctaFormControlMeta.productType = cta.attributes.getNamedItem("data-product-type") && cta.attributes.getNamedItem("data-product-type").value;
      }
      ctaFormControlMetaArray.push(ctaFormControlMeta);
    }
    });

    offerAdminData.offerFormControlMetaArray = offerFormControlMetaArray;
    offerAdminData.offerCtaFormControlMetaArray = ctaFormControlMetaArray;
    return of(offerAdminData);
    
  }

  public offerParser(offerHtml, offerDefinition, updatedFieldName?): string {
    let dynamicHtml;
    if (!offerHtml) {
      return offerHtml;
    }
    const fieldMatches: Array<string> = offerHtml.match(/(?<=\[\[).+?(?=\]\])/g);
    fieldMatches.map((toReplace) => {
      const paramDef = toReplace.split('_');
      const paramTag = `[${paramDef[0]}]`;
      const paramName = paramTag.split(/[\[\]]+/)[1];
      // default to string type if type is undefined
      if (paramDef.length === 1) {
        paramDef.push('STR');
      }
      if (updatedFieldName && updatedFieldName === paramName) {
        dynamicHtml = `<span class='highlight'>${this.formatField(offerDefinition[paramDef[0]], paramDef[2])}</span>`;
      } else {
        dynamicHtml = offerDefinition
          ? offerDefinition[paramDef[0]]
            ? offerDefinition[paramDef[0]]
            : paramTag
          : paramTag;
      }
      offerHtml = offerHtml.replace(`[[${toReplace}]]`, dynamicHtml);
    });
    return this.injectAdminStyles(offerHtml);
  }

  public getOffer(id: string): Observable<ConsolidatedOffer> {
    return this.http
      .get<OfferDefinition>(`/assets/mocks/offer-${id}.json`)
      .pipe(switchMap((offer) => this.getOfferContent(offer)));
  }

  public getInterOffer(id: string): Observable<ConsolidatedOffer> {
    return this.http
      .get<OfferDefinition>(`/assets/mocks/${id}.json`)
      .pipe(switchMap((offer) => this.getInterHtmlContent(offer)));
  }

  public convertTextToDom(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div;
  }

  private formatField(value, format): string {
    let formatedValue;
    switch (format) {
      case 'LONG':
        formatedValue = this.datePipe.transform(value, 'MMM dd, yyyy');
        break;
      case 'CUR':
        formatedValue = this.currencyPipe.transform(value, '', 'symbol-narrow', '1.0-0');
        break;
      case 'INT':
        formatedValue = this.decimalPipe.transform(value);
        break;
      case 'DEC':
        formatedValue = this.decimalPipe.transform(value, '0.1-2');
        break;
      case 'TEXT':
      default:
        formatedValue = value;
        break;
    }
    return formatedValue;
  }

  private getInterHtmlContent(offer: OfferDefinition): Observable<ConsolidatedOffer> {
    return this.http.request('GET', offerContentPath[offer.id], { responseType: 'text' }).pipe(
      map((html) => {

        const offerContentHtml = this.convertTextToDom(html);
        const template = offerContentHtml.querySelector(offer.extractTag);
        const styles = Array.from(offerContentHtml.querySelectorAll('style[data-name="bdb"]'));

        if (styles.length > 0) {
          // because current version of typescript does not support prepend
          styles.forEach((style) => template['prepend'](style));
        }

        const cmsData: CmsData = { data: template.outerHTML };
        return {
          cmsData,
          offerDefinition: offer,
        } as ConsolidatedOffer;
      })
    );
  }

  private getOfferContent(offer: OfferDefinition): Observable<ConsolidatedOffer> {
    return this.http.get<CmsData>(`/assets/mocks/mp0/offerCMS-${offer.id}.json`).pipe(
      map((cmsData) => {
        return {
          cmsData,
          offerDefinition: offer,
        } as ConsolidatedOffer;
      })
    );
  }

  private injectAdminStyles(offerHtml): string {
    const tempDom = document.createElement('div');
    tempDom.appendChild(this.convertTextToDom(adminStyle).firstChild);
    tempDom.appendChild(this.convertTextToDom(offerHtml).firstChild);
    // console.log(tempDom);
    return tempDom.innerHTML;
  }

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
