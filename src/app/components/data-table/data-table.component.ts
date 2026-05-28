import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  @Input() title = '';
  @Input() iconColor: 'purple' | 'teal' = 'purple';
  @Input() rows: any[] = [];
  @Input() columns: { label: string; key: string }[] = [];
  @Input() sheetName = '';
  @Input() availableHeaders: string[] = [];
  @Output() rowClick = new EventEmitter<any>();
}
