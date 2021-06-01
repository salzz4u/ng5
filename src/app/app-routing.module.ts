import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BdbJsonComponent } from './demo/bdb-json/bdb-json.component';
import { BdbHtmlComponent } from './demo/bdb-html/bdb-html.component';
import { AdminComponent } from './demo/admin/admin.component';
import { MobilePreviewComponent } from './demo/mobile-preview/mobile-preview.component';

export const routes: Routes = [
  { path: 'bdb-json', component: BdbJsonComponent },
  { path: 'bdb-html', component: BdbHtmlComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'mobile-preview', component: MobilePreviewComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', redirectTo: '/admin' }, // Wild
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
