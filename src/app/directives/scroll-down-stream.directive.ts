import { Directive, ElementRef, HostListener, AfterViewChecked, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import { RoomContentService } from '../services/room-content.service';

@Directive({
  selector: '[appScrollDownStream]'
})
export class ScrollDownStreamDirective implements AfterViewChecked, OnDestroy {
  private ngUnsubscribe: Subject<any>;

  private loadSubscription: Subscription;
  private scrollSubscription: Subscription;
  private disableScrollDown: boolean;
  private offset: number;
  private baseOffset: number;
  private canLoadMore: boolean;
  private lastPosition: number;

  get element(): HTMLElement {
    return this.el.nativeElement;
  }

  @Output() loadMore = new EventEmitter<number>();

  constructor(
    private el: ElementRef,
    private _rcService: RoomContentService
  ) {
    this.ngUnsubscribe = new Subject();
    this.disableScrollDown = false;
    this.baseOffset = 12;
    this.offset = this.baseOffset;
    this.canLoadMore = true;
    this._rcService.threadEmitter
      .takeUntil(this.ngUnsubscribe)
      .subscribe((event: number) => {
        switch (event) {
          case 0:
            this.disableScrollDown = false;
            this.offset = this.baseOffset;
            this.lastPosition = 0;
            break;
          case 1:
            this.canLoadMore = true;
            this.scrollToBottom(this.element);
            this.scrollToSaved(this.element);
            break;
          case 2:
            this.canLoadMore = false;
            break;
        }
      });

    this.scrollSubscription = Observable.fromEvent(this.element, 'scroll')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(event => {
        this.onScroll(this.element);
      });

    this.loadSubscription = Observable.fromEvent(this.element, 'scroll')
      .takeUntil(this.ngUnsubscribe)
      .throttleTime(200)
      .debounceTime(400)
      .subscribe(event => {
        const atTop = this.element.scrollTop < this.element.clientHeight / 2;
        if (atTop) {
          this.onLoad(this.element);
        }
      });
  }

  ngAfterViewChecked() {
    this.scrollToBottom(this.element);
  }

  private onScroll(element: HTMLElement) {
    const atBottom = (element.scrollHeight - element.scrollTop) === element.clientHeight;
    this.disableScrollDown = atBottom ? false : true;
  }

  private onLoad(element: HTMLElement) {
    if (this.canLoadMore) {
      this.lastPosition = element.scrollHeight - element.scrollTop;
      this.loadMore.emit(this.offset);
      this.offset += this.baseOffset;
    }
  }

  private scrollToSaved(element: HTMLElement) {
    if (!this.disableScrollDown) {
      return;
    }
    try {
      // hackerman
      setTimeout(() => {
        this.element.scrollTop = this.element.scrollHeight - this.lastPosition;
      }, 0);
    }
    catch (err) { }
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
