export interface PersonalOperativo {
  entidadFederativa: string;
  cvePresupuestal: string;
  clues: string;
  nombreUnidadMedica: string;
  especialidad: string;
  nombreConsultorio: string;
  turno: string;
  claveEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  titular: string;
  horaInicioAtencion: string;
  horaFinAtencion: string;
  horaInicioCita: string;
  horaFinCita: string;
  intervaloConsulta: string;
  ocasionServicio: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export interface PersonaProcesada {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  consultorio: string;
  consultorioFisico: string;
  horarioAtencion: string;
  horarioCitas: string;
  intervalo: string;
  subRol: string;   
  turno: string;
  tipoVisita: string;  
  diasConsulta: string;
  revisado: boolean;
  ocasionServicio: string;
  errores: string[];
}

export interface SheetData {
  personalOperativo: PersonalOperativo[];
  personasProcesadas: PersonaProcesada[];
  allSheets: string[];
  rawHeaders: { [sheet: string]: string[] };
}

export interface Catalogo {
  descripcion: string;
  nomenclatura: string;
}

