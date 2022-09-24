import { Injectable, ComponentFactoryResolver, Injector, Inject, TemplateRef, Type, ApplicationRef, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Modal } from './modal';

export type Content<T> = string | TemplateRef<T> | Type<T>;

@Injectable({ providedIn: 'root' })
export class ModalService {
  private renderer: Renderer2;

  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private rendererFactory: RendererFactory2,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  open<T>(content: Content<T>) {
    const factory = this.resolver.resolveComponentFactory(Modal);
    const ngContent = this.resolveNgContent(content);
    const componentRef = factory.create(this.injector, ngContent);

    componentRef.hostView.detectChanges();

    const { nativeElement } = componentRef.location;
    this.document.body.appendChild(nativeElement);
    this.renderer.addClass(document.body, 'modal--is-visible');

    window.setTimeout(() => {
      this.renderer.addClass(nativeElement.children[0], 'modal--is-visible');
    }, 0)
  }

  resolveNgContent<T>(content: Content<T | null>) {
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [element];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(null);
      this.applicationRef.attachView(viewRef);
      return [viewRef.rootNodes];
    }

    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);
    return componentRef.location.nativeElement;
  }

}
