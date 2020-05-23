import {
  Directive,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  QueryList,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})

/** @description Emits an event every time a click is made from outside its host */
export class ClickOutsideDirective {

  /** @description A list of exceptions that should not emit clickOutside */
  @Input() exceptions: QueryList<HTMLElement> | HTMLElement[];

  /** @description Fires when a click outside was made and it wasn't an exception */
  @Output('clickOutside') readonly clickOutside = new EventEmitter<any>();

  @HostListener('document:click', ['$event'])
  checkTarget(e: MouseEvent | TouchEvent) {

    // If host element or any of its children isn't clicked
    // while there are no exceptions defined, emit clickOutside
    if (!this.exceptions && !this.isHostClicked(e)) {
      this.clickOutside.emit();
    }
    else {

      if (!this.isExceptionClicked(e) && !this.isHostClicked(e)) {
        this.clickOutside.emit();
      }
    }
  }

  constructor(
    private elementRef: ElementRef
  ) {}

  private isHostClicked(e: MouseEvent|TouchEvent): boolean {

    if (this.elementRef.nativeElement === e.target || this.elementRef.nativeElement.contains(e.target)) {
      return true;
    }
  }

  private isExceptionClicked(e: MouseEvent|TouchEvent): boolean {

    return this.exceptions.some((exception) => {

      if (e.target === exception || exception.contains(e.target as HTMLElement)) {
        return true;
      }
    });
  }
}
