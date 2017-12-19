import { Directive, ElementRef, AfterViewChecked, HostListener } from '@angular/core';

@Directive({
  selector: '[appShareChatVh]'
})
export class ShareChatVhDirective implements AfterViewChecked {
  private streamClass: string;
  private chatClass: string;

  get baseHeight(): number {
    return window.innerHeight - 165;
  }

  constructor(
    private el: ElementRef
  ) {
    this.streamClass = 'stream';
    this.chatClass = 'creation-area';
  }

  @HostListener('window:resize')
  onResize() {
    this.shareHeight(this.el.nativeElement);
  }

  shareHeight(parent: HTMLElement) {
    if (!parent) return;
    const stream: HTMLElement = <HTMLElement>parent.getElementsByClassName(this.streamClass)[0];
    const chat: HTMLElement = <HTMLElement>parent.getElementsByClassName(this.chatClass)[0];
    if (!stream || !chat) return;

    const maxHeight: number = this.baseHeight - chat.getBoundingClientRect().height;
    stream.style.height = `${maxHeight}px`;
  }

  ngAfterViewChecked() {
    this.shareHeight(this.el.nativeElement);
  }
}
