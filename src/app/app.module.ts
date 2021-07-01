import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OfferModule } from './offer/offer.module';
import { OfferAdminComponent } from './offer-admin/offer-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BdbJsonComponent } from './demo/bdb-json/bdb-json.component';
import { BdbHtmlComponent } from './demo/bdb-html/bdb-html.component';
import {MobilePreviewComponent} from './demo/mobile-preview/mobile-preview.component';
import { AdminComponent } from './demo/admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {StylerComponent} from './demo/styler/styler.component';
import {OfferComponent} from './offer/offer.component';
import {CtasComponent} from './ctas/ctas.component';

@NgModule({
  declarations: [
    AppComponent,
    OfferAdminComponent,
    BdbJsonComponent,
    BdbHtmlComponent,
    AdminComponent,
    HeaderComponent,
    MobilePreviewComponent,
    StylerComponent,
    CtasComponent,
  ],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule, OfferModule],
  providers: [DatePipe, CurrencyPipe, DecimalPipe],
  entryComponents: [OfferComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
