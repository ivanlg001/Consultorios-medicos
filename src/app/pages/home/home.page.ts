import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelReaderService } from '../../services/excel-reader.service';
import { SheetData } from '../../models/excel.models';
import { UploadZoneComponent } from '../../components/upload-zone/upload-zone.component';
import { DataTableComponent } from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadZoneComponent, DataTableComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {
  errorMsg = '';
  data: SheetData | null = null;

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
    { label: 'Nombre Completo',     key: 'nombreCompleto'   },
    { label: 'Sub Rol',  key: 'subRol' }, 
    { label: 'Turno',    key: 'turno'  }, 
    { label: 'Tipo Visita',    key: 'tipoVisita'    },  
    { label: 'Días Consulta',  key: 'diasConsulta'  },
    //{ label: 'Nombre',           key: 'nombre'           },
    //{ label: 'Apellido Paterno', key: 'apellidoPaterno'  },
    //{ label: 'Apellido Materno', key: 'apellidoMaterno'  },
  ];

  constructor(private excelService: ExcelReaderService) {}

  alertasSinCatalogo: string[] = [];

  async onFileSelected(file: File) {
    this.errorMsg = '';
    this.data = null;
    try {
      this.data = await this.excelService.readFile(file);
      this.alertasSinCatalogo = this.data.personasProcesadas
        .filter(p => p.consultorio.includes('SIN_CATALOGO'))
        .map(p => `${p.nombreCompleto} — ${p.consultorioFisico}`);
    } catch (err: any) {
      this.errorMsg = err.message;
    }
  }

  ordenAscendente = true;

  ordenarAlfabeticamente() {
    if (!this.data) return;
    this.ordenAscendente = !this.ordenAscendente;
    this.data.personasProcesadas.sort((a, b) =>
      this.ordenAscendente
        ? a.consultorio.localeCompare(b.consultorio)
        : b.consultorio.localeCompare(a.consultorio)
    );
  }

  


}
