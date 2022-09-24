import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ModalModule } from '../library/modal/modal.module';
import { BackToTopModule } from '../library/back-to-top/back-to-top.module';
import { GalleryModule } from '../gallery/gallery.module';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    DirectivesModule,
    ModalModule,
    BackToTopModule,
    GalleryModule
  ],
})
export class HomeModule {}
