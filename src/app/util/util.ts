export class Util {

  static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  static hasClass(el: any, className: string) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!(el.nativeElement.getAttribute('class').match(new RegExp('(\\s|^)' + className + '(\\s|$)')));
    }
  };

  static addClass(el: any, className: string): void {
    var classList = className.split(' ');
    if (el.classList) {
      el.classList.add(classList[0]);
    } else if (!this.hasClass(el, classList[0])) {
      el.nativeElement.setAttribute('class', el.nativeElement.getAttribute('class') +  " " + classList[0]);
    }
    if (classList.length > 1) {
      this.addClass(el, classList.slice(1).join(' '));
    }
  };

  static removeClass(el: any, className: string): void {
    var classList = className.split(' ');
    if (el.classList) {
      el.classList.remove(classList[0]);
    } else if(this.hasClass(el, classList[0])) {
      var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
      el.nativeElement.setAttribute('class', el.nativeElement.getAttribute('class').replace(reg, ' '));
    }
    if (classList.length > 1) {
      this.removeClass(el, classList.slice(1).join(' '));
    }
  };

  static toggleClass(el: any, className: string, bool: boolean): void {
    if(bool) this.addClass(el, className);
    else this.removeClass(el, className);
  };

  static setAttributes(el: Element, attrs: string[]): void {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };

  static scrollTo(final: number, duration: number, scrollEl?: any, cb?: Function) {
    let element = scrollEl || window;
    let start = element.scrollTop || document.documentElement.scrollTop;
    let currentTime: number;

    if(!scrollEl) {
      start = window.scrollY || document.documentElement.scrollTop;
    }

    const animateScroll = (timestamp: number): void => {
      if (!currentTime) {
        currentTime = timestamp;
      }
      let progress = timestamp - currentTime;
      if(progress > duration){
        progress = duration;
      }
      let val = this.easeInOutQuad(progress, start, final-start, duration);
      element.scrollTo(0, val);
      if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
      } else {
        cb && cb();
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  static moveFocus(element: HTMLElement): void {
    if( !element ) {
      element = document.getElementsByTagName('body')[0];
    }
    element.focus();
    if (document.activeElement !== element) {
      element.setAttribute('tabindex','-1');
      element.focus();
    }
  };
}
