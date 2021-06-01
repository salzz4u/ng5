import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';

export interface OfferDefinition {
  id: string;
  extractTag?: string;

  [key: string]: any;
}

export interface ConsolidatedOffer {
  cmsData: CmsData;
  offerDefinition: OfferDefinition;
}

export interface CmsData {
  data: string;
}

export interface OfferAdminData {
  cmsData: CmsData;
  offerFormControlMetaArray: Array<OfferFormControlMeta>;
}

export interface OfferFormControlMeta {
  formControlName: string;
  formControlType: string;
}

export enum offerContentPath {
  'OFFER-4000' = '/assets/mocks/mp1/en_interstial.html',
  'CREDIT_LIMIT' = '/assets/mocks/mp2/credit-limit_inter_en.html',
  'BAL_TRANSFER' = '/assets/mocks/mp3/balanceTransfer_inter_en.html',
}

enum offerWrapper {
  'OFFER-4000' = '.main__wrapper',
  'CREDIT_LIMIT' = '.site__wrapper',
  'BAL_TRANSFER' = '.site__wrapper',
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
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ) {}

  /*  public getOfferFromAdmin(id: string): Observable<OfferAdminData> {
    return this.http.get<CmsData>(offerContentPath[id]).pipe(
      switchMap((cmsData) => {
        return this.getFormControlsFromTemplate(cmsData);
      })
    );
  }*/

  public getInterOfferFromAdmin(id: string): Observable<OfferAdminData> {
    return this.http.request('GET', offerContentPath[id], { responseType: 'text' }).pipe(
      map((html) => {
        let cmsData: CmsData;
        const offerContentHtml = this.convertTextToDom(html);
        const template = offerContentHtml.querySelector(offerWrapper[id]);
        const scripts = Array.from(offerContentHtml.querySelectorAll('script[data-name="bdb"]'));
        const styles = Array.from(offerContentHtml.querySelectorAll('style[data-name="bdb"]'));
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
      })
    );
  }

  public getFormControlsFromTemplate(cmsData: CmsData): Observable<OfferAdminData> {
    const offerAdminData = {} as OfferAdminData;
    offerAdminData.cmsData = cmsData;
    const offerFormControlMetaArray: Array<OfferFormControlMeta> = [];
    const matches: Array<string> = cmsData.data.match(/(?<=\[\[).+?(?=\]\])/g);
    const uniqueMatches: Array<string> = matches.filter(this.onlyUnique);

    uniqueMatches.map((ctrlName) => {
      const offerFormControlMeta = {} as OfferFormControlMeta;
      offerFormControlMeta.formControlName = ctrlName.split('_')[0];
      offerFormControlMeta.formControlType = ctrlName.split('_')[1] ? ctrlName.split('_')[1] : 'STR';
      offerFormControlMetaArray.push(offerFormControlMeta);
    });
    offerAdminData.offerFormControlMetaArray = offerFormControlMetaArray;
    return of(offerAdminData);
  }

  public offerParser(offerHtml, offerDefinition, updatedFieldName?): string {
    let dynamicHtml;
    if (!offerHtml) {
      return offerHtml;
    }
    const matches: Array<string> = offerHtml.match(/(?<=\[\[).+?(?=\]\])/g);
    matches.map((toReplace) => {
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
    return offerHtml;
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
    // Change this to div.childNodes to support multiple top-level nodes
    return div;
  }

  private formatField(value, format): string {
    let formatedValue;
    switch (format) {
      case 'LONG':
        formatedValue = this.datePipe.transform(value, 'dd, MMM yyyy');
        break;
      case 'CUR':
        formatedValue = this.currencyPipe.transform(value);
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
        const cmsData: CmsData = { data: offerContentHtml.querySelector(offer.extractTag).outerHTML };
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

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
