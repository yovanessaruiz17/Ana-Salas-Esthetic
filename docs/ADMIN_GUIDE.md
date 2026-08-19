# Guía de Administración & Despliegue - Ana María Salas Studio

Bienvenida al manual oficial de operación y despliegue de tu plataforma web y sistema de reservas.

---

## 🌟 1. Características Implementadas

1. **Diseño Visual de Alta Gama & Móvil-First (PWA)**:
   - Paleta de color premium: Tonos Nude, Champagne, Oro Rosa, Crema y Acentos Carbón.
   - Tipografía refinada: Playfair Display para encabezados y Plus Jakarta Sans para texto legible.
   - PWA instalable en dispositivos móviles y de escritorio.

2. **Motor de Reservas Inteligente**:
   - Selector visual de tratamientos con duraciones e importes.
   - Cálculo automático de turnos disponibles según horarios de apertura, receso de almuerzo y citas previamente ocupadas.
   - Validación anti-solapamiento estricta en base de datos.
   - Formulario de datos con validaciones y honeypot anti-spam.

3. **Confirmación Inmediata por WhatsApp**:
   - Botón flotante accesible en todas las pantallas.
   - Generación de enlace directo con mensaje pre-estructurado que incluye nombre, servicio, fecha, hora y número de referencia.
   - Botón directo para añadir la cita a Google Calendar.

4. **Sistema de Reseñas & Código QR**:
   - Formulario público de calificación (1 a 5 estrellas) y testimonios.
   - Panel de moderación administrativo (Aprobar, Ocultar o Eliminar).
   - Generador y descargador de Código QR en alta resolución listo para imprimir en el mostrador del estudio.

5. **Panel Administrativo Completo**:
   - Dashboard con métricas clave (citas de hoy, citas pendientes, ingresos estimados).
   - Agenda visual diaria y semanal.
   - Tabla general de citas con buscador por clienta/teléfono, filtros de estado y exportación a CSV.
   - Gestión integral del catálogo de servicios (crear, editar, activar/desactivar, destacar).
   - Horarios comerciales semanales y bloqueo de fechas festivas o vacaciones.
   - Configuración de datos de contacto, WhatsApp y redes sociales.
   - Perfil administrativo con cambio de contraseña.

---

## 🚀 2. Conexión con Supabase

La aplicación cuenta con un modo de demostración automático con persistencia local si las variables de Supabase aún no han sido configuradas. Para conectar tu base de datos en producción:

1. Crea un proyecto en [Supabase.com](https://supabase.com).
2. Dirígete a **SQL Editor** en Supabase.
3. Abre el archivo `supabase/schema.sql` de este proyecto, copia todo su contenido y ejecútalo (Run) en Supabase. Esto creará:
   - Tablas `profiles`, `service_categories`, `services`, `bookings`, `business_hours`, `special_closed_dates`, `reviews`, `business_settings`.
   - Políticas de seguridad (Row Level Security - RLS).
   - Datos iniciales (servicios, categorías, horarios estándar).
4. Crea tu usuario administrador en **Authentication > Users** en Supabase con tu correo y contraseña.
5. Copia tu `Project URL` y `anon public key` desde **Project Settings > API**.
6. Agrega estas variables a tu archivo `.env` o en el panel de Netlify:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-publica
   ```

---

## 📦 3. Despliegue en Netlify

El proyecto ya incluye el archivo `netlify.toml` con las reglas de redirección SPA (`/* -> /index.html 200`) y compresión de activos:

1. Conecta tu repositorio de GitHub en Netlify.
2. Configuración de Build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. En **Site configuration > Environment variables**, añade:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. ¡Listo! Tu sitio estará activo con certificado SSL automático y carga ultra rápida.

---

## 📱 4. Instalación como Aplicación Móvil (PWA)

- **En iPhone / iPad (Safari)**:
  1. Abre el enlace de tu web.
  2. Pulsa el botón **Compartir** (icono cuadrado con flecha hacia arriba).
  3. Selecciona **"Añadir a pantalla de inicio"**.
- **En Android (Chrome)**:
  1. Abre el enlace de tu web.
  2. Pulsa en el aviso inferior **"Instalar aplicación"** o en el menú de 3 puntos selecciona **"Instalar aplicación"**.
