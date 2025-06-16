# Portfolio Project Manager

## Descripción

Este repositorio contiene **Portfolio Project Manager**, una aplicación web construida con Next.js (App Router), Material UI y Zustand para gestionar proyectos de forma sencilla. Permite a los usuarios registrarse, autenticarse, crear, leer, actualizar y eliminar proyectos, cada uno con título, descripción, URL, tecnologías y una imagen opcional. La app está protegida por rutas privadas y hace uso de cookies para manejar tokens de sesión.

## Funcionalidades

* **Autenticación**: Registro, login y logout con gestión de token en cookies.
* **Rutas protegidas**: Solo usuarios autenticados acceden a `/projects/**`.
* **CRUD de proyectos**: Crear, listar, ver detalle, editar y borrar proyectos.
* **Búsqueda**: Filtrado instantáneo por tecnologías.
* **Carga de imágenes**: Subida, reemplazo o eliminación de la imagen de un proyecto.
* **Responsive**: Adaptada a dispositivos móviles y escritorio.

## Tech stack

* **Framework**: Next.js 14 (App Router + TypeScript)
* **UI**: Material UI v5
* **State**: Zustand
* **HTTP**: Axios
* **Estilos**: next/font (Roboto), `@mui/material-nextjs` para SSR de estilos
* **Backend**: Express + MongoDB/Mongoose + JWT + Cloudinary

## Getting Started

### Requisitos

* Node.js ≥ 18
* npm
* Cuenta de **Vercel** o similar para despliegue
* Backend desplegado y accesible (debe exponer los endpoints `/auth` y `/projects`)

### Clonar el repositorio

```bash
git clone https://github.com/IvanTicona/portfolio-projects-manager-web.git
cd portfolio-projects-manager-web
```

### Instalar dependencias

Usando npm:

```bash
npm install
```

### Variables de entorno

Crea un archivo `.env.local` en la raíz y define:

```
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
```

* `NEXT_PUBLIC_API_URL`: URL base de tu backend.
* Asegúrate de que tu backend configure y envíe cookies de sesión correctamente (CORS y `withCredentials`).

### Scripts útiles

* `npm run start`
  Inicia el servidor de desarrollo en `http://localhost:3000`.
* `npm run build`
  Compila la app para producción.
* `npm start`
  Arranca la versión compilada (`next start`).
* `npm run lint`
  Ejecuta ESLint.
* `npm run format`
  Ejecuta Prettier.

### Ejecutar localmente

1. Asegúrate de haber configurado `.env.local`.

2. Ejecuta en modo desarrollo:

   ```bash
   npm run start
   ```

3. Abre en tu navegador `http://localhost:3000`.

## Estructura de carpetas

```
.
├── src/
│   ├── components/                 # UI: ProjectCard, etc.
│   ├── store/                      # Zustand stores
│   ├── theme.ts                    # Tema MUI
│   ├── utils/api.ts                # Instancia de Axios
│   └── app/
│       ├── layout.tsx              # Root layout y validación de sesión
│       ├── page.tsx                # Login
│       ├── register/page.tsx       # Registro
│       └── projects/               # Rutas privadas
│           ├── layout.tsx          # Navbar + Sidebar
│           ├── page.tsx            # Listado
│           ├── new/page.tsx        # Crear
│           └── [id]/
│               ├── page.tsx        # Detalle           
│               └── edit/page.tsx   # Editar
├── public/                         # Recursos estáticos
├── .env.local                      # Variables de entorno
├── next.config.js
└── package.json
```