import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'lib-back-to-top',
  templateUrl: './back-to-top.html',
  styleUrls: ['./back-to-top.scss']
})
export class BackToTop implements OnInit, AfterViewInit {
  @ViewChild('backTop') backTop: ElementRef;

  dataElement: string;
  scrollElement: Element | Window | null;
  scrollDuration: number;
  scrollOffsetInit: number;
  scrollOffsetOutInit: number;
  scrollOffset: number = 0;
  scrollOffsetOut: number = 0;
  scrolling: boolean = false;
  targetIn: Element;
  targetOut: Element;

  constructor() { }

  ngOnInit(): void {
  }

  checkBackToTop(): void {

    this.updateOffsets();

    let windowTop;
    if (this.scrollElement instanceof Element) {
      windowTop = this.scrollElement.scrollTop
    } else {
      windowTop = document.documentElement.scrollTop;
    }
    if(!this.dataElement) {
      windowTop = window.scrollY || document.documentElement.scrollTop;
    }
    let condition =  windowTop >= this.scrollOffset;
    if(this.scrollOffsetOut > 0) {
      condition = (windowTop >= this.scrollOffset) && (window.innerHeight + windowTop < this.scrollOffsetOut);
    }
    Util.toggleClass(this.backTop, 'back-to-top--is-visible', condition);
    this.scrolling = false;
  }

  updateOffsets(): void {
    this.scrollOffset = this.getOffset(this.targetIn, this.scrollOffsetInit, true);
    this.scrollOffsetOut = this.getOffset(this.targetOut, this.scrollOffsetOutInit);
  }

  getOffset(target: Element, startOffset: number, bool?: boolean): number {
    let offset = 0;
    let windowTop;
    if(target) {
      if (this.scrollElement instanceof Element) {
        windowTop = this.scrollElement.scrollTop;
      } else {
        windowTop = document.documentElement.scrollTop;
      }
      if(!this.dataElement) {
        windowTop = window.scrollY || document.documentElement.scrollTop;
      }
      var boundingClientRect = target.getBoundingClientRect();
      offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
      offset = offset + windowTop;
    }
    if(startOffset) {
      offset = offset + startOffset;
    }
    return offset;
  }

  addScrollListener(): void {
    if (this.scrollOffset > 0 || this.scrollOffsetOut > 0) {
      if (this.scrollElement) {
        this.scrollElement.addEventListener('scroll', () => {
          if(!this.scrolling) {
            this.scrolling = true;
            this.checkBackToTop();
          }
        });
      }
    }
  }

  ngAfterViewInit(): void {

    this.dataElement = this.backTop.nativeElement.getAttribute('data-element');
    this.scrollElement = this.dataElement ? document.querySelector(this.dataElement) : window;
    this.scrollDuration = parseInt(this.backTop.nativeElement.getAttribute('data-duration')) || 300;
    this.scrollOffsetInit = parseInt(this.backTop.nativeElement.getAttribute('data-offset-in')) || parseInt(this.backTop.nativeElement.getAttribute('data-offset')) || 0;
    this.scrollOffsetOutInit = parseInt(this.backTop.nativeElement.getAttribute('data-offset-out')) || 0;

    this.targetIn = this.backTop.nativeElement.getAttribute('data-target-in') ? document.querySelector(this.backTop.nativeElement.getAttribute('data-target-in')) : false;
    this.targetOut = this.backTop.nativeElement.getAttribute('data-target-out') ? document.querySelector(this.backTop.nativeElement.getAttribute('data-target-out')) : false;

    this.updateOffsets();

    this.backTop.nativeElement.addEventListener('click', (event: Event) => {
      event.preventDefault();
      if(!window.requestAnimationFrame) {
        if (this.scrollElement) {
          this.scrollElement.scrollTo(0, 0);
        }
      } else {
        this.dataElement ? Util.scrollTo(0, this.scrollDuration, this.scrollElement) : Util.scrollTo(0, this.scrollDuration);
      }
      if (this.backTop.nativeElement.length) {
      const focusElement = document.getElementById(this.backTop.nativeElement.getAttribute('href').replace('#', ''));
        if (focusElement) {
          Util.moveFocus(focusElement);
        }
      }
    });

    this.checkBackToTop();
    this.addScrollListener();
  }

}
