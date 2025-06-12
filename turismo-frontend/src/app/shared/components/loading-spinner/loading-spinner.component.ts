import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClass">
      <div class="relative">
        <!-- Spinner principal -->
        <div
          class="animate-spin rounded-full border-4 border-gray-200"
          [class]="spinnerClass"
          [style.border-top-color]="color">
        </div>

        <!-- Spinner interno (opcional) -->
        <div
          *ngIf="showInner"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-100"
          [style.width.px]="size * 0.6"
          [style.height.px]="size * 0.6"
          [style.border-top-color]="color"
          style="animation-direction: reverse; animation-duration: 0.8s;">
        </div>
      </div>

      <!-- Texto de carga -->
      <div *ngIf="text" class="ml-3">
        <p class="text-sm font-medium" [style.color]="color">{{ text }}</p>
        <p *ngIf="subtext" class="text-xs text-gray-500">{{ subtext }}</p>
      </div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() size = 32
  @Input() color = "#3B82F6"
  @Input() text?: string
  @Input() subtext?: string
  @Input() showInner = false
  @Input() containerClass = "p-4"

  get spinnerClass(): string {
    return `w-${this.size} h-${this.size}`
  }
}
