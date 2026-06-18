import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { SheetData, PersonalOperativo, PersonaProcesada, Catalogo } from '../models/excel.models';
import { CATALOGO_ESPECIALIDADES } from '../data/catalogos.data';

@Injectable({ providedIn: 'root' })
export class ExcelReaderService {

  readFile(file: File): Promise<SheetData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target!.result, { type: 'array' });
          resolve(this.extractData(wb));
        } catch {
          reject(new Error('No se pudo leer el archivo. Verifica que sea un Excel válido.'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  private extractData(wb: XLSX.WorkBook): SheetData {
    const allSheets = wb.SheetNames;
    const rawHeaders: { [sheet: string]: string[] } = {};
    allSheets.forEach(s => (rawHeaders[s] = this.getHeaders(wb, s)));

    // Hoja: PERSONAL OPERATIVO → todas las columnas
    const poSheetName = allSheets.find(s => s.toLowerCase().includes('personal operativo')) ?? '';
    const poRows = this.sheetToRows(wb, poSheetName);
    const poHeaders = Object.keys(poRows[0] ?? {});

    const col = (candidates: string[]) => this.findColumnKey(poHeaders, candidates) ?? '';

    const colExact = (candidates: string[]) => {
    const normalize = (s: string) =>
      s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      for (const header of poHeaders) {
          const norm = normalize(header?.toString() ?? '');
          if (candidates.some(c => normalize(c) === norm)) return header;
      }
    
      return '';
    };

    const keys = {
      entidadFederativa:   col(['entidad federativa', 'entidad']),
      cvePresupuestal:     col(['cve_presupuestal', 'cve presupuestal', 'presupuestal']),
      clues:               col(['clues']),
      nombreUnidadMedica:  col(['nombre unidad', 'unidad medica', 'unidad médica']),
      especialidad:        col(['especialidad']),
      nombreConsultorio:   col(['nombre consultorio', 'consultorio']),
      turno:               col(['turno']),
      claveEmpleado:       col(['clave empleado', 'clave_empleado']),
      nombre:              colExact(['NOMBRE', 'nombre']),
      apellidoPaterno:     col(['apelido paterno', 'apellido paterno', 'paterno']),
      apellidoMaterno:     col(['apellido materno', 'materno']),
      titular:             col(['titular']),
      horaInicioAtencion:  col(['hora_inicio_atencion', 'hora inicio atencion']),
      horaFinAtencion:     col(['hora_fin_atencion', 'hora fin atencion']),
      horaInicioCita:      col(['hora_inicio_cita', 'hora inicio cita']),
      horaFinCita:         col(['hora_fin_cita', 'hora fin cita']),
      intervaloConsulta:   col(['intervalo']),
      ocasionServicio:     col(['ocasion_servicio', 'ocasion servicio']),
      lunes:               col(['lunes']),
      martes:              col(['martes']),
      miercoles:           col(['miercoles', 'miércoles']),
      jueves:              col(['jueves']),
      viernes:             col(['viernes']),
      sabado:              col(['sabado', 'sábado']),
      domingo:             col(['domingo']),
    };

    const personalOperativo: PersonalOperativo[] = poRows
      .filter(r => keys.nombre && r[keys.nombre])
      .map(r => ({
        entidadFederativa:   r[keys.entidadFederativa]  || '',
        cvePresupuestal:     r[keys.cvePresupuestal]    || '',
        clues:               r[keys.clues]              || '',
        nombreUnidadMedica:  r[keys.nombreUnidadMedica] || '',
        especialidad:        r[keys.especialidad]       || '',
        nombreConsultorio:   r[keys.nombreConsultorio]  || '',
        turno:               r[keys.turno]              || '',
        claveEmpleado:       r[keys.claveEmpleado]      || '',
        nombre:              r[keys.nombre]             || '',
        apellidoPaterno:     r[keys.apellidoPaterno]    || '',
        apellidoMaterno:     r[keys.apellidoMaterno]    || '',
        titular:             r[keys.titular]            || '',
        horaInicioAtencion:  r[keys.horaInicioAtencion] || '',
        horaFinAtencion:     r[keys.horaFinAtencion]    || '',
        horaInicioCita:      r[keys.horaInicioCita]     || '',
        horaFinCita:         r[keys.horaFinCita]        || '',
        intervaloConsulta:   r[keys.intervaloConsulta]  || '',
        ocasionServicio:     r[keys.ocasionServicio]    || '',
        lunes:               r[keys.lunes]              || '',
        martes:              r[keys.martes]             || '',
        miercoles:           r[keys.miercoles]          || '',
        jueves:              r[keys.jueves]             || '',
        viernes:             r[keys.viernes]            || '',
        sabado:              r[keys.sabado]             || '',
        domingo:             r[keys.domingo]            || '',
      }));

    // Catálogo incorporado al código (antes se leía de la hoja "Catalogos" del Excel).
    // Se conserva como variable local para no modificar la firma de los métodos que lo consumen.
    const catalogos: Catalogo[] = CATALOGO_ESPECIALIDADES.map(c => ({ ...c }));
    // Información procesada: viene de PERSONAL OPERATIVO
  // const personasProcesadas: PersonaProcesada[] = personalOperativo
  //   .filter(p => p.nombre.trim() !== '')
  //   .map(p => ({
  //     nombre:          p.nombre,
  //     apellidoPaterno: p.apellidoPaterno,
  //     apellidoMaterno: p.apellidoMaterno,
  //     nombreCompleto:  `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombre}`.trim(),
  //   }));

    const personasProcesadas: PersonaProcesada[] = [];
    for (const p of personalOperativo) {
      if (!p.nombre.trim()) continue;
      const nombreMedico = `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombre}`.trim();
      const nomenclatura = this.buscarNomenclatura(p.especialidad, catalogos);
      const consultorio  = this.generarConsultorio(
        nomenclatura,
        nombreMedico,
        personasProcesadas.map(x => ({ nomenclatura: x.consultorio, nombre: x.nombreCompleto }))
      );
    personasProcesadas.push({
      nombre:          p.nombre,
      apellidoPaterno: p.apellidoPaterno,
      apellidoMaterno: p.apellidoMaterno,
      nombreCompleto:  nombreMedico,
      consultorio,
      consultorioFisico: p.especialidad,
      horarioAtencion: `${this.formatearHora(p.horaInicioAtencion)} - ${this.formatearHora(p.horaFinAtencion)}`,  
      horarioCitas: this.generarHorarioCitas(p.horaInicioCita,  p.horaFinCita,  p.intervaloConsulta),
      intervalo: p.intervaloConsulta,
      subRol:   'MEDICO ESPECIALISTA',
      turno:    this.obtenerTurno(p.turno),
      tipoVisita:   'CONSULTORIO',
      diasConsulta: this.obtenerDiasConsulta(p),
      revisado: false,
      ocasionServicio: p.ocasionServicio,
      errores: [
          ...(consultorio.includes('SIN_CATALOGO') ? [`Especialidad sin catálogo: ${p.especialidad}`] : []),
          ...(this.generarHorarioCitas(p.horaInicioCita, p.horaFinCita, p.intervaloConsulta).includes('⚠') ? ['Horario de citas no cuadra'] : []),
        ],
    });
}

    return { personalOperativo, personasProcesadas, allSheets, rawHeaders };
  }

  private sheetToRows(wb: XLSX.WorkBook, sheetName: string): any[] {
    const ws = wb.Sheets[sheetName];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
  }

  private getHeaders(wb: XLSX.WorkBook, sheetName: string): string[] {
    const ws = wb.Sheets[sheetName];
    if (!ws) return [];
    const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    return (rows[0] || []).map((h: any) => h?.toString() ?? '');
  }

  private findColumnKey(headers: string[], candidates: string[]): string | null {
    const normalize = (s: string) =>
      s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const header of headers) {
      const norm = normalize(header?.toString() ?? '');
      if (candidates.some(c => norm.includes(normalize(c)))) return header;
    }
    return null;
  }


  private buscarNomenclatura(especialidad: string, catalogos: Catalogo[]): string {
    let mejorPuntaje = 0;
    let mejorNomenclatura = especialidad + ' no existe en catalogo';
    for (const cat of catalogos) {
      const puntaje = this.similaridad(especialidad, cat.descripcion);
      if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        mejorNomenclatura = cat.nomenclatura;
      }
    }

    if (mejorPuntaje < 0.5) {
      return `SIN_CATALOGO(${especialidad})`;
    }
    return mejorNomenclatura;
  }

private similaridad(txt1: string, txt2: string): number {
  const limpiar = (s: string) =>
    s.toLowerCase().trim()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/\s+/g, ' ');
  const a = limpiar(txt1);
  const b = limpiar(txt2);
  if (!a || !b) return 0;

  const palabrasA = a.split(' ');
  const palabrasB = b.split(' ');

  // Palabras de A que están en B
  const coincidencias = palabrasA.filter(p => b.includes(p)).length;
  const puntajeAenB = coincidencias / palabrasA.length;

  // Palabras de B que están en A (penaliza si B tiene palabras extra)
  const coincidenciasB = palabrasB.filter(p => a.includes(p)).length;
  const puntajeBenA = coincidenciasB / palabrasB.length;

  // Promedio de ambos: premia coincidencia total en ambas direcciones
  return (puntajeAenB + puntajeBenA) / 2;
}

  private generarConsultorio(
    nomenclatura: string,
    nombreMedico: string,
    registrosPrevios: { nomenclatura: string; nombre: string }[]
  ): string {
    // Quita el sufijo numérico que ya viene en la nomenclatura del catálogo
    // Ej: "GIN_01" → "GIN"
    const base = nomenclatura.replace(/_\d+$/, '');

    const dict = new Map<string, number>();
    let consecutivo = 1;

    for (const r of registrosPrevios) {
      const baseAnterior = r.nomenclatura.replace(/_\d+$/, '');
      if (baseAnterior === base) {
        if (!dict.has(r.nombre)) {
          dict.set(r.nombre, consecutivo++);
        }
      }
    }

    if (dict.has(nombreMedico)) {
      return `${base}_${String(dict.get(nombreMedico)!).padStart(2, '0')}`;
    }
    return `${base}_${String(consecutivo).padStart(2, '0')}`;
  }

private formatearHora(valor: string): string {
  if (!valor) return '';
  // Si ya viene como "HH:mm" lo devuelve igual
  if (valor.includes(':')) return valor;
  // Si viene como decimal de Excel
  const num = parseFloat(valor);
  if (!isNaN(num) && num < 1) {
    const totalMinutos = Math.round(num * 24 * 60);
    const horas   = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }
  return valor;
}

  private generarHorarioCitas(inicioStr: string, finStr: string, intervaloStr: string): string {
    // Convierte una cadena de tiempo a fraccion de dia (formato decimal de Excel).
    // - "7:30" / "07:30" / "7:30 AM" / "0:45" -> se parsean como h:mm.
    // - "0.3125" (decimal de Excel < 1)       -> se interpreta como fraccion de dia.
    // - "45", "20" (numero entero >= 1)       -> se interpreta como minutos solo si
    //                                            interpretarComoMinutos=true (caso intervalo).
    // Para las horas de inicio/fin no se asume nada cuando viene un numero plano,
    // porque seria ambiguo (p.ej. "7" podria ser 7:00 o 7 minutos).
    const toDecimal = (s: string, interpretarComoMinutos = false): number => {
      if (s === null || s === undefined || s === '') return NaN;
      const limpio = String(s).replace(/[a-zA-Z\s]+$/i, '').trim();
      const num = parseFloat(limpio);
      if (!isNaN(num) && !limpio.includes(':')) {
        if (interpretarComoMinutos && num >= 1) return num / 1440;
        return num;
      }
      const partes = limpio.split(':');
      if (partes.length < 2) return NaN;
      const horas   = parseInt(partes[0]);
      const minutos = parseInt(partes[1]);
      return Math.round(horas * 60 + minutos) / 1440;
    };

    const inicio    = toDecimal(inicioStr);
    const fin       = toDecimal(finStr);
    const intervalo = toDecimal(intervaloStr, true);

    const inicioFmt = this.formatearHora(inicioStr);
    const finFmt    = this.formatearHora(finStr);

    if (isNaN(inicio) || isNaN(fin) || isNaN(intervalo) || intervalo === 0) {
      return `${inicioFmt} - ${finFmt}`;
    }

    // Trabaja en minutos enteros para evitar errores de punto flotante
    const inicioMin    = Math.round(inicio * 1440);
    const finMin       = Math.round(fin * 1440);
    const intervaloMin = Math.round(intervalo * 1440);

    // Guarda contra datos inconsistentes (intervalo no positivo, mayor o igual a la
    // duracion total, o que produciria una hora corregida fuera de un dia). No marca
    // el warning: muestra el rango tal cual.
    const duracionMin = finMin - inicioMin;
    if (intervaloMin <= 0 || duracionMin <= 0 || intervaloMin >= duracionMin) {
      return `${inicioFmt} - ${finFmt}`;
    }

    const residuoMin = duracionMin % intervaloMin;

    if (residuoMin === 0) {
      return `${inicioFmt} - ${finFmt}`;
    }

    const finCorregidoMin = finMin + (intervaloMin - residuoMin);

    // Si la hora corregida cae fuera de un dia (24h) algo esta mal con los datos;
    // mejor no inventar una sugerencia. Mostrar el rango sin warning.
    if (finCorregidoMin >= 1440) {
      return `${inicioFmt} - ${finFmt}`;
    }

    const finCorregidoFmt = this.formatearHora(String(finCorregidoMin / 1440));

    return `${inicioFmt} - ${finFmt} ⚠ HORARIOS DE CITAS NO CUADRA, POSIBLE ${finCorregidoFmt}`;
  }

  private obtenerTurno(valor: string): string {
    const texto = valor.toUpperCase().trim();
    if (texto === 'MATUTINO')   return 'MATUTINO';
    if (texto === 'VESPERTINO') return 'VESPERTINO';
    return 'JORNADA COMPLEMENTARIA';
  }

  private obtenerDiasConsulta(p: PersonalOperativo): string {
    const dias = [
      { valor: p.lunes,     inicial: 'L'  },
      { valor: p.martes,    inicial: 'M'  },
      { valor: p.miercoles, inicial: 'MI' },
      { valor: p.jueves,    inicial: 'J'  },
      { valor: p.viernes,   inicial: 'V'  },
      { valor: p.sabado,    inicial: 'S'  },
      { valor: p.domingo,   inicial: 'D'  },
    ];
    return dias
      .filter(d => d.valor.toString().toUpperCase().trim() === 'X')
      .map(d => d.inicial)
      .join('-');
  }
}
