import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TimePickerComponent {
  @Input() label: string = 'Seleccionar hora';
  @Input() selectedTime: string = '';
  @Output() selectedTimeChange = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  
  showPicker = false;
  hours = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  selectedHour = 12;
  selectedMinute: number = 0; // o el valor inicial que necesites
  isAM = true;

// Agrega estas nuevas propiedades
  editingTime = false;
  tempTime = '';

// Propiedades básicas
  mode: 'hours' | 'minutes' = 'hours'; // Para controlar el modo de visualización
  
  // Minutos VISIBLES (de 5 en 5)
  visibleMinutes = Array.from({ length: 12 }, (_, i) => i * 5); // [0, 5, 10, ..., 55]
  // Minutos REALES (todos los valores posibles)
  allMinutes = Array.from({ length: 60 }, (_, i) => i); // [0, 1, 2, ..., 59]
  hourAngle: number = 0; // Ángulo para las horas
  minuteAngle: number = 0; // Ángulo para los minutos

  // Manejar clic en un minuto visible (de 5 en 5)
  selectVisibleMinute(minute: number) {
    this.selectedMinute = minute;
    this.minuteAngle = (minute / 60) * 360;
  }

// Método unificado para posición de minutos (opcional)
  private getMinutePosition(index: number): { top: string, left: string } {
  // Ajustamos el índice para que 0 esté en la posición superior
  const minuteValue = this.visibleMinutes[index];
  const angle = ((minuteValue / 60) * 2 * Math.PI) - (Math.PI / 2); // Ajuste para empezar arriba
  const radius = 120; // Radio aumentado para mejor distribución
  return {
    top: `calc(50% + ${radius * Math.sin(angle)}px)`,
    left: `calc(50% + ${radius * Math.cos(angle)}px)`
  };
}
  
// Método para iniciar la edición
  startEditing() {
    this.tempTime = `${this.selectedHour.toString().padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')}`;
    this.editingTime = true;
  }
// Método para confirmar la edición
  confirmEdit() {
    const [hours, minutes] = this.tempTime.split(':');
    this.selectedHour = parseInt(hours) % 12 || 12;
    this.selectedMinute = parseInt(minutes) % 60;
    this.editingTime = false;
    this.updateHourHand();
  }

  // Método para cancelar la edición
  cancelEdit() {
    this.editingTime = false;
  }

  togglePicker() {
    this.showPicker = !this.showPicker;
    if (this.selectedTime) {
      this.parseTime(this.selectedTime);
    }
  }

  parseTime(time: string) {
    if (!time) return;
    
    try {
      const [timePart, period] = time.split(' ');
      const [hours] = timePart.split(':');
      this.selectedHour = parseInt(hours) % 12 || 12;
      this.isAM = period?.toUpperCase() === 'AM';
      this.updateHourHand();
    } catch (e) {
      console.error('Error parsing time:', e);
      this.selectedHour = 12;
      this.isAM = true;
      this.updateHourHand();
    }
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
    this.updateHourHand();
  }
  // Método para mover la manecilla
  selectMinute(minute: number) {
  this.selectedMinute = minute;
  // Actualiza el ángulo de la manecilla (0° en la parte superior, sentido horario)
  this.minuteAngle = (minute / 60) * 360;
  console.log(`Minuto seleccionado: ${minute}, Ángulo: ${this.minuteAngle}°`); // Para debug
}
  setAmPm(isAM: boolean) {
    this.isAM = isAM;
  }

  updateHourHand() {
    this.hourAngle = (this.selectedHour % 12) * 30;
  }

  confirmSelection() {
  const formattedHour = this.selectedHour.toString().padStart(2, '0');
  const formattedMinute = this.selectedMinute.toString().padStart(2, '0');
  this.selectedTime = `${formattedHour}:${formattedMinute} ${this.isAM ? 'AM' : 'PM'}`;
  this.selectedTimeChange.emit(this.selectedTime);
  this.showPicker = false;
}

  // Métodos de posicionamiento corregidos
getHourPosition(index: number): { top: string, left: string } {
  // Ajustamos el índice para que 12 esté en la posición superior
  const adjustedIndex = (index + 3) % 12; // Esto rota el círculo para que 12 quede arriba
  const angle = (adjustedIndex / 12) * 2 * Math.PI;
  const radius = 120; // Aumentamos el radio para mejor distribución
  return {
    top: `calc(50% - ${radius * Math.sin(angle)}px)`,
    left: `calc(50% + ${radius * Math.cos(angle)}px)`
  };
}

// Métodos actualizados para las coordenadas individuales
getHourTopPosition(index: number): string {
  return this.getHourPosition(index).top;
}

getHourLeftPosition(index: number): string {
  return this.getHourPosition(index).left;
}

getMinuteTopPosition(index: number): string {
  return this.getMinutePosition(index).top;
}

getMinuteLeftPosition(index: number): string {
  return this.getMinutePosition(index).left;
}
  cancelSelection() {
    // Lógica para cancelar la selección (ej: cerrar el picker, resetear valores)
    console.log("Se canceló la selección");
  }

  getMinuteMarkLeft(minute: number): string {
  // Ejemplo: Calcula la posición en porcentaje (0% - 100%)
  const position = (minute / 60) * 100;
  return `${position}%`;
  }
  getMinuteMarkTop(minute: number): string {
  // Ejemplo: Cálculo para un reloj circular (ajusta según tu diseño)
  const radius = 100; // Radio del círculo (puede ser en px, %, etc.)
  const angle = (minute / 60) * 2 * Math.PI; // Convierte minutos a radianes
  const y = radius * Math.sin(angle); // Posición vertical
  return `${y}px`; // Devuelve el valor en píxeles (o % si prefieres)
 }
// Manejo del click fuera del time-picker (backdrop)
onBackdropClick(event: MouseEvent) {
  event.stopPropagation();
  // Lógica para cerrar el time-picker o cancelar selección
}
// Agrega este nuevo método para manejar clics en el reloj:
handleClockClick(event: MouseEvent) {
  const clock = event.currentTarget as HTMLElement;
  const rect = clock.getBoundingClientRect();
  const center = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  
  const clickPos = {
    x: event.clientX - center.x,
    y: event.clientY - center.y
  };

  // Calcular ángulo (0° arriba, sentido horario)
  let angle = Math.atan2(clickPos.y, clickPos.x);
  angle = (angle + Math.PI/2 + 2*Math.PI) % (2*Math.PI);
  
  // Convertir a minuto (0-59)
  const minute = Math.round((angle / (2*Math.PI)) * 60) % 60;
  this.selectMinute(minute);
  event.stopPropagation();
}

}