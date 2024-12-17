import { Directive, forwardRef, Attribute, ElementRef, HostListener } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { edesignConstants } from 'src/modules/shared/models/edesign.constants';
@Directive({
    selector: '[validateText][formControlName],[validateText][formControl],[validateText][ngModel],[appTwoDigitDecimaNumber]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => CheckFirstInputvalueValidator), multi: true }
    ]
})
export class CheckFirstInputvalueValidator implements Validator {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,4}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(@Attribute('validateText') public validateEqual: string, private el: ElementRef) {

   }
   @HostListener('keydown', ['$event'])
  validate(c: AbstractControl): { [key: number]: any } {
    let specialCharacters = [];
    specialCharacters = edesignConstants.SpecialCharacters;
    let index = specialCharacters.indexOf(c.value);
    if (index != -1) {
      c.setValue("");
      return c;
    }}

  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}