# Ana María Salas — Studio & Reservas

> **Plataforma Web Progresiva (PWA) de reservas, catálogo de belleza profesional y panel de gestión integral con sincronización en tiempo real.**

---

## 🌟 Descripción General

**Ana María Salas Studio** es una aplicación web y PWA diseñada específicamente para salones de belleza, artistas de cejas (*brow artists*), maquilladoras profesionales y centros estéticos. 

Permite a las clientas explorar servicios, conocer tiempos y tarifas, verificar la disponibilidad real de la profesional y agendar citas en pocos pasos sin requerir registro previo, con confirmación instantánea vía **WhatsApp**. Para la profesional o administradora, ofrece un panel de control completo para gestionar la agenda diaria, servicios, horarios de atención, reseñas y parámetros del negocio.

---

## ✨ Características Principales

### 💄 Para las Clientas (Portal Público)
* **Asistente de Reservas Paso a Paso (*Booking Wizard*)**:
  * Selección intuitiva de servicio y categoría.
  * Selector dinámico de fechas con cálculo de cupos disponibles en tiempo real (evita colisiones y dobles reservas).
  * Horarios calculados según la duración exacta de cada servicio, respetando pausas de almuerzo y días festivos.
  * Formulario de datos de contacto optimizado para móviles.
* **Confirmación Inmediata con WhatsApp & QR**:
  * Generación de mensaje pre-formateado directo al WhatsApp del estudio con los detalles exactos de la cita.
  * Código QR escaneable para guardar o compartir la reserva.
  * Indicaciones claras de preparación previa y ubicación.
* **Catálogo Detallado de Servicios**:
  * Filtros por categoría (Diseño de Cejas, Pestañas, Maquillaje Profesional).
  * Fichas de servicio con precios, duraciones, notas de preparación y cuidados posteriores (*aftercare*).
* **Módulo de Reseñas & Testimonios**:
  * Valoraciones y testimonios reales con puntuación de 1 a 5 estrellas.
  * Formulario público (`/resenas/nueva`) para que las clientas compartan su experiencia (con moderación previa).
* **PWA Instalable & Diseño Adaptativo**:
  * Experiencia fluida *mobile-first* en smartphones, tablets y computadores.

---

### 💼 Para la Administradora (Panel de Gestión `/admin`)
* **Dashboard Analítico**:
  * Métricas en tiempo real: citas del día, ingresos proyectados, tasa de confirmación y total de clientas.
  * Accesos rápidos para confirmar o gestionar citas pendientes.
* **Agenda Diaria & Vista de Citas**:
  * Visualización cronológica de la jornada con líneas de tiempo y estados por color.
  * Filtros avanzados por fecha y estado (*Pendiente*, *Confirmada*, *Completada*, *Cancelada*).
  * Confirmación de cita con 1 clic y apertura directa de chat de WhatsApp con la clienta.
* **Gestión de Servicios & Categorías**:
  * Crear, editar, pausar/activar y reordenar servicios.
  * Configuración de precios fijos o "a partir de", duraciones en minutos y notas personalizadas.
* **Control de Horarios & Días Bloqueados**:
  * Horarios de apertura, cierre e intervalos de almuerzo por cada día de la semana.
  * Bloqueo de fechas especiales (festivos, capacitaciones, vacaciones personales).
* **Moderación de Reseñas**:
  * Aprobación, destaque en página principal o eliminación de testimonios recibidos.
* **Configuración del Negocio & Supabase**:
  * Ajuste de datos de contacto, número de WhatsApp para reservas, dirección y redes sociales.
  * Monitor de estado de conexión y sincronización bidireccional con Supabase.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **Estilos & UI** | Tailwind CSS v4, Motion (Framer Motion), Lucide React |
| **Base de Datos & Auth** | Supabase (PostgreSQL, Row Level Security, Realtime Subscriptions) |
| **Capa de Persistencia** | Motor Reactivo Local + Sincronización en la Nube (*Offline-Ready*) |
| **Utilidades** | Canvas-Confetti, QRCode.React, React Router DOM v7 |

---

## 📁 Estructura del Proyecto

```text
├── public/                 # Iconos, manifiesto PWA y recursos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── admin/          # Componentes del panel administrativo
│   │   ├── booking/        # Wizard de reservas y selector de horarios
│   │   ├── common/         # Botones, inputs, modales, badges y alertas
│   │   ├── layout/         # Header, Footer, Navbar y estructura
│   │   ├── reviews/        # Formulario y tarjetas de reseñas
│   │   └── services/       # Tarjetas y filtros de servicios
│   ├── contexts/           # Contextos globales (Auth, Settings, Toast)
│   ├── hooks/              # Custom hooks reactivos (useBookings, useServices, etc.)
│   ├── lib/                # Configuración de Supabase, constantes y dataStore reactivo
│   ├── pages/              # Vistas de la aplicación
│   │   ├── admin/          # Páginas administrativas (Dashboard, Agenda, Citas, etc.)
│   │   └── public/         # Páginas públicas (Home, Servicios, Reservar, Contacto)
│   ├── types/              # Definición de tipos TypeScript e interfaces de base de datos
│   └── utils/              # Utilidades de fechas, disponibilidad y formateo de moneda
├── supabase/
│   ├── schema.sql          # Script DDL completo de PostgreSQL (Tablas, RLS, Triggers)
│   ├── seed.sql            # Datos de prueba iniciales
│   └── README.md           # Guía paso a paso de configuración de Supabase
├── index.html              # Punto de entrada HTML
├── metadata.json           # Metadatos de la aplicación
└── package.json            # Dependencias y scripts del proyecto
```

---

## 🚀 Instalación y Ejecución Local

### 1. Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* Gestor de paquetes `npm`, `yarn` o `pnpm`

### 2. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/tu-usuario/ana-salas-studio.git
cd ana-salas-studio
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Define las siguientes variables:
```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon

# URL canónica de la web
VITE_SITE_URL=http://localhost:3000
```

> 💡 **Nota**: La aplicación cuenta con un motor reactivo que permite probar y utilizar todas las funcionalidades incluso antes de vincular Supabase. Al configurar las claves, la sincronización en la nube se activará automáticamente.

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000`.

### 5. Compilar para Producción
```bash
npm run build
```

---

## 🗄️ Configuración de la Base de Datos (Supabase)

Para conectar tu propia base de datos en Supabase:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve a la sección **SQL Editor** en tu consola de Supabase.
3. Copia el contenido de `supabase/schema.sql` y ejecútalo (**Run**). Esto creará:
   * Tablas: `profiles`, `service_categories`, `services`, `bookings`, `reviews`, `business_hours`, `schedule_exceptions` y `site_settings`.
   * Políticas de seguridad (Row Level Security - RLS).
   * Triggers de actualización automática de fecha (`updated_at`).
4. *(Opcional)* Ejecuta `supabase/seed.sql` si deseas cargar servicios y horarios de demostración.
5. Para más detalles sobre creación de buckets de imágenes y usuarios administradores, consulta [`supabase/README.md`](./supabase/README.md).

---

## 🗺️ Mapa de Rutas

### Rutas Públicas
| Ruta | Descripción |
| :--- | :--- |
| `/` | Página de inicio con hero, destacados, sobre mí y testimonios |
| `/servicios` | Catálogo completo con buscador y filtro por categoría |
| `/servicios/:slug` | Detalle del servicio, preparación y enlace directo a reservar |
| `/reservar` | Asistente de reservas paso a paso con selección de horario |
| `/reservar/confirmacion/:id` | Pantalla de confirmación con botón de WhatsApp y código QR |
| `/resenas` | Galería de valoraciones y opiniones de clientas |
| `/resenas/nueva` | Formulario para enviar una nueva reseña |
| `/contacto` | Ubicación, mapa, horarios de atención y redes sociales |
| `/login` | Acceso al panel administrativo |

### Rutas Administrativas (Protegidas)
| Ruta | Descripción |
| :--- | :--- |
| `/admin` | Panel general / Dashboard con indicadores clave |
| `/admin/agenda` | Agenda diaria en formato de cronograma |
| `/admin/citas` | Listado y gestión de todas las reservas |
| `/admin/servicios` | Gestión de servicios y categorías |
| `/admin/servicios/nuevo` | Formulario de creación de servicio |
| `/admin/servicios/editar/:id` | Edición de servicio existente |
| `/admin/horarios` | Configuración de horarios comerciales y días bloqueados |
| `/admin/resenas` | Moderación de opiniones recibidas |
| `/admin/configuracion` | Configuración general del estudio y estado de Supabase |

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo y adaptarlo libremente para tu propio negocio o estudio de belleza.
