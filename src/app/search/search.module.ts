import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { GalleryModule } from '../gallery/gallery.module';
import { DirectivesModule } from '../directives/directives.module';
import { BackToTopModule } from '../library/back-to-top/back-to-top.module';
import { ModalModule } from '../library/modal/modal.module';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    GalleryModule,
    DirectivesModule,
    BackToTopModule,
    ModalModule
  ]
})
export class SearchModule { }
