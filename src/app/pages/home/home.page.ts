import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelReaderService } from '../../services/excel-reader.service';
import { SheetData } from '../../models/excel.models';
import { UploadZoneComponent } from '../../components/upload-zone/upload-zone.component';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ExcelStateService } from '../../services/excel-state.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadZoneComponent, DataTableComponent, ModalComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {
  errorMsg = '';
  data: SheetData | null = null;
  selectedRow: any = null;

  // Todas las columnas de Personal Operativo
  columnsPersonal = [
    { label: 'Entidad Federativa',    key: 'entidadFederativa'  },
    { label: 'CVE Presupuestal',      key: 'cvePresupuestal'    },
    { label: 'CLUES',                 key: 'clues'              },
    { label: 'Unidad Médica',         key: 'nombreUnidadMedica' },
    { label: 'Especialidad',          key: 'especialidad'       },
    { label: 'Consultorio',           key: 'nombreConsultorio'  },
    { label: 'Turno',                 key: 'turno'              },
    { label: 'Clave Empleado',        key: 'claveEmpleado'      },
    { label: 'Nombre',                key: 'nombre'             },
    { label: 'Apellido Paterno',      key: 'apellidoPaterno'    },
    { label: 'Apellido Materno',      key: 'apellidoMaterno'    },
    { label: 'Titular',               key: 'titular'            },
    { label: 'Inicio Atención',       key: 'horaInicioAtencion' },
    { label: 'Fin Atención',          key: 'horaFinAtencion'    },
    { label: 'Inicio Cita',           key: 'horaInicioCita'     },
    { label: 'Fin Cita',              key: 'horaFinCita'        },
    { label: 'Intervalo',             key: 'intervaloConsulta'  },
    { label: 'Ocasión Servicio',      key: 'ocasionServicio'    },
    { label: 'Lunes',                 key: 'lunes'              },
    { label: 'Martes',                key: 'martes'             },
    { label: 'Miércoles',             key: 'miercoles'          },
    { label: 'Jueves',                key: 'jueves'             },
    { label: 'Viernes',               key: 'viernes'            },
    { label: 'Sábado',                key: 'sabado'             },
    { label: 'Domingo',               key: 'domingo'            },
  ];

  // Solo nombre y apellidos de Alta Usuarios
  columnsProcesadas = [
    { label: 'Consultorio',         key: 'consultorio'      },  
    { label: 'Consultorio Físico',  key: 'consultorioFisico' },
    { label: 'Horario Atención',    key: 'horarioAtencion'   },
    { label: 'Horario Citas',       key: 'horarioCitas' },
    { label: 'Intervalo',           key: 'intervalo'      },
    { label: 'Ocasión Servicio', key: 'ocasionServicio' },
    { label: 'Nombre Completo',     key: 'nombreCompleto'   },
    { label: 'Sub Rol',  key: 'subRol' }, 
    { label: 'Turno',    key: 'turno'  }, 
    { label: 'Tipo Visita',    key: 'tipoVisita'    },  
    { label: 'Días Consulta',  key: 'diasConsulta'  },
    //{ label: 'Nombre',           key: 'nombre'           },
    //{ label: 'Apellido Paterno', key: 'apellidoPaterno'  },
    //{ label: 'Apellido Materno', key: 'apellidoMaterno'  },
  ];


  constructor(
    private excelService: ExcelReaderService,
    public state: ExcelStateService,
    private cdr: ChangeDetectorRef
  ) {}

  alertasSinCatalogo: string[] = [];


  async onFileSelected(file: File) {

     console.log("ENTRÓ AL PADRE", file.name);
    this.errorMsg = '';
    this.state.data = null;
    this.alertasSinCatalogo = [];
    try {
      this.state.data = await this.excelService.readFile(file);
      this.cdr.detectChanges();

      console.log(this.state.data);
      console.log(this.state.data.personasProcesadas);
      console.log(this.state.data.personasProcesadas.length);
      console.log("TERMINÓ DE LEER");
      this.alertasSinCatalogo = this.state.data.personasProcesadas
        .filter(p => p.errores.length > 0)
        .map(p => `${p.nombreCompleto} — ${p.errores.join(', ')}`);
    } catch (err: any) {
      this.errorMsg = err.message;
    }
  }

  ordenAscendente = true;

  ordenarAlfabeticamente() {
    if (!this.state.data) return;
    this.ordenAscendente = !this.ordenAscendente;
    this.state.data.personasProcesadas = [...this.state.data.personasProcesadas].sort((a, b) =>
      this.ordenAscendente
        ? a.consultorio.localeCompare(b.consultorio)
        : b.consultorio.localeCompare(a.consultorio)
    );

    this.cdr.detectChanges();
  }

  
onRowClick(row: any) {
  console.log('Click recibido:', row);
  this.selectedRow = row;
  this.cdr.detectChanges();
  console.log('selectedRow ahora es:', this.selectedRow);
}

cerrarModal() {
  this.selectedRow = null;
  this.cdr.detectChanges();
}

toggleRevisadoModal() {
  this.selectedRow.revisado = !this.selectedRow.revisado;
  this.cdr.detectChanges();
}

exportarExcel() {
  if (!this.state.data) return;

  const rows = this.state.data.personasProcesadas.map(p => ({
    'Consultorio':        p.consultorio,
    'Consultorio Físico': p.consultorioFisico,
    'Horario Atención':   p.horarioAtencion,
    'Horario Citas':      p.horarioCitas,
    'Intervalo':          p.intervalo,
    'Ocasión Servicio':   p.ocasionServicio,
    'Nombre Completo':    p.nombreCompleto,
    'Sub Rol':            p.subRol,
    'Turno':              p.turno,
    'Tipo Visita':        p.tipoVisita,
    'Días Consulta':      p.diasConsulta,
    'Revisado':           p.revisado ? 'Sí' : 'No',
    'Errores':            p.errores.join(', '),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Información Procesada');
  XLSX.writeFile(wb, 'informacion-procesada.xlsx');
}

guardarRow(rowEditado: any) {
  if (!this.state.data) return;
  const index = this.state.data.personasProcesadas.findIndex(
    p => p === this.selectedRow
  );
  if (index !== -1) {
    this.state.data.personasProcesadas[index] = rowEditado;
    this.selectedRow = rowEditado;
  }
  this.cdr.detectChanges();
}

}
