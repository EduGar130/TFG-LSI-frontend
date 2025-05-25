# Frontend - Inventario Online (Angular 19 + PrimeNG)

Este módulo representa la interfaz de usuario del sistema de gestión de inventario online, desarrollado como parte del Trabajo de Fin de Grado en Ingeniería Informática.

## 🚀 Tecnologías

* Angular 19
* PrimeNG
* TypeScript
* RxJS
* SCSS
* JWT para autenticación (Bearer Token)

## 📁 Estructura del Proyecto

```
code/front/
├── index.html
├── main.ts
├── styles.scss
└── app/
    ├── app.component.*           # Raíz de la aplicación
    ├── app.routes.ts             # Rutas principales
    ├── admin/                    # Gestión de usuarios (CRUD, roles)
    ├── auth/                     # Login, guards y autenticación
    ├── common/                   # Constantes compartidas
    ├── data/                     # Datos de ejemplo
    ├── home/                     # Página de bienvenida
    ├── inventario/               # Gestión de productos y almacenes
    ├── movimientos/              # Registro de transacciones
    ├── notificaciones/           # Alertas de stock
    ├── shared/                   # Componentes comunes (navbar, módulos)
    └── stats/                    # Dashboard y visualizaciones
```

## 🧩 Funcionalidades

* Login con validación y guards por rol
* Gestión de usuarios, roles y almacenes
* Visualización y edición de productos
* Control de inventario distribuido
* Visualización de movimientos y transacciones
* Sistema de alertas automáticas
* Dashboard de estadísticas (ventas, almacenes, ranking...)

## 🛠️ Servicios y Arquitectura

* Servicios HTTP integrados por módulo (`*.service.ts`)
* Guards para control de acceso (`*.guard.ts`)
* Interceptor para añadir token JWT en cada request
* Componentes reutilizables en `shared/components/`

## ▶️ Cómo ejecutar

### Requisitos

* Node.js 20+
* Angular CLI instalado globalmente (`npm install -g @angular/cli`)

### Comandos

```bash
cd code/front
npm install
npm run start
```

Por defecto, la aplicación estará disponible en:

```
http://localhost:4200/
```

## 🧪 Pruebas

Cada módulo incluye sus propios `.spec.ts` para testing unitario de componentes, guards y servicios. Las pruebas se pueden ejecutar con:

```bash
ng test
```

## 🔒 Seguridad y Control de Acceso

El frontend utiliza guards por rol y permisos para enviar el token JWT en cada petición al backend. Se valida el acceso tanto a nivel de rutas como de componentes visibles.

## 📊 Visualización de Datos

La sección `stats/` muestra KPIs relevantes con gráficos y tablas usando PrimeNG Charts. Está integrada con los endpoints del backend para obtener información dinámica.

## 👨‍💻 Autor

Eduardo García Romera
[egarcia3266@alumno.uned.es](mailto:egarcia3266@alumno.uned.es)


Este frontend se conecta con el backend ubicado en [code/back/](/code/back) y forma parte de una solución completa de gestión de inventario distribuido.

