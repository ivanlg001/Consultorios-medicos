import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() row: any = null;
  @Input() columns: { label: string; key: string }[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() toggleRevisado = new EventEmitter<void>();
}