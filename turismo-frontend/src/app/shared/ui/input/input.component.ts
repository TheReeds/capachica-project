import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div>
      @if (label) {
        <label [for]="id" class="form-label">{{ label }}</label>
      }
      
      <input 
        [type]="type" 
        [id]="id" 
        [placeholder]="placeholder" 
        [disabled]="disabled" 
        [value]="value" 
        (input)="onChange($event)" 
        (blur)="onTouched()"
        class="form-input" 
        [ngClass]="{ 
          'border-red-500': error, 
          'bg-gray-100': disabled 
        }"
      />
      
      @if (error) {
        <p class="form-error">{{ error }}</p>
      }
      
      @if (hint && !error) {
        <p class="text-xs text-gray-500 mt-1">{{ hint }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() id = '';
  @Input() placeholder = '';
  @Input() error = '';
  @Input() hint = '';
  
  value = '';
  disabled = false;
  
  onChange: any = () => {};
  onTouched: any = () => {};
  
  writeValue(value: string): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      fn(target.value);
    };
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}