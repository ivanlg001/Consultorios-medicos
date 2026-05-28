import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ExcelStateService } from '../../services/excel-state.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-personal-operativo',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalComponent],
  templateUrl: './personal-operativo.page.html',
  styleUrl: './personal-operativo.page.css'
})
export class PersonalOperativoPage {
    selectedRow: any = null;

  columnsPersonal = [
    { label: 'Entidad Federativa',  key: 'entidadFederativa'  },
    { label: 'CVE Presupuestal',    key: 'cvePresupuestal'    },
    { label: 'CLUES',               key: 'clues'              },
    { label: 'Unidad Médica',       key: 'nombreUnidadMedica' },
    { label: 'Especialidad',        key: 'especialidad'       },
    { label: 'Consultorio',         key: 'nombreConsultorio'  },
    { label: 'Turno',               key: 'turno'              },
    { label: 'Clave Empleado',      key: 'claveEmpleado'      },
    { label: 'Nombre',              key: 'nombre'             },
    { label: 'Apellido Paterno',    key: 'apellidoPaterno'    },
    { label: 'Apellido Materno',    key: 'apellidoMaterno'    },
    { label: 'Titular',             key: 'titular'            },
    { label: 'Inicio Atención',     key: 'horaInicioAtencion' },
    { label: 'Fin Atención',        key: 'horaFinAtencion'    },
    { label: 'Inicio Cita',         key: 'horaInicioCita'     },
    { label: 'Fin Cita',            key: 'horaFinCita'        },
    { label: 'Intervalo',           key: 'intervaloConsulta'  },
    { label: 'Ocasión Servicio',    key: 'ocasionServicio'    },
    { label: 'Lunes',               key: 'lunes'              },
    { label: 'Martes',              key: 'martes'             },
    { label: 'Miércoles',           key: 'miercoles'          },
    { label: 'Jueves',              key: 'jueves'             },
    { label: 'Viernes',             key: 'viernes'            },
    { label: 'Sábado',              key: 'sabado'             },
    { label: 'Domingo',             key: 'domingo'            },
  ];

  constructor(public state: ExcelStateService) {}
}