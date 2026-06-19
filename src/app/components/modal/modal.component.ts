import { Component, Input, Output, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() row: any = null;
  @Input() columns: { label: string; key: string }[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() toggleRevisado = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  modoEdicion = false;
  rowEditado: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  activarEdicion() {
    console.log('Click en editar, row actual:', this.row);
    this.rowEditado = { ...this.row };
    this.modoEdicion = true;
    this.cdr.detectChanges();
    console.log('modoEdicion:', this.modoEdicion);
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.rowEditado = null;
    this.cdr.detectChanges();
  }

  guardarCambios() {
    this.guardar.emit(this.rowEditado);
    this.modoEdicion = false;
    this.cdr.detectChanges();
  }
}