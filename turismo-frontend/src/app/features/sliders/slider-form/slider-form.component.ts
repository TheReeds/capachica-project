import { Component } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './slider-form.component.html',
  styleUrls: ['./slider-form.component.css']
})
export class CrudComponent {
  imagenPreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
