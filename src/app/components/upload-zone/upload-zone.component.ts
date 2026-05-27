import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-zone.component.html',
  styleUrl: './upload-zone.component.css'
})
export class UploadZoneComponent {
  @Output() fileSelected = new EventEmitter<File>();

  fileName = '';
  isDragging = false;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.emitFile(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.emitFile(file);
  }

  private emitFile(file: File) {
    if (!file.name.match(/\.(xlsx|xls)$/i)) return;
    this.fileName = file.name;
    this.fileSelected.emit(file);
  }
}
