import { Directive, ElementRef, HostListener, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appScrollDownStream]'
})
export class ScrollDownStreamDirective implements AfterViewChecked {
  private disableScrollDown: boolean;

  constructor(
    private el: ElementRef
  ) {
    this.disableScrollDown = false;
    setTimeout(() => {
      this.scrollToBottom(this.el.nativeElement);
    }, 100);
  }

  ngAfterViewChecked() {
    this.scrollToBottom(this.el.nativeElement);
  }

  @HostListener('scroll')
  private onScroll() {
    const element = this.el.nativeElement;
    const atBottom = (element.scrollHeight - element.scrollTop) === element.clientHeight;
    this.disableScrollDown = atBottom ? false : true;
  }

  private scrollToBottom(element: HTMLElement) {
    if (this.disableScrollDown) {
      return;
    }
    try {
      element.scrollTop = element.scrollHeight;
    }
    catch (err) { }
  }

}
