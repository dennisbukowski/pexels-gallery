import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DownloadService } from '../services/download.service';
import { ModalService } from '../library/modal/modal.service';
import { PexelData } from '../models/pexel-data';
import { PexelPhoto } from '../models/pexel-photo';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @Input() pexelColumns: PexelPhoto[][];

  constructor(
    private downloadService: DownloadService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  open(template: TemplateRef<any>) {
    this.modalService.open(template);
  }

  handleImageDownload(imageSrcUrl: string, imageNameUrl: string): void {
    const splitImageName = this.downloadService.handlePhotoNameFormat(imageNameUrl);
    this.downloadService.downloadImage(imageSrcUrl, splitImageName);
  }

}
