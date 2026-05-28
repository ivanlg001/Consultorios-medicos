import { Injectable } from '@angular/core';
import { SheetData } from '../models/excel.models';

@Injectable({ providedIn: 'root' })
export class ExcelStateService {
  data: SheetData | null = null;
}