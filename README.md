# Consultorios Médicos — Lector de Excel (MoCE)

Aplicación web en **Angular 18** que lee el archivo Excel del **Personal Operativo** del IMSS y genera la información procesada para el alta de consultorios (ECE IMSS – MoCE): nomenclatura del consultorio, horarios de atención, horarios de citas con validación del intervalo, turnos y días de consulta.

El catálogo de especialidades (descripción → nomenclatura del consultorio) está **incorporado en el código** en `src/app/data/catalogos.data.ts`, por lo que los archivos Excel que se carguen **ya no necesitan traer la pestaña `Catalogos`**; basta con que tengan la hoja `PERSONAL OPERATIVO`.

---

## Requisitos

- **Node.js** ≥ 18.19 (probado con `v22.x`)
- **npm** ≥ 9 (incluido con Node)
- Navegador moderno (Chrome, Edge, Firefox)

Para verificar:

```bash
node --version
npm --version
```

---

## Instalación

Clona el repositorio (o entra a la carpeta del proyecto) y ejecuta:

```bash
npm install
```

Esto descarga las dependencias declaradas en `package.json`, incluyendo `@angular/*`, `xlsx`, `rxjs` y `zone.js`.

---

## Cómo correr el proyecto

### Modo desarrollo (servidor local con recarga en caliente)

```bash
npm start
```

o equivalentemente:

```bash
npx ng serve
```

Esto compila el proyecto y levanta un servidor en **http://localhost:4200/**. Abre esa URL en tu navegador; al guardar cambios en el código, la página se recarga automáticamente.

> Si el puerto 4200 está ocupado, puedes usar otro: `npx ng serve --port 4300`.

### Build de producción

Para generar los archivos estáticos optimizados:

```bash
npm run build
```

La salida queda en la carpeta `dist/excel-reader/`. Esos archivos se pueden servir desde cualquier servidor estático (IIS, Nginx, GitHub Pages, etc.).

### Build de desarrollo en modo *watch*

Recompila al detectar cambios pero sin levantar un servidor:

```bash
npm run watch
```

---

## Uso de la aplicación

1. Inicia el servidor (`npm start`) y abre **http://localhost:4200/**.
2. En la página principal, arrastra o selecciona un archivo `.xlsx` que contenga la hoja **`PERSONAL OPERATIVO`** con las columnas habituales (Entidad Federativa, CLUES, Especialidad, Nombre, Apellido Paterno, Apellido Materno, Hora Inicio/Fin Atención, Hora Inicio/Fin Cita, Intervalo, Ocasión Servicio, Lunes…Domingo, etc.).
3. El sistema muestra dos vistas:
   - **Personal Operativo**: tal cual viene del Excel.
   - **Información procesada**: nombre completo, **nomenclatura del consultorio** (asignada a partir del catálogo interno), horario de atención, horario de citas (con alerta si el intervalo no cuadra), turno, días de consulta, etc.
4. Si alguna especialidad del Excel no se parece lo suficiente a ninguna descripción del catálogo, aparece en la lista de **alertas “Sin catálogo”** con el valor `SIN_CATALOGO(...)`.

La hoja `Catalogos` que pudiera venir incluida en el Excel **se ignora**; el catálogo activo es siempre el del código.

---

## Estructura principal del código

```
src/
└── app/
    ├── app.component.ts
    ├── app.config.ts
    ├── app.routes.ts                              # / y /personal-operativo
    ├── components/
    │   ├── upload-zone/                           # Selector / drop de archivos
    │   ├── data-table/                            # Tabla genérica
    │   └── modal/                                 # Detalle por fila
    ├── data/
    │   └── catalogos.data.ts                      # Catálogo embebido (274 entradas)
    ├── models/
    │   └── excel.models.ts                        # Interfaces: PersonalOperativo,
    │                                              # PersonaProcesada, Catalogo, SheetData
    ├── pages/
    │   ├── home/                                  # Pantalla principal y alertas
    │   └── personal-operativo/                    # Vista de la hoja PERSONAL OPERATIVO
    └── services/
        ├── excel-reader.service.ts                # Lectura del .xlsx + procesamiento
        └── excel-state.service.ts                 # Estado compartido entre rutas
```

Archivos clave si quieres modificar el comportamiento:

- **`src/app/data/catalogos.data.ts`** — añadir o ajustar entradas del catálogo (descripción + nomenclatura). Se respeta el tipo `Catalogo` definido en `excel.models.ts`.
- **`src/app/services/excel-reader.service.ts`** — lectura del Excel, normalización de encabezados, matching por similitud (`buscarNomenclatura`), generación del nombre del consultorio (`generarConsultorio`), formateo de horas (`formatearHora`), validación de horario de citas (`generarHorarioCitas`), determinación de turno y días.

---

## Cómo actualizar el catálogo

Si en el futuro cambia la lista oficial de especialidades / nomenclaturas:

1. Abre `src/app/data/catalogos.data.ts`.
2. Agrega, edita o elimina entradas dentro del arreglo `CATALOGO_ESPECIALIDADES`. Cada entrada tiene la forma:

   ```ts
   { descripcion: "Nombre de la especialidad", nomenclatura: "Codigo_Consult_01" },
   ```

3. Convención observada en el catálogo original: por cada descripción suelen registrarse **dos** entradas, una con sufijo `_01` (presencial) y otra con `_v01` (virtual).
4. Guarda el archivo. Si el servidor de desarrollo está corriendo (`npm start`), Angular recompila automáticamente.

> No es necesario tocar `excel-reader.service.ts`: el servicio ya importa `CATALOGO_ESPECIALIDADES` y lo usa internamente.

---

## Solución de problemas

- **“No se pudo leer el archivo. Verifica que sea un Excel válido.”**: el archivo no es un `.xlsx` legible o está corrupto.
- **No aparecen filas en *Información procesada***: revisa que la hoja se llame **`PERSONAL OPERATIVO`** y que la columna **`NOMBRE`** esté presente con datos.
- **Muchas filas con `SIN_CATALOGO(...)`**: la especialidad del Excel no se parece (umbral 50% de similitud) a ninguna descripción del catálogo. Considera agregar la especialidad faltante a `catalogos.data.ts`.
- **`⚠ HORARIOS DE CITAS NO CUADRA, POSIBLE HH:MM`**: el rango `Hora Inicio Cita → Hora Fin Cita` no es múltiplo exacto del **Intervalo**. La aplicación sugiere la hora de fin que sí cuadraría.
- **Conflicto de versiones al instalar**: borra `node_modules/` y `package-lock.json` y vuelve a ejecutar `npm install`.

---

## Scripts disponibles

Definidos en `package.json`:

| Script           | Comando                              | Para qué sirve                                              |
|------------------|--------------------------------------|-------------------------------------------------------------|
| `npm start`      | `ng serve`                           | Servidor de desarrollo en http://localhost:4200/            |
| `npm run build`  | `ng build`                           | Build de producción en `dist/excel-reader/`                 |
| `npm run watch`  | `ng build --watch --configuration development` | Recompila al guardar cambios (sin servidor)        |
| `npm run ng`     | `ng`                                 | Acceso directo al CLI de Angular                            |

---

## Tecnologías

- [Angular 18](https://angular.dev/) (standalone components)
- [SheetJS / xlsx](https://github.com/SheetJS/sheetjs) para leer archivos `.xlsx`
- TypeScript 5.4
- RxJS 7
