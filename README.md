# Consultorios Médicos — Lector de Excel

Aplicación web en **Angular 18** para cargar y visualizar archivos Excel (`.xlsx`, `.xls`). Incluye vistas para inicio y **Personal operativo**.

Esta guía cubre la instalación completa desde cero: **Node.js**, **Git**, **Visual Studio Code**, ejecución local y ejecución con **Docker**.

---

## Tabla de contenidos

1. [Resumen de herramientas](#resumen-de-herramientas)
2. [Instalar Node.js y npm](#1-instalar-nodejs-y-npm)
3. [Instalar Git](#2-instalar-git)
4. [Instalar Visual Studio Code](#3-instalar-visual-studio-code)
5. [Clonar el proyecto](#4-clonar-el-proyecto)
6. [Instalar dependencias y ejecutar en local](#5-instalar-dependencias-y-ejecutar-en-local)
7. [Desarrollo con VS Code](#6-desarrollo-con-vs-code)
8. [Instalar Docker (opcional)](#7-instalar-docker-opcional)
9. [Ejecutar con Docker](#8-ejecutar-con-docker)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Solución de problemas](#solución-de-problemas)
12. [Tecnologías](#tecnologías)
13. [Instalador](#instalador)

---

## Resumen de herramientas

| Herramienta | Versión recomendada | Obligatorio para… |
|-------------|---------------------|-------------------|
| **Node.js** | **20.x LTS** (mínimo 18.19+) | Desarrollo local |
| **npm** | Viene con Node.js | Instalar paquetes y scripts |
| **Git** | Última estable | Clonar y actualizar el código |
| **VS Code** | Última estable | Editar y depurar (recomendado) |
| **Edge o Chrome** | Actual | Ver la app y depurar |
| **Docker Desktop** | 24+ | Ejecutar sin instalar Node en la máquina |

---

## 1. Instalar Node.js y npm

Node.js incluye **npm** (gestor de paquetes). Este proyecto usa **Angular 18**, que requiere Node **18.19+** o **20+**. Se recomienda la rama **20 LTS**.

### Windows

1. Entra en [https://nodejs.org/](https://nodejs.org/).
2. Descarga el instalador **LTS** (20.x).
3. Ejecuta el `.msi` y acepta las opciones por defecto (incluye **Add to PATH**).
4. Cierra y vuelve a abrir **PowerShell**, **CMD** o la terminal de VS Code.

### macOS

**Opción A — Instalador oficial**

1. Descarga el `.pkg` LTS desde [nodejs.org](https://nodejs.org/).
2. Instálalo y reinicia la terminal.

**Opción B — Homebrew**

```bash
brew install node@20
```

### Linux (Debian/Ubuntu)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verificar la instalación

En una terminal nueva:

```bash
node -v
# Debe mostrar v20.x.x (o v18.19+ como mínimo)

npm -v
# Debe mostrar 10.x.x o similar
```

Si `node` no se reconoce en Windows, reinicia el equipo o comprueba que la ruta de Node esté en las variables de entorno **PATH**.

---

## 2. Instalar Git

Git sirve para clonar el repositorio y recibir actualizaciones.

### Windows

1. Descarga [Git for Windows](https://git-scm.com/download/win).
2. Instala con las opciones por defecto.
3. Usa **Git Bash**, **PowerShell** o la terminal integrada de VS Code.

### macOS

```bash
# Con Homebrew
brew install git

# O instala Xcode Command Line Tools
xcode-select --install
```

### Linux

```bash
sudo apt-get update
sudo apt-get install git
```

### Verificar

```bash
git --version
```

### Configuración inicial (solo la primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

---

## 3. Instalar Visual Studio Code

1. Descarga VS Code desde [https://code.visualstudio.com/](https://code.visualstudio.com/).
2. Instálalo en tu sistema.
3. Abre VS Code y ve a **Extensiones** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
4. Instala estas extensiones recomendadas:

| Extensión | ID en Marketplace | Para qué sirve |
|-----------|-------------------|----------------|
| **Angular Language Service** | `Angular.ng-template` | Autocompletado y errores en plantillas `.html` |
| **ESLint** (opcional) | `dbaeumer.vscode-eslint` | Linting de TypeScript |
| **Docker** (opcional) | `ms-azuretools.vscode-docker` | Gestionar contenedores desde el editor |

5. Para depurar con F5, necesitas **Microsoft Edge** o **Google Chrome** instalados en el sistema.

---

## 4. Clonar el proyecto

Abre una terminal en la carpeta donde quieras guardar el código (por ejemplo `Documentos` o `Proyectos`).

```bash
git clone https://github.com/ivanlg001/Consultorios-medicos.git
cd Consultorios-medicos
```

Si ya tienes la carpeta sin clonar (copia local), entra en ella:

```bash
cd "ruta\a\Consultorios medicos"
```

> En Windows, si la ruta tiene espacios, usa comillas como en el ejemplo anterior.

---

## 5. Instalar dependencias y ejecutar en local

Desde la **raíz del proyecto** (donde está `package.json`):

### Paso 1 — Instalar paquetes de Node

```bash
npm install
```

Esto descarga Angular, TypeScript, `xlsx` y el resto de dependencias en la carpeta `node_modules/`. La primera vez puede tardar varios minutos según tu conexión.

### Paso 2 — Iniciar el servidor de desarrollo

```bash
npm start
```

Es equivalente a `ng serve`. Cuando veas un mensaje similar a:

```text
Application bundle generation complete.
Local:   http://localhost:4200/
```

Abre el navegador en:

**http://localhost:4200**

### Rutas de la aplicación

| URL | Vista |
|-----|--------|
| http://localhost:4200/ | Inicio |
| http://localhost:4200/personal-operativo | Personal operativo |

### Paso 3 — Detener el servidor

En la terminal donde corre `npm start`, pulsa **`Ctrl + C`**.

### Otros comandos npm

```bash
# Compilar versión de producción (carpeta dist/consultorios-medicos/)
npm run build

# Compilar en modo watch (desarrollo, sin servidor)
npm run watch

# Servidor en otro puerto si 4200 está ocupado
npx ng serve --port 4300
```

---

## 6. Desarrollo con VS Code

### Abrir el proyecto

1. Abre **Visual Studio Code**.
2. **Archivo → Abrir carpeta…** (`Ctrl+K Ctrl+O`).
3. Selecciona la carpeta raíz del proyecto (la que contiene `package.json` y `angular.json`).

### Terminal integrada

1. **Terminal → Nueva terminal** (`` Ctrl+` ``).
2. Comprueba que estás en la raíz del proyecto.
3. Ejecuta:

```bash
npm install   # solo si aún no lo hiciste
npm start
```

### Depurar en el navegador (F5)

El proyecto incluye `.vscode/launch.json` con la configuración **Debug Angular**.

1. Deja `npm start` en ejecución (`http://localhost:4200`).
2. En VS Code: **Ejecutar y depurar** (`Ctrl+Shift+D`).
3. Elige **Debug Angular** y pulsa **F5** (o el botón de play verde).
4. Se abrirá **Microsoft Edge** en `http://localhost:4200` con el depurador adjunto.

Puedes poner breakpoints en archivos `.ts` desde el editor.

### Flujo de trabajo habitual

```text
1. npm start          → servidor en segundo plano
2. Editar src/        → la app se recarga sola (hot reload)
3. F5 (opcional)      → depurar en Edge
4. Ctrl+C en terminal → parar el servidor
```

---

## 7. Instalar Docker (opcional)

Docker permite ejecutar la aplicación **ya compilada** con Nginx, sin instalar Node.js en tu PC (útil para pruebas de producción o despliegue local).

### Windows

1. Requisitos: Windows 10/11 64 bits, virtualización habilitada en BIOS/UEFI.
2. Descarga [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/).
3. Instala y reinicia si lo pide el asistente.
4. Abre **Docker Desktop** y espera a que indique que Docker está en ejecución.
5. En PowerShell:

```bash
docker --version
docker compose version
```

### macOS

1. [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/) (Apple Silicon o Intel según tu equipo).
2. Verifica con `docker --version`.

### Linux

Sigue la guía oficial: [Install Docker Engine](https://docs.docker.com/engine/install/).

---

## 8. Ejecutar con Docker

La imagen hace un **build multi-etapa**: compila con **Node 20** y sirve los archivos estáticos con **Nginx** en el puerto **80** del contenedor.

### Opción A — Docker Compose (recomendado)

Desde la raíz del proyecto:

```bash
# Construir y levantar en segundo plano
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener y eliminar contenedores
docker compose down
```

La app queda en:

**http://localhost:8080**

El archivo `docker-compose.yml` mapea el puerto **8080** de tu máquina al **80** del contenedor.

### Opción B — Comandos Docker manuales

```bash
# Construir la imagen
docker build -t consultorios-medicos .

# Ejecutar (puerto local 8080 → 80 del contenedor)
docker run --rm -p 8080:80 consultorios-medicos
```

Abre **http://localhost:8080**. Para detener: `Ctrl+C` en esa terminal.

Otro puerto local:

```bash
docker run --rm -p 3000:80 consultorios-medicos
# → http://localhost:3000
```

### Comparación: local vs Docker

| | Desarrollo (`npm start`) | Docker |
|--|--------------------------|--------|
| **URL** | http://localhost:4200 | http://localhost:8080 |
| **Recarga al editar código** | Sí | No (hay que reconstruir la imagen) |
| **Necesita Node instalado** | Sí | No |
| **Uso típico** | Programar y probar | Simular producción |

Para aplicar cambios de código en Docker:

```bash
docker compose up --build -d
```

---

## Estructura del proyecto

```text
Consultorios medicos/
├── src/                    # Código fuente Angular
│   ├── app/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas (home, personal-operativo)
│   │   ├── services/       # Lógica Excel y estado
│   │   └── models/
│   ├── index.html
│   └── main.ts
├── .vscode/
│   └── launch.json         # Depuración F5
├── angular.json            # Configuración Angular CLI
├── package.json            # Dependencias y scripts
├── package-lock.json       # Versiones bloqueadas de npm
├── tsconfig.json           # TypeScript
├── Dockerfile              # Build Node + Nginx
├── docker-compose.yml      # Levantar con un comando
├── nginx.conf              # Servidor en contenedor
└── README.md               # Esta guía
```

Salida del build de producción:

```text
dist/consultorios-medicos/browser/
```

---

## Solución de problemas

### Node.js y npm

| Problema | Solución |
|----------|----------|
| `'node' no se reconoce como comando` | Reinstala Node.js marcando **Add to PATH**, reinicia la terminal o el PC. |
| Versión de Node demasiado antigua | Instala Node **20 LTS** desde [nodejs.org](https://nodejs.org/). |
| `npm install` falla con errores de red | Revisa proxy/VPN; prueba `npm install --registry https://registry.npmjs.org/`. |
| `EACCES` / permisos en Linux/macOS | No uses `sudo npm install` en el proyecto; corrige permisos de tu carpeta de usuario. |

### Angular y desarrollo local

| Problema | Solución |
|----------|----------|
| `ng: command not found` | Usa `npm start` o `npx ng serve` (el CLI está en `node_modules`). |
| Puerto **4200** en uso | `npx ng serve --port 4300` o cierra la otra aplicación. |
| Cambios no se ven en el navegador | Hard refresh: `Ctrl+Shift+R`; confirma que `npm start` sigue activo. |
| Error tras `git pull` | Ejecuta de nuevo `npm install` por si cambió `package-lock.json`. |

### Git

| Problema | Solución |
|----------|----------|
| `git clone` pide usuario/contraseña | En GitHub usa un **Personal Access Token** en lugar de la contraseña, o configura SSH. |
| Carpeta con espacios en Windows | Encierra la ruta entre comillas: `cd "Consultorios medicos"`. |

### VS Code

| Problema | Solución |
|----------|----------|
| F5 no abre el navegador | Instala Edge/Chrome; inicia antes `npm start`. |
| Sin autocompletado en HTML | Instala la extensión **Angular Language Service**. |

### Docker

| Problema | Solución |
|----------|----------|
| `Cannot connect to the Docker daemon` | Abre **Docker Desktop** y espera a que esté listo. |
| Build falla en `npm install` | Comprueba internet; no borres `package-lock.json`. |
| Página en blanco o 404 al refrescar | Reconstruye: `docker compose up --build`; Nginx debe redirigir a `index.html`. |
| Puerto **8080** ocupado | En `docker-compose.yml` cambia `"8080:80"` por `"9080:80"` y usa http://localhost:9080. |

---

## Tecnologías

- [Angular](https://angular.dev/) 18
- [TypeScript](https://www.typescriptlang.org/) 5.4
- [SheetJS (xlsx)](https://sheetjs.com/) — lectura de archivos Excel
- [Node.js](https://nodejs.org/) 20 — build y desarrollo
- [Nginx](https://nginx.org/) — servidor en imagen Docker

---

## Inicio rápido (cheat sheet)

**Solo desarrollo (con Node instalado):**

```bash
git clone https://github.com/ivanlg001/Consultorios-medicos.git
cd Consultorios-medicos
npm install
npm start
# → http://localhost:4200
```

**Solo Docker (sin Node en el equipo):**

```bash
git clone https://github.com/ivanlg001/Consultorios-medicos.git
cd Consultorios-medicos
docker compose up --build -d
# → http://localhost:8080
```

## Instalador
### Prerrequisitos
- Node.js instalado
- Dependencias instaladas: `npm install`

### Comandos

#### 1. Build completo (recomendado)
Genera el build de Angular y el instalador en un solo comando:
```bash
npm run electron:build
```

#### 2. Paso a paso (opcional)
```bash
# Build de Angular para Electron
ng build --configuration electron

# Generar instalador .exe
npx electron-builder build --win
```

#### 3. Solo probar en Electron (sin generar .exe)
```bash
npm run electron
```

### Resultado
El instalador se genera en: Consultorios medicos\dist