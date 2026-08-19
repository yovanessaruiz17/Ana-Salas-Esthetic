# Guía de Configuración de Supabase - Ana María Salas Studio

Este documento describe los pasos para inicializar tu proyecto en Supabase y vincularlo con la aplicación web / PWA.

---

## 1. Crear Proyecto en Supabase
1. Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión.
2. Haz clic en **New Project**.
3. Asigna un nombre (ej. `ana-salas-studio`) y una contraseña segura para la base de datos.
4. Selecciona la región más cercana a tus clientes (ej. `sa-east-1` o `us-east-1`).

---

## 2. Ejecutar el Script de Base de Datos
1. En el panel izquierdo de Supabase, ve a **SQL Editor**.
2. Haz clic en **New query**.
3. Copia y pega todo el contenido de `supabase/schema.sql` y presiona **Run**.
4. *(Opcional)* Para insertar datos de prueba iniciales claramente identificados como DEMO, abre otra consulta, pega `supabase/seed.sql` y presiona **Run**.

---

## 3. Crear Buckets de Supabase Storage
En el panel izquierdo, ve a **Storage** > **New bucket** y crea los siguientes buckets públicos:

1. **`branding`**: Para el logo, favicon y fotos de cabecera.
   - Public bucket: **Activado (Checked)**
2. **`services`**: Para las fotografías de cada servicio y categoría.
   - Public bucket: **Activado (Checked)**
3. **`gallery`**: Para las fotografías de la galería de trabajos.
   - Public bucket: **Activado (Checked)**

### Políticas de Storage (Storage RLS)
- **Lectura pública (SELECT)**: Permitida para todos (`anon`, `authenticated`).
- **Subida y eliminación (INSERT, UPDATE, DELETE)**: Permitida únicamente para usuarios autenticados (`authenticated`).

---

## 4. Crear el Primer Usuario Administrador
1. Ve a **Authentication** > **Users** > **Add user** > **Create user**.
2. Ingresa el correo de la administradora (ej. `admin@anamariasalas.com`) y una contraseña segura.
3. Luego, en **SQL Editor**, vincula el perfil como administrador ejecutando:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'ID_DEL_USUARIO_CREADO_EN_AUTH',
  'admin@anamariasalas.com',
  'Ana María Salas',
  'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## 5. Configurar Variables de Entorno en el Proyecto
En el panel de Supabase ve a **Project Settings** > **API**:
- Copia la **Project URL**.
- Copia la **Project API key (anon / public)**.

En tu archivo local `.env` o en las variables de entorno de Netlify:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SITE_URL=https://tu-dominio.netlify.app
```
