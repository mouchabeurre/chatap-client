import { Directive, ElementRef, AfterViewChecked, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appFullHeight]'
})
export class FullHeightDirective implements AfterViewChecked {
  @Input('appFullHeight') offset: number;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('window:resize')
  onResize() {
    this.setHeight(this.el.nativeElement);
  }

  setHeight(parent: HTMLElement) {
    const maxHeight: number = window.innerHeight - this.offset;
    parent.style.height = `${maxHeight}px`;
  }

  ngAfterViewChecked() {
    this.setHeight(this.el.nativeElement);
  }

}
